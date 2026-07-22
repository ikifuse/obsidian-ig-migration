import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 状態を複製する } from "./状態参照";

export class ブラウザー操作履歴 {
  private readonly snapshots: 融合状態[] = [];

  保存する(state: 融合状態): void {
    this.snapshots.push(状態を複製する(state));
  }

  直前へ戻す(): 融合状態 | undefined {
    return this.snapshots.pop();
  }

  初期化する(): void {
    this.snapshots.length = 0;
  }

  件数(): number {
    return this.snapshots.length;
  }
}
