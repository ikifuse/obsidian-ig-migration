import type { App, TFile } from "obsidian";
import type { カード種類 } from "../01_データ構造/カード";
import { 対象ルートを整理する } from "../05_共通処理/入力値整理";
import type { カード読取結果, 読み取ったカード } from "./カード入出力";
import { Wikiリンク数を数える } from "./Markdown解析";

export interface Vaultから読み取ったカード extends 読み取ったカード {
  file: TFile;
}

export async function Synapsesを読み取る(
  app: App,
  targetRoot: string
): Promise<カード読取結果<Vaultから読み取ったカード>> {
  const started = performance.now();
  const root = 対象ルートを整理する(targetRoot);
  const allMarkdown = app.vault.getMarkdownFiles();
  const targets = allMarkdown.flatMap((file) => {
    const kind = パスからカード種類を判定する(file.path, root);
    return kind ? [{ file, kind }] : [];
  });
  const cards: Vaultから読み取ったカード[] = [];
  const batchSize = 50;

  for (let offset = 0; offset < targets.length; offset += batchSize) {
    const batch = targets.slice(offset, offset + batchSize);
    const scanned = await Promise.all(batch.map(async ({ file, kind }) => {
      const contents = await app.vault.cachedRead(file);
      return {
        file,
        path: file.path,
        basename: file.basename,
        kind,
        wikiLinkCount: Wikiリンク数を数える(contents)
      };
    }));
    cards.push(...scanned);
  }

  const counts: Record<カード種類, number> = { mention: 0, location: 0, tag: 0 };
  for (const card of cards) counts[card.kind] += 1;
  return {
    cards,
    counts,
    elapsedMs: performance.now() - started,
    totalMarkdownFiles: allMarkdown.length,
    totalWikiLinks: cards.reduce((total, card) => total + card.wikiLinkCount, 0),
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
