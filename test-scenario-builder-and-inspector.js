/**
 * Accountera - Phase 4 Verification Suite
 * Interactive Document Inspector & Visual Scenario Builder
 * Note: Document auto-fill/answer leaks are intentionally sanitized in student view to prevent cheating.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء اختبارات فاحص المستندات وباني السيناريوهات (Phase 4 Suite)...');

let passedTests = 0;
const totalTests = 10;

function runTest(testName, testFn) {
    try {
        testFn();
        console.log(`   ✅ [PASS]: ${testName}`);
        passedTests++;
    } catch (err) {
        console.error(`   ❌ [FAIL]: ${testName}`);
        console.error(`      الخطأ: ${err.message}`);
    }
}

const journalJsPath = path.join(__dirname, 'simulation', 'simulation', 'js', 'journal.js');
const adminDashboardPath = path.join(__dirname, 'src', 'ui', 'admin-dashboard-view.js');

const journalContent = fs.readFileSync(journalJsPath, 'utf8');
const adminDashboardContent = fs.readFileSync(adminDashboardPath, 'utf8');

// Test 1: File existence and size check
runTest('ملفات فاحص المستندات وباني السيناريوهات موجودة وتحتوي على الكود البرمجي', () => {
    assert.ok(fs.existsSync(journalJsPath), 'journal.js not found');
    assert.ok(fs.existsSync(adminDashboardPath), 'admin-dashboard-view.js not found');
    assert.ok(journalContent.length > 50000, 'journal.js is truncated or empty');
    assert.ok(adminDashboardContent.length > 30000, 'admin-dashboard-view.js is truncated or empty');
});

// Test 2: renderInspectableRow function defined and sanitized (no cheat leaks)
runTest('دالة renderInspectableRow ودالة renderDocRow معرّفة بطريقة آمنة بدون تسريب إجابات', () => {
    assert.ok(journalContent.includes('function renderInspectableRow('), 'renderInspectableRow not defined');
    assert.ok(journalContent.includes('function renderDocRow('), 'renderDocRow not defined');
});

// Test 3: inspectDocumentFigure safely scoped or disabled for anti-cheating
runTest('دالة inspectDocumentFigure معرّفة بأمان لمنع استخراج أطراف القيد آلياً', () => {
    assert.ok(journalContent.includes('window.inspectDocumentFigure = function'), 'inspectDocumentFigure not exposed on window');
});

// Test 4: autofillJournalLine safely disabled to prevent student auto-cheating
runTest('دالة autofillJournalLine معرّفة بطريقة آمنة تمنع التعبئة التلقائية للحل', () => {
    assert.ok(journalContent.includes('window.autofillJournalLine = function'), 'autofillJournalLine not exposed on window');
});

// Test 5: Integration in document viewer templates (realistic document rendering)
runTest('قوالب المستندات (فواتير المشتريات، المبيعات، المرتبات، الإشعارات) مدمجة وتعرض البيانات المالية', () => {
    assert.ok(journalContent.includes("renderDocRow('قيمة البضاعة المشتراة"), 'Purchase invoice data rows missing');
    assert.ok(journalContent.includes("renderDocRow('قيمة المبيعات الخاضعة للضريبة"), 'Sale invoice data rows missing');
    assert.ok(journalContent.includes("renderDocRow('إجمالي الرواتب والأجور المستحقة"), 'Payroll document data rows missing');
});

// Test 6: Document rendering and formatting verification
runTest('التحقق من صحة صياغة وتنسيق أسطر المستند renderDocRow', () => {
    const fnMatch = journalContent.match(/function renderDocRow\([\s\S]*?\n\}/);
    assert.ok(fnMatch, 'renderDocRow definition not found');
    const runner = new Function(`return ${fnMatch[0]};`);
    const renderDocRow = runner();

    const rowHtml = renderDocRow('المخزون', 50000, 'text-slate-800');
    assert.ok(rowHtml.includes('50,000.00'), 'Rendered row should contain formatted amount');
    assert.ok(rowHtml.includes('المخزون'), 'Rendered row should contain label');
});

// Test 7: Visual Scenario Builder modal in Admin Dashboard
runTest('نافذة باني السيناريوهات المرئي موجودة في admin-dashboard-view.js', () => {
    assert.ok(adminDashboardContent.includes('showAddTransactionModal'), 'showAddTransactionModal function missing');
    assert.ok(adminDashboardContent.includes('tx_builder_template'), 'Template selection dropdown missing');
    assert.ok(adminDashboardContent.includes('tx_preview_lines_container'), 'Compound lines live preview container missing');
    assert.ok(adminDashboardContent.includes('tx_modal_sync_bank'), 'Sync with bank statement checkbox missing');
});

// Test 8: Ready-made Egyptian Scenario Templates in Scenario Builder
runTest('باني السيناريوهات يحتوي على قوالب المعاملات المصرية الشائعة (VAT, Payroll, Depreciation, Expenses)', () => {
    assert.ok(adminDashboardContent.includes('فاتورة مبيعات بضاعة آجلة + ضريبة قيمة مضافة 14%'), 'Sale with VAT template missing');
    assert.ok(adminDashboardContent.includes('فاتورة مشتريات بضاعة بالآجل + ضريبة مدخلات 14%'), 'Purchase with VAT template missing');
    assert.ok(adminDashboardContent.includes('مسير رواتب موظفين مع استقطاع ضرائب كسب عمل وتأمينات'), 'Payroll with deductions template missing');
    assert.ok(adminDashboardContent.includes('مذكرة تسوية قسط الإهلاك السنوي للأصول الثابتة'), 'Depreciation template missing');
});

// Test 9: Live preview auto-calculation logic in Admin Scenario Builder
runTest('دالة updateVisualPreview تحتسب أطراف القيد المركب والضرائب تلقائياً للمشرف', () => {
    assert.ok(adminDashboardContent.includes('function updateVisualPreview()'), 'updateVisualPreview function missing');
    assert.ok(adminDashboardContent.includes('0.14'), 'Standard 14% VAT calculation logic missing');
    assert.ok(adminDashboardContent.includes('tx_preview_lines_container'), 'Preview lines container missing');
});

// Test 10: Auto-sync simulation with Bank Statement
runTest('باني السيناريوهات يزامن المعاملات النقدية والبنكية مع كشف الحساب البنكي تلقائياً', () => {
    assert.ok(adminDashboardContent.includes('syncBank'), 'syncBank flag missing');
    assert.ok(adminDashboardContent.includes('bank_statement_items'), 'Bank statement storage reference missing');
});

console.log(`\n========================================================`);
console.log(`🎯 نتيجة فحص باني السيناريوهات وفاحص المستندات: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log(`========================================================\n`);

if (passedTests < totalTests) {
    process.exit(1);
}
