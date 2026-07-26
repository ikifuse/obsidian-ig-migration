window.PROTOTYPE_MAP = {
  "meta": {
    "id": "overall-flow",
    "title": "プロジェクト全体フロー",
    "subtitle": "発端から親完成、独立後続までの縦軸",
    "mode": "flow",
    "source": "公開参考資料 map-data.js / stages・flowEdges",
    "status": "企画検証用の叩き台"
  },
  "flow": {
    "rows": [
      [
        "idea"
      ],
      [
        "plan"
      ],
      [
        "design"
      ],
      [
        "spec"
      ],
      [
        "igp",
        "igr",
        "igs",
        "igx"
      ],
      [
        "igc"
      ],
      [
        "import"
      ],
      [
        "memory"
      ],
      [
        "goal"
      ]
    ],
    "nodes": [
      {
        "id": "idea",
        "label": "一つのアイデア",
        "note": "個人の文脈を第二の脳へ",
        "kind": "idea",
        "link": null
      },
      {
        "id": "plan",
        "label": "01_IG移行企画書",
        "note": "目的・理由・完走点",
        "kind": "stage",
        "link": "../../01_企画地図/prototype/index.html"
      },
      {
        "id": "design",
        "label": "02_IG移行設計書",
        "note": "構造・責任・境界",
        "kind": "stage",
        "link": "../../02_設計地図/prototype/index.html"
      },
      {
        "id": "spec",
        "label": "04_IG移行仕様書",
        "note": "実装可能な条件へ",
        "kind": "stage",
        "link": "../../04_仕様地図/prototype/index.html"
      },
      {
        "id": "igp",
        "label": "05_IGP移行_実行",
        "note": "通常投稿",
        "kind": "parallel",
        "link": null
      },
      {
        "id": "igr",
        "label": "06_IGR移行_実行",
        "note": "リール",
        "kind": "parallel",
        "link": null
      },
      {
        "id": "igs",
        "label": "07_IGS移行_実行",
        "note": "ストーリー",
        "kind": "parallel",
        "link": null
      },
      {
        "id": "igx",
        "label": "08_IGX移行_実行",
        "note": "現在の完走条件から除外",
        "kind": "excluded",
        "link": null
      },
      {
        "id": "igc",
        "label": "09_IGC統合",
        "note": "05・06・07を集約",
        "kind": "stage",
        "link": "../../09_IGC統合地図/prototype/index.html"
      },
      {
        "id": "import",
        "label": "親プロジェクト完成",
        "note": "最終パッケージを実物確認",
        "kind": "owner",
        "link": null
      },
      {
        "id": "memory",
        "label": "10_Memory_Synapse_DB",
        "note": "独立した後続プロジェクト",
        "kind": "stage",
        "link": "../../10_Memory_Synapse_DB地図/prototype/index.html"
      },
      {
        "id": "goal",
        "label": "Obsidianで育てる第二の脳",
        "note": "人間とAIが理解できる知識基盤",
        "kind": "goal",
        "link": null
      }
    ],
    "edges": [
      [
        "idea",
        "plan",
        "flow"
      ],
      [
        "plan",
        "design",
        "flow"
      ],
      [
        "design",
        "spec",
        "flow"
      ],
      [
        "spec",
        "igp",
        "flow"
      ],
      [
        "spec",
        "igr",
        "flow"
      ],
      [
        "spec",
        "igs",
        "flow"
      ],
      [
        "spec",
        "igx",
        "excluded"
      ],
      [
        "igp",
        "igc",
        "flow"
      ],
      [
        "igr",
        "igc",
        "flow"
      ],
      [
        "igs",
        "igc",
        "flow"
      ],
      [
        "igc",
        "import",
        "flow"
      ],
      [
        "import",
        "memory",
        "flow"
      ],
      [
        "memory",
        "goal",
        "flow"
      ]
    ]
  }
};
