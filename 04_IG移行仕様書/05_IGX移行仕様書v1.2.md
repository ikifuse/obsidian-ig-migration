# 05_IGX移行仕様書v1.2 (Synapse受け皿整理版)

※本書は「05_IGX移行仕様書v1.1.md」を前提に、共通仕様v1.2への参照を反映したv1.2仕様書である。

本仕様書は,分割前設計書（`03_継続中の判断材料・引継ぎ/02_IG移行設計書.md`）の「第2章 2.4.2 独立スクリプト設計」および「第3章 3.2 / 3.6」に基づき、Instagramの欠損データ・孤児データの救出を行うサルベージ移行における個別定義を定める。

IGXは、通常投稿・リール・ストーリーの通常移行だけでは件数整合が取れないデータや、分類不能・欠損・孤児化したメディアを後から救出するための安全枠として扱う。

本データ種別の移行処理は、共通仕様書（`01_IG移行共通仕様書v1.2.md` [差分反映: 共通仕様書バージョンの更新] (変更理由: 実データ監査結果に基づく事実)）に定義された共通パイプラインと同一の処理ロジックで動作する。

共通仕様に対する差分は、以下の項目に限定される。

1. **type**: `Salvage`
2. **content**: `null` (動画の場合は `"video"`)
3. **ID prefix**: `IGX`
4. **出力先フォルダ**: `Salvage/`（期間分割なしフラット構造）
5. **state file名**: `migration_state_11_salvage.json`
6. **メディア保存先**: `Instagram_Logs/media/`（全期間共通の共通メディアフォルダを使用）
7. **物理実行スクリプト名・パス**: `08_IGX移行_実行/` フォルダ
8. **原本データスキーマ構造**:
   * トップレベルがリスト構造。各要素は `timestamp`, `label_values`, `media` などを保持する。
   * 本文は `label_values` 内の `キャプション` から抽出。
   * 作成日時は `timestamp` から抽出。
   [差分反映: 実データ構造の事実を反映] (変更理由: 実データ監査結果に基づく事実)

---

## 8.1 Synapse出力契約

IGXが生成するハッシュタグ・メンション・位置情報のSynapseは、IGPで確定した形式と同じ構造にする。

* ハッシュタグSynapseには `hashtag_note` を1件だけ置き、`hashtag` に本文から抽出した先頭の `#` を含む元表記、`note` に `null` を出力する。
* メンションSynapseには `mention_note` を1件だけ置き、`mention`、`name`、`phone`、`web`、`note` を出力する。`web` には元の `@` 表記から生成したInstagram URLを入れる。
* 各Synapseの `## 関連投稿` には、その表記を持つSalvageメモへのWikiリンクを1行1件で並べる。
* 投稿ごとの `hashtag_extraction`、`mention_extraction`、`source_post`、`source_raw`、`raw` をSynapseへ繰り返し出力しない。
* `IGX_HASHTAG_EXTRACTION`、`IGX_MENTION_EXTRACTION`、`IGX_LOCATION_OBSERVATION` のSTART/END管理印を出力しない。
* 場所名を取得できた場合のLocation Synapseは、`location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` を1件だけ置き、`## 関連投稿` にSalvageメモへのWikiリンクを並べる。
* 場所名がなくGPS座標だけがあるSalvageは、Salvageメモの `location.geo` に座標を保持し、Location Synapseは生成しない。
* YAMLの項目、日本語コメント、初期値は、[[02_IGP移行仕様書v1.2#2.1.1 ハッシュタグメモ]]、[[02_IGP移行仕様書v1.2#2.1.2 メンションメモ]]、[[02_IGP移行仕様書v1.2#2.2.1 Location Synapseメモ]] を正とする。

## 9. 入力・出力契約

入力は通常のIGP・IGR・IGSで処理できない欠損・孤児・分類不能データに限定する。IGXをIGCの入力へ追加してはならない。

* Salvageメモ: `output_IGX/Instagram_Logs/Salvage/{post_id}.md`
* 個別原本: `output_IGX/Instagram_Logs/SystemLogs/RawData/{post_id}.json`
* メディア: `output_IGX/Instagram_Logs/media/{post_id}_{photo|video}_{連番}.{拡張子}`
* Timeline: `output_IGX/Instagram_Logs/Salvage/Salvage_Timeline.md`
* Events: `output_IGX/Instagram_Logs/SystemLogs/Events/YYYY-MM-DD_Events.jsonl`
* Synapse: `output_IGX/Instagram_Logs/Synapses/{Tags|Mentions|Locations}/*.md`
* 一覧: `output_IGX/Instagram_Logs/SystemLogs/{ハッシュタグ一覧|メンション一覧|場所一覧}.md`
* 状態管理: `output_IGX/Instagram_Logs/migration_state_11_salvage.json`

## 10. 完了判定

* 各対象レコードが生成、明示的除外、技術的失敗のいずれかへ分類される。
* 各SalvageメモにRawDataと参照メディアが対応し、救出元を追跡できる。
* 原本が参照する実在しない `.srt` はRawDataと警告ログに残し、他のSalvage成果物を失敗させない。
* IGP・IGR・IGSの正式成果物を上書きせず、同一データを無根拠に重複生成しない。
* 各ハッシュタグ・メンションSynapseに情報YAMLが1件だけあり、`## 関連投稿` に対応するSalvageメモへのWikiリンクがある。
* 場所名を持つ対象では、Location Synapseに位置情報YAMLが1件だけあり、`## 関連投稿` に対応するSalvageメモへのWikiリンクがある。
* Synapseに投稿ごとの抽出YAMLとSTART/END管理印がない。
* 技術的処理エラー0件と関連成果物の対応確認後だけ完了とする。

---

## 付録：改訂履歴およびv1.1改訂の背景

### A. v1.1改訂の背景と理由
実データ監査において、サルベージ対象となる各JSONファイル（アーカイブやIGTVなど）が、従来の想定である `posts.json` と類似したネスト構造（`timestamp`・`label_values`・`media` の混在）を保持している事実が確認された。また、ストーリーやリールと同様に物理メディアファイルが別フォルダに分散して配置されていた。移行時にメディアファイルのリンク切れを防ぎ、漏れなくデータを救出できるよう、複数メディアフォルダの再帰探索仕様（`SRC_MEDIA_DIRS`）とスキーマ整合性を明記したv1.1を策定した。

### B. 改訂履歴
* **2026-07-20 (v1.2追記)**: 判断材料の整理後に確定した現在の物理配置 `08_IGX移行_実行/` へ参照を更新。IGXの仕様内容と完走範囲は変更しない。
* **2026-07-17 (v1.2追記)**: Synapse出力形式をIGPの確定形式へ統一。
  * ハッシュタグ、メンション、場所情報をそれぞれ1件の情報YAMLと `## 関連投稿` で出力する規則を追加。
  * 投稿ごとの抽出YAMLとSTART/END管理印を出力しない規則を追加。
* **2026-07-06 (v1.1)**: 実データ反映版。
  * サルベージ原本構造（`timestamp` / `label_values`）のパース仕様の事実反映。
  * 複数フォルダにまたがる物理メディア探索仕様（`SRC_MEDIA_DIRS`）の導入。
  * 物理スクリプトの配置フォルダ名（`07_IGX移行_実行/`）への修正。
