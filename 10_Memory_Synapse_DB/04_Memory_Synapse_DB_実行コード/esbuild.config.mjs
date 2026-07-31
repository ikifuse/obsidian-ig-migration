import esbuild from "esbuild";
import process from "node:process";
import { builtinModules } from "node:module";
import { copyFile, mkdir } from "node:fs/promises";

const mode = process.argv[2] ?? "development";
const production = mode === "production";
const banner = "/* TypeScriptから生成されたファイルです。元コードは04_Memory_Synapse_DB_実行コードを参照してください。 */";
const pluginOutput = mode === "audit"
  ? "/private/tmp/memory-synapse-db-audit"
  : "../06_Memory_Synapse_DB_仮プラグイン/memory-synapse-db";

await mkdir(pluginOutput, { recursive: true });

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
  Promise.all([
    copyFile("プラグイン素材/manifest.json", `${pluginOutput}/manifest.json`),
    copyFile("プラグイン素材/styles.css", `${pluginOutput}/styles.css`)
  ])
]);
