import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mockRoot = path.join(kitRoot, "ブラウザー確認用モック");
const core = require(path.join(mockRoot, "layout-core.js"));
const detailCore = require(path.join(mockRoot, "detail-view-core.js"));

const [indexHtml, detailScript, layoutScript, styles, appScript] = await Promise.all([
  readFile(path.join(mockRoot, "index.html"), "utf8"),
  readFile(path.join(mockRoot, "detail-view.js"), "utf8"),
  readFile(path.join(mockRoot, "layout.js"), "utf8"),
  readFile(path.join(mockRoot, "styles.css"), "utf8"),
  readFile(path.join(mockRoot, "app.js"), "utf8"),
]);

assert.equal(core.nextPanelWidth("left", 280, -1000, 1440, 340), 180);
assert.equal(core.nextPanelWidth("right", 340, -1000, 1440, 280), 260);
assert.equal(core.nextPanelWidth("left", 280, 1000, 1440, 340), 680);
assert.equal(core.nextPanelWidth("right", 340, 1000, 1440, 280), 740);

assert.match(indexHtml, /layout-core\.js/);
assert.match(indexHtml, /layout\.js/);
assert.match(indexHtml, /detail-view-core\.js/);
assert.match(indexHtml, /detail-view\.js/);
assert.ok(
  indexHtml.indexOf("app.js") < indexHtml.indexOf("detail-view-core.js")
    && indexHtml.indexOf("detail-view-core.js") < indexHtml.indexOf("detail-view.js")
    && indexHtml.indexOf("detail-view.js") < indexHtml.indexOf("layout-core.js")
    && indexHtml.indexOf("layout-core.js") < indexHtml.indexOf("layout.js"),
  "本体描画後に05専用の詳細表示・レイアウト処理を読み込む"
);

for (const requiredText of [
  'makeResizer("left")',
  'makeResizer("right")',
  "mobile-pane-controls",
  "mobile-left-open",
  "mobile-right-open",
  "MutationObserver",
  'addEventListener("resize"',
]) {
  assert.ok(
    layoutScript.includes(requiredText) || styles.includes(requiredText),
    `UI契約がない: ${requiredText}`
  );
}

assert.ok(!layoutScript.includes("localStorage"), "幅を再読込後まで保存しない");
assert.ok(!layoutScript.includes("sessionStorage"), "幅を再読込後まで保存しない");

assert.ok(!appScript.includes("displayMode"), "カード全体の表示切替を持たない");
assert.ok(!appScript.includes("source-mode"), "通常表示へ戻す操作を持たない");
assert.ok(appScript.includes("effectiveRows"), "項目単位の実効値判定を共通化する");
assert.ok(appScript.includes("aggregateHtml"), "カテゴリ別の読み取り専用集約を表示する");
assert.ok(appScript.includes("representatives"), "カテゴリ別代表を使用する");
assert.ok(appScript.includes("editableKeys"), "カード種類ごとに手書き項目を限定する");
assert.ok(appScript.includes("保存済みのその他項目"), "非表示の保存済み項目を保持する");
assert.ok(appScript.includes("元情報を見る"), "元情報の確認経路を残す");
assert.ok(!appScript.includes("TypeScriptから生成されたファイル"), "04生成物を05へ直接持ち込まない");
assert.ok(appScript.includes('data-action="toggle-folder"'), "左エクスプローラーのフォルダー開閉を残す");
assert.ok(appScript.includes("explorerPosts"), "左エクスプローラーから投稿を開ける");
assert.ok(appScript.includes("explorerSynapseFolder"), "左エクスプローラーから個別カードを開ける");
assert.ok(appScript.includes("systemLogHtml"), "左エクスプローラーからSystemLogを開ける");

const mentionRows = detailCore.sourceRows("mention_note", JSON.stringify({
  mention: "@taiko_namino",
  name: "波野タイコ",
  phone: [],
  web: ["https://instagram.invalid/taiko_namino/"],
  note: "検証用データ",
}));
assert.deepEqual(
  mentionRows.map((row) => row.label),
  ["元のメンション", "名前", "電話", "Web", "自由メモ"],
  "Mentionの元情報を仕様の項目順に展開する"
);
assert.equal(mentionRows[0].value, "@taiko_namino");
assert.equal(mentionRows[2].value, "—");
assert.equal(mentionRows[3].value, "https://instagram.invalid/taiko_namino/");

const tagRows = detailCore.sourceRows("hashtag_note", JSON.stringify({
  hashtag: "#検証用",
  note: "タグのメモ",
}));
assert.deepEqual(
  tagRows.map((row) => row.label),
  ["元のタグ", "自由メモ"],
  "Tagの元情報を仕様の項目順に展開する"
);

const addressRows = detailCore.sourceRows("address", JSON.stringify({
  full: "大阪府大阪市北区",
  components: {
    country: "日本",
    prefecture: "大阪府",
    city: "大阪市",
    district: "北区",
    street: "",
    postal_code: "530-0000",
  },
}));
assert.equal(addressRows[0].value, "大阪府大阪市北区");
assert.equal(addressRows[2].value, "大阪府");
assert.equal(detailCore.sourceRows("unknown", "value"), null);
assert.ok(detailScript.includes("MutationObserver"), "再描画後にも元情報を整形する");
assert.ok(detailScript.includes("sourceRows"), "元情報を項目別表示する");

console.log("05 UI契約検査: 合格");
console.log("B-07 カテゴリ別集約、B-08 種類別手書き・項目単位優先・元情報保持、B-31 可変境界、B-32 狭幅パネルを確認");
