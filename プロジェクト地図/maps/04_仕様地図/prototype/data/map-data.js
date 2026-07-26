window.PROTOTYPE_MAP = {
  "meta": {
    "id": "spec",
    "title": "04 仕様地図",
    "subtitle": "入力・処理・出力・例外・再実行・完了条件",
    "mode": "tree",
    "source": "公開参考資料 map-data.js / views.spec",
    "status": "企画検証用の叩き台"
  },
  "root": {
    "label": "04_IG移行仕様書｜入力・処理・出力・例外・完了条件",
    "note": "クリックして分岐を開く",
    "children": [
      {
        "label": "00_仕様書目次",
        "children": [
          {
            "label": "01_IG移行共通仕様書v1.2.md",
            "children": []
          },
          {
            "label": "02_IGP移行仕様書v1.2.md",
            "children": []
          },
          {
            "label": "03_IGR移行仕様書v1.2.md",
            "children": []
          },
          {
            "label": "04_IGS移行仕様書v1.2.md",
            "children": []
          },
          {
            "label": "05_IGX移行仕様書v1.2.md",
            "children": []
          }
        ]
      },
      {
        "label": "システム共通仕様",
        "children": [
          {
            "label": "一方向パイプライン",
            "children": [
              {
                "label": "1. 原本JSONを取り込み、文字コードと日時を正規化する",
                "children": []
              },
              {
                "label": "2. データ種別ごとのoutput_*へ隔離出力する",
                "children": []
              },
              {
                "label": "3. 個別SynapseカードとTimelineを生成する",
                "children": []
              },
              {
                "label": "4. 手動確認後に各工程の出力を確定する",
                "children": []
              },
              {
                "label": "5. IGP・IGR・IGSの確定後にIGCを実行する",
                "children": []
              }
            ]
          },
          {
            "label": "入力と正規化",
            "children": [
              {
                "label": "原本JSONと参照メディアを入力にする",
                "children": []
              },
              {
                "label": "MarkdownはUTF-8（BOMなし）で保存する",
                "children": []
              },
              {
                "label": "日時はJSTのISO 8601へ変換する",
                "children": []
              },
              {
                "label": "秒単位のISO 8601とエポックミリ秒を併用する",
                "children": []
              }
            ]
          },
          {
            "label": "複数JSONが重複するとき",
            "children": [
              {
                "label": "情報量が豊富なJSONを主データとして定義する",
                "children": []
              },
              {
                "label": "他の重複原本は監査・照合用として保持する",
                "children": []
              },
              {
                "label": "個別仕様に定義がない自動マージ・自動補完を行わない",
                "children": []
              },
              {
                "label": "一つの投稿からMarkdownを二重生成しない",
                "children": []
              }
            ]
          },
          {
            "label": "工程出力を隔離する",
            "children": [
              {
                "label": "IGPはoutput_IGPへ出力する",
                "children": []
              },
              {
                "label": "IGRはoutput_IGRへ出力する",
                "children": []
              },
              {
                "label": "IGSはoutput_IGSへ出力する",
                "children": []
              },
              {
                "label": "IGXはoutput_IGXへ出力する",
                "children": []
              },
              {
                "label": "利用中Vaultや別工程へ直接書き込まない",
                "children": []
              }
            ]
          },
          {
            "label": "IGC統合の入口と更新範囲",
            "children": [
              {
                "label": "入力はoutput_IGP・output_IGR・output_IGSだけ",
                "children": []
              },
              {
                "label": "output_IGXと既存output_IGCを入力・補完元にしない",
                "children": []
              },
              {
                "label": "更新対象はSynapses 3分類とSystemLogs 3一覧だけ",
                "children": []
              },
              {
                "label": "Posts・Reels・Stories・media・RawData・Timelineを変更しない",
                "children": []
              },
              {
                "label": "IGP・IGR・IGSからoutput_IGCへ直接再実行しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "データ構造・YAML仕様",
        "children": [
          {
            "label": "識別と種類",
            "children": [
              {
                "label": "id：タイムスタンプを基礎にした一意ID",
                "children": []
              },
              {
                "label": "source：instagram",
                "children": []
              },
              {
                "label": "type：Feed・Reels・Stories・Salvage",
                "children": []
              },
              {
                "label": "content：画像はnull・動画はvideo",
                "children": []
              },
              {
                "label": "instagram_id・original_filename",
                "children": []
              }
            ]
          },
          {
            "label": "時間",
            "children": [
              {
                "label": "date・created_at・updated_at・event_at",
                "children": []
              },
              {
                "label": "created_at_ms・updated_at_ms・event_at_ms",
                "children": []
              },
              {
                "label": "同時刻の複数メディアを後から再整理できる精度を保つ",
                "children": []
              }
            ]
          },
          {
            "label": "関係",
            "children": [
              {
                "label": "tags：元表記を保持したハッシュタグ配列",
                "children": []
              },
              {
                "label": "mentions：先頭@を含むメンション表記",
                "children": []
              },
              {
                "label": "links：Wikiリンク形式の関係",
                "children": []
              },
              {
                "label": "group_id：必要な場合だけ使う",
                "children": []
              }
            ]
          },
          {
            "label": "位置情報",
            "children": [
              {
                "label": "raw・normalized：元のスポット名と抽出後の名称",
                "children": []
              },
              {
                "label": "geo：緯度・経度・高度",
                "children": []
              },
              {
                "label": "address：住所全文と構成要素",
                "children": []
              },
              {
                "label": "confidence：位置情報の確認状態",
                "children": []
              },
              {
                "label": "synapse_link：Location Synapseへの接続",
                "children": []
              }
            ]
          },
          {
            "label": "原本・メディア・生成情報",
            "children": [
              {
                "label": "raw_source_path：個別原本へのWikiリンク",
                "children": []
              },
              {
                "label": "media_count・media.path",
                "children": []
              },
              {
                "label": "emoji_original・emoji_normalized",
                "children": []
              },
              {
                "label": "migration_version・created_from",
                "children": []
              },
              {
                "label": "unparsed：将来用のnull固定欄",
                "children": []
              }
            ]
          },
          {
            "label": "Markdown本文",
            "children": [
              {
                "label": "YAMLフロントマター",
                "children": []
              },
              {
                "label": "元キャプションを改行を保って記述する",
                "children": []
              },
              {
                "label": "コピーしたメディアを埋め込む",
                "children": []
              },
              {
                "label": "最下部へinstagram・タグ・メンション・位置のWikiリンクを出力する",
                "children": []
              }
            ]
          },
          {
            "label": "出力ディレクトリの役割",
            "children": [
              {
                "label": "IGP：半期／Posts・Instagram/media・RawData・Timeline",
                "children": []
              },
              {
                "label": "IGR：Reels・共通media・RawData/Reels・Reels_Timeline",
                "children": []
              },
              {
                "label": "IGS：半期／Stories・共通media・RawData・Timeline",
                "children": []
              },
              {
                "label": "IGX：期間分割しないSalvage・共通media・Salvage_Timeline",
                "children": []
              },
              {
                "label": "全工程：Synapses・SystemLogs一覧・Events・状態管理",
                "children": []
              }
            ]
          },
          {
            "label": "配置の禁止事項",
            "children": [
              {
                "label": "IGPのFeedメディアを全期間共通mediaへ移さない",
                "children": []
              },
              {
                "label": "IGR・IGS・IGXのメディアを半期内Instagram/mediaへ移さない",
                "children": []
              },
              {
                "label": "IGR・IGXを半期分割しない",
                "children": []
              },
              {
                "label": "RawData・Events・Timeline・状態管理を省略しない",
                "children": []
              },
              {
                "label": "空の将来欄や人間が追記した本文を削除しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "個別移行モジュール（IGP／IGR／IGS／IGX）",
        "children": [
          {
            "label": "IGP（通常投稿／Feed）",
            "children": [
              {
                "label": "入力",
                "children": [
                  {
                    "label": "実行対象はmedia配下のposts.json",
                    "children": []
                  },
                  {
                    "label": "posts_1.json等は監査・照合用として保持する",
                    "children": []
                  },
                  {
                    "label": "1原本レコードから1投稿Markdownを生成する",
                    "children": []
                  }
                ]
              },
              {
                "label": "取込と抽出",
                "children": [
                  {
                    "label": "label_valuesからキャプションを取得する",
                    "children": []
                  },
                  {
                    "label": "複数キャプションはRawDataへすべて保持し、採用値を1件選ぶ",
                    "children": []
                  },
                  {
                    "label": "キャプションからハッシュタグとメンションを抽出する",
                    "children": []
                  },
                  {
                    "label": "スポット辞書を再帰探索して場所名を取得する",
                    "children": []
                  },
                  {
                    "label": "media.uriから参照メディアを取得する",
                    "children": []
                  }
                ]
              },
              {
                "label": "出力",
                "children": [
                  {
                    "label": "半期ごとのPosts",
                    "children": []
                  },
                  {
                    "label": "投稿ごとのRawData",
                    "children": []
                  },
                  {
                    "label": "半期内Instagram/media",
                    "children": []
                  },
                  {
                    "label": "期間Timeline・Events・状態管理",
                    "children": []
                  },
                  {
                    "label": "Tags・Mentions・Locationsの個別Synapse",
                    "children": []
                  },
                  {
                    "label": "ハッシュタグ・メンション・場所一覧",
                    "children": []
                  }
                ]
              },
              {
                "label": "自動判断してはいけないこと",
                "children": [
                  {
                    "label": "構造Aと構造Bを自動マージしない",
                    "children": []
                  },
                  {
                    "label": "ハッシュタグ表記を短縮・補正・大文字小文字統合しない",
                    "children": []
                  },
                  {
                    "label": "@文字列だけで実在アカウントや本人性を確定しない",
                    "children": []
                  },
                  {
                    "label": "場所名・座標・住所だけで同一場所へ統合しない",
                    "children": []
                  }
                ]
              },
              {
                "label": "完了条件",
                "children": [
                  {
                    "label": "対象投稿・RawData・参照メディアの全対応",
                    "children": []
                  },
                  {
                    "label": "Timeline・Synapse・一覧・Events・状態管理の対応",
                    "children": []
                  },
                  {
                    "label": "個別Synapseが情報YAML1件と関連投稿Wikiリンクを持つ",
                    "children": []
                  },
                  {
                    "label": "技術的処理エラーが0件",
                    "children": []
                  },
                  {
                    "label": "再実行で人間入力値を保持し、不足だけを補う",
                    "children": []
                  },
                  {
                    "label": "原本との食い違いは自動上書きせず停止する",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "IGR（リール／Reels）",
            "children": [
              {
                "label": "入力",
                "children": [
                  {
                    "label": "media/reels*.jsonと参照メディア",
                    "children": []
                  },
                  {
                    "label": "トップレベルig_reels_mediaを持つ辞書構造",
                    "children": []
                  },
                  {
                    "label": "media要素のtitleとcreation_timestampを使用する",
                    "children": []
                  }
                ]
              },
              {
                "label": "取込と抽出",
                "children": [
                  {
                    "label": "type=Reels・content=video・ID接頭辞IGR",
                    "children": []
                  },
                  {
                    "label": "本文・日時・メディア・タグ・メンションを抽出する",
                    "children": []
                  },
                  {
                    "label": "GPS座標があればlocation.geoへ観測値として保持する",
                    "children": []
                  }
                ]
              },
              {
                "label": "出力",
                "children": [
                  {
                    "label": "Reelsメモ・RawData/Reels・共通media",
                    "children": []
                  },
                  {
                    "label": "Reels_Timeline・Events・状態管理",
                    "children": []
                  },
                  {
                    "label": "Tags・Mentions・Locationsの個別Synapse",
                    "children": []
                  },
                  {
                    "label": "ハッシュタグ・メンション・場所一覧",
                    "children": []
                  }
                ]
              },
              {
                "label": "IGR固有の例外",
                "children": [
                  {
                    "label": "スポット名なしのGPS座標だけではLocation Synapseを生成しない",
                    "children": []
                  },
                  {
                    "label": ".srt欠損は警告として記録し、他成果物の処理を続ける",
                    "children": []
                  },
                  {
                    "label": "文章・店名・#打ち間違いと思われる@表記をメンション抽出しない",
                    "children": []
                  },
                  {
                    "label": "原文とRawDataは変更しない",
                    "children": []
                  }
                ]
              },
              {
                "label": "完了条件",
                "children": [
                  {
                    "label": "全入力を生成・明示的除外・技術的失敗へ分類する",
                    "children": []
                  },
                  {
                    "label": "リールメモ・RawData・全参照メディアを対応させる",
                    "children": []
                  },
                  {
                    "label": "座標観測と.srt警告を失わない",
                    "children": []
                  },
                  {
                    "label": "Synapseと関連投稿を対応させる",
                    "children": []
                  },
                  {
                    "label": "再実行で人間入力値を保持し不足だけを補う",
                    "children": []
                  },
                  {
                    "label": "技術的処理エラー0件と実物対応確認",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "IGS（ストーリー／Stories）",
            "children": [
              {
                "label": "入力",
                "children": [
                  {
                    "label": "media/stories*.jsonと参照メディア",
                    "children": []
                  },
                  {
                    "label": "トップレベルig_storiesを持つ辞書構造",
                    "children": []
                  },
                  {
                    "label": "title・creation_timestamp・uriを使用する",
                    "children": []
                  },
                  {
                    "label": "story_interactionsは主処理へ混ぜない",
                    "children": []
                  }
                ]
              },
              {
                "label": "取込と抽出",
                "children": [
                  {
                    "label": "type=Stories・ID接頭辞IGS",
                    "children": []
                  },
                  {
                    "label": "画像はcontent=null・動画はcontent=video",
                    "children": []
                  },
                  {
                    "label": "秒単位の作成日時を時系列復元へ使う",
                    "children": []
                  },
                  {
                    "label": "GPS座標があればlocation.geoへ観測値として保持する",
                    "children": []
                  }
                ]
              },
              {
                "label": "出力",
                "children": [
                  {
                    "label": "半期ごとのStories・RawData・Timeline",
                    "children": []
                  },
                  {
                    "label": "全期間共通media・Events・状態管理",
                    "children": []
                  },
                  {
                    "label": "Tags・Mentions・Locationsの個別Synapse",
                    "children": []
                  },
                  {
                    "label": "ハッシュタグ・メンション・場所一覧",
                    "children": []
                  }
                ]
              },
              {
                "label": "IGS固有の境界",
                "children": [
                  {
                    "label": "story_interactionsは将来の関係解析材料として原本保持する",
                    "children": []
                  },
                  {
                    "label": "ハイライト所属はStory本体の移行と分けて検証する",
                    "children": []
                  },
                  {
                    "label": "直接対応が確認できるまで推定リンクを出力しない",
                    "children": []
                  },
                  {
                    "label": "所属未確認をIGS本体の技術的失敗へ混ぜない",
                    "children": []
                  }
                ]
              },
              {
                "label": "完了条件",
                "children": [
                  {
                    "label": "全Storyを生成・明示的除外・技術的失敗へ分類する",
                    "children": []
                  },
                  {
                    "label": "Story・RawData・メディア・座標観測を対応させる",
                    "children": []
                  },
                  {
                    "label": "Timeline・Synapse・一覧・Events・状態管理を確認する",
                    "children": []
                  },
                  {
                    "label": "未確認のハイライト所属を確定情報として出力しない",
                    "children": []
                  },
                  {
                    "label": "再実行で人間入力値を保持し不足だけを補う",
                    "children": []
                  },
                  {
                    "label": "技術的処理エラー0件と実物対応確認",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "IGX（サルベージ／Salvage・現在は完走範囲外）",
            "children": [
              {
                "label": "役割と入力",
                "children": [
                  {
                    "label": "IGP・IGR・IGSで扱えない欠損・孤児・分類不能データを救出する",
                    "children": []
                  },
                  {
                    "label": "timestamp・label_values・media等を持つ原本を扱う",
                    "children": []
                  },
                  {
                    "label": "現在のIGC入力へ追加しない",
                    "children": []
                  }
                ]
              },
              {
                "label": "出力",
                "children": [
                  {
                    "label": "期間分割しないSalvageメモ",
                    "children": []
                  },
                  {
                    "label": "RawData・共通media・Salvage_Timeline",
                    "children": []
                  },
                  {
                    "label": "Events・状態管理",
                    "children": []
                  },
                  {
                    "label": "Tags・Mentions・Locationsの個別Synapseと一覧",
                    "children": []
                  }
                ]
              },
              {
                "label": "保護条件",
                "children": [
                  {
                    "label": "IGP・IGR・IGSの正式成果物を上書きしない",
                    "children": []
                  },
                  {
                    "label": "同一データを根拠なく重複生成しない",
                    "children": []
                  },
                  {
                    "label": "救出元と参照メディアへ戻れる",
                    "children": []
                  },
                  {
                    "label": "場所名なしのGPS座標だけではLocation Synapseを生成しない",
                    "children": []
                  }
                ]
              },
              {
                "label": "完了条件",
                "children": [
                  {
                    "label": "全対象を生成・明示的除外・技術的失敗へ分類する",
                    "children": []
                  },
                  {
                    "label": "Salvage・RawData・メディアを対応させる",
                    "children": []
                  },
                  {
                    "label": "Synapseと関連投稿を対応させる",
                    "children": []
                  },
                  {
                    "label": "技術的処理エラー0件と関連成果物を確認する",
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "label": "Synapseメモ・Memory DB仕様",
        "children": [
          {
            "label": "生成時に行わないこと",
            "children": [
              {
                "label": "ハッシュタグ・メンション・位置情報の自動揺らぎ判定",
                "children": []
              },
              {
                "label": "名前・表記・座標・住所による自動統合",
                "children": []
              },
              {
                "label": "自動分離",
                "children": []
              },
              {
                "label": "実在アカウントや同一場所の自動確定",
                "children": []
              }
            ]
          },
          {
            "label": "個別Synapseカードの共通契約",
            "children": [
              {
                "label": "各抽出工程が空の仮カードではなく完成したカードを出力する",
                "children": []
              },
              {
                "label": "カテゴリ固有の初期情報と人間が育てる欄を持つ",
                "children": []
              },
              {
                "label": "## 関連投稿に元投稿へのWikiリンクを並べる",
                "children": []
              },
              {
                "label": "出現回数・投稿回数を持たせない",
                "children": []
              },
              {
                "label": "投稿ごとの抽出YAMLやSTART/END管理印を繰り返さない",
                "children": []
              }
            ]
          },
          {
            "label": "タグメモ（Tags）",
            "children": [
              {
                "label": "hashtag_noteを1件だけ置く",
                "children": []
              },
              {
                "label": "hashtagに先頭#を含む元表記を保持する",
                "children": []
              },
              {
                "label": "noteは人間が後から育てる自由メモ欄",
                "children": []
              },
              {
                "label": "大文字小文字・数字・記号を人間判断前に変更しない",
                "children": []
              }
            ]
          },
          {
            "label": "メンションメモ（Mentions）",
            "children": [
              {
                "label": "mention_noteを1件だけ置く",
                "children": []
              },
              {
                "label": "mentionに先頭@を含む元表記を保持する",
                "children": []
              },
              {
                "label": "name・phone・web・noteを人間が後から育てる",
                "children": []
              },
              {
                "label": "@文字列から作るURLは存在・所有者・本人性を保証しない",
                "children": []
              },
              {
                "label": "related_locationsや独立email欄を設置しない",
                "children": []
              }
            ]
          },
          {
            "label": "場所メモ（Locations）",
            "children": [
              {
                "label": "location_note・geo・addressを1件のYAMLへ置く",
                "children": []
              },
              {
                "label": "activity_id・source_files・noteを人間が育てる",
                "children": []
              },
              {
                "label": "一投稿の一チェックインを基本単位として保持する",
                "children": []
              },
              {
                "label": "場所名なしのGPS座標だけではLocation Synapseを生成しない",
                "children": []
              },
              {
                "label": "投稿ごとの位置観測YAMLを場所メモへ繰り返さない",
                "children": []
              }
            ]
          },
          {
            "label": "SystemLogsとの役割分担",
            "children": [
              {
                "label": "SystemLogs一覧は静的な確認用ログ",
                "children": []
              },
              {
                "label": "人間が育てる本体はSynapses配下の個別メモ",
                "children": []
              },
              {
                "label": "一覧を唯一の保存場所にしない",
                "children": []
              }
            ]
          },
          {
            "label": "再実行時の人間入力値を守る",
            "children": [
              {
                "label": "Tagのnoteを保持する",
                "children": []
              },
              {
                "label": "Mentionのname・phone・web・noteを保持する",
                "children": []
              },
              {
                "label": "Locationのactivity_id・source_files・noteを保持する",
                "children": []
              },
              {
                "label": "人間が追記した本文を保持する",
                "children": []
              },
              {
                "label": "原本との食い違いは自動上書きせず停止する",
                "children": []
              }
            ]
          },
          {
            "label": "IGCとの接続境界",
            "children": [
              {
                "label": "IGCはカテゴリ固有情報・人間が育てる欄・元投稿リンクを保持する",
                "children": []
              },
              {
                "label": "IGCは意味統合・分離・投稿リンク書換えを行わない",
                "children": []
              },
              {
                "label": "同一カテゴリで同名・同内容だけを完全重複として整理する",
                "children": []
              },
              {
                "label": "同名・異内容では停止する",
                "children": []
              },
              {
                "label": "識別と接続は元メモへのWikiリンクを中心にする",
                "children": []
              }
            ]
          },
          {
            "label": "現行v1.2で具体化が残る領域",
            "children": [
              {
                "label": "融合・分離・取消・復元の具体的なYAML",
                "children": []
              },
              {
                "label": "大きなカード・受け皿・判断履歴・操作履歴",
                "children": []
              },
              {
                "label": "Obsidianプラグインの画面操作と保存処理",
                "children": []
              },
              {
                "label": "分割後設計と現行Memory仕様の対応確認",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "運用・管理・整合性",
        "children": [
          {
            "label": "Timeline生成",
            "children": [
              {
                "label": "対象期間の全投稿を日時昇順で並べる",
                "children": []
              },
              {
                "label": "投稿IDへのWikiリンクとプレビューを出力する",
                "children": []
              },
              {
                "label": "プレビューは改行を除いた先頭30文字",
                "children": []
              },
              {
                "label": "キャプションがない場合は無題とする",
                "children": []
              }
            ]
          },
          {
            "label": "エラーと例外",
            "children": [
              {
                "label": "個別エントリの例外を捕捉して他の正常処理と分ける",
                "children": []
              },
              {
                "label": "ERROR／POST_PROCESSING_ERRORとしてイベントログへ記録する",
                "children": []
              },
              {
                "label": "1件でも技術的処理失敗がある期間を完了扱いにしない",
                "children": []
              },
              {
                "label": "人間判断待ちと技術的処理失敗を分ける",
                "children": []
              }
            ]
          },
          {
            "label": "イベントログ",
            "children": [
              {
                "label": "日付ごとのJSONLへ一行一イベントを記録する",
                "children": []
              },
              {
                "label": "timestamp・action・category・detailsを持つ",
                "children": []
              },
              {
                "label": "Synapse更新・期間完了・処理エラーを追跡する",
                "children": []
              }
            ]
          },
          {
            "label": "冪等性と再実行",
            "children": [
              {
                "label": "投稿メモの存在だけで処理済みにしない",
                "children": []
              },
              {
                "label": "RawData・メディア・Synapse・一覧等との対応を確認する",
                "children": []
              },
              {
                "label": "正しい既存物を保持し不足だけを補う",
                "children": []
              },
              {
                "label": "食い違い時は自動上書きせず停止する",
                "children": []
              },
              {
                "label": "関連成果物確認まで完了した範囲だけ状態管理へ記録する",
                "children": []
              }
            ]
          },
          {
            "label": "設定と実行環境",
            "children": [
              {
                "label": "BASE_DIR・POSTS_JSON_DIR",
                "children": []
              },
              {
                "label": "SRC_MEDIA_DIRS",
                "children": []
              },
              {
                "label": "DEST_VAULT_DIRは工程ごとのoutput_*",
                "children": []
              },
              {
                "label": "LOGS_ROOT・STATE_FILE",
                "children": []
              },
              {
                "label": "IGC本番出力を個別工程の直接出力先にしない",
                "children": []
              }
            ]
          },
          {
            "label": "実データ監査で確認された差分",
            "children": [
              {
                "label": "Feed原本に構造Aのposts.jsonと構造Bのposts_1.jsonが混在する",
                "children": []
              },
              {
                "label": "Reelsはig_reels_mediaを持つ辞書構造",
                "children": []
              },
              {
                "label": "Storiesはig_storiesを持つ辞書構造",
                "children": []
              },
              {
                "label": "JSONのURIと物理メディア配置が完全一致しないものがある",
                "children": []
              },
              {
                "label": "現在の実行フォルダは05_IGP・06_IGR・07_IGS・08_IGX",
                "children": []
              }
            ]
          },
          {
            "label": "共通の完了判定",
            "children": [
              {
                "label": "全入力を生成・明示的除外・技術的失敗へ分類する",
                "children": []
              },
              {
                "label": "投稿メモ・RawData・メディア・Timelineを対応させる",
                "children": []
              },
              {
                "label": "Synapse・一覧・Events・状態管理を対応させる",
                "children": []
              },
              {
                "label": "対象外データと未確認情報を確定成果物へ混ぜない",
                "children": []
              },
              {
                "label": "技術的処理エラー0件と実物対応確認後だけ完了とする",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
};
