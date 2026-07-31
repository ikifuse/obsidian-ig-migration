# Memory Synapse DB

Memory Synapse DBは、既存のMarkdownカードを残したまま、人間の確認によって複数カードの関係を融合・分離する仕組みである。MarkdownとWikiリンクを知識関係の正本とする。

## 現在の構成

| 番号 | 内容 | 役割 |
|---|---|---|
| 01 | [企画書](01_Memory_Synapse_DB_企画書v2.1.md) | 目的、理由、到達点を定める企画正本 |
| 02 | [設計書](02_Memory_Synapse_DB_設計書/00_設計書目次.md) | 構造、責任、データ境界を定める設計正本 |
| 03 | [仕様書](03_Memory_Synapse_DB_仕様書/00_仕様書目次.md) | 画面、操作、判定、検証条件を定める仕様正本 |
| 04 | [実行コード](04_Memory_Synapse_DB_実行コード/00_実行コード目次.md) | 人間が監査できるTypeScript元コード、試験、ビルド設定 |
| 05 | [サンプル検証キット](05_Memory_Synapse_DB_サンプル検証キット/README.md) | モック、サンプルデータ、サンプルVault、検証ケース、写真・動画と出典 |
| 06 | [仮プラグイン](06_Memory_Synapse_DB_仮プラグイン/memory-synapse-db/) | 04から生成する読み取り専用の技術検証版 |
| 07 | [承認・検証台帳](07_Memory_Synapse_DB_承認・検証台帳.md) | 変更サイクルの現在地、承認状態、検証結果、Git基準点 |

より詳しい構成は **[00_目次.md](00_目次.md)**、作業手順は **[docs](docs/README.md)** を参照してください。

[▶ ブラウザー確認用モックのHTMLを開く](05_Memory_Synapse_DB_サンプル検証キット/ブラウザー確認用モック/index.html)

## 安全上の境界

> [!warning] 現在は技術検証版
> 仮プラグインは対象カードを読み取って件数とWikiリンクを計測するだけで、VaultのMarkdownを作成・変更・移動・削除しない。

- 05のサンプル検証キットは架空の検証データだけを使用する。
- Pythonサーバーを融合・分離・手書きの必須条件にしない。
- 外部AIへデータを送らない。
- 外部ネットワークへ自動接続しない。
- Obsidian確認では日常利用Vaultを使わず、専用の検証Vaultまたは複製を使う。

## ビルド

手順は[04のビルド・検証方法](04_Memory_Synapse_DB_実行コード/99_ビルド・検証方法.md)にまとめています。04から06の読み取り専用仮プラグインを生成します。05は04の通常ビルドから生成しない独立サンプル検証キットです。

## For reviewers

This repository contains readable TypeScript source under `04_Memory_Synapse_DB_実行コード/`. The generated plugin under `06_Memory_Synapse_DB_仮プラグイン/` is an experimental read-only prototype. It performs no Vault writes and makes no external network requests.

Feedback is welcome on indexing and caching for 10,000+ Markdown notes, large numbers of active Wiki links, plugin startup cost, and useful benchmark measurements.
