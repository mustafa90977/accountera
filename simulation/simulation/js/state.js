// ================= STATE & CORE INITIALIZATION =================
// Scoped storage management to protect host project from accidental data loss
const SIM_STORAGE_VERSION = 'v2026_auto_opening_balance_v7';
if (typeof localStorage !== 'undefined' && localStorage.getItem('sim_storage_ver') !== SIM_STORAGE_VERSION) {
    // Only clear student answers when version changes, preserve company tasks and profiles!
    ['student_journal', 'student_ledger', 'bank_statement_items'].forEach(k => {
        localStorage.removeItem(k);
    });
    localStorage.setItem('sim_storage_ver', SIM_STORAGE_VERSION);
}

let answerKey = [];
let studentJournal = [];
let studentLedger = {};

// ================= CHART OF ACCOUNTS (37 ACCOUNTS - 100% GENERATOR MATCH) =================
const COA = {
    '1101': { name: 'Cash (نقدية بالصندوق)', type: 'Asset' },
    '1102': { name: 'Bank (بنك)', type: 'Asset' },
    '1103': { name: 'Accounts Receivable (عملاء)', type: 'Asset' },
    '1103.1': { name: 'Allowance for Doubtful Accounts (مخصص ديون مشكوك فيها)', type: 'Contra Asset' },
    '1104': { name: 'Inventory (مخزون)', type: 'Asset' },
    '1104.1': { name: 'Allowance for Inventory Obsolescence (مخصص هبوط أسعار المخزون)', type: 'Contra Asset' },
    '1105': { name: 'Prepaid Expenses (مصروفات مدفوعة مقدماً)', type: 'Asset' },
    '1106': { name: 'Input VAT (ضريبة القيمة المضافة - مدخلات)', type: 'Asset' },
    '1107': { name: 'Accrued Revenue (إيرادات مستحقة)', type: 'Asset' },
    '1201': { name: 'Fixed Assets (أصول ثابتة)', type: 'Asset' },
    '1202': { name: 'Accumulated Depreciation (مجمع إهلاك)', type: 'Contra Asset' },

    '2101': { name: 'Accounts Payable (موردون)', type: 'Liability' },
    '2102': { name: 'Output VAT (ضريبة القيمة المضافة - مخرجات)', type: 'Liability' },
    '2103': { name: 'Accrued Expenses (مصروفات مستحقة)', type: 'Liability' },
    '2104': { name: 'Unearned Revenue (إيرادات غير مكتسبة)', type: 'Liability' },
    '2105': { name: 'Payroll Taxes Payable (ضرائب رواتب مستحقة)', type: 'Liability' },
    '2106': { name: 'Social Insurance Payable (تأمينات اجتماعية مستحقة)', type: 'Liability' },
    '2107': { name: 'Interest Payable (فوائد مستحقة)', type: 'Liability' },
    '2201': { name: 'Bank Loan (قرض بنكي)', type: 'Liability' },

    '3101': { name: 'Capital (رأس المال)', type: 'Equity' },
    '3102': { name: 'Retained Earnings (أرباح محتجزة)', type: 'Equity' },

    '4101': { name: 'Sales Revenue (إيرادات مبيعات)', type: 'Revenue' },
    '4104': { name: 'Sales Discount (خصم مسموح به)', type: 'Contra Revenue' },
    '4105': { name: 'Sales Returns (مردودات مبيعات)', type: 'Contra Revenue' },
    '4201': { name: 'Gain on Asset Disposal (أرباح استبعاد أصول)', type: 'Revenue' },

    '5101': { name: 'Cost of Goods Sold (تكلفة البضاعة المباعة)', type: 'Expense' },
    '5102': { name: 'Purchase Discount (خصم مكتسب)', type: 'Contra Expense' },

    '5201': { name: 'Salaries Expense (مصروف رواتب)', type: 'Expense' },
    '5202': { name: 'Rent Expense (مصروف إيجار)', type: 'Expense' },
    '5203': { name: 'Utilities Expense (مصروف مرافق)', type: 'Expense' },
    '5204': { name: 'Depreciation Expense (مصروف إهلاك)', type: 'Expense' },
    '5205': { name: 'Bad Debt Expense (مصروف ديون معدومة)', type: 'Expense' },
    '5206': { name: 'Inventory Obsolescence Expense (مصروف هبوط أسعار المخزون)', type: 'Expense' },
    '5207': { name: 'Maintenance Expense (مصروف صيانة)', type: 'Expense' },
    '5208': { name: 'Bank Charges (مصروفات بنكية)', type: 'Expense' },
    '5209': { name: 'Interest Expense (مصروف فوائد)', type: 'Expense' },
    '5210': { name: 'Loss on Asset Disposal (خسائر استبعاد أصول)', type: 'Expense' },
    '5211': { name: 'Cash Shortage Expense (مصروف عجز الخزينة)', type: 'Expense' },
    '5212': { name: 'Employer Social Insurance Share (حصة الشركة في التأمينات)', type: 'Expense' }
};

const ACCOUNTS = {};
Object.keys(COA).forEach(k => { ACCOUNTS[k] = COA[k].name; });
window.ACCOUNTS = ACCOUNTS;

// ================= CRYPTOGRAPHIC CANONICAL EVALUATION ENGINE =================
function canonicalizeLines(lines) {
    if (!lines || !Array.isArray(lines)) return '';
    const normalized = lines.map(l => ({
        accountCode: String(l.account || l.accountCode || '').trim(),
        debit: Math.round((Number(l.debit) || 0) * 100) / 100,
        credit: Math.round((Number(l.credit) || 0) * 100) / 100
    })).filter(l => l.debit > 0 || l.credit > 0);

    normalized.sort((a, b) => {
        if (a.debit > 0 && b.debit === 0) return -1;
        if (b.debit > 0 && a.debit === 0) return 1;
        if (a.accountCode !== b.accountCode) return a.accountCode.localeCompare(b.accountCode);
        if (a.debit !== b.debit) return a.debit - b.debit;
        return a.credit - b.credit;
    });

    return JSON.stringify(normalized);
}

function sha256Sync(str) {
    // UTF-8 encode to seamlessly handle any Unicode/Arabic characters without silent failure
    const ascii = unescape(encodeURIComponent(str || ''));
    function rightRotate(value, amount) {
        return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let lengthProperty = 'length';
    let i, j;
    let result = '';
    const words = [];
    const asciiBitLength = ascii[lengthProperty] * 8;
    let hash = [];
    const k = [];
    let primeCounter = 0;
    const isComposite = {};
    for (let candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
            k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
        }
    }
    hash = hash.slice(0, 8);
    let padded = ascii + '\x80';
    while ((padded[lengthProperty] % 64) - 56) padded += '\x00';
    for (i = 0; i < padded[lengthProperty]; i++) {
        j = padded.charCodeAt(i);
        words[i >> 2] |= j << (((3 - i) % 4) * 8);
    }
    words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
    words[words[lengthProperty]] = asciiBitLength;
    for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, (j += 16));
        const oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
            const w15 = w[i - 15], w2 = w[i - 2];
            const a = hash[0], e = hash[4];
            const temp1 =
                hash[7] +
                (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                ((e & hash[5]) ^ (~e & hash[6])) +
                k[i] +
                (w[i] =
                    i < 16
                        ? w[i]
                        : (w[i - 16] +
                            (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                            w[i - 7] +
                            (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                        0);
            const temp2 =
                (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
            hash = [(temp1 + temp2) | 0].concat(hash);
            hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) {
            hash[i] = (hash[i] + oldHash[i]) | 0;
        }
    }
    for (i = 0; i < 8; i++) {
        for (let i2 = 3; i2 >= 0; i2--) {
            const b = (hash[i] >> (i2 * 8)) & 255;
            result += (b < 16 ? '0' : '') + b.toString(16);
        }
    }
    return result;
}

window.canonicalizeLines = canonicalizeLines;
window.sha256Sync = sha256Sync;

// ================= DYNAMIC TASK LOADER & CONVERTER =================
function detectTxType(tx) {
    if (!tx) return 'General';
    const dr = tx.dr || tx.correctDebit || (Array.isArray(tx.lines) && tx.lines.find(l => Number(l.debit) > 0)?.accountCode);
    const cr = tx.cr || tx.correctCredit || (Array.isArray(tx.lines) && tx.lines.find(l => Number(l.credit) > 0)?.accountCode);
    if (cr === 'sales_rev' || cr === '4101') return (dr === 'cash' || dr === '1101') ? 'Cash Sale' : 'Sale';
    if (dr === 'inventory' || dr === '1104' || dr === '1105') return 'Purchase';
    if ((dr === 'cash' || dr === '1101') && (cr === 'ar' || cr === '1103')) return 'Collection';
    if ((dr === 'ap' || dr === '2101') && (cr === 'cash' || cr === '1101')) return 'Payment';
    if (dr === 'salary_exp' || dr === '5201') return 'Payroll';
    if (dr === 'rent_exp' || dr === 'util_exp' || dr === '5202' || dr === '5203') return 'Expense';
    if (dr === 'equipment' || dr === '1201') return 'Asset Disposal';
    return tx.type || 'General';
}
window.detectTxType = detectTxType;

function transformHostTransactions(transactions = []) {
    return transactions.map((tx, idx) => {
        // Mode A: Hashed & Secured transaction (No plaintext answers/lines)
        if (tx.validationHash && tx.salt) {
            return {
                id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
                txId: tx.txId || tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
                jeId: tx.jeId || `JE-${String(idx + 1).padStart(6, '0')}`,
                num: tx.num || idx + 1,
                ref: tx.ref || (tx.docData && tx.docData.ref) || `INV-${1000 + (tx.num || idx + 1)}`,
                date: tx.date || (tx.docData && tx.docData.date) || "2026-01-15",
                type: tx.type || detectTxType(tx),
                title: tx.title || tx.desc || "معاملة تجارية",
                difficulty: tx.difficulty || "Medium",
                desc: tx.desc || tx.title || "معاملة تجارية",
                category: tx.category || "general",
                categoryAr: tx.categoryAr || "محاسبة عامة",
                amount: Number(tx.amount) || 0,
                requiredLinesCount: tx.requiredLinesCount || 2,
                docData: tx.docData || { totalAmount: Number(tx.amount) || 0, date: tx.date, ref: tx.ref },
                salt: tx.salt,
                validationHash: tx.validationHash,
                openingBalances: tx.openingBalances || null
            };
        }

        // Mode B: Legacy custom upload with lines (e.g. from local test uploads)
        if (tx.lines && Array.isArray(tx.lines) && tx.lines.length > 0) {
            const totalDebit = tx.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
            const maxDebit = Math.max(...tx.lines.map(l => Number(l.debit) || 0));
            const txAmount = Number(tx.amount) || maxDebit || totalDebit || 0;
            const txType = tx.type || detectTxType(tx);
            const date = tx.date || (tx.docData && tx.docData.date) || "2026-01-15";
            const ref = tx.ref || (tx.docData && tx.docData.ref) || `INV-${1000 + (tx.num || idx + 1)}`;

            const vatLine = tx.lines.find(l => String(l.accountCode) === '1106' || String(l.accountCode) === '2102');
            const vatAmt = vatLine ? (Number(vatLine.debit) || Number(vatLine.credit) || 0) : (Number(tx.docData?.vatAmount) || Number(tx.vatAmount) || 0);
            const subtotal = (tx.docData && tx.docData.subtotal != null)
                ? Number(tx.docData.subtotal)
                : ((txAmount > vatAmt && vatAmt > 0) ? (txAmount - vatAmt) : txAmount);

            let partyName = tx.partyName || (tx.docData && tx.docData.partyName) || '';
            if (!partyName) {
                if (txType === 'Purchase') partyName = 'شركة الدلتا للتوريدات والمستودعات';
                else if (txType === 'Sale') partyName = 'مؤسسة الشروق التجارية';
            }

            return {
                id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
                txId: tx.txId || tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
                jeId: tx.jeId || `JE-${String(idx + 1).padStart(6, '0')}`,
                ref: ref,
                date: date,
                type: txType,
                title: tx.title || tx.desc || "معاملة تجارية",
                difficulty: tx.difficulty || "Medium",
                desc: tx.desc || tx.title || "معاملة تجارية",
                amount: txAmount,
                docData: tx.docData || {
                    totalAmount: txAmount,
                    subtotal: subtotal,
                    vatAmount: vatAmt,
                    vatRate: vatAmt > 0 ? "14%" : "0%",
                    partyName: partyName,
                    date: date,
                    ref: ref
                },
                hints: tx.hints || [],
                solutionSteps: tx.solutionSteps || [],
                accountingRule: tx.accountingRule || '',
                categoryAr: tx.categoryAr || '',
                lines: tx.lines.map((l, lIdx) => {
                    const code = String(l.accountCode || '1101');
                    if (!COA[code]) {
                        const isContra = code.includes('.1');
                        const defaultType = code.startsWith('1') ? (isContra ? 'Contra Asset' : 'Asset') :
                                            code.startsWith('2') ? 'Liability' :
                                            code.startsWith('3') ? 'Equity' :
                                            code.startsWith('4') ? 'Revenue' : 'Expense';
                        COA[code] = {
                            name: l.accountName || `حساب (${code})`,
                            type: l.acctType || l.accountType || defaultType
                        };
                        ACCOUNTS[code] = COA[code].name;
                    }
                    return {
                        lineNum: l.lineNum || lIdx + 1,
                        accountCode: code,
                        accountName: l.accountName || (COA[code] ? COA[code].name : 'حساب'),
                        acctType: l.acctType || l.accountType || (COA[code] ? COA[code].type : 'Asset'),
                        debit: Number(l.debit) || 0,
                        credit: Number(l.credit) || 0,
                        description: l.description || tx.desc || tx.title || ''
                    };
                })
            };
        }

        const drCode = (COA[tx.dr] ? tx.dr : (COA[tx.correctDebit] ? tx.correctDebit : '1101'));
        const crCode = (COA[tx.cr] ? tx.cr : (COA[tx.correctCredit] ? tx.correctCredit : '4101'));
        const amt = Number(tx.amount) || 0;
        const txType = tx.type || detectTxType(tx);
        const date = tx.date || "2026-01-15";
        const ref = tx.ref || `INV-${1000 + (tx.num || idx + 1)}`;

        let partyName = tx.partyName || '';
        if (!partyName) {
            if (txType === 'Purchase' || crCode === '2101' || tx.cr === 'ap') partyName = 'شركة الدلتا للتوريدات والمستودعات';
            else if (txType === 'Sale' || drCode === '1103' || tx.dr === 'ar') partyName = 'مؤسسة الشروق التجارية';
        }

        return {
            id: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
            txId: tx.id || `TRX-${String(idx + 1).padStart(5, '0')}`,
            jeId: `JE-${String(idx + 1).padStart(6, '0')}`,
            ref: ref,
            date: date,
            type: txType,
            difficulty: "Medium",
            desc: tx.desc || tx.title || "معاملة تجارية",
            title: tx.title || tx.desc || "معاملة تجارية",
            amount: amt,
            docData: tx.docData || {
                totalAmount: amt,
                subtotal: amt,
                vatAmount: 0,
                vatRate: "0%",
                partyName: partyName,
                date: date,
                ref: ref
            },
            lines: [
                { lineNum: 1, accountCode: drCode, accountName: COA[drCode]?.name || 'حساب مدين', acctType: COA[drCode]?.type || 'Asset', debit: amt, credit: 0, description: tx.title || tx.desc || '' },
                { lineNum: 2, accountCode: crCode, accountName: COA[crCode]?.name || 'حساب دائن', acctType: COA[crCode]?.type || 'Revenue', debit: 0, credit: amt, description: tx.title || tx.desc || '' }
            ]
        };
    });
}

function loadTasks() {
    // Priority 1: Window ANSWER_KEY (set directly in window or via data.js)
    if (window.ANSWER_KEY && Array.isArray(window.ANSWER_KEY) && window.ANSWER_KEY.length > 0) {
        return window.ANSWER_KEY;
    }
    // Priority 2: Admin injected tasks in localStorage
    try {
        const raw = localStorage.getItem('sim_admin_tasks');
        if (raw) {
            let parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // تعقيم وتصحيح تلقائي لأي مهام مخزنة كانت تفتقد للمبالغ أو docData
                let needsUpdate = false;
                parsed = parsed.map((t, idx) => {
                    const lineMax = Array.isArray(t.lines) ? Math.max(...t.lines.map(l => Number(l.debit) || 0)) : 0;
                    const realAmt = Number(t.amount) || lineMax || 0;
                    if ((!t.amount || t.amount === 0) && realAmt > 0) {
                        t.amount = realAmt;
                        needsUpdate = true;
                    }
                    if (!t.docData || (!t.docData.totalAmount && realAmt > 0)) {
                        let party = t.partyName || '';
                        const tType = t.type || detectTxType(t);
                        if (!party) {
                            if (tType === 'Purchase') party = 'شركة الدلتا للتوريدات والمستودعات';
                            else if (tType === 'Sale') party = 'مؤسسة الشروق التجارية';
                        }
                        t.docData = {
                            totalAmount: realAmt,
                            subtotal: realAmt,
                            vatAmount: 0,
                            vatRate: "0%",
                            partyName: party,
                            date: t.date || "2026-01-15",
                            ref: t.ref || `INV-${1000 + (t.num || idx + 1)}`
                        };
                        needsUpdate = true;
                    }
                    if (!t.type || t.type === 'General') {
                        const detected = detectTxType(t);
                        if (detected !== t.type) {
                            t.type = detected;
                            needsUpdate = true;
                        }
                    }
                    return t;
                });
                if (needsUpdate) {
                    localStorage.setItem('sim_admin_tasks', JSON.stringify(parsed));
                }
                return parsed;
            }
        }
    } catch(e) {}

    // Priority 3: Fallback تلقائي لاسترجاع آخر شركة مضافة أو مرفوعة من المنصة
    try {
        const rawCompanies = localStorage.getItem('acc_admin_companies');
        if (rawCompanies) {
            let list = JSON.parse(rawCompanies);
            if (Array.isArray(list) && list.length > 0) {
                // تصفية شركات الاختبار والتدقيق
                list = list.filter(c => c && c.id && !c.id.startsWith('audit-') && !c.id.startsWith('test-'));

                // البحث عن الشركة المحددة أو شركة فيها سندات فعلية
                let activeComp = null;
                const rawProf = localStorage.getItem('sim_company_profile');
                if (rawProf) {
                    const prof = JSON.parse(rawProf);
                    if (prof && prof.id) {
                        activeComp = list.find(c => c.id === prof.id);
                    }
                }
                if (!activeComp || !activeComp.transactions || activeComp.transactions.length === 0) {
                    activeComp = list.find(c => c.transactions && c.transactions.length > 0) || list[0];
                }

                if (activeComp && activeComp.transactions && activeComp.transactions.length > 0) {
                    const tasks = transformHostTransactions(activeComp.transactions);
                    localStorage.setItem('sim_admin_tasks', JSON.stringify(tasks));
                    
                    const profile = {
                        id: activeComp.id,
                        name: activeComp.name,
                        enName: activeComp.name,
                        code: `${(activeComp.id || 'CMP').toUpperCase().replace('COMPANY-', '')}-2026`,
                        activity: activeComp.sector,
                        sector: activeComp.sector,
                        badge: activeComp.badge || 'نشاط تجاري',
                        employees: '35 موظف مسجل',
                        role: activeComp.role || 'محاسب مالي',
                        year: activeComp.month || 'السنة المالية 2026'
                    };
                    localStorage.setItem('sim_company_profile', JSON.stringify(profile));
                    return tasks;
                }
            }
        }
    } catch(e) {}

    // Priority 4: Fallback للشركة الافتراضية المدمجة في النظام (DEFAULT_SIM_COMPANY)
    try {
        if (window.DEFAULT_SIM_COMPANY && window.DEFAULT_SIM_COMPANY.transactions && window.DEFAULT_SIM_COMPANY.transactions.length > 0) {
            const defComp = window.DEFAULT_SIM_COMPANY;
            const tasks = transformHostTransactions(defComp.transactions);
            localStorage.setItem('sim_admin_tasks', JSON.stringify(tasks));

            const profile = {
                id: defComp.id || 'comp-al-noor',
                name: defComp.name || 'شركة النور',
                enName: defComp.name || 'شركة النور',
                code: 'NOOR-2026',
                activity: defComp.sector || 'تجارة الاجهزه (خدمي وتوزيع)',
                sector: defComp.sector || 'تجارة الاجهزه (خدمي وتوزيع)',
                badge: defComp.badge || 'بيئة أعمال متكاملة',
                employees: '35 موظف مسجل',
                role: defComp.role || 'محاسب عام',
                year: defComp.month || 'السنة المالية 2026'
            };
            localStorage.setItem('sim_company_profile', JSON.stringify(profile));
            return tasks;
        }
    } catch(e) {}

    return [];
}

function applyCompanyProfile() {
    try {
        const raw = localStorage.getItem('sim_company_profile');
        if (raw) {
            const p = JSON.parse(raw);
            if (p && p.name) {
                // 1. Company title and header display
                document.querySelectorAll('.company-title-display').forEach(el => {
                    el.innerText = p.name;
                });

                // 2. Company English name and Code subtitle (e.g. Nile Trading & Distribution Co. • NTL-2026)
                document.querySelectorAll('.company-subtitle-display').forEach(el => {
                    const en = p.enName || p.name;
                    const code = p.code || 'CMP-2026';
                    el.innerText = en + ' • ' + code;
                });

                // 3. Sector badge
                document.querySelectorAll('.company-sector-display').forEach(el => {
                    el.innerText = p.sector || p.activity || 'نشاط تجاري عام';
                });

                // 4. Employees count badge
                document.querySelectorAll('.company-employees-display').forEach(el => {
                    el.innerText = p.employees || '30 موظف مسجل';
                });

                // 5. Fiscal year badge
                document.querySelectorAll('.company-year-display').forEach(el => {
                    el.innerText = p.year || 'السنة المالية: 2026';
                });
            }
        }
    } catch(e) {}
}

// ================= INITIALIZATION & STATE MIGRATION =================
function initApp() {
    if (typeof injectMonthClosingModal === 'function') injectMonthClosingModal();
    if (typeof updateHeaderClosingStatus === 'function') updateHeaderClosingStatus();

    answerKey = loadTasks();

    loadStudentState();
    updateAllHeaderBadges();
    applyCompanyProfile();

    const p = window.location.pathname.toLowerCase();
    if (p.includes('journal') || p.includes('_2')) {
        if (typeof initWorkspace === 'function') initWorkspace();
    } else if (p.includes('ledger') || p.includes('_4')) {
        if (typeof initLedger === 'function') initLedger();
    } else if (p.includes('bank-recon') || p.includes('recon') || p.includes('_3')) {
        if (typeof initRecon === 'function') initRecon();
    } else if (p.includes('statements') || p.includes('_5')) {
        if (typeof updateStatements === 'function') updateStatements();
    } else if (p.includes('accounts') || p.includes('_6')) {
        // Accounts tree screen
    } else {
        // Default to dashboard
        if (typeof updateDashboard === 'function') updateDashboard();
    }
}

function updateAllHeaderBadges() {
    const totalTrx = (answerKey && answerKey.length) || 0;
    const postedEntries = (studentJournal || []).filter(j => j.status === 'posted');
    const count = postedEntries.length;
    const pct = totalTrx > 0 ? Math.min(100, Math.round((count / totalTrx) * 100)) : 0;

    document.querySelectorAll('.header-progress-short').forEach(el => {
        el.innerText = pct + '%';
    });
    document.querySelectorAll('.header-progress-full').forEach(el => {
        el.innerText = totalTrx > 0 
            ? (pct + '% إنجاز (' + count + '/' + totalTrx + ')')
            : (count + ' قيد مسجل');
    });
}

function autoPostOpeningBalance() {
    if (!answerKey || !Array.isArray(answerKey) || answerKey.length === 0) return;

    // Search for Opening Balance task (by type, ref, description, or high line count)
    const openingTask = answerKey.find(t => 
        t.type === 'Opening Balance' || 
        (t.ref && t.ref.includes('OP')) ||
        (t.desc && (t.desc.includes('افتتاحي') || t.desc.includes('الأرصدة الافتتاحية') || t.desc.includes('Opening Balances'))) ||
        (t.title && (t.title.includes('افتتاحي') || t.title.includes('الأرصدة الافتتاحية'))) ||
        (t.openingBalances && t.openingBalances.length > 20) ||
        (t.lines && t.lines.length > 20)
    );

    if (!openingTask) return;

    const opBalances = openingTask.openingBalances || openingTask.lines || [];

    // Register all accounts from opening task in COA and ACCOUNTS
    if (Array.isArray(opBalances)) {
        opBalances.forEach(l => {
            const code = String(l.accountCode || '');
            if (code && !COA[code]) {
                const isContra = code.includes('.1');
                const defaultType = code.startsWith('1') ? (isContra ? 'Contra Asset' : 'Asset') :
                                    code.startsWith('2') ? 'Liability' :
                                    code.startsWith('3') ? 'Equity' :
                                    code.startsWith('4') ? 'Revenue' : 'Expense';
                COA[code] = {
                    name: l.accountName || `حساب (${code})`,
                    type: l.acctType || l.accountType || defaultType
                };
                ACCOUNTS[code] = COA[code].name;
            }
        });
    }

    // Check if already in studentJournal
    let existing = (studentJournal || []).find(j => j.id === openingTask.id);

    if (!existing) {
        const openingLines = opBalances.map((l, idx) => ({
            lineId: openingTask.id + '_' + idx,
            accountCode: String(l.accountCode || '1101'),
            accountName: l.accountName || (COA[l.accountCode] ? COA[l.accountCode].name : 'حساب'),
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description: l.description || 'إثبات رصيد افتتاحي معتمد',
            posted: true
        }));

        const newEntry = {
            id: openingTask.id,
            date: openingTask.date || '2026-01-01',
            type: 'Opening Balance',
            ref: openingTask.ref || 'OP-2026',
            status: 'posted',
            isAutoOpening: true,
            lines: openingLines
        };

        studentJournal.unshift(newEntry);

        if (!studentLedger) studentLedger = {};
        openingLines.forEach(l => {
            const code = l.accountCode;
            if (!studentLedger[code]) studentLedger[code] = [];
            const alreadyInLedger = studentLedger[code].some(m => m.trxId === openingTask.id && Math.abs(m.debit - l.debit) < 0.01 && Math.abs(m.credit - l.credit) < 0.01);
            if (!alreadyInLedger) {
                studentLedger[code].push({
                    trxId: openingTask.id,
                    ref: openingTask.ref || 'OP-2026',
                    date: openingTask.date || '2026-01-01',
                    debit: l.debit,
                    credit: l.credit,
                    description: 'رصيد افتتاحي معتمد ومرحل آلياً'
                });
            }
        });

        saveStudentState();
    } else if (existing.status !== 'posted') {
        existing.status = 'posted';
        existing.isAutoOpening = true;
        (existing.lines || []).forEach(l => l.posted = true);

        if (!studentLedger) studentLedger = {};
        (existing.lines || []).forEach(l => {
            const code = l.accountCode;
            if (!studentLedger[code]) studentLedger[code] = [];
            const alreadyInLedger = studentLedger[code].some(m => m.trxId === openingTask.id && Math.abs(m.debit - l.debit) < 0.01 && Math.abs(m.credit - l.credit) < 0.01);
            if (!alreadyInLedger) {
                studentLedger[code].push({
                    trxId: openingTask.id,
                    ref: openingTask.ref || 'OP-2026',
                    date: openingTask.date || '2026-01-01',
                    debit: l.debit,
                    credit: l.credit,
                    description: 'رصيد افتتاحي معتمد ومرحل آلياً'
                });
            }
        });

        saveStudentState();
    }
}

function loadStudentState() {
    const rawJournal = localStorage.getItem('student_journal');
    const rawLedger = localStorage.getItem('student_ledger');

    if (rawJournal && rawLedger) {
        try {
            studentJournal = JSON.parse(rawJournal);
            studentLedger = JSON.parse(rawLedger);
        } catch(e) {
            console.error(e);
            studentJournal = [];
            studentLedger = {};
            Object.keys(COA).forEach(c => studentLedger[c] = []);
        }
    } else {
        // Default clean state: journal & ledger initialized
        studentJournal = [];
        studentLedger = {};
        Object.keys(COA).forEach(c => studentLedger[c] = []);
    }

    // Always ensure Opening Balance is automatically proven & posted for mobile ease!
    autoPostOpeningBalance();
    saveStudentState();
    updateAllHeaderBadges();
}

function saveStudentState() {
    localStorage.setItem('student_journal', JSON.stringify(studentJournal));
    localStorage.setItem('student_ledger', JSON.stringify(studentLedger));
    updateAllHeaderBadges();

    // مزامنة تلقائية مع السحابة (DI-05) مع تأخير ذكي (Debounce) لعدم إجهاد الشبكة
    try {
        if (typeof window !== 'undefined' && window.SimulationBridge && typeof window.SimulationBridge.saveCurrentSimulation === 'function') {
            if (window._simSaveTimeout) clearTimeout(window._simSaveTimeout);
            window._simSaveTimeout = setTimeout(() => {
                window.SimulationBridge.saveCurrentSimulation();
            }, 800);
        }
    } catch (e) {}
}

// Calculate balances strictly from studentLedger movements!
function calculateBalances() {
    let balances = {};
    Object.keys(COA).forEach(acc => balances[acc] = 0);

    Object.keys(studentLedger).forEach(code => {
        const moves = studentLedger[code] || [];
        moves.forEach(m => {
            if (balances[code] === undefined) balances[code] = 0;
            balances[code] += ((Number(m.debit) || 0) - (Number(m.credit) || 0));
        });
    });
    return balances;
}

// ================= ADMIN INTEGRATION BRIDGE (SimulatorAPI) =================
window.SimulatorAPI = {
    // 1. Inject or update tasks by Admin (from generator or host project)
    setTasks: function(tasksArray) {
        if (!Array.isArray(tasksArray)) {
            console.error('SimulatorAPI.setTasks expects an array of tasks.');
            return false;
        }

        // Automatic normalization for Generator output ({ acct, dr, cr, desc, txId } -> { accountCode, debit, credit, description, id })
        const normalized = tasksArray.map((t, idx) => {
            const rawLines = t.lines || [];
            return {
                id: t.id || t.txId || ('TRX-' + String(idx + 1).padStart(5, '0')),
                txId: t.txId || t.id,
                jeId: t.jeId || ('JE-' + String(idx + 1).padStart(6, '0')),
                date: t.date,
                type: t.type,
                ref: t.ref || ('REF-' + (10000 + idx)),
                difficulty: t.difficulty || 'Medium',
                lines: rawLines.map((l, lIdx) => {
                    const code = String(l.accountCode || l.acct || '');
                    const name = l.accountName || l.acctName || (COA[code] ? COA[code].name : 'حساب عام');
                    const aType = l.acctType || (COA[code] ? COA[code].type : 'Asset');
                    return {
                        lineNum: l.lineNum || (lIdx + 1),
                        accountCode: code,
                        accountName: name,
                        acctType: aType,
                        debit: Number(l.debit !== undefined ? l.debit : (l.dr !== undefined ? l.dr : 0)) || 0,
                        credit: Number(l.credit !== undefined ? l.credit : (l.cr !== undefined ? l.cr : 0)) || 0,
                        description: l.description || l.desc || ''
                    };
                })
            };
        });

        answerKey = normalized;
        window.ANSWER_KEY = normalized;
        try {
            localStorage.setItem('sim_admin_tasks', JSON.stringify(normalized));
        } catch(e) {}
        autoPostOpeningBalance();
        updateAllHeaderBadges();
        if (typeof renderPendingList === 'function') renderPendingList();
        if (typeof updateDashboard === 'function') updateDashboard();
        return true;
    },

    // 2. Set dynamic company profile from generator
    setCompanyProfile: function(profile) {
        if (profile) {
            try {
                localStorage.setItem('sim_company_profile', JSON.stringify(profile));
                applyCompanyProfile();
            } catch(e) {}
        }
    },

    getCompanyProfile: function() {
        try {
            const raw = localStorage.getItem('sim_company_profile');
            if (raw) return JSON.parse(raw);
        } catch(e) {}
        return null;
    },

    // 3. Get current tasks
    getTasks: function() {
        return answerKey;
    },

    // 4. Get student entries and ledger
    getStudentJournal: function() {
        return studentJournal;
    },
    getStudentLedger: function() {
        return studentLedger;
    },

    // 5. Get summary results for Admin grading / monitoring
    getResults: function() {
        const balances = calculateBalances();
        const posted = studentJournal.filter(j => j.status === 'posted');
        return {
            totalTasks: answerKey.length,
            completedTasks: posted.length,
            progressPercent: answerKey.length > 0 ? Math.round((posted.length / answerKey.length) * 100) : 0,
            journalEntriesCount: studentJournal.length,
            balances: balances
        };
    },

    // 6. Reset student answers only (keep Admin tasks intact)
    resetStudentState: function() {
        studentJournal = [];
        studentLedger = {};
        Object.keys(COA).forEach(c => studentLedger[c] = []);
        autoPostOpeningBalance();
        saveStudentState();
        localStorage.removeItem('bank_statement_items');
        updateAllHeaderBadges();
        location.reload();
    },

    // 7. Full clear (student data + admin tasks + company profile)
    clearAll: function() {
        ['student_journal', 'student_ledger', 'bank_statement_items', 'sim_admin_tasks', 'sim_company_profile'].forEach(k => {
            localStorage.removeItem(k);
        });
        answerKey = [];
        window.ANSWER_KEY = [];
        studentJournal = [];
        studentLedger = {};
        location.reload();
    }
};

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

// Expose core variables on window for multi-module access
window.COA = COA;
window.ACCOUNTS = ACCOUNTS;
window.getDocumentName = getDocumentName;
window.getStudentJournal = () => studentJournal;
window.getStudentLedger = () => studentLedger;
window.loadStudentState = loadStudentState;
window.saveStudentState = saveStudentState;
window.autoPostOpeningBalance = autoPostOpeningBalance;
window.calculateBalances = calculateBalances;
window.updateAllHeaderBadges = updateAllHeaderBadges;
window.applyCompanyProfile = applyCompanyProfile;
window.initApp = initApp;

// Automatic startup trigger
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

window.clearAllSimulationData = function(confirmPrompt = true) {
    if (!confirmPrompt || confirm("هل تريد بالتأكيد تصفير إجاباتك وقيودك المسجلة والبدء من جديد لهذه الشركة؟")) {
        // مسح قيود الطالب فقط دون حذف سندات الشركة أو ملفها التعريفي
        ['student_journal', 'student_ledger', 'bank_statement_items'].forEach(k => {
            localStorage.removeItem(k);
        });
        location.reload();
    }
};
window.resetSim = window.clearAllSimulationData;

window.switchActiveSimulationCompany = function(compId) {
    try {
        const rawCompanies = localStorage.getItem('acc_admin_companies');
        if (!rawCompanies) return;
        const list = JSON.parse(rawCompanies);
        const comp = list.find(c => c.id === compId);
        if (!comp) return;

        const profile = {
            id: comp.id,
            name: comp.name,
            enName: comp.name,
            code: `${(comp.id || 'CMP').toUpperCase().replace('COMPANY-', '')}-2026`,
            activity: comp.sector,
            sector: comp.sector,
            badge: comp.badge || 'نشاط تجاري',
            employees: '35 موظف مسجل',
            role: comp.role || 'محاسب مالي',
            year: comp.month || 'السنة المالية 2026'
        };
        localStorage.setItem('sim_company_profile', JSON.stringify(profile));

        const tasks = transformHostTransactions(comp.transactions || []);
        localStorage.setItem('sim_admin_tasks', JSON.stringify(tasks));

        // مسح القيود المسجلة للبدء في الشركة الجديدة بشكل نظيف
        ['student_journal', 'student_ledger', 'bank_statement_items'].forEach(k => {
            localStorage.removeItem(k);
        });

        location.reload();
    } catch(e) {
        console.error(e);
    }
};

// ================= TRAINING PLATFORM JSON PARSER & UPLOAD =================
if (typeof window.parseTrainingPlatformJson === 'undefined') {
    window.parseTrainingPlatformJson = function(json) {
        if (!json || typeof json !== 'object') {
            throw new Error('صيغة الملف غير صالحة.');
        }

        if (json.format === 'accounting-training-v1' || (json.metadata && json.questions)) {
            const meta = json.metadata || {};
            const companyMeta = meta.company || {};
            const rawName = (companyMeta.name || json.name || 'شركة جديدة').trim();
            const compName = rawName.startsWith('شركة') ? rawName : `شركة ${rawName}`;
            const activity = (companyMeta.activity || 'الأجهزة والخدمات').trim();
            const sector = `تجارة ${activity} (${companyMeta.type === 'Services' ? 'خدمي وتوزيع' : companyMeta.type || 'تجاري'})`;
            const capital = Number(companyMeta.capital) || 2000000;
            const role = meta.jobTrackNameAr || 'محاسب مالي عام';
            const year = meta.startDate ? `السنة المالية ${meta.startDate.substring(0, 4)}` : 'السنة المالية 2026';
            const compId = `comp-${(rawName.replace(/\s+/g, '-').toLowerCase()) || Date.now()}`;

            const questions = Array.isArray(json.questions) ? json.questions : [];

            const typeArMap = {
                'Opening Balance': 'إثبات الأرصدة الافتتاحية والمركز المالي',
                'Sale': 'فاتورة مبيعات بضاعة آجلة للعملاء',
                'Cash Sale': 'فاتورة مبيعات نقدية بالخزينة',
                'Collection': 'إيصال تحصيل نقدية وبنكي من عميل',
                'Purchase': 'فاتورة شراء وتوريد بضاعة للمستودع',
                'Payment': 'سداد مستحقات وفواتير موردين',
                'Purchase Return': 'مردودات مشتريات وإشعار دائن',
                'Sales Return': 'مردودات مبيعات وإشعار مدين',
                'Sales Return Inv': 'مردودات مبيعات مخزنية',
                'COGS': 'إثبات تكلفة البضاعة المباعة',
                'Cash Sale COGS': 'إثبات تكلفة البضاعة المباعة النقدية',
                'Payroll': 'مسير واستحقاق رواتب وأجور الموظفين',
                'Payroll Settlement': 'سداد وصرف أجور ورواتب العاملين',
                'Expense': 'إثبات وسداد مصروفات تشغيلية',
                'Misc Expense': 'مصروفات نثرية وإدارية متنوعة',
                'Prepayment': 'سداد مصروفات مدفوعة مقدماً',
                'Prepayment Amortization': 'تسوية إهلاك واستنفاد المصروف المقدم',
                'Accrual': 'إثبات مصروفات مستحقة غير مسددة',
                'Accrued Revenue': 'إثبات إيرادات مستحقة غير محصلة',
                'Accrual Settlement': 'سداد المصروفات المستحقة السابقة',
                'Unearned Revenue': 'استلام إيرادات مقبوضة مقدماً',
                'Unearned Rev Recognition': 'الاعتراف بالإيراد المقدم المحقق',
                'Bank Charges': 'إثبات عمولات ومصروفات بنكية',
                'Bank Loan': 'عقد وتسهيل قرض بنكي تمويلي',
                'Loan Repayment': 'سداد قسط وفائدة قرض بنكي',
                'Asset Purchase': 'شراء أصول ثابتة رأسمالية',
                'Asset Disposal': 'استبعاد وبيع أصل ثابت',
                'Depreciation': 'قسط إهلاك الأصول الثابتة السنوي',
                'Bad Debt Provision': 'تكوين مخصص ديون مشكوك في تحصيلها',
                'Inventory Impairment': 'إثبات هبوط وانخفاض أسعار المخزون',
                'Interest Accrual': 'إثبات فوائد بنكية مستحقة',
                'VAT Clearing': 'تسوية ومقاصة ضريبة القيمة المضافة',
                'VAT Settlement': 'سداد إقرار ضريبة القيمة المضافة',
                'Petty Cash Replenishment': 'استعاضة عهدة النقدية النثرية',
                'Bank Transfer In': 'تحويل نقدية وارد بين الحسابات',
                'Bank Transfer Out': 'تحويل نقدية صادر بين الحسابات',
                'Cash Advance': 'صرف سلفة مؤقتة للموظف',
                'Cash Advance Settlement': 'تسوية وإقفال سلفة الموظف',
                'Cash Shortage': 'إثبات عجز الخزينة النقدية',
                'Inventory Adjustment': 'تسوية فروقات الجرد المخزني'
            };

            const transactions = questions.map((q, idx) => {
                const rawLines = q.correctAnswer?.lines || [];
                const debits = rawLines.filter(l => (Number(l.debit) || 0) > 0);
                const credits = rawLines.filter(l => (Number(l.credit) || 0) > 0);
                const totalDebit = Number(q.correctAnswer?.totalDebit) || debits.reduce((s, l) => s + (Number(l.debit) || 0), 0);
                const totalCredit = Number(q.correctAnswer?.totalCredit) || credits.reduce((s, l) => s + (Number(l.credit) || 0), 0);

                const titleAr = typeArMap[q.type] || `${q.type} - ${q.categoryAr || 'معاملة مالية'}`;

                let desc = '';
                if (q.problemText && q.problemText.trim()) {
                    desc = q.problemText.trim();
                } else {
                    const formattedTotal = (totalDebit || totalCredit || 0).toLocaleString() + ' ج.م';

                    switch (q.type) {
                        case 'Opening Balance':
                            desc = `إثبات الأرصدة الافتتاحية للمركز المالي وتأسيس الشركة برأس مال قدره ${formattedTotal}.`;
                            break;
                        case 'Sale':
                            desc = `إصدار فاتورة بيع بضاعة آجلة للعملاء بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Cash Sale':
                            desc = `إصدار فاتورة بيع بضاعة نقدية محصلة بالخزينة/البنك بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Purchase':
                            desc = `استلام وتوريد بضاعة للمستودع بموجب فاتورة شراء بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Collection':
                            desc = `تحصيل مبالغ مستحقة من العملاء بموجب إشعار بنكي/إيصال قبض بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Payment':
                            desc = `سداد مستحقات وفواتير موردين خصماً من الحساب البنكي بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Expense':
                            desc = `سداد مصروفات تشغيلية وإدارية بموجب مستند صرف معتمد بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Prepayment':
                            desc = `سداد دفعات ومصروفات مدفوعة مقدماً عن فترات قادمة بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Prepayment Amortization':
                            desc = `تسوية وإهلاك قسط المصروف المدفوع مقدماً المحقق عن الفترة بقيمة ${formattedTotal}.`;
                            break;
                        case 'COGS':
                        case 'Cash Sale COGS':
                            desc = `إثبات تكلفة البضاعة المباعة وصرفها من المخزون بمبلغ ${formattedTotal}.`;
                            break;
                        case 'Asset Purchase':
                            desc = `شراء أصول ثابتة جديدة للشركة بموجب مستند وفاتورة بقيمة ${formattedTotal}.`;
                            break;
                        case 'Payroll':
                            desc = `إثبات كشف واستحقاق رواتب العاملين عن الشهر بقيمة إجمالية ${formattedTotal}.`;
                            break;
                        default:
                            if (q.prompt && q.prompt.trim()) {
                                desc = q.prompt.trim();
                            } else if (q.description && q.description.trim() && !q.description.includes('الجانب المدين') && !q.description.includes('إلى حـ/')) {
                                desc = q.description.trim();
                            } else {
                                desc = `معاملة مالية معتمدة (${titleAr}) بموجب المستند المرفق بقيمة إجمالية ${formattedTotal}.`;
                            }
                            break;
                    }
                }

                const dayOffset = Math.floor((idx / Math.max(1, questions.length)) * 350);
                const dateObj = new Date(2026, 0, 1 + dayOffset);
                const dateStr = dateObj.toISOString().split('T')[0];

                return {
                    id: q.id || `Q-${String(idx + 1).padStart(3, '0')}`,
                    num: idx + 1,
                    title: titleAr,
                    desc: desc,
                    type: q.type || 'General',
                    date: dateStr,
                    amount: totalDebit || totalCredit || 0,
                    difficulty: q.difficulty || 'Medium',
                    category: q.category || 'general',
                    categoryAr: q.categoryAr || 'محاسبة عامة',
                    dr: debits[0]?.accountCode || '1101',
                    cr: credits[0]?.accountCode || '4101',
                    lines: rawLines.map((l, lIdx) => ({
                        lineNum: lIdx + 1,
                        accountCode: String(l.accountCode || ''),
                        accountName: l.accountName || 'حساب',
                        acctType: l.accountType || 'Asset',
                        debit: Number(l.debit) || 0,
                        credit: Number(l.credit) || 0,
                        description: l.description || desc
                    })),
                    solutionSteps: q.solutionSteps || [],
                    accountingRule: q.accountingRule || '',
                    hints: q.hints || [],
                    scoring: q.scoring || { totalPoints: 5 }
                };
            });

            return {
                id: compId,
                name: compName,
                sector: sector,
                badge: meta.scenarioName ? 'شركة حقيقية مستقرة' : 'بيئة أعمال متكاملة',
                icon: 'lightbulb',
                role: role,
                capital: capital,
                description: `بيئة محاكاة محاسبية متقدمة لـ ${compName} (${sector}) برأس مال قدره ${capital.toLocaleString()} ج.م، تتضمن دورة تدريبية واقعية بـ ${transactions.length} معاملة وسند مالي.`,
                month: year,
                transactions: transactions
            };
        }

        if (json.name && (json.transactions || json.sector)) {
            return {
                id: json.id || `comp-${Date.now()}`,
                name: json.name,
                sector: json.sector || 'قطاع عام',
                badge: json.badge || 'نشاط تجاري',
                icon: json.icon && !/[\u{1F300}-\u{1FAFF}]/u.test(json.icon) ? json.icon : 'buildings',
                role: json.role || 'محاسب مالي',
                capital: json.capital || 1000000,
                description: json.description || `شركة ${json.name}`,
                month: json.month || 'السنة المالية 2026',
                transactions: Array.isArray(json.transactions) ? json.transactions : []
            };
        }

        throw new Error('صيغة ملف التدريب غير متوافقة.');
    };
}

window.handleSimCompanyJsonUpload = function(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const json = JSON.parse(text);
            const comp = window.parseTrainingPlatformJson(json);
            if (!comp) throw new Error('فشل قراءة بيانات الشركة من الملف.');

            let companies = [];
            try {
                const raw = localStorage.getItem('acc_admin_companies');
                if (raw) companies = JSON.parse(raw);
            } catch(err) {}

            const existingIdx = companies.findIndex(c => c.id === comp.id || c.name === comp.name);
            if (existingIdx >= 0) {
                companies[existingIdx] = comp;
            } else {
                companies.unshift(comp);
            }
            localStorage.setItem('acc_admin_companies', JSON.stringify(companies));

            alert(`تم بنجاح استيراد "${comp.name}" وتضمين (${comp.transactions.length}) سند ومعاملة مالية! جاري تفعيلها في المحاكي...`);
            window.switchActiveSimulationCompany(comp.id);
        } catch(err) {
            console.error('[SimCompanyUpload]', err);
            alert('حدث خطأ أثناء قراءة ملف التدريب: ' + (err.message || 'تنسيق غير صالح'));
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file, 'UTF-8');
};

window.openCompanySwitcherModal = function() {
    let overlay = document.getElementById('simCompanySwitcherModal');
    if (overlay) overlay.remove();

    let companies = [];
    try {
        const raw = localStorage.getItem('acc_admin_companies');
        if (raw) companies = JSON.parse(raw);
    } catch(e) {}

    let currentCompId = '';
    let currentName = '';
    try {
        const prof = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
        currentCompId = prof.id || '';
        currentName = prof.name || '';
    } catch(e) {}

    overlay = document.createElement('div');
    overlay.id = 'simCompanySwitcherModal';
    overlay.className = 'fixed inset-0 z-[9999] bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    overlay.innerHTML = `
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden text-right p-6">
            <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">🏢</div>
                    <div>
                        <h3 class="font-bold text-slate-900 text-base">تبديل شركة التدريب والمحاكاة</h3>
                        <p class="text-xs text-slate-500">اختر الشركة التي ترغب في استعراض مهامها وتسجيل قيودها</p>
                    </div>
                </div>
                <button onclick="document.getElementById('simCompanySwitcherModal').remove()" class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm">✕</button>
            </div>
            
            <div class="space-y-2.5 max-h-[340px] overflow-y-auto">
                ${companies.length === 0 ? `
                    <div class="text-center py-8 text-slate-400 text-xs">لا توجد شركات مضافة حالياً في المنظومة. يمكنك استيراد شركة بالأسفل أو إضافتها من لوحة الإدارة.</div>
                ` : companies.map(c => {
                    const isSelected = c.id === currentCompId || (!currentCompId && c.name === currentName);
                    const txCount = (c.transactions || []).length;
                    return `
                        <div onclick="window.switchActiveSimulationCompany('${c.id}')" class="p-3.5 rounded-xl border ${isSelected ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'} cursor-pointer transition flex items-center justify-between">
                            <div>
                                <div class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                    <span>${c.name}</span>
                                    ${isSelected ? '<span class="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">النشطة حالياً ✓</span>' : ''}
                                </div>
                                <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span>${c.sector || 'قطاع عام'}</span>
                                    <span>•</span>
                                    <span class="text-emerald-600 font-bold">${txCount} سندات مالية</span>
                                </div>
                            </div>
                            <span class="material-symbols-outlined text-slate-400 text-lg">chevron_left</span>
                        </div>
                    `;
                }).join('')}
            </div>

            <div class="mt-4 pt-3 border-t border-slate-100">
                <button type="button" onclick="document.getElementById('sim_upload_company_json').click()" class="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-400 bg-blue-50/60 hover:bg-blue-100/70 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm">
                    <span class="text-base">📂</span>
                    <span>استيراد شركة من ملف تدريبي (JSON)</span>
                </button>
                <input type="file" id="sim_upload_company_json" accept=".json" style="display:none;" onchange="window.handleSimCompanyJsonUpload(event)">
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
};

window.returnToPlatform = function(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // If opened in popup/iframe
    if (window.opener && !window.opener.closed) {
        try {
            window.opener.focus();
            window.close();
            return false;
        } catch(err) {}
    }
    // Absolute root navigation to avoid 404
    const origin = window.location.origin;
    window.location.href = origin + '/index.html';
    return false;
};
