# Memory Synapse DB 作業ワークフロー

## 目的と状態

本フォルダーは、Memory Synapse DB工程の進め方と停止点を定める現役ワークフローを保持する。企画、設計、仕様の本文正本は置かない。

## 役割分担

- `../AGENTS.md`は、使用するAIや作業環境にかかわらず常に守る境界と読み込み先だけを定める。
- `browser-confirmation-workflow.md`は、02から06までの変更サイクル、許可、07更新、Git途中保存およびブラウザー確認結果の反映手順を定める唯一の正本とする。
- `feature-consultation-workflow.md`は提案前の確認と説明、`design-workflow.md`、`specification-workflow.md`、`implementation-workflow.md`は各工程固有の作業と合格条件だけを定める。
- `../README.md`は、人間が構成と変更サイクルを把握する入口とする。
- `../07_Memory_Synapse_DB_承認・検証台帳.md`は、軽い現在地と、サイクル別の変更前後、採用理由、正本反映箇所、検証結果およびGit基準点を保持する。
- 企画、設計、仕様の現在要件は各正本へ置き、`AGENTS.md`、本`docs/`または07へ重複させない。07の履歴は実装要求の代わりにしない。

Memory Synapse DBの変更サイクルを複製する専用Skillは現役運用に置かない。リポジトリ全体の安全進行Skillは、共通規則の正本を`AGENTS.md`と本`docs/`、共通の機械検査を`../../tools/`に保ったまま、それらを実行する入口として利用できる。Skillだけを必須規則の置き場所にしない。

## 文書

- [design-workflow.md](design-workflow.md)：Memory Synapse DB専用設計の確認・変更手順
- [feature-consultation-workflow.md](feature-consultation-workflow.md)：画面・操作・機能の質問に、関係する既存例を少数だけ補足する相談手順
- [browser-confirmation-workflow.md](browser-confirmation-workflow.md)：05での承認不要な探索と途中保存から、完成候補、設計・仕様正本、コード監査、06実物確認までを一つにした変更サイクル
- [specification-workflow.md](specification-workflow.md)：Memory Synapse DB仕様の確認・変更手順
- [implementation-workflow.md](implementation-workflow.md)：04の人間可読コード、独立した05、読み取り専用の06、別承認で作る08およびObsidian実物検証の手順

対象工程は`../AGENTS.md`の読み込みルーターから選ぶ。

実装工程では、次を入口とする。

- [04の実行コード目次](../04_Memory_Synapse_DB_実行コード/00_実行コード目次.md)：5責任の読み分けと生成物の関係
- [04のビルド・検証方法](../04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md)：型検査、自動テスト、06の再生成方法
- [05のサンプル検証キット](../05_Memory_Synapse_DB_サンプル検証キット/README.md)：UIモック、検証ケース台帳、サンプルVaultの確認方法
- [06の読み取り専用仮プラグイン](../06_Memory_Synapse_DB_仮プラグイン/memory-synapse-db/)：Obsidianへ配置する技術検証版
- [06のmanifest.json](../06_Memory_Synapse_DB_仮プラグイン/memory-synapse-db/manifest.json)：プラグイン識別情報
- [07の承認・検証台帳](../07_Memory_Synapse_DB_承認・検証台帳.md)：軽い現在地と、対象サイクルごとの変更経緯、承認、検証結果、Git基準点

`05`は`04`の通常ビルドから生成しない独立した検証キットである。`06`は`04`から生成するが、生成物だけを実装判断の根拠にせず、04のTypeScript元コード、依存関係、テストおよびビルド結果と合わせて確認する。
