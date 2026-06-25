const axes = {
  workload: { label: "業務量", desc: "削減余地・頻度・横展開規模" },
  data: { label: "データ所在", desc: "文書・業務データの所在と整備度" },
  authority: { label: "権限", desc: "利用権限・承認者・接続可否" },
  risk: { label: "リスク", desc: "機密・個人情報・監査・ガバナンス" },
  roi: { label: "ROI", desc: "削減時間・品質・売上貢献・KPI" },
  difficulty: { label: "適用難易度", desc: "AI化の複雑さ・要件確度" },
  organization: { label: "推進体制", desc: "経営・事業部・情シス・現場の巻き込み" }
};

const questions = [
  { id:"q1", tag:"業務量", text:"AIで置き換えたい業務は、週次または日次で繰り返し発生していますか？", help:"頻度が高いほどPoC効果を測定しやすくなります。", axis:"workload", options:["ほぼない","月次程度","週次である","複数部門で週次","全社的に日次で発生"] },
  { id:"q2", tag:"業務量", text:"対象業務に関わる人数・部門数はどの程度ですか？", help:"横展開余地が大きいほど投資対効果が出しやすくなります。", axis:"workload", options:["1名依存","数名","1部門","複数部門","グループ会社まで広がる"] },
  { id:"q3", tag:"業務量", text:"資料作成・調査・報告・FAQ対応などの作業時間を把握できていますか？", help:"現状工数が見えるとROI試算ができます。", axis:"workload", options:["不明","感覚値のみ","一部把握","部署別に把握","KPIとして管理"] },
  { id:"q4", tag:"業務量", text:"属人化・引継ぎ困難・ナレッジ散在が業務上の問題になっていますか？", help:"RAG/ナレッジBot/AIエージェントの候補になります。", axis:"workload", options:["問題なし","軽微","一部で発生","複数部門で深刻","事業継続リスク"] },

  { id:"q5", tag:"データ所在", text:"AI化したい業務の元データや文書の所在は特定できていますか？", help:"ファイルサーバー、SaaS、CRM、メール、紙資料などの所在です。", axis:"data", options:["不明","担当者PCに散在","共有フォルダ中心","主要SaaS/DBに整理","データカタログ化済み"] },
  { id:"q6", tag:"データ所在", text:"対象データはAI学習・RAG・検索に使える形式で整っていますか？", help:"PDF、Excel、FAQ、議事録、画像、基幹DBなどの品質を見ます。", axis:"data", options:["紙/画像中心","PDFが多く構造化不足","Excel/文書が混在","ある程度構造化","API/DB連携可能"] },
  { id:"q7", tag:"データ所在", text:"社内データのオーナー部署や利用承認者は明確ですか？", help:"PoC前に権限と承認経路が曖昧だと停滞します。", axis:"data", options:["不明","担当者判断","部署長判断","情シス/法務と整理","データガバナンス体制あり"] },
  { id:"q8", tag:"データ所在", text:"過去の提案書・FAQ・仕様書・議事録など、AIに読ませたいナレッジは十分ありますか？", help:"蓄積量が多いほどRAG・提案書生成に向きます。", axis:"data", options:["少ない","断片的","一定量ある","部門別に蓄積","全社資産として豊富"] },

  { id:"q9", tag:"権限", text:"ChatGPT/Copilot/Gemini等の利用ルールは整備されていますか？", help:"ルールがないと大企業では本格導入に進みにくいです。", axis:"authority", options:["未整備","禁止/黙認","暫定ルールあり","部門運用あり","全社規程・教育済み"] },
  { id:"q10", tag:"権限", text:"AIツールやクラウド/APIを利用するための情シス承認は取りやすいですか？", help:"セキュリティ審査・購買・契約の通りやすさです。", axis:"authority", options:["非常に難しい","時間がかかる","案件ごとに可能","条件付きで可能","標準プロセスあり"] },
  { id:"q11", tag:"権限", text:"PoCで使用できるデータ範囲や匿名化方針は決められていますか？", help:"PoCスコープとデータ条件が決まると実装が早くなります。", axis:"authority", options:["未定","相談中","一部のみ可能","条件付きで可能","PoC用データセットあり"] },
  { id:"q12", tag:"権限", text:"部門長・経営・人事・情シスの誰が意思決定者か明確ですか？", help:"大企業営業では同席部門数と決裁経路が重要です。", axis:"authority", options:["不明","担当者のみ","部門長候補あり","複数部門で認識","決裁者と予算枠が明確"] },

  { id:"q13", tag:"リスク", text:"個人情報・機密情報・顧客情報をAIで扱う可能性がありますか？", help:"扱う場合は、禁止ではなく安全設計が必要です。", axis:"risk", invert:true, options:["ほぼない","一部ある","部署によりある","多い","高機密/規制領域が中心"] },
  { id:"q14", tag:"リスク", text:"AI出力の誤り、著作権、説明責任に対するレビュー体制はありますか？", help:"人間レビュー、ログ、責任分界の有無です。", axis:"risk", options:["ない","個人判断","一部チェック","承認フローあり","監査ログ/責任分界あり"] },
  { id:"q15", tag:"リスク", text:"AI利用ログやプロンプト、出力結果を後から確認できる運用はありますか？", help:"本実装・CoE/LLMOpsでは必須になります。", axis:"risk", options:["ない","手元保存のみ","一部ツールで可能","部門で管理","全社ログ/監査可能"] },
  { id:"q16", tag:"リスク", text:"AIガバナンスを担当する部署・会議体はありますか？", help:"法務・情シス・人事・事業部の連携を見ます。", axis:"risk", options:["ない","担当者任せ","検討中","会議体あり","CoE/委員会あり"] },

  { id:"q17", tag:"ROI", text:"AI導入で削減したい時間・費用・工数を数値で置けますか？", help:"稟議では削減時間と費用対効果が必要です。", axis:"roi", options:["置けない","概算のみ","一部置ける","部署別に置ける","KPIとして追える"] },
  { id:"q18", tag:"ROI", text:"AI活用を売上・提案力・顧客接点・外販商材に接続できますか？", help:"レスター型・オリックス型・ifLink型では特に重要です。", axis:"roi", options:["難しい","間接効果のみ","テーマ候補あり","顧客提案に使える","外販/商材化できる"] },
  { id:"q19", tag:"ROI", text:"PoC完了後に本実装へ進むための予算化ルートはありますか？", help:"PoCで終わらせないための予算導線です。", axis:"roi", options:["ない","人事研修予算のみ","部門予算あり","DX/開発予算あり","本実装予算枠あり"] },
  { id:"q20", tag:"ROI", text:"AIの成果を経営会議や稟議で説明できる資料が必要ですか？", help:"必要性が高いほど90日パッケージが刺さります。", axis:"roi", options:["不要","あればよい","必要","かなり必要","直近で必要"] },

  { id:"q21", tag:"適用難易度", text:"AI化したい業務は、判断基準や例外処理が多いですか？", help:"複雑な業務ほど要件定義と段階PoCが必要です。", axis:"difficulty", invert:true, options:["単純","やや単純","普通","例外が多い","高度な判断が必要"] },
  { id:"q22", tag:"適用難易度", text:"RAG、FAQ Bot、文書検索、提案書生成など、比較的PoC化しやすいテーマがありますか？", help:"短期成果を作りやすいテーマの有無です。", axis:"difficulty", options:["ない","要探索","1件ある","複数ある","優先順位まである"] },
  { id:"q23", tag:"適用難易度", text:"基幹システム・SFA・CRM・IoT・文書管理との連携が必要ですか？", help:"連携が深いほど難易度は上がりますが、価値も大きくなります。", axis:"difficulty", invert:true, options:["不要","軽微","一部必要","複数連携","基幹/API連携が必須"] },
  { id:"q24", tag:"適用難易度", text:"PoCテーマを1〜2件に絞り、90日で検証する合意を作れますか？", help:"合意形成できると実装受託に進みやすくなります。", axis:"difficulty", options:["難しい","要調整","可能性あり","概ね可能","すぐ可能"] },

  { id:"q25", tag:"推進体制", text:"AI推進の責任者または旗振り役はいますか？", help:"推進者がいないと講座後に止まりやすくなります。", axis:"organization", options:["いない","兼務で弱い","担当者あり","部門責任者あり","経営直下/CoEあり"] },
  { id:"q26", tag:"推進体制", text:"現場部門がAI活用テーマを自分ごととして出せますか？", help:"人事主導だけでは実装テーマ化が弱くなります。", axis:"organization", options:["出せない","一部のみ","候補は出せる","部門別に出せる","現場主導で進む"] },
  { id:"q27", tag:"推進体制", text:"人事・情シス・事業部・法務/リスク管理が同じ場で議論できますか？", help:"大企業では部門横断の合意がボトルネックになります。", axis:"organization", options:["難しい","個別調整","必要時のみ","会議体化可能","定例で連携済み"] },
  { id:"q28", tag:"推進体制", text:"研修後に、実装伴走・PoC・MVP開発へ進む社内期待がありますか？", help:"AI講座を実装商品につなぐ営業導線の強さです。", axis:"organization", options:["ない","情報収集のみ","可能性あり","期待あり","すぐ相談したい"] }
];

const packages = [
  { key:"diagnosis", title:"AI実装度診断", price:"30〜50万円", term:"2週間", desc:"経営・部門ヒアリング、業務/データ/権限/リスク/ROI棚卸し。PoC候補10件と優先順位を提示。", fit:"入口商品" },
  { key:"workshop", title:"部門別 業務改善WS", price:"80〜120万円/回", term:"1日", desc:"業務分解、プロンプト集、RAG/自動化候補、実装優先度表を作成。", fit:"部門予算化" },
  { key:"training", title:"AIリテラシー定着", price:"1名2.5〜4.5万円", term:"1か月", desc:"生成AI基礎、社内ルール、Copilot/ChatGPT活用、確認テスト、部門別活用例。", fit:"全社教育" },
  { key:"si90", title:"提案力強化90日", price:"350〜600万円", term:"12週間", desc:"顧客提案テンプレート、RMS/IoT/AI提案書、PoC設計書、営業トークを成果物化。", fit:"レスター/SI向け" },
  { key:"poc", title:"PoC設計パック", price:"120〜250万円", term:"4週間", desc:"要件定義、KPI、データ条件、セキュリティ、見積、WBSを整理。", fit:"稟議前" },
  { key:"mvp", title:"業務AI MVP", price:"800〜1,500万円", term:"8〜12週間", desc:"RAG、FAQ、文書抽出、提案書生成、社内Bot等のMVPと効果測定。", fit:"本命受注" },
  { key:"coe", title:"AI CoE / LLMOps", price:"月80〜200万円", term:"月次", desc:"利用状況分析、プロンプト改善、モデル/権限/リスク管理、追加ユースケース整理。", fit:"運用伴走" }
];

const cases = [
  { name:"レスター型", score:"A", title:"AI×IoT外販/SI提案", desc:"AI導入・活用支援、製造業向けAIソリューションの文脈が強い。営業/SI提案力強化90日が最優先。", route:"BU・営業・技術責任者へ、90日で顧客提案に使える成果物を提示。" },
  { name:"大和ハウス型", score:"A-", title:"建設・不動産・物件管理DX", desc:"基礎講座ではなく、建設・不動産・物件管理・バックオフィス業務特化RAG/Agent PoCが刺さる。", route:"DX部門に現場別ユースケース診断＋KPI設計を有償提案。" },
  { name:"オリックス型", score:"A-", title:"AI-OCR/文書DX外販", desc:"AI-OCR/文書DXの営業強化、金融・リース・法人営業向け生成AI提案研修、社内業務PoC。", route:"デジタル戦略・法人営業へ商材拡販研修＋顧客提案テンプレートを提示。" },
  { name:"ifLink会員型", score:"A", title:"AI×IoT共創PoC", desc:"IoT・DX・共創に親和性が高い会員に、AI×IoT共創WSと個社PoCを提案。", route:"公開WS → 個社別診断 → 共同PoCの3段階。" }
];

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const clamp = (v,min,max)=>Math.max(min,Math.min(max,v));

function renderQuestions(){
  const box = $('#questionsContainer');
  box.innerHTML = questions.map((q, i) => `
    <article class="question-card" data-axis="${q.axis}">
      <div class="question-meta"><span class="question-index">Q${String(i+1).padStart(2,'0')}</span><span class="question-tag">${q.tag}</span></div>
      <h3>${q.text}</h3><p>${q.help}</p>
      <div class="option-row" role="radiogroup" aria-label="${q.text}">
        ${q.options.map((op, idx) => `
          <label><input type="radio" name="${q.id}" value="${idx+1}" ${idx===2?'checked':''}/><span class="option-number">${idx+1}</span><span class="option-text">${op}</span></label>
        `).join('')}
      </div>
    </article>`).join('');
  updateProgress();
}

function renderStaticCards(){
  $('#packageGrid').innerHTML = packages.map(p => `<article class="package-card"><span class="package-fit">${p.fit}</span><h3>${p.title}</h3><strong>${p.price}</strong><p class="term">${p.term}</p><p>${p.desc}</p></article>`).join('');
  $('#caseGrid').innerHTML = cases.map(c => `<article class="case-card"><span class="case-score">${c.score}</span><h3>${c.name}</h3><h4>${c.title}</h4><p>${c.desc}</p><small>${c.route}</small></article>`).join('');
}

function collectAnswers(){
  const answers = {};
  questions.forEach(q => {
    const checked = $(`input[name="${q.id}"]:checked`);
    answers[q.id] = checked ? Number(checked.value) : 0;
  });
  return answers;
}

function updateProgress(){
  const answered = questions.filter(q => $(`input[name="${q.id}"]:checked`)).length;
  const pct = Math.round(answered / questions.length * 100);
  $('#progressText').textContent = `${pct}%`;
  $('#progressBar').style.width = `${pct}%`;
  $('#progressHint').textContent = pct === 100 ? '診断結果を表示できます。' : `あと${questions.length - answered}問です。`;
}

function calculate(){
  const raw = {}; Object.keys(axes).forEach(k => raw[k] = []);
  questions.forEach(q => {
    const val = Number($(`input[name="${q.id}"]:checked`)?.value || 0);
    const score = q.invert ? (6 - val) : val;
    raw[q.axis].push(score);
  });
  const axisScores = {};
  Object.keys(raw).forEach(k => axisScores[k] = Math.round((raw[k].reduce((a,b)=>a+b,0) / (raw[k].length*5)) * 100));
  const weights = { workload:1.05, data:1.15, authority:1.0, risk:1.05, roi:1.25, difficulty:1.0, organization:1.15 };
  const totalWeight = Object.values(weights).reduce((a,b)=>a+b,0);
  const readiness = Math.round(Object.entries(axisScores).reduce((sum,[k,v]) => sum + v*weights[k], 0) / totalWeight);
  const blockers = Object.entries(axisScores).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k])=>k);
  const strengths = Object.entries(axisScores).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([k])=>k);
  const implementationRisk = Math.round((100 - axisScores.risk)*0.35 + (100 - axisScores.authority)*0.3 + (100 - axisScores.data)*0.2 + (100 - axisScores.organization)*0.15);
  const roiPotential = Math.round(axisScores.workload*0.35 + axisScores.roi*0.45 + axisScores.data*0.2);
  let level, comment;
  if (readiness >= 80) { level = 'A：本実装・横展開候補'; comment = '90日PoCからMVP/部門横展開へ進める状態です。稟議材料とガバナンスを整えれば本実装に接続できます。'; }
  else if (readiness >= 65) { level = 'B：90日PoC候補'; comment = '部門別PoCに進めます。データ条件・権限・成果KPIを絞ることで、500〜900万円規模の実装パッケージ化が可能です。'; }
  else if (readiness >= 50) { level = 'C：診断＋部門WSから開始'; comment = 'スキル研修だけでは弱く、業務棚卸し・データ所在・リスク条件の確認が必要です。まず有償診断と部門WSが適切です。'; }
  else { level = 'D：基礎整備フェーズ'; comment = 'AI導入ルール、対象業務、データ所在、推進者の明確化が先です。全社教育と実装テーマ探索から始めるべきです。'; }
  let recommended;
  if (readiness >= 80) recommended = ['業務AI MVP', '部門横展開', 'AI CoE / LLMOps'];
  else if (readiness >= 65) recommended = ['提案力強化90日', 'PoC設計パック', '部門別 業務改善WS'];
  else if (readiness >= 50) recommended = ['AI実装度診断', '部門別 業務改善WS', 'AIリテラシー定着'];
  else recommended = ['AI実装度診断', 'AIリテラシー定着', '利用ルール整備WS'];
  return { axisScores, readiness, blockers, strengths, implementationRisk, roiPotential, level, comment, recommended };
}

function drawRadar(scores){
  const canvas = $('#radarCanvas'); const ctx = canvas.getContext('2d');
  const size = canvas.width = canvas.height = 520; ctx.clearRect(0,0,size,size);
  const cx=size/2, cy=size/2, maxR=190; const keys=Object.keys(axes); const n=keys.length;
  ctx.font='15px system-ui, -apple-system, BlinkMacSystemFont, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  for(let ring=1; ring<=5; ring++){
    ctx.beginPath(); keys.forEach((k,i)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; const r=maxR*ring/5; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.closePath(); ctx.strokeStyle='rgba(37,99,235,.18)'; ctx.stroke();
  }
  keys.forEach((k,i)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*maxR, cy+Math.sin(a)*maxR); ctx.strokeStyle='rgba(37,99,235,.12)'; ctx.stroke(); const lx=cx+Math.cos(a)*(maxR+42), ly=cy+Math.sin(a)*(maxR+42); ctx.fillStyle='#1e3a8a'; ctx.fillText(axes[k].label, lx, ly); });
  ctx.beginPath(); keys.forEach((k,i)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; const r=maxR*scores[k]/100; const x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.closePath(); ctx.fillStyle='rgba(20,184,166,.22)'; ctx.fill(); ctx.strokeStyle='#14b8a6'; ctx.lineWidth=3; ctx.stroke();
  keys.forEach((k,i)=>{ const a=-Math.PI/2 + i*2*Math.PI/n; const r=maxR*scores[k]/100; ctx.beginPath(); ctx.arc(cx+Math.cos(a)*r, cy+Math.sin(a)*r, 5, 0, Math.PI*2); ctx.fillStyle='#f59e0b'; ctx.fill(); });
}

function axisList(keys){ return keys.map(k=>`<li><strong>${axes[k].label}</strong><span>${axes[k].desc}</span></li>`).join(''); }
function recommendedCards(names){
  return names.map(name => {
    const p = packages.find(x => x.title === name) || {title:name, price:'個別見積', term:'要件定義後', desc:'現状に応じて設計します。', fit:'追加'};
    return `<article class="recommendation-card"><span>${p.fit}</span><h3>${p.title}</h3><strong>${p.price}</strong><p>${p.term}</p><p>${p.desc}</p></article>`;
  }).join('');
}

function caseAdvice(targetCase, result){
  const hit = cases.find(c => targetCase.startsWith(c.name.replace('型','')) || targetCase.includes(c.name.replace('型','')));
  const base = hit || cases[0];
  const next = result.readiness >= 65 ? '90日PoC提案書と概算見積を提示' : '有償診断30〜50万円と部門WSを提示';
  return { ...base, next };
}

function renderResult(result){
  const company = $('#companyName').value.trim() || '未入力企業';
  const industry = $('#industry').value; const employeeSize = $('#employeeSize').value; const targetCase = $('#targetCase').value;
  const advice = caseAdvice(targetCase, result);
  $('#resultRoot').innerHTML = `
    <div class="result-grid">
      <section class="score-hero"><div class="score-ring" style="--ring:${result.readiness*3.6}deg"><span>${result.readiness}</span></div><div><p class="eyebrow">AI Implementation Score</p><h3>${result.level}</h3><p>${result.comment}</p><div class="result-badges"><span>${company}</span><span>${industry}</span><span>${employeeSize}</span></div></div></section>
      <section class="radar-card"><canvas id="radarCanvas" width="520" height="520" aria-label="7軸レーダーチャート"></canvas></section>
    </div>
    <div class="kpi-grid">
      <article class="kpi-card"><span>ROIポテンシャル</span><strong>${result.roiPotential}</strong><p>削減余地・収益化・データ活用余地</p></article>
      <article class="kpi-card"><span>実装リスク</span><strong>${result.implementationRisk}</strong><p>高いほど権限・リスク・体制の事前整理が必要</p></article>
      <article class="kpi-card"><span>推奨営業導線</span><strong>${result.readiness>=65?'90日PoC':'有償診断'}</strong><p>決裁者に出す最初の商品</p></article>
      <article class="kpi-card"><span>PoC候補</span><strong>${result.readiness>=70?'10+':'3〜10'}</strong><p>診断後に抽出すべき候補数</p></article>
    </div>
    <section class="risk-message"><strong>営業コメント</strong><p>「AIの基礎を学びましょう」ではなく、「御社の既存AI投資を、部門KPI・業務テンプレート・PoC成果物に変換します」と提示してください。</p></section>
    <div class="insight-grid">
      <article><h3>強み</h3><ul>${axisList(result.strengths)}</ul></article>
      <article><h3>先に詰めるべき論点</h3><ul>${axisList(result.blockers)}</ul></article>
      <article><h3>企業別導線</h3><p><strong>${advice.name} / ${advice.score}</strong></p><p>${advice.desc}</p><p class="next-action">次アクション：${advice.next}</p></article>
    </div>
    <section class="recommendation-section"><h3>推奨メニュー</h3><div class="recommendations">${recommendedCards(result.recommended)}</div></section>
    <section class="roadmap-section"><h3>90日ロードマップ</h3><div class="roadmap"><article><span>Week 1-2</span><strong>診断・棚卸し</strong><p>業務量、データ所在、権限、リスク、KPI仮説を整理。</p></article><article><span>Week 3-4</span><strong>実践研修</strong><p>対象部門向けに生成AI・RAG・Copilot・開発AIをハンズオン化。</p></article><article><span>Week 5-8</span><strong>PoC設計/試作</strong><p>1〜2テーマでRAG、文書処理、FAQ、提案書生成を試作。</p></article><article><span>Week 9-12</span><strong>効果測定/横展開</strong><p>削減時間、品質、ガバナンス、費用対効果、横展開WBSを整理。</p></article></div></section>
    <div class="result-actions"><button class="primary-btn" type="button" id="copyResultBtn">稟議用サマリーをコピー</button><button class="ghost-btn" type="button" id="downloadJsonBtn">診断JSONをダウンロード</button></div>
  `;
  drawRadar(result.axisScores);
  $('#copyResultBtn').addEventListener('click', () => copySummary(result, advice));
  $('#downloadJsonBtn').addEventListener('click', () => downloadJson(result, advice));
}

function summaryText(result, advice){
  const company = $('#companyName').value.trim() || '未入力企業';
  return `【Edutex社製 AI実装度診断サマリー】\n会社/部署：${company}\n業種：${$('#industry').value}\n従業員規模：${$('#employeeSize').value}\n総合スコア：${result.readiness}/100\n判定：${result.level}\nROIポテンシャル：${result.roiPotential}/100\n実装リスク：${result.implementationRisk}/100\n強み：${result.strengths.map(k=>axes[k].label).join('、')}\n先に詰める論点：${result.blockers.map(k=>axes[k].label).join('、')}\n推奨メニュー：${result.recommended.join('、')}\n企業別導線：${advice.name} / ${advice.next}\nコメント：${result.comment}`;
}
async function copySummary(result, advice){ await navigator.clipboard.writeText(summaryText(result, advice)); alert('稟議用サマリーをコピーしました。'); }
function downloadJson(result, advice){
  const data = { generatedAt:new Date().toISOString(), profile:{ companyName:$('#companyName').value, industry:$('#industry').value, employeeSize:$('#employeeSize').value, targetCase:$('#targetCase').value }, result, advice, answers:collectAnswers() };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'edutex-ai-readiness-result.json'; a.click(); URL.revokeObjectURL(a.href);
}

function submitAssessment(e){
  e.preventDefault();
  const result = calculate();
  $('#preview').classList.remove('hidden');
  renderResult(result);
  setTimeout(()=>$('#preview').scrollIntoView({behavior:'smooth', block:'start'}), 80);
}
function resetForm(){ $('#assessmentForm').reset(); renderQuestions(); $('#preview').classList.add('hidden'); window.scrollTo({top:0,behavior:'smooth'}); }

document.addEventListener('DOMContentLoaded', () => {
  renderQuestions(); renderStaticCards();
  $('#questionsContainer').addEventListener('change', updateProgress);
  $('#assessmentForm').addEventListener('submit', submitAssessment);
  $('#resetBtn').addEventListener('click', resetForm);
  $$('[data-scroll-target]').forEach(btn => btn.addEventListener('click', () => $(btn.dataset.scrollTarget)?.scrollIntoView({behavior:'smooth'})));
});
