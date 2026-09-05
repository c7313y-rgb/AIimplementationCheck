const CONFIG = window.RCG_PORTAL_CONFIG || {};
const SESSION_KEY = 'rcg-ai-portal-session-v1';
const CASES_KEY = 'rcg-ai-portal-cases-v1';
const STATUS_KEY = 'rcg-ai-portal-status-v1';
const DRAFT_PREFIX = 'rcg-ai-portal-draft-v1:';
const accounts = CONFIG.demoAccounts || [];
let currentAccount = null;
let selectedCaseId = '';

const sampleCases = [
  { id: 'AIC-20260903-7C31', company: '東海精密工業（デモ）', industry: '製造', institutionKey: 'regional-demo', score: 76, status: 'meeting', priority: '見積・原価・価格決定', hours: '18〜41h/月', risk: '中：要確認', owner: '営業部長候補', updatedAt: '2026/09/03', summary: '過去案件と原価をExcelで比較する見積判断。月20件・1件30分・3名で、資料検索と判断の属人化が課題。', next: '匿名化した見積20件と現状KPIを確認' },
  { id: 'AIC-20260902-19AF', company: 'みなと食品販売（デモ）', industry: '卸売・小売', institutionKey: 'regional-demo', score: 64, status: 'poc', priority: '顧客・受注判断', hours: '12〜27h/月', risk: '低：標準確認', owner: '販売責任者', updatedAt: '2026/09/02', summary: '受注メールと在庫表の確認を担当者が手作業で実施。欠品と返信遅れを減らしたい。', next: '受注メール50件で検索・要約のPoC' },
  { id: 'AIC-20260829-50D2', company: '北星建設（デモ）', industry: '建設・不動産', institutionKey: 'regional-demo', score: 48, status: 'new', priority: '工程・原価管理', hours: '要実測', risk: '高：専門確認', owner: '未定', updatedAt: '2026/08/29', summary: '紙帳票と現場写真が分散し、工数と判断基準が未整理。まず業務・データ棚卸しが必要。', next: '機密区分とデータ保管先を先に確認' }
];

function $(id) { return document.getElementById(id); }
function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
}
function formatDate(iso) {
  try { return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso)); }
  catch { return iso || ''; }
}
function randomId() {
  const bytes = window.crypto?.getRandomValues ? window.crypto.getRandomValues(new Uint8Array(2)) : null;
  return bytes ? Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('').toUpperCase() : Math.random().toString(16).slice(2, 6).toUpperCase();
}
function showToast(message) {
  let toast = $('toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}
function statusLabel(status) { return ({ new: '新規診断', meeting: '面談準備', poc: 'PoC候補', done: '完了' }[status] || '確認中'); }
function statusClass(status) { return ['new', 'meeting', 'poc', 'done'].includes(status) ? status : 'new'; }
function getStatusOverrides() { try { return JSON.parse(localStorage.getItem(STATUS_KEY) || '{}'); } catch { return {}; } }
function getCases() {
  let own = [];
  try { own = JSON.parse(localStorage.getItem(CASES_KEY) || '[]'); } catch { own = []; }
  const overrides = getStatusOverrides();
  return [...sampleCases, ...own].map(item => ({ ...item, status: overrides[item.id] || item.status, statusLabel: statusLabel(overrides[item.id] || item.status) }));
}
function saveStatus(id, status) {
  const overrides = getStatusOverrides();
  overrides[id] = status;
  localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));
}
function currentInstitution() { return (CONFIG.institutions || []).find(item => item.key === currentAccount?.institutionKey) || (CONFIG.institutions || [])[0] || {}; }
function getSession() { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } }
function accountFor(key) { return accounts.find(account => account.key === key); }
function applyConfig() {
  const provider = CONFIG.provider || {};
  document.documentElement.style.setProperty('--primary', provider.primary || '#0b5666');
  document.documentElement.style.setProperty('--accent', provider.accent || '#1aa38a');
  document.title = `AI経営実装パートナーポータル | ${provider.name || 'RCG'}`;
}

function login(account) {
  currentAccount = account;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ accountKey: account.key, loggedInAt: new Date().toISOString() }));
  $('loginView').classList.add('hidden');
  $('appView').classList.remove('hidden');
  renderApp();
}
function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  currentAccount = null;
  $('appView').classList.add('hidden');
  $('loginView').classList.remove('hidden');
  $('loginPassword').value = '';
}
function attemptLogin(event) {
  event.preventDefault();
  const username = $('loginUsername').value.trim();
  const password = $('loginPassword').value;
  const account = accounts.find(item => item.username === username && item.password === password);
  if (!account) { $('loginError').textContent = 'デモアカウントのユーザー名とパスワードを確認してください。'; return; }
  $('loginError').textContent = '';
  login(account);
}
function fillDemo(key) {
  const account = accountFor(key);
  if (!account) return;
  $('loginUsername').value = account.username;
  $('loginPassword').value = account.password;
  $('loginError').textContent = '';
}

function renderApp() {
  const institution = currentInstitution();
  $('headerOrganization').textContent = currentAccount.organization;
  $('headerRole').textContent = currentAccount.label;
  $('headerUser').textContent = currentAccount.username;
  ['clientView', 'institutionView', 'partnerView'].forEach(id => $(id).classList.add('hidden'));
  if (currentAccount.role === 'client') { $('clientView').classList.remove('hidden'); renderClient(); }
  if (currentAccount.role === 'institution') { $('institutionView').classList.remove('hidden'); renderInstitution(); }
  if (currentAccount.role === 'partner') { $('partnerView').classList.remove('hidden'); renderPartner(); }
  $('clientInstitutionName').textContent = institution.name;
  $('institutionOrgName').textContent = institution.name;
}

function renderClient() {
  const draftKey = `${DRAFT_PREFIX}${currentAccount.username}`;
  let draft = {};
  try { draft = JSON.parse(localStorage.getItem(draftKey) || '{}'); } catch { draft = {}; }
  ['clientGoal', 'clientDecision', 'clientFrequency', 'clientMinutes', 'clientOwner', 'clientRisk'].forEach(id => { if (draft[id] !== undefined) $(id).value = draft[id]; });
  if (Array.isArray(draft.materials)) document.querySelectorAll('input[name="clientMaterial"]').forEach(input => { input.checked = draft.materials.includes(input.value); });
  if (draft.remember !== undefined) $('clientRemember').checked = draft.remember;
  updateClientProgress();
  const ownCase = getCases().filter(item => item.ownerAccount === currentAccount.username).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0];
  if (ownCase) showClientResult(ownCase);
}
function clientDraft() {
  return {
    clientGoal: $('clientGoal').value,
    clientDecision: $('clientDecision').value,
    clientFrequency: $('clientFrequency').value,
    clientMinutes: $('clientMinutes').value,
    clientOwner: $('clientOwner').value,
    clientRisk: $('clientRisk').value,
    materials: Array.from(document.querySelectorAll('input[name="clientMaterial"]:checked'), input => input.value),
    remember: $('clientRemember').checked
  };
}
function updateClientProgress() {
  const draft = clientDraft();
  const values = [draft.clientGoal, draft.clientDecision, draft.materials.length, draft.clientFrequency, draft.clientMinutes];
  const progress = Math.round(values.filter(Boolean).length / values.length * 100);
  $('clientProgress').textContent = `${progress}%`;
}
function saveClientDraft() {
  const draft = clientDraft();
  if (draft.remember) localStorage.setItem(`${DRAFT_PREFIX}${currentAccount.username}`, JSON.stringify(draft));
  else localStorage.removeItem(`${DRAFT_PREFIX}${currentAccount.username}`);
  updateClientProgress();
}
function calculateClientCase(draft) {
  const goalWeight = { sales: 18, margin: 20, productivity: 19, quality: 15 }[draft.clientGoal] || 0;
  const materialWeight = Math.min(18, draft.materials.length * 4);
  const loadWeight = Math.min(20, Number(draft.clientFrequency || 0) * 0.3 + Number(draft.clientMinutes || 0) * 0.25);
  const repeatability = draft.clientFrequency && draft.clientMinutes ? 13 : 4;
  const riskPenalty = Math.max(0, Number(draft.clientRisk || 3) - 2) * 4;
  const score = Math.max(0, Math.min(100, Math.round(28 + goalWeight + materialWeight + loadWeight + repeatability + Number(draft.clientOwner || 3) * 3 - riskPenalty)));
  const status = Number(draft.clientRisk) >= 5 ? 'meeting' : score >= 62 ? 'poc' : score >= 45 ? 'meeting' : 'new';
  const hoursLow = Math.round(Number(draft.clientFrequency || 8) * Number(draft.clientMinutes || 30) / 60 * .2);
  const hoursHigh = Math.round(Number(draft.clientFrequency || 8) * Number(draft.clientMinutes || 30) / 60 * .45);
  const priority = draft.clientGoal === 'margin' ? '見積・原価・価格決定' : draft.clientGoal === 'sales' ? '営業・案件判断' : draft.clientGoal === 'productivity' ? '定型処理・業務運用' : '品質・判断精度向上';
  return { score, status, priority, hours: `${hoursLow}〜${hoursHigh}h/月`, risk: Number(draft.clientRisk) >= 5 ? '高：専門確認' : Number(draft.clientRisk) >= 3 ? '中：要確認' : '低：標準確認', next: status === 'poc' ? '匿名化したサンプル20〜50件と現状KPIを案内元と確認' : '業務フローとデータの棚卸しから開始' };
}
function submitClientDiagnosis(event) {
  event.preventDefault();
  const draft = clientDraft();
  if (!draft.materials.length) { showToast('判断材料を1つ以上選択してください。'); return; }
  const result = calculateClientCase(draft);
  const now = new Date();
  const id = `AIC-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${randomId()}`;
  const item = { id, company: currentAccount.organization, industry: '業種未入力', institutionKey: currentAccount.institutionKey, ownerAccount: currentAccount.username, createdAt: now.toISOString(), updatedAt: now.toISOString(), decision: draft.clientDecision, materials: draft.materials, frequency: draft.clientFrequency, minutes: draft.clientMinutes, ...result, summary: `${draft.clientDecision} 資料：${draft.materials.join('・')}。月${draft.clientFrequency}件・1件${draft.clientMinutes}分。`, statusLabel: statusLabel(result.status) };
  let cases = [];
  try { cases = JSON.parse(localStorage.getItem(CASES_KEY) || '[]'); } catch { cases = []; }
  cases = cases.filter(existing => existing.ownerAccount !== currentAccount.username);
  cases.unshift(item);
  localStorage.setItem(CASES_KEY, JSON.stringify(cases));
  localStorage.removeItem(`${DRAFT_PREFIX}${currentAccount.username}`);
  showClientResult(item);
  showToast(`診断ID ${id} のカルテを作成しました。`);
}
function showClientResult(item) {
  const root = $('clientResult');
  root.classList.remove('hidden');
  root.innerHTML = `<span class="eyebrow">Your diagnostic chart</span><h2>AI経営診断カルテ</h2><div class="result-score"><div class="score-number">${item.score}<small>/100</small></div><div><strong>${esc(statusLabel(item.status))}</strong><p>優先領域：${esc(item.priority)}。まずは限定業務のPoCで効果を実測します。</p></div></div><div class="result-next"><div><strong>診断ID</strong><span>${esc(item.id)}</span></div><div><strong>月間削減時間の仮説</strong><span>${esc(item.hours)}</span></div><div><strong>次の一歩</strong><span>${esc(item.next)}</span></div></div><p>このカルテは融資・補助金採択・導入効果を保証するものではありません。次回面談で、匿名化データ、KPI、機密区分を確認してください。</p><button class="btn secondary" id="clientPrintBtn" type="button">カルテを印刷 / PDF保存</button>`;
  $('clientPrintBtn').onclick = printActiveView;
}

function metricCard(label, value, note) { return `<article class="metric-card"><span>${label}</span><strong>${value}</strong><small>${note}</small></article>`; }
function renderInstitution() {
  const cases = getCases().filter(item => item.institutionKey === currentAccount.institutionKey);
  const counts = { all: cases.length, new: cases.filter(item => item.status === 'new').length, meeting: cases.filter(item => item.status === 'meeting').length, poc: cases.filter(item => item.status === 'poc').length };
  $('institutionMetrics').innerHTML = metricCard('紹介企業', counts.all, '診断IDで管理') + metricCard('新規診断', counts.new, '要確認') + metricCard('面談準備', counts.meeting, '次回面談へ') + metricCard('PoC候補', counts.poc, '実装検討');
  const filter = $('institutionFilter').value;
  const filtered = filter === 'all' ? cases : cases.filter(item => item.status === filter);
  $('institutionCaseList').innerHTML = filtered.length ? filtered.map(item => `<button class="case-row ${selectedCaseId === item.id ? 'selected' : ''}" type="button" data-case-id="${esc(item.id)}"><strong>${esc(item.company)}</strong><span>${esc(item.priority)}</span><span class="case-score">${item.score}</span><span class="status-pill ${statusClass(item.status)}">${esc(item.statusLabel)}</span></button>`).join('') : '<div class="empty-list">該当する診断はありません。</div>';
  $('institutionCaseList').querySelectorAll('[data-case-id]').forEach(button => { button.onclick = () => { selectedCaseId = button.dataset.caseId; renderInstitution(); }; });
  if (!selectedCaseId || !filtered.some(item => item.id === selectedCaseId)) selectedCaseId = filtered[0]?.id || '';
  renderInstitutionDetail(cases.find(item => item.id === selectedCaseId));
}
function renderInstitutionDetail(item) {
  const root = $('institutionCaseDetail');
  if (!item) { root.innerHTML = '<div class="empty-state"><span>↗</span><h3>企業を選択してください</h3><p>一覧から診断カルテを選ぶと、面談に必要な要点が表示されます。</p></div>'; return; }
  root.innerHTML = `<div class="detail-head"><div><small>${esc(item.id)}</small><h3>${esc(item.company)}</h3><small>${esc(item.industry)} / 最終更新 ${esc(item.updatedAt || '')}</small></div><span class="status-pill ${statusClass(item.status)}">${esc(item.statusLabel)}</span></div><div class="detail-grid"><div class="detail-item"><span>AI導入適性</span><strong>${item.score}/100</strong></div><div class="detail-item"><span>優先領域</span><strong>${esc(item.priority)}</strong></div><div class="detail-item"><span>削減時間の仮説</span><strong>${esc(item.hours)}</strong></div><div class="detail-item"><span>情報管理</span><strong>${esc(item.risk)}</strong></div></div><div class="detail-note"><strong>診断サマリー</strong><br>${esc(item.summary || 'サマリーは次回面談で確認')}</div><div class="detail-note"><strong>次回確認</strong><br>${esc(item.next || '推進責任者、データ、KPI、機密区分を確認')}</div><div class="detail-actions"><button class="btn primary" id="markMeetingBtn" type="button">面談準備にする</button><button class="btn secondary" id="institutionPrintBtn" type="button">印刷</button></div>`;
  $('markMeetingBtn').onclick = () => { saveStatus(item.id, item.status === 'poc' ? 'poc' : 'meeting'); showToast('案件ステータスを更新しました。'); renderInstitution(); };
  $('institutionPrintBtn').onclick = printActiveView;
}

function renderPartner() {
  const cases = getCases();
  const avg = cases.length ? Math.round(cases.reduce((sum, item) => sum + Number(item.score || 0), 0) / cases.length) : 0;
  $('partnerMetrics').innerHTML = metricCard('全案件', cases.length, '紹介元横断') + metricCard('平均スコア', avg, '0〜100') + metricCard('PoC候補', cases.filter(item => item.status === 'poc').length, '実装検討') + metricCard('連携先', (CONFIG.institutions || []).length, '登録済み');
  $('partnerCaseTable').innerHTML = `<table><thead><tr><th>診断ID / 企業</th><th>紹介元</th><th>優先領域</th><th>スコア</th><th>状態</th></tr></thead><tbody>${cases.map(item => `<tr><td><strong>${esc(item.id)}</strong><br>${esc(item.company)}</td><td>${esc(currentInstitutionName(item.institutionKey))}</td><td>${esc(item.priority)}</td><td class="score-cell">${item.score}</td><td><span class="status-pill ${statusClass(item.status)}">${esc(item.statusLabel)}</span></td></tr>`).join('')}</tbody></table>`;
  const provider = CONFIG.provider || {};
  const partners = CONFIG.implementationPartners || [];
  $('partnerRegistry').innerHTML = `<div class="registry-item"><strong>${esc(provider.name)}</strong><span>${esc(provider.role)}</span><small>公式URL：${esc(provider.url)}</small></div>${partners.map(partner => `<div class="registry-item"><strong>${esc(partner.name)}</strong><span>${esc(partner.role)}</span><small>${esc(partner.status)}</small></div>`).join('')}`;
  $('exportCsvBtn').onclick = exportCsv;
}
function currentInstitutionName(key) { return (CONFIG.institutions || []).find(item => item.key === key)?.name || '紹介元未設定'; }
function exportCsv() {
  const rows = [['診断ID', '企業', '紹介元', '優先領域', 'スコア', '状態', '更新日'], ...getCases().map(item => [item.id, item.company, currentInstitutionName(item.institutionKey), item.priority, item.score, item.statusLabel, item.updatedAt || ''])];
  const csv = rows.map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([`\ufeff${csv}`], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'rcg-ai-portal-cases.csv'; link.click(); URL.revokeObjectURL(link.href); showToast('案件一覧CSVを書き出しました。');
}
function printActiveView() {
  const view = document.querySelector('.role-view:not(.hidden)');
  if (!view) return;
  view.classList.add('print-target');
  window.print();
  window.setTimeout(() => view.classList.remove('print-target'), 1000);
}

function openDemoInfo() { const dialog = $('demoInfoDialog'); if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', ''); }
function closeDemoInfo() { const dialog = $('demoInfoDialog'); if (dialog.close) dialog.close(); else dialog.removeAttribute('open'); }

applyConfig();
$('loginForm').addEventListener('submit', attemptLogin);
document.querySelectorAll('[data-demo]').forEach(button => button.addEventListener('click', () => fillDemo(button.dataset.demo)));
$('logoutBtn').addEventListener('click', logout);
$('demoInfoBtn').addEventListener('click', openDemoInfo);
document.querySelector('.dialog-close').addEventListener('click', closeDemoInfo);
$('diagnosisForm').addEventListener('submit', submitClientDiagnosis);
['clientGoal', 'clientDecision', 'clientFrequency', 'clientMinutes', 'clientOwner', 'clientRisk', 'clientRemember'].forEach(id => $(id).addEventListener('input', updateClientProgress));
document.querySelectorAll('input[name="clientMaterial"]').forEach(input => input.addEventListener('change', updateClientProgress));
document.querySelectorAll('#diagnosisForm input, #diagnosisForm select, #diagnosisForm textarea').forEach(input => input.addEventListener('change', saveClientDraft));
$('institutionFilter').addEventListener('change', () => { selectedCaseId = ''; renderInstitution(); });

const session = getSession();
if (session && accountFor(session.accountKey)) login(accountFor(session.accountKey));
