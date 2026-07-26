const fs = require("fs");
const path = require("path");

const mentions = [
  ["sazae_fuguta", "フグ田サザエ", "サザエさん"],
  ["masuo_fuguta", "フグ田マスオ", "サザエさん"],
  ["tara_fuguta", "フグ田タラオ", "サザエさん"],
  ["katsuo_isono", "磯野カツオ", "サザエさん"],
  ["wakame_isono", "磯野ワカメ", "サザエさん"],
  ["namihei_isono", "磯野波平", "サザエさん"],
  ["fune_isono", "磯野フネ", "サザエさん"],
  ["tama_cat", "タマ", "サザエさん"],
  ["norisuke_namino", "波野ノリスケ", "サザエさん"],
  ["taiko_namino", "波野タイコ", "サザエさん"],
  ["ikura_namino", "波野イクラ", "サザエさん"],
  ["son_goku", "孫悟空", "ドラゴンボール"],
  ["kakarot", "カカロット", "ドラゴンボール"],
  ["vegeta", "ベジータ", "ドラゴンボール"],
  ["prince_vegeta", "ベジータ王子", "ドラゴンボール"],
  ["piccolo", "ピッコロ", "ドラゴンボール"],
  ["ma_junior", "マジュニア", "ドラゴンボール"],
  ["son_gohan", "孫悟飯", "ドラゴンボール"],
  ["great_saiyaman", "グレートサイヤマン", "ドラゴンボール"],
  ["kuririn", "クリリン", "ドラゴンボール"],
  ["bulma", "ブルマ", "ドラゴンボール"],
  ["kamesennin", "亀仙人", "ドラゴンボール"],
  ["jackie_chun", "ジャッキー・チュン", "ドラゴンボール"],
  ["tenshinhan", "天津飯", "ドラゴンボール"],
  ["yamcha", "ヤムチャ", "ドラゴンボール"],
  ["trunks", "トランクス", "ドラゴンボール"],
  ["goten", "孫悟天", "ドラゴンボール"],
  ["freeza", "フリーザ", "ドラゴンボール"],
  ["cell", "セル", "ドラゴンボール"],
  ["majin_buu", "魔人ブウ", "ドラゴンボール"]
];

const locations = [
  "大阪城", "道頓堀", "通天閣", "ユニバーサル・スタジオ・ジャパン", "海遊館",
  "梅田スカイビル", "あべのハルカス", "四天王寺", "黒門市場", "新世界",
  "アメリカ村", "難波八阪神社", "天王寺動物園", "箕面大滝", "万博記念公園",
  "スパワールド", "天保山大観覧車", "キッズプラザ大阪", "造幣局博物館", "グランフロント大阪",
  "HEP FIVE", "中之島公園", "大阪市立科学館", "国立国際美術館", "大阪歴史博物館",
  "千日前道具屋筋商店街", "法善寺横丁", "露天神社", "岸和田城", "USJ"
];

const tags = [
  ["野球バット", "スポーツ用品", "野球で使用する打撃用具"],
  ["野球グローブ", "スポーツ用品", "野球で使用する捕球用具"],
  ["サッカーボール", "スポーツ用品", "サッカーで使用するボール"],
  ["サッカースパイク", "スポーツ用品", "サッカー向けの靴"],
  ["テニスラケット", "スポーツ用品", "テニスでボールを打つ用具"],
  ["テニスボール", "スポーツ用品", "テニスで使用するボール"],
  ["バスケットボール", "スポーツ用品", "バスケットボール競技で使用するボール"],
  ["バスケットゴール", "スポーツ用品", "バスケットボール競技のゴール設備"],
  ["ゴルフクラブ", "スポーツ用品", "ゴルフでボールを打つ用具"],
  ["ゴルフボール", "スポーツ用品", "ゴルフで使用するボール"],
  ["ランニングシューズ", "スポーツ用品", "走行向けの靴"],
  ["ダンベル", "スポーツ用品", "筋力トレーニング用具"],
  ["ヨガマット", "スポーツ用品", "ヨガやストレッチで使用するマット"],
  ["水泳ゴーグル", "スポーツ用品", "水泳時に使用するゴーグル"],
  ["自転車ヘルメット", "スポーツ用品", "自転車利用時の保護用具"],
  ["枝豆", "居酒屋メニュー", "塩ゆでした枝豆の定番おつまみ"],
  ["冷やしトマト", "居酒屋メニュー", "冷やしたトマトを使う前菜"],
  ["だし巻き卵", "居酒屋メニュー", "だしを加えて焼いた卵料理"],
  ["鶏の唐揚げ", "居酒屋メニュー", "下味を付けた鶏肉の揚げ物"],
  ["焼き鳥", "居酒屋メニュー", "鶏肉などを串に刺して焼く料理"],
  ["つくね", "居酒屋メニュー", "ひき肉をまとめて焼く串料理"],
  ["刺身盛り合わせ", "居酒屋メニュー", "複数種類の刺身を盛り合わせた料理"],
  ["しめ鯖", "居酒屋メニュー", "酢で締めた鯖料理"],
  ["ほっけ開き", "居酒屋メニュー", "ほっけの開きを焼いた料理"],
  ["揚げ出し豆腐", "居酒屋メニュー", "揚げた豆腐にだしを合わせる料理"],
  ["フライドポテト", "居酒屋メニュー", "じゃがいもの揚げ物"],
  ["もつ煮込み", "居酒屋メニュー", "もつを味噌などで煮込む料理"],
  ["焼きおにぎり", "居酒屋メニュー", "表面を香ばしく焼いたおにぎり"],
  ["生ビール", "居酒屋メニュー", "居酒屋で提供される代表的な飲料"],
  ["ハイボール", "居酒屋メニュー", "ウイスキーを炭酸で割る飲料"]
];

const cards = {};
const logs = {};

const mentionId = (index) => `mention-@${mentions[index % mentions.length][0]}`;
const locationId = (index) => `location-${locations[index % locations.length]}`;
const tagId = (index) => `tag-#${tags[index % tags.length][0]}`;
const wikiPost = (id) => `[[${id}]]`;

mentions.forEach(([account, name, series]) => {
  const id = `mention-@${account}`;
  cards[id] = {
    id,
    kind: "mention",
    name: `@${account}`,
    source: {
      mention: `@${account}`,
      name,
      phone: [],
      web: [`https://instagram.invalid/${account}/`],
      note: `『${series}』の架空の登場人物を使った個人情報を含まない検証用データ`
    },
    relatedPosts: []
  };
});

locations.forEach((location, index) => {
  const id = `location-${location}`;
  cards[id] = {
    id,
    kind: "location",
    name: location,
    source: {
      location,
      geo: `${(34.62 + index * 0.003).toFixed(4)}, ${(135.43 + index * 0.004).toFixed(4)}`,
      address: `大阪府内・${location}周辺（検証用表記）`,
      activity_id: `mock_activity_${String(index + 1).padStart(3, "0")}`,
      source_files: [`[[mock_activity_${String(index + 1).padStart(3, "0")}.gpx]]`],
      note: "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    relatedPosts: []
  };
});

tags.forEach(([name, category, note]) => {
  const id = `tag-#${name}`;
  cards[id] = {
    id,
    kind: "tag",
    name: `#${name}`,
    source: {
      hashtag: `#${name}`,
      note: `${note}（${category}の検証用記入）`
    },
    relatedPosts: []
  };
});

function unique(values) {
  return [...new Set(values)];
}

function relationLink(cardId) {
  const card = cards[cardId];
  if (card.kind === "tag") {
    const value = card.name.slice(1);
    return { cardId, wiki: `[[${value}|${card.name}]]` };
  }
  if (card.kind === "mention") {
    return { cardId, wiki: `[[${card.name}|${card.name}]]` };
  }
  return { cardId, wiki: `[[${card.name}]]` };
}

function addLog({ id, type, date, cardIds, location, geo, caption, media }) {
  const uniqueCardIds = unique(cardIds);
  const relatedCards = uniqueCardIds.map((cardId) => cards[cardId]);
  const tagCards = relatedCards.filter((card) => card.kind === "tag");
  const mentionCards = relatedCards.filter((card) => card.kind === "mention");
  const locationCards = relatedCards.filter((card) => card.kind === "location");

  if (type !== "Feed" && locationCards.length > 0) {
    throw new Error(`${id}: Reels/Storiesへ名前付きLocationを関連付けることはできません`);
  }
  if (type === "Feed" && locationCards.length > 1) {
    throw new Error(`${id}: 一つの投稿へ複数のInstagramスポット名を設定できません`);
  }

  logs[id] = {
    id,
    source: "instagram",
    type,
    content: type === "Feed" ? null : "video",
    date,
    caption,
    tags: tagCards.map((card) => card.name.slice(1)),
    mentions: mentionCards.map((card) => card.name),
    links: [
      { cardId: null, wiki: "[[instagram]]" },
      ...relatedCards.map((card) => relationLink(card.id))
    ],
    location: {
      raw: location ?? null,
      normalized: location ?? null,
      geo: geo ?? { lat: null, lng: null, alt: null },
      synapseLink: locationCards[0] ? `[[${locationCards[0].name}]]` : null
    },
    media,
    rawSourcePath: `[[${id}.json]]`,
    relatedCardIds: uniqueCardIds
  };

  for (const cardId of uniqueCardIds) {
    cards[cardId].relatedPosts.push(wikiPost(id));
  }
}

for (let index = 0; index < 30; index += 1) {
  const id = `2026-01-30-15-${String(index).padStart(2, "0")}-00_IG_${String(index + 1).padStart(4, "0")}`;
  const mentionCards = [mentionId(index)];
  const tagCards = [tagId(index)];
  if (index % 5 === 0) mentionCards.push(mentionId(index + 1));
  if (index % 6 === 0) tagCards.push(tagId(index + 1));
  if (index % 7 === 0 && !mentionCards.includes(mentionId(11))) mentionCards.push(mentionId(11));

  const location = locations[index];
  const caption = [
    `${location}を訪れました。`,
    `${mentionCards.map((cardId) => cards[cardId].name).join(" と ")} と記録を残します。`,
    "",
    tagCards.map((cardId) => cards[cardId].name).join(" ")
  ].join("\n");

  addLog({
    id,
    type: "Feed",
    date: `2026-01-30T15:${String(index).padStart(2, "0")}:00+09:00`,
    cardIds: [...mentionCards, locationId(index), ...tagCards],
    location,
    geo: {
      lat: Number((34.62 + index * 0.003).toFixed(4)),
      lng: Number((135.43 + index * 0.004).toFixed(4)),
      alt: null
    },
    caption,
    media: [`${id}_photo_001.jpg`]
  });
}

for (let index = 0; index < 30; index += 1) {
  const id = `2026-02-15-10-${String(index).padStart(2, "0")}-00_IGR_${String(index + 1).padStart(4, "0")}`;
  const mentionCards = [mentionId(index)];
  const tagCards = [tagId(index + 5)];
  if (index % 8 === 0) mentionCards.push(mentionId(11));
  const caption = [
    "短い動画の検証用キャプションです。",
    mentionCards.map((cardId) => cards[cardId].name).join(" "),
    tagCards.map((cardId) => cards[cardId].name).join(" ")
  ].join("\n");
  const geo = index < 12
    ? { lat: Number((34.65 + index * 0.002).toFixed(4)), lng: Number((135.47 + index * 0.002).toFixed(4)), alt: null }
    : { lat: null, lng: null, alt: null };

  addLog({
    id,
    type: "Reels",
    date: `2026-02-15T10:${String(index).padStart(2, "0")}:00+09:00`,
    cardIds: [...mentionCards, ...tagCards],
    location: null,
    geo,
    caption,
    media: [`${id}_video_001.mp4`]
  });
}

for (let index = 0; index < 30; index += 1) {
  const id = `2026-03-01-08-${String(index).padStart(2, "0")}-00_IGS_${String(index + 1).padStart(4, "0")}`;
  const mentionCards = [mentionId(index + 10)];
  const tagCards = [tagId(index + 15)];
  if (index % 9 === 0) tagCards.push(tagId(index + 16));
  const caption = [
    "24時間表示用の検証ストーリーです。",
    mentionCards.map((cardId) => cards[cardId].name).join(" "),
    tagCards.map((cardId) => cards[cardId].name).join(" ")
  ].join("\n");
  const geo = index < 6
    ? { lat: Number((34.69 + index * 0.002).toFixed(4)), lng: Number((135.49 + index * 0.002).toFixed(4)), alt: null }
    : { lat: null, lng: null, alt: null };

  addLog({
    id,
    type: "Stories",
    date: `2026-03-01T08:${String(index).padStart(2, "0")}:00+09:00`,
    cardIds: [...mentionCards, ...tagCards],
    location: null,
    geo,
    caption,
    media: [`${id}_video_001.mp4`]
  });
}

const osakaCastle = cards["location-大阪城"];
if (osakaCastle) {
  osakaCastle.handwritten = {
    displayName: "大阪城（思い出の場所）",
    aliases: ["Osaka Castle"],
    geo: { lat: "34.6873", lng: "135.5262", alt: "" },
    address: { full: "大阪府大阪市中央区大阪城1-1", country: "", prefecture: "", city: "", district: "", street: "", postalCode: "" },
    note: "桜が綺麗な時期に行った。また行きたい。",
    name: "大阪城",
    phone: [],
    web: []
  };
}

const goku = cards["mention-@son_goku"];
if (goku) {
  goku.handwritten = {
    displayName: "孫悟空（カカロット）",
    aliases: [],
    note: "地球育ちのサイヤ人。強い相手と戦うのが好き。",
    name: "孫悟空",
    geo: { lat: "", lng: "", alt: "" },
    address: { full: "", country: "", prefecture: "", city: "", district: "", street: "", postalCode: "" },
    phone: [],
    web: []
  };
}

const stateFile = `import type { 融合状態 } from "../01_データ構造/融合グループ";

export function 初期状態を作る(): 融合状態 {
  return {
    cards: ${JSON.stringify(cards, null, 2)},
    groups: {}
  };
}
`;

const logsFile = `export type 検証用ログ種類 = "Feed" | "Reels" | "Stories";

export interface 検証用ログリンク {
  cardId: string | null;
  wiki: string;
}

export interface 検証用親工程ログ {
  id: string;
  source: "instagram";
  type: 検証用ログ種類;
  content: "video" | null;
  date: string;
  caption: string;
  tags: string[];
  mentions: string[];
  links: 検証用ログリンク[];
  location: {
    raw: string | null;
    normalized: string | null;
    geo: { lat: number | null; lng: number | null; alt: number | null };
    synapseLink: string | null;
  };
  media: string[];
  rawSourcePath: string;
  relatedCardIds: string[];
}

export const 検証用親工程ログ一覧: Record<string, 検証用親工程ログ> = ${JSON.stringify(logs, null, 2)};
`;

const dataDirectory = path.join(__dirname, "TypeScript元コード/03_データ入出力");
fs.writeFileSync(path.join(dataDirectory, "ブラウザー内データ.ts"), stateFile, "utf8");
fs.writeFileSync(path.join(dataDirectory, "検証用親工程ログ.ts"), logsFile, "utf8");
console.log(`Mock data generated: ${Object.keys(cards).length} cards / ${Object.keys(logs).length} logs`);
