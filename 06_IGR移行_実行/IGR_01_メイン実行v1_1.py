import os
import glob
import json
import re
import sys
from datetime import datetime

from IGR_00_セッテイv1_1 import (
    POSTS_JSON_DIR, STATE_FILE, LOGS_ROOT, DEST_REELS_DIR, DEST_MEDIA_DIR, 
    DEST_RAW_DIR, GLOBAL_SYNAPSES_TAGS, GLOBAL_SYNAPSES_MENTIONS, 
    GLOBAL_SYNAPSES_LOCATIONS, JST
)
from IGR_02_テキスト処理v1_1 import (
    safe_filename, fix_mojibake, clean_tag_or_mention, extract_emojis
)
from IGR_03_メディア処理v1_1 import (
    build_media_index, extract_media_recursively, copy_media_file
)
from IGR_04_マークダウン生成v1_1 import generate_4layer_yaml
from IGR_05_シナプス管理v1_1 import (
    write_event_log, append_to_global_synapse, generate_global_synapse_indexes,
    resolve_synapse_storage_name, synapse_card_is_complete,
)

def get_post_timestamp(post):
    if "timestamp" in post: return post["timestamp"]
    if "creation_timestamp" in post: return post["creation_timestamp"]
    if "media" in post and isinstance(post["media"], list) and len(post["media"]) > 0:
        if "creation_timestamp" in post["media"][0]:
            return post["media"][0]["creation_timestamp"]
    return 0

def load_state():
    if os.path.exists(STATE_FILE):
        try:
            with open(STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {"run_count": 0}
    return {"run_count": 0}

def save_state(state):
    os.makedirs(LOGS_ROOT, exist_ok=True)
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def raw_data_matches(path, expected):
    if not os.path.exists(path):
        return False
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f) == expected
    except Exception:
        return False

def write_raw_data(path, expected):
    if os.path.exists(path):
        if not raw_data_matches(path, expected):
            raise ValueError(f"既存RawDataが原本と一致しません: {path}")
        return
    with open(path, "w", encoding="utf-8") as json_out:
        json.dump(expected, json_out, ensure_ascii=False, indent=2)

def expected_media_outputs(post_id, raw_media):
    outputs = []
    seen_uris = set()
    for idx, media_item in enumerate(raw_media):
        uri = media_item.get("uri", "") if isinstance(media_item, dict) else str(media_item)
        if not uri or uri in seen_uris:
            continue
        seen_uris.add(uri)
        ext = os.path.splitext(uri)[1].lower() or ".jpg"
        if ext == ".srt":
            continue
        media_type = "photo" if ext in [".jpg", ".jpeg", ".png", ".webp"] else "video"
        outputs.append(f"{post_id}_{media_type}_{idx+1:03d}{ext}")
    return outputs

def existing_markdown_matches(path, post_id, date_iso, tags, mentions, links, geo_lat, geo_lng):
    if not os.path.exists(path):
        return False
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception:
        return False
    required = [
        f'id: "{post_id}"',
        f'date: "{date_iso}"',
        f'raw_source_path: "[[{post_id}.json]]"',
    ]
    required.extend(f'  - "{tag}"' for tag in tags)
    required.extend(f'  - "@{mention}"' for mention in mentions)
    required.extend(f'  - "{link}"' for link in links)
    if geo_lat is not None:
        required.append(f"    lat: {geo_lat}")
    if geo_lng is not None:
        required.append(f"    lng: {geo_lng}")
    return all(value in text for value in required)

def markdown_identity_matches(path, post_id, date_iso):
    if not os.path.exists(path):
        return True
    try:
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception:
        return False
    return (
        f'id: "{post_id}"' in text
        and f'date: "{date_iso}"' in text
        and f'raw_source_path: "[[{post_id}.json]]"' in text
    )

def reel_is_complete(md_path, raw_path, post_id, date_iso, expected_media, synapse_expectations, tags, mentions, links, geo_lat, geo_lng):
    if not os.path.exists(raw_path):
        return False
    if any(not os.path.exists(os.path.join(DEST_MEDIA_DIR, name)) for name in expected_media):
        return False
    if any(
        not synapse_card_is_complete(path, cat_tag, display_name, post_id)
        for path, cat_tag, display_name in synapse_expectations
    ):
        return False
    return existing_markdown_matches(
        md_path, post_id, date_iso, tags, mentions, links, geo_lat, geo_lng
    )

def main():
    print("=== Instagram Reels → Obsidian (期間分割なしフラット構造) v1_1 ===")
    
    if not os.path.exists(POSTS_JSON_DIR):
        print(f"[致命的エラー] ディレクトリ {POSTS_JSON_DIR} が存在しません。")
        return 1

    json_files = glob.glob(os.path.join(POSTS_JSON_DIR, "reels*.json"))
    if not json_files:
        print(f"[致命的エラー] {POSTS_JSON_DIR} に reels*.json が見つかりません。")
        return 1

    state = load_state()
    
    os.makedirs(DEST_REELS_DIR, exist_ok=True)
    os.makedirs(DEST_MEDIA_DIR, exist_ok=True)
    os.makedirs(DEST_RAW_DIR, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_TAGS, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_MENTIONS, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_LOCATIONS, exist_ok=True)

    raw_data = []
    print(f">> {len(json_files)} 個のJSONファイル (reels*.json) を結合しています...")
    for json_file in json_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    raw_data.extend(data)
                    print(f"  - {os.path.basename(json_file)}: {len(data)}件読み込み")
                elif isinstance(data, dict):
                    if "ig_reels_media" in data:
                        raw_data.extend(data["ig_reels_media"])
                        print(f"  - {os.path.basename(json_file)}: {len(data['ig_reels_media'])}件読み込み")
                    elif "media" in data:
                        raw_data.extend(data["media"])
                        print(f"  - {os.path.basename(json_file)}: {len(data['media'])}件読み込み")
                    else:
                        print(f"[致命的エラー] 未知のJSON構造です: {os.path.basename(json_file)}")
                        return 1
        except Exception as e:
            print(f"[致命的エラー] {os.path.basename(json_file)} の読み込みに失敗しました: {e}")
            return 1

    valid_reels = []
    for i, post in enumerate(raw_data):
        post_fixed = fix_mojibake(post)
        ts = get_post_timestamp(post_fixed)
        if ts != 0:
            valid_reels.append((i, post_fixed))
            
    valid_reels.sort(key=lambda x: get_post_timestamp(x[1]))
    
    if not valid_reels:
        print("✅ 処理すべきリールデータが存在しません。")
        return 0

    build_media_index()

    print(f"\n🚀 処理開始: 合計 {len(valid_reels)}件のリールデータ")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    repaired_count = 0
    
    timeline_entries = []
    
    for original_index, post_fixed in valid_reels:
        try:
            ts = get_post_timestamp(post_fixed)
            dt = datetime.fromtimestamp(ts, tz=JST)
            date_iso = dt.isoformat() 
            file_date_str = dt.strftime("%Y-%m-%d-%H-%M-%S")
            post_id = f"{file_date_str}_IGR_{original_index+1:03d}"
            md_filepath = os.path.join(DEST_REELS_DIR, f"{post_id}.md")
            json_filepath = os.path.join(DEST_RAW_DIR, f"{post_id}.json")

            write_raw_data(json_filepath, post_fixed)

            raw_media = extract_media_recursively(post_fixed)
            ig_id = ""
            original_filename = ""
            if raw_media:
                uri = raw_media[0].get("uri", "")
                ig_id = os.path.basename(uri).split(".")[0]
                original_filename = os.path.basename(uri)
            if not ig_id:
                ig_id = f"ig_{ts}_{original_index+1}"

            geo_lat = post_fixed.get("latitude", None)
            geo_lng = post_fixed.get("longitude", None)

            # media 内の要素を走査してフォールバック取得
            if geo_lat is None or geo_lng is None:
                media_items = post_fixed.get("media", [])
                if isinstance(media_items, list):
                    for m_item in media_items:
                        if not isinstance(m_item, dict): continue
                        geo_lat = m_item.get("latitude", None)
                        geo_lng = m_item.get("longitude", None)
                        if geo_lat is not None and geo_lng is not None:
                            break
                        
                        # exif_data の探索
                        metadata = m_item.get("media_metadata", {})
                        exif_list = []
                        if "video_metadata" in metadata and isinstance(metadata["video_metadata"], dict):
                            exif_list = metadata["video_metadata"].get("exif_data", [])
                        elif "photo_metadata" in metadata and isinstance(metadata["photo_metadata"], dict):
                            exif_list = metadata["photo_metadata"].get("exif_data", [])
                        
                        if isinstance(exif_list, list):
                            found = False
                            for exif_item in exif_list:
                                if isinstance(exif_item, dict) and "latitude" in exif_item and "longitude" in exif_item:
                                    geo_lat = exif_item["latitude"]
                                    geo_lng = exif_item["longitude"]
                                    found = True
                                    break
                            if found:
                                break

            caption = ""
            loc_name = ""
            
            if "media" in post_fixed and isinstance(post_fixed["media"], list) and len(post_fixed["media"]) > 0:
                media_titles = []
                for media_item in post_fixed["media"]:
                    if not isinstance(media_item, dict):
                        continue
                    title = media_item.get("title", "")
                    if title and title not in media_titles:
                        media_titles.append(title)
                if media_titles:
                    caption = "\n\n".join(media_titles)
            
            label_values = post_fixed.get("label_values")
            if isinstance(label_values, list):
                for item in label_values:
                    if not isinstance(item, dict): continue
                    if item.get("label") == "キャプション" and not caption:
                        caption = item.get("value", "")
                    if item.get("title") == "スポット":
                        for dict_item in item.get("dict", []):
                            if not isinstance(dict_item, dict): continue
                            for sub_item in dict_item.get("dict", []):
                                if not isinstance(sub_item, dict): continue
                                if sub_item.get("label") == "名前":
                                    loc_name = sub_item.get("value", "")

            caption = fix_mojibake(caption)
            caption = caption.replace("％", "%").replace("＃", "#").replace("＠", "@")
            loc_name_safe = safe_filename(loc_name) if loc_name else ""
            
            raw_tags = re.findall(r'#[\S\u3000]+', caption)
            tag_entries = [
                {"raw": raw, "name": clean_tag_or_mention(raw)}
                for raw in raw_tags
                if clean_tag_or_mention(raw)
            ]
            
            # Instagram usernames use ASCII letters, digits, underscores, and dots.
            # If Japanese text continues immediately after "@name", treat it as
            # body text or a mistyped hashtag rather than an account mention.
            raw_mentions = []
            for match in re.finditer(r'@([A-Za-z0-9._]+)', caption):
                next_char = caption[match.end():match.end() + 1]
                if next_char and re.match(r'[\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff]', next_char):
                    continue
                raw_mentions.append("@" + match.group(1))
            mention_entries = [
                {"raw": raw, "name": clean_tag_or_mention(raw)}
                for raw in raw_mentions
                if clean_tag_or_mention(raw)
            ]

            tag_entries = list({(entry["name"], entry["raw"]): entry for entry in tag_entries}.values())
            mention_entries = list({(entry["name"], entry["raw"]): entry for entry in mention_entries}.values())
            tags = sorted({entry["name"] for entry in tag_entries})
            mentions = sorted({entry["name"] for entry in mention_entries})

            links = ["[[instagram]]"]
            links.extend(
                f"[[{resolve_synapse_storage_name(GLOBAL_SYNAPSES_TAGS, entry['name'], 'Synapse/Tag', entry['raw'])}|{entry['raw']}]]"
                for entry in tag_entries
            )
            links.extend(
                f"[[{resolve_synapse_storage_name(GLOBAL_SYNAPSES_MENTIONS, entry['name'], 'Synapse/Mention', entry['raw'])}|{entry['raw']}]]"
                for entry in mention_entries
            )
            if loc_name_safe:
                links.append(f"[[{loc_name_safe}]]")

            expected_media = expected_media_outputs(post_id, raw_media)
            synapse_expectations = [
                (
                    os.path.join(
                        GLOBAL_SYNAPSES_TAGS,
                        f"{resolve_synapse_storage_name(GLOBAL_SYNAPSES_TAGS, entry['name'], 'Synapse/Tag', entry['raw'])}.md",
                    ),
                    "Synapse/Tag",
                    entry["raw"],
                )
                for entry in tag_entries
            ]
            synapse_expectations.extend(
                (
                    os.path.join(
                        GLOBAL_SYNAPSES_MENTIONS,
                        f"{resolve_synapse_storage_name(GLOBAL_SYNAPSES_MENTIONS, entry['name'], 'Synapse/Mention', entry['raw'])}.md",
                    ),
                    "Synapse/Mention",
                    entry["raw"],
                )
                for entry in mention_entries
            )
            if loc_name_safe:
                synapse_expectations.append(
                    (
                        os.path.join(GLOBAL_SYNAPSES_LOCATIONS, f"{loc_name_safe}.md"),
                        "Synapse/Location",
                        loc_name,
                    )
                )

            caption_preview = caption.replace('\n', ' ')[:30] if caption else "無題"
            if len(caption) > 30:
                caption_preview += "..."

            if reel_is_complete(
                md_filepath,
                json_filepath,
                post_id,
                date_iso,
                expected_media,
                synapse_expectations,
                tags,
                mentions,
                links,
                geo_lat,
                geo_lng,
            ):
                skip_count += 1
                timeline_entries.append(f"- [[{post_id}]] : {caption_preview}")
                continue

            if os.path.exists(md_filepath):
                if not markdown_identity_matches(md_filepath, post_id, date_iso):
                    raise ValueError(f"既存Reelメモが原本識別情報と一致しません: {md_filepath}")
                repaired_count += 1

            for entry in tag_entries:
                append_to_global_synapse(
                    GLOBAL_SYNAPSES_TAGS, entry["name"], post_id, "Synapse/Tag", raw_value=entry["raw"]
                )
            for entry in mention_entries:
                append_to_global_synapse(
                    GLOBAL_SYNAPSES_MENTIONS, entry["name"], post_id, "Synapse/Mention", raw_value=entry["raw"]
                )
            if loc_name_safe:
                append_to_global_synapse(
                    GLOBAL_SYNAPSES_LOCATIONS,
                    loc_name,
                    post_id,
                    "Synapse/Location",
                    geo_lat=geo_lat,
                    geo_lng=geo_lng,
                )

            orig_emojis, norm_emojis = extract_emojis(caption)

            copied_media_names = []
            seen_uris = set()
            for idx, media_item in enumerate(raw_media):
                uri = media_item.get("uri", "")
                if not uri or uri in seen_uris: continue
                seen_uris.add(uri)
                
                copied_name, copied = copy_media_file(uri, post_id, idx, write_event_log)
                if copied_name:
                    copied_media_names.append(copied_name)
                elif os.path.splitext(uri)[1].lower() == ".srt":
                    write_event_log("SUBTITLE_NOT_FOUND", "WARNING", {"post_id": post_id, "uri": uri})
                else:
                    raise FileNotFoundError(f"Reel参照メディアが見つかりません: {uri}")

            p_info = {
                "post_id": post_id,
                "instagram_id": ig_id,
                "original_filename": original_filename,
                "timestamp": ts,
                "date_iso": date_iso,
                "loc_name_raw": loc_name,
                "loc_name": loc_name_safe,
                "geo_lat": geo_lat,
                "geo_lng": geo_lng,
                "tags_normalized": tags,
                "mentions": ["@" + m for m in mentions],
                "links": links,
                "emoji_original": orig_emojis,
                "emoji_normalized": norm_emojis,
                "media_count": len(copied_media_names),
                "media_list": copied_media_names,
                "post_raw": post_fixed
            }

            yaml_header = generate_4layer_yaml(p_info)
            
            with open(md_filepath, "w", encoding="utf-8") as out:
                out.write(yaml_header + "\n\n")
                out.write("[[instagram]]\n\n")
                out.write(f"{caption}\n\n")
                
                for m_name in copied_media_names:
                    out.write(f"![[{m_name}]]\n\n")
                
                if links:
                    out.write("---\n")
                    out.write(" ".join(links) + "\n")
            
            timeline_entries.append(f"- [[{post_id}]] : {caption_preview}")
            
            success_count += 1

        except Exception as e:
            error_count += 1
            print(f"[警告] 投稿処理エラー (インデックス: {original_index}): {e}")
            write_event_log("REEL_PROCESSING_ERROR", "ERROR", {"index": original_index, "error": str(e)})
    
    timeline_filepath = os.path.join(DEST_REELS_DIR, "Reels_Timeline.md")
    with open(timeline_filepath, "w", encoding="utf-8") as f:
        f.write("# Reels Timeline\n\n")
        if not timeline_entries:
            f.write("投稿はありません。\n")
        else:
            for entry in timeline_entries:
                f.write(entry + "\n")
    
    completed = error_count == 0
    write_event_log("REELS_MIGRATION_COMPLETE", "SYSTEM", {
        "success": success_count,
        "skip": skip_count,
        "repaired": repaired_count,
        "error": error_count,
        "completed": completed,
        "source_json_files": [os.path.basename(path) for path in json_files],
    })
    print(
        f"   -> 完了判定: {'完了' if completed else '未完了'} "
        f"(生成: {success_count}, 再補修: {repaired_count}, スキップ: {skip_count}, エラー: {error_count})"
    )

    state["run_count"] = state.get("run_count", 0) + 1
    state["last_run"] = datetime.now(JST).isoformat()
    state["completed"] = completed
    save_state(state)
    
    generate_global_synapse_indexes()

    if not completed:
        print(f"\n[未完了] Reel処理エラーが {error_count} 件あります。")
        return 1

    print("\n🎉 リールデータの移行処理が完了しました！")
    return 0

if __name__ == "__main__":
    sys.exit(main())
