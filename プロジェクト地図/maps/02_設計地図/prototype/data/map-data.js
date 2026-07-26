window.PROTOTYPE_MAP = {
  "meta": {
    "id": "design",
    "title": "02 設計地図",
    "subtitle": "企画条件から構造・責任・境界への変換",
    "mode": "tree",
    "source": "公開参考資料 map-data.js / views.design",
    "status": "企画検証用の叩き台"
  },
  "root": {
    "label": "02_IG移行設計書｜第二の脳を成立させる全体設計",
    "note": "クリックして分岐を開く",
    "children": [
      {
        "label": "00_設計書目次",
        "children": [
          {
            "label": "01_設計目的・対象範囲・基本原則.md",
            "children": []
          },
          {
            "label": "02_システム全体構成・責任境界.md",
            "children": []
          },
          {
            "label": "03_データ構造・原本保持設計.md",
            "children": []
          },
          {
            "label": "04_データ取得・変換・出力設計.md",
            "children": []
          },
          {
            "label": "05_リンク・意味ネットワーク設計.md",
            "children": []
          },
          {
            "label": "06_検証・運用・保全・拡張設計.md",
            "children": []
          }
        ]
      },
      {
        "label": "設計目的・対象範囲・基本原則",
        "children": [
          {
            "label": "設計が実現するもの",
            "children": [
              {
                "label": "Instagram原本をObsidianで利用できる知識構造へ変換する",
                "children": []
              },
              {
                "label": "企画の目的をシステム構造・役割・関係・運用へ変換する",
                "children": []
              },
              {
                "label": "後続の第二の脳構想を親の完成条件にしない",
                "children": []
              }
            ]
          },
          {
            "label": "現在の設計対象",
            "children": [
              {
                "label": "Feed・Reel・Storyの原本から知識構造を生成する",
                "children": []
              },
              {
                "label": "完成済みのIGP・IGR・IGSを凍結してIGCへ渡す",
                "children": []
              },
              {
                "label": "IGC・最終パッケージ・最終完成検証を完結させる",
                "children": []
              }
            ]
          },
          {
            "label": "現在の対象外と将来境界",
            "children": [
              {
                "label": "Memory Synapse DB工程内部の完成を親の条件から外す",
                "children": []
              },
              {
                "label": "IGXは現在の完走範囲とIGC入力から外す",
                "children": []
              },
              {
                "label": "将来情報源の取込を現在の完成条件にしない",
                "children": []
              },
              {
                "label": "AIによる意味の自動確定を現在の責任にしない",
                "children": []
              },
              {
                "label": "未確定候補を置く常設作業台を現在は設けない",
                "children": []
              }
            ]
          },
          {
            "label": "人間中心の設計",
            "children": [
              {
                "label": "オーナーが理解・判断・運用できる",
                "children": []
              },
              {
                "label": "結果・エラー・判断待ち・未確認を人間が区別できる",
                "children": []
              },
              {
                "label": "AIの提案を承認前に確定事項へしない",
                "children": []
              }
            ]
          },
          {
            "label": "守る設計原則",
            "children": [
              {
                "label": "単一責任",
                "children": []
              },
              {
                "label": "レイヤー分離",
                "children": []
              },
              {
                "label": "原本を不変に保つ",
                "children": []
              },
              {
                "label": "人間判断を優先する",
                "children": []
              },
              {
                "label": "主データと監査データを分ける",
                "children": []
              },
              {
                "label": "観測事実と意味情報を分ける",
                "children": []
              },
              {
                "label": "将来機能で現在の完了範囲を増やさない",
                "children": []
              }
            ]
          },
          {
            "label": "文書間の責任",
            "children": [
              {
                "label": "企画書から目的・理念・対象範囲を受け取る",
                "children": []
              },
              {
                "label": "構造・責任境界・禁止事項・成立条件を仕様書へ渡す",
                "children": []
              },
              {
                "label": "コードと成果物で設計が実データ上成立するか検証する",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "システム全体構成・責任境界",
        "children": [
          {
            "label": "責任の流れ",
            "children": [
              {
                "label": "原本を保持する",
                "children": []
              },
              {
                "label": "原本から派生データを生成する",
                "children": []
              },
              {
                "label": "工程ごとの出力を隔離して検証する",
                "children": []
              },
              {
                "label": "IGCで初期Synapse DBを組み立てる",
                "children": []
              },
              {
                "label": "人間がObsidian上で意味判断する",
                "children": []
              },
              {
                "label": "確定した知識構造をAIが利用する",
                "children": []
              }
            ]
          },
          {
            "label": "独立した移行工程",
            "children": [
              {
                "label": "IGP：Feedの実用上完成済み成果物を凍結する",
                "children": []
              },
              {
                "label": "IGR：Reelの実用上完成済み成果物を凍結する",
                "children": []
              },
              {
                "label": "IGS：Storyの実用上完成済み成果物を凍結する",
                "children": []
              },
              {
                "label": "後工程の都合で変更を逆流させない",
                "children": []
              },
              {
                "label": "IGXは将来の独立工程候補として分ける",
                "children": []
              }
            ]
          },
          {
            "label": "IGCの責任",
            "children": [
              {
                "label": "IGP・IGR・IGSの3系統だけを入力とする",
                "children": []
              },
              {
                "label": "カテゴリと完全同一表記を単位に整理する",
                "children": []
              },
              {
                "label": "出どころ・関連投稿・SystemLogsとの対応を保持する",
                "children": []
              },
              {
                "label": "意味融合・表記揺れ統合・カテゴリ横断融合を行わない",
                "children": []
              },
              {
                "label": "不一致を推測で上書きまたは自動修復しない",
                "children": []
              },
              {
                "label": "まずIGC側だけで問題を解決する",
                "children": []
              }
            ]
          },
          {
            "label": "Memory Synapse DBの責任",
            "children": [
              {
                "label": "親の成果物を利用する独立した後続プロジェクト",
                "children": []
              },
              {
                "label": "ブラウザー環境で操作設計を安全に確認する",
                "children": []
              },
              {
                "label": "Obsidianプラグインを人間判断の最終操作入口にする",
                "children": []
              },
              {
                "label": "融合・分離・大きなカード変更・手書き・取消・復旧を扱う",
                "children": []
              },
              {
                "label": "抽出工程で欠落した事実や意味を推測補完しない",
                "children": []
              }
            ]
          },
          {
            "label": "人間とAIの責任",
            "children": [
              {
                "label": "人間：採否・名寄せ・意味統合・分離・代表名を判断する",
                "children": []
              },
              {
                "label": "AI：検索・要約・分析・推論・提案・開発を支援する",
                "children": []
              },
              {
                "label": "AIは原本の事実・意味・設計変更を単独で確定しない",
                "children": []
              }
            ]
          },
          {
            "label": "知識基盤への反映境界",
            "children": [
              {
                "label": "未検証成果物を利用中データへ自動反映しない",
                "children": []
              },
              {
                "label": "IGCの情報統合と実Vaultへの正式投入を分ける",
                "children": []
              },
              {
                "label": "部分的なObsidian確認を工程全体の完成にしない",
                "children": []
              },
              {
                "label": "オーナーが実物と検証結果を確認して反映を判断する",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "データ構造・原本保持",
        "children": [
          {
            "label": "一つの投稿を記録単位にする",
            "children": [
              {
                "label": "本文・日時・メディア・関係情報を投稿へ結び付ける",
                "children": []
              },
              {
                "label": "別ファイルへ保存しても所属投稿を追跡できる",
                "children": []
              },
              {
                "label": "派生情報から元投稿と原本へ戻れる",
                "children": []
              }
            ]
          },
          {
            "label": "情報の種類を分ける",
            "children": [
              {
                "label": "原本：InstagramのJSONとメディア",
                "children": []
              },
              {
                "label": "監査情報：主データと照合する重複・別形式原本",
                "children": []
              },
              {
                "label": "派生情報：投稿メモ・メタデータ・一覧・関係情報",
                "children": []
              },
              {
                "label": "意味情報：人間の判断・意味付け・融合・分離・メモ",
                "children": []
              }
            ]
          },
          {
            "label": "Synapseの成長段階を分ける",
            "children": [
              {
                "label": "抽出事実・観測事実",
                "children": []
              },
              {
                "label": "カテゴリ固有情報と関連投稿を持つ個別Synapseカード",
                "children": []
              },
              {
                "label": "IGCが完全一致整理した初期Synapse DB",
                "children": []
              },
              {
                "label": "人間の意味判断によって成長したSynapse",
                "children": []
              }
            ]
          },
          {
            "label": "識別と追跡",
            "children": [
              {
                "label": "投稿・位置観測等は個別状態と履歴を追跡する",
                "children": []
              },
              {
                "label": "表示名やファイル名が変わっても元情報へ戻れる",
                "children": []
              },
              {
                "label": "IGCの完全一致整理に意味融合用IDを持ち込まない",
                "children": []
              },
              {
                "label": "Memory Synapse DBは個別カードへのWikiリンクを中心にする",
                "children": []
              }
            ]
          },
          {
            "label": "日時・メディア・本文を保全する",
            "children": [
              {
                "label": "投稿時刻・作成時刻・更新時刻を混同しない",
                "children": []
              },
              {
                "label": "同時刻の複数記録でも順序と個別性を失わない",
                "children": []
              },
              {
                "label": "画像・動画と元投稿・原本の対応を維持する",
                "children": []
              },
              {
                "label": "異なる複数本文を自動で一つに決めない",
                "children": []
              }
            ]
          },
          {
            "label": "関係情報を観測事実として保持する",
            "children": [
              {
                "label": "ハッシュタグ：大文字小文字・記号を含む元表記",
                "children": []
              },
              {
                "label": "メンション：@表記と実在アカウントの確認を分ける",
                "children": []
              },
              {
                "label": "位置情報：一投稿の一チェックインを一観測として保持する",
                "children": []
              },
              {
                "label": "同名・近い座標・同一投稿内共起だけで意味統合しない",
                "children": []
              }
            ]
          },
          {
            "label": "自動処理が変更できる範囲",
            "children": [
              {
                "label": "原本から再生成できる派生情報を作る",
                "children": []
              },
              {
                "label": "許可された不足修復だけを行う",
                "children": []
              },
              {
                "label": "原本・人間の追記・確定した意味判断を上書きしない",
                "children": []
              },
              {
                "label": "将来情報源を追加しても既存情報を作り直さない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "データ取得・変換・出力",
        "children": [
          {
            "label": "入力と原本保持",
            "children": [
              {
                "label": "Instagramから取得した原本を基準とする",
                "children": []
              },
              {
                "label": "展開・コピー・解析しても元JSONとメディアを変更しない",
                "children": []
              },
              {
                "label": "使用した原本と主データ・監査データの区別を追跡する",
                "children": []
              }
            ]
          },
          {
            "label": "抽出と変換",
            "children": [
              {
                "label": "本文・日時・メディア・タグ・メンション・位置情報を抽出する",
                "children": []
              },
              {
                "label": "元投稿・元データ・元表記へ戻れる派生情報を作る",
                "children": []
              },
              {
                "label": "人物・場所・表記の意味や同一性を自動確定しない",
                "children": []
              },
              {
                "label": "後工程が欠落事実を推測し直す前提にしない",
                "children": []
              }
            ]
          },
          {
            "label": "工程ごとの成果物",
            "children": [
              {
                "label": "投稿として確認する情報",
                "children": []
              },
              {
                "label": "RawData等の原本へ戻る情報",
                "children": []
              },
              {
                "label": "参照する画像・動画",
                "children": []
              },
              {
                "label": "Timelineと関係情報",
                "children": []
              },
              {
                "label": "カテゴリ固有情報と関連投稿を持つ個別Synapseカード",
                "children": []
              }
            ]
          },
          {
            "label": "Storyとハイライトを分ける",
            "children": [
              {
                "label": "Story本文・日時・メディア・RawDataの移行を進める",
                "children": []
              },
              {
                "label": "ハイライトへの直接所属復元は別の検証対象にする",
                "children": []
              },
              {
                "label": "直接根拠なしに意味や時刻の近さで自動所属させない",
                "children": []
              }
            ]
          },
          {
            "label": "欠損・未知形式・処理失敗を残す",
            "children": [
              {
                "label": "分類不能・孤立メディアを理由なく捨てない",
                "children": []
              },
              {
                "label": "扱えないことと原本に存在しないことを分ける",
                "children": []
              },
              {
                "label": "技術的処理失敗と人間判断待ちを分ける",
                "children": []
              },
              {
                "label": "失敗範囲を成功として続行しない",
                "children": []
              }
            ]
          },
          {
            "label": "再実行と不足修復",
            "children": [
              {
                "label": "正しい既存成果物と人間の追記を保持する",
                "children": []
              },
              {
                "label": "不足する関連成果物だけを修復する",
                "children": []
              },
              {
                "label": "元データとの競合を自動上書きしない",
                "children": []
              },
              {
                "label": "修復後にTimeline等の全体索引を再確認する",
                "children": []
              }
            ]
          },
          {
            "label": "再現性と監査",
            "children": [
              {
                "label": "原本・設計仕様の版・コード・設定・実行結果を照合できる",
                "children": []
              },
              {
                "label": "成功表示や出力件数だけで完成としない",
                "children": []
              },
              {
                "label": "元ファイルと成果物の直接照合を根拠にする",
                "children": []
              },
              {
                "label": "役割を終えた補助ツールへ再依存しない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "リンク・意味ネットワーク",
        "children": [
          {
            "label": "リンクで結ぶ対象",
            "children": [
              {
                "label": "投稿と元データ・メディア",
                "children": []
              },
              {
                "label": "Timelineによる時系列",
                "children": []
              },
              {
                "label": "ハッシュタグ",
                "children": []
              },
              {
                "label": "メンション",
                "children": []
              },
              {
                "label": "位置情報",
                "children": []
              },
              {
                "label": "Synapse",
                "children": []
              }
            ]
          },
          {
            "label": "観測事実と意味判断を分ける",
            "children": [
              {
                "label": "抽出した関係を元投稿へ戻れる形で保持する",
                "children": []
              },
              {
                "label": "同名・同表記は探索の手がかりとして扱う",
                "children": []
              },
              {
                "label": "同一投稿内の共起だけで意味関係を作らない",
                "children": []
              },
              {
                "label": "意味・同一性・採否は人間が判断する",
                "children": []
              }
            ]
          },
          {
            "label": "Synapseを段階的に育てる",
            "children": [
              {
                "label": "個別Synapseカードを工程成果物として完成させる",
                "children": []
              },
              {
                "label": "IGCが初期Synapse DBを組み立てる",
                "children": []
              },
              {
                "label": "人間がWikiリンク型の成長したSynapseへ育てる",
                "children": []
              }
            ]
          },
          {
            "label": "三種類の整理・融合",
            "children": [
              {
                "label": "IGC：入力系統間の完全一致整理",
                "children": []
              },
              {
                "label": "Memory Synapse DB：同一カテゴリ内の意味融合",
                "children": []
              },
              {
                "label": "Memory Synapse DB：カテゴリ横断融合",
                "children": []
              },
              {
                "label": "完全一致整理と人間の意味融合を混同しない",
                "children": []
              }
            ]
          },
          {
            "label": "大きなカードと受け皿",
            "children": [
              {
                "label": "融合用の新しい管理カードを自動生成しない",
                "children": []
              },
              {
                "label": "人間が選んだ既存カードを大きなカードとして育てる",
                "children": []
              },
              {
                "label": "受け皿で全個別カードと固有情報を確認できる",
                "children": []
              },
              {
                "label": "大きなカード同士は入れ子にせず平坦化する",
                "children": []
              }
            ]
          },
          {
            "label": "通常表示と手書き表示",
            "children": [
              {
                "label": "通常表示：選ばれた個別カードを上部へ表示する",
                "children": []
              },
              {
                "label": "手書き表示：人間の意味情報を大きなカードへ保持する",
                "children": []
              },
              {
                "label": "表示の短縮で個別カードの元情報を変更しない",
                "children": []
              },
              {
                "label": "手書き情報の保持先をシステムが推測分配しない",
                "children": []
              }
            ]
          },
          {
            "label": "可逆性と変更追従",
            "children": [
              {
                "label": "誤って融合した一枚だけを分離できる",
                "children": []
              },
              {
                "label": "大きなカードの交代・融合解体でも情報を失わない",
                "children": []
              },
              {
                "label": "一つの個別カードを複数の大きなカードへ重複融合しない",
                "children": []
              },
              {
                "label": "Wikiリンクの改名・移動・未解決を検出できる",
                "children": []
              },
              {
                "label": "自動クラスタリングや自動意味確定を現在の完成条件にしない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "検証・運用・保全・拡張",
        "children": [
          {
            "label": "オーナーが確認できる状態",
            "children": [
              {
                "label": "処理対象・生成件数・欠落・エラーを確認できる",
                "children": []
              },
              {
                "label": "判断待ち・再実行結果・未確認範囲を区別できる",
                "children": []
              },
              {
                "label": "コード内部や元JSON全体の読解を完成判断の前提にしない",
                "children": []
              }
            ]
          },
          {
            "label": "技術的完成と人間判断待ちを分ける",
            "children": [
              {
                "label": "IGP・IGR・IGS：実物検証済みで実用上完成",
                "children": []
              },
              {
                "label": "技術的完成：原本と成果物が対応し処理失敗が残らない",
                "children": []
              },
              {
                "label": "人間判断待ち：意味・採否・融合・分離が未確定",
                "children": []
              },
              {
                "label": "判断待ちだけで技術移行を失敗にしない",
                "children": []
              },
              {
                "label": "欠落や処理失敗を判断待ちとして隠さない",
                "children": []
              }
            ]
          },
          {
            "label": "実物で整合性を確認する",
            "children": [
              {
                "label": "原本と投稿・RawData・メディアの対応",
                "children": []
              },
              {
                "label": "Timeline・タグ・メンション・位置観測の対応",
                "children": []
              },
              {
                "label": "IGP・IGR・IGSとIGC出力の対応",
                "children": []
              },
              {
                "label": "最終パッケージの必要成果物と不要ファイルを確認する",
                "children": []
              },
              {
                "label": "Memory Synapse DBの検証は独立して判定する",
                "children": []
              }
            ]
          },
          {
            "label": "段階的に確認する",
            "children": [
              {
                "label": "各データ種別を他工程と利用中データから分けて検証する",
                "children": []
              },
              {
                "label": "一部のObsidian投入と全体完成を区別する",
                "children": []
              },
              {
                "label": "ブラウザーで操作設計を確認してから仕様へ渡す",
                "children": []
              },
              {
                "label": "ObsidianプラグインとMarkdown実物で再確認する",
                "children": []
              }
            ]
          },
          {
            "label": "再実行・修復・復旧",
            "children": [
              {
                "label": "正しい既存状態を失わず不足を補修する",
                "children": []
              },
              {
                "label": "途中失敗を一部成功として確定しない",
                "children": []
              },
              {
                "label": "融合・分離・手書き変更を操作単位で戻せる",
                "children": []
              },
              {
                "label": "成功表示ではなく実物を再確認する",
                "children": []
              }
            ]
          },
          {
            "label": "完成表示を鵜呑みにしない",
            "children": [
              {
                "label": "状態ファイルの完了表示だけでは完成しない",
                "children": []
              },
              {
                "label": "コードの成功表示だけでは完成しない",
                "children": []
              },
              {
                "label": "想定件数や一部ノートの表示だけでは完成しない",
                "children": []
              },
              {
                "label": "実物照合済みのIGP・IGR・IGSを未完成へ戻さない",
                "children": []
              }
            ]
          },
          {
            "label": "変更と記録を保全する",
            "children": [
              {
                "label": "未確認の発見と仮説は03で管理する",
                "children": []
              },
              {
                "label": "承認済み変更は現役設計本文へ統合する",
                "children": []
              },
              {
                "label": "無関係な原本・成果物・人間の追記を変更しない",
                "children": []
              },
              {
                "label": "完成済み工程は4つの例外条件以外で変更しない",
                "children": []
              }
            ]
          },
          {
            "label": "現在と将来の境界",
            "children": [
              {
                "label": "現在：IGC・最終パッケージ・最終完成検証",
                "children": []
              },
              {
                "label": "独立後続：Memory Synapse DBの融合・分離・手書き・復旧",
                "children": []
              },
              {
                "label": "将来：IGX・将来情報源・AIによる意味の自動確定",
                "children": []
              },
              {
                "label": "将来拡張で既存の原本と確認済み成果物を壊さない",
                "children": []
              }
            ]
          }
        ]
      }
    ]
  }
};
