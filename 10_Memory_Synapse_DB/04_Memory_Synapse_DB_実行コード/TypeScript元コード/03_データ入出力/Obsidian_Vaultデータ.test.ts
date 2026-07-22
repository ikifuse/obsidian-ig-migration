import assert from "node:assert/strict";
import test from "node:test";
import { 対象ルートを整理する as normalizeRoot } from "../05_共通処理/入力値整理";
import { パスからカード種類を判定する as kindFromPath } from "./Obsidian_Vaultデータ";

test("normalizes the configured Vault-relative root", () => {
  assert.equal(normalizeRoot("/Instagram_Logs\\Synapses/"), "Instagram_Logs/Synapses");
});

test("recognizes only the three direct card folders", () => {
  const root = "Instagram_Logs/Synapses";
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Tags/SampleTagA.md", root), "tag");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Mentions/user.md", root), "mention");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Locations/place.md", root), "location");
  assert.equal(kindFromPath("Instagram_Logs/Synapses/Tags/nested/value.md", root), null);
  assert.equal(kindFromPath("Other/Synapses/Tags/SampleTagA.md", root), null);
});
