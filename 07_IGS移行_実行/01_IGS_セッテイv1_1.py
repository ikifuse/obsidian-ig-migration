import os
from datetime import timezone, timedelta

# ==========================================
# 設定・定数
# ==========================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def resolve_output_dir(default_name):
    output_dir = os.environ.get("IG_MIGRATION_OUTPUT_DIR", default_name)
    resolved = output_dir if os.path.isabs(output_dir) else os.path.join(BASE_DIR, output_dir)
    if os.path.basename(os.path.normpath(resolved)) == "output_IGC":
        raise ValueError("IGSからoutput_IGCへ直接出力することは禁止されています。")
    return resolved

# ターゲットJSONのディレクトリ
POSTS_JSON_DIR = os.path.join(BASE_DIR, "Instagram_EXTRACTED:fuse-2026-06-25-0skuYb8I", "your_instagram_activity", "media")

# メディアファイルの探索元 (全期間共通メディアフォルダを参照するための定義)
SRC_MEDIA_DIRS = [
    os.path.join(BASE_DIR, "Instagram_EXTRACTED:fuse-2026-06-25-0skuYb8I"),
    os.path.join(BASE_DIR, "Instagram_EXTRACTED:ki_fuse-2026-06-25-v3Y4GTwD"),
    os.path.join(BASE_DIR, "media:Instagram_EXTRACTED-iki_fuse-2026-06-25-nZTU2TIX"),
    os.path.join(BASE_DIR, "media:Instagram_EXTRACTED-iki_fuse-2026-06-25-l33mqtfo"),
]

# 独立した出力先
DEST_VAULT_DIR = resolve_output_dir("output_IGS")
LOGS_ROOT = os.path.join(DEST_VAULT_DIR, "Instagram_Logs")

# 全期間統合用Synapseフォルダ
GLOBAL_SYNAPSES_TAGS = os.path.join(LOGS_ROOT, "Synapses", "Tags")
GLOBAL_SYNAPSES_MENTIONS = os.path.join(LOGS_ROOT, "Synapses", "Mentions")
GLOBAL_SYNAPSES_LOCATIONS = os.path.join(LOGS_ROOT, "Synapses", "Locations")

DEST_RAW_DIR = os.path.join(LOGS_ROOT, "SystemLogs", "RawData")
DEST_MEDIA_DIR = os.path.join(LOGS_ROOT, "media")
EVENTS_DIR = os.path.join(LOGS_ROOT, "SystemLogs", "Events")

STATE_FILE = os.path.join(LOGS_ROOT, "migration_state_09_stories.json")

JST = timezone(timedelta(hours=+9), 'JST')
