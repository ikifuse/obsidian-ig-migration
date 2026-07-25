import re
import unicodedata

def safe_filename(name):
    return re.sub(r'[\\/:*?"<>|]', '_', name)

def fix_mojibake(val):
    if isinstance(val, str):
        try:
            return val.encode('latin-1').decode('utf-8')
        except Exception:
            return val
    elif isinstance(val, list):
        return [fix_mojibake(v) for v in val]
    elif isinstance(val, dict):
        return {fix_mojibake(k): fix_mojibake(v) for k, v in val.items()}
    return val

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
    for char in text:
        if len(char) == 1:
            cat = unicodedata.category(char)
            if cat in ('So', 'Sk') and not char.isascii():
                try:
                    name = unicodedata.name(char).lower()
                    if 'letter' not in name and 'mark' not in name:
                        orig_emojis.append(char)
                        norm_emojis.append(name.replace(' ', '_'))
                except ValueError:
                    pass
    return orig_emojis, norm_emojis
