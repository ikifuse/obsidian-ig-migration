import test from "node:test";
import assert from "node:assert/strict";
import { validateTagSource, validateMentionSource, validateLocationSource, validateHandwrittenNote } from "./形式検証";
import { 画面データから保存用へ変換する, 保存用から画面データへ変換する, 空の手書き情報 } from "../01_データ構造/手書き情報";

test("TagSource validation", () => {
  assert.equal(validateTagSource({ hashtag_note: { hashtag: "#test", note: null } }), null);
  assert.match(validateTagSource({ hashtag_note: { hashtag: 123 } }) ?? "", /文字列ではありません/);
});

test("MentionSource validation", () => {
  assert.equal(validateMentionSource({
    mention_note: { mention: "@test", name: "test", phone: [], web: ["https://example.com"], note: null }
  }), null);
  assert.match(validateMentionSource({
    mention_note: { mention: "@test", name: null, phone: [], web: [""], note: null }
  }) ?? "", /空要素や無効な要素/);
});

test("LocationSource validation", () => {
  assert.equal(validateLocationSource({
    location_note: { location: "Osaka" },
    geo: { lat: 34.6, lng: 135.5, alt: null },
    address: { full: null, components: {} },
    activity_id: null,
    source_files: [],
    note: null
  }), null);
  assert.match(validateLocationSource({
    location_note: { location: "Osaka" },
    geo: { lat: "34.6", lng: 135.5, alt: null },
    address: { full: null, components: {} },
    activity_id: null,
    source_files: [],
    note: null
  }) ?? "", /数値またはnullではありません/);
});

test("Handwritten note format conversion - empty to null", () => {
  const uiData = { ...空の手書き情報, displayName: "  ", geo: { lat: "  ", lng: "  ", alt: "" } };
  const yamlData = 画面データから保存用へ変換する(uiData);
  assert.equal(yamlData.display_name, null);
  assert.equal(yamlData.geo.lat, null);
});

test("Handwritten note format conversion - coordinates parse", () => {
  const uiData = { ...空の手書き情報, geo: { lat: "34.6", lng: "135.5", alt: "" } };
  const yamlData = 画面データから保存用へ変換する(uiData);
  assert.equal(yamlData.geo.lat, 34.6);
  assert.equal(yamlData.geo.lng, 135.5);
  assert.equal(yamlData.geo.alt, null);
});

test("Handwritten note format conversion - roundtrip", () => {
  const yamlData = {
    display_name: "test",
    aliases: ["a", "b"],
    name: null,
    phone: ["090-0000-0000"],
    web: [],
    geo: { lat: 34.6, lng: null, alt: null },
    address: {
      full: null,
      components: { country: "Japan", prefecture: null, city: null, district: null, street: null, postal_code: "100-0000" }
    },
    note: null
  };
  
  const uiData = 保存用から画面データへ変換する(yamlData);
  assert.equal(uiData.geo.lat, "34.6");
  assert.equal(uiData.geo.lng, "");
  assert.equal(uiData.address.postalCode, "100-0000");
  
  const backToYaml = 画面データから保存用へ変換する(uiData);
  assert.deepEqual(backToYaml, yamlData);
});
