/**
 * simulation-bridge.js — جسر الربط البرمجي بين منصة Accountera وبيئة المحاكاة
 */

const SimulationBridge = {
  // خريطة تحويل حسابات المنصة السريعة إلى أكواد الدليل المحاسبي الموحد للبيئة (COA)
  accountCodeMap: {
    'cash': { code: '1101', name: 'Cash (نقدية بالصندوق)', type: 'Asset' },
    'bank': { code: '1102', name: 'Bank (بنك)', type: 'Asset' },
    'ar': { code: '1103', name: 'Accounts Receivable (عملاء)', type: 'Asset' },
    'inventory': { code: '1104', name: 'Inventory (مخزون)', type: 'Asset' },
    'equipment': { code: '1201', name: 'Fixed Assets (أصول ثابتة)', type: 'Asset' },
    'ap': { code: '2101', name: 'Accounts Payable (موردون)', type: 'Liability' },
    'vat_in': { code: '1106', name: 'Input VAT (ضريبة مدخلات)', type: 'Asset' },
    'vat_out': { code: '2102', name: 'Output VAT (ضريبة مخرجات)', type: 'Liability' },
    'capital': { code: '3101', name: 'Capital (رأس المال)', type: 'Equity' },
    'sales_rev': { code: '4101', name: 'Sales Revenue (إيرادات مبيعات)', type: 'Revenue' },
    'cogs': { code: '5101', name: 'Cost of Goods Sold (تكلفة البضاعة المباعة)', type: 'Expense' },
    'salary_exp': { code: '5201', name: 'Salaries Expense (مصروف رواتب)', type: 'Expense' },
    'rent_exp': { code: '5202', name: 'Rent Expense (مصروف إيجار)', type: 'Expense' },
    'util_exp': { code: '5203', name: 'Utilities Expense (مصروف مرافق)', type: 'Expense' }
  },

  // خريطة كود الحساب المباشر من COA المولد
  coaMap: {
    '1101': { code: '1101', name: 'Cash (نقدية بالصندوق)', type: 'Asset' },
    '1102': { code: '1102', name: 'Bank (بنك)', type: 'Asset' },
    '1103': { code: '1103', name: 'Accounts Receivable (عملاء)', type: 'Asset' },
    '1104': { code: '1104', name: 'Inventory (مخزون)', type: 'Asset' },
    '1201': { code: '1201', name: 'Fixed Assets (أصول ثابتة)', type: 'Asset' },
    '2101': { code: '2101', name: 'Accounts Payable (موردون)', type: 'Liability' },
    '2102': { code: '2102', name: 'Output VAT (ضريبة مخرجات)', type: 'Liability' },
    '1106': { code: '1106', name: 'Input VAT (ضريبة مدخلات)', type: 'Asset' },
    '3101': { code: '3101', name: 'Capital (رأس المال)', type: 'Equity' },
    '3102': { code: '3102', name: 'Retained Earnings (أرباح محتجزة)', type: 'Equity' },
    '4101': { code: '4101', name: 'Sales Revenue (إيرادات مبيعات)', type: 'Revenue' },
    '5101': { code: '5101', name: 'Cost of Goods Sold (تكلفة البضاعة المباعة)', type: 'Expense' },
    '5201': { code: '5201', name: 'Salaries Expense (مصروف رواتب)', type: 'Expense' },
    '5202': { code: '5202', name: 'Rent Expense (مصروف إيجار)', type: 'Expense' },
    '5203': { code: '5203', name: 'Utilities Expense (مصروف مرافق)', type: 'Expense' },
    '5204': { code: '5204', name: 'Depreciation Expense (مصروف إهلاك)', type: 'Expense' }
  },

  // تحليل وقراءة ملف journal.csv المخرج من المولد مباشرة
  parseGeneratorJournalCsv(csvText) {
    const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('sep='));
    if (lines.length <= 1) return [];

    const delimiter = csvText.includes(';') ? ';' : ',';
    const splitRow = (row) => {
      const res = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i++) {
        const c = row[i];
        if (c === '"') { inQuotes = !inQuotes; }
        else if (c === delimiter && !inQuotes) { res.push(cur.trim()); cur = ''; }
        else { cur += c; }
      }
      res.push(cur.trim());
      return res;
    };

    const header = splitRow(lines[0]);
    const txMap = new Map();

    for (let i = 1; i < lines.length; i++) {
      const cols = splitRow(lines[i]);
      if (cols.length < 10) continue;

      const txId = cols[0] || `TRX-${String(i).padStart(5, '0')}`;
      const jeId = cols[1] || `JE-${String(i).padStart(6, '0')}`;
      const date = cols[2] || '2026-01-15';
      const type = cols[3] || 'General';
      const ref = cols[4] || `INV-${1000 + i}`;
      const lineNum = parseInt(cols[5], 10) || 1;
      const acctCode = cols[6] || '1101';
      const acctName = cols[7] || (this.coaMap[acctCode] ? this.coaMap[acctCode].name : 'حساب عام');
      const acctType = cols[8] || (this.coaMap[acctCode] ? this.coaMap[acctCode].type : 'Asset');
      const desc = cols[9] || 'حركة مالية';
      const dr = parseFloat((cols[10] || '0').replace(/[^0-9.-]+/g, '')) || 0;
      const cr = parseFloat((cols[11] || '0').replace(/[^0-9.-]+/g, '')) || 0;
      const diff = cols[13] || 'Medium';

      if (!txMap.has(txId)) {
        txMap.set(txId, {
          id: txId,
          txId: txId,
          jeId: jeId,
          ref: ref,
          date: date,
          type: type,
          difficulty: diff,
          desc: desc,
          lines: []
        });
      }

      txMap.get(txId).lines.push({
        lineNum: lineNum,
        accountCode: acctCode,
        accountName: acctName,
        acctType: acctType,
        debit: dr,
        credit: cr,
        description: desc
      });
    }

    return Array.from(txMap.values());
  },

  // تحويل عمليات وسندات أي شركة إلى الصيغة القياسية لبيئة المحاكي
  transformTransactionsToSim(transactions = []) {
    return transactions.map((tx, idx) => {
      // إذا كانت العملية جاهزة مسبقاً وتتضمن lines مباشرة من المولد
      if (tx.lines && Array.isArray(tx.lines) && tx.lines.length > 0) {
        return {
          id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
          txId: tx.txId || tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
          jeId: tx.jeId || `JE-${String(idx + 1).padStart(6, '0')}`,
          ref: tx.ref || `INV-${1000 + (tx.num || idx + 1)}`,
          date: tx.date || "2026-01-15",
          type: tx.type || this.detectTxType(tx),
          title: tx.title || tx.desc || "معاملة تجارية",
          difficulty: tx.difficulty || "Medium",
          desc: tx.desc || tx.title || "معاملة تجارية",
          hints: tx.hints || [],
          solutionSteps: tx.solutionSteps || [],
          accountingRule: tx.accountingRule || '',
          categoryAr: tx.categoryAr || '',
          lines: tx.lines
        };
      }

      const drKey = tx.dr || tx.correctDebit || 'cash';
      const crKey = tx.cr || tx.correctCredit || 'sales_rev';
      const drAccount = this.coaMap[drKey] || this.accountCodeMap[drKey] || { code: '1101', name: 'Cash (نقدية بالصندوق)', type: 'Asset' };
      const crAccount = this.coaMap[crKey] || this.accountCodeMap[crKey] || { code: '4101', name: 'Sales Revenue (إيرادات مبيعات)', type: 'Revenue' };
      const amount = Number(tx.amount) || 0;

      return {
        id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
        txId: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
        jeId: `JE-${String(idx + 1).padStart(6, '0')}`,
        ref: `INV-${1000 + (tx.num || idx + 1)}`,
        date: tx.date || "2026-01-15",
        type: this.detectTxType(tx),
        difficulty: "Medium",
        desc: tx.desc || tx.title || "معاملة تجارية",
        lines: [
          {
            lineNum: 1,
            accountCode: drAccount.code,
            accountName: drAccount.name,
            acctType: drAccount.type,
            debit: amount,
            credit: 0,
            description: tx.title || tx.desc || ""
          },
          {
            lineNum: 2,
            accountCode: crAccount.code,
            accountName: crAccount.name,
            acctType: crAccount.type,
            debit: 0,
            credit: amount,
            description: tx.title || tx.desc || ""
          }
        ]
      };
    });
  },

  detectTxType(tx) {
    const dr = tx.dr || tx.correctDebit;
    const cr = tx.cr || tx.correctCredit;
    if (cr === 'sales_rev') return dr === 'cash' ? 'Cash Sale' : 'Sale';
    if (dr === 'inventory') return 'Purchase';
    if (dr === 'cash' && cr === 'ar') return 'Collection';
    if (dr === 'ap' && cr === 'cash') return 'Payment';
    if (dr === 'salary_exp') return 'Payroll';
    if (dr === 'rent_exp' || dr === 'util_exp') return 'Expense';
    if (dr === 'equipment') return 'Asset Disposal';
    return 'General';
  },

  setSimulatorActiveCompany(company) {
    if (!company) return;

    // 1. إعداد بروفايل الشركة الكامل في localStorage
    const companyCodes = {
      'company-nile': { code: 'NTL-2026', employees: '45 موظف مسجل', enName: 'Nile Trading & Distribution Co.' },
      'company-amal': { code: 'AML-2026', employees: '28 موظف واستشاري', enName: 'Al-Amal Consulting & Design Co.' },
      'company-ofok': { code: 'OFK-2026', employees: '65 موظف وفني موقع', enName: 'Al-Ofok Contracting & Supply Co.' }
    };
    const meta = companyCodes[company.id] || { 
      code: `${(company.id || 'CMP').toUpperCase().replace('COMPANY-', '')}-2026`,
      employees: '30 موظف مسجل',
      enName: company.name
    };

    const profile = {
      id: company.id,
      name: company.name,
      enName: meta.enName,
      code: meta.code,
      activity: company.sector,
      sector: company.sector,
      badge: company.badge || 'نشاط تجاري',
      employees: meta.employees,
      role: company.role || 'محاسب مالي',
      year: company.month || 'السنة المالية 2026'
    };
    localStorage.setItem('sim_company_profile', JSON.stringify(profile));

    // 2. تحويل السندات وإسنادها لمهام المحاكي
    const simTasks = this.transformTransactionsToSim(company.transactions || []);
    localStorage.setItem('sim_admin_tasks', JSON.stringify(simTasks));

    // 3. محاولة استرجاع التقدم المحفوظ من السحابة إذا وُجد
    if (typeof window !== 'undefined' && window.SimulationService && typeof window.SimulationService.loadProgress === 'function') {
      window.SimulationService.loadProgress(company.id).catch(e => console.warn('[SimulationBridge] Load state error:', e));
    } else {
      ['student_journal', 'student_ledger', 'bank_statement_items'].forEach(k => {
        localStorage.removeItem(k);
      });
    }
  },

  // حفظ تقدم المحاكاة الحالي إلى السحابة
  async saveCurrentSimulation(score = 0, status = 'in_progress') {
    if (typeof window !== 'undefined' && window.SimulationService) {
      try {
        const profile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
        const journal = JSON.parse(localStorage.getItem('student_journal') || '[]');
        const ledger = JSON.parse(localStorage.getItem('student_ledger') || '{}');
        await window.SimulationService.saveProgress(profile.id || 'company-nile', { journal, ledger, profile, score, status });
      } catch (e) {
        console.warn('[SimulationBridge] saveCurrentSimulation error:', e);
      }
    }
  },

  // إرسال وتفعيل شركة معينة داخل بيئة المحاكي فوراً
  launchCompanyInSimulator(company) {
    if (!company) return;
    this.setSimulatorActiveCompany(company);
    // فتح البيئة مباشرة على شاشة دفتر اليومية
    window.location.href = 'simulation/simulation/journal/index.html';
  },

  // جلب نتائج تقدم الطالب في المحاكي وعرضها في لوحة الطالب أو الأدمن
  getSimProgress() {
    try {
      const rawTasks = localStorage.getItem('sim_admin_tasks');
      const rawJournal = localStorage.getItem('student_journal');
      const profile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');

      const tasks = rawTasks ? JSON.parse(rawTasks) : [];
      const journal = rawJournal ? JSON.parse(rawJournal) : [];
      const posted = journal.filter(j => j.status === 'posted');

      return {
        companyName: profile.name || 'شركة النيل للتجارة والتوزيع',
        totalTasks: tasks.length,
        completedTasks: posted.length,
        percent: tasks.length > 0 ? Math.round((posted.length / tasks.length) * 100) : 0,
        isStarted: posted.length > 0
      };
    } catch (e) {
      return { totalTasks: 0, completedTasks: 0, percent: 0, isStarted: false };
    }
  }
};

window.SimulationBridge = SimulationBridge;
