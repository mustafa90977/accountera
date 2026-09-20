/**
 * career-paths-and-mentor.js — نظام المسارات المهنية ومحرك السيناريوهات والمراجع الآلي (Phase 3 & 5)
 * 
 * المبادئ الهندسية:
 * 1. AI explains, Accounting Engine decides: المراجع الآلي لا يخترع القيد، بل يفسر الخطأ استناداً لمعايير المحاسبة والقوانين الضريبية المصرية.
 * 2. Career Paths: تخصصات مهنية محددة (محاسب عام، محاسب موردين، محاسب عملاء، محاسب بنوك وخزينة، محاسب ضرائب).
 */

const ACC_CAREER_PATHS = {
  general_accountant: {
    id: "general_accountant",
    title: "محاسب عام (General Accountant)",
    icon: "💼",
    desc: "إتقان قيود اليومية، الأستاذ العام، ميزان المراجعة، قيود التسويات الختامية، وإعداد القوائم المالية.",
    competencies: ["GL", "Adjustments", "Closing", "Financial Statements"]
  },
  ap_accountant: {
    id: "ap_accountant",
    title: "محاسب موردين وحسابات دائنة (AP Accountant)",
    icon: "📦",
    desc: "دورة المشتريات والمخازن، فحص الفواتير الضريبية، المطابقة الثلاثية 3-Way Matching، ومصادقات الموردين.",
    competencies: ["Suppliers", "Purchase Cycle", "Invoice Matching", "Supplier Reconciliation"]
  },
  ar_accountant: {
    id: "ar_accountant",
    title: "محاسب عملاء وحسابات مدينة (AR Accountant)",
    icon: "📈",
    desc: "دورة المبيعات والتحصيل، حدود الائتمان، فواتير البيع الإلكترونية، تقارير أعمار الديون Aging، ومصادقات العملاء.",
    competencies: ["Customers", "Sales Cycle", "Collections", "Aging Reports"]
  },
  treasury_accountant: {
    id: "treasury_accountant",
    title: "محاسب الخزينة والبنوك (Treasury Accountant)",
    icon: "🏦",
    desc: "إدارة الخزائن النقدية، حركات الشيكات وأوراق القبض والدفع، ومذكرات التسوية البنكية الشهرية الشاملة.",
    competencies: ["Cash Flow", "Banks", "Bank Reconciliation", "Petty Cash"]
  },
  tax_accountant: {
    id: "tax_accountant",
    title: "محاسب الضرائب (Tax Accountant)",
    icon: "⚖️",
    desc: "ضريبة القيمة المضافة 14%، ضريبة الخصم والتحصيل (نموذج 41)، وفحص الفروق المؤقتة والدائمة.",
    competencies: ["VAT 14%", "Withholding Tax", "Tax Invoices", "Tax Adjustments"]
  }
};

const EGYPTIAN_STANDARDS_KNOWLEDGE = {
  "EAS_2": {
    standard: "معيار المحاسبة المصري رقم (2) - المخزون",
    internationalEquiv: "IAS 2",
    principle: "تقييم المخزون بالتكلفة أو صافي القيمة البيعية أيهما أقل، وتتضمن تكلفة الشراء ثمن الشراء، الرسوم الجمركية، والضرائب غير المستردة، ومصاريف النقل حتى المستودع، مع استبعاد الخصم التجاري.",
    ruleForAudit: (entry) => {
      // فحص هل تم تحميل مصاريف نقل البضاعة كمصروف بيعي بدلاً من رسملتها على المخزون
      return "وفقاً لمعيار المحاسبة المصري رقم 2، فإن تكاليف نقل البضاعة المشتراة حتى وصولها لمستودعات الشركة تعتبر جزءاً لا يتجزأ من تكلفة المخزون وتُحمل على حساب المخزون (1105) وليس كمصروف فترة مستقل.";
    }
  },
  "EAS_10": {
    standard: "معيار المحاسبة المصري رقم (10) - الأصول الثابتة وإهلاكها",
    internationalEquiv: "IAS 16",
    principle: "رسملة كافة النفقات الضرورية لتجهيز الأصل للتشغيل (نقل، تركيب، تجارب)، وإهلاك القيمة القابلة للإهلاك على مدار العمر الإنتاجي.",
    ruleForAudit: (entry) => {
      return "وفقاً لمعيار المحاسبة المصري رقم 10، نفقات تركيب ونقل الأجهزة والخوادم تُضاف إلى التكلفة التاريخية للأصل الثابت (رسملة) ولا تُسجل كمصروف صيانة دوري.";
    }
  },
  "EAS_48": {
    standard: "معيار المحاسبة المصري رقم (48) - الإيراد من العقود مع العملاء",
    internationalEquiv: "IFRS 15",
    principle: "الاعتراف بالإيراد عند الوفاء بالتزام الأداء (انتقال السيطرة على البضاعة أو أداء الخدمة).",
    ruleForAudit: (entry) => {
      return "طبقاً لمعيار المحاسبة المصري رقم 48، لا يجوز الاعتراف بالإيراد بمجرد استلام النقدية مقدماً، بل يجب إثباتها كالتزام متداول (عملاء - دفعات مقدمة 2108) حتى يتم تسليم البضاعة أو الخدمة فعلياً.";
    }
  },
  "TAX_VAT_LAW": {
    standard: "قانون الضريبة على القيمة المضافة المصري رقم 67 لسنة 2016",
    principle: "السعر العام للضريبة 14% على السلع والخدمات ما لم ينص القانون على إعفاء أو سعر جدول، وتخصم ضريبة المدخلات من ضريبة المخرجات عند تقديم الإقرار الشهري.",
    ruleForAudit: (entry) => {
      return "وفقاً لقانون القيمة المضافة المصري، الفواتير الضريبية المسجلة تلزم المشتري بإثبات ضريبة القيمة المضافة كـ أصل مدين (1106 ضريبة مدخلات قابلة للخصم) بقيمة 14% من ثمن البضاعة الخاضعة.";
    }
  }
};

class AISeniorAuditor {
  constructor(accountingCore) {
    this.core = accountingCore;
  }

  generateAuditDiagnosis(studentEntry, expectedEntry, evalReport) {
    const findings = [];

    if (evalReport.isPassed) {
      return {
        isClean: true,
        auditorMessage: "تم فحص القيد والمستند: القيد متزن وسليم ومطابق تماماً لمعايير المحاسبة والقوانين الضريبية المصرية.",
        standardsReferenced: ["معايير المحاسبة المصرية (EAS)"]
      };
    }

    // 1. فحص الخطأ في الضريبة
    if (!evalReport.levels.level5_vat.passed) {
      findings.push({
        area: "الالتزام الضريبي (Tax Compliance)",
        issue: "إغفال قيد ضريبة القيمة المضافة (14%) أو ضريبة الخصم والتحصيل.",
        reference: EGYPTIAN_STANDARDS_KNOWLEDGE["TAX_VAT_LAW"].standard,
        explanation: EGYPTIAN_STANDARDS_KNOWLEDGE["TAX_VAT_LAW"].ruleForAudit(studentEntry)
      });
    }

    // 2. فحص الخطأ في رسملة الأصول والمخزون
    const sCodes = (studentEntry.lines || []).map(l => String(l.accountCode));
    if (sCodes.includes('5208') && expectedEntry.lines.some(l => l.accountCode.startsWith('12'))) {
      findings.push({
        area: "معالجة الأصول الثابتة (Capital Expenditure)",
        issue: "تسجيل شراء أصل ثابت أو تجهيزه كمصروف صيانة دوري (Revenue Expenditure Error).",
        reference: EGYPTIAN_STANDARDS_KNOWLEDGE["EAS_10"].standard,
        explanation: EGYPTIAN_STANDARDS_KNOWLEDGE["EAS_10"].ruleForAudit(studentEntry)
      });
    }

    // 3. فحص الخطأ في عكس المدين والدائن
    if (!evalReport.levels.level2_sides.passed) {
      findings.push({
        area: "التوجيه المحاسبي (Debit/Credit Inversion)",
        issue: "تم عكس طرفي القيد المحاسبي.",
        reference: "القواعد الأساسية للقيد المزدوج الإيطالي والمعايير المصرية",
        explanation: "الأصول والمصروفات تزيد في الجانب المدين وتنقص في الجانب الدائن، بينما الالتزامات وحقوق الملكية والإيرادات تزيد في الجانب الدائن وتنقص في الجانب المدين."
      });
    }

    return {
      isClean: false,
      auditorTitle: "المراجع المحاسبي المعتمد (Virtual Senior Auditor)",
      auditorMessage: `تم اكتشاف ${findings.length} ملاحظة تدقيقية على هذه المعاملة:`,
      findings: findings
    };
  }
}

if (typeof window !== 'undefined') {
  window.ACC_CAREER_PATHS = ACC_CAREER_PATHS;
  window.EGYPTIAN_STANDARDS_KNOWLEDGE = EGYPTIAN_STANDARDS_KNOWLEDGE;
  window.AISeniorAuditor = AISeniorAuditor;
}
if (typeof module !== 'undefined') {
  module.exports = {
    ACC_CAREER_PATHS,
    EGYPTIAN_STANDARDS_KNOWLEDGE,
    AISeniorAuditor
  };
}
