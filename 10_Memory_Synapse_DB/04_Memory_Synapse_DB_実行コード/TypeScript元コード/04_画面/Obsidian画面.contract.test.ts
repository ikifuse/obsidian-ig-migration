import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./Obsidian画面.ts", import.meta.url), "utf8");

test("投稿リンクは中央を置き換えず右サイドバーへ連動する", () => {
  assert.match(source, /getRightLeaf\(false\)/);
  assert.match(source, /SIDEBAR_VIEW_TYPE/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /event\.stopImmediatePropagation\(\)/);
  assert.match(source, /renderSelectedSidebar/);
});

test("閲覧モードとライブプレビューのリンクだけを連動対象にする", () => {
  assert.match(source, /a\.internal-link, a\.tag/);
  assert.match(source, /\.markdown-source-view\.is-live-preview \.cm-hmd-internal-link/);
  assert.match(source, /\.markdown-source-view\.is-live-preview \.cm-hashtag/);
  assert.doesNotMatch(source, /\.markdown-source-view:not\(\.is-live-preview\)/);
});

test("SystemLogsへ重複チェックボックスを追加しない", () => {
  assert.match(source, /msdb-system-log-tree/);
  assert.doesNotMatch(source, /document\.createElement\("input"\)/);
  assert.doesNotMatch(source, /msdb-tree-checkbox/);
});

test("対象Markdownの作成・変更・改名・移動・削除を検知して再読込する", () => {
  assert.match(source, /vault\.on\("create"/);
  assert.match(source, /vault\.on\("modify"/);
  assert.match(source, /vault\.on\("rename"/);
  assert.match(source, /vault\.on\("delete"/);
  assert.match(source, /scheduleRefresh/);
});

test("画面上部と実行確認に読み取り専用の三条件を表示する", () => {
  assert.match(source, /読み取り専用/);
  assert.match(source, /変更は保存されません/);
  assert.match(source, /再読込でVaultの状態へ戻ります/);
});

test("Location集約表示に活動IDと元ファイルを含める", () => {
  assert.match(source, /activityId: card\.source\.activity_id/);
  assert.match(source, /sourceFiles: card\.source\.source_files/);
  assert.match(source, /\["activityId", "活動ID"\]/);
  assert.match(source, /\["sourceFiles", "元ファイル"\]/);
});

test("融合グループは受け皿で全個別カードを表示する", () => {
  assert.match(source, /受け皿 — 全個別カード/);
  assert.match(source, /groupCardIds\(group\)/);
  assert.match(source, /renderIndividualCard\(item, card\)/);
  assert.match(source, /renderRelatedPosts\(item, card, fileCard\.path\)/);
});
