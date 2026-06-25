const STORAGE_KEY = "edutex-ai-readiness-v3";

const dimensions = {
  workload: {
    label: "業務量・属人化",
    short: "業務量",
    intro: "反復作業の量、属人化、横展開余地を見ます。",
  },
  data: {
    label: "データ所在・品質",
    short: "データ",
    intro: "文書、FAQ、CRM、Excel、権限付きデータの扱いやすさを見ます。",
  },
  authority: {
    label: "権限・セキュリティ",
    short: "権限",
    intro: "承認者、利用ルール、監査ログ、法人管理状態を確認します。",
  },
  risk: {
    label: "リスク・ガバナンス",
    short: "リスク",
    intro: "レビュー、法務、個人情報、外販時のリスク整理を見ます。",
  },
  roi: {
    label: "ROI・効果測定",
    short: "ROI",
    intro: "削減時間、品質向上、売上貢献、予算化導線を見ます。",
  },
  difficulty: {
    label: "AI適用難易度",
    short: "難易度",
    intro: "RAG、業務自動化、PoC着手のしやすさを確認します。",
  },
};

const questions = [
  { id: "w1", dim: "workload", title: "対象業務の処理量はどの程度ありますか", hint: "月間件数、問い合わせ件数、帳票数、提案件数など。", options: ["小さい / 不定期", "一部部門で定常発生", "複数部門で毎週発生", "全社で毎日発生", "大量・高頻度で明確"] },
  { id: "w2", dim: "workload", title: "業務はどの程度、属人化していますか", hint: "担当者依存、暗黙知、ベテラン依存の強さ。", options: ["ほぼ標準化済み", "一部属人化", "部署ごとにばらつく", "主要業務が属人化", "退職・異動リスクが高い"] },
  { id: "w3", dim: "workload", title: "AIで置き換えたい反復作業がありますか", hint: "調査、要約、分類、転記、チェック、一次回答など。", options: ["ほぼない", "一部ある", "候補は複数ある", "優先候補が明確", "削減時間も概算済み"] },
  { id: "w4", dim: "workload", title: "部門横断で同じ課題が発生していますか", hint: "営業、管理、現場、開発、人事などへの横展開可能性。", options: ["単一業務のみ", "一部類似あり", "複数部門で類似", "横展開ニーズあり", "グループ会社展開も可能"] },

  { id: "d1", dim: "data", title: "必要なデータの所在は把握できていますか", hint: "SharePoint、Google Drive、Box、SFA、CRM、FAQ、基幹システムなど。", options: ["不明", "個人PC中心", "部署単位で把握", "主要データは特定済み", "接続候補まで整理済み"] },
  { id: "d2", dim: "data", title: "データ品質はAI利用に耐えますか", hint: "重複、古い文書、命名規則、版管理、正解データの有無。", options: ["かなり不安", "整備途上", "最低限使える", "主要データは整備済み", "評価データもある"] },
  { id: "d3", dim: "data", title: "文書・FAQ・ナレッジは検索可能な状態ですか", hint: "RAGや社内Botに利用できる状態か。", options: ["散在している", "一部検索可", "部門内は検索可", "全社横断検索可", "API / 権限連携も可能"] },
  { id: "d4", dim: "data", title: "社外秘・個人情報の区分は明確ですか", hint: "AI投入可否の判定に必要。", options: ["未整理", "一部のみ整理", "部門ごとに整理", "全社ルールあり", "監査可能な区分あり"] },

  { id: "a1", dim: "authority", title: "AI利用時の権限設計はありますか", hint: "誰が何を見られるか、AIが参照してよい範囲。", options: ["未着手", "個別判断", "部門ルールあり", "全社方針あり", "権限連携まで設計済み"] },
  { id: "a2", dim: "authority", title: "承認者・責任者は明確ですか", hint: "PoCオーナー、情シス、法務、人事、現場責任者。", options: ["不明", "担当候補のみ", "部門責任者あり", "横断責任者あり", "経営スポンサーあり"] },
  { id: "a3", dim: "authority", title: "ログ・監査・利用履歴を残せますか", hint: "大企業の本実装で必須になりやすい条件。", options: ["残せない", "一部のみ", "ツール単位で可能", "全社基盤で可能", "監査運用まで可能"] },
  { id: "a4", dim: "authority", title: "利用環境は法人管理されていますか", hint: "ChatGPT Enterprise、Copilot、Gemini、閉域環境など。", options: ["個人利用中心", "暫定利用", "法人契約あり", "部門展開済み", "全社展開・管理済み"] },

  { id: "r1", dim: "risk", title: "AI利用ガイドラインは整備されていますか", hint: "入力禁止、出力確認、著作権、個人情報、社外利用。", options: ["未整備", "草案あり", "部門ルールあり", "全社ガイドあり", "教育・監査まで実施"] },
  { id: "r2", dim: "risk", title: "法務・セキュリティレビューは通しやすいですか", hint: "PoC前の稟議障壁。", options: ["かなり難しい", "都度調整", "条件付きで可能", "標準フローあり", "迅速に審査可能"] },
  { id: "r3", dim: "risk", title: "AI出力の品質保証プロセスはありますか", hint: "人の確認、レビュー基準、二重チェック、評価ログ。", options: ["未定", "個人判断", "簡易レビューあり", "標準レビューあり", "評価基準が明確"] },
  { id: "r4", dim: "risk", title: "外販・顧客提案に使う場合のリスク整理はありますか", hint: "提案営業や外販化の場面で特に重要。", options: ["未検討", "社内利用のみ", "一部検討", "顧客向け条件あり", "外販テンプレートあり"] },

  { id: "o1", dim: "roi", title: "削減時間・削減コストを概算できますか", hint: "稟議や投資対効果の入口。", options: ["できない", "感覚値のみ", "一部概算可", "主要業務で概算可", "金額換算まで可能"] },
  { id: "o2", dim: "roi", title: "品質向上・売上貢献の指標がありますか", hint: "単なる時短以上の価値を測れるか。", options: ["ない", "仮説のみ", "一部指標あり", "部門KPIと接続", "経営KPIと接続"] },
  { id: "o3", dim: "roi", title: "PoC後の横展開シナリオはありますか", hint: "一部署で止まらない設計。", options: ["ない", "検討中", "類似部署あり", "横展開先あり", "グループ展開可能"] },
  { id: "o4", dim: "roi", title: "実装予算の出所は明確ですか", hint: "人事研修予算だけでなく、事業部・情シス・改善予算。", options: ["未定", "人事研修のみ", "部門予算候補あり", "DX / 情シス予算あり", "複数予算を組める"] },

  { id: "f1", dim: "difficulty", title: "AIで扱う業務は定型化できますか", hint: "判断ルール、入力、出力、例外処理。", options: ["難しい", "一部のみ", "標準化可能", "かなり定型化", "テンプレート化済み"] },
  { id: "f2", dim: "difficulty", title: "生成AI、RAG、自動化のどれが適するか見えていますか", hint: "実装方式の見極め。", options: ["不明", "生成AIだけ想定", "RAG候補あり", "自動化 / Agent候補あり", "方式別に整理済み"] },
  { id: "f3", dim: "difficulty", title: "既存システムとの連携難易度は把握していますか", hint: "API、SaaS、認証、ネットワーク、データ抽出。", options: ["不明", "手作業前提", "CSV連携程度", "API候補あり", "認証 / APIまで確認済み"] },
  { id: "f4", dim: "difficulty", title: "PoCを90日以内に始められますか", hint: "データ、責任者、対象業務、判断基準があるか。", options: ["難しい", "半年以上必要", "3か月で準備可", "すぐ着手可能", "PoC条件が揃っている"] },
];

const sceneCatalog = [
  {
    id: "rag-support",
    category: "Field operation",
    title: "問い合わせ対応をRAGで標準化",
    body: "FAQ、マニュアル、規程、営業資料を横断検索し、一次回答や要約を高速化する活用シーンです。",
    image: "./assets/scene-support-rag.jpg",
    points: ["FAQ / マニュアル", "一次回答短縮", "属人化解消"],
  },
  {
    id: "workshop",
    category: "Use case discovery",
    title: "部門横断でPoCテーマを絞る",
    body: "現場、情シス、管理部門が同じテーブルで、業務分解と優先順位付けを進める導入初期の姿を表現しています。",
    image: "./assets/scene-workshop-mapping.jpg",
    points: ["部門WS", "対象業務の棚卸し", "PoC優先順位"],
  },
  {
    id: "governance",
    category: "Governance and ROI",
    title: "診断からガバナンス、ROIまで接続",
    body: "データ、権限、ガバナンス、成果測定がどうつながるかを、役員にも説明しやすいイラストで可視化しています。",
    image: "./assets/scene-governance-journey.png",
    points: ["権限設計", "監査 / リスク", "ROI可視化"],
  },
];

const programs = [
  { id: "diagnostic", tag: "Entry", title: "AI実装度診断", price: "30〜50万円", term: "2週間", body: "業務、データ、権限、リスク、ROI、難易度を棚卸しし、PoC候補と優先順位を整理します。" },
  { id: "workshop", tag: "Department", title: "部門別 業務改善WS", price: "80〜120万円 / 回", term: "1日", body: "業務分解、プロンプト案、RAG / 自動化候補、実装優先度を部門ごとに具体化します。" },
  { id: "poc", tag: "Core offer", title: "90日AI実装PoC", price: "500〜900万円", term: "12週間", body: "対象業務をPoC化し、KPI、成果物、本実装見積、横展開ロードマップまでまとめます。" },
  { id: "mvp", tag: "Build", title: "業務AI MVP / RAG・Agent", price: "800〜1,500万円", term: "8〜12週間", body: "FAQ、文書抽出、提案書生成、AIエージェントなどをMVPとして実装し、利用ログも設計します。" },
  { id: "coe", tag: "Operate", title: "AI CoE / LLMOps運用", price: "月80〜200万円", term: "月次", body: "利用状況分析、権限管理、評価基準、追加ユースケース創出を伴走します。" },
  { id: "enablement", tag: "Enable", title: "AIリテラシー定着", price: "100万円〜", term: "短期集中", body: "利用ルール、Copilot / ChatGPT活用、部門別ユースケースを社内展開し、導入基盤を整えます。" },
];

const flowSteps = [
  { step: "01", title: "仮説整理", body: "公開情報や既存接点をもとに、刺さる業務テーマと想定部門を仮置きします。" },
  { step: "02", title: "AI実装度診断", body: "業務量、データ、権限、リスク、ROI、難易度を定量化して詰まり所を特定します。" },
  { step: "03", title: "部門WS / PoC設計", body: "対象業務を分解し、PoCテーマ、KPI、データ条件、必要体制を固めます。" },
  { step: "04", title: "PoC / MVP / 運用", body: "90日PoCからMVP、横展開、CoE運用までを成果物ベースで前進させます。" },
];

const playbooks = [
  {
    id: "poc",
    title: "90日PoCを前提に要件を固める",
    image: "./assets/hero-executive-briefing.jpg",
    description: "役員説明、PoCテーマ、効果測定、予算化導線を一つにまとめて進めるプランです。",
    note: "適する状況: ROIと業務量が見えており、部門責任者を巻き込める。",
    score: (scores, readiness) => (readiness >= 60 ? 14 : 0) + scores.roi * 0.33 + scores.workload * 0.25 + scores.authority * 0.14 + scores.data * 0.14 + scores.risk * 0.14,
  },
  {
    id: "rag",
    title: "社内ナレッジRAG / FAQから着手する",
    image: "./assets/scene-support-rag.jpg",
    description: "文書、FAQ、規程、営業資料の散在を解消し、現場の一次回答や検索時間を短縮するプランです。",
    note: "適する状況: データ所在がある程度把握でき、問い合わせ負荷が高い。",
    score: (scores) => scores.data * 0.34 + scores.workload * 0.24 + scores.authority * 0.18 + scores.risk * 0.1 + scores.roi * 0.14,
  },
  {
    id: "workshop",
    title: "部門WSでテーマを絞る",
    image: "./assets/scene-workshop-mapping.jpg",
    description: "まだテーマが広い段階なら、現場と情シスを交えたWSで業務分解し、PoC候補を絞るのが最短です。",
    note: "適する状況: 何から始めるべきか曖昧、または優先順位で止まっている。",
    score: (scores, readiness) => (readiness < 72 ? 16 : 0) + (100 - scores.difficulty) * 0.28 + (100 - scores.data) * 0.2 + (100 - scores.authority) * 0.18 + (100 - scores.roi) * 0.18 + (100 - scores.workload) * 0.16,
  },
  {
    id: "governance",
    title: "ガバナンスと権限設計を先に整える",
    image: "./assets/scene-governance-journey.png",
    description: "PoC前に入力ルール、権限、ログ、レビュー体制を詰めることで、大企業で止まりやすい導入障壁を下げます。",
    note: "適する状況: 法務、情シス、監査で止まりやすい、または顧客提案に使う。",
    score: (scores) => (100 - scores.risk) * 0.46 + (100 - scores.authority) * 0.34 + (100 - scores.data) * 0.1 + scores.roi * 0.1,
  },
];

const priorityMap = {
  workload: {
    title: "対象業務の件数と反復負荷を数値化",
    body: "問い合わせ件数、提案件数、帳票処理量などを洗い出し、PoCで何時間削減できるかの母数を作ります。",
  },
  data: {
    title: "文書、FAQ、CRM、Excelの所在を整理",
    body: "AIに読ませたいデータの保管場所、品質、最新性、アクセス権限を一枚にまとめるとPoCが進みやすくなります。",
  },
  authority: {
    title: "承認者と利用可能データ範囲を確定",
    body: "PoCオーナー、情シス、法務、現場責任者を明確にし、AIが参照できる範囲を事前に合意しておきます。",
  },
  risk: {
    title: "AI利用ルールとレビュー基準を先回りで整備",
    body: "入力禁止情報、出力レビュー、ログ保存、外販時の注意点を整理して、稟議で止まるリスクを減らします。",
  },
  roi: {
    title: "削減時間と売上貢献の仮説を言語化",
    body: "時短だけでなく、提案品質、受注率、ナレッジ再利用率などもKPI候補に含めると投資判断が通りやすくなります。",
  },
  difficulty: {
    title: "PoCテーマを1〜2件に絞る",
    body: "RAG、文書処理、FAQ、自動化の中から、90日で成果検証しやすいテーマを選び、やらない範囲も決めます。",
  },
};

const form = document.querySelector("#assessmentForm");
const questionsContainer = document.querySelector("#questionsContainer");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const progressHint = document.querySelector("#progressHint");
const profileSummary = document.querySelector("#profileSummary");
const resultSection = document.querySelector("#preview");
const resultRoot = document.querySelector("#resultRoot");
const profileFields = ["companyName", "industry", "employeeSize", "targetDept", "goalFocus"];

function renderScenes() {
  const grid = document.querySelector("#sceneGrid");
  grid.innerHTML = sceneCatalog.map((scene) => `
    <article class="scene-card">
      <div class="scene-media">
        <img src="${scene.image}" alt="${scene.title}" />
      </div>
      <div class="scene-body">
        <p class="scene-meta">${scene.category}</p>
        <h3>${scene.title}</h3>
        <p>${scene.body}</p>
        <div class="scene-points">${scene.points.map((point) => `<span>${point}</span>`).join("")}</div>
      </div>
    </article>
  `).join("");
}

function renderPrograms() {
  const grid = document.querySelector("#programCatalog");
  grid.innerHTML = programs.map((program) => `
    <article class="program-card">
      <span class="program-chip">${program.tag}</span>
      <h3>${program.title}</h3>
      <span class="program-price">${program.price}</span>
      <p class="program-term">${program.term}</p>
      <p>${program.body}</p>
    </article>
  `).join("");
}

function renderFlow() {
  const grid = document.querySelector("#flowGrid");
  grid.innerHTML = flowSteps.map((item) => `
    <article class="flow-card">
      <div class="flow-step">${item.step}</div>
      <h3>${item.title}</h3>
      <p>${item.body}</p>
    </article>
  `).join("");
}

function groupQuestions() {
  return Object.entries(dimensions).map(([key, meta], index) => ({
    key,
    index: index + 1,
    ...meta,
    items: questions.filter((question) => question.dim === key),
  }));
}

function renderQuestions() {
  questionsContainer.innerHTML = groupQuestions().map((group) => `
    <section class="question-group" data-group="${group.key}">
      <div class="question-group-head">
        <div>
          <p class="eyebrow">${String(group.index).padStart(2, "0")} / ${group.short}</p>
          <h3>${group.label}</h3>
          <p>${group.intro}</p>
        </div>
        <div class="question-group-count">${group.items.length} questions</div>
      </div>
      <div class="question-list">
        ${group.items.map((question, qIndex) => `
          <article class="question-card" data-question="${question.id}">
            <div class="question-top">
              <div>
                <div class="question-number">${group.short} ${qIndex + 1}</div>
                <h4>${question.title}</h4>
              </div>
              <span class="question-state">未回答</span>
            </div>
            <p>${question.hint}</p>
            <div class="options" role="radiogroup" aria-label="${question.title}">
              ${question.options.map((label, optionIndex) => `
                <label class="option">
                  <input type="radio" name="${question.id}" value="${(optionIndex + 1) * 20}" data-dim="${question.dim}" />
                  <span class="option-box">
                    <span class="option-score">${optionIndex + 1}</span>
                    <span class="option-text">${label}</span>
                  </span>
                </label>
              `).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const state = JSON.parse(raw);
    profileFields.forEach((field) => {
      const node = document.querySelector(`#${field}`);
      if (node && state.profile?.[field]) {
        node.value = state.profile[field];
      }
    });

    Object.entries(state.answers || {}).forEach(([id, value]) => {
      const input = document.querySelector(`input[name="${id}"][value="${value}"]`);
      if (input) input.checked = true;
    });
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function serializeState() {
  const profile = Object.fromEntries(profileFields.map((field) => [field, document.querySelector(`#${field}`)?.value || ""]));
  const answers = Object.fromEntries(questions.map((question) => {
    const checked = document.querySelector(`input[name="${question.id}"]:checked`);
    return [question.id, checked ? checked.value : ""];
  }));
  return { profile, answers };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState()));
}

function updateProfileSummary() {
  const values = [
    document.querySelector("#industry").value,
    document.querySelector("#employeeSize").value,
    document.querySelector("#targetDept").value,
    document.querySelector("#goalFocus").value,
  ].filter((value) => value && value !== "未選択");

  profileSummary.innerHTML = values.length
    ? values.map((value) => `<span>${value}</span>`).join("")
    : '<span>プロフィールを入力するとここに要約が表示されます</span>';
}

function updateQuestionStates() {
  questions.forEach((question) => {
    const card = document.querySelector(`[data-question="${question.id}"]`);
    const checked = document.querySelector(`input[name="${question.id}"]:checked`);
    if (!card) return;
    card.classList.toggle("answered", Boolean(checked));
    const state = card.querySelector(".question-state");
    if (state) state.textContent = checked ? "回答済み" : "未回答";
  });
}

function updateProgress() {
  const answered = questions.filter((question) => document.querySelector(`input[name="${question.id}"]:checked`)).length;
  const pct = Math.round((answered / questions.length) * 100);

  progressText.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;

  const nextQuestion = questions.find((question) => !document.querySelector(`input[name="${question.id}"]:checked`));
  if (nextQuestion) {
    progressHint.textContent = `次は「${dimensions[nextQuestion.dim].label}」の設問です。残り ${questions.length - answered} 問です。`;
  } else {
    progressHint.textContent = "すべて回答済みです。診断結果を表示できます。";
  }

  updateProfileSummary();
  updateQuestionStates();
}

function calculate() {
  const scores = Object.fromEntries(Object.keys(dimensions).map((key) => [key, []]));

  for (const question of questions) {
    const checked = document.querySelector(`input[name="${question.id}"]:checked`);
    if (!checked) return null;
    scores[question.dim].push(Number(checked.value));
  }

  const dimensionScores = Object.fromEntries(
    Object.entries(scores).map(([key, values]) => [key, Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)]),
  );

  const weights = { workload: 1.05, data: 1.15, authority: 1.0, risk: 1.1, roi: 1.15, difficulty: 0.95 };
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const readiness = Math.round(
    Object.entries(dimensionScores).reduce((sum, [key, value]) => sum + value * weights[key], 0) / totalWeight,
  );

  const ordered = Object.entries(dimensionScores).sort((a, b) => a[1] - b[1]);
  const strengths = [...ordered].reverse().slice(0, 2).map(([key]) => key);
  const blockers = ordered.slice(0, 2).map(([key]) => key);
  const executionRisk = Math.round((100 - dimensionScores.risk) * 0.4 + (100 - dimensionScores.authority) * 0.35 + (100 - dimensionScores.data) * 0.25);
  const roiPotential = Math.round(dimensionScores.workload * 0.35 + dimensionScores.roi * 0.45 + dimensionScores.data * 0.2);

  return { dimensionScores, readiness, strengths, blockers, executionRisk, roiPotential };
}

function readinessMeta(score) {
  if (score >= 82) {
    return {
      label: "本実装直前",
      message: "90日PoCからMVP、横展開まで進めやすい状態です。稟議用のKPIと最終ガバナンス整理を固めれば、本実装フェーズへ進めます。",
    };
  }
  if (score >= 68) {
    return {
      label: "PoC設計可能",
      message: "対象業務と投資テーマは見えています。PoCテーマの絞り込みと、データ・権限・ROI条件の具体化が次の一手です。",
    };
  }
  if (score >= 52) {
    return {
      label: "準備・棚卸し段階",
      message: "AI活用意欲は高い一方で、データ所在、責任者、効果測定の整理が不足しています。まず有償診断と部門WSが有効です。",
    };
  }
  return {
    label: "基盤整備優先",
    message: "ルール、対象業務、データ所在、推進責任者の整備が先です。研修単体ではなく、導入条件の棚卸しから始めると進みやすくなります。",
  };
}

function roiNarrative(result) {
  const { workload, roi } = result.dimensionScores;
  if (workload >= 75 && roi >= 70) {
    return "削減余地が大きく、月100〜300時間規模の時短仮説や提案品質向上のKPIを置きやすい状態です。90日PoCの本命提案が通しやすいレンジです。";
  }
  if (workload >= 55 && roi >= 55) {
    return "部門単位で月30〜100時間規模の削減仮説から検証できる状態です。まずは有償診断とPoC設計パックで投資対効果の仮説を固めるのが現実的です。";
  }
  return "対象業務の件数、処理時間、品質指標を棚卸しし、ROIの母数を作る段階です。先に効果測定設計を行うと次の提案が通りやすくなります。";
}

function recommendPrograms(result) {
  const { readiness, dimensionScores } = result;
  const picks = [];

  if (readiness >= 78) {
    picks.push("poc", "mvp", "coe");
  } else if (readiness >= 62) {
    picks.push("diagnostic", "workshop", "poc");
  } else {
    picks.push("diagnostic", "enablement", "workshop");
  }

  if (dimensionScores.risk < 60 || dimensionScores.authority < 60) {
    picks.unshift("diagnostic");
  }

  return [...new Set(picks)].slice(0, 3).map((id) => programs.find((program) => program.id === id));
}

function buildPriorities(result) {
  return result.blockers.map((key) => ({
    axis: dimensions[key].label,
    ...priorityMap[key],
  }));
}

function roadmapFor(result) {
  const blockerText = result.blockers.map((key) => dimensions[key].short).join("・");

  if (result.readiness >= 70) {
    return [
      { week: "Week 1-2", title: "要件確定", body: `対象業務、データ、権限、KPIを確定し、特に ${blockerText} の論点を詰めます。` },
      { week: "Week 3-4", title: "部門実践 / 設計", body: "対象部門向けの実践支援とプロンプト整備を進め、PoC成果物の形を定義します。" },
      { week: "Week 5-8", title: "PoC試作", body: "RAG、文書処理、提案書生成などの本命テーマを試作し、利用ログと効果測定を取得します。" },
      { week: "Week 9-12", title: "稟議化 / 横展開", body: "本実装見積、横展開条件、運用体制、CoE設計をまとめて次の投資判断へつなげます。" },
    ];
  }

  return [
    { week: "Week 1-2", title: "実装度診断", body: `対象業務、データ所在、${blockerText} を中心に導入条件を棚卸しします。` },
    { week: "Week 3-4", title: "部門WS", body: "業務分解とテーマ選定を行い、PoC候補と優先順位を絞ります。" },
    { week: "Week 5-8", title: "PoC設計準備", body: "データ条件、権限、レビュー体制、KPI仮説を固め、90日で試せるスコープに落とします。" },
    { week: "Week 9-12", title: "次回提案", body: "有償診断からPoC設計パックまたは90日PoC提案へ接続し、見積と体制案を提示します。" },
  ];
}

function pickPlaybooks(result) {
  return playbooks
    .map((playbook) => ({
      ...playbook,
      relevance: Math.round(playbook.score(result.dimensionScores, result.readiness)),
    }))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
}

function executiveSummary(result, meta, recommendedProgramsList) {
  const companyName = document.querySelector("#companyName").value.trim() || "未入力企業";
  const dept = document.querySelector("#targetDept").value;
  const goal = document.querySelector("#goalFocus").value;
  const focusAxis = dimensions[result.blockers[0]].label;
  const strongestAxis = dimensions[result.strengths[0]].label;

  return [
    `会社 / 部署: ${companyName}${dept && dept !== "未選択" ? ` / ${dept}` : ""}`,
    `判定: ${meta.label} (${result.readiness} / 100)`,
    `強み: ${strongestAxis}`,
    `先に詰める論点: ${focusAxis}`,
    `推奨メニュー: ${recommendedProgramsList.map((program) => program.title).join("、")}`,
    goal && goal !== "未選択" ? `今回の狙い: ${goal}` : null,
  ].filter(Boolean).join("\n");
}

function summaryText(result, meta, recommendedProgramsList) {
  return [
    "【Edutex AI実装度診断サマリー】",
    executiveSummary(result, meta, recommendedProgramsList),
    `ROIポテンシャル: ${result.roiPotential} / 100`,
    `実装リスク: ${result.executionRisk} / 100`,
    `コメント: ${meta.message}`,
  ].join("\n");
}

function downloadJson(result, meta, recommendedProgramsList) {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: Object.fromEntries(profileFields.map((field) => [field, document.querySelector(`#${field}`).value])),
    result,
    meta,
    recommendedPrograms: recommendedProgramsList,
    summary: summaryText(result, meta, recommendedProgramsList),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "edutex-ai-readiness-result.json";
  link.click();
  URL.revokeObjectURL(url);
}

function flashButton(button, text) {
  const original = button.dataset.original || button.textContent;
  button.dataset.original = original;
  button.textContent = text;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1500);
}

function renderResults(result) {
  const meta = readinessMeta(result.readiness);
  const priorities = buildPriorities(result);
  const roadmap = roadmapFor(result);
  const recommendedProgramsList = recommendPrograms(result);
  const recommendedPlaybooks = pickPlaybooks(result);
  const summary = summaryText(result, meta, recommendedProgramsList);

  resultRoot.innerHTML = `
    <div class="result-shell">
      <section class="result-hero result-panel">
        <div class="score-ring" style="--ring: ${result.readiness * 3.6}deg;">
          <span>${result.readiness}</span>
        </div>
        <div class="result-hero-copy">
          <p class="eyebrow">AI implementation score</p>
          <h3>${meta.label}</h3>
          <p>${meta.message}</p>
          <div class="result-tags">
            ${result.strengths.map((key) => `<span>強み: ${dimensions[key].label}</span>`).join("")}
            ${result.blockers.map((key) => `<span>論点: ${dimensions[key].label}</span>`).join("")}
          </div>
          <div class="result-meta">
            <article><span>ROIポテンシャル</span><strong>${result.roiPotential}</strong></article>
            <article><span>実装リスク</span><strong>${result.executionRisk}</strong></article>
            <article><span>次の一手</span><strong>${recommendedProgramsList[0].title}</strong></article>
          </div>
        </div>
      </section>

      <div class="result-grid">
        <section class="result-panel">
          <h3 class="panel-title">6軸スコア</h3>
          <div class="dimension-bars">
            ${Object.entries(result.dimensionScores).map(([key, value]) => `
              <div class="bar-row">
                <strong>${dimensions[key].short}</strong>
                <div class="bar-track"><span style="width: ${value}%"></span></div>
                <b>${value}</b>
              </div>
            `).join("")}
          </div>
        </section>

        <section class="result-panel">
          <h3 class="panel-title">優先アクション</h3>
          <div class="priority-list">
            ${priorities.map((item, index) => `
              <article class="priority-item">
                <strong>${index + 1}. ${item.title}</strong>
                <p>${item.body}</p>
              </article>
            `).join("")}
          </div>
        </section>
      </div>

      <section class="result-panel">
        <h3 class="panel-title">おすすめの進め方</h3>
        <div class="playbook-grid">
          ${recommendedPlaybooks.map((playbook) => `
            <article class="playbook-card">
              <img src="${playbook.image}" alt="${playbook.title}" />
              <div class="playbook-body">
                <span class="playbook-relevance">relevance ${playbook.relevance}</span>
                <h4>${playbook.title}</h4>
                <p>${playbook.description}</p>
                <div class="playbook-note">${playbook.note}</div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <div class="result-grid">
        <section class="result-panel">
          <h3 class="panel-title">役員向けメモ</h3>
          <ul class="summary-list">
            ${executiveSummary(result, meta, recommendedProgramsList).split("\n").map((line) => `<li><strong>${line.split(":")[0]}:</strong><p>${line.split(":").slice(1).join(":").trim()}</p></li>`).join("")}
          </ul>
        </section>

        <section class="result-panel">
          <h3 class="panel-title">ROI仮説</h3>
          <article class="priority-item">
            <strong>投資対効果の見立て</strong>
            <p>${roiNarrative(result)}</p>
          </article>
          <article class="priority-item">
            <strong>推奨メニュー</strong>
            <p>${recommendedProgramsList.map((program) => `${program.title} (${program.price})`).join(" / ")}</p>
          </article>
        </section>
      </div>

      <section class="result-panel">
        <h3 class="panel-title">90日ロードマップ</h3>
        <div class="roadmap-grid">
          ${roadmap.map((step) => `
            <article class="roadmap-card">
              <strong>${step.week} | ${step.title}</strong>
              <p>${step.body}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <section class="result-panel">
        <h3 class="panel-title">提案メニュー候補</h3>
        <div class="recommend-grid">
          ${recommendedProgramsList.map((program) => `
            <article class="recommend-card">
              <strong>${program.title}</strong>
              <p>${program.price} / ${program.term}</p>
              <p>${program.body}</p>
            </article>
          `).join("")}
        </div>
      </section>

      <div class="result-actions">
        <button id="copyResultBtn" type="button" class="primary-btn">診断サマリーをコピー</button>
        <button id="downloadJsonBtn" type="button" class="ghost-btn">JSONをダウンロード</button>
        <button id="printResultBtn" type="button" class="ghost-btn">結果を印刷</button>
      </div>
    </div>
  `;

  const copyButton = document.querySelector("#copyResultBtn");
  const downloadButton = document.querySelector("#downloadJsonBtn");
  const printButton = document.querySelector("#printResultBtn");

  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(summary);
    flashButton(copyButton, "コピーしました");
  });

  downloadButton.addEventListener("click", () => downloadJson(result, meta, recommendedProgramsList));
  printButton.addEventListener("click", () => window.print());

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function focusFirstIncomplete() {
  const incomplete = questions.find((question) => !document.querySelector(`input[name="${question.id}"]:checked`));
  if (!incomplete) return;
  document.querySelector(`[data-question="${incomplete.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function handleFormChange(event) {
  if (!(event.target instanceof HTMLInputElement)) return;
  saveState();
  updateProgress();
}

function handleProfileChange() {
  saveState();
  updateProgress();
}

function resetAssessment() {
  form.reset();
  localStorage.removeItem(STORAGE_KEY);
  profileFields.forEach((field) => {
    const node = document.querySelector(`#${field}`);
    if (!node) return;
    if (node.tagName === "SELECT") node.selectedIndex = 0;
    else node.value = "";
  });
  updateProgress();
  resultSection.classList.add("hidden");
  resultRoot.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function boot() {
  renderScenes();
  renderPrograms();
  renderFlow();
  renderQuestions();
  restoreState();
  updateProgress();

  form.addEventListener("change", handleFormChange);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const result = calculate();
    if (!result) {
      alert("未回答の設問があります。すべて回答してください。");
      focusFirstIncomplete();
      return;
    }
    saveState();
    renderResults(result);
  });

  document.querySelector("#resetBtn").addEventListener("click", resetAssessment);
  profileFields.forEach((field) => {
    document.querySelector(`#${field}`)?.addEventListener("input", handleProfileChange);
    document.querySelector(`#${field}`)?.addEventListener("change", handleProfileChange);
  });

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

document.addEventListener("DOMContentLoaded", boot);
