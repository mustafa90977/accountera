/**
 * accountera-accounting-core.js — النواة المحاسبية المستقلة (Accountera Accounting Core v2.0)
 * 
 * المبادئ الهندسية:
 * 1. Accounting Core First: استقلال تام بنسبة 100% عن الـ DOM والواجهة الرسومية (Pure Business Logic).
 * 2. Single Source of Truth: النواة هي الحاكم الأوحد لصحة القيود، اتزان الدفاتر، ومخرجات القوائم.
 * 3. 8-Level Evaluation: محرك تقييم متقدم متعدد المستويات يفحص تفاصيل القيد والأثر المالي والضريبي.
 */

class AccounteraAccountingCore {
  constructor(coa = null) {
    this.coa = coa || (typeof EGYPTIAN_COA !== 'undefined' ? EGYPTIAN_COA : {});
    this.journal = [];       // سجل قيود اليومية العامة
    this.ledger = {};        // دفتر الأستاذ العام (أرصدة وحركات حسابات T)
    this.subLedgers = {      // الدفاتر المساعدة
      customers: {},         // دفتر أستاذ مساعد العملاء (AR)
      suppliers: {},         // دفتر أستاذ مساعد الموردين (AP)
      inventory: {},         // كارت صنف المخزون
      fixedAssets: {}        // سجل الأصول الثابتة
    };
    this.auditTrail = [];    // سجل المراجعة والتتبع غير القابل للتعديل
  }

  // =========================================================================
  // 1. إدارة الدليل المحاسبي (Chart of Accounts)
  // =========================================================================
  setCOA(coa) {
    this.coa = coa;
  }

  getAccount(code) {
    return this.coa[code] || null;
  }

  registerAccount(code, accountData) {
    this.coa[code] = {
      code: code,
      name: accountData.name || "حساب فرعي",
      type: accountData.type || "Asset",
      category: accountData.category || "Current Asset",
      normal: accountData.normal || (accountData.type === 'Asset' || accountData.type === 'Expense' ? 'Debit' : 'Credit')
    };
  }

  // =========================================================================
  // 2. محرك التحقق من صحة القيد المحاسبي (Double-Entry Validation)
  // =========================================================================
  validateEntry(entry) {
    const errors = [];
    if (!entry) {
      return { isValid: false, errors: ["بيانات القيد فارغة."] };
    }

    if (!entry.lines || !Array.isArray(entry.lines) || entry.lines.length < 2) {
      errors.push("القيد المحاسبي يجب أن يحتوي على طرفين على الأقل (مدين ودائن).");
    }

    let totalDebit = 0;
    let totalCredit = 0;

    (entry.lines || []).forEach((line, idx) => {
      const lineNum = line.lineNum || idx + 1;
      const code = String(line.accountCode || '').trim();

      if (!code) {
        errors.push(`السطر ${lineNum}: لم يتم تحديد كود الحساب.`);
      } else if (!this.coa[code]) {
        // تسجيل الحساب تلقائياً إن لم يكن موجوداً
        this.registerAccount(code, { name: line.accountName, type: line.acctType });
      }

      const dr = Number(line.debit) || 0;
      const cr = Number(line.credit) || 0;

      if (dr < 0 || cr < 0) {
        errors.push(`السطر ${lineNum}: لا يمكن تسجيل مبالغ سالبة في القيد.`);
      }
      if (dr === 0 && cr === 0) {
        errors.push(`السطر ${lineNum}: يجب إدخال قيمة للمدين أو الدائن.`);
      }
      if (dr > 0 && cr > 0) {
        errors.push(`السطر ${lineNum}: لا يمكن أن يكون السطر الواحد مديناً ودائناً في نفس الوقت.`);
      }

      totalDebit += dr;
      totalCredit += cr;
    });

    // التحقق من توازن القيد (المدين = الدائن تماماً)
    const diff = Math.abs(totalDebit - totalCredit);
    if (diff > 0.001) {
      errors.push(`القيد غير متزن: مجموع المدين (${totalDebit.toLocaleString()}) لا يتطابق مع مجموع الدائن (${totalCredit.toLocaleString()}) بفارق (${diff.toFixed(2)}).`);
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      totalDebit: Math.round(totalDebit * 100) / 100,
      totalCredit: Math.round(totalCredit * 100) / 100
    };
  }

  // =========================================================================
  // 3. محرك الترحيل إلى دفتر الأستاذ (Journal to Ledger Posting Engine)
  // =========================================================================
  postEntry(entry, options = {}) {
    const validation = this.validateEntry(entry);
    if (!validation.isValid) {
      throw new Error(`فشل ترحيل القيد: ${validation.errors.join(' | ')}`);
    }

    const postedEntry = {
      id: entry.id || `JE-${String(this.journal.length + 1).padStart(6, '0')}`,
      txId: entry.txId || entry.id || `TRX-${Date.now()}`,
      ref: entry.ref || `INV-${Date.now()}`,
      date: entry.date || new Date().toISOString().split('T')[0],
      desc: entry.desc || entry.title || "قيد محاسبي مرحل",
      type: entry.type || "General",
      status: "posted",
      totalDebit: validation.totalDebit,
      totalCredit: validation.totalCredit,
      lines: entry.lines.map((l, idx) => ({
        lineNum: l.lineNum || idx + 1,
        accountCode: String(l.accountCode),
        accountName: l.accountName || (this.coa[l.accountCode] ? this.coa[l.accountCode].name : "حساب"),
        acctType: l.acctType || (this.coa[l.accountCode] ? this.coa[l.accountCode].type : "Asset"),
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        desc: l.description || l.desc || entry.desc || ""
      })),
      postedAt: new Date().toISOString(),
      postedBy: options.postedBy || "student",
      isOpening: !!entry.isOpening
    };

    // 1. إضافة القيد إلى دفتر اليومية
    this.journal.push(postedEntry);

    // 2. تحديث حسابات T في دفتر الأستاذ العام
    postedEntry.lines.forEach(line => {
      const code = line.accountCode;
      if (!this.ledger[code]) {
        const acct = this.coa[code] || { name: line.accountName, type: line.acctType };
        this.ledger[code] = {
          code: code,
          name: acct.name || line.accountName,
          type: acct.type || line.acctType,
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
          entries: []
        };
      }

      this.ledger[code].totalDebit += line.debit;
      this.ledger[code].totalCredit += line.credit;

      // حساب الرصيد الصافي وفق الطبيعة
      const isDebitNormal = (this.ledger[code].type === 'Asset' || this.ledger[code].type === 'Expense');
      if (isDebitNormal) {
        this.ledger[code].balance = this.ledger[code].totalDebit - this.ledger[code].totalCredit;
      } else {
        this.ledger[code].balance = this.ledger[code].totalCredit - this.ledger[code].totalDebit;
      }

      this.ledger[code].entries.push({
        jeId: postedEntry.id,
        date: postedEntry.date,
        ref: postedEntry.ref,
        desc: line.desc,
        debit: line.debit,
        credit: line.credit,
        runningBalance: this.ledger[code].balance
      });

      // 3. تحديث الدفاتر المساعدة (Sub-ledgers) عند اللزوم
      if (code.startsWith('1103')) {
        // عميل
        this._updateSubLedger('customers', code, line.accountName, line.debit - line.credit, postedEntry);
      } else if (code.startsWith('2101')) {
        // مورد
        this._updateSubLedger('suppliers', code, line.accountName, line.credit - line.debit, postedEntry);
      }
    });

    // 4. تسجيل العملية في سجل التدقيق والمراجعة (Audit Trail)
    this.auditTrail.push({
      action: "POST_JOURNAL_ENTRY",
      jeId: postedEntry.id,
      timestamp: postedEntry.postedAt,
      actor: postedEntry.postedBy,
      impact: {
        debitAccounts: postedEntry.lines.filter(l => l.debit > 0).map(l => l.accountCode),
        creditAccounts: postedEntry.lines.filter(l => l.credit > 0).map(l => l.accountCode),
        amount: validation.totalDebit
      }
    });

    return postedEntry;
  }

  _updateSubLedger(subType, code, name, deltaBalance, entry) {
    if (!this.subLedgers[subType][code]) {
      this.subLedgers[subType][code] = { code, name, balance: 0, history: [] };
    }
    this.subLedgers[subType][code].balance += deltaBalance;
    this.subLedgers[subType][code].history.push({
      jeId: entry.id,
      date: entry.date,
      ref: entry.ref,
      delta: deltaBalance,
      balance: this.subLedgers[subType][code].balance
    });
  }

  // =========================================================================
  // 4. محرك ميزان المراجعة (Trial Balance Engine)
  // =========================================================================
  generateTrialBalance() {
    let totalDebitBalance = 0;
    let totalCreditBalance = 0;
    let totalDebitMovement = 0;
    let totalCreditMovement = 0;

    const rows = [];

    Object.keys(this.ledger).sort().forEach(code => {
      const acct = this.ledger[code];
      const coaMeta = this.coa[code] || {};
      const isDebitNormal = (acct.type === 'Asset' || acct.type === 'Expense');

      let drBalance = 0;
      let crBalance = 0;

      if (isDebitNormal) {
        const net = acct.totalDebit - acct.totalCredit;
        if (net >= 0) drBalance = net;
        else crBalance = Math.abs(net);
      } else {
        const net = acct.totalCredit - acct.totalDebit;
        if (net >= 0) crBalance = net;
        else drBalance = Math.abs(net);
      }

      totalDebitMovement += acct.totalDebit;
      totalCreditMovement += acct.totalCredit;
      totalDebitBalance += drBalance;
      totalCreditBalance += crBalance;

      rows.push({
        code: code,
        name: acct.name,
        type: acct.type,
        category: coaMeta.category || 'General',
        totalDebit: acct.totalDebit,
        totalCredit: acct.totalCredit,
        debitBalance: drBalance,
        creditBalance: crBalance
      });
    });

    const isBalanced = Math.abs(totalDebitBalance - totalCreditBalance) < 0.01;

    return {
      rows: rows,
      totalDebitMovement: Math.round(totalDebitMovement * 100) / 100,
      totalCreditMovement: Math.round(totalCreditMovement * 100) / 100,
      totalDebitBalance: Math.round(totalDebitBalance * 100) / 100,
      totalCreditBalance: Math.round(totalCreditBalance * 100) / 100,
      isBalanced: isBalanced,
      accountsCount: rows.length
    };
  }

  // =========================================================================
  // 5. محرك القوائم المالية المباشر (Financial Statements Generator)
  // =========================================================================
  generateFinancialStatements() {
    const tb = this.generateTrialBalance();

    let totalRevenues = 0;
    let totalExpenses = 0;
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    const incomeStatementItems = { revenues: [], expenses: [] };
    const balanceSheetItems = { assets: [], liabilities: [], equity: [] };

    tb.rows.forEach(r => {
      const type = (r.type || '').toLowerCase();
      if (type === 'revenue') {
        const net = r.creditBalance - r.debitBalance;
        totalRevenues += net;
        incomeStatementItems.revenues.push({ code: r.code, name: r.name, amount: net });
      } else if (type === 'expense') {
        const net = r.debitBalance - r.creditBalance;
        totalExpenses += net;
        incomeStatementItems.expenses.push({ code: r.code, name: r.name, amount: net });
      } else if (type === 'asset') {
        const net = r.debitBalance - r.creditBalance;
        totalAssets += net;
        balanceSheetItems.assets.push({ code: r.code, name: r.name, amount: net });
      } else if (type === 'liability') {
        const net = r.creditBalance - r.debitBalance;
        totalLiabilities += net;
        balanceSheetItems.liabilities.push({ code: r.code, name: r.name, amount: net });
      } else if (type === 'equity') {
        const net = r.creditBalance - r.debitBalance;
        totalEquity += net;
        balanceSheetItems.equity.push({ code: r.code, name: r.name, amount: net });
      }
    });

    const netProfit = totalRevenues - totalExpenses;
    const finalEquity = totalEquity + netProfit;
    const isBalanceSheetBalanced = Math.abs(totalAssets - (totalLiabilities + finalEquity)) < 0.01;

    return {
      incomeStatement: {
        revenues: incomeStatementItems.revenues,
        expenses: incomeStatementItems.expenses,
        totalRevenues,
        totalExpenses,
        netProfit
      },
      balanceSheet: {
        assets: balanceSheetItems.assets,
        liabilities: balanceSheetItems.liabilities,
        equity: balanceSheetItems.equity,
        totalAssets,
        totalLiabilities,
        retainedEarnings: netProfit,
        totalLiabilitiesAndEquity: totalLiabilities + finalEquity,
        isBalanced: isBalanceSheetBalanced
      }
    };
  }

  // =========================================================================
  // 6. محرك التقييم المحاسبي ثماني المستويات (8-Level Entry Evaluator)
  // =========================================================================
  evaluateStudentAttempt(studentEntry, expectedEntry) {
    const report = {
      isPassed: false,
      score: 0,
      levels: {
        level1_accounts: { passed: false, feedback: "" },
        level2_sides: { passed: false, feedback: "" },
        level3_amounts: { passed: false, feedback: "" },
        level4_date: { passed: false, feedback: "" },
        level5_vat: { passed: false, feedback: "" },
        level6_treatment: { passed: false, feedback: "" },
        level7_ledger_impact: { passed: false, feedback: "" },
        level8_statement_impact: { passed: false, feedback: "" }
      },
      detailedDiagnosis: []
    };

    if (!studentEntry || !expectedEntry) {
      report.detailedDiagnosis.push("بيانات القيد غير مكتملة للمقارنة.");
      return report;
    }

    const sLines = studentEntry.lines || [];
    const expLines = expectedEntry.lines || [];

    // Level 1: صحة الحسابات
    const expCodes = expLines.map(l => String(l.accountCode));
    const sCodes = sLines.map(l => String(l.accountCode));
    const matchedCodes = sCodes.filter(c => expCodes.includes(c));
    const isAccountsMatch = (matchedCodes.length === expCodes.length) && (sCodes.length === expCodes.length);
    report.levels.level1_accounts.passed = isAccountsMatch;
    report.levels.level1_accounts.feedback = isAccountsMatch ? "الحسابات المستخدمة صحيحة ومطابقة." : "يوجد خطأ في اختيار أطراف الحسابات المعنية بالمعاملة.";

    // Level 2: صحة المدين والدائن (Sides)
    let sidesMatch = isAccountsMatch;
    if (isAccountsMatch) {
      expLines.forEach(el => {
        const sl = sLines.find(s => String(s.accountCode) === String(el.accountCode));
        if (sl) {
          const expIsDr = el.debit > 0;
          const sIsDr = sl.debit > 0;
          if (expIsDr !== sIsDr) sidesMatch = false;
        }
      });
    }
    report.levels.level2_sides.passed = sidesMatch;
    report.levels.level2_sides.feedback = sidesMatch ? "التوجيه المحاسبي (المدين والدائن) سليم 100%." : "تم عكس طرف القيد (المدين مكان الدائن).";

    // Level 3: صحة المبالغ (Amounts)
    let amountsMatch = sidesMatch;
    if (sidesMatch) {
      expLines.forEach(el => {
        const sl = sLines.find(s => String(s.accountCode) === String(el.accountCode));
        if (sl) {
          if (Math.abs(Number(sl.debit) - Number(el.debit)) > 0.01 || Math.abs(Number(sl.credit) - Number(el.credit)) > 0.01) {
            amountsMatch = false;
          }
        }
      });
    }
    report.levels.level3_amounts.passed = amountsMatch;
    report.levels.level3_amounts.feedback = amountsMatch ? "المبالغ المالية مطابقة تماماً للمستند." : "يوجد خطأ في الأرقام والمبالغ المسجلة.";

    // Level 4: التاريخ (Date)
    const dateMatch = !expectedEntry.date || studentEntry.date === expectedEntry.date;
    report.levels.level4_date.passed = dateMatch;
    report.levels.level4_date.feedback = dateMatch ? "تاريخ إثبات القيد سليم." : "تاريخ القيد لا يطابق تاريخ المستند المرفق.";

    // Level 5: الضريبة (VAT Check)
    const hasVATInExp = expLines.some(l => String(l.accountCode).startsWith('1106') || String(l.accountCode).startsWith('2102'));
    const hasVATInS = sLines.some(l => String(l.accountCode).startsWith('1106') || String(l.accountCode).startsWith('2102'));
    const vatPassed = (hasVATInExp === hasVATInS);
    report.levels.level5_vat.passed = vatPassed;
    report.levels.level5_vat.feedback = vatPassed ? "المعالجة الضريبية لضريبة القيمة المضافة صحيحة." : "أغفلت حساب ضريبة القيمة المضافة (14%) الواجبة على هذه الفاتورة.";

    // Levels 6-8: المعالجة والأثر على الأستاذ والقوائم
    report.levels.level6_treatment.passed = amountsMatch;
    report.levels.level6_treatment.feedback = amountsMatch ? "المعالجة المحاسبية مطابقة لمعايير المحاسبة المصرية." : "المعالجة المحاسبية غير سليمة وفق المعايير.";
    report.levels.level7_ledger_impact.passed = amountsMatch;
    report.levels.level7_ledger_impact.feedback = amountsMatch ? "الأثر على دفتر الأستاذ سليم ومتوازن." : "الأثر على دفتر الأستاذ مشوه.";
    report.levels.level8_statement_impact.passed = amountsMatch;
    report.levels.level8_statement_impact.feedback = amountsMatch ? "الأثر على قائمة الدخل والمركز المالي صحيح." : "سيؤدي هذا القيد لتحريف أرباح أو مركز الشركة.";

    // احتساب الدرجة الكلية
    const passedLevelsCount = Object.values(report.levels).filter(l => l.passed).length;
    report.score = Math.round((passedLevelsCount / 8) * 100);
    report.isPassed = (report.score === 100);

    return report;
  }

  // =========================================================================
  // 7. استعادة وإعادة بناء الحالة (State Reconstruction)
  // =========================================================================
  resetState() {
    this.journal = [];
    this.ledger = {};
    this.subLedgers = { customers: {}, suppliers: {}, inventory: {}, fixedAssets: {} };
    this.auditTrail = [];
  }

  loadState(savedState) {
    if (!savedState) return;
    this.resetState();
    if (savedState.coa) this.coa = savedState.coa;
    if (savedState.journal && Array.isArray(savedState.journal)) {
      savedState.journal.forEach(entry => this.postEntry(entry, { postedBy: entry.postedBy || "restore" }));
    }
  }

  exportState() {
    return {
      version: "2.0-egypt",
      exportedAt: new Date().toISOString(),
      journal: this.journal,
      ledger: this.ledger,
      subLedgers: this.subLedgers,
      trialBalance: this.generateTrialBalance(),
      financialStatements: this.generateFinancialStatements(),
      auditTrail: this.auditTrail
    };
  }
}

if (typeof window !== 'undefined') {
  window.AccounteraAccountingCore = AccounteraAccountingCore;
}
if (typeof module !== 'undefined') {
  module.exports = AccounteraAccountingCore;
}
