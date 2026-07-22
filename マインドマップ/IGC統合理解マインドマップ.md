# IGC統合理解マインドマップ

![「第二の脳」構築プロジェクトの概要](../.github/readme-assets/project-overview-compressed.jpg)
このメモは、IGP / IGR / IGS の個別移行と、IGC による統合工程と、Obsidian投入前に人間が何を理解していればよいかを切り分けて整理するための理解用メモである。

「プログラムの構造」と「実際の作業順」は混同しやすいため、図を分けて扱う。

---

## 1. プログラム全体の構造

```mermaid
mindmap
  root((Instagram移行 全体))
    個別移行工程
      IGP
        目的: 通常投稿の移行
        実行フォルダ: 05_IGP移行_実行
        成果物: output_IGP
      IGR
        目的: リールの移行
        実行フォルダ: 06_IGR移行_実行
        成果物: output_IGR
      IGS
        目的: ストーリーの移行
        実行フォルダ: 07_IGS移行_実行
        成果物: output_IGS
    個別移行の位置付け
      個別検証用成果物
      そのままObsidian本番投入しない
      Synapse重複の可能性あり
    統合工程IGC
      新しい仕様書
        09_IGC統合/03_IGC統合仕様書v1.0
      新しい実行コード
        まだこれから作る
      入力
        output_IGP
        output_IGR
        output_IGS
        output_IGC
      やること
        Synapses統合確認
        SystemLogs一覧再生成
        検証
        投入順序成果物作成
      出力
        Obsidian投入用の統合成果物
    Obsidian投入
      投入対象はIGC後の成果物
      投入順序が重要
      個別成果物は投入対象ではない
```

---

## 2. あなたが実際に見る作業順

```mermaid
mindmap
  root((Obsidian投入までの実作業))
    先にあるもの
      IGP実行
      IGR実行
      IGS実行
    先にできるもの
      output_IGP
      output_IGR
      output_IGS
    次に必要なもの
      IGC統合仕様書
      IGC統合実行コード
    IGCがやること
      同名Synapse衝突を防ぐ
      SystemLogs一覧を作り直す
      件数整合を確認する
      投入順序を成果物として残す
    IGC後にできるもの
      統合済みSynapses
      再生成済みSystemLogs一覧
      検証結果
      投入順序メモ
    最後にやること
      Obsidianへ順番に投入
        1 SystemLogs一覧系
        2 Synapses/Tags
        3 Synapses/Mentions
        4 Synapses/Locations
```

---

## 3. いまの現在地

いま終わっているもの:

* 引き継ぎ書の整理
* 設計書への設計付箋追記
* IGC 新仕様書の新規作成

いままだ終わっていないもの:

* IGC 仕様書の詳細化
* IGC 実行コードの作成
* IGC による統合成果物の生成
* Obsidian への本番投入

---

## 4. いま次にやるべきこと

いま次にやることは、Obsidian投入そのものではない。

いまはまだ IGC の仕様を詰める段階であり、特に以下を先に確定すると迷いにくい。

* IGC の入力をどこまで必須にするか
* Synapse 統合確認の具体ルール
* SystemLogs 一覧の出力形式
* 検証失敗時の扱い

この4点が固まると、そのまま IGC 実行コードの設計へ進める。
