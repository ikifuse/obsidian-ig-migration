import re
import unicodedata
from datetime import datetime
from IGS_00_セッテイv1_1 import JST

def fix_mojibake(data):
    if isinstance(data, str):
        try:
            return data.encode('latin1').decode('utf-8')
        except (UnicodeEncodeError, UnicodeDecodeError):
            return data
    elif isinstance(data, list):
        return [fix_mojibake(item) for item in data]
    elif isinstance(data, dict):
        return {key: fix_mojibake(value) for key, value in data.items()}
    return data

def safe_filename(name):
    if not name: return ""
    name = re.sub(r'[\\/:*?"<>|]+', '_', name)
    name = name.replace('\n', ' ').replace('\r', '')
    return name.strip()[:100]

def normalize_text(text):
    if not text:
        return ""
    normalized = unicodedata.normalize('NFKC', text)
    return normalized.strip()

def clean_tag_or_mention(symbol):
    symbol = symbol.replace("#", "").replace("＃", "").replace("@", "").replace("＠", "")
    symbol = re.sub(r'^[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff@#]+', '', symbol)
    symbol = re.sub(r'[^\w\u4e00-\u9fff\u3040-\u309f\u30a0-\u30ff@#]+$', '', symbol)
    symbol = normalize_text(symbol)
    return safe_filename(symbol)

def extract_emojis(text):
    orig_emojis = []
    norm_emojis = []
    if not text: return orig_emojis, norm_emojis
    for char in text:
        if len(char) == 1:
            cat = unicodedata.category(char)
            if cat in ('So', 'Sk') and not char.isascii():
                try:
                    name = unicodedata.name(char).lower()
                    if 'letter' not in name and 'mark' not in name:
                        orig_emojis.append(char)
                        norm_emojis.append(f":{name.replace(' ', '_')}:")
                except ValueError:
                    pass
    return orig_emojis, norm_emojis

def get_period(ts):
    dt = datetime.fromtimestamp(ts, tz=JST)
    year = dt.year
    half = "前半" if dt.month <= 6 else "後半"
    return f"{year}_{half}"
