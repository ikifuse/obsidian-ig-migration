import os
import json
import glob
import re
import hashlib
import unicodedata
from datetime import datetime
from collections import defaultdict
import IGP_00_セッテイv1_1 as config
import IGP_02_テキスト処理v1_1 as txt

ALIAS_RE = re.compile(r'^aliases:\s*\["(.+)"\]\s*$')

EXTRACTION_CONFIG = {
    "Synapse/Tag": "hashtag_note",
    "Synapse/Mention": "mention_note",
}

STORAGE_NAMES = {}

def yaml_scalar(value):
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    return json.dumps(str(value), ensure_ascii=False)

def filesystem_name_key(name):
    """macOSの大文字小文字・Unicode正規化を考慮した衝突判定キー。"""
    return unicodedata.normalize("NFD", name).casefold()

def prepare_synapse_storage_names(candidates):
    """通常は人間向け名を使い、物理名が衝突する表記だけを内部識別する。"""
    STORAGE_NAMES.clear()
    groups = defaultdict(dict)
    for cat_tag, synapse_name, raw_value in candidates:
        if cat_tag not in EXTRACTION_CONFIG:
            continue
        safe_name = txt.safe_filename(synapse_name)
        group_key = (cat_tag, filesystem_name_key(safe_name))
        groups[group_key][(synapse_name, raw_value)] = safe_name

    for (cat_tag, _), entries in groups.items():
        needs_internal_name = len(entries) > 1
        for (synapse_name, raw_value), safe_name in entries.items():
            if needs_internal_name:
                digest_source = f"{cat_tag}\0{raw_value}".encode("utf-8")
                digest = hashlib.sha256(digest_source).hexdigest()[:12]
                storage_name = f"{safe_name}--{digest}"
            else:
                storage_name = safe_name
            STORAGE_NAMES[(cat_tag, raw_value)] = storage_name

def synapse_storage_name(synapse_name, raw_value, cat_tag):
    """人間向け名を基本とし、macOSで衝突する表記だけ内部識別名を返す。"""
    safe_name = txt.safe_filename(synapse_name)
    if cat_tag not in EXTRACTION_CONFIG:
        return safe_name
    return STORAGE_NAMES.get((cat_tag, raw_value), safe_name)

def render_synapse_information(cat_tag, display_name, location_information=None):
    if cat_tag == "Synapse/Tag":
        return f"""```yaml
hashtag_note:                                 # ハッシュタグを人間が育てる欄
  hashtag: {yaml_scalar(display_name)}                         # 投稿から抽出されたハッシュタグ表記
  note: null                                  # 自由メモ
```"""

    if cat_tag == "Synapse/Mention":
        instagram_name = display_name
        if instagram_name.startswith(("@", "＠")):
            instagram_name = instagram_name[1:]
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

    if cat_tag != "Synapse/Location" or location_information is None:
        raise ValueError(f"Synapse情報を生成できません: {cat_tag} / {display_name}")

    geo = location_information["geo"]
    address = location_information["address"]
    components = address["components"]
    return f"""```yaml
location_note:
  location: {yaml_scalar(display_name)}    # Instagramから抽出された場所名

geo:                               # 緯度・経度の座標
  lat: {yaml_scalar(geo['lat'])}              # 緯度
  lng: {yaml_scalar(geo['lng'])}             # 経度
  alt: {yaml_scalar(geo['alt'])}                        # 高度

address:                           # 住所
  full: {yaml_scalar(address['full'])}                       # 住所全文
  components:                     # 住所の内訳
    country: {yaml_scalar(components['country'])}                  # 国
    prefecture: {yaml_scalar(components['prefecture'])}               # 都道府県
    city: {yaml_scalar(components['city'])}                     # 市区町村
    district: {yaml_scalar(components['district'])}                 # 地区
    street: {yaml_scalar(components['street'])}                   # 番地・通り
    postal_code: {yaml_scalar(components['postal_code'])}              # 郵便番号

activity_id: null                  # 活動をまとめる番号

source_files: []                   # 活動の元ファイル

note: null                         # 元ファイルから分からない人間の記憶
```"""

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

    if updated != text:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated)

def ensure_generated_identity(filepath, cat_tag, display_name):
    if cat_tag not in EXTRACTION_CONFIG:
        return

    with open(filepath, "r", encoding="utf-8") as f:
        text = f.read()

    updated = re.sub(
        r'^aliases:\s*\[.*\]\s*$',
        f"aliases: [{yaml_scalar(display_name)}]",
        text,
        count=1,
        flags=re.MULTILINE,
    )
    updated = re.sub(
        r'^# .+$',
        f"# {display_name}",
        updated,
        count=1,
        flags=re.MULTILINE,
    )
    identifier_key = "hashtag" if cat_tag == "Synapse/Tag" else "mention"
    identifier_comment = (
        "投稿から抽出されたハッシュタグ表記"
        if cat_tag == "Synapse/Tag"
        else "投稿から抽出された@表記"
    )
    updated = re.sub(
        rf'^  {identifier_key}:\s*.*$',
        f"  {identifier_key}: {yaml_scalar(display_name)}                   # {identifier_comment}",
        updated,
        count=1,
        flags=re.MULTILINE,
    )

    if updated != text:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(updated)

def write_event_log(target_period, action, category, details):
    events_dir = os.path.join(config.LOGS_ROOT, target_period, "SystemLogs", "Events")
    os.makedirs(events_dir, exist_ok=True)
    now = datetime.now(config.JST)
    filename = now.strftime("%Y-%m-%d_Events.jsonl")
    filepath = os.path.join(events_dir, filename)
    
    event_data = {
        "timestamp": now.isoformat(),
        "action": action,
        "category": category,
        "details": details
    }
    try:
        with open(filepath, "a", encoding="utf-8") as f:
            f.write(json.dumps(event_data, ensure_ascii=False) + "\n")
    except Exception as e:
        print(f"[警告] イベントログ書き込み失敗 ({target_period}): {e}")

def append_to_period_synapse(
    synapse_dir,
    synapse_name,
    post_id,
    target_period,
    cat_tag,
    location_information=None,
    raw_value=None,
):
    if cat_tag in EXTRACTION_CONFIG and raw_value is None:
        raise ValueError(f"{cat_tag}には元表記が必要です: {synapse_name}")
    if cat_tag == "Synapse/Location" and location_information is None:
        raise ValueError(f"Location Synapseには位置情報が必要です: {synapse_name}")
    safe_name = synapse_storage_name(synapse_name, raw_value, cat_tag)
    display_name = raw_value if cat_tag in EXTRACTION_CONFIG else synapse_name
    filepath = os.path.join(synapse_dir, f"{safe_name}.md")
    
    if not os.path.exists(filepath):
        information = render_synapse_information(
            cat_tag,
            display_name,
            location_information=location_information,
        )
        with open(filepath, "w", encoding="utf-8") as f:
            f.write("---\n")
            f.write(f"aliases: [{yaml_scalar(display_name)}]\n")
            f.write(f"tags: [{cat_tag}]\n")
            f.write("---\n\n")
            f.write(f"# {display_name}\n\n")
            f.write(information)
            f.write("\n")

    ensure_generated_identity(filepath, cat_tag, display_name)

    expected_note_key = EXTRACTION_CONFIG.get(cat_tag, "location_note")
    with open(filepath, "r", encoding="utf-8") as f:
        existing_text = f.read()
    if f"{expected_note_key}:" not in existing_text:
        raise ValueError(f"既存Synapseが現行仕様と一致しません: {filepath}")

    append_related_post(filepath, post_id)

    # イベントログの書き込み（一覧生成用のデータソースとして必須）
    write_event_log(target_period, "SYNAPSE_APPENDED", "SYNAPSE", {
        "synapse": display_name,
        "synapse_file": safe_name,
        "post_id": post_id,
        "category": cat_tag
    })

def load_canonical_synapse_names():
    canonical_names = {
        "Synapse/Tag": {},
        "Synapse/Mention": {},
        "Synapse/Location": {},
    }
    dir_mapping = {
        "Synapse/Tag": os.path.join(config.LOGS_ROOT, "Synapses", "Tags"),
        "Synapse/Mention": os.path.join(config.LOGS_ROOT, "Synapses", "Mentions"),
        "Synapse/Location": os.path.join(config.LOGS_ROOT, "Synapses", "Locations"),
    }

    for cat_tag, synapse_dir in dir_mapping.items():
        if not os.path.exists(synapse_dir):
            continue
        for filename in os.listdir(synapse_dir):
            if not filename.endswith(".md"):
                continue
            filepath = os.path.join(synapse_dir, filename)
            fallback_name = os.path.splitext(filename)[0]
            canonical_name = fallback_name
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    for _ in range(6):
                        line = f.readline()
                        if not line:
                            break
                        match = ALIAS_RE.match(line.strip())
                        if match:
                            canonical_name = match.group(1)
                            break
            except Exception:
                canonical_name = fallback_name

            canonical_key = txt.safe_filename(fallback_name).lower()
            canonical_names[cat_tag][canonical_key] = canonical_name

    return canonical_names

def generate_global_synapse_indexes():
    print("\n>> 全期間のイベントログから統合Synapse一覧（インデックス）を生成中...")
    global_systemlogs = os.path.join(config.LOGS_ROOT, "SystemLogs")
    os.makedirs(global_systemlogs, exist_ok=True)
    
    categories_data = {
        "Synapse/Tag": {},
        "Synapse/Mention": {},
        "Synapse/Location": {},
    }
    canonical_names = load_canonical_synapse_names()

    # 各期間フォルダ下のイベントログを探索
    for period_dir_name in os.listdir(config.LOGS_ROOT):
        period_path = os.path.join(config.LOGS_ROOT, period_dir_name)
        if not os.path.isdir(period_path): continue
        
        events_dir = os.path.join(period_path, "SystemLogs", "Events")
        if not os.path.exists(events_dir): continue
        
        for event_file in glob.glob(os.path.join(events_dir, "*_Events.jsonl")):
            try:
                with open(event_file, "r", encoding="utf-8") as f:
                    for line in f:
                        if not line.strip(): continue
                        evt = json.loads(line)
                        if evt.get("action") == "SYNAPSE_APPENDED":
                            details = evt.get("details", {})
                            synapse_name = details.get("synapse")
                            post_id = details.get("post_id")
                            cat = details.get("category", "Synapse/Tag")
                            synapse_file = details.get("synapse_file")
                            if synapse_name and post_id:
                                if not synapse_file:
                                    canonical_key = txt.safe_filename(synapse_name).lower()
                                    canonical_name = canonical_names.get(cat, {}).get(canonical_key, synapse_name)
                                    synapse_file = txt.safe_filename(canonical_name)
                                canonical_key = txt.safe_filename(synapse_file).lower()
                                display_name = canonical_names.get(cat, {}).get(canonical_key, synapse_name)
                                entry = categories_data[cat].setdefault(
                                    synapse_file,
                                    {"name": display_name, "posts": set()},
                                )
                                entry["name"] = display_name
                                entry["posts"].add(post_id)
            except Exception as e:
                print(f"[警告] イベントログ解析エラー ({event_file}): {e}")

    output_mapping = {
        "Synapse/Tag": ("ハッシュタグ一覧.md", "ハッシュタグ一覧"),
        "Synapse/Mention": ("メンション一覧.md", "メンション一覧"),
        "Synapse/Location": ("場所一覧.md", "場所一覧")
    }

    for cat_tag, (filename, title) in output_mapping.items():
        data_dict = categories_data[cat_tag]
        out_filepath = os.path.join(global_systemlogs, filename)
        with open(out_filepath, "w", encoding="utf-8") as f:
            f.write(f"# {title} - 全期間統合\n\n")
            f.write("初期状態で全て採用（`- [x]`）です。除外したい項目は `- [x]` を `- [ ]` にしてください。\n\n")
            
            sorted_items = sorted(
                data_dict.items(),
                key=lambda item: len(item[1]["posts"]),
                reverse=True,
            )
            for synapse_file, item in sorted_items:
                name = item["name"]
                posts = item["posts"]
                f.write("---\n\n")
                f.write(f"- [x] [[{synapse_file}|{name}]]\n")
                f.write(f"出現回数: {len(posts)}回\n\n")
                f.write("出現投稿:\n")
                for pid in sorted(list(posts)):
                    f.write(f"  - [[{pid}]]\n")
