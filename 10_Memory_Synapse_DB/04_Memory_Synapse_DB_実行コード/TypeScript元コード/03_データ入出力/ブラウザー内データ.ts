import type { 融合状態 } from "../01_データ構造/融合グループ";

export type ブラウザー検査結果 = {
  cardId: string;
  brokenWikiLinks: number;
  suspectedMultipleMemberships: number;
  malformedManagedHeadings: number;
  targetCardId: string;
};

/**
 * 問題がある場合だけ表示する検査欄を確認するための、ブラウザー専用サンプル。
 * 実際のVaultや通常の融合状態には混ぜず、自動修復も行わない。
 */
export const 検証用検査結果一覧: ブラウザー検査結果[] = [
  {
    cardId: "mention-@piccolo",
    brokenWikiLinks: 2,
    suspectedMultipleMemberships: 1,
    malformedManagedHeadings: 1,
    targetCardId: "mention-@piccolo"
  }
];

export function 初期状態を作る(): 融合状態 {
  return {
    cards: {
  "mention-@sazae_fuguta": {
    "id": "mention-@sazae_fuguta",
    "kind": "mention",
    "name": "@sazae_fuguta",
    "source": {
      "mention_note": {
        "mention": "@sazae_fuguta",
        "name": "フグ田サザエ",
        "phone": [],
        "web": [
          "https://instagram.invalid/sazae_fuguta/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]",
      "[[2026-02-15-10-00-00_IGR_0001]]",
      "[[2026-03-01-08-20-00_IGS_0021]]"
    ]
  },
  "mention-@masuo_fuguta": {
    "id": "mention-@masuo_fuguta",
    "kind": "mention",
    "name": "@masuo_fuguta",
    "source": {
      "mention_note": {
        "mention": "@masuo_fuguta",
        "name": "フグ田マスオ",
        "phone": [],
        "web": [
          "https://instagram.invalid/masuo_fuguta/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]",
      "[[2026-01-30-15-01-00_IG_0002]]",
      "[[2026-02-15-10-01-00_IGR_0002]]",
      "[[2026-03-01-08-21-00_IGS_0022]]"
    ]
  },
  "mention-@tara_fuguta": {
    "id": "mention-@tara_fuguta",
    "kind": "mention",
    "name": "@tara_fuguta",
    "source": {
      "mention_note": {
        "mention": "@tara_fuguta",
        "name": "フグ田タラオ",
        "phone": [],
        "web": [
          "https://instagram.invalid/tara_fuguta/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-02-00_IG_0003]]",
      "[[2026-02-15-10-02-00_IGR_0003]]",
      "[[2026-03-01-08-22-00_IGS_0023]]"
    ]
  },
  "mention-@katsuo_isono": {
    "id": "mention-@katsuo_isono",
    "kind": "mention",
    "name": "@katsuo_isono",
    "source": {
      "mention_note": {
        "mention": "@katsuo_isono",
        "name": "磯野カツオ",
        "phone": [],
        "web": [
          "https://instagram.invalid/katsuo_isono/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-03-00_IG_0004]]",
      "[[2026-02-15-10-03-00_IGR_0004]]",
      "[[2026-03-01-08-23-00_IGS_0024]]"
    ]
  },
  "mention-@wakame_isono": {
    "id": "mention-@wakame_isono",
    "kind": "mention",
    "name": "@wakame_isono",
    "source": {
      "mention_note": {
        "mention": "@wakame_isono",
        "name": "磯野ワカメ",
        "phone": [],
        "web": [
          "https://instagram.invalid/wakame_isono/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-04-00_IG_0005]]",
      "[[2026-02-15-10-04-00_IGR_0005]]",
      "[[2026-03-01-08-24-00_IGS_0025]]"
    ]
  },
  "mention-@namihei_isono": {
    "id": "mention-@namihei_isono",
    "kind": "mention",
    "name": "@namihei_isono",
    "source": {
      "mention_note": {
        "mention": "@namihei_isono",
        "name": "磯野波平",
        "phone": [],
        "web": [
          "https://instagram.invalid/namihei_isono/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-05-00_IG_0006]]",
      "[[2026-02-15-10-05-00_IGR_0006]]",
      "[[2026-03-01-08-25-00_IGS_0026]]"
    ]
  },
  "mention-@fune_isono": {
    "id": "mention-@fune_isono",
    "kind": "mention",
    "name": "@fune_isono",
    "source": {
      "mention_note": {
        "mention": "@fune_isono",
        "name": "磯野フネ",
        "phone": [],
        "web": [
          "https://instagram.invalid/fune_isono/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-05-00_IG_0006]]",
      "[[2026-01-30-15-06-00_IG_0007]]",
      "[[2026-02-15-10-06-00_IGR_0007]]",
      "[[2026-03-01-08-26-00_IGS_0027]]"
    ]
  },
  "mention-@tama_cat": {
    "id": "mention-@tama_cat",
    "kind": "mention",
    "name": "@tama_cat",
    "source": {
      "mention_note": {
        "mention": "@tama_cat",
        "name": "タマ",
        "phone": [],
        "web": [
          "https://instagram.invalid/tama_cat/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-07-00_IG_0008]]",
      "[[2026-02-15-10-07-00_IGR_0008]]",
      "[[2026-03-01-08-27-00_IGS_0028]]"
    ]
  },
  "mention-@norisuke_namino": {
    "id": "mention-@norisuke_namino",
    "kind": "mention",
    "name": "@norisuke_namino",
    "source": {
      "mention_note": {
        "mention": "@norisuke_namino",
        "name": "波野ノリスケ",
        "phone": [],
        "web": [
          "https://instagram.invalid/norisuke_namino/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-08-00_IG_0009]]",
      "[[2026-02-15-10-08-00_IGR_0009]]",
      "[[2026-03-01-08-28-00_IGS_0029]]"
    ]
  },
  "mention-@taiko_namino": {
    "id": "mention-@taiko_namino",
    "kind": "mention",
    "name": "@taiko_namino",
    "source": {
      "mention_note": {
        "mention": "@taiko_namino",
        "name": "波野タイコ",
        "phone": [],
        "web": [
          "https://instagram.invalid/taiko_namino/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-09-00_IG_0010]]",
      "[[2026-02-15-10-09-00_IGR_0010]]",
      "[[2026-03-01-08-29-00_IGS_0030]]"
    ]
  },
  "mention-@ikura_namino": {
    "id": "mention-@ikura_namino",
    "kind": "mention",
    "name": "@ikura_namino",
    "source": {
      "mention_note": {
        "mention": "@ikura_namino",
        "name": "波野イクラ",
        "phone": [],
        "web": [
          "https://instagram.invalid/ikura_namino/"
        ],
        "note": "『サザエさん』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-10-00_IG_0011]]",
      "[[2026-02-15-10-10-00_IGR_0011]]",
      "[[2026-03-01-08-00-00_IGS_0001]]"
    ]
  },
  "mention-@son_goku": {
    "id": "mention-@son_goku",
    "kind": "mention",
    "name": "@son_goku",
    "source": {
      "mention_note": {
        "mention": "@son_goku",
        "name": "孫悟空",
        "phone": [],
        "web": [
          "https://instagram.invalid/son_goku/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]",
      "[[2026-01-30-15-07-00_IG_0008]]",
      "[[2026-01-30-15-10-00_IG_0011]]",
      "[[2026-01-30-15-11-00_IG_0012]]",
      "[[2026-01-30-15-14-00_IG_0015]]",
      "[[2026-01-30-15-21-00_IG_0022]]",
      "[[2026-01-30-15-28-00_IG_0029]]",
      "[[2026-02-15-10-00-00_IGR_0001]]",
      "[[2026-02-15-10-08-00_IGR_0009]]",
      "[[2026-02-15-10-11-00_IGR_0012]]",
      "[[2026-02-15-10-16-00_IGR_0017]]",
      "[[2026-02-15-10-24-00_IGR_0025]]",
      "[[2026-03-01-08-01-00_IGS_0002]]"
    ],
    "handwritten": {
      "displayName": "孫悟空（カカロット）",
      "aliases": [],
      "note": "地球育ちのサイヤ人。強い相手と戦うのが好き。",
      "name": "孫悟空",
      "geo": {
        "lat": "",
        "lng": "",
        "alt": ""
      },
      "address": {
        "full": "",
        "country": "",
        "prefecture": "",
        "city": "",
        "district": "",
        "street": "",
        "postalCode": ""
      },
      "phone": [],
      "web": []
    }
  },
  "mention-@kakarot": {
    "id": "mention-@kakarot",
    "kind": "mention",
    "name": "@kakarot",
    "source": {
      "mention_note": {
        "mention": "@kakarot",
        "name": "カカロット",
        "phone": [],
        "web": [
          "https://instagram.invalid/kakarot/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-12-00_IG_0013]]",
      "[[2026-02-15-10-12-00_IGR_0013]]",
      "[[2026-03-01-08-02-00_IGS_0003]]"
    ]
  },
  "mention-@vegeta": {
    "id": "mention-@vegeta",
    "kind": "mention",
    "name": "@vegeta",
    "source": {
      "mention_note": {
        "mention": "@vegeta",
        "name": "ベジータ",
        "phone": [],
        "web": [
          "https://instagram.invalid/vegeta/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-13-00_IG_0014]]",
      "[[2026-02-15-10-13-00_IGR_0014]]",
      "[[2026-03-01-08-03-00_IGS_0004]]"
    ]
  },
  "mention-@prince_vegeta": {
    "id": "mention-@prince_vegeta",
    "kind": "mention",
    "name": "@prince_vegeta",
    "source": {
      "mention_note": {
        "mention": "@prince_vegeta",
        "name": "ベジータ王子",
        "phone": [],
        "web": [
          "https://instagram.invalid/prince_vegeta/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-14-00_IG_0015]]",
      "[[2026-02-15-10-14-00_IGR_0015]]",
      "[[2026-03-01-08-04-00_IGS_0005]]"
    ]
  },
  "mention-@piccolo": {
    "id": "mention-@piccolo",
    "kind": "mention",
    "name": "@piccolo",
    "source": {
      "mention_note": {
        "mention": "@piccolo",
        "name": "ピッコロ",
        "phone": [],
        "web": [
          "https://instagram.invalid/piccolo/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-15-00_IG_0016]]",
      "[[2026-02-15-10-15-00_IGR_0016]]",
      "[[2026-03-01-08-05-00_IGS_0006]]"
    ]
  },
  "mention-@ma_junior": {
    "id": "mention-@ma_junior",
    "kind": "mention",
    "name": "@ma_junior",
    "source": {
      "mention_note": {
        "mention": "@ma_junior",
        "name": "マジュニア",
        "phone": [],
        "web": [
          "https://instagram.invalid/ma_junior/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-15-00_IG_0016]]",
      "[[2026-01-30-15-16-00_IG_0017]]",
      "[[2026-02-15-10-16-00_IGR_0017]]",
      "[[2026-03-01-08-06-00_IGS_0007]]"
    ]
  },
  "mention-@son_gohan": {
    "id": "mention-@son_gohan",
    "kind": "mention",
    "name": "@son_gohan",
    "source": {
      "mention_note": {
        "mention": "@son_gohan",
        "name": "孫悟飯",
        "phone": [],
        "web": [
          "https://instagram.invalid/son_gohan/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-17-00_IG_0018]]",
      "[[2026-02-15-10-17-00_IGR_0018]]",
      "[[2026-03-01-08-07-00_IGS_0008]]"
    ]
  },
  "mention-@great_saiyaman": {
    "id": "mention-@great_saiyaman",
    "kind": "mention",
    "name": "@great_saiyaman",
    "source": {
      "mention_note": {
        "mention": "@great_saiyaman",
        "name": "グレートサイヤマン",
        "phone": [],
        "web": [
          "https://instagram.invalid/great_saiyaman/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-18-00_IG_0019]]",
      "[[2026-02-15-10-18-00_IGR_0019]]",
      "[[2026-03-01-08-08-00_IGS_0009]]"
    ]
  },
  "mention-@kuririn": {
    "id": "mention-@kuririn",
    "kind": "mention",
    "name": "@kuririn",
    "source": {
      "mention_note": {
        "mention": "@kuririn",
        "name": "クリリン",
        "phone": [],
        "web": [
          "https://instagram.invalid/kuririn/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-19-00_IG_0020]]",
      "[[2026-02-15-10-19-00_IGR_0020]]",
      "[[2026-03-01-08-09-00_IGS_0010]]"
    ]
  },
  "mention-@bulma": {
    "id": "mention-@bulma",
    "kind": "mention",
    "name": "@bulma",
    "source": {
      "mention_note": {
        "mention": "@bulma",
        "name": "ブルマ",
        "phone": [],
        "web": [
          "https://instagram.invalid/bulma/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-20-00_IG_0021]]",
      "[[2026-02-15-10-20-00_IGR_0021]]",
      "[[2026-03-01-08-10-00_IGS_0011]]"
    ]
  },
  "mention-@kamesennin": {
    "id": "mention-@kamesennin",
    "kind": "mention",
    "name": "@kamesennin",
    "source": {
      "mention_note": {
        "mention": "@kamesennin",
        "name": "亀仙人",
        "phone": [],
        "web": [
          "https://instagram.invalid/kamesennin/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-20-00_IG_0021]]",
      "[[2026-01-30-15-21-00_IG_0022]]",
      "[[2026-02-15-10-21-00_IGR_0022]]",
      "[[2026-03-01-08-11-00_IGS_0012]]"
    ]
  },
  "mention-@jackie_chun": {
    "id": "mention-@jackie_chun",
    "kind": "mention",
    "name": "@jackie_chun",
    "source": {
      "mention_note": {
        "mention": "@jackie_chun",
        "name": "ジャッキー・チュン",
        "phone": [],
        "web": [
          "https://instagram.invalid/jackie_chun/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-22-00_IG_0023]]",
      "[[2026-02-15-10-22-00_IGR_0023]]",
      "[[2026-03-01-08-12-00_IGS_0013]]"
    ]
  },
  "mention-@tenshinhan": {
    "id": "mention-@tenshinhan",
    "kind": "mention",
    "name": "@tenshinhan",
    "source": {
      "mention_note": {
        "mention": "@tenshinhan",
        "name": "天津飯",
        "phone": [],
        "web": [
          "https://instagram.invalid/tenshinhan/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-23-00_IG_0024]]",
      "[[2026-02-15-10-23-00_IGR_0024]]",
      "[[2026-03-01-08-13-00_IGS_0014]]"
    ]
  },
  "mention-@yamcha": {
    "id": "mention-@yamcha",
    "kind": "mention",
    "name": "@yamcha",
    "source": {
      "mention_note": {
        "mention": "@yamcha",
        "name": "ヤムチャ",
        "phone": [],
        "web": [
          "https://instagram.invalid/yamcha/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-24-00_IG_0025]]",
      "[[2026-02-15-10-24-00_IGR_0025]]",
      "[[2026-03-01-08-14-00_IGS_0015]]"
    ]
  },
  "mention-@trunks": {
    "id": "mention-@trunks",
    "kind": "mention",
    "name": "@trunks",
    "source": {
      "mention_note": {
        "mention": "@trunks",
        "name": "トランクス",
        "phone": [],
        "web": [
          "https://instagram.invalid/trunks/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-25-00_IG_0026]]",
      "[[2026-02-15-10-25-00_IGR_0026]]",
      "[[2026-03-01-08-15-00_IGS_0016]]"
    ]
  },
  "mention-@goten": {
    "id": "mention-@goten",
    "kind": "mention",
    "name": "@goten",
    "source": {
      "mention_note": {
        "mention": "@goten",
        "name": "孫悟天",
        "phone": [],
        "web": [
          "https://instagram.invalid/goten/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-25-00_IG_0026]]",
      "[[2026-01-30-15-26-00_IG_0027]]",
      "[[2026-02-15-10-26-00_IGR_0027]]",
      "[[2026-03-01-08-16-00_IGS_0017]]"
    ]
  },
  "mention-@freeza": {
    "id": "mention-@freeza",
    "kind": "mention",
    "name": "@freeza",
    "source": {
      "mention_note": {
        "mention": "@freeza",
        "name": "フリーザ",
        "phone": [],
        "web": [
          "https://instagram.invalid/freeza/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-27-00_IG_0028]]",
      "[[2026-02-15-10-27-00_IGR_0028]]",
      "[[2026-03-01-08-17-00_IGS_0018]]"
    ]
  },
  "mention-@cell": {
    "id": "mention-@cell",
    "kind": "mention",
    "name": "@cell",
    "source": {
      "mention_note": {
        "mention": "@cell",
        "name": "セル",
        "phone": [],
        "web": [
          "https://instagram.invalid/cell/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-28-00_IG_0029]]",
      "[[2026-02-15-10-28-00_IGR_0029]]",
      "[[2026-03-01-08-18-00_IGS_0019]]"
    ]
  },
  "mention-@majin_buu": {
    "id": "mention-@majin_buu",
    "kind": "mention",
    "name": "@majin_buu",
    "source": {
      "mention_note": {
        "mention": "@majin_buu",
        "name": "魔人ブウ",
        "phone": [],
        "web": [
          "https://instagram.invalid/majin_buu/"
        ],
        "note": "『ドラゴンボール』の架空の登場人物を使った個人情報を含まない検証用データ"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-29-00_IG_0030]]",
      "[[2026-02-15-10-29-00_IGR_0030]]",
      "[[2026-03-01-08-19-00_IGS_0020]]"
    ]
  },
  "location-大阪城": {
    "id": "location-大阪城",
    "kind": "location",
    "name": "大阪城",
    "source": {
      "location_note": {
        "location": "大阪城"
      },
      "geo": {
        "lat": 34.62,
        "lng": 135.43,
        "alt": null
      },
      "address": {
        "full": "大阪府内・大阪城周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_001",
      "source_files": [
        "[[mock_activity_001.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]"
    ],
    "handwritten": {
      "displayName": "大阪城（思い出の場所）",
      "aliases": [
        "Osaka Castle"
      ],
      "geo": {
        "lat": "34.6873",
        "lng": "135.5262",
        "alt": ""
      },
      "address": {
        "full": "大阪府大阪市中央区大阪城1-1",
        "country": "",
        "prefecture": "",
        "city": "",
        "district": "",
        "street": "",
        "postalCode": ""
      },
      "note": "桜が綺麗な時期に行った。また行きたい。",
      "name": "大阪城",
      "phone": [],
      "web": []
    }
  },
  "location-道頓堀": {
    "id": "location-道頓堀",
    "kind": "location",
    "name": "道頓堀",
    "source": {
      "location_note": {
        "location": "道頓堀"
      },
      "geo": {
        "lat": 34.623,
        "lng": 135.434,
        "alt": null
      },
      "address": {
        "full": "大阪府内・道頓堀周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_002",
      "source_files": [
        "[[mock_activity_002.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-01-00_IG_0002]]"
    ]
  },
  "location-通天閣": {
    "id": "location-通天閣",
    "kind": "location",
    "name": "通天閣",
    "source": {
      "location_note": {
        "location": "通天閣"
      },
      "geo": {
        "lat": 34.626,
        "lng": 135.438,
        "alt": null
      },
      "address": {
        "full": "大阪府内・通天閣周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_003",
      "source_files": [
        "[[mock_activity_003.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-02-00_IG_0003]]"
    ]
  },
  "location-ユニバーサル・スタジオ・ジャパン": {
    "id": "location-ユニバーサル・スタジオ・ジャパン",
    "kind": "location",
    "name": "ユニバーサル・スタジオ・ジャパン",
    "source": {
      "location_note": {
        "location": "ユニバーサル・スタジオ・ジャパン"
      },
      "geo": {
        "lat": 34.629,
        "lng": 135.442,
        "alt": null
      },
      "address": {
        "full": "大阪府内・ユニバーサル・スタジオ・ジャパン周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_004",
      "source_files": [
        "[[mock_activity_004.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-03-00_IG_0004]]"
    ]
  },
  "location-海遊館": {
    "id": "location-海遊館",
    "kind": "location",
    "name": "海遊館",
    "source": {
      "location_note": {
        "location": "海遊館"
      },
      "geo": {
        "lat": 34.632,
        "lng": 135.446,
        "alt": null
      },
      "address": {
        "full": "大阪府内・海遊館周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_005",
      "source_files": [
        "[[mock_activity_005.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-04-00_IG_0005]]"
    ]
  },
  "location-梅田スカイビル": {
    "id": "location-梅田スカイビル",
    "kind": "location",
    "name": "梅田スカイビル",
    "source": {
      "location_note": {
        "location": "梅田スカイビル"
      },
      "geo": {
        "lat": 34.635,
        "lng": 135.45,
        "alt": null
      },
      "address": {
        "full": "大阪府内・梅田スカイビル周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_006",
      "source_files": [
        "[[mock_activity_006.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-05-00_IG_0006]]"
    ]
  },
  "location-あべのハルカス": {
    "id": "location-あべのハルカス",
    "kind": "location",
    "name": "あべのハルカス",
    "source": {
      "location_note": {
        "location": "あべのハルカス"
      },
      "geo": {
        "lat": 34.638,
        "lng": 135.454,
        "alt": null
      },
      "address": {
        "full": "大阪府内・あべのハルカス周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_007",
      "source_files": [
        "[[mock_activity_007.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-06-00_IG_0007]]"
    ]
  },
  "location-四天王寺": {
    "id": "location-四天王寺",
    "kind": "location",
    "name": "四天王寺",
    "source": {
      "location_note": {
        "location": "四天王寺"
      },
      "geo": {
        "lat": 34.641,
        "lng": 135.458,
        "alt": null
      },
      "address": {
        "full": "大阪府内・四天王寺周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_008",
      "source_files": [
        "[[mock_activity_008.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-07-00_IG_0008]]"
    ]
  },
  "location-黒門市場": {
    "id": "location-黒門市場",
    "kind": "location",
    "name": "黒門市場",
    "source": {
      "location_note": {
        "location": "黒門市場"
      },
      "geo": {
        "lat": 34.644,
        "lng": 135.462,
        "alt": null
      },
      "address": {
        "full": "大阪府内・黒門市場周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_009",
      "source_files": [
        "[[mock_activity_009.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-08-00_IG_0009]]"
    ]
  },
  "location-新世界": {
    "id": "location-新世界",
    "kind": "location",
    "name": "新世界",
    "source": {
      "location_note": {
        "location": "新世界"
      },
      "geo": {
        "lat": 34.647,
        "lng": 135.466,
        "alt": null
      },
      "address": {
        "full": "大阪府内・新世界周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_010",
      "source_files": [
        "[[mock_activity_010.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-09-00_IG_0010]]"
    ]
  },
  "location-アメリカ村": {
    "id": "location-アメリカ村",
    "kind": "location",
    "name": "アメリカ村",
    "source": {
      "location_note": {
        "location": "アメリカ村"
      },
      "geo": {
        "lat": 34.65,
        "lng": 135.47,
        "alt": null
      },
      "address": {
        "full": "大阪府内・アメリカ村周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_011",
      "source_files": [
        "[[mock_activity_011.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-10-00_IG_0011]]"
    ]
  },
  "location-難波八阪神社": {
    "id": "location-難波八阪神社",
    "kind": "location",
    "name": "難波八阪神社",
    "source": {
      "location_note": {
        "location": "難波八阪神社"
      },
      "geo": {
        "lat": 34.653,
        "lng": 135.474,
        "alt": null
      },
      "address": {
        "full": "大阪府内・難波八阪神社周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_012",
      "source_files": [
        "[[mock_activity_012.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-11-00_IG_0012]]"
    ]
  },
  "location-天王寺動物園": {
    "id": "location-天王寺動物園",
    "kind": "location",
    "name": "天王寺動物園",
    "source": {
      "location_note": {
        "location": "天王寺動物園"
      },
      "geo": {
        "lat": 34.656,
        "lng": 135.478,
        "alt": null
      },
      "address": {
        "full": "大阪府内・天王寺動物園周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_013",
      "source_files": [
        "[[mock_activity_013.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-12-00_IG_0013]]"
    ]
  },
  "location-箕面大滝": {
    "id": "location-箕面大滝",
    "kind": "location",
    "name": "箕面大滝",
    "source": {
      "location_note": {
        "location": "箕面大滝"
      },
      "geo": {
        "lat": 34.659,
        "lng": 135.482,
        "alt": null
      },
      "address": {
        "full": "大阪府内・箕面大滝周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_014",
      "source_files": [
        "[[mock_activity_014.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-13-00_IG_0014]]"
    ]
  },
  "location-万博記念公園": {
    "id": "location-万博記念公園",
    "kind": "location",
    "name": "万博記念公園",
    "source": {
      "location_note": {
        "location": "万博記念公園"
      },
      "geo": {
        "lat": 34.662,
        "lng": 135.486,
        "alt": null
      },
      "address": {
        "full": "大阪府内・万博記念公園周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_015",
      "source_files": [
        "[[mock_activity_015.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-14-00_IG_0015]]"
    ]
  },
  "location-スパワールド": {
    "id": "location-スパワールド",
    "kind": "location",
    "name": "スパワールド",
    "source": {
      "location_note": {
        "location": "スパワールド"
      },
      "geo": {
        "lat": 34.665,
        "lng": 135.49,
        "alt": null
      },
      "address": {
        "full": "大阪府内・スパワールド周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_016",
      "source_files": [
        "[[mock_activity_016.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-15-00_IG_0016]]"
    ]
  },
  "location-天保山大観覧車": {
    "id": "location-天保山大観覧車",
    "kind": "location",
    "name": "天保山大観覧車",
    "source": {
      "location_note": {
        "location": "天保山大観覧車"
      },
      "geo": {
        "lat": 34.668,
        "lng": 135.494,
        "alt": null
      },
      "address": {
        "full": "大阪府内・天保山大観覧車周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_017",
      "source_files": [
        "[[mock_activity_017.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-16-00_IG_0017]]"
    ]
  },
  "location-キッズプラザ大阪": {
    "id": "location-キッズプラザ大阪",
    "kind": "location",
    "name": "キッズプラザ大阪",
    "source": {
      "location_note": {
        "location": "キッズプラザ大阪"
      },
      "geo": {
        "lat": 34.671,
        "lng": 135.498,
        "alt": null
      },
      "address": {
        "full": "大阪府内・キッズプラザ大阪周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_018",
      "source_files": [
        "[[mock_activity_018.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-17-00_IG_0018]]"
    ]
  },
  "location-造幣局博物館": {
    "id": "location-造幣局博物館",
    "kind": "location",
    "name": "造幣局博物館",
    "source": {
      "location_note": {
        "location": "造幣局博物館"
      },
      "geo": {
        "lat": 34.674,
        "lng": 135.502,
        "alt": null
      },
      "address": {
        "full": "大阪府内・造幣局博物館周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_019",
      "source_files": [
        "[[mock_activity_019.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-18-00_IG_0019]]"
    ]
  },
  "location-グランフロント大阪": {
    "id": "location-グランフロント大阪",
    "kind": "location",
    "name": "グランフロント大阪",
    "source": {
      "location_note": {
        "location": "グランフロント大阪"
      },
      "geo": {
        "lat": 34.677,
        "lng": 135.506,
        "alt": null
      },
      "address": {
        "full": "大阪府内・グランフロント大阪周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_020",
      "source_files": [
        "[[mock_activity_020.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-19-00_IG_0020]]"
    ]
  },
  "location-HEP FIVE": {
    "id": "location-HEP FIVE",
    "kind": "location",
    "name": "HEP FIVE",
    "source": {
      "location_note": {
        "location": "HEP FIVE"
      },
      "geo": {
        "lat": 34.68,
        "lng": 135.51,
        "alt": null
      },
      "address": {
        "full": "大阪府内・HEP FIVE周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_021",
      "source_files": [
        "[[mock_activity_021.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-20-00_IG_0021]]"
    ]
  },
  "location-中之島公園": {
    "id": "location-中之島公園",
    "kind": "location",
    "name": "中之島公園",
    "source": {
      "location_note": {
        "location": "中之島公園"
      },
      "geo": {
        "lat": 34.683,
        "lng": 135.514,
        "alt": null
      },
      "address": {
        "full": "大阪府内・中之島公園周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_022",
      "source_files": [
        "[[mock_activity_022.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-21-00_IG_0022]]"
    ]
  },
  "location-大阪市立科学館": {
    "id": "location-大阪市立科学館",
    "kind": "location",
    "name": "大阪市立科学館",
    "source": {
      "location_note": {
        "location": "大阪市立科学館"
      },
      "geo": {
        "lat": 34.686,
        "lng": 135.518,
        "alt": null
      },
      "address": {
        "full": "大阪府内・大阪市立科学館周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_023",
      "source_files": [
        "[[mock_activity_023.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-22-00_IG_0023]]"
    ]
  },
  "location-国立国際美術館": {
    "id": "location-国立国際美術館",
    "kind": "location",
    "name": "国立国際美術館",
    "source": {
      "location_note": {
        "location": "国立国際美術館"
      },
      "geo": {
        "lat": 34.689,
        "lng": 135.522,
        "alt": null
      },
      "address": {
        "full": "大阪府内・国立国際美術館周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_024",
      "source_files": [
        "[[mock_activity_024.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-23-00_IG_0024]]"
    ]
  },
  "location-大阪歴史博物館": {
    "id": "location-大阪歴史博物館",
    "kind": "location",
    "name": "大阪歴史博物館",
    "source": {
      "location_note": {
        "location": "大阪歴史博物館"
      },
      "geo": {
        "lat": 34.692,
        "lng": 135.526,
        "alt": null
      },
      "address": {
        "full": "大阪府内・大阪歴史博物館周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_025",
      "source_files": [
        "[[mock_activity_025.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-24-00_IG_0025]]"
    ]
  },
  "location-千日前道具屋筋商店街": {
    "id": "location-千日前道具屋筋商店街",
    "kind": "location",
    "name": "千日前道具屋筋商店街",
    "source": {
      "location_note": {
        "location": "千日前道具屋筋商店街"
      },
      "geo": {
        "lat": 34.695,
        "lng": 135.53,
        "alt": null
      },
      "address": {
        "full": "大阪府内・千日前道具屋筋商店街周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_026",
      "source_files": [
        "[[mock_activity_026.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-25-00_IG_0026]]"
    ]
  },
  "location-法善寺横丁": {
    "id": "location-法善寺横丁",
    "kind": "location",
    "name": "法善寺横丁",
    "source": {
      "location_note": {
        "location": "法善寺横丁"
      },
      "geo": {
        "lat": 34.698,
        "lng": 135.534,
        "alt": null
      },
      "address": {
        "full": "大阪府内・法善寺横丁周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_027",
      "source_files": [
        "[[mock_activity_027.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-26-00_IG_0027]]"
    ]
  },
  "location-露天神社": {
    "id": "location-露天神社",
    "kind": "location",
    "name": "露天神社",
    "source": {
      "location_note": {
        "location": "露天神社"
      },
      "geo": {
        "lat": 34.701,
        "lng": 135.538,
        "alt": null
      },
      "address": {
        "full": "大阪府内・露天神社周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_028",
      "source_files": [
        "[[mock_activity_028.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-27-00_IG_0028]]"
    ]
  },
  "location-岸和田城": {
    "id": "location-岸和田城",
    "kind": "location",
    "name": "岸和田城",
    "source": {
      "location_note": {
        "location": "岸和田城"
      },
      "geo": {
        "lat": 34.704,
        "lng": 135.542,
        "alt": null
      },
      "address": {
        "full": "大阪府内・岸和田城周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_029",
      "source_files": [
        "[[mock_activity_029.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-28-00_IG_0029]]"
    ]
  },
  "location-USJ": {
    "id": "location-USJ",
    "kind": "location",
    "name": "USJ",
    "source": {
      "location_note": {
        "location": "USJ"
      },
      "geo": {
        "lat": 34.707,
        "lng": 135.546,
        "alt": null
      },
      "address": {
        "full": "大阪府内・USJ周辺（検証用表記）",
        "components": {
          "country": null,
          "prefecture": null,
          "city": null,
          "district": null,
          "street": null,
          "postal_code": null
        }
      },
      "activity_id": "mock_activity_030",
      "source_files": [
        "[[mock_activity_030.gpx]]"
      ],
      "note": "大阪の公開観光名所を題材にした、個人の行動履歴を含まない検証用データ"
    },
    "relatedPosts": [
      "[[2026-01-30-15-29-00_IG_0030]]"
    ]
  },
  "tag-#野球バット": {
    "id": "tag-#野球バット",
    "kind": "tag",
    "name": "#野球バット",
    "source": {
      "hashtag_note": {
        "hashtag": "#野球バット",
        "note": "野球で使用する打撃用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]",
      "[[2026-02-15-10-25-00_IGR_0026]]",
      "[[2026-03-01-08-15-00_IGS_0016]]"
    ]
  },
  "tag-#野球グローブ": {
    "id": "tag-#野球グローブ",
    "kind": "tag",
    "name": "#野球グローブ",
    "source": {
      "hashtag_note": {
        "hashtag": "#野球グローブ",
        "note": "野球で使用する捕球用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-00-00_IG_0001]]",
      "[[2026-01-30-15-01-00_IG_0002]]",
      "[[2026-02-15-10-26-00_IGR_0027]]",
      "[[2026-03-01-08-16-00_IGS_0017]]"
    ]
  },
  "tag-#サッカーボール": {
    "id": "tag-#サッカーボール",
    "kind": "tag",
    "name": "#サッカーボール",
    "source": {
      "hashtag_note": {
        "hashtag": "#サッカーボール",
        "note": "サッカーで使用するボール（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-02-00_IG_0003]]",
      "[[2026-02-15-10-27-00_IGR_0028]]",
      "[[2026-03-01-08-17-00_IGS_0018]]"
    ]
  },
  "tag-#サッカースパイク": {
    "id": "tag-#サッカースパイク",
    "kind": "tag",
    "name": "#サッカースパイク",
    "source": {
      "hashtag_note": {
        "hashtag": "#サッカースパイク",
        "note": "サッカー向けの靴（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-03-00_IG_0004]]",
      "[[2026-02-15-10-28-00_IGR_0029]]",
      "[[2026-03-01-08-18-00_IGS_0019]]"
    ]
  },
  "tag-#テニスラケット": {
    "id": "tag-#テニスラケット",
    "kind": "tag",
    "name": "#テニスラケット",
    "source": {
      "hashtag_note": {
        "hashtag": "#テニスラケット",
        "note": "テニスでボールを打つ用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-04-00_IG_0005]]",
      "[[2026-02-15-10-29-00_IGR_0030]]",
      "[[2026-03-01-08-18-00_IGS_0019]]",
      "[[2026-03-01-08-19-00_IGS_0020]]"
    ]
  },
  "tag-#テニスボール": {
    "id": "tag-#テニスボール",
    "kind": "tag",
    "name": "#テニスボール",
    "source": {
      "hashtag_note": {
        "hashtag": "#テニスボール",
        "note": "テニスで使用するボール（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-05-00_IG_0006]]",
      "[[2026-02-15-10-00-00_IGR_0001]]",
      "[[2026-03-01-08-20-00_IGS_0021]]"
    ]
  },
  "tag-#バスケットボール": {
    "id": "tag-#バスケットボール",
    "kind": "tag",
    "name": "#バスケットボール",
    "source": {
      "hashtag_note": {
        "hashtag": "#バスケットボール",
        "note": "バスケットボール競技で使用するボール（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-06-00_IG_0007]]",
      "[[2026-02-15-10-01-00_IGR_0002]]",
      "[[2026-03-01-08-21-00_IGS_0022]]"
    ]
  },
  "tag-#バスケットゴール": {
    "id": "tag-#バスケットゴール",
    "kind": "tag",
    "name": "#バスケットゴール",
    "source": {
      "hashtag_note": {
        "hashtag": "#バスケットゴール",
        "note": "バスケットボール競技のゴール設備（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-06-00_IG_0007]]",
      "[[2026-01-30-15-07-00_IG_0008]]",
      "[[2026-02-15-10-02-00_IGR_0003]]",
      "[[2026-03-01-08-22-00_IGS_0023]]"
    ]
  },
  "tag-#ゴルフクラブ": {
    "id": "tag-#ゴルフクラブ",
    "kind": "tag",
    "name": "#ゴルフクラブ",
    "source": {
      "hashtag_note": {
        "hashtag": "#ゴルフクラブ",
        "note": "ゴルフでボールを打つ用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-08-00_IG_0009]]",
      "[[2026-02-15-10-03-00_IGR_0004]]",
      "[[2026-03-01-08-23-00_IGS_0024]]"
    ]
  },
  "tag-#ゴルフボール": {
    "id": "tag-#ゴルフボール",
    "kind": "tag",
    "name": "#ゴルフボール",
    "source": {
      "hashtag_note": {
        "hashtag": "#ゴルフボール",
        "note": "ゴルフで使用するボール（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-09-00_IG_0010]]",
      "[[2026-02-15-10-04-00_IGR_0005]]",
      "[[2026-03-01-08-24-00_IGS_0025]]"
    ]
  },
  "tag-#ランニングシューズ": {
    "id": "tag-#ランニングシューズ",
    "kind": "tag",
    "name": "#ランニングシューズ",
    "source": {
      "hashtag_note": {
        "hashtag": "#ランニングシューズ",
        "note": "走行向けの靴（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-10-00_IG_0011]]",
      "[[2026-02-15-10-05-00_IGR_0006]]",
      "[[2026-03-01-08-25-00_IGS_0026]]"
    ]
  },
  "tag-#ダンベル": {
    "id": "tag-#ダンベル",
    "kind": "tag",
    "name": "#ダンベル",
    "source": {
      "hashtag_note": {
        "hashtag": "#ダンベル",
        "note": "筋力トレーニング用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-11-00_IG_0012]]",
      "[[2026-02-15-10-06-00_IGR_0007]]",
      "[[2026-03-01-08-26-00_IGS_0027]]"
    ]
  },
  "tag-#ヨガマット": {
    "id": "tag-#ヨガマット",
    "kind": "tag",
    "name": "#ヨガマット",
    "source": {
      "hashtag_note": {
        "hashtag": "#ヨガマット",
        "note": "ヨガやストレッチで使用するマット（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-12-00_IG_0013]]",
      "[[2026-02-15-10-07-00_IGR_0008]]",
      "[[2026-03-01-08-27-00_IGS_0028]]"
    ]
  },
  "tag-#水泳ゴーグル": {
    "id": "tag-#水泳ゴーグル",
    "kind": "tag",
    "name": "#水泳ゴーグル",
    "source": {
      "hashtag_note": {
        "hashtag": "#水泳ゴーグル",
        "note": "水泳時に使用するゴーグル（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-12-00_IG_0013]]",
      "[[2026-01-30-15-13-00_IG_0014]]",
      "[[2026-02-15-10-08-00_IGR_0009]]",
      "[[2026-03-01-08-27-00_IGS_0028]]",
      "[[2026-03-01-08-28-00_IGS_0029]]"
    ]
  },
  "tag-#自転車ヘルメット": {
    "id": "tag-#自転車ヘルメット",
    "kind": "tag",
    "name": "#自転車ヘルメット",
    "source": {
      "hashtag_note": {
        "hashtag": "#自転車ヘルメット",
        "note": "自転車利用時の保護用具（スポーツ用品の検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-14-00_IG_0015]]",
      "[[2026-02-15-10-09-00_IGR_0010]]",
      "[[2026-03-01-08-29-00_IGS_0030]]"
    ]
  },
  "tag-#枝豆": {
    "id": "tag-#枝豆",
    "kind": "tag",
    "name": "#枝豆",
    "source": {
      "hashtag_note": {
        "hashtag": "#枝豆",
        "note": "塩ゆでした枝豆の定番おつまみ（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-15-00_IG_0016]]",
      "[[2026-02-15-10-10-00_IGR_0011]]",
      "[[2026-03-01-08-00-00_IGS_0001]]"
    ]
  },
  "tag-#冷やしトマト": {
    "id": "tag-#冷やしトマト",
    "kind": "tag",
    "name": "#冷やしトマト",
    "source": {
      "hashtag_note": {
        "hashtag": "#冷やしトマト",
        "note": "冷やしたトマトを使う前菜（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-16-00_IG_0017]]",
      "[[2026-02-15-10-11-00_IGR_0012]]",
      "[[2026-03-01-08-00-00_IGS_0001]]",
      "[[2026-03-01-08-01-00_IGS_0002]]"
    ]
  },
  "tag-#だし巻き卵": {
    "id": "tag-#だし巻き卵",
    "kind": "tag",
    "name": "#だし巻き卵",
    "source": {
      "hashtag_note": {
        "hashtag": "#だし巻き卵",
        "note": "だしを加えて焼いた卵料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-17-00_IG_0018]]",
      "[[2026-02-15-10-12-00_IGR_0013]]",
      "[[2026-03-01-08-02-00_IGS_0003]]"
    ]
  },
  "tag-#鶏の唐揚げ": {
    "id": "tag-#鶏の唐揚げ",
    "kind": "tag",
    "name": "#鶏の唐揚げ",
    "source": {
      "hashtag_note": {
        "hashtag": "#鶏の唐揚げ",
        "note": "下味を付けた鶏肉の揚げ物（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-18-00_IG_0019]]",
      "[[2026-02-15-10-13-00_IGR_0014]]",
      "[[2026-03-01-08-03-00_IGS_0004]]"
    ]
  },
  "tag-#焼き鳥": {
    "id": "tag-#焼き鳥",
    "kind": "tag",
    "name": "#焼き鳥",
    "source": {
      "hashtag_note": {
        "hashtag": "#焼き鳥",
        "note": "鶏肉などを串に刺して焼く料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-18-00_IG_0019]]",
      "[[2026-01-30-15-19-00_IG_0020]]",
      "[[2026-02-15-10-14-00_IGR_0015]]",
      "[[2026-03-01-08-04-00_IGS_0005]]"
    ]
  },
  "tag-#つくね": {
    "id": "tag-#つくね",
    "kind": "tag",
    "name": "#つくね",
    "source": {
      "hashtag_note": {
        "hashtag": "#つくね",
        "note": "ひき肉をまとめて焼く串料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-20-00_IG_0021]]",
      "[[2026-02-15-10-15-00_IGR_0016]]",
      "[[2026-03-01-08-05-00_IGS_0006]]"
    ]
  },
  "tag-#刺身盛り合わせ": {
    "id": "tag-#刺身盛り合わせ",
    "kind": "tag",
    "name": "#刺身盛り合わせ",
    "source": {
      "hashtag_note": {
        "hashtag": "#刺身盛り合わせ",
        "note": "複数種類の刺身を盛り合わせた料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-21-00_IG_0022]]",
      "[[2026-02-15-10-16-00_IGR_0017]]",
      "[[2026-03-01-08-06-00_IGS_0007]]"
    ]
  },
  "tag-#しめ鯖": {
    "id": "tag-#しめ鯖",
    "kind": "tag",
    "name": "#しめ鯖",
    "source": {
      "hashtag_note": {
        "hashtag": "#しめ鯖",
        "note": "酢で締めた鯖料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-22-00_IG_0023]]",
      "[[2026-02-15-10-17-00_IGR_0018]]",
      "[[2026-03-01-08-07-00_IGS_0008]]"
    ]
  },
  "tag-#ほっけ開き": {
    "id": "tag-#ほっけ開き",
    "kind": "tag",
    "name": "#ほっけ開き",
    "source": {
      "hashtag_note": {
        "hashtag": "#ほっけ開き",
        "note": "ほっけの開きを焼いた料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-23-00_IG_0024]]",
      "[[2026-02-15-10-18-00_IGR_0019]]",
      "[[2026-03-01-08-08-00_IGS_0009]]"
    ]
  },
  "tag-#揚げ出し豆腐": {
    "id": "tag-#揚げ出し豆腐",
    "kind": "tag",
    "name": "#揚げ出し豆腐",
    "source": {
      "hashtag_note": {
        "hashtag": "#揚げ出し豆腐",
        "note": "揚げた豆腐にだしを合わせる料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-24-00_IG_0025]]",
      "[[2026-02-15-10-19-00_IGR_0020]]",
      "[[2026-03-01-08-09-00_IGS_0010]]"
    ]
  },
  "tag-#フライドポテト": {
    "id": "tag-#フライドポテト",
    "kind": "tag",
    "name": "#フライドポテト",
    "source": {
      "hashtag_note": {
        "hashtag": "#フライドポテト",
        "note": "じゃがいもの揚げ物（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-24-00_IG_0025]]",
      "[[2026-01-30-15-25-00_IG_0026]]",
      "[[2026-02-15-10-20-00_IGR_0021]]",
      "[[2026-03-01-08-09-00_IGS_0010]]",
      "[[2026-03-01-08-10-00_IGS_0011]]"
    ]
  },
  "tag-#もつ煮込み": {
    "id": "tag-#もつ煮込み",
    "kind": "tag",
    "name": "#もつ煮込み",
    "source": {
      "hashtag_note": {
        "hashtag": "#もつ煮込み",
        "note": "もつを味噌などで煮込む料理（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-26-00_IG_0027]]",
      "[[2026-02-15-10-21-00_IGR_0022]]",
      "[[2026-03-01-08-11-00_IGS_0012]]"
    ]
  },
  "tag-#焼きおにぎり": {
    "id": "tag-#焼きおにぎり",
    "kind": "tag",
    "name": "#焼きおにぎり",
    "source": {
      "hashtag_note": {
        "hashtag": "#焼きおにぎり",
        "note": "表面を香ばしく焼いたおにぎり（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-27-00_IG_0028]]",
      "[[2026-02-15-10-22-00_IGR_0023]]",
      "[[2026-03-01-08-12-00_IGS_0013]]"
    ]
  },
  "tag-#生ビール": {
    "id": "tag-#生ビール",
    "kind": "tag",
    "name": "#生ビール",
    "source": {
      "hashtag_note": {
        "hashtag": "#生ビール",
        "note": "居酒屋で提供される代表的な飲料（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-28-00_IG_0029]]",
      "[[2026-02-15-10-23-00_IGR_0024]]",
      "[[2026-03-01-08-13-00_IGS_0014]]"
    ]
  },
  "tag-#ハイボール": {
    "id": "tag-#ハイボール",
    "kind": "tag",
    "name": "#ハイボール",
    "source": {
      "hashtag_note": {
        "hashtag": "#ハイボール",
        "note": "ウイスキーを炭酸で割る飲料（居酒屋メニューの検証用記入）"
      }
    },
    "relatedPosts": [
      "[[2026-01-30-15-29-00_IG_0030]]",
      "[[2026-02-15-10-24-00_IGR_0025]]",
      "[[2026-03-01-08-14-00_IGS_0015]]"
    ]
  }
},
    groups: {
  "location-ユニバーサル・スタジオ・ジャパン": {
    "bigCardId": "location-ユニバーサル・スタジオ・ジャパン",
    "memberIds": [
      "location-USJ"
    ],
    "displayMode": "source"
  },
  "tag-#生ビール": {
    "bigCardId": "tag-#生ビール",
    "memberIds": [
      "tag-#ハイボール"
    ],
    "displayMode": "source"
  }
}
  };
}
