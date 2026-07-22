"""
04_IGC_品質検証v1_0.py

仕様書第9章「検証仕様」に基づき、入力・準備領域出力・対象外データ保護を全項目検証する。
"""

import importlib.util
import os
import re
import unicodedata
from typing import Dict, Any

def _load_module(module_name):
    dir_path = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(dir_path, f"{module_name}.py")
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

mod_02 = _load_module("02_IGC_入力解析v1_0")
mod_03 = _load_module("03_IGC_データ統合v1_0")

CATEGORIES = mod_02.CATEGORIES
SOURCES = mod_02.SOURCES
parse_synapse_card = mod_02.parse_synapse_card
parse_system_logs_list = mod_02.parse_system_logs_list
get_collision_key = mod_03.get_collision_key


FORBIDDEN_KEYWORDS = [
    "synapse_id",
    "synapse_facets",
    "integration_state",
    "integration_target_id",
    "integration_source_ids",
    "igc_sources",
    "融合ID",
    "融合グループID",
]


def verify_prepared_outputs(
    temp_dir: str,
    integrated_results: Dict[str, Dict[str, Any]],
    source_results: Dict[str, Dict[str, Dict[str, Any]]],
):
    """
    準備領域(temp_dir)に生成された6つの出力を検証する（仕様書 9.2, 9.3）
    """
    validation_results = {}

    for cat_key, cat_info in CATEGORIES.items():
        cat_result = integrated_results[cat_key]
        dir_name = cat_info["dir_name"]
        list_fname = cat_info["list_file"]

        out_cards_dir = os.path.join(temp_dir, "Instagram_Logs", "Synapses", dir_name)
        out_list_file = os.path.join(temp_dir, "Instagram_Logs", "SystemLogs", list_fname)

        if not os.path.isdir(out_cards_dir):
            raise ValueError(f"出力カードディレクトリが存在しません: {out_cards_dir}")
        if not os.path.isfile(out_list_file):
            raise ValueError(f"出力一覧ファイルが存在しません: {out_list_file}")

        # 9.2 Synapse出力検証
        out_cards = {}
        out_collision_keys = set()

        for fname in os.listdir(out_cards_dir):
            if fname.endswith(".md") and not fname.startswith("."):
                fpath = os.path.join(out_cards_dir, fname)
                card = parse_synapse_card(fpath, cat_key)
                dname = card["display_name"]
                out_cards[dname] = card

                # 物理名一意性チェック (NFD + casefold)
                bname = os.path.splitext(fname)[0]
                ckey = get_collision_key(bname)
                if ckey in out_collision_keys:
                    raise ValueError(f"出力物理名がNFD+casefoldで一意ではありません ({cat_key}): {fname}")
                out_collision_keys.add(ckey)

                # 禁止キーの非含有確認 (仕様書 5.5)
                with open(fpath, "r", encoding="utf-8") as f:
                    content = f.read()
                for kw in FORBIDDEN_KEYWORDS:
                    if kw in content:
                        raise ValueError(f"禁止属性/キー '{kw}' が出力カードに含まれています: {fpath}")

        # 件数・集合一致確認
        expected_names = set(cat_result["output_cards"].keys())
        actual_names = set(out_cards.keys())
        if actual_names != expected_names:
            raise ValueError(f"出力カードの人間向け表記集合が一致しません ({cat_key})")

        # 共通情報・関連投稿一致確認
        for dname, expected_card in cat_result["output_cards"].items():
            actual_card = out_cards[dname]
            if actual_card["post_links"] != expected_card["post_links"]:
                raise ValueError(f"出力カードの関連投稿が一致しません: '{dname}' ({cat_key})")

        # 9.3 SystemLogs出力検証
        out_list_items = parse_system_logs_list(out_list_file)
        if len(out_list_items) != len(out_cards):
            raise ValueError(f"出力一覧件数({len(out_list_items)})とカード件数({len(out_cards)})が一致しません ({cat_key})")

        out_list_names = {item["display_name"] for item in out_list_items}
        if out_list_names != expected_names:
            raise ValueError(f"出力一覧の人間向け表記集合が一致しません ({cat_key})")

        # 順序検証 (7.3: 1. 出現回数降順 2. 人間向け表記昇順)
        for i in range(len(out_list_items) - 1):
            curr = out_list_items[i]
            nxt = out_list_items[i + 1]
            if len(curr["posts"]) < len(nxt["posts"]):
                raise ValueError(f"出力一覧の並び順（出現回数降順）が不正です ({cat_key})")
            elif len(curr["posts"]) == len(nxt["posts"]):
                if curr["display_name"] >= nxt["display_name"]:
                    raise ValueError(f"出力一覧の並び順（表記昇順）が不正です ({cat_key})")

        validation_results[cat_key] = {
            "card_count_ok": len(out_cards) == cat_result["union_count"],
            "set_match_ok": actual_names == expected_names,
            "list_match_ok": out_list_names == expected_names,
            "filename_unique_ok": len(out_collision_keys) == len(out_cards),
        }

    return validation_results


def verify_protected_paths(repo_root: str, snapshot_before: Dict[str, float]):
    """
    対象外パスが変更されていないことを検証する（仕様書 9.4）
    """
    snapshot_after = take_protected_snapshot(repo_root)
    if snapshot_before != snapshot_after:
        changed_paths = []
        for p in set(snapshot_before.keys()).union(snapshot_after.keys()):
            if snapshot_before.get(p) != snapshot_after.get(p):
                changed_paths.append(p)
        raise ValueError(f"保護対象パスが変更されました: {changed_paths}")


def take_protected_snapshot(repo_root: str) -> Dict[str, float]:
    """保護対象パスのタイムスタンプのスナップショットを取得"""
    protected_rel_paths = [
        "output_IGP",
        "output_IGR",
        "output_IGS",
    ]
    snapshot = {}
    for rel_p in protected_rel_paths:
        abs_p = os.path.join(repo_root, rel_p)
        if os.path.exists(abs_p):
            for root, _, files in os.walk(abs_p):
                for f in files:
                    fp = os.path.join(root, f)
                    snapshot[fp] = os.path.getmtime(fp)
    return snapshot
