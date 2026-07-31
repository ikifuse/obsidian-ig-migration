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

const VIEW_TYPE = 読み取り専用画面ID;

interface PrototypeSettings {
  targetRoot: string;
}

const DEFAULT_SETTINGS: PrototypeSettings = プラグイン設定初期値;

export default class MemorySynapseDbPrototype extends Plugin {
  settings: PrototypeSettings = DEFAULT_SETTINGS;

  async onload(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData() as Partial<PrototypeSettings> | null) };
    this.registerView(VIEW_TYPE, (leaf) => new MemorySynapseView(leaf, this));
    this.addRibbonIcon("network", "Memory Synapse DB", () => void this.activateView());
    this.addCommand({
      id: "open-readonly-prototype",
      name: "読み取り専用の技術検証版を開く",
      callback: () => void this.activateView()
    });
    this.addSettingTab(new MemorySynapseSettingTab(this));
  }

  async activateView(): Promise<void> {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    const leaf = existing ?? this.app.workspace.getLeaf("tab");
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    await this.app.workspace.revealLeaf(leaf);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE)) {
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
  private statusFilter: "all" | "single" | "manager" | "representative" | "member" = "all";
  private handwrittenOnly = false;

  constructor(leaf: WorkspaceLeaf, private readonly plugin: MemorySynapseDbPrototype) {
    super(leaf);
  }

  getViewType(): string { return VIEW_TYPE; }
  getDisplayText(): string { return "Memory Synapse DB"; }
  getIcon(): string { return "network"; }

  async onOpen(): Promise<void> { await this.refresh(); }

  async refresh(): Promise<void> {
    const root = normalizeRoot(this.plugin.settings.targetRoot);
    this.contentEl.empty();
    
    const loading = this.contentEl.createDiv({ cls: "msdb-loading", text: "MarkdownとWikiリンクを計測しています…" });
    try {
      const result = await scanSynapses(this.app, root, parseYaml);
      loading.remove();
      this.readResult = result;
      this.sessionState = { cards: result.cardsById, groups: result.groups };
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
    const session = this.sessionState ?? { cards: result.cardsById, groups: result.groups };
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
    warning.createDiv({ text: "対象Markdownを計測して表示するだけで、作成・変更・移動・削除は行いません。" });
    view.createDiv({ cls: "msdb-root", text: `対象ルート: ${root}` });
    view.createDiv({ cls: "msdb-session-notice", text: this.notice });

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

    const groupsHeading = view.createDiv({ cls: "msdb-list-head" });
    groupsHeading.createEl("h3", { text: "融合グループ" });
    groupsHeading.createSpan({ text: `${Object.keys(session.groups).length}件` });
    const groups = view.createDiv({ cls: "msdb-group-list" });
    if (Object.keys(session.groups).length === 0) {
      groups.createDiv({ cls: "msdb-empty", text: "融合グループはありません。" });
    }
    for (const group of Object.values(session.groups)) {
      this.renderGroup(groups, group, result, session);
    }

    const listHead = view.createDiv({ cls: "msdb-list-head" });
    listHead.createEl("h3", { text: "個別カード" });
    const filteredCards = Object.values(session.cards).filter((card) => this.matchesFilters(card, session));
    listHead.createSpan({ text: `全${result.cards.length}件中 ${filteredCards.length}件を表示` });
    this.renderFilters(view);
    const list = view.createDiv({ cls: "msdb-card-list" });
    if (result.cards.length === 0) {
      list.createDiv({ cls: "msdb-empty", text: "対象カードがありません。" });
      return;
    }

    for (const card of filteredCards) {
      const fileCard = result.cardsById[card.id];
      if (!fileCard) continue;
      const block = list.createDiv({ cls: "msdb-card-block" });
      block.draggable = true;
      block.addEventListener("dragstart", (event) => {
        event.dataTransfer?.setData("text/x-memory-synapse-card", card.id);
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
        if (!sourceId || sourceId === card.id) return;
        event.preventDefault();
        this.openMerge(sourceId, card.id);
      });
      const row = block.createDiv({ cls: "msdb-card" });
      const open = row.createEl("button", { cls: "msdb-card-link", text: `${fileCard.basename}.md` });
      open.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(fileCard.file));
      row.createSpan({ cls: `msdb-kind msdb-${card.kind}`, text: KIND_LABEL[card.kind] });
      row.createSpan({ cls: "msdb-link-count", text: `${fileCard.wikiLinkCount}リンク` });
      const group = Object.values(session.groups).find((item) => groupCardIds(item).includes(card.id));
      if (group) {
        const role = group.managerId === card.id ? "関係管理" : "構成カード";
        const representativeKinds = (["mention", "location", "tag"] as CardKind[])
          .filter((kind) => group.representatives[kind] === card.id)
          .map((kind) => KIND_LABEL[kind]);
        row.createSpan({
          cls: "msdb-link-count",
          text: representativeKinds.length > 0 ? `${role}・${representativeKinds.join("/")}代表` : role
        });
      }
      const actions = block.createDiv({ cls: "msdb-card-actions" });
      const merge = actions.createEl("button", { text: "融合へ追加" });
      merge.addEventListener("click", () => this.openMerge(card.id));
      const hand = actions.createEl("button", { text: "手書き" });
      hand.addEventListener("click", () => this.openHandwritten(card.id));

      const related = block.createDiv({ cls: "msdb-related-posts" });
      related.createSpan({ cls: "msdb-related-label", text: `関連投稿 ${card.relatedPosts.length}件` });
      for (const wikiLink of card.relatedPosts) {
        const parsed = parseWikiLink(wikiLink);
        if (!parsed) continue;
        const post = related.createEl("button", {
          cls: "msdb-related-post",
          text: parsed.displayName ?? parsed.path.split("/").pop() ?? parsed.path
        });
        post.addEventListener("click", () => void this.app.workspace.openLinkText(parsed.path, fileCard.path, false));
      }
      const details = block.createEl("details", { cls: "msdb-individual-details" });
      details.createEl("summary", { text: "個別カードの保持情報を見る" });
      this.renderIndividualCard(details, card);
    }
  }

  private renderGroup(
    parent: HTMLElement,
    group: 融合グループ,
    result: Obsidian読取結果,
    session: 融合状態
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
      const others = category.createEl("details");
      others.createEl("summary", { text: `他のカードを見る（${Math.max(0, sameKind.length - 1)}枚）` });
      for (const id of sameKind) {
        const card = session.cards[id];
        if (!card) continue;
        const line = others.createDiv({ cls: "msdb-member-line" });
        const open = line.createEl("button", {
          cls: "msdb-related-post",
          text: `${card.name}${id === representativeId ? "（代表）" : ""}`
        });
        const file = result.cardsById[id]?.file;
        if (file) open.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(file));
        const hand = line.createEl("button", { text: "手書き" });
        hand.addEventListener("click", () => this.openHandwritten(id));
        const split = line.createEl("button", { text: "分離" });
        split.addEventListener("click", () => this.openSplit(group.managerId, id));
      }
    }
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
      field.createDiv({ text: selected.value });
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
      ["all", "全状態"], ["single", "単独"], ["manager", "関係管理"],
      ["representative", "カテゴリ代表"], ["member", "その他の構成カード"]
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
  }

  private matchesFilters(card: Card, state: 融合状態): boolean {
    if (this.kindFilter !== "all" && card.kind !== this.kindFilter) return false;
    if (this.handwrittenOnly && !card.handwritten) return false;
    const group = Object.values(state.groups).find((item) => groupCardIds(item).includes(card.id));
    const isRepresentative = group
      ? Object.values(group.representatives).includes(card.id)
      : false;
    const status = !group
      ? "single"
      : group.managerId === card.id
        ? "manager"
        : isRepresentative
          ? "representative"
          : "member";
    if (this.statusFilter !== "all" && status !== this.statusFilter) return false;
    const query = this.search.trim().toLowerCase();
    if (!query) return true;
    const text = [
      card.name,
      card.handwritten?.displayName,
      ...(card.handwritten?.aliases ?? []),
      ...card.relatedPosts,
      JSON.stringify(card.source)
    ].join("\n").toLowerCase();
    return text.includes(query);
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
    return { displayName: card.source.hashtag_note.hashtag, note: card.source.hashtag_note.note };
  }
  if (card.kind === "mention") {
    return {
      displayName: card.source.mention_note.mention,
      name: card.source.mention_note.name,
      phone: card.source.mention_note.phone,
      web: card.source.mention_note.web,
      note: card.source.mention_note.note
    };
  }
  return {
    displayName: card.source.location_note.location,
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

function categoryFields(kind: CardKind): Array<[string, string]> {
  if (kind === "tag") return [["displayName", "表示名"], ["aliases", "別名"], ["note", "自由メモ"]];
  if (kind === "mention") {
    return [
      ["displayName", "表示名"], ["aliases", "別名"], ["name", "名称"],
      ["phone", "電話"], ["web", "Web等"], ["note", "自由メモ"]
    ];
  }
  return [
    ["displayName", "表示名"], ["aliases", "別名"], ["lat", "緯度"], ["lng", "経度"],
    ["alt", "高度"], ["full", "住所全文"], ["country", "国"], ["prefecture", "都道府県"],
    ["city", "市区町村"], ["district", "地区"], ["street", "番地等"],
    ["postalCode", "郵便番号"], ["note", "自由メモ"]
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
  private readonly values: Record<string, string> = {};
  private readonly confirmed = new Set<string>();

  constructor(
    app: App,
    private readonly titleText: string,
    private readonly fields: ChoiceField[],
    private readonly onConfirm: (values: Record<string, string>) => void,
    private readonly description = ""
  ) {
    super(app);
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
      this.close();
      this.onConfirm({ ...this.values });
    });
  }

  onClose(): void { this.contentEl.empty(); }
}

class HandwrittenModal extends Modal {
  private readonly note: 手書き情報;

  constructor(
    app: App,
    private readonly card: Card,
    private readonly onConfirm: (note: 手書き情報) => void
  ) {
    super(app);
    this.note = structuredClone(card.handwritten ?? emptyHandwritten);
  }

  onOpen(): void {
    this.titleEl.setText(`${KIND_LABEL[this.card.kind]}個別カードの手書き`);
    this.contentEl.createEl("p", {
      text: "元情報は消しません。入力した非空項目だけが表示で優先され、空項目は移行時点の値を使います。",
      cls: "setting-item-description"
    });
    this.text("表示名", this.note.displayName, (value) => { this.note.displayName = value; });
    this.lines("別名（1行1件）", this.note.aliases, (value) => { this.note.aliases = value; });
    if (this.card.kind === "mention") {
      this.text("名称", this.note.name, (value) => { this.note.name = value; });
      this.lines("電話（1行1件）", this.note.phone, (value) => { this.note.phone = value; });
      this.lines("Web等（1行1件）", this.note.web, (value) => { this.note.web = value; });
    }
    if (this.card.kind === "location") {
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
      this.close();
      this.onConfirm(structuredClone(this.note));
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

  onClose(): void { this.contentEl.empty(); }
}

class OperationConfirmModal extends Modal {
  constructor(
    app: App,
    private readonly operationTitle: string,
    private readonly before: 融合状態,
    private readonly after: 融合状態,
    private readonly changedPaths: string[],
    private readonly onConfirm: () => void
  ) {
    super(app);
  }

  onOpen(): void {
    this.titleEl.setText(`${this.operationTitle} — 操作前後比較`);
    this.section("現在", comparisonLines(this.before));
    this.section("操作後", comparisonLines(this.after));
    const handwritten = handwrittenComparisonLines(this.before, this.after);
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
      text: "この06技術検証版では、上記ファイルを実際には変更しません。",
      cls: "msdb-readonly-confirm"
    });
    const buttons = this.contentEl.createDiv({ cls: "modal-button-container" });
    const cancel = buttons.createEl("button", { text: "キャンセル" });
    cancel.addEventListener("click", () => this.close());
    const confirm = buttons.createEl("button", { text: "画面内で実行", cls: "mod-cta" });
    confirm.addEventListener("click", () => {
      this.close();
      this.onConfirm();
    });
  }

  private section(title: string, lines: string[]): void {
    const section = this.contentEl.createDiv({ cls: "msdb-comparison-section" });
    section.createEl("h3", { text: title });
    const list = section.createEl("ul");
    for (const line of lines) list.createEl("li", { text: line });
  }

  onClose(): void { this.contentEl.empty(); }
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
