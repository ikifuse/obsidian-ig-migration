"""
05_IGC_安全置換v1_0.py

一時準備領域の作成、準備領域へのデータ書き出し、
バックアップ保存、安全な恒久出力置換と失敗時の復元処理を行う。
"""

import importlib.util
import os
import shutil
import tempfile
from typing import Dict, Any

def _load_module(module_name):
    dir_path = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(dir_path, f"{module_name}.py")
    spec = importlib.util.spec_from_file_location(module_name, file_path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

mod_02 = _load_module("02_IGC_入力解析v1_0")
CATEGORIES = mod_02.CATEGORIES

PERMANENT_PATHS = [
    ("Synapses", "Tags", True),
    ("Synapses", "Mentions", True),
    ("Synapses", "Locations", True),
    ("SystemLogs", "ハッシュタグ一覧.md", False),
    ("SystemLogs", "メンション一覧.md", False),
    ("SystemLogs", "場所一覧.md", False),
]


def write_to_prepared_dir(temp_dir: str, integrated_results: Dict[str, Dict[str, Any]]):
    """
    準備領域(temp_dir)へ統合カードおよび一覧を生成・保存する
    """
    for cat_key, cat_info in CATEGORIES.items():
        cat_data = integrated_results[cat_key]
        dir_name = cat_info["dir_name"]
        list_fname = cat_info["list_file"]

        # ディレクトリ作成
        cards_dir = os.path.join(temp_dir, "Instagram_Logs", "Synapses", dir_name)
        os.makedirs(cards_dir, exist_ok=True)

        logs_dir = os.path.join(temp_dir, "Instagram_Logs", "SystemLogs")
        os.makedirs(logs_dir, exist_ok=True)

        # カード書き込み
        for dname, card_info in cat_data["output_cards"].items():
            fpath = os.path.join(cards_dir, card_info["filename"])
            with open(fpath, "w", encoding="utf-8", newline="\n") as f:
                f.write(card_info["content"])

        # 一覧書き込み
        list_path = os.path.join(logs_dir, list_fname)
        with open(list_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(cat_data["list_content"])


def replace_permanent_outputs(repo_root: str, temp_prep_dir: str) -> bool:
    """
    検証完了後、既存の恒久出力6か所をバックアップし、新出力とアトミックに置き換える。
    失敗時は自動復元する。
    """
    target_base = os.path.join(repo_root, "output_IGC", "Instagram_Logs")
    os.makedirs(os.path.join(target_base, "Synapses"), exist_ok=True)
    os.makedirs(os.path.join(target_base, "SystemLogs"), exist_ok=True)

    backup_dir = tempfile.mkdtemp(prefix="igc_backup_")
    replaced_items = []

    try:
        # 1. 既存の6か所をバックアップ領域へ退避
        for sub_dir, name, is_dir in PERMANENT_PATHS:
            src_perm = os.path.join(target_base, sub_dir, name)
            dst_back = os.path.join(backup_dir, sub_dir, name)
            os.makedirs(os.path.dirname(dst_back), exist_ok=True)

            if os.path.exists(src_perm):
                shutil.move(src_perm, dst_back)
                replaced_items.append((sub_dir, name, is_dir, True))
            else:
                replaced_items.append((sub_dir, name, is_dir, False))

        # 2. 準備領域から恒久出力へ移動
        prep_base = os.path.join(temp_prep_dir, "Instagram_Logs")
        for sub_dir, name, is_dir in PERMANENT_PATHS:
            src_prep = os.path.join(prep_base, sub_dir, name)
            dst_perm = os.path.join(target_base, sub_dir, name)
            os.makedirs(os.path.dirname(dst_perm), exist_ok=True)

            if os.path.exists(src_prep):
                shutil.move(src_prep, dst_perm)

        # 成功: バックアップ削除
        shutil.rmtree(backup_dir, ignore_errors=True)
        return True

    except Exception as e:
        # 失敗: 復元処理
        try:
            for sub_dir, name, is_dir, existed in reversed(replaced_items):
                dst_perm = os.path.join(target_base, sub_dir, name)
                src_back = os.path.join(backup_dir, sub_dir, name)

                if os.path.exists(dst_perm):
                    if is_dir:
                        shutil.rmtree(dst_perm, ignore_errors=True)
                    else:
                        os.remove(dst_perm)

                if existed and os.path.exists(src_back):
                    shutil.move(src_back, dst_perm)
        except Exception as rollback_err:
            raise RuntimeError(f"置換失敗および復元中に深刻なエラーが発生しました: {e} / Rollback error: {rollback_err}")

        shutil.rmtree(backup_dir, ignore_errors=True)
        raise RuntimeError(f"置換に失敗したため、元の状態へ復元しました: {e}")
