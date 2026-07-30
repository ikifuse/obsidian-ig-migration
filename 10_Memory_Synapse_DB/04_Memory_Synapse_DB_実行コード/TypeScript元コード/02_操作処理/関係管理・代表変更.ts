import type { 操作結果 } from "../01_データ構造/操作結果";
import type { カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { グループの全カードID, 状態を複製する } from "./状態参照";
import { 失敗結果, 成功結果 } from "./状態検証";

export function 関係管理カードを変更する(
  current: 融合状態,
  oldManagerId: string,
  newManagerId: string
): 操作結果 {
  const group = current.groups[oldManagerId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  const ids = グループの全カードID(group);
  if (!ids.includes(newManagerId)) return 失敗結果(current, "構成カードから選択してください。");
  const state = 状態を複製する(current);
  delete state.groups[oldManagerId];
  state.groups[newManagerId] = {
    ...group,
    managerId: newManagerId,
    memberIds: ids.filter((id) => id !== newManagerId)
  };
  return 成功結果(state, `関係管理カードを${state.cards[newManagerId]?.name ?? newManagerId}へ変更しました。`);
}

export function カテゴリ代表を変更する(
  current: 融合状態,
  managerId: string,
  kind: カード種類,
  representativeId: string
): 操作結果 {
  const group = current.groups[managerId];
  if (!group) return 失敗結果(current, "融合グループが見つかりません。");
  const ids = グループの全カードID(group);
  if (!ids.includes(representativeId) || current.cards[representativeId]?.kind !== kind) {
    return 失敗結果(current, `${kind}カテゴリの構成カードから代表を選択してください。`);
  }
  const state = 状態を複製する(current);
  state.groups[managerId]!.representatives[kind] = representativeId;
  return 成功結果(state, `${kind}カテゴリの代表を${state.cards[representativeId]?.name ?? representativeId}へ変更しました。`);
}
