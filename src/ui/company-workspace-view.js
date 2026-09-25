/**
 * company-workspace-view.js — محاكي مجمع الشركات التفاعلي الكامل
 * يدعم نمطين لعرض السندات: نمط السند الفردي للحل، ونمط سجل السندات المتعددة (100+ سند) للبحث والتصفية
 */

const COMPANY_ACCOUNTS = [
  { id: "cash", name: "النقدية في الخزينة", type: "أصول", normal: "مدين" },
  { id: "bank", name: "البنك الجاري", type: "أصول", normal: "مدين" },
  { id: "ar", name: "العملاء (مؤسسة الشروق)", type: "أصول", normal: "مدين" },
  { id: "inventory", name: "مخزون البضاعة", type: "أصول", normal: "مدين" },
  { id: "equipment", name: "المعدات والأجهزة", type: "أصول", normal: "مدين" },
  { id: "ap", name: "الموردون (شركة الدلتا)", type: "التزامات", normal: "دائن" },
  { id: "capital", name: "رأس المال", type: "حقوق ملكية", normal: "دائن" },
  { id: "sales_rev", name: "إيراد المبيعات", type: "إيرادات", normal: "دائن" },
  { id: "rent_exp", name: "مصروف الإيجار", type: "مصروفات", normal: "مدين" },
  { id: "salary_exp", name: "مصروف الرواتب", type: "مصروفات", normal: "مدين" },
  { id: "util_exp", name: "مصروف المرافق", type: "مصروفات", normal: "مدين" }
];

const ExcelCompanyWorkspaceView = {
  activeCompanyId: null,
  activeSubTab: 'tasks',
  currentTxIndex: 0,
  tasksViewMode: 'card',
  registryFilter: 'all',
  registrySearch: '',
  companyData: {},

  init() {
    try {
      const saved = localStorage.getItem('acc_company_sim_entries');
      if (saved) {
        this.companyData = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load company simulation data', e);
    }
  },

  saveState() {
    try {
      localStorage.setItem('acc_company_sim_entries', JSON.stringify(this.companyData));
    } catch (e) {}
  },

  renderCompaniesHub() {
    this.init();
    let companies = [];
    try {
      const saved = localStorage.getItem('acc_admin_companies');
      if (saved) companies = JSON.parse(saved);
    } catch (e) {}

    if (!companies || companies.length === 0) {
      if (typeof DEFAULT_PLATFORM_COMPANY !== 'undefined') {
        companies = [DEFAULT_PLATFORM_COMPANY];
      }
    }

    return `
      <div class="companies-hub-container">
        <div class="workspace-hero" style="margin-bottom: 24px;">
          <div class="workspace-hero-content" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
            <div style="display:flex; align-items:center; gap: 14px;">
              <div style="width:52px; height:52px; border-radius:14px; background:var(--primary-light); color:var(--primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--primary-border); flex-shrink:0;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 28, strokeWidth: 1.75 }) : ''}
              </div>
              <div>
                <div class="workspace-badge">بوابة بيئات المحاكاة الواقعية للشركات</div>
                <h1 class="workspace-title">اختر الشركة وابدأ المحاكاة فوراً</h1>
                <p style="color:var(--text-secondary); margin-top:4px; font-size:0.92rem;">
                  عند اختيار أي شركة، سيتم تفعيل بيئة العمل المحاسبية ونقلك مباشرة إلى نظام المحاكاة المتكامل (Accounting OS).
                </p>
              </div>
            </div>
            <div>
              <button type="button" onclick="document.getElementById('hub_upload_company_json').click()" class="btn-cta-secondary" style="display:inline-flex; align-items:center; gap:8px; padding:10px 18px; font-weight:700; font-size:0.88rem; cursor:pointer; border-radius:12px; border:1px solid var(--border-subtle); background:var(--surface-card); box-shadow:var(--elevation-1);" title="استيراد وتفعيل شركة جديدة من ملف JSON">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 18 }) : '📂'}
                <span>استيراد شركة من ملف تدريبي (JSON)</span>
              </button>
              <input type="file" id="hub_upload_company_json" accept=".json" style="display:none;" onchange="ExcelCompanyWorkspaceView.handleCompanyUpload(event)">
            </div>
          </div>
        </div>

        ${companies.length === 0 ? `
          <div style="text-align:center; padding: 4rem 1.5rem; background: var(--surface-card); border-radius: 16px; border: 1px dashed var(--border-subtle); max-width: 600px; margin: 0 auto;">
            <div style="color: var(--primary); margin-bottom: 1rem; display:flex; justify-content:center;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 48, strokeWidth: 1.5 }) : ''}
            </div>
            <h2 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">لا توجد شركات مضافة حالياً</h2>
            <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
              يمكن للمسؤول إضافة شركات جديدة ورفع ملفات اليومية والسندات المالية من لوحة تحكم الإدارة (Admin Dashboard).
            </p>
            <button class="btn-cta-secondary" onclick="navigateToScreen('landing')">العودة للرئيسية</button>
          </div>
        ` : `
          <div class="companies-grid">
            ${companies.map(comp => `
              <div class="company-card" style="cursor:pointer; display:flex; flex-direction:column; justify-content:space-between;" onclick="ExcelCompanyWorkspaceView.enterCompanySimulator('${comp.id}')">
                <div>
                  <div class="company-card-header">
                    <div class="company-icon-box" style="display:flex; align-items:center; justify-content:center; color:var(--primary);">
                      ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 24, strokeWidth: 1.75 }) : ''}
                    </div>
                    <div>
                      <h3 class="company-name">${comp.name}</h3>
                      <span class="company-sector-badge">${comp.sector || comp.badge || 'قطاع تجاري'}</span>
                    </div>
                  </div>
                  <p class="company-desc">${comp.description || 'محاكاة عملية متكاملة لقيود اليومية ودفتر الأستاذ والقوائم المالية.'}</p>
                  <div class="company-stats-strip">
                    <span>الدور: <strong>${comp.role || 'محاسب مالي'}</strong></span>
                    <span>العمليات: <strong>${(comp.transactions || []).length} مستند</strong></span>
                  </div>
                </div>
                <button class="btn-workspace-action btn-workspace-primary" style="width:100%; justify-content:center; gap:8px; margin-top:12px; font-size:0.95rem; min-height:44px;">
                  <span style="display:inline-flex; align-items:center; gap:6px;">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 16 }) : ''}
                    دخول بيئة المحاكاة مباشرة
                  </span>
                </button>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  },

  enterCompanySimulator(companyId) {
    let companies = [];
    try {
      const saved = localStorage.getItem('acc_admin_companies');
      if (saved) companies = JSON.parse(saved);
    } catch(e) {}

    let comp = (companies && companies.find(c => c.id === companyId));
    if (!comp && typeof DEFAULT_ADMIN_COMPANIES !== 'undefined') {
      comp = DEFAULT_ADMIN_COMPANIES.find(c => c.id === companyId);
    }
    if (!comp && typeof DEFAULT_PLATFORM_COMPANY !== 'undefined') {
      if (!companyId || companyId === DEFAULT_PLATFORM_COMPANY.id || companies.length === 0) {
        comp = DEFAULT_PLATFORM_COMPANY;
      }
    }
    if (!comp) {
      comp = (typeof DEFAULT_PLATFORM_COMPANY !== 'undefined') ? DEFAULT_PLATFORM_COMPANY : {
        id: companyId || 'comp-al-noor',
        name: 'شركة النور للأجهزة والخدمات',
        sector: 'تجارة الاجهزه (خدمي وتوزيع)',
        role: 'محاسب عام',
        transactions: []
      };
    }

    if (typeof SimulationBridge !== 'undefined') {
      SimulationBridge.launchCompanyInSimulator(comp);
    } else {
      window.location.href = 'simulation/simulation/dashboard/index.html';
    }
  },

  renderCompanyWorkspace() {
    return this.renderCompaniesHub();
  },

  render(companyId = 'tech-oasis') {
    return this.renderCompaniesHub();
  },

  switchTab(tabKey) {
    this.activeSubTab = tabKey;
    const container = document.querySelector('.companies-hub-container');
    if (container && container.parentElement) {
      container.parentElement.innerHTML = this.render(this.activeCompanyId);
    }
  },

  setViewMode(mode) {
    this.tasksViewMode = mode;
    this.refreshContent();
  },

  setRegistryFilter(filter) {
    this.registryFilter = filter;
    this.refreshContent();
  },

  setRegistrySearch(val) {
    this.registrySearch = (val || '').toLowerCase().trim();
    this.refreshContent();
  },

  jumpToTransaction(idx) {
    this.currentTxIndex = parseInt(idx, 10);
    this.tasksViewMode = 'card';
    this.refreshContent();
  },

  refreshContent() {
    const tabEl = document.querySelector('.workspace-tab-content');
    if (tabEl) {
      tabEl.innerHTML = this.renderActiveTab();
    }
  },

  renderActiveTab() {
    switch (this.activeSubTab) {
      case 'tasks': return this.renderTasksTab();
      case 'journal': return this.renderJournalTab();
      case 'ledger': return this.renderLedgerTab();
      case 'trial': return this.renderTrialBalanceTab();
      case 'statements': return this.renderStatementsTab();
      default: return this.renderTasksTab();
    }
  },

  renderTasksTab() {
    const completedCount = COMPANY_TRANSACTIONS.filter(t => this.companyData[t.id]?.isCompleted).length;
    const progressPct = Math.round((completedCount / COMPANY_TRANSACTIONS.length) * 100);

    return `
      <div class="vouchers-control-panel">
        <div class="vouchers-summary-stats">
          <div class="stat-pill">
            <span>المنجز:</span>
            <strong>${completedCount} من ${COMPANY_TRANSACTIONS.length}</strong>
            <span class="stat-pct">(%${progressPct})</span>
          </div>
        </div>

        <div class="vouchers-view-actions">
          <div class="quick-jump-box">
            <label for="tx-jump-select">انتقال سريع:</label>
            <select id="tx-jump-select" class="voucher-jump-select" onchange="ExcelCompanyWorkspaceView.jumpToTransaction(this.value)">
              ${COMPANY_TRANSACTIONS.map((t, idx) => `
                <option value="${idx}" ${this.currentTxIndex === idx ? 'selected' : ''}>
                  ${this.companyData[t.id]?.isCompleted ? '✓ ' : ''}سند #${t.num}: ${t.title.slice(0, 24)}...
                </option>
              `).join('')}
            </select>
          </div>

          <div class="view-mode-toggle">
            <button class="mode-btn ${this.tasksViewMode === 'card' ? 'active' : ''}" onclick="ExcelCompanyWorkspaceView.setViewMode('card')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 14 }) : ''}
              <span>سند فردي</span>
            </button>
            <button class="mode-btn ${this.tasksViewMode === 'registry' ? 'active' : ''}" onclick="ExcelCompanyWorkspaceView.setViewMode('registry')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 14 }) : ''}
              <span>سجل كافة السندات (100+)</span>
            </button>
          </div>
        </div>
      </div>

      ${this.tasksViewMode === 'card' ? this.renderSingleCardMode() : this.renderRegistryMode()}
    `;
  },

  renderSingleCardMode() {
    const tx = COMPANY_TRANSACTIONS[this.currentTxIndex];
    const userEntry = this.companyData[tx.id] || { debit: '', credit: '', isCompleted: false };

    return `
      <div class="single-voucher-container">
        <div class="voucher-pager-strip">
          <button class="pager-btn" ${this.currentTxIndex === 0 ? 'disabled' : ''} onclick="ExcelCompanyWorkspaceView.jumpToTransaction(${this.currentTxIndex - 1})">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('arrow-right', { size: 14 }) : ''}
            <span>السند السابق</span>
          </button>
          <span class="pager-info">سند رقم ${tx.num} من ${COMPANY_TRANSACTIONS.length}</span>
          <button class="pager-btn" ${this.currentTxIndex === COMPANY_TRANSACTIONS.length - 1 ? 'disabled' : ''} onclick="ExcelCompanyWorkspaceView.jumpToTransaction(${this.currentTxIndex + 1})">
            <span>السند التالي</span>
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('arrow-left', { size: 14 }) : ''}
          </button>
        </div>

        <div class="voucher-sheet-card">
          <div class="sheet-header">
            <div class="sheet-title-group">
              <div class="sheet-badge">مستند قيد محاسبي #${100 + tx.num}</div>
              <h2 class="sheet-title">${tx.title}</h2>
              <div class="sheet-meta">التاريخ المالي: <strong>${tx.date}</strong> | المبلغ: <strong class="amount-val">${tx.amount.toLocaleString()} ج.م</strong></div>
            </div>
            <div class="sheet-status-badge ${userEntry.isCompleted ? 'status-posted' : 'status-pending'}">
              ${userEntry.isCompleted ? 'تم الترحيل للدفاتر ✓' : 'بانتظار التوجيه المحاسبي'}
            </div>
          </div>

          <div class="sheet-desc-box">
            <div class="desc-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('info', { size: 16 }) : ''}</div>
            <div class="desc-text">${tx.desc}</div>
          </div>

          <div class="voucher-inputs-section">
            <h3 class="inputs-heading">توجيه القيد المزدوج:</h3>
            
            <div class="inputs-grid-dual">
              <div class="entry-col col-debit">
                <label class="entry-label-badge badge-debit">الطرف المدين (من حـ/)</label>
                <select id="sel-debit-${tx.id}" class="account-select" onchange="ExcelCompanyWorkspaceView.handleAccountSelect('${tx.id}', 'debit', this.value)">
                  <option value="">-- اختر الحساب المدين --</option>
                  ${COMPANY_ACCOUNTS.map(acc => `
                    <option value="${acc.id}" ${userEntry.debit === acc.id ? 'selected' : ''}>${acc.name} [${acc.type}]</option>
                  `).join('')}
                </select>
                <div class="amount-read-badge">المبلغ المدين: <strong>${tx.amount.toLocaleString()} ج.م</strong></div>
              </div>

              <div class="entry-col col-credit">
                <label class="entry-label-badge badge-credit">الطرف الدائن (إلى حـ/)</label>
                <select id="sel-credit-${tx.id}" class="account-select" onchange="ExcelCompanyWorkspaceView.handleAccountSelect('${tx.id}', 'credit', this.value)">
                  <option value="">-- اختر الحساب الدائن --</option>
                  ${COMPANY_ACCOUNTS.map(acc => `
                    <option value="${acc.id}" ${userEntry.credit === acc.id ? 'selected' : ''}>${acc.name} [${acc.type}]</option>
                  `).join('')}
                </select>
                <div class="amount-read-badge">المبلغ الدائن: <strong>${tx.amount.toLocaleString()} ج.م</strong></div>
              </div>
            </div>

            <div class="voucher-action-footer">
              <button class="btn-post-voucher" onclick="ExcelCompanyWorkspaceView.submitVoucher('${tx.id}')">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('check', { size: 16 }) : ''}
                <span>حفظ وترحيل السند إلى الدفاتر</span>
              </button>
            </div>

            <div id="feedback-box-${tx.id}" class="voucher-feedback-box" style="display: ${userEntry.isCompleted ? 'block' : 'none'};">
              ${userEntry.isCompleted ? `
                <div class="feedback-success">
                  <strong>تم قيد وترحيل العملية بنجاح! ✓</strong>
                  <p>${tx.explanation}</p>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  renderRegistryMode() {
    let list = [...COMPANY_TRANSACTIONS];

    if (this.registryFilter === 'pending') {
      list = list.filter(t => !this.companyData[t.id]?.isCompleted);
    } else if (this.registryFilter === 'completed') {
      list = list.filter(t => this.companyData[t.id]?.isCompleted);
    }

    if (this.registrySearch) {
      list = list.filter(t => 
        t.title.toLowerCase().includes(this.registrySearch) ||
        t.desc.toLowerCase().includes(this.registrySearch) ||
        t.amount.toString().includes(this.registrySearch)
      );
    }

    return `
      <div class="vouchers-registry-card">
        <div class="registry-search-row">
          <div class="registry-filters-bar">
            <button class="reg-filter-btn ${this.registryFilter === 'all' ? 'active' : ''}" onclick="ExcelCompanyWorkspaceView.setRegistryFilter('all')">
              الكل (${COMPANY_TRANSACTIONS.length})
            </button>
            <button class="reg-filter-btn ${this.registryFilter === 'pending' ? 'active' : ''}" onclick="ExcelCompanyWorkspaceView.setRegistryFilter('pending')">
              ⏳ قيد الانتظار (${COMPANY_TRANSACTIONS.filter(t => !this.companyData[t.id]?.isCompleted).length})
            </button>
            <button class="reg-filter-btn ${this.registryFilter === 'completed' ? 'active' : ''}" onclick="ExcelCompanyWorkspaceView.setRegistryFilter('completed')">
              ✓ تم الترحيل (${COMPANY_TRANSACTIONS.filter(t => this.companyData[t.id]?.isCompleted).length})
            </button>
          </div>

          <input 
            type="text" 
            class="registry-search-input" 
            placeholder="بحث برقم السند أو الوصف أو المبلغ..." 
            value="${this.registrySearch}"
            oninput="ExcelCompanyWorkspaceView.setRegistrySearch(this.value)"
          />
        </div>

        <div class="registry-list-items">
          ${list.length === 0 ? `
            <div style="padding: 32px; text-align: center; color: var(--text-muted);">
              لا توجد سندات مطابقة لمعايير البحث الحالية.
            </div>
          ` : list.map((t) => {
            const isDone = this.companyData[t.id]?.isCompleted;
            const originalIndex = COMPANY_TRANSACTIONS.findIndex(x => x.id === t.id);
            return `
              <div class="registry-item" onclick="ExcelCompanyWorkspaceView.jumpToTransaction(${originalIndex})">
                <div class="registry-item-main">
                  <div style="display:flex; align-items:center; gap: 8px;">
                    <span class="badge-idx">#${t.num}</span>
                    <h4 class="registry-item-title">${t.title}</h4>
                  </div>
                  <div class="registry-item-meta">
                    <span>${t.date}</span>
                    <span>•</span>
                    <span style="font-weight:700; color:var(--primary);">${t.amount.toLocaleString()} ج.م</span>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap: 12px; margin-top: 6px;">
                  <span class="sheet-status-badge ${isDone ? 'status-posted' : 'status-pending'}">
                    ${isDone ? 'مرحل ✓' : 'قيد الحل'}
                  </span>
                  <button class="btn-open-tx">حل السند</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  handleAccountSelect(txId, type, val) {
    if (!this.companyData[txId]) {
      this.companyData[txId] = { debit: '', credit: '', isCompleted: false };
    }
    this.companyData[txId][type] = val;
    this.saveState();
  },

  submitVoucher(txId) {
    const tx = COMPANY_TRANSACTIONS.find(t => t.id === txId);
    if (!tx) return;

    const debitSel = document.getElementById(`sel-debit-${txId}`);
    const creditSel = document.getElementById(`sel-credit-${txId}`);
    const fbBox = document.getElementById(`feedback-box-${txId}`);

    const debitVal = debitSel?.value || this.companyData[txId]?.debit;
    const creditVal = creditSel?.value || this.companyData[txId]?.credit;

    if (!debitVal || !creditVal) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى اختيار كل من الحساب المدين والحساب الدائن أولاً قبل الترحيل.', 'error');
      else alert('يرجى اختيار كل من الحساب المدين والحساب الدائن أولاً قبل الترحيل.');
      return;
    }

    if (debitVal === creditVal) {
      if (typeof AccModal !== 'undefined') AccModal.toast('لا يمكن أن يكون الحساب المدين هو نفسه الحساب الدائن في القيد المزدوج!', 'error');
      else alert('لا يمكن أن يكون الحساب المدين هو نفسه الحساب الدائن في القيد المزدوج!');
      return;
    }

    const isCorrect = (debitVal === tx.correctDebit && creditVal === tx.correctCredit);

    if (isCorrect) {
      this.companyData[txId] = {
        debit: debitVal,
        credit: creditVal,
        isCompleted: true,
        timestamp: new Date().toLocaleTimeString('ar-EG')
      };
      this.saveState();

      if (fbBox) {
        fbBox.style.display = 'block';
        fbBox.innerHTML = `
          <div class="feedback-success">
            <strong>تم قيد وترحيل العملية بنجاح! ✓</strong>
            <p>${tx.explanation}</p>
          </div>
        `;
      }
      
      setTimeout(() => {
        if (this.currentTxIndex < COMPANY_TRANSACTIONS.length - 1) {
          this.currentTxIndex++;
          this.refreshContent();
        } else {
          if (typeof AccModal !== 'undefined') {
            AccModal.alert({
              title: 'مبارك إتمام الدورة المحاسبية!',
              message: 'لقد أتممت توجيه جميع سندات الدورة المحاسبية بنجاح وتم ترحيل كافة العمليات لدفاتر الشركة.',
              icon: 'trophy',
              buttonText: 'رائع وممتاز'
            });
          } else {
            alert('مبارك! لقد أتممت توجيه جميع سندات الدورة المحاسبية بنجاح.');
          }
          this.refreshContent();
        }
      }, 1300);

    } else {
      if (fbBox) {
        fbBox.style.display = 'block';
        fbBox.innerHTML = `
          <div class="feedback-error">
            <strong>التوجيه المحاسبي غير سليم!</strong>
            <p>تأكد من طبيعة الحسابات المعنية (أصول، التزامات، إيرادات، مصروفات) وقاعدة الزيادة والنقصان، ثم حاول مجدداً.</p>
          </div>
        `;
      }
    }
  },

  checkAllEntries() {
    let completed = 0;
    COMPANY_TRANSACTIONS.forEach(tx => {
      if (this.companyData[tx.id]?.isCompleted) completed++;
    });
    const msg = `تم ترحيل ${completed} سندات صحيحة من إجمالي ${COMPANY_TRANSACTIONS.length} سند.\nالمتبقي: ${COMPANY_TRANSACTIONS.length - completed} سندات.`;
    if (typeof AccModal !== 'undefined') {
      AccModal.alert({
        title: 'تقرير التدقيق العام',
        message: msg,
        icon: 'chart-bar',
        buttonText: 'إغلاق'
      });
    } else {
      alert(`تقرير التدقيق العام:\n${msg}`);
    }
  },

  openInSimulator() {
    const currentComp = {
      id: this.activeCompanyId || 'tech-oasis',
      name: "شركة واحة التقنية للتجارة والتوزيع",
      sector: "تجارة عامة وتوزيع",
      role: "محاسب مالي تنفيذي",
      month: "السنة المالية 2026",
      transactions: COMPANY_TRANSACTIONS
    };
    if (typeof SimulationBridge !== 'undefined') {
      SimulationBridge.launchCompanyInSimulator(currentComp);
    } else {
      window.location.href = 'simulation/simulation/dashboard/index.html';
    }
  },

  resetAll() {
    if (confirm('هل أنت متأكد من رغبتك في تصفير جميع إدخالات السندات والدفاتر؟')) {
      this.companyData = {};
      this.saveState();
      this.refreshContent();
    }
  },

  renderJournalTab() {
    const completedTxs = COMPANY_TRANSACTIONS.filter(t => this.companyData[t.id]?.isCompleted);

    return `
      <div class="journal-sheet-container">
        <div class="sheet-intro-card">
          <h3 style="display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 20 }) : ''}
            <span>دفتر اليومية العامة (General Journal)</span>
          </h3>
          <p>يتم ترحيل كافة السندات المقبولة آلياً إلى دفتر اليومية طبقاً للمعيار المحاسبي بقيد مزدوج متوازن.</p>
        </div>

        <div class="table-scroll-container">
          <table class="excel-table">
            <thead>
              <tr>
                <th style="width: 60px;">قيد #</th>
                <th style="width: 90px;">التاريخ</th>
                <th style="width: 100px;">مدين (ج.م)</th>
                <th style="width: 100px;">دائن (ج.م)</th>
                <th>البيان وشرح القيد المحاسبي</th>
              </tr>
            </thead>
            <tbody>
              ${completedTxs.length === 0 ? `
                <tr>
                  <td colspan="5" style="text-align:center; padding: 28px; color: var(--text-muted);">
                    لا توجد قيود مرحلة حتى الآن. قم بحل وترحيل السندات أولاً من تبويب 'سندات العمليات'.
                  </td>
                </tr>
              ` : completedTxs.map(t => {
                const debitAcc = COMPANY_ACCOUNTS.find(a => a.id === t.correctDebit)?.name || t.correctDebit;
                const creditAcc = COMPANY_ACCOUNTS.find(a => a.id === t.correctCredit)?.name || t.correctCredit;
                return `
                  <tr class="journal-row-debit">
                    <td rowspan="2" style="vertical-align:middle; font-weight:bold; background:var(--bg-secondary);">${t.num}</td>
                    <td rowspan="2" style="vertical-align:middle;">${t.date}</td>
                    <td class="cell-amount-debit">${t.amount.toLocaleString()}</td>
                    <td>-</td>
                    <td class="cell-acc-debit">من حـ/ ${debitAcc}</td>
                  </tr>
                  <tr class="journal-row-credit">
                    <td>-</td>
                    <td class="cell-amount-credit">${t.amount.toLocaleString()}</td>
                    <td class="cell-acc-credit">إلى حـ/ ${creditAcc}</td>
                  </tr>
                  <tr class="journal-row-memo">
                    <td colspan="2"></td>
                    <td colspan="3" class="cell-memo">(إثبات ${t.title} - مستند #${100 + t.num})</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  renderLedgerTab() {
    const ledger = {};
    COMPANY_ACCOUNTS.forEach(acc => {
      ledger[acc.id] = { account: acc, debits: [], credits: [], totalDebit: 0, totalCredit: 0 };
    });

    COMPANY_TRANSACTIONS.forEach(t => {
      if (this.companyData[t.id]?.isCompleted) {
        ledger[t.correctDebit].debits.push({ tx: t, amount: t.amount });
        ledger[t.correctDebit].totalDebit += t.amount;

        ledger[t.correctCredit].credits.push({ tx: t, amount: t.amount });
        ledger[t.correctCredit].totalCredit += t.amount;
      }
    });

    return `
      <div class="ledger-sheet-container">
        <div class="sheet-intro-card">
          <h3 style="display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('scales', { size: 20 }) : ''}
            <span>دفتر الأستاذ العام (T-Accounts Ledger)</span>
          </h3>
          <p>ترصيد حركة كل حساب على حدة لمعرفة صافي الرصيد المنقول لميزان المراجعة.</p>
        </div>

        <div class="t-accounts-grid">
          ${COMPANY_ACCOUNTS.map(acc => {
            const data = ledger[acc.id];
            const netBalance = data.totalDebit - data.totalCredit;
            const hasActivity = data.debits.length > 0 || data.credits.length > 0;

            return `
              <div class="t-account-card ${hasActivity ? 'active-t-card' : ''}">
                <div class="t-card-header">
                  <h4 class="t-acc-title">حـ/ ${acc.name}</h4>
                  <span class="t-acc-type">${acc.type} (طبيعته: ${acc.normal})</span>
                </div>

                <div class="t-account-table-wrap">
                  <div class="t-side t-side-debit">
                    <div class="t-side-head">منه (مدين)</div>
                    <div class="t-side-entries">
                      ${data.debits.length === 0 ? '<div class="empty-entry">-</div>' : data.debits.map(d => `
                        <div class="t-entry-row">
                          <span class="t-ref">س#${d.tx.num}</span>
                          <span class="t-val">${d.amount.toLocaleString()}</span>
                        </div>
                      `).join('')}
                    </div>
                    <div class="t-side-total">مجموع المدين: ${data.totalDebit.toLocaleString()}</div>
                  </div>

                  <div class="t-side t-side-credit">
                    <div class="t-side-head">له (دائن)</div>
                    <div class="t-side-entries">
                      ${data.credits.length === 0 ? '<div class="empty-entry">-</div>' : data.credits.map(c => `
                        <div class="t-entry-row">
                          <span class="t-ref">س#${c.tx.num}</span>
                          <span class="t-val">${c.amount.toLocaleString()}</span>
                        </div>
                      `).join('')}
                    </div>
                    <div class="t-side-total">مجموع الدائن: ${data.totalCredit.toLocaleString()}</div>
                  </div>
                </div>

                <div class="t-balance-bar">
                  <span>الرصيد الصافي:</span>
                  <strong class="${netBalance >= 0 ? 'color-debit' : 'color-credit'}">
                    ${Math.abs(netBalance).toLocaleString()} ج.م (${netBalance >= 0 ? 'رصيد مدين' : 'رصيد دائن'})
                  </strong>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  renderTrialBalanceTab() {
    let grandDebit = 0;
    let grandCredit = 0;

    const rows = COMPANY_ACCOUNTS.map(acc => {
      let deb = 0;
      let crd = 0;
      COMPANY_TRANSACTIONS.forEach(t => {
        if (this.companyData[t.id]?.isCompleted) {
          if (t.correctDebit === acc.id) deb += t.amount;
          if (t.correctCredit === acc.id) crd += t.amount;
        }
      });

      const net = deb - crd;
      let finalDeb = 0;
      let finalCrd = 0;
      if (net > 0) finalDeb = net;
      if (net < 0) finalCrd = Math.abs(net);

      grandDebit += finalDeb;
      grandCredit += finalCrd;

      return { acc, deb: finalDeb, crd: finalCrd };
    });

    const isBalanced = grandDebit === grandCredit && grandDebit > 0;

    return `
      <div class="trial-sheet-container">
        <div class="sheet-intro-card">
          <h3 style="display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 20 }) : ''}
            <span>ميزان المراجعة بالأرصدة (Trial Balance)</span>
          </h3>
          <p>التأكد من التوازن المحاسبي الكامل لجميع الحسابات قبل إعداد القوائم الختامية.</p>
        </div>

        <div class="table-scroll-container">
          <table class="excel-table">
            <thead>
              <tr>
                <th>رقم الحساب</th>
                <th>اسم الحساب</th>
                <th>طبيعة الحساب</th>
                <th style="width: 130px;">الأرصدة المدينة</th>
                <th style="width: 130px;">الأرصدة الدائنة</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((r, i) => `
                <tr>
                  <td>10${i + 1}</td>
                  <td style="font-weight:700;">${r.acc.name}</td>
                  <td>${r.acc.type}</td>
                  <td class="cell-amount-debit">${r.deb ? r.deb.toLocaleString() : '-'}</td>
                  <td class="cell-amount-credit">${r.crd ? r.crd.toLocaleString() : '-'}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="trial-total-row">
                <td colspan="3" style="font-weight:800; font-size:1.05rem;">المجموع الإجمالي العام:</td>
                <td class="cell-amount-debit" style="font-size:1.1rem; font-weight:800;">${grandDebit.toLocaleString()} ج.م</td>
                <td class="cell-amount-credit" style="font-size:1.1rem; font-weight:800;">${grandCredit.toLocaleString()} ج.م</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div class="balance-status-card ${isBalanced ? 'status-balanced' : 'status-unbalanced'}">
          <div style="color: ${isBalanced ? '#10b981' : '#ef4444'}; display:flex; align-items:center;">
            ${isBalanced 
              ? (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('check-circle', { size: 28 }) : '✓') 
              : (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('warning', { size: 28 }) : '!')}
          </div>
          <div>
            <strong>${isBalanced ? 'ميزان المراجعة متوازن تماماً وبحالة ممتازة!' : 'الميزان غير متوازن أو لم تكتمل كافة السندات بعد.'}</strong>
            <p>${isBalanced ? 'كافة العمليات متطابقة رياضياً ومحاسبياً ومؤهلة لإنشاء قائمة الدخل والمركز المالي.' : 'يرجى مراجعة ترحيل كافة السندات في تبويب السندات.'}</p>
          </div>
        </div>
      </div>
    `;
  },

  renderStatementsTab() {
    let salesRev = 0;
    let rentExp = 0;
    let salExp = 0;
    let utilExp = 0;

    COMPANY_TRANSACTIONS.forEach(t => {
      if (this.companyData[t.id]?.isCompleted) {
        if (t.correctCredit === 'sales_rev') salesRev += t.amount;
        if (t.correctDebit === 'rent_exp') rentExp += t.amount;
        if (t.correctDebit === 'salary_exp') salExp += t.amount;
        if (t.correctDebit === 'util_exp') utilExp += t.amount;
      }
    });

    const totalExpenses = rentExp + salExp + utilExp;
    const netProfit = salesRev - totalExpenses;

    return `
      <div class="statements-container">
        <div class="sheet-intro-card">
          <h3 style="display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 20 }) : ''}
            <span>القوائم المالية الختامية للشركة (Financial Statements)</span>
          </h3>
          <p>تنعكس القيود المرحلة فورياً في قياس الأداء التشغيلي والأرباح المحققة.</p>
        </div>

        <div class="statements-grid">
          <div class="statement-box">
            <div class="statement-head">
              <h4>قائمة الدخل عن الفترة المالية</h4>
              <span>Income Statement</span>
            </div>
            
            <div class="statement-body">
              <div class="stmt-row header-row">
                <span>الإيرادات:</span>
                <span></span>
              </div>
              <div class="stmt-row ind-row">
                <span>إيراد المبيعات</span>
                <span class="stmt-num">${salesRev.toLocaleString()} ج.م</span>
              </div>
              <div class="stmt-row subtotal-row">
                <span>إجمالي الإيرادات:</span>
                <span class="stmt-num">${salesRev.toLocaleString()} ج.م</span>
              </div>

              <div class="stmt-row header-row" style="margin-top: 14px;">
                <span>المصروفات التشغيلية:</span>
                <span></span>
              </div>
              <div class="stmt-row ind-row">
                <span>مصروف الإيجار</span>
                <span class="stmt-num">${rentExp.toLocaleString()} ج.م</span>
              </div>
              <div class="stmt-row ind-row">
                <span>مصروف الرواتب</span>
                <span class="stmt-num">${salExp.toLocaleString()} ج.م</span>
              </div>
              <div class="stmt-row ind-row">
                <span>مصروف المرافق والكهرباء</span>
                <span class="stmt-num">${utilExp.toLocaleString()} ج.م</span>
              </div>
              <div class="stmt-row subtotal-row">
                <span>إجمالي المصروفات:</span>
                <span class="stmt-num">${totalExpenses.toLocaleString()} ج.م</span>
              </div>

              <div class="stmt-row grand-total-row ${netProfit >= 0 ? 'profit' : 'loss'}">
                <span>صافي الأرباح (الخسائر):</span>
                <span class="stmt-num">${netProfit.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async handleCompanyUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const json = JSON.parse(text);

        let parseFn = (typeof ExcelAdminDashboard !== 'undefined' && ExcelAdminDashboard.parseTrainingPlatformJson)
          || window.parseTrainingPlatformJson;

        let comp = null;
        if (parseFn) {
          comp = parseFn(json);
        } else if (json.metadata && json.questions) {
          const meta = json.metadata || {};
          const companyMeta = meta.company || {};
          const rawName = (companyMeta.name || json.name || 'شركة جديدة').trim();
          const compName = rawName.startsWith('شركة') ? rawName : `شركة ${rawName}`;
          const activity = (companyMeta.activity || 'الملابس').trim();
          comp = {
            id: `comp-${Date.now()}`,
            name: compName,
            sector: `تجارة ${activity} (${companyMeta.type || 'تجاري'})`,
            badge: 'بيئة أعمال متكاملة',
            icon: 'lightbulb',
            role: meta.jobTrackNameAr || 'محاسب مالي عام',
            capital: Number(companyMeta.capital) || 2000000,
            description: `بيئة محاكاة محاسبية لـ ${compName} بـ ${json.questions.length} معاملة وسند مالي.`,
            month: 'السنة المالية 2026',
            transactions: json.questions.map((q, idx) => ({
              id: q.id || `Q-${idx + 1}`,
              num: idx + 1,
              title: q.type || 'معاملة مالية',
              desc: q.problemText || q.type || '',
              amount: q.correctAnswer?.totalDebit || 0,
              lines: q.correctAnswer?.lines || []
            }))
          };
        } else if (json.name && (json.transactions || json.sector)) {
          comp = json;
        }

        if (!comp) {
          throw new Error('لم يتم التعرف على بنية ملف الشركة.');
        }

        // حفظ في acc_admin_companies
        let companies = [];
        try {
          const raw = localStorage.getItem('acc_admin_companies');
          if (raw) companies = JSON.parse(raw);
        } catch(err) {}

        const existingIdx = companies.findIndex(c => c.id === comp.id || c.name === comp.name);
        if (existingIdx >= 0) {
          companies[existingIdx] = comp;
        } else {
          companies.unshift(comp);
        }
        localStorage.setItem('acc_admin_companies', JSON.stringify(companies));

        // تفعيل الشركة في بيئة المحاكي
        if (typeof SimulationBridge !== 'undefined') {
          SimulationBridge.setSimulatorActiveCompany(comp);
        } else {
          localStorage.setItem('sim_company_profile', JSON.stringify({
            id: comp.id,
            name: comp.name,
            sector: comp.sector,
            role: comp.role || 'محاسب مالي',
            year: comp.month || 'السنة المالية 2026'
          }));
        }

        if (typeof AccModal !== 'undefined') {
          AccModal.toast(`تم استيراد ${comp.name} بنجاح (${comp.transactions.length} عملية)! جاري الدخول لبيئة المحاكاة...`, 'success');
        } else {
          alert(`تم استيراد ${comp.name} بنجاح!`);
        }

        // إعادة تحميل العرض أو التوجه للمحاكي
        setTimeout(() => {
          this.enterCompanySimulator(comp.id);
        }, 600);

      } catch (err) {
        console.error('[CompanyUpload]', err);
        if (typeof AccModal !== 'undefined') {
          AccModal.toast('فشل استيراد ملف الشركة: ' + (err.message || 'خطأ في التنسيق'), 'error');
        } else {
          alert('فشل استيراد ملف الشركة: ' + err.message);
        }
      } finally {
        event.target.value = '';
      }
    };
    reader.readAsText(file, 'UTF-8');
  }
};

window.ExcelCompanyWorkspaceView = ExcelCompanyWorkspaceView;

const COMPANY_TRANSACTIONS = [
  {
    id: "sim-1",
    num: 1,
    title: "عملية رقم 101: شراء بضاعة للمستودع نقداً",
    desc: "تم شراء بضاعة لصالح المستودع الرئيسي بمبلغ 20,000 جنيه، وتم سداد القيمة نقداً من الخزينة بموجب إذن صرف نقدية وفاتورة شراء.",
    amount: 20000,
    date: "02 يناير",
    correctDebit: "inventory",
    correctCredit: "cash",
    explanation: "المخزون أصل زاد بالبضاعة فيكون مديناً (20,000)، والنقدية أصل خرج ونقص فتكون دائنة (20,000)."
  },
  {
    id: "sim-2",
    num: 2,
    title: "عملية رقم 102: توريد بضاعة بالآجل من الموردين",
    desc: "وصلت شحنة بضاعة للمستودع من المورد 'شركة الدلتا' بقيمة 35,000 جنيه بموجب فاتورة شراء آجلة على الحساب تستحق بعد 30 يوماً.",
    amount: 35000,
    date: "05 يناير",
    correctDebit: "inventory",
    correctCredit: "ap",
    explanation: "المخزون أصل زاد فيكون مديناً (35,000)، وحساب الموردين التزام دين زاد فيكون دائناً (35,000)."
  },
  {
    id: "sim-3",
    num: 3,
    title: "عملية رقم 103: مبيعات نقدية للفرع",
    desc: "حققت المنشأة مبيعات بضاعة نقدية بمبلغ 28,000 جنيه للجمهور، وتم استلام كامل القيمة نقداً وإيداعها في خزينة الشركة.",
    amount: 28000,
    date: "08 يناير",
    correctDebit: "cash",
    correctCredit: "sales_rev",
    explanation: "النقدية أصل زاد فيكون مديناً (28,000)، وإيراد المبيعات إيراد تحقق وزاد فيكون دائناً (28,000)."
  },
  {
    id: "sim-4",
    num: 4,
    title: "عملية رقم 104: مبيعات آجلة لعميل تجاري",
    desc: "تم إصدار فاتورة بيع بضاعة للعميل 'مؤسسة الشروق' بمبلغ 18,000 جنيه بالآجل على الحساب دون سداد فوري.",
    amount: 18000,
    date: "12 يناير",
    correctDebit: "ar",
    correctCredit: "sales_rev",
    explanation: "العملاء أصل (حق مالي للشركة) زاد فيكون مديناً (18,000)، وإيراد المبيعات زاد فيكون دائناً (18,000)."
  },
  {
    id: "sim-5",
    num: 5,
    title: "عملية رقم 105: تحصيل مستحقات نقدية من العميل",
    desc: "سددت 'مؤسسة الشروق' دفعة نقدية قدرها 10,000 جنيه من حسابها المدين المستحق، وتم توريد المبلغ لخزينة الشركة بإيصال قبض.",
    amount: 10000,
    date: "15 يناير",
    correctDebit: "cash",
    correctCredit: "ar",
    explanation: "النقدية في الخزينة زادت فتكون مدينة (10,000)، ومديونية العميل نقصت فتكون دائنة (10,000)."
  },
  {
    id: "sim-6",
    num: 6,
    title: "عملية رقم 106: سداد دفعة نقدية للمورد",
    desc: "تم سداد دفعة قدرها 15,000 جنيه نقداً من الخزينة للمورد 'شركة الدلتا' تخفيضاً للديون المستحقة بموجب إيصال سداد.",
    amount: 15000,
    date: "18 يناير",
    correctDebit: "ap",
    correctCredit: "cash",
    explanation: "الموردون التزام ونقص فيكون مديناً (15,000)، والنقدية أصل ونقص فتكون دائنة (15,000)."
  },
  {
    id: "sim-7",
    num: 7,
    title: "عملية رقم 107: سداد إيجار المقر نقداً",
    desc: "سددت الشركة إيجار المعارض والمقر الإداري البالغ 5,000 جنيه نقداً عن الشهر الحالي بموجب سند صرف.",
    amount: 5000,
    date: "22 يناير",
    correctDebit: "rent_exp",
    correctCredit: "cash",
    explanation: "مصروف الإيجار زاد فيكون مديناً (5,000)، والنقدية أصل نقص فتكون دائنة (5,000)."
  },
  {
    id: "sim-8",
    num: 8,
    title: "عملية رقم 108: صرف رواتب موظفي الشركة",
    desc: "تم اعتماد مسير رواتب الموظفين وصرف مبلغ 12,000 جنيه نقداً من الخزينة لجميع العاملين.",
    amount: 12000,
    date: "25 يناير",
    correctDebit: "salary_exp",
    correctCredit: "cash",
    explanation: "مصروف الرواتب زاد فيكون مديناً (12,000)، والنقدية نقصت فتكون دائنة (12,000)."
  },
  {
    id: "sim-9",
    num: 9,
    title: "عملية رقم 109: شراء رافعة ومعدات للمستودع",
    desc: "تم شراء رافعة ومعدات تحميل للمستودع بمبلغ 40,000 جنيه نقداً لزيادة كفاءة المناولة التشغيلية.",
    amount: 40000,
    date: "28 يناير",
    correctDebit: "equipment",
    correctCredit: "cash",
    explanation: "المعدات أصل رأسمالي زاد فيكون مديناً (40,000)، والنقدية أصل نقص فتكون دائنة (40,000)."
  },
  {
    id: "sim-10",
    num: 10,
    title: "عملية رقم 110: سداد فواتير الكهرباء والمرافق",
    desc: "سددت الشركة فواتير الكهرباء والمياه والإنترنت البالغة 3,500 جنيه نقداً بموجب إيصالات السداد الحكومية.",
    amount: 3500,
    date: "30 يناير",
    correctDebit: "util_exp",
    correctCredit: "cash",
    explanation: "مصروف المرافق مدين (3,500)، والنقدية في الخزينة دائنة (3,500)."
  }
];
