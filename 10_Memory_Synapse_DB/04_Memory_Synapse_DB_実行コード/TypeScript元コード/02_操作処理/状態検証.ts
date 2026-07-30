import type { 操作結果 } from "../01_データ構造/操作結果";
import type { カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { カードの融合グループを探す, グループの全カードID, 状態を複製する } from "./状態参照";

export function 状態を検証する(state: 融合状態): string[] {
  const errors: string[] = [];
  const membership = new Map<string, string[]>();

  for (const [key, group] of Object.entries(state.groups)) {
    if (group.schemaVersion !== 2) errors.push(`${key}: schema_version 2ではありません。`);
    if (key !== group.managerId) errors.push(`${key}: 関係管理カードの索引が一致しません。`);
    if (!state.cards[group.managerId]) errors.push(`${group.managerId}: 関係管理カードが存在しません。`);
    if (group.memberIds.length === 0) errors.push(`${group.managerId}: 空の融合状態です。`);
    if (group.memberIds.includes(group.managerId)) {
      errors.push(`${group.managerId}: 関係管理カード自身がmembersに含まれています。`);
    }
    if (new Set(group.memberIds).size !== group.memberIds.length) {
      errors.push(`${group.managerId}: membersが重複しています。`);
    }

    for (const id of グループの全カードID(group)) {
      if (!state.cards[id]) errors.push(`${id}: リンク先カードが存在しません。`);
      const owners = membership.get(id) ?? [];
      owners.push(group.managerId);
      membership.set(id, owners);
    }

    const ids = new Set(グループの全カードID(group));
    const presentKinds = new Set(
      [...ids].map((id) => state.cards[id]?.kind).filter((kind): kind is カード種類 => Boolean(kind))
    );
    for (const kind of ["mention", "location", "tag"] as カード種類[]) {
      const representativeId = group.representatives[kind];
      if (presentKinds.has(kind) && !representativeId) {
        errors.push(`${group.managerId}: ${kind}の代表カードが未選択です。`);
      }
      if (!presentKinds.has(kind) && representativeId) {
        errors.push(`${group.managerId}: 存在しない${kind}カテゴリの代表が指定されています。`);
      }
      if (representativeId && !ids.has(representativeId)) {
        errors.push(`${group.managerId}: ${kind}代表が融合グループ外です。`);
      }
      if (representativeId && state.cards[representativeId]?.kind !== kind) {
        errors.push(`${group.managerId}: ${representativeId}は${kind}代表にできません。`);
      }
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
    const duplicatedId = existingGroup.memberIds[0] ?? existingGroup.managerId;
    const unusedManagerId = Object.keys(state.cards).find((id) => !カードの融合グループを探す(state, id));
    if (unusedManagerId) {
      const managerKind = state.cards[unusedManagerId]?.kind;
      const duplicatedKind = state.cards[duplicatedId]?.kind;
      state.groups[unusedManagerId] = {
        schemaVersion: 2,
        managerId: unusedManagerId,
        memberIds: [duplicatedId],
        representatives: {
          ...(managerKind ? { [managerKind]: unusedManagerId } : {}),
          ...(duplicatedKind ? { [duplicatedKind]: duplicatedId } : {})
        }
      };
      return state;
    }
  }

  const ids = Object.keys(state.cards);
  const first = ids[0];
  const second = ids[1];
  const third = ids[2];
  if (first && second && third) {
    const representatives = (ids: string[]) => Object.fromEntries(
      ids.map((id) => [state.cards[id]?.kind, id]).filter(([kind]) => Boolean(kind))
    );
    state.groups = {
      [first]: { schemaVersion: 2, managerId: first, memberIds: [third], representatives: representatives([first, third]) },
      [second]: { schemaVersion: 2, managerId: second, memberIds: [third], representatives: representatives([second, third]) }
    };
  }
  return state;
}
