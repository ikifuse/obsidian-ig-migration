# 03_IGR移行仕様書v1.2 (Synapse受け皿整理版)

※本書は「03_IGR移行仕様書v1.1.md」を前提に、共通仕様v1.2への参照を反映したv1.2仕様書である。

本仕様書は、分割後設計正本の[[02_システム全体構成・責任境界#2.4 データ変換の責任]]、[[03_データ構造・原本保持設計]]、[[04_データ取得・変換・出力設計]]、[[05_リンク・意味ネットワーク設計]]、[[06_検証・運用・保全・拡張設計]]に基づき、Instagramのリール（縦型ショート動画）移行における個別定義を定める。

本データ種別の移行処理は、共通仕様書（`01_IG移行共通仕様書v1.2.md` [差分反映: 共通仕様書バージョンの更新] (変更理由: 実データ監査結果に基づく事実)）に定義された共通パイプラインと同一の処理ロジックで動作する。

共通仕様に対する差分は、以下の項目に限定される。

1. **type**: `Reels`
2. **content**: `"video"`（意味なし識別子として固定）
3. **ID prefix**: `IGR`
4. **出力先フォルダ**: `Reels/`
5. **state file名**: `migration_state_08_reels.json`
6. **検証用個別一時出力フォルダ名**: `output_IGR`
7. **物理実行スクリプト名・パス**: `06_IGR移行_実行/` フォルダ
8. **原本データスキーマ構造**:
   * トップレベルキー `ig_reels_media` を持つ辞書型データ。
   * 本文は `media` リスト内各要素の `title` キーから抽出。
   * 作成日時は `media` リスト内各要素の `creation_timestamp` キーから抽出。
   [差分反映: 実データ構造の事実を反映] (変更理由: 実データ監査結果に基づく事実)

9. **位置情報・GPSの扱い**:
   * `reels.json` には Instagramスポット名（`place`等）は確認されていないため、`location.raw` および `location.normalized` は原則として `null` とする。
   * ただし、JSON内のメディア要素に `latitude` および `longitude` が存在するリールが一部（監査上は延べ18件、ユニーク12件）あるため、その場合は緯度・経度の値を `location.geo.lat` および `location.geo.lng` に保持する。
   * スポット名がないGPS座標のみの位置情報は、Location Synapseとして自動確定・自動統合の対象にはしない。座標は `location.geo.lat` / `location.geo.lng` に保持し、後工程で確認するための観測情報として残す。

10. **字幕ファイル（.srt）の扱い**:
   * `.srt` は動画の字幕ファイルとして扱う。
   * メディア移行時に `.srt` ファイルが欠損（存在しない）している場合でも、これを移行処理全体の停止理由（致命的エラー）にはしない。警告ログ（Warning）を出力した上で処理を続行し、将来の字幕サルベージ（Salvage/IGX）や字幕テキスト解析の対象候補として扱う。

11. **リール本文の `@` 表記の扱い**:
   * リール本文には、実在アカウントメンションではなく、文章の一部や店名、または `#` の打ち間違いとして `@` が使われている例がある。
   * 仕様上の動作例では、`@sample_accountの説明文` および `@サンプル店舗名` は、この例外に該当する可能性が高い。
   * この種類の `@` 表記は、実在アカウントメンションとして抽出しない。
   * 原文とRawDataは変更せず保持し、必要なら後工程で人間が判断する。

---

## 11.1 Synapse出力契約

IGRは、ハッシュタグ・メンション・位置情報を、IGPで確定した形式と同じ構造を持つ完成した個別Synapseカードとして `output_IGR` へ出力する。空の仮カードとして出力したり、IGCがカテゴリ固有欄を作り直す前提にしたりしない。

* ハッシュタグSynapseには `hashtag_note` を1件だけ置き、`hashtag` に本文から抽出した先頭の `#` を含む元表記、`note` に `null` を出力する。
* メンションSynapseには `mention_note` を1件だけ置き、`mention`、`name`、`phone`、`web`、`note` を出力する。`web` には元の `@` 表記から生成したInstagram URLを入れる。
* 各Synapseの `## 関連投稿` には、その表記を持つリールメモへのWikiリンクを1行1件で並べる。
* 投稿ごとの `hashtag_extraction`、`mention_extraction`、`source_post`、`source_raw`、`raw` をSynapseへ繰り返し出力しない。
* `IGR_HASHTAG_EXTRACTION`、`IGR_MENTION_EXTRACTION`、`IGR_LOCATION_OBSERVATION` のSTART/END管理印を出力しない。
* 場所名を取得できた場合のLocation Synapseは、`location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` を1件だけ置き、`## 関連投稿` にリールメモへのWikiリンクを並べる。
* 場所名がなくGPS座標だけがあるリールは、従来どおりリールメモの `location.geo` に座標を保持し、Location Synapseは生成しない。
* YAMLの項目、日本語コメント、初期値は、[[02_IGP移行仕様書v1.2#2.1.1 ハッシュタグメモ]]、[[02_IGP移行仕様書v1.2#2.1.2 メンションメモ]]、[[02_IGP移行仕様書v1.2#2.2.1 Location Synapseメモ]] を正とする。

## 12. 入力・出力契約

入力はInstagramエクスポートの `media/reels*.json` と、そのレコードが参照するメディアとする。採用した入力ファイル、トップレベル `ig_reels_media`、各元レコードをRawDataから追跡できなければならない。

* リールメモ: `output_IGR/Instagram_Logs/Reels/{post_id}.md`
* 個別原本: `output_IGR/Instagram_Logs/SystemLogs/RawData/Reels/{post_id}.json`
* メディア: `output_IGR/Instagram_Logs/media/{post_id}_{photo|video}_{連番}.{拡張子}`
* Timeline: `output_IGR/Instagram_Logs/Reels/Reels_Timeline.md`
* Events: `output_IGR/Instagram_Logs/SystemLogs/Events/YYYY-MM-DD_Events.jsonl`
* Synapse: `output_IGR/Instagram_Logs/Synapses/{Tags|Mentions|Locations}/*.md`
* 一覧: `output_IGR/Instagram_Logs/SystemLogs/{ハッシュタグ一覧|メンション一覧|場所一覧}.md`
* 状態管理: `output_IGR/Instagram_Logs/migration_state_08_reels.json`

## 13. 完了判定

* 有効時刻を持つ全入力レコードが生成、明示的除外、技術的失敗のいずれかへ分類される。
* 各リールメモにRawDataと全参照メディアが対応し、未記録の欠損がない。
* 座標だけの観測値も `location.geo` に保持される。
* `.srt` 欠損は警告として記録され、他の成果物を失わせない。
* 各ハッシュタグ・メンションSynapseに情報YAMLが1件だけあり、`## 関連投稿` に対応するリールメモへのWikiリンクがある。
* 入力に場所名がある場合は、各Location Synapseに `location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` が1件だけあり、`## 関連投稿` に対応するリールメモへのWikiリンクがある。場所名がなくGPS座標だけの場合はLocation Synapseを生成せず、リールメモの `location.geo` に保持する。
* Synapseに投稿ごとの抽出YAMLとSTART/END管理印がない。
* 再実行後も、既存Synapseに人間または後工程が設定した `hashtag_note.note`、`mention_note.name`、`mention_note.phone`、`mention_note.web`、`mention_note.note`、Locationの `activity_id`、`source_files`、`note` および人間が追記した本文が保持される。関連成果物を再確認して不足だけを補い、原本との食い違いは自動上書きせず停止する。
* 技術的処理エラー0件と関連成果物の対応確認後だけ完了とする。

---

## 付録：改訂履歴およびv1.1改訂の背景

### A. v1.1改訂の背景と理由
実データ監査において、リール原本JSON（`reels.json`）のトップレベルが辞書型（`ig_reels_media` キーを持つ）であり、日時や本文のキーが下層の `media` リスト要素内に格納されているという事実が判明した。従来の仕様書v1.0では、通常のフィード（リスト型）と同等のフラットな構造が想定されていたため、このまま実行するとパースエラーが発生する状態であった。これを正常にパースしきるため、実データ構造に基づいたパース仕様を明文化したv1.1を策定した。

### B. 改訂履歴
* **2026-07-20 (v1.2追記)**: 分割後設計正本との対応および完了判定を明確化。
  * 判断材料の整理後に確定した現在の物理配置 `06_IGR移行_実行/` へ参照を更新。
  * 場所名がある場合のLocation Synapseと、座標だけの場合の非生成条件を完了判定へ追加。
  * 再実行時の人間入力値保持、不足修復、競合停止を完了判定へ追加。
* **2026-07-17 (v1.2追記)**: Synapse出力形式をIGPの確定形式へ統一。
  * ハッシュタグ、メンション、場所情報をそれぞれ1件の情報YAMLと `## 関連投稿` で出力する規則を追加。
  * 投稿ごとの抽出YAMLとSTART/END管理印を出力しない規則を追加。
* **2026-07-06 (v1.1)**: 実データ反映版。
  * `reels.json` 特有のトップレベル辞書構造および内部キー（`creation_timestamp`）の事実反映。
  * 物理スクリプトの配置フォルダ名（`05_IGR移行_実行/`）への修正。
