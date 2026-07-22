# 04_IGS移行仕様書v1.2 (Synapse受け皿整理版)

※本書は「04_IGS移行仕様書v1.1.md」を前提に、共通仕様v1.2への参照を反映したv1.2仕様書である。

本仕様書は、分割後設計正本の[[02_システム全体構成・責任境界#2.4 データ変換の責任]]、[[03_データ構造・原本保持設計]]、[[04_データ取得・変換・出力設計]]、[[05_リンク・意味ネットワーク設計]]、[[06_検証・運用・保全・拡張設計]]に基づき、Instagramのストーリー移行における個別定義を定める。

本データ種別の移行処理は、共通仕様書（`01_IG移行共通仕様書v1.2.md` [差分反映: 共通仕様書バージョンの更新] (変更理由: 実データ監査結果に基づく事実)）に定義された共通パイプラインと同一の処理ロジックで動作する。

共通仕様に対する差分は、以下の項目に限定される。

1. **type**: `Stories`
2. **content**: `null` (動画の場合は `"video"`)
3. **ID prefix**: `IGS`
4. **出力先フォルダ**: `[期間フォルダ]/Stories/`（例：`YYYY_前半/Stories/`）
5. **state file名**: `migration_state_09_stories.json`
6. **メディア保存先**: `Instagram_Logs/media/`（全期間共通の共通メディアフォルダを使用）
7. **検証用個別一時出力フォルダ名**: `output_IGS`
8. **物理実行スクリプト名・パス**: `07_IGS移行_実行/` フォルダ
9. **原本データスキーマ構造**:
   * トップレベルキー `ig_stories` を持つ辞書型データ。
   * 本文は `title` キーから抽出。
   * 作成日時は `creation_timestamp` キーから抽出。
   * 過去仕様では長尺ストーリー等が複数メディアへ自動分割される場合があるため、秒単位の作成日時を保持して時系列復元に利用する。
   [差分反映: 実データ構造の事実を反映] (変更理由: 実データ監査結果に基づく事実)

10. **メディアURIと種別の判定**:
   * `stories.json` のメディアURIは、`ig_stories` 内の各要素直下にある `uri` キーから取得する。
   * 取得したファイルの拡張子により、画像（`.jpg`等）の場合は `content=null`、動画（`.mp4`等）の場合は `content="video"` として登録する。

11. **位置情報・GPSの扱い**:
    * `stories.json` には Instagramスポット名（`place`等）は確認されていないため、`location.raw` および `location.normalized` は原則として `null` とする。
    * ただし、JSON内のストーリー要素に `latitude` および `longitude` が存在する一部データ（監査上は延べ216件、ユニーク90件）があるため、その場合は `location.geo.lat` および `location.geo.lng` に座標を保持する。
    * スポット名がないGPS座標のみの位置情報は、Location Synapseとして自動確定・自動統合の対象にはしない。座標は `location.geo.lat` / `location.geo.lng` に保持し、後工程で確認するための観測情報として残す。

12. **インタラクションデータの位置付け**:
    * `story_interactions` ディレクトリ内にある各種JSON（`polls.json`, `questions.json`, `quizzes.json`, `emoji_sliders.json`, `countdowns.json`, `story_likes.json` など）は、ストーリー（Stories）本体の主たる移行処理対象からは除外する。
    * これらは将来の熱量分析や、Memory/Synapseの関連分析・紐付け等を行うための別材料として位置づけ、本移行でのパースおよびMarkdown出力は行わない。

13. **ハイライト直接所属データの確認順序**:
    * Meta_Data_Analyzerは廃止済みであり、IGSの入力・前処理・実行条件に含めない。
    * 追加確認が必要な場合はMetaエクスポート原本を直接解析し、確認済み事実を `01_判断材料` に記録してから仕様へ反映する。
    * ハイライトタイトルと所属Story IDを直接結ぶ構造が確認できるまでは、既存IGS出力へハイライト由来リンクを自動追加しない。
    * 直接対応が確認できた場合は、元JSONパス、ハイライト識別子、元タイトル、所属Story識別子、並び順、更新日時等を失わない入力仕様を追補する。
    * 今回のエクスポートに直接対応がない場合も、Instagram内部に関係が存在しないとは判断しない。
    * 追加エクスポートでも取得できないことを確認した後に限り、推定候補を直接事実と分離して扱う仕様を検討する。

---

## 13.1 Synapse出力契約

IGSは、ハッシュタグ・メンション・位置情報を、IGPで確定した形式と同じ構造を持つ完成した個別Synapseカードとして `output_IGS` へ出力する。空の仮カードとして出力したり、IGCがカテゴリ固有欄を作り直す前提にしたりしない。

* ハッシュタグSynapseには `hashtag_note` を1件だけ置き、`hashtag` に本文から抽出した先頭の `#` を含む元表記、`note` に `null` を出力する。
* メンションSynapseには `mention_note` を1件だけ置き、`mention`、`name`、`phone`、`web`、`note` を出力する。`web` には元の `@` 表記から生成したInstagram URLを入れる。
* 各Synapseの `## 関連投稿` には、その表記を持つStoryメモへのWikiリンクを1行1件で並べる。
* 投稿ごとの `hashtag_extraction`、`mention_extraction`、`source_post`、`source_raw`、`raw` をSynapseへ繰り返し出力しない。
* `IGS_HASHTAG_EXTRACTION`、`IGS_MENTION_EXTRACTION`、`IGS_LOCATION_OBSERVATION` のSTART/END管理印を出力しない。
* 場所名を取得できた場合のLocation Synapseは、`location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` を1件だけ置き、`## 関連投稿` にStoryメモへのWikiリンクを並べる。
* 場所名がなくGPS座標だけがあるStoryは、従来どおりStoryメモの `location.geo` に座標を保持し、Location Synapseは生成しない。
* YAMLの項目、日本語コメント、初期値は、[[02_IGP移行仕様書v1.2#2.1.1 ハッシュタグメモ]]、[[02_IGP移行仕様書v1.2#2.1.2 メンションメモ]]、[[02_IGP移行仕様書v1.2#2.2.1 Location Synapseメモ]] を正とする。

## 14. 入力・出力契約

主入力はInstagramエクスポートの `media/stories*.json` と、そのレコードが参照するメディアとする。`story_interactions` は現在のIGS主処理の入力に混ぜず、将来の関係解析材料として原本のまま保持する。

* Storyメモ: `output_IGS/Instagram_Logs/{YYYY_前半|YYYY_後半}/Stories/{post_id}.md`
* 個別原本: 同期間の `SystemLogs/RawData/{post_id}.json`
* メディア: `output_IGS/Instagram_Logs/media/{post_id}_{photo|video}_{連番}.{拡張子}`
* 期間Timeline: 同期間の `index/timeline.md`
* Events: `output_IGS/Instagram_Logs/SystemLogs/Events/YYYY-MM-DD_Events.jsonl`
* Synapse: `output_IGS/Instagram_Logs/Synapses/{Tags|Mentions|Locations}/*.md`
* 一覧: `output_IGS/Instagram_Logs/SystemLogs/{ハッシュタグ一覧|メンション一覧|場所一覧}.md`
* 状態管理: `output_IGS/Instagram_Logs/migration_state_09_stories.json`

ハイライトタイトルとStory IDの直接対応が原本で確認できるまでは、Storyメモへハイライト所属・候補グループ・推定リンクを出力してはならない。

## 15. 完了判定

* 有効時刻を持つ全Storyが生成、明示的除外、技術的失敗のいずれかへ分類される。
* 各StoryメモにRawDataと参照メディアが対応し、位置座標を含む原本項目を失わない。
* Timeline、Synapse、一覧、Events、状態管理を含む関連成果物の対応を確認する。
* 各ハッシュタグ・メンションSynapseに情報YAMLが1件だけあり、`## 関連投稿` に対応するStoryメモへのWikiリンクがある。
* 入力に場所名がある場合は、各Location Synapseに `location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` が1件だけあり、`## 関連投稿` に対応するStoryメモへのWikiリンクがある。場所名がなくGPS座標だけの場合はLocation Synapseを生成せず、Storyメモの `location.geo` に保持する。
* Synapseに投稿ごとの抽出YAMLとSTART/END管理印がない。
* 再実行後も、既存Synapseに人間または後工程が設定した `hashtag_note.note`、`mention_note.name`、`mention_note.phone`、`mention_note.web`、`mention_note.note`、Locationの `activity_id`、`source_files`、`note` および人間が追記した本文が保持される。関連成果物を再確認して不足だけを補い、原本との食い違いは自動上書きせず停止する。
* ハイライト所属が未確認であることはIGS本体の技術的失敗に混ぜない。ただし、未確認情報を確定リンクとして出力しない。
* 技術的処理エラー0件と関連成果物の対応確認後だけ完了とする。

---

## 付録：改訂履歴およびv1.1改訂の背景

### A. v1.1改訂の背景と理由
実データ監査において、ストーリー原本JSON（`stories.json`）のトップレベルが辞書型（`ig_stories` キーを持つ）であることが判明した。従来の仕様書v1.0ではフィード同様のリスト構造が想定されていたため、実行時パースエラーを引き起こす懸念があった。また、物理メディアが `Instagram_EXTRACTED:ki_fuse...` などの複数フォルダに分散している事実も検出された。これらを踏まえ、原本JSONのトップレベルキーの吸収、および複数メディアフォルダ探索仕様を明記したv1.1を策定した。

### B. 改訂履歴
* **2026-07-20 (v1.2追記)**: 分割後設計正本との対応および完了判定を明確化。
  * 判断材料の整理後に確定した現在の物理配置 `07_IGS移行_実行/` へ参照を更新。
  * 場所名がある場合のLocation Synapseと、座標だけの場合の非生成条件を完了判定へ追加。
  * 再実行時の人間入力値保持、不足修復、競合停止を完了判定へ追加。
* **2026-07-17 (v1.2追記)**: Synapse出力形式をIGPの確定形式へ統一。
  * ハッシュタグ、メンション、場所情報をそれぞれ1件の情報YAMLと `## 関連投稿` で出力する規則を追加。
  * 投稿ごとの抽出YAMLとSTART/END管理印を出力しない規則を追加。
* **2026-07-06 (v1.1)**: 実データ反映版。
  * `stories.json` のトップレベル辞書構造（`ig_stories`）および内部キーの事実反映。
  * 複数フォルダにまたがる物理メディア探索仕様（`SRC_MEDIA_DIRS`）の導入。
  * 物理スクリプトの配置フォルダ名（`06_IGS移行_実行/`）への修正。
