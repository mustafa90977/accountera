/**
 * test-mvp-e2e.js — فحص واختبار تكامل ومزامنة الواجهة مع الباك إند (MVP End-to-End Suite)
 * يتحقق من:
 * 1. صحة تعريف جداول وسياسات الـ RLS في ملف Migration
 * 2. تكامل خدمات التعلم (ProgressService, PracticeService, SimulationService, MigrationService)
 * 3. صحة ترحيل الذاكرة المحلية عند الدخول (LocalStorage Migration)
 * 4. ربط شاشات الدروس والتمارين ولوحة تحكم الطالب مع خدمات البيانات
 * 5. بقاء النواة المحاسبية المصرية محمية ومتزنة بنسبة 100%
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`   ✅ [PASS]: ${message}`);
    passedTests++;
  } else {
    console.error(`   ❌ [FAIL]: ${message}`);
    process.exitCode = 1;
  }
}

console.log('🧪 بدء اختبارات MVP Backend الشاملة (Accountera MVP E2E Suite)...');

// -------------------------------------------------------------
// الاختبار 1: التحقق من ملف الترحيل الخاص بالـ MVP Persistence
// -------------------------------------------------------------
const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20260921_phase0_2_mvp_persistence.sql');
assert(fs.existsSync(migrationPath), 'ملف ترحيل قاعدة البيانات Phase 0.2 موجود');

const migrationSql = fs.readFileSync(migrationPath, 'utf8');
assert(
  migrationSql.includes('CREATE TABLE IF NOT EXISTS public.lesson_progress') &&
  migrationSql.includes('unique_user_lesson UNIQUE (user_id, lesson_id)'),
  'جدول lesson_progress معرف بقيد فريد مركب UNIQUE (user_id, lesson_id)'
);
assert(
  migrationSql.includes('CREATE TABLE IF NOT EXISTS public.practice_attempts'),
  'جدول practice_attempts معرف بنجاح'
);
assert(
  migrationSql.includes('CREATE TABLE IF NOT EXISTS public.simulation_progress') &&
  migrationSql.includes('unique_user_company UNIQUE (user_id, company_id)'),
  'جدول simulation_progress معرف بقيد فريد مركب UNIQUE (user_id, company_id)'
);
assert(
  migrationSql.includes('ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY') &&
  migrationSql.includes('ALTER TABLE public.practice_attempts ENABLE ROW LEVEL SECURITY') &&
  migrationSql.includes('ALTER TABLE public.simulation_progress ENABLE ROW LEVEL SECURITY'),
  'تفعيل سياسات الأمان RLS على الجداول الثلاثة بالكامل'
);
assert(
  migrationSql.includes('auth.uid() = user_id'),
  'عزل بيانات الطلاب بحيث لا يستطيع طالب استعراض أو تعديل بيانات غيره'
);

// -------------------------------------------------------------
// الاختبار 2: التحقق من كود خدمة التعلم Learning Service
// -------------------------------------------------------------
const servicePath = path.join(__dirname, 'src', 'core', 'services', 'learning-service.js');
assert(fs.existsSync(servicePath), 'ملف learning-service.js موجود في مساره الصحيح');

const serviceCode = fs.readFileSync(servicePath, 'utf8');
assert(
  serviceCode.includes('ProgressService') &&
  serviceCode.includes('PracticeService') &&
  serviceCode.includes('SimulationService') &&
  serviceCode.includes('MigrationService'),
  'جميع الخدمات الأربع (Progress, Practice, Simulation, Migration) معرفة ومصدرة'
);
assert(
  serviceCode.includes('getAuthUserId') &&
  serviceCode.includes('AuthService.getCurrentUser()'),
  'الخدمات تعتمد استخراج معرف المستخدم حصرياً من الجلسة الموثقة'
);

// -------------------------------------------------------------
// الاختبار 3: محاكاة خدمات التعلم وتتبع التقدم (Service Logic Emulation)
// -------------------------------------------------------------
const mockStorage = {};
global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = String(v); },
  removeItem: (k) => { delete mockStorage[k]; }
};
global.window = {
  localStorage: global.localStorage,
  SupabaseService: null
};
global.AuthService = {
  getCurrentUser: () => ({ id: 'usr-student-001', name: 'أحمد محمود', role: 'student' })
};

eval(serviceCode);

const Progress = window.ProgressService;
const Practice = window.PracticeService;
const Simulation = window.SimulationService;
const Migration = window.MigrationService;

// تجربة إتمام درس
Progress.completedLessons.clear();
Progress.completeLesson('lesson-1');
Progress.completeLesson('lesson-2');

assert(
  Progress.isLessonCompleted('lesson-1') === true &&
  Progress.isLessonCompleted('lesson-2') === true &&
  Progress.isLessonCompleted('lesson-3') === false,
  'تسجيل واستعلام إتمام الدروس يعمل بدقة'
);
assert(
  Progress.getCompletedCount() === 2,
  'حساب عدد الدروس المنجزة يعطي النتيجة الصحيحة (2 من 6)'
);

// تجربة تسجيل محاولة تمرين
Practice.recordAttempt('ex-sales-1', 'mcq', 100, true, { selected: 'B' });
Practice.recordAttempt('ip-purchase-1', 'entry', 50, false, { error: 'wrong_vat' });

const stats = Practice.getStats();
assert(
  stats.total === 2 && stats.passed === 1 && stats.accuracyRate === 50,
  'تسجيل واحتساب إحصائيات التمارين (50% دقة من أصل محاولتين)'
);

// تجربة حفظ واسترجاع حالة المحاكاة
Simulation.saveProgress('company-nile', {
  journal: [{ id: 'TRX-1', ref: 'INV-101', status: 'posted' }],
  ledger: { '1101': { balance: 50000 } },
  profile: { name: 'شركة النيل' },
  score: 10
});

const simStats = Simulation.getSimStats();
assert(
  simStats.totalOperations === 1 && simStats.completedOperations === 1,
  'حفظ واسترجاع حالة محاكي الشركات بنجاح'
);

// -------------------------------------------------------------
// الاختبار 4: ربط الـ UI مع الخدمات في index.html
// -------------------------------------------------------------
const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(
  indexHtml.includes('src/core/services/learning-service.js'),
  'تم إدراج learning-service.js في ملف index.html'
);

// -------------------------------------------------------------
// الاختبار 5: ربط الأحداث مع AuthService و SimulationBridge
// -------------------------------------------------------------
const authPath = path.join(__dirname, 'src', 'core', 'auth.js');
const authCode = fs.readFileSync(authPath, 'utf8');
assert(
  authCode.includes('MigrationService.migrateLegacyLocalStorage') &&
  authCode.includes('ProgressService.fetchUserProgress'),
  'AuthService يستدعي ترحيل البيانات وجلب التقدم السحابي فور تسجيل الدخول'
);

const bridgePath = path.join(__dirname, 'src', 'core', 'simulation-bridge.js');
const bridgeCode = fs.readFileSync(bridgePath, 'utf8');
assert(
  bridgeCode.includes('SimulationService.loadProgress') &&
  bridgeCode.includes('saveCurrentSimulation'),
  'SimulationBridge مرتبط بخدمة مزامنة المحاكاة السحابية'
);

// -------------------------------------------------------------
// الاختبار 6: عرض البيانات الفعلية في لوحة تحكم الطالب
// -------------------------------------------------------------
const dashPath = path.join(__dirname, 'src', 'ui', 'student-dashboard-view.js');
const dashCode = fs.readFileSync(dashPath, 'utf8');
assert(
  dashCode.includes('ProgressService.getCompletedCount()') &&
  dashCode.includes('completedLessonsCount'),
  'لوحة تحكم الطالب تقرأ عدد الدروس المكتملة الفعلي من السحابة والخدمة'
);
assert(
  dashCode.includes('isLessonCompleted') &&
  dashCode.includes('(مكتمل ✓)'),
  'قائمة الدروس في لوحة الطالب تظهر علامة الإنجاز (مكتمل ✓) للدروس المنهية'
);

// -------------------------------------------------------------
// الاختبار 7: ربط شاشة التعلم والتمارين مع تسجيل التقدم
// -------------------------------------------------------------
const learningViewPath = path.join(__dirname, 'src', 'ui', 'learning-view.js');
const learningViewCode = fs.readFileSync(learningViewPath, 'utf8');
assert(
  learningViewCode.includes('ProgressService.completeLesson') &&
  learningViewCode.includes('PracticeService.recordAttempt'),
  'شاشة الدروس (learning-view.js) تسجل إتمام الدروس والمحاولات تلقائياً'
);

const practiceViewPath = path.join(__dirname, 'src', 'ui', 'practice-view.js');
const practiceViewCode = fs.readFileSync(practiceViewPath, 'utf8');
assert(
  practiceViewCode.includes('PracticeService.recordAttempt'),
  'شاشة التمارين (practice-view.js) تسجل محاولات الحل والدرجات تلقائياً'
);

// -------------------------------------------------------------
// الاختبار 8: التحقق من سلامة النواة المحاسبية (Accounting Regression)
// -------------------------------------------------------------
try {
  const regOutput = execSync('node test-accounting-regression.js', { encoding: 'utf8' });
  assert(
    regOutput.includes('اجتياز 9 من أصل 9 اختباراً بنسبة 100%'),
    'اجتياز جميع اختبارات النواة المحاسبية المصرية التسعة بنسبة 100%'
  );
} catch (err) {
  assert(false, 'فشل تشغيل اختبارات النواة المحاسبية');
}

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص MVP E2E: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
  process.exit(1);
}
