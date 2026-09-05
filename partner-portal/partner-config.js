/**
 * Partner registry for the independent RCG portal demo.
 * Add a provider, institution or implementation partner here and use its key
 * in the account / referral setup. The UI never accepts arbitrary HTML or
 * unregistered provider names from a URL.
 */
window.RCG_PORTAL_CONFIG = {
  appVersion: '1.0.0-demo',
  provider: {
    key: 'rcg',
    name: '株式会社RCG',
    shortName: 'RCG',
    url: 'https://rcg2020.co.jp/',
    role: 'サービス提供者',
    primary: '#0b5666',
    accent: '#1aa38a'
  },
  implementationPartners: [
    { key: 'edutex', name: 'Edutex株式会社', role: 'AI実装・導入支援', status: '採択通知確認済み' },
    { key: 'future', name: '提携パートナー（追加枠）', role: '今後登録', status: '準備中' }
  ],
  institutions: [
    { key: 'regional-demo', name: '地域金融機関・自治体連携（デモ）', type: '金融機関・自治体', program: 'AI経営実装支援プログラム' }
  ],
  demoAccounts: [
    { key: 'client', username: 'client.demo', password: 'client2026!', role: 'client', label: '取引先企業', organization: 'サンプル製造株式会社', institutionKey: 'regional-demo' },
    { key: 'institution', username: 'institution.demo', password: 'institution2026!', role: 'institution', label: '金融機関・自治体', organization: '地域金融機関・自治体連携（デモ）', institutionKey: 'regional-demo' },
    { key: 'partner', username: 'partner.demo', password: 'partner2026!', role: 'partner', label: 'RCG・連携パートナー', organization: '株式会社RCG パートナーデスク', institutionKey: 'regional-demo' }
  ]
};
