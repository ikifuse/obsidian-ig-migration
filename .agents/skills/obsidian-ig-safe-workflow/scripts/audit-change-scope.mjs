#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SCRIPT_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".py", ".sh"]);
const args = process.argv.slice(2);
const allowed = [];

for (let index = 0; index < args.length; index += 1) {
  if (args[index] !== "--allow" || !args[index + 1]) {
    console.error("使い方: audit-change-scope.mjs --allow <file-or-directory> [--allow ...]");
    process.exit(2);
  }
  allowed.push(normalize(args[index + 1]));
  index += 1;
}

if (allowed.length === 0) {
  console.error("変更許可範囲を少なくとも1件指定してください。");
  process.exit(2);
}

const root = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();
const rawStatus = execFileSync(
  "git",
  ["status", "--porcelain=v1", "-z", "--untracked-files=all"],
  { cwd: root, encoding: "utf8" },
);

const entries = parseStatus(rawStatus);
const failures = [];

for (const entry of entries) {
  const currentPath = normalize(entry.path);
  const previousPath = entry.previousPath ? normalize(entry.previousPath) : null;

  if (!isAllowed(currentPath, allowed) || (previousPath && !isAllowed(previousPath, allowed))) {
    failures.push(`許可範囲外: ${entry.status} ${previousPath ? `${previousPath} -> ` : ""}${currentPath}`);
  }

  if (isRootScript(currentPath)) {
    failures.push(`ルート直下のスクリプト: ${currentPath}`);
  }

  if (isPythonInsideTypeScriptSource(currentPath)) {
    failures.push(`TypeScript元コード内のPython補助スクリプト: ${currentPath}`);
  }

  if (isNew(entry.status) && isReusableHelperLocation(currentPath) && !hasProcedureReference(root, currentPath)) {
    failures.push(`現役手順から参照されていない新規補助ツール: ${currentPath}`);
  }
}

if (failures.length > 0) {
  console.error("変更範囲検査: 不合格");
  for (const failure of [...new Set(failures)]) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`変更範囲検査: 合格（${entries.length}件）`);

function normalize(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "");
}

function isAllowed(file, scopes) {
  return scopes.some((scope) => file === scope || file.startsWith(`${scope}/`));
}

function isRootScript(file) {
  return !file.includes("/") && SCRIPT_EXTENSIONS.has(path.posix.extname(file));
}

function isPythonInsideTypeScriptSource(file) {
  return file.includes("/TypeScript元コード/") && path.posix.extname(file) === ".py";
}

function isNew(status) {
  return status === "??" || status.includes("A");
}

function isReusableHelperLocation(file) {
  const extension = path.posix.extname(file);
  return SCRIPT_EXTENSIONS.has(extension) && /(^|\/)(tools|scripts)\//.test(file);
}

function hasProcedureReference(root, scriptPath) {
  const shortPath = scriptPath.split("/").slice(-2).join("/");
  const candidates = [];
  collectProcedureFiles(root, candidates);

  return candidates.some((file) => {
    if (normalize(path.relative(root, file)) === scriptPath) return false;
    const content = fs.readFileSync(file, "utf8");
    return content.includes(scriptPath) || content.includes(shortPath);
  });
}

function collectProcedureFiles(directory, output) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === "99_完了済み参考資料") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      collectProcedureFiles(fullPath, output);
    } else if (entry.name.endsWith(".md") || entry.name === "package.json") {
      output.push(fullPath);
    }
  }
}

function parseStatus(raw) {
  const fields = raw.split("\0").filter(Boolean);
  const parsed = [];

  for (let index = 0; index < fields.length; index += 1) {
    const field = fields[index];
    const status = field.slice(0, 2);
    const file = field.slice(3);
    const renamed = status.includes("R") || status.includes("C");

    if (renamed) {
      parsed.push({ status, previousPath: file, path: fields[index + 1] });
      index += 1;
    } else {
      parsed.push({ status, path: file });
    }
  }

  return parsed;
}
