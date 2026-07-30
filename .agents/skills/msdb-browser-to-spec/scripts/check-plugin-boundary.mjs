import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "../../../..");
const sourceRoot = path.join(
  repositoryRoot,
  "10_Memory_Synapse_DB",
  "04_Memory_Synapse_DB_実行コード",
  "TypeScript元コード"
);
const implementationRoot = path.dirname(sourceRoot);
const pluginEntry = path.join(sourceRoot, "04_画面", "Obsidian画面.ts");
const packageFile = path.join(implementationRoot, "package.json");
const buildFile = path.join(implementationRoot, "esbuild.config.mjs");

const forbiddenBaseNames = new Set([
  "ブラウザー内データ.ts",
  "ブラウザー画面.ts"
]);

function isBrowserOnlySource(filePath) {
  const baseName = path.basename(filePath);
  return (
    forbiddenBaseNames.has(baseName) ||
    baseName.startsWith("検証用") ||
    filePath.includes(`${path.sep}ブラウザー素材${path.sep}`) ||
    filePath.includes(`${path.sep}05_Memory_Synapse_DB_サンプル検証キット${path.sep}`)
  );
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function resolveImport(importer, specifier) {
  if (!specifier.startsWith(".")) return null;
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.mts`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx")
  ];
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

function relative(filePath) {
  return path.relative(repositoryRoot, filePath);
}

function importSpecifiers(source) {
  const results = [];
  const pattern = /(?:import|export)\s+(?:[\s\S]*?\sfrom\s*)?["']([^"']+)["']|import\(\s*["']([^"']+)["']\s*\)/g;
  for (const match of source.matchAll(pattern)) {
    results.push(match[1] ?? match[2]);
  }
  return results;
}

async function main() {
  const buildBoundaryViolations = [];
  for (const filePath of [packageFile, buildFile]) {
    if (!(await exists(filePath))) {
      buildBoundaryViolations.push(`${relative(filePath)} が見つかりません。`);
      continue;
    }
    const source = await readFile(filePath, "utf8");
    const forbiddenBuildReferences = [
      "05_Memory_Synapse_DB_サンプル検証キット",
      "ブラウザー画面.ts",
      "ブラウザー素材",
      "build:browser"
    ];
    for (const token of forbiddenBuildReferences) {
      if (source.includes(token)) {
        buildBoundaryViolations.push(`${relative(filePath)} が通常ビルド境界外の「${token}」を参照しています。`);
      }
    }
  }

  if (buildBoundaryViolations.length > 0) {
    console.error("[FAIL] 04のビルド設定が05の独立境界を越えています。");
    for (const violation of buildBoundaryViolations) console.error(`- ${violation}`);
    console.error("この検査はファイルを変更しません。05を通常ビルドの入力・出力から外してから再実行してください。");
    return 1;
  }

  if (!(await exists(pluginEntry))) {
    console.error(`[FAIL] Obsidianプラグインの入口が見つかりません: ${relative(pluginEntry)}`);
    return 1;
  }

  const queue = [pluginEntry];
  const visited = new Set();
  const parent = new Map();
  const violations = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);

    if (current !== pluginEntry && isBrowserOnlySource(current)) {
      violations.push(current);
    }

    const source = await readFile(current, "utf8");
    for (const specifier of importSpecifiers(source)) {
      const dependency = await resolveImport(current, specifier);
      if (!dependency || visited.has(dependency)) continue;
      if (!parent.has(dependency)) parent.set(dependency, current);
      queue.push(dependency);
    }
  }

  if (violations.length === 0) {
    console.log(`[PASS] 04の通常ビルド設定とプラグイン依存 ${visited.size} ファイルに、05またはブラウザー確認専用要素の参照はありません。`);
    return 0;
  }

  console.error("[FAIL] Obsidianプラグインの依存経路へブラウザー確認専用ソースが入っています。");
  for (const violation of violations) {
    const chain = [violation];
    let current = violation;
    while (parent.has(current)) {
      current = parent.get(current);
      chain.push(current);
    }
    chain.reverse();
    console.error(`- ${chain.map(relative).join(" -> ")}`);
  }
  console.error("この検査はファイルを変更しません。対象、影響、承認範囲を確認してから修正してください。");
  return 1;
}

process.exitCode = await main();
