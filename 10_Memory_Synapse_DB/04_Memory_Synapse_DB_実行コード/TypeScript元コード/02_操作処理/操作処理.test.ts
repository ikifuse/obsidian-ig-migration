import assert from "node:assert/strict";
import test from "node:test";
import type { カード, カード種類 } from "../01_データ構造/カード";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 初期状態を作る as createInitialState } from "../03_データ入出力/ブラウザー内データ";
import { カードを分離する as splitCard } from "./分離";
import { 多重所属の検証状態を作る as createInvalidMultiMembershipState, 状態を検証する as validateState } from "./状態検証";
import { カードを融合する as mergeCards, 大きなカードを推奨する as recommendBigCard } from "./融合";

function card(id: string, kind: カード種類): カード {
  return { id, kind, name: id, source: {}, relatedPosts: [] };
}

function operationState(): 融合状態 {
  return {
    cards: {
      "mention-a": card("mention-a", "mention"),
      "mention-b": card("mention-b", "mention"),
      "location-a": card("location-a", "location"),
      "location-b": card("location-b", "location"),
      "tag-a": card("tag-a", "tag"),
      "tag-b": card("tag-b", "tag")
    },
    groups: {}
  };
}

test("browser sample starts with 90 standalone valid cards", () => {
  const state = createInitialState();
  assert.equal(Object.keys(state.cards).length, 90);
  assert.deepEqual(state.groups, {});
  assert.deepEqual(validateState(state), []);
});

test("Mention and Location recommends Mention", () => {
  const state = operationState();
  const recommendation = recommendBigCard(state, "mention-a", "location-a");
  assert.deepEqual(recommendation.recommendedIds, ["mention-a"]);
});

test("merging two groups flattens all members", () => {
  const state = operationState();
  state.groups = {
    "mention-a": { bigCardId: "mention-a", memberIds: ["tag-a"], displayMode: "source" },
    "location-a": { bigCardId: "location-a", memberIds: ["tag-b"], displayMode: "source" }
  };
  const result = mergeCards(state, "mention-a", "location-a", "mention-a");
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["mention-a"]?.memberIds, ["location-a", "tag-b", "tag-a"]);
  assert.equal(Object.keys(result.state.groups).length, 1);
});

test("splitting until one remains removes the group", () => {
  const state = operationState();
  state.groups = {
    "mention-a": { bigCardId: "mention-a", memberIds: ["tag-a"], displayMode: "source" }
  };
  const result = splitCard(state, "mention-a", "tag-a");
  assert.equal(result.ok, true);
  assert.equal(result.state.groups["mention-a"], undefined);
});

test("multi-membership is rejected by validation", () => {
  const invalid = createInvalidMultiMembershipState(createInitialState());
  assert.match(validateState(invalid).join("\n"), /多重所属/);
});

test("multi-membership test remains reproducible after groups are removed", () => {
  const state = createInitialState();
  state.groups = {};
  const invalid = createInvalidMultiMembershipState(state);
  assert.match(validateState(invalid).join("\n"), /多重所属/);
});
