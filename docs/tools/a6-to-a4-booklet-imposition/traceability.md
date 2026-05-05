# トレーサビリティ確認表: A6 to A4 Booklet Imposition

## メタデータ

- 対象: A6 to A4 Booklet Imposition
- 種別: tool
- 現在バージョン: 0.1.0
- 作成日: 2026-05-06
- 更新日: 2026-05-06
- 関連ADR: ADR-001-a6-to-a4-imposition-rules.md, ADR-002-optional-final-page-preservation.md, ADR-003-physical-sheet-padding.md

## 要件 -> 仕様 -> 実装

| 要件ID | 仕様ID | 実装箇所 | テスト | 状態 | 備考 |
| --- | --- | --- | --- | --- | --- |
| REQ-001 | SPEC-IN-001, SPEC-IN-002, SPEC-ERR-001, SPEC-ERR-002 | `fileInput.ts`, `A6ToA4BookletTool.tsx` | TEST-005, TEST-006 | 実装済み | ブラウザ手動確認は未実施 |
| REQ-002 | SPEC-BEH-001 | `fileInput.ts` | TEST-006 | 実装済み | ブラウザ手動確認は未実施 |
| REQ-003 | SPEC-IN-003, SPEC-ERR-003, SPEC-ERR-004, SPEC-ERR-005 | `fileInput.ts` | TEST-007 | 実装済み | 巨大PDFの処理上限は128ページ |
| REQ-004 | SPEC-BEH-002 | `fileInput.ts`, `A6ToA4BookletTool.tsx` | TEST-005 | 実装済み |  |
| REQ-005 | SPEC-BEH-002 | `A6ToA4BookletTool.tsx` | TEST-005 | 実装済み | 上下ボタンで並び替え |
| REQ-006 | SPEC-BEH-005, SPEC-BEH-006 | `imposition.ts`, `A6ToA4BookletTool.tsx` | TEST-001, TEST-002 | 実装済み |  |
| REQ-007 | 画面 / UI | `A6ToA4BookletTool.tsx` | 手動確認 | 実装済み | 長辺とじ前提を表示 |
| REQ-008 | SPEC-OUT-001 | `exporters.ts` | TEST-008 | 実装済み |  |
| REQ-009 | SPEC-BEH-001, SPEC-OUT-001, SPEC-OUT-002 | `fileInput.ts`, `exporters.ts` | TEST-006, TEST-008 | 実装済み |  |
| REQ-010 | SPEC-BEH-008 | `exporters.ts` | TEST-001 | 実装済み |  |
| REQ-011 | SPEC-BEH-008 | `exporters.ts` | TEST-001 | 実装済み |  |
| REQ-012 | SPEC-BEH-009 | `exporters.ts` | TEST-009 | 実装済み |  |
| REQ-013 | SPEC-BEH-007, SPEC-BEH-009 | `exporters.ts` | TEST-001, TEST-009 | 実装済み |  |
| REQ-014 | SPEC-BEH-003 | `imposition.ts` | TEST-003 | 実装済み |  |
| REQ-015 | SPEC-BEH-004 | `imposition.ts`, `A6ToA4BookletTool.tsx` | TEST-004 | 実装済み |  |
| REQ-016 | SPEC-OUT-001, SPEC-OUT-002 | `exporters.ts`, `A6ToA4BookletTool.tsx` | TEST-008 | 実装済み |  |
| REQ-017 | SPEC-BEH-010, SPEC-ERR-004 | `constants.ts`, `A6ToA4BookletTool.tsx`, `fileInput.ts` | TEST-010 | 実装済み | 推奨上限は注意表示、処理上限超過は拒否 |
| REQ-018 | SPEC-BEH-011, SPEC-ERR-006 | `A6ToA4BookletTool.tsx` | TEST-011 | 実装済み | メモリ不足はRangeErrorとして表示 |
| REQ-019 | 概要, 制約 | `fileInput.ts`, `exporters.ts`, `A6ToA4BookletTool.tsx` | 手動確認 | 実装済み | 外部送信する処理は追加していない |
| REQ-020 | SPEC-BEH-004A | `imposition.ts` | TEST-004A | 実装済み | A4両面シート用に8ページ単位へ内部補完 |

## バージョン確認

| 確認項目 | 仕様ID | 実装箇所 | 状態 | 備考 |
| --- | --- | --- | --- | --- |
| 現在バージョンが仕様と実装メタデータで一致している | バージョン / 更新履歴表示 | `src/tools/a6-to-a4-booklet-imposition/metadata.ts` | 実装済み | 0.1.0 |
| ページ表示用更新履歴が仕様と実装メタデータで一致している | バージョン / 更新履歴表示 | `src/tools/a6-to-a4-booklet-imposition/metadata.ts` | 実装済み | 0.1.0初期版 |

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
| 2026-05-06 | 実装パスと物理シート補完を反映 | ADR-003-physical-sheet-padding.md |
