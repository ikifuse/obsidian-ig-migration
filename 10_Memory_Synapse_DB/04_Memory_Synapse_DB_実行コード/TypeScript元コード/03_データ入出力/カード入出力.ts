import type { カード種類 } from "../01_データ構造/カード";

export interface 読み取ったカード {
  path: string;
  basename: string;
  kind: カード種類;
  wikiLinkCount: number;
}

export interface カード読取結果<TCard extends 読み取ったカード = 読み取ったカード> {
  cards: TCard[];
  counts: Record<カード種類, number>;
  elapsedMs: number;
  totalMarkdownFiles: number;
  totalWikiLinks: number;
  approximateHeapMb?: number;
}
