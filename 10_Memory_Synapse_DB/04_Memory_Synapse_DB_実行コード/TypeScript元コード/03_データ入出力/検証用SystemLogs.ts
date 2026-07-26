import type { カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";

export type 検証用SystemLogID = "hashtags" | "mentions" | "locations";

export interface 検証用SystemLog {
  id: 検証用SystemLogID;
  filename: string;
  title: string;
  kind: カード種類;
}

export const 検証用SystemLog一覧: readonly 検証用SystemLog[] = [
  { id: "hashtags", filename: "ハッシュタグ一覧.md", title: "ハッシュタグ一覧", kind: "tag" },
  { id: "mentions", filename: "メンション一覧.md", title: "メンション一覧", kind: "mention" },
  { id: "locations", filename: "場所一覧.md", title: "場所一覧", kind: "location" }
];

export function SystemLogのカードID一覧(
  state: 融合状態,
  systemLogId: 検証用SystemLogID
): string[] {
  const systemLog = 検証用SystemLog一覧.find((item) => item.id === systemLogId);
  if (!systemLog) return [];

  return Object.values(state.cards)
    .filter((card) => card.kind === systemLog.kind)
    .map((card) => card.id);
}
