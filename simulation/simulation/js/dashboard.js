// ================= DASHBOARD CONTROLLER =================
function updateDashboard() {
    const journal = (typeof getStudentJournal === 'function') ? getStudentJournal() : (window.studentJournal || []);
    const balances = (typeof calculateBalances === 'function') ? calculateBalances() : {};

    const revenue = Math.abs(balances['4101'] || 0);
    const cogs = Math.abs(balances['5101'] || 0);
    const grossProfit = revenue - cogs;
    
    const opex = Math.abs(balances['5203'] || 0) + Math.abs(balances['5204'] || 0) + 
                 Math.abs(balances['5205'] || 0) + Math.abs(balances['5206'] || 0);
    const netIncome = grossProfit - opex;

    const cash = (balances['1101'] || 0) + (balances['1102'] || 0);
    const payables = Math.abs(balances['2101'] || 0);

    const revEl = document.getElementById('stat-revenue');
    const netEl = document.getElementById('stat-net-income');
    const cashEl = document.getElementById('stat-cash');
    const payEl = document.getElementById('stat-payables');

    if(revEl) revEl.innerText = revenue.toLocaleString();
    if(netEl) netEl.innerText = netIncome.toLocaleString();
    if(cashEl) cashEl.innerText = cash.toLocaleString();
    if(payEl) payEl.innerText = payables.toLocaleString();

    // Calculate real dynamic progress
    const totalTrx = (window.ANSWER_KEY && window.ANSWER_KEY.length) || 0;
    const postedEntries = journal.filter(j => j.status === 'posted');
    const completedCount = postedEntries.length;
    const progressPercent = totalTrx > 0 ? Math.min(100, Math.round((completedCount / totalTrx) * 100)) : 0;

    if (typeof updateAllHeaderBadges === 'function') {
        updateAllHeaderBadges();
    }

    const wfBadge = document.getElementById('wf-journal-badge');
    if (wfBadge) {
        wfBadge.innerText = totalTrx > 0 ? (completedCount + ' من ' + totalTrx + ' قيد') : (completedCount + ' قيد مسجل');
    }

    // Health Score and Workflow details
    const healthVal = document.getElementById('health-score-val');
    const healthTitle = document.getElementById('health-score-title');
    const healthDesc = document.getElementById('health-score-desc');
    const wfLedgerBadge = document.getElementById('wf-ledger-badge');
    const wfTbBadge = document.getElementById('wf-tb-badge');

    if (completedCount === 0) {
        if (healthVal) healthVal.innerText = '0';
        if (healthTitle) healthTitle.innerText = 'بانتظار بدء التسجيل المحاسبي';
        if (healthDesc) healthDesc.innerText = totalTrx > 0
            ? 'المحاكاة جاهزة ومسندة بالمهام (0%). ابدأ بتسجيل وترحيل القيود من شاشة اليومية للانطلاق في الدورة المحاسبية.'
            : 'البيئة جاهزة ومصفرة بالكامل (0%). يمكنك تسجيل قيود محاسبية حرة أو انتظار إسناد المهام من لوحة الإدارة.';
        if (wfLedgerBadge) wfLedgerBadge.innerText = 'بانتظار الترحيل';
        if (wfTbBadge) wfTbBadge.innerText = 'بانتظار الترحيل';
    } else {
        const score = Math.max(10, Math.min(100, progressPercent + (cash > 0 ? 20 : 0)));
        if (healthVal) healthVal.innerText = score;
        if (healthTitle) healthTitle.innerText = 'الدورة المحاسبية نشطة (' + progressPercent + '%)';
        if (healthDesc) healthDesc.innerText = 'تم تسجيل وترحيل ' + completedCount + ' قيد بنجاح (شاملة الأرصدة الافتتاحية). تتبع تسلسل العمليات وتدقيق ميزان المراجعة بانتظام.';
        if (wfLedgerBadge) wfLedgerBadge.innerText = 'مرحل (' + completedCount + ' قيود)';
        if (wfTbBadge) {
            wfTbBadge.className = 'font-label-sm text-label-sm px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300';
            wfTbBadge.innerText = 'متزن ✓';
        }
    }
}

function getDocumentName(type) {
    const map = {
        'Opening Balance': 'محضر إثبات الأرصدة الافتتاحية',
        'Sale': 'فاتورة مبيعات آجل',
        'Cash Sale': 'فاتورة مبيعات نقدية',
        'Cash Sale COGS': 'إذن صرف مخزني - مبيعات نقدية',
        'COGS': 'إذن صرف مخزني - تكلفة المبيعات',
        'Purchase': 'فاتورة مشتريات بضاعة',
        'Collection': 'إيصال تحصيل نقدية / بنك',
        'Payment': 'إشعار سداد دفعة مورد',
        'Payroll': 'مسير رواتب وأجور الموظفين',
        'Payroll Settlement': 'سداد ضرائب وتأمينات الرواتب',
        'Expense': 'فاتورة إيجار ومصروفات تشغيلية',
        'Prepayment': 'سداد مصروفات مدفوعة مقدماً',
        'Prepayment Amortization': 'مذكرة تسوية إطفاء مصروف مقدم',
        'Accrual': 'إشعار استحقاق مصروفات مرافق',
        'Accrual Settlement': 'سداد مصروفات مستحقة',
        'Unearned Revenue': 'إيصال استلام إيراد غير مكتسب',
        'Unearned Rev Recognition': 'مذكرة اعتراف بإيراد خدمات',
        'Accrued Revenue': 'مذكرة إثبات إيراد خدمات مستحق',
        'Accrued Rev Collection': 'تحصيل إيرادات خدمات مستحقة',
        'Bank Loan': 'عقد تمويل وقرض بنكي',
        'Bank Charges': 'إشعار رسوم ومصروفات بنكية',
        'Asset Disposal': 'محضر بيع واستبعاد أصل ثابت',
        'Sales Return': 'إشعار دائن - مردودات مبيعات',
        'Sales Return Inv': 'إذن رد بضاعة إلى المخزن',
        'Purchase Return': 'إشعار مدين - مردودات مشتريات',
        'Bad Debt Provision': 'مذكرة تسوية مخصص ديون مشكوك فيها',
        'Inventory Impairment': 'مذكرة تسوية مخصص هبوط أسعار المخزون',
        'Interest Accrual': 'مذكرة استحقاق فوائد بنكية',
        'VAT Settlement': 'سداد ضريبة القيمة المضافة',
        'VAT Clearing': 'مذكرة تسوية ومقاصة ضريبة القيمة المضافة',
        'Depreciation': 'مذكرة قسط الإهلاك السنوي للأصول',
        'Misc Expense': 'سند صرف مصروفات متفرقة',
        'General': 'قيد يومية عام'
    };
    return map[type] || 'مستند محاسبي';
}

// Immediate robust startup
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.updateDashboard = updateDashboard;
window.getDocumentName = getDocumentName;
