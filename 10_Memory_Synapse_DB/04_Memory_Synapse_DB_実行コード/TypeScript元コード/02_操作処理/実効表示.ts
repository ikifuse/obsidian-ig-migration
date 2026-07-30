import type { カード } from "../01_データ構造/カード";

export interface 実効表示値 {
  value: string;
  origin: "手書き" | "移行時点";
}

export function 実効値を選ぶ(handwritten: unknown, source: unknown): 実効表示値 | null {
  const handwrittenText = 値を文字列にする(handwritten);
  if (handwrittenText) return { value: handwrittenText, origin: "手書き" };
  const sourceText = 値を文字列にする(source);
  return sourceText ? { value: sourceText, origin: "移行時点" } : null;
}

export function カードの実効表示名(card: カード): 実効表示値 {
  const handwritten = card.handwritten?.displayName;
  return 実効値を選ぶ(handwritten, card.name) ?? { value: card.name, origin: "移行時点" };
}

function 値を文字列にする(value: unknown): string {
  if (Array.isArray(value)) return value.map(String).map((item) => item.trim()).filter(Boolean).join("\n");
  if (value === null || value === undefined) return "";
  return String(value).trim();
}
