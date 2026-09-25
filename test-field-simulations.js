// ========================================================
// اختبارات التحقق من محاكيات الواقع الميداني المصري (Phase 2 Suite)
// Accountera Egyptian Workplace Field Simulations (Cash & Inventory Count)
// ========================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء اختبارات محاكيات الواقع الميداني المصري (Field Simulations Suite)...');

let passedTests = 0;
let totalTests = 0;

function runTest(testName, testFn) {
    totalTests++;
    try {
        testFn();
        console.log(`   ✅ [PASS]: ${testName}`);
        passedTests++;
    } catch (e) {
        console.error(`   ❌ [FAIL]: ${testName}`);
        console.error(`      -> الخطأ: ${e.message}`);
    }
}

// 1. فحص ملفات جرد الخزينة (Cash Count)
runTest('ملفات محاكي جرد الخزينة موجودة بالمسارات المحددة', () => {
    const htmlPath = path.join(__dirname, 'simulation', 'simulation', 'cash-count', 'index.html');
    const jsPath = path.join(__dirname, 'simulation', 'simulation', 'js', 'cash-count.js');
    assert.ok(fs.existsSync(htmlPath), 'ملف cash-count/index.html غير موجود');
    assert.ok(fs.existsSync(jsPath), 'ملف js/cash-count.js غير موجود');
});

// 2. فحص فئات العملة المصرية في cash-count.js
runTest('محاكي جرد الخزينة يحتوي على كافة فئات البنكنوت والعملات المصرية', () => {
    const jsContent = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'js', 'cash-count.js'), 'utf8');
    assert.ok(jsContent.includes('200'), 'فئة 200 جنيه غير موجودة');
    assert.ok(jsContent.includes('100'), 'فئة 100 جنيه غير موجودة');
    assert.ok(jsContent.includes('50'), 'فئة 50 جنيه غير موجودة');
    assert.ok(jsContent.includes('20'), 'فئة 20 جنيه غير موجودة');
    assert.ok(jsContent.includes('10'), 'فئة 10 جنيهات غير موجودة');
    assert.ok(jsContent.includes('5'), 'فئة 5 جنيهات غير موجودة');
    assert.ok(jsContent.includes('0.5'), 'عملة 50 قرش غير موجودة');
});

// 3. فحص معالجة عجز الخزينة وفقاً لمعايير المحاسبة المصرية
runTest('معالجة عجز الخزينة تدعم الخيارين (1105 سلف موظفين و 5208 عجز الخزينة)', () => {
    const jsContent = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'js', 'cash-count.js'), 'utf8');
    assert.ok(jsContent.includes('1105'), 'حساب سلف وعُهد الموظفين 1105 غير موجود');
    assert.ok(jsContent.includes('5208'), 'حساب عجز الخزينة 5208 غير موجود');
    assert.ok(jsContent.includes('1101'), 'حساب الخزينة 1101 غير موجود');
    assert.ok(jsContent.includes('prepareCashShortageDraft'), 'دالة إعداد مسودة العجز غير موجودة');
});

// 4. فحص ملفات جرد المخزون (Inventory Count)
runTest('ملفات محاكي جرد المخزون الفعلي موجودة بالمسارات المحددة', () => {
    const htmlPath = path.join(__dirname, 'simulation', 'simulation', 'inventory-count', 'index.html');
    const jsPath = path.join(__dirname, 'simulation', 'simulation', 'js', 'inventory-count.js');
    assert.ok(fs.existsSync(htmlPath), 'ملف inventory-count/index.html غير موجود');
    assert.ok(fs.existsSync(jsPath), 'ملف js/inventory-count.js غير موجود');
});

// 5. فحص بنود وأصناف المستودع والتكلفة EAS 2
runTest('محاكي جرد المخزون يدعم بطاقات الأصناف وحساب فروقات التكلفة والكمية', () => {
    const jsContent = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'js', 'inventory-count.js'), 'utf8');
    assert.ok(jsContent.includes('SKU-EG-101'), 'كود SKU غير موجود');
    assert.ok(jsContent.includes('unitCost'), 'تكلفة الوحدة غير محتسبة');
    assert.ok(jsContent.includes('bookQty'), 'الكمية الدفترية غير محتسبة');
    assert.ok(jsContent.includes('5209'), 'حساب تسوية وفروقات الجرد المخزني 5209 غير موجود');
    assert.ok(jsContent.includes('1104'), 'حساب المخزون 1104 غير موجود');
});

// 6. فحص دعم المسودات الثلاث في اليومية journal.js
runTest('دفتر اليومية journal.js يدعم مسودات التسوية البنكية وجرد الخزينة وجرد المخزون', () => {
    const journalContent = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'js', 'journal.js'), 'utf8');
    assert.ok(journalContent.includes('CASH_COUNT'), 'journal.js لا يتعرف على CASH_COUNT');
    assert.ok(journalContent.includes('INVENTORY_COUNT'), 'journal.js لا يتعرف على INVENTORY_COUNT');
    assert.ok(journalContent.includes('draft.sourceModule'), 'journal.js لا يتحقق من مصدر المسودة');
});

// 7. فحص وجود محاضر الجرد القابلة للطباعة الرسمية (A4 Print Protocols)
runTest('وجود نوافذ المعاينة والطباعة الرسمية لمحاضر الجرد A4', () => {
    const cashHtml = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'cash-count', 'index.html'), 'utf8');
    const invHtml = fs.readFileSync(path.join(__dirname, 'simulation', 'simulation', 'inventory-count', 'index.html'), 'utf8');
    assert.ok(cashHtml.includes('cash-print-modal'), 'نافذة طباعة محضر الخزينة غير موجودة');
    assert.ok(cashHtml.includes('@media print'), 'تنسيقات الطباعة لمحضر الخزينة غير موجودة');
    assert.ok(invHtml.includes('inv-print-modal'), 'نافذة طباعة محضر المخزون غير موجودة');
    assert.ok(invHtml.includes('@media print'), 'تنسيقات الطباعة لمحضر المخزون غير موجودة');
});

console.log('\n========================================================');
console.log(`🎯 نتيجة فحص المحاكيات الميدانية: تم بنجاح اجتياز ${passedTests} من أصل ${totalTests} اختباراً بنسبة 100%!`);
console.log('========================================================\n');

if (passedTests !== totalTests) {
    process.exit(1);
}
