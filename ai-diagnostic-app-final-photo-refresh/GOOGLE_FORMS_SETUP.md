# Googleフォーム連携設定手順

このアプリはGitHub Pages上で動く静的Webアプリです。サーバーを持たずに申込内容を受信するため、Googleフォームの `formResponse` に送信します。

## 1. Googleフォームを作成

以下の設問を「記述式」または「段落」で作成してください。

1. 会社名 / 部署名
2. 業種
3. 従業員規模
4. ごお名前名
5. メールアドレス
6. 電話番号
7. 役職 / 部署
8. 希望内容
9. 希望講座
10. 相談内容・補足
11. AI活用圧力スコア
12. 診断レベル
13. 優先して整える領域
14. 推奨講座
15. 診断サマリー
16. 診断JSON
17. 同意確認

## 2. フォームのaction URLを取得

1. Googleフォームを開く
2. 右上の `送信` ではなく、フォーム画面をプレビュー表示
3. ブラウザでページのソースを表示
4. `form action=".../formResponse"` を探す
5. そのURLを `script.js` の `formActionUrl` に貼り付ける

例：

```js
formActionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfxxxxxxx/formResponse"
```

## 3. entry IDを取得

プレビュー画面のソース、またはデベロッパーツールで、各設問に対応する `entry.123456789` を確認します。

`script.js` の `GOOGLE_FORMS_CONFIG.fields` に、各項目のentry IDを設定してください。

```js
fields: {
  companyName: "entry.1111111111",
  industry: "entry.2222222222",
  employeeSize: "entry.3333333333",
  contactName: "entry.4444444444",
  contactEmail: "entry.5555555555",
  contactPhone: "entry.6666666666",
  contactRole: "entry.7777777777",
  requestType: "entry.8888888888",
  desiredCourse: "entry.9999999999",
  applicationNote: "entry.1010101010",
  pressureScore: "entry.1111111112",
  resultLevel: "entry.1212121212",
  riskDimension: "entry.1313131313",
  recommendedCourses: "entry.1414141414",
  diagnosisSummary: "entry.1515151515",
  resultJson: "entry.1616161616",
  consent: "entry.1717171717"
}
```

## 4. 連携を有効化

`script.js` の先頭にある `enabled` を `true` にします。

```js
enabled: true,
```

## 5. テスト

1. GitHub Pagesまたはローカルでアプリを開く
2. 診断を完了
3. 共有フォームに入力
4. `診断結果を添えて送信する` を押す
5. Googleフォームの回答タブに入力内容が届くか確認

## 補足

Googleフォームは外部サイトからの送信を完全なAPIとして提供しているわけではありません。より堅牢にする場合は、Google Apps ScriptでWebアプリURLを作成し、そこへPOSTする構成に変更してください。
