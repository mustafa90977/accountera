/**
 * practice-view.js — بيئة عمل التمارين والأمثلة المحلولة والتطبيق التفاعلي
 * تصميم متجاوب 100% مع الهواتف المحمولة وتجربة قيود سلسة
 */

const ACCOUNTS_LIST = [
  { id: "cash", name: "النقدية في الصندوق", type: "أصول", normal: "مدين" },
  { id: "bank", name: "حساب البنك الجاري", type: "أصول", normal: "مدين" },
  { id: "ar", name: "العملاء (المدينون)", type: "أصول", normal: "مدين" },
  { id: "inventory", name: "مخزون البضاعة", type: "أصول", normal: "مدين" },
  { id: "equipment", name: "الأجهزة والمعدات", type: "أصول", normal: "مدين" },
  { id: "ap", name: "الموردون (الدائنون)", type: "التزامات", normal: "دائن" },
  { id: "capital", name: "رأس المال", type: "حقوق ملكية", normal: "دائن" },
  { id: "sales_rev", name: "إيراد المبيعات", type: "إيرادات", normal: "دائن" },
  { id: "service_rev", name: "إيراد الخدمات", type: "إيرادات", normal: "دائن" },
  { id: "rent_exp", name: "مصروف الإيجار", type: "مصروفات", normal: "مدين" },
  { id: "salary_exp", name: "مصروف الرواتب", type: "مصروفات", normal: "مدين" },
  { id: "util_exp", name: "مصروف المرافق والكهرباء", type: "مصروفات", normal: "مدين" }
];

const EXAMPLES_DATA = [
  {
    id: "ex-1",
    number: 1,
    title: "شراء بضاعة نقداً من الخزينة",
    transaction: "اشترت الشركة بضاعة للمستودع بمبلغ 10,000 نقداً بموجب فاتورة شراء ضريبية وإيصال صرف نقدية.",
    amount: 10000,
    analysis: "دخلت بضاعة فزاد حساب المخزون (أصل زاد = مدين)، وخرجت نقدية من الخزينة فنقص حساب النقدية (أصل نقص = دائن).",
    debitAcc: "مخزون البضاعة",
    creditAcc: "النقدية في الصندوق"
  },
  {
    id: "ex-2",
    number: 2,
    title: "شراء بضاعة على الحساب (بالآجل)",
    transaction: "اشترت الشركة بضاعة بمبلغ 15,000 من المورد شركة الأمل على الحساب مع سداد القيمة بعد 30 يوماً.",
    amount: 15000,
    analysis: "استلمت الشركة بضاعة فزاد المخزون (أصل زاد = مدين)، ونشأ التزام ودين للمورد شركة الأمل (التزام زاد = دائن).",
    debitAcc: "مخزون البضاعة",
    creditAcc: "الموردون (شركة الأمل)"
  },
  {
    id: "ex-3",
    number: 3,
    title: "بيع بضاعة نقداً للعميل",
    transaction: "باعت الشركة بضاعة بمبلغ 20,000 وحصلت كامل القيمة نقداً وأودعت في خزينة الشركة.",
    amount: 20000,
    analysis: "استلمت الخزينة أموالاً فزادت النقدية (أصل زاد = مدين)، وتحقق للمنشأة تدفق مبيعات فزاد إيراد المبيعات (إيراد زاد = دائن).",
    debitAcc: "النقدية في الصندوق",
    creditAcc: "إيراد المبيعات"
  }
];

const INDEPENDENT_DATA = [
  {
    id: "ip-1",
    number: 1,
    title: "بيع بضاعة نقداً",
    transaction: "باعت الشركة بضاعة بمبلغ 18,000 نقداً للعميل واستلمت المبلغ في الخزينة.",
    amount: 18000,
    hint: "فكر في النقدية التي دخلت الخزينة، وإيراد المبيعات الذي تحقق للشركة.",
    correctDebit: "cash",
    correctCredit: "sales_rev",
    explanation: "حساب النقدية أصل وزاد فيكون مديناً، وحساب إيراد المبيعات إيراد تحقق وزاد فيكون دائناً."
  },
  {
    id: "ip-2",
    number: 2,
    title: "شراء بضاعة على الحساب",
    transaction: "اشترت المنشأة بضاعة للمستودع بمبلغ 25,000 بالآجل على الحساب من الموردين.",
    amount: 25000,
    hint: "البضاعة دخلت المستودع (أصل)، والتزام السداد للموردين زاد (خصم).",
    correctDebit: "inventory",
    correctCredit: "ap",
    explanation: "المخزون أصل زاد بالبضاعة فيكون مديناً، والموردون التزام دين زاد فيكون دائناً."
  },
  {
    id: "ip-3",
    number: 3,
    title: "سداد إيجار المقر نقداً",
    transaction: "سددت المنشأة قيمة إيجار المقر الإداري البالغة 4,000 نقداً بإيصال سداد.",
    amount: 4000,
    hint: "المصروفات بطبيعتها مدينة عند زيادتها، والنقدية خرجت من الخزينة ونقصت.",
    correctDebit: "rent_exp",
    correctCredit: "cash",
    explanation: "مصروف الإيجار زاد فيكون مديناً، والنقدية أصل نقص فيكون دائناً."
  },
  {
    id: "ip-4",
    number: 4,
    title: "سداد رواتب الموظفين",
    transaction: "صرفت الشركة رواتب الموظفين الشهرية وقدرها 9,000 نقداً من الخزينة.",
    amount: 9000,
    hint: "رواتب الموظفين تمثل تكلفة ومصروف تشغيل تحقق في الفترة.",
    correctDebit: "salary_exp",
    correctCredit: "cash",
    explanation: "مصروف الرواتب زاد فيكون مديناً، والنقدية نقصت فتكون دائنة."
  },
  {
    id: "ip-5",
    number: 5,
    title: "سداد فاتورة الكهرباء والمياه",
    transaction: "دفعت المنشأة فاتورة المرافق العامة (كهرباء ومياه) البالغة 2,500 نقداً.",
    amount: 2500,
    hint: "فواتير الكهرباء والمرافق تعتبر مصروفات تشغيلية.",
    correctDebit: "util_exp",
    correctCredit: "cash",
    explanation: "مصروف المرافق مدين لزيادته، والنقدية دائنة لنقصانها."
  },
  {
    id: "ip-6",
    number: 6,
    title: "شراء أجهزة ومعدات نقداً",
    transaction: "اشترت الشركة أجهزة حاسوب ومعدات مكتبية بمبلغ 30,000 نقداً لدعم العمليات.",
    amount: 30000,
    hint: "الأجهزة والمعدات أصل طويل الأجل زاد، والنقدية أصل متداول نقص.",
    correctDebit: "equipment",
    correctCredit: "cash",
    explanation: "الأجهزة والمعدات أصل زاد فيكون مديناً، والنقدية أصل نقص فيكون دائناً."
  }
];

const ExcelPracticeView = {
  // 1. عرض الأمثلة المحلولة
  renderExample(exId) {
    const ex = EXAMPLES_DATA.find(e => e.id === exId) || EXAMPLES_DATA[0];
    const exIdx = EXAMPLES_DATA.findIndex(e => e.id === ex.id);
    const prevEx = exIdx > 0 ? EXAMPLES_DATA[exIdx - 1] : null;
    const nextEx = exIdx < EXAMPLES_DATA.length - 1 ? EXAMPLES_DATA[exIdx + 1] : null;

    return `
      <div class="practice-workspace">
        <header class="practice-header-bar">
          <div class="breadcrumbs">
            <span onclick="navigateToScreen('landing')" style="cursor:pointer;">الرئيسية</span>
            <span>/</span>
            <span onclick="navigateToScreen('lesson-1')" style="cursor:pointer;">المسار التعليمي</span>
            <span>/</span>
            <span class="current">مثال توضيحي ${ex.number} من ${EXAMPLES_DATA.length}</span>
          </div>
          <div class="lessons-nav-strip" style="margin-bottom:0; padding-bottom:0;">
            ${EXAMPLES_DATA.map(e => `
              <button class="lesson-nav-pill ${e.id === ex.id ? 'active' : ''}" onclick="navigateToScreen('${e.id}')">
                <span>مثال ${e.number}</span>
              </button>
            `).join('')}
          </div>
        </header>

        <div class="practice-layout-grid">
          <main>
            <!-- بطاقة المعاملة -->
            <div class="transaction-card">
              <div class="transaction-badge-row">
                <span class="hero-badge" style="margin-bottom:0; font-size:0.75rem;">👁️ مثال محلول مع الشرح</span>
                <span class="doc-tag">DOC #EX-0${ex.number}</span>
              </div>
              <h1 class="transaction-title">${ex.title}</h1>
              <p class="transaction-narrative">${ex.transaction}</p>
              <div class="amount-display-pill">
                <span style="font-size:0.85rem; color:var(--text-secondary);">القيمة الإجمالية:</span>
                <span class="amount-val">${ex.amount.toLocaleString()}</span>
                <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">ج.م</span>
              </div>
            </div>

            <!-- سند القيد المعتمد -->
            <div class="voucher-card">
              <div class="voucher-header">
                <h3 style="font-size:1.1rem; font-weight:800;">سند قيد اليومية المعتمد</h3>
                <span class="hero-badge" style="margin-bottom:0; background:var(--success-bg); color:var(--success); border-color:var(--success-border);">
                  متزن ومطابق ✓
                </span>
              </div>

              <div class="live-voucher-dock">
                <!-- الطرف المدين -->
                <div class="voucher-line">
                  <div>
                    <strong style="color:var(--primary); margin-left:6px;">من حـ/</strong>
                    <strong style="color:var(--text-primary);">${ex.debitAcc}</strong>
                    <span style="font-size:0.7rem; color:var(--text-muted); margin-right:4px;">(Dr)</span>
                  </div>
                  <strong class="font-mono" style="color:var(--primary);">${ex.amount.toLocaleString()}</strong>
                </div>

                <!-- الطرف الدائن -->
                <div class="voucher-line credit-line">
                  <div>
                    <strong style="color:var(--text-muted); margin-left:6px;">إلى حـ/</strong>
                    <strong style="color:var(--text-primary);">${ex.creditAcc}</strong>
                    <span style="font-size:0.7rem; color:var(--text-muted); margin-right:4px;">(Cr)</span>
                  </div>
                  <strong class="font-mono" style="color:var(--text-secondary);">${ex.amount.toLocaleString()}</strong>
                </div>
              </div>

              <!-- التحليل المحاسبي -->
              <div class="highlight-box" style="margin:0;">
                <strong style="color:var(--primary); display:block; margin-bottom:4px;">💡 منطق التحليل المحاسبي:</strong>
                <p style="margin:0; font-size:0.92rem; line-height:1.7;">${ex.analysis}</p>
              </div>

              <!-- أزرار التنقل -->
              <footer class="lesson-footer-nav" style="margin-top:1.5rem; padding-top:1.25rem;">
                ${prevEx ? `
                  <button class="btn-cta-secondary" onclick="navigateToScreen('${prevEx.id}')">
                    ← المثال السابق (${prevEx.number})
                  </button>
                ` : `
                  <button class="btn-cta-secondary" onclick="navigateToScreen('lesson-6')">
                    ← العودة للدروس
                  </button>
                `}

                ${nextEx ? `
                  <button class="btn-cta-primary" onclick="navigateToScreen('${nextEx.id}')">
                    المثال التالي (${nextEx.number}) →
                  </button>
                ` : `
                  <button class="btn-cta-primary" onclick="navigateToScreen('ip-1')">
                    الانتقال للتمارين المستقلة (حل بنفسك) ✍️
                  </button>
                `}
              </footer>
            </div>
          </main>

          <!-- شريط جانبي تعليمي -->
          <aside>
            <div class="side-rail-card">
              <h4 style="font-weight:800; margin-bottom:0.5rem; color:var(--primary);">قاعدة التوازن</h4>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
                في أي قيد يومية، يجب أن يتطابق إجمالي المبالغ المدينة مع إجمالي المبالغ الدائنة بدقة متناهية دون أدنى فارق.
              </p>
            </div>
            <div class="side-rail-card">
              <h4 style="font-weight:800; margin-bottom:0.5rem;">الأثر على الأستاذ</h4>
              <p style="font-size:0.88rem; color:var(--text-secondary); line-height:1.6;">
                يتم ترحيل كل طرف لاحقاً إلى حسابه في دفتر الأستاذ (T-Account) ليتم حساب الرصيد الصافي للنشاط.
              </p>
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  // 2. عرض التدريبات المستقلة (Interactive Journal Builder)
  renderIndependentPractice(ipId) {
    const ip = INDEPENDENT_DATA.find(i => i.id === ipId) || INDEPENDENT_DATA[0];
    const ipIdx = INDEPENDENT_DATA.findIndex(i => i.id === ip.id);
    const prevIp = ipIdx > 0 ? INDEPENDENT_DATA[ipIdx - 1] : null;
    const nextIp = ipIdx < INDEPENDENT_DATA.length - 1 ? INDEPENDENT_DATA[ipIdx + 1] : null;

    return `
      <div class="practice-workspace">
        <header class="practice-header-bar">
          <div class="breadcrumbs">
            <span onclick="navigateToScreen('landing')" style="cursor:pointer;">الرئيسية</span>
            <span>/</span>
            <span onclick="navigateToScreen('ex-1')" style="cursor:pointer;">الأمثلة المحلولة</span>
            <span>/</span>
            <span class="current">تمرين مستقل ${ip.number} من ${INDEPENDENT_DATA.length}</span>
          </div>
          <div class="lessons-nav-strip" style="margin-bottom:0; padding-bottom:0;">
            ${INDEPENDENT_DATA.map(i => `
              <button class="lesson-nav-pill ${i.id === ip.id ? 'active' : ''}" onclick="navigateToScreen('${i.id}')">
                <span>تمرين ${i.number}</span>
              </button>
            `).join('')}
          </div>
        </header>

        <div class="practice-layout-grid">
          <main>
            <!-- بطاقة المعاملة -->
            <div class="transaction-card">
              <div class="transaction-badge-row">
                <span class="hero-badge" style="margin-bottom:0; font-size:0.75rem;">✍️ تدريب عملي مستقل</span>
                <span class="doc-tag">TASK #IP-0${ip.number}</span>
              </div>
              <h1 class="transaction-title">${ip.title}</h1>
              <p class="transaction-narrative">${ip.transaction}</p>
              <div class="amount-display-pill">
                <span style="font-size:0.85rem; color:var(--text-secondary);">المبلغ المطلوب إثباته:</span>
                <span class="amount-val">${ip.amount.toLocaleString()}</span>
                <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">ج.م</span>
              </div>
            </div>

            <!-- بيئة إنشاء القيد التفاعلية -->
            <div class="voucher-card">
              <div class="voucher-header">
                <div>
                  <h3 style="font-size:1.1rem; font-weight:800; margin-bottom:2px;">إعداد سند قيد اليومية</h3>
                  <small style="color:var(--text-muted);">اختر الحساب المدين والحساب الدائن لإثبات العملية</small>
                </div>
                <span id="voucherLiveStatus_${ip.id}" class="hero-badge" style="margin-bottom:0; background:var(--bg-secondary); color:var(--text-muted); border-color:var(--border-subtle);">
                  بانتظار الاختيار
                </span>
              </div>

              <!-- منتقيات الحسابات -->
              <div class="account-pickers-grid">
                <!-- الطرف المدين -->
                <div class="picker-box debit">
                  <div class="picker-label">
                    <span style="color:var(--primary);">من حـ/ (الطرف المدين):</span>
                    <span style="font-size:0.75rem; color:var(--primary);">Dr</span>
                  </div>
                  <select id="debitSelect_${ip.id}" class="picker-select" onchange="ExcelPracticeView.updatePreview('${ip.id}', ${ip.amount})">
                    <option value="">-- اضغط لاختيار الحساب المدين --</option>
                    ${ACCOUNTS_LIST.map(a => `<option value="${a.id}">${a.name} (${a.type})</option>`).join('')}
                  </select>
                </div>

                <!-- الطرف الدائن -->
                <div class="picker-box credit">
                  <div class="picker-label">
                    <span style="color:var(--danger);">إلى حـ/ (الطرف الدائن):</span>
                    <span style="font-size:0.75rem; color:var(--danger);">Cr</span>
                  </div>
                  <select id="creditSelect_${ip.id}" class="picker-select" onchange="ExcelPracticeView.updatePreview('${ip.id}', ${ip.amount})">
                    <option value="">-- اضغط لاختيار الحساب الدائن --</option>
                    ${ACCOUNTS_LIST.map(a => `<option value="${a.id}">${a.name} (${a.type})</option>`).join('')}
                  </select>
                </div>
              </div>

              <!-- سند المعاينة الحي -->
              <div class="live-voucher-dock">
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:8px; font-family:'JetBrains Mono',monospace;">
                  معاينة سند القيد المحاسبي:
                </div>
                <div class="voucher-line">
                  <div>
                    <strong style="color:var(--primary); margin-left:6px;">من حـ/</strong>
                    <span id="prevDebit_${ip.id}" style="color:var(--text-muted);">[اختر الحساب المدين]</span>
                  </div>
                  <strong class="font-mono" style="color:var(--primary);">${ip.amount.toLocaleString()} ج.م</strong>
                </div>
                <div class="voucher-line credit-line">
                  <div>
                    <strong style="color:var(--text-muted); margin-left:6px;">إلى حـ/</strong>
                    <span id="prevCredit_${ip.id}" style="color:var(--text-muted);">[اختر الحساب الدائن]</span>
                  </div>
                  <strong class="font-mono" style="color:var(--text-secondary);">${ip.amount.toLocaleString()} ج.م</strong>
                </div>
              </div>

              <!-- أزرار الإجراءات -->
              <div class="practice-actions-row">
                <button class="btn-cta-primary" onclick="ExcelPracticeView.evaluate('${ip.id}')">
                  ✓ تحقق من صحة القيد
                </button>
                <button class="btn-cta-secondary" onclick="ExcelPracticeView.showHint('${ip.id}')">
                  💡 تلميح
                </button>
              </div>

              <!-- صندوق التقييم التشخيصي -->
              <div id="feedback_${ip.id}" class="feedback-box"></div>

              <!-- أزرار التنقل -->
              <footer class="lesson-footer-nav" style="margin-top:1.5rem; padding-top:1.25rem;">
                ${prevIp ? `
                  <button class="btn-cta-secondary" onclick="navigateToScreen('${prevIp.id}')">
                    ← التمرين السابق (${prevIp.number})
                  </button>
                ` : `
                  <button class="btn-cta-secondary" onclick="navigateToScreen('ex-1')">
                    ← العودة للأمثلة
                  </button>
                `}

                ${nextIp ? `
                  <button class="btn-cta-primary" onclick="navigateToScreen('${nextIp.id}')">
                    التمرين التالي (${nextIp.number}) →
                  </button>
                ` : `
                  <button class="btn-cta-primary" onclick="navigateToScreen('companies-hub')">
                    الانتقال لبيئة عمل الشركات (ERP) 🏢
                  </button>
                `}
              </footer>
            </div>
          </main>

          <!-- شريط الإرشادات السريعة -->
          <aside>
            <div class="side-rail-card">
              <h4 style="font-weight:800; margin-bottom:0.5rem; color:var(--primary);">تذكير المدين والدائن</h4>
              <ul style="font-size:0.85rem; color:var(--text-secondary); line-height:1.8; margin:0; padding-right:16px;">
                <li>الأصول والمصروفات: تزيد <strong style="color:var(--primary);">مدينة</strong> وتنقص <strong style="color:var(--danger);">دائنة</strong>.</li>
                <li>الالتزامات والإيرادات: تزيد <strong style="color:var(--danger);">دائنة</strong> وتنقص <strong style="color:var(--primary);">مدينة</strong>.</li>
              </ul>
            </div>
            <div class="side-rail-card" id="hintCard_${ip.id}" style="display:none; border-color:var(--warning-border); background:var(--warning-bg);">
              <h4 style="font-weight:800; margin-bottom:0.4rem; color:var(--warning);">💡 تلميح المحاسب الذكي</h4>
              <p style="font-size:0.85rem; color:var(--text-primary); margin:0; line-height:1.6;">${ip.hint}</p>
            </div>
          </aside>
        </div>
      </div>
    `;
  },

  updatePreview(ipId, amount) {
    const dSel = document.getElementById(`debitSelect_${ipId}`);
    const cSel = document.getElementById(`creditSelect_${ipId}`);
    const prevDebit = document.getElementById(`prevDebit_${ipId}`);
    const prevCredit = document.getElementById(`prevCredit_${ipId}`);
    const statusBadge = document.getElementById(`voucherLiveStatus_${ipId}`);

    const dVal = dSel ? dSel.value : '';
    const cVal = cSel ? cSel.value : '';

    if (prevDebit) {
      const acc = ACCOUNTS_LIST.find(a => a.id === dVal);
      prevDebit.textContent = acc ? acc.name : '[اختر الحساب المدين]';
      prevDebit.style.color = acc ? 'var(--text-primary)' : 'var(--text-muted)';
      prevDebit.style.fontWeight = acc ? '700' : '400';
    }

    if (prevCredit) {
      const acc = ACCOUNTS_LIST.find(a => a.id === cVal);
      prevCredit.textContent = acc ? acc.name : '[اختر الحساب الدائن]';
      prevCredit.style.color = acc ? 'var(--text-primary)' : 'var(--text-muted)';
      prevCredit.style.fontWeight = acc ? '700' : '400';
    }

    if (statusBadge) {
      if (dVal && cVal) {
        if (dVal === cVal) {
          statusBadge.textContent = 'خطأ: لا يمكن تكرار نفس الحساب';
          statusBadge.style.background = 'var(--danger-bg)';
          statusBadge.style.color = 'var(--danger)';
          statusBadge.style.borderColor = 'var(--danger-border)';
        } else {
          statusBadge.textContent = 'سند مكتمل وجاهز للتحقق';
          statusBadge.style.background = 'var(--primary-light)';
          statusBadge.style.color = 'var(--primary-hover)';
          statusBadge.style.borderColor = 'var(--primary-border)';
        }
      } else {
        statusBadge.textContent = 'بانتظار الاختيار';
        statusBadge.style.background = 'var(--bg-secondary)';
        statusBadge.style.color = 'var(--text-muted)';
        statusBadge.style.borderColor = 'var(--border-subtle)';
      }
    }
  },

  showHint(ipId) {
    const hintCard = document.getElementById(`hintCard_${ipId}`);
    if (hintCard) {
      hintCard.style.display = hintCard.style.display === 'none' ? 'block' : 'none';
    }
  },

  evaluate(ipId) {
    const ip = INDEPENDENT_DATA.find(i => i.id === ipId);
    if (!ip) return;
    const dSel = document.getElementById(`debitSelect_${ipId}`);
    const cSel = document.getElementById(`creditSelect_${ipId}`);
    const feedback = document.getElementById(`feedback_${ipId}`);
    if (!feedback) return;

    const userDebit = dSel ? dSel.value : '';
    const userCredit = cSel ? cSel.value : '';

    if (!userDebit || !userCredit) {
      feedback.className = 'feedback-box error';
      feedback.style.display = 'block';
      feedback.innerHTML = '<strong>⚠️ تنبيه:</strong> يرجى تحديد كل من الطرف المدين والطرف الدائن قبل التحقق.';
      return;
    }

    if (userDebit === userCredit) {
      feedback.className = 'feedback-box error';
      feedback.style.display = 'block';
      feedback.innerHTML = '<strong>❌ خطأ محاسبي:</strong> لا يمكن أن يكون نفس الحساب مديناً ودائناً في نفس العملية بنفس المبلغ.';
      return;
    }

    if (userDebit === ip.correctDebit && userCredit === ip.correctCredit) {
      feedback.className = 'feedback-box success';
      feedback.style.display = 'block';
      feedback.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px; font-weight:800; font-size:1.05rem;">
          <span>🎉 إجابة محاسبية نموذجية 100%!</span>
        </div>
        <p style="margin:0; font-size:0.92rem;">${ip.explanation}</p>
      `;
    } else {
      feedback.className = 'feedback-box error';
      feedback.style.display = 'block';
      let diag = '';
      if (userDebit === ip.correctCredit && userCredit === ip.correctDebit) {
        diag = 'عكست أطراف القيد! جعلت الحساب المدين دائناً والحساب الدائن مديناً. راجع قواعد الأخذ والعطاء.';
      } else if (userDebit !== ip.correctDebit) {
        diag = 'الطرف المدين الذي اخترته غير صحيح. راجع ما هو الحساب الذي دخل المنشأة أو زادت قيمته.';
      } else {
        diag = 'الطرف الدائن الذي اخترته غير صحيح. راجع ما هو الحساب الذي نقص أو كان مصدراً للتدفق.';
      }
      feedback.innerHTML = `
        <div style="font-weight:800; margin-bottom:4px;">❌ القيد غير صحيح:</div>
        <p style="margin:0; font-size:0.92rem;">${diag}</p>
      `;
    }
  }
};

if (typeof window !== 'undefined') {
  window.ExcelPracticeView = ExcelPracticeView;
  window.EXAMPLES_DATA = EXAMPLES_DATA;
  window.INDEPENDENT_DATA = INDEPENDENT_DATA;
}
