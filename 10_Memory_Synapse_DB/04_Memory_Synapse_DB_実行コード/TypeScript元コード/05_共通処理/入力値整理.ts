export function 対象ルートを整理する(value: string): string {
  return value.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
}

export function 複数行を一覧にする(value: string): string[] {
  return 重複と空欄を除く(value.split("\n"));
}

export function 重複と空欄を除く(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
