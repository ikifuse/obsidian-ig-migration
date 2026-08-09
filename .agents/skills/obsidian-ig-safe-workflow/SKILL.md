---
name: obsidian-ig-safe-workflow
description: Safely execute repository work in obsidian-ig-migration by loading the current project rules, checking current OpenAI official guidance before changing AGENTS.md or docs, confirming scope, checking evidence and history, validating changes, retiring temporary helpers, and auditing Git scope. Use for every repository request involving 確認, 調査, 提案, 修正, 進めて, resuming after a gap, document or code changes, artifact validation, temporary scripts, commit, push, merge, or release.
---

# Obsidian IG安全進行

## 実行手順

1. リポジトリ直下の`AGENTS.md`を適用し、対象工程を読み込みルーターから選ぶ。`09_IGC統合/`または`10_Memory_Synapse_DB/`では子`AGENTS.md`も適用する。
2. `git status --short`を確認し、最新依頼を対象、求める結果、許可された操作、停止点に整理する。既存差分と今回の差分を分ける。
3. 「確認」「調査」では、現物、適用ルール、必要な履歴と過去の承認、発生理由、影響をつないで判定する。提案する場合は、`AGENTS.md`の全体完走に対する分類、追加作業量、影響工程および変更サイクルの判定を先に実行する。安全に続けられる必要調査を終えるまで採否を求めない。
4. `AGENTS.md`または`docs/`配下を扱う場合は、`AGENTS.md`のOpenAI公式資料確認と適用判断の規則を編集前に実行する。AI運用構造では、読み込みルーターから`docs/rule-addition-criteria.md`と`docs/information-architecture.md`も適用する。必要な照合が未完了なら変更しない。
5. 変更は承認範囲だけに限定する。新規ファイルや補助ツールは`docs/document-governance.md`で配置と退役を決め、任意改善を混ぜない。
6. 対象仕様、コード、成果物、対象外の無変更を、意味上の確認と必要な試験で検証する。規則の移動、統合、置き換えまたは退役では、`docs/rule-addition-criteria.md`の項目別対応確認を終えるまで完了としない。
7. コミット準備前と完了報告前に、許可されたパスだけを指定して差分を監査する。

```bash
node tools/audit-change-scope.mjs \
  --allow path/to/approved-file \
  --allow path/to/approved-directory/
```

8. Git操作は`AGENTS.md`の許可条件に従い、対象パスだけを明示して扱う。停止時は同文書の説明量と状態表示に従う。

規則本文をこのSkillへ複製しない。意味または手順が競合する場合は、Skill側で独自解釈せず正本を優先する。
