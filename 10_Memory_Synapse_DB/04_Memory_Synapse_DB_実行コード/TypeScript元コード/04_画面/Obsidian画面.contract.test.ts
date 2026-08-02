import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./Obsidian画面.ts", import.meta.url), "utf8");

test("投稿リンクは中央を置き換えず右サイドバーへ連動する", () => {
  assert.match(source, /getRightLeaf\(false\)/);
  assert.match(source, /SIDEBAR_VIEW_TYPE/);
  assert.match(source, /event\.preventDefault\(\)/);
  assert.match(source, /renderSelectedSidebar/);
});

test("SystemLogsへ重複チェックボックスを追加しない", () => {
  assert.match(source, /msdb-system-log-tree/);
  assert.doesNotMatch(source, /document\.createElement\("input"\)/);
  assert.doesNotMatch(source, /msdb-tree-checkbox/);
});
