# Memory Synapse DB 作業ワークフロー

## 目的と状態

本フォルダーは、Memory Synapse DB工程の進め方と停止点を定める現役ワークフローを保持する。企画、設計、仕様の本文正本は置かない。

## Codexでの役割分担

- `../AGENTS.md`は、Memory Synapse DB配下で常に守る境界、読み込み先、停止点を短く定める。
- 本`docs/`は、設計、仕様、ブラウザー確認、実装および検証を進める詳細手順を定める。
- `../../.agents/skills/msdb-browser-to-spec/`は、ブラウザー確認から正本反映、コード監査、06実物確認までを繰り返すときに、該当手順を読み出して実行する。
- 企画、設計、仕様の具体的な要求は各正本へ置き、`AGENTS.md`、本`docs/`またはSkillへ重複させない。

この分担は、Codexがプロジェクトルートから作業場所までの`AGENTS.md`を読み、近い階層の指示を後から適用する[OpenAI公式のAGENTS.md仕様](https://learn.chatgpt.com/docs/agent-configuration/agents-md#how-codex-discovers-guidance)と、常設する小さな規則と必要時だけ使う反復手順を分ける[OpenAI公式のSkill運用指針](https://developers.openai.com/cookbook/examples/skills_in_api#skills-vs-tools-vs-system-prompts)に基づく。

## 文書

- [design-workflow.md](design-workflow.md)：Memory Synapse DB専用設計の確認・変更手順
- [feature-consultation-workflow.md](feature-consultation-workflow.md)：画面・操作・機能の質問に、関係する既存例を少数だけ補足する相談手順
- [browser-confirmation-workflow.md](browser-confirmation-workflow.md)：サンプルデータとブラウザーモックで採用した画面・操作を、設計・仕様正本、コード監査、06実物確認へ順に渡す手順
- [specification-workflow.md](specification-workflow.md)：Memory Synapse DB仕様の確認・変更手順
- [implementation-workflow.md](implementation-workflow.md)：04の人間可読コード、独立した05、読み取り専用の06、別承認で作る08およびObsidian実物検証の手順

対象工程は`../AGENTS.md`の読み込みルーターから選ぶ。

実装工程では、次を入口とする。

- `../04_Memory_Synapse_DB_実行コード/00_実行コード目次.md`：5責任の読み分けと生成物の関係
- `../04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md`：型検査、自動テスト、06の再生成方法
- `../05_Memory_Synapse_DB_サンプル検証キット/README.md`：UIモック、検証ケース台帳、サンプルVaultの確認方法
- `../06_Memory_Synapse_DB_仮プラグイン/README.md`：読み取り専用技術検証版の監査、導入、無効化および削除方法

`05`は`04`の通常ビルドから生成しない独立した検証キットである。`06`は`04`から生成するが、生成物だけを実装判断の根拠にせず、04のTypeScript元コード、依存関係、テストおよびビルド結果と合わせて確認する。
