import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const kitRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const vaultRoot = path.join(kitRoot, "サンプルVault");
const errors = [];

const readJson = async (relativePath) =>
  JSON.parse(await readFile(path.join(kitRoot, relativePath), "utf8"));

const exists = async (targetPath) => {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
};

const walk = async (root) => {
  const found = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const target = path.join(root, entry.name);
    if (entry.isDirectory()) found.push(...await walk(target));
    else found.push(target);
  }
  return found;
};

const cases = await readJson("検証ケース台帳/cases.json");
const posts = await readJson("サンプルデータ/posts.json");
const synapses = await readJson("サンプルデータ/synapses.json");
const systemLogs = await readJson("サンプルデータ/system-logs.json");
const mediaSources = await readJson("サンプルVault/写真・動画と出典/sources.json");
const browserApp = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/app.js"),
  "utf8"
);
const browserData = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/sample-data.js"),
  "utf8"
);
const browserIndex = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/index.html"),
  "utf8"
);
const browserLayout = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/layout.js"),
  "utf8"
);
const browserDetailView = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/detail-view.js"),
  "utf8"
);
const browserStyles = await readFile(
  path.join(kitRoot, "ブラウザー確認用モック/styles.css"),
  "utf8"
);

const expectCount = (label, actual, expected) => {
  if (actual !== expected) errors.push(`${label}: ${actual}件（期待値 ${expected}件）`);
};

expectCount("検証ケース", cases.length, 90);
expectCount("重点検証", cases.filter((item) => item.role === "重点検証").length, 16);
expectCount("件数確認", cases.filter((item) => item.role === "件数確認").length, 74);
expectCount("Post", cases.filter((item) => item.postType === "Post").length, 30);
expectCount("Reel", cases.filter((item) => item.postType === "Reel").length, 30);
expectCount("Story", cases.filter((item) => item.postType === "Story").length, 30);
expectCount("投稿JSON", posts.length, 90);
expectCount("Synapse", Object.keys(synapses.cards).length, 90);
expectCount(
  "Tag",
  Object.values(synapses.cards).filter((item) => item.kind === "tag").length,
  30
);
expectCount(
  "Mention",
  Object.values(synapses.cards).filter((item) => item.kind === "mention").length,
  30
);
expectCount(
  "Location",
  Object.values(synapses.cards).filter((item) => item.kind === "location").length,
  30
);
expectCount("融合状態", Object.keys(synapses.groups).length, 2);
expectCount("SystemLogs", systemLogs.length, 3);
expectCount("写真・動画の出典", mediaSources.length, 34);

const numbers = new Set();
const postIds = new Set(posts.map((item) => item.id));
const postsById = Object.fromEntries(posts.map((item) => [item.id, item]));
const sourcePaths = new Set(mediaSources.map((item) => item.vaultRelativePath));

for (const item of cases) {
  if (numbers.has(item.number)) errors.push(`${item.number}: 検証番号が重複`);
  numbers.add(item.number);
  if (!postIds.has(item.targetPostId)) {
    errors.push(`${item.number}: posts.jsonに${item.targetPostId}がない`);
  }
  const postPath = path.join(vaultRoot, item.sampleVaultRelativePath);
  if (!await exists(postPath)) {
    errors.push(`${item.number}: 投稿Markdownがない`);
    continue;
  }
  const markdown = await readFile(postPath, "utf8");
  const post = postsById[item.targetPostId];
  if (!markdown.includes(`sample_case: "${item.number}"`)) {
    errors.push(`${item.number}: 投稿Markdownの検証番号が一致しない`);
  }
  if (post?.caption && !markdown.includes(post.caption)) {
    errors.push(`${item.number}: posts.jsonの本文がMarkdownに維持されていない`);
  }
  const trailingLinks = post?.links.map((link) => link.wiki).join(" ") ?? "";
  if (trailingLinks && !markdown.includes(`\n${trailingLinks}\n`)) {
    errors.push(`${item.number}: 末尾リンクが一行で一致しない`);
  }
  if (!browserData.includes(item.targetPostId)) {
    errors.push(`${item.number}: ブラウザーモックに投稿IDがない`);
  }

  for (const card of item.relatedCards) {
    if (!synapses.cards[card.id]) {
      errors.push(`${item.number}: Synapse JSONに${card.id}がない`);
    }
    if (!await exists(path.join(vaultRoot, card.sampleVaultRelativePath))) {
      errors.push(`${item.number}: 関連カードMarkdownがない: ${card.id}`);
    }
  }

  for (const media of item.mediaCondition) {
    const mediaPath = path.join(vaultRoot, media.vaultPath);
    const present = await exists(mediaPath);
    if (media.missing && present) {
      errors.push(`${item.number}: 欠損ケースの素材が実在する`);
    }
    if (!media.missing && !present) {
      errors.push(`${item.number}: 素材がない: ${media.vaultPath}`);
    }
    if (!media.missing && !sourcePaths.has(media.vaultPath)) {
      errors.push(`${item.number}: 素材の出典記録がない: ${media.vaultPath}`);
    }
    if (!markdown.includes(media.vaultPath)) {
      errors.push(`${item.number}: 投稿Markdownに素材参照がない`);
    }
  }
}

for (const group of Object.values(synapses.groups)) {
  const manager = synapses.cards[group.managerId];
  const managerPath = cases
    .flatMap((item) => item.relatedCards)
    .find((item) => item.id === group.managerId)?.sampleVaultRelativePath;
  if (!manager || !managerPath) {
    errors.push(`融合状態の関係管理カードがない: ${group.managerId}`);
    continue;
  }
  if (group.schemaVersion !== 2) {
    errors.push(`${group.managerId}: schemaVersionが2ではない`);
  }
  const allIds = [group.managerId, ...group.memberIds];
  const markdown = await readFile(path.join(vaultRoot, managerPath), "utf8");
  if (!markdown.includes("schema_version: 2")) {
    errors.push(`${group.managerId}: Vault側schema_versionが2ではない`);
  }
  for (const memberId of group.memberIds) {
    const memberName = synapses.cards[memberId]?.name?.replace(/^#/, "");
    if (!memberName || !markdown.includes(memberName)) {
      errors.push(`${group.managerId}: Vault用membersに${memberId}がない`);
    }
  }
  for (const [kind, representativeId] of Object.entries(group.representatives ?? {})) {
    if (!allIds.includes(representativeId) || synapses.cards[representativeId]?.kind !== kind) {
      errors.push(`${group.managerId}: ${kind}代表が融合単位または種類と一致しない`);
    }
    const representativeName = synapses.cards[representativeId]?.name?.replace(/^#/, "");
    if (!representativeName || !markdown.includes(representativeName)) {
      errors.push(`${group.managerId}: Vault用representativesに${representativeId}がない`);
    }
  }
}

if (!browserData.includes('"vaultPath": "写真・動画と出典/')) {
  errors.push("ブラウザー確認用モックがサンプルVault内の共用素材を参照していない");
}
if (browserData.includes('path:"media/')) {
  errors.push("ブラウザー確認用モックに移動前の素材パスが残っている");
}
for (const requiredLayoutFile of [
  "sample-data.js",
  "detail-view-core.js",
  "detail-view.js",
  "layout-core.js",
  "layout.js",
]) {
  if (!browserIndex.includes(requiredLayoutFile)) {
    errors.push(`ブラウザー確認用モックが${requiredLayoutFile}を読み込んでいない`);
  }
}
if (!browserDetailView.includes("sourceRows")) {
  errors.push("右サイドバーの元情報を仕様どおり項目別表示する処理がない");
}
for (const requiredUiContract of [
  'makeResizer("left")',
  'makeResizer("right")',
  "mobile-pane-controls",
  "mobile-left-open",
  "mobile-right-open",
]) {
  if (!browserLayout.includes(requiredUiContract)
    && !browserStyles.includes(requiredUiContract)) {
    errors.push(`ブラウザー確認用モックにUI契約がない: ${requiredUiContract}`);
  }
}

for (const prefix of ["P", "R", "S"]) {
  for (let index = 1; index <= 30; index += 1) {
    const number = `${prefix}-${String(index).padStart(2, "0")}`;
    if (!numbers.has(number)) errors.push(`${number}: ケースがない`);
  }
}

for (const source of mediaSources) {
  if (!source.vaultRelativePath || !source.landingPage || !source.creator
    || !source.license || !source.licenseReference) {
    errors.push(`出典台帳の必須項目不足: ${source.vaultRelativePath ?? "パスなし"}`);
  }
  if (!await exists(path.join(vaultRoot, source.vaultRelativePath))) {
    errors.push(`出典台帳の素材がない: ${source.vaultRelativePath}`);
  }
}

const pluginFolder = path.join(vaultRoot, ".obsidian", "plugins");
if (await exists(pluginFolder)) errors.push("サンプルVaultに.obsidian/pluginsが混入");

const textExtensions = new Set([".md", ".json", ".js", ".html", ".css", ".mjs"]);
for (const file of await walk(kitRoot)) {
  if (!textExtensions.has(path.extname(file))) continue;
  const text = await readFile(file, "utf8");
  if (/\/Users\/[^/\s]+/.test(text)) {
    errors.push(`利用者固有の絶対パスが混入: ${path.relative(kitRoot, file)}`);
  }
  if (/(?:sk-[A-Za-z0-9_-]{16,}|OPENAI_API_KEY\s*=)/.test(text)) {
    errors.push(`APIキーらしき文字列が混入: ${path.relative(kitRoot, file)}`);
  }
}

if (errors.length > 0) {
  console.error(`サンプル検証キット検査: ${errors.length}件の不一致`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("サンプル検証キット検査: 合格");
console.log("90投稿（Post/Reel/Story各30）、90 Synapse（各30）、3 SystemLogs");
console.log("重点検証16件、件数確認74件、写真・動画34件の出典を確認");
