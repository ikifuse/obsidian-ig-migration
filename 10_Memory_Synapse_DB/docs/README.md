# Memory Synapse DB 作業ワークフロー

## 目的と状態

本フォルダーは、Memory Synapse DB工程の進め方と停止点を定める現役ワークフローを保持する。企画、設計、仕様の本文正本は置かない。

## 文書

- [design-workflow.md](design-workflow.md)：Memory Synapse DB専用設計の確認・変更手順
- [specification-workflow.md](specification-workflow.md)：Memory Synapse DB仕様の確認・変更手順
- [implementation-workflow.md](implementation-workflow.md)：日本語5分割の実行コード、ブラウザー確認版、読み取り専用仮プラグイン、正式プラグイン、Obsidian実物検証の手順

対象工程は`../AGENTS.md`の読み込みルーターから選ぶ。

実装工程では、次を入口とする。

- `../04_Memory_Synapse_DB_実行コード/00_実行コード目次.md`：5責任の読み分けと生成物の関係
- `../04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md`：型検査、自動テスト、ブラウザー版と仮プラグインの生成方法

`../05_Memory_Synapse_DB_ブラウザー確認版/`と`../06_Memory_Synapse_DB_仮プラグイン/`は生成物であり、実装判断の入口にはしない。
