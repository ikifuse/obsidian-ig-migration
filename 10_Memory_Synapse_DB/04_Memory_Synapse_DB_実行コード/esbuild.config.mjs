import esbuild from "esbuild";
import process from "node:process";
import { builtinModules } from "node:module";
import { copyFile, mkdir } from "node:fs/promises";

const production = process.argv[2] === "production";
const banner = "/* TypeScriptから生成されたファイルです。元コードは04_Memory_Synapse_DB_実行コードを参照してください。 */";
const browserOutput = "../05_Memory_Synapse_DB_ブラウザー確認版";
const pluginOutput = "../06_Memory_Synapse_DB_仮プラグイン/memory-synapse-db";

await Promise.all([
  mkdir(browserOutput, { recursive: true }),
  mkdir(pluginOutput, { recursive: true })
]);

await Promise.all([
  esbuild.build({
    banner: { js: banner },
    bundle: true,
    entryPoints: ["TypeScript元コード/04_画面/Obsidian画面.ts"],
    external: ["obsidian", "electron", ...builtinModules],
    format: "cjs",
    logLevel: "info",
    minify: production,
    outfile: `${pluginOutput}/main.js`,
    platform: "browser",
    sourcemap: production ? false : "inline",
    target: "es2021",
    treeShaking: true
  }),
  esbuild.build({
    banner: { js: banner },
    bundle: true,
    entryPoints: ["TypeScript元コード/04_画面/ブラウザー画面.ts"],
    format: "iife",
    logLevel: "info",
    minify: production,
    outfile: `${browserOutput}/app.js`,
    platform: "browser",
    sourcemap: production ? false : "inline",
    target: "es2021",
    treeShaking: true
  })
]);

await Promise.all([
  copyFile("ブラウザー素材/index.html", `${browserOutput}/index.html`),
  copyFile("ブラウザー素材/styles.css", `${browserOutput}/styles.css`),
  copyFile("プラグイン素材/manifest.json", `${pluginOutput}/manifest.json`),
  copyFile("プラグイン素材/styles.css", `${pluginOutput}/styles.css`)
]);
