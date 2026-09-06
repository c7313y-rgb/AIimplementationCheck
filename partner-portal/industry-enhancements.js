/* Turns the diagnostic chart into an implementation decision workspace. */
(function(){
  const original = window.showClientResult;
  if (typeof original !== 'function') return;
  const urgencyNote = '調査レポートでは、AIを個人利用や文書作成だけで止めず、反復業務へ組み込める企業ほど効果を測りやすい傾向が示されています。導入済みのツール数ではなく、1業務の時間・品質・売上指標で比較します。';
  window.showClientResult = function(item){
    if(item.version !== 'industry-v3') {
      const legacy=document.getElementById('clientResult');
      legacy.classList.remove('hidden');
      legacy.innerHTML=`<h2>以前の診断データがあります</h2><p>評価項目が更新されました。上の業種別診断に回答すると、新しい基準のカルテを作成できます。以前の結果を新版の点数や効果試算として表示することはありません。</p><p>診断ID：${esc(item.id)}</p><button type="button" class="btn secondary" id="legacyExport">以前の診断をJSON保存</button>`;
      legacy.querySelector('#legacyExport').onclick=()=>downloadChart(item);
      return;
    }
    original(item);
    const root = document.getElementById('clientResult');
    if (!root || root.querySelector('.implementation-plan')) return;
    const d=item.draft||{};
    const plan=document.createElement('section');
    plan.className='implementation-plan';
    plan.innerHTML=`<span class="eyebrow">FROM DIAGNOSIS TO REQUIREMENTS</span><h3>本実装に向けて、先に決めること</h3><div class="plan-grid"><article><b>AIに任せる範囲</b><strong>${esc(item.priority)}</strong><p>資料の抽出・比較・下書き・検索をAIが支援。最終判断と顧客・品質・契約への責任は人が持ちます。</p></article><article><b>研修・定着</b><strong>操作＋判断＋情報管理</strong><p>${esc(item.trainingPlan||'AIの基礎、プロンプト、誤回答確認、情報管理を含む研修を実施')}</p></article><article><b>セキュリティ要件</b><strong>入力・保管・権限・ログ</strong><p>${esc(item.securityPlan||'匿名化、アクセス権限、利用ルール、出力レビューを先に決める')}</p></article><article><b>期限と実証条件</b><strong>${esc(d.clientUrgency||'90日で確認')}</strong><p>匿名化サンプル、現状KPI、対象担当者、週次レビューをそろえ、効果を測れる状態にします。</p></article></div>`;
    const summary=root.querySelector('.chart-summary'); if(summary) summary.after(plan);
    const agent=root.querySelector('.agent-experience');
    if(agent){
      const intro=document.createElement('div'); intro.className='agent-explain'; intro.innerHTML=`<strong>体験の見方</strong><p>①資料や依頼を入力 → ②AIが整理・下書き → ③人が根拠を確認して承認。ここで「AIに任せる範囲」と「人の確認点」を実感します。</p>`; agent.insertBefore(intro,agent.querySelector('.detail-actions'));
    }
    const bridge=document.createElement('section'); bridge.className='decision-bridge'; bridge.innerHTML=`<span class="eyebrow">DECIDE THE NEXT STEP</span><h3>体験を、要件定義とPoC判断につなげる。</h3><p>${urgencyNote}</p><div class="bridge-actions"><button class="btn primary" type="button" id="requirementsBtn">要件定義シートを作る</button><button class="btn secondary" type="button" id="pocDecisionBtn">PoC決定チェック</button></div><div id="bridgeOutput" class="bridge-output hidden"></div>`;
    const next=root.querySelector('.next-decision'); if(next) next.before(bridge); else root.append(bridge);
    const output=bridge.querySelector('#bridgeOutput');
    bridge.querySelector('#requirementsBtn').onclick=()=>{output.classList.remove('hidden');output.innerHTML=`<h4>90日PoC 要件定義シート（下書き）</h4><dl><dt>対象業務</dt><dd>${esc(item.priority)}</dd><dt>AIの役割</dt><dd>資料の抽出・比較・要約・下書き。自動送信・自動承認は行わない。</dd><dt>人の承認</dt><dd>担当責任者が根拠・数値・顧客影響を確認して確定。</dd><dt>データ</dt><dd>${esc(d.clientSystem||'現行資料')}から匿名化した20〜50件を準備。</dd><dt>効果指標</dt><dd>${esc(item.kpi||'処理時間・確認ミス')}。現状値とPoC後を同じ方法で測定。</dd><dt>研修</dt><dd>${esc(item.trainingPlan||'責任者向け運用研修＋現場演習')}</dd><dt>安全策</dt><dd>${esc(item.securityPlan||'アクセス権限、ログ、出力レビュー、削除手順')}</dd></dl><button type="button" class="text-action" id="copyRequirements">要件をコピー</button>`;output.querySelector('#copyRequirements').onclick=()=>navigator.clipboard?.writeText(output.innerText).then(()=>showToast('要件定義シートをコピーしました。'));};
    bridge.querySelector('#pocDecisionBtn').onclick=()=>{output.classList.remove('hidden');output.innerHTML='<h4>PoC開始前の5項目</h4><ol><li>対象業務と責任者が決まっている</li><li>匿名化データを20件以上準備できる</li><li>現状の時間・品質・売上指標がある</li><li>AI出力を人が承認する手順がある</li><li>研修・利用ルール・問い合わせ先が決まっている</li></ol><p><strong>5項目すべてに答えられれば、90日PoCの相談へ進めます。</strong></p>';};
  };
})();
