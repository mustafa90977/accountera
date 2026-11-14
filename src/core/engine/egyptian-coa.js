/**
 * egyptian-coa.js — الدليل المحاسبي المصري الموحد (Egyptian Chart of Accounts v1.0)
 * متوافق مع النظام المحاسبي المصري الموحد، معايير المحاسبة المصرية (EAS)،
 * وقوانين الضرائب المصرية (ضريبة القيمة المضافة 14%، ضريبة الخصم والتحصيل، والتأمينات).
 */

const EGYPTIAN_COA = {
  // ==========================================
  // 1. الأصول (Assets) — تبدأ برقم 1
  // ==========================================
  // الأصول المتداولة (Current Assets)
  "1101": { code: "1101", name: "نقدية بالصندوق (الخزينة الرئيسية)", enName: "Cash on Hand", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1101.001": { code: "1101.001", name: "خزينة المقر الرئيسي", enName: "Main Office Cash", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1101.002": { code: "1101.002", name: "عهدة نقدية مستديمة (مصروفات نثرية)", enName: "Petty Cash Imprest", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1102": { code: "1102", name: "النقدية بالبنوك (حسابات جارية)", enName: "Cash at Banks", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1102.001": { code: "1102.001", name: "البنك الأهلي المصري - جاري ج.م", enName: "NBE Current Account", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1102.002": { code: "1102.002", name: "بنك مصر - جاري ج.م", enName: "Banque Misr Current Account", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1102.003": { code: "1102.003", name: "البنك التجاري الدولي (CIB) - دولار أمريكي", enName: "CIB USD Account", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1103": { code: "1103", name: "العملاء والمدينون التجاريون", enName: "Accounts Receivable", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1103.001": { code: "1103.001", name: "عملاء محليون - قطاع شركات", enName: "Local Corporate Customers", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1103.002": { code: "1103.002", name: "عملاء تجزئة ونقدي", enName: "Retail Customers", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1104": { code: "1104", name: "أوراق القبض (شيكات برسم التحصيل)", enName: "Notes Receivable", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1105": { code: "1105", name: "مخزون البضاعة (بضاعة بالمستودع)", enName: "Merchandise Inventory", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1105.001": { code: "1105.001", name: "مخزن البضاعة التامة (القاهرة)", enName: "Finished Goods Main Warehouse", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1105.002": { code: "1105.002", name: "بضاعة بالطريق واعتمادات مستندية", enName: "Goods in Transit", type: "Asset", category: "Current Asset", normal: "Debit" },

  // الضرائب المدخلة والأرصدة المدينة للضرائب
  "1106": { code: "1106", name: "مصلحة الضرائب - ضريبة القيمة المضافة مدخلات (14%)", enName: "Input VAT (Recoverable)", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1107": { code: "1107", name: "مصلحة الضرائب - خصم وتحصيل تحت حساب الضريبة (1% أو 3%)", enName: "Withholding Tax Receivable", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1108": { code: "1108", name: "مصروفات مدفوعة مقدماً", enName: "Prepaid Expenses", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1108.001": { code: "1108.001", name: "إيجار مدفوع مقدماً", enName: "Prepaid Rent", type: "Asset", category: "Current Asset", normal: "Debit" },
  "1108.002": { code: "1108.002", name: "تأمين مدفوع مقدماً", enName: "Prepaid Insurance", type: "Asset", category: "Current Asset", normal: "Debit" },

  "1109": { code: "1109", name: "إيرادات مستحقة القبض", enName: "Accrued Revenues", type: "Asset", category: "Current Asset", normal: "Debit" },

  // الأصول غير المتداولة (الأصول الثابتة) - Non-Current Assets
  "1201": { code: "1201", name: "الأراضي", enName: "Land", type: "Asset", category: "Fixed Asset", normal: "Debit" },
  "1202": { code: "1202", name: "المباني والإنشاءات", enName: "Buildings", type: "Asset", category: "Fixed Asset", normal: "Debit" },
  "1203": { code: "1203", name: "الآلات والمعدات", enName: "Machinery & Equipment", type: "Asset", category: "Fixed Asset", normal: "Debit" },
  "1204": { code: "1204", name: "وسائل النقل والانتقال (سيارات)", enName: "Vehicles", type: "Asset", category: "Fixed Asset", normal: "Debit" },
  "1205": { code: "1205", name: "أثاث وتجهيزات مكاتب", enName: "Furniture & Fixtures", type: "Asset", category: "Fixed Asset", normal: "Debit" },
  "1206": { code: "1206", name: "أجهزة حاسب آلي وبرمجيات", enName: "Computers & Software", type: "Asset", category: "Fixed Asset", normal: "Debit" },

  // مجمعات الإهلاك (حسابات أصول مقابلة - Contra Assets)
  "1212": { code: "1212", name: "مجمع إهلاك المباني", enName: "Accumulated Depreciation - Buildings", type: "Asset", category: "Contra Asset", normal: "Credit" },
  "1213": { code: "1213", name: "مجمع إهلاك الآلات والمعدات", enName: "Accumulated Depreciation - Machinery", type: "Asset", category: "Contra Asset", normal: "Credit" },
  "1214": { code: "1214", name: "مجمع إهلاك السيارات", enName: "Accumulated Depreciation - Vehicles", type: "Asset", category: "Contra Asset", normal: "Credit" },
  "1215": { code: "1215", name: "مجمع إهلاك الأثاث", enName: "Accumulated Depreciation - Furniture", type: "Asset", category: "Contra Asset", normal: "Credit" },
  "1216": { code: "1216", name: "مجمع إهلاك أجهزة الحاسب الآلي", enName: "Accumulated Depreciation - Computers", type: "Asset", category: "Contra Asset", normal: "Credit" },

  // ==========================================
  // 2. الالتزامات (Liabilities) — تبدأ برقم 2
  // ==========================================
  // الالتزامات المتداولة (Current Liabilities)
  "2101": { code: "2101", name: "الموردون والدائنون التجاريون", enName: "Accounts Payable", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2101.001": { code: "2101.001", name: "موردون محليون - بضاعة", enName: "Local Trade Suppliers", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2101.002": { code: "2101.002", name: "موردو خدمات وصيانة", enName: "Service Vendors", type: "Liability", category: "Current Liability", normal: "Credit" },

  "2102": { code: "2102", name: "مصلحة الضرائب - ضريبة القيمة المضافة مخرجات (14%)", enName: "Output VAT (Payable)", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2103": { code: "2103", name: "مصلحة الضرائب - ضريبة الخصم والتحصيل المستحقة (نموذج 41)", enName: "Withholding Tax Payable", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2104": { code: "2104", name: "مصلحة الضرائب - ضريبة كسب العمل (الرواتب)", enName: "Payroll Tax Payable", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2105": { code: "2105", name: "الهيئة القومية للتأمين الاجتماعي (حصة الشركة والعامل)", enName: "Social Insurance Authority Payable", type: "Liability", category: "Current Liability", normal: "Credit" },

  "2106": { code: "2106", name: "أوراق الدفع (شيكات صادرة للموردين)", enName: "Notes Payable", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2107": { code: "2107", name: "مصروفات مستحقة الدفع", enName: "Accrued Expenses", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2107.001": { code: "2107.001", name: "رواتب وأجور مستحقة", enName: "Accrued Salaries", type: "Liability", category: "Current Liability", normal: "Credit" },
  "2107.002": { code: "2107.002", name: "إيجار مستحق", enName: "Accrued Rent", type: "Liability", category: "Current Liability", normal: "Credit" },

  "2108": { code: "2108", name: "إيرادات محصلة مقدماً (دفعات مقدمة من العملاء)", enName: "Deferred Revenue (Customer Advances)", type: "Liability", category: "Current Liability", normal: "Credit" },

  // الالتزامات طويلة الأجل (Long-term Liabilities)
  "2201": { code: "2201", name: "قروض وتسهيلات بنكية طويلة الأجل", enName: "Long-term Bank Loans", type: "Liability", category: "Long-term Liability", normal: "Credit" },

  // ==========================================
  // 3. حقوق الملكية (Equity) — تبدأ برقم 3
  // ==========================================
  "3101": { code: "3101", name: "رأس المال المدفوع", enName: "Paid-in Capital", type: "Equity", category: "Equity", normal: "Credit" },
  "3102": { code: "3102", name: "احتياطي قانوني (وفق القانون المصري)", enName: "Legal Reserve", type: "Equity", category: "Equity", normal: "Credit" },
  "3103": { code: "3103", name: "أرباح (خسائر) مرحلة / محتجزة", enName: "Retained Earnings", type: "Equity", category: "Equity", normal: "Credit" },
  "3104": { code: "3104", name: "أرباح (خسائر) العام المالي الحالي", enName: "Current Year Net Income", type: "Equity", category: "Equity", normal: "Credit" },
  "3105": { code: "3105", name: "جاري الشركاء / المسحوبات الشخصية", enName: "Partner Current Account / Drawings", type: "Equity", category: "Equity", normal: "Debit" },

  // ==========================================
  // 4. الإيرادات (Revenues) — تبدأ برقم 4
  // ==========================================
  "4101": { code: "4101", name: "إيرادات المبيعات (بضاعة)", enName: "Sales Revenue", type: "Revenue", category: "Operating Revenue", normal: "Credit" },
  "4102": { code: "4102", name: "مردودات ومسموحات المبيعات", enName: "Sales Returns & Allowances", type: "Revenue", category: "Contra Revenue", normal: "Debit" },
  "4103": { code: "4103", name: "خصم مسموح به (خصم تعجيل الدفع)", enName: "Sales Discounts Given", type: "Revenue", category: "Contra Revenue", normal: "Debit" },
  "4104": { code: "4104", name: "إيرادات خدمات واستشارات", enName: "Service Revenues", type: "Revenue", category: "Operating Revenue", normal: "Credit" },
  "4201": { code: "4201", name: "إيرادات تمويلية وفوائد دائنة", enName: "Finance & Interest Income", type: "Revenue", category: "Non-Operating Revenue", normal: "Credit" },
  "4202": { code: "4202", name: "أرباح بيع أصول ثابتة وإيرادات متنوعة", enName: "Gain on Asset Disposal / Misc Income", type: "Revenue", category: "Non-Operating Revenue", normal: "Credit" },

  // ==========================================
  // 5. تكلفة المبيعات والمصروفات (Expenses) — تبدأ برقم 5
  // ==========================================
  // تكلفة النشاط
  "5101": { code: "5101", name: "تكلفة البضاعة المباعة (COGS)", enName: "Cost of Goods Sold", type: "Expense", category: "Direct Cost", normal: "Debit" },
  "5102": { code: "5102", name: "خصم مكتسب (خصم نقدي من الموردين)", enName: "Purchase Discounts Received", type: "Expense", category: "Contra Expense", normal: "Credit" },

  // المصروفات العمومية والإدارية والبيعية
  "5201": { code: "5201", name: "مصروف الأجور والرواتب الأساسية", enName: "Salaries & Wages Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5202": { code: "5202", name: "مصروف إيجار المقرات والمعارض", enName: "Rent Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5203": { code: "5203", name: "مصروف الكهرباء والمياه والإنترنت (المرافق)", enName: "Utilities Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5204": { code: "5204", name: "مصروف إهلاك الأصول الثابتة", enName: "Depreciation Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5205": { code: "5205", name: "مصروف ديون معدومة", enName: "Bad Debt Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5206": { code: "5206", name: "مصروف هبوط أسعار المخزون", enName: "Inventory Obsolescence Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5207": { code: "5207", name: "مصروف الصيانة وقطع الغيار", enName: "Maintenance Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5208": { code: "5208", name: "مصروفات بنكية وعمولات تحصيل", enName: "Bank Charges & Commissions", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5209": { code: "5209", name: "مصروف الدعاية والإعلان والتسويق", enName: "Advertising & Marketing Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5210": { code: "5210", name: "أدوات كتابية ومطبوعات ومهمات", enName: "Stationery & Office Supplies", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5211": { code: "5211", name: "مصروف عجز الخزينة والنقدية", enName: "Cash Shortage Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5212": { code: "5212", name: "حصة الشركة في التأمينات الاجتماعية (18.75%)", enName: "Employer Social Insurance Share", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5213": { code: "5213", name: "مصروف الضيافة والانتقالات والسيارات", enName: "Transportation & Hospitality Expense", type: "Expense", category: "Operating Expense", normal: "Debit" },
  "5301": { code: "5301", name: "مصروف فوائد تمويلية وقروض", enName: "Interest & Finance Expense", type: "Expense", category: "Non-Operating Expense", normal: "Debit" },
  "5302": { code: "5302", name: "خسائر بيع أصول ثابتة ومصروفات استثنائية", enName: "Loss on Asset Disposal / Exceptional", type: "Expense", category: "Non-Operating Expense", normal: "Debit" }
};

if (typeof window !== 'undefined') {
  window.EGYPTIAN_COA = EGYPTIAN_COA;
}
if (typeof module !== 'undefined') {
  module.exports = EGYPTIAN_COA;
}
