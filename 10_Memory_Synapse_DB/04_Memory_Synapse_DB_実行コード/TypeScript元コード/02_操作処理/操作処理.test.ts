import assert from "node:assert/strict";
import test from "node:test";
import type { カード, カード種類 } from "../01_データ構造/カード";
import { 空の手書き情報 as emptyNote } from "../01_データ構造/手書き情報";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 初期状態を作る as createInitialState } from "../03_データ入出力/ブラウザー内データ";
import { 融合をすべて解体する as dissolveGroup, カードを分離する as splitCard } from "./分離";
import { 大きなカードを変更する as changeBigCard } from "./大きなカード変更";
import { 手書き情報を保存する as saveHandwritten } from "./手書き保存";
import { 多重所属の検証状態を作る as createInvalidMultiMembershipState, 状態を検証する as validateState } from "./状態検証";
import { カードを融合する as mergeCards, 大きなカードを推奨する as recommendBigCard } from "./融合";
import { ブラウザー操作履歴 as BrowserHistory } from "./元に戻す";

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

function knowledgeUnitCount(state: 融合状態): number {
  return Object.keys(state.cards).length
    - Object.values(state.groups).reduce((count, group) => count + group.memberIds.length, 0);
}

test("browser sample starts with 90 cards, two fused groups, and 88 knowledge units", () => {
  const state = createInitialState();
  assert.equal(Object.keys(state.cards).length, 90);
  assert.equal(Object.keys(state.groups).length, 2);
  assert.equal(knowledgeUnitCount(state), 88);
  assert.deepEqual(validateState(state), []);
});

test("fusion reduces the knowledge-unit count and separation restores it", () => {
  const state = createInitialState();
  const merged = mergeCards(state, "mention-@sazae_fuguta", "mention-@masuo_fuguta", "mention-@sazae_fuguta");
  assert.equal(merged.ok, true);
  assert.equal(knowledgeUnitCount(merged.state), 87);

  const separated = splitCard(merged.state, "mention-@sazae_fuguta", "mention-@masuo_fuguta");
  assert.equal(separated.ok, true);
  assert.equal(knowledgeUnitCount(separated.state), 88);
  assert.equal(Object.keys(separated.state.cards).length, 90);
});

test("Mention and Location recommends Mention", () => {
  const state = operationState();
  const recommendation = recommendBigCard(state, "mention-a", "location-a");
  assert.deepEqual(recommendation.recommendedIds, ["mention-a"]);
});

test("Location and Tag recommends Location", () => {
  const recommendation = recommendBigCard(operationState(), "tag-a", "location-a");
  assert.deepEqual(recommendation.recommendedIds, ["location-a"]);
});

test("same-kind fusion recommends the receiving card but does not remove other candidates", () => {
  const state = operationState();
  const tagRecommendation = recommendBigCard(state, "tag-a", "tag-b");
  const mentionRecommendation = recommendBigCard(state, "mention-a", "mention-b");
  assert.deepEqual(tagRecommendation.recommendedIds, ["tag-b"]);
  assert.deepEqual(mentionRecommendation.recommendedIds, ["mention-b"]);
  assert.deepEqual(tagRecommendation.candidateIds, ["tag-b", "tag-a"]);
  assert.deepEqual(mentionRecommendation.candidateIds, ["mention-b", "mention-a"]);
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

test("splitting the big card lets the human choose the next big card", () => {
  const state = operationState();
  state.groups = {
    "mention-a": { bigCardId: "mention-a", memberIds: ["location-a", "tag-a"], displayMode: "source" }
  };
  const result = splitCard(state, "mention-a", "mention-a", "location-a");
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["location-a"]?.memberIds, ["tag-a"]);
  assert.equal(result.state.groups["mention-a"], undefined);
});

test("handwritten information stays on its individual card through big-card changes and dissolution", () => {
  const state = operationState();
  const note = structuredClone(emptyNote);
  note.displayName = "人間が付けた表示名";
  const withNote = saveHandwritten(state, "mention-a", note);
  assert.equal(withNote.ok, true);

  const merged = mergeCards(withNote.state, "mention-a", "location-a", "mention-a");
  assert.equal(merged.ok, true);
  const changed = changeBigCard(merged.state, "mention-a", "location-a", "source");
  assert.equal(changed.ok, true);
  assert.equal(changed.state.cards["mention-a"]?.handwritten?.displayName, "人間が付けた表示名");

  const dissolved = dissolveGroup(changed.state, "location-a");
  assert.equal(dissolved.ok, true);
  assert.equal(dissolved.state.cards["mention-a"]?.handwritten?.displayName, "人間が付けた表示名");
});

test("saving handwritten information on the big card switches only that group to handwritten display", () => {
  const state = operationState();
  const merged = mergeCards(state, "mention-a", "location-a", "mention-a");
  assert.equal(merged.ok, true);
  const note = structuredClone(emptyNote);
  note.note = "人間が追加した記憶";
  const saved = saveHandwritten(merged.state, "mention-a", note);
  assert.equal(saved.ok, true);
  assert.equal(saved.state.groups["mention-a"]?.displayMode, "handwritten");
  assert.equal(saved.state.cards["location-a"]?.handwritten, undefined);
});

test("browser history restores the state before the last successful operation", () => {
  const state = operationState();
  const history = new BrowserHistory();
  history.保存する(state);
  const merged = mergeCards(state, "mention-a", "location-a", "mention-a");
  assert.equal(merged.ok, true);
  const restored = history.直前へ戻す();
  assert.deepEqual(restored, state);
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
