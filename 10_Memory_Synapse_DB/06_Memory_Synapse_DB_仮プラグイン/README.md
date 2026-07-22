# Memory Synapse DB 仮プラグイン

> [!warning] 技術検証用・読み取り専用
> このフォルダーは、Obsidianモデレーター等へ実物を示して意見を求めるための叩き台である。日常利用向けの完成版ではない。

## フォルダー構成

```text
memory-synapse-db/
├── main.js
├── manifest.json
└── styles.css
```

`memory-synapse-db`をフォルダーごと、専用検証Vaultの`.obsidian/plugins/`へ配置する。

## 元コード

このプラグインは、`../04_Memory_Synapse_DB_実行コード/`の日本語5分割TypeScriptから生成する。`main.js`だけを直接編集しない。

## 現在できること

- 対象ルート内のTag、Mention、Locationカードを読み取る
- 対象カード内のWikiリンク数を数える
- 読取時間とメモリ概算を表示する
- カード例から元のMarkdownを開く

## 現在できないこと

- 融合・分離・大きなカード変更
- 手書き情報のMarkdown保存
- 操作履歴の保存と取消
- 外部AIや外部ネットワークとの通信
