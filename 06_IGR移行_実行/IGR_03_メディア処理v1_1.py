import os
import shutil
from collections import defaultdict
from IGR_00_セッテイv1_1 import SRC_MEDIA_DIRS, DEST_MEDIA_DIR

MEDIA_INDEX_CACHE = defaultdict(list)

def build_media_index():
    print(">> メディアファイルの事前インデックスを構築中（数秒かかります）...")
    for media_dir in SRC_MEDIA_DIRS:
        if not os.path.exists(media_dir): continue
        for root, _, files in os.walk(media_dir):
            for file in files:
                MEDIA_INDEX_CACHE[file].append(os.path.join(root, file))
    print(f">> インデックス完了: {len(MEDIA_INDEX_CACHE)}種類のメディアをキャッシュしました。")

def find_media_file(relative_path):
    filename = os.path.basename(relative_path)
    paths = MEDIA_INDEX_CACHE.get(filename, [])
    if not paths: return None
    for p in paths:
        if relative_path.replace("/", os.sep) in p: return p
    return paths[0]

def extract_media_recursively(obj):
    media_list = []
    if isinstance(obj, dict):
        if "media" in obj and isinstance(obj["media"], list):
            for m in obj["media"]:
                if isinstance(m, dict) and "uri" in m:
                    media_list.append(m)
        for k, v in obj.items():
            media_list.extend(extract_media_recursively(v))
    elif isinstance(obj, list):
        for item in obj:
            media_list.extend(extract_media_recursively(item))
    return media_list

def copy_media_file(uri, post_id, idx, write_event_log_func):
    ext = os.path.splitext(uri)[1].lower() or ".jpg"
    media_type = "photo" if ext in [".jpg", ".jpeg", ".png", ".webp"] else "video"
    dest_media_filename = f"{post_id}_{media_type}_{idx+1:03d}{ext}"
    dest_media_path = os.path.join(DEST_MEDIA_DIR, dest_media_filename)
    
    if not os.path.exists(dest_media_path):
        src_media_path = find_media_file(uri)
        if src_media_path:
            shutil.copy2(src_media_path, dest_media_path)
            return dest_media_filename, True
        else:
            write_event_log_func("MEDIA_NOT_FOUND", "DATA_MISSING", {"post_id": post_id, "uri": uri})
            return None, False
    return dest_media_filename, False
