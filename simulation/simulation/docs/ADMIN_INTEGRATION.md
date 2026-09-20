# دليل ربط لوحة تحكم الإدارة (Admin Integration Guide)

تم تحويل المحاكي بالكامل إلى **بيئة عمل حرة ونقية (Zero Hardcode Environment)** جاهزة لاستقبال البيانات ديناميكياً من لوحة تحكم الإدارة (Admin Panel).

---

## 1. كيف يعمل المحاكي في الوضع الافتراضي (الصفر النقي)
* يبدأ المحاكي بـ **0 مهام**، **0 قيود**، و **0.00 ج.م** لجميع الحسابات.
* شاشات اليومية ولوحة التحكم تعرض حالة الانتظار: *(بانتظار إسناد المهام والمستندات من لوحة الإدارة)*.
* يتيح للطلاب تسجيل قيود حرة مباشرة إذا لم يتم تعيين مهام محددة.

---

## 2. واجهة الربط البرمجية (SimulatorAPI)

يوفر المحاكي كائناً برمجياً عاماً في نافذة المتصفح تحت اسم `window.SimulatorAPI` للتحكم الكامل من المشروع الأساسي:

### أ) إسناد المهام والعمليات من لوحة الإدارة:
```javascript
const myAdminTasks = [
  {
    id: "TRX-001",
    date: "2026-02-01",
    type: "Sale", // نوع العملية: Sale, Purchase, Collection, Payment, Opening Balance ...
    ref: "INV-1001",
    lines: [
      { accountCode: "1103", accountName: "العملاء", debit: 11400, credit: 0, description: "فاتورة مبيعات رقم 1001" },
      { accountCode: "4101", accountName: "إيرادات المبيعات", debit: 0, credit: 10000, description: "مبيعات بضاعة" },
      { accountCode: "2102", accountName: "ضريبة القيمة المضافة", debit: 0, credit: 1400, description: "ضريبة 14%" }
    ]
  }
];

// استدعاء دالة الإسناد:
window.SimulatorAPI.setTasks(myAdminTasks);
```

### ب) جلب تقرير أداء وإجابات الطالب (للتصحيح والتقييم):
```javascript
const results = window.SimulatorAPI.getResults();
console.log(results);
/*
محتويات التقرير:
{
  totalTasks: 1,           // إجمالي المهام المسندة من الأدمن
  completedTasks: 1,       // عدد المهام التي سجلها ورحلها الطالب بنجاح
  progressPercent: 100,    // نسبة الإنجاز المئوية (100%)
  journalEntriesCount: 1,  // عدد القيود في اليومية
  balances: { ... }        // أرصدة كافة الحسابات الحالية للتحقق من الاتزان
}
*/
```

### ج) جلب دفتر اليومية والأستاذ الخاص بالطالب:
```javascript
const journal = window.SimulatorAPI.getStudentJournal(); // قيود اليومية المسجلة
const ledger = window.SimulatorAPI.getStudentLedger();   // حركات دفاتر الأستاذ T-Accounts
```

### د) إعادة ضبط وتصفير المحاكي:
```javascript
// 1. تصفير إجابات الطالب فقط (مع الاحتفاظ بمهام الأدمن):
window.SimulatorAPI.resetStudentState();

// 2. تصفير شامل (مسح مهام الأدمن وإجابات الطالب للعودة لصفر مطلق):
window.SimulatorAPI.clearAll();
```

---

## 3. حماية التخزين المحلي (Storage Safety)
* تم عزل كافة مفاتيح المحاكي ببادئة خاصة مثل `sim_admin_tasks` و `student_journal`.
* دوال التصفير في المحاكي **لا تستخدم `localStorage.clear()` العامة مطلقاً**، وبالتالي لن تمس توكن تسجيل الدخول أو أي بيانات تخص نظامك الأساسي عند الدمج.
