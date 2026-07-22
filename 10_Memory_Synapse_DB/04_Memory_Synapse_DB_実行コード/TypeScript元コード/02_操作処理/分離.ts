import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { グループの全カードID, 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function カードを分離する(
  current: 融合状態,
  bigCardId: string,
  splitCardId: string,
  nextBigCardId?: string
): 操作結果 {
  const group = current.groups[bigCardId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  const remaining = グループの全カードID(group).filter((id) => id !== splitCardId);
  if (remaining.length === グループの全カードID(group).length) {
    return 失敗結果(current, "分離対象が構成員ではありません。");
  }

  const state = 状態を複製する(current);
  delete state.groups[bigCardId];
  if (remaining.length >= 2) {
    const selected = splitCardId === bigCardId ? nextBigCardId : bigCardId;
    if (!selected || !remaining.includes(selected)) return 失敗結果(current, "残す大きなカードを選んでください。");
    state.groups[selected] = {
      bigCardId: selected,
      memberIds: remaining.filter((id) => id !== selected),
      displayMode: selected === bigCardId ? group.displayMode : "source"
    };
  }
  return 成功結果(state, `${current.cards[splitCardId]?.name ?? splitCardId}を分離しました。`);
}

export function 融合をすべて解体する(current: 融合状態, bigCardId: string): 操作結果 {
  if (!current.groups[bigCardId]) return 失敗結果(current, "融合グループが見つかりません。");
  const state = 状態を複製する(current);
  delete state.groups[bigCardId];
  return 成功結果(state, "融合をすべて解体しました。個別カードの情報は維持されています。");
}
