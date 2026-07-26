import assert from "node:assert/strict";
import test from "node:test";
import { 初期状態を作る as createInitialState } from "./ブラウザー内データ";
import { 検証用親工程ログ一覧 as parentLogs } from "./検証用親工程ログ";
import {
  SystemLogのカードID一覧 as cardIdsForSystemLog,
  検証用SystemLog一覧 as systemLogs
} from "./検証用SystemLogs";

test("検証用カードはMention・Location・Tag各30枚を単独状態で開始する", () => {
  const state = createInitialState();
  const cards = Object.values(state.cards);
  const kinds = { mention: 0, location: 0, tag: 0 };

  for (const card of cards) kinds[card.kind] += 1;

  assert.equal(cards.length, 90);
  assert.deepEqual(kinds, { mention: 30, location: 30, tag: 30 });
  assert.deepEqual(state.groups, {});
});

test("Tagはスポーツ用品と居酒屋メニューを15件ずつ含む", () => {
  const tagNames = Object.values(createInitialState().cards)
    .filter((card) => card.kind === "tag")
    .map((card) => card.name);
  const sports = [
    "#野球バット", "#野球グローブ", "#サッカーボール", "#サッカースパイク", "#テニスラケット",
    "#テニスボール", "#バスケットボール", "#バスケットゴール", "#ゴルフクラブ", "#ゴルフボール",
    "#ランニングシューズ", "#ダンベル", "#ヨガマット", "#水泳ゴーグル", "#自転車ヘルメット"
  ];
  const izakaya = [
    "#枝豆", "#冷やしトマト", "#だし巻き卵", "#鶏の唐揚げ", "#焼き鳥",
    "#つくね", "#刺身盛り合わせ", "#しめ鯖", "#ほっけ開き", "#揚げ出し豆腐",
    "#フライドポテト", "#もつ煮込み", "#焼きおにぎり", "#生ビール", "#ハイボール"
  ];

  assert.equal(sports.filter((name) => tagNames.includes(name)).length, 15);
  assert.equal(izakaya.filter((name) => tagNames.includes(name)).length, 15);
});

test("親工程形式の検証用ログはPost・Reel・Story各30件ある", () => {
  const logs = Object.values(parentLogs);
  assert.equal(logs.length, 90);
  assert.equal(logs.filter((log) => log.type === "Feed").length, 30);
  assert.equal(logs.filter((log) => log.type === "Reels").length, 30);
  assert.equal(logs.filter((log) => log.type === "Stories").length, 30);
});

test("SystemLogsの三一覧はリンク一覧と同じ90枚を種類別に参照する", () => {
  const state = createInitialState();
  const allIds = systemLogs.flatMap((systemLog) => cardIdsForSystemLog(state, systemLog.id));

  assert.deepEqual(
    systemLogs.map((systemLog) => [systemLog.filename, cardIdsForSystemLog(state, systemLog.id).length]),
    [
      ["ハッシュタグ一覧.md", 30],
      ["メンション一覧.md", 30],
      ["場所一覧.md", 30]
    ]
  );
  assert.deepEqual(new Set(allIds), new Set(Object.keys(state.cards)));
  assert.equal(allIds.length, Object.keys(state.cards).length);
});

test("キャプションは原文で、抽出対象と末尾Wikiリンクを分離している", () => {
  for (const log of Object.values(parentLogs)) {
    assert.ok(log.caption.length > 0, `${log.id}: キャプションが空です`);
    assert.equal(log.caption.includes("[["), false, `${log.id}: 本文へWikiリンクを埋め込んでいます`);
    for (const tag of log.tags) {
      assert.ok(log.caption.includes(`#${tag}`), `${log.id}: #${tag}が本文にありません`);
    }
    for (const mention of log.mentions) {
      assert.ok(log.caption.includes(mention), `${log.id}: ${mention}が本文にありません`);
    }
    assert.equal(log.links[0]?.wiki, "[[instagram]]");
    assert.equal(log.links.slice(1).some((link) => /(?:tag-|mention-|location-)/.test(link.wiki)), false);
    assert.deepEqual(
      log.links.slice(1).map((link) => link.cardId),
      log.relatedCardIds
    );
  }
});

test("名前付きLocationはFeedだけに存在し、Reels・StoriesのGPSはSynapse化しない", () => {
  const feeds = Object.values(parentLogs).filter((log) => log.type === "Feed");
  const reels = Object.values(parentLogs).filter((log) => log.type === "Reels");
  const stories = Object.values(parentLogs).filter((log) => log.type === "Stories");

  assert.equal(feeds.filter((log) => log.location.raw !== null).length, 30);
  assert.equal(reels.filter((log) => log.location.geo.lat !== null).length, 12);
  assert.equal(stories.filter((log) => log.location.geo.lat !== null).length, 6);

  for (const log of [...reels, ...stories]) {
    assert.equal(log.location.raw, null);
    assert.equal(log.location.normalized, null);
    assert.equal(log.location.synapseLink, null);
    assert.equal(
      log.relatedCardIds.some((cardId) => cardId.startsWith("location-")),
      false,
      `${log.id}: 名前のないGPSをLocation Synapseへ関連付けています`
    );
  }
});

test("ログとSynapseカードの関連投稿は双方向に一致する", () => {
  const state = createInitialState();
  for (const card of Object.values(state.cards)) {
    assert.ok(card.relatedPosts.length > 0, `${card.id}: 関連投稿がありません`);
    assert.ok(String(card.source.note ?? "").length > 0, `${card.id}: 検証用情報が空です`);

    for (const postLink of card.relatedPosts) {
      const logId = postLink.replace(/^\[\[/, "").replace(/\]\]$/, "");
      assert.ok(parentLogs[logId], `${card.id}: 存在しないログ ${logId} へのリンクです`);
      assert.ok(parentLogs[logId].relatedCardIds.includes(card.id), `${card.id}: ログ側の逆参照がありません`);
    }
  }

  for (const log of Object.values(parentLogs)) {
    for (const cardId of log.relatedCardIds) {
      assert.ok(state.cards[cardId], `${log.id}: 存在しないカード ${cardId} へのリンクです`);
      assert.ok(state.cards[cardId].relatedPosts.includes(`[[${log.id}]]`), `${log.id}: カード側の逆参照がありません`);
    }
  }
});

test("公開用サンプルにローカルパスや実在サービスへのプロフィールURLを含めない", () => {
  const state = createInitialState();
  const serialized = JSON.stringify({ state, parentLogs });

  assert.equal(serialized.includes("/Users/"), false);
  assert.equal(serialized.includes("file://"), false);
  assert.equal(serialized.includes("www.instagram.com"), false);

  const mentions = Object.values(state.cards).filter((card) => card.kind === "mention");
  for (const card of mentions) {
    const urls = Array.isArray(card.source.web) ? card.source.web : [];
    assert.ok(urls.length > 0, `${card.id}: URL形式の検証値がありません`);
    assert.ok(urls.every((url) => url.startsWith("https://instagram.invalid/")), `${card.id}: 到達可能なプロフィールURLです`);
  }
});
