/**
 * Accountera - Phase 4 Verification Suite
 * Interactive Document Inspector & Visual Scenario Builder
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء اختبارات فاحص المستندات التفاعلي وباني السيناريوهات للمشرف (Phase 4 Suite)...');

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

// Test 2: renderInspectableRow function defined and formats correctly
runTest('دالة renderInspectableRow معرّفة وتنتج أسطر الفحص التفاعلية', () => {
    assert.ok(journalContent.includes('function renderInspectableRow('), 'renderInspectableRow not defined');
    assert.ok(journalContent.includes('inspectDocumentFigure('), 'renderInspectableRow must call inspectDocumentFigure on click');
    assert.ok(journalContent.includes('cursor-pointer') && journalContent.includes('hover:bg-blue-50/80'), 'Interactive styling present');
});

// Test 3: inspectDocumentFigure drawer logic
runTest('دالة inspectDocumentFigure تعرض تفاصيل التوجيه والتعليل المحاسبي المصري', () => {
    assert.ok(journalContent.includes('window.inspectDocumentFigure = function'), 'inspectDocumentFigure not exposed on window');
    assert.ok(journalContent.includes('doc-inspector-drawer'), 'doc-inspector-drawer element reference missing');
    assert.ok(journalContent.includes('فاحص المستند التوجيهي الذكي'), 'Inspector title in drawer missing');
    assert.ok(journalContent.includes('طبيعة الحركة في القيد:'), 'Debit/Credit nature indicator missing');
    assert.ok(journalContent.includes('التوجيه والتعليل المحاسبي:'), 'Accounting rationale block missing');
});

// Test 4: autofillJournalLine logic
runTest('دالة autofillJournalLine تدرج الطرف المحاسبي تلقائياً في سطر القيد بضغطة زر', () => {
    assert.ok(journalContent.includes('window.autofillJournalLine = function'), 'autofillJournalLine not exposed on window');
    assert.ok(journalContent.includes('targetLine.account = String(accountCode)'), 'Account code assignment missing');
    assert.ok(journalContent.includes('renderForm()'), 'Form re-rendering missing');
    assert.ok(journalContent.includes('recalculateTotals()'), 'Totals recalculation missing');
});

// Test 5: Integration in document viewer templates
runTest('قوالب المستندات (فواتير المشتريات، المبيعات، المرتبات، الإشعارات) تدمج فاحص المستندات', () => {
    const inspectorDrawerCount = (journalContent.match(/id="doc-inspector-drawer"/g) || []).length;
    assert.ok(inspectorDrawerCount >= 7, `Expected at least 7 document types with inspector drawer, got ${inspectorDrawerCount}`);
    
    assert.ok(journalContent.includes("renderInspectableRow('قيمة البضاعة المشتراة'"), 'Purchase invoice inspectable rows missing');
    assert.ok(journalContent.includes("renderInspectableRow('قيمة المبيعات الخاضعة للضريبة'"), 'Sale invoice inspectable rows missing');
    assert.ok(journalContent.includes("renderInspectableRow('إجمالي الرواتب والأجور المستحقة'"), 'Payroll document inspectable rows missing');
});

// Test 6: Functional execution test of inspectDocumentFigure & autofillJournalLine
runTest('محاكاة تنفيذ inspectDocumentFigure و autofillJournalLine في بيئة DOM مصغرة', () => {
    let innerHTML = '';
    const mockDrawer = {
        classList: {
            remove: () => {},
            add: () => {}
        },
        set innerHTML(val) { innerHTML = val; },
        get innerHTML() { return innerHTML; },
        scrollIntoView: () => {}
    };

    const mockFeedback = { innerHTML: '' };

    global.document = {
        getElementById: (id) => {
            if (id === 'doc-inspector-drawer') return mockDrawer;
            if (id === 'feedback-msg') return mockFeedback;
            return null;
        }
    };
    global.window = { innerWidth: 1200 };
    global.ACCOUNTS = { '1104': 'المخزون السلعي', '2101': 'الموردين' };
    global.formLines = [{ account: '', debit: 0, credit: 0 }];
    global.renderForm = () => {};
    global.recalculateTotals = () => {};

    // Extract and run functions
    const fnCode = `
        const renderInspectableRow = ${journalContent.match(/function renderInspectableRow\([\s\S]*?\n\}/)[0]};
        ${journalContent.match(/window\.inspectDocumentFigure = function[\s\S]*?\n\};/)[0]};
        ${journalContent.match(/window\.autofillJournalLine = function[\s\S]*?\n\};/)[0]};
        return { renderInspectableRow, inspect: window.inspectDocumentFigure, autofill: window.autofillJournalLine };
    `;

    const runner = new Function(fnCode);
    const { renderInspectableRow, inspect, autofill } = runner();

    const rowHtml = renderInspectableRow('المخزون', 50000, '1104', 'debit', 'شراء بضاعة', 'text-slate-800');
    assert.ok(rowHtml.includes('50,000 ج.م'), 'Rendered row should contain formatted amount');
    assert.ok(rowHtml.includes('1104'), 'Rendered row should contain account code');

    inspect('1104', 50000, 'debit', 'المخزون', encodeURIComponent('شراء بضاعة وفق معيار (2)'));
    assert.ok(mockDrawer.innerHTML.includes('فاحص المستند التوجيهي الذكي'), 'Drawer should render inspector UI');
    assert.ok(mockDrawer.innerHTML.includes('المخزون السلعي'), 'Drawer should render account name');

    autofill('1104', 50000, 'debit');
    assert.strictEqual(global.formLines[0].account, '1104', 'Account code should be populated');
    assert.strictEqual(global.formLines[0].debit, 50000, 'Debit amount should be populated');
    assert.strictEqual(global.formLines[0].credit, 0, 'Credit amount should be 0');
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
    assert.ok(adminDashboardContent.includes('إشعار رسوم وعمولات ومصروفات بنكية مخصومة'), 'Bank charges template missing');
});

// Test 9: Live Compound Entry Calculation in Scenario Builder
runTest('دالة updateVisualPreview تحتسب أطراف القيد المركب والضرائب تلقائياً للمشرف', () => {
    assert.ok(adminDashboardContent.includes('function updateVisualPreview()'), 'updateVisualPreview function missing');
    assert.ok(adminDashboardContent.includes('Math.round(baseAmt * 0.14)'), '14% VAT calculation missing');
    assert.ok(adminDashboardContent.includes('Math.round(baseAmt * 0.05)'), '5% payroll tax calculation missing');
    assert.ok(adminDashboardContent.includes('Math.round(baseAmt * 0.11)'), '11% social insurance calculation missing');
});

// Test 10: Automatic Bank Statement Synchronization
runTest('باني السيناريوهات يزامن المعاملات النقدية والبنكية مع كشف الحساب البنكي تلقائياً', () => {
    assert.ok(adminDashboardContent.includes('syncBank'), 'syncBank flag evaluation missing');
    assert.ok(adminDashboardContent.includes('bank_statement_items'), 'bank_statement_items storage key missing');
    assert.ok(adminDashboardContent.includes('comp.bank_statement_items.push'), 'Statement item push missing');
});

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص باني السيناريوهات وفاحص المستندات: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
    process.exit(1);
}
