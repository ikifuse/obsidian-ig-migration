import type { 手書き情報 } from "../01_データ構造/手書き情報";
import { 手書き情報を整理する } from "../01_データ構造/手書き情報";
import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function 手書き情報を保存する(
  current: 融合状態,
  cardId: string,
  note: 手書き情報
): 操作結果 {
  if (!current.cards[cardId]) return 失敗結果(current, "カードが見つかりません。");
  const state = 状態を複製する(current);
  const card = state.cards[cardId];
  if (!card) return 失敗結果(current, "カードが見つかりません。");
  card.handwritten = 手書き情報を整理する(note);
  const group = state.groups[cardId];
  if (group) group.displayMode = "handwritten";
  return 成功結果(state, "手書き情報をブラウザー内の検証状態へ保存しました。実ファイルは変更していません。");
}
