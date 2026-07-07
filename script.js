const GOOGLE_FORMS_CONFIG = {
  // Googleフォームと連携する場合は enabled を true にし、フォームの action URL と entry ID を設定してください。
  // action URL例: https://docs.google.com/forms/d/e/XXXXXXXXXXXX/formResponse
  enabled: false,
  formActionUrl: "",
  fields: {
    companyName: "entry.0000000000",
    industry: "entry.0000000001",
    employeeSize: "entry.0000000002",
    contactName: "entry.0000000003",
    contactEmail: "entry.0000000004",
    contactPhone: "entry.0000000005",
    contactRole: "entry.0000000006",
    requestType: "entry.0000000007",
    desiredCourse: "entry.0000000008",
    applicationNote: "entry.0000000009",
    pressureScore: "entry.0000000010",
    resultLevel: "entry.0000000011",
    riskDimension: "entry.0000000012",
    recommendedCourses: "entry.0000000013",
    diagnosisSummary: "entry.0000000014",
    resultJson: "entry.0000000015",
    consent: "entry.0000000016"
  }
};

const STORAGE_KEYS = {
  answers: "aiCheckAnswers",
  profile: "aiCheckProfile"
};

const questions = [
  {
    id: "q1",
    tag: "現在地",
    text: "貴社では生成AI・AIツールが業務でどの程度使われていますか？",
    help: "個人利用で止まっているか、部署・全社の業務プロセスに組み込めているかを確認します。",
    lowGood: false,
    options: ["未着手", "一部が個人利用", "部署で試行", "業務標準化中", "収益・KPIに連動"],
    weights: { maturity: 1.8, implementation: -1.2, urgency: -0.6 }
  },
  {
    id: "q2",
    tag: "緊急性",
    text: "競合他社や顧客のAI活用が進み、遅れへの焦りを感じていますか？",
    help: "市場変化に対する課題感を確認します。",
    options: ["感じない", "やや感じる", "一部で強い", "かなり強い", "経営課題レベル"],
    weights: { urgency: 1.8, revenue: 0.8, anxiety: 0.7 }
  },
  {
    id: "q3",
    tag: "業務改善",
    text: "資料作成・調査・議事録・メール・報告書など、時間を奪う定型業務は多いですか？",
    help: "短期効果を出しやすい業務効率化テーマを測ります。",
    options: ["少ない", "一部ある", "部署に多い", "全社的に多い", "残業・採算を圧迫"],
    weights: { efficiency: 1.7, urgency: 0.8, implementation: 0.3 }
  },
  {
    id: "q4",
    tag: "収益化",
    text: "AIを使った新サービス、営業提案、マーケティング改善、顧客単価向上に関心はありますか？",
    help: "単なる効率化で終わらず、売上・差別化に接続できるかを見ます。",
    options: ["低い", "情報収集中", "テーマはある", "早期検証したい", "事業化を急ぎたい"],
    weights: { revenue: 1.9, urgency: 0.7, implementation: 0.7 }
  },
  {
    id: "q5",
    tag: "実装",
    text: "AIチャット、RAG、社内ナレッジ検索、AIエージェントなどを実装したいが進め方が曖昧ですか？",
    help: "PoC要件定義・データ準備・ベンダー選定・内製化判断の必要度を見ます。",
    options: ["不要", "興味はある", "検討中", "PoCしたい", "すぐ実装したい"],
    weights: { implementation: 2.0, urgency: 0.8, anxiety: 0.6 }
  },
  {
    id: "q6",
    tag: "不安",
    text: "情報漏洩、著作権、誤回答、社内ルール未整備に不安がありますか？",
    help: "AIを止める不安ではなく、安全に使うルール設計へつなげます。",
    options: ["不安なし", "少し不安", "判断に迷う", "かなり不安", "利用制限中"],
    weights: { governance: 1.9, anxiety: 1.6, urgency: 0.5 }
  },
  {
    id: "q7",
    tag: "人材",
    text: "社員のAIスキル差や、使う人だけが使う属人化が起きていますか？",
    help: "全社定着には、ツール導入よりも教育・運用・推進者育成が必要です。",
    options: ["差は小さい", "少しある", "部署差がある", "推進者不足", "完全に属人化"],
    weights: { maturity: -0.8, governance: 1.0, efficiency: 0.7, anxiety: 0.6 }
  },
  {
    id: "q8",
    tag: "データ",
    text: "社内データ・マニュアル・FAQ・営業資料が散在し、AI活用の土台が弱いと感じますか？",
    help: "AIの精度と業務定着は、データ整理・権限管理・ナレッジ設計に左右されます。",
    options: ["整理済み", "一部課題", "部門ごとに散在", "検索困難", "AI活用不能レベル"],
    weights: { implementation: 1.3, governance: 1.1, urgency: 0.7, anxiety: 0.7 }
  },
  {
    id: "q9",
    tag: "ROI",
    text: "AI導入の成果を、時間削減・コスト削減・売上増・顧客満足などのKPIで説明できますか？",
    help: "経営承認に必要な投資対効果の設計力を測ります。",
    reverse: true,
    options: ["説明できる", "一部できる", "曖昧", "ほぼ説明不可", "KPIがない"],
    weights: { revenue: 1.1, urgency: 1.1, implementation: 0.7 }
  },
  {
    id: "q10",
    tag: "自動化",
    text: "問い合わせ対応、営業初動、採用、教育、経理などをAIで半自動化したいですか？",
    help: "AIエージェント・ワークフロー自動化の適合度を見ます。",
    options: ["低い", "一部興味", "候補業務あり", "早期に試したい", "全社で必要"],
    weights: { efficiency: 1.0, implementation: 1.5, urgency: 0.6 }
  },
  {
    id: "q11",
    tag: "経営",
    text: "経営層・管理職がAI活用方針を明確に示せていますか？",
    help: "トップの関与が弱い場合、現場利用が点で終わりやすくなります。",
    reverse: true,
    options: ["明確", "概ね明確", "部署任せ", "曖昧", "方針なし"],
    weights: { maturity: -0.7, urgency: 1.0, governance: 0.8, revenue: 0.4 }
  },
  {
    id: "q12",
    tag: "現場定着",
    text: "研修を受けても、現場で使われずに終わる懸念がありますか？",
    help: "実施後の伴走・業務テンプレート・社内展開設計の必要度を測ります。",
    options: ["低い", "少しある", "部署による", "かなりある", "過去に失敗"],
    weights: { anxiety: 1.2, maturity: -0.6, efficiency: 0.6, governance: 0.5 }
  },
  {
    id: "q13",
    tag: "即効性",
    text: "3か月以内にAI活用の成果、デモ、社内展開案を出す必要がありますか？",
    help: "短期で必要な実践プログラムやPoC設計の必要度を確認します。",
    options: ["必要なし", "半年以内", "3〜6か月", "3か月以内", "今すぐ必要"],
    weights: { urgency: 2.0, implementation: 1.0, revenue: 0.5 }
  },
  {
    id: "q14",
    tag: "営業・提案",
    text: "AIを使って提案書、顧客分析、営業トーク、見積比較などを高度化したいですか？",
    help: "営業・マーケティング・顧客接点でのAI活用テーマを確認します。",
    options: ["低い", "興味あり", "一部使いたい", "重点化したい", "売上直結で必須"],
    weights: { revenue: 1.4, efficiency: 0.8, urgency: 0.6 }
  },
  {
    id: "q15",
    tag: "学習意欲",
    text: "AIを学ぶなら、座学よりも自社課題を使った実践型が必要ですか？",
    help: "オンデマンドで足りるか、対面・伴走ワークショップが必要かを判断します。",
    options: ["座学で十分", "一部演習希望", "実践型がよい", "自社課題必須", "伴走まで必要"],
    weights: { implementation: 0.9, urgency: 0.6, anxiety: 0.5 }
  }
];

const courses = [
  {
    id: "ai-basics",
    no: "01",
    title: "生成AI活用",
    summary: "AI基礎、プロンプト、調査・要約、文書作成、情報漏洩防止、部門別ユースケースを扱う全社員向けの入口プログラム。",
    format: "動画＋オンラインQA / Live",
    duration: "3h動画＋1.5hQA",
    target: "全社員・ビジネス職",
    price: "動画 8,000円/ID・Live 22万円/20名・対面 +10万円/半日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-ai-basics.jpg",
    weights: { maturityGap: 1.4, anxiety: 0.9, efficiency: 0.6, governance: 0.5 }
  },
  {
    id: "m365-copilot",
    no: "02",
    title: "Microsoft 365 Copilot / Copilot Studio活用",
    summary: "Word、Excel、PowerPoint、Outlook、TeamsでのCopilot活用、Copilot Studio概要、社内FAQ自動化までを実務化。",
    format: "オンラインLive",
    duration: "6h",
    target: "M365導入企業・管理部門",
    price: "動画 12,000円/ID・Live 38万円/20名・対面 +15万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-m365-copilot.jpg",
    weights: { efficiency: 1.1, governance: 0.9, maturityGap: 0.8, implementation: 0.4 }
  },
  {
    id: "google-gemini",
    no: "03",
    title: "Google Gemini活用",
    summary: "Gmail、Docs、Slides、DriveでのGemini活用、検索・要約・下書き・提案資料作成をGoogle Workspace環境で実践。",
    format: "動画＋オンライン",
    duration: "4h",
    target: "Google Workspace利用企業",
    price: "動画 10,000円/ID・Live 25万円/20名・対面 +10万円/半日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-gemini.jpg",
    weights: { efficiency: 1.0, maturityGap: 0.9, governance: 0.7, implementation: 0.3 }
  },
  {
    id: "excel-productivity",
    no: "04",
    title: "Excel業務改善",
    summary: "Excel関数・集計・可視化・レポート作成をAIで短縮し、手作業の置換、定型レポート化、業務テンプレート化を進めます。",
    format: "オンラインLive",
    duration: "5h",
    target: "管理・営業・バックオフィス",
    price: "動画 12,000円/ID・Live 30万円/20名・対面 +12万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-excel.jpg",
    weights: { efficiency: 1.8, urgency: 0.7, maturityGap: 0.5 }
  },
  {
    id: "data-ai-pm",
    no: "05",
    title: "データAIプロジェクトマネジメント",
    summary: "AIテーマ選定、PoC設計、KPI/ROI、リスク、要件整理、評価設計を行い、AI導入ロードマップに落とし込みます。",
    format: "オンラインWS",
    duration: "1日",
    target: "管理職・企画・推進担当",
    price: "動画 15,000円/ID・Live 45万円/15名・対面 +15万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-ai-project.jpg",
    weights: { implementation: 1.7, revenue: 0.9, governance: 0.9, urgency: 0.5 }
  },
  {
    id: "dify",
    no: "06",
    title: "Dify活用",
    summary: "Dify基本操作、RAG、チャットボット、ワークフロー、ナレッジ管理を使い、社内FAQや業務Bot試作まで行います。",
    format: "Live必須",
    duration: "1日",
    target: "DX・情報システム・開発",
    price: "動画 18,000円/ID・Live 58万円/15名・対面 +18万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-dify.jpg",
    weights: { implementation: 1.8, efficiency: 1.0, governance: 0.7, urgency: 0.4 }
  },
  {
    id: "cursor",
    no: "07",
    title: "Cursor入門",
    summary: "Cursor基本、コード理解、修正依頼、テスト、リファクタリング、プロンプト設計を通じてAIコーディングの入口を整えます。",
    format: "オンラインLive",
    duration: "4h",
    target: "開発者・IT部門",
    price: "動画 15,000円/ID・Live 28万円/15名・対面 +10万円/半日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-cursor.jpg",
    weights: { implementation: 1.5, efficiency: 0.8, maturityGap: 0.5 }
  },
  {
    id: "github-copilot",
    no: "08",
    title: "GitHub Copilot入門",
    summary: "Copilot Chat、コード生成、テスト生成、レビュー、リファクタリング、組織ポリシーまでチーム利用の基礎を整備。",
    format: "オンラインLive",
    duration: "1日",
    target: "開発者・IT部門",
    price: "動画 15,000円/ID・Live 42万円/15名・対面 +15万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-github-copilot.jpg",
    weights: { implementation: 1.5, governance: 0.8, efficiency: 0.7 }
  },
  {
    id: "claude-code",
    no: "09",
    title: "Claude Code入門",
    summary: "Claude Code導入、プロジェクト読込、タスク分割、修正・テスト・デバッグ、長時間実行時の注意点を実践。",
    format: "Live / 対面推奨",
    duration: "1日",
    target: "開発者・テックリード",
    price: "動画 20,000円/ID・Live 60万円/10名・対面 +20万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-claude-code.jpg",
    weights: { implementation: 1.8, urgency: 0.7, efficiency: 0.7 }
  },
  {
    id: "sdd",
    no: "10",
    title: "仕様駆動開発（SDD）",
    summary: "仕様ドキュメント、実装方針、タスク分割、Coding Agent実行、レビュー基準、受入条件を整備します。",
    format: "WS必須",
    duration: "1日",
    target: "開発者・PM・テックリード",
    price: "動画 20,000円/ID・Live 65万円/12名・対面 +20万円/日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-sdd.jpg",
    weights: { implementation: 1.7, governance: 1.0, anxiety: 0.6 }
  },
  {
    id: "ai-agent",
    no: "11",
    title: "AIエージェント構築",
    summary: "RAG、LangChain/LangGraph、ツール連携、ワークフロー、評価、ログ、運用設計まで行う上位プログラム。",
    format: "Live / 対面必須",
    duration: "2日",
    target: "AI担当・高度技術者",
    price: "動画 25,000円/ID・Live 98万円/10名・対面 +30万円/2日",
    image: "./ai-diagnostic-app-final-photo-refresh/assets/scene-ai-agent.jpg",
    weights: { implementation: 2.0, revenue: 1.0, governance: 0.9, urgency: 0.6 }
  }
];

const state = {
  answers: {},
  currentIndex: 0,
  lastResult: null
};

let autoAdvanceTimer = null;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function isGoogleFormsConfigured() {
  return Boolean(GOOGLE_FORMS_CONFIG.enabled && GOOGLE_FORMS_CONFIG.formActionUrl && GOOGLE_FORMS_CONFIG.formActionUrl.includes("/formResponse"));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const questionsContainer = document.querySelector("#questionsContainer");
const assessmentForm = document.querySelector("#assessmentForm");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const progressHint = document.querySelector("#progressHint");
const resultSection = document.querySelector("#preview");
const resultRoot = document.querySelector("#resultRoot");
const courseCatalog = document.querySelector("#courseCatalog");
const wizardCounter = document.querySelector("#wizardCounter");
const wizardDots = document.querySelector("#wizardDots");
const prevBtn = document.querySelector("#prevBtn");
const nextBtn = document.querySelector("#nextBtn");
const submitDiagnosisBtn = document.querySelector("#submitDiagnosisBtn");

/* ---------- 途中保存（localStorage） ---------- */

function saveProgressToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.answers, JSON.stringify(state.answers));
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify({
      companyName: document.querySelector("#companyName")?.value || "",
      industry: document.querySelector("#industry")?.value || "未選択",
      employeeSize: document.querySelector("#employeeSize")?.value || "未選択"
    }));
  } catch (e) { /* プライベートブラウズ等で保存不可の場合は無視 */ }
}

function loadProgressFromStorage() {
  try {
    const answers = JSON.parse(localStorage.getItem(STORAGE_KEYS.answers) || "{}");
    const profile = JSON.parse(localStorage.getItem(STORAGE_KEYS.profile) || "{}");
    let restored = false;
    questions.forEach(q => {
      const value = Number(answers[q.id]);
      if (value >= 1 && value <= 5) {
        state.answers[q.id] = value;
        restored = true;
      }
    });
    if (profile.companyName) document.querySelector("#companyName").value = profile.companyName;
    if (profile.industry) document.querySelector("#industry").value = profile.industry;
    if (profile.employeeSize) document.querySelector("#employeeSize").value = profile.employeeSize;
    return restored;
  } catch (e) {
    return false;
  }
}

function clearStoredProgress() {
  try {
    localStorage.removeItem(STORAGE_KEYS.answers);
    localStorage.removeItem(STORAGE_KEYS.profile);
  } catch (e) { /* noop */ }
}

/* ---------- ウィザード（1問ずつ表示） ---------- */

function firstUnansweredIndex() {
  const index = questions.findIndex(q => !state.answers[q.id]);
  return index === -1 ? questions.length - 1 : index;
}

function answeredCount() {
  return questions.filter(q => state.answers[q.id]).length;
}

function isComplete() {
  return answeredCount() === questions.length;
}

function renderWizard() {
  const index = state.currentIndex;
  const q = questions[index];
  questionsContainer.innerHTML = `
    <section class="question-card wizard-card" data-question="${q.id}">
      <div class="question-meta">
        <span class="question-index">Q${String(index + 1).padStart(2, "0")}</span>
        <span class="question-tag">${q.tag}</span>
      </div>
      <h3>${q.text}</h3>
      <p>${q.help}</p>
      <div class="option-col" role="radiogroup" aria-label="${escapeHtml(q.text)}">
        ${q.options.map((label, optionIndex) => {
          const value = optionIndex + 1;
          const checked = state.answers[q.id] === value ? "checked" : "";
          return `
            <label class="option-item">
              <input type="radio" name="${q.id}" value="${value}" ${checked} />
              <span class="option-number">${value}</span>
              <span class="option-text">${label}</span>
              <span class="option-check" aria-hidden="true">✓</span>
            </label>
          `;
        }).join("")}
      </div>
    </section>
  `;
  wizardCounter.textContent = `設問 ${index + 1} / ${questions.length}`;
  renderDots();
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === questions.length - 1;
  updateProgress();
}

function renderDots() {
  wizardDots.innerHTML = questions.map((q, i) => {
    const classes = ["wizard-dot"];
    if (state.answers[q.id]) classes.push("is-answered");
    if (i === state.currentIndex) classes.push("is-current");
    return `<button type="button" class="${classes.join(" ")}" data-index="${i}" aria-label="設問${i + 1}へ移動" title="Q${String(i + 1).padStart(2, "0")}"></button>`;
  }).join("");
}

function goToQuestion(index) {
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
  state.currentIndex = Math.max(0, Math.min(questions.length - 1, index));
  renderWizard();
}

function handleAnswer(questionId, value) {
  state.answers[questionId] = value;
  saveProgressToStorage();
  renderDots();
  updateProgress();
  if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
  const isLast = state.currentIndex === questions.length - 1;
  if (!isLast) {
    autoAdvanceTimer = setTimeout(() => {
      goToQuestion(state.currentIndex + 1);
    }, prefersReducedMotion() ? 120 : 320);
  } else if (isComplete()) {
    submitDiagnosisBtn.classList.add("is-ready");
  }
}

function updateProgress() {
  const answered = answeredCount();
  const pct = Math.round((answered / questions.length) * 100);
  progressText.textContent = `${pct}%`;
  progressBar.style.width = `${pct}%`;
  if (pct === 0) progressHint.textContent = "最初の設問から回答してください。";
  else if (pct < 100) progressHint.textContent = `あと${questions.length - answered}問で診断できます。`;
  else progressHint.textContent = "全問回答済み。「診断結果を見る」を押してください。";
  submitDiagnosisBtn.classList.toggle("is-ready", isComplete());
}

/* ---------- 講座カタログ ---------- */

function renderCourseCatalog() {
  courseCatalog.innerHTML = courses.map(course => `
    <article class="course-card">
      <div class="course-image"><img src="${course.image}" alt="${course.title}の活用シーン" loading="lazy" /></div>
      <span class="course-no">${course.no}</span>
      <h3>${course.title}</h3>
      <p>${course.summary}</p>
      <div class="course-meta">
        <span>${course.format}</span>
        <span>${course.duration}</span>
        <span>${course.target}</span>
      </div>
      <p class="course-price">${course.price}</p>
    </article>
  `).join("");
}

/* ---------- スコア計算 ---------- */

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function normalize(raw, max) {
  if (max <= 0) return 0;
  return clamp(Math.round((raw / max) * 100));
}

function calculateScores(answers = state.answers) {
  const raw = { urgency: 0, revenue: 0, efficiency: 0, implementation: 0, governance: 0, anxiety: 0, maturity: 0 };
  const max = { urgency: 0, revenue: 0, efficiency: 0, implementation: 0, governance: 0, anxiety: 0, maturity: 0 };

  questions.forEach(q => {
    const answer = Number(answers[q.id] || 0);
    // reverse設問（q9/q11）は「1=良い状態」なので、必要度スコアとしては反転して評価する
    const baseValue = q.reverse && answer > 0 ? (6 - answer) : answer;
    Object.entries(q.weights).forEach(([key, weight]) => {
      const positiveWeight = Math.abs(weight);
      max[key] = (max[key] || 0) + positiveWeight * 5;
      raw[key] = (raw[key] || 0) + (baseValue * weight);
    });
  });

  const maturityRaw = raw.maturity;
  const maturityScore = clamp(Math.round(50 + (maturityRaw / Math.max(max.maturity, 1)) * 50));
  const maturityGap = 100 - maturityScore;

  const scores = {
    urgency: normalize(raw.urgency, max.urgency),
    revenue: normalize(raw.revenue, max.revenue),
    efficiency: normalize(raw.efficiency, max.efficiency),
    implementation: normalize(raw.implementation, max.implementation),
    governance: normalize(raw.governance, max.governance),
    anxiety: normalize(raw.anxiety, max.anxiety),
    maturity: maturityScore,
    maturityGap
  };

  const pressure = clamp(Math.round(
    scores.urgency * 0.26 +
    scores.implementation * 0.18 +
    scores.revenue * 0.16 +
    scores.efficiency * 0.14 +
    scores.governance * 0.12 +
    scores.anxiety * 0.10 +
    scores.maturityGap * 0.04
  ));

  return { ...scores, pressure };
}

function recommendCourses(scores) {
  return courses.map(course => {
    const value = Object.entries(course.weights).reduce((sum, [key, weight]) => sum + (scores[key] || 0) * weight, 0);
    const reasons = [];
    if ((course.weights.revenue || 0) > 1 && scores.revenue >= 60) reasons.push("売上・顧客接点のAI活用余地が大きい");
    if ((course.weights.efficiency || 0) > 1 && scores.efficiency >= 60) reasons.push("業務効率化の即効テーマが多い");
    if ((course.weights.implementation || 0) > 1 && scores.implementation >= 60) reasons.push("AI実装・PoC設計を整理する必要がある");
    if ((course.weights.governance || 0) > 1 && scores.governance >= 60) reasons.push("情報管理・ルール整備への不安が強い");
    if ((course.weights.maturityGap || 0) > 1 && scores.maturityGap >= 45) reasons.push("社内定着・推進者育成の優先度が高い");
    if ((course.weights.anxiety || 0) > 1 && scores.anxiety >= 60) reasons.push("不安を安全利用ルールに変える段階");
    return { ...course, matchScore: Math.round(value / 3.2), reasons: reasons.length ? reasons : ["診断スコアとの総合適合度が高い"] };
  }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
}

function getPressureLevel(score) {
  if (score >= 78) return { title: "重点強化レベル", tone: "critical", text: "AI活用を部署単位の実践テーマへ落とし込む段階です。基礎理解だけで終わらせず、90日以内に業務テンプレート・PoC・安全利用ルールを形にすると効果が出やすい状態です。" };
  if (score >= 58) return { title: "実践準備レベル", tone: "high", text: "AI活用の方向性は見え始めています。個人利用で止めず、部署単位の業務改善テーマとルール整備を並行して進めると成果が出やすい状態です。" };
  if (score >= 38) return { title: "基礎整備レベル", tone: "medium", text: "大規模実装の前に、AI基礎・安全利用・業務テンプレート整備から始めると、現場定着しやすくなります。" };
  return { title: "小さく試すレベル", tone: "low", text: "現時点では小さく始めやすい状態です。基礎理解と身近な改善テーマを作っておくと、次の展開へ進みやすくなります。" };
}

function buildRiskMessage(scores) {
  const dimensions = [
    ["収益化", scores.revenue],
    ["業務改善", scores.efficiency],
    ["実装", scores.implementation],
    ["ガバナンス", scores.governance],
    ["不安", scores.anxiety]
  ].sort((a, b) => b[1] - a[1]);
  const maxDimension = dimensions[0];
  const minDimension = dimensions[dimensions.length - 1];

  const riskMap = {
    "収益化": "AIを単なる時短ツールで終わらせず、提案・商品企画・顧客接点の改善テーマへ接続すると効果が広がります。",
    "業務改善": "定型業務の負荷を見える化し、AIで置き換えやすい業務からテンプレート化すると、処理速度と品質を高められます。",
    "実装": "PoC要件を整理してから進めると、ツール導入で止まらず、現場定着と効果測定につなげやすくなります。",
    "ガバナンス": "ルールと承認フローを整えることで、情報漏洩・誤回答・著作権・社内承認の不安を下げながら活用範囲を広げられます。",
    "不安": "不安を整理し、使ってよい範囲と確認方法を明確にすると、組織全体でAI活用の学習速度を高められます。"
  };

  return {
    dimension: maxDimension[0],
    text: riskMap[maxDimension[0]],
    strongDimension: minDimension[0],
    strongScore: minDimension[1]
  };
}

function buildRoadmap(scores, recs) {
  const first = recs[0]?.title || "生成AI基礎・安全利用リテラシープログラム";
  const second = recs[1]?.title || "業務改善プロンプト実践プログラム";
  const third = recs[2]?.title || "AI PoC要件定義・実装設計プログラム";
  return [
    { day: "Day 1-30", title: "共通理解と安全利用ルール", text: `${first}を起点に、利用可能ツール、禁止事項、対象業務、成果KPIを整理する。` },
    { day: "Day 31-60", title: "業務テンプレート化", text: `${second}を通じて、議事録・提案書・調査・顧客対応など3〜5業務をテンプレート化する。` },
    { day: "Day 61-90", title: "PoC・収益化テーマ化", text: `${third}で、AI実装または事業活用テーマを1件選び、デモ・要件・判断材料へ落とす。` }
  ];
}

/* ---------- レーダーチャート ---------- */

const READINESS_LINE = 60;

function renderRadar(canvas, scores) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  const cx = width / 2;
  const cy = height / 2 + 8;
  const radius = Math.min(width, height) * 0.34;
  const items = [
    ["緊急性", scores.urgency],
    ["収益化", scores.revenue],
    ["業務改善", scores.efficiency],
    ["実装", scores.implementation],
    ["統制", scores.governance],
    ["不安", scores.anxiety]
  ];

  ctx.font = "13px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let level = 1; level <= 5; level++) {
    const r = radius * level / 5;
    ctx.beginPath();
    items.forEach((_, i) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * i / items.length);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = `rgba(37,99,235,${0.08 + level * 0.02})`;
    ctx.stroke();
  }

  items.forEach(([label], i) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * i / items.length);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = "rgba(37,99,235,.12)";
    ctx.stroke();
    const labelX = cx + Math.cos(angle) * (radius + 34);
    const labelY = cy + Math.sin(angle) * (radius + 28);
    ctx.fillStyle = "rgba(23,32,51,.92)";
    ctx.fillText(label, labelX, labelY);
  });

  // 実践準備ライン（60）を点線で表示
  ctx.beginPath();
  items.forEach((_, i) => {
    const r = radius * READINESS_LINE / 100;
    const angle = -Math.PI / 2 + (Math.PI * 2 * i / items.length);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.setLineDash([7, 6]);
  ctx.strokeStyle = "rgba(245,158,11,.85)";
  ctx.lineWidth = 1.6;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.lineWidth = 1;

  ctx.beginPath();
  items.forEach(([, value], i) => {
    const r = radius * value / 100;
    const angle = -Math.PI / 2 + (Math.PI * 2 * i / items.length);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.closePath();
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(37,99,235,.32)");
  gradient.addColorStop(1, "rgba(20,184,163,.24)");
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = "rgba(37,99,235,.85)";
  ctx.lineWidth = 2;
  ctx.stroke();

  items.forEach(([, value], i) => {
    const r = radius * value / 100;
    const angle = -Math.PI / 2 + (Math.PI * 2 * i / items.length);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#2563eb";
    ctx.fill();
  });
}

function renderRadarLegend() {
  const legend = document.querySelector("#radarLegend");
  if (!legend) return;
  legend.innerHTML = `
    <span class="legend-item"><span class="legend-swatch legend-self"></span>自社スコア</span>
    <span class="legend-item"><span class="legend-swatch legend-line"></span>実践準備ライン（${READINESS_LINE}）</span>
    <small>数値が高い領域ほど、優先して整えるべきテーマです。</small>
  `;
}

/* ---------- スコア演出 ---------- */

function animateScoreRing(ringEl, scoreEl, target) {
  if (prefersReducedMotion()) {
    scoreEl.textContent = target;
    ringEl.style.setProperty("--ring", `${target * 3.6}deg`);
    return;
  }
  const duration = 900;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const value = Math.round(target * eased);
    scoreEl.textContent = value;
    ringEl.style.setProperty("--ring", `${value * 3.6}deg`);
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function priorityLabel(value) {
  if (value >= 70) return { label: "優先度：高", tone: "high" };
  if (value >= 40) return { label: "優先度：中", tone: "mid" };
  return { label: "優先度：低", tone: "low" };
}

/* ---------- 診断結果 ---------- */

function renderResult(options = {}) {
  const { demo = false } = options;
  const scores = calculateScores();
  const level = getPressureLevel(scores.pressure);
  const risk = buildRiskMessage(scores);
  const recs = recommendCourses(scores);
  const roadmap = buildRoadmap(scores, recs);
  const companyName = document.querySelector("#companyName").value.trim() || "未入力";
  const industry = document.querySelector("#industry").value;
  const employeeSize = document.querySelector("#employeeSize").value;

  state.lastResult = {
    companyName,
    industry,
    employeeSize,
    scores,
    level,
    risk,
    recommendations: recs.map(({ title, summary, format, duration, target, matchScore, reasons }) => ({ title, summary, format, duration, target, matchScore, reasons })),
    answers: { ...state.answers },
    generatedAt: new Date().toISOString()
  };

  const template = document.querySelector("#resultTemplate");
  const node = template.content.cloneNode(true);
  resultRoot.innerHTML = "";
  resultRoot.appendChild(node);

  const ring = document.querySelector("#urgencyRing");
  const score = document.querySelector("#urgencyScore");
  const title = document.querySelector("#resultTitle");
  const summary = document.querySelector("#resultSummary");
  const badges = document.querySelector("#resultBadges");
  const kpiGrid = document.querySelector("#kpiGrid");
  const riskMessage = document.querySelector("#riskMessage");
  const recommendations = document.querySelector("#recommendations");
  const roadmapRoot = document.querySelector("#roadmap");

  animateScoreRing(ring, score, scores.pressure);
  title.textContent = level.title;
  summary.textContent = level.text;
  const badgeValues = [companyName, industry, employeeSize].filter(Boolean);
  if (demo) badgeValues.unshift("サンプル表示");
  badges.innerHTML = badgeValues.map(v => `<span class="badge${v === "サンプル表示" ? " badge-demo" : ""}">${escapeHtml(v)}</span>`).join("");

  const kpis = [
    ["緊急性", scores.urgency, "意思決定を急ぐべき度合い"],
    ["収益化余地", scores.revenue, "売上・提案価値への接続度"],
    ["効率化余地", scores.efficiency, "時短・コスト削減の余地"],
    ["実装ギャップ", scores.implementation, "PoC/自動化の必要度"],
    ["統制・不安", Math.round((scores.governance + scores.anxiety) / 2), "安全利用ルールの必要度"]
  ];
  kpiGrid.innerHTML = kpis.map(([label, value, desc]) => {
    const priority = priorityLabel(value);
    return `
      <article class="kpi-card">
        <div class="kpi-head">
          <span>${label}</span>
          <em class="kpi-chip kpi-${priority.tone}">${priority.label}</em>
        </div>
        <strong>${value}</strong>
        <div class="kpi-bar"><span style="width:${clamp(value)}%"></span></div>
        <p>${desc}</p>
      </article>
    `;
  }).join("");

  riskMessage.innerHTML = `
    <strong>優先して整える領域：${risk.dimension}</strong>
    <p>${risk.text}</p>
    <p class="risk-strong">比較的整っている領域：<b>${risk.strongDimension}</b>（${risk.strongScore}）。この強みを起点に展開すると、社内合意を得やすくなります。</p>
  `;

  recommendations.innerHTML = recs.map((course, index) => `
    <article class="recommendation-card">
      <span class="rank">NO.${index + 1} / MATCH ${clamp(course.matchScore)}%</span>
      <h3>${course.title}</h3>
      <p>${course.summary}</p>
      <div class="course-meta">
        <span>${course.format}</span>
        <span>${course.duration}</span>
        <span>${course.target}</span>
      </div>
      <p><strong>推奨理由：</strong>${course.reasons.join(" / ")}</p>
    </article>
  `).join("");

  roadmapRoot.innerHTML = roadmap.map(item => `
    <article class="roadmap-item">
      <span>${item.day}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");

  renderRadar(document.querySelector("#radarCanvas"), scores);
  renderRadarLegend();
  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
  wireResultActions();
  prepareApplicationForm();
}

function buildSummaryText(result = state.lastResult) {
  if (!result) return "";
  return [
    `【AI活用診断結果】`,
    `会社/部署：${result.companyName}`,
    `業種：${result.industry}`,
    `従業員規模：${result.employeeSize}`,
    `AI実装度：${result.scores.pressure}/100（${result.level.title}）`,
    `緊急性：${result.scores.urgency} / 収益化：${result.scores.revenue} / 効率化：${result.scores.efficiency} / 実装：${result.scores.implementation} / 統制不安：${Math.round((result.scores.governance + result.scores.anxiety) / 2)}`,
    `優先して整える領域：${result.risk.dimension}`,
    result.risk.text,
    `推奨実践プログラム：`,
    ...result.recommendations.map((c, i) => `${i + 1}. ${c.title}（${c.format} / ${c.duration}）`)
  ].join("\n");
}

function prepareApplicationForm() {
  const result = state.lastResult;
  if (!result) return;
  const desiredCourse = document.querySelector("#desiredCourse");
  const applicationSummary = document.querySelector("#applicationSummary");
  if (desiredCourse) {
    desiredCourse.innerHTML = [
      `<option value="${escapeHtml(result.recommendations[0]?.title || "")}">推奨1位：${escapeHtml(result.recommendations[0]?.title || "未選択")}</option>`,
      ...result.recommendations.slice(1).map((course, i) => `<option value="${escapeHtml(course.title)}">推奨${i + 2}位：${escapeHtml(course.title)}</option>`),
      `<option value="結果を見て決めたい">結果を見て決めたい</option>`
    ].join("");
  }
  if (applicationSummary) {
    applicationSummary.innerHTML = `
      <strong>共有される診断サマリー</strong>
      <p>${escapeHtml(result.companyName)} / AI実装度 ${result.scores.pressure}/100 / ${escapeHtml(result.level.title)} / 推奨1位：${escapeHtml(result.recommendations[0]?.title || "未選択")}</p>
    `;
  }
}

function getApplicationPayload() {
  const result = state.lastResult;
  const recommended = result.recommendations.map((c, i) => `${i + 1}. ${c.title}`).join(" / ");
  return {
    companyName: result.companyName,
    industry: result.industry,
    employeeSize: result.employeeSize,
    contactName: document.querySelector("#contactName")?.value.trim() || "",
    contactEmail: document.querySelector("#contactEmail")?.value.trim() || "",
    contactPhone: document.querySelector("#contactPhone")?.value.trim() || "",
    contactRole: document.querySelector("#contactRole")?.value.trim() || "",
    requestType: document.querySelector("#requestType")?.value || "",
    desiredCourse: document.querySelector("#desiredCourse")?.value || "",
    applicationNote: document.querySelector("#applicationNote")?.value.trim() || "",
    pressureScore: String(result.scores.pressure),
    resultLevel: result.level.title,
    riskDimension: result.risk.dimension,
    recommendedCourses: recommended,
    diagnosisSummary: buildSummaryText(result),
    resultJson: JSON.stringify(result),
    consent: document.querySelector("#privacyConsent")?.checked ? "同意" : "未同意"
  };
}

function submitToGoogleForms(payload) {
  if (!isGoogleFormsConfigured()) {
    const saved = JSON.parse(localStorage.getItem("aiDiagnosisApplications") || "[]");
    saved.push({ ...payload, submittedAt: new Date().toISOString(), mode: "local-demo" });
    localStorage.setItem("aiDiagnosisApplications", JSON.stringify(saved));
    return Promise.resolve({ demo: true });
  }

  return new Promise(resolve => {
    const iframeName = `hidden_google_form_${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = iframeName;
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.action = GOOGLE_FORMS_CONFIG.formActionUrl;
    form.method = "POST";
    form.target = iframeName;
    form.style.display = "none";

    Object.entries(GOOGLE_FORMS_CONFIG.fields).forEach(([key, entryName]) => {
      if (!entryName || !entryName.startsWith("entry.")) return;
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = entryName;
      input.value = payload[key] ?? "";
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    setTimeout(() => {
      form.remove();
      iframe.remove();
      resolve({ demo: false });
    }, 900);
  });
}

function validateApplicationForm() {
  const name = document.querySelector("#contactName");
  const email = document.querySelector("#contactEmail");
  const requestType = document.querySelector("#requestType");
  const consent = document.querySelector("#privacyConsent");
  const status = document.querySelector("#formStatus");
  const invalid = [name, email, requestType].find(el => !el?.value?.trim()) || (!consent?.checked ? consent : null);
  if (!invalid) return true;
  if (status) status.textContent = "必須項目を入力し、送信同意にチェックしてください。";
  invalid?.focus?.();
  return false;
}

function wireResultActions() {
  document.querySelector("#copyResultBtn")?.addEventListener("click", async () => {
    await navigator.clipboard.writeText(buildSummaryText());
    alert("診断結果をコピーしました。");
  });

  document.querySelector("#downloadJsonBtn")?.addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.lastResult, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-diagnosis-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.querySelector("#goApplicationBtn")?.addEventListener("click", () => {
    document.querySelector("#application")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("#retakeBtn")?.addEventListener("click", () => {
    resetAll();
    document.querySelector("#diagnosis")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.querySelector("#copyApplicationBtn")?.addEventListener("click", async () => {
    const payload = getApplicationPayload();
    const text = [
      "【AI実装度チェック 共有内容】",
      `会社/部署：${payload.companyName}`,
      `お名前：${payload.contactName}`,
      `メール：${payload.contactEmail}`,
      `確認したい内容：${payload.requestType}`,
      `希望プログラム：${payload.desiredCourse}`,
      "",
      payload.diagnosisSummary,
      "",
      `補足：${payload.applicationNote}`
    ].join("\n");
    await navigator.clipboard.writeText(text);
    document.querySelector("#formStatus").textContent = "送信内容をコピーしました。";
  });

  document.querySelector("#applicationForm")?.addEventListener("submit", async event => {
    event.preventDefault();
    if (!validateApplicationForm()) return;
    const status = document.querySelector("#formStatus");
    const submitBtn = document.querySelector("#submitApplicationBtn");
    const payload = getApplicationPayload();
    submitBtn.disabled = true;
    status.textContent = "送信しています...";
    try {
      const response = await submitToGoogleForms(payload);
      status.textContent = response.demo
        ? "送信デモを保存しました。Googleフォーム連携を有効化すると、回答として記録できます。"
        : "送信しました。診断結果をもとに実施方法を確認できます。";
      event.target.classList.add("is-submitted");
    } catch (error) {
      console.error(error);
      status.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
    } finally {
      submitBtn.disabled = false;
    }
  });

  document.querySelector("#printBtn")?.addEventListener("click", () => window.print());
}

function validateForm() {
  const missingIndex = questions.findIndex(q => !state.answers[q.id]);
  if (missingIndex === -1) return true;
  goToQuestion(missingIndex);
  const card = document.querySelector(`[data-question="${questions[missingIndex].id}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "center" });
  card?.animate([
    { transform: "translateX(0)" },
    { transform: "translateX(-8px)" },
    { transform: "translateX(8px)" },
    { transform: "translateX(0)" }
  ], { duration: 420, easing: "ease-out" });
  progressHint.textContent = `未回答があります：Q${String(missingIndex + 1).padStart(2, "0")}`;
  return false;
}

function resetAll() {
  state.answers = {};
  state.currentIndex = 0;
  clearStoredProgress();
  assessmentForm.reset();
  document.querySelector("#companyName").value = "";
  document.querySelector("#industry").value = "未選択";
  document.querySelector("#employeeSize").value = "未選択";
  resultSection.classList.add("hidden");
  resultRoot.innerHTML = "";
  renderWizard();
}

/* ---------- サンプル結果（回答を破壊しない） ---------- */

function showDemoResult() {
  if (isComplete()) {
    renderResult();
    return;
  }
  const snapshot = { ...state.answers };
  questions.forEach(q => {
    state.answers[q.id] = q.id === "q1" ? 2 : 4;
  });
  renderResult({ demo: true });
  state.answers = snapshot;
  updateProgress();
}

/* ---------- 初期化 ---------- */

let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  const restored = loadProgressFromStorage();
  state.currentIndex = restored ? firstUnansweredIndex() : 0;
  renderWizard();
  renderCourseCatalog();

  if (restored) {
    progressHint.textContent = isComplete()
      ? "前回の回答を復元しました。「診断結果を見る」を押してください。"
      : `前回の回答を復元しました。あと${questions.length - answeredCount()}問です。`;
  }

  assessmentForm.addEventListener("change", event => {
    if (event.target.matches("input[type='radio']")) {
      handleAnswer(event.target.name, Number(event.target.value));
    }
  });

  assessmentForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!validateForm()) return;
    renderResult();
  });

  ["companyName", "industry", "employeeSize"].forEach(id => {
    document.querySelector(`#${id}`)?.addEventListener("change", saveProgressToStorage);
  });

  prevBtn.addEventListener("click", () => goToQuestion(state.currentIndex - 1));
  nextBtn.addEventListener("click", () => goToQuestion(state.currentIndex + 1));

  wizardDots.addEventListener("click", event => {
    const dot = event.target.closest(".wizard-dot");
    if (dot) goToQuestion(Number(dot.dataset.index));
  });

  document.addEventListener("keydown", event => {
    const tag = document.activeElement?.tagName;
    if (tag === "INPUT" && document.activeElement?.type !== "radio") return;
    if (tag === "SELECT" || tag === "TEXTAREA") return;
    const diagnosisSection = document.querySelector("#diagnosis");
    const rect = diagnosisSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (event.key >= "1" && event.key <= "5") {
      const q = questions[state.currentIndex];
      const input = document.querySelector(`input[name="${q.id}"][value="${event.key}"]`);
      if (input) {
        input.checked = true;
        handleAnswer(q.id, Number(event.key));
        event.preventDefault();
      }
    } else if (event.key === "ArrowLeft") {
      goToQuestion(state.currentIndex - 1);
      event.preventDefault();
    } else if (event.key === "ArrowRight") {
      goToQuestion(state.currentIndex + 1);
      event.preventDefault();
    }
  });

  document.querySelector("#resetBtn").addEventListener("click", resetAll);

  document.querySelectorAll("[data-scroll-target]").forEach(button => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      if (resultSection.classList.contains("hidden")) {
        showDemoResult();
      } else {
        target?.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
