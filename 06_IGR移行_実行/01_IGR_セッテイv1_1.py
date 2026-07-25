import os
from datetime import timezone, timedelta

# ==========================================
# 環境・パス設定
# ==========================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def resolve_output_dir(default_name):
    output_dir = os.environ.get("IG_MIGRATION_OUTPUT_DIR", default_name)
    resolved = output_dir if os.path.isabs(output_dir) else os.path.join(BASE_DIR, output_dir)
    if os.path.basename(os.path.normpath(resolved)) == "output_IGC":
        raise ValueError("IGRからoutput_IGCへ直接出力することは禁止されています。")
    return resolved

POSTS_JSON_DIR = os.path.join(
    BASE_DIR, 
    "Instagram_EXTRACTED:fuse-2026-06-25-0skuYb8I", 
    "your_instagram_activity", 
    "media"
)

SRC_MEDIA_DIRS = [
    os.path.join(BASE_DIR, "Instagram_EXTRACTED:fuse-2026-06-25-0skuYb8I"),
    os.path.join(BASE_DIR, "Instagram_EXTRACTED:ki_fuse-2026-06-25-v3Y4GTwD"),
    os.path.join(BASE_DIR, "media:Instagram_EXTRACTED-iki_fuse-2026-06-25-nZTU2TIX"),
    os.path.join(BASE_DIR, "media:Instagram_EXTRACTED-iki_fuse-2026-06-25-l33mqtfo"),
]

DEST_VAULT_DIR = resolve_output_dir("output_IGR")
LOGS_ROOT = os.path.join(DEST_VAULT_DIR, "Instagram_Logs")

STATE_FILE = os.path.join(LOGS_ROOT, "migration_state_08_reels.json")

# 出力先ディレクトリ
DEST_REELS_DIR = os.path.join(LOGS_ROOT, "Reels")
DEST_MEDIA_DIR = os.path.join(LOGS_ROOT, "media")
DEST_RAW_DIR = os.path.join(LOGS_ROOT, "SystemLogs", "RawData", "Reels")
EVENTS_DIR = os.path.join(LOGS_ROOT, "SystemLogs", "Events")

GLOBAL_SYNAPSES_TAGS = os.path.join(LOGS_ROOT, "Synapses", "Tags")
GLOBAL_SYNAPSES_MENTIONS = os.path.join(LOGS_ROOT, "Synapses", "Mentions")
GLOBAL_SYNAPSES_LOCATIONS = os.path.join(LOGS_ROOT, "Synapses", "Locations")

# ==========================================
# ユーティリティ・定数
# ==========================================
JST = timezone(timedelta(hours=+9), 'JST')
