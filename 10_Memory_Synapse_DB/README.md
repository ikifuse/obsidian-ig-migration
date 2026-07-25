# Memory Synapse DB

Memory Synapse DBは、既存のMarkdownカードを残したまま、人間の確認によって複数カードの関係を融合・分離する仕組みである。MarkdownとWikiリンクを知識関係の正本とする。

## 現在の構成

詳細な構成や各ドキュメント・コードへのリンクは **[00_目次.md](00_目次.md)** を参照してください。

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
