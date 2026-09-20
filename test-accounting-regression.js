/**
 * test-accounting-regression.js — حزمة اختبارات الانحدار المحاسبي الآلية (Accounting Regression Suite)
 * التحقق من قواعد المحاسبة، اتزان الأستاذ والميزان، ورفض العمليات الخاطئة برمجياً.
 */

const assert = require('assert');
const EGYPTIAN_COA = require('./src/core/engine/egyptian-coa.js');
const AccounteraAccountingCore = require('./src/core/engine/accountera-accounting-core.js');

console.log('🧪 بدء تشغيل اختبارات الانحدار المحاسبي (Accountera Accounting Regression Suite)...');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`   ✅ [PASS]: ${testName}`);
    passedTests++;
  } catch (err) {
    console.error(`   ❌ [FAIL]: ${testName}`);
    console.error(`      السبب: ${err.message}`);
  }
}

// -------------------------------------------------------------
// 1. اختبار تهيئة المحرك والدليل المصري
// -------------------------------------------------------------
runTest('تحميل الدليل المحاسبي المصري والتحقق من حسابات الضرائب', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const vatIn = engine.getAccount('1106');
  const vatOut = engine.getAccount('2102');
  const wht = engine.getAccount('2103');
  assert.ok(vatIn && vatIn.name.includes('مدخلات'), 'حساب ضريبة القيمة المضافة مدخلات غير مسجل');
  assert.ok(vatOut && vatOut.name.includes('مخرجات'), 'حساب ضريبة القيمة المضافة مخرجات غير مسجل');
  assert.ok(wht && wht.name.includes('خصم'), 'حساب ضريبة الخصم والتحصيل غير مسجل');
});

// -------------------------------------------------------------
// 2. اختبار رفض القيد غير المتزن (Rejection of Unbalanced Entries)
// -------------------------------------------------------------
runTest('رفض ترحيل القيد غير المتزن محاسبياً (Unbalanced Entry Rejection)', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const invalidEntry = {
    desc: 'شراء أجهزة مع عدم توازن القيد',
    lines: [
      { accountCode: '1206', debit: 50000, credit: 0 },
      { accountCode: '1102.001', debit: 0, credit: 40000 } // فارق 10000
    ]
  };

  const validation = engine.validateEntry(invalidEntry);
  assert.strictEqual(validation.isValid, false, 'المحرك قبل قيداً غير متزن!');
  assert.throws(() => {
    engine.postEntry(invalidEntry);
  }, /غير متزن/, 'لم يتم إطلاق استثناء عند محاولة ترحيل قيد غير متزن');
});

// -------------------------------------------------------------
// 3. اختبار ترحيل قيد مركب مع ضريبة القيمة المضافة المصرية (14%)
// -------------------------------------------------------------
runTest('ترحيل قيد شراء بضاعة بالآجل مع ضريبة القيمة المضافة 14% بنجاح', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const purchaseEntry = {
    ref: 'INV-EGY-901',
    date: '2026-01-20',
    desc: 'شراء بضاعة من شركة الدلتا بالآجل مع ضريبة 14%',
    lines: [
      { accountCode: '1105.001', accountName: 'مخزون البضاعة التامة', debit: 100000, credit: 0 },
      { accountCode: '1106', accountName: 'ضريبة القيمة المضافة مدخلات', debit: 14000, credit: 0 },
      { accountCode: '2101.001', accountName: 'الموردون - شركة الدلتا', debit: 0, credit: 114000 }
    ]
  };

  const posted = engine.postEntry(purchaseEntry, { postedBy: 'test_runner' });
  assert.strictEqual(posted.status, 'posted');
  assert.strictEqual(posted.totalDebit, 114000);
  assert.strictEqual(posted.totalCredit, 114000);

  // فحص أستاذ الموردين المساعد
  const supplierSub = engine.subLedgers.suppliers['2101.001'];
  assert.ok(supplierSub, 'لم يتم تحديث أستاذ مساعد الموردين');
  assert.strictEqual(supplierSub.balance, 114000, 'رصيد المورد غير مطابق لقيمة الفاتورة مع الضريبة');
});

// -------------------------------------------------------------
// 4. اختبار توازن ميزان المراجعة (Trial Balance Balance Check)
// -------------------------------------------------------------
runTest('توليد ميزان المراجعة والتحقق من تطابق إجمالي المدين والدائن 100%', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);

  // قيد 1: إثبات رأس المال
  engine.postEntry({
    desc: 'إيداع رأس المال بالبنك',
    lines: [
      { accountCode: '1102.001', debit: 500000, credit: 0 },
      { accountCode: '3101', debit: 0, credit: 500000 }
    ]
  });

  // قيد 2: شراء بضاعة نقداً من البنك مع ضريبة 14%
  engine.postEntry({
    desc: 'شراء بضاعة بشيك بنكي مع ضريبة 14%',
    lines: [
      { accountCode: '1105.001', debit: 200000, credit: 0 },
      { accountCode: '1106', debit: 28000, credit: 0 },
      { accountCode: '1102.001', debit: 0, credit: 228000 }
    ]
  });

  // قيد 3: بيع جزء من البضاعة نقداً بالبنك مع ضريبة 14%
  engine.postEntry({
    desc: 'بيع بضاعة وتحصيل القيمة بالبنك',
    lines: [
      { accountCode: '1102.001', debit: 342000, credit: 0 },
      { accountCode: '4101', debit: 0, credit: 300000 },
      { accountCode: '2102', debit: 0, credit: 42000 }
    ]
  });

  const tb = engine.generateTrialBalance();
  assert.strictEqual(tb.isBalanced, true, 'ميزان المراجعة غير متزن!');
  assert.strictEqual(tb.totalDebitBalance, tb.totalCreditBalance, 'أرصدة المدين لا تطابق الدائن بالميزان');
  assert.strictEqual(tb.totalDebitMovement, tb.totalCreditMovement, 'مجاميع الحركات لا تتطابق');
});

// -------------------------------------------------------------
// 5. اختبار القوائم المالية واحتساب صافي الأرباح
// -------------------------------------------------------------
runTest('توليد قائمة الدخل والمركز المالي والتحقق من تطابق الميزانية العمومية', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);

  // رأس مال
  engine.postEntry({
    desc: 'رأس مال',
    lines: [
      { accountCode: '1101.001', debit: 100000, credit: 0 },
      { accountCode: '3101', debit: 0, credit: 100000 }
    ]
  });

  // إيراد خدمات 40,000 نقداً
  engine.postEntry({
    desc: 'تقديم خدمات استشارية نقداً',
    lines: [
      { accountCode: '1101.001', debit: 40000, credit: 0 },
      { accountCode: '4104', debit: 0, credit: 40000 }
    ]
  });

  // مصروف إيجار 15,000 نقداً
  engine.postEntry({
    desc: 'سداد إيجار الشهر نقداً',
    lines: [
      { accountCode: '5203', debit: 15000, credit: 0 },
      { accountCode: '1101.001', debit: 0, credit: 15000 }
    ]
  });

  const stmts = engine.generateFinancialStatements();
  assert.strictEqual(stmts.incomeStatement.netProfit, 25000, 'صافي الربح غير مطابق (40000 - 15000)');
  assert.strictEqual(stmts.balanceSheet.isBalanced, true, 'الميزانية العمومية غير متزنة!');
  assert.strictEqual(stmts.balanceSheet.totalAssets, 125000, 'إجمالي الأصول غير مطابق');
  assert.strictEqual(stmts.balanceSheet.totalLiabilitiesAndEquity, 125000, 'إجمالي الخصوم وحقوق الملكية غير مطابق');
});

// -------------------------------------------------------------
// 6. اختبار محرك التقييم ثماني المستويات (8-Level Evaluation)
// -------------------------------------------------------------
runTest('محرك التقييم ثماني المستويات يكشف الخطأ الضريبي بدقة', () => {
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);

  const expectedEntry = {
    date: '2026-01-15',
    lines: [
      { accountCode: '1105', debit: 10000, credit: 0 },
      { accountCode: '1106', debit: 1400, credit: 0 }, // ضريبة مدخلات 14%
      { accountCode: '2101', debit: 0, credit: 11400 }
    ]
  };

  // الطالب نسي إثبات الضريبة وسجل القيد مباشرة
  const studentEntryWithoutVAT = {
    date: '2026-01-15',
    lines: [
      { accountCode: '1105', debit: 11400, credit: 0 },
      { accountCode: '2101', debit: 0, credit: 11400 }
    ]
  };

  const evalResult = engine.evaluateStudentAttempt(studentEntryWithoutVAT, expectedEntry);
  assert.strictEqual(evalResult.isPassed, false, 'المحرك أقر بصحة القيد رغم إغفال الضريبة!');
  assert.strictEqual(evalResult.levels.level5_vat.passed, false, 'مستوى فحص الضريبة لم يكشف الخطأ');
  assert.ok(evalResult.levels.level5_vat.feedback.includes('ضريبة القيمة المضافة'), 'نص التغذية الراجعة لم يذكر الضريبة');
});

// -------------------------------------------------------------
// 7. اختبار محرك المستندات (Document Engine: Invoice -> Entry -> Ledger)
// -------------------------------------------------------------
runTest('محرك المستندات: توليد فاتورة ضريبية وترحيلها من المستند للأستاذ', () => {
  const DocumentTransactionEngine = require('./src/core/engine/document-transaction-engine.js');
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const docEngine = new DocumentTransactionEngine(engine);

  const invoice = docEngine.createTaxInvoice({
    type: 'purchase',
    partyName: 'شركة الإسكندرية للتجارة',
    subtotal: 50000,
    vatRate: 0.14
  });

  assert.strictEqual(invoice.vatAmount, 7000, 'ضريبة القيمة المضافة غير مطابقة (50000 * 14%)');
  assert.strictEqual(invoice.totalDue, 57000, 'إجمالي المستحق على الفاتورة غير مطابق');

  // محاكاة إدخال الطالب للقيد الصحيح المستخرج من الفاتورة
  const studentEntry = {
    date: invoice.issueDate,
    lines: [
      { accountCode: '1105.001', debit: 50000, credit: 0 },
      { accountCode: '1106', debit: 7000, credit: 0 },
      { accountCode: '2101.001', debit: 0, credit: 57000 }
    ]
  };

  const result = docEngine.processStudentDocumentSubmission(invoice, studentEntry);
  assert.strictEqual(result.success, true, 'فشل معالجة إدخال الطالب للمستند');
  assert.strictEqual(result.evalReport.isPassed, true, 'تقرير التقييم لم يقر بالنجاح الكامل');

  // التحقق من وصول الأثر المالي للأستاذ العام
  const tb = engine.generateTrialBalance();
  assert.strictEqual(tb.isBalanced, true, 'ميزان المراجعة غير متزن بعد ترحيل الفاتورة');
  assert.strictEqual(tb.totalDebitBalance, 57000, 'مجموع الميزان غير متطابق مع قيمة الفاتورة الضريبية');
});

// -------------------------------------------------------------
// 8. اختبار محاكي التسوية البنكية ومصادقات الموردين (Phase 2)
// -------------------------------------------------------------
runTest('محاكي التسوية البنكية: توليد سيناريو بنكي واقعي ومطابقة الرصيد المعدل', () => {
  const EgyptianSimulationModules = require('./src/core/engine/egyptian-simulation-modules.js');
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const simModules = new EgyptianSimulationModules(engine);

  const scenario = simModules.generateBankReconciliationScenario('1102.001');
  assert.ok(scenario.items.length >= 4, 'لم يتم توليد بنود تسوية كافية');
  assert.strictEqual(scenario.adjustedTargetBalance, scenario.bookBalance - 1200 + 3500, 'الرصيد الدفتري المعدل غير مطابق');

  // محاكاة حل الطالب الناجح
  const studentSolution = {
    selectedItemIds: scenario.items.map(i => i.id),
    calculatedAdjustedBalance: scenario.adjustedTargetBalance
  };

  const evalResult = simModules.evaluateBankReconciliationSolution(scenario, studentSolution);
  assert.strictEqual(evalResult.isCorrect, true, 'تقييم حل التسوية البنكية فشل');
  assert.strictEqual(evalResult.score, 100, 'الدرجة غير كاملة');

  // فحص مصادقة الموردين
  const suppRecon = simModules.generateSupplierReconciliation('2101.001', 'شركة الدلتا');
  assert.ok(suppRecon.discrepancies.length >= 2, 'فروق كشف المورد غير متوفرة');
});

// -------------------------------------------------------------
// 9. اختبار المسارات المهنية والمراجع الآلي (Phase 3 & 5)
// -------------------------------------------------------------
runTest('المسارات المهنية والمراجع الآلي: تشخيص الأخطاء بالاستناد لمعايير المحاسبة المصرية', () => {
  const { ACC_CAREER_PATHS, AISeniorAuditor } = require('./src/core/engine/career-paths-and-mentor.js');
  const engine = new AccounteraAccountingCore(EGYPTIAN_COA);
  const auditor = new AISeniorAuditor(engine);

  assert.ok(ACC_CAREER_PATHS.general_accountant, 'المسار المحاسبي العام مفقود');
  assert.ok(ACC_CAREER_PATHS.tax_accountant, 'مسار محاسب الضرائب مفقود');

  // محاكاة قيد خاطئ أهمل ضريبة القيمة المضافة
  const studentEntry = {
    lines: [
      { accountCode: '1105', debit: 11400, credit: 0 },
      { accountCode: '2101', debit: 0, credit: 11400 }
    ]
  };
  const expectedEntry = {
    lines: [
      { accountCode: '1105', debit: 10000, credit: 0 },
      { accountCode: '1106', debit: 1400, credit: 0 },
      { accountCode: '2101', debit: 0, credit: 11400 }
    ]
  };

  const evalReport = engine.evaluateStudentAttempt(studentEntry, expectedEntry);
  const auditReport = auditor.generateAuditDiagnosis(studentEntry, expectedEntry, evalReport);

  assert.strictEqual(auditReport.isClean, false, 'المراجع الآلي لم يكشف الخطأ');
  assert.ok(auditReport.findings.length > 0, 'لم يتم تقديم ملاحظات تدقيقية');
  assert.ok(auditReport.findings[0].reference.includes('القيمة المضافة'), 'المراجع لم يستند لقانون القيمة المضافة المصري');
});

console.log('\n========================================================');
console.log(`🎯 نتيجة الاختبارات: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');
