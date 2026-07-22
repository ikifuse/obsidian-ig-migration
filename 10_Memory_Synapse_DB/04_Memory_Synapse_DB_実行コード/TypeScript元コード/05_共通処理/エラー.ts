export function エラー内容を文字列にする(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
