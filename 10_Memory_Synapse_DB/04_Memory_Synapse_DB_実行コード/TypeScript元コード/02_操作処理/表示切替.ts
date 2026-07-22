import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 表示方法, 融合状態 } from "../01_データ構造/融合グループ";
import { 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function 表示方法を変更する(
  current: 融合状態,
  bigCardId: string,
  displayMode: 表示方法
): 操作結果 {
  const state = 状態を複製する(current);
  const group = state.groups[bigCardId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  if (displayMode === "handwritten" && !state.cards[bigCardId]?.handwritten) {
    return 失敗結果(current, "手書き情報がありません。");
  }
  group.displayMode = displayMode;
  return 成功結果(state, displayMode === "source" ? "通常表示へ戻しました。" : "手書き表示へ変更しました。");
}
