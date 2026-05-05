# Browser Toolbox 準備方針

## リポジトリ方針

- GitHub Pages で公開する、ブラウザ完結型ツール置き場とする。
- ユーザーが投入した画像、PDF、テキスト、CSVなどのファイルを外部送信しない。
- サーバー、秘密鍵、認証、外部ストレージ、外部DBを前提にしない。
- 出力物は PDF に限定しない。画像、テキスト、CSV、ZIP など、各ツールの仕様で定義する。

## 技術スタック

- React + Vite + TypeScript を標準とする。
- GitHub Pages 向けに Vite の `base` は `/browser-toolbox/` とする。
- ローカル作業と検証は Docker Compose 経由で行う。
- 主要な検証コマンドは `npm run lint`、`npm run typecheck`、`npm test`、`npm run build` とする。

## サイト構造

- トップページはツール一覧を表示する。
- 個別ツールは `/tools/<tool-id>` 配下へ追加する。
- ツール定義は入力形式、出力形式、状態、パスを持つ。
- UI、処理ロジック、テストデータは機能単位で分離する。

## ツールバージョニング

- 各ツールはツール単位で Semantic Versioning を行う。
- 現在バージョンとページ表示用の更新履歴はツールの実装メタデータに置く。
- 仕様変更や機能拡張ではADRを作成し、必要に応じて `docs/tools/<tool-en-name>/` の要件定義書、仕様書、トレーサビリティ確認表、更新履歴を更新する。

## ドキュメント構造

- リポジトリ全体、共通仕様、共通運用についてのドキュメントは `docs/project/` に置く。
- 特定ツール単体についてのドキュメントは `docs/tools/<tool-en-name>/` に置く。
- 要件定義書、仕様書、トレーサビリティ確認表、ADRは `docs/project/templates/` のテンプレートを使って作成する。
- ADRはディレクトリごとに `ADR-XXX-<title>.md` 形式で管理する。番号は三桁ゼロ埋め連番、タイトルは kebab-case とする。
- 既存ADRは原則編集せず、新しいADRで変更理由と既存ADRとの関係を示す。

## GitHub Pages

- GitHub Actions で build と deploy を行う。
- `main` への push のみ Pages デプロイ対象とする。
- PR では Docker 経由で lint、typecheck、test、build を実行する。
