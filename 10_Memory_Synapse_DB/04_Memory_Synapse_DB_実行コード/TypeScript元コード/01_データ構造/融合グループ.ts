import type { カード, カード種類 } from "./カード";

export type カテゴリ別代表 = Partial<Record<カード種類, string>>;

/**
 * schema_version 2 の融合状態。
 * managerId は関係を保持する既存カードであり、画面上の代表カードとは別の責務を持つ。
 */
export interface 融合グループ {
  schemaVersion: 2;
  managerId: string;
  memberIds: string[];
  representatives: カテゴリ別代表;
}

export interface 融合状態 {
  cards: Record<string, カード>;
  groups: Record<string, 融合グループ>;
}

export interface 関係管理カード推奨結果 {
  candidateIds: string[];
  recommendedIds: string[];
  reason: string;
}

export interface カテゴリ別代表推奨結果 {
  representatives: カテゴリ別代表;
  unresolvedKinds: カード種類[];
  confirmationRequiredKinds: カード種類[];
}
