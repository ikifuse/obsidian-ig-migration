import type { 表示値 } from "../05_共通処理/共通型";
import type { 手書き情報 } from "./手書き情報";

export type カード種類 = "mention" | "location" | "tag";

export interface カード {
  id: string;
  kind: カード種類;
  name: string;
  source: Record<string, 表示値>;
  relatedPosts: string[];
  handwritten?: 手書き情報;
}

export const カード種類表示名: Record<カード種類, string> = {
  mention: "Mention",
  location: "Location",
  tag: "Tag"
};
