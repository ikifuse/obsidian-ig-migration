import assert from "node:assert/strict";
import test from "node:test";
import { 対象ルートを整理する as normalizeRoot } from "../05_共通処理/入力値整理";
import { パスからカード種類を判定する as kindFromPath } from "./Obsidian_Vaultデータ";

test("normalizes the configured Vault-relative root", () => {
  assert.equal(normalizeRoot("/Instagram_Logs\\Synapses/"), "Instagram_Logs/Synapses");
});

test("recognizes only the three direct card folders", () => {
  const root = "Instagram_Logs/Synapses";
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Tags/SampleTagA.md", root), "tag");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Mentions/user.md", root), "mention");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Locations/place.md", root), "location");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Tags/nested/value.md", root), null);
  assert.equal(kindFromPath("Other/Synapses/Tags/SampleTagA.md", root), null);
});

import { 状態差分から更新を生成する } from "./トランザクション生成";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import type { Obsidian読取結果 } from "./Obsidian_Vaultデータ";
import type { TFile } from "obsidian";

test("blocks writing to a card if it has yamlError", () => {
  const oldState: 融合状態 = { cards: {}, groups: {} };
  const newState: 融合状態 = {
    cards: {
      "tag-bad": { id: "tag-bad", kind: "tag", name: "bad", source: {} as any, relatedPosts: [], handwritten: { name: "edited" } as any }
    },
    groups: {}
  };
  const readResult: Obsidian読取結果 = {
    cards: [],
    cardsById: {
      "tag-bad": {
        id: "tag-bad", kind: "tag", name: "bad", source: {} as any, relatedPosts: [], file: {} as TFile, basename: "bad", path: "Tags/bad.md", wikiLinkCount: 0,
        yamlError: "Invalid structure"
      }
    },
    groups: {},
    counts: { tag: 1, mention: 0, location: 0 },
    elapsedMs: 0, totalMarkdownFiles: 1, totalWikiLinks: 0
  };

  assert.throws(() => {
    状態差分から更新を生成する(oldState, newState, readResult);
  }, /YAMLエラーがあるため書き込みを停止しました（bad）: Invalid structure/);
});
