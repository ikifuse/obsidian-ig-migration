import type { カード } from "./カード";

export type 表示方法 = "source" | "handwritten";

export interface 融合グループ {
  bigCardId: string;
  memberIds: string[];
  displayMode: 表示方法;
}

export interface 融合状態 {
  cards: Record<string, カード>;
  groups: Record<string, 融合グループ>;
}

export interface 大きなカード推奨結果 {
  candidateIds: string[];
  recommendedIds: string[];
  reason: string;
}
