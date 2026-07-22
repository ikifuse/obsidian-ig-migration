# 02_IGP移行仕様書v1.2 (Synapse受け皿整理版)

※本書は「02_IGP移行仕様書v1.1.md」を前提に、共通仕様v1.2への参照を反映したv1.2仕様書である。

本仕様書は、分割前設計書（`03_継続中の判断材料・引継ぎ/02_IG移行設計書.md`）の「第2章 2.4.2 独立スクリプト設計」および「第3章 3.2 / 3.6」に基づき、Instagramの通常投稿（フィード）移行スクリプト群（`05_IGP移行_実行/`）が従うべき個別のデータ構造とパースロジックを定義する。

共通仕様については、一律で **`01_IG移行共通仕様書v1.2.md`** [差分反映: 共通仕様書バージョンの更新] (変更理由: 実データ監査結果に基づく事実) を適用する。

---

## 1. 処理対象データ
*   **ターゲット原本JSON**: `your_instagram_activity/media` ディレクトリ配下の `posts.json` のみを移行処理の実行対象とする。
*   **除外・監査用データ**: `posts_1.json`（およびその他の `posts_*.json`）は同一投稿群を別スキーマで保持した重複データであるため、実行対象外とし、監査・照合用途としてのみ保持する。
*   **出力ID接頭辞**: `(日付時間)_IG_(連番)`
*   **YAML `type` フィールド固定値**: `Feed`
*   **YAML `content` フィールド値**: 画像のみの場合は `null`、動画を含む場合は `"video"`
*   **状態管理ファイル名**: `migration_state_10_posts.json`
*   **検証用個別一時出力フォルダ名**: `output_IGP`
*   **出力先投稿フォルダ名**: `Posts/`
*   **タイムラインタイトル**: `(期間名) Timeline`

---

## 2. 投稿固有のJSONマッピングおよびパースロジック

原本JSON（`posts.json`）の1レコードにつきMarkdownを1件生成する。パース時の統合・補完・重複排除ロジックは使用しない。

原本JSON内のデータ構造から、メタデータを以下の規則（構造A）で抽出する。

### 2.1 キャプション（本文）の抽出
*   **構造A（`posts.json`）**:
    `label_values` 配列を走査し、`label` キーの値が `"キャプション"` である要素の `value` キーの値を取得する。
*   **複数キャプション時**:
    同一投稿内にキャプションが複数ある場合も、原文はRawData側で保持する。投稿メモ本文へ採用する値は、実データ照合で確定した採用ルールに従い1件だけ選ぶ。意味を推測した自動補完は行わない。
*   *※構造B（`posts_1.json` など）は実行対象外のため、本パースロジックの適用対象外とする。*

### 2.1.1 ハッシュタグメモ

IGPは、キャプションから確認できるハッシュタグ表記ごとに、対応するハッシュタグメモを生成する。ハッシュタグメモには `hashtag_note` を1件だけ置き、その下の `## 関連投稿` に、そのハッシュタグが含まれる投稿メモへのWikiリンクを並べる。

````markdown
```yaml
hashtag_note:
  hashtag: "#SampleTagA"
  note: null
```

## 関連投稿

[[2024-01-06-12-00-00_IG_0006]]
[[2020-08-22-15-35-22_IG_1535]]
[[2020-08-22-16-08-30_IG_1534]]
````

ハッシュタグメモには、投稿ごとの `hashtag_extraction`、`source_post`、`source_raw`、`raw` を繰り返し出力しない。`IGP_HASHTAG_EXTRACTION:(投稿ID):START` および `IGP_HASHTAG_EXTRACTION:(投稿ID):END` の生成管理印も出力しない。

元のハッシュタグ表記と出典は、投稿本文、投稿メモ、個別RawDataに保持する。ハッシュタグメモから各投稿へたどるための情報は、`## 関連投稿` のWikiリンクとして保持する。

`hashtag` は、先頭の `#`、大文字小文字、数字、記号を含め、キャプションに存在した表記を保持する。大文字小文字の違い、長い表記、現在のInstagramでは不自然に見える表記を、人間の判断前に統合、短縮、修正しない。`note` の初期値は `null` とする。

### 2.1.2 メンションメモ

IGPは、キャプションからメンションとして確認できる `@文字列` ごとに、対応するメンションメモを生成する。メンションメモには `mention_note` を1件だけ置き、その下の `## 関連投稿` に、そのメンションが含まれる投稿メモへのWikiリンクを並べる。

````markdown
```yaml
mention_note:
  mention: "@sample_account_001"
  name: null
  phone: []
  web:
    - "https://www.instagram.com/sample_account_001/"
  note: null
```

## 関連投稿

[[2022-05-11-17-20-55_IG_836]]
[[2022-05-24-16-48-12_IG_833]]
[[2022-05-26-18-03-07_IG_829]]
````

メンションメモには、投稿ごとの `mention_extraction`、`source_post`、`source_raw`、`raw` を繰り返し出力しない。`IGP_MENTION_EXTRACTION:(投稿ID):START` および `IGP_MENTION_EXTRACTION:(投稿ID):END` の生成管理印も出力しない。

元の `@文字列` と出典は、投稿本文、投稿メモ、個別RawDataに保持する。メンションメモから各投稿へたどるための情報は、`## 関連投稿` のWikiリンクとして保持する。

`posts.json` に正式なアカウントIDまたは正式リンクがないため、元の `@文字列` だけを根拠に実在アカウント、現在の所有者、本人性を確定しない。`@` の直後に日本語の文章や店名が続き、オーナーの利用実態から `#` の打ち間違いと判断されたものはメンションメモを生成しない。原文とRawDataは変更せず、整理済み情報ではTagとして扱う。

### 2.2 位置情報（スポット名）の抽出
*   **構造A（`posts.json`）**:
    `label_values` 配列を走査し、`title` キーの値が `"スポット"` である辞書オブジェクトを特定する。その中の `dict` 配列にある辞書のさらに `dict` 配列を再帰的に走査し、`label` キーの値が `"名前"` である要素の `value` キーの値をスポット名として取得する。
*   **保持方針**:
    `location.raw` には原本にある場所名をそのまま保持する。ファイル名安全性のための置換が必要な場合も、人間向け名称とは分けて扱う。
*   *※構造B（`posts_1.json` など）は実行対象外のため、本パースロジックの適用対象外とする。*

### 2.2.1 Location Synapseメモ

IGPは、スポット名ごとに対応する `Synapses/Locations/{場所名}.md` を生成する。Location Synapseメモには `location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` を1件だけ置き、その下の `## 関連投稿` に、その場所情報を持つ投稿メモへのWikiリンクを並べる。

````markdown
```yaml
location_note:
  location: "サンプル地点A"    # Instagramから抽出された場所名

geo:                               # 緯度・経度の座標
  lat: 35.000001              # 緯度
  lng: 135.000001             # 経度
  alt: null                        # 高度

address:                           # 住所
  full: null                       # 住所全文
  components:                     # 住所の内訳
    country: null                  # 国
    prefecture: null               # 都道府県
    city: null                     # 市区町村
    district: null                 # 地区
    street: null                   # 番地・通り
    postal_code: null              # 郵便番号

activity_id: "activity_000001"     # 活動をまとめる番号

source_files:                      # 活動の元ファイル
  - "[[activity_000001.gpx]]" # GPXファイル
  - "[[activity_000001.kml]]" # KMLファイル
  - "[[activity_000001.tcx]]" # TCXファイル
  - "[[activity_000001.csv]]" # CSVファイル

note: null                         # 元ファイルから分からない人間の記憶
```

## 関連投稿

[[2022-09-18-14-53-08_IG_641]]
````

Location Synapseメモには、投稿ごとの `observation_id`、`checkin_id`、`source_post`、`source_raw`、`raw`、`normalized`、`confidence` を繰り返し出力しない。`IGP_LOCATION_OBSERVATION:(投稿ID):START` および `IGP_LOCATION_OBSERVATION:(投稿ID):END` の生成管理印も出力しない。

元の場所名、チェックイン情報、出典は、投稿メモと個別RawDataに保持する。Location Synapseメモから各投稿へたどるための情報は、`## 関連投稿` のWikiリンクとして保持する。

原本に値がない `geo` および `address` の項目は省略せず `null` にする。人間が設定した `activity_id`、`source_files`、`note` が既存メモにある場合、IGPの再実行で削除または初期化してはならない。

### 2.3 メディア情報の抽出
原本オブジェクトからキー名 `"media"` を再帰的に探索し、内包される `uri` キーの値を取得して移行対象メディアファイルリストとする。
コピー先メディアファイル名は `(post_id)_(photo または video)_(連番).(拡張子)` とする。
*   拡張子が `.jpg`, `.jpeg`, `.png`, `.webp` の場合は `photo`、それ以外（`.mp4`等）は `video` とする。

---

## 3. 出力契約

`posts.json` の有効な1レコードにつき、次を対応させる。

* 投稿メモ: `output_IGP/Instagram_Logs/{YYYY_前半|YYYY_後半}/Posts/{post_id}.md`
* 個別原本: 同期間の `SystemLogs/RawData/{post_id}.json`
* Feedメディア: 同期間の `Instagram/media/{post_id}_{photo|video}_{連番}.{拡張子}`
* 期間Timeline: 同期間の `index/timeline.md`
* 期間Events: 同期間の `SystemLogs/Events/YYYY-MM-DD_Events.jsonl`
* 共通Synapse: `Instagram_Logs/Synapses/{Tags|Mentions|Locations}/*.md`
* 共通一覧: `Instagram_Logs/SystemLogs/{ハッシュタグ一覧|メンション一覧|場所一覧}.md`
* 状態管理: `Instagram_Logs/migration_state_10_posts.json`

Feedメディアを全期間共通 `Instagram_Logs/media/` へ移してはならない。投稿メモ、RawData、参照メディア、Timeline、Synapse、一覧の対応を崩してはならない。

Location Synapseは空テンプレートだけを出力して完了としてはならない。本仕様2.2.1の情報を1件だけ置き、対応する投稿メモへのWikiリンクを `## 関連投稿` に並べる。

## 4. 完了判定

* `posts.json` の対象1,842件が投稿メモ1,842件、RawData 1,842件へ対応する。
* 原本が参照するメディア7,487件と出力メディア7,487件に欠落・内容不一致がない。
* 全期間の技術的処理エラーが0件である。
* 各ハッシュタグメモに `hashtag_note` が1件だけあり、`hashtag` と `note` を持ち、`## 関連投稿` に対応する投稿メモへのWikiリンクがある。
* ハッシュタグメモに `hashtag_extraction`、`IGP_HASHTAG_EXTRACTION:START`、`IGP_HASHTAG_EXTRACTION:END` がない。
* 各メンションメモに `mention_note` が1件だけあり、`## 関連投稿` に対応する投稿メモへのWikiリンクがある。
* メンションメモに `mention_extraction`、`IGP_MENTION_EXTRACTION:START`、`IGP_MENTION_EXTRACTION:END` がない。
* 各Location Synapseメモに `location_note`、`geo`、`address`、`activity_id`、`source_files`、`note` が1件だけあり、`## 関連投稿` に対応する投稿メモへのWikiリンクがある。
* Location Synapseメモに投稿ごとの位置観測YAMLと `IGP_LOCATION_OBSERVATION:START`、`IGP_LOCATION_OBSERVATION:END` がない。
* 既存Location Synapseメモに人間が設定した `activity_id`、`source_files`、`note` がある場合、再実行後も同じ値が保持される。
* 再実行時は投稿メモの存在だけでスキップせず、関連成果物を検査し、不足だけを補う。
* 人間の意味判断待ちは技術的失敗と分ける。既存内容と原本が食い違う場合は自動上書きせず停止する。

---

## 付録：改訂履歴およびv1.1改訂の背景

### A. v1.1改訂の背景と理由
実データ監査結果において、同一期間のフィードデータ原本JSONとして `posts.json`（構造A）と `posts_1.json`（構造B）が混在している事実が判明した。構造Bは従来の仕様書v1.0には記載されていない新規構造であり、キャプションや日時の抽出キーが異なるほか、一部のメディアが `posts.json` と重複している事実が検出された。
移行データの完全性と重複なきクレンジングを担保するため、マージ処理および重複排除の個別仕様を追加したv1.1を策定した。

### B. 改訂履歴
* **2026-07-20 (v1.2追記)**: 判断材料の整理後に確定した現在の物理配置 `05_IGP移行_実行/` へ参照を更新。
* **2026-07-17 (v1.2追記)**: Location Synapseメモの出力形式を修正。
  * `location_note`、座標、住所、活動ID、活動の元ファイル、人間の記憶を1件のYAMLとして置き、`## 関連投稿` に投稿メモへのWikiリンクを並べる形式へ変更。
  * 投稿ごとの位置観測YAMLと `IGP_LOCATION_OBSERVATION` 生成管理印をLocation Synapseメモへ出力しない規則を追加。
* **2026-07-17 (v1.2追記)**: ハッシュタグメモの出力形式を修正。
  * `hashtag_note` に元のハッシュタグ表記と自由メモ欄を置き、`## 関連投稿` に投稿メモへのWikiリンクを並べる形式へ変更。
  * `meaning` を廃止し、投稿ごとの抽出YAMLと `IGP_HASHTAG_EXTRACTION` 生成管理印を出力しない規則を追加。
* **2026-07-17 (v1.2追記)**: メンションメモの出力形式を修正。
  * `mention_note` を1件だけ置き、`## 関連投稿` に投稿メモへのWikiリンクを並べる形式へ変更。
  * 投稿ごとの `mention_extraction` と `IGP_MENTION_EXTRACTION` 生成管理印をメンションメモへ出力しない規則を追加。
* **2026-07-16 (v1.2追記)**: 場所情報の新旧仕様混在を解消。
  * 位置観測ブロックを旧場所メモテンプレートの `Instagram / Facebook` 空欄に依存しない抽出事実として定義。
  * IGPは位置観測の事実を完成させ、人間用の受け皿と共通作業台はIGCが設置する責任分担へ統一。
  * 位置観測と活動記録を別記録として保持する既存決定を維持。
* **2026-07-15 (v1.2追記)**: ハッシュタグ・メンションの抽出事実を反映。
  * IGCへ渡す抽出事実を、日本語コメント付きの完全なYAMLで定義。
  * 元表記、元投稿、元JSONを保持し、重複する正規化値を持たせない規則を追加。
  * ハッシュタグ・メンションの独立した抽出IDは設置せず、同一投稿内の繰り返しは元本文に保持し、同じWikiリンク先をUIで一つのカードとして扱う規則を追加。
  * IGCが設置するハッシュタグ・メンションの `## 情報` は共通仕様を正本とした。
* **2026-07-15 (v1.2追記)**: 位置観測と活動記録の関係を反映。
  * Location Synapseへ渡す位置観測を、日本語コメント付きの完全なYAMLで定義。
  * IGPの活動ID初期値、人間確認前の自動設定禁止、再実行時の保持規則を追加。
  * 活動の複数元ファイルと人間の記憶を位置観測へ重複保存しない参照契約を追加。
* **2026-07-06 (v1.1)**: 実データ反映版。
  * `posts.json` と `posts_1.json` の混在（構造A/B）およびパース・マージ仕様の定義。
  * 原本エントリ重複判定ルールの明確化（ベース名一意性の活用）。
  * 物理スクリプトの配置フォルダ名（`04_IGP移行_実行/`）への修正。
