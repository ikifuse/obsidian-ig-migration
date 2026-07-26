export function Wikiリンク数を数える(markdown: string): number {
  return markdown.match(/!??\[\[[^\]]+\]\]/g)?.length ?? 0;
}

export function Wikiリンク文字列を取り出す(markdown: string): string[] {
  return markdown.match(/!??\[\[[^\]]+\]\]/g) ?? [];
}

export function YAMLブロックを抽出する(markdown: string, heading: string): string | null {
  const regex = new RegExp(`^## ${heading}\\n+[\\s\\S]*?\\n\`\`\`yaml\\n([\\s\\S]*?)\\n\`\`\``, "m");
  const match = markdown.match(regex);
  return match ? (match[1] ?? null) : null;
}

export function 最初のYAMLブロックを抽出する(markdown: string): string | null {
  const match = markdown.match(/```yaml\n([\s\S]*?)\n```/);
  return match ? (match[1] ?? null) : null;
}

export function 関連投稿を抽出する(markdown: string): string[] {
  const match = markdown.match(/^## 関連投稿\n+([\s\S]*?)(?=\n^## |$)/m);
  if (!match || !match[1]) return [];
  return Wikiリンク文字列を取り出す(match[1]);
}

export function YAMLブロックを置換する(markdown: string, heading: string, newYaml: string | null): string {
  const removeRegex = new RegExp(`\\n*^## ${heading}\\n[\\s\\S]*?(?=\\n^## |$)`, "m");
  if (newYaml === null) {
    return markdown.replace(removeRegex, "");
  }

  const blockRegex = new RegExp(`(^\\n*## ${heading}\\n+[\\s\\S]*?\\n\`\`\`yaml\\n)([\\s\\S]*?)(\\n\`\`\`)`, "m");
  if (blockRegex.test(markdown)) {
    return markdown.replace(blockRegex, `$1${newYaml}$3`);
  }

  const newBlock = `\\n\\n## ${heading}\\n\\n\`\`\`yaml\\n${newYaml}\\n\`\`\``;
  if (heading === "Memory Synapse") {
    const tegakiMatch = markdown.match(/\\n*^## 手書き情報\\n/m);
    if (tegakiMatch && tegakiMatch.index !== undefined) {
      return markdown.substring(0, tegakiMatch.index) + newBlock + markdown.substring(tegakiMatch.index);
    }
  }
  return markdown.trimEnd() + newBlock + "\\n";
}
