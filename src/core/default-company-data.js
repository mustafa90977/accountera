/**
 * default-company-data.js — البيانات الأساسية لشركة التدريب (شركة النور)
 */
const DEFAULT_PLATFORM_COMPANY = {
  "id": "comp-al-noor",
  "name": "شركة النور",
  "sector": "تجارة الاجهزه (خدمي وتوزيع)",
  "badge": "بيئة أعمال متكاملة",
  "icon": "💡",
  "role": "محاسب عام",
  "capital": 2000000,
  "description": "بيئة تدريبية ومحاكاة محاسبية متكاملة لـ شركة النور مع دورة تدريبية واقعية بـ 111 سند مالي وقيد افتتاحي معتمد.",
  "month": "السنة المالية 2026",
  "transactions": [
    {
      "id": "Q-001",
      "num": 1,
      "title": "Opening Balance",
      "desc": "Opening Bank (رصيد بنك افتتاحي)",
      "type": "Opening Balance",
      "date": "2026-01-15",
      "amount": 1800000,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "2101.001",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 300000,
          "credit": 0,
          "description": "Opening Bank (رصيد بنك افتتاحي)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 400000,
          "credit": 0,
          "description": "Opening Inventory (رصيد مخزون افتتاحي)"
        },
        {
          "lineNum": 3,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 900000,
          "credit": 0,
          "description": "Opening Fixed Assets (أصول ثابتة افتتاحية)"
        },
        {
          "lineNum": 4,
          "accountCode": "1103.001",
          "accountName": "مؤسسة الشرق للجملة ذ.م.م",
          "acctType": "Asset",
          "debit": 4018,
          "credit": 0,
          "description": "Opening AR - مؤسسة الشرق للجملة ذ.م.م"
        },
        {
          "lineNum": 5,
          "accountCode": "1103.002",
          "accountName": "مصنع الحديثة للخدمات ذ.م.م",
          "acctType": "Asset",
          "debit": 3069,
          "credit": 0,
          "description": "Opening AR - مصنع الحديثة للخدمات ذ.م.م"
        },
        {
          "lineNum": 6,
          "accountCode": "1103.003",
          "accountName": "مؤسسة المجد للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 4122,
          "credit": 0,
          "description": "Opening AR - مؤسسة المجد للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 7,
          "accountCode": "1103.004",
          "accountName": "مصنع الغرب للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 4191,
          "credit": 0,
          "description": "Opening AR - مصنع الغرب للتسويق ش.م.م"
        },
        {
          "lineNum": 8,
          "accountCode": "1103.005",
          "accountName": "معرض الوفاء للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 4589,
          "credit": 0,
          "description": "Opening AR - معرض الوفاء للتسويق ش.م.م"
        },
        {
          "lineNum": 9,
          "accountCode": "1103.006",
          "accountName": "شركة النور للجملة تضامن",
          "acctType": "Asset",
          "debit": 3748,
          "credit": 0,
          "description": "Opening AR - شركة النور للجملة تضامن"
        },
        {
          "lineNum": 10,
          "accountCode": "1103.007",
          "accountName": "مصنع المستقبل للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 2539,
          "credit": 0,
          "description": "Opening AR - مصنع المستقبل للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 11,
          "accountCode": "1103.008",
          "accountName": "معرض المجد للمقاولات ش.م.م",
          "acctType": "Asset",
          "debit": 2015,
          "credit": 0,
          "description": "Opening AR - معرض المجد للمقاولات ش.م.م"
        },
        {
          "lineNum": 12,
          "accountCode": "1103.009",
          "accountName": "مجموعة الحديثة للتجزئة لصاحبها",
          "acctType": "Asset",
          "debit": 2592,
          "credit": 0,
          "description": "Opening AR - مجموعة الحديثة للتجزئة لصاحبها"
        },
        {
          "lineNum": 13,
          "accountCode": "1103.010",
          "accountName": "مجموعة المستقبل للخدمات تضامن",
          "acctType": "Asset",
          "debit": 5772,
          "credit": 0,
          "description": "Opening AR - مجموعة المستقبل للخدمات تضامن"
        },
        {
          "lineNum": 14,
          "accountCode": "1103.011",
          "accountName": "مؤسسة الرواد للجملة توصية بسيطة",
          "acctType": "Asset",
          "debit": 2277,
          "credit": 0,
          "description": "Opening AR - مؤسسة الرواد للجملة توصية بسيطة"
        },
        {
          "lineNum": 15,
          "accountCode": "1103.012",
          "accountName": "مؤسسة الوفاء للتسويق توصية بسيطة",
          "acctType": "Asset",
          "debit": 5482,
          "credit": 0,
          "description": "Opening AR - مؤسسة الوفاء للتسويق توصية بسيطة"
        },
        {
          "lineNum": 16,
          "accountCode": "1103.013",
          "accountName": "معرض المستقبل للخدمات تضامن",
          "acctType": "Asset",
          "debit": 3721,
          "credit": 0,
          "description": "Opening AR - معرض المستقبل للخدمات تضامن"
        },
        {
          "lineNum": 17,
          "accountCode": "1103.014",
          "accountName": "مؤسسة الأمل للمقاولات ذ.م.م",
          "acctType": "Asset",
          "debit": 4009,
          "credit": 0,
          "description": "Opening AR - مؤسسة الأمل للمقاولات ذ.م.م"
        },
        {
          "lineNum": 18,
          "accountCode": "1103.015",
          "accountName": "مصنع المستقبل للتجزئة تضامن",
          "acctType": "Asset",
          "debit": 2395,
          "credit": 0,
          "description": "Opening AR - مصنع المستقبل للتجزئة تضامن"
        },
        {
          "lineNum": 19,
          "accountCode": "1103.016",
          "accountName": "معرض الأمل للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 5286,
          "credit": 0,
          "description": "Opening AR - معرض الأمل للتسويق ش.م.م"
        },
        {
          "lineNum": 20,
          "accountCode": "1103.017",
          "accountName": "مصنع الغرب للجملة تضامن",
          "acctType": "Asset",
          "debit": 2226,
          "credit": 0,
          "description": "Opening AR - مصنع الغرب للجملة تضامن"
        },
        {
          "lineNum": 21,
          "accountCode": "1103.018",
          "accountName": "شركة الشرق للجملة ذ.م.م",
          "acctType": "Asset",
          "debit": 3482,
          "credit": 0,
          "description": "Opening AR - شركة الشرق للجملة ذ.م.م"
        },
        {
          "lineNum": 22,
          "accountCode": "1103.019",
          "accountName": "مصنع المستقبل للجملة توصية بسيطة",
          "acctType": "Asset",
          "debit": 2918,
          "credit": 0,
          "description": "Opening AR - مصنع المستقبل للجملة توصية بسيطة"
        },
        {
          "lineNum": 23,
          "accountCode": "1103.020",
          "accountName": "مؤسسة الأمل للتسويق ذ.م.م",
          "acctType": "Asset",
          "debit": 4811,
          "credit": 0,
          "description": "Opening AR - مؤسسة الأمل للتسويق ذ.م.م"
        },
        {
          "lineNum": 24,
          "accountCode": "1103.021",
          "accountName": "شركة العالمية للمقاولات لصاحبها",
          "acctType": "Asset",
          "debit": 4256,
          "credit": 0,
          "description": "Opening AR - شركة العالمية للمقاولات لصاحبها"
        },
        {
          "lineNum": 25,
          "accountCode": "1103.022",
          "accountName": "معرض السلام للمقاولات تضامن",
          "acctType": "Asset",
          "debit": 2378,
          "credit": 0,
          "description": "Opening AR - معرض السلام للمقاولات تضامن"
        },
        {
          "lineNum": 26,
          "accountCode": "1103.023",
          "accountName": "شركة النور للمقاولات توصية بسيطة",
          "acctType": "Asset",
          "debit": 5865,
          "credit": 0,
          "description": "Opening AR - شركة النور للمقاولات توصية بسيطة"
        },
        {
          "lineNum": 27,
          "accountCode": "1103.024",
          "accountName": "مؤسسة المجد للجملة ش.م.م",
          "acctType": "Asset",
          "debit": 5000,
          "credit": 0,
          "description": "Opening AR - مؤسسة المجد للجملة ش.م.م"
        },
        {
          "lineNum": 28,
          "accountCode": "1103.025",
          "accountName": "مؤسسة النجاح للخدمات لصاحبها",
          "acctType": "Asset",
          "debit": 4644,
          "credit": 0,
          "description": "Opening AR - مؤسسة النجاح للخدمات لصاحبها"
        },
        {
          "lineNum": 29,
          "accountCode": "1103.026",
          "accountName": "شركة التوفيق للخدمات ذ.م.م",
          "acctType": "Asset",
          "debit": 5185,
          "credit": 0,
          "description": "Opening AR - شركة التوفيق للخدمات ذ.م.م"
        },
        {
          "lineNum": 30,
          "accountCode": "1103.027",
          "accountName": "مؤسسة الوفاء للخدمات توصية بسيطة",
          "acctType": "Asset",
          "debit": 4195,
          "credit": 0,
          "description": "Opening AR - مؤسسة الوفاء للخدمات توصية بسيطة"
        },
        {
          "lineNum": 31,
          "accountCode": "1103.028",
          "accountName": "مؤسسة الهدى للتسويق ذ.م.م",
          "acctType": "Asset",
          "debit": 5219,
          "credit": 0,
          "description": "Opening AR - مؤسسة الهدى للتسويق ذ.م.م"
        },
        {
          "lineNum": 32,
          "accountCode": "1103.029",
          "accountName": "مجموعة الشرق للخدمات تضامن",
          "acctType": "Asset",
          "debit": 4108,
          "credit": 0,
          "description": "Opening AR - مجموعة الشرق للخدمات تضامن"
        },
        {
          "lineNum": 33,
          "accountCode": "1103.030",
          "accountName": "مؤسسة المجد للجملة ذ.م.م",
          "acctType": "Asset",
          "debit": 2707,
          "credit": 0,
          "description": "Opening AR - مؤسسة المجد للجملة ذ.م.م"
        },
        {
          "lineNum": 34,
          "accountCode": "1103.031",
          "accountName": "مصنع السلام للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 2312,
          "credit": 0,
          "description": "Opening AR - مصنع السلام للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 35,
          "accountCode": "1103.032",
          "accountName": "مؤسسة الأمل للجملة ش.م.م",
          "acctType": "Asset",
          "debit": 2383,
          "credit": 0,
          "description": "Opening AR - مؤسسة الأمل للجملة ش.م.م"
        },
        {
          "lineNum": 36,
          "accountCode": "1103.033",
          "accountName": "مجموعة السلام للخدمات ذ.م.م",
          "acctType": "Asset",
          "debit": 2238,
          "credit": 0,
          "description": "Opening AR - مجموعة السلام للخدمات ذ.م.م"
        },
        {
          "lineNum": 37,
          "accountCode": "1103.034",
          "accountName": "مصنع المستقبل للتسويق تضامن",
          "acctType": "Asset",
          "debit": 3051,
          "credit": 0,
          "description": "Opening AR - مصنع المستقبل للتسويق تضامن"
        },
        {
          "lineNum": 38,
          "accountCode": "1103.035",
          "accountName": "شركة المستقبل للخدمات لصاحبها",
          "acctType": "Asset",
          "debit": 4688,
          "credit": 0,
          "description": "Opening AR - شركة المستقبل للخدمات لصاحبها"
        },
        {
          "lineNum": 39,
          "accountCode": "1103.036",
          "accountName": "معرض الوفاء للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 4673,
          "credit": 0,
          "description": "Opening AR - معرض الوفاء للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 40,
          "accountCode": "1103.037",
          "accountName": "معرض السلام للجملة تضامن",
          "acctType": "Asset",
          "debit": 4244,
          "credit": 0,
          "description": "Opening AR - معرض السلام للجملة تضامن"
        },
        {
          "lineNum": 41,
          "accountCode": "1103.038",
          "accountName": "معرض الاتحاد للتسويق لصاحبها",
          "acctType": "Asset",
          "debit": 5906,
          "credit": 0,
          "description": "Opening AR - معرض الاتحاد للتسويق لصاحبها"
        },
        {
          "lineNum": 42,
          "accountCode": "1103.039",
          "accountName": "مصنع النور للتجزئة ش.م.م",
          "acctType": "Asset",
          "debit": 2088,
          "credit": 0,
          "description": "Opening AR - مصنع النور للتجزئة ش.م.م"
        },
        {
          "lineNum": 43,
          "accountCode": "1103.040",
          "accountName": "مجموعة الغرب للمقاولات لصاحبها",
          "acctType": "Asset",
          "debit": 3587,
          "credit": 0,
          "description": "Opening AR - مجموعة الغرب للمقاولات لصاحبها"
        },
        {
          "lineNum": 44,
          "accountCode": "1103.041",
          "accountName": "معرض الشرق للتسويق لصاحبها",
          "acctType": "Asset",
          "debit": 3351,
          "credit": 0,
          "description": "Opening AR - معرض الشرق للتسويق لصاحبها"
        },
        {
          "lineNum": 45,
          "accountCode": "1103.042",
          "accountName": "مجموعة الهدى للخدمات لصاحبها",
          "acctType": "Asset",
          "debit": 3136,
          "credit": 0,
          "description": "Opening AR - مجموعة الهدى للخدمات لصاحبها"
        },
        {
          "lineNum": 46,
          "accountCode": "1103.043",
          "accountName": "مصنع الهدى للتسويق توصية بسيطة",
          "acctType": "Asset",
          "debit": 5332,
          "credit": 0,
          "description": "Opening AR - مصنع الهدى للتسويق توصية بسيطة"
        },
        {
          "lineNum": 47,
          "accountCode": "1103.044",
          "accountName": "مؤسسة الحديثة للتجزئة ذ.م.م",
          "acctType": "Asset",
          "debit": 4146,
          "credit": 0,
          "description": "Opening AR - مؤسسة الحديثة للتجزئة ذ.م.م"
        },
        {
          "lineNum": 48,
          "accountCode": "1103.045",
          "accountName": "شركة الأمل للمقاولات توصية بسيطة",
          "acctType": "Asset",
          "debit": 2819,
          "credit": 0,
          "description": "Opening AR - شركة الأمل للمقاولات توصية بسيطة"
        },
        {
          "lineNum": 49,
          "accountCode": "1103.046",
          "accountName": "معرض المستقبل للخدمات توصية بسيطة",
          "acctType": "Asset",
          "debit": 5777,
          "credit": 0,
          "description": "Opening AR - معرض المستقبل للخدمات توصية بسيطة"
        },
        {
          "lineNum": 50,
          "accountCode": "1103.047",
          "accountName": "شركة المجد للتجزئة ش.م.م",
          "acctType": "Asset",
          "debit": 5808,
          "credit": 0,
          "description": "Opening AR - شركة المجد للتجزئة ش.م.م"
        },
        {
          "lineNum": 51,
          "accountCode": "1103.048",
          "accountName": "مصنع العالمية للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 3065,
          "credit": 0,
          "description": "Opening AR - مصنع العالمية للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 52,
          "accountCode": "1103.049",
          "accountName": "مجموعة الوفاء للخدمات تضامن",
          "acctType": "Asset",
          "debit": 4073,
          "credit": 0,
          "description": "Opening AR - مجموعة الوفاء للخدمات تضامن"
        },
        {
          "lineNum": 53,
          "accountCode": "1103.050",
          "accountName": "مجموعة المجد للجملة ش.م.م",
          "acctType": "Asset",
          "debit": 10504,
          "credit": 0,
          "description": "Opening AR - مجموعة المجد للجملة ش.م.م"
        },
        {
          "lineNum": 54,
          "accountCode": "2101.001",
          "accountName": "مصنع الوفاء للتوزيع توصية بسيطة",
          "acctType": "Liability",
          "debit": 0,
          "credit": 27200,
          "description": "Opening AP - مصنع الوفاء للتوزيع توصية بسيطة"
        },
        {
          "lineNum": 55,
          "accountCode": "2101.002",
          "accountName": "شركة الاتحاد للاستيراد والتصدير توصية بسيطة",
          "acctType": "Liability",
          "debit": 0,
          "credit": 28706,
          "description": "Opening AP - شركة الاتحاد للاستيراد والتصدير توصية بسيطة"
        },
        {
          "lineNum": 56,
          "accountCode": "2101.003",
          "accountName": "معرض الاتحاد للاستيراد والتصدير لصاحبها",
          "acctType": "Liability",
          "debit": 0,
          "credit": 23699,
          "description": "Opening AP - معرض الاتحاد للاستيراد والتصدير لصاحبها"
        },
        {
          "lineNum": 57,
          "accountCode": "2101.004",
          "accountName": "مصنع المجد للتجارة تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 21370,
          "description": "Opening AP - مصنع المجد للتجارة تضامن"
        },
        {
          "lineNum": 58,
          "accountCode": "2101.005",
          "accountName": "مصنع الشرق للتجارة تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 26198,
          "description": "Opening AP - مصنع الشرق للتجارة تضامن"
        },
        {
          "lineNum": 59,
          "accountCode": "2101.006",
          "accountName": "معرض النور للتوريدات ش.م.م",
          "acctType": "Liability",
          "debit": 0,
          "credit": 16239,
          "description": "Opening AP - معرض النور للتوريدات ش.م.م"
        },
        {
          "lineNum": 60,
          "accountCode": "2101.007",
          "accountName": "مؤسسة النور للتجارة توصية بسيطة",
          "acctType": "Liability",
          "debit": 0,
          "credit": 19880,
          "description": "Opening AP - مؤسسة النور للتجارة توصية بسيطة"
        },
        {
          "lineNum": 61,
          "accountCode": "2101.008",
          "accountName": "مجموعة النور للتجارة لصاحبها",
          "acctType": "Liability",
          "debit": 0,
          "credit": 25005,
          "description": "Opening AP - مجموعة النور للتجارة لصاحبها"
        },
        {
          "lineNum": 62,
          "accountCode": "2101.009",
          "accountName": "مجموعة الحديثة للاستيراد والتصدير تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 11703,
          "description": "Opening AP - مجموعة الحديثة للاستيراد والتصدير تضامن"
        },
        {
          "lineNum": 63,
          "accountCode": "3101",
          "accountName": "Capital (رأس المال)",
          "acctType": "Equity",
          "debit": 0,
          "credit": 1600000,
          "description": "Opening Capital (رأس مال افتتاحي)"
        }
      ]
    },
    {
      "id": "Q-002",
      "num": 2,
      "title": "Purchase Return",
      "desc": "AP Reduction (تخفيض حساب الموردين)",
      "type": "Purchase Return",
      "date": "2026-01-15",
      "amount": 4485,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2101.001",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2101.001",
          "accountName": "مصنع الوفاء للتوزيع توصية بسيطة",
          "acctType": "Liability",
          "debit": 4485,
          "credit": 0,
          "description": "AP Reduction (تخفيض حساب الموردين)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 585,
          "description": "Input VAT Reversal (عكس ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3900,
          "description": "Inventory Return (مردودات مخزون)"
        }
      ]
    },
    {
      "id": "Q-003",
      "num": 3,
      "title": "Inventory Adjustment",
      "desc": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)",
      "type": "Inventory Adjustment",
      "date": "2026-01-15",
      "amount": 3500,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 3500,
          "credit": 0,
          "description": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3500,
          "description": "Inv Reduction (تخفيض حساب المخزون)"
        }
      ]
    },
    {
      "id": "Q-004",
      "num": 4,
      "title": "Unearned Revenue",
      "desc": "Cash Received in Advance (نقدية مستلمة مقدماً)",
      "type": "Unearned Revenue",
      "date": "2026-01-15",
      "amount": 18000,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "2104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 18000,
          "credit": 0,
          "description": "Cash Received in Advance (نقدية مستلمة مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 18000,
          "description": "Unearned Revenue (إيرادات غير مكتسبة)"
        }
      ]
    },
    {
      "id": "Q-005",
      "num": 5,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 9000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 9000,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 9000,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-006",
      "num": 6,
      "title": "Purchase Return",
      "desc": "AP Reduction (تخفيض حساب الموردين)",
      "type": "Purchase Return",
      "date": "2026-01-15",
      "amount": 2760,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2101.001",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2101.001",
          "accountName": "مصنع الوفاء للتوزيع توصية بسيطة",
          "acctType": "Liability",
          "debit": 2760,
          "credit": 0,
          "description": "AP Reduction (تخفيض حساب الموردين)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 360,
          "description": "Input VAT Reversal (عكس ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2400,
          "description": "Inventory Return (مردودات مخزون)"
        }
      ]
    },
    {
      "id": "Q-007",
      "num": 7,
      "title": "Bank Charges",
      "desc": "Bank Fees & Commissions (رسوم ومصاريف بنكية)",
      "type": "Bank Charges",
      "date": "2026-01-15",
      "amount": 372,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5208",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5208",
          "accountName": "Bank Charges (مصروفات بنكية)",
          "acctType": "Expense",
          "debit": 372,
          "credit": 0,
          "description": "Bank Fees & Commissions (رسوم ومصاريف بنكية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 372,
          "description": "Bank Outflow (خصم مصاريف بنكية)"
        }
      ]
    },
    {
      "id": "Q-008",
      "num": 8,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 6000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 6000,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 6000,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-009",
      "num": 9,
      "title": "Inventory Adjustment",
      "desc": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)",
      "type": "Inventory Adjustment",
      "date": "2026-01-15",
      "amount": 1900,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 1900,
          "credit": 0,
          "description": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1900,
          "description": "Inv Reduction (تخفيض حساب المخزون)"
        }
      ]
    },
    {
      "id": "Q-010",
      "num": 10,
      "title": "Payroll",
      "desc": "Salaries (رواتب)",
      "type": "Payroll",
      "date": "2026-01-15",
      "amount": 11000,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5201",
      "cr": "2105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5201",
          "accountName": "Salaries Expense (مصروف رواتب)",
          "acctType": "Expense",
          "debit": 11000,
          "credit": 0,
          "description": "Salaries (رواتب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 1100,
          "description": "Taxes (ضرائب)"
        },
        {
          "lineNum": 3,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 550,
          "description": "Social Ins (تأمينات)"
        },
        {
          "lineNum": 4,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 9350,
          "description": "Net Pay (صافي الدفع)"
        }
      ]
    },
    {
      "id": "Q-011",
      "num": 11,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - شركة المستقبل للخدمات لصاحبها",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 141864,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.035",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.035",
          "accountName": "شركة المستقبل للخدمات لصاحبها",
          "acctType": "Asset",
          "debit": 141864,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - شركة المستقبل للخدمات لصاحبها"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 123360,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 18504,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-012",
      "num": 12,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 102800,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 102800,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 102800,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-013",
      "num": 13,
      "title": "Payment",
      "desc": "Payment (دفعة للمورد)",
      "type": "Payment",
      "date": "2026-01-15",
      "amount": 17800,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2101.001",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2101.001",
          "accountName": "مصنع الوفاء للتوزيع توصية بسيطة",
          "acctType": "Liability",
          "debit": 17800,
          "credit": 0,
          "description": "Payment (دفعة للمورد)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 17800,
          "description": "Bank Outflow (تدفق بنكي خارج)"
        }
      ]
    },
    {
      "id": "Q-014",
      "num": 14,
      "title": "Cash Sale",
      "desc": "Cash Sale (بيع نقدي)",
      "type": "Cash Sale",
      "date": "2026-01-15",
      "amount": 38502,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 38502,
          "credit": 0,
          "description": "Cash Sale (بيع نقدي)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 33480,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 5022,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-015",
      "num": 15,
      "title": "Cash Sale COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "Cash Sale COGS",
      "date": "2026-01-15",
      "amount": 27900,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 27900,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 27900,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-016",
      "num": 16,
      "title": "Asset Disposal",
      "desc": "Disposal Proceeds (متحصلات استبعاد أصول)",
      "type": "Asset Disposal",
      "date": "2026-01-15",
      "amount": 41342,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1201",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 41342,
          "credit": 0,
          "description": "Disposal Proceeds (متحصلات استبعاد أصول)"
        },
        {
          "lineNum": 2,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 40000,
          "description": "Remove Asset (إقفال تكلفة الأصل)"
        },
        {
          "lineNum": 3,
          "accountCode": "4201",
          "accountName": "Gain on Asset Disposal (أرباح استبعاد أصول)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 1342,
          "description": "Gain on Disposal (أرباح استبعاد)"
        }
      ]
    },
    {
      "id": "Q-017",
      "num": 17,
      "title": "Prepayment",
      "desc": "Prepaid Rent (إيجار مدفوع مقدماً)",
      "type": "Prepayment",
      "date": "2026-01-15",
      "amount": 18000,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1105",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 18000,
          "credit": 0,
          "description": "Prepaid Rent (إيجار مدفوع مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 18000,
          "description": "Bank Outflow (سداد بنكي للإيجار)"
        }
      ]
    },
    {
      "id": "Q-018",
      "num": 18,
      "title": "Collection",
      "desc": "Collection from 1103.001 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 4018,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.001",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 4018,
          "credit": 0,
          "description": "Collection from 1103.001 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.001",
          "accountName": "مؤسسة الشرق للجملة ذ.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4018,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-019",
      "num": 19,
      "title": "Bank Transfer In",
      "desc": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)",
      "type": "Bank Transfer In",
      "date": "2026-01-15",
      "amount": 7500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 7500,
          "credit": 0,
          "description": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 7500,
          "description": "Cash Transfer Out (صرف من الخزينة للإيداع البنكي)"
        }
      ]
    },
    {
      "id": "Q-020",
      "num": 20,
      "title": "Asset Purchase",
      "desc": "Fixed Asset Purchase (شراء أصل ثابت)",
      "type": "Asset Purchase",
      "date": "2026-01-15",
      "amount": 58650,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1201",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 51000,
          "credit": 0,
          "description": "Fixed Asset Purchase (شراء أصل ثابت)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 7650,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات على الأصول)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 58650,
          "description": "Bank Outflow (سداد قيمة الأصل)"
        }
      ]
    },
    {
      "id": "Q-021",
      "num": 21,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 3500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 3500,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3500,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-022",
      "num": 22,
      "title": "Unearned Revenue",
      "desc": "Cash Received in Advance (نقدية مستلمة مقدماً)",
      "type": "Unearned Revenue",
      "date": "2026-01-15",
      "amount": 29400,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "2104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 29400,
          "credit": 0,
          "description": "Cash Received in Advance (نقدية مستلمة مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 29400,
          "description": "Unearned Revenue (إيرادات غير مكتسبة)"
        }
      ]
    },
    {
      "id": "Q-023",
      "num": 23,
      "title": "Collection",
      "desc": "Collection from 1103.002 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 3069,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.002",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 3069,
          "credit": 0,
          "description": "Collection from 1103.002 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.002",
          "accountName": "مصنع الحديثة للخدمات ذ.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3069,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-024",
      "num": 24,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - مصنع السلام للتجزئة توصية بسيطة",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 46092,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.031",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.031",
          "accountName": "مصنع السلام للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 46092,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - مصنع السلام للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 40080,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 6012,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-025",
      "num": 25,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 33400,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 33400,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 33400,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-026",
      "num": 26,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 8000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 8000,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 8000,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-027",
      "num": 27,
      "title": "Cash Shortage",
      "desc": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)",
      "type": "Cash Shortage",
      "date": "2026-01-15",
      "amount": 121,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5211",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5211",
          "accountName": "Cash Shortage Expense (عجز الخزينة)",
          "acctType": "Expense",
          "debit": 121,
          "credit": 0,
          "description": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 121,
          "description": "Cash Reduction (تخفيض رصيد الصندوق)"
        }
      ]
    },
    {
      "id": "Q-028",
      "num": 28,
      "title": "Bank Charges",
      "desc": "Bank Fees & Commissions (رسوم ومصاريف بنكية)",
      "type": "Bank Charges",
      "date": "2026-01-15",
      "amount": 393,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5208",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5208",
          "accountName": "Bank Charges (مصروفات بنكية)",
          "acctType": "Expense",
          "debit": 393,
          "credit": 0,
          "description": "Bank Fees & Commissions (رسوم ومصاريف بنكية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 393,
          "description": "Bank Outflow (خصم مصاريف بنكية)"
        }
      ]
    },
    {
      "id": "Q-029",
      "num": 29,
      "title": "Payroll Settlement",
      "desc": "Taxes Settlement (تسوية ضرائب)",
      "type": "Payroll Settlement",
      "date": "2026-01-15",
      "amount": 1650,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2105",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 1100,
          "credit": 0,
          "description": "Taxes Settlement (تسوية ضرائب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 550,
          "credit": 0,
          "description": "Social Ins Settlement (تسوية تأمينات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1650,
          "description": "Bank Outflow (تدفق بنكي خارج)"
        }
      ]
    },
    {
      "id": "Q-030",
      "num": 30,
      "title": "Expense",
      "desc": "Rent Expense (مصروف إيجار)",
      "type": "Expense",
      "date": "2026-01-15",
      "amount": 5300,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 3100,
          "credit": 0,
          "description": "Rent Expense (مصروف إيجار)"
        },
        {
          "lineNum": 2,
          "accountCode": "5203",
          "accountName": "Utilities Expense (مصروف مرافق)",
          "acctType": "Expense",
          "debit": 2200,
          "credit": 0,
          "description": "Utilities Expense (مصروف مرافق)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 5300,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-031",
      "num": 31,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-032",
      "num": 32,
      "title": "Expense",
      "desc": "Rent Expense (مصروف إيجار)",
      "type": "Expense",
      "date": "2026-01-15",
      "amount": 7150,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 5700,
          "credit": 0,
          "description": "Rent Expense (مصروف إيجار)"
        },
        {
          "lineNum": 2,
          "accountCode": "5203",
          "accountName": "Utilities Expense (مصروف مرافق)",
          "acctType": "Expense",
          "debit": 1450,
          "credit": 0,
          "description": "Utilities Expense (مصروف مرافق)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 7150,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-033",
      "num": 33,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-034",
      "num": 34,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - شركة النور للمقاولات توصية بسيطة",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 99084,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.023",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.023",
          "accountName": "شركة النور للمقاولات توصية بسيطة",
          "acctType": "Asset",
          "debit": 99084,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - شركة النور للمقاولات توصية بسيطة"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 86160,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 12924,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-035",
      "num": 35,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 71800,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 71800,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 71800,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-036",
      "num": 36,
      "title": "Collection",
      "desc": "Collection from 1103.003 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 4122,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.003",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 4122,
          "credit": 0,
          "description": "Collection from 1103.003 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.003",
          "accountName": "مؤسسة المجد للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4122,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-037",
      "num": 37,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - مصنع الغرب للتسويق ش.م.م",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 96129.15,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.004",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.004",
          "accountName": "مصنع الغرب للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 90230.15,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - مصنع الغرب للتسويق ش.م.م"
        },
        {
          "lineNum": 2,
          "accountCode": "4104",
          "accountName": "Sales Discount (خصم مسموح به)",
          "acctType": "Contra Revenue",
          "debit": 5899,
          "credit": 0,
          "description": "Sales Discount (خصم مبيعات)"
        },
        {
          "lineNum": 3,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 84360,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 4,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 11769.15,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-038",
      "num": 38,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 70300,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 70300,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 70300,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-039",
      "num": 39,
      "title": "Prepayment",
      "desc": "Prepaid Rent (إيجار مدفوع مقدماً)",
      "type": "Prepayment",
      "date": "2026-01-15",
      "amount": 6600,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1105",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 6600,
          "credit": 0,
          "description": "Prepaid Rent (إيجار مدفوع مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 6600,
          "description": "Bank Outflow (سداد بنكي للإيجار)"
        }
      ]
    },
    {
      "id": "Q-040",
      "num": 40,
      "title": "Expense",
      "desc": "Rent Expense (مصروف إيجار)",
      "type": "Expense",
      "date": "2026-01-15",
      "amount": 6450,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 5000,
          "credit": 0,
          "description": "Rent Expense (مصروف إيجار)"
        },
        {
          "lineNum": 2,
          "accountCode": "5203",
          "accountName": "Utilities Expense (مصروف مرافق)",
          "acctType": "Expense",
          "debit": 1450,
          "credit": 0,
          "description": "Utilities Expense (مصروف مرافق)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 6450,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-041",
      "num": 41,
      "title": "Collection",
      "desc": "Collection from 1103.004 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 45400,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.004",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 45400,
          "credit": 0,
          "description": "Collection from 1103.004 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.004",
          "accountName": "مصنع الغرب للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 45400,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-042",
      "num": 42,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - شركة المجد للتجزئة ش.م.م",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 78384,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.047",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.047",
          "accountName": "شركة المجد للتجزئة ش.م.م",
          "acctType": "Asset",
          "debit": 78384,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - شركة المجد للتجزئة ش.م.م"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 68160,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 10224,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-043",
      "num": 43,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 56800,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 56800,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 56800,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-044",
      "num": 44,
      "title": "Payroll",
      "desc": "Salaries (رواتب)",
      "type": "Payroll",
      "date": "2026-01-15",
      "amount": 11100,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5201",
      "cr": "2105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5201",
          "accountName": "Salaries Expense (مصروف رواتب)",
          "acctType": "Expense",
          "debit": 11100,
          "credit": 0,
          "description": "Salaries (رواتب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 1110,
          "description": "Taxes (ضرائب)"
        },
        {
          "lineNum": 3,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 555,
          "description": "Social Ins (تأمينات)"
        },
        {
          "lineNum": 4,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 9435,
          "description": "Net Pay (صافي الدفع)"
        }
      ]
    },
    {
      "id": "Q-045",
      "num": 45,
      "title": "Payroll",
      "desc": "Salaries (رواتب)",
      "type": "Payroll",
      "date": "2026-01-15",
      "amount": 21700,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5201",
      "cr": "2105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5201",
          "accountName": "Salaries Expense (مصروف رواتب)",
          "acctType": "Expense",
          "debit": 21700,
          "credit": 0,
          "description": "Salaries (رواتب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 2170,
          "description": "Taxes (ضرائب)"
        },
        {
          "lineNum": 3,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 1085,
          "description": "Social Ins (تأمينات)"
        },
        {
          "lineNum": 4,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 18445,
          "description": "Net Pay (صافي الدفع)"
        }
      ]
    },
    {
      "id": "Q-046",
      "num": 46,
      "title": "Bank Charges",
      "desc": "Bank Fees & Commissions (رسوم ومصاريف بنكية)",
      "type": "Bank Charges",
      "date": "2026-01-15",
      "amount": 318,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5208",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5208",
          "accountName": "Bank Charges (مصروفات بنكية)",
          "acctType": "Expense",
          "debit": 318,
          "credit": 0,
          "description": "Bank Fees & Commissions (رسوم ومصاريف بنكية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 318,
          "description": "Bank Outflow (خصم مصاريف بنكية)"
        }
      ]
    },
    {
      "id": "Q-047",
      "num": 47,
      "title": "Payroll Settlement",
      "desc": "Taxes Settlement (تسوية ضرائب)",
      "type": "Payroll Settlement",
      "date": "2026-01-15",
      "amount": 4920,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2105",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 3280,
          "credit": 0,
          "description": "Taxes Settlement (تسوية ضرائب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 1640,
          "credit": 0,
          "description": "Social Ins Settlement (تسوية تأمينات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4920,
          "description": "Bank Outflow (تدفق بنكي خارج)"
        }
      ]
    },
    {
      "id": "Q-048",
      "num": 48,
      "title": "Collection",
      "desc": "Collection from 1103.004 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 35800,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.004",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 35800,
          "credit": 0,
          "description": "Collection from 1103.004 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.004",
          "accountName": "مصنع الغرب للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 35800,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-049",
      "num": 49,
      "title": "Cash Shortage",
      "desc": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)",
      "type": "Cash Shortage",
      "date": "2026-01-15",
      "amount": 203,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5211",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5211",
          "accountName": "Cash Shortage Expense (عجز الخزينة)",
          "acctType": "Expense",
          "debit": 203,
          "credit": 0,
          "description": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 203,
          "description": "Cash Reduction (تخفيض رصيد الصندوق)"
        }
      ]
    },
    {
      "id": "Q-050",
      "num": 50,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-051",
      "num": 51,
      "title": "Prepayment",
      "desc": "Prepaid Rent (إيجار مدفوع مقدماً)",
      "type": "Prepayment",
      "date": "2026-01-15",
      "amount": 22800,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1105",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 22800,
          "credit": 0,
          "description": "Prepaid Rent (إيجار مدفوع مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 22800,
          "description": "Bank Outflow (سداد بنكي للإيجار)"
        }
      ]
    },
    {
      "id": "Q-052",
      "num": 52,
      "title": "Collection",
      "desc": "Collection from 1103.004 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 13221.15,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.004",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 13221.15,
          "credit": 0,
          "description": "Collection from 1103.004 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.004",
          "accountName": "مصنع الغرب للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 13221.15,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-053",
      "num": 53,
      "title": "Unearned Revenue",
      "desc": "Cash Received in Advance (نقدية مستلمة مقدماً)",
      "type": "Unearned Revenue",
      "date": "2026-01-15",
      "amount": 25800,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "2104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 25800,
          "credit": 0,
          "description": "Cash Received in Advance (نقدية مستلمة مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 25800,
          "description": "Unearned Revenue (إيرادات غير مكتسبة)"
        }
      ]
    },
    {
      "id": "Q-054",
      "num": 54,
      "title": "Accrual",
      "desc": "Utilities Expense (مصروف مرافق)",
      "type": "Accrual",
      "date": "2026-01-15",
      "amount": 3200,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5203",
      "cr": "2103",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5203",
          "accountName": "Utilities Expense (مصروف مرافق)",
          "acctType": "Expense",
          "debit": 3200,
          "credit": 0,
          "description": "Utilities Expense (مصروف مرافق)"
        },
        {
          "lineNum": 2,
          "accountCode": "2103",
          "accountName": "Accrued Expenses (مصروفات مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 3200,
          "description": "Accrued Expenses (مصروفات مستحقة)"
        }
      ]
    },
    {
      "id": "Q-055",
      "num": 55,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - معرض السلام للجملة تضامن",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 34914,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.037",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.037",
          "accountName": "معرض السلام للجملة تضامن",
          "acctType": "Asset",
          "debit": 34914,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - معرض السلام للجملة تضامن"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 30360,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 4554,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-056",
      "num": 56,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 25300,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 25300,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 25300,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-057",
      "num": 57,
      "title": "VAT Settlement",
      "desc": "Output VAT Clearing (تسوية ضريبة مخرجات)",
      "type": "VAT Settlement",
      "date": "2026-01-15",
      "amount": 69009.15,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2102",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 69009.15,
          "credit": 0,
          "description": "Output VAT Clearing (تسوية ضريبة مخرجات)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 6705,
          "description": "Input VAT Clearing (تسوية ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 62304.15,
          "description": "VAT Payment (مدفوعات ضريبية)"
        }
      ]
    },
    {
      "id": "Q-058",
      "num": 58,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-059",
      "num": 59,
      "title": "Asset Disposal",
      "desc": "Disposal Proceeds (متحصلات استبعاد أصول)",
      "type": "Asset Disposal",
      "date": "2026-01-15",
      "amount": 40000,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1201",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 32288,
          "credit": 0,
          "description": "Disposal Proceeds (متحصلات استبعاد أصول)"
        },
        {
          "lineNum": 2,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 40000,
          "description": "Remove Asset (إقفال تكلفة الأصل)"
        },
        {
          "lineNum": 3,
          "accountCode": "5210",
          "accountName": "Loss on Asset Disposal (خسائر استبعاد أصول)",
          "acctType": "Expense",
          "debit": 7712,
          "credit": 0,
          "description": "Loss on Disposal (خسائر استبعاد)"
        }
      ]
    },
    {
      "id": "Q-060",
      "num": 60,
      "title": "Purchase",
      "desc": "Inventory Purchase (شراء الاجهزه )",
      "type": "Purchase",
      "date": "2026-01-15",
      "amount": 159620,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1104",
      "cr": "2101.005",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 138800,
          "credit": 0,
          "description": "Inventory Purchase (شراء الاجهزه )"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 20820,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2101.005",
          "accountName": "مصنع الشرق للتجارة تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 159620,
          "description": "AP (موردون) - مصنع الشرق للتجارة تضامن"
        }
      ]
    },
    {
      "id": "Q-061",
      "num": 61,
      "title": "Inventory Adjustment",
      "desc": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)",
      "type": "Inventory Adjustment",
      "date": "2026-01-15",
      "amount": 1600,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 1600,
          "credit": 0,
          "description": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1600,
          "description": "Inv Reduction (تخفيض حساب المخزون)"
        }
      ]
    },
    {
      "id": "Q-062",
      "num": 62,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-063",
      "num": 63,
      "title": "Collection",
      "desc": "Collection from 1103.005 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 4589,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.005",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 4589,
          "credit": 0,
          "description": "Collection from 1103.005 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.005",
          "accountName": "معرض الوفاء للتسويق ش.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4589,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-064",
      "num": 64,
      "title": "Bank Transfer In",
      "desc": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)",
      "type": "Bank Transfer In",
      "date": "2026-01-15",
      "amount": 9500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 9500,
          "credit": 0,
          "description": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 9500,
          "description": "Cash Transfer Out (صرف من الخزينة للإيداع البنكي)"
        }
      ]
    },
    {
      "id": "Q-065",
      "num": 65,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - معرض الوفاء للتجزئة توصية بسيطة",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 160782,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.036",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.036",
          "accountName": "معرض الوفاء للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 150742,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - معرض الوفاء للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 2,
          "accountCode": "4104",
          "accountName": "Sales Discount (خصم مسموح به)",
          "acctType": "Contra Revenue",
          "debit": 10040,
          "credit": 0,
          "description": "Sales Discount (خصم مبيعات)"
        },
        {
          "lineNum": 3,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 141120,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 4,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 19662,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-066",
      "num": 66,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 117600,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 117600,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 117600,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-067",
      "num": 67,
      "title": "Accrued Revenue",
      "desc": "Accrued Service Rev (إيرادات خدمات مستحقة)",
      "type": "Accrued Revenue",
      "date": "2026-01-15",
      "amount": 8100,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1107",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1107",
          "accountName": "Accrued Revenue (إيرادات مستحقة)",
          "acctType": "Asset",
          "debit": 8100,
          "credit": 0,
          "description": "Accrued Service Rev (إيرادات خدمات مستحقة)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 8100,
          "description": "Revenue Recognized (إيرادات معترف بها)"
        }
      ]
    },
    {
      "id": "Q-068",
      "num": 68,
      "title": "Collection",
      "desc": "Collection from 1103.006 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 3748,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.006",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 3748,
          "credit": 0,
          "description": "Collection from 1103.006 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.006",
          "accountName": "شركة النور للجملة تضامن",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3748,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-069",
      "num": 69,
      "title": "Cash Advance",
      "desc": "Employee Custody Advance (صرف سلفة مؤقتة لموظف)",
      "type": "Cash Advance",
      "date": "2026-01-15",
      "amount": 600,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1108",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1108",
          "accountName": "Employee Advances (سلف الموظفين)",
          "acctType": "Asset",
          "debit": 600,
          "credit": 0,
          "description": "Employee Custody Advance (صرف سلفة مؤقتة لموظف)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 600,
          "description": "Petty Cash Outflow (صرف من الخزينة)"
        }
      ]
    },
    {
      "id": "Q-070",
      "num": 70,
      "title": "Collection",
      "desc": "Collection from 1103.007 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 2539,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.007",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 2539,
          "credit": 0,
          "description": "Collection from 1103.007 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.007",
          "accountName": "مصنع المستقبل للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2539,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-071",
      "num": 71,
      "title": "Sale",
      "desc": "Credit Sale (إيراد الاجهزه ) - مؤسسة المجد للتجزئة توصية بسيطة",
      "type": "Sale",
      "date": "2026-01-15",
      "amount": 27048,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1103.003",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1103.003",
          "accountName": "مؤسسة المجد للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 27048,
          "credit": 0,
          "description": "Credit Sale (إيراد الاجهزه ) - مؤسسة المجد للتجزئة توصية بسيطة"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 23520,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 3528,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-072",
      "num": 72,
      "title": "COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "COGS",
      "date": "2026-01-15",
      "amount": 19600,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 19600,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 19600,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-073",
      "num": 73,
      "title": "Bank Transfer In",
      "desc": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)",
      "type": "Bank Transfer In",
      "date": "2026-01-15",
      "amount": 2500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 2500,
          "credit": 0,
          "description": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2500,
          "description": "Cash Transfer Out (صرف من الخزينة للإيداع البنكي)"
        }
      ]
    },
    {
      "id": "Q-074",
      "num": 74,
      "title": "Bank Transfer Out",
      "desc": "Bank Withdrawal to Cash (سحب نقدي لتغذية الخزينة)",
      "type": "Bank Transfer Out",
      "date": "2026-01-15",
      "amount": 3500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 3500,
          "credit": 0,
          "description": "Bank Withdrawal to Cash (سحب نقدي لتغذية الخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3500,
          "description": "Bank Outflow (شيك مسحوب لتغذية الخزينة)"
        }
      ]
    },
    {
      "id": "Q-075",
      "num": 75,
      "title": "Asset Purchase",
      "desc": "Fixed Asset Purchase (شراء أصل ثابت)",
      "type": "Asset Purchase",
      "date": "2026-01-15",
      "amount": 35650,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1201",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 31000,
          "credit": 0,
          "description": "Fixed Asset Purchase (شراء أصل ثابت)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 4650,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات على الأصول)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 35650,
          "description": "Bank Outflow (سداد قيمة الأصل)"
        }
      ]
    },
    {
      "id": "Q-076",
      "num": 76,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 7000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 7000,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 7000,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-077",
      "num": 77,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-078",
      "num": 78,
      "title": "Purchase",
      "desc": "Inventory Purchase (شراء الاجهزه )",
      "type": "Purchase",
      "date": "2026-01-15",
      "amount": 214245,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1104",
      "cr": "2101.010",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 186300,
          "credit": 0,
          "description": "Inventory Purchase (شراء الاجهزه )"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 27945,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2101.010",
          "accountName": "شركة النور للتوريدات تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 214245,
          "description": "AP (موردون) - شركة النور للتوريدات تضامن"
        }
      ]
    },
    {
      "id": "Q-079",
      "num": 79,
      "title": "Purchase",
      "desc": "Inventory Purchase (شراء الاجهزه )",
      "type": "Purchase",
      "date": "2026-01-15",
      "amount": 226895,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1104",
      "cr": "2101.010",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 197300,
          "credit": 0,
          "description": "Inventory Purchase (شراء الاجهزه )"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 29595,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "2101.010",
          "accountName": "شركة النور للتوريدات تضامن",
          "acctType": "Liability",
          "debit": 0,
          "credit": 226895,
          "description": "AP (موردون) - شركة النور للتوريدات تضامن"
        }
      ]
    },
    {
      "id": "Q-080",
      "num": 80,
      "title": "Misc Expense",
      "desc": "Maintenance (صيانة دورية)",
      "type": "Misc Expense",
      "date": "2026-01-15",
      "amount": 1000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1000,
          "credit": 0,
          "description": "Maintenance (صيانة دورية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1000,
          "description": "Bank (بنك)"
        }
      ]
    },
    {
      "id": "Q-081",
      "num": 81,
      "title": "Sales Return",
      "desc": "Sales Returns (مردودات مبيعات)",
      "type": "Sales Return",
      "date": "2026-01-15",
      "amount": 2185,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "4105",
      "cr": "1103.003",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "4105",
          "accountName": "Sales Returns (مردودات مبيعات)",
          "acctType": "Contra Revenue",
          "debit": 1900,
          "credit": 0,
          "description": "Sales Returns (مردودات مبيعات)"
        },
        {
          "lineNum": 2,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 285,
          "credit": 0,
          "description": "VAT Reversal (عكس ضريبة)"
        },
        {
          "lineNum": 3,
          "accountCode": "1103.003",
          "accountName": "مؤسسة المجد للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2185,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-082",
      "num": 82,
      "title": "Sales Return Inv",
      "desc": "Inv Restoration (رد مخزون)",
      "type": "Sales Return Inv",
      "date": "2026-01-15",
      "amount": 863,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1104",
      "cr": "5101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 863,
          "credit": 0,
          "description": "Inv Restoration (رد مخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 0,
          "credit": 863,
          "description": "COGS Reversal (عكس تكلفة البضاعة)"
        }
      ]
    },
    {
      "id": "Q-083",
      "num": 83,
      "title": "Purchase Return",
      "desc": "AP Reduction (تخفيض حساب الموردين)",
      "type": "Purchase Return",
      "date": "2026-01-15",
      "amount": 3220,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2101.002",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2101.002",
          "accountName": "شركة الاتحاد للاستيراد والتصدير توصية بسيطة",
          "acctType": "Liability",
          "debit": 3220,
          "credit": 0,
          "description": "AP Reduction (تخفيض حساب الموردين)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 420,
          "description": "Input VAT Reversal (عكس ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2800,
          "description": "Inventory Return (مردودات مخزون)"
        }
      ]
    },
    {
      "id": "Q-084",
      "num": 84,
      "title": "Cash Advance",
      "desc": "Employee Custody Advance (صرف سلفة مؤقتة لموظف)",
      "type": "Cash Advance",
      "date": "2026-01-15",
      "amount": 800,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1108",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1108",
          "accountName": "Employee Advances (سلف الموظفين)",
          "acctType": "Asset",
          "debit": 800,
          "credit": 0,
          "description": "Employee Custody Advance (صرف سلفة مؤقتة لموظف)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 800,
          "description": "Petty Cash Outflow (صرف من الخزينة)"
        }
      ]
    },
    {
      "id": "Q-085",
      "num": 85,
      "title": "Bank Transfer In",
      "desc": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)",
      "type": "Bank Transfer In",
      "date": "2026-01-15",
      "amount": 8500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 8500,
          "credit": 0,
          "description": "Cash Deposit to Bank (إيداع نقدي بالبنك من الخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 8500,
          "description": "Cash Transfer Out (صرف من الخزينة للإيداع البنكي)"
        }
      ]
    },
    {
      "id": "Q-086",
      "num": 86,
      "title": "Inventory Adjustment",
      "desc": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)",
      "type": "Inventory Adjustment",
      "date": "2026-01-15",
      "amount": 2000,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 2000,
          "credit": 0,
          "description": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2000,
          "description": "Inv Reduction (تخفيض حساب المخزون)"
        }
      ]
    },
    {
      "id": "Q-087",
      "num": 87,
      "title": "Petty Cash Replenishment",
      "desc": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)",
      "type": "Petty Cash Replenishment",
      "date": "2026-01-15",
      "amount": 4000,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1101",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 4000,
          "credit": 0,
          "description": "Petty Cash Replenishment (استعاضة سلفة مستديمة للخزينة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4000,
          "description": "Bank Outflow (سحب شيك استعاضة من البنك)"
        }
      ]
    },
    {
      "id": "Q-088",
      "num": 88,
      "title": "Cash Sale",
      "desc": "Cash Sale (بيع نقدي)",
      "type": "Cash Sale",
      "date": "2026-01-15",
      "amount": 29405.25,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 27640.25,
          "credit": 0,
          "description": "Cash Sale (بيع نقدي)"
        },
        {
          "lineNum": 2,
          "accountCode": "4104",
          "accountName": "Sales Discount (خصم مسموح به)",
          "acctType": "Contra Revenue",
          "debit": 1765,
          "credit": 0,
          "description": "Sales Discount (خصم مبيعات)"
        },
        {
          "lineNum": 3,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 25800,
          "description": "Revenue (إيرادات)"
        },
        {
          "lineNum": 4,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 3605.25,
          "description": "Output VAT (ضريبة مخرجات)"
        }
      ]
    },
    {
      "id": "Q-089",
      "num": 89,
      "title": "Cash Sale COGS",
      "desc": "COGS (تكلفة البضاعة المباعة)",
      "type": "Cash Sale COGS",
      "date": "2026-01-15",
      "amount": 21500,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5101",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5101",
          "accountName": "Cost of Goods Sold (تكلفة البضاعة المباعة)",
          "acctType": "Expense",
          "debit": 21500,
          "credit": 0,
          "description": "COGS (تكلفة البضاعة المباعة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 21500,
          "description": "Inv Reduction (تخفيض المخزون)"
        }
      ]
    },
    {
      "id": "Q-090",
      "num": 90,
      "title": "Collection",
      "desc": "Collection from 1103.003 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 24863,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.003",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 24863,
          "credit": 0,
          "description": "Collection from 1103.003 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.003",
          "accountName": "مؤسسة المجد للتجزئة توصية بسيطة",
          "acctType": "Asset",
          "debit": 0,
          "credit": 24863,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-091",
      "num": 91,
      "title": "Payroll",
      "desc": "Salaries (رواتب)",
      "type": "Payroll",
      "date": "2026-01-15",
      "amount": 18700,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5201",
      "cr": "2105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5201",
          "accountName": "Salaries Expense (مصروف رواتب)",
          "acctType": "Expense",
          "debit": 18700,
          "credit": 0,
          "description": "Salaries (رواتب)"
        },
        {
          "lineNum": 2,
          "accountCode": "2105",
          "accountName": "Payroll Taxes Payable (ضرائب رواتب مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 1870,
          "description": "Taxes (ضرائب)"
        },
        {
          "lineNum": 3,
          "accountCode": "2106",
          "accountName": "Social Insurance Payable (تأمينات اجتماعية مستحقة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 935,
          "description": "Social Ins (تأمينات)"
        },
        {
          "lineNum": 4,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 15895,
          "description": "Net Pay (صافي الدفع)"
        }
      ]
    },
    {
      "id": "Q-092",
      "num": 92,
      "title": "Collection",
      "desc": "Collection from 1103.008 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 2015,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.008",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 2015,
          "credit": 0,
          "description": "Collection from 1103.008 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.008",
          "accountName": "معرض المجد للمقاولات ش.م.م",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2015,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-093",
      "num": 93,
      "title": "Purchase Return",
      "desc": "AP Reduction (تخفيض حساب الموردين)",
      "type": "Purchase Return",
      "date": "2026-01-15",
      "amount": 2645,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2101.002",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2101.002",
          "accountName": "شركة الاتحاد للاستيراد والتصدير توصية بسيطة",
          "acctType": "Liability",
          "debit": 2645,
          "credit": 0,
          "description": "AP Reduction (تخفيض حساب الموردين)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 345,
          "description": "Input VAT Reversal (عكس ضريبة مدخلات)"
        },
        {
          "lineNum": 3,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2300,
          "description": "Inventory Return (مردودات مخزون)"
        }
      ]
    },
    {
      "id": "Q-094",
      "num": 94,
      "title": "Asset Purchase",
      "desc": "Fixed Asset Purchase (شراء أصل ثابت)",
      "type": "Asset Purchase",
      "date": "2026-01-15",
      "amount": 65550,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1201",
      "cr": "1102",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1201",
          "accountName": "Fixed Assets (أصول ثابتة)",
          "acctType": "Asset",
          "debit": 57000,
          "credit": 0,
          "description": "Fixed Asset Purchase (شراء أصل ثابت)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 8550,
          "credit": 0,
          "description": "Input VAT (ضريبة مدخلات على الأصول)"
        },
        {
          "lineNum": 3,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 65550,
          "description": "Bank Outflow (سداد قيمة الأصل)"
        }
      ]
    },
    {
      "id": "Q-095",
      "num": 95,
      "title": "Unearned Revenue",
      "desc": "Cash Received in Advance (نقدية مستلمة مقدماً)",
      "type": "Unearned Revenue",
      "date": "2026-01-15",
      "amount": 22800,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "2104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 22800,
          "credit": 0,
          "description": "Cash Received in Advance (نقدية مستلمة مقدماً)"
        },
        {
          "lineNum": 2,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 0,
          "credit": 22800,
          "description": "Unearned Revenue (إيرادات غير مكتسبة)"
        }
      ]
    },
    {
      "id": "Q-096",
      "num": 96,
      "title": "Collection",
      "desc": "Collection from 1103.009 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 2592,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.009",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 2592,
          "credit": 0,
          "description": "Collection from 1103.009 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.009",
          "accountName": "مجموعة الحديثة للتجزئة لصاحبها",
          "acctType": "Asset",
          "debit": 0,
          "credit": 2592,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-097",
      "num": 97,
      "title": "Cash Advance Settlement",
      "desc": "Maintenance via Custody (تسوية سلفة بفواتير مصروفات)",
      "type": "Cash Advance Settlement",
      "date": "2026-01-15",
      "amount": 1400,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5207",
      "cr": "1108",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5207",
          "accountName": "Maintenance Expense (مصروف صيانة)",
          "acctType": "Expense",
          "debit": 1400,
          "credit": 0,
          "description": "Maintenance via Custody (تسوية سلفة بفواتير مصروفات)"
        },
        {
          "lineNum": 2,
          "accountCode": "1108",
          "accountName": "Employee Advances (سلف الموظفين)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 1400,
          "description": "Employee Custody Settlement (إقفال سلفة الموظف)"
        }
      ]
    },
    {
      "id": "Q-098",
      "num": 98,
      "title": "Collection",
      "desc": "Collection from 1103.010 (تحصيل دفعة من العميل)",
      "type": "Collection",
      "date": "2026-01-15",
      "amount": 5772,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "1102",
      "cr": "1103.010",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "1102",
          "accountName": "Bank (بنك)",
          "acctType": "Asset",
          "debit": 5772,
          "credit": 0,
          "description": "Collection from 1103.010 (تحصيل دفعة من العميل)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.010",
          "accountName": "مجموعة المستقبل للخدمات تضامن",
          "acctType": "Asset",
          "debit": 0,
          "credit": 5772,
          "description": "AR Reduction (تخفيض حساب العملاء)"
        }
      ]
    },
    {
      "id": "Q-099",
      "num": 99,
      "title": "Cash Shortage",
      "desc": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)",
      "type": "Cash Shortage",
      "date": "2026-01-15",
      "amount": 160,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5211",
      "cr": "1101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5211",
          "accountName": "Cash Shortage Expense (عجز الخزينة)",
          "acctType": "Expense",
          "debit": 160,
          "credit": 0,
          "description": "Cash Shortage (تسوية عجز الخزينة / فروق جرد نقدية)"
        },
        {
          "lineNum": 2,
          "accountCode": "1101",
          "accountName": "Cash (نقدية)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 160,
          "description": "Cash Reduction (تخفيض رصيد الصندوق)"
        }
      ]
    },
    {
      "id": "Q-100",
      "num": 100,
      "title": "Inventory Adjustment",
      "desc": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)",
      "type": "Inventory Adjustment",
      "date": "2026-01-15",
      "amount": 3500,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 3500,
          "credit": 0,
          "description": "Inventory Shrinkage/Variance (تسوية عجز وفروق جرد المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104",
          "accountName": "Inventory (مخزون)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 3500,
          "description": "Inv Reduction (تخفيض حساب المخزون)"
        }
      ]
    },
    {
      "id": "Q-101",
      "num": 101,
      "title": "Prepayment Amortization",
      "desc": "Prepaid Rent Amortization (إطفاء)",
      "type": "Prepayment Amortization",
      "date": "2026-01-15",
      "amount": 15435,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 15435,
          "credit": 0,
          "description": "Prepaid Rent Amortization (إطفاء)"
        },
        {
          "lineNum": 2,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 15435,
          "description": "Prepaid Reduction (تخفيض مدفوع مقدماً)"
        }
      ]
    },
    {
      "id": "Q-102",
      "num": 102,
      "title": "Prepayment Amortization",
      "desc": "Prepaid Rent Amortization (إطفاء)",
      "type": "Prepayment Amortization",
      "date": "2026-01-15",
      "amount": 4412,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 4412,
          "credit": 0,
          "description": "Prepaid Rent Amortization (إطفاء)"
        },
        {
          "lineNum": 2,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 4412,
          "description": "Prepaid Reduction (تخفيض مدفوع مقدماً)"
        }
      ]
    },
    {
      "id": "Q-103",
      "num": 103,
      "title": "Prepayment Amortization",
      "desc": "Prepaid Rent Amortization (إطفاء)",
      "type": "Prepayment Amortization",
      "date": "2026-01-15",
      "amount": 12305,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5202",
      "cr": "1105",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5202",
          "accountName": "Rent Expense (مصروف إيجار)",
          "acctType": "Expense",
          "debit": 12305,
          "credit": 0,
          "description": "Prepaid Rent Amortization (إطفاء)"
        },
        {
          "lineNum": 2,
          "accountCode": "1105",
          "accountName": "Prepaid Expenses (مصروفات مدفوعة مقدماً)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 12305,
          "description": "Prepaid Reduction (تخفيض مدفوع مقدماً)"
        }
      ]
    },
    {
      "id": "Q-104",
      "num": 104,
      "title": "Unearned Rev Recognition",
      "desc": "Unearned Service Revenue Recognition (اعتراف)",
      "type": "Unearned Rev Recognition",
      "date": "2026-01-15",
      "amount": 18000,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2104",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 18000,
          "credit": 0,
          "description": "Unearned Service Revenue Recognition (اعتراف)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 18000,
          "description": "Revenue Recognized (إيرادات معترف بها)"
        }
      ]
    },
    {
      "id": "Q-105",
      "num": 105,
      "title": "Unearned Rev Recognition",
      "desc": "Unearned Service Revenue Recognition (اعتراف)",
      "type": "Unearned Rev Recognition",
      "date": "2026-01-15",
      "amount": 29400,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2104",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 29400,
          "credit": 0,
          "description": "Unearned Service Revenue Recognition (اعتراف)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 29400,
          "description": "Revenue Recognized (إيرادات معترف بها)"
        }
      ]
    },
    {
      "id": "Q-106",
      "num": 106,
      "title": "Unearned Rev Recognition",
      "desc": "Unearned Service Revenue Recognition (اعتراف)",
      "type": "Unearned Rev Recognition",
      "date": "2026-01-15",
      "amount": 25800,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2104",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 25800,
          "credit": 0,
          "description": "Unearned Service Revenue Recognition (اعتراف)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 25800,
          "description": "Revenue Recognized (إيرادات معترف بها)"
        }
      ]
    },
    {
      "id": "Q-107",
      "num": 107,
      "title": "Unearned Rev Recognition",
      "desc": "Unearned Service Revenue Recognition (اعتراف)",
      "type": "Unearned Rev Recognition",
      "date": "2026-01-15",
      "amount": 5826,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2104",
      "cr": "4101",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2104",
          "accountName": "Unearned Revenue (إيرادات غير مكتسبة)",
          "acctType": "Liability",
          "debit": 5826,
          "credit": 0,
          "description": "Unearned Service Revenue Recognition (اعتراف)"
        },
        {
          "lineNum": 2,
          "accountCode": "4101",
          "accountName": "Sales Revenue (إيرادات مبيعات)",
          "acctType": "Revenue",
          "debit": 0,
          "credit": 5826,
          "description": "Revenue Recognized (إيرادات معترف بها)"
        }
      ]
    },
    {
      "id": "Q-108",
      "num": 108,
      "title": "Bad Debt Provision",
      "desc": "Bad Debt Expense (مصروف ديون معدومة)",
      "type": "Bad Debt Provision",
      "date": "2026-01-15",
      "amount": 35721,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5205",
      "cr": "1103.1",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5205",
          "accountName": "Bad Debt Expense (مصروف ديون معدومة)",
          "acctType": "Expense",
          "debit": 35721,
          "credit": 0,
          "description": "Bad Debt Expense (مصروف ديون معدومة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1103.1",
          "accountName": "Allowance for Doubtful Accounts (مخصص ديون مشكوك فيها)",
          "acctType": "Contra Asset",
          "debit": 0,
          "credit": 35721,
          "description": "Allowance for Doubtful Accounts (مخصص ديون مشكوك فيها)"
        }
      ]
    },
    {
      "id": "Q-109",
      "num": 109,
      "title": "Inventory Impairment",
      "desc": "Inventory Obsolescence Exp (مصروف هبوط المخزون)",
      "type": "Inventory Impairment",
      "date": "2026-01-15",
      "amount": 7047,
      "difficulty": "Hard",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5206",
      "cr": "1104.1",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5206",
          "accountName": "Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)",
          "acctType": "Expense",
          "debit": 7047,
          "credit": 0,
          "description": "Inventory Obsolescence Exp (مصروف هبوط المخزون)"
        },
        {
          "lineNum": 2,
          "accountCode": "1104.1",
          "accountName": "Allowance for Inventory Obsolescence (مخصص هبوط أسعار المخزون)",
          "acctType": "Contra Asset",
          "debit": 0,
          "credit": 7047,
          "description": "Allowance for Obsolescence (مخصص هبوط المخزون)"
        }
      ]
    },
    {
      "id": "Q-110",
      "num": 110,
      "title": "VAT Clearing",
      "desc": "Output VAT Clearing (تسوية ضريبة مخرجات)",
      "type": "VAT Clearing",
      "date": "2026-01-15",
      "amount": 26510.25,
      "difficulty": "Medium",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "2102",
      "cr": "1106",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "2102",
          "accountName": "Output VAT (ضريبة القيمة المضافة - مخرجات)",
          "acctType": "Liability",
          "debit": 26510.25,
          "credit": 0,
          "description": "Output VAT Clearing (تسوية ضريبة مخرجات)"
        },
        {
          "lineNum": 2,
          "accountCode": "1106",
          "accountName": "Input VAT (ضريبة القيمة المضافة - مدخلات)",
          "acctType": "Asset",
          "debit": 0,
          "credit": 26510.25,
          "description": "Input VAT Clearing (تسوية ضريبة مدخلات)"
        }
      ]
    },
    {
      "id": "Q-111",
      "num": 111,
      "title": "Depreciation",
      "desc": "Annual Depreciation (إهلاك الأصول الثابتة)",
      "type": "Depreciation",
      "date": "2026-01-15",
      "amount": 47886,
      "difficulty": "Easy",
      "category": "general",
      "categoryAr": "محاسبة عامة",
      "dr": "5204",
      "cr": "1202",
      "lines": [
        {
          "lineNum": 1,
          "accountCode": "5204",
          "accountName": "Depreciation Expense (مصروف إهلاك)",
          "acctType": "Expense",
          "debit": 47886,
          "credit": 0,
          "description": "Annual Depreciation (إهلاك الأصول الثابتة)"
        },
        {
          "lineNum": 2,
          "accountCode": "1202",
          "accountName": "Accumulated Depreciation (مجمع إهلاك)",
          "acctType": "Contra Asset",
          "debit": 0,
          "credit": 47886,
          "description": "Accumulated Depreciation (مجمع إهلاك)"
        }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.DEFAULT_PLATFORM_COMPANY = DEFAULT_PLATFORM_COMPANY;
}
if (typeof module !== 'undefined') {
  module.exports = DEFAULT_PLATFORM_COMPANY;
}
