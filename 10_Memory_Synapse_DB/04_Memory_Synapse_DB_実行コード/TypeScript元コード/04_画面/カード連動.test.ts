import assert from "node:assert/strict";
import test from "node:test";
import type { カード } from "../01_データ構造/カード";
import { カードリンク候補か, 参照先カードを探す } from "./カード連動";

const cards = {
  "mention-@sazae_fuguta": { id: "mention-@sazae_fuguta", kind: "mention", name: "@sazae_fuguta" },
  "location-大阪城": { id: "location-大阪城", kind: "location", name: "大阪城" },
  "tag-#野球バット": { id: "tag-#野球バット", kind: "tag", name: "#野球バット" }
} as Record<string, カード>;

test("SynapseのWikiリンク、表示名、カードIDを同じカードへ解決する", () => {
  assert.equal(参照先カードを探す(cards, "[[Instagram_Logs/Synapses/Tags/野球バット|#野球バット]]")?.id, "tag-#野球バット");
  assert.equal(参照先カードを探す(cards, "Instagram_Logs/Synapses/Mentions/@sazae_fuguta")?.id, "mention-@sazae_fuguta");
  assert.equal(参照先カードを探す(cards, "大阪城")?.id, "location-大阪城");
});

test("投稿・SystemLogsのカードリンクだけを右サイドバー対象にする", () => {
  assert.equal(カードリンク候補か("野球バット", "#野球バット", "Instagram_Logs/Posts/post.md", true), true);
  assert.equal(カードリンク候補か("大阪城", "大阪城", "Instagram_Logs/Posts/post.md", false), true);
  assert.equal(カードリンク候補か("gorucktough", "gorucktough", "Instagram_Logs/Posts/post.md", false), true);
  assert.equal(カードリンク候補か("@goruck", "@goruck", "Instagram_Logs/Posts/post.md", false), true);
  assert.equal(カードリンク候補か("2026-01-30-15-00-00_IG_0001", "投稿", "Instagram_Logs/SystemLogs/場所一覧.md", false), false);
  assert.equal(カードリンク候補か("instagram", "instagram", "Instagram_Logs/Posts/post.md", false), false);
});
