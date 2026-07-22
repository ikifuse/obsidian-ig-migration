import hashlib
import json
import os
import re
import unicodedata
from datetime import datetime

from IGR_00_セッテイv1_1 import EVENTS_DIR, JST, LOGS_ROOT
from IGR_02_テキスト処理v1_1 import safe_filename


NOTE_KEYS = {
    "Synapse/Tag": "hashtag_note",
    "Synapse/Mention": "mention_note",
    "Synapse/Location": "location_note",
}
FORBIDDEN_CONTENT = {
    "Synapse/Tag": ("hashtag_extraction:", "IGR_HASHTAG_EXTRACTION"),
    "Synapse/Mention": ("mention_extraction:", "IGR_MENTION_EXTRACTION"),
    "Synapse/Location": ("location_observation:", "IGR_LOCATION_OBSERVATION"),
}
STORAGE_ASSIGNMENTS = {}
STORAGE_RESERVATIONS = {}


def yaml_scalar(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    return json.dumps(str(value), ensure_ascii=False)


def write_event_log(action, category, details):
    os.makedirs(EVENTS_DIR, exist_ok=True)
    now = datetime.now(JST)
    filepath = os.path.join(EVENTS_DIR, now.strftime("%Y-%m-%d_Events.jsonl"))
    event_data = {
        "timestamp": now.isoformat(),
        "action": action,
        "category": category,
        "details": details,
    }
    try:
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(json.dumps(event_data, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"[警告] イベントログ書き込み失敗: {e}")


def synapse_display_name(synapse_name, cat_tag, raw_value):
    if cat_tag in ("Synapse/Tag", "Synapse/Mention"):
        if raw_value is None:
            raise ValueError(f"{cat_tag}には元表記が必要です: {synapse_name}")
        return raw_value
    return synapse_name


def read_alias(filepath):
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for _ in range(6):
                line = f.readline()
                if not line:
                    break
                match = re.match(r"^aliases:\s*\[(.+)\]\s*$", line.strip())
                if not match:
                    continue
                scalar = match.group(1).strip()
                try:
                    return json.loads(scalar)
                except json.JSONDecodeError:
                    return scalar.strip('"')
    except OSError:
        return None
    return None


def resolve_synapse_storage_name(synapse_dir, synapse_name, cat_tag, raw_value=None):
    display_name = synapse_display_name(synapse_name, cat_tag, raw_value)
    assignment_key = (os.path.abspath(synapse_dir), cat_tag, display_name)
    if assignment_key in STORAGE_ASSIGNMENTS:
        return STORAGE_ASSIGNMENTS[assignment_key]
    storage_source = display_name
    if cat_tag == "Synapse/Tag" and storage_source.startswith(("#", "＃")):
        storage_source = storage_source[1:]
    base_name = safe_filename(storage_source) or "unnamed"
    base_path = os.path.join(synapse_dir, f"{base_name}.md")
    collision_key = (
        os.path.abspath(synapse_dir),
        cat_tag,
        unicodedata.normalize("NFD", base_name).casefold(),
    )
    if collision_key not in STORAGE_RESERVATIONS:
        STORAGE_RESERVATIONS[collision_key] = read_alias(base_path) or display_name
    if STORAGE_RESERVATIONS[collision_key] == display_name:
        storage_name = base_name
    else:
        digest = hashlib.sha256(f"{cat_tag}\0{display_name}".encode("utf-8")).hexdigest()[:12]
        storage_name = f"{base_name}--{digest}"
    STORAGE_ASSIGNMENTS[assignment_key] = storage_name
    return storage_name


def render_synapse_information(cat_tag, display_name, geo_lat=None, geo_lng=None):
    if cat_tag == "Synapse/Tag":
        return f"""```yaml
hashtag_note:                                 # ハッシュタグを人間が育てる欄
  hashtag: {yaml_scalar(display_name)}                   # 投稿から抽出されたハッシュタグ表記
  note: null                                  # 自由メモ
```"""

    if cat_tag == "Synapse/Mention":
        instagram_name = display_name[1:] if display_name.startswith(("@", "＠")) else display_name
        instagram_url = f"https://www.instagram.com/{instagram_name}/"
        return f"""```yaml
mention_note:                                 # 人・店舗・団体などを育てる欄
  mention: {yaml_scalar(display_name)}                   # 投稿から抽出された@表記
  name: null                                  # 実際の名前を人間が記入する欄
  phone: []                                   # 確認した電話番号を追加する欄
  web:                                        # メール・Webサイト・SNSなど
    - {yaml_scalar(instagram_url)}
                                               # @表記から生成したInstagram URL
  note: null                                  # 自由メモ
```"""

    if cat_tag != "Synapse/Location":
        raise ValueError(f"未対応のSynapseカテゴリです: {cat_tag}")

    return f"""```yaml
location_note:
  location: {yaml_scalar(display_name)}    # Instagramから抽出された場所名

geo:                               # 緯度・経度の座標
  lat: {yaml_scalar(geo_lat)}              # 緯度
  lng: {yaml_scalar(geo_lng)}             # 経度
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

activity_id: null                  # 活動をまとめる番号

source_files: []                   # 活動の元ファイル

note: null                         # 元ファイルから分からない人間の記憶
```"""


def synapse_card_errors(text, cat_tag, display_name, post_id=None):
    """人間入力値を解釈・変更せず、生成責任に属する構造だけを検証する。"""
    errors = []
    note_key = NOTE_KEYS[cat_tag]

    if f"aliases: [{yaml_scalar(display_name)}]" not in text:
        errors.append("aliasesが元表記と一致しない")
    if f"tags: [{cat_tag}]" not in text:
        errors.append("Synapseカテゴリが一致しない")
    if not re.search(rf"^# {re.escape(display_name)}$", text, flags=re.MULTILINE):
        errors.append("見出しが元表記と一致しない")
    if text.count(f"{note_key}:") != 1:
        errors.append(f"{note_key}が1件ではない")

    if cat_tag == "Synapse/Tag":
        required_patterns = (
            rf"^  hashtag:\s*{re.escape(yaml_scalar(display_name))}(?:\s+#.*)?$",
            r"^  note:\s*.*$",
        )
    elif cat_tag == "Synapse/Mention":
        required_patterns = (
            rf"^  mention:\s*{re.escape(yaml_scalar(display_name))}(?:\s+#.*)?$",
            r"^  name:\s*.*$",
            r"^  phone:\s*.*$",
            r"^  web:\s*.*$",
            r"^  note:\s*.*$",
        )
    else:
        required_patterns = (
            rf"^  location:\s*{re.escape(yaml_scalar(display_name))}(?:\s+#.*)?$",
            r"^geo:\s*.*$",
            r"^  lat:\s*.*$",
            r"^  lng:\s*.*$",
            r"^  alt:\s*.*$",
            r"^address:\s*.*$",
            r"^  full:\s*.*$",
            r"^  components:\s*.*$",
            r"^    country:\s*.*$",
            r"^    prefecture:\s*.*$",
            r"^    city:\s*.*$",
            r"^    district:\s*.*$",
            r"^    street:\s*.*$",
            r"^    postal_code:\s*.*$",
            r"^activity_id:\s*.*$",
            r"^source_files:\s*.*$",
            r"^note:\s*.*$",
        )

    for pattern in required_patterns:
        if not re.search(pattern, text, flags=re.MULTILINE):
            errors.append(f"必要項目がない: {pattern}")

    for forbidden in FORBIDDEN_CONTENT[cat_tag]:
        if forbidden in text:
            errors.append(f"旧形式が残っている: {forbidden}")

    if post_id is not None:
        if text.count("## 関連投稿") != 1:
            errors.append("関連投稿見出しが1件ではない")
        if f"[[{post_id}]]" not in text:
            errors.append(f"関連投稿に{post_id}がない")

    return errors


def validate_existing_synapse(filepath, cat_tag, display_name, post_id=None):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    errors = synapse_card_errors(text, cat_tag, display_name, post_id=post_id)
    if errors:
        raise ValueError(f"既存Synapseが現行仕様と一致しません: {filepath} ({'; '.join(errors)})")


def synapse_card_is_complete(filepath, cat_tag, display_name, post_id):
    if not os.path.exists(filepath):
        return False
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            text = f.read()
    except OSError:
        return False
    return not synapse_card_errors(text, cat_tag, display_name, post_id=post_id)


def append_related_post(filepath, post_id):
    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()
    post_link = f"[[{post_id}]]"
    if post_link in text:
        return
    if "## 関連投稿" not in text:
        updated = text.rstrip() + f"\n\n## 関連投稿\n\n{post_link}\n"
    else:
        updated = text.rstrip() + f"\n{post_link}\n"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(updated)


def append_to_global_synapse(
    synapse_dir,
    synapse_name,
    post_id,
    cat_tag,
    raw_value=None,
    geo_lat=None,
    geo_lng=None,
):
    display_name = synapse_display_name(synapse_name, cat_tag, raw_value)
    storage_name = resolve_synapse_storage_name(
        synapse_dir, synapse_name, cat_tag, raw_value=raw_value
    )
    filepath = os.path.join(synapse_dir, f"{storage_name}.md")

    if not os.path.exists(filepath):
        information = render_synapse_information(
            cat_tag, display_name, geo_lat=geo_lat, geo_lng=geo_lng
        )
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("---\n")
            f.write(f"aliases: [{yaml_scalar(display_name)}]\n")
            f.write(f"tags: [{cat_tag}]\n")
            f.write("---\n\n")
            f.write(f"# {display_name}\n\n")
            f.write(information + "\n")

    validate_existing_synapse(filepath, cat_tag, display_name)
    append_related_post(filepath, post_id)
    validate_existing_synapse(filepath, cat_tag, display_name, post_id=post_id)
    write_event_log("SYNAPSE_APPENDED", "SYNAPSE", {
        "synapse": display_name,
        "synapse_file": storage_name,
        "post_id": post_id,
        "category": cat_tag,
    })


def generate_global_synapse_indexes():
    print("\n>> 検証用のSynapse候補一覧（インデックス）を生成中...")
    global_systemlogs = os.path.join(LOGS_ROOT, "SystemLogs")
    os.makedirs(global_systemlogs, exist_ok=True)
    categories_data = {cat: {} for cat in NOTE_KEYS}

    if os.path.exists(EVENTS_DIR):
        for filename in os.listdir(EVENTS_DIR):
            if not filename.endswith(".jsonl"):
                continue
            filepath = os.path.join(EVENTS_DIR, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    for line in f:
                        if not line.strip():
                            continue
                        evt = json.loads(line)
                        if evt.get("action") != "SYNAPSE_APPENDED":
                            continue
                        details = evt.get("details", {})
                        cat = details.get("category")
                        post_id = details.get("post_id")
                        display_name = details.get("synapse")
                        storage_name = details.get("synapse_file")
                        if cat not in categories_data or not post_id or not display_name:
                            continue
                        storage_name = storage_name or safe_filename(display_name)
                        entry = categories_data[cat].setdefault(
                            storage_name, {"name": display_name, "posts": set()}
                        )
                        entry["name"] = display_name
                        entry["posts"].add(post_id)
            except Exception as e:
                print(f"[警告] イベントログ解析エラー ({filepath}): {e}")

    output_mapping = {
        "Synapse/Tag": ("ハッシュタグ一覧.md", "ハッシュタグ"),
        "Synapse/Mention": ("メンション一覧.md", "メンション"),
        "Synapse/Location": ("場所一覧.md", "場所"),
    }
    dir_mapping = {
        "Synapse/Tag": os.path.join(LOGS_ROOT, "Synapses", "Tags"),
        "Synapse/Mention": os.path.join(LOGS_ROOT, "Synapses", "Mentions"),
        "Synapse/Location": os.path.join(LOGS_ROOT, "Synapses", "Locations"),
    }

    for cat_tag, (filename, title) in output_mapping.items():
        out_filepath = os.path.join(global_systemlogs, filename)
        data_dict = categories_data[cat_tag]
        with open(out_filepath, "w", encoding="utf-8") as f:
            f.write(f"# {title}一覧 - リール検証用\n\n")
            f.write("初期状態で全て採用（`- [x]`）です。除外したい項目は `- [x]` を `- [ ]` にしてください。\n\n")
            sorted_items = sorted(
                data_dict.items(), key=lambda item: len(item[1]["posts"]), reverse=True
            )
            for storage_name, item in sorted_items:
                alias = read_alias(os.path.join(dir_mapping[cat_tag], f"{storage_name}.md"))
                name = alias or item["name"]
                f.write("---\n\n")
                f.write(f"- [x] [[{storage_name}|{name}]]\n")
                f.write(f"出現回数: {len(item['posts'])}回\n\n")
                f.write("出現投稿:\n")
                for pid in sorted(item["posts"]):
                    f.write(f"  - [[{pid}]]\n")
