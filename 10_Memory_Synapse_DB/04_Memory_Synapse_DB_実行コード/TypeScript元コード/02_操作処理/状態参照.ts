import type { 融合グループ, 融合状態 } from "../01_データ構造/融合グループ";

export function 状態を複製する(state: 融合状態): 融合状態 {
  return structuredClone(state);
}

export function カードの融合グループを探す(
  state: 融合状態,
  cardId: string
): 融合グループ | undefined {
  return Object.values(state.groups).find(
    (group) => group.bigCardId === cardId || group.memberIds.includes(cardId)
  );
}

export function グループの全カードID(group: 融合グループ): string[] {
  return [group.bigCardId, ...group.memberIds];
}

export function 融合候補を展開する(
  state: 融合状態,
  sourceId: string,
  receiverId: string
): string[] {
  const sourceGroup = カードの融合グループを探す(state, sourceId);
  const receiverGroup = カードの融合グループを探す(state, receiverId);
  const sourceIds = sourceGroup ? グループの全カードID(sourceGroup) : [sourceId];
  const receiverIds = receiverGroup ? グループの全カードID(receiverGroup) : [receiverId];
  return [...new Set([...receiverIds, ...sourceIds])];
}
