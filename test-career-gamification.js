// =========================================================================
// Accountera Career, Gamification & Skill Gap Diagnostic Test Suite (Phase 3)
// =========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء اختبارات نظام المسار المهني، نقاط الخبرة (XP)، وتشخيص الفجوات المهارية (Phase 3)...');

let passedTests = 0;
const totalTests = 10;

function pass(msg) {
    passedTests++;
    console.log(`   ✅ [PASS]: ${msg}`);
}

// 1. Check career-engine.js file exists
const careerEnginePath = path.join(__dirname, 'simulation', 'simulation', 'js', 'career-engine.js');
assert(fs.existsSync(careerEnginePath), 'ملف career-engine.js يجب أن يكون موجوداً');
pass('ملف career-engine.js موجود في مساره الصحيح');

// 2. Load and verify CAREER_RANKS
const careerEngineCode = fs.readFileSync(careerEnginePath, 'utf8');
assert(careerEngineCode.includes('CAREER_RANKS = ['), 'يجب تعريف مصفوفة CAREER_RANKS');
assert(careerEngineCode.includes('ACHIEVEMENT_BADGES = ['), 'يجب تعريف مصفوفة ACHIEVEMENT_BADGES');
pass('شجرة الرتب المهنية والشارات معرّفة بنجاح');

// 3. Mock browser environment to test career-engine logic
const mockLocalStorage = {};
global.localStorage = {
    getItem: (k) => mockLocalStorage[k] || null,
    setItem: (k, v) => { mockLocalStorage[k] = String(v); },
    removeItem: (k) => { delete mockLocalStorage[k]; }
};

global.window = {
    studentJournal: []
};

// Evaluate career-engine in node sandbox
eval(careerEngineCode);
Object.assign(global, window);

// 4. Verify 6 Career Levels
assert(CAREER_RANKS.length === 6, 'يجب أن يحتوي السلم المهني على 6 رتب متدرجة');
assert(CAREER_RANKS[0].id === 'intern', 'الرتبة الأولى يجب أن تكون محاسب متدرب');
assert(CAREER_RANKS[5].id === 'chartered_auditor', 'الرتبة العليا يجب أن تكون مراجع حسابات قانوني معتمد');
pass('الرتب المهنية الستة متدرجة من محاسب متدرب إلى مراجع حسابات قانوني');

// 5. Verify dynamic XP calculation
window.studentJournal = [
    { id: 'TRX-001', status: 'posted', lines: [] },
    { id: 'TRX-002', status: 'posted', lines: [] },
    { id: 'TRX-003', status: 'pending_posting', lines: [] }
];
const result = calculateLiveStudentXP();
// base 50 + 3 entries * 50 (150) + 2 posted * 25 (50) = 250 XP
assert(result.totalXp >= 250, `نقاط الخبرة المحسوبة (${result.totalXp}) يجب أن تكون >= 250`);
assert(result.rank.id === 'intern', 'رتبة البداية مع 250 XP هي محاسب متدرب');
pass('محرك نقاط الخبرة (XP) يحتسب نقاط اليومية والترحيل بدقة');

// 6. Test Milestone Badges unlocking
localStorage.setItem('bank_statement_items', JSON.stringify([
    { id: 'B-1', matched: true },
    { id: 'B-2', matched: true }
]));
localStorage.setItem('acc_cash_count_state', JSON.stringify({ isBalanced: true }));
localStorage.setItem('acc_inv_count_state', JSON.stringify({ isBalanced: true }));
localStorage.setItem('acc_tax_returns_state', JSON.stringify({ isCleared: true }));

const advancedResult = calculateLiveStudentXP();
assert(advancedResult.unlockedBadges.includes('recon_master'), 'يجب فتح شارة خبير التسويات البنكية');
assert(advancedResult.unlockedBadges.includes('treasury_guard'), 'يجب فتح شارة أمين الخزينة المعتمد');
assert(advancedResult.unlockedBadges.includes('inventory_pro'), 'يجب فتح شارة مراقب المخزون الدقيق');
assert(advancedResult.unlockedBadges.includes('tax_specialist'), 'يجب فتح شارة أخصائي الضرائب المصرية');
pass('المحاكيات الميدانية تفتح الشارات المهنية وتمنح نقاط الخبرة الإضافية');

// 7. Verify Rank Promotion with XP
// With recon (+150), cash (+150), inv (+150), tax (+200), total XP >= 900 -> Junior / Site Accountant
assert(advancedResult.rank.id === 'junior_site', `الترقية إلى محاسب موقع يجب أن تتم بنجاح، الحالي: ${advancedResult.rank.id}`);
pass('الترقية التلقائية للرتبة التالية تتم بنجاح بناءً على نقاط الخبرة');

// 8. Test 5-Pillar Skill Gap Report Generator
const report = generateSkillGapReport();
assert(report.pillars && report.pillars.length === 5, 'تقرير الفجوات المهارية يجب أن يغطي 5 محاور مهنية');
assert(typeof report.overallScore === 'number' && report.overallScore > 0, 'يجب احتساب مؤشر الإتقان العام');
assert(report.pillars.every(p => p.desc && p.rec), 'كل محور يجب أن يحتوي على تشخيص مهني وتوصية عملية');
pass('تقرير تشخيص الفجوات المهارية يحلل المحاور الخمسة ويقدم توصيات تطويرية');

// 9. Verify dashboard integration
const dashboardHtml = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'dashboard', 'index.html'), 'utf8');
assert(dashboardHtml.includes('career-widget-container'), 'شاشة نظرة عامة يجب أن تحتوي على حاوية بطاقة الرتبة المهنية');
assert(dashboardHtml.includes('career-engine.js'), 'شاشة نظرة عامة يجب أن تستدعي كود career-engine.js');
assert(dashboardHtml.includes('EAS') || dashboardHtml.includes('المحاسبة المصرية'), 'شاشة نظرة عامة يجب أن تعتمد المعايير المصرية EAS');
pass('لوحة التحكم تستدعي محرك المسار المهني وتعتمد معايير المحاسبة المصرية (EAS)');

// 10. Verify journal integration for hints and first-attempt tracking
const journalJs = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'js', 'journal.js'), 'utf8');
assert(journalJs.includes('hintsUsedCount'), 'شاشة اليومية تتبع استخدام التلميحات المحاسبية');
assert(journalJs.includes('firstAttemptCount'), 'شاشة اليومية تتبع القيود المنجزة من أول محاولة دون أخطاء');
pass('دفتر اليومية مرتبط بمحرك XP لتتبع المحاولات الأولى وخصم التلميحات');

// 11. Verify digital certificate modal and print support
assert(careerEngineCode.includes('openCertificateModal') && careerEngineCode.includes('cert-printable-content'), 'شهادة الاعتماد الرقمية ومحضر الفجوات المهارية متاحان للطباعة الرسمية');
pass('شهادة الاعتماد المهنية الرقمية وقوالب طباعة A4 متاحة بنجاح');

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص المسار المهني والجيميفيكيشن: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');
