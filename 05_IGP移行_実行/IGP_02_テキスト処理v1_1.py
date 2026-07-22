import re
import unicodedata

TAG_END_CHARS = set(" \t\r\n()（）[]{}<>＜＞「」『』【】,，、.．。!！?？:：;；/／")
MENTION_BODY_PATTERN = re.compile(r"[A-Za-z0-9._]")

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

def dedupe_preserve_order(values):
    seen = set()
    result = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        result.append(value)
    return result

def choose_caption(captions):
    cleaned = [caption.strip() for caption in captions if isinstance(caption, str) and caption.strip()]
    if not cleaned:
        return ""
    counts = {}
    first_index = {}
    for idx, caption in enumerate(cleaned):
        counts[caption] = counts.get(caption, 0) + 1
        first_index.setdefault(caption, idx)
    ranked = sorted(
        counts.keys(),
        key=lambda caption: (-counts[caption], -len(caption), first_index[caption])
    )
    return ranked[0]

def is_japanese_char(char):
    return bool(re.match(r"[\u3040-\u30ff\u3400-\u9fff]", char))

def _collect_until_delimiter(text, start_index):
    collected = []
    index = start_index
    while index < len(text):
        char = text[index]
        if char in TAG_END_CHARS:
            break
        if char in {"#", "＃", "@", "＠"}:
            break
        collected.append(char)
        index += 1
    return "".join(collected), index

def extract_tags_and_mentions(text):
    tags = []
    mentions = []
    index = 0
    while index < len(text):
        char = text[index]
        if char not in {"#", "＃", "@", "＠"}:
            index += 1
            continue

        next_index = index + 1
        if next_index >= len(text):
            index += 1
            continue

        if char in {"#", "＃"}:
            raw_value, index = _collect_until_delimiter(text, next_index)
            raw = (char + raw_value).strip()
            if raw_value.strip():
                tags.append(raw)
            continue

        next_char = text[next_index]
        if is_japanese_char(next_char):
            raw_value, index = _collect_until_delimiter(text, next_index)
            raw = (char + raw_value).strip()
            if raw_value.strip():
                tags.append(raw)
            continue

        mention_chars = []
        current = next_index
        while current < len(text) and MENTION_BODY_PATTERN.fullmatch(text[current]):
            mention_chars.append(text[current])
            current += 1

        mention_body = "".join(mention_chars).strip()
        if mention_body:
            mentions.append(char + mention_body)
            index = current
            continue

        index += 1

    return dedupe_preserve_order(tags), dedupe_preserve_order(mentions)

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
