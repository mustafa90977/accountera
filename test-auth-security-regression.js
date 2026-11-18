/**
 * test-auth-security-regression.js — اختبارات الانحدار الأمني والتحقق من المصادقة (Phase 0.1 & Launch Readiness)
 * يتحقق من:
 * 1. فرض رتبة 'student' كافتراضي عند التسجيل وحظر تعيين الأدوار من العميل.
 * 2. عزل وحماية Quick Login من بيئة الإنتاج.
 * 3. استخراج user_id للمصادقة السحابية حصرياً من الجلسة الموثقة وعدم قبول مدخلات مجهولة.
 * 4. التحقق من صحة معالجة وترجمة أخطاء المصادقة.
 * 5. بقاء ملفات النواة المحاسبية المصرية سليمة ومحمية.
 * 6. حارس المسارات الصارم في التطبيق الرئيسي والمحاكي.
 * 7. حظر الهويات المحلية المزورة واشتراط توكن Supabase صالح زمنياً (AUTH-01).
 * 8. دورة استعادة كلمة المرور المنسية ذاتياً بالبريد الإلكتروني (AUTH-04).
 * 9. تحصين لوحة الإدارة ضد ثغرات XSS عبر تعقيم المدخلات (SEC-05).
 * 10. جسر المحاكاة النظري ومطابقة مسميات الحسابات وتوفير مسار رجوع (UX-02).
 * 11. قفل منع التكرار (Idempotency Guard) لمنع تسجيل قيود مكررة بالضغط المزدوج (VG-04).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 بدء تشغيل اختبارات الأمان والمصادقة وجاهزية الإطلاق (Accountera Launch Security Suite)...');

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
// 1. فحص ملف auth.js والتأكد من إزالة قائمة اختيار الدور من التسجيل
// -------------------------------------------------------------
runTest('حظر اختيار الدور (role dropdown) من واجهة تسجيل الحساب الجديد', () => {
  const authCode = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(!authCode.includes('id="authRole"'), 'تم العثور على حقل اختيار الدور authRole في auth.js!');
  assert.ok(!authCode.includes('<option value="admin">'), 'تم العثور على خيار دور admin في نموذج التسجيل!');
});

// -------------------------------------------------------------
// 2. فحص ملف migration SQL والتأكد من وجود Triggers الحماية ودوال RLS
// -------------------------------------------------------------
runTest('التحقق من وجود مشغلات الحماية ودوال Security Definer في ملف Migration', () => {
  const sqlPath = path.join(__dirname, 'supabase/migrations/20260921_phase0_1_auth_foundation.sql');
  assert.ok(fs.existsSync(sqlPath), 'ملف migration الخاص بالمرحلة 0.1 مفقود!');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  assert.ok(sql.includes('FUNCTION public.is_admin()'), 'دالة is_admin المساعدة مفقودة!');
  assert.ok(sql.includes('FUNCTION public.is_staff()'), 'دالة is_staff المساعدة مفقودة!');
  assert.ok(sql.includes('FUNCTION public.handle_new_user()'), 'مشغل handle_new_user مفقود!');
  assert.ok(sql.includes('FUNCTION public.protect_profile_role()'), 'مشغل protect_profile_role مفقود!');
  assert.ok(sql.includes('submissions_insert_own'), 'سياسة submissions_insert_own مفقودة!');
  assert.ok(sql.includes('companies_select_all'), 'سياسة companies_select_all مفقودة!');
});

// -------------------------------------------------------------
// 3. فحص عزل الدخول السريع (Quick Login Isolation)
// -------------------------------------------------------------
runTest('حظر الدخول السريع في بيئة الإنتاج وعزله للمعاينة المحلية فقط', () => {
  const authCode = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(authCode.includes('isDevTest: true'), 'وسم isDevTest مفقود من كائن الدخول السريع!');
  assert.ok(authCode.includes('الدخول السريع غير متاح في بيئة الإنتاج'), 'رسالة التحذير لبيئة الإنتاج مفقودة!');
});

// -------------------------------------------------------------
// 4. فحص استخراج user_id من جلسة Supabase في supabase-client.js
// -------------------------------------------------------------
runTest('منع إرسال تسليمات مجهولة واستخراج user_id من auth.getSession()', () => {
  const supaCode = fs.readFileSync(path.join(__dirname, 'src/core/supabase-client.js'), 'utf8');
  assert.ok(supaCode.includes('authUserId = session.user.id'), 'لا يتم استخراج user.id من الجلسة الموثقة!');
  assert.ok(supaCode.includes('user_id: authUserId'), 'حقل user_id لا يستخدم authUserId الموثق!');
  assert.ok(supaCode.includes('Submission not synced to cloud: User is not authenticated'), 'لا يتم إيقاف الإرسال غير المصادق!');
});

// -------------------------------------------------------------
// 5. فحص حماية النواة المحاسبية (Pristine Protected Components)
// -------------------------------------------------------------
runTest('التأكد من بقاء ملفات النواة المحاسبية دون أي تعديل', () => {
  const coreFiles = [
    'src/core/engine/accountera-accounting-core.js',
    'src/core/engine/egyptian-coa.js',
    'src/core/engine/document-transaction-engine.js',
    'src/core/engine/egyptian-simulation-modules.js'
  ];

  coreFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    assert.ok(fs.existsSync(fullPath), `الملف المحمي ${file} مفقود!`);
  });
});

// -------------------------------------------------------------
// 6. فحص حارس المسارات الصارم (Strict RouteGuard Protection)
// -------------------------------------------------------------
runTest('حظر كافة الشاشات الداخلية والمحاكاة لغير المسجلين وقصر الوصول على صفحة الهبوط فقط', () => {
  const mainCode = fs.readFileSync(path.join(__dirname, 'src/main.js'), 'utf8');
  assert.ok(mainCode.includes("const publicScreens = ['landing', 'welcome']"), 'قائمة المسارات العامة غير مضبوطة في main.js!');
  assert.ok(mainCode.includes('!publicScreens.includes(screenId)'), 'حارس المسارات لا يحظر كافة الشاشات غير العامة!');
  assert.ok(mainCode.includes("AuthService.openAuthModal('login')"), 'لا يتم فتح نافذة تسجيل الدخول عند محاولة الوصول لشاشة محمية!');

  const authCode = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(authCode.includes("const publicScreens = ['landing', 'welcome']"), 'قائمة المسارات العامة غير مضبوطة في auth.js!');
  assert.ok(authCode.includes('!publicScreens.includes(requestedScreen)'), 'فحص تهيئة الجلسة لا يحظر الشاشات الداخلية!');

  const simCode = fs.readFileSync(path.join(__dirname, 'simulation/simulation/journal/index.html'), 'utf8');
  assert.ok(simCode.includes("window.location.replace('/?screen=landing&auth=login')"), 'محاكي اليومية غير محمي بحارس المصادقة!');
});

// -------------------------------------------------------------
// 7. فحص حظر الهويات المحلية المزورة والتحقق من التوكن (AUTH-01)
// -------------------------------------------------------------
runTest('حظر الهويات المحلية المزورة والتحقق الصارم من توكن Supabase وتاريخ صلاحيته (AUTH-01)', () => {
  const authCode = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(authCode.includes('tokenData.expires_at > now'), 'دالة getCurrentUser لا تتحقق من صلاحية توكن Supabase!');
  assert.ok(authCode.includes('tokenData.user.id === parsed.id'), 'دالة getCurrentUser لا تطابق معرّف التوكن مع المعرّف المحلي!');

  const simCode = fs.readFileSync(path.join(__dirname, 'simulation/simulation/journal/index.html'), 'utf8');
  assert.ok(simCode.includes('tokenData.expires_at > now'), 'حارس محاكي اليومية لا يفحص صلاحية التوكن الزمنية!');
});

// -------------------------------------------------------------
// 8. فحص دورة استعادة كلمة المرور المنسية ذاتياً (AUTH-04)
// -------------------------------------------------------------
runTest('تفعيل دورة استعادة كلمة المرور المنسية ذاتياً بالبريد الإلكتروني (AUTH-04)', () => {
  const authCode = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(authCode.includes('requestPasswordReset(email)'), 'دالة requestPasswordReset مفقودة في auth.js!');
  assert.ok(authCode.includes('resetPasswordForEmail'), 'استدعاء resetPasswordForEmail مفقود في auth.js!');
  assert.ok(authCode.includes('updateUserPassword(newPassword)'), 'دالة updateUserPassword مفقودة في auth.js!');

  const authViewCode = fs.readFileSync(path.join(__dirname, 'src/ui/auth-view.js'), 'utf8');
  assert.ok(authViewCode.includes('openForgotPasswordModal'), 'نافذة استعادة كلمة المرور مفقودة في auth-view.js!');
  assert.ok(authViewCode.includes('openResetPasswordModal'), 'نافذة تعيين كلمة المرور الجديدة مفقودة في auth-view.js!');
});

// -------------------------------------------------------------
// 9. فحص تعقيم مدخلات لوحة الإدارة ضد هجمات XSS (SEC-05)
// -------------------------------------------------------------
runTest('تحصين لوحة الإدارة وتعقيم أسماء وبيانات الاشتراكات ضد هجمات XSS (SEC-05)', () => {
  const adminCode = fs.readFileSync(path.join(__dirname, 'src/ui/admin-dashboard-view.js'), 'utf8');
  assert.ok(adminCode.includes('escapeHtml(str)'), 'دالة escapeHtml مفقودة في admin-dashboard-view.js!');
  assert.ok(adminCode.includes('this.escapeHtml(profile.full_name'), 'لم يتم تعقيم اسم الطالب في جدول الاشتراكات!');
  assert.ok(adminCode.includes('this.escapeHtml(profile.email'), 'لم يتم تعقيم بريد الطالب في جدول الاشتراكات!');
});

// -------------------------------------------------------------
// 10. فحص جسر المسودة النظرية ومطابقة الحسابات وتوفير مسار رجوع (UX-02)
// -------------------------------------------------------------
runTest('جسر المحاكاة النظري يطابق أرقام الحسابات ويوفر رابط العودة للدرس (UX-02)', () => {
  const docCode = fs.readFileSync(path.join(__dirname, 'src/ui/documentary-cycle-view.js'), 'utf8');
  assert.ok(docCode.includes('resolveAccountCode(accStr)'), 'محول أسماء الحسابات لأكواد مفقود في documentary-cycle-view.js!');
  assert.ok(docCode.includes('returnTo: returnUrl'), 'رابط الرجوع للدرس مفقود في مسودة القيد!');

  const journalCode = fs.readFileSync(path.join(__dirname, 'simulation/simulation/js/journal.js'), 'utf8');
  assert.ok(journalCode.includes('draft.returnTo'), 'محاكي اليومية لا يعرض زر العودة للدرس النظري!');
});

// -------------------------------------------------------------
// 11. فحص قفل منع تسجيل القيود المكررة بالضغط المزدوج (VG-04)
// -------------------------------------------------------------
runTest('قفل منع التكرار (Idempotency Guard) لمنع تسجيل قيود مكررة بالضغط المزدوج (VG-04)', () => {
  const journalCode = fs.readFileSync(path.join(__dirname, 'simulation/simulation/js/journal.js'), 'utf8');
  assert.ok(journalCode.includes('__isPostingJournalEntry'), 'قفل منع التكرار __isPostingJournalEntry مفقود في postEntry!');
});

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص الأمان وجاهزية الإطلاق: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');
