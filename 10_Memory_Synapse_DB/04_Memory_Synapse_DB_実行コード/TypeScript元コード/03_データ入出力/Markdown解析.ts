export function Wikiリンク数を数える(markdown: string): number {
  return markdown.match(/!??\[\[[^\]]+\]\]/g)?.length ?? 0;
}

export function Wikiリンク文字列を取り出す(markdown: string): string[] {
  return markdown.match(/!??\[\[[^\]]+\]\]/g) ?? [];
}
