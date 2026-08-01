import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const kitDir = path.dirname(toolDir);
const dataDir = path.join(kitDir, "サンプルデータ");
const ledgerDir = path.join(kitDir, "検証ケース台帳");
const outputPath = path.join(kitDir, "ブラウザー確認用モック", "sample-data.js");

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));

const payload = {
  posts: readJson(path.join(dataDir, "posts.json")),
  synapses: readJson(path.join(dataDir, "synapses.json")),
  systemLogs: readJson(path.join(dataDir, "system-logs.json")),
  cases: readJson(path.join(ledgerDir, "cases.json")),
};

const output = [
  "/* 05専用生成物。04の実行コードには依存しません。 */",
  `globalThis.MemorySynapseSampleData = ${JSON.stringify(payload, null, 2)};`,
  "",
].join("\n");

fs.writeFileSync(outputPath, output, "utf8");
console.log(`generated: ${outputPath}`);
