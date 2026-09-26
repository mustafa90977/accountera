/**
 * test-subscription-security.js — اختبارات أمان الاشتراكات والترقية المهنية (Phase 5)
 * يتحقق من:
 * 1. غلق ثغرة الترقية المحلية في student-plans-view.js و professional-portfolio-view.js
 * 2. التحقق من أن مصدر الثقة (Source of Truth) للباقة هو جدول subscriptions في Supabase
 * 3. التحقق من سياسات RLS وقيد CHECK لحالات الاشتراك في migration SQL
 * 4. التحقق من دوال لوحة تحكم الأدمن (Approve / Reject) وحمايتها بـ requireAdmin()
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🛡️ بدء تشغيل اختبارات أمان الاشتراكات والترقية (Subscription Security Suite)...');

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
// 1. فحص ملف student-plans-view.js والتأكد من إزالة الترقية المحلية
// -------------------------------------------------------------
runTest('حظر الترقية المباشرة في localStorage عبر subscribePlan و activateTrial', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src/ui/student-plans-view.js'), 'utf8');

  // التأكد من أن subscribePlan ترسل طلباً للسيرفر
  assert.ok(code.includes('SupabaseService.requestSubscription(planId)'), 'دالة subscribePlan لا تستدعي requestSubscription!');
  assert.ok(code.includes('تم إرسال طلب الترقية بنجاح، بانتظار اعتماد الإدارة'), 'رسالة انتظار اعتماد الإدارة مفقودة في subscribePlan!');

  // التأكد من عدم وجود user.plan = planId داخل subscribePlan
  const subscribePlanBody = code.substring(code.indexOf('async subscribePlan('), code.indexOf('async activateTrial('));
  assert.ok(!subscribePlanBody.includes('user.plan = planId;'), 'تم العثور على ترقية محلية user.plan = planId داخل subscribePlan!');
  assert.ok(!subscribePlanBody.includes("localStorage.setItem('accountera_user'"), 'تم العثور على حفظ محلي لليوزر داخل subscribePlan!');
});

// -------------------------------------------------------------
// 2. فحص ملف professional-portfolio-view.js والتأكد من إغلاق الثغرة
// -------------------------------------------------------------
runTest('إغلاق ثغرة الترقية التلقائية إلى Pro في شاشة ملف الإنجاز (Portfolio View)', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src/ui/professional-portfolio-view.js'), 'utf8');
  assert.ok(!code.includes("user.plan = 'pro';"), 'تم العثور على ثغرة user.plan = pro في professional-portfolio-view.js!');
  assert.ok(code.includes('upgradeToProTrial()'), 'دالة upgradeToProTrial مفقودة!');
  assert.ok(code.includes("navigateToScreen('student-plans')"), 'دالة upgradeToProTrial لا توجه إلى صفحة الباقات الرسمية!');
});

// -------------------------------------------------------------
// 3. فحص ملف auth.js ومزامنة الباقة من جدول subscriptions
// -------------------------------------------------------------
runTest('مزامنة الباقة واعتماد Supabase subscriptions كمصدر وحيد للحقيقة (Source of Truth)', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src/core/auth.js'), 'utf8');
  assert.ok(code.includes('getUserActiveSubscription'), 'دالة syncUserSession لا تجلب الاشتراك النشط من Supabase!');
  assert.ok(code.includes('refreshUserSubscription'), 'دالة refreshUserSubscription مفقودة في AuthService!');
});

// -------------------------------------------------------------
// 4. فحص ملف supabase-client.js
// -------------------------------------------------------------
runTest('وجود دوال دورة حياة الاشتراكات في SupabaseService', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src/core/supabase-client.js'), 'utf8');
  assert.ok(code.includes('getUserActiveSubscription('), 'دالة getUserActiveSubscription مفقودة!');
  assert.ok(code.includes('getUserPendingSubscription('), 'دالة getUserPendingSubscription مفقودة!');
  assert.ok(code.includes('requestSubscription('), 'دالة requestSubscription مفقودة!');
  assert.ok(code.includes('getPendingSubscriptions('), 'دالة getPendingSubscriptions مفقودة!');
  assert.ok(code.includes('approveSubscription('), 'دالة approveSubscription مفقودة!');
  assert.ok(code.includes('rejectSubscription('), 'دالة rejectSubscription مفقودة!');
});

// -------------------------------------------------------------
// 5. فحص ملف admin-dashboard-view.js
// -------------------------------------------------------------
runTest('وجود قسم اعتماد طلبات الترقية وحمايته بصلاحيات requireAdmin', () => {
  const code = fs.readFileSync(path.join(__dirname, 'src/ui/admin-dashboard-view.js'), 'utf8');
  assert.ok(code.includes('طلبات الترقية المعلقة (Pending Subscriptions)'), 'عنوان قسم طلبات الترقية المعلقة مفقود!');
  assert.ok(code.includes('loadPendingSubscriptions('), 'دالة loadPendingSubscriptions مفقودة!');
  assert.ok(code.includes('renderPendingSubscriptionsList('), 'دالة renderPendingSubscriptionsList مفقودة!');
  assert.ok(code.includes('approveSubscription('), 'دالة approveSubscription مفقودة!');
  assert.ok(code.includes('rejectSubscription('), 'دالة rejectSubscription مفقودة!');

  // فحص حماية requireAdmin
  const approveBody = code.substring(code.indexOf('async approveSubscription('), code.indexOf('async rejectSubscription('));
  assert.ok(approveBody.includes('this.requireAdmin()'), 'دالة approveSubscription غير محمية بـ requireAdmin()!');
  const rejectBody = code.substring(code.indexOf('async rejectSubscription('), code.indexOf('async addNewPlan('));
  assert.ok(rejectBody.includes('this.requireAdmin()'), 'دالة rejectSubscription غير محمية بـ requireAdmin()!');
});

// -------------------------------------------------------------
// 6. فحص ملف migration phase5
// -------------------------------------------------------------
runTest('التحقق من هيكلة جدول subscriptions وسياسات RLS الصارمة في ملف الهجرة', () => {
  const sqlPath = path.join(__dirname, 'supabase/migrations/phase5_subscriptions_workflow.sql');
  assert.ok(fs.existsSync(sqlPath), 'ملف migration phase5 مفقود!');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  assert.ok(sql.includes("CHECK (status IN ('pending', 'active', 'expired', 'rejected'))"), 'قيد CHECK لحالات الاشتراك مفقود أو غير مكتمل!');
  assert.ok(sql.includes('requested_at'), 'عمود requested_at مفقود!');
  assert.ok(sql.includes('activated_at'), 'عمود activated_at مفقود!');
  assert.ok(sql.includes('activated_by'), 'عمود activated_by مفقود!');
  assert.ok(sql.includes('subscriptions_select'), 'سياسة subscriptions_select مفقودة!');
  assert.ok(sql.includes('subscriptions_insert'), 'سياسة subscriptions_insert مفقودة!');
  assert.ok(sql.includes('subscriptions_update'), 'سياسة subscriptions_update مفقودة!');
  assert.ok(sql.includes('subscriptions_delete'), 'سياسة subscriptions_delete مفقودة!');
});

console.log(`\n📊 نتيجة الفحص: ${passedTests}/${totalTests} اختبارات مكتملة بنجاح.`);
if (passedTests === totalTests) {
  console.log('🎉 جميع معايير أمان الاشتراكات تعمل وفق أعلى المواصفات الأمنية!');
} else {
  process.exit(1);
}
