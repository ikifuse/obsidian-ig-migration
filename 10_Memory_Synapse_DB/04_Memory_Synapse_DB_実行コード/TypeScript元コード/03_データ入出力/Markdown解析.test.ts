import assert from "node:assert/strict";
import test from "node:test";
import { Wikiリンクを分解する } from "./Wikiリンク解決";
import { Wikiリンク数を数える, Wikiリンク文字列を取り出す } from "./Markdown解析";

test("Markdownから通常リンクと埋め込みリンクを数える", () => {
  const markdown = "[[カードA]]\n![[画像.png]]\n通常の文章";
  assert.equal(Wikiリンク数を数える(markdown), 2);
  assert.deepEqual(Wikiリンク文字列を取り出す(markdown), ["[[カードA]]", "![[画像.png]]"]);
});

test("Wikiリンクをパスと表示名へ分ける", () => {
  assert.deepEqual(
    Wikiリンクを分解する("[[Instagram_Logs/Synapses/Tags/SampleTagA|#SampleTagA]]"),
    { path: "Instagram_Logs/Synapses/Tags/SampleTagA", displayName: "#SampleTagA" }
  );
  assert.equal(Wikiリンクを分解する("通常の文章"), null);
});
