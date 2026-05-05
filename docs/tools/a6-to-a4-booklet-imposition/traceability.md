# トレーサビリティ確認表: A6 to A4 Booklet Imposition

## メタデータ

- 対象: A6 to A4 Booklet Imposition
- 種別: tool
- 現在バージョン: 0.1.0
- 作成日: 2026-05-06
- 更新日: 2026-05-06
- 関連ADR: ADR-001-a6-to-a4-imposition-rules.md

## 要件 -> 仕様 -> 実装

| 要件ID | 仕様ID | 実装箇所 | テスト | 状態 | 備考 |
| --- | --- | --- | --- | --- | --- |
| REQ-001 | SPEC-IN-001, SPEC-IN-002, SPEC-ERR-001, SPEC-ERR-002 | 未実装 | TEST-004, TEST-005 | 未着手 |  |
| REQ-002 | SPEC-BEH-001 | 未実装 | TEST-005 | 未着手 |  |
| REQ-003 | SPEC-IN-003, SPEC-ERR-003, SPEC-ERR-004, SPEC-ERR-005 | 未実装 | TEST-006 | 未着手 |  |
| REQ-004 | SPEC-BEH-002 | 未実装 | TEST-004 | 未着手 |  |
| REQ-005 | SPEC-BEH-002 | 未実装 | TEST-004 | 未着手 |  |
| REQ-006 | SPEC-BEH-004, SPEC-BEH-005 | 未実装 | TEST-001, TEST-002 | 未着手 |  |
| REQ-007 | 画面 / UI | 未実装 | 手動確認 | 未着手 | 長辺とじ前提を表示する |
| REQ-008 | SPEC-OUT-001 | 未実装 | TEST-007 | 未着手 |  |
| REQ-009 | SPEC-BEH-001, SPEC-OUT-001, SPEC-OUT-002 | 未実装 | TEST-005, TEST-007 | 未着手 |  |
| REQ-010 | SPEC-BEH-007 | 未実装 | TEST-001 | 未着手 |  |
| REQ-011 | SPEC-BEH-007 | 未実装 | TEST-001 | 未着手 |  |
| REQ-012 | SPEC-BEH-008 | 未実装 | TEST-008 | 未着手 |  |
| REQ-013 | SPEC-BEH-006, SPEC-BEH-008 | 未実装 | TEST-001, TEST-008 | 未着手 |  |
| REQ-014 | SPEC-BEH-003 | 未実装 | TEST-003 | 未着手 |  |
| REQ-015 | SPEC-BEH-004 | 未実装 | TEST-004 | 未着手 |  |
| REQ-016 | SPEC-OUT-001, SPEC-OUT-002 | 未実装 | TEST-007 | 未着手 |  |
| REQ-017 | SPEC-BEH-009, SPEC-ERR-004 | 未実装 | TEST-009 | 未着手 |  |
| REQ-018 | SPEC-BEH-010, SPEC-ERR-006 | 未実装 | TEST-010 | 未着手 |  |
| REQ-019 | 概要, 制約 | 未実装 | 手動確認 | 未着手 | ネットワーク送信なしを確認する |

## バージョン確認

| 確認項目 | 仕様ID | 実装箇所 | 状態 | 備考 |
| --- | --- | --- | --- | --- |
| 現在バージョンが仕様と実装メタデータで一致している | バージョン / 更新履歴表示 | `src/tools/a6-to-a4-booklet-imposition/metadata.ts` | 未着手 | 実装時に作成 |
| ページ表示用更新履歴が仕様と実装メタデータで一致している | バージョン / 更新履歴表示 | `src/tools/a6-to-a4-booklet-imposition/metadata.ts` | 未着手 | 実装時に作成 |

## 不整合

| ID | 内容 | 対応方針 | 状態 |
| --- | --- | --- | --- |
| GAP-001 | なし | なし | 解消 |

## 追加実装 / 過剰仕様

| ID | 内容 | 理由 | 対応 |
| --- | --- | --- | --- |
| EXTRA-001 | なし | なし | なし |

## 変更履歴

| 日付 | 変更内容 | 関連ADR |
| --- | --- | --- |
| 2026-05-06 | 初版 | ADR-001-a6-to-a4-imposition-rules.md |
| 2026-05-06 | 最終ページ保持を既定動作からユーザー選択オプションへ変更 | ADR-002-optional-final-page-preservation.md |
