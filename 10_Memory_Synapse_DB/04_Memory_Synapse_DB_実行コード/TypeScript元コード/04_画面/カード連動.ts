import type { カード } from "../01_データ構造/カード";

function 参照名を正規化する(value: string): string {
  let normalized = value.trim();
  try {
    normalized = decodeURIComponent(normalized);
  } catch {
    // percent encodingでない通常のカード名はそのまま扱う。
  }
  normalized = normalized
    .replace(/^!??\[\[/, "")
    .replace(/\]\]$/, "")
    .split("|")[0] ?? normalized;
  normalized = normalized
    .replace(/\.md$/i, "")
    .replaceAll("\\", "/")
    .split("/")
    .pop() ?? normalized;
  return normalized.trim().replace(/^#/, "").toLowerCase();
}

function カード名候補(card: カード): string[] {
  const idWithoutKind = card.id.replace(/^(mention|location|tag)-/, "");
  return [card.id, idWithoutKind, card.name].map(参照名を正規化する);
}

export function 参照先カードを探す(cards: Record<string, カード>, reference: string): カード | null {
  const target = 参照名を正規化する(reference);
  if (!target) return null;
  return Object.values(cards).find((card) => カード名候補(card).includes(target)) ?? null;
}

export function カードリンク候補か(
  reference: string,
  visibleText: string,
  sourcePath: string,
  isTagLink: boolean
): boolean {
  const raw = reference.trim();
  const text = visibleText.trim();
  if (isTagLink || text.startsWith("#") || text.startsWith("@")) return true;
  if (/\/(Tags|Mentions|Locations)\//i.test(raw)) return true;
  if (!/(^|\/)(Posts|Reels|Stories)\//i.test(sourcePath)) return false;
  if (!raw || /(^|\/)instagram$/i.test(raw) || /\.json$/i.test(raw)) return false;
  if (/_(IG|IGR|IGS)_\d+$/i.test(raw)) return false;
  return !/\.(png|jpe?g|gif|webp|mp4|mov|webm)$/i.test(raw);
}
