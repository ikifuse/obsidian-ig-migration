import type { 融合状態 } from "../01_データ構造/融合グループ";
import type { FileUpdate, Obsidian読取結果 } from "./Obsidian_Vaultデータ";

export function 状態差分から更新を生成する(
  oldState: 融合状態,
  newState: 融合状態,
  readResult: Obsidian読取結果
): FileUpdate[] {
  const updates = new Map<string, FileUpdate>();

  function getUpdate(id: string): FileUpdate {
    if (!updates.has(id)) {
      const card = readResult.cardsById[id];
      if (!card) throw new Error(`TFile not found for card ${id}`);
      if (card.yamlError) throw new Error(`YAMLエラーがあるため書き込みを停止しました（${card.name}）: ${card.yamlError}`);
      updates.set(id, { file: card.file });
    }
    return updates.get(id)!;
  }

  // 1. Check Handwritten Note changes
  for (const id of Object.keys(newState.cards)) {
    const oldNote = oldState.cards[id]?.handwritten;
    const newNote = newState.cards[id]?.handwritten;
    if (JSON.stringify(oldNote) !== JSON.stringify(newNote)) {
      getUpdate(id).handwrittenNote = newNote ?? null;
    }
  }

  // 2. Check Group (Memory Synapse) changes
  const oldGroups = oldState.groups;
  const newGroups = newState.groups;

  const allManagerIds = new Set([...Object.keys(oldGroups), ...Object.keys(newGroups)]);

  for (const managerId of allManagerIds) {
    const oldGroup = oldGroups[managerId];
    const newGroup = newGroups[managerId];
    
    if (!oldGroup && newGroup) {
      getUpdate(managerId).memorySynapse = 永続化用グループ(newGroup, readResult);
    } else if (oldGroup && !newGroup) {
      getUpdate(managerId).memorySynapse = null;
    } else if (oldGroup && newGroup) {
      if (JSON.stringify(oldGroup) !== JSON.stringify(newGroup)) {
        getUpdate(managerId).memorySynapse = 永続化用グループ(newGroup, readResult);
      }
    }
  }

  return Array.from(updates.values());
}

function 永続化用グループ(
  group: 融合状態["groups"][string],
  readResult: Obsidian読取結果
): Record<string, unknown> {
  const wiki = (id: string): string => {
    const card = readResult.cardsById[id];
    return card?.path ? `[[${card.path}|${card.name}]]` : id;
  };
  return {
    schema_version: 2,
    members: group.memberIds.map(wiki),
    representatives: Object.fromEntries(
      Object.entries(group.representatives).map(([kind, id]) => [kind, wiki(id)])
    )
  };
}
