import type { App, TFile } from "obsidian";
import type { カード, カード種類 } from "../01_データ構造/カード";
import type { カテゴリ別代表, 融合グループ } from "../01_データ構造/融合グループ";
import { 対象ルートを整理する } from "../05_共通処理/入力値整理";
import type { カード読取結果, 読み取ったカード } from "./カード入出力";
import { Wikiリンク数を数える, YAMLブロックを抽出する, YAMLブロックを置換する, 最初のYAMLブロックを抽出する, 関連投稿を抽出する } from "./Markdown解析";
import { Wikiリンクを分解する } from "./Wikiリンク解決";

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

export type 検査問題種類 = "解析不能" | "リンク" | "多重所属" | "入れ子" | "代表";

export interface 検査問題 {
  kind: 検査問題種類;
  filePath: string;
  message: string;
}

export interface Obsidian読取結果 extends カード読取結果<Vaultから読み取ったカード> {
  groups: Record<string, 融合グループ>;
  cardsById: Record<string, Vaultから読み取ったカード>;
  migrationWarnings: string[];
  problems: 検査問題[];
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
  const pendingGroups: Array<{ managerId: string; raw: any }> = [];
  const migrationWarnings: string[] = [];
  const problems: 検査問題[] = [];
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
        let memorySynapse: any = null;
        const memorySynapseYaml = YAMLブロックを抽出する(text, "Memory Synapse");
        if (memorySynapseYaml) {
          try {
            memorySynapse = parseYaml(memorySynapseYaml)?.memory_synapse ?? null;
          } catch (error: any) {
            const message = `Memory Synapse YAML構文エラー: ${error.message}`;
            yamlError = yamlError ? `${yamlError} / ${message}` : message;
          }
        }

        let rawHandwritten: any = null;
        const handwrittenYaml = YAMLブロックを抽出する(text, "手書き情報");
        if (handwrittenYaml) {
          try {
            rawHandwritten = parseYaml(handwrittenYaml)?.memory_synapse_note ?? null;
          } catch (error: any) {
            const message = `手書き情報YAML構文エラー: ${error.message}`;
            yamlError = yamlError ? `${yamlError} / ${message}` : message;
          }
        }
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
        if (yamlError) {
          problems.push({ kind: "解析不能", filePath: file.path, message: yamlError });
        }

        if (memorySynapse && !Array.isArray(memorySynapse.members)) {
          problems.push({
            kind: "解析不能",
            filePath: file.path,
            message: "Memory Synapseのmembersを配列として読み取れません。"
          });
        } else if (Array.isArray(memorySynapse?.members)) {
          pendingGroups.push({ managerId: id, raw: memorySynapse });
        }
      }
    }
  }

  const pathToId = new Map(cards.map((card) => [card.path.replace(/\.md$/i, ""), card.id]));
  const basenameToIds = new Map<string, string[]>();
  for (const card of cards) {
    const ids = basenameToIds.get(card.basename) ?? [];
    ids.push(card.id);
    basenameToIds.set(card.basename, ids);
  }
  const resolveCardId = (value: unknown): string | null => {
    const text = String(value ?? "").trim();
    if (cardsById[text]) return text;
    const wiki = text.match(/^\[\[([^|\]]+)(?:\|[^\]]*)?\]\]$/)?.[1]?.replace(/\.md$/i, "");
    if (!wiki) return null;
    const byPath = pathToId.get(wiki);
    if (byPath) return byPath;
    const basename = wiki.split("/").pop() ?? wiki;
    const byBasename = basenameToIds.get(basename) ?? [];
    return byBasename.length === 1 ? byBasename[0]! : null;
  };

  for (const pending of pendingGroups) {
    const rawMembers = pending.raw.members as unknown[];
    const resolvedMembers = rawMembers.map((value: unknown) => resolveCardId(value));
    for (let index = 0; index < rawMembers.length; index++) {
      if (!resolvedMembers[index]) {
        const filePath = cardsById[pending.managerId]?.path ?? pending.managerId;
        const message = `融合構成員リンクを解決できません（${String(rawMembers[index])}）。`;
        migrationWarnings.push(`${filePath}: ${message}`);
        problems.push({ kind: "リンク", filePath, message });
      }
    }
    const memberIds: string[] = resolvedMembers
      .filter((id: string | null): id is string => Boolean(id) && id !== pending.managerId);
    const ids: string[] = [pending.managerId, ...new Set<string>(memberIds)];
    const representatives: カテゴリ別代表 = {};
    const rawRepresentatives = pending.raw.representatives ?? {};
    for (const kind of ["mention", "location", "tag"] as カード種類[]) {
      const resolved = resolveCardId(rawRepresentatives[kind]);
      if (resolved) representatives[kind] = resolved;
      if (rawRepresentatives[kind] && !resolved) {
        const filePath = cardsById[pending.managerId]?.path ?? pending.managerId;
        const message = `${kind}代表リンクを解決できません（${String(rawRepresentatives[kind])}）。`;
        migrationWarnings.push(`${filePath}: ${message}`);
        problems.push({ kind: "リンク", filePath, message });
      }
    }

    if (Number(pending.raw.schema_version) !== 2) {
      for (const kind of ["mention", "location", "tag"] as カード種類[]) {
        const sameKind = ids.filter((id) => cardsById[id]?.kind === kind);
        if (sameKind.length === 1) representatives[kind] = sameKind[0];
        if (sameKind.length > 1) {
          migrationWarnings.push(
            `${cardsById[pending.managerId]?.name ?? pending.managerId}: 旧schemaの${kind}代表は複数候補から選択が必要です。`
          );
        }
      }
    }

    groups[pending.managerId] = {
      schemaVersion: 2,
      managerId: pending.managerId,
      memberIds: ids.filter((id) => id !== pending.managerId),
      representatives
    };
  }

  const memberships = new Map<string, string[]>();
  for (const group of Object.values(groups)) {
    for (const id of [group.managerId, ...group.memberIds]) {
      memberships.set(id, [...(memberships.get(id) ?? []), group.managerId]);
    }
    for (const memberId of group.memberIds) {
      if (!groups[memberId]) continue;
      const filePath = cardsById[group.managerId]?.path ?? group.managerId;
      problems.push({
        kind: "入れ子",
        filePath,
        message: `${cardsById[memberId]?.path ?? memberId}が別の関係管理カードになっています。`
      });
    }
    const ids = new Set([group.managerId, ...group.memberIds]);
    const presentKinds = new Set([...ids].map((id) => cardsById[id]?.kind).filter(Boolean));
    for (const kind of ["mention", "location", "tag"] as カード種類[]) {
      const representativeId = group.representatives[kind];
      let message = "";
      if (presentKinds.has(kind) && !representativeId) message = `${kind}代表が欠けています。`;
      else if (!presentKinds.has(kind) && representativeId) message = `存在しない${kind}カテゴリの代表があります。`;
      else if (representativeId && !ids.has(representativeId)) message = `${kind}代表が融合単位外を参照しています。`;
      else if (representativeId && cardsById[representativeId]?.kind !== kind) message = `${kind}代表の種類が一致しません。`;
      if (message) {
        problems.push({
          kind: "代表",
          filePath: cardsById[group.managerId]?.path ?? group.managerId,
          message
        });
      }
    }
  }
  for (const [cardId, owners] of memberships) {
    if (owners.length < 2) continue;
    problems.push({
      kind: "多重所属",
      filePath: cardsById[cardId]?.path ?? cardId,
      message: `${owners.length}個の融合単位に所属しています。`
    });
  }

  for (const card of cards) {
    for (const wikiLink of card.relatedPosts) {
      const parsed = Wikiリンクを分解する(wikiLink);
      if (!parsed || !app.metadataCache.getFirstLinkpathDest(parsed.path, card.path)) {
        const message = `関連投稿リンクを解決できません（${wikiLink}）。`;
        migrationWarnings.push(`${card.path}: ${message}`);
        problems.push({ kind: "リンク", filePath: card.path, message });
      }
    }
  }

  return {
    cards, cardsById, groups, counts, migrationWarnings, problems,
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
