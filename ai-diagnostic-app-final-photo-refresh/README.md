# Edutex社製 AI実装度診断

大企業向けに、従来の「AIスキル診断」を拡張し、業務量・データ所在・権限・リスク・ROI・AI適用難易度まで評価する静的Webアプリです。

公開想定URL: https://c7313y-rgb.github.io/AI-check/

## 主な機能

- 28問のAI実装度診断
- 7軸評価：業務量 / データ所在 / 権限 / リスク / ROI / AI適用難易度 / 推進体制
- 総合スコア、ROIポテンシャル、実装リスクの自動算出
- 企業別導線：レスター型 / 大和ハウス型 / オリックス型 / ifLink会員型
- 推奨メニュー：AI実装度診断、部門WS、90日PoC、MVP、CoE/LLMOps
- 稟議用サマリーのコピー、診断JSONダウンロード

## GitHub Pages公開方法

1. このリポジトリの `main` ブランチに `index.html`, `script.js`, `styles.css`, `assets/` を配置
2. GitHub の Settings → Pages で Source を `Deploy from a branch` に設定
3. Branch を `main`、Folder を `/root` に設定
4. 数分後に `https://c7313y-rgb.github.io/AI-check/` で公開

## 編集方針

- Edutex社製として表記
- 大企業向けの営業導線を「診断 → 部門WS/講座 → 90日PoC → MVP/横展開 → CoE運用」に統一
- 価格は概算・税別・個別見積前提
