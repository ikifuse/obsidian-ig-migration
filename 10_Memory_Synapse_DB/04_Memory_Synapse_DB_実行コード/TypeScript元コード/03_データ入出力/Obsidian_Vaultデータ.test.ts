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
    migrationWarnings: [],
    problems: [],
    elapsedMs: 0, totalMarkdownFiles: 1, totalWikiLinks: 0
  };

  assert.throws(() => {
    状態差分から更新を生成する(oldState, newState, readResult);
  }, /YAMLエラーがあるため書き込みを停止しました（bad）: Invalid structure/);
});

test("future persistence data uses schema version 2 representatives and no display mode", () => {
  const oldState: 融合状態 = {
    cards: {
      "mention-a": { id: "mention-a", kind: "mention", name: "@a", source: {} as any, relatedPosts: [] },
      "tag-a": { id: "tag-a", kind: "tag", name: "#a", source: {} as any, relatedPosts: [] }
    },
    groups: {}
  };
  const newState: 融合状態 = {
    cards: oldState.cards,
    groups: {
      "mention-a": {
        schemaVersion: 2,
        managerId: "mention-a",
        memberIds: ["tag-a"],
        representatives: { mention: "mention-a", tag: "tag-a" }
      }
    }
  };
  const mentionFile = {} as TFile;
  const tagFile = {} as TFile;
  const readResult: Obsidian読取結果 = {
    cards: [],
    cardsById: {
      "mention-a": {
        ...oldState.cards["mention-a"]!,
        file: mentionFile, basename: "@a", path: "Instagram_Logs/Synapses/Mentions/@a.md", wikiLinkCount: 0
      } as any,
      "tag-a": {
        ...oldState.cards["tag-a"]!,
        file: tagFile, basename: "#a", path: "Instagram_Logs/Synapses/Tags/#a.md", wikiLinkCount: 0
      } as any
    },
    groups: {},
    migrationWarnings: [],
    problems: [],
    counts: { tag: 1, mention: 1, location: 0 },
    elapsedMs: 0, totalMarkdownFiles: 2, totalWikiLinks: 0
  };

  const updates = 状態差分から更新を生成する(oldState, newState, readResult);
  assert.equal(updates.length, 1);
  assert.deepEqual(updates[0]?.memorySynapse, {
    schema_version: 2,
    members: ["[[Instagram_Logs/Synapses/Tags/#a.md|#a]]"],
    representatives: {
      mention: "[[Instagram_Logs/Synapses/Mentions/@a.md|@a]]",
      tag: "[[Instagram_Logs/Synapses/Tags/#a.md|#a]]"
    }
  });
  assert.equal("display_mode" in (updates[0]?.memorySynapse ?? {}), false);
});
