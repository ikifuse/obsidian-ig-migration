import type { カード種類 } from "../01_データ構造/カード";
import type { 操作結果 } from "../01_データ構造/操作結果";
import type { 大きなカード推奨結果, 融合状態 } from "../01_データ構造/融合グループ";
import { カードの融合グループを探す, グループの全カードID, 状態を複製する, 融合候補を展開する } from "./状態参照";
import { 失敗結果, 成功結果, 状態を検証する } from "./状態検証";

const 種類優先順位: Record<カード種類, number> = { mention: 3, location: 2, tag: 1 };

export function 大きなカードを推奨する(
  state: 融合状態,
  sourceId: string,
  receiverId: string
): 大きなカード推奨結果 {
  const candidateIds = 融合候補を展開する(state, sourceId, receiverId);
  const highest = Math.max(...candidateIds.map((id) => 種類優先順位[state.cards[id]?.kind ?? "tag"]));
  const highestIds = candidateIds.filter(
    (id) => 種類優先順位[state.cards[id]?.kind ?? "tag"] === highest
  );
  const receiverGroup = カードの融合グループを探す(state, receiverId);
  const receiverPreferred = receiverGroup?.bigCardId ?? receiverId;

  if (highestIds.length === 1) {
    return {
      candidateIds,
      recommendedIds: highestIds,
      reason: `種類の優先順位（Mention → Location → Tag）で${state.cards[highestIds[0] ?? ""]?.name ?? "候補"}を推奨します。`
    };
  }
  if (highestIds.includes(receiverPreferred)) {
    return {
      candidateIds,
      recommendedIds: [receiverPreferred],
      reason: "同じ最高順位が複数あるため、受け入れる側の現在の大きなカードを推奨します。"
    };
  }
  return {
    candidateIds,
    recommendedIds: highestIds,
    reason: "同じ最高順位が複数あり第一候補を一枚に絞れないため、該当カードをすべて推奨します。"
  };
}

export function カードを融合する(
  current: 融合状態,
  sourceId: string,
  receiverId: string,
  bigCardId: string
): 操作結果 {
  if (sourceId === receiverId) return 失敗結果(current, "同じカード同士は融合できません。");
  const candidateIds = 融合候補を展開する(current, sourceId, receiverId);
  if (!candidateIds.includes(bigCardId)) return 失敗結果(current, "大きなカードを候補から選んでください。");
  const currentErrors = 状態を検証する(current);
  if (currentErrors.length > 0) return 失敗結果(current, `現在の状態が不正です。\n${currentErrors.join("\n")}`);

  const state = 状態を複製する(current);
  for (const [key, group] of Object.entries(state.groups)) {
    if (グループの全カードID(group).some((id) => candidateIds.includes(id))) delete state.groups[key];
  }
  const ordered = [bigCardId, ...candidateIds.filter((id) => id !== bigCardId)];
  const previous = カードの融合グループを探す(current, bigCardId);
  state.groups[bigCardId] = {
    bigCardId,
    memberIds: ordered.slice(1),
    displayMode: previous?.bigCardId === bigCardId ? previous.displayMode : "source"
  };
  return 成功結果(state, `${candidateIds.length}枚を融合しました。`);
}
