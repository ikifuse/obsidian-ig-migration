# Memory Synapse DB

Memory Synapse DBは、既存のMarkdownカードを残したまま、人間の確認によって複数カードの関係を融合・分離する仕組みである。MarkdownとWikiリンクを知識関係の正本とする。

## 現在の構成

| 番号 | 内容 | 入口 |
|---|---|---|
| 01 | 企画 | `01_Memory_Synapse_DB_企画書v2.1.md` |
| 02 | 設計 | `02_Memory_Synapse_DB_設計書/00_設計書目次.md` |
| 03 | 仕様 | `03_Memory_Synapse_DB_仕様書/00_仕様書目次.md` |
| 04 | 日本語5分割のTypeScript実行コード | `04_Memory_Synapse_DB_実行コード/00_実行コード目次.md` |
| 05 | 検証用データだけを使うブラウザー確認版 | `05_Memory_Synapse_DB_ブラウザー確認版/index.html` |
| 06 | Obsidianへフォルダーごと配置できる仮プラグイン | `06_Memory_Synapse_DB_仮プラグイン/README.md` |

## 安全上の境界

> [!warning] 現在は技術検証版
> 仮プラグインは対象カードを読み取って件数とWikiリンクを計測するだけで、VaultのMarkdownを作成・変更・移動・削除しない。

- ブラウザー確認版は架空の検証データだけを使用する。
- Pythonサーバーを融合・分離・手書きの必須条件にしない。
- 外部AIへデータを送らない。
- 外部ネットワークへ自動接続しない。
- Obsidian確認では日常利用Vaultを使わず、専用の検証Vaultまたは複製を使う。

## ビルド

手順は`04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md`にまとめている。一回のビルドから、ブラウザー確認版と仮プラグインを生成する。

## For reviewers

This repository contains readable TypeScript source under `04_Memory_Synapse_DB_実行コード/`. The generated plugin under `06_Memory_Synapse_DB_仮プラグイン/` is an experimental read-only prototype. It performs no Vault writes and makes no external network requests.

Feedback is welcome on indexing and caching for 10,000+ Markdown notes, large numbers of active Wiki links, plugin startup cost, and useful benchmark measurements.
