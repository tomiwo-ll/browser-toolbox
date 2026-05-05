# AGENTS.md

## Project Policy

- 日本語で説明する。
- 変更前に、方針と触るファイルを短く説明する。
- 大きな変更は小さい差分に分ける。
- 既存の設計、命名、フォーマットに合わせる。
- 秘密情報、`.env`、鍵、トークン、認証情報を読まない・出力しない。
- 新しい依存関係を追加する前に確認する。
- 破壊的操作、DBマイグレーション、外部API呼び出し、デプロイは確認なしに実行しない。

## Docker-Only Local Work

- `git` 操作を除くローカル作業、検証、スクリプト実行は必ず Docker 経由で行う。
- ホストで直接実行してよいのは、`git status`、`git branch`、`git switch`、`git checkout`、`git diff`、`git add`、`git commit`、`git push` などの Git 操作のみ。
- `npm`、`pnpm`、`node`、`python`、`cargo`、`pytest`、`playwright`、lint、test、typecheck、build はホストで直接実行しない。
- Docker 環境が未整備の場合は、実装や検証の前に Dockerfile、Compose、または実行スクリプトの整備を計画する。
- 標準コマンドは `docker compose run --rm app npm ...` または `docker compose exec app npm ...` に統一する。

## Browser Toolbox Rules

- このリポジトリは GitHub Pages で公開する、ブラウザ上で処理が完結するツール置き場として扱う。
- ユーザーがアップロードした画像、PDF、CSV、その他の入力ファイルを外部API、解析サービス、ストレージ、サーバーへ送信しない。
- サーバー必須の機能、秘密鍵、トークン、ユーザー追跡、外部DB、認証必須の処理を追加しない。
- 新しいツールは、一覧ページから辿れる個別ツールとして追加し、UI、処理ロジック、テストデータを機能単位で分ける。
- 重い画像/PDF処理では、メモリ使用量、巨大ファイル、キャンセル可能性、Web Worker の採用可否を検討する。
- 公開サイトに置くサンプルデータ、スクリーンショット、テストフィクスチャには個人情報を含めない。

## Plugins and Skills

- フロントエンド実装、UI品質、ブラウザ検証には、公開プラグイン `build-web-apps@openai-curated` のスキルを優先して使う。
- GitHub Issue、PR、CI、レビュー対応、PR作成には、公開プラグイン `github@openai-curated` のスキルと GitHub MCP を優先して使う。
- このリポジトリ固有の作業では、必要に応じて以下のローカルスキルを読む。
  - `.codex/skills/browser-local-tool/SKILL.md`: ブラウザ完結ツール全般。
  - `.codex/skills/pdf-layout-tool/SKILL.md`: PDF、用紙、面付け、印刷レイアウト。
  - `.codex/skills/github-pages-release/SKILL.md`: GitHub Pages 公開、CI、PR前確認。

## Feature Workflow

1. 開発開始
   - `git status --short --branch` で未整理の変更を確認する。
   - `main` から `feature/<feature-slug>` または `codex/<feature-slug>` ブランチを作成する。
   - 既存の未コミット変更がある場合は、今回の機能に含めるかを明示してから進める。

2. ドキュメント用ディレクトリ作成
   - Git 管理下の `docs/features/<yyyy-mm-dd>-<feature-slug>/` を作る。
   - 最低限、`requirements.md`、`adr.md`、`spec.md`、`traceability.md` を作る。
   - 必要なら `notes.md` や `test-plan.md` を追加する。
   - GitHub Issue は議論やタスク追跡の補助として使ってよいが、要件、ADR、仕様の正本はリポジトリ内ドキュメントに置く。

3. 要件定義
   - `requirements.md` に目的、ユーザー、成功条件、非目標、制約を書く。
   - ブラウザ完結ツールでは、入力ファイルを外部送信しないことを明記する。
   - 大容量ファイル、対応ブラウザ、失敗時の表示、ダウンロード成果物を要件に含める。

4. ADR作成
   - `adr.md` に背景、決定、採用しなかった案、影響を書く。
   - PDF生成ライブラリ、画像処理方式、Web Worker採用有無、Pages配信方式など、後から迷いやすい判断を記録する。

5. 仕様書作成
   - `spec.md` に画面、入力、操作、状態、出力、エラー、アクセシビリティ、テスト観点を書く。
   - APIや型を追加する場合は、公開インターフェースを明示する。
   - 仕様は実装者が追加判断しなくてよい粒度にする。

6. 要件と仕様の突合
   - `traceability.md` に要件IDと仕様項目IDの対応表を作る。
   - 未対応、過剰仕様、矛盾があれば実装前に修正する。
   - 突合が終わるまで実装に入らない。

7. 実装とテスト
   - 実装と検証は Docker 経由で行う。
   - テストを先に、または実装と同じ単位で追加する。
   - 機能単位で UI、処理ロジック、テストデータを分ける。
   - ブラウザ完結ツールでは、外部送信、秘密情報、サーバー依存を追加しない。

8. 仕様と実装の突合
   - `traceability.md` または `implementation-check.md` に、仕様項目ごとの実装状況を書く。
   - 未実装、仕様逸脱、追加挙動を明示する。
   - 仕様を変える必要がある場合は、実装ではなく先に `spec.md` と `traceability.md` を更新する。

9. リファクタリング
   - 振る舞いを変えずに重複、命名、責務分離、テストしやすさを整える。
   - リファクタ後も Docker 経由で同じテストを再実行する。
   - 大きな設計変更が出た場合は ADR を更新する。

10. 最終検証
    - Docker 経由で lint、typecheck、test、build を実行する。
    - 必要なら Docker 経由のブラウザ/E2E検証も行う。
    - 検証結果をPR本文に書ける形でまとめる。

11. PR作成
    - `git diff` と `git status` でPR対象を確認する。
    - 必要なファイルだけ `git add` する。
    - commit して push する。
    - GitHub MCP / GitHub plugin で draft PR を作る。
    - PR本文には、目的、変更内容、要件/仕様/ADRへのリンク、検証コマンド、リスクを書く。

## Verification Expectations

- ルール検証: Docker 必須ルールと Git 例外が明記されていることを確認する。
- ドキュメント検証: 新機能ごとに `requirements.md`、`adr.md`、`spec.md`、`traceability.md` が存在することを確認する。
- 突合検証: 要件と仕様、仕様と実装の突合がPR前に完了していることを確認する。
- 開発検証: Docker 経由で lint、typecheck、test、build が成功することを確認する。
- PR検証: PR本文に検証結果と残リスクが記載されていることを確認する。

## Hooks and CI

- Git hooks は `.githooks/` に置く。利用する場合は `git config core.hooksPath .githooks` を実行する。
- `pre-commit` は、Docker/Compose が整っている場合に lint、typecheck、test を Docker 経由で実行する。
- `pre-push` は、Docker/Compose が整っている場合に build を Docker 経由で実行する。
- GitHub Actions は PR ごとに同じ検証を Docker 経由で実行する。
- GitHub Pages は `main` への push のみ公開対象とし、アプリ本体と Docker/Compose が未整備の場合はデプロイをスキップする。
