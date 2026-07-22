"""
03_IGC_データ統合v1_0.py

入力系統間で同一統合キー（カテゴリ, 人間向け表記）の完全一致統合を行い、
出力用SynapseカードおよびSystemLogs一覧テキストを生成する。
物理ファイル名の衝突解決（NFD casefold + SHA-256ハッシュ接尾辞）も行う。
"""

import hashlib
import importlib.util
import os
import re
import unicodedata
from typing import Dict, List, Any

def _load_module(module_name):
    dir_path = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(dir_path, f"{module_name}.py")
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

mod_02 = _load_module("02_IGC_入力解析v1_0")
CATEGORIES = mod_02.CATEGORIES
SOURCES = mod_02.SOURCES


def sanitize_base_name(display_name: str, category_key: str) -> str:
    """
    人間向け表記から物理ファイル名の基底名を作成する（仕様書 6.1）
    """
    name = display_name
    # 1. Tagsだけ先頭の # または ＃ を除外
    if category_key == "tags":
        if name.startswith("#") or name.startswith("＃"):
            name = name[1:]

    # 2. 不正文字置換 \ / : * ? " < > | -> _
    name = re.sub(r'[\\/:*?"<>|]', "_", name)

    # 3. CR/LFを空白へ置換
    name = name.replace("\r", " ").replace("\n", " ")

    # 4. 前後空白削除
    name = name.strip()

    # 5. 先頭100文字制限
    name = name[:100]

    # 6. 空文字なら unnamed
    if not name:
        name = "unnamed"

    return name


def get_collision_key(base_name: str) -> str:
    """macOS上の物理名衝突判定キー（NFD + casefold()）を取得（仕様書 6.2）"""
    nfd_str = unicodedata.normalize("NFD", base_name)
    return nfd_str.casefold()


def calculate_suffix(category_key: str, display_name: str) -> str:
    """SHA-256から12桁の小文字16進数接尾辞を算出（仕様書 6.2）"""
    prop_val = CATEGORIES[category_key]["prop_val"]
    target_str = f"{prop_val}\0{display_name}"
    sha = hashlib.sha256(target_str.encode("utf-8")).hexdigest()
    return f"--{sha[:12]}"


def resolve_physical_filenames(cards_data: Dict[str, Dict[str, Any]], category_key: str) -> Dict[str, str]:
    """
    カテゴリ内の全統合カードについて、決定的な物理ファイル名（.md除く）を決定する
    """
    display_names = list(cards_data.keys())
    base_names = {dname: sanitize_base_name(dname, category_key) for dname in display_names}

    # 衝突判定キーごとにグループ化
    groups: Dict[str, List[str]] = {}
    for dname, bname in base_names.items():
        ckey = get_collision_key(bname)
        groups.setdefault(ckey, []).append(dname)

    final_filenames: Dict[str, str] = {}
    for ckey, dnames in groups.items():
        if len(dnames) == 1:
            # 衝突なし
            final_filenames[dnames[0]] = base_names[dnames[0]]
        else:
            # 衝突あり: グループ全員に接尾辞を付与
            for dname in dnames:
                suffix = calculate_suffix(category_key, dname)
                final_filenames[dname] = f"{base_names[dname]}{suffix}"

    # 付与後の最終検証（NFD + casefold で一意か）
    final_collision_keys = set()
    for dname, fname in final_filenames.items():
        ckey = get_collision_key(fname)
        if ckey in final_collision_keys:
            raise ValueError(f"接尾辞付与後も物理名が衝突しています ({category_key}): {fname}")
        final_collision_keys.add(ckey)

    return final_filenames


def integrate_category_data(source_results: Dict[str, Dict[str, Any]], category_key: str):
    """
    1つのカテゴリについて、全系統のデータを統合する
    """
    # 統合キー(display_name)ごとに集約
    integrated: Dict[str, Dict[str, Any]] = {}
    source_counts = {src: 0 for src in SOURCES}

    for src in SOURCES:
        src_cards = source_results[src]["cards"]
        source_counts[src] = len(src_cards)

        for dname, card in src_cards.items():
            if dname not in integrated:
                integrated[dname] = {
                    "display_name": dname,
                    "first_source": src,
                    "sources": [src],
                    "common_info": card["common_info"],
                    "post_links": list(card["post_links"]),
                }
            else:
                # 複数系統に存在する場合
                item = integrated[dname]
                item["sources"].append(src)

                # 共通情報の一致確認 (LF統一済み比較)
                if item["common_info"] != card["common_info"]:
                    raise ValueError(
                        f"系統間で共通情報が不一致です: '{dname}' ({item['first_source']} vs {src})"
                    )

                # 投稿リンクの重複チェック & 加算
                for post_id in card["post_links"]:
                    if post_id in item["post_links"]:
                        raise ValueError(
                            f"複数系統間に同一投稿リンクが重複しています: '{post_id}' in '{dname}'"
                        )
                    item["post_links"].append(post_id)

    # 物理ファイル名決定
    physical_names = resolve_physical_filenames(integrated, category_key)

    # カード出力テキスト生成
    output_cards = {}
    for dname, item in integrated.items():
        fname = physical_names[dname]
        posts_str = "\n".join([f"[[{p}]]" for p in item["post_links"]])
        card_content = f"{item['common_info']}## 関連投稿\n\n{posts_str}\n"
        output_cards[dname] = {
            "display_name": dname,
            "filename": f"{fname}.md",
            "physical_name": fname,
            "content": card_content,
            "sources": item["sources"],
            "post_links": item["post_links"],
        }

    # 一覧出力テキスト生成
    list_content = generate_system_logs_list(output_cards, category_key)

    return {
        "source_counts": source_counts,
        "union_count": len(integrated),
        "multi_source_count": sum(1 for item in integrated.values() if len(item["sources"]) > 1),
        "output_cards": output_cards,
        "list_content": list_content,
        "physical_names": physical_names,
    }


def generate_system_logs_list(output_cards: Dict[str, Dict[str, Any]], category_key: str) -> str:
    """
    SystemLogs統合一覧のMarkdownテキストを生成する（仕様書 7.2, 7.3）
    """
    cat_info = CATEGORIES[category_key]
    title_map = {
        "tags": "# ハッシュタグ一覧 - IGC統合",
        "mentions": "# メンション一覧 - IGC統合",
        "locations": "# 場所一覧 - IGC統合",
    }

    title = title_map[category_key]
    dir_name = cat_info["dir_name"]

    # ソート規則 (7.3): 1. 出現回数降順 2. 人間向け表記昇順 (Python文字列比較)
    card_items = list(output_cards.values())
    card_items.sort(key=lambda x: (-len(x["post_links"]), x["display_name"]))

    lines = [
        title,
        "",
        "初期状態で全て採用（`- [x]`）です。除外したい項目は `- [x]` を `- [ ]` にしてください。",
        "",
        "---",
        "",
    ]

    for card in card_items:
        pname = card["physical_name"]
        dname = card["display_name"]
        count = len(card["post_links"])
        posts_str = "\n".join([f"  - [[{p}]]" for p in card["post_links"]])

        item_str = (
            f"- [x] [[Instagram_Logs/Synapses/{dir_name}/{pname}|{dname}]]\n"
            f"出現回数: {count}回\n\n"
            f"出現投稿:\n"
            f"{posts_str}\n"
            f"---"
        )
        lines.append(item_str)

    return "\n".join(lines) + "\n"
