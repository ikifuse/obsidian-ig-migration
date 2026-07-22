import assert from "node:assert/strict";
import test from "node:test";
import { 初期状態を作る as createInitialState } from "../03_データ入出力/ブラウザー内データ";
import { カードを分離する as splitCard } from "./分離";
import { 多重所属の検証状態を作る as createInvalidMultiMembershipState, 状態を検証する as validateState } from "./状態検証";
import { カードを融合する as mergeCards, 大きなカードを推奨する as recommendBigCard } from "./融合";

test("Mention and Location recommends Mention", () => {
  const state = createInitialState();
  const recommendation = recommendBigCard(state, "mention-friend", "location-american");
  assert.deepEqual(recommendation.recommendedIds, ["mention-friend"]);
});

test("merging two groups flattens all members", () => {
  const state = createInitialState();
  const result = mergeCards(state, "mention-cafe", "location-gala", "mention-cafe");
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["mention-cafe"]?.memberIds, ["location-gala", "tag-goruck", "tag-food"]);
  assert.equal(Object.keys(result.state.groups).length, 1);
});

test("splitting until one remains removes the group", () => {
  const state = createInitialState();
  const result = splitCard(state, "mention-cafe", "tag-food");
  assert.equal(result.ok, true);
  assert.equal(result.state.groups["mention-cafe"], undefined);
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
