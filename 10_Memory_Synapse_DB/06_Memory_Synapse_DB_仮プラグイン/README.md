# Memory Synapse DB 読み取り専用06 導入・確認説明書

## この06は何か

06は、承認済みの画面と操作をObsidianの実Vault形式で確かめるための**読み取り専用技術検証版**です。正式プラグイン08ではありません。

Markdownの作成・変更・移動・削除、融合結果・手書き情報・操作履歴の保存、外部通信は行いません。最初は日常利用Vaultではなく、[05のサンプルVault](../05_Memory_Synapse_DB_サンプル検証キット/サンプルVault/)を複製して確認してください。

## 根拠と再生成方法

- [人が読めるTypeScript元コード](../04_Memory_Synapse_DB_実行コード/TypeScript元コード/04_画面/Obsidian画面.ts)
- [04のコード構成](../04_Memory_Synapse_DB_実行コード/00_実行コード目次.md)
- [ビルド・検証方法](../04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md)
- [05のブラウザー確認操作説明書](../05_Memory_Synapse_DB_サンプル検証キット/ブラウザー確認操作説明書.md)

`memory-synapse-db/main.js`はTypeScriptから自動生成・圧縮した実行ファイルです。生成物だけを直接修正せず、04を変更して再生成します。

## Obsidianへ配置する三ファイル

```text
<複製した確認用Vault>/
└── .obsidian/plugins/memory-synapse-db/
    ├── main.js
    ├── manifest.json
    └── styles.css
```

[実行用フォルダー](memory-synapse-db/)を丸ごと、複製した確認用Vaultの`.obsidian/plugins/`へコピーします。

## 導入手順

1. 05の`サンプルVault`をFinderで複製する。
2. 複製側で`Command`＋`Shift`＋`.`を押し、`.obsidian`を表示する。
3. `.obsidian/plugins/memory-synapse-db/`へ三ファイルを配置する。
4. Obsidianで複製したVaultを開く。
5. `設定`→`コミュニティプラグイン`で`Memory Synapse DB`を有効にする。
6. 左端のネットワークアイコン、またはコマンドパレットの`読み取り専用の技術検証版を開く`から起動する。

一覧に現れない場合は、フォルダー階層と三ファイルを確認してからObsidianを再読み込みします。APIキーは不要です。

## 今回確認すること

- 対象ルートが`Instagram_Logs/Synapses`になっている。
- Tag、Mention、Location、融合状態、手書き情報、関連投稿を読み取れる。
- 投稿本文、プロパティ、写真下のタグ・メンション・位置情報を押すと、中央の投稿を維持したまま右サイドバーへ対応カードが表示される。
- 右サイドバーの関連投稿を押すと、対象投稿MarkdownがObsidian標準タブで開く。
- SystemLogsがObsidian標準のチェックボックスとインデントで表示され、チェックボックスが重複しない。
- 融合、分離、手書き、元に戻す等の操作は画面内だけに反映され、再読込でVaultの状態へ戻る。
- 写真・動画・本文は投稿MarkdownのObsidian標準表示を使用する。

## 無効化・削除

1. Obsidianの`設定`→`コミュニティプラグイン`で`Memory Synapse DB`を無効にする。
2. Obsidianを閉じる。
3. 複製した確認用Vaultの`.obsidian/plugins/memory-synapse-db/`だけを削除する。

日常利用Vault、05の元サンプルVault、`output_IGP`、`output_IGR`、`output_IGS`、`output_IGC`は削除・変更しません。

## 既知の制限

- 06は読み取り専用であり、融合や手書きの結果をMarkdownへ保存しません。
- 対象環境はmacOS / iMac M4のデスクトップ版Obsidianです。
- ブラウザー用の模擬エクスプローラー、検証番号、サンプル専用表示は06へ含めません。
- 正式な書き込み可能版08は、06の確認後に別承認を受けてから実装します。
