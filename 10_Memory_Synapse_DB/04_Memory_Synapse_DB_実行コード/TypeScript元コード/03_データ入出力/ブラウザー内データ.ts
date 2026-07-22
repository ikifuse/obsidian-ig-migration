import { 空の手書き情報 } from "../01_データ構造/手書き情報";
import type { 融合状態 } from "../01_データ構造/融合グループ";

export function 初期状態を作る(): 融合状態 {
  return {
    cards: {
      "mention-cafe": {
        id: "mention-cafe",
        kind: "mention",
        name: "@sample_account_002",
        source: {
          mention: "@sample_account_002",
          name: "サンプル店舗A",
          phone: ["未登録"],
          web: ["https://www.instagram.com/sample_account_002/"],
          note: "Instagramから移行した情報"
        },
        relatedPosts: ["[[2024-01-01-12-00-00_IG_0001]]", "[[2024-01-02-12-00-00_IG_0002]]"],
        handwritten: {
          ...structuredClone(空の手書き情報),
          displayName: "いつものカフェ",
          name: "サンプル店舗A",
          aliases: ["駅前のお店"],
          note: "モーニングで利用"
        }
      },
      "mention-friend": {
        id: "mention-friend",
        kind: "mention",
        name: "@sample_account_003",
        source: {
          mention: "@sample_account_003",
          name: "サンプル人物B",
          phone: ["未登録"],
          web: ["https://www.instagram.com/sample_account_003/"],
          note: "確認前"
        },
        relatedPosts: ["[[2024-01-03-12-00-00_IG_0003]]"]
      },
      "location-gala": {
        id: "location-gala",
        kind: "location",
        name: "サンプル地点A",
        source: {
          location: "サンプル地点A",
          geo: "35.000001, 135.000001",
          address: "サンプル県Aサンプル市A",
          activity_id: "activity_000001",
          source_files: ["[[activity_000001.gpx]]"],
          note: "移行時点の情報"
        },
        relatedPosts: ["[[2024-01-04-12-00-00_IG_0004]]"],
        handwritten: {
          ...structuredClone(空の手書き情報),
          displayName: "よく行く場所A",
          geo: { lat: "35.0001", lng: "135.0001", alt: "" },
          address: { ...空の手書き情報.address, prefecture: "サンプル県A", city: "サンプル市A" },
          note: "ゴンドラ乗り場で待ち合わせ"
        }
      },
      "location-american": {
        id: "location-american",
        kind: "location",
        name: "サンプル地点B",
        source: {
          location: "サンプル地点B",
          geo: "34.000001, 134.000001",
          address: "サンプル県Bサンプル市B",
          activity_id: "activity_000002",
          source_files: ["[[activity_000002.gpx]]"],
          note: "移行時点の情報"
        },
        relatedPosts: ["[[2024-01-05-12-00-00_IG_0005]]"]
      },
      "tag-goruck": {
        id: "tag-goruck",
        kind: "tag",
        name: "#SampleTagA",
        source: { hashtag: "#SampleTagA", note: "イベント記録" },
        relatedPosts: ["[[2024-01-06-12-00-00_IG_0006]]"]
      },
      "tag-food": {
        id: "tag-food",
        kind: "tag",
        name: "#サンプルタグB",
        source: { hashtag: "#サンプルタグB", note: "料理の記録" },
        relatedPosts: ["[[2024-01-07-12-00-00_IG_0007]]", "[[2024-01-08-12-00-00_IG_0008]]"]
      }
    },
    groups: {
      "mention-cafe": {
        bigCardId: "mention-cafe",
        memberIds: ["tag-food"],
        displayMode: "source"
      },
      "location-gala": {
        bigCardId: "location-gala",
        memberIds: ["tag-goruck"],
        displayMode: "handwritten"
      }
    }
  };
}
