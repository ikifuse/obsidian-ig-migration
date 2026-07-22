import json
import os
import shutil
from datetime import datetime
from collections import defaultdict
import sys

import IGP_00_セッテイv1_1 as config
import IGP_02_テキスト処理v1_1 as txt
import IGP_03_メディア処理v1_1 as media
import IGP_04_マークダウン生成v1_1 as md
import IGP_05_シナプス管理v1_1 as synapse

def get_period(timestamp):
    dt = datetime.fromtimestamp(timestamp, tz=config.JST)
    half = "前半" if dt.month <= 6 else "後半"
    return f"{dt.year}_{half}"

def load_state():
    if os.path.exists(config.STATE_FILE):
        try:
            with open(config.STATE_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except:
            return {"completed_periods": []}
    return {"completed_periods": []}

def save_state(state):
    os.makedirs(config.LOGS_ROOT, exist_ok=True)
    with open(config.STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

def extract_captions_from_post(post_fixed, is_structure_b):
    if is_structure_b:
        title = post_fixed.get("title", "")
        return [title] if isinstance(title, str) and title else []

    captions = []
    label_values = post_fixed.get("label_values")
    if not isinstance(label_values, list):
        return captions
    for item in label_values:
        if not isinstance(item, dict):
            continue
        if item.get("label") == "キャプション":
            value = item.get("value", "")
            if isinstance(value, str):
                captions.append(value)
    return captions

def extract_location_name(post_fixed):
    label_values = post_fixed.get("label_values")
    if not isinstance(label_values, list):
        return ""
    for item in label_values:
        if not isinstance(item, dict) or item.get("title") != "スポット":
            continue
        for dict_item in item.get("dict", []):
            if not isinstance(dict_item, dict):
                continue
            for sub_item in dict_item.get("dict", []):
                if not isinstance(sub_item, dict):
                    continue
                if sub_item.get("label") == "名前":
                    value = sub_item.get("value", "")
                    if isinstance(value, str):
                        return value
    return ""

def build_expected_media_outputs(post_id, raw_media):
    expected_files = []
    seen_uris = set()
    for idx, media_item in enumerate(raw_media):
        uri = media_item.get("uri", "")
        if not uri or uri in seen_uris:
            continue
        seen_uris.add(uri)
        ext = os.path.splitext(uri)[1].lower() or ".jpg"
        media_type = "photo" if ext in [".jpg", ".jpeg", ".png", ".webp"] else "video"
        expected_files.append(f"{post_id}_{media_type}_{idx+1:03d}{ext}")
    return expected_files

def extract_geo_coordinates(post_fixed, raw_media):
    geo_lat = post_fixed.get("latitude")
    geo_lng = post_fixed.get("longitude")
    if geo_lat is not None and geo_lng is not None:
        return geo_lat, geo_lng

    for media_item in raw_media:
        if not isinstance(media_item, dict):
            continue
        media_lat = media_item.get("latitude")
        media_lng = media_item.get("longitude")
        if media_lat is not None and media_lng is not None:
            return media_lat, media_lng

        metadata = media_item.get("media_metadata", {})
        exif_list = []
        if isinstance(metadata.get("video_metadata"), dict):
            exif_list = metadata["video_metadata"].get("exif_data", [])
        elif isinstance(metadata.get("photo_metadata"), dict):
            exif_list = metadata["photo_metadata"].get("exif_data", [])
        for exif_item in exif_list if isinstance(exif_list, list) else []:
            if not isinstance(exif_item, dict):
                continue
            if exif_item.get("latitude") is not None and exif_item.get("longitude") is not None:
                return exif_item["latitude"], exif_item["longitude"]
    return geo_lat, geo_lng

def build_location_information(geo_lat, geo_lng):
    return {
        "geo": {"lat": geo_lat, "lng": geo_lng, "alt": None},
        "address": {
            "full": None,
            "components": {
                "country": None,
                "prefecture": None,
                "city": None,
                "district": None,
                "street": None,
                "postal_code": None,
            },
        },
    }

def existing_markdown_matches(md_filepath, expected_tags, expected_mentions, expected_links, loc_name_raw):
    if not os.path.exists(md_filepath):
        return False
    try:
        with open(md_filepath, "r", encoding="utf-8") as f:
            text = f.read()
    except Exception:
        return False

    for tag in expected_tags:
        if f'  - "{tag}"' not in text:
            return False
    for mention in expected_mentions:
        if f'  - "{mention}"' not in text:
            return False
    for link in expected_links:
        if f'  - "{link}"' not in text:
            return False

    expected_loc_raw = f'  raw: "{loc_name_raw}"' if loc_name_raw else "  raw: null"
    if expected_loc_raw not in text:
        return False

    return True

def is_post_complete(md_filepath, json_filepath, dest_attach_dir, expected_media_files, synapse_paths, expected_tags, expected_mentions, expected_links, loc_name_raw):
    if not os.path.exists(md_filepath) or not os.path.exists(json_filepath):
        return False
    for media_name in expected_media_files:
        if not os.path.exists(os.path.join(dest_attach_dir, media_name)):
            return False
    for synapse_path in synapse_paths:
        if synapse_path and not os.path.exists(synapse_path):
            return False
    if not existing_markdown_matches(md_filepath, expected_tags, expected_mentions, expected_links, loc_name_raw):
        return False
    return True

def main():
    print("=== 10_IG投稿_移行_v1_1 (実データ反映版 / 大元フィード専用プロジェクト) ===")
    
    print("\n>> ソースメディアディレクトリの存在確認...")
    for idx, media_dir in enumerate(config.SRC_MEDIA_DIRS):
        if os.path.exists(media_dir):
            print(f"  ✅ SRC_MEDIA_DIRS[{idx}]: {os.path.basename(media_dir)}")
        else:
            print(f"  ⚠️ [警告] SRC_MEDIA_DIRS[{idx}] が存在しません: {os.path.basename(media_dir)}")
    
    if not os.path.exists(config.POSTS_JSON_DIR):
        print(f"[致命的エラー] ディレクトリ {config.POSTS_JSON_DIR} が存在しません。")
        return 1

    json_files = []
    base_posts_json = os.path.join(config.POSTS_JSON_DIR, "posts.json")
    if os.path.exists(base_posts_json):
        json_files.append(base_posts_json)
            
    if not json_files:
        print(f"[致命的エラー] {config.POSTS_JSON_DIR} に posts.json が見つかりません。")
        return 1

    state = load_state()
    completed_periods = set(state.get("completed_periods", state.get("completed_years", state.get("completed_chunks", []))))

    print(f"現在の記録上の完了済み半年フォルダ: {list(completed_periods)}")

    raw_data = []
    print(f">> {os.path.basename(base_posts_json)} を読み込んでいます...")
    try:
        with open(base_posts_json, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                raw_data.extend(data)
            print(f"  - {os.path.basename(base_posts_json)}: {len(data)}件読み込み")
    except Exception as e:
        print(f"[致命的エラー] {os.path.basename(base_posts_json)} の読み込みに失敗しました: {e}")
        return 1

    # メディアインデックスの構築
    media.build_media_index()

    posts_by_period = defaultdict(list)
    storage_name_candidates = []
    
    for i, post in enumerate(raw_data):
        post_fixed = txt.fix_mojibake(post)
        
        # posts.json (構造A) 専用のタイムスタンプ抽出
        ts = post_fixed.get("timestamp", 0)
        if ts == 0:
            continue

        target_period = get_period(ts)
        posts_by_period[target_period].append((i, post_fixed, False))

        caption = txt.choose_caption(extract_captions_from_post(post_fixed, False))
        tag_raw_values, mention_raw_values = txt.extract_tags_and_mentions(caption)
        for raw in tag_raw_values:
            name = txt.clean_tag_or_mention(raw)
            if name:
                storage_name_candidates.append(("Synapse/Tag", name, raw))
        for raw in mention_raw_values:
            name = "@" + txt.clean_tag_or_mention(raw)
            if name != "@":
                storage_name_candidates.append(("Synapse/Mention", name, raw))

    synapse.prepare_synapse_storage_names(storage_name_candidates)
        
    sorted_periods = sorted(posts_by_period.keys())
    
    global_synapses_tags = os.path.join(config.LOGS_ROOT, "Synapses", "Tags")
    global_synapses_mentions = os.path.join(config.LOGS_ROOT, "Synapses", "Mentions")
    global_synapses_locations = os.path.join(config.LOGS_ROOT, "Synapses", "Locations")
    os.makedirs(global_synapses_tags, exist_ok=True)
    os.makedirs(global_synapses_mentions, exist_ok=True)
    os.makedirs(global_synapses_locations, exist_ok=True)

    for target_period in sorted_periods:
        print(f"\n🚀 処理開始: {target_period} ({len(posts_by_period[target_period])}件の投稿)")
        
        dest_posts_dir = os.path.join(config.LOGS_ROOT, target_period, "Posts")
        dest_attach_dir = os.path.join(config.LOGS_ROOT, target_period, "Instagram", "media")
        period_index_dir = os.path.join(config.LOGS_ROOT, target_period, "index")
        dest_raw_dir = os.path.join(config.LOGS_ROOT, target_period, "SystemLogs", "RawData")
        
        os.makedirs(dest_posts_dir, exist_ok=True)
        os.makedirs(dest_attach_dir, exist_ok=True)
        os.makedirs(period_index_dir, exist_ok=True)
        os.makedirs(dest_raw_dir, exist_ok=True)
        
        success_count = 0
        skip_count = 0
        error_count = 0
        repaired_count = 0
        
        timeline_entries = []
        
        # ソート（構造Aならtimestamp、構造Bならcreation_timestampを使用）
        posts_by_period[target_period].sort(
            key=lambda x: x[1].get("creation_timestamp" if x[2] else "timestamp", 0)
        )
        
        for i, post_fixed, is_structure_b in posts_by_period[target_period]:
            try:
                if is_structure_b:
                    ts = post_fixed.get("creation_timestamp", 0)
                else:
                    ts = post_fixed.get("timestamp", 0)
                    
                dt = datetime.fromtimestamp(ts, tz=config.JST)
                date_iso = dt.isoformat() 
                file_date_str = dt.strftime("%Y-%m-%d-%H-%M-%S")
                post_id = f"{file_date_str}_IG_{i+1:03d}"
                md_filepath = os.path.join(dest_posts_dir, f"{post_id}.md")
                json_filepath = os.path.join(dest_raw_dir, f"{post_id}.json")

                # データパース
                captions = extract_captions_from_post(post_fixed, is_structure_b)
                caption = txt.choose_caption(captions)
                loc_name_raw = extract_location_name(post_fixed) if not is_structure_b else ""
                
                caption_preview = caption.replace('\n', ' ')[:30] if caption else "無題"
                if len(caption) > 30: caption_preview += "..."

                if os.path.exists(json_filepath):
                    with open(json_filepath, "r", encoding="utf-8") as json_in:
                        if json.load(json_in) != post_fixed:
                            raise ValueError(f"既存RawDataが原本と一致しません: {json_filepath}")
                else:
                    with open(json_filepath, "w", encoding="utf-8") as json_out:
                        json.dump(post_fixed, json_out, ensure_ascii=False, indent=2)

                raw_media = media.extract_media_recursively(post_fixed)
                geo_lat, geo_lng = extract_geo_coordinates(post_fixed, raw_media)
                ig_id = ""
                if raw_media:
                    uri = raw_media[0].get("uri", "")
                    ig_id = os.path.basename(uri).split(".")[0]
                if not ig_id:
                    ig_id = f"ig_{ts}_{i+1}"

                loc_name_safe = txt.safe_filename(loc_name_raw) if loc_name_raw else ""

                tag_raw_values, mention_raw_values = txt.extract_tags_and_mentions(caption)
                tag_entries = [
                    {
                        "raw": raw,
                        "name": txt.clean_tag_or_mention(raw),
                    }
                    for raw in tag_raw_values
                ]
                mention_entries = [
                    {
                        "raw": raw,
                        "name": "@" + txt.clean_tag_or_mention(raw),
                    }
                    for raw in mention_raw_values
                ]
                tag_entries = [entry for entry in tag_entries if entry["name"]]
                mention_entries = [entry for entry in mention_entries if entry["name"] != "@"]
                tags = [entry["name"] for entry in tag_entries]
                mentions = [entry["name"] for entry in mention_entries]
                expected_media_files = build_expected_media_outputs(post_id, raw_media)
                synapse_paths = [
                    os.path.join(
                        global_synapses_tags,
                        f"{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Tag')}.md",
                    )
                    for entry in tag_entries
                ]
                synapse_paths.extend(
                    os.path.join(
                        global_synapses_mentions,
                        f"{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Mention')}.md",
                    )
                    for entry in mention_entries
                )
                if loc_name_safe:
                    synapse_paths.append(os.path.join(global_synapses_locations, f"{loc_name_safe}.md"))

                expected_links = ["[[instagram]]"]
                expected_links.extend(
                    f"[[{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Tag')}|{entry['raw']}]]"
                    for entry in tag_entries
                )
                expected_links.extend(
                    f"[[{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Mention')}|{entry['raw']}]]"
                    for entry in mention_entries
                )
                if loc_name_safe:
                    expected_links.append(f"[[{loc_name_safe}]]")

                if loc_name_safe:
                    location_information = build_location_information(geo_lat, geo_lng)
                    synapse.append_to_period_synapse(
                        global_synapses_locations,
                        loc_name_raw,
                        post_id,
                        target_period,
                        "Synapse/Location",
                        location_information=location_information,
                    )

                for entry in tag_entries:
                    synapse.append_to_period_synapse(
                        global_synapses_tags,
                        entry["name"],
                        post_id,
                        target_period,
                        "Synapse/Tag",
                        raw_value=entry["raw"],
                    )
                for entry in mention_entries:
                    synapse.append_to_period_synapse(
                        global_synapses_mentions,
                        entry["name"],
                        post_id,
                        target_period,
                        "Synapse/Mention",
                        raw_value=entry["raw"],
                    )

                if is_post_complete(
                    md_filepath,
                    json_filepath,
                    dest_attach_dir,
                    expected_media_files,
                    synapse_paths,
                    tags,
                    mentions,
                    expected_links,
                    loc_name_raw,
                ):
                    skip_count += 1
                    timeline_entries.append(f"- [[{post_id}]] : {caption_preview}")
                    continue
                if os.path.exists(md_filepath):
                    repaired_count += 1

                orig_emojis, norm_emojis = txt.extract_emojis(caption)

                copied_media_names = []
                media_info_list = []
                seen_uris = set()
                has_video = False
                for idx, media_item in enumerate(raw_media):
                    uri = media_item.get("uri", "")
                    if not uri or uri in seen_uris: continue
                    seen_uris.add(uri)
                    
                    ext = os.path.splitext(uri)[1].lower() or ".jpg"
                    media_type = "photo" if ext in [".jpg", ".jpeg", ".png", ".webp"] else "video"
                    if media_type == "video":
                        has_video = True
                    dest_media_filename = f"{post_id}_{media_type}_{idx+1:03d}{ext}"
                    dest_media_path = os.path.join(dest_attach_dir, dest_media_filename)
                    
                    if not os.path.exists(dest_media_path):
                        src_media_path = media.find_media_file(uri)
                        if src_media_path:
                            shutil.copy2(src_media_path, dest_media_path)
                            copied_media_names.append(dest_media_filename)
                        else:
                            synapse.write_event_log(target_period, "MEDIA_NOT_FOUND", "DATA_MISSING", {"post_id": post_id, "uri": uri})
                            raise FileNotFoundError(f"Post参照メディアが見つかりません: {uri}")
                    else:
                        copied_media_names.append(dest_media_filename)
                    
                    media_info_list.append({"path": dest_media_filename})

                links = ["[[instagram]]"]
                links.extend(
                    f"[[{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Tag')}|{entry['name']}]]"
                    for entry in tag_entries
                )
                links.extend(
                    f"[[{synapse.synapse_storage_name(entry['name'], entry['raw'], 'Synapse/Mention')}|{entry['name']}]]"
                    for entry in mention_entries
                )
                if loc_name_safe:
                    links.append(f"[[{loc_name_safe}]]")

                original_fname = ""
                if raw_media:
                    uri = raw_media[0].get("uri", "")
                    original_fname = os.path.basename(uri)
                if not original_fname:
                    original_fname = f"post_{ts}_{i+1}.json"

                p_info = {
                    "post_id": post_id,
                    "instagram_id": ig_id,
                    "timestamp": ts,
                    "date_iso": date_iso,
                    "loc_name_raw": loc_name_raw,
                    "loc_name_safe": loc_name_safe,
                    "geo_lat": geo_lat,
                    "geo_lng": geo_lng,
                    "content_type": "video" if has_video else None,
                    "tags": tags,
                    "mentions": mentions,
                    "links": links,
                    "emoji_original": orig_emojis,
                    "emoji_normalized": norm_emojis,
                    "original_filename": original_fname,
                    "media_count": len(media_info_list),
                    "media_list": media_info_list,
                    "post_raw": post_fixed
                }

                yaml_header = md.generate_4layer_yaml(p_info)
                
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
                print(f"[警告] 投稿処理エラー (インデックス: {i}): {e}")
                synapse.write_event_log(target_period, "POST_PROCESSING_ERROR", "ERROR", {"index": i, "error": str(e)})
        
        timeline_filepath = os.path.join(period_index_dir, "timeline.md")
        with open(timeline_filepath, "w", encoding="utf-8") as f:
            f.write(f"# {target_period} Timeline\n\n")
            if not timeline_entries:
                f.write("投稿はありません。\n")
            else:
                for entry in timeline_entries:
                    f.write(entry + "\n")
        
        period_completed = (error_count == 0)
        synapse.write_event_log(
            target_period,
            "PERIOD_COMPLETE",
            "SYSTEM",
            {
                "success": success_count,
                "skip": skip_count,
                "repaired": repaired_count,
                "error": error_count,
                "completed": period_completed,
                "source_json": base_posts_json,
            }
        )
        print(f"   -> 完了判定: {'完了' if period_completed else '未完了'} (生成: {success_count}, 再補修: {repaired_count}, スキップ: {skip_count}, Error: {error_count})")

        if period_completed:
            completed_periods.add(target_period)
        elif target_period in completed_periods:
            completed_periods.remove(target_period)
        state["completed_periods"] = list(completed_periods)
        if "completed_years" in state:
            del state["completed_years"]
        if "completed_chunks" in state:
            del state["completed_chunks"]
        save_state(state)
        
        synapse.generate_global_synapse_indexes()

    print("\n🎉 全ての期間の自動処理が完了しました！")
    return 0

if __name__ == "__main__":
    sys.exit(main())
