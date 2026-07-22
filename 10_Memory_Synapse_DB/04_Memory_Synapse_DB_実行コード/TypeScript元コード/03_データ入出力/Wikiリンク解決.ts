export interface Wikiリンク内訳 {
  path: string;
  displayName?: string;
}

export function Wikiリンクを分解する(value: string): Wikiリンク内訳 | null {
  const match = value.trim().match(/^!??\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|([^\]]+))?\]\]$/);
  if (!match?.[1]) return null;
  return {
    path: match[1].trim(),
    displayName: match[2]?.trim() || undefined
  };
}
