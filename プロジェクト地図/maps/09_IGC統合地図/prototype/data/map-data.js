window.PROTOTYPE_MAP = {
  "meta": {
    "id": "igc",
    "title": "09 IGC統合地図",
    "subtitle": "統合・安全更新・上流境界・親完成",
    "mode": "tree",
    "source": "公開参考資料 map-data.js / views.igc",
    "status": "企画検証用の叩き台"
  },
  "root": {
    "label": "09_IGC統合｜IGC統合",
    "note": "クリックして分岐を開く",
    "children": [
      {
        "label": "00_IGC統合目次",
        "children": [
          {
            "label": "01_IGC統合企画書v1.0.md",
            "children": [
              {
                "label": "IGC工程の目的・理由・到達点",
                "children": []
              }
            ]
          },
          {
            "label": "02_IGC統合設計書v1.0.md",
            "children": [
              {
                "label": "IGC工程の構造・責任・境界",
                "children": []
              }
            ]
          },
          {
            "label": "03_IGC統合仕様書",
            "children": [
              {
                "label": "00_仕様書目次",
                "children": [
                  {
                    "label": "01_役割・入力形式.md",
                    "children": []
                  },
                  {
                    "label": "02_統合・出力形式.md",
                    "children": []
                  },
                  {
                    "label": "03_異常処理・検証・安全更新.md",
                    "children": []
                  },
                  {
                    "label": "04_実行結果・コード構成・対象外.md",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "04_IGC統合実行",
            "children": [
              {
                "label": "00_コード構成",
                "children": [
                  {
                    "label": "01_IGC_メイン実行v1_0.py",
                    "children": []
                  },
                  {
                    "label": "02_IGC_入力解析v1_0.py",
                    "children": []
                  },
                  {
                    "label": "03_IGC_データ統合v1_0.py",
                    "children": []
                  },
                  {
                    "label": "04_IGC_品質検証v1_0.py",
                    "children": []
                  },
                  {
                    "label": "05_IGC_安全置換v1_0.py",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "AGENTS.md",
            "children": [
              {
                "label": "IGC工程専用の行動規範と読み込みルーター",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "目的・今回の完了条件",
        "children": [
          {
            "label": "三系統をObsidian投入前に整理",
            "children": [
              {
                "label": "output_IGP・output_IGR・output_IGSを受け取る",
                "children": []
              },
              {
                "label": "Tags・Mentions・Locationsを系統横断で整理する",
                "children": []
              },
              {
                "label": "完全に同じ項目を一件にする",
                "children": []
              },
              {
                "label": "一系統だけにある項目も欠落させない",
                "children": []
              }
            ]
          },
          {
            "label": "本番用output_IGCを生成",
            "children": [
              {
                "label": "Synapseカード三種類を生成する",
                "children": []
              },
              {
                "label": "SystemLogs一覧三種類を生成する",
                "children": []
              },
              {
                "label": "カードと一覧を相互に対応させる",
                "children": []
              },
              {
                "label": "Memory Synapse DBへ安全に引き渡す",
                "children": []
              }
            ]
          },
          {
            "label": "Synapseを育てるための前処理",
            "children": [
              {
                "label": "移行時点の事実と関連投稿を減らさない",
                "children": []
              },
              {
                "label": "将来の意味融合・分離に耐えられる材料を残す",
                "children": []
              },
              {
                "label": "今回の技術的整理と将来の人間判断を混ぜない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "三種類の統合と責任境界",
        "children": [
          {
            "label": "今回IGCが行う統合",
            "children": [
              {
                "label": "同じカテゴリ内だけを比較する",
                "children": []
              },
              {
                "label": "人間向け表記が完全一致した項目だけを一件にする",
                "children": []
              },
              {
                "label": "IGP・IGR・IGS間の重複を整理する",
                "children": []
              },
              {
                "label": "Obsidian投入前に機械的に確定できる範囲",
                "children": []
              }
            ]
          },
          {
            "label": "Memory Synapse DBが行う統合",
            "children": [
              {
                "label": "表記は違うが同じ意味だと人間が判断する融合",
                "children": []
              },
              {
                "label": "Tags・Mentions・Locationsを越えるカテゴリ横断融合",
                "children": []
              },
              {
                "label": "大きなカード・構成員・表示順の決定",
                "children": []
              },
              {
                "label": "共有メモ・分離・判断履歴の操作",
                "children": []
              }
            ]
          },
          {
            "label": "今回先取りしない判断",
            "children": [
              {
                "label": "類似名・別名・座標による自動名寄せ",
                "children": []
              },
              {
                "label": "意味上の同一人物・同一場所・同一概念の確定",
                "children": []
              },
              {
                "label": "融合ID・所有者・融合グループIDの付与",
                "children": []
              },
              {
                "label": "統合プレビューUIと分離・取消UI",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "入力の範囲と相互契約",
        "children": [
          {
            "label": "入力系統",
            "children": [
              {
                "label": "output_IGP/Instagram_Logs",
                "children": []
              },
              {
                "label": "output_IGR/Instagram_Logs",
                "children": []
              },
              {
                "label": "output_IGS/Instagram_Logs",
                "children": []
              },
              {
                "label": "既存output_IGCとoutput_IGXは入力・正解・補完元にしない",
                "children": []
              }
            ]
          },
          {
            "label": "Synapseカード入力",
            "children": [
              {
                "label": "Synapses/Tags",
                "children": []
              },
              {
                "label": "Synapses/Mentions",
                "children": []
              },
              {
                "label": "Synapses/Locations",
                "children": []
              },
              {
                "label": "共通情報と関連投稿を保持する",
                "children": []
              }
            ]
          },
          {
            "label": "SystemLogs入力",
            "children": [
              {
                "label": "ハッシュタグ一覧.md",
                "children": []
              },
              {
                "label": "メンション一覧.md",
                "children": []
              },
              {
                "label": "場所一覧.md",
                "children": []
              },
              {
                "label": "項目・物理リンク先・出現回数・出現投稿を保持する",
                "children": []
              }
            ]
          },
          {
            "label": "カードと一覧の相互照合",
            "children": [
              {
                "label": "人間向け表記集合が一致する",
                "children": []
              },
              {
                "label": "一覧リンクが実カードを指す",
                "children": []
              },
              {
                "label": "関連投稿の件数・値・順序が一致する",
                "children": []
              },
              {
                "label": "出現回数が関連投稿数と一致する",
                "children": []
              },
              {
                "label": "片方だけを正解として推測補完しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "入力形式・完全一致の読み取り",
        "children": [
          {
            "label": "文字の扱い",
            "children": [
              {
                "label": "UTF-8で読み取る",
                "children": []
              },
              {
                "label": "改行だけLFへ統一して比較する",
                "children": []
              },
              {
                "label": "Unicode・空白・大文字小文字・全角半角を正規化しない",
                "children": []
              },
              {
                "label": "デコード不能は異常終了する",
                "children": []
              }
            ]
          },
          {
            "label": "カテゴリごとの人間向け表記",
            "children": [
              {
                "label": "Tags：hashtag_note.hashtag",
                "children": []
              },
              {
                "label": "Mentions：mention_note.mention",
                "children": []
              },
              {
                "label": "Locations：location_note.location",
                "children": []
              },
              {
                "label": "物理ファイル名は統合キーに使わない",
                "children": []
              }
            ]
          },
          {
            "label": "一枚のカード内で一致させる四箇所",
            "children": [
              {
                "label": "Frontmatter aliasesの唯一の値",
                "children": []
              },
              {
                "label": "本文先頭のH1見出し",
                "children": []
              },
              {
                "label": "カテゴリ固有YAMLの値",
                "children": []
              },
              {
                "label": "SystemLogs Wikiリンクの表示名",
                "children": []
              }
            ]
          },
          {
            "label": "関連投稿領域",
            "children": [
              {
                "label": "## 関連投稿を一つだけ置く",
                "children": []
              },
              {
                "label": "見出しより前を共通情報とする",
                "children": []
              },
              {
                "label": "見出しより後は空行と[[投稿ID]]だけ",
                "children": []
              },
              {
                "label": "投稿リンク0件・同一リンク重複は異常",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "完全一致統合の判断手順",
        "children": [
          {
            "label": "統合キー",
            "children": [
              {
                "label": "（カテゴリキー, 人間向け表記）の組",
                "children": []
              },
              {
                "label": "Python文字列の完全一致で比較する",
                "children": []
              },
              {
                "label": "#ABCと#abcは別",
                "children": []
              },
              {
                "label": "#abcと＃abcは別",
                "children": []
              },
              {
                "label": "大阪城と大阪城天守閣は別",
                "children": []
              },
              {
                "label": "同じ表記でもカテゴリが異なれば別",
                "children": []
              }
            ]
          },
          {
            "label": "共通情報の採否",
            "children": [
              {
                "label": "同じ統合キーの共通情報を文字単位で比較",
                "children": []
              },
              {
                "label": "完全一致した場合だけ一組を出力",
                "children": []
              },
              {
                "label": "入力順で最初にあるカードの共通情報を使用",
                "children": []
              },
              {
                "label": "異なる場合は選択・混合せず全処理停止",
                "children": []
              }
            ]
          },
          {
            "label": "関連投稿の加算",
            "children": [
              {
                "label": "IGPカード内の順序",
                "children": []
              },
              {
                "label": "次にIGRカード内の順序",
                "children": []
              },
              {
                "label": "最後にIGSカード内の順序",
                "children": []
              },
              {
                "label": "意味・日時・画像・出来事でまとめない",
                "children": []
              },
              {
                "label": "系統間の完全同一リンクは黙って除去せず異常",
                "children": []
              }
            ]
          },
          {
            "label": "一系統だけのカード",
            "children": [
              {
                "label": "共通情報をそのまま保持",
                "children": []
              },
              {
                "label": "関連投稿をそのまま保持",
                "children": []
              },
              {
                "label": "他系統の情報を推測追加しない",
                "children": []
              },
              {
                "label": "欠損として捨てない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "Synapseカード出力",
        "children": [
          {
            "label": "出力する三カテゴリ",
            "children": [
              {
                "label": "output_IGC/.../Synapses/Tags",
                "children": []
              },
              {
                "label": "output_IGC/.../Synapses/Mentions",
                "children": []
              },
              {
                "label": "output_IGC/.../Synapses/Locations",
                "children": []
              }
            ]
          },
          {
            "label": "カード本文の組立て",
            "children": [
              {
                "label": "一致確認済みの共通情報を一組置く",
                "children": []
              },
              {
                "label": "## 関連投稿を置く",
                "children": []
              },
              {
                "label": "三系統の投稿リンクを順番どおり置く",
                "children": []
              },
              {
                "label": "ファイル末尾はLF一つ",
                "children": []
              }
            ]
          },
          {
            "label": "追加・変更しない情報",
            "children": [
              {
                "label": "synapse_id・UUID",
                "children": []
              },
              {
                "label": "synapse_facets",
                "children": []
              },
              {
                "label": "integration_state・integration_target_id",
                "children": []
              },
              {
                "label": "integration_source_ids・igc_sources",
                "children": []
              },
              {
                "label": "融合ID・融合グループID・所有者",
                "children": []
              },
              {
                "label": "融合・分離・取消・判断履歴の作業台",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "物理ファイル名とmacOS衝突",
        "children": [
          {
            "label": "人間向け表記から基底名を作る",
            "children": [
              {
                "label": "Tagsだけ先頭#または＃を一文字除く",
                "children": []
              },
              {
                "label": "禁止文字 \\ / : * ? \" < > | を_へ置換",
                "children": []
              },
              {
                "label": "CR・LFを空白へ置換",
                "children": []
              },
              {
                "label": "前後空白を除き先頭100文字へ制限",
                "children": []
              },
              {
                "label": "空ならunnamed",
                "children": []
              }
            ]
          },
          {
            "label": "macOS上の衝突判定",
            "children": [
              {
                "label": "カテゴリごとに判定する",
                "children": []
              },
              {
                "label": "基底名をUnicode NFDへ変換",
                "children": []
              },
              {
                "label": "casefoldした値を衝突判定キーにする",
                "children": []
              },
              {
                "label": "異なる表記が衝突した場合は決定的接尾辞を付ける",
                "children": []
              }
            ]
          },
          {
            "label": "接尾辞の意味",
            "children": [
              {
                "label": "カテゴリ性質値と人間向け表記からSHA-256を作る",
                "children": []
              },
              {
                "label": "先頭12桁の小文字16進数を使う",
                "children": []
              },
              {
                "label": "物理保存名の衝突回避だけに使う",
                "children": []
              },
              {
                "label": "Synapse IDや意味融合IDにはしない",
                "children": []
              },
              {
                "label": "接尾辞後も一意でなければ停止",
                "children": []
              }
            ]
          },
          {
            "label": "保存名と表示名の分離",
            "children": [
              {
                "label": "安全名はファイル保存にだけ使う",
                "children": []
              },
              {
                "label": "aliases・H1・カテゴリ固有値は元表記のまま",
                "children": []
              },
              {
                "label": "意味上の同一性を物理名から推測しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "SystemLogs一覧出力",
        "children": [
          {
            "label": "出力する三一覧",
            "children": [
              {
                "label": "ハッシュタグ一覧 - IGC統合",
                "children": []
              },
              {
                "label": "メンション一覧 - IGC統合",
                "children": []
              },
              {
                "label": "場所一覧 - IGC統合",
                "children": []
              }
            ]
          },
          {
            "label": "項目集合",
            "children": [
              {
                "label": "対応カテゴリの出力カードを一件ずつ載せる",
                "children": []
              },
              {
                "label": "三入力一覧を単純連結しない",
                "children": []
              },
              {
                "label": "統合キーごとに一項目を出す",
                "children": []
              },
              {
                "label": "一覧とカードの人間向け表記集合を一致させる",
                "children": []
              }
            ]
          },
          {
            "label": "一項目の内容",
            "children": [
              {
                "label": "初期状態は- [x]",
                "children": []
              },
              {
                "label": "物理リンク先と人間向け表記",
                "children": []
              },
              {
                "label": "出現回数は統合後関連投稿数",
                "children": []
              },
              {
                "label": "出現投稿はカードと同じ値・同じ順番",
                "children": []
              }
            ]
          },
          {
            "label": "安定した並び順",
            "children": [
              {
                "label": "出現回数の降順",
                "children": []
              },
              {
                "label": "同数なら人間向け表記の昇順",
                "children": []
              },
              {
                "label": "順序は意味・優先度・融合候補を表さない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "異常条件と禁止する自動修復",
        "children": [
          {
            "label": "入力・構造の異常",
            "children": [
              {
                "label": "必須ディレクトリ・一覧がない",
                "children": []
              },
              {
                "label": "UTF-8で読めない",
                "children": []
              },
              {
                "label": "必須構造・値・カテゴリが不正",
                "children": []
              },
              {
                "label": "同一系統・同一カテゴリで同じ表記が複数",
                "children": []
              },
              {
                "label": "一覧に- [ ]が存在する",
                "children": []
              }
            ]
          },
          {
            "label": "対応・統合の異常",
            "children": [
              {
                "label": "共通情報が一致しない",
                "children": []
              },
              {
                "label": "カードと一覧が対応しない",
                "children": []
              },
              {
                "label": "投稿リンクが重複する",
                "children": []
              },
              {
                "label": "出力物理名が一意にならない",
                "children": []
              },
              {
                "label": "準備出力の検証に失敗する",
                "children": []
              }
            ]
          },
          {
            "label": "自動修復しない",
            "children": [
              {
                "label": "一系統を正解として選ばない",
                "children": []
              },
              {
                "label": "空欄・追記・カテゴリ固有情報を上書きしない",
                "children": []
              },
              {
                "label": "一覧だけから不足カードを生成しない",
                "children": []
              },
              {
                "label": "カードだけの項目を黙って削らない",
                "children": []
              },
              {
                "label": "関連投稿を推測追加・削除・重複除去しない",
                "children": []
              },
              {
                "label": "表記やカテゴリを変更して続行しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "実行コードの役割",
        "children": [
          {
            "label": "01 メイン実行",
            "children": [
              {
                "label": "実行条件の確認",
                "children": []
              },
              {
                "label": "各処理の順序制御",
                "children": []
              },
              {
                "label": "完了・異常終了の管理",
                "children": []
              }
            ]
          },
          {
            "label": "02 入力解析",
            "children": [
              {
                "label": "三系統の読み込み",
                "children": []
              },
              {
                "label": "カードと一覧の解析",
                "children": []
              },
              {
                "label": "入力契約の照合",
                "children": []
              }
            ]
          },
          {
            "label": "03 データ統合",
            "children": [
              {
                "label": "完全一致統合",
                "children": []
              },
              {
                "label": "投稿加算・物理名決定",
                "children": []
              },
              {
                "label": "カードと一覧の生成",
                "children": []
              }
            ]
          },
          {
            "label": "04 品質検証",
            "children": [
              {
                "label": "入力検証",
                "children": []
              },
              {
                "label": "準備出力検証",
                "children": []
              },
              {
                "label": "対象外保護",
                "children": []
              }
            ]
          },
          {
            "label": "05 安全置換",
            "children": [
              {
                "label": "六出力のバックアップ",
                "children": []
              },
              {
                "label": "置換",
                "children": []
              },
              {
                "label": "失敗時復元",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "変更しない範囲・次工程への判断材料",
        "children": [
          {
            "label": "上流と対象外を守る",
            "children": [
              {
                "label": "IGP・IGR・IGSのコードと成果物を変更しない",
                "children": []
              },
              {
                "label": "Posts・Reels・Storiesを作成・変更しない",
                "children": []
              },
              {
                "label": "media・Timeline・RawDataを変更しない",
                "children": []
              },
              {
                "label": "実際のObsidian VaultとiCloudで直接処理しない",
                "children": []
              },
              {
                "label": "output_IGXを対象にしない",
                "children": []
              }
            ]
          },
          {
            "label": "IGC完了時に確認できること",
            "children": [
              {
                "label": "三カテゴリの完全一致整理が成立",
                "children": []
              },
              {
                "label": "一系統だけの情報も保持",
                "children": []
              },
              {
                "label": "カードと一覧が対応",
                "children": []
              },
              {
                "label": "異なる表記・カテゴリは自動融合されない",
                "children": []
              },
              {
                "label": "対象外成果物が変更されていない",
                "children": []
              }
            ]
          },
          {
            "label": "10で人間が判断すること",
            "children": [
              {
                "label": "異なる表記を同じ知識として融合するか",
                "children": []
              },
              {
                "label": "カテゴリを越えて融合するか",
                "children": []
              },
              {
                "label": "どのカードを大きなカードにするか",
                "children": []
              },
              {
                "label": "意味・記憶・補正情報をどう育てるか",
                "children": []
              },
              {
                "label": "誤った融合をどの単位で分離・取消するか",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
};
