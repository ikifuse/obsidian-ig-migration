import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 表示方法, 融合状態 } from "../01_データ構造/融合グループ";
import { グループの全カードID, 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function 大きなカードを変更する(
  current: 融合状態,
  oldBigCardId: string,
  newBigCardId: string,
  displayMode: 表示方法
): 操作結果 {
  const group = current.groups[oldBigCardId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  const ids = グループの全カードID(group);
  if (!ids.includes(newBigCardId)) return 失敗結果(current, "構成員から選択してください。");
  if (displayMode === "handwritten" && !current.cards[newBigCardId]?.handwritten) {
    return 失敗結果(current, "手書き情報がないカードは手書き表示にできません。");
  }
  const state = 状態を複製する(current);
  delete state.groups[oldBigCardId];
  state.groups[newBigCardId] = {
    bigCardId: newBigCardId,
    memberIds: ids.filter((id) => id !== newBigCardId),
    displayMode
  };
  return 成功結果(state, `大きなカードを${state.cards[newBigCardId]?.name ?? newBigCardId}へ変更しました。`);
}
