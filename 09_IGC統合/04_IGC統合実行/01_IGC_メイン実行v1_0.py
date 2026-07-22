#!/usr/bin/env python3
"""
01_IGC_メイン実行v1_0.py

IGC統合のメインエントリーポイント（主役ファイル）。
引数解析、全体フロー制御、ドライラン管理、標準出力へのJSON結果出力を行う。
"""

import argparse
import importlib.util
import json
import os
import sys
import tempfile
import traceback

def _load_module(module_name):
    dir_path = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(dir_path, f"{module_name}.py")
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

mod_02 = _load_module("02_IGC_入力解析v1_0")
mod_03 = _load_module("03_IGC_データ統合v1_0")
mod_04 = _load_module("04_IGC_品質検証v1_0")
mod_05 = _load_module("05_IGC_安全置換v1_0")

CATEGORIES = mod_02.CATEGORIES
SOURCES = mod_02.SOURCES
load_and_verify_source = mod_02.load_and_verify_source

integrate_category_data = mod_03.integrate_category_data

take_protected_snapshot = mod_04.take_protected_snapshot
verify_prepared_outputs = mod_04.verify_prepared_outputs
verify_protected_paths = mod_04.verify_protected_paths

replace_permanent_outputs = mod_05.replace_permanent_outputs
write_to_prepared_dir = mod_05.write_to_prepared_dir


def find_repo_root(start_dir: str) -> str:
    """スクリプト位置からリポジトリルートを自動決定する"""
    curr = os.path.abspath(start_dir)
    while curr != os.path.dirname(curr):
        if os.path.isfile(os.path.join(curr, "AGENTS.md")) or os.path.isdir(os.path.join(curr, ".git")):
            return curr
        curr = os.path.dirname(curr)
    # デフォルトフォールバック
    return os.path.abspath(os.path.join(start_dir, "..", ".."))


def main():
    parser = argparse.ArgumentParser(description="IGC統合 メイン実行プログラム")
    parser.add_argument(
        "--repo-root",
        type=str,
        default=None,
        help="リポジトリルートパス（省略時は自動判定）",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="準備出力の生成と検証のみを行い、恒久出力を置換しない",
    )

    args = parser.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = args.repo_root if args.repo_root else find_repo_root(script_dir)
    repo_root = os.path.abspath(repo_root)

    mode = "dry-run" if args.dry_run else "replace"

    result_json = {
        "mode": mode,
        "ok": False,
        "replaced": False,
        "inputs": {src: os.path.join(repo_root, src) for src in SOURCES},
        "categories": {},
    }

    # 1. 保護対象データの事前スナップショット
    try:
        snapshot_before = take_protected_snapshot(repo_root)
    except Exception as e:
        result_json["error"] = {
            "type": "InitializationError",
            "phase": "ProtectedSnapshotBefore",
            "message": str(e),
        }
        print(json.dumps(result_json, ensure_ascii=False, indent=2))
        sys.exit(1)

    # 2. 全カテゴリ・全系統の入力読み込みと照合
    source_results = {src: {} for src in SOURCES}
    integrated_results = {}

    try:
        for cat_key in CATEGORIES.keys():
            cat_source_results = {}
            for src in SOURCES:
                res = load_and_verify_source(repo_root, src, cat_key)
                cat_source_results[src] = res
                source_results[src][cat_key] = res

            # 3. 完全一致統合と物理名決定
            int_res = integrate_category_data(cat_source_results, cat_key)
            integrated_results[cat_key] = int_res

    except Exception as e:
        result_json["error"] = {
            "type": "InputVerificationOrIntegrationError",
            "phase": "LoadAndIntegrate",
            "message": str(e),
        }
        print(json.dumps(result_json, ensure_ascii=False, indent=2))
        sys.exit(1)

    # 4. 一時準備領域の作成と出力生成
    temp_prep_dir = tempfile.mkdtemp(prefix="igc_prep_")

    try:
        write_to_prepared_dir(temp_prep_dir, integrated_results)

        # 5. 準備領域出力の品質検証
        validations = verify_prepared_outputs(temp_prep_dir, integrated_results, source_results)

        # 6. 保護対象データの無変更検証
        verify_protected_paths(repo_root, snapshot_before)

        # カテゴリ別結果の集計
        for cat_key, cat_data in integrated_results.items():
            total_related_posts = sum(
                len(card["post_links"]) for card in cat_data["output_cards"].values()
            )
            result_json["categories"][cat_key] = {
                "source_card_counts": {src: len(source_results[src][cat_key]["cards"]) for src in SOURCES},
                "source_list_counts": {src: len(source_results[src][cat_key]["list_items"]) for src in SOURCES},
                "input_union_count": cat_data["union_count"],
                "multi_source_item_count": cat_data["multi_source_count"],
                "output_count": len(cat_data["output_cards"]),
                "related_post_count": total_related_posts,
                "validation": validations[cat_key],
            }

        # 7. 安全置換（--dry-run の場合はスキップ）
        if not args.dry_run:
            replace_permanent_outputs(repo_root, temp_prep_dir)
            result_json["replaced"] = True

        result_json["ok"] = True
        print(json.dumps(result_json, ensure_ascii=False, indent=2))
        sys.exit(0)

    except Exception as e:
        result_json["error"] = {
            "type": "ExecutionOrValidationError",
            "phase": "ValidationOrReplacement",
            "message": str(e),
        }
        print(json.dumps(result_json, ensure_ascii=False, indent=2))
        sys.exit(1)

    finally:
        # 一時準備領域のクリーンアップ
        if os.path.exists(temp_prep_dir):
            import shutil
            shutil.rmtree(temp_prep_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
