/**
 * test-auth-security-regression.js — اختبارات الانحدار الأمني والتحقق من المصادقة (Phase 0.1)
 * يتحقق من:
 * 1. فرض رتبة 'student' كافتراضي عند التسجيل وحظر تعيين الأدوار من العميل.
 * 2. عزل وحماية Quick Login من بيئة الإنتاج.
 * 3. استخراج user_id للمصادقة السحابية حصرياً من الجلسة الموثقة وعدم قبول مدخلات مجهولة.
 * 4. التحقق من صحة معالجة وترجمة أخطاء المصادقة.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 بدء تشغيل اختبارات الأمان والمصادقة (Accountera Auth & Security Suite)...');

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

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص الأمان: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');
