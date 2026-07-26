export type 検証用ログ種類 = "Feed" | "Reels" | "Stories";

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

export const 検証用親工程ログ一覧: Record<string, 検証用親工程ログ> = {
  "2026-01-30-15-00-00_IG_0001": {
    "id": "2026-01-30-15-00-00_IG_0001",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:00:00+09:00",
    "caption": "大阪城を訪れました。\n@sazae_fuguta と @masuo_fuguta と @son_goku と記録を残します。\n\n#野球バット #野球グローブ",
    "tags": [
      "野球バット",
      "野球グローブ"
    ],
    "mentions": [
      "@sazae_fuguta",
      "@masuo_fuguta",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@sazae_fuguta",
        "wiki": "[[@sazae_fuguta|@sazae_fuguta]]"
      },
      {
        "cardId": "mention-@masuo_fuguta",
        "wiki": "[[@masuo_fuguta|@masuo_fuguta]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-大阪城",
        "wiki": "[[大阪城]]"
      },
      {
        "cardId": "tag-#野球バット",
        "wiki": "[[野球バット|#野球バット]]"
      },
      {
        "cardId": "tag-#野球グローブ",
        "wiki": "[[野球グローブ|#野球グローブ]]"
      }
    ],
    "location": {
      "raw": "大阪城",
      "normalized": "大阪城",
      "geo": {
        "lat": 34.62,
        "lng": 135.43,
        "alt": null
      },
      "synapseLink": "[[大阪城]]"
    },
    "media": [
      "2026-01-30-15-00-00_IG_0001_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-00-00_IG_0001.json]]",
    "relatedCardIds": [
      "mention-@sazae_fuguta",
      "mention-@masuo_fuguta",
      "mention-@son_goku",
      "location-大阪城",
      "tag-#野球バット",
      "tag-#野球グローブ"
    ]
  },
  "2026-01-30-15-01-00_IG_0002": {
    "id": "2026-01-30-15-01-00_IG_0002",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:01:00+09:00",
    "caption": "道頓堀を訪れました。\n@masuo_fuguta と記録を残します。\n\n#野球グローブ",
    "tags": [
      "野球グローブ"
    ],
    "mentions": [
      "@masuo_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@masuo_fuguta",
        "wiki": "[[@masuo_fuguta|@masuo_fuguta]]"
      },
      {
        "cardId": "location-道頓堀",
        "wiki": "[[道頓堀]]"
      },
      {
        "cardId": "tag-#野球グローブ",
        "wiki": "[[野球グローブ|#野球グローブ]]"
      }
    ],
    "location": {
      "raw": "道頓堀",
      "normalized": "道頓堀",
      "geo": {
        "lat": 34.623,
        "lng": 135.434,
        "alt": null
      },
      "synapseLink": "[[道頓堀]]"
    },
    "media": [
      "2026-01-30-15-01-00_IG_0002_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-01-00_IG_0002.json]]",
    "relatedCardIds": [
      "mention-@masuo_fuguta",
      "location-道頓堀",
      "tag-#野球グローブ"
    ]
  },
  "2026-01-30-15-02-00_IG_0003": {
    "id": "2026-01-30-15-02-00_IG_0003",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:02:00+09:00",
    "caption": "通天閣を訪れました。\n@tara_fuguta と記録を残します。\n\n#サッカーボール",
    "tags": [
      "サッカーボール"
    ],
    "mentions": [
      "@tara_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tara_fuguta",
        "wiki": "[[@tara_fuguta|@tara_fuguta]]"
      },
      {
        "cardId": "location-通天閣",
        "wiki": "[[通天閣]]"
      },
      {
        "cardId": "tag-#サッカーボール",
        "wiki": "[[サッカーボール|#サッカーボール]]"
      }
    ],
    "location": {
      "raw": "通天閣",
      "normalized": "通天閣",
      "geo": {
        "lat": 34.626,
        "lng": 135.438,
        "alt": null
      },
      "synapseLink": "[[通天閣]]"
    },
    "media": [
      "2026-01-30-15-02-00_IG_0003_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-02-00_IG_0003.json]]",
    "relatedCardIds": [
      "mention-@tara_fuguta",
      "location-通天閣",
      "tag-#サッカーボール"
    ]
  },
  "2026-01-30-15-03-00_IG_0004": {
    "id": "2026-01-30-15-03-00_IG_0004",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:03:00+09:00",
    "caption": "ユニバーサル・スタジオ・ジャパンを訪れました。\n@katsuo_isono と記録を残します。\n\n#サッカースパイク",
    "tags": [
      "サッカースパイク"
    ],
    "mentions": [
      "@katsuo_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@katsuo_isono",
        "wiki": "[[@katsuo_isono|@katsuo_isono]]"
      },
      {
        "cardId": "location-ユニバーサル・スタジオ・ジャパン",
        "wiki": "[[ユニバーサル・スタジオ・ジャパン]]"
      },
      {
        "cardId": "tag-#サッカースパイク",
        "wiki": "[[サッカースパイク|#サッカースパイク]]"
      }
    ],
    "location": {
      "raw": "ユニバーサル・スタジオ・ジャパン",
      "normalized": "ユニバーサル・スタジオ・ジャパン",
      "geo": {
        "lat": 34.629,
        "lng": 135.442,
        "alt": null
      },
      "synapseLink": "[[ユニバーサル・スタジオ・ジャパン]]"
    },
    "media": [
      "2026-01-30-15-03-00_IG_0004_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-03-00_IG_0004.json]]",
    "relatedCardIds": [
      "mention-@katsuo_isono",
      "location-ユニバーサル・スタジオ・ジャパン",
      "tag-#サッカースパイク"
    ]
  },
  "2026-01-30-15-04-00_IG_0005": {
    "id": "2026-01-30-15-04-00_IG_0005",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:04:00+09:00",
    "caption": "海遊館を訪れました。\n@wakame_isono と記録を残します。\n\n#テニスラケット",
    "tags": [
      "テニスラケット"
    ],
    "mentions": [
      "@wakame_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@wakame_isono",
        "wiki": "[[@wakame_isono|@wakame_isono]]"
      },
      {
        "cardId": "location-海遊館",
        "wiki": "[[海遊館]]"
      },
      {
        "cardId": "tag-#テニスラケット",
        "wiki": "[[テニスラケット|#テニスラケット]]"
      }
    ],
    "location": {
      "raw": "海遊館",
      "normalized": "海遊館",
      "geo": {
        "lat": 34.632,
        "lng": 135.446,
        "alt": null
      },
      "synapseLink": "[[海遊館]]"
    },
    "media": [
      "2026-01-30-15-04-00_IG_0005_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-04-00_IG_0005.json]]",
    "relatedCardIds": [
      "mention-@wakame_isono",
      "location-海遊館",
      "tag-#テニスラケット"
    ]
  },
  "2026-01-30-15-05-00_IG_0006": {
    "id": "2026-01-30-15-05-00_IG_0006",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:05:00+09:00",
    "caption": "梅田スカイビルを訪れました。\n@namihei_isono と @fune_isono と記録を残します。\n\n#テニスボール",
    "tags": [
      "テニスボール"
    ],
    "mentions": [
      "@namihei_isono",
      "@fune_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@namihei_isono",
        "wiki": "[[@namihei_isono|@namihei_isono]]"
      },
      {
        "cardId": "mention-@fune_isono",
        "wiki": "[[@fune_isono|@fune_isono]]"
      },
      {
        "cardId": "location-梅田スカイビル",
        "wiki": "[[梅田スカイビル]]"
      },
      {
        "cardId": "tag-#テニスボール",
        "wiki": "[[テニスボール|#テニスボール]]"
      }
    ],
    "location": {
      "raw": "梅田スカイビル",
      "normalized": "梅田スカイビル",
      "geo": {
        "lat": 34.635,
        "lng": 135.45,
        "alt": null
      },
      "synapseLink": "[[梅田スカイビル]]"
    },
    "media": [
      "2026-01-30-15-05-00_IG_0006_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-05-00_IG_0006.json]]",
    "relatedCardIds": [
      "mention-@namihei_isono",
      "mention-@fune_isono",
      "location-梅田スカイビル",
      "tag-#テニスボール"
    ]
  },
  "2026-01-30-15-06-00_IG_0007": {
    "id": "2026-01-30-15-06-00_IG_0007",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:06:00+09:00",
    "caption": "あべのハルカスを訪れました。\n@fune_isono と記録を残します。\n\n#バスケットボール #バスケットゴール",
    "tags": [
      "バスケットボール",
      "バスケットゴール"
    ],
    "mentions": [
      "@fune_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@fune_isono",
        "wiki": "[[@fune_isono|@fune_isono]]"
      },
      {
        "cardId": "location-あべのハルカス",
        "wiki": "[[あべのハルカス]]"
      },
      {
        "cardId": "tag-#バスケットボール",
        "wiki": "[[バスケットボール|#バスケットボール]]"
      },
      {
        "cardId": "tag-#バスケットゴール",
        "wiki": "[[バスケットゴール|#バスケットゴール]]"
      }
    ],
    "location": {
      "raw": "あべのハルカス",
      "normalized": "あべのハルカス",
      "geo": {
        "lat": 34.638,
        "lng": 135.454,
        "alt": null
      },
      "synapseLink": "[[あべのハルカス]]"
    },
    "media": [
      "2026-01-30-15-06-00_IG_0007_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-06-00_IG_0007.json]]",
    "relatedCardIds": [
      "mention-@fune_isono",
      "location-あべのハルカス",
      "tag-#バスケットボール",
      "tag-#バスケットゴール"
    ]
  },
  "2026-01-30-15-07-00_IG_0008": {
    "id": "2026-01-30-15-07-00_IG_0008",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:07:00+09:00",
    "caption": "四天王寺を訪れました。\n@tama_cat と @son_goku と記録を残します。\n\n#バスケットゴール",
    "tags": [
      "バスケットゴール"
    ],
    "mentions": [
      "@tama_cat",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tama_cat",
        "wiki": "[[@tama_cat|@tama_cat]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-四天王寺",
        "wiki": "[[四天王寺]]"
      },
      {
        "cardId": "tag-#バスケットゴール",
        "wiki": "[[バスケットゴール|#バスケットゴール]]"
      }
    ],
    "location": {
      "raw": "四天王寺",
      "normalized": "四天王寺",
      "geo": {
        "lat": 34.641,
        "lng": 135.458,
        "alt": null
      },
      "synapseLink": "[[四天王寺]]"
    },
    "media": [
      "2026-01-30-15-07-00_IG_0008_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-07-00_IG_0008.json]]",
    "relatedCardIds": [
      "mention-@tama_cat",
      "mention-@son_goku",
      "location-四天王寺",
      "tag-#バスケットゴール"
    ]
  },
  "2026-01-30-15-08-00_IG_0009": {
    "id": "2026-01-30-15-08-00_IG_0009",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:08:00+09:00",
    "caption": "黒門市場を訪れました。\n@norisuke_namino と記録を残します。\n\n#ゴルフクラブ",
    "tags": [
      "ゴルフクラブ"
    ],
    "mentions": [
      "@norisuke_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@norisuke_namino",
        "wiki": "[[@norisuke_namino|@norisuke_namino]]"
      },
      {
        "cardId": "location-黒門市場",
        "wiki": "[[黒門市場]]"
      },
      {
        "cardId": "tag-#ゴルフクラブ",
        "wiki": "[[ゴルフクラブ|#ゴルフクラブ]]"
      }
    ],
    "location": {
      "raw": "黒門市場",
      "normalized": "黒門市場",
      "geo": {
        "lat": 34.644,
        "lng": 135.462,
        "alt": null
      },
      "synapseLink": "[[黒門市場]]"
    },
    "media": [
      "2026-01-30-15-08-00_IG_0009_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-08-00_IG_0009.json]]",
    "relatedCardIds": [
      "mention-@norisuke_namino",
      "location-黒門市場",
      "tag-#ゴルフクラブ"
    ]
  },
  "2026-01-30-15-09-00_IG_0010": {
    "id": "2026-01-30-15-09-00_IG_0010",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:09:00+09:00",
    "caption": "新世界を訪れました。\n@taiko_namino と記録を残します。\n\n#ゴルフボール",
    "tags": [
      "ゴルフボール"
    ],
    "mentions": [
      "@taiko_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@taiko_namino",
        "wiki": "[[@taiko_namino|@taiko_namino]]"
      },
      {
        "cardId": "location-新世界",
        "wiki": "[[新世界]]"
      },
      {
        "cardId": "tag-#ゴルフボール",
        "wiki": "[[ゴルフボール|#ゴルフボール]]"
      }
    ],
    "location": {
      "raw": "新世界",
      "normalized": "新世界",
      "geo": {
        "lat": 34.647,
        "lng": 135.466,
        "alt": null
      },
      "synapseLink": "[[新世界]]"
    },
    "media": [
      "2026-01-30-15-09-00_IG_0010_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-09-00_IG_0010.json]]",
    "relatedCardIds": [
      "mention-@taiko_namino",
      "location-新世界",
      "tag-#ゴルフボール"
    ]
  },
  "2026-01-30-15-10-00_IG_0011": {
    "id": "2026-01-30-15-10-00_IG_0011",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:10:00+09:00",
    "caption": "アメリカ村を訪れました。\n@ikura_namino と @son_goku と記録を残します。\n\n#ランニングシューズ",
    "tags": [
      "ランニングシューズ"
    ],
    "mentions": [
      "@ikura_namino",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ikura_namino",
        "wiki": "[[@ikura_namino|@ikura_namino]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-アメリカ村",
        "wiki": "[[アメリカ村]]"
      },
      {
        "cardId": "tag-#ランニングシューズ",
        "wiki": "[[ランニングシューズ|#ランニングシューズ]]"
      }
    ],
    "location": {
      "raw": "アメリカ村",
      "normalized": "アメリカ村",
      "geo": {
        "lat": 34.65,
        "lng": 135.47,
        "alt": null
      },
      "synapseLink": "[[アメリカ村]]"
    },
    "media": [
      "2026-01-30-15-10-00_IG_0011_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-10-00_IG_0011.json]]",
    "relatedCardIds": [
      "mention-@ikura_namino",
      "mention-@son_goku",
      "location-アメリカ村",
      "tag-#ランニングシューズ"
    ]
  },
  "2026-01-30-15-11-00_IG_0012": {
    "id": "2026-01-30-15-11-00_IG_0012",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:11:00+09:00",
    "caption": "難波八阪神社を訪れました。\n@son_goku と記録を残します。\n\n#ダンベル",
    "tags": [
      "ダンベル"
    ],
    "mentions": [
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-難波八阪神社",
        "wiki": "[[難波八阪神社]]"
      },
      {
        "cardId": "tag-#ダンベル",
        "wiki": "[[ダンベル|#ダンベル]]"
      }
    ],
    "location": {
      "raw": "難波八阪神社",
      "normalized": "難波八阪神社",
      "geo": {
        "lat": 34.653,
        "lng": 135.474,
        "alt": null
      },
      "synapseLink": "[[難波八阪神社]]"
    },
    "media": [
      "2026-01-30-15-11-00_IG_0012_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-11-00_IG_0012.json]]",
    "relatedCardIds": [
      "mention-@son_goku",
      "location-難波八阪神社",
      "tag-#ダンベル"
    ]
  },
  "2026-01-30-15-12-00_IG_0013": {
    "id": "2026-01-30-15-12-00_IG_0013",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:12:00+09:00",
    "caption": "天王寺動物園を訪れました。\n@kakarot と記録を残します。\n\n#ヨガマット #水泳ゴーグル",
    "tags": [
      "ヨガマット",
      "水泳ゴーグル"
    ],
    "mentions": [
      "@kakarot"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kakarot",
        "wiki": "[[@kakarot|@kakarot]]"
      },
      {
        "cardId": "location-天王寺動物園",
        "wiki": "[[天王寺動物園]]"
      },
      {
        "cardId": "tag-#ヨガマット",
        "wiki": "[[ヨガマット|#ヨガマット]]"
      },
      {
        "cardId": "tag-#水泳ゴーグル",
        "wiki": "[[水泳ゴーグル|#水泳ゴーグル]]"
      }
    ],
    "location": {
      "raw": "天王寺動物園",
      "normalized": "天王寺動物園",
      "geo": {
        "lat": 34.656,
        "lng": 135.478,
        "alt": null
      },
      "synapseLink": "[[天王寺動物園]]"
    },
    "media": [
      "2026-01-30-15-12-00_IG_0013_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-12-00_IG_0013.json]]",
    "relatedCardIds": [
      "mention-@kakarot",
      "location-天王寺動物園",
      "tag-#ヨガマット",
      "tag-#水泳ゴーグル"
    ]
  },
  "2026-01-30-15-13-00_IG_0014": {
    "id": "2026-01-30-15-13-00_IG_0014",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:13:00+09:00",
    "caption": "箕面大滝を訪れました。\n@vegeta と記録を残します。\n\n#水泳ゴーグル",
    "tags": [
      "水泳ゴーグル"
    ],
    "mentions": [
      "@vegeta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@vegeta",
        "wiki": "[[@vegeta|@vegeta]]"
      },
      {
        "cardId": "location-箕面大滝",
        "wiki": "[[箕面大滝]]"
      },
      {
        "cardId": "tag-#水泳ゴーグル",
        "wiki": "[[水泳ゴーグル|#水泳ゴーグル]]"
      }
    ],
    "location": {
      "raw": "箕面大滝",
      "normalized": "箕面大滝",
      "geo": {
        "lat": 34.659,
        "lng": 135.482,
        "alt": null
      },
      "synapseLink": "[[箕面大滝]]"
    },
    "media": [
      "2026-01-30-15-13-00_IG_0014_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-13-00_IG_0014.json]]",
    "relatedCardIds": [
      "mention-@vegeta",
      "location-箕面大滝",
      "tag-#水泳ゴーグル"
    ]
  },
  "2026-01-30-15-14-00_IG_0015": {
    "id": "2026-01-30-15-14-00_IG_0015",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:14:00+09:00",
    "caption": "万博記念公園を訪れました。\n@prince_vegeta と @son_goku と記録を残します。\n\n#自転車ヘルメット",
    "tags": [
      "自転車ヘルメット"
    ],
    "mentions": [
      "@prince_vegeta",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@prince_vegeta",
        "wiki": "[[@prince_vegeta|@prince_vegeta]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-万博記念公園",
        "wiki": "[[万博記念公園]]"
      },
      {
        "cardId": "tag-#自転車ヘルメット",
        "wiki": "[[自転車ヘルメット|#自転車ヘルメット]]"
      }
    ],
    "location": {
      "raw": "万博記念公園",
      "normalized": "万博記念公園",
      "geo": {
        "lat": 34.662,
        "lng": 135.486,
        "alt": null
      },
      "synapseLink": "[[万博記念公園]]"
    },
    "media": [
      "2026-01-30-15-14-00_IG_0015_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-14-00_IG_0015.json]]",
    "relatedCardIds": [
      "mention-@prince_vegeta",
      "mention-@son_goku",
      "location-万博記念公園",
      "tag-#自転車ヘルメット"
    ]
  },
  "2026-01-30-15-15-00_IG_0016": {
    "id": "2026-01-30-15-15-00_IG_0016",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:15:00+09:00",
    "caption": "スパワールドを訪れました。\n@piccolo と @ma_junior と記録を残します。\n\n#枝豆",
    "tags": [
      "枝豆"
    ],
    "mentions": [
      "@piccolo",
      "@ma_junior"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@piccolo",
        "wiki": "[[@piccolo|@piccolo]]"
      },
      {
        "cardId": "mention-@ma_junior",
        "wiki": "[[@ma_junior|@ma_junior]]"
      },
      {
        "cardId": "location-スパワールド",
        "wiki": "[[スパワールド]]"
      },
      {
        "cardId": "tag-#枝豆",
        "wiki": "[[枝豆|#枝豆]]"
      }
    ],
    "location": {
      "raw": "スパワールド",
      "normalized": "スパワールド",
      "geo": {
        "lat": 34.665,
        "lng": 135.49,
        "alt": null
      },
      "synapseLink": "[[スパワールド]]"
    },
    "media": [
      "2026-01-30-15-15-00_IG_0016_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-15-00_IG_0016.json]]",
    "relatedCardIds": [
      "mention-@piccolo",
      "mention-@ma_junior",
      "location-スパワールド",
      "tag-#枝豆"
    ]
  },
  "2026-01-30-15-16-00_IG_0017": {
    "id": "2026-01-30-15-16-00_IG_0017",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:16:00+09:00",
    "caption": "天保山大観覧車を訪れました。\n@ma_junior と記録を残します。\n\n#冷やしトマト",
    "tags": [
      "冷やしトマト"
    ],
    "mentions": [
      "@ma_junior"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ma_junior",
        "wiki": "[[@ma_junior|@ma_junior]]"
      },
      {
        "cardId": "location-天保山大観覧車",
        "wiki": "[[天保山大観覧車]]"
      },
      {
        "cardId": "tag-#冷やしトマト",
        "wiki": "[[冷やしトマト|#冷やしトマト]]"
      }
    ],
    "location": {
      "raw": "天保山大観覧車",
      "normalized": "天保山大観覧車",
      "geo": {
        "lat": 34.668,
        "lng": 135.494,
        "alt": null
      },
      "synapseLink": "[[天保山大観覧車]]"
    },
    "media": [
      "2026-01-30-15-16-00_IG_0017_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-16-00_IG_0017.json]]",
    "relatedCardIds": [
      "mention-@ma_junior",
      "location-天保山大観覧車",
      "tag-#冷やしトマト"
    ]
  },
  "2026-01-30-15-17-00_IG_0018": {
    "id": "2026-01-30-15-17-00_IG_0018",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:17:00+09:00",
    "caption": "キッズプラザ大阪を訪れました。\n@son_gohan と記録を残します。\n\n#だし巻き卵",
    "tags": [
      "だし巻き卵"
    ],
    "mentions": [
      "@son_gohan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_gohan",
        "wiki": "[[@son_gohan|@son_gohan]]"
      },
      {
        "cardId": "location-キッズプラザ大阪",
        "wiki": "[[キッズプラザ大阪]]"
      },
      {
        "cardId": "tag-#だし巻き卵",
        "wiki": "[[だし巻き卵|#だし巻き卵]]"
      }
    ],
    "location": {
      "raw": "キッズプラザ大阪",
      "normalized": "キッズプラザ大阪",
      "geo": {
        "lat": 34.671,
        "lng": 135.498,
        "alt": null
      },
      "synapseLink": "[[キッズプラザ大阪]]"
    },
    "media": [
      "2026-01-30-15-17-00_IG_0018_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-17-00_IG_0018.json]]",
    "relatedCardIds": [
      "mention-@son_gohan",
      "location-キッズプラザ大阪",
      "tag-#だし巻き卵"
    ]
  },
  "2026-01-30-15-18-00_IG_0019": {
    "id": "2026-01-30-15-18-00_IG_0019",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:18:00+09:00",
    "caption": "造幣局博物館を訪れました。\n@great_saiyaman と記録を残します。\n\n#鶏の唐揚げ #焼き鳥",
    "tags": [
      "鶏の唐揚げ",
      "焼き鳥"
    ],
    "mentions": [
      "@great_saiyaman"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@great_saiyaman",
        "wiki": "[[@great_saiyaman|@great_saiyaman]]"
      },
      {
        "cardId": "location-造幣局博物館",
        "wiki": "[[造幣局博物館]]"
      },
      {
        "cardId": "tag-#鶏の唐揚げ",
        "wiki": "[[鶏の唐揚げ|#鶏の唐揚げ]]"
      },
      {
        "cardId": "tag-#焼き鳥",
        "wiki": "[[焼き鳥|#焼き鳥]]"
      }
    ],
    "location": {
      "raw": "造幣局博物館",
      "normalized": "造幣局博物館",
      "geo": {
        "lat": 34.674,
        "lng": 135.502,
        "alt": null
      },
      "synapseLink": "[[造幣局博物館]]"
    },
    "media": [
      "2026-01-30-15-18-00_IG_0019_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-18-00_IG_0019.json]]",
    "relatedCardIds": [
      "mention-@great_saiyaman",
      "location-造幣局博物館",
      "tag-#鶏の唐揚げ",
      "tag-#焼き鳥"
    ]
  },
  "2026-01-30-15-19-00_IG_0020": {
    "id": "2026-01-30-15-19-00_IG_0020",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:19:00+09:00",
    "caption": "グランフロント大阪を訪れました。\n@kuririn と記録を残します。\n\n#焼き鳥",
    "tags": [
      "焼き鳥"
    ],
    "mentions": [
      "@kuririn"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kuririn",
        "wiki": "[[@kuririn|@kuririn]]"
      },
      {
        "cardId": "location-グランフロント大阪",
        "wiki": "[[グランフロント大阪]]"
      },
      {
        "cardId": "tag-#焼き鳥",
        "wiki": "[[焼き鳥|#焼き鳥]]"
      }
    ],
    "location": {
      "raw": "グランフロント大阪",
      "normalized": "グランフロント大阪",
      "geo": {
        "lat": 34.677,
        "lng": 135.506,
        "alt": null
      },
      "synapseLink": "[[グランフロント大阪]]"
    },
    "media": [
      "2026-01-30-15-19-00_IG_0020_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-19-00_IG_0020.json]]",
    "relatedCardIds": [
      "mention-@kuririn",
      "location-グランフロント大阪",
      "tag-#焼き鳥"
    ]
  },
  "2026-01-30-15-20-00_IG_0021": {
    "id": "2026-01-30-15-20-00_IG_0021",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:20:00+09:00",
    "caption": "HEP FIVEを訪れました。\n@bulma と @kamesennin と記録を残します。\n\n#つくね",
    "tags": [
      "つくね"
    ],
    "mentions": [
      "@bulma",
      "@kamesennin"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@bulma",
        "wiki": "[[@bulma|@bulma]]"
      },
      {
        "cardId": "mention-@kamesennin",
        "wiki": "[[@kamesennin|@kamesennin]]"
      },
      {
        "cardId": "location-HEP FIVE",
        "wiki": "[[HEP FIVE]]"
      },
      {
        "cardId": "tag-#つくね",
        "wiki": "[[つくね|#つくね]]"
      }
    ],
    "location": {
      "raw": "HEP FIVE",
      "normalized": "HEP FIVE",
      "geo": {
        "lat": 34.68,
        "lng": 135.51,
        "alt": null
      },
      "synapseLink": "[[HEP FIVE]]"
    },
    "media": [
      "2026-01-30-15-20-00_IG_0021_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-20-00_IG_0021.json]]",
    "relatedCardIds": [
      "mention-@bulma",
      "mention-@kamesennin",
      "location-HEP FIVE",
      "tag-#つくね"
    ]
  },
  "2026-01-30-15-21-00_IG_0022": {
    "id": "2026-01-30-15-21-00_IG_0022",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:21:00+09:00",
    "caption": "中之島公園を訪れました。\n@kamesennin と @son_goku と記録を残します。\n\n#刺身盛り合わせ",
    "tags": [
      "刺身盛り合わせ"
    ],
    "mentions": [
      "@kamesennin",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kamesennin",
        "wiki": "[[@kamesennin|@kamesennin]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-中之島公園",
        "wiki": "[[中之島公園]]"
      },
      {
        "cardId": "tag-#刺身盛り合わせ",
        "wiki": "[[刺身盛り合わせ|#刺身盛り合わせ]]"
      }
    ],
    "location": {
      "raw": "中之島公園",
      "normalized": "中之島公園",
      "geo": {
        "lat": 34.683,
        "lng": 135.514,
        "alt": null
      },
      "synapseLink": "[[中之島公園]]"
    },
    "media": [
      "2026-01-30-15-21-00_IG_0022_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-21-00_IG_0022.json]]",
    "relatedCardIds": [
      "mention-@kamesennin",
      "mention-@son_goku",
      "location-中之島公園",
      "tag-#刺身盛り合わせ"
    ]
  },
  "2026-01-30-15-22-00_IG_0023": {
    "id": "2026-01-30-15-22-00_IG_0023",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:22:00+09:00",
    "caption": "大阪市立科学館を訪れました。\n@jackie_chun と記録を残します。\n\n#しめ鯖",
    "tags": [
      "しめ鯖"
    ],
    "mentions": [
      "@jackie_chun"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@jackie_chun",
        "wiki": "[[@jackie_chun|@jackie_chun]]"
      },
      {
        "cardId": "location-大阪市立科学館",
        "wiki": "[[大阪市立科学館]]"
      },
      {
        "cardId": "tag-#しめ鯖",
        "wiki": "[[しめ鯖|#しめ鯖]]"
      }
    ],
    "location": {
      "raw": "大阪市立科学館",
      "normalized": "大阪市立科学館",
      "geo": {
        "lat": 34.686,
        "lng": 135.518,
        "alt": null
      },
      "synapseLink": "[[大阪市立科学館]]"
    },
    "media": [
      "2026-01-30-15-22-00_IG_0023_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-22-00_IG_0023.json]]",
    "relatedCardIds": [
      "mention-@jackie_chun",
      "location-大阪市立科学館",
      "tag-#しめ鯖"
    ]
  },
  "2026-01-30-15-23-00_IG_0024": {
    "id": "2026-01-30-15-23-00_IG_0024",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:23:00+09:00",
    "caption": "国立国際美術館を訪れました。\n@tenshinhan と記録を残します。\n\n#ほっけ開き",
    "tags": [
      "ほっけ開き"
    ],
    "mentions": [
      "@tenshinhan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tenshinhan",
        "wiki": "[[@tenshinhan|@tenshinhan]]"
      },
      {
        "cardId": "location-国立国際美術館",
        "wiki": "[[国立国際美術館]]"
      },
      {
        "cardId": "tag-#ほっけ開き",
        "wiki": "[[ほっけ開き|#ほっけ開き]]"
      }
    ],
    "location": {
      "raw": "国立国際美術館",
      "normalized": "国立国際美術館",
      "geo": {
        "lat": 34.689,
        "lng": 135.522,
        "alt": null
      },
      "synapseLink": "[[国立国際美術館]]"
    },
    "media": [
      "2026-01-30-15-23-00_IG_0024_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-23-00_IG_0024.json]]",
    "relatedCardIds": [
      "mention-@tenshinhan",
      "location-国立国際美術館",
      "tag-#ほっけ開き"
    ]
  },
  "2026-01-30-15-24-00_IG_0025": {
    "id": "2026-01-30-15-24-00_IG_0025",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:24:00+09:00",
    "caption": "大阪歴史博物館を訪れました。\n@yamcha と記録を残します。\n\n#揚げ出し豆腐 #フライドポテト",
    "tags": [
      "揚げ出し豆腐",
      "フライドポテト"
    ],
    "mentions": [
      "@yamcha"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@yamcha",
        "wiki": "[[@yamcha|@yamcha]]"
      },
      {
        "cardId": "location-大阪歴史博物館",
        "wiki": "[[大阪歴史博物館]]"
      },
      {
        "cardId": "tag-#揚げ出し豆腐",
        "wiki": "[[揚げ出し豆腐|#揚げ出し豆腐]]"
      },
      {
        "cardId": "tag-#フライドポテト",
        "wiki": "[[フライドポテト|#フライドポテト]]"
      }
    ],
    "location": {
      "raw": "大阪歴史博物館",
      "normalized": "大阪歴史博物館",
      "geo": {
        "lat": 34.692,
        "lng": 135.526,
        "alt": null
      },
      "synapseLink": "[[大阪歴史博物館]]"
    },
    "media": [
      "2026-01-30-15-24-00_IG_0025_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-24-00_IG_0025.json]]",
    "relatedCardIds": [
      "mention-@yamcha",
      "location-大阪歴史博物館",
      "tag-#揚げ出し豆腐",
      "tag-#フライドポテト"
    ]
  },
  "2026-01-30-15-25-00_IG_0026": {
    "id": "2026-01-30-15-25-00_IG_0026",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:25:00+09:00",
    "caption": "千日前道具屋筋商店街を訪れました。\n@trunks と @goten と記録を残します。\n\n#フライドポテト",
    "tags": [
      "フライドポテト"
    ],
    "mentions": [
      "@trunks",
      "@goten"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@trunks",
        "wiki": "[[@trunks|@trunks]]"
      },
      {
        "cardId": "mention-@goten",
        "wiki": "[[@goten|@goten]]"
      },
      {
        "cardId": "location-千日前道具屋筋商店街",
        "wiki": "[[千日前道具屋筋商店街]]"
      },
      {
        "cardId": "tag-#フライドポテト",
        "wiki": "[[フライドポテト|#フライドポテト]]"
      }
    ],
    "location": {
      "raw": "千日前道具屋筋商店街",
      "normalized": "千日前道具屋筋商店街",
      "geo": {
        "lat": 34.695,
        "lng": 135.53,
        "alt": null
      },
      "synapseLink": "[[千日前道具屋筋商店街]]"
    },
    "media": [
      "2026-01-30-15-25-00_IG_0026_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-25-00_IG_0026.json]]",
    "relatedCardIds": [
      "mention-@trunks",
      "mention-@goten",
      "location-千日前道具屋筋商店街",
      "tag-#フライドポテト"
    ]
  },
  "2026-01-30-15-26-00_IG_0027": {
    "id": "2026-01-30-15-26-00_IG_0027",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:26:00+09:00",
    "caption": "法善寺横丁を訪れました。\n@goten と記録を残します。\n\n#もつ煮込み",
    "tags": [
      "もつ煮込み"
    ],
    "mentions": [
      "@goten"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@goten",
        "wiki": "[[@goten|@goten]]"
      },
      {
        "cardId": "location-法善寺横丁",
        "wiki": "[[法善寺横丁]]"
      },
      {
        "cardId": "tag-#もつ煮込み",
        "wiki": "[[もつ煮込み|#もつ煮込み]]"
      }
    ],
    "location": {
      "raw": "法善寺横丁",
      "normalized": "法善寺横丁",
      "geo": {
        "lat": 34.698,
        "lng": 135.534,
        "alt": null
      },
      "synapseLink": "[[法善寺横丁]]"
    },
    "media": [
      "2026-01-30-15-26-00_IG_0027_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-26-00_IG_0027.json]]",
    "relatedCardIds": [
      "mention-@goten",
      "location-法善寺横丁",
      "tag-#もつ煮込み"
    ]
  },
  "2026-01-30-15-27-00_IG_0028": {
    "id": "2026-01-30-15-27-00_IG_0028",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:27:00+09:00",
    "caption": "露天神社を訪れました。\n@freeza と記録を残します。\n\n#焼きおにぎり",
    "tags": [
      "焼きおにぎり"
    ],
    "mentions": [
      "@freeza"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@freeza",
        "wiki": "[[@freeza|@freeza]]"
      },
      {
        "cardId": "location-露天神社",
        "wiki": "[[露天神社]]"
      },
      {
        "cardId": "tag-#焼きおにぎり",
        "wiki": "[[焼きおにぎり|#焼きおにぎり]]"
      }
    ],
    "location": {
      "raw": "露天神社",
      "normalized": "露天神社",
      "geo": {
        "lat": 34.701,
        "lng": 135.538,
        "alt": null
      },
      "synapseLink": "[[露天神社]]"
    },
    "media": [
      "2026-01-30-15-27-00_IG_0028_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-27-00_IG_0028.json]]",
    "relatedCardIds": [
      "mention-@freeza",
      "location-露天神社",
      "tag-#焼きおにぎり"
    ]
  },
  "2026-01-30-15-28-00_IG_0029": {
    "id": "2026-01-30-15-28-00_IG_0029",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:28:00+09:00",
    "caption": "岸和田城を訪れました。\n@cell と @son_goku と記録を残します。\n\n#生ビール",
    "tags": [
      "生ビール"
    ],
    "mentions": [
      "@cell",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@cell",
        "wiki": "[[@cell|@cell]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "location-岸和田城",
        "wiki": "[[岸和田城]]"
      },
      {
        "cardId": "tag-#生ビール",
        "wiki": "[[生ビール|#生ビール]]"
      }
    ],
    "location": {
      "raw": "岸和田城",
      "normalized": "岸和田城",
      "geo": {
        "lat": 34.704,
        "lng": 135.542,
        "alt": null
      },
      "synapseLink": "[[岸和田城]]"
    },
    "media": [
      "2026-01-30-15-28-00_IG_0029_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-28-00_IG_0029.json]]",
    "relatedCardIds": [
      "mention-@cell",
      "mention-@son_goku",
      "location-岸和田城",
      "tag-#生ビール"
    ]
  },
  "2026-01-30-15-29-00_IG_0030": {
    "id": "2026-01-30-15-29-00_IG_0030",
    "source": "instagram",
    "type": "Feed",
    "content": null,
    "date": "2026-01-30T15:29:00+09:00",
    "caption": "USJを訪れました。\n@majin_buu と記録を残します。\n\n#ハイボール",
    "tags": [
      "ハイボール"
    ],
    "mentions": [
      "@majin_buu"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@majin_buu",
        "wiki": "[[@majin_buu|@majin_buu]]"
      },
      {
        "cardId": "location-USJ",
        "wiki": "[[USJ]]"
      },
      {
        "cardId": "tag-#ハイボール",
        "wiki": "[[ハイボール|#ハイボール]]"
      }
    ],
    "location": {
      "raw": "USJ",
      "normalized": "USJ",
      "geo": {
        "lat": 34.707,
        "lng": 135.546,
        "alt": null
      },
      "synapseLink": "[[USJ]]"
    },
    "media": [
      "2026-01-30-15-29-00_IG_0030_photo_001.jpg"
    ],
    "rawSourcePath": "[[2026-01-30-15-29-00_IG_0030.json]]",
    "relatedCardIds": [
      "mention-@majin_buu",
      "location-USJ",
      "tag-#ハイボール"
    ]
  },
  "2026-02-15-10-00-00_IGR_0001": {
    "id": "2026-02-15-10-00-00_IGR_0001",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:00:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@sazae_fuguta @son_goku\n#テニスボール",
    "tags": [
      "テニスボール"
    ],
    "mentions": [
      "@sazae_fuguta",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@sazae_fuguta",
        "wiki": "[[@sazae_fuguta|@sazae_fuguta]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#テニスボール",
        "wiki": "[[テニスボール|#テニスボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.65,
        "lng": 135.47,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-00-00_IGR_0001_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-00-00_IGR_0001.json]]",
    "relatedCardIds": [
      "mention-@sazae_fuguta",
      "mention-@son_goku",
      "tag-#テニスボール"
    ]
  },
  "2026-02-15-10-01-00_IGR_0002": {
    "id": "2026-02-15-10-01-00_IGR_0002",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:01:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@masuo_fuguta\n#バスケットボール",
    "tags": [
      "バスケットボール"
    ],
    "mentions": [
      "@masuo_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@masuo_fuguta",
        "wiki": "[[@masuo_fuguta|@masuo_fuguta]]"
      },
      {
        "cardId": "tag-#バスケットボール",
        "wiki": "[[バスケットボール|#バスケットボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.652,
        "lng": 135.472,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-01-00_IGR_0002_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-01-00_IGR_0002.json]]",
    "relatedCardIds": [
      "mention-@masuo_fuguta",
      "tag-#バスケットボール"
    ]
  },
  "2026-02-15-10-02-00_IGR_0003": {
    "id": "2026-02-15-10-02-00_IGR_0003",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:02:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@tara_fuguta\n#バスケットゴール",
    "tags": [
      "バスケットゴール"
    ],
    "mentions": [
      "@tara_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tara_fuguta",
        "wiki": "[[@tara_fuguta|@tara_fuguta]]"
      },
      {
        "cardId": "tag-#バスケットゴール",
        "wiki": "[[バスケットゴール|#バスケットゴール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.654,
        "lng": 135.474,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-02-00_IGR_0003_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-02-00_IGR_0003.json]]",
    "relatedCardIds": [
      "mention-@tara_fuguta",
      "tag-#バスケットゴール"
    ]
  },
  "2026-02-15-10-03-00_IGR_0004": {
    "id": "2026-02-15-10-03-00_IGR_0004",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:03:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@katsuo_isono\n#ゴルフクラブ",
    "tags": [
      "ゴルフクラブ"
    ],
    "mentions": [
      "@katsuo_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@katsuo_isono",
        "wiki": "[[@katsuo_isono|@katsuo_isono]]"
      },
      {
        "cardId": "tag-#ゴルフクラブ",
        "wiki": "[[ゴルフクラブ|#ゴルフクラブ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.656,
        "lng": 135.476,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-03-00_IGR_0004_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-03-00_IGR_0004.json]]",
    "relatedCardIds": [
      "mention-@katsuo_isono",
      "tag-#ゴルフクラブ"
    ]
  },
  "2026-02-15-10-04-00_IGR_0005": {
    "id": "2026-02-15-10-04-00_IGR_0005",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:04:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@wakame_isono\n#ゴルフボール",
    "tags": [
      "ゴルフボール"
    ],
    "mentions": [
      "@wakame_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@wakame_isono",
        "wiki": "[[@wakame_isono|@wakame_isono]]"
      },
      {
        "cardId": "tag-#ゴルフボール",
        "wiki": "[[ゴルフボール|#ゴルフボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.658,
        "lng": 135.478,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-04-00_IGR_0005_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-04-00_IGR_0005.json]]",
    "relatedCardIds": [
      "mention-@wakame_isono",
      "tag-#ゴルフボール"
    ]
  },
  "2026-02-15-10-05-00_IGR_0006": {
    "id": "2026-02-15-10-05-00_IGR_0006",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:05:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@namihei_isono\n#ランニングシューズ",
    "tags": [
      "ランニングシューズ"
    ],
    "mentions": [
      "@namihei_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@namihei_isono",
        "wiki": "[[@namihei_isono|@namihei_isono]]"
      },
      {
        "cardId": "tag-#ランニングシューズ",
        "wiki": "[[ランニングシューズ|#ランニングシューズ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.66,
        "lng": 135.48,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-05-00_IGR_0006_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-05-00_IGR_0006.json]]",
    "relatedCardIds": [
      "mention-@namihei_isono",
      "tag-#ランニングシューズ"
    ]
  },
  "2026-02-15-10-06-00_IGR_0007": {
    "id": "2026-02-15-10-06-00_IGR_0007",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:06:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@fune_isono\n#ダンベル",
    "tags": [
      "ダンベル"
    ],
    "mentions": [
      "@fune_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@fune_isono",
        "wiki": "[[@fune_isono|@fune_isono]]"
      },
      {
        "cardId": "tag-#ダンベル",
        "wiki": "[[ダンベル|#ダンベル]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.662,
        "lng": 135.482,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-06-00_IGR_0007_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-06-00_IGR_0007.json]]",
    "relatedCardIds": [
      "mention-@fune_isono",
      "tag-#ダンベル"
    ]
  },
  "2026-02-15-10-07-00_IGR_0008": {
    "id": "2026-02-15-10-07-00_IGR_0008",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:07:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@tama_cat\n#ヨガマット",
    "tags": [
      "ヨガマット"
    ],
    "mentions": [
      "@tama_cat"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tama_cat",
        "wiki": "[[@tama_cat|@tama_cat]]"
      },
      {
        "cardId": "tag-#ヨガマット",
        "wiki": "[[ヨガマット|#ヨガマット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.664,
        "lng": 135.484,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-07-00_IGR_0008_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-07-00_IGR_0008.json]]",
    "relatedCardIds": [
      "mention-@tama_cat",
      "tag-#ヨガマット"
    ]
  },
  "2026-02-15-10-08-00_IGR_0009": {
    "id": "2026-02-15-10-08-00_IGR_0009",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:08:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@norisuke_namino @son_goku\n#水泳ゴーグル",
    "tags": [
      "水泳ゴーグル"
    ],
    "mentions": [
      "@norisuke_namino",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@norisuke_namino",
        "wiki": "[[@norisuke_namino|@norisuke_namino]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#水泳ゴーグル",
        "wiki": "[[水泳ゴーグル|#水泳ゴーグル]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.666,
        "lng": 135.486,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-08-00_IGR_0009_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-08-00_IGR_0009.json]]",
    "relatedCardIds": [
      "mention-@norisuke_namino",
      "mention-@son_goku",
      "tag-#水泳ゴーグル"
    ]
  },
  "2026-02-15-10-09-00_IGR_0010": {
    "id": "2026-02-15-10-09-00_IGR_0010",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:09:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@taiko_namino\n#自転車ヘルメット",
    "tags": [
      "自転車ヘルメット"
    ],
    "mentions": [
      "@taiko_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@taiko_namino",
        "wiki": "[[@taiko_namino|@taiko_namino]]"
      },
      {
        "cardId": "tag-#自転車ヘルメット",
        "wiki": "[[自転車ヘルメット|#自転車ヘルメット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.668,
        "lng": 135.488,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-09-00_IGR_0010_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-09-00_IGR_0010.json]]",
    "relatedCardIds": [
      "mention-@taiko_namino",
      "tag-#自転車ヘルメット"
    ]
  },
  "2026-02-15-10-10-00_IGR_0011": {
    "id": "2026-02-15-10-10-00_IGR_0011",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:10:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@ikura_namino\n#枝豆",
    "tags": [
      "枝豆"
    ],
    "mentions": [
      "@ikura_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ikura_namino",
        "wiki": "[[@ikura_namino|@ikura_namino]]"
      },
      {
        "cardId": "tag-#枝豆",
        "wiki": "[[枝豆|#枝豆]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.67,
        "lng": 135.49,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-10-00_IGR_0011_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-10-00_IGR_0011.json]]",
    "relatedCardIds": [
      "mention-@ikura_namino",
      "tag-#枝豆"
    ]
  },
  "2026-02-15-10-11-00_IGR_0012": {
    "id": "2026-02-15-10-11-00_IGR_0012",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:11:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@son_goku\n#冷やしトマト",
    "tags": [
      "冷やしトマト"
    ],
    "mentions": [
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#冷やしトマト",
        "wiki": "[[冷やしトマト|#冷やしトマト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.672,
        "lng": 135.492,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-11-00_IGR_0012_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-11-00_IGR_0012.json]]",
    "relatedCardIds": [
      "mention-@son_goku",
      "tag-#冷やしトマト"
    ]
  },
  "2026-02-15-10-12-00_IGR_0013": {
    "id": "2026-02-15-10-12-00_IGR_0013",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:12:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@kakarot\n#だし巻き卵",
    "tags": [
      "だし巻き卵"
    ],
    "mentions": [
      "@kakarot"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kakarot",
        "wiki": "[[@kakarot|@kakarot]]"
      },
      {
        "cardId": "tag-#だし巻き卵",
        "wiki": "[[だし巻き卵|#だし巻き卵]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-12-00_IGR_0013_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-12-00_IGR_0013.json]]",
    "relatedCardIds": [
      "mention-@kakarot",
      "tag-#だし巻き卵"
    ]
  },
  "2026-02-15-10-13-00_IGR_0014": {
    "id": "2026-02-15-10-13-00_IGR_0014",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:13:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@vegeta\n#鶏の唐揚げ",
    "tags": [
      "鶏の唐揚げ"
    ],
    "mentions": [
      "@vegeta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@vegeta",
        "wiki": "[[@vegeta|@vegeta]]"
      },
      {
        "cardId": "tag-#鶏の唐揚げ",
        "wiki": "[[鶏の唐揚げ|#鶏の唐揚げ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-13-00_IGR_0014_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-13-00_IGR_0014.json]]",
    "relatedCardIds": [
      "mention-@vegeta",
      "tag-#鶏の唐揚げ"
    ]
  },
  "2026-02-15-10-14-00_IGR_0015": {
    "id": "2026-02-15-10-14-00_IGR_0015",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:14:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@prince_vegeta\n#焼き鳥",
    "tags": [
      "焼き鳥"
    ],
    "mentions": [
      "@prince_vegeta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@prince_vegeta",
        "wiki": "[[@prince_vegeta|@prince_vegeta]]"
      },
      {
        "cardId": "tag-#焼き鳥",
        "wiki": "[[焼き鳥|#焼き鳥]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-14-00_IGR_0015_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-14-00_IGR_0015.json]]",
    "relatedCardIds": [
      "mention-@prince_vegeta",
      "tag-#焼き鳥"
    ]
  },
  "2026-02-15-10-15-00_IGR_0016": {
    "id": "2026-02-15-10-15-00_IGR_0016",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:15:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@piccolo\n#つくね",
    "tags": [
      "つくね"
    ],
    "mentions": [
      "@piccolo"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@piccolo",
        "wiki": "[[@piccolo|@piccolo]]"
      },
      {
        "cardId": "tag-#つくね",
        "wiki": "[[つくね|#つくね]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-15-00_IGR_0016_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-15-00_IGR_0016.json]]",
    "relatedCardIds": [
      "mention-@piccolo",
      "tag-#つくね"
    ]
  },
  "2026-02-15-10-16-00_IGR_0017": {
    "id": "2026-02-15-10-16-00_IGR_0017",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:16:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@ma_junior @son_goku\n#刺身盛り合わせ",
    "tags": [
      "刺身盛り合わせ"
    ],
    "mentions": [
      "@ma_junior",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ma_junior",
        "wiki": "[[@ma_junior|@ma_junior]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#刺身盛り合わせ",
        "wiki": "[[刺身盛り合わせ|#刺身盛り合わせ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-16-00_IGR_0017_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-16-00_IGR_0017.json]]",
    "relatedCardIds": [
      "mention-@ma_junior",
      "mention-@son_goku",
      "tag-#刺身盛り合わせ"
    ]
  },
  "2026-02-15-10-17-00_IGR_0018": {
    "id": "2026-02-15-10-17-00_IGR_0018",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:17:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@son_gohan\n#しめ鯖",
    "tags": [
      "しめ鯖"
    ],
    "mentions": [
      "@son_gohan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_gohan",
        "wiki": "[[@son_gohan|@son_gohan]]"
      },
      {
        "cardId": "tag-#しめ鯖",
        "wiki": "[[しめ鯖|#しめ鯖]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-17-00_IGR_0018_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-17-00_IGR_0018.json]]",
    "relatedCardIds": [
      "mention-@son_gohan",
      "tag-#しめ鯖"
    ]
  },
  "2026-02-15-10-18-00_IGR_0019": {
    "id": "2026-02-15-10-18-00_IGR_0019",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:18:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@great_saiyaman\n#ほっけ開き",
    "tags": [
      "ほっけ開き"
    ],
    "mentions": [
      "@great_saiyaman"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@great_saiyaman",
        "wiki": "[[@great_saiyaman|@great_saiyaman]]"
      },
      {
        "cardId": "tag-#ほっけ開き",
        "wiki": "[[ほっけ開き|#ほっけ開き]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-18-00_IGR_0019_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-18-00_IGR_0019.json]]",
    "relatedCardIds": [
      "mention-@great_saiyaman",
      "tag-#ほっけ開き"
    ]
  },
  "2026-02-15-10-19-00_IGR_0020": {
    "id": "2026-02-15-10-19-00_IGR_0020",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:19:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@kuririn\n#揚げ出し豆腐",
    "tags": [
      "揚げ出し豆腐"
    ],
    "mentions": [
      "@kuririn"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kuririn",
        "wiki": "[[@kuririn|@kuririn]]"
      },
      {
        "cardId": "tag-#揚げ出し豆腐",
        "wiki": "[[揚げ出し豆腐|#揚げ出し豆腐]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-19-00_IGR_0020_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-19-00_IGR_0020.json]]",
    "relatedCardIds": [
      "mention-@kuririn",
      "tag-#揚げ出し豆腐"
    ]
  },
  "2026-02-15-10-20-00_IGR_0021": {
    "id": "2026-02-15-10-20-00_IGR_0021",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:20:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@bulma\n#フライドポテト",
    "tags": [
      "フライドポテト"
    ],
    "mentions": [
      "@bulma"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@bulma",
        "wiki": "[[@bulma|@bulma]]"
      },
      {
        "cardId": "tag-#フライドポテト",
        "wiki": "[[フライドポテト|#フライドポテト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-20-00_IGR_0021_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-20-00_IGR_0021.json]]",
    "relatedCardIds": [
      "mention-@bulma",
      "tag-#フライドポテト"
    ]
  },
  "2026-02-15-10-21-00_IGR_0022": {
    "id": "2026-02-15-10-21-00_IGR_0022",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:21:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@kamesennin\n#もつ煮込み",
    "tags": [
      "もつ煮込み"
    ],
    "mentions": [
      "@kamesennin"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kamesennin",
        "wiki": "[[@kamesennin|@kamesennin]]"
      },
      {
        "cardId": "tag-#もつ煮込み",
        "wiki": "[[もつ煮込み|#もつ煮込み]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-21-00_IGR_0022_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-21-00_IGR_0022.json]]",
    "relatedCardIds": [
      "mention-@kamesennin",
      "tag-#もつ煮込み"
    ]
  },
  "2026-02-15-10-22-00_IGR_0023": {
    "id": "2026-02-15-10-22-00_IGR_0023",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:22:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@jackie_chun\n#焼きおにぎり",
    "tags": [
      "焼きおにぎり"
    ],
    "mentions": [
      "@jackie_chun"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@jackie_chun",
        "wiki": "[[@jackie_chun|@jackie_chun]]"
      },
      {
        "cardId": "tag-#焼きおにぎり",
        "wiki": "[[焼きおにぎり|#焼きおにぎり]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-22-00_IGR_0023_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-22-00_IGR_0023.json]]",
    "relatedCardIds": [
      "mention-@jackie_chun",
      "tag-#焼きおにぎり"
    ]
  },
  "2026-02-15-10-23-00_IGR_0024": {
    "id": "2026-02-15-10-23-00_IGR_0024",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:23:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@tenshinhan\n#生ビール",
    "tags": [
      "生ビール"
    ],
    "mentions": [
      "@tenshinhan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tenshinhan",
        "wiki": "[[@tenshinhan|@tenshinhan]]"
      },
      {
        "cardId": "tag-#生ビール",
        "wiki": "[[生ビール|#生ビール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-23-00_IGR_0024_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-23-00_IGR_0024.json]]",
    "relatedCardIds": [
      "mention-@tenshinhan",
      "tag-#生ビール"
    ]
  },
  "2026-02-15-10-24-00_IGR_0025": {
    "id": "2026-02-15-10-24-00_IGR_0025",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:24:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@yamcha @son_goku\n#ハイボール",
    "tags": [
      "ハイボール"
    ],
    "mentions": [
      "@yamcha",
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@yamcha",
        "wiki": "[[@yamcha|@yamcha]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#ハイボール",
        "wiki": "[[ハイボール|#ハイボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-24-00_IGR_0025_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-24-00_IGR_0025.json]]",
    "relatedCardIds": [
      "mention-@yamcha",
      "mention-@son_goku",
      "tag-#ハイボール"
    ]
  },
  "2026-02-15-10-25-00_IGR_0026": {
    "id": "2026-02-15-10-25-00_IGR_0026",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:25:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@trunks\n#野球バット",
    "tags": [
      "野球バット"
    ],
    "mentions": [
      "@trunks"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@trunks",
        "wiki": "[[@trunks|@trunks]]"
      },
      {
        "cardId": "tag-#野球バット",
        "wiki": "[[野球バット|#野球バット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-25-00_IGR_0026_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-25-00_IGR_0026.json]]",
    "relatedCardIds": [
      "mention-@trunks",
      "tag-#野球バット"
    ]
  },
  "2026-02-15-10-26-00_IGR_0027": {
    "id": "2026-02-15-10-26-00_IGR_0027",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:26:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@goten\n#野球グローブ",
    "tags": [
      "野球グローブ"
    ],
    "mentions": [
      "@goten"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@goten",
        "wiki": "[[@goten|@goten]]"
      },
      {
        "cardId": "tag-#野球グローブ",
        "wiki": "[[野球グローブ|#野球グローブ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-26-00_IGR_0027_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-26-00_IGR_0027.json]]",
    "relatedCardIds": [
      "mention-@goten",
      "tag-#野球グローブ"
    ]
  },
  "2026-02-15-10-27-00_IGR_0028": {
    "id": "2026-02-15-10-27-00_IGR_0028",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:27:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@freeza\n#サッカーボール",
    "tags": [
      "サッカーボール"
    ],
    "mentions": [
      "@freeza"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@freeza",
        "wiki": "[[@freeza|@freeza]]"
      },
      {
        "cardId": "tag-#サッカーボール",
        "wiki": "[[サッカーボール|#サッカーボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-27-00_IGR_0028_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-27-00_IGR_0028.json]]",
    "relatedCardIds": [
      "mention-@freeza",
      "tag-#サッカーボール"
    ]
  },
  "2026-02-15-10-28-00_IGR_0029": {
    "id": "2026-02-15-10-28-00_IGR_0029",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:28:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@cell\n#サッカースパイク",
    "tags": [
      "サッカースパイク"
    ],
    "mentions": [
      "@cell"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@cell",
        "wiki": "[[@cell|@cell]]"
      },
      {
        "cardId": "tag-#サッカースパイク",
        "wiki": "[[サッカースパイク|#サッカースパイク]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-28-00_IGR_0029_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-28-00_IGR_0029.json]]",
    "relatedCardIds": [
      "mention-@cell",
      "tag-#サッカースパイク"
    ]
  },
  "2026-02-15-10-29-00_IGR_0030": {
    "id": "2026-02-15-10-29-00_IGR_0030",
    "source": "instagram",
    "type": "Reels",
    "content": "video",
    "date": "2026-02-15T10:29:00+09:00",
    "caption": "短い動画の検証用キャプションです。\n@majin_buu\n#テニスラケット",
    "tags": [
      "テニスラケット"
    ],
    "mentions": [
      "@majin_buu"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@majin_buu",
        "wiki": "[[@majin_buu|@majin_buu]]"
      },
      {
        "cardId": "tag-#テニスラケット",
        "wiki": "[[テニスラケット|#テニスラケット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-02-15-10-29-00_IGR_0030_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-02-15-10-29-00_IGR_0030.json]]",
    "relatedCardIds": [
      "mention-@majin_buu",
      "tag-#テニスラケット"
    ]
  },
  "2026-03-01-08-00-00_IGS_0001": {
    "id": "2026-03-01-08-00-00_IGS_0001",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:00:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@ikura_namino\n#枝豆 #冷やしトマト",
    "tags": [
      "枝豆",
      "冷やしトマト"
    ],
    "mentions": [
      "@ikura_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ikura_namino",
        "wiki": "[[@ikura_namino|@ikura_namino]]"
      },
      {
        "cardId": "tag-#枝豆",
        "wiki": "[[枝豆|#枝豆]]"
      },
      {
        "cardId": "tag-#冷やしトマト",
        "wiki": "[[冷やしトマト|#冷やしトマト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.69,
        "lng": 135.49,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-00-00_IGS_0001_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-00-00_IGS_0001.json]]",
    "relatedCardIds": [
      "mention-@ikura_namino",
      "tag-#枝豆",
      "tag-#冷やしトマト"
    ]
  },
  "2026-03-01-08-01-00_IGS_0002": {
    "id": "2026-03-01-08-01-00_IGS_0002",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:01:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@son_goku\n#冷やしトマト",
    "tags": [
      "冷やしトマト"
    ],
    "mentions": [
      "@son_goku"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_goku",
        "wiki": "[[@son_goku|@son_goku]]"
      },
      {
        "cardId": "tag-#冷やしトマト",
        "wiki": "[[冷やしトマト|#冷やしトマト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.692,
        "lng": 135.492,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-01-00_IGS_0002_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-01-00_IGS_0002.json]]",
    "relatedCardIds": [
      "mention-@son_goku",
      "tag-#冷やしトマト"
    ]
  },
  "2026-03-01-08-02-00_IGS_0003": {
    "id": "2026-03-01-08-02-00_IGS_0003",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:02:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@kakarot\n#だし巻き卵",
    "tags": [
      "だし巻き卵"
    ],
    "mentions": [
      "@kakarot"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kakarot",
        "wiki": "[[@kakarot|@kakarot]]"
      },
      {
        "cardId": "tag-#だし巻き卵",
        "wiki": "[[だし巻き卵|#だし巻き卵]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.694,
        "lng": 135.494,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-02-00_IGS_0003_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-02-00_IGS_0003.json]]",
    "relatedCardIds": [
      "mention-@kakarot",
      "tag-#だし巻き卵"
    ]
  },
  "2026-03-01-08-03-00_IGS_0004": {
    "id": "2026-03-01-08-03-00_IGS_0004",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:03:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@vegeta\n#鶏の唐揚げ",
    "tags": [
      "鶏の唐揚げ"
    ],
    "mentions": [
      "@vegeta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@vegeta",
        "wiki": "[[@vegeta|@vegeta]]"
      },
      {
        "cardId": "tag-#鶏の唐揚げ",
        "wiki": "[[鶏の唐揚げ|#鶏の唐揚げ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.696,
        "lng": 135.496,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-03-00_IGS_0004_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-03-00_IGS_0004.json]]",
    "relatedCardIds": [
      "mention-@vegeta",
      "tag-#鶏の唐揚げ"
    ]
  },
  "2026-03-01-08-04-00_IGS_0005": {
    "id": "2026-03-01-08-04-00_IGS_0005",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:04:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@prince_vegeta\n#焼き鳥",
    "tags": [
      "焼き鳥"
    ],
    "mentions": [
      "@prince_vegeta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@prince_vegeta",
        "wiki": "[[@prince_vegeta|@prince_vegeta]]"
      },
      {
        "cardId": "tag-#焼き鳥",
        "wiki": "[[焼き鳥|#焼き鳥]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.698,
        "lng": 135.498,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-04-00_IGS_0005_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-04-00_IGS_0005.json]]",
    "relatedCardIds": [
      "mention-@prince_vegeta",
      "tag-#焼き鳥"
    ]
  },
  "2026-03-01-08-05-00_IGS_0006": {
    "id": "2026-03-01-08-05-00_IGS_0006",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:05:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@piccolo\n#つくね",
    "tags": [
      "つくね"
    ],
    "mentions": [
      "@piccolo"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@piccolo",
        "wiki": "[[@piccolo|@piccolo]]"
      },
      {
        "cardId": "tag-#つくね",
        "wiki": "[[つくね|#つくね]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": 34.7,
        "lng": 135.5,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-05-00_IGS_0006_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-05-00_IGS_0006.json]]",
    "relatedCardIds": [
      "mention-@piccolo",
      "tag-#つくね"
    ]
  },
  "2026-03-01-08-06-00_IGS_0007": {
    "id": "2026-03-01-08-06-00_IGS_0007",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:06:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@ma_junior\n#刺身盛り合わせ",
    "tags": [
      "刺身盛り合わせ"
    ],
    "mentions": [
      "@ma_junior"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@ma_junior",
        "wiki": "[[@ma_junior|@ma_junior]]"
      },
      {
        "cardId": "tag-#刺身盛り合わせ",
        "wiki": "[[刺身盛り合わせ|#刺身盛り合わせ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-06-00_IGS_0007_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-06-00_IGS_0007.json]]",
    "relatedCardIds": [
      "mention-@ma_junior",
      "tag-#刺身盛り合わせ"
    ]
  },
  "2026-03-01-08-07-00_IGS_0008": {
    "id": "2026-03-01-08-07-00_IGS_0008",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:07:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@son_gohan\n#しめ鯖",
    "tags": [
      "しめ鯖"
    ],
    "mentions": [
      "@son_gohan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@son_gohan",
        "wiki": "[[@son_gohan|@son_gohan]]"
      },
      {
        "cardId": "tag-#しめ鯖",
        "wiki": "[[しめ鯖|#しめ鯖]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-07-00_IGS_0008_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-07-00_IGS_0008.json]]",
    "relatedCardIds": [
      "mention-@son_gohan",
      "tag-#しめ鯖"
    ]
  },
  "2026-03-01-08-08-00_IGS_0009": {
    "id": "2026-03-01-08-08-00_IGS_0009",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:08:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@great_saiyaman\n#ほっけ開き",
    "tags": [
      "ほっけ開き"
    ],
    "mentions": [
      "@great_saiyaman"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@great_saiyaman",
        "wiki": "[[@great_saiyaman|@great_saiyaman]]"
      },
      {
        "cardId": "tag-#ほっけ開き",
        "wiki": "[[ほっけ開き|#ほっけ開き]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-08-00_IGS_0009_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-08-00_IGS_0009.json]]",
    "relatedCardIds": [
      "mention-@great_saiyaman",
      "tag-#ほっけ開き"
    ]
  },
  "2026-03-01-08-09-00_IGS_0010": {
    "id": "2026-03-01-08-09-00_IGS_0010",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:09:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@kuririn\n#揚げ出し豆腐 #フライドポテト",
    "tags": [
      "揚げ出し豆腐",
      "フライドポテト"
    ],
    "mentions": [
      "@kuririn"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kuririn",
        "wiki": "[[@kuririn|@kuririn]]"
      },
      {
        "cardId": "tag-#揚げ出し豆腐",
        "wiki": "[[揚げ出し豆腐|#揚げ出し豆腐]]"
      },
      {
        "cardId": "tag-#フライドポテト",
        "wiki": "[[フライドポテト|#フライドポテト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-09-00_IGS_0010_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-09-00_IGS_0010.json]]",
    "relatedCardIds": [
      "mention-@kuririn",
      "tag-#揚げ出し豆腐",
      "tag-#フライドポテト"
    ]
  },
  "2026-03-01-08-10-00_IGS_0011": {
    "id": "2026-03-01-08-10-00_IGS_0011",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:10:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@bulma\n#フライドポテト",
    "tags": [
      "フライドポテト"
    ],
    "mentions": [
      "@bulma"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@bulma",
        "wiki": "[[@bulma|@bulma]]"
      },
      {
        "cardId": "tag-#フライドポテト",
        "wiki": "[[フライドポテト|#フライドポテト]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-10-00_IGS_0011_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-10-00_IGS_0011.json]]",
    "relatedCardIds": [
      "mention-@bulma",
      "tag-#フライドポテト"
    ]
  },
  "2026-03-01-08-11-00_IGS_0012": {
    "id": "2026-03-01-08-11-00_IGS_0012",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:11:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@kamesennin\n#もつ煮込み",
    "tags": [
      "もつ煮込み"
    ],
    "mentions": [
      "@kamesennin"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@kamesennin",
        "wiki": "[[@kamesennin|@kamesennin]]"
      },
      {
        "cardId": "tag-#もつ煮込み",
        "wiki": "[[もつ煮込み|#もつ煮込み]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-11-00_IGS_0012_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-11-00_IGS_0012.json]]",
    "relatedCardIds": [
      "mention-@kamesennin",
      "tag-#もつ煮込み"
    ]
  },
  "2026-03-01-08-12-00_IGS_0013": {
    "id": "2026-03-01-08-12-00_IGS_0013",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:12:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@jackie_chun\n#焼きおにぎり",
    "tags": [
      "焼きおにぎり"
    ],
    "mentions": [
      "@jackie_chun"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@jackie_chun",
        "wiki": "[[@jackie_chun|@jackie_chun]]"
      },
      {
        "cardId": "tag-#焼きおにぎり",
        "wiki": "[[焼きおにぎり|#焼きおにぎり]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-12-00_IGS_0013_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-12-00_IGS_0013.json]]",
    "relatedCardIds": [
      "mention-@jackie_chun",
      "tag-#焼きおにぎり"
    ]
  },
  "2026-03-01-08-13-00_IGS_0014": {
    "id": "2026-03-01-08-13-00_IGS_0014",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:13:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@tenshinhan\n#生ビール",
    "tags": [
      "生ビール"
    ],
    "mentions": [
      "@tenshinhan"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tenshinhan",
        "wiki": "[[@tenshinhan|@tenshinhan]]"
      },
      {
        "cardId": "tag-#生ビール",
        "wiki": "[[生ビール|#生ビール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-13-00_IGS_0014_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-13-00_IGS_0014.json]]",
    "relatedCardIds": [
      "mention-@tenshinhan",
      "tag-#生ビール"
    ]
  },
  "2026-03-01-08-14-00_IGS_0015": {
    "id": "2026-03-01-08-14-00_IGS_0015",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:14:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@yamcha\n#ハイボール",
    "tags": [
      "ハイボール"
    ],
    "mentions": [
      "@yamcha"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@yamcha",
        "wiki": "[[@yamcha|@yamcha]]"
      },
      {
        "cardId": "tag-#ハイボール",
        "wiki": "[[ハイボール|#ハイボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-14-00_IGS_0015_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-14-00_IGS_0015.json]]",
    "relatedCardIds": [
      "mention-@yamcha",
      "tag-#ハイボール"
    ]
  },
  "2026-03-01-08-15-00_IGS_0016": {
    "id": "2026-03-01-08-15-00_IGS_0016",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:15:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@trunks\n#野球バット",
    "tags": [
      "野球バット"
    ],
    "mentions": [
      "@trunks"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@trunks",
        "wiki": "[[@trunks|@trunks]]"
      },
      {
        "cardId": "tag-#野球バット",
        "wiki": "[[野球バット|#野球バット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-15-00_IGS_0016_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-15-00_IGS_0016.json]]",
    "relatedCardIds": [
      "mention-@trunks",
      "tag-#野球バット"
    ]
  },
  "2026-03-01-08-16-00_IGS_0017": {
    "id": "2026-03-01-08-16-00_IGS_0017",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:16:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@goten\n#野球グローブ",
    "tags": [
      "野球グローブ"
    ],
    "mentions": [
      "@goten"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@goten",
        "wiki": "[[@goten|@goten]]"
      },
      {
        "cardId": "tag-#野球グローブ",
        "wiki": "[[野球グローブ|#野球グローブ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-16-00_IGS_0017_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-16-00_IGS_0017.json]]",
    "relatedCardIds": [
      "mention-@goten",
      "tag-#野球グローブ"
    ]
  },
  "2026-03-01-08-17-00_IGS_0018": {
    "id": "2026-03-01-08-17-00_IGS_0018",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:17:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@freeza\n#サッカーボール",
    "tags": [
      "サッカーボール"
    ],
    "mentions": [
      "@freeza"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@freeza",
        "wiki": "[[@freeza|@freeza]]"
      },
      {
        "cardId": "tag-#サッカーボール",
        "wiki": "[[サッカーボール|#サッカーボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-17-00_IGS_0018_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-17-00_IGS_0018.json]]",
    "relatedCardIds": [
      "mention-@freeza",
      "tag-#サッカーボール"
    ]
  },
  "2026-03-01-08-18-00_IGS_0019": {
    "id": "2026-03-01-08-18-00_IGS_0019",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:18:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@cell\n#サッカースパイク #テニスラケット",
    "tags": [
      "サッカースパイク",
      "テニスラケット"
    ],
    "mentions": [
      "@cell"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@cell",
        "wiki": "[[@cell|@cell]]"
      },
      {
        "cardId": "tag-#サッカースパイク",
        "wiki": "[[サッカースパイク|#サッカースパイク]]"
      },
      {
        "cardId": "tag-#テニスラケット",
        "wiki": "[[テニスラケット|#テニスラケット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-18-00_IGS_0019_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-18-00_IGS_0019.json]]",
    "relatedCardIds": [
      "mention-@cell",
      "tag-#サッカースパイク",
      "tag-#テニスラケット"
    ]
  },
  "2026-03-01-08-19-00_IGS_0020": {
    "id": "2026-03-01-08-19-00_IGS_0020",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:19:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@majin_buu\n#テニスラケット",
    "tags": [
      "テニスラケット"
    ],
    "mentions": [
      "@majin_buu"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@majin_buu",
        "wiki": "[[@majin_buu|@majin_buu]]"
      },
      {
        "cardId": "tag-#テニスラケット",
        "wiki": "[[テニスラケット|#テニスラケット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-19-00_IGS_0020_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-19-00_IGS_0020.json]]",
    "relatedCardIds": [
      "mention-@majin_buu",
      "tag-#テニスラケット"
    ]
  },
  "2026-03-01-08-20-00_IGS_0021": {
    "id": "2026-03-01-08-20-00_IGS_0021",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:20:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@sazae_fuguta\n#テニスボール",
    "tags": [
      "テニスボール"
    ],
    "mentions": [
      "@sazae_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@sazae_fuguta",
        "wiki": "[[@sazae_fuguta|@sazae_fuguta]]"
      },
      {
        "cardId": "tag-#テニスボール",
        "wiki": "[[テニスボール|#テニスボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-20-00_IGS_0021_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-20-00_IGS_0021.json]]",
    "relatedCardIds": [
      "mention-@sazae_fuguta",
      "tag-#テニスボール"
    ]
  },
  "2026-03-01-08-21-00_IGS_0022": {
    "id": "2026-03-01-08-21-00_IGS_0022",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:21:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@masuo_fuguta\n#バスケットボール",
    "tags": [
      "バスケットボール"
    ],
    "mentions": [
      "@masuo_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@masuo_fuguta",
        "wiki": "[[@masuo_fuguta|@masuo_fuguta]]"
      },
      {
        "cardId": "tag-#バスケットボール",
        "wiki": "[[バスケットボール|#バスケットボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-21-00_IGS_0022_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-21-00_IGS_0022.json]]",
    "relatedCardIds": [
      "mention-@masuo_fuguta",
      "tag-#バスケットボール"
    ]
  },
  "2026-03-01-08-22-00_IGS_0023": {
    "id": "2026-03-01-08-22-00_IGS_0023",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:22:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@tara_fuguta\n#バスケットゴール",
    "tags": [
      "バスケットゴール"
    ],
    "mentions": [
      "@tara_fuguta"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tara_fuguta",
        "wiki": "[[@tara_fuguta|@tara_fuguta]]"
      },
      {
        "cardId": "tag-#バスケットゴール",
        "wiki": "[[バスケットゴール|#バスケットゴール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-22-00_IGS_0023_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-22-00_IGS_0023.json]]",
    "relatedCardIds": [
      "mention-@tara_fuguta",
      "tag-#バスケットゴール"
    ]
  },
  "2026-03-01-08-23-00_IGS_0024": {
    "id": "2026-03-01-08-23-00_IGS_0024",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:23:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@katsuo_isono\n#ゴルフクラブ",
    "tags": [
      "ゴルフクラブ"
    ],
    "mentions": [
      "@katsuo_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@katsuo_isono",
        "wiki": "[[@katsuo_isono|@katsuo_isono]]"
      },
      {
        "cardId": "tag-#ゴルフクラブ",
        "wiki": "[[ゴルフクラブ|#ゴルフクラブ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-23-00_IGS_0024_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-23-00_IGS_0024.json]]",
    "relatedCardIds": [
      "mention-@katsuo_isono",
      "tag-#ゴルフクラブ"
    ]
  },
  "2026-03-01-08-24-00_IGS_0025": {
    "id": "2026-03-01-08-24-00_IGS_0025",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:24:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@wakame_isono\n#ゴルフボール",
    "tags": [
      "ゴルフボール"
    ],
    "mentions": [
      "@wakame_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@wakame_isono",
        "wiki": "[[@wakame_isono|@wakame_isono]]"
      },
      {
        "cardId": "tag-#ゴルフボール",
        "wiki": "[[ゴルフボール|#ゴルフボール]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-24-00_IGS_0025_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-24-00_IGS_0025.json]]",
    "relatedCardIds": [
      "mention-@wakame_isono",
      "tag-#ゴルフボール"
    ]
  },
  "2026-03-01-08-25-00_IGS_0026": {
    "id": "2026-03-01-08-25-00_IGS_0026",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:25:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@namihei_isono\n#ランニングシューズ",
    "tags": [
      "ランニングシューズ"
    ],
    "mentions": [
      "@namihei_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@namihei_isono",
        "wiki": "[[@namihei_isono|@namihei_isono]]"
      },
      {
        "cardId": "tag-#ランニングシューズ",
        "wiki": "[[ランニングシューズ|#ランニングシューズ]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-25-00_IGS_0026_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-25-00_IGS_0026.json]]",
    "relatedCardIds": [
      "mention-@namihei_isono",
      "tag-#ランニングシューズ"
    ]
  },
  "2026-03-01-08-26-00_IGS_0027": {
    "id": "2026-03-01-08-26-00_IGS_0027",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:26:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@fune_isono\n#ダンベル",
    "tags": [
      "ダンベル"
    ],
    "mentions": [
      "@fune_isono"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@fune_isono",
        "wiki": "[[@fune_isono|@fune_isono]]"
      },
      {
        "cardId": "tag-#ダンベル",
        "wiki": "[[ダンベル|#ダンベル]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-26-00_IGS_0027_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-26-00_IGS_0027.json]]",
    "relatedCardIds": [
      "mention-@fune_isono",
      "tag-#ダンベル"
    ]
  },
  "2026-03-01-08-27-00_IGS_0028": {
    "id": "2026-03-01-08-27-00_IGS_0028",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:27:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@tama_cat\n#ヨガマット #水泳ゴーグル",
    "tags": [
      "ヨガマット",
      "水泳ゴーグル"
    ],
    "mentions": [
      "@tama_cat"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@tama_cat",
        "wiki": "[[@tama_cat|@tama_cat]]"
      },
      {
        "cardId": "tag-#ヨガマット",
        "wiki": "[[ヨガマット|#ヨガマット]]"
      },
      {
        "cardId": "tag-#水泳ゴーグル",
        "wiki": "[[水泳ゴーグル|#水泳ゴーグル]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-27-00_IGS_0028_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-27-00_IGS_0028.json]]",
    "relatedCardIds": [
      "mention-@tama_cat",
      "tag-#ヨガマット",
      "tag-#水泳ゴーグル"
    ]
  },
  "2026-03-01-08-28-00_IGS_0029": {
    "id": "2026-03-01-08-28-00_IGS_0029",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:28:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@norisuke_namino\n#水泳ゴーグル",
    "tags": [
      "水泳ゴーグル"
    ],
    "mentions": [
      "@norisuke_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@norisuke_namino",
        "wiki": "[[@norisuke_namino|@norisuke_namino]]"
      },
      {
        "cardId": "tag-#水泳ゴーグル",
        "wiki": "[[水泳ゴーグル|#水泳ゴーグル]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-28-00_IGS_0029_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-28-00_IGS_0029.json]]",
    "relatedCardIds": [
      "mention-@norisuke_namino",
      "tag-#水泳ゴーグル"
    ]
  },
  "2026-03-01-08-29-00_IGS_0030": {
    "id": "2026-03-01-08-29-00_IGS_0030",
    "source": "instagram",
    "type": "Stories",
    "content": "video",
    "date": "2026-03-01T08:29:00+09:00",
    "caption": "24時間表示用の検証ストーリーです。\n@taiko_namino\n#自転車ヘルメット",
    "tags": [
      "自転車ヘルメット"
    ],
    "mentions": [
      "@taiko_namino"
    ],
    "links": [
      {
        "cardId": null,
        "wiki": "[[instagram]]"
      },
      {
        "cardId": "mention-@taiko_namino",
        "wiki": "[[@taiko_namino|@taiko_namino]]"
      },
      {
        "cardId": "tag-#自転車ヘルメット",
        "wiki": "[[自転車ヘルメット|#自転車ヘルメット]]"
      }
    ],
    "location": {
      "raw": null,
      "normalized": null,
      "geo": {
        "lat": null,
        "lng": null,
        "alt": null
      },
      "synapseLink": null
    },
    "media": [
      "2026-03-01-08-29-00_IGS_0030_video_001.mp4"
    ],
    "rawSourcePath": "[[2026-03-01-08-29-00_IGS_0030.json]]",
    "relatedCardIds": [
      "mention-@taiko_namino",
      "tag-#自転車ヘルメット"
    ]
  }
};
