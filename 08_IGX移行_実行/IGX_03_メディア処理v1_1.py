import os
import shutil
from IGX_00_セッテイv1_1 import SRC_MEDIA_DIRS, DEST_MEDIA_DIR

MEDIA_INDEX = {}

def build_media_index():
    print("\n>> メディアファイルの事前インデックスを構築中（数秒かかります）...")
    count = 0
    for media_dir in SRC_MEDIA_DIRS:
        if not os.path.exists(media_dir): continue
        for root, _, files in os.walk(media_dir):
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".mov", ".m4v"]:
                    MEDIA_INDEX[f] = os.path.join(root, f)
                    count += 1
    print(f">> インデックス完了: {count}種類のメディアをキャッシュしました。")

def find_media_file(uri):
    if not uri: return None
    basename = os.path.basename(uri)
    if basename in MEDIA_INDEX:
        return MEDIA_INDEX[basename]
    return None

def extract_media_recursively(data):
    media_list = []
    if isinstance(data, dict):
        if "uri" in data:
            media_list.append(data)
        for val in data.values():
            media_list.extend(extract_media_recursively(val))
    elif isinstance(data, list):
        for item in data:
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
            write_event_log_func("MEDIA_NOT_FOUND", "WARNING", {"post_id": post_id, "uri": uri})
            return None, False
    return dest_media_filename, False
