import assert from "node:assert/strict";
import test from "node:test";
import type { カード, カード種類 } from "../01_データ構造/カード";
import { 空の手書き情報 as emptyNote } from "../01_データ構造/手書き情報";
import type { 融合状態 } from "../01_データ構造/融合グループ";
import { 融合をすべて解体する as dissolveGroup, カードを分離する as splitCard } from "./分離";
import { カテゴリ代表を変更する as changeRepresentative, 関係管理カードを変更する as changeManager } from "./関係管理・代表変更";
import { 手書き情報を保存する as saveHandwritten } from "./手書き保存";
import { 多重所属の検証状態を作る as createInvalidMultiMembershipState, 状態を検証する as validateState } from "./状態検証";
import {
  カテゴリ別代表を推奨する as recommendRepresentatives,
  カードを融合する as mergeCards,
  関係管理カードを推奨する as recommendManager
} from "./融合";
import { カードの実効表示名 as effectiveDisplayName, 実効値を選ぶ as effectiveValue } from "./実効表示";
import { ブラウザー操作履歴 as BrowserHistory } from "./元に戻す";

function card(id: string, kind: カード種類): カード {
  return { id, kind, name: id, source: {} as any, relatedPosts: [] };
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

function group(managerId: string, memberIds: string[], representatives: Record<string, string>) {
  return { schemaVersion: 2 as const, managerId, memberIds, representatives };
}

function merge(
  state: 融合状態,
  sourceId: string,
  receiverId: string,
  managerId: string
) {
  const candidates = [receiverId, sourceId];
  const recommendation = recommendRepresentatives(state, candidates, receiverId);
  return mergeCards(state, sourceId, receiverId, managerId, recommendation.representatives);
}

test("manager recommendation follows Mention, Location, Tag and receiver-side tie breaking", () => {
  const state = operationState();
  assert.deepEqual(recommendManager(state, "mention-a", "location-a").recommendedIds, ["mention-a"]);
  assert.deepEqual(recommendManager(state, "tag-a", "location-a").recommendedIds, ["location-a"]);
  assert.deepEqual(recommendManager(state, "mention-a", "mention-b").recommendedIds, ["mention-b"]);
});

test("category representatives are independent from the relationship manager", () => {
  const state = operationState();
  const result = merge(state, "mention-a", "location-a", "mention-a");
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["mention-a"]?.representatives, {
    mention: "mention-a",
    location: "location-a"
  });
  const changed = changeRepresentative(result.state, "mention-a", "location", "location-a");
  assert.equal(changed.ok, true);
});

test("same-category multiple candidates require an explicit representative when no receiver preference exists", () => {
  const state = operationState();
  const recommendation = recommendRepresentatives(state, ["mention-a", "mention-b"], "location-a");
  assert.deepEqual(recommendation.unresolvedKinds, ["mention"]);
  const result = mergeCards(state, "mention-a", "mention-b", "mention-b", {});
  assert.equal(result.ok, false);
  assert.match(result.message, /mentionの代表カードが未選択/);
});

test("merging groups flattens members and keeps one representative per present category", () => {
  const state = operationState();
  state.groups = {
    "mention-a": group("mention-a", ["tag-a"], { mention: "mention-a", tag: "tag-a" }),
    "location-a": group("location-a", ["tag-b"], { location: "location-a", tag: "tag-b" })
  };
  const result = mergeCards(state, "mention-a", "location-a", "mention-a", {
    mention: "mention-a",
    location: "location-a",
    tag: "tag-b"
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["mention-a"]?.memberIds, ["location-a", "tag-b", "tag-a"]);
  assert.equal(Object.keys(result.state.groups).length, 1);
});

test("splitting the manager requires the next manager but preserves independent representatives", () => {
  const state = operationState();
  state.groups = {
    "mention-a": group(
      "mention-a",
      ["location-a", "tag-a"],
      { mention: "mention-a", location: "location-a", tag: "tag-a" }
    )
  };
  const result = splitCard(state, "mention-a", "mention-a", "location-a");
  assert.equal(result.ok, true);
  assert.deepEqual(result.state.groups["location-a"]?.memberIds, ["tag-a"]);
  assert.deepEqual(result.state.groups["location-a"]?.representatives, {
    location: "location-a",
    tag: "tag-a"
  });
});

test("splitting a representative chooses automatically only when one same-category card remains", () => {
  const state = operationState();
  state.groups = {
    "mention-a": group(
      "mention-a",
      ["mention-b", "location-a"],
      { mention: "mention-b", location: "location-a" }
    )
  };
  const result = splitCard(state, "mention-a", "mention-b");
  assert.equal(result.ok, true);
  assert.equal(result.state.groups["mention-a"]?.representatives.mention, "mention-a");
});

test("handwritten values stay on individual cards and override source only field by field", () => {
  const state = operationState();
  const note = structuredClone(emptyNote);
  note.displayName = "人間が付けた表示名";
  const withNote = saveHandwritten(state, "mention-a", note);
  assert.equal(withNote.ok, true);
  const merged = merge(withNote.state, "mention-a", "location-a", "mention-a");
  assert.equal(merged.ok, true);
  const changed = changeManager(merged.state, "mention-a", "location-a");
  assert.equal(changed.ok, true);
  assert.equal(effectiveDisplayName(changed.state.cards["mention-a"]!).value, "人間が付けた表示名");
  assert.deepEqual(effectiveValue("", "移行時点の値"), { value: "移行時点の値", origin: "移行時点" });
  assert.deepEqual(effectiveValue("手書きの値", "移行時点の値"), { value: "手書きの値", origin: "手書き" });
  const dissolved = dissolveGroup(changed.state, "location-a");
  assert.equal(dissolved.state.cards["mention-a"]?.handwritten?.displayName, "人間が付けた表示名");
});

test("browser history restores the state before the last successful operation", () => {
  const state = operationState();
  const history = new BrowserHistory();
  history.保存する(state);
  assert.equal(merge(state, "mention-a", "location-a", "mention-a").ok, true);
  assert.deepEqual(history.直前へ戻す(), state);
});

test("multi-membership is rejected by validation", () => {
  const invalid = createInvalidMultiMembershipState(operationState());
  assert.match(validateState(invalid).join("\n"), /多重所属/);
});

test("dissolving keeps individual cards and removes only the group", () => {
  const state = operationState();
  const merged = merge(state, "mention-a", "location-a", "mention-a");
  assert.equal(merged.ok, true);
  const dissolved = dissolveGroup(merged.state, "mention-a");
  assert.equal(dissolved.ok, true);
  assert.equal(Object.keys(dissolved.state.groups).length, 0);
  assert.equal(Object.keys(dissolved.state.cards).length, 6);
});
