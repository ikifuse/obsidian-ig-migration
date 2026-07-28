import type { MentionSource, TagSource, LocationSource } from "../01_データ構造/カード";

// メンションのSynapseダミーデータ（IGCのMarkdown出力と同等の内容）
export const 検証用MentionSynapse一覧: Record<string, MentionSource> = {
  "@sazae_fuguta": {
    mention_note: {
      mention: "@sazae_fuguta",
      name: "フグ田 サザエ",
      phone: ["090-0000-0001"],
      web: ["https://www.instagram.com/sazae_fuguta/"],
      note: "あわてんぼうだが明るい性格。趣味は買い物。"
    }
  },
  "@masuo_fuguta": {
    mention_note: {
      mention: "@masuo_fuguta",
      name: "フグ田 マスオ",
      phone: ["090-0000-0002"],
      web: ["https://www.instagram.com/masuo_fuguta/"],
      note: "優しい夫。特技はバイオリン。"
    }
  },
  "@son_goku": {
    mention_note: {
      mention: "@son_goku",
      name: "孫 悟空",
      phone: [],
      web: ["https://www.instagram.com/son_goku/"],
      note: "地球育ちのサイヤ人。修行が大好き。"
    }
  },
  "@piccolo": {
    mention_note: {
      mention: "@piccolo",
      name: "ピッコロ",
      phone: [],
      web: ["https://www.instagram.com/piccolo/"],
      note: "ナメック星人。悟飯の師匠。"
    }
  }
};

// タグのSynapseダミーデータ
export const 検証用TagSynapse一覧: Record<string, TagSource> = {
  "#野球バット": {
    hashtag_note: {
      hashtag: "#野球バット",
      note: "木製バットと金属バットがある。最近はカーボン製も。"
    }
  },
  "#野球グローブ": {
    hashtag_note: {
      hashtag: "#野球グローブ",
      note: "内野手用、外野手用、キャッチャーミットなど用途によって形が違う。"
    }
  },
  "#ドラゴンボール": {
    hashtag_note: {
      hashtag: "#ドラゴンボール",
      note: "7つ集めると神龍が現れ、願いを叶えてくれる不思議な玉。"
    }
  },
  "#居酒屋": {
    hashtag_note: {
      hashtag: "#居酒屋",
      note: "仕事帰りによく立ち寄る場所。焼き鳥とビールが定番。"
    }
  },
  "#ビール": {
    hashtag_note: {
      hashtag: "#ビール",
      note: "最初の一杯に最適。冷えていると美味しい。"
    }
  }
};

// 場所のSynapseダミーデータ（親ログのlocationとは別に、個別の場所ページとしての情報）
export const 検証用LocationSynapse一覧: Record<string, LocationSource> = {
  "大阪城": {
    location_note: {
      location: "大阪城"
    },
    geo: {
      lat: 34.687344154038,
      lng: 135.52532936162,
      alt: null
    },
    address: {
      full: "大阪府大阪市中央区大阪城1-1",
      components: {
        country: "日本",
        prefecture: "大阪府",
        city: "大阪市中央区",
        district: "大阪城",
        street: "1-1",
        postal_code: "540-0002"
      }
    },
    activity_id: null,
    source_files: ["[[2026-01-30-15-00-00_IG_0001]]", "[[2026-01-30-15-01-00_IG_0002]]"],
    note: "豊臣秀吉が築城した名城。天守閣からの眺めが良い。"
  }
};
