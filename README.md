# Browser Toolbox

ブラウザ上で動作するファイル操作ツールの置き場です。このページ上で動作するツールたちはブラウザ上で全ての処理が完結し、入力された内容を外部へ送信、保存しません。

## 方針

- GitHub Pages で公開できる静的サイトとして構成します。
- React + Vite + TypeScript を標準スタックとします。
- 出力形式は PDF に限定せず、画像、テキスト、CSV、ZIP など各ツールごとに定義します。
- ローカル作業と検証は、Git 操作を除き Docker 経由で実行します。

## 開発

依存関係の準備、起動、検証は Docker Compose 経由で行います。

```sh
docker compose run --rm app npm install
docker compose up -d app
```

開発サーバー:

```text
http://localhost:5173/browser-toolbox/
```

## 検証

```sh
docker compose run --rm app npm run lint
docker compose run --rm app npm run typecheck
docker compose run --rm app npm test
docker compose run --rm app npm run build
```

## ツール追加

新しいツールは、`docs/features/<yyyy-mm-dd>-<feature-slug>/` に要件、ADR、仕様、突合表を作ってから実装します。ツール定義は入力形式、出力形式、状態、パスを明示し、PDF以外の成果物も扱えるようにします。

## GitHub Pages

Vite の `base` は `/browser-toolbox/` です。GitHub Actions は `main` への push で Pages デプロイを行う設定にしています。
