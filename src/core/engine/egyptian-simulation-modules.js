/**
 * egyptian-simulation-modules.js — وحدات المحاكاة المحاسبية المتقدمة للبيئة المصرية (Phase 2)
 * 
 * يشمل:
 * 1. محاكي التسوية البنكية الواقعي (Bank Reconciliation Simulator):
 *    - مطابقة كشف حساب البنك الفعلي مع دفتر الأستاذ للبنك.
 *    - اكتشاف الشيكات التي لم تقدم للصرف (Outstanding Cheques).
 *    - الإيداعات بالطريق (Deposits in Transit).
 *    - المصروفات والعمولات البنكية غير المثبتة بالدفاتر.
 * 
 * 2. محاكي مصادقات وتسوية حسابات الموردين والعملاء (AP/AR Statement Reconciliation):
 *    - مطابقة كشف حساب المورد الخارجي مع دفتر أستاذ المساعد الداخلي واكتشاف الفروق.
 */

class EgyptianSimulationModules {
  constructor(accountingCore) {
    this.core = accountingCore;
  }

  // =========================================================================
  // 1. محاكي التسوية البنكية (Bank Reconciliation Engine)
  // =========================================================================
  generateBankReconciliationScenario(bankAccountCode = '1102.001') {
    const bookAccount = this.core.ledger[bankAccountCode] || { balance: 350000, totalDebit: 500000, totalCredit: 150000 };
    const bookBalance = bookAccount.balance;

    // بنود التسوية الواقعية للسيناريو
    const items = [
      {
        id: "BR-01",
        desc: "شيك رقم #40102 صادر للمورد شركة الأمل لم يقدم للصرف بالبنك حتى تاريخه",
        type: "OUTSTANDING_CHEQUE",
        amount: 25000,
        direction: "DEDUCT_FROM_BANK",
        category: "بنود تسوية كشف البنك"
      },
      {
        id: "BR-02",
        desc: "إيداع مبيعات نقدية أرسل مع المندوب يوم 31 يناير ولم يقيد بكشف البنك إلا في 2 فبراير",
        type: "DEPOSIT_IN_TRANSIT",
        amount: 40000,
        direction: "ADD_TO_BANK",
        category: "بنود تسوية كشف البنك"
      },
      {
        id: "BR-03",
        desc: "مصروفات وعمولات بنكية ومصروفات دفاتر شيكات خصمها البنك ولم يثبتها المحاسب بالدفاتر",
        type: "BANK_CHARGES",
        amount: 1200,
        direction: "DEDUCT_FROM_BOOKS",
        requiresJournalEntry: true,
        correctAdjustment: {
          dr: "5207", // مصروفات بنكية وعمولات
          cr: bankAccountCode,
          amount: 1200,
          desc: "إثبات المصروفات والعمولات البنكية عن شهر يناير"
        },
        category: "تسويات تتطلب قيد يومية بالدفاتر"
      },
      {
        id: "BR-04",
        desc: "تحصيل إيراد فوائد دائنة أضافها البنك لحساب الشركة ولم يثبتها المحاسب",
        type: "INTEREST_INCOME",
        amount: 3500,
        direction: "ADD_TO_BOOKS",
        requiresJournalEntry: true,
        correctAdjustment: {
          dr: bankAccountCode,
          cr: "4201", // إيرادات تمويلية وفوائد دائنة
          amount: 3500,
          desc: "إثبات فوائد الحساب الجاري الدائنة عن شهر يناير"
        },
        category: "تسويات تتطلب قيد يومية بالدفاتر"
      }
    ];

    // الرصيد الدفتري المعدل = الرصيد الدفتري - عمولات بنكية + فوائد دائنة
    const adjustedBookBalance = bookBalance - 1200 + 3500;
    // رصيد كشف حساب البنك الوارد = الرصيد المعدل - إيداعات بالطريق + شيكات لم تقدم
    const bankStatementBalance = adjustedBookBalance - 40000 + 25000;

    return {
      period: "يناير 2026",
      bankName: "البنك الأهلي المصري (حساب جاري ج.م)",
      bankAccountCode: bankAccountCode,
      bookBalance: bookBalance,
      bankStatementBalance: bankStatementBalance,
      adjustedTargetBalance: adjustedBookBalance,
      items: items
    };
  }

  evaluateBankReconciliationSolution(scenario, studentSolution) {
    // حل الطالب يتضمن:
    // 1. تصنيف البنود (إضافة للبنك، خصم من البنك، قيد بالدفاتر)
    // 2. تسجيل القيود التسوية الواجبة (AJE)
    const report = {
      isCorrect: false,
      score: 0,
      errors: [],
      feedback: ""
    };

    if (!studentSolution) {
      report.errors.push("لم يتم تقديم مذكرة التسوية.");
      return report;
    }

    const correctIds = scenario.items.map(i => i.id);
    const studentSelected = studentSolution.selectedItemIds || [];

    const isMatch = correctIds.every(id => studentSelected.includes(id)) && (correctIds.length === studentSelected.length);
    const isBookAdjustedCorrect = Math.abs(Number(studentSolution.calculatedAdjustedBalance) - scenario.adjustedTargetBalance) < 0.01;

    if (isMatch && isBookAdjustedCorrect) {
      report.isCorrect = true;
      report.score = 100;
      report.feedback = "تسوية بنكية ممتازة! تم اكتشاف كافة بنود التسوية وتطابق الرصيد المعدل لكشف البنك مع الدفاتر تماماً.";
    } else {
      report.isCorrect = false;
      report.score = isBookAdjustedCorrect ? 70 : 40;
      report.feedback = "يوجد خطأ في تصنيف بنود التسوية أو احتساب الرصيد الدفتري المعدل.";
    }

    return report;
  }

  // =========================================================================
  // 2. محاكي مصادقات الموردين والعملاء (AP/AR Statement Reconciliation)
  // =========================================================================
  generateSupplierReconciliation(supplierCode = '2101.001', supplierName = 'شركة الدلتا للصناعات') {
    const internalSubLedger = this.core.subLedgers.suppliers[supplierCode] || { balance: 114000 };
    const bookBalance = internalSubLedger.balance;

    const discrepancies = [
      {
        id: "SUP-DIFF-01",
        title: "دفعة مسددة للمورد بشيك في نهاية الشهر",
        desc: "سددت الشركة شيكاً بمبلغ 30,000 ج.م للمورد، وتم إثباته بالدفاتر، لكن المورد لم يودعه بحسابه بعد، فظهر رصيده بكشف المورد أكبر بمقدار 30,000 ج.م.",
        type: "PAYMENT_IN_TRANSIT",
        amount: 30000,
        adjustmentParty: "SUPPLIER_STATEMENT"
      },
      {
        id: "SUP-DIFF-02",
        title: "إشعار خصم مكتسب (خصم تعجيل دفع) من المورد",
        desc: "منح المورد الشركة خصماً نقدياً بقيمة 4,000 ج.م ولم يصله إشعار الخصم للمحاسب لإثباته بالدفاتر.",
        type: "UNRECORDED_DISCOUNT",
        amount: 4000,
        adjustmentParty: "OUR_BOOKS",
        correctAJE: {
          dr: supplierCode,
          cr: "5102", // خصم مكتسب
          amount: 4000,
          desc: "إثبات خصم تعجيل الدفع المكتسب من المورد"
        }
      }
    ];

    const supplierStatementBalance = bookBalance + 30000 + 4000;

    return {
      supplierCode: supplierCode,
      supplierName: supplierName,
      internalBookBalance: bookBalance,
      externalStatementBalance: supplierStatementBalance,
      reconciledBalance: bookBalance - 4000,
      discrepancies: discrepancies
    };
  }
}

if (typeof window !== 'undefined') {
  window.EgyptianSimulationModules = EgyptianSimulationModules;
}
if (typeof module !== 'undefined') {
  module.exports = EgyptianSimulationModules;
}
