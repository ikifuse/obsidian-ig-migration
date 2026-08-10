import { App, ItemView, Modal, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, parseYaml } from "obsidian";
import {
  カード種類表示名 as KIND_LABEL,
  type カード as Card,
  type カード種類 as CardKind
} from "../01_データ構造/カード";
import { 空の手書き情報 as emptyHandwritten, type 手書き情報 } from "../01_データ構造/手書き情報";
import type { 融合グループ } from "../01_データ構造/融合グループ";
import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 融合状態, カテゴリ別代表 } from "../01_データ構造/融合グループ";
import { ブラウザー操作履歴 as SessionHistory } from "../02_操作処理/元に戻す";
import { カードを分離する as splitCard, 融合をすべて解体する as dissolveGroup } from "../02_操作処理/分離";
import { カテゴリ代表を変更する as changeRepresentative, 関係管理カードを変更する as changeManager } from "../02_操作処理/関係管理・代表変更";
import { 手書き情報を保存する as saveHandwritten } from "../02_操作処理/手書き保存";
import { グループの全カードID as groupCardIds } from "../02_操作処理/状態参照";
import { 状態を検証する as validateState } from "../02_操作処理/状態検証";
import { カードの実効表示名 as effectiveDisplayName, 実効値を選ぶ as effectiveValue } from "../02_操作処理/実効表示";
import {
  カテゴリ別代表を推奨する as recommendRepresentatives,
  カードを融合する as mergeCards,
  関係管理カードを推奨する as recommendManager
} from "../02_操作処理/融合";
import {
  Synapsesを読み取る as scanSynapses,
  type Obsidian読取結果,
  type 検査問題
} from "../03_データ入出力/Obsidian_Vaultデータ";
import { Wikiリンクを分解する as parseWikiLink } from "../03_データ入出力/Wikiリンク解決";
import { エラー内容を文字列にする } from "../05_共通処理/エラー";
import { 対象ルートを整理する as normalizeRoot } from "../05_共通処理/入力値整理";
import { プラグイン設定初期値, 読み取り専用画面ID } from "../05_共通処理/設定";
import { カードリンク候補か, 参照先カードを探す } from "./カード連動";
import {
  現在地を説明する,
  表示一覧を作る,
  type 一覧状態絞り込み
} from "./画面表示モデル";

const VIEW_TYPE = 読み取り専用画面ID;
const SIDEBAR_VIEW_TYPE = `${VIEW_TYPE}-sidebar`;
type 表示面 = "workbench" | "sidebar";

interface PrototypeSettings {
  targetRoot: string;
}

const DEFAULT_SETTINGS: PrototypeSettings = プラグイン設定初期値;

export default class MemorySynapseDbPrototype extends Plugin {
  settings: PrototypeSettings = DEFAULT_SETTINGS;
  private refreshTimer: number | null = null;

  async onload(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData() as Partial<PrototypeSettings> | null) };
    this.registerView(VIEW_TYPE, (leaf) => new MemorySynapseView(leaf, this, "workbench"));
    this.registerView(SIDEBAR_VIEW_TYPE, (leaf) => new MemorySynapseView(leaf, this, "sidebar"));
    this.addRibbonIcon("network", "Memory Synapse DB", () => void this.activateView());
    this.addCommand({
      id: "open-readonly-prototype",
      name: "読み取り専用の技術検証版を開く",
      callback: () => void this.activateView()
    });
    this.addSettingTab(new MemorySynapseSettingTab(this));

    const schedule = (path: string) => this.scheduleRefresh(path);
    this.registerEvent(this.app.vault.on("create", (file) => schedule(file.path)));
    this.registerEvent(this.app.vault.on("modify", (file) => schedule(file.path)));
    this.registerEvent(this.app.vault.on("delete", (file) => schedule(file.path)));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      schedule(oldPath);
      schedule(file.path);
    }));
    this.register(() => {
      if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    });

    // SystemLogsはObsidian標準のタスク表示を維持し、追加のチェックボックスを生成しない。
    this.registerMarkdownPostProcessor((element, context) => {
      if (/(^|\/)SystemLogs\//.test(context.sourcePath)) element.addClass("msdb-system-log-tree");
    });

    // 投稿本文、末尾Wikiリンク、SystemLogs内カードリンクを右サイドバーへ連動する。
    this.registerDomEvent(document, "click", (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const standardLink = target.closest("a.internal-link, a.tag");
      const livePreviewLink = target.closest(
        ".markdown-source-view.is-live-preview .cm-hmd-internal-link, "
        + ".markdown-source-view.is-live-preview .cm-hashtag"
      );
      const link = standardLink ?? livePreviewLink;
      if (!(link instanceof HTMLElement)) return;
      const reference = standardLink
        ? link.getAttribute("data-href") ?? link.getAttribute("href") ?? link.textContent ?? ""
        : link.textContent ?? "";
      const sourcePath = this.app.workspace.getActiveFile()?.path ?? "";
      const isTagLink = link.matches("a.tag, .cm-hashtag");
      if (!カードリンク候補か(reference, link.textContent ?? "", sourcePath, isTagLink)) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      void this.selectCardInSidebar(reference);
    }, { capture: true });
  }

  async selectCardInSidebar(cardIdOrWiki: string): Promise<void> {
    let leaf = this.app.workspace.getLeavesOfType(SIDEBAR_VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getRightLeaf(false) ?? undefined;
      if (!leaf) {
        new Notice("Memory Synapse DBの右サイドバーを開けませんでした。");
        return;
      }
      await leaf.setViewState({ type: SIDEBAR_VIEW_TYPE, active: true });
    }
    await this.app.workspace.revealLeaf(leaf);
    if (leaf.view instanceof MemorySynapseView) leaf.view.selectCard(cardIdOrWiki);
  }

  async activateView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    const leaf = existing ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    await this.refreshViews();
  }

  private scheduleRefresh(path: string): void {
    const root = normalizeRoot(this.settings.targetRoot);
    if (!path.toLowerCase().endsWith(".md") || !(path === root || path.startsWith(`${root}/`))) return;
    if (this.refreshTimer !== null) window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => {
      this.refreshTimer = null;
      void this.refreshViews();
    }, 100);
  }

  private async refreshViews(): Promise<void> {
    const leaves = [
      ...this.app.workspace.getLeavesOfType(VIEW_TYPE),
      ...this.app.workspace.getLeavesOfType(SIDEBAR_VIEW_TYPE)
    ];
    for (const leaf of leaves) {
      const view = leaf.view;
      if (view instanceof MemorySynapseView) await view.refresh();
    }
  }
}

class MemorySynapseView extends ItemView {
  private readResult: Obsidian読取結果 | null = null;
  private sessionState: 融合状態 | null = null;
  private readonly history = new SessionHistory();
  private notice = "Vaultから読み取った初期状態です。";
  private search = "";
  private kindFilter: CardKind | "all" = "all";
  private statusFilter: 一覧状態絞り込み = "all";
  private handwrittenOnly = false;
  private selectedCardId: string | null = null;

  constructor(
    leaf: WorkspaceLeaf,
    private readonly plugin: MemorySynapseDbPrototype,
    private readonly surface: 表示面
  ) {
    super(leaf);
  }

  getViewType(): string { return this.surface === "sidebar" ? SIDEBAR_VIEW_TYPE : VIEW_TYPE; }
  getDisplayText(): string { return this.surface === "sidebar" ? "Memory Synapse" : "Memory Synapse DB"; }
  getIcon(): string { return "network"; }

  selectCard(cardIdOrWiki: string): void {
    if (!this.sessionState) return;
    const target = 参照先カードを探す(this.sessionState.cards, cardIdOrWiki);
    if (target) {
      this.selectedCardId = target.id;
      if (this.surface === "workbench") this.search = target.name;
      this.notice = `選択カード: ${target.name}`;
      this.rerender();
    } else {
      this.notice = `対応するSynapseカードが見つかりません: ${cardIdOrWiki}`;
      this.rerender();
    }
  }

  async onOpen(): Promise<void> { await this.refresh(); }

  async onClose(): Promise<void> {
    this.contentEl.empty();
    this.readResult = null;
    this.sessionState = null;
    this.history.初期化する();
    this.selectedCardId = null;
  }

  async refresh(): Promise<void> {
    const root = normalizeRoot(this.plugin.settings.targetRoot);
    this.contentEl.empty();
    
    const loading = this.contentEl.createDiv({ cls: "msdb-loading", text: "MarkdownとWikiリンクを計測しています…" });
    try {
      const result = await scanSynapses(this.app, root, parseYaml);
      loading.remove();
      this.readResult = result;
      this.sessionState = 画面操作状態を作る(result);
      this.history.初期化する();
      this.notice = "Vaultから読み取った初期状態です。";
      this.renderResult(root, result);
    } catch (error) {
      loading.setText("計測に失敗しました。Vaultは変更していません。");
      loading.addClass("msdb-error");
      new Notice(`Memory Synapse DB: ${エラー内容を文字列にする(error)}`);
    }
  }

  private renderResult(root: string, result: Obsidian読取結果): void {
    const session = this.sessionState ?? 画面操作状態を作る(result);
    const view = this.contentEl.createDiv({ cls: "memory-synapse-prototype" });
    const header = view.createDiv({ cls: "msdb-header" });
    const heading = header.createDiv();
    heading.createEl("h2", { text: "Memory Synapse DB" });
    heading.createEl("p", { text: "読み取り専用の技術検証版" });
    const reload = header.createEl("button", { text: "再読込", cls: "mod-cta" });
    reload.addEventListener("click", () => void this.refresh());
    const sessionActions = header.createDiv({ cls: "msdb-session-actions" });
    const undo = sessionActions.createEl("button", { text: "元に戻す" });
    undo.disabled = this.history.件数() === 0;
    undo.addEventListener("click", () => {
      const previous = this.history.直前へ戻す();
      if (!previous) return;
      this.sessionState = previous;
      this.notice = "直前の非永続操作を取り消しました。";
      this.rerender();
    });
    const reset = sessionActions.createEl("button", { text: "初期状態へ戻す" });
    reset.addEventListener("click", () => void this.refresh());

    const warning = view.createDiv({ cls: "msdb-warning" });
    warning.createEl("strong", { text: "読み取り専用" });
    warning.createDiv({ text: "変更は保存されません。対象Markdownの作成・変更・移動・削除は行いません。" });
    warning.createDiv({ text: "再読込でVaultの状態へ戻ります。" });
    view.createDiv({ cls: "msdb-root", text: `対象ルート: ${root}` });
    view.createDiv({ cls: "msdb-session-notice", text: this.notice });

    if (this.surface === "sidebar") {
      this.renderSelectedSidebar(view, result, session);
      return;
    }

    const metrics = view.createDiv({ cls: "msdb-metrics" });
    metric(metrics, "対象カード", `${result.cards.length}件`, "Tag・Mention・Location");
    metric(metrics, "Wikiリンク", `${result.totalWikiLinks}件`, "対象カード内の合計");
    metric(metrics, "読取時間", `${result.elapsedMs.toFixed(1)} ms`, "cachedReadによる計測");
    metric(
      metrics,
      "JSヒープ概算",
      result.approximateHeapMb === undefined ? "取得不可" : `${result.approximateHeapMb.toFixed(1)} MB`,
      "取得できる環境だけ表示"
    );

    const types = view.createDiv({ cls: "msdb-types" });
    for (const kind of ["tag", "mention", "location"] as CardKind[]) {
      const item = types.createDiv({ cls: `msdb-type msdb-${kind}` });
      item.createSpan({ text: KIND_LABEL[kind] });
      item.createEl("strong", { text: `${result.counts[kind]}件` });
    }

    this.renderProblems(view, result, session);

    const listHead = view.createDiv({ cls: "msdb-list-head" });
    listHead.createEl("h3", { text: this.statusFilter === "merged" ? "融合済みの個別カード" : "リンク一覧" });
    const displayList = 表示一覧を作る(session, {
      kind: this.kindFilter,
      status: this.statusFilter,
      handwrittenOnly: this.handwrittenOnly,
      search: this.search
    });
    listHead.createSpan({ text: `全${displayList.total}件中 ${displayList.items.length}件を表示` });
    this.renderFilters(view);
    const list = view.createDiv({ cls: "msdb-card-list" });
    if (displayList.items.length === 0) {
      list.createDiv({ cls: "msdb-empty", text: "条件に一致する知識単位がありません。" });
      return;
    }

    for (const item of displayList.items) {
      if (item.type === "group" && item.managerId) {
        const group = session.groups[item.managerId];
        if (group) this.renderGroupListCard(list, group, result, session);
        continue;
      }
      const cardId = item.cardIds[0];
      const card = cardId ? session.cards[cardId] : undefined;
      if (card) this.renderIndividualListCard(list, card, result, session, item.managerId);
    }
  }

  private renderIndividualListCard(
    parent: HTMLElement,
    card: Card,
    result: Obsidian読取結果,
    session: 融合状態,
    managerId?: string
  ): void {
    const fileCard = result.cardsById[card.id];
    if (!fileCard) return;
    const block = parent.createDiv({ cls: "msdb-card-block msdb-grid-card" });
    this.enableGridDragAndDrop(block, card.id);
    const row = block.createDiv({ cls: "msdb-card" });
    const select = row.createEl("button", {
      cls: "msdb-card-link",
      text: effectiveDisplayName(card).value,
      attr: { title: `${fileCard.basename}.mdを右サイドバーで確認` }
    });
    select.addEventListener("click", () => this.selectGridCard(block, card.id));
    row.createSpan({ cls: `msdb-kind msdb-${card.kind}`, text: KIND_LABEL[card.kind] });
    const meta = block.createDiv({ cls: "msdb-grid-meta" });
    meta.createSpan({ text: managerId ? "融合済み" : "単独" });
    meta.createSpan({ text: `関連投稿 ${card.relatedPosts.length}件` });
    if (card.handwritten) meta.createSpan({ text: "手書きあり" });
  }

  private renderGroupListCard(
    parent: HTMLElement,
    group: 融合グループ,
    result: Obsidian読取結果,
    session: 融合状態
  ): void {
    const manager = session.cards[group.managerId];
    const fileCard = result.cardsById[group.managerId];
    if (!manager || !fileCard) return;
    const memberIds = groupCardIds(group);
    const block = parent.createDiv({ cls: "msdb-card-block msdb-grid-card" });
    this.enableGridDragAndDrop(block, group.managerId);
    const row = block.createDiv({ cls: "msdb-card" });
    const select = row.createEl("button", {
      cls: "msdb-card-link",
      text: `${effectiveDisplayName(manager).value}（融合${memberIds.length}枚）`,
      attr: { title: `${fileCard.basename}.mdを右サイドバーで確認` }
    });
    select.addEventListener("click", () => this.selectGridCard(block, group.managerId));
    row.createSpan({ cls: `msdb-kind msdb-${manager.kind}`, text: KIND_LABEL[manager.kind] });
    const relatedPosts = new Set(memberIds.flatMap((id) => session.cards[id]?.relatedPosts ?? []));
    const meta = block.createDiv({ cls: "msdb-grid-meta" });
    meta.createSpan({ text: "関係管理カード" });
    meta.createSpan({ text: `関連投稿 ${relatedPosts.size}件` });
    if (memberIds.some((id) => Boolean(session.cards[id]?.handwritten))) {
      meta.createSpan({ text: "手書きあり" });
    }
  }

  private enableGridDragAndDrop(block: HTMLElement, cardId: string): void {
    block.draggable = true;
    block.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/x-memory-synapse-card", cardId);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
    });
    block.addEventListener("dragover", (event) => {
      if (!event.dataTransfer?.types.includes("text/x-memory-synapse-card")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      block.addClass("msdb-drop-target");
    });
    block.addEventListener("dragleave", () => block.removeClass("msdb-drop-target"));
    block.addEventListener("drop", (event) => {
      block.removeClass("msdb-drop-target");
      const sourceId = event.dataTransfer?.getData("text/x-memory-synapse-card");
      if (!sourceId || sourceId === cardId) return;
      event.preventDefault();
      this.openMerge(sourceId, cardId);
    });
  }

  private selectGridCard(block: HTMLElement, cardId: string): void {
    this.selectedCardId = cardId;
    block.parentElement?.querySelectorAll(".msdb-grid-card.is-selected")
      .forEach((item) => item.removeClass("is-selected"));
    block.addClass("is-selected");
    void this.plugin.selectCardInSidebar(cardId);
  }

  private renderSelectedSidebar(parent: HTMLElement, result: Obsidian読取結果, session: 融合状態): void {
    const selectedId = this.selectedCardId;
    if (!selectedId) {
      parent.createDiv({
        cls: "msdb-empty",
        text: "投稿本文、プロパティまたは写真下のタグ・メンション・位置情報を選択すると、対応するカードをここに表示します。"
      });
      return;
    }
    const selected = session.cards[selectedId];
    if (!selected) {
      parent.createDiv({ cls: "msdb-empty", text: "選択したカードが見つかりません。" });
      return;
    }
    const group = Object.values(session.groups).find((item) => groupCardIds(item).includes(selectedId));
    const heading = parent.createDiv({ cls: "msdb-list-head" });
    heading.createEl("h3", { text: "選択中カード" });
    heading.createSpan({ text: selected.name });
    parent.createDiv({ cls: "msdb-current-location", text: 現在地を説明する(session, selectedId) });
    if (group) {
      this.renderGroup(parent, group, result, session, selectedId);
      return;
    }
    const block = parent.createDiv({ cls: "msdb-card-block msdb-sidebar-card" });
    const row = block.createDiv({ cls: "msdb-card" });
    const fileCard = result.cardsById[selected.id];
    const open = row.createEl("button", { cls: "msdb-card-link", text: `${fileCard?.basename ?? selected.name}.md` });
    if (fileCard) open.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(fileCard.file));
    row.createSpan({ cls: `msdb-kind msdb-${selected.kind}`, text: KIND_LABEL[selected.kind] });
    this.renderEffectiveFields(block, selected);
    const actions = block.createDiv({ cls: "msdb-card-actions" });
    actions.createEl("button", { text: "手書き" }).addEventListener("click", () => this.openHandwritten(selected.id));
    if (fileCard) this.renderRelatedPosts(block, selected, fileCard.path);
    const details = block.createEl("details", { cls: "msdb-individual-details" });
    details.createEl("summary", { text: "元情報と保存済み手書き情報を見る" });
    this.renderIndividualCard(details, selected);
  }

  private renderGroup(
    parent: HTMLElement,
    group: 融合グループ,
    result: Obsidian読取結果,
    session: 融合状態,
    selectedId?: string
  ): void {
    const block = parent.createDiv({ cls: "msdb-group" });
    const header = block.createDiv({ cls: "msdb-group-header" });
    header.createEl("strong", {
      text: session.cards[group.managerId]?.name ?? group.managerId
    });
    header.createSpan({ text: `関係管理カード・全${groupCardIds(group).length}枚` });
    const actions = header.createDiv({ cls: "msdb-card-actions" });
    const change = actions.createEl("button", { text: "関係管理を変更" });
    change.addEventListener("click", () => this.openManagerChange(group.managerId));
    const dissolve = actions.createEl("button", { text: "融合を解体" });
    dissolve.addEventListener("click", () => {
      this.previewOperation("融合をすべて解体", dissolveGroup(session, group.managerId));
    });

    for (const kind of ["mention", "location", "tag"] as CardKind[]) {
      const representativeId = group.representatives[kind];
      const sameKind = groupCardIds(group).filter((id) => session.cards[id]?.kind === kind);
      if (sameKind.length === 0) continue;
      if (!representativeId) {
        const missing = block.createDiv({ cls: `msdb-representative msdb-${kind} msdb-missing-representative` });
        missing.createEl("strong", { text: `${KIND_LABEL[kind]}の代表を選択してください` });
        const select = missing.createEl("button", { text: "代表を選択" });
        select.addEventListener("click", () => this.openRepresentativeChange(group.managerId, kind));
        continue;
      }
      const representative = session.cards[representativeId];
      if (!representative) continue;
      const category = block.createDiv({ cls: `msdb-representative msdb-${kind}` });
      const categoryHead = category.createDiv({ cls: "msdb-representative-header" });
      categoryHead.createSpan({ cls: `msdb-kind msdb-${kind}`, text: KIND_LABEL[kind] });
      categoryHead.createEl("strong", { text: effectiveDisplayName(representative).value });
      categoryHead.createSpan({ text: `${sameKind.length}枚中の代表` });
      if (sameKind.length > 1) {
        const changeRepresentativeButton = categoryHead.createEl("button", { text: "代表を変更" });
        changeRepresentativeButton.addEventListener("click", () => this.openRepresentativeChange(group.managerId, kind));
      }
      this.renderEffectiveFields(category, representative);
      const others = category.createEl("button", {
        cls: "msdb-related-post",
        text: `他のカードを見る（${Math.max(0, sameKind.length - 1)}枚）`
      });
      others.addEventListener("click", () => {
        const target = block.querySelector<HTMLElement>(`[data-receptacle-kind="${kind}"]`);
        target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        target?.focus();
      });
    }

    const receptacle = block.createDiv({ cls: "msdb-receptacle" });
    receptacle.createEl("h4", { text: "受け皿 — 全個別カード" });
    for (const id of groupCardIds(group)) {
      const card = session.cards[id];
      const fileCard = result.cardsById[id];
      if (!card || !fileCard) continue;
      const item = receptacle.createDiv({ cls: "msdb-receptacle-card", attr: { tabindex: "-1" } });
      item.dataset.receptacleKind = card.kind;
      if (id === selectedId) item.addClass("is-selected");
      const itemHeader = item.createDiv({ cls: "msdb-card" });
      const open = itemHeader.createEl("button", { cls: "msdb-card-link", text: `${fileCard.basename}.md` });
      open.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(fileCard.file));
      itemHeader.createSpan({ cls: `msdb-kind msdb-${card.kind}`, text: KIND_LABEL[card.kind] });
      if (id === group.managerId) itemHeader.createSpan({ cls: "msdb-link-count", text: "関係管理カード" });
      const representativeKinds = (["mention", "location", "tag"] as CardKind[])
        .filter((kind) => group.representatives[kind] === id)
        .map((kind) => `${KIND_LABEL[kind]}代表`);
      if (representativeKinds.length > 0) {
        itemHeader.createSpan({ cls: "msdb-link-count", text: representativeKinds.join("・") });
      }
      this.renderEffectiveFields(item, card);
      this.renderIndividualCard(item, card);
      this.renderRelatedPosts(item, card, fileCard.path);
      const itemActions = item.createDiv({ cls: "msdb-card-actions" });
      itemActions.createEl("button", { text: "手書き" })
        .addEventListener("click", () => this.openHandwritten(id));
      itemActions.createEl("button", { text: "このカードを分離" })
        .addEventListener("click", () => this.openSplit(group.managerId, id));
    }
  }

  private renderFieldValue(parent: HTMLElement, value: string): void {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const lines = value.split("\n");
    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) parent.createEl("br");
      const parts = line.split(urlRegex);
      parts.forEach((part) => {
        if (/^https?:\/\//.test(part)) {
          const a = parent.createEl("a", { text: part, href: part, cls: "external-link" });
          a.setAttribute("target", "_blank");
          a.setAttribute("rel", "noopener noreferrer");
        } else if (part) {
          parent.createSpan({ text: part });
        }
      });
    });
  }

  private renderEffectiveFields(parent: HTMLElement, card: Card): void {
    const source = sourceFields(card);
    const handwritten = handwrittenFields(card.handwritten);
    for (const [key, label] of categoryFields(card.kind)) {
      const selected = effectiveValue(handwritten[key], source[key]);
      if (!selected) continue;
      const field = parent.createDiv({ cls: "msdb-effective-field" });
      const heading = field.createDiv();
      heading.createSpan({ text: label });
      heading.createEl("small", { text: selected.origin });
      const valDiv = field.createDiv();
      this.renderFieldValue(valDiv, selected.value);
    }
  }

  private renderIndividualCard(parent: HTMLElement, card: Card): void {
    const source = parent.createDiv({ cls: "msdb-preserved-data" });
    source.createEl("strong", { text: "移行時点の情報（保持）" });
    source.createEl("pre", { text: JSON.stringify(card.source, null, 2) });
    if (card.handwritten) {
      const handwritten = parent.createDiv({ cls: "msdb-preserved-data" });
      handwritten.createEl("strong", { text: "手書き情報（個別カードに保持）" });
      handwritten.createEl("pre", { text: JSON.stringify(card.handwritten, null, 2) });
    }
  }

  private renderRelatedPosts(parent: HTMLElement, card: Card, originPath: string): void {
    const related = parent.createDiv({ cls: "msdb-related-posts" });
    related.createSpan({ cls: "msdb-related-label", text: `関連投稿 ${card.relatedPosts.length}件` });
    for (const wikiLink of card.relatedPosts) {
      const parsed = parseWikiLink(wikiLink);
      if (!parsed) continue;
      const post = related.createEl("button", {
        cls: "msdb-related-post",
        text: parsed.displayName ?? parsed.path.split("/").pop() ?? parsed.path
      });
      post.addEventListener("click", () => void this.app.workspace.openLinkText(parsed.path, originPath, false));
    }
  }

  private rerender(): void {
    if (!this.readResult) return;
    this.contentEl.empty();
    this.renderResult(normalizeRoot(this.plugin.settings.targetRoot), this.readResult);
  }

  private applyOperation(result: 操作結果): void {
    if (!result.ok || !this.sessionState) {
      this.notice = result.message;
      new Notice(result.message);
      this.rerender();
      return;
    }
    const before = describeState(this.sessionState);
    this.history.保存する(this.sessionState);
    this.sessionState = result.state;
    this.notice = `${result.message}（画面内だけ）\n変更前: ${before}\n変更後: ${describeState(result.state)}`;
    this.rerender();
  }

  private previewOperation(title: string, result: 操作結果): void {
    if (!this.sessionState || !result.ok) {
      this.applyOperation(result);
      return;
    }
    const before = this.sessionState;
    const changedPaths = changedFilePaths(before, result.state, this.readResult);
    new OperationConfirmModal(
      this.app,
      title,
      before,
      result.state,
      changedPaths,
      () => this.applyOperation(result)
    ).open();
  }

  private renderProblems(parent: HTMLElement, result: Obsidian読取結果, session: 融合状態): void {
    const stateProblems: 検査問題[] = validateState(session).map((message) => {
      const id = message.split(":")[0]?.trim() ?? "";
      const filePath = result.cardsById[id]?.path ?? id;
      const kind = message.includes("多重所属")
        ? "多重所属"
        : message.includes("グループ外") || message.includes("代表") || message.includes("カテゴリ")
          ? "代表"
          : message.includes("リンク先")
            ? "リンク"
            : "解析不能";
      return { kind, filePath, message } as 検査問題;
    });
    const unique = new Map<string, 検査問題>();
    const additionalStateProblems = stateProblems.filter((problem) =>
      !result.problems.some((existing) =>
        existing.kind === problem.kind && existing.filePath === problem.filePath
      )
    );
    for (const problem of [...result.problems, ...additionalStateProblems]) {
      unique.set(`${problem.kind}\n${problem.filePath}\n${problem.message}`, problem);
    }
    const problems = [...unique.values()];
    if (problems.length === 0) return;

    const block = parent.createDiv({ cls: "msdb-problems" });
    block.createEl("h3", { text: "問題検査" });
    block.createEl("p", {
      text: "問題を自動修復しません。対象ファイルを開いて内容を確認できます。",
      cls: "setting-item-description"
    });
    for (const kind of ["解析不能", "リンク", "多重所属", "入れ子", "代表"] as const) {
      const items = problems.filter((problem) => problem.kind === kind);
      if (items.length === 0) continue;
      const section = block.createEl("details");
      section.createEl("summary", { text: `${kind}（${items.length}件）` });
      for (const problem of items) {
        const row = section.createDiv({ cls: "msdb-problem-row" });
        row.createDiv({ text: problem.message });
        const file = this.app.vault.getAbstractFileByPath(problem.filePath);
        const open = row.createEl("button", { text: problem.filePath || "対象不明" });
        open.disabled = !file || !("extension" in file);
        if (!open.disabled) {
          open.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(file as any));
        }
      }
    }
  }

  private renderFilters(parent: HTMLElement): void {
    const filters = parent.createDiv({ cls: "msdb-filters" });
    const search = filters.createEl("input", { type: "search", placeholder: "名前・別名・関連投稿を検索" });
    search.value = this.search;
    search.addEventListener("input", () => {
      this.search = search.value;
      this.rerender();
    });
    const kind = filters.createEl("select");
    addOptions(kind, [
      ["all", "全種類"], ["mention", "Mention"], ["location", "Location"], ["tag", "Tag"]
    ], this.kindFilter);
    kind.addEventListener("change", () => {
      this.kindFilter = kind.value as typeof this.kindFilter;
      this.rerender();
    });
    const status = filters.createEl("select");
    addOptions(status, [
      ["all", "全状態"], ["single", "単独"], ["manager", "関係管理カード"], ["merged", "融合済み"]
    ], this.statusFilter);
    status.addEventListener("change", () => {
      this.statusFilter = status.value as typeof this.statusFilter;
      this.rerender();
    });
    const label = filters.createEl("label");
    const handwritten = label.createEl("input", { type: "checkbox" });
    handwritten.checked = this.handwrittenOnly;
    handwritten.addEventListener("change", () => {
      this.handwrittenOnly = handwritten.checked;
      this.rerender();
    });
    label.appendText("手書きあり");
    const reset = filters.createEl("button", { text: "絞り込み解除" });
    reset.addEventListener("click", () => {
      this.search = "";
      this.kindFilter = "all";
      this.statusFilter = "all";
      this.handwrittenOnly = false;
      this.rerender();
    });
  }

  private openMerge(sourceId: string, fixedReceiverId?: string): void {
    const state = this.sessionState;
    if (!state) return;
    const proceed = (receiverId: string) => {
      if (!receiverId) return;
      this.openMergeConfirmation(state, sourceId, receiverId);
    };
    if (fixedReceiverId) {
      proceed(fixedReceiverId);
      return;
    }
    const targets = Object.values(state.cards)
      .filter((card) => card.id !== sourceId)
      .map((card) => ({ value: card.id, label: `${KIND_LABEL[card.kind]} ${card.name}` }));
    new ChoiceModal(this.app, "融合先を選択", [
      { key: "receiver", label: "受け入れるカード", options: targets, initial: targets[0]?.value ?? "" }
    ], (choice) => {
      proceed(choice.receiver ?? "");
    }).open();
  }

  private openMergeConfirmation(state: 融合状態, sourceId: string, receiverId: string): void {
      const managerRecommendation = recommendManager(state, sourceId, receiverId);
      const representativeRecommendation = recommendRepresentatives(
        state,
        managerRecommendation.candidateIds,
        receiverId
      );
      const fields: ChoiceField[] = [{
        key: "manager",
        label: "関係管理カード",
        options: managerRecommendation.candidateIds.map((id) => ({
          value: id,
          label: `${state.cards[id]?.name ?? id}${managerRecommendation.recommendedIds.includes(id) ? "（推奨）" : ""}`
        })),
        initial: managerRecommendation.recommendedIds.length === 1 ? managerRecommendation.recommendedIds[0]! : "",
        required: true
      }];
      for (const kind of ["mention", "location", "tag"] as CardKind[]) {
        const candidates = managerRecommendation.candidateIds.filter((id) => state.cards[id]?.kind === kind);
        if (candidates.length === 0) continue;
        fields.push({
          key: `representative-${kind}`,
          label: `${KIND_LABEL[kind]}の代表`,
          options: candidates.map((id) => ({ value: id, label: state.cards[id]?.name ?? id })),
          initial: representativeRecommendation.unresolvedKinds.includes(kind)
            ? ""
            : representativeRecommendation.representatives[kind] ?? candidates[0] ?? "",
          required: true,
          requiresConfirmation: representativeRecommendation.confirmationRequiredKinds.includes(kind)
        });
      }
      new ChoiceModal(this.app, "融合内容を確認", fields, (selected) => {
        const representatives: カテゴリ別代表 = {};
        for (const kind of ["mention", "location", "tag"] as CardKind[]) {
          const value = selected[`representative-${kind}`];
          if (value) representatives[kind] = value;
        }
        if (!selected.manager) return;
        this.previewOperation(
          "融合関係を確認",
          mergeCards(state, sourceId, receiverId, selected.manager, representatives)
        );
      }, managerRecommendation.reason).open();
  }

  private openManagerChange(managerId: string): void {
    const state = this.sessionState;
    const group = state?.groups[managerId];
    if (!state || !group) return;
    new ChoiceModal(this.app, "関係管理カードを変更", [{
      key: "manager",
      label: "次の関係管理カード",
      options: groupCardIds(group).map((id) => ({ value: id, label: state.cards[id]?.name ?? id })),
      initial: managerId
    }], (selected) => {
      if (selected.manager) {
        this.previewOperation("関係管理カードを変更", changeManager(state, managerId, selected.manager));
      }
    }).open();
  }

  private openRepresentativeChange(managerId: string, kind: CardKind): void {
    const state = this.sessionState;
    const group = state?.groups[managerId];
    if (!state || !group) return;
    const ids = groupCardIds(group).filter((id) => state.cards[id]?.kind === kind);
    new ChoiceModal(this.app, `${KIND_LABEL[kind]}の代表を変更`, [{
      key: "representative",
      label: "次の代表",
      options: ids.map((id) => ({ value: id, label: state.cards[id]?.name ?? id })),
      initial: group.representatives[kind] ?? ids[0] ?? ""
    }], (selected) => {
      if (selected.representative) {
        this.previewOperation(
          `${KIND_LABEL[kind]}の代表を変更`,
          changeRepresentative(state, managerId, kind, selected.representative)
        );
      }
    }).open();
  }

  private openSplit(managerId: string, splitId: string): void {
    const state = this.sessionState;
    const group = state?.groups[managerId];
    if (!state || !group) return;
    const remaining = groupCardIds(group).filter((id) => id !== splitId);
    if (remaining.length < 2) {
      this.previewOperation("このカードを分離", splitCard(state, managerId, splitId));
      return;
    }
    const fields: ChoiceField[] = [];
    if (splitId === managerId) {
      fields.push({
        key: "manager",
        label: "次の関係管理カード",
        options: remaining.map((id) => ({ value: id, label: state.cards[id]?.name ?? id })),
        initial: remaining[0] ?? ""
      });
    }
    for (const kind of ["mention", "location", "tag"] as CardKind[]) {
      const candidates = remaining.filter((id) => state.cards[id]?.kind === kind);
      if (candidates.length > 1 && group.representatives[kind] === splitId) {
        fields.push({
          key: `representative-${kind}`,
          label: `${KIND_LABEL[kind]}の次の代表`,
          options: candidates.map((id) => ({ value: id, label: state.cards[id]?.name ?? id })),
          initial: "",
          required: true
        });
      }
    }
    const apply = (selected: Record<string, string>) => {
      const representatives: カテゴリ別代表 = {};
      for (const kind of ["mention", "location", "tag"] as CardKind[]) {
        const value = selected[`representative-${kind}`];
        if (value) representatives[kind] = value;
      }
      this.previewOperation(
        "このカードを分離",
        splitCard(state, managerId, splitId, selected.manager, representatives)
      );
    };
    if (fields.length === 0) {
      apply({});
      return;
    }
    new ChoiceModal(this.app, "分離後の状態を確認", fields, apply).open();
  }

  private openHandwritten(cardId: string): void {
    const state = this.sessionState;
    const card = state?.cards[cardId];
    if (!state || !card) return;
    new HandwrittenModal(this.app, card, (note) => {
      this.previewOperation("手書き情報を保存", saveHandwritten(state, cardId, note));
    }).open();
  }
}

function sourceFields(card: Card): Record<string, unknown> {
  if (card.kind === "tag") {
    return {
      displayName: card.source.hashtag_note.hashtag,
      originalTag: card.source.hashtag_note.hashtag,
      note: card.source.hashtag_note.note
    };
  }
  if (card.kind === "mention") {
    return {
      displayName: card.source.mention_note.mention,
      originalMention: card.source.mention_note.mention,
      name: card.source.mention_note.name,
      phone: card.source.mention_note.phone,
      web: card.source.mention_note.web,
      note: card.source.mention_note.note
    };
  }
  return {
    displayName: card.source.location_note.location,
    originalLocation: card.source.location_note.location,
    lat: card.source.geo.lat,
    lng: card.source.geo.lng,
    alt: card.source.geo.alt,
    full: card.source.address.full,
    country: card.source.address.components.country,
    prefecture: card.source.address.components.prefecture,
    city: card.source.address.components.city,
    district: card.source.address.components.district,
    street: card.source.address.components.street,
    postalCode: card.source.address.components.postal_code,
    activityId: card.source.activity_id,
    sourceFiles: card.source.source_files,
    note: card.source.note
  };
}

function handwrittenFields(note?: 手書き情報): Record<string, unknown> {
  if (!note) return {};
  return {
    displayName: note.displayName,
    aliases: note.aliases,
    name: note.name,
    phone: note.phone,
    web: note.web,
    lat: note.geo.lat,
    lng: note.geo.lng,
    alt: note.geo.alt,
    full: note.address.full,
    country: note.address.country,
    prefecture: note.address.prefecture,
    city: note.address.city,
    district: note.address.district,
    street: note.address.street,
    postalCode: note.address.postalCode,
    note: note.note
  };
}

function 画面操作状態を作る(result: Obsidian読取結果): 融合状態 {
  const cards: Record<string, Card> = {};
  for (const item of result.cards) {
    const { file: _file, path: _path, basename: _basename, wikiLinkCount: _wikiLinkCount, ...card } = item;
    cards[card.id] = card as Card;
  }
  return { cards, groups: structuredClone(result.groups) };
}

function categoryFields(kind: CardKind): Array<[string, string]> {
  if (kind === "tag") {
    return [["displayName", "表示名"], ["originalTag", "元表記"], ["aliases", "別名"], ["note", "自由メモ"]];
  }
  if (kind === "mention") {
    return [
      ["displayName", "表示名"], ["originalMention", "元の@文字列"], ["aliases", "別名"], ["name", "名称"],
      ["phone", "電話"], ["web", "Web等"], ["note", "自由メモ"]
    ];
  }
  return [
    ["displayName", "表示名"], ["originalLocation", "元の場所名"], ["aliases", "別名"], ["lat", "緯度"], ["lng", "経度"],
    ["alt", "高度"], ["full", "住所全文"], ["country", "国"], ["prefecture", "都道府県"],
    ["city", "市区町村"], ["district", "地区"], ["street", "番地等"],
    ["postalCode", "郵便番号"], ["activityId", "活動ID"], ["sourceFiles", "元ファイル"], ["note", "人間の記憶"]
  ];
}

type ChoiceField = {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
  initial: string;
  required?: boolean;
  requiresConfirmation?: boolean;
};

class ChoiceModal extends Modal {
  private values: Record<string, string> = {};
  private readonly confirmed = new Set<string>();
  private fields: ChoiceField[];
  private onConfirm: ((values: Record<string, string>) => void) | null;

  constructor(
    app: App,
    private readonly titleText: string,
    fields: ChoiceField[],
    onConfirm: (values: Record<string, string>) => void,
    private readonly description = ""
  ) {
    super(app);
    this.fields = fields;
    this.onConfirm = onConfirm;
    for (const field of fields) this.values[field.key] = field.initial;
  }

  onOpen(): void {
    this.titleEl.setText(this.titleText);
    if (this.description) this.contentEl.createEl("p", { text: this.description, cls: "setting-item-description" });
    for (const field of this.fields) {
      const setting = new Setting(this.contentEl)
        .setName(field.label)
        .addDropdown((dropdown) => {
          if (field.required && !field.initial) dropdown.addOption("", "選択してください");
          for (const option of field.options) dropdown.addOption(option.value, option.label);
          dropdown.setValue(field.initial);
          dropdown.onChange((value) => {
            this.values[field.key] = value;
            updateConfirm();
          });
        });
      if (field.requiresConfirmation) {
        setting.setDesc("同じ種類のカードが複数あります。表示中の代表を人間が確認してください。");
        setting.addToggle((toggle) => toggle
          .setTooltip("この代表を確認しました")
          .onChange((checked) => {
            if (checked) this.confirmed.add(field.key);
            else this.confirmed.delete(field.key);
            updateConfirm();
          }));
      }
    }
    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    const cancel = buttons.createEl("button", { text: "キャンセル" });
    cancel.addEventListener("click", () => this.close());
    const confirm = buttons.createEl("button", { text: "画面内で実行", cls: "mod-cta" });
    const updateConfirm = () => {
      confirm.disabled = this.fields.some((field) =>
        (field.required && !this.values[field.key])
        || (field.requiresConfirmation && !this.confirmed.has(field.key))
      );
    };
    updateConfirm();
    confirm.addEventListener("click", () => {
      if (confirm.disabled) return;
      const onConfirm = this.onConfirm;
      if (!onConfirm) return;
      const values = { ...this.values };
      this.close();
      onConfirm(values);
    });
  }

  onClose(): void {
    this.contentEl.empty();
    this.fields = [];
    this.values = {};
    this.confirmed.clear();
    this.onConfirm = null;
  }
}

class HandwrittenModal extends Modal {
  private card: Card | null;
  private note: 手書き情報;
  private onConfirm: ((note: 手書き情報) => void) | null;

  constructor(
    app: App,
    card: Card,
    onConfirm: (note: 手書き情報) => void
  ) {
    super(app);
    this.card = card;
    this.note = structuredClone(card.handwritten ?? emptyHandwritten);
    this.onConfirm = onConfirm;
  }

  onOpen(): void {
    const card = this.card;
    if (!card) {
      this.close();
      return;
    }
    this.titleEl.setText(`${KIND_LABEL[card.kind]}個別カードの手書き`);
    this.contentEl.createEl("p", {
      text: "元情報は消しません。入力した非空項目だけが表示で優先され、空項目は移行時点の値を使います。",
      cls: "setting-item-description"
    });
    this.text("表示名", this.note.displayName, (value) => { this.note.displayName = value; });
    this.lines("別名（1行1件）", this.note.aliases, (value) => { this.note.aliases = value; });
    if (card.kind === "mention") {
      this.text("名称", this.note.name, (value) => { this.note.name = value; });
      this.lines("電話（1行1件）", this.note.phone, (value) => { this.note.phone = value; });
      this.lines("Web等（1行1件）", this.note.web, (value) => { this.note.web = value; });
    }
    if (card.kind === "location") {
      this.text("緯度", this.note.geo.lat, (value) => { this.note.geo.lat = value; });
      this.text("経度", this.note.geo.lng, (value) => { this.note.geo.lng = value; });
      this.text("高度", this.note.geo.alt, (value) => { this.note.geo.alt = value; });
      this.text("住所全文", this.note.address.full, (value) => { this.note.address.full = value; });
      this.text("国", this.note.address.country, (value) => { this.note.address.country = value; });
      this.text("都道府県", this.note.address.prefecture, (value) => { this.note.address.prefecture = value; });
      this.text("市区町村", this.note.address.city, (value) => { this.note.address.city = value; });
      this.text("地区", this.note.address.district, (value) => { this.note.address.district = value; });
      this.text("番地等", this.note.address.street, (value) => { this.note.address.street = value; });
      this.text("郵便番号", this.note.address.postalCode, (value) => { this.note.address.postalCode = value; });
    }
    this.area("自由メモ", this.note.note, (value) => { this.note.note = value; });
    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    const cancel = buttons.createEl("button", { text: "キャンセル" });
    cancel.addEventListener("click", () => this.close());
    const confirm = buttons.createEl("button", { text: "保存内容を確認" });
    confirm.addEventListener("click", () => {
      const onConfirm = this.onConfirm;
      if (!onConfirm) return;
      const note = structuredClone(this.note);
      this.close();
      onConfirm(note);
    });
  }

  private text(label: string, value: string, set: (value: string) => void): void {
    new Setting(this.contentEl).setName(label).addText((input) => input.setValue(value).onChange(set));
  }

  private lines(label: string, value: string[], set: (value: string[]) => void): void {
    this.area(label, value.join("\n"), (text) => set(text.split(/\r?\n/)));
  }

  private area(label: string, value: string, set: (value: string) => void): void {
    new Setting(this.contentEl).setName(label).addTextArea((input) => input.setValue(value).onChange(set));
  }

  onClose(): void {
    this.contentEl.empty();
    this.card = null;
    this.note = structuredClone(emptyHandwritten);
    this.onConfirm = null;
  }
}

class OperationConfirmModal extends Modal {
  private before: 融合状態 | null;
  private after: 融合状態 | null;
  private changedPaths: string[];
  private onConfirm: (() => void) | null;

  constructor(
    app: App,
    private readonly operationTitle: string,
    before: 融合状態,
    after: 融合状態,
    changedPaths: string[],
    onConfirm: () => void
  ) {
    super(app);
    this.before = before;
    this.after = after;
    this.changedPaths = changedPaths;
    this.onConfirm = onConfirm;
  }

  onOpen(): void {
    const before = this.before;
    const after = this.after;
    if (!before || !after) {
      this.close();
      return;
    }
    this.titleEl.setText(`${this.operationTitle} — 操作前後比較`);
    this.section("現在", comparisonLines(before));
    this.section("操作後", comparisonLines(after));
    const handwritten = handwrittenComparisonLines(before, after);
    if (handwritten.length > 0) this.section("手書き情報の変更", handwritten);
    this.section(
      "変更するファイル",
      this.changedPaths.length > 0 ? this.changedPaths : ["変更対象はありません"]
    );
    this.section("変更しない情報", [
      "個別カードのカテゴリ固有情報",
      "関連投稿",
      "Frontmatter",
      "この操作の対象ではない手書き情報"
    ]);
    this.section("元に戻せるか", ["画面セッション内の「元に戻す」で直前操作を取り消せます。"]);
    this.contentEl.createEl("p", {
      text: "読み取り専用です。変更は保存されません。この06技術検証版では上記ファイルを実際には変更せず、再読込でVaultの状態へ戻ります。",
      cls: "msdb-readonly-confirm"
    });
    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    const cancel = buttons.createEl("button", { text: "キャンセル" });
    cancel.addEventListener("click", () => this.close());
    const confirm = buttons.createEl("button", { text: "画面内で実行", cls: "mod-cta" });
    confirm.addEventListener("click", () => {
      const onConfirm = this.onConfirm;
      if (!onConfirm) return;
      this.close();
      onConfirm();
    });
  }

  private section(title: string, lines: string[]): void {
    const section = this.contentEl.createDiv({ cls: "msdb-comparison-section" });
    section.createEl("h3", { text: title });
    const list = section.createEl("ul");
    for (const line of lines) list.createEl("li", { text: line });
  }

  onClose(): void {
    this.contentEl.empty();
    this.before = null;
    this.after = null;
    this.changedPaths = [];
    this.onConfirm = null;
  }
}

function addOptions(
  select: HTMLSelectElement,
  options: Array<[string, string]>,
  selected: string
): void {
  for (const [value, label] of options) {
    const option = select.createEl("option", { value, text: label });
    option.selected = value === selected;
  }
}

function describeState(state: 融合状態): string {
  const groups = Object.values(state.groups).map((group) => {
    const representatives = (["mention", "location", "tag"] as CardKind[])
      .map((kind) => group.representatives[kind] ? `${KIND_LABEL[kind]}=${state.cards[group.representatives[kind]!] ?.name ?? group.representatives[kind]}` : "")
      .filter(Boolean)
      .join(", ");
    return `${state.cards[group.managerId]?.name ?? group.managerId}（${representatives}）`;
  });
  const knowledgeUnits = Object.keys(state.cards).length
    - Object.values(state.groups).reduce((count, group) => count + group.memberIds.length, 0);
  return `知識単位${knowledgeUnits}件、融合${groups.length}件${groups.length ? ` [${groups.join(" / ")}]` : ""}`;
}

function comparisonLines(state: 融合状態): string[] {
  const groups = Object.values(state.groups);
  if (groups.length === 0) {
    return [
      "関係管理カード: なし",
      "カテゴリ別代表: なし",
      "融合構成員数: 0枚",
      `対象となる個別カード: ${Object.keys(state.cards).length}枚（すべて単独）`
    ];
  }
  return groups.flatMap((group, index) => {
    const ids = groupCardIds(group);
    const representatives = (["mention", "location", "tag"] as CardKind[])
      .filter((kind) => group.representatives[kind])
      .map((kind) => {
        const id = group.representatives[kind]!;
        return `${KIND_LABEL[kind]}=${state.cards[id]?.name ?? id}`;
      });
    return [
      `融合${index + 1} 関係管理カード: ${state.cards[group.managerId]?.name ?? group.managerId}`,
      `融合${index + 1} カテゴリ別代表: ${representatives.join("、") || "未確定"}`,
      `融合${index + 1} 全構成員数: ${ids.length}枚`,
      `融合${index + 1} 対象となる個別カード: ${ids.map((id) => state.cards[id]?.name ?? id).join("、")}`
    ];
  });
}

function changedFilePaths(
  before: 融合状態,
  after: 融合状態,
  result: Obsidian読取結果 | null
): string[] {
  const changedIds = new Set<string>();
  const managerIds = new Set([...Object.keys(before.groups), ...Object.keys(after.groups)]);
  for (const managerId of managerIds) {
    if (JSON.stringify(before.groups[managerId]) !== JSON.stringify(after.groups[managerId])) {
      if (before.groups[managerId]) changedIds.add(managerId);
      if (after.groups[managerId]) changedIds.add(managerId);
    }
  }
  const cardIds = new Set([...Object.keys(before.cards), ...Object.keys(after.cards)]);
  for (const cardId of cardIds) {
    if (
      JSON.stringify(before.cards[cardId]?.handwritten)
      !== JSON.stringify(after.cards[cardId]?.handwritten)
    ) {
      changedIds.add(cardId);
    }
  }
  return [...changedIds].map((id) => result?.cardsById[id]?.path ?? id);
}

function handwrittenComparisonLines(before: 融合状態, after: 融合状態): string[] {
  const lines: string[] = [];
  for (const cardId of new Set([...Object.keys(before.cards), ...Object.keys(after.cards)])) {
    const current = before.cards[cardId]?.handwritten;
    const next = after.cards[cardId]?.handwritten;
    if (JSON.stringify(current) === JSON.stringify(next)) continue;
    const name = after.cards[cardId]?.name ?? before.cards[cardId]?.name ?? cardId;
    lines.push(`${name} 現在: ${current ? JSON.stringify(current) : "なし"}`);
    lines.push(`${name} 操作後: ${next ? JSON.stringify(next) : "なし"}`);
  }
  return lines;
}

function metric(parent: HTMLElement, label: string, value: string, note: string): void {
  const item = parent.createDiv({ cls: "msdb-metric" });
  item.createEl("span", { text: label });
  item.createEl("strong", { text: value });
  item.createEl("small", { text: note });
}

class MemorySynapseSettingTab extends PluginSettingTab {
  constructor(private readonly plugin: MemorySynapseDbPrototype) {
    super(plugin.app, plugin);
  }

  display(): void {
    this.containerEl.empty();
    this.containerEl.createEl("h2", { text: "Memory Synapse DB — 技術検証版" });
    new Setting(this.containerEl)
      .setName("対象ルート")
      .setDesc("Vaultからの相対パスを一つ指定します。Tags、Mentions、Locations直下のMarkdownだけを読み取ります。")
      .addText((text) => text
        .setPlaceholder(DEFAULT_SETTINGS.targetRoot)
        .setValue(this.plugin.settings.targetRoot)
        .onChange(async (value) => {
          this.plugin.settings.targetRoot = normalizeRoot(value) || DEFAULT_SETTINGS.targetRoot;
          await this.plugin.saveSettings();
        }));
    this.containerEl.createEl("p", {
      text: "このプロトタイプにはMarkdownの作成・変更・削除処理、外部通信処理はありません。",
      cls: "setting-item-description"
    });
  }
}
