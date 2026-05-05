---
name: github-pages-release
description: このリポジトリをGitHub Pagesの静的サイトとして準備、検証、公開するときに使う。GitHub Actions、PR前確認、Pages配信が対象。
---

# GitHub Pages Release

このスキルは、GitHub Pages 公開、CI、PR前確認で使う。

## 基本ルール

- GitHub Pages で公開できる静的成果物だけを配信する。
- Pages デプロイには GitHub Actions を優先する。
- デプロイ対象は `main` への push のみにする。
- PR は、ユーザーが ready-for-review を求めない限り draft として作る。
- Issue、PR、コメント、レビュー、CI確認は GitHub MCP / GitHub plugin を優先する。
- ローカルの `git` はブランチ、commit、push など Git 操作だけに使う。

## 確認項目

- build は Docker 経由で実行する。
- アプリ導入時は Vite の `base` が `/browser-toolbox/` になっていることを確認する。
- secret、個人情報を含むサンプル、生成物の `output/` を commit しない。
- PR本文に検証コマンド、Pages への影響、残リスクを書く。
