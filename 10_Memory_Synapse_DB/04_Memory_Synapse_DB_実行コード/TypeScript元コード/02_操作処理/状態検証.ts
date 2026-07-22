import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { カードの融合グループを探す, グループの全カードID, 状態を複製する } from "./状態参照";

export function 状態を検証する(state: 融合状態): string[] {
  const errors: string[] = [];
  const membership = new Map<string, string[]>();

  for (const [key, group] of Object.entries(state.groups)) {
    if (key !== group.bigCardId) errors.push(`${key}: 大きなカードの索引が一致しません。`);
    if (!state.cards[group.bigCardId]) errors.push(`${group.bigCardId}: カードが存在しません。`);
    if (group.memberIds.length === 0) errors.push(`${group.bigCardId}: 空の融合状態です。`);
    if (group.memberIds.includes(group.bigCardId)) {
      errors.push(`${group.bigCardId}: 自分自身がmembersに含まれています。`);
    }
    if (new Set(group.memberIds).size !== group.memberIds.length) {
      errors.push(`${group.bigCardId}: membersが重複しています。`);
    }

    for (const id of グループの全カードID(group)) {
      if (!state.cards[id]) errors.push(`${id}: リンク先カードが存在しません。`);
      const owners = membership.get(id) ?? [];
      owners.push(group.bigCardId);
      membership.set(id, owners);
    }
  }

  for (const [cardId, owners] of membership) {
    if (owners.length > 1) {
      errors.push(`${state.cards[cardId]?.name ?? cardId}: ${owners.length}個の融合グループに多重所属しています。`);
    }
  }

  return errors;
}

export function 失敗結果(state: 融合状態, message: string): 操作結果 {
  return { ok: false, state, message };
}

export function 成功結果(state: 融合状態, message: string): 操作結果 {
  const errors = 状態を検証する(state);
  return errors.length > 0 ? 失敗結果(state, errors.join("\n")) : { ok: true, state, message };
}

export function 多重所属の検証状態を作る(current: 融合状態): 融合状態 {
  const state = 状態を複製する(current);
  const existingGroup = Object.values(state.groups)[0];
  if (existingGroup) {
    const duplicatedId = existingGroup.memberIds[0] ?? existingGroup.bigCardId;
    const unusedBigId = Object.keys(state.cards).find((id) => !カードの融合グループを探す(state, id));
    if (unusedBigId) {
      state.groups[unusedBigId] = {
        bigCardId: unusedBigId,
        memberIds: [duplicatedId],
        displayMode: "source"
      };
      return state;
    }
  }

  const ids = Object.keys(state.cards);
  const first = ids[0];
  const second = ids[1];
  const third = ids[2];
  if (first && second && third) {
    state.groups = {
      [first]: { bigCardId: first, memberIds: [third], displayMode: "source" },
      [second]: { bigCardId: second, memberIds: [third], displayMode: "source" }
    };
  }
  return state;
}
