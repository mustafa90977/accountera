// ================= BANK RECONCILIATION (_3) =================
function updateRecon() {
    const balances = calculateBalances();
    const bankBalance = (balances['1102'] || 0);
    const el = document.getElementById('recon-book-balance');
    if(el) el.innerText = bankBalance.toLocaleString(undefined, {minimumFractionDigits: 2});
}


window.showAccountStatement = function(code) {
    const modal = document.getElementById('account-statement-modal');
    if(!modal) return;

    const ledger = (typeof getStudentLedger === 'function') ? getStudentLedger() : (window.studentLedger || (typeof studentLedger !== 'undefined' ? studentLedger : {}));
    const moves = ledger[code] || [];
    const accTitle = document.getElementById('stmt-account-title');
    const accCode = document.getElementById('stmt-account-code');
    const totDebEl = document.getElementById('stmt-total-debit');
    const totCredEl = document.getElementById('stmt-total-credit');
    const netBalEl = document.getElementById('stmt-net-balance');
    const tbody = document.getElementById('stmt-tbody');

    if(accTitle) accTitle.innerText = ACCOUNTS[code] || 'حساب عام';
    if(accCode) accCode.innerText = code;

    let totDebit = 0;
    let totCredit = 0;
    let runningBalance = 0;

    tbody.innerHTML = '';

    if(moves.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-slate-400 font-medium">لا توجد حركات مرحلة لهذا الحساب حتى الآن.</td></tr>';
    } else {
        moves.forEach(m => {
            const deb = Number(m.debit) || 0;
            const cred = Number(m.credit) || 0;
            totDebit += deb;
            totCredit += cred;
            runningBalance += (deb - cred);

            const isDebBal = runningBalance >= 0;

            tbody.innerHTML += `
              <tr class="hover:bg-slate-50 transition border-b border-slate-100">
                <td class="p-2.5 font-mono text-slate-500">${m.date}</td>
                <td class="p-2.5 font-bold text-slate-800 font-mono">${m.trxId || ''} <span class="text-slate-400 font-normal">(${m.ref || ''})</span></td>
                <td class="p-2.5 font-sans text-slate-700">${m.description || 'حركة مرحلة'}</td>
                <td class="p-2.5 text-center font-mono ${deb > 0 ? 'font-bold text-slate-900 bg-blue-50/40' : 'text-slate-300'}">${deb > 0 ? deb.toLocaleString() : '-'}</td>
                <td class="p-2.5 text-center font-mono ${cred > 0 ? 'font-bold text-slate-900 bg-amber-50/40' : 'text-slate-300'}">${cred > 0 ? cred.toLocaleString() : '-'}</td>
                <td class="p-2.5 text-center font-mono font-bold ${isDebBal ? 'text-blue-900' : 'text-amber-900'} bg-slate-50">
                  ${Math.abs(runningBalance).toLocaleString()} ${isDebBal ? '(مدين)' : '(دائن)'}
                </td>
              </tr>
            `;
        });
    }

    const net = totDebit - totCredit;
    if(totDebEl) totDebEl.innerText = totDebit.toLocaleString() + ' ج.م';
    if(totCredEl) totCredEl.innerText = totCredit.toLocaleString() + ' ج.م';
    if(netBalEl) netBalEl.innerText = Math.abs(net).toLocaleString() + ' ج.م (' + (net >= 0 ? 'مدين' : 'دائن') + ')';

    modal.classList.remove('hidden');
}

window.closeAccountStatement = function() {
    const modal = document.getElementById('account-statement-modal');
    if(modal) modal.classList.add('hidden');
}


// ================= INTERACTIVE BANK RECONCILIATION (_3) =================
let bankStatementItems = [];
let bookReconItems = [];

function initRecon() {
    loadBankReconState();
    renderReconTables();
    calculateReconciliation();
}

function loadBankReconState() {
    let savedCase = null;
    const rawCase = localStorage.getItem('sim_bank_recon_case');
    if (rawCase) {
        try { savedCase = JSON.parse(rawCase); } catch(e) {}
    }

    if (savedCase && savedCase.bankAccount) {
        const bankAcc = savedCase.bankAccount;
        const subEl = document.getElementById('recon-bank-name-sub');
        const mobEl = document.getElementById('recon-bank-name-mob');
        const bankTitle = bankAcc.bankNameAr || bankAcc.bankName || 'البنك التجاري';
        const branchTitle = bankAcc.branchName || bankAcc.branch || 'الفرع الرئيسي';
        const accNum = bankAcc.accountNumberMasked || bankAcc.accountNumberFull || '1102';
        if (subEl) subEl.innerText = `${bankTitle} (${branchTitle}) • حساب جاري رقم ${accNum} (حـ/ 1102)`;
        if (mobEl) mobEl.innerText = `حـ/ 1102 • ${bankTitle}`;
    }

    const rawBank = localStorage.getItem('bank_statement_items');
    if(rawBank) {
        try {
            bankStatementItems = JSON.parse(rawBank);
        } catch(e) {
            bankStatementItems = [];
        }
    } else {
        bankStatementItems = [];
    }

    // Fallback: If bankStatementItems is empty but savedCase has transactions
    if (bankStatementItems.length === 0 && savedCase && Array.isArray(savedCase.bankTransactions)) {
        const opening = Number(savedCase.bankAccount?.openingBalance) || 0;
        if (opening > 0) {
            bankStatementItems.push({
                id: 'BNK-OP-001',
                date: savedCase.period?.startDate || '2026-01-01',
                desc: `رصيد أول المدة المنقول من الفترة السابقة (${savedCase.bankAccount?.bankNameAr || 'البنك'})`,
                ref: 'OPENING',
                deposit: opening,
                withdrawal: 0,
                matched: true,
                isOpening: true
            });
        }
        savedCase.bankTransactions.forEach((tx, idx) => {
            const isDep = (tx.direction === 'CREDIT' || tx.sourceType === 'DEPOSIT');
            bankStatementItems.push({
                id: tx.bankTransactionId || `BNK-${idx + 1}`,
                date: tx.date || tx.valueDate || '2026-01-01',
                desc: tx.description || 'معاملة بنكية',
                ref: tx.bankReference || '',
                deposit: isDep ? (Number(tx.amount) || 0) : 0,
                withdrawal: !isDep ? (Number(tx.amount) || 0) : 0,
                matched: false
            });
        });
        saveBankReconState();
    }

    // Load actual student book movements for Account 1102 (البنك)
    const ledger = (typeof getStudentLedger === 'function') ? getStudentLedger() : (window.studentLedger || (typeof studentLedger !== 'undefined' ? studentLedger : {}));
    const bookMoves = ledger['1102'] || [];

    if (bookMoves.length > 0) {
        bookReconItems = bookMoves.map((m, idx) => {
            const savedMatched = localStorage.getItem('book_matched_' + m.trxId + '_' + idx);
            const isMatched = savedMatched !== null ? (savedMatched === 'true') : false;
            return {
                id: 'BK-' + idx,
                trxId: m.trxId,
                ref: m.ref,
                date: m.date,
                desc: m.description || m.ref || 'حركة بنك',
                debit: Number(m.debit) || 0,
                credit: Number(m.credit) || 0,
                matched: isMatched
            };
        });
    } else if (savedCase && Array.isArray(savedCase.bookTransactions) && savedCase.bookTransactions.length > 0) {
        // Fallback to case book transactions if student has not posted journal entries yet
        const bookOpening = Number(savedCase.bankAccount?.openingBalance) || 0;
        const caseBookItems = [];
        if (bookOpening > 0) {
            caseBookItems.push({
                id: 'BK-OP-001',
                trxId: 'OP-001',
                ref: 'BAL-FWD',
                date: savedCase.period?.startDate || '2026-01-01',
                desc: `رصيد أول المدة المنقول من الفترة السابقة (حـ/ 1102)`,
                debit: bookOpening,
                credit: 0,
                matched: true,
                isOpening: true
            });
        }
        savedCase.bookTransactions.forEach((m, idx) => {
            const savedMatched = localStorage.getItem('book_matched_' + (m.transactionId || idx));
            const isMatched = savedMatched !== null ? (savedMatched === 'true') : false;
            caseBookItems.push({
                id: 'BK-' + (idx + 1),
                trxId: m.transactionId || m.journalEntryId || ('TX-' + idx),
                ref: m.reference || m.journalEntryId || '',
                date: m.date || '2026-01-01',
                desc: m.description || 'حركة بنك بالدفاتر',
                debit: m.direction === 'DEBIT' ? Number(m.amount) || 0 : 0,
                credit: m.direction === 'CREDIT' ? Number(m.amount) || 0 : 0,
                matched: isMatched
            });
        });
        bookReconItems = caseBookItems;
    } else {
        bookReconItems = [];
    }
}

window.clearBankStatement = function() {
    bankStatementItems = [];
    localStorage.removeItem('bank_statement_items');
    renderReconTables();
    calculateReconciliation();
};

function saveBankReconState() {
    localStorage.setItem('bank_statement_items', JSON.stringify(bankStatementItems));
}

function renderReconTables() {
    const bankTbody = document.getElementById('bank-statement-tbody');
    const bookTbody = document.getElementById('book-statement-tbody');
    const bankMatchedBadge = document.getElementById('bank-matched-count');
    const bookMatchedBadge = document.getElementById('book-matched-count');

    if(bankTbody) {
        bankTbody.innerHTML = '';
        let matchedCount = 0;
        if(bankStatementItems.length === 0) {
            bankTbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-400 font-medium">لا توجد بيانات كشف حساب بنكي واردة حالياً (الرصيد 0.00 ج.م).</td></tr>';
        } else {
            bankStatementItems.forEach((item, idx) => {
                if(item.matched) matchedCount++;
                bankTbody.innerHTML += `
                  <tr class="${item.matched ? 'bg-emerald-50/40' : 'bg-white'} hover:bg-slate-50 transition border-b border-slate-100">
                    <td class="p-2.5 text-center">
                      <input type="checkbox" ${item.matched ? 'checked' : ''} onchange="toggleBankMatch(${idx})" class="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"/>
                    </td>
                    <td class="p-2.5 text-slate-500 font-mono text-[11px]">${item.date}</td>
                    <td class="p-2.5 font-sans font-medium text-slate-800">
                      ${item.desc}
                      ${item.matched ? '<span class="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">متطابق ✓</span>' : '<span class="mr-1.5 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">معلق</span>'}
                    </td>
                    <td class="p-2.5 text-center font-mono ${item.deposit > 0 ? 'font-bold text-emerald-700 bg-emerald-50/30' : 'text-slate-300'}">${item.deposit > 0 ? item.deposit.toLocaleString() : '-'}</td>
                    <td class="p-2.5 text-center font-mono ${item.withdrawal > 0 ? 'font-bold text-rose-700 bg-rose-50/30' : 'text-slate-300'}">${item.withdrawal > 0 ? item.withdrawal.toLocaleString() : '-'}</td>
                  </tr>
                `;
            });
        }
        if(bankMatchedBadge) bankMatchedBadge.innerText = matchedCount + ' من ' + bankStatementItems.length + ' مطابقة';
    }

    if(bookTbody) {
        bookTbody.innerHTML = '';
        let matchedCount = 0;
        if(bookReconItems.length === 0) {
            bookTbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-slate-400 font-medium">لا توجد حركات مرحلة لحساب البنك (1102) في دفتر الأستاذ بعد.</td></tr>';
        } else {
            bookReconItems.forEach((item, idx) => {
                if(item.matched) matchedCount++;
                bookTbody.innerHTML += `
                  <tr class="${item.matched ? 'bg-emerald-50/40' : 'bg-white'} hover:bg-slate-50 transition border-b border-slate-100">
                    <td class="p-2.5 text-center">
                      <input type="checkbox" ${item.matched ? 'checked' : ''} onchange="toggleBookMatch(${idx})" class="w-4 h-4 rounded text-purple-600 focus:ring-0 cursor-pointer"/>
                    </td>
                    <td class="p-2.5 text-slate-500 font-mono text-[11px]">${item.date}</td>
                    <td class="p-2.5 font-sans font-medium text-slate-800">
                      ${item.desc}
                      ${item.matched ? '<span class="mr-1.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">متطابق ✓</span>' : '<span class="mr-1.5 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">معلق</span>'}
                    </td>
                    <td class="p-2.5 text-center font-mono ${item.debit > 0 ? 'font-bold text-emerald-700 bg-emerald-50/30' : 'text-slate-300'}">${item.debit > 0 ? item.debit.toLocaleString() : '-'}</td>
                    <td class="p-2.5 text-center font-mono ${item.credit > 0 ? 'font-bold text-rose-700 bg-rose-50/30' : 'text-slate-300'}">${item.credit > 0 ? item.credit.toLocaleString() : '-'}</td>
                  </tr>
                `;
            });
        }
        if(bookMatchedBadge) bookMatchedBadge.innerText = matchedCount + ' من ' + bookReconItems.length + ' مطابقة';
    }
}

window.toggleBankMatch = function(idx) {
    if(bankStatementItems[idx]) {
        bankStatementItems[idx].matched = !bankStatementItems[idx].matched;
        saveBankReconState();
        renderReconTables();
        calculateReconciliation();
    }
}

window.toggleBookMatch = function(idx) {
    if(bookReconItems[idx]) {
        bookReconItems[idx].matched = !bookReconItems[idx].matched;
        localStorage.setItem('book_matched_' + bookReconItems[idx].trxId + '_' + idx, bookReconItems[idx].matched);
        renderReconTables();
        calculateReconciliation();
    }
}

window.matchAllBankItems = function() {
    bankStatementItems.forEach(i => i.matched = true);
    saveBankReconState();
    renderReconTables();
    calculateReconciliation();
}

window.unmatchAllBankItems = function() {
    bankStatementItems.forEach(i => i.matched = false);
    saveBankReconState();
    renderReconTables();
    calculateReconciliation();
}

window.matchAllBookItems = function() {
    bookReconItems.forEach((i, idx) => {
        i.matched = true;
        localStorage.setItem('book_matched_' + i.trxId + '_' + idx, 'true');
    });
    renderReconTables();
    calculateReconciliation();
}

window.unmatchAllBookItems = function() {
    bookReconItems.forEach((i, idx) => {
        i.matched = false;
        localStorage.setItem('book_matched_' + i.trxId + '_' + idx, 'false');
    });
    renderReconTables();
    calculateReconciliation();
}

window.resetReconToZero = function() {
    bankStatementItems.forEach(i => {
        if (!i.isOpening) i.matched = false;
    });
    bookReconItems.forEach((i, idx) => {
        if (!i.isOpening) {
            i.matched = false;
            localStorage.removeItem('book_matched_' + (i.trxId || idx));
        }
    });
    saveBankReconState();
    renderReconTables();
    calculateReconciliation();
}

window.autoMatchRecon = function() {
    // Smart auto match matching amounts
    bookReconItems.forEach((bItem, bIdx) => {
        if (bItem.matched) return;
        const bAmt = bItem.debit > 0 ? bItem.debit : bItem.credit;
        const bSide = bItem.debit > 0 ? 'deposit' : 'withdrawal';

        const match = bankStatementItems.find(sItem => 
            !sItem.matched && 
            Math.abs(sItem[bSide] - bAmt) < 0.01
        );

        if(match) {
            match.matched = true;
            bItem.matched = true;
            localStorage.setItem('book_matched_' + (bItem.trxId || bIdx), 'true');
        }
    });

    saveBankReconState();
    renderReconTables();
    calculateReconciliation();
}

function calculateReconciliation() {
    // 1. Bank side base: sum of all items in bank statement
    let bankBase = 0;
    bankStatementItems.forEach(item => {
        bankBase += (item.deposit - item.withdrawal);
    });

    // 2. Book side base: actual balance of account 1102 or case book transactions sum
    const balances = calculateBalances();
    let bookBase = balances['1102'] || 0;
    if (bookBase === 0 && bookReconItems.length > 0) {
        bookBase = bookReconItems.reduce((s, item) => s + (item.debit - item.credit), 0);
    }

    // 3. Unmatched items from Book that should adjust Bank:
    // - Unmatched Book Debits = Deposits in Transit (+)
    // - Unmatched Book Credits = Outstanding Checks (-)
    let depositsInTransit = 0;
    let outstandingChecks = 0;

    bookReconItems.forEach(item => {
        if(!item.matched) {
            if(item.debit > 0) depositsInTransit += item.debit;
            if(item.credit > 0) outstandingChecks += item.credit;
        }
    });

    // 4. Unmatched items from Bank that should adjust Book:
    // - Unmatched Bank Deposits = Direct collections (+)
    // - Unmatched Bank Withdrawals = Bank service charges (-)
    let unrecordedDeposits = 0;
    let bankCharges = 0;

    bankStatementItems.forEach(item => {
        if(!item.matched) {
            if(item.deposit > 0) unrecordedDeposits += item.deposit;
            if(item.withdrawal > 0) bankCharges += item.withdrawal;
        }
    });

    const adjustedBank = bankBase + depositsInTransit - outstandingChecks;
    const adjustedBook = bookBase + unrecordedDeposits - bankCharges;
    const diff = Math.abs(adjustedBank - adjustedBook);
    const isReconciled = diff < 1.0;

    // Update UI elements
    const elBankBal = document.getElementById('recon-bank-balance');
    const elBookBal = document.getElementById('recon-book-balance');
    const elAdjBank = document.getElementById('recon-adj-bank');
    const elDiffVal = document.getElementById('recon-diff-val');
    const elStatus = document.getElementById('recon-status-text');

    if(elBankBal) elBankBal.innerText = bankBase.toLocaleString();
    if(elBookBal) elBookBal.innerText = bookBase.toLocaleString();
    if(elAdjBank) elAdjBank.innerText = adjustedBank.toLocaleString();
    if(elDiffVal) elDiffVal.innerText = diff.toLocaleString();

    // Summary Card values
    const elStmtBase = document.getElementById('stmt-base-val');
    const elBookBase = document.getElementById('book-base-val');
    const elDepTransit = document.getElementById('recon-deposits-transit');
    const elOutChecks = document.getElementById('recon-outstanding-checks');
    const elFinBankAdj = document.getElementById('recon-final-bank-adj');
    const elUnrecDep = document.getElementById('recon-unrecorded-deposits');
    const elCharges = document.getElementById('recon-bank-charges');
    const elFinBookAdj = document.getElementById('recon-final-book-adj');
    const finalBadge = document.getElementById('recon-final-badge');
    const alertBox = document.getElementById('recon-alert-box');
    const headerBadge = document.getElementById('recon-diff-header');

    if(elStmtBase) elStmtBase.innerText = bankBase.toLocaleString() + ' ج.م';
    if(elBookBase) elBookBase.innerText = bookBase.toLocaleString() + ' ج.م';
    if(elDepTransit) elDepTransit.innerText = '+' + depositsInTransit.toLocaleString() + ' ج.م';
    if(elOutChecks) elOutChecks.innerText = '-' + outstandingChecks.toLocaleString() + ' ج.م';
    if(elFinBankAdj) elFinBankAdj.innerText = adjustedBank.toLocaleString() + ' ج.م';
    if(elUnrecDep) elUnrecDep.innerText = '+' + unrecordedDeposits.toLocaleString() + ' ج.م';
    if(elCharges) elCharges.innerText = '-' + bankCharges.toLocaleString() + ' ج.م';
    if(elFinBookAdj) elFinBookAdj.innerText = adjustedBook.toLocaleString() + ' ج.م';

    if(finalBadge) {
        if(bankStatementItems.length === 0 && bookReconItems.length === 0) {
            finalBadge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700';
            finalBadge.innerText = 'بانتظار العمليات (0.00 ج.م)';
            if(headerBadge) headerBadge.innerText = '0 ج.م (بانتظار العمليات)';
            if(elStatus) {
                elStatus.innerText = 'لا توجد حركات للتسوية بعد';
                elStatus.className = 'text-[10px] font-bold text-slate-500 mt-1 block';
            }
        } else if(isReconciled) {
            finalBadge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white';
            finalBadge.innerText = 'التسوية متطابقة ومقفلة 100% ✓';
            if(headerBadge) headerBadge.innerText = 'التسوية متطابقة 100% ✓';
            if(elStatus) {
                elStatus.innerText = 'تمت التسوية بنجاح ولا توجد فروقات';
                elStatus.className = 'text-[10px] font-bold text-emerald-600 mt-1 block';
            }
        } else {
            finalBadge.className = 'text-xs font-bold px-3 py-1 rounded-full bg-rose-500 text-white animate-pulse';
            finalBadge.innerText = 'فرق غير مسوى: ' + diff.toLocaleString() + ' ج.م';
            if(headerBadge) headerBadge.innerText = 'فرق معلق: ' + diff.toLocaleString() + ' ج.م';
            if(elStatus) {
                elStatus.innerText = 'يوجد فرق يتطلب مطابقة أو قيد تسوية';
                elStatus.className = 'text-[10px] font-bold text-rose-600 mt-1 block';
            }
        }
    }

    if(alertBox && bankStatementItems.length === 0 && bookReconItems.length === 0) {
        alertBox.innerHTML = `
          <div class="bg-slate-50 border border-slate-200 text-slate-700 p-4 rounded-xl text-xs font-bold flex items-center gap-3">
            <span class="material-symbols-outlined text-2xl text-slate-400">info</span>
            <div>
              <strong class="block text-sm text-slate-800">لا توجد حركات بنكية مسجلة حالياً:</strong>
              رصيد كشف البنك الخارجي ورصيد الدفاتر كلاهما (0.00 ج.م). ابدأ بتسجيل قيود اليومية وترحيلها، واضغط على "استيراد كشف حساب البنك" لمطابقة العمليات.
            </div>
          </div>
        `;
        return;
    }

    if(alertBox) {
        if(isReconciled) {
            alertBox.innerHTML = `
              <div class="bg-emerald-50 border-2 border-emerald-400 text-emerald-950 p-4 rounded-xl text-xs font-bold flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-emerald-700">task_alt</span>
                <div>
                  <strong class="block text-sm">تهانينا! تم إنجاز التسوية البنكية بنجاح تام:</strong>
                  تطابق الرصيد البنكي المعدل (${adjustedBank.toLocaleString()} ج.م) مع الرصيد الدفتري المعدل بدقة 100%. تم تفسير كافة الفروقات الزمنية والعمليات المعلقة.
                </div>
              </div>
            `;
        } else {
            alertBox.innerHTML = `
              <div class="bg-amber-50 border-2 border-amber-300 text-amber-950 p-4 rounded-xl text-xs font-bold space-y-2">
                <div class="flex items-center gap-2 text-sm text-amber-900">
                  <span class="material-symbols-outlined">info</span>
                  <span>توجيه محاسبي: كيفية تصفير فرق التسوية:</span>
                </div>
                <p class="font-normal text-slate-700 leading-relaxed">
                  راجع العمليات غير المؤشر عليها. العمليات المؤشر عليها تعتبر متطابقة، بينما العمليات غير المؤشر عليها تُعامل كبنود تسوية (شيكات معلقة أو إيداعات غير مقيدة). اضغط <strong>«مطابقة ذكية»</strong> بالأعلى لمطابقة العمليات المتبادلة فورياً!
                </p>
              </div>
            `;
        }
    }
}



window.initRecon = initRecon;
window.updateRecon = updateRecon;
window.loadBankReconState = loadBankReconState;
window.saveBankReconState = saveBankReconState;
window.renderReconTables = renderReconTables;
window.calculateReconciliation = calculateReconciliation;
window.getBankStatementItems = () => bankStatementItems;
window.getBookReconItems = () => bookReconItems;
