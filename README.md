# Metaエクスポートを個人文脈基盤へ再構造化

Instagramからエクスポートした約10年分の記録を、原本を失わず、検索・接続・再利用できるObsidian知識ベースへ変換するプロジェクトです。

これは構想だけのリポジトリではありません。通常投稿・リール・ストーリーを変換するコードと既存出力があり、その一部をObsidianへ投入して、グラフ表示とカード表示が実際に動くところまで確認できています。

現在は新機能を増やす段階ではなく、巨大化した企画・設計・仕様・コード・成果物を整理し、個人データを公開領域から分離したうえで、止まった開発を安全に再開できる状態へ戻している途中です。

## 🎬 まず、実際に動いている状態を見る

### IGPの一部成果物をObsidianへ確認投入したグラフビュー

| 拡大図（Instagramをハブとした各ノートの接続） | 全体図（10年分の関係性の広がり） |
| :---: | :---: |
| ![グラフビュー詳細](.github/readme-assets/graph-detail.jpg) | ![グラフビュー全体](.github/readme-assets/graph-overview.jpg) |

#### 10年分の人生ログがニューロンのようにつながる様子

<video src="https://github.com/user-attachments/assets/81e665e2-34fe-49a9-b1a8-aefb9f37d454" autoplay loop muted playsinline width="100%"></video>

この動画は、元の画面収録から必要な範囲を残し、無音・4倍速にした約1分27秒の実動作記録です。

## 🗺️ プロジェクト全体マップ

GitHub上では、以下の項目を押すと、リポジトリの構成から各文書の内容へ順番に展開できます。

[▶ ブラウザーでプロジェクト全体マップを開く](https://ikifuse.github.io/obsidian-ig-migration/%E3%83%9E%E3%82%A4%E3%83%B3%E3%83%89%E3%83%9E%E3%83%83%E3%83%97/)

README内で概要を確認する場合は、以下の項目を押すと、リポジトリの構成から各文書の内容へ順番に展開できます。

<details>
<summary><strong>README.md</strong> — このプロジェクトの入口</summary>

<details>
<summary>開発背景と目的</summary>

- 毎回AIへ自分の背景を説明する負担を減らす
- 10年分のInstagramデータを「第二の脳」へ変換する
- Obsidian上に検索・接続・再利用できる知識基盤を構築する
- AIとの共同作業で巨大化した企画・設計・仕様を整理し直す
- 現在は機能追加より、既存工程の整合確認と完走を優先する

</details>

<details>
<summary>設計思想（絶対的なルール）</summary>

- 観測事実と将来の意味判断を分ける
- 位置情報（物理座標）とシナプス（意味的接続）を分ける
- 4層の不変スキーマを維持する
  - ENTITY：識別
  - TEMPORAL：時間
  - RELATION：関係・意味
  - RAW：原本
- 各データ種別の隔離出力を経由する
- Phase 1ではAI解析・OCR・文字起こし・クラス化を行わない

</details>

<details>
<summary>リポジトリ構成</summary>

- 01：プロジェクト全体の企画
- 02：分冊された全体設計
- 03：継続中の判断材料・引継ぎ（Git管理外）
- 04：データ種別ごとの仕様
- 05：IGP通常投稿の移行実行
- 06：IGRリールの移行実行
- 07：IGSストーリーの移行実行
- 08：IGX欠損サルベージ（現在は保留）
- 09：IGC統合
- 10：Memory Synapse DB
- AGENTS.md・docs：プロジェクト共通の作業ルール
- 99：完了済み参考資料（Git管理外）

</details>

<details>
<summary>現在の作業と完走へのステップ</summary>

1. IGP通常投稿を再検証する
2. IGRリールを再検証する
3. IGSストーリーを再検証する
4. IGCを実行し、`output_IGC`を検証する
5. Memory Synapse DBをObsidian上で動作確認する

</details>

<details>
<summary>移行対象と現在のステータス</summary>

- IGP：既存出力あり。完成に最も近く、再検証予定
- IGR：既存出力あり。IGP完走後に再検証予定
- IGS：既存出力あり。IGP・IGRに続いて再検証予定
- IGC：3系統の完走後に統合・検証
- Memory Synapse DB：IGC完了後に動作確認
- IGX：現在は保留

</details>

<details>
<summary>開発参加者向け案内</summary>

- 検証には参加者自身のInstagramエクスポートデータが必要
- オーナーは非エンジニアのシステム設計者
- 目的や理由は企画書、構造は設計書、実行条件は仕様書で確認する
- 進行状況と再開点は引継ぎ資料とGitHub Issuesで管理する
- 変更提案は、目的と変更対象を示したIssueとして起票する
- コミュニケーションは日本語を前提とする

</details>

</details>

<details>
<summary><strong>01_IG移行企画書v1.0.md</strong> — 目的・理由・到達点</summary>

- [企画書を開く](01_IG移行企画書v1.0.md)
- 第1章：プロジェクト概要
- 第2章：プロジェクトの背景
- 第3章：本プロジェクトが目指すもの
- 第4章：設計判断の基本方針
- 第5章：文書体系と優先順位
- 第6章：将来構想

</details>

<details>
<summary><strong>02_IG移行設計書</strong> — 全体設計の分冊</summary>

<details>
<summary>00_設計書目次.md</summary>

- [設計書目次を開く](02_IG移行設計書/00_設計書目次.md)
- 設計正本の範囲
- 6冊の読み分け
- 企画・仕様・コードとの関係

</details>

<details>
<summary>01_設計目的・対象範囲・基本原則.md</summary>

- [文書を開く](02_IG移行設計書/01_設計目的・対象範囲・基本原則.md)
- 設計の目的
- 対象範囲と対象外
- オーナーとAIの責任
- 設計原則
- 文書体系との関係

</details>

<details>
<summary>02_システム全体構成・責任境界.md</summary>

- [文書を開く](02_IG移行設計書/02_システム全体構成・責任境界.md)
- システム全体像
- データソース・変換・出力の責任
- IGCの責任境界
- Memory Synapse DBの責任境界
- 人間判断とAI利用の境界

</details>

<details>
<summary>03_データ構造・原本保持設計.md</summary>

- [文書を開く](02_IG移行設計書/03_データ構造・原本保持設計.md)
- データの基本単位
- 原本・監査・派生・意味情報の区別
- 識別・日時・関係情報
- メディアと抽出事実
- 将来情報源を追加できる境界

</details>

<details>
<summary>04_データ取得・変換・出力設計.md</summary>

- [文書を開く](02_IG移行設計書/04_データ取得・変換・出力設計.md)
- データ種別ごとの独立性
- 入力と原本保持
- 抽出・変換・出力の責任
- 欠損・未知形式・処理失敗
- 再実行・検証・再現性

</details>

<details>
<summary>05_リンク・意味ネットワーク設計.md</summary>

- [文書を開く](02_IG移行設計書/05_リンク・意味ネットワーク設計.md)
- Wikiリンク型データベース
- TimelineとSynapse
- 観測事実と意味情報
- 人間が育てる意味ネットワーク

</details>

<details>
<summary>06_検証・運用・保全・拡張設計.md</summary>

- [文書を開く](02_IG移行設計書/06_検証・運用・保全・拡張設計.md)
- 検証と完了条件
- 再実行・修復・復旧
- ローカル運用とデータ保護
- 文書・コード・成果物の保全
- 将来拡張の境界

</details>

</details>

<details>
<summary><strong>04_IG移行仕様書</strong> — データ種別ごとの実行条件</summary>

<details>
<summary>01_IG移行共通仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/01_IG移行共通仕様書v1.2.md)
- 共通パイプライン
- YAML・出力ディレクトリ・Markdown
- Synapse・リンク・Timeline
- エラー・ログ・再実行・設定
- 実データ監査による事実差分

</details>

<details>
<summary>02_IGP移行仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/02_IGP移行仕様書v1.2.md)
- 通常投稿の入力
- 投稿・メディア・RawData
- Timeline・Synapse・SystemLogs
- 検証と例外処理

</details>

<details>
<summary>03_IGR移行仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/03_IGR移行仕様書v1.2.md)
- リールの入力
- 動画・投稿情報・RawData
- Timeline・Synapse・SystemLogs
- 検証と例外処理

</details>

<details>
<summary>04_IGS移行仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/04_IGS移行仕様書v1.2.md)
- ストーリーの入力
- Story本文とハイライト所属の分離
- メディア・RawData・Timeline
- Synapse・SystemLogs・検証

</details>

<details>
<summary>05_IGX移行仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/05_IGX移行仕様書v1.2.md)
- 欠損サルベージの対象
- 分類不能データ
- 出力と検証
- 現在は保留

</details>

<details>
<summary>06_Memory_Synapse_DB_仕様書v1.2.md</summary>

- [文書を開く](04_IG移行仕様書/06_Memory_Synapse_DB_仕様書v1.2.md)
- Memory Synapse DBとの接続条件
- 入出力と操作
- データ保護と検証

</details>

</details>

<details>
<summary><strong>AGENTS.md ＋ docs</strong> — プロジェクト共通ルール</summary>

<details>
<summary>AGENTS.md</summary>

- [共通AGENTSを開く](AGENTS.md)
- 目的と最上位条件
- 全工程で守る判断原則
- 作業範囲と停止条件
- 読み込みルーター
- データ保護
- 編集・記録・外部操作

</details>

<details>
<summary>docs</summary>

- [企画工程](docs/planning-workflow.md)
- [設計工程](docs/design-workflow.md)
- [仕様工程](docs/specification-workflow.md)
- [文書の配置・退役](docs/document-governance.md)
- [恒久ルールの追加・修正基準](docs/rule-addition-criteria.md)

</details>

</details>

<details>
<summary><strong>09_IGC統合</strong> — 3系統の出力を統合</summary>

<details>
<summary>01_IGC統合企画書v1.0.md</summary>

- [企画書を開く](09_IGC統合/01_IGC統合企画書v1.0.md)
- 実現したいこと
- 出力したいもの
- 3種類の統合
- 人間とUIの役割
- 安全と現在の位置付け

</details>

<details>
<summary>02_IGC統合設計書v1.0.md</summary>

- [設計書を開く](09_IGC統合/02_IGC統合設計書v1.0.md)
- 入力と出力
- 統合単位
- Synapse・SystemLogsの統合構造
- 入力不一致とIDの境界
- Memory Synapse DBとの責任境界
- 安全更新と検証条件

</details>

<details>
<summary>03_IGC統合仕様書</summary>

- [仕様書目次](09_IGC統合/03_IGC統合仕様書/00_仕様書目次.md)
- [役割・入力形式](09_IGC統合/03_IGC統合仕様書/01_役割・入力形式.md)
- [統合・出力形式](09_IGC統合/03_IGC統合仕様書/02_統合・出力形式.md)
- [異常処理・検証・安全更新](09_IGC統合/03_IGC統合仕様書/03_異常処理・検証・安全更新.md)
- [実行結果・コード構成・対象外](09_IGC統合/03_IGC統合仕様書/04_実行結果・コード構成・対象外.md)

</details>

<details>
<summary>AGENTS.md ＋ docs</summary>

- [IGC専用AGENTSを開く](09_IGC統合/AGENTS.md)
- 専用`docs/`は現在未配置
- 共通工程はルートの`docs/`を適用

</details>

</details>

<details>
<summary><strong>10_Memory_Synapse_DB</strong> — Obsidian上で知識を育てる</summary>

<details>
<summary>README.md</summary>

- [専用READMEを開く](10_Memory_Synapse_DB/README.md)
- 現在の構成
- 安全上の境界
- ビルド
- レビュー参加者向け案内

</details>

<details>
<summary>01_Memory_Synapse_DB_企画書v2.1.md</summary>

- [企画書を開く](10_Memory_Synapse_DB/01_Memory_Synapse_DB_企画書v2.1.md)
- プロジェクトの位置付け
- 解決したい課題
- 実現したい価値
- データを守る原則
- 現在の対象範囲
- 継続して守る原則
- 将来構想
- 文書体系と判断の優先順位

</details>

<details>
<summary>02_Memory_Synapse_DB_設計書</summary>

- [設計書目次](10_Memory_Synapse_DB/02_Memory_Synapse_DB_設計書/00_設計書目次.md)
- [目的・入力・データ保護](10_Memory_Synapse_DB/02_Memory_Synapse_DB_設計書/01_目的・入力・データ保護.md)
- [大きなカード・受け皿・融合](10_Memory_Synapse_DB/02_Memory_Synapse_DB_設計書/02_大きなカード・受け皿・融合.md)
- [表示・手書き・分離](10_Memory_Synapse_DB/02_Memory_Synapse_DB_設計書/03_表示・手書き・分離.md)
- [確認環境・実装環境](10_Memory_Synapse_DB/02_Memory_Synapse_DB_設計書/04_確認環境・実装環境.md)

</details>

<details>
<summary>03_Memory_Synapse_DB_仕様書</summary>

- [仕様書目次](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/00_仕様書目次.md)
- [役割・対象データ](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/01_役割・対象データ.md)
- [個別カード・融合状態](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/02_個別カード・融合状態.md)
- [表示・手書き情報](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/03_表示・手書き情報.md)
- [融合・分離・取消・復旧](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/04_融合・分離・取消・復旧.md)
- [ブラウザー確認・Obsidian実装・実物検証](10_Memory_Synapse_DB/03_Memory_Synapse_DB_仕様書/05_ブラウザー確認・Obsidian実装・実物検証.md)

</details>

<details>
<summary>AGENTS.md ＋ docs</summary>

- [Memory Synapse DB専用AGENTS](10_Memory_Synapse_DB/AGENTS.md)
- [専用docs目次](10_Memory_Synapse_DB/docs/README.md)
- [設計工程](10_Memory_Synapse_DB/docs/design-workflow.md)
- [仕様工程](10_Memory_Synapse_DB/docs/specification-workflow.md)
- [実装工程](10_Memory_Synapse_DB/docs/implementation-workflow.md)

</details>

</details>

---

## 1. 📢 開発の背景と、いま整理している理由

> 「毎回AIへ自分の背景を説明するのは大変だ。10年分のInstagramデータをObsidianへ入れれば、自分の文脈を持った『第二の脳』を作れるのではないか」

プログラミング経験のないオーナーが、2026年5月27日に趣味としてAIの勉強を始め、この発想からAIと共同で設計・実装を進めました。最初は小さなアイデアでしたが、実データを扱う変換コード、複数の出力工程、IGC統合、Obsidianプラグインへと広がりました。

開発が進む一方で、企画・設計・仕様・実装・検証中の判断が一つの文脈へ積み重なり、オーナーもAIも全体を追い切れなくなりました。そこで後から交通整理を行い、現在の `01` 企画、`02` 設計、`04` 仕様、`05〜10` 実行・統合という文書体系へ分け直しています。

### GitHubへ公開した経緯

開発が止まった際、実際に動いているObsidianを友人のエンジニアへ見せたことが、GitHubを知るきっかけでした。しかし、最初の公開では個人データまで含まれていることが分かり、リポジトリを一度閉じて作り直しました。その結果、当時の93件のコミット、Issues、READMEへ添付していた動画も失われました。

現在行っているのは、単なる見栄えの調整ではありません。

- 個人データと公開資料を分離する
- 巨大化した文書を、役割と判断の境界に沿って分ける
- 既存コードと成果物を壊さず、どこから再開するかを明確にする
- 初めて見る人が、実際に動いている範囲と未完成の範囲を判断できるようにする

このREADMEの写真・動画・マップは、その現在地を言葉だけではなく実物で伝えるために置いています。

![プロジェクト概要スライド](.github/readme-assets/section-1-project-overview.jpg)

### 現在確認できている成果

- IGP（通常投稿）：1,842投稿・7,487メディアの既存出力があり、完成に最も近い
- IGR（リール）：77件の既存出力がある
- IGS（ストーリー）：1,521件の既存出力がある
- Obsidian：IGPの一部を投入し、グラフ表示とカード表示を実物確認できている

ただし、これらは「すべて完成した」という意味ではありません。現在は分冊設計を基準に、仕様・コード・既存出力の整合をIGPから順に確認し直す段階です。

---

## 2. 🧠 本プロジェクトの核心（グランドデザインと設計思想）

![全体設計図スライド](.github/readme-assets/section-2-core-principles.jpg)

🧠　本システムは、単なるデータのバックアップではなく、**「将来的にAIがオーナーの過去の文脈（コンテキスト）を完全に理解するための知識ベース（第二の脳）」**を作るためのデータ変換エンジンです。<br>

⚙️　そのため、以下の**絶対的なルール・原則（設計思想）**に基づいてコードが書かれています。<br>

### 2.1. ⚖️ 観測事実と将来の意味判断を分ける
* ⚖️　現在のIGP・IGR・IGSは、投稿、RawData、メディア、ハッシュタグ・メンション・位置情報の抽出事実を失わず出力します。<br>
* 🔄　人間が育てる意味ネットワーク、採用判断、融合・分離の操作は、未完成のIGCとMemory Synapse DBの将来工程です。現在の抽出コードが空の人間用メモや採用欄を先回りして作りません。<br>

### 2.2. 📍 位置情報（物理）とシナプス（意味）の絶対分離
* 📍　`location` プロパティは普遍の「物理座標レイヤー（現実座標）」として扱い、主観的な「意味（なぜそこにいたか）」とは明確に切り離してGraph View上で混ざらないようにします。<br>

### 2.3. 🗂 ユニバーサル不変スキーマ（4層構造）の厳格性
* 🗂　将来の拡張性（FacebookログやGPSログの合流）を見据え、全てのデータは **①ENTITY LAYER（Identity）、②TEMPORAL LAYER（Time）、③RELATION LAYER（Meaning）、④RAW LAYER（Original）** の4層構造に固定して永続化します。<br>

### 2.4. 🔄 段階的出力フロー（ワンクッション方式）
* 🔄　既存データを破壊しないよう、各データ種別は専用の隔離フォルダ（`output_IGP`、`output_IGR`、`output_IGS`）へ出力します。各抽出工程から`output_IGC`や実Vaultへ直接再実行しません。`output_IGP`の一部をObsidianへ入れたのは、実物を見ながら設計を検証するためであり、本番全件移行ではありません。<br>

### 2.5. 🚫 AI解析・クラス化の完全禁止（Phase 1 スコープ）
* 🚫　音声の文字起こしやOCR、画像解析、およびコードのクラス化や共通ライブラリ化は**一律禁止**としています。画像・動画は単純な保存とMarkdownへのリンク表示のみに留めます。（※非エンジニアのオーナーがコードの処理を1行ずつ直接理解し、将来も自身で保守し続けるための制約です）<br>

---

## 3. 📁 リポジトリの構成ファイル

📁　現在、以下のドキュメントとスクリプトが格納されています。<br>

> ℹ️　先頭の数字は読む順番とシステムの役割（01:企画 → 02:設計 → 03:判断材料 → 04:仕様 → 05〜10:実行・統合）を示します。<br>

- 📄 **[01_IG移行企画書v1.0.md](01_IG移行企画書v1.0.md)**：プロジェクト全体の目的・理由・到達点を定める最上位文書
- 🗺️ **[02_IG移行設計書/](02_IG移行設計書/)**：目次1冊と設計6冊に分けた現役設計書
- 🔒 **03_継続中の判断材料・引継ぎ/**：実データ解析、未確定の判断、作業中の引継ぎを置くローカル専用領域。個人情報保護のためGitHubには公開しない
- 🗃️ **[04_IG移行仕様書/](04_IG移行仕様書/)**：共通・IGP・IGR・IGS・IGX・Memory Synapse DBの実行条件を定めるv1.2仕様書
- 📂 **[05_IGP移行_実行/](05_IGP移行_実行/)**：通常投稿（Post）の移行実行
- 📂 **[06_IGR移行_実行/](06_IGR移行_実行/)**：リール（Reel）の移行実行
- 📂 **[07_IGS移行_実行/](07_IGS移行_実行/)**：ストーリー（Story）の移行実行
- 📂 **[08_IGX移行_実行/](08_IGX移行_実行/)**：欠損サルベージ。現在の完走条件からは除外して保留
- 🔗 **[09_IGC統合/](09_IGC統合/)**：IGP・IGR・IGSを `output_IGC` へ統合する企画・設計・分冊仕様・実行コード
- 🧠 **[10_Memory_Synapse_DB/](10_Memory_Synapse_DB/)**：統合後の知識をObsidian上で表示し、人間が育てるための企画・設計・分冊仕様・実行コード
- 🧭 **[AGENTS.md](AGENTS.md)・[docs/](docs/)**：全工程の判断・承認・停止条件と、企画・設計・仕様の進め方
- 🗺️ **[マインドマップ/](マインドマップ/)**：現在地と文書構造を確認するブラウザー版マップ
- 🔒 **99_完了済み参考資料/**：退役済み資料を残すローカル専用領域。GitHubには公開しない

---

## 4. 🛠 現在の作業と完走へのステップ

🛠　現在の承認済み完走点は、IGX（サルベージ）を一旦対象外としたうえで、**IGP・IGR・IGSを検証・完走し、さらに `09_IGC統合` を実行して `output_IGC` を完成させ、`10_Memory_Synapse_DB`（Obsidianプラグイン）を動作させてObsidian上で成果を確認できる状態まで**と規定しています。<br>

現在、以下の順番で1ステップずつコード・仕様（v1.2）・実成果物の整合性を取り直しています。<br>

1. 🟡 **通常投稿（IGP）の再検証**
   * 現行の `05_IGP移行_実行/` コードを `v1.2仕様` に合わせ、1,842投稿・7,487メディアの出力を実成果物で完全検証します。<br>
2. 🟡 **リール（IGR）の再検証**
   * IGP完了後、`06_IGR移行_実行/` の77件の出力を同じ完成基準で再検証します。<br>
3. 🟡 **ストーリー（IGS）の再検証**
   * `07_IGS移行_実行/` の1,521件の出力を再検証します。（※ハイライトの所属関係はエクスポートJSONに直接対応表がないため、Story本文の技術移行と分離して扱います）<br>
4. 🔗 **IGC統合の実行と検証**
   * 3系統の出力を統合し、`09_IGC統合/` を実行して本番用 `output_IGC` を生成・検証します。<br>
5. 🧠 **Obsidianプラグインの動作確認**
   * `10_Memory_Synapse_DB/` のプラグインを起動し、Obsidian上で成果が正しく表示・接続されることを確認して完走とします。<br>

🤝　現在の作業状況、未解決事項、引き継ぎは `03_継続中の判断材料・引継ぎ/` や GitHub Issues で管理します。安定した目的・設計・仕様は、リポジトリ内の対応文書を正とします。<br>

---

## 5. 🟢 現状と進行ステータス

* 🟡　**通常投稿（Post / IGP）移行**：完成に最も近い工程。1,842件の既存出力とObsidianへの一部確認投入あり。v1.2仕様へ合わせて再検証予定<br>
  
  **【グラフビューでの全体像は冒頭のデモを参照】**
  
  **【Obsidian上でのカード化・DM表示イメージ】**
  ![カード・DM表示イメージ](.github/readme-assets/card-dm-preview.jpg)
  
  **【Obsidian上でのカード表示デモ（実際の操作速度・音声なし）】**

  <video src="https://github.com/user-attachments/assets/1f3e76cc-7c6e-4e36-a446-64753cc8d836" autoplay loop muted playsinline width="100%"></video>

  この動画は、Memory Synapse DBが目指すカード表示と、現在どこで開発が止まっているかを実画面で伝えるための記録です。個人情報が必要以上に映らない範囲へ切り詰め、音声を削除しています。

* 🟡　**リール（Reel / IGR）移行**：既存出力77件あり。IGP完走後にv1.2仕様・コード・成果物を再検証<br>
* 🟡　**ストーリー（Story / IGS）移行**：既存出力1,521件あり。IGP・IGRに続いて再検証<br>
* 🔗　**IGC統合（IGC）**：IGP・IGR・IGSの完走後に `output_IGC` への統合・再検証を実施<br>
* 🧠　**Obsidianプラグイン（Memory Synapse DB）**：IGC統合完了後、Obsidian上での表示・接続動作を確認<br>
* ⚪️　**欠損サルベージ（IGX）移行**：現在は保留。上記完走後に再開可否を判断<br>

---

## 6. 🤝 開発の進め方・ご相談について

* ⚙️　**動作テスト用のデータについて（ご協力のお願い）**<br>
  * 📦　テストを行う際は、お手数ですがご自身のInstagramデータ（Meta社からJSON形式でエクスポートしたもの）をご用意の上、配置して検証をお願いいたします。オーナー側でテスト用のモックデータをご用意することが難しいため、ご協力をお願いいたします。<br>
* 👤　**オーナーは非エンジニア（TAXI運転手）です**<br>
  * 💬　難しいプログラミングやコードの書き方に関する質問には直接お答えできない場合があります。技術的な判断はエンジニアの皆様にお任せする部分が多くなります。なお、オーナーは日本語のみを理解するため、README・Issue・やり取りも日本語を前提にしています。<br>
* 🗺️　**まずは企画書と設計書をご確認ください**<br>
  * 🔍　目的や判断理由で迷った場合は『企画書（01_）』へ、構造やデータ設計で迷った場合は『設計書（02_）』へ戻って確認してください。<br>
* 🧭　**現在の進行状況や再開ポイントについて**<br>
  * 📌　現在の進行状況や作業再開ポイントは、最新の引き継ぎ資料や GitHub Issues を参照してください。引き継ぎ資料の名称や対象は進行状況に応じて変わるため、README では固定リンク化していません。<br>
* 💡　**提案ベースでのIssue起票は大歓迎です！**<br>
  * 🚀　バグ修正や「こう変更した方が良い」というアイデアがあれば、エンジニア同士で自由にIssueを立てて議論・整理を進めていただくか、「〇〇という目的のために、コードをこう変えたい」という具体的な提案の形でIssueを作っていただけると大変助かります。<br>

![開発協力とIssue相談イメージ](.github/readme-assets/section-6-workflow.jpg)
