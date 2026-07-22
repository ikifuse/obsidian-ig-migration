import {
  ItemView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf
} from "obsidian";
import { カード種類表示名 as KIND_LABEL, type カード種類 as CardKind } from "../01_データ構造/カード";
import type { カード読取結果 as ScanResult } from "../03_データ入出力/カード入出力";
import { Synapsesを読み取る as scanSynapses, type Vaultから読み取ったカード } from "../03_データ入出力/Obsidian_Vaultデータ";
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
    this.addRibbonIcon("network", "Memory Synapse DB（読み取り専用）", () => void this.activateView());
    this.addCommand({
      id: "open-readonly-prototype",
      name: "読み取り専用の技術検証画面を開く",
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
    this.contentEl.addClass("memory-synapse-prototype");
    const header = this.contentEl.createDiv({ cls: "msdb-header" });
    const title = header.createDiv();
    title.createEl("h2", { text: "Memory Synapse DB" });
    title.createEl("p", { text: "技術検証版 0.0.1 — 読み取り専用" });
    const refreshButton = header.createEl("button", { text: "再計測", cls: "mod-cta" });
    refreshButton.addEventListener("click", () => void this.refresh());

    const warning = this.contentEl.createDiv({ cls: "msdb-warning" });
    warning.createEl("strong", { text: "この版はVaultを変更しません。" });
    warning.createEl("div", { text: "融合・分離・手書き保存は、ブラウザー確認後の実装対象です。外部通信も行いません。" });
    this.contentEl.createEl("p", { text: `対象: ${root || "（未設定）"}`, cls: "msdb-root" });

    const loading = this.contentEl.createDiv({ cls: "msdb-loading", text: "MarkdownとWikiリンクを計測しています…" });
    try {
      const result = await scanSynapses(this.app, root);
      loading.remove();
      this.renderResult(result);
    } catch (error) {
      loading.setText("計測に失敗しました。Vaultは変更していません。");
      loading.addClass("msdb-error");
      new Notice(`Memory Synapse DB: ${エラー内容を文字列にする(error)}`);
    }
  }

  private renderResult(result: ScanResult<Vaultから読み取ったカード>): void {
    const metrics = this.contentEl.createDiv({ cls: "msdb-metrics" });
    metric(metrics, "Vault内Markdown", result.totalMarkdownFiles.toLocaleString(), "参考値");
    metric(metrics, "対象カード", result.cards.length.toLocaleString(), "3種類の合計");
    metric(metrics, "Wikiリンク", result.totalWikiLinks.toLocaleString(), "対象カード本文内");
    metric(metrics, "計測時間", `${result.elapsedMs.toFixed(1)} ms`, "端末・キャッシュ状態に依存");
    metric(metrics, "JSヒープ概算", result.approximateHeapMb === undefined ? "取得不可" : `${result.approximateHeapMb.toFixed(1)} MB`, "ブラウザー提供値");

    const types = this.contentEl.createDiv({ cls: "msdb-types" });
    (["mention", "location", "tag"] as CardKind[]).forEach((kind) => {
      const item = types.createDiv({ cls: `msdb-type msdb-${kind}` });
      item.createEl("span", { text: KIND_LABEL[kind] });
      item.createEl("strong", { text: result.counts[kind].toLocaleString() });
    });

    const listHead = this.contentEl.createDiv({ cls: "msdb-list-head" });
    listHead.createEl("h3", { text: "カード例" });
    listHead.createEl("span", { text: `先頭${Math.min(50, result.cards.length)}件を表示` });
    const list = this.contentEl.createDiv({ cls: "msdb-card-list" });
    for (const card of result.cards.slice(0, 50)) {
      const row = list.createDiv({ cls: "msdb-card" });
      const button = row.createEl("button", { text: card.file.basename, cls: "msdb-card-link" });
      button.addEventListener("click", () => void this.app.workspace.getLeaf(false).openFile(card.file));
      row.createEl("span", { text: KIND_LABEL[card.kind], cls: `msdb-kind msdb-${card.kind}` });
      row.createEl("span", { text: `${card.wikiLinkCount} links`, cls: "msdb-link-count" });
    }
    if (result.cards.length === 0) {
      list.createEl("p", { text: "対象カードが見つかりません。設定でVault相対パスを確認してください。", cls: "msdb-empty" });
    }
  }
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
