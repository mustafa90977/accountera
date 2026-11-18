/**
 * simulation-bridge.js — جسر الربط البرمجي بين منصة Accountera وبيئة المحاكاة
 */

const SimulationBridge = {
  // خريطة تحويل حسابات المنصة السريعة إلى أكواد الدليل المحاسبي الموحد للبيئة (COA)
  // خريطة تحويل حسابات المنصة السريعة إلى أكواد الدليل المحاسبي الموحد للبيئة (COA)
  // مع توفير ترجمة صريحة بين بيئة المحاكي والدليل المركزي
  accountCodeMap: {
    'cash': { code: '1101', name: 'Cash (نقدية بالصندوق)', type: 'Asset' },
    'bank': { code: '1102', name: 'Bank (بنك)', type: 'Asset' },
    'ar': { code: '1103', name: 'Accounts Receivable (عملاء)', type: 'Asset' },
    'inventory': { code: '1104', name: 'Inventory (مخزون)', type: 'Asset', centralCode: '1105' },
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

  // طبقة تحويل صريحة بين أكواد المحاكي والدليل المركزي
  toCentralCode(simCode) {
    const map = {
      '1104': '1105', // مخزون المحاكي -> مخزون الدليل المركزي
      '1105': '1108'  // مدفوع مقدماً المحاكي -> مدفوع مقدماً الدليل المركزي
    };
    return map[String(simCode)] || String(simCode);
  },

  toSimCode(centralCode) {
    const map = {
      '1105': '1104', // مخزون الدليل المركزي -> مخزون المحاكي
      '1108': '1105'  // مدفوع مقدماً المركزي -> مدفوع مقدماً المحاكي
    };
    return map[String(centralCode)] || String(centralCode);
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
        const totalDebit = tx.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
        const maxDebit = Math.max(...tx.lines.map(l => Number(l.debit) || 0));
        const amount = Number(tx.amount) || maxDebit || totalDebit || 0;
        const txType = tx.type || this.detectTxType(tx);
        const date = tx.date || (tx.docData && tx.docData.date) || "2026-01-15";
        const ref = tx.ref || (tx.docData && tx.docData.ref) || `INV-${1000 + (tx.num || idx + 1)}`;

        const vatLine = tx.lines.find(l => String(l.accountCode) === '1106' || String(l.accountCode) === '2102');
        const vatAmt = vatLine ? (Number(vatLine.debit) || Number(vatLine.credit) || 0) : (Number(tx.docData?.vatAmount) || Number(tx.vatAmount) || 0);
        const subtotal = (tx.docData && tx.docData.subtotal != null)
          ? Number(tx.docData.subtotal)
          : ((amount > vatAmt && vatAmt > 0) ? (amount - vatAmt) : amount);

        return {
          id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
          txId: tx.txId || tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
          jeId: tx.jeId || `JE-${String(idx + 1).padStart(6, '0')}`,
          ref: ref,
          date: date,
          type: txType,
          title: tx.title || tx.desc || "معاملة تجارية",
          difficulty: tx.difficulty || "Medium",
          desc: tx.desc || tx.title || "معاملة تجارية",
          amount: amount,
          docData: tx.docData || {
            totalAmount: amount,
            subtotal: subtotal,
            vatAmount: vatAmt,
            vatRate: vatAmt > 0 ? "14%" : "0%",
            partyName: tx.partyName || "",
            date: date,
            ref: ref
          },
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
      const txType = tx.type || this.detectTxType(tx);
      const date = tx.date || "2026-01-15";
      const ref = tx.ref || `INV-${1000 + (tx.num || idx + 1)}`;

      let partyName = tx.partyName || '';
      if (!partyName) {
        if (txType === 'Purchase' || crKey === 'ap' || crAccount.code === '2101') partyName = 'شركة الدلتا للتوريدات والمستودعات';
        else if (txType === 'Sale' || drKey === 'ar' || drAccount.code === '1103') partyName = 'مؤسسة الشروق التجارية';
      }

      return {
        id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
        txId: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
        jeId: `JE-${String(idx + 1).padStart(6, '0')}`,
        ref: ref,
        date: date,
        type: txType,
        difficulty: tx.difficulty || "Medium",
        desc: tx.desc || tx.title || "معاملة تجارية",
        title: tx.title || tx.desc || "معاملة تجارية",
        amount: amount,
        docData: tx.docData || {
          totalAmount: amount,
          subtotal: amount,
          vatAmount: 0,
          vatRate: "0%",
          partyName: partyName,
          date: date,
          ref: ref
        },
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
    if (!tx) return 'General';
    const dr = tx.dr || tx.correctDebit || (Array.isArray(tx.lines) && tx.lines.find(l => Number(l.debit) > 0)?.accountCode);
    const cr = tx.cr || tx.correctCredit || (Array.isArray(tx.lines) && tx.lines.find(l => Number(l.credit) > 0)?.accountCode);
    if (cr === 'sales_rev' || cr === '4101') return (dr === 'cash' || dr === '1101') ? 'Cash Sale' : 'Sale';
    if (dr === 'inventory' || dr === '1104' || dr === '1105') return 'Purchase';
    if ((dr === 'cash' || dr === '1101') && (cr === 'ar' || cr === '1103')) return 'Collection';
    if ((dr === 'ap' || dr === '2101') && (cr === 'cash' || cr === '1101')) return 'Payment';
    if (dr === 'salary_exp' || dr === '5201') return 'Payroll';
    if (dr === 'rent_exp' || dr === 'util_exp' || dr === '5202' || dr === '5203') return 'Expense';
    if (dr === 'equipment' || dr === '1201') return 'Asset Disposal';
    return tx.type || 'General';
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
      year: company.month || 'السنة المالية 2026',
      bankAccount: company.bankReconciliation?.bankAccount || null
    };
    localStorage.setItem('sim_company_profile', JSON.stringify(profile));

    // 2. تحويل السندات وإسنادها لمهام المحاكي
    const simTasks = this.transformTransactionsToSim(company.transactions || []);
    localStorage.setItem('sim_admin_tasks', JSON.stringify(simTasks));

    // 3. تهيئة التسوية البنكية وكشف الحساب في حال توفرها في ملف الشركة
    if (company.bankReconciliation) {
      localStorage.setItem('sim_bank_recon_case', JSON.stringify(company.bankReconciliation));

      const recon = company.bankReconciliation;
      const opening = Number(recon.bankAccount?.openingBalance) || 0;
      const bankTx = Array.isArray(recon.bankTransactions) ? recon.bankTransactions : [];

      const statementItems = [];
      if (opening > 0) {
        statementItems.push({
          id: 'BNK-OP-001',
          date: recon.period?.startDate || '2026-01-01',
          desc: `رصيد أول المدة المنقول من الفترة السابقة (${recon.bankAccount?.bankNameAr || recon.bankAccount?.bankName || 'البنك'})`,
          ref: 'OPENING',
          deposit: opening,
          withdrawal: 0,
          matched: true,
          isOpening: true
        });
      }

      bankTx.forEach((tx, idx) => {
        const isDep = (tx.direction === 'CREDIT' || tx.sourceType === 'DEPOSIT');
        statementItems.push({
          id: tx.bankTransactionId || `BNK-${idx + 1}`,
          date: tx.date || tx.valueDate || '2026-01-01',
          desc: tx.description || 'معاملة بنكية',
          ref: tx.bankReference || '',
          deposit: isDep ? (Number(tx.amount) || 0) : 0,
          withdrawal: !isDep ? (Number(tx.amount) || 0) : 0,
          matched: false
        });
      });

      localStorage.setItem('bank_statement_items', JSON.stringify(statementItems));
    } else {
      localStorage.removeItem('sim_bank_recon_case');
    }

    // 4. محاولة استرجاع التقدم المحفوظ من السحابة إذا وُجد
    if (typeof window !== 'undefined' && window.SimulationService && typeof window.SimulationService.loadProgress === 'function') {
      window.SimulationService.loadProgress(company.id).catch(e => console.warn('[SimulationBridge] Load state error:', e));
    } else {
      ['student_journal', 'student_ledger'].forEach(k => {
        localStorage.removeItem(k);
      });
      if (!company.bankReconciliation) {
        localStorage.removeItem('bank_statement_items');
      }
    }
  },

  // حفظ تقدم المحاكاة الحالي الشامل إلى السحابة (اليومية، الأستاذ، البنك، المخزون، الخزينة، الإقفال)
  async saveCurrentSimulation(score = 0, status = 'in_progress') {
    if (typeof window !== 'undefined' && window.SimulationService) {
      try {
        const profile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
        const journal = JSON.parse(localStorage.getItem('student_journal') || '[]');
        const ledger = JSON.parse(localStorage.getItem('student_ledger') || '{}');

        // جمع حالات الوحدات المحاسبية التكميلية لضمان استرجاعها من أي جهاز
        const bankItems = JSON.parse(localStorage.getItem('bank_statement_items') || 'null');
        const bankCase = JSON.parse(localStorage.getItem('sim_bank_recon_case') || 'null');
        const inventoryState = JSON.parse(localStorage.getItem('sim_inventory_items_state') || 'null');
        const cashBalance = localStorage.getItem('sim_cash_book_balance');
        const cashDenoms = JSON.parse(localStorage.getItem('sim_cash_denom_counts') || 'null');
        const januaryClosed = localStorage.getItem('january_closed') === 'true';

        // جمع بطاقات المطابقة البنكية
        const bookMatches = {};
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith('book_matched_')) {
            bookMatches[k] = localStorage.getItem(k);
          }
        }

        const modules = {
          bankReconciliation: { items: bankItems, caseData: bankCase, bookMatches },
          inventoryCount: inventoryState,
          cashCount: { bookBalance: cashBalance, denomCounts: cashDenoms },
          closing: { januaryClosed }
        };

        await window.SimulationService.saveProgress(profile.id || 'company-nile', { journal, ledger, profile, modules, score, status });
      } catch (e) {
        console.warn('[SimulationBridge] saveCurrentSimulation error:', e);
      }
    }
  },

  // إرسال وتفعيل شركة معينة داخل بيئة المحاكي فوراً
  launchCompanyInSimulator(company) {
    if (!company) return;
    this.setSimulatorActiveCompany(company);
    if ((!company.transactions || company.transactions.length === 0) && company.bankReconciliation) {
      window.location.href = 'simulation/simulation/bank-recon/index.html';
    } else {
      window.location.href = 'simulation/simulation/journal/index.html';
    }
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
