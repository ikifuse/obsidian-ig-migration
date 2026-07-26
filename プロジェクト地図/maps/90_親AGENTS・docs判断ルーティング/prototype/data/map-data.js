window.PROTOTYPE_MAP = {
  "meta": {
    "id": "rules-routing",
    "title": "親AGENTS・docs 判断ルーティング",
    "subtitle": "作業内容から読む文書、承認、停止点へ進む",
    "mode": "routing",
    "source": "公開参考資料 views.rules・views.docs ＋ 現役AGENTS読み込みルーター",
    "status": "企画検証用の叩き台"
  },
  "root": {
    "label": "作業を始める",
    "note": "何をするかを選ぶ",
    "children": [
      {
        "label": "作業種類から読む文書を選ぶ",
        "children": [
          {
            "label": "全般の構造確認",
            "children": [
              {
                "label": "00_目次.md",
                "children": []
              },
              {
                "label": "該当ディレクトリの00_案内",
                "children": []
              }
            ]
          },
          {
            "label": "企画",
            "children": [
              {
                "label": "docs/planning-workflow.md",
                "children": []
              },
              {
                "label": "01_IG移行企画書v1.0.md",
                "children": []
              },
              {
                "label": "確認後に停止",
                "children": []
              }
            ]
          },
          {
            "label": "設計",
            "children": [
              {
                "label": "docs/design-workflow.md",
                "children": []
              },
              {
                "label": "02_IG移行設計書/00_設計書目次.md",
                "children": []
              },
              {
                "label": "必要な現役分冊",
                "children": []
              },
              {
                "label": "承認まで停止",
                "children": []
              }
            ]
          },
          {
            "label": "仕様",
            "children": [
              {
                "label": "docs/specification-workflow.md",
                "children": []
              },
              {
                "label": "04_IG移行仕様書/00_仕様書目次.md",
                "children": []
              },
              {
                "label": "対象仕様と対応設計",
                "children": []
              },
              {
                "label": "承認まで停止",
                "children": []
              }
            ]
          },
          {
            "label": "実装・成果物検証",
            "children": [
              {
                "label": "docs/implementation-workflow.md",
                "children": []
              },
              {
                "label": "対象の00_コード構成.md",
                "children": []
              },
              {
                "label": "対象仕様・コード・成果物",
                "children": []
              },
              {
                "label": "範囲外変更は停止",
                "children": []
              }
            ]
          },
          {
            "label": "文書の配置・退役",
            "children": [
              {
                "label": "docs/document-governance.md",
                "children": []
              },
              {
                "label": "対象資料と配置根拠",
                "children": []
              },
              {
                "label": "移動・削除は別承認",
                "children": []
              }
            ]
          },
          {
            "label": "恒久ルールの変更",
            "children": [
              {
                "label": "docs/rule-addition-criteria.md",
                "children": []
              },
              {
                "label": "docs/information-architecture.md",
                "children": []
              },
              {
                "label": "根拠と影響を確認",
                "children": []
              }
            ]
          },
          {
            "label": "09 IGC統合",
            "children": [
              {
                "label": "09_IGC統合/AGENTS.mdを追加適用",
                "children": []
              },
              {
                "label": "IGC側だけの解決を先に検証",
                "children": []
              }
            ]
          },
          {
            "label": "10 Memory Synapse DB",
            "children": [
              {
                "label": "10_Memory_Synapse_DB/AGENTS.mdを追加適用",
                "children": []
              },
              {
                "label": "親完成条件へ戻さない",
                "children": []
              }
            ]
          }
        ]
      },
      {
        "label": "全工程で守る判断原則",
        "children": [
          {
            "label": "判断の土台（AGENTS.md）",
            "children": [
              {
                "label": "何を基準に判断するか",
                "children": [
                  {
                    "label": "01企画書を目的・理由・到達点の最上位条件とする",
                    "children": []
                  },
                  {
                    "label": "企画・設計・仕様・実装・成果物検証を混ぜない",
                    "children": []
                  },
                  {
                    "label": "事実・仮定・提案・未確認事項を区別する",
                    "children": []
                  },
                  {
                    "label": "成立している部分を維持し、承認済みの最小差分を優先する",
                    "children": []
                  }
                ]
              },
              {
                "label": "作業を始める前に決めること",
                "children": [
                  {
                    "label": "今回の対象",
                    "children": []
                  },
                  {
                    "label": "行う操作",
                    "children": []
                  },
                  {
                    "label": "停止する地点",
                    "children": []
                  },
                  {
                    "label": "変更しない範囲",
                    "children": []
                  }
                ]
              },
              {
                "label": "許可を拡大しない",
                "children": [
                  {
                    "label": "閲覧許可は変更許可ではない",
                    "children": []
                  },
                  {
                    "label": "前工程の承認は後工程の変更許可ではない",
                    "children": []
                  },
                  {
                    "label": "README・Issue・Git操作は明示指示時だけ行う",
                    "children": []
                  }
                ]
              },
              {
                "label": "データと既存成果を守る",
                "children": [
                  {
                    "label": "macOS・ローカル作業を前提とする",
                    "children": []
                  },
                  {
                    "label": "原本と既存成果物を壊さない",
                    "children": []
                  },
                  {
                    "label": "個人情報を公開Git管理しない",
                    "children": []
                  },
                  {
                    "label": "既存変更と今回の変更を分ける",
                    "children": []
                  }
                ]
              },
              {
                "label": "読み込みルーター：該当するdocsへの入口",
                "children": [
                  {
                    "label": "現在の工程を特定する",
                    "children": []
                  },
                  {
                    "label": "その工程のworkflowを読む",
                    "children": []
                  },
                  {
                    "label": "本文正本は必要な範囲だけ読む",
                    "children": []
                  },
                  {
                    "label": "配置・退役時はdocument-governanceへ進む",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "止まる・戻る・承認する",
            "children": [
              {
                "label": "進む流れ",
                "children": [
                  {
                    "label": "企画 → 設計",
                    "children": []
                  },
                  {
                    "label": "設計 → 仕様",
                    "children": []
                  },
                  {
                    "label": "仕様 → 実装",
                    "children": []
                  },
                  {
                    "label": "実装 → 成果物検証",
                    "children": []
                  }
                ]
              },
              {
                "label": "戻る流れ",
                "children": [
                  {
                    "label": "仕様で設計問題を発見 → 仕様化を止めて設計へ戻る",
                    "children": []
                  },
                  {
                    "label": "設計で企画の不成立を発見 → 代替案を比較して企画へ戻る",
                    "children": []
                  },
                  {
                    "label": "後工程の都合で上位文書を自動変更しない",
                    "children": []
                  }
                ]
              },
              {
                "label": "不一致を見つけたとき",
                "children": [
                  {
                    "label": "維持",
                    "children": []
                  },
                  {
                    "label": "微調整",
                    "children": []
                  },
                  {
                    "label": "設計変更候補",
                    "children": []
                  },
                  {
                    "label": "実装不具合",
                    "children": []
                  },
                  {
                    "label": "未確認",
                    "children": []
                  }
                ]
              },
              {
                "label": "承認の停止線",
                "children": [
                  {
                    "label": "変更結果と未変更範囲を報告する",
                    "children": []
                  },
                  {
                    "label": "オーナーが確認するまで次工程へ進まない",
                    "children": []
                  },
                  {
                    "label": "承認は指定された対象と工程にだけ適用する",
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "label": "工程の進め方と文書保全",
        "children": [
          {
            "label": "工程別の進め方",
            "children": [
              {
                "label": "企画工程",
                "children": [
                  {
                    "label": "目的・理由・対象範囲・到達点を扱う",
                    "children": []
                  },
                  {
                    "label": "設計へ渡す前にオーナー確認で止まる",
                    "children": []
                  }
                ]
              },
              {
                "label": "設計工程",
                "children": [
                  {
                    "label": "承認済み企画を固定条件として受け取る",
                    "children": []
                  },
                  {
                    "label": "仕様へ渡す前にオーナー確認で止まる",
                    "children": []
                  }
                ]
              },
              {
                "label": "仕様工程",
                "children": [
                  {
                    "label": "確認済み設計を開始条件とする",
                    "children": []
                  },
                  {
                    "label": "実装へ渡す前にオーナー確認で止まる",
                    "children": []
                  }
                ]
              },
              {
                "label": "実装・成果物検証",
                "children": [
                  {
                    "label": "対象仕様書を基準にする",
                    "children": []
                  },
                  {
                    "label": "コード変更と成果物再生成は別に承認を得る",
                    "children": []
                  }
                ]
              }
            ]
          },
          {
            "label": "文書とルールを保全する",
            "children": [
              {
                "label": "文書・資料をどこへ置くか",
                "children": [
                  {
                    "label": "未完了の調査・未確定判断・現役引継ぎは03",
                    "children": []
                  },
                  {
                    "label": "再利用する補助ツールはtools",
                    "children": []
                  },
                  {
                    "label": "役割を終えた資料は99",
                    "children": []
                  }
                ]
              },
              {
                "label": "文書を退役するとき",
                "children": [
                  {
                    "label": "対象・理由・影響を確認",
                    "children": []
                  },
                  {
                    "label": "原則として削除せず99へ移す",
                    "children": []
                  }
                ]
              },
              {
                "label": "恒久ルールを追加・修正するとき",
                "children": [
                  {
                    "label": "既存ルールとの重複を確認",
                    "children": []
                  },
                  {
                    "label": "一時的な進捗を恒久化しない",
                    "children": []
                  },
                  {
                    "label": "承認後に反映する",
                    "children": []
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};
