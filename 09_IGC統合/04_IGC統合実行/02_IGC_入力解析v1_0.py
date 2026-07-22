"""
02_IGC_入力解析v1_0.py

入力系統（output_IGP, output_IGR, output_IGS）から
SynapseカードおよびSystemLogs一覧を読み込み、構造解析と相互照合を行う。
"""

import os
import re
import unicodedata

CATEGORIES = {
    "tags": {
        "dir_name": "Tags",
        "list_file": "ハッシュタグ一覧.md",
        "field_name": "hashtag_note.hashtag",
        "tag_value": "Synapse/Tag",
        "prop_val": "Synapse/Tag",
    },
    "mentions": {
        "dir_name": "Mentions",
        "list_file": "メンション一覧.md",
        "field_name": "mention_note.mention",
        "tag_value": "Synapse/Mention",
        "prop_val": "Synapse/Mention",
    },
    "locations": {
        "dir_name": "Locations",
        "list_file": "場所一覧.md",
        "field_name": "location_note.location",
        "tag_value": "Synapse/Location",
        "prop_val": "Synapse/Location",
    },
}

SOURCES = ["output_IGP", "output_IGR", "output_IGS"]


def normalize_lf(text: str) -> str:
    """改行コードをLFに統一する"""
    return text.replace("\r\n", "\n").replace("\r", "\n")


def parse_yaml_frontmatter(content: str):
    """YAML Frontmatterパーサー"""
    if not content.startswith("---\n"):
        return None, content
    parts = content.split("---\n", 2)
    if len(parts) < 3:
        return None, content
    yaml_text = parts[1]
    body_text = parts[2]
    
    data = {}
    for line in yaml_text.split("\n"):
        line_strip = line.strip()
        if not line_strip or line_strip.startswith("#"):
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            key = k.strip()
            val = v.strip()
            if val.startswith("[") and val.endswith("]"):
                try:
                    import json
                    parsed_list = json.loads(val)
                    data[key] = parsed_list
                except Exception:
                    # jsonでパースできない場合はSynapse/Locationなどのクォートなし配列の処理
                    inner = val[1:-1].strip()
                    if inner:
                        items = [x.strip().strip("'\"") for x in inner.split(",") if x.strip()]
                        data[key] = items
                    else:
                        data[key] = []
            else:
                data[key] = val.strip("'\"")

    return data, body_text


def parse_synapse_card(file_path: str, category_key: str):
    """
    Synapseカードファイルを解析し、情報を抽出する
    """
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
    except UnicodeDecodeError as e:
        raise ValueError(f"UTF-8デコードエラー: {file_path} ({e})")

    content = normalize_lf(raw_content)
    frontmatter, body = parse_yaml_frontmatter(content)
    if frontmatter is None:
        raise ValueError(f"Frontmatterが存在しません: {file_path}")

    # Aliases検証
    aliases = frontmatter.get("aliases", [])
    if not isinstance(aliases, list) or len(aliases) != 1:
        raise ValueError(f"aliasesは唯一の文字列要素を持つリストでなければなりません: {file_path}")
    alias_val = aliases[0]

    # Tags検証
    cat_info = CATEGORIES[category_key]
    tags = frontmatter.get("tags", [])
    if not isinstance(tags, list) or cat_info["tag_value"] not in tags:
        raise ValueError(f"tagsに {cat_info['tag_value']} が含まれていません: {file_path}")

    # 固有値の抽出（本文内の ```yaml ブロックから抽出）
    specific_val = None
    if category_key == "tags":
        m = re.search(r'hashtag:\s*"([^"]+)"', body) or re.search(r"hashtag:\s*'([^']+)'", body) or re.search(r'hashtag:\s*([^\s#]+)', body)
        if m:
            specific_val = m.group(1)
    elif category_key == "mentions":
        m = re.search(r'mention:\s*"([^"]+)"', body) or re.search(r"mention:\s*'([^']+)'", body) or re.search(r'mention:\s*([^\s#]+)', body)
        if m:
            specific_val = m.group(1)
    elif category_key == "locations":
        m = re.search(r'location:\s*"([^"]+)"', body) or re.search(r"location:\s*'([^']+)'", body) or re.search(r'location:\s*([^\s#]+)', body)
        if m:
            specific_val = m.group(1)

    if specific_val is None:
        field_name = cat_info["field_name"]
        raise ValueError(f"必須フィールド {field_name} がありません: {file_path}")

    # H1見出しの抽出
    h1_match = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
    if not h1_match:
        raise ValueError(f"H1見出しが見つかりません: {file_path}")
    h1_val = h1_match.group(1).rstrip("\r\n")

    # 人間向け表記の整合性チェック
    if not (alias_val == h1_val == specific_val):
        raise ValueError(
            f"人間向け表記の不一致: alias='{alias_val}', h1='{h1_val}', specific='{specific_val}' ({file_path})"
        )

    # 本文と関連投稿領域の分割
    rel_split = body.split("## 関連投稿\n")
    if len(rel_split) != 2:
        raise ValueError(f"## 関連投稿 見出しが1つだけ存在しなければなりません: {file_path}")
    
    common_info = body[:body.find("## 関連投稿")]
    # frontmatterも含めた共通情報
    fm_end_idx = content.find("## 関連投稿")
    if fm_end_idx == -1:
        raise ValueError(f"## 関連投稿 が見つかりません: {file_path}")
    full_common_info = content[:fm_end_idx]

    rel_posts_section = rel_split[1]
    rel_lines = [line.strip() for line in rel_posts_section.split("\n") if line.strip()]
    
    post_links = []
    for line in rel_lines:
        m = re.match(r"^\[\[(.+)\]\]$", line)
        if not m:
            raise ValueError(f"関連投稿領域に不正な形式の行があります: '{line}' ({file_path})")
        post_id = m.group(1)
        if post_id in post_links:
            raise ValueError(f"同一カード内に重複する投稿リンクがあります: '{post_id}' ({file_path})")
        post_links.append(post_id)

    if len(post_links) == 0:
        raise ValueError(f"関連投稿が0件です: {file_path}")

    return {
        "file_path": file_path,
        "filename": os.path.basename(file_path),
        "display_name": specific_val,
        "common_info": full_common_info,
        "post_links": post_links,
    }


def parse_system_logs_list(list_file_path: str):
    """
    SystemLogs一覧ファイルを解析する
    """
    try:
        with open(list_file_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
    except UnicodeDecodeError as e:
        raise ValueError(f"UTF-8デコードエラー: {list_file_path} ({e})")

    content = normalize_lf(raw_content)
    lines = content.split("\n")

    items = []
    current_item = None

    for line in lines:
        # チェックボックス行
        m_item = re.match(r"^-\s*\[([ xX])\]\s*\[\[([^\|]+)\|([^\]]+)\]\]$", line)
        if m_item:
            check_state = m_item.group(1)
            target_link = m_item.group(2)
            display_name = m_item.group(3)
            if check_state == " ":
                raise ValueError(
                    f"未チェック（- [ ]）の項目が存在します。処理を停止します: {list_file_path} ({display_name})"
                )
            if current_item:
                items.append(current_item)
            current_item = {
                "target_link": target_link,
                "display_name": display_name,
                "count": 0,
                "posts": [],
            }
            continue

        if current_item:
            m_count = re.match(r"^出現回数:\s*(\d+)回$", line)
            if m_count:
                current_item["count"] = int(m_count.group(1))
                continue

            m_post = re.match(r"^\s*-\s*\[\[(.+)\]\]$", line)
            if m_post:
                post_id = m_post.group(1)
                if post_id in current_item["posts"]:
                    raise ValueError(
                        f"一覧の同一項目内に重複する投稿リンクがあります: '{post_id}' ({list_file_path})"
                    )
                current_item["posts"].append(post_id)

    if current_item:
        items.append(current_item)

    # 検証
    display_names = set()
    for item in items:
        if item["display_name"] in display_names:
            raise ValueError(f"一覧内に重複する人間向け表記があります: '{item['display_name']}' ({list_file_path})")
        display_names.add(item["display_name"])

        if item["count"] != len(item["posts"]):
            raise ValueError(
                f"出現回数({item['count']})と投稿リンク数({len(item['posts'])})が一致しません: '{item['display_name']}' ({list_file_path})"
            )
        if len(item["posts"]) == 0:
            raise ValueError(f"出現投稿が0件の項目があります: '{item['display_name']}' ({list_file_path})")

    return items


def load_and_verify_source(repo_root: str, source: str, category_key: str):
    """
    1つの入力系統・1つのカテゴリについて、カードと一覧を解析・照合する
    """
    cat_info = CATEGORIES[category_key]
    cards_dir = os.path.join(repo_root, source, "Instagram_Logs", "Synapses", cat_info["dir_name"])
    list_file = os.path.join(repo_root, source, "Instagram_Logs", "SystemLogs", cat_info["list_file"])

    if not os.path.isdir(cards_dir):
        raise ValueError(f"必須ディレクトリが存在しません: {cards_dir}")
    if not os.path.isfile(list_file):
        raise ValueError(f"必須一覧ファイルが存在しません: {list_file}")

    # カード読み込み
    cards_by_name = {}
    for fname in os.listdir(cards_dir):
        if fname.endswith(".md") and not fname.startswith("."):
            fpath = os.path.join(cards_dir, fname)
            card = parse_synapse_card(fpath, category_key)
            dname = card["display_name"]
            if dname in cards_by_name:
                raise ValueError(f"同一系統内に同じ人間向け表記のカードが複数存在します: '{dname}' ({source})")
            cards_by_name[dname] = card

    # 一覧読み込み
    list_items = parse_system_logs_list(list_file)
    items_by_name = {item["display_name"]: item for item in list_items}

    # 照合
    card_names = set(cards_by_name.keys())
    list_names = set(items_by_name.keys())

    if card_names != list_names:
        diff = card_names.symmetric_difference(list_names)
        raise ValueError(f"カードと一覧の人間向け表記集合が一致しません ({source}/{category_key}): 差分={diff}")

    for dname, card in cards_by_name.items():
        item = items_by_name[dname]
        
        # 物理リンク先チェック（.md除去比較）
        link_target_fname = os.path.basename(item["target_link"])
        if link_target_fname.endswith(".md"):
            link_target_fname = link_target_fname[:-3]
        card_fname_no_ext = os.path.splitext(card["filename"])[0]

        if link_target_fname != card_fname_no_ext:
            raise ValueError(
                f"一覧の物理リンク先('{link_target_fname}')とカード物理名('{card_fname_no_ext}')が一致しません: '{dname}' ({source})"
            )

        # 関連投稿の一致チェック（件数、値、順序）
        if card["post_links"] != item["posts"]:
            raise ValueError(
                f"カードと一覧の関連投稿が一致しません: '{dname}' ({source})\nCard: {card['post_links']}\nList: {item['posts']}"
            )

    return {
        "cards": cards_by_name,
        "list_items": items_by_name,
    }
