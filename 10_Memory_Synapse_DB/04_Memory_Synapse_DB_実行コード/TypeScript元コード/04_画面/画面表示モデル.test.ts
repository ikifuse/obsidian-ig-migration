import assert from "node:assert/strict";
import test from "node:test";
import type { カード, カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 現在地を説明する, 表示一覧を作る, 知識単位一覧を作る } from "./画面表示モデル";

function card(id: string, kind: カード種類, name = id): カード {
  const common = { id, kind, name, relatedPosts: [], handwritten: undefined };
  if (kind === "tag") return { ...common, kind, source: { hashtag_note: { hashtag: name, note: null } } };
  if (kind === "mention") {
    return { ...common, kind, source: { mention_note: { mention: name, name: null, phone: [], web: [], note: null } } };
  }
  return {
    ...common,
    kind,
    source: {
      location_note: { location: name }, geo: { lat: null, lng: null, alt: null },
      address: { full: null, components: { country: null, prefecture: null, city: null, district: null, street: null, postal_code: null } },
      activity_id: null, source_files: [], note: null
    }
  };
}

function state(): 融合状態 {
  return {
    cards: {
      m1: card("m1", "mention", "@manager"),
      l1: card("l1", "location", "場所"),
      t1: card("t1", "tag", "#単独")
    },
    groups: {
      m1: { schemaVersion: 2, managerId: "m1", memberIds: ["l1"], representatives: { mention: "m1", location: "l1" } }
    }
  };
}

test("通常一覧は融合グループ全体を一知識単位として数える", () => {
  const items = 知識単位一覧を作る(state());
  assert.equal(items.length, 2);
  assert.deepEqual(items.map((item) => item.type), ["group", "single"]);
});

test("融合済み絞り込みだけは構成カードを個別に表示する", () => {
  const result = 表示一覧を作る(state(), { kinds: new Set(), status: "merged", handwrittenOnly: false, search: "" });
  assert.equal(result.total, 2);
  assert.deepEqual(result.items.map((item) => item.cardIds[0]), ["m1", "l1"]);
});

test("融合グループの検索は全構成カードを対象にする", () => {
  const result = 表示一覧を作る(state(), { kinds: new Set(), status: "all", handwrittenOnly: false, search: "場所" });
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.type, "group");
});

test("種類は複数を同時に絞り込める", () => {
  const result = 表示一覧を作る(state(), {
    kinds: new Set(["mention", "tag"]), status: "all", handwrittenOnly: false, search: ""
  });
  assert.equal(result.items.length, 2);
  assert.deepEqual(result.items.map((item) => item.type), ["group", "single"]);
});

test("現在地は関係管理カードとカテゴリ代表を同時に示す", () => {
  assert.match(現在地を説明する(state(), "m1"), /関係管理カード・Mentionカテゴリ代表/);
  assert.equal(現在地を説明する(state(), "t1"), "単独カード・どの融合グループにも所属していません");
});
