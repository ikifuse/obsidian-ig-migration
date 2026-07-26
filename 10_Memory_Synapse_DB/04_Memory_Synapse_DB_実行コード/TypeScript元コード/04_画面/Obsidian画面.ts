import { ItemView, Notice, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, parseYaml, stringifyYaml } from "obsidian";
import { カード種類表示名 as KIND_LABEL, type カード種類 as CardKind } from "../01_データ構造/カード";
import type { カード読取結果 as ScanResult } from "../03_データ入出力/カード入出力";
import { Synapsesを読み取る as scanSynapses, type Vaultから読み取ったカード, type Obsidian読取結果, processTransaction, type FileUpdate } from "../03_データ入出力/Obsidian_Vaultデータ";
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
      name: "Memory Synapse DBを開く",
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

import { mountUI } from "./共有UI";
import { 状態差分から更新を生成する } from "../03_データ入出力/トランザクション生成";

class MemorySynapseView extends ItemView {
  private lastReadResult: Obsidian読取結果 | null = null;
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
      this.lastReadResult = await scanSynapses(this.app, root, parseYaml);
      loading.remove();
      
      const state = {
        cards: this.lastReadResult.cardsById,
        groups: this.lastReadResult.groups
      };

      mountUI(
        this.contentEl,
        state,
        async (oldState, newState) => {
          if (!this.lastReadResult) throw new Error("読み取り結果がありません");
          
          const yamlStringify = (stringifyYaml as any) || ((obj: any) => JSON.stringify(obj, null, 2));

          const updates = 状態差分から更新を生成する(oldState, newState, this.lastReadResult);
          if (updates.length > 0) {
            await processTransaction(this.app, updates, yamlStringify);
            // Re-read from Vault to ensure UI is in perfect sync
            await this.refresh();
          }
        },
        (cardId) => {
          const file = this.lastReadResult?.cardsById[cardId]?.file;
          if (file) void this.app.workspace.getLeaf(false).openFile(file);
        }
      );
    } catch (error) {
      loading.setText("計測に失敗しました。Vaultは変更していません。");
      loading.addClass("msdb-error");
      new Notice(`Memory Synapse DB: ${エラー内容を文字列にする(error)}`);
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
