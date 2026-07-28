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

  const allBigCardIds = new Set([...Object.keys(oldGroups), ...Object.keys(newGroups)]);

  for (const bigId of allBigCardIds) {
    const oldGroup = oldGroups[bigId];
    const newGroup = newGroups[bigId];
    
    if (!oldGroup && newGroup) {
      getUpdate(bigId).memorySynapse = {
        schema_version: 1,
        display_mode: newGroup.displayMode,
        members: newGroup.memberIds.map(id => readResult.cardsById[id]?.path ? `[[${readResult.cardsById[id].path}|${readResult.cardsById[id].name}]]` : id)
      };
    } else if (oldGroup && !newGroup) {
      getUpdate(bigId).memorySynapse = null;
    } else if (oldGroup && newGroup) {
      if (JSON.stringify(oldGroup) !== JSON.stringify(newGroup)) {
        getUpdate(bigId).memorySynapse = {
          schema_version: 1,
          display_mode: newGroup.displayMode,
          members: newGroup.memberIds.map(id => readResult.cardsById[id]?.path ? `[[${readResult.cardsById[id].path}|${readResult.cardsById[id].name}]]` : id)
        };
      }
    }
  }

  return Array.from(updates.values());
}
