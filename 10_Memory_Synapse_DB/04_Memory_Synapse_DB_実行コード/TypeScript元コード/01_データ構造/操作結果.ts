import type { 融合状態 } from "./融合グループ";

export interface 操作結果 {
  ok: boolean;
  state: 融合状態;
  message: string;
}
