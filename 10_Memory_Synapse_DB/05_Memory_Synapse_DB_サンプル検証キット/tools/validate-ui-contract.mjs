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
assert.ok(appScript.includes('data-action="select-wiki-link"'), "投稿とSystemLogsから右パネルのカードを選択できる");
assert.ok(appScript.includes('data-action="post"'), "右パネルの関連投稿から中央投稿へ戻れる");
assert.ok(appScript.includes("Obsidian標準で実現"), "05の標準機能担当を画面から判別できる");
assert.ok(appScript.includes("プラグインで実現"), "05のプラグイン担当を画面から判別できる");
assert.ok(appScript.includes("検証番号・模擬外枠は05専用"), "05だけの表示を画面から判別できる");
assert.ok(appScript.includes("sampleMediaHtml"), "メディア表示処理を共通化する");
assert.ok(appScript.includes("<img"), "正常な写真を代替枠ではなく画像として表示する");
assert.ok(appScript.includes("<video"), "正常な動画を代替枠ではなく動画として表示する");
assert.ok(appScript.includes("entry.missing === true"), "欠損メディアだけを欠損表示にする");
assert.ok(appScript.includes("../サンプルVault/"), "モックとサンプルVaultで同じローカルメディアを共用する");

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
console.log("B-07、B-08、B-22、B-24、B-31、B-32と相互逆引き連動を確認");
