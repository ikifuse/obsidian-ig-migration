import type { 操作結果 } from "../01_データ構造/操作結果";
import type { カード種類 } from "../01_データ構造/カード";
import type { カテゴリ別代表, 融合状態 } from "../01_データ構造/融合グループ";
import { グループの全カードID, 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function カードを分離する(
  current: 融合状態,
  managerId: string,
  splitCardId: string,
  nextManagerId?: string,
  nextRepresentatives: カテゴリ別代表 = {}
): 操作結果 {
  const group = current.groups[managerId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  const remaining = グループの全カードID(group).filter((id) => id !== splitCardId);
  if (remaining.length === グループの全カードID(group).length) {
    return 失敗結果(current, "分離対象が構成員ではありません。");
  }

  const state = 状態を複製する(current);
  delete state.groups[managerId];
  if (remaining.length >= 2) {
    const selected = splitCardId === managerId ? nextManagerId : managerId;
    if (!selected || !remaining.includes(selected)) return 失敗結果(current, "残す関係管理カードを選んでください。");
    const representatives: カテゴリ別代表 = {};
    for (const kind of ["mention", "location", "tag"] as カード種類[]) {
      const candidates = remaining.filter((id) => current.cards[id]?.kind === kind);
      if (candidates.length === 0) continue;
      if (candidates.length === 1) {
        representatives[kind] = candidates[0];
        continue;
      }
      const previous = group.representatives[kind];
      if (previous && candidates.includes(previous)) {
        representatives[kind] = previous;
        continue;
      }
      const selectedRepresentative = nextRepresentatives[kind];
      if (!selectedRepresentative || !candidates.includes(selectedRepresentative)) {
        return 失敗結果(current, `${kind}カテゴリの次の代表を選んでください。`);
      }
      representatives[kind] = selectedRepresentative;
    }
    state.groups[selected] = {
      schemaVersion: 2,
      managerId: selected,
      memberIds: remaining.filter((id) => id !== selected),
      representatives
    };
  }
  return 成功結果(state, `${current.cards[splitCardId]?.name ?? splitCardId}を分離しました。`);
}

export function 融合をすべて解体する(current: 融合状態, managerId: string): 操作結果 {
  if (!current.groups[managerId]) return 失敗結果(current, "融合グループが見つかりません。");
  const state = 状態を複製する(current);
  delete state.groups[managerId];
  return 成功結果(state, "融合をすべて解体しました。個別カードの情報は維持されています。");
}
