import os
import glob
import json
import re
import sys
from datetime import datetime

from IGX_00_セッテイv1_1 import (
    POSTS_JSON_DIR, STATE_FILE, LOGS_ROOT, DEST_RAW_DIR, DEST_SALVAGE_DIR, DEST_MEDIA_DIR, 
    GLOBAL_SYNAPSES_TAGS, GLOBAL_SYNAPSES_MENTIONS, GLOBAL_SYNAPSES_LOCATIONS, JST
)
from IGX_02_テキスト処理v1_1 import (
    fix_mojibake, safe_filename, clean_tag_or_mention, extract_emojis
)
from IGX_03_メディア処理v1_1 import (
    build_media_index, find_media_file, extract_media_recursively, copy_media_file
)
from IGX_04_マークダウン生成v1_1 import generate_4layer_yaml
from IGX_05_シナプス管理v1_1 import (
    write_event_log, append_to_global_synapse, generate_global_synapse_indexes,
    resolve_synapse_storage_name,
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

def salvage_is_complete(md_path, raw_path, post_id, date_iso, expected_media, synapse_paths, tags, mentions, links, geo_lat, geo_lng):
    if not os.path.exists(raw_path):
        return False
    if any(not os.path.exists(os.path.join(DEST_MEDIA_DIR, name)) for name in expected_media):
        return False
    if any(path and not os.path.exists(path) for path in synapse_paths):
        return False
    return existing_markdown_matches(
        md_path, post_id, date_iso, tags, mentions, links, geo_lat, geo_lng
    )

def extract_all_posts(data):
    posts = []
    if isinstance(data, dict):
        if "timestamp" in data or "creation_timestamp" in data:
            posts.append(data)
        else:
            for val in data.values():
                posts.extend(extract_all_posts(val))
    elif isinstance(data, list):
        for item in data:
            posts.extend(extract_all_posts(item))
    return posts

def main():
    print("=== Instagram Salvage → Obsidian (期間分割なしフラット構造) v1_1 ===")
    
    if not os.path.exists(POSTS_JSON_DIR):
        print(f"[致命的エラー] ディレクトリ {POSTS_JSON_DIR} が存在しません。")
        return 1

    json_files = glob.glob(os.path.join(POSTS_JSON_DIR, "*.json"))
    if not json_files:
        print(f"[致命的エラー] {POSTS_JSON_DIR} に JSONファイルが見つかりません。")
        return 1

    exclude_patterns = ["posts", "stories", "reels"]
    target_files = []
    for jf in json_files:
        basename_lower = os.path.basename(jf).lower()
        if any(p in basename_lower for p in exclude_patterns):
            continue
        target_files.append(jf)

    if not target_files:
        print("✅ サルベージ対象の独立JSONファイル（IGTV/アーカイブ等）はありません。")
        return 0

    state = load_state()
    
    os.makedirs(DEST_RAW_DIR, exist_ok=True)
    os.makedirs(DEST_SALVAGE_DIR, exist_ok=True)
    os.makedirs(DEST_MEDIA_DIR, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_TAGS, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_MENTIONS, exist_ok=True)
    os.makedirs(GLOBAL_SYNAPSES_LOCATIONS, exist_ok=True)

    raw_data = []
    print(f">> {len(target_files)} 個のJSONファイルを探索しています...")
    for json_file in target_files:
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                posts = extract_all_posts(data)
                if posts:
                    raw_data.extend((json_file, post) for post in posts)
                    print(f"  - {os.path.basename(json_file)}: {len(posts)}件のエントリを抽出")
        except Exception as e:
            print(f"[致命的エラー] {os.path.basename(json_file)} の読み込みに失敗しました: {e}")
            return 1

    valid_posts = []
    for i, (source_json, post) in enumerate(raw_data):
        post_fixed = fix_mojibake(post)
        ts = get_post_timestamp(post_fixed)
        if ts != 0:
            valid_posts.append((i, source_json, post_fixed))
            
    valid_posts.sort(key=lambda x: get_post_timestamp(x[2]))
    
    if not valid_posts:
        print("✅ 処理すべきサルベージエントリが存在しません。")
        return 0

    build_media_index()

    print(f"\n🚀 処理開始: 合計 {len(valid_posts)}件のサルベージデータ")
    
    success_count = 0
    skip_count = 0
    error_count = 0
    repaired_count = 0
    warning_count = 0
    
    timeline_entries = []
    
    for original_index, source_json, post_fixed in valid_posts:
        try:
            ts = get_post_timestamp(post_fixed)
            dt = datetime.fromtimestamp(ts, tz=JST)
            date_iso = dt.isoformat() 
            file_date_str = dt.strftime("%Y-%m-%d-%H-%M-%S")
            post_id = f"{file_date_str}_IGX_{original_index+1:03d}"
            md_filepath = os.path.join(DEST_SALVAGE_DIR, f"{post_id}.md")
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

            geo_lat = post_fixed.get("latitude")
            geo_lng = post_fixed.get("longitude")
            if geo_lat is None or geo_lng is None:
                for media_item in raw_media:
                    if not isinstance(media_item, dict):
                        continue
                    candidate_lat = media_item.get("latitude")
                    candidate_lng = media_item.get("longitude")
                    if candidate_lat is not None and candidate_lng is not None:
                        geo_lat = candidate_lat
                        geo_lng = candidate_lng
                        break
                    metadata = media_item.get("media_metadata", {})
                    for metadata_key in ("photo_metadata", "video_metadata"):
                        metadata_value = metadata.get(metadata_key, {})
                        if not isinstance(metadata_value, dict):
                            continue
                        for exif_item in metadata_value.get("exif_data", []):
                            if not isinstance(exif_item, dict):
                                continue
                            if "latitude" in exif_item and "longitude" in exif_item:
                                geo_lat = exif_item["latitude"]
                                geo_lng = exif_item["longitude"]
                                break
                        if geo_lat is not None and geo_lng is not None:
                            break
                    if geo_lat is not None and geo_lng is not None:
                        break

            caption = ""
            loc_name = ""
            
            if "title" in post_fixed:
                caption = post_fixed["title"]
            
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
            synapse_paths = [
                os.path.join(
                    GLOBAL_SYNAPSES_TAGS,
                    f"{resolve_synapse_storage_name(GLOBAL_SYNAPSES_TAGS, entry['name'], 'Synapse/Tag', entry['raw'])}.md",
                )
                for entry in tag_entries
            ]
            synapse_paths.extend(
                os.path.join(
                    GLOBAL_SYNAPSES_MENTIONS,
                    f"{resolve_synapse_storage_name(GLOBAL_SYNAPSES_MENTIONS, entry['name'], 'Synapse/Mention', entry['raw'])}.md",
                )
                for entry in mention_entries
            )
            if loc_name_safe:
                synapse_paths.append(os.path.join(GLOBAL_SYNAPSES_LOCATIONS, f"{loc_name_safe}.md"))

            caption_preview = caption.replace('\n', ' ')[:30] if caption else "無題"
            if len(caption) > 30:
                caption_preview += "..."

            if salvage_is_complete(
                md_filepath,
                json_filepath,
                post_id,
                date_iso,
                expected_media,
                synapse_paths,
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
                    raise ValueError(f"既存Salvageメモが原本識別情報と一致しません: {md_filepath}")
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
            has_video = False
            for idx, media_item in enumerate(raw_media):
                uri = media_item.get("uri", "")
                if not uri or uri in seen_uris: continue
                seen_uris.add(uri)
                ext = os.path.splitext(uri)[1].lower()
                if ext in [".mp4", ".mov", ".m4v"]:
                    has_video = True
                
                copied_name, copied = copy_media_file(uri, post_id, idx, write_event_log)
                if copied_name:
                    copied_media_names.append(copied_name)
                elif os.path.splitext(uri)[1].lower() == ".srt":
                    warning_count += 1
                    write_event_log("SUBTITLE_NOT_FOUND", "WARNING", {
                        "post_id": post_id,
                        "source_json": os.path.basename(source_json),
                        "uri": uri,
                    })
                else:
                    raise FileNotFoundError(f"Salvage参照メディアが見つかりません: {uri}")

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
                "content_type": "video" if has_video else None,
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
                out.write("[[Instagram]]\n\n")
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
            print(f"[警告] サルベージ処理エラー (インデックス: {original_index}): {e}")
            write_event_log("SALVAGE_PROCESSING_ERROR", "ERROR", {
                "index": original_index,
                "source_json": os.path.basename(source_json),
                "error": str(e),
            })
    
    timeline_filepath = os.path.join(DEST_SALVAGE_DIR, "Salvage_Timeline.md")
    with open(timeline_filepath, "w", encoding="utf-8") as f:
        f.write("# Salvage Timeline\n\n")
        if not timeline_entries:
            f.write("投稿はありません。\n")
        else:
            for entry in timeline_entries:
                f.write(entry + "\n")
    
    completed = error_count == 0
    write_event_log("SALVAGE_MIGRATION_COMPLETE", "SYSTEM", {
        "success": success_count,
        "skip": skip_count,
        "repaired": repaired_count,
        "warning": warning_count,
        "error": error_count,
        "completed": completed,
        "source_json_files": [os.path.basename(path) for path in target_files],
    })
    print(
        f"   -> 完了判定: {'完了' if completed else '未完了'} "
        f"(生成: {success_count}, 再補修: {repaired_count}, スキップ: {skip_count}, "
        f"警告: {warning_count}, エラー: {error_count})"
    )

    state["run_count"] = state.get("run_count", 0) + 1
    state["last_run"] = datetime.now(JST).isoformat()
    state["completed"] = completed
    save_state(state)
    
    generate_global_synapse_indexes()

    if not completed:
        print(f"\n[未完了] Salvage処理エラーが {error_count} 件あります。")
        return 1

    print("\n🎉 サルベージデータの移行処理が完了しました！")
    return 0

if __name__ == "__main__":
    sys.exit(main())
