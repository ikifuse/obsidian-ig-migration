import os
from collections import defaultdict
import IGP_00_セッテイv1_1 as config

MEDIA_INDEX_CACHE = defaultdict(list)

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

def build_media_index():
    print(">> メディアファイルの事前インデックスを構築中...")
    for media_dir in config.SRC_MEDIA_DIRS:
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
