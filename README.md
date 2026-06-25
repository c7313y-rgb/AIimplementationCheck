# Edutex AI実装度診断

Edutex向けの静的Webアプリです。大企業のAI導入を、研修止まりではなく「有償診断 -> 部門WS -> 90日PoC -> MVP -> CoE運用」までつなぐ営業導線として設計しています。

## 今回の刷新内容

- ヒーロー、活用シーン、診断導線を全面リデザイン
- 活用シーン用の実写画像 3 枚とイラスト 1 枚を組み込み
- 24問 / 6軸の診断フォームをグルーピングして視認性を改善
- 診断結果に優先アクション、役員向けメモ、推奨プレイブック、90日ロードマップを追加
- 回答の自動保存、サマリーコピー、JSONダウンロード、印刷に対応

## ファイル構成

- `index.html` - 画面全体の構造
- `styles.css` - レイアウトとビジュアルデザイン
- `script.js` - 診断ロジック、結果生成、ローカル保存
- `assets/` - ヒーロー画像、活用シーン画像、イラスト

## ローカル確認

```bash
python3 -m http.server 4173
```

ブラウザで `http://[::1]:4173/` を開くと確認できます。

## GitHub Pages 公開

このフォルダはまだ Git 管理されていないため、初回公開は以下の流れを想定しています。

```bash
git init
git branch -M main
git add .
git commit -m "Launch Edutex AI readiness diagnostic site"
gh repo create edutex-ai-readiness --public --source=. --remote=origin --push
```

その後、GitHub の `Settings -> Pages` で以下を設定します。

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/ (root)`

## 生成した新規アセット

- `assets/hero-executive-briefing.jpg`
- `assets/scene-support-rag.jpg`
- `assets/scene-workshop-mapping.jpg`
- `assets/scene-governance-journey.png`
