import { カード種類表示名, type カード, type カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { カードの実効表示名 } from "../02_操作処理/実効表示";
import { グループの全カードID } from "../02_操作処理/状態参照";

export type 一覧状態絞り込み = "all" | "single" | "manager" | "merged";

export interface 一覧項目 {
  key: string;
  type: "single" | "group" | "merged-card";
  cardIds: string[];
  managerId?: string;
}

export interface 一覧絞り込み {
  kind: カード種類 | "all";
  status: 一覧状態絞り込み;
  handwrittenOnly: boolean;
  search: string;
}

export function 知識単位一覧を作る(state: 融合状態): 一覧項目[] {
  const groupedIds = new Set<string>();
  const groups = Object.values(state.groups).map((group) => {
    const cardIds = グループの全カードID(group);
    for (const id of cardIds) groupedIds.add(id);
    return {
      key: `group:${group.managerId}`,
      type: "group" as const,
      managerId: group.managerId,
      cardIds
    };
  });
  const singles = Object.keys(state.cards)
    .filter((id) => !groupedIds.has(id))
    .map((id) => ({ key: `single:${id}`, type: "single" as const, cardIds: [id] }));
  return [...groups, ...singles];
}

export function 表示一覧を作る(state: 融合状態, filter: 一覧絞り込み): {
  total: number;
  items: 一覧項目[];
} {
  const knowledgeUnits = 知識単位一覧を作る(state);
  if (filter.status === "merged") {
    const mergedCards = Object.values(state.groups).flatMap((group) =>
      グループの全カードID(group).map((id) => ({
        key: `merged:${group.managerId}:${id}`,
        type: "merged-card" as const,
        managerId: group.managerId,
        cardIds: [id]
      }))
    );
    return {
      total: mergedCards.length,
      items: mergedCards.filter((item) => 一覧項目が一致する(state, item, filter))
    };
  }

  const statusItems = knowledgeUnits.filter((item) => {
    if (filter.status === "single") return item.type === "single";
    if (filter.status === "manager") return item.type === "group";
    return true;
  });
  return {
    total: knowledgeUnits.length,
    items: statusItems.filter((item) => 一覧項目が一致する(state, item, filter))
  };
}

function 一覧項目が一致する(state: 融合状態, item: 一覧項目, filter: 一覧絞り込み): boolean {
  const cards = item.cardIds
    .map((id) => state.cards[id])
    .filter((card): card is カード => Boolean(card));
  if (filter.kind !== "all" && !cards.some((card) => card.kind === filter.kind)) return false;
  if (filter.handwrittenOnly && !cards.some((card) => Boolean(card.handwritten))) return false;
  const query = filter.search.trim().toLowerCase();
  if (!query) return true;
  return cards.some((card) => カードが検索に一致する(card, query));
}

function カードが検索に一致する(card: カード, query: string): boolean {
  return [
    card.name,
    card.handwritten?.displayName,
    ...(card.handwritten?.aliases ?? []),
    ...card.relatedPosts,
    JSON.stringify(card.source)
  ].join("\n").toLowerCase().includes(query);
}

export function 現在地を説明する(state: 融合状態, selectedId: string): string {
  const selected = state.cards[selectedId];
  if (!selected) return "選択したカードが見つかりません。";
  const group = Object.values(state.groups).find((item) => グループの全カードID(item).includes(selectedId));
  if (!group) return "単独カード・どの融合グループにも所属していません";

  const manager = state.cards[group.managerId];
  const roles: string[] = [];
  if (group.managerId === selectedId) roles.push("関係管理カード");
  for (const kind of ["mention", "location", "tag"] as カード種類[]) {
    if (group.representatives[kind] === selectedId) roles.push(`${カード種類表示名[kind]}カテゴリ代表`);
  }
  if (roles.length === 0) roles.push("構成員");
  return `融合グループ「${manager ? カードの実効表示名(manager).value : group.managerId}」 → 関係管理カード：${manager?.name ?? group.managerId} → このカードの役割：${roles.join("・")}`;
}
