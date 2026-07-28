import type { App, TFile } from "obsidian";
import type { カード, カード種類 } from "../01_データ構造/カード";
import type { 融合グループ } from "../01_データ構造/融合グループ";
import { 対象ルートを整理する } from "../05_共通処理/入力値整理";
import type { カード読取結果, 読み取ったカード } from "./カード入出力";
import { Wikiリンク数を数える, YAMLブロックを抽出する, YAMLブロックを置換する, 最初のYAMLブロックを抽出する, 関連投稿を抽出する } from "./Markdown解析";

export type ParseYamlFn = (text: string) => any;
export type StringifyYamlFn = (obj: any) => string;

export function extractMemorySynapse(markdown: string, parseYaml: ParseYamlFn): any {
  const yamlText = YAMLブロックを抽出する(markdown, "Memory Synapse");
  if (!yamlText) return null;
  try { return parseYaml(yamlText)?.memory_synapse ?? null; } catch { return null; }
}

export function extractHandwrittenNote(markdown: string, parseYaml: ParseYamlFn): any {
  const yamlText = YAMLブロックを抽出する(markdown, "手書き情報");
  if (!yamlText) return null;
  try { return parseYaml(yamlText)?.memory_synapse_note ?? null; } catch { return null; }
}

export function updateMemorySynapse(markdown: string, data: any, stringifyYaml: StringifyYamlFn): string {
  if (data === null) return YAMLブロックを置換する(markdown, "Memory Synapse", null);
  return YAMLブロックを置換する(markdown, "Memory Synapse", stringifyYaml({ memory_synapse: data }).trim());
}

export function updateHandwrittenNote(markdown: string, data: any, stringifyYaml: StringifyYamlFn): string {
  if (data === null) return YAMLブロックを置換する(markdown, "手書き情報", null);
  return YAMLブロックを置換する(markdown, "手書き情報", stringifyYaml({ memory_synapse_note: data }).trim());
}

export interface FileUpdate {
  file: TFile;
  memorySynapse?: any;
  handwrittenNote?: any;
}

export async function processTransaction(
  app: App,
  updates: FileUpdate[],
  stringifyYaml: StringifyYamlFn
): Promise<void> {
  const snapshots = await Promise.all(
    updates.map(async (u) => ({ file: u.file, content: await app.vault.read(u.file) }))
  );

  try {
    for (const update of updates) {
      await app.vault.process(update.file, (data) => {
        let result = data;
        if (update.memorySynapse !== undefined) {
          result = updateMemorySynapse(result, update.memorySynapse, stringifyYaml);
        }
        if (update.handwrittenNote !== undefined) {
          result = updateHandwrittenNote(result, update.handwrittenNote, stringifyYaml);
        }
        return result;
      });
    }
  } catch (error) {
    for (const snap of snapshots) {
      try {
        await app.vault.modify(snap.file, snap.content);
      } catch (e) {
        console.error(`Rollback failed for ${snap.file.path}`, e);
      }
    }
    throw new Error(`書き込み失敗のためロールバックしました: ${error}`);
  }
}

export type Vaultから読み取ったカード = 読み取ったカード & カード & {
  file: TFile;
};

export interface Obsidian読取結果 extends カード読取結果<Vaultから読み取ったカード> {
  groups: Record<string, 融合グループ>;
  cardsById: Record<string, Vaultから読み取ったカード>;
}

import {
  validateTagSource,
  validateMentionSource,
  validateLocationSource,
  validateHandwrittenNote
} from "./形式検証";
import { 保存用から画面データへ変換する } from "../01_データ構造/手書き情報";

export async function Synapsesを読み取る(
  app: App,
  targetRoot: string,
  parseYaml: ParseYamlFn
): Promise<Obsidian読取結果> {
  const startMs = performance.now();
  const root = 対象ルートを整理する(targetRoot);
  const files = app.vault.getMarkdownFiles();
  let totalWikiLinks = 0;
  const cards: Vaultから読み取ったカード[] = [];
  const cardsById: Record<string, Vaultから読み取ったカード> = {};
  const groups: Record<string, 融合グループ> = {};
  const counts = { mention: 0, location: 0, tag: 0 };

  for (const file of files) {
    if (!root || file.path.startsWith(root + "/")) {
      const kind = パスからカード種類を判定する(file.path, root);
      if (kind) {
        const text = await app.vault.cachedRead(file);
        const links = Wikiリンク数を数える(text);
        totalWikiLinks += links;
        counts[kind]++;

        const id = `${kind}-${file.basename}`;
        let source: any = {};
        let yamlError: string | undefined = undefined;

        const baseYamlText = 最初のYAMLブロックを抽出する(text);
        if (baseYamlText) {
          try {
            source = parseYaml(baseYamlText);
            let errorMsg = null;
            if (kind === "tag") errorMsg = validateTagSource(source);
            else if (kind === "mention") errorMsg = validateMentionSource(source);
            else if (kind === "location") errorMsg = validateLocationSource(source);
            if (errorMsg) yamlError = errorMsg;
          } catch (e: any) {
            yamlError = "YAML構文エラー: " + e.message;
          }
        } else {
          yamlError = "YAMLブロックが見つかりません";
        }

        let name = file.basename;
        if (!yamlError) {
          if (kind === "tag") name = source.hashtag_note?.hashtag || name;
          else if (kind === "mention") name = source.mention_note?.mention || name;
          else if (kind === "location") name = source.location_note?.location || name;
        }

        const relatedPosts = 関連投稿を抽出する(text);
        const memorySynapse = extractMemorySynapse(text, parseYaml);
        
        const rawHandwritten = extractHandwrittenNote(text, parseYaml);
        let handwrittenError: string | undefined = undefined;
        if (rawHandwritten) {
          handwrittenError = validateHandwrittenNote(rawHandwritten) || undefined;
          if (handwrittenError) {
             yamlError = yamlError ? yamlError + " / 手書き情報エラー: " + handwrittenError : "手書き情報エラー: " + handwrittenError;
          }
        }
        const handwritten = (rawHandwritten && !handwrittenError) ? 保存用から画面データへ変換する(rawHandwritten) : undefined;

        const baseCard = {
          file, path: file.path, basename: file.basename, wikiLinkCount: links,
          id, name, relatedPosts, handwritten, yamlError
        };

        let card: Vaultから読み取ったカード;
        if (kind === "tag") {
          card = { ...baseCard, kind: "tag", source } as Vaultから読み取ったカード;
        } else if (kind === "mention") {
          card = { ...baseCard, kind: "mention", source } as Vaultから読み取ったカード;
        } else {
          card = { ...baseCard, kind: "location", source } as Vaultから読み取ったカード;
        }

        cards.push(card);
        cardsById[id] = card;

        if (memorySynapse?.members && Array.isArray(memorySynapse.members)) {
          groups[id] = {
            bigCardId: id,
            memberIds: memorySynapse.members,
            displayMode: memorySynapse.display_mode === "handwritten" ? "handwritten" : "source"
          };
        }
      }
    }
  }

  return {
    cards, cardsById, groups, counts,
    elapsedMs: performance.now() - startMs,
    totalMarkdownFiles: files.length,
    totalWikiLinks,
    approximateHeapMb: JSヒープ概算を読む()
  };
}

export function パスからカード種類を判定する(
  path: string,
  targetRoot: string
): カード種類 | null {
  const root = 対象ルートを整理する(targetRoot);
  const escaped = root.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = path.match(new RegExp(`^${escaped}/(Tags|Mentions|Locations)/[^/]+\\.md$`, "i"));
  if (!match) return null;
  const folder = match[1]?.toLowerCase();
  if (folder === "mentions") return "mention";
  if (folder === "locations") return "location";
  if (folder === "tags") return "tag";
  return null;
}

function JSヒープ概算を読む(): number | undefined {
  const extended = performance as Performance & { memory?: { usedJSHeapSize: number } };
  return extended.memory ? extended.memory.usedJSHeapSize / 1024 / 1024 : undefined;
}
