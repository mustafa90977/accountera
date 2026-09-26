// ================= GENERAL LEDGER & MANUAL POSTING (_4) =================
let selectedPostingTrxId = null;
let selectedPostingLineId = null;
let currentPostingSide = 'debit';

function initLedger() {
    // Populate Account Dropdown
    const sel = document.getElementById('post-account-select');
    if(sel) {
        sel.innerHTML = '<option value="">-- اختر حساب الأستاذ --</option>';
        for(let code in ACCOUNTS) {
            sel.innerHTML += `<option value="${code}">${code} - ${ACCOUNTS[code]}</option>`;
        }
    }

    // Check URL params for pre-selected transaction
    const urlParams = new URLSearchParams(window.location.search);
    const paramTrx = urlParams.get('trx');
    if(paramTrx) {
        selectedPostingTrxId = paramTrx;
    }

    selectPostingSide('debit');
    renderPostingQueue();
    renderTAccounts();
    renderTrialBalance();
}

window.switchLedgerTab = function(tab) {
    const tabPosting = document.getElementById('tab-posting');
    const tabTAccounts = document.getElementById('tab-taccounts');
    const tabTB = document.getElementById('tab-tb');

    const btnPosting = document.getElementById('tab-btn-posting');
    const btnTAccounts = document.getElementById('tab-btn-taccounts');
    const btnTB = document.getElementById('tab-btn-tb');

    if(tab === 'posting') {
        tabPosting?.classList.remove('hidden');
        tabTAccounts?.classList.add('hidden');
        tabTB?.classList.add('hidden');

        btnPosting?.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        btnPosting?.classList.remove('text-slate-600', 'hover:bg-white/60');
        btnTAccounts?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnTAccounts?.classList.add('text-slate-600', 'hover:bg-white/60');
        btnTB?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnTB?.classList.add('text-slate-600', 'hover:bg-white/60');
    } else if(tab === 'taccounts') {
        tabPosting?.classList.add('hidden');
        tabTAccounts?.classList.remove('hidden');
        tabTB?.classList.add('hidden');

        btnTAccounts?.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        btnTAccounts?.classList.remove('text-slate-600', 'hover:bg-white/60');
        btnPosting?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnPosting?.classList.add('text-slate-600', 'hover:bg-white/60');
        btnTB?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnTB?.classList.add('text-slate-600', 'hover:bg-white/60');

        renderTAccounts();
    } else if(tab === 'tb') {
        tabPosting?.classList.add('hidden');
        tabTAccounts?.classList.add('hidden');
        tabTB?.classList.remove('hidden');

        btnTB?.classList.add('bg-slate-900', 'text-white', 'shadow-sm');
        btnTB?.classList.remove('text-slate-600', 'hover:bg-white/60');
        btnPosting?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnPosting?.classList.add('text-slate-600', 'hover:bg-white/60');
        btnTAccounts?.classList.remove('bg-slate-900', 'text-white', 'shadow-sm');
        btnTAccounts?.classList.add('text-slate-600', 'hover:bg-white/60');

        renderTrialBalance();
    }
}

function renderPostingQueue() {
    const queueList = document.getElementById('pending-queue-list');
    const queueBadge = document.getElementById('queue-badge');
    const headerPending = document.getElementById('pending-count-text');
    if(!queueList) return;

    const pending = studentJournal.filter(t => t.status === 'pending_posting');

    if(queueBadge) queueBadge.innerText = pending.length;
    if(headerPending) {
        headerPending.innerHTML = `<span class="hidden sm:inline">${pending.length} قيود معلقة</span><span class="sm:hidden">${pending.length} معلق</span>`;
    }

    const allJournal = (typeof getStudentJournal === 'function') ? getStudentJournal() : (window.studentJournal || []);
    if(pending.length === 0) {
        if (allJournal.length === 0) {
            queueList.innerHTML = `
              <div class="text-center py-10 p-4 text-slate-500">
                <span class="material-symbols-outlined text-4xl text-blue-500 mb-2">menu_book</span>
                <p class="font-bold text-slate-800 text-sm">دفتر الأستاذ جاهز لاستقبال قيودك</p>
                <p class="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">لم تسجل أي قيود في دفتر اليومية بعد. ابدأ باختيار مهمة وتسجيل قيدها لنقله هنا للترحيل اليدوي.</p>
                <a href="../journal/index.html" class="inline-flex items-center gap-1.5 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl min-h-[44px] transition shadow-xs">
                  <span class="material-symbols-outlined text-sm">edit_document</span>
                  <span>الذهاب لدفتر اليومية الآن</span>
                </a>
              </div>
            `;
        } else {
            queueList.innerHTML = `
              <div class="text-center py-12 p-4 text-slate-500">
                <span class="material-symbols-outlined text-4xl text-emerald-500 mb-2">task_alt</span>
                <p class="font-bold text-slate-800 text-sm">رائع! تم ترحيل جميع القيود المسجلة بنجاح ✓</p>
                <p class="text-xs text-slate-400 mt-1">لا توجد أي قيود معلقة بانتظار الترحيل حالياً.</p>
                <a href="../journal/index.html" class="inline-flex items-center gap-1.5 mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl min-h-[44px] transition shadow-xs">
                  <span class="material-symbols-outlined text-sm">add_circle</span>
                  <span>تسجيل قيد جديد في اليومية</span>
                </a>
              </div>
            `;
        }
        updateSelectedEntryBadge(null);
        return;
    }

    queueList.innerHTML = '';

    if(!selectedPostingTrxId || !pending.find(t => t.id === selectedPostingTrxId)) {
        selectedPostingTrxId = pending[0].id;
    }

    pending.forEach(trx => {
        const isCurrent = trx.id === selectedPostingTrxId;
        const card = document.createElement('div');
        card.className = `p-3.5 rounded-xl border-2 transition ${isCurrent ? 'border-blue-600 bg-blue-50/40 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'}`;

        let linesHtml = (trx.lines || []).map((line, idx) => {
            const isLineCurrent = isCurrent && line.lineId === selectedPostingLineId;
            const deb = Number(line.debit) || 0;
            const cred = Number(line.credit) || 0;
            const amt = deb > 0 ? deb : cred;
            const side = deb > 0 ? 'مدين' : 'دائن';

            return `
              <div class="flex justify-between items-center text-xs p-2 rounded-lg ${isLineCurrent ? 'bg-blue-100/70 border border-blue-300' : 'bg-slate-50 border border-slate-100'}">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full ${deb > 0 ? 'bg-blue-600' : 'bg-amber-600'}"></span>
                  <span class="font-bold text-slate-800">${line.accountCode} - ${line.accountName}</span>
                  <span class="font-mono text-slate-600">(${amt.toLocaleString()} ${side})</span>
                </div>
                <div>
                  ${line.posted 
                    ? '<span class="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1"><span class="material-symbols-outlined text-[13px]">check</span> تم الترحيل</span>'
                    : `<button type="button" onclick="selectPostingLine('${trx.id}', '${line.lineId}')" class="text-[11px] font-bold bg-slate-900 hover:bg-blue-900 text-white px-2.5 py-1 rounded-md transition shadow-2xs">اختر للترحيل 👈</button>`
                  }
                </div>
              </div>
            `;
        }).join('');

        card.innerHTML = `
          <div class="flex justify-between items-center mb-2.5 cursor-pointer" onclick="selectPostingTrx('${trx.id}')">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">${trx.id}</span>
              <span class="font-bold text-xs text-slate-800">${trx.ref || ''}</span>
              <span class="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">${getDocumentName(trx.type)}</span>
            </div>
            <span class="text-[11px] text-slate-400 font-mono">${trx.date}</span>
          </div>

          <div class="space-y-1.5">
            ${linesHtml}
          </div>
        `;

        queueList.appendChild(card);
    });

    const activeTrx = pending.find(t => t.id === selectedPostingTrxId);
    updateSelectedEntryBadge(activeTrx);
}

function updateSelectedEntryBadge(trx) {
    const badge = document.getElementById('selected-entry-badge');
    if(!badge) return;
    if(trx) {
        badge.innerHTML = `<span class="text-blue-800 font-bold">${trx.id} (${trx.ref})</span> - ${trx.date}`;
    } else {
        badge.innerText = 'لا توجد قيود معلقة';
    }
}

window.selectPostingTrx = function(trxId) {
    selectedPostingTrxId = trxId;
    selectedPostingLineId = null;
    renderPostingQueue();
}

window.selectPostingLine = function(trxId, lineId) {
    selectedPostingTrxId = trxId;
    selectedPostingLineId = lineId;

    const trx = studentJournal.find(t => t.id === trxId);
    if(!trx) return;

    const line = trx.lines.find(l => l.lineId === lineId);
    if(!line) return;

    // Auto fill form
    const sel = document.getElementById('post-account-select');
    if(sel) sel.value = line.accountCode;

    const descInput = document.getElementById('post-desc-input');
    if(descInput) descInput.value = (line.description || '') + ' - بموجب القيد ' + trx.ref;

    // Note: Leave side or amount for student to confirm or fill
    const amtInput = document.getElementById('post-amount-input');
    if(amtInput) amtInput.value = (line.debit > 0 ? line.debit : line.credit);

    if(line.debit > 0) {
        selectPostingSide('debit');
    } else {
        selectPostingSide('credit');
    }

    renderPostingQueue();
    const feedback = document.getElementById('posting-feedback');
    if(feedback) feedback.innerHTML = '';
}

window.selectPostingSide = function(side) {
    currentPostingSide = side;
    const debBtn = document.getElementById('side-debit-btn');
    const credBtn = document.getElementById('side-credit-btn');
    const debDot = document.getElementById('debit-dot');
    const credDot = document.getElementById('credit-dot');

    if(side === 'debit') {
        debBtn?.classList.add('border-blue-600', 'bg-blue-50', 'text-blue-900');
        debDot?.classList.add('bg-blue-600', 'border-blue-600');
        debDot?.classList.remove('border-slate-400');

        credBtn?.classList.remove('border-amber-600', 'bg-amber-50', 'text-amber-900');
        credDot?.classList.remove('bg-amber-600', 'border-amber-600');
        credDot?.classList.add('border-slate-400');
    } else {
        credBtn?.classList.add('border-amber-600', 'bg-amber-50', 'text-amber-900');
        credDot?.classList.add('bg-amber-600', 'border-amber-600');
        credDot?.classList.remove('border-slate-400');

        debBtn?.classList.remove('border-blue-600', 'bg-blue-50', 'text-blue-900');
        debDot?.classList.remove('bg-blue-600', 'border-blue-600');
        debDot?.classList.add('border-slate-400');
    }
}

window.submitManualPosting = function() {
    const feedback = document.getElementById('posting-feedback');
    if(!feedback) return;

    if(!selectedPostingTrxId) {
        feedback.innerHTML = '<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">الرجاء اختيار قيد من قائمة القيود المعلقة أولاً!</div>';
        return;
    }

    const trx = studentJournal.find(t => t.id === selectedPostingTrxId);
    if(!trx) {
        feedback.innerHTML = '<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">القيد المحدد غير موجود.</div>';
        return;
    }

    const accCode = document.getElementById('post-account-select')?.value;
    const amount = Number(document.getElementById('post-amount-input')?.value) || 0;
    const desc = document.getElementById('post-desc-input')?.value || 'ترحيل يدوي';

    if(!accCode) {
        feedback.innerHTML = '<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">الرجاء اختيار الحساب المراد الترحيل إليه في دفتر الأستاذ!</div>';
        return;
    }
    if(amount <= 0) {
        feedback.innerHTML = '<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">الرجاء إدخال مبلغ صحيح أكبر من صفر!</div>';
        return;
    }

    // Verification against lines in trx
    const unpostedLines = trx.lines.filter(l => !l.posted);
    const matchingLine = unpostedLines.find(l => l.accountCode === accCode);

    if(!matchingLine) {
        // Is it already posted?
        const alreadyPosted = trx.lines.find(l => l.accountCode === accCode && l.posted);
        if(alreadyPosted) {
            feedback.innerHTML = `<div class="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-bold">⚠️ تم ترحيل هذا الحساب (${ACCOUNTS[accCode]}) مسبقاً لهذا القيد!</div>`;
        } else {
            feedback.innerHTML = `<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">❌ هذا الحساب (${accCode} - ${ACCOUNTS[accCode]}) غير موجود ضمن أطراف هذا القيد المعلق!</div>`;
        }
        return;
    }

    // Check side
    const expectedSide = matchingLine.debit > 0 ? 'debit' : 'credit';
    if(currentPostingSide !== expectedSide) {
        feedback.innerHTML = `
          <div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">
            ❌ خطأ في توجيه الترحيل: هذا السطر في قيد اليومية طبيعته <strong>${expectedSide === 'debit' ? 'مدين (منه)' : 'دائن (له)'}</strong>! لا يجوز ترحيله في الجانب ${currentPostingSide === 'debit' ? 'المدين' : 'الدائن'}.
          </div>
        `;
        return;
    }

    // Check amount
    const expectedAmount = matchingLine.debit > 0 ? matchingLine.debit : matchingLine.credit;
    if(Math.abs(amount - expectedAmount) > 0.01) {
        feedback.innerHTML = `
          <div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">
            ❌ خطأ في المبلغ: المبلغ المسجل في القيد لهذا الحساب هو <strong>${expectedAmount.toLocaleString()} ج.م</strong> بينما أدخلت ${amount.toLocaleString()} ج.م!
          </div>
        `;
        return;
    }

    // All Good! Post to studentLedger
    matchingLine.posted = true;
    if(!studentLedger[accCode]) studentLedger[accCode] = [];

    studentLedger[accCode].push({
        trxId: trx.id,
        ref: trx.ref,
        date: trx.date,
        debit: currentPostingSide === 'debit' ? amount : 0,
        credit: currentPostingSide === 'credit' ? amount : 0,
        description: desc
    });

    // Check if whole transaction is fully posted
    if(trx.lines.every(l => l.posted)) {
        trx.status = 'posted';
    }

    saveStudentState();

    feedback.innerHTML = `
      <div class="p-3.5 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-xl font-bold space-y-1 shadow-xs">
        <div class="flex items-center gap-1.5 text-sm">
          <span class="material-symbols-outlined text-emerald-700">check_circle</span>
          <span>أحسنت! تم ترحيل السطر بنجاح ✅</span>
        </div>
        <div class="text-xs text-emerald-900 font-normal">
          تم قيد مبلغ <strong>${amount.toLocaleString()} ج.م</strong> في الجانب <strong>${currentPostingSide === 'debit' ? 'المدين (منه)' : 'الدائن (له)'}</strong> لحساب (${ACCOUNTS[accCode]}).
          ${trx.status === 'posted' ? '<br/><strong class="text-emerald-800 mt-1 block">🎉 تم استكمال ترحيل جميع أطراف القيد (' + trx.id + ') بنجاح واعتمد دفترياً!</strong>' : ''}
        </div>
      </div>
    `;

    // Clear inputs
    document.getElementById('post-amount-input').value = '';
    document.getElementById('post-desc-input').value = '';
    selectedPostingLineId = null;

    renderPostingQueue();
    renderTAccounts();
    renderTrialBalance();
}

function renderTAccounts() {
    const grid = document.getElementById('t-accounts-grid');
    if(!grid) return;
    grid.innerHTML = '';

    // Only accounts that have movements
    const activeCodes = Object.keys(ACCOUNTS).filter(c => {
        const moves = studentLedger[c];
        return moves && moves.length > 0;
    });

    if(activeCodes.length === 0) {
        grid.innerHTML = '<div class="col-span-2 text-center py-12 text-slate-400 font-medium">لا توجد حركات مرحلة في دفتر الأستاذ بعد.</div>';
        return;
    }

    activeCodes.forEach(code => {
        const moves = studentLedger[code] || [];
        let totalDebit = 0;
        let totalCredit = 0;

        const debitRows = [];
        const creditRows = [];

        moves.forEach(m => {
            const deb = Number(m.debit) || 0;
            const cred = Number(m.credit) || 0;
            totalDebit += deb;
            totalCredit += cred;

            if(deb > 0) {
                debitRows.push(`
                  <div class="flex justify-between items-center py-1 border-b border-slate-100 text-xs">
                    <div>
                      <span class="font-mono text-[11px] text-slate-400 block">${m.date}</span>
                      <span class="text-slate-700 font-medium">${m.description || m.ref || ''}</span>
                    </div>
                    <span class="font-mono font-bold text-slate-900 mr-2">${deb.toLocaleString()}</span>
                  </div>
                `);
            }
            if(cred > 0) {
                creditRows.push(`
                  <div class="flex justify-between items-center py-1 border-b border-slate-100 text-xs">
                    <div>
                      <span class="font-mono text-[11px] text-slate-400 block">${m.date}</span>
                      <span class="text-slate-700 font-medium">${m.description || m.ref || ''}</span>
                    </div>
                    <span class="font-mono font-bold text-slate-900 mr-2">${cred.toLocaleString()}</span>
                  </div>
                `);
            }
        });

        const diff = totalDebit - totalCredit;
        const netSide = diff >= 0 ? 'مدين' : 'دائن';
        const netVal = Math.abs(diff);

        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl border-2 border-slate-300 shadow-sm overflow-hidden flex flex-col";
        card.innerHTML = `
          <!-- T-Account Top Bar -->
          <div class="p-3.5 bg-slate-900 text-white flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="font-mono font-black text-xs bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-blue-400">${code}</span>
              <span class="font-bold text-sm text-white">${ACCOUNTS[code]}</span><button type="button" onclick="showAccountStatement(\'${code}\')" class="mr-2 text-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-2 py-0.5 rounded transition">كشف حساب 📋</button>
            </div>
            <span class="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700">
              الرصيد: ${netVal.toLocaleString()} (${netSide})
            </span>
          </div>

          <!-- T-Account Body: 2 Halves (Debit / Credit) -->
          <div class="grid grid-cols-2 divide-x divide-x-reverse divide-slate-300 flex-1 p-3 bg-slate-50/40">
            <!-- Right Half: Debit (منه) -->
            <div class="pr-2 pl-3">
              <div class="text-center font-bold text-xs text-blue-900 bg-blue-100/70 py-1 rounded-lg mb-2">
                جانب مدين (منه) 📥
              </div>
              <div class="space-y-1 max-h-48 overflow-y-auto">
                ${debitRows.length > 0 ? debitRows.join('') : '<p class="text-[11px] text-slate-300 text-center py-4">لا توجد حركات مدينة</p>'}
              </div>
            </div>

            <!-- Left Half: Credit (له) -->
            <div class="pl-2 pr-3">
              <div class="text-center font-bold text-xs text-amber-900 bg-amber-100/70 py-1 rounded-lg mb-2">
                جانب دائن (له) 📤
              </div>
              <div class="space-y-1 max-h-48 overflow-y-auto">
                ${creditRows.length > 0 ? creditRows.join('') : '<p class="text-[11px] text-slate-300 text-center py-4">لا توجد حركات دائنة</p>'}
              </div>
            </div>
          </div>

          <!-- T-Account Footer: Totals and Balance -->
          <div class="border-t-2 border-slate-300 bg-slate-100 p-2.5 grid grid-cols-2 divide-x divide-x-reverse divide-slate-300 text-xs font-mono font-bold text-slate-800">
            <div class="pr-2 pl-3 flex justify-between">
              <span class="font-sans text-slate-500 font-medium">مجموع المدين:</span>
              <span class="text-blue-950">${totalDebit.toLocaleString()}</span>
            </div>
            <div class="pl-2 pr-3 flex justify-between">
              <span class="font-sans text-slate-500 font-medium">مجموع الدائن:</span>
              <span class="text-amber-950">${totalCredit.toLocaleString()}</span>
            </div>
          </div>
        `;
        grid.appendChild(card);
    });
}

function renderTrialBalance() {
    const tbody = document.getElementById('ledger-tbody');
    const debEl = document.getElementById('tb-total-debit');
    const credEl = document.getElementById('tb-total-credit');
    const badgeEl = document.getElementById('tb-balance-badge');
    const alertEl = document.getElementById('tb-status-alert');
    if(!tbody) return;

    tbody.innerHTML = '';
    const balances = calculateBalances();
    let totDebit = 0;
    let totCredit = 0;

    Object.keys(ACCOUNTS).forEach(code => {
        const bal = balances[code] || 0;
        if(bal === 0) return; // Hide empty accounts

        const isDebit = bal > 0;
        const val = Math.abs(bal);

        if (isDebit) totDebit += val;
        else totCredit += val;

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 transition">
                <td class="p-3 text-center font-mono font-bold text-slate-700">${code}</td>
                <td class="p-3 font-semibold text-slate-800 flex items-center justify-between"><span>${ACCOUNTS[code]}</span><button type="button" onclick="showAccountStatement(\'${code}\')" class="text-[10px] text-blue-700 hover:underline font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">كشف حساب 📋</button></td>
                <td class="p-3 text-center font-mono ${isDebit ? 'font-black text-slate-900 bg-emerald-50/20' : 'text-slate-300'}">${isDebit ? val.toLocaleString() : '-'}</td>
                <td class="p-3 text-center font-mono ${!isDebit ? 'font-black text-slate-900 bg-emerald-50/20' : 'text-slate-300'}">${!isDebit ? val.toLocaleString() : '-'}</td>
            </tr>
        `;
    });

    if(tbody.innerHTML === '') {
        tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 font-medium">لا توجد حركات أو أرصدة مرحلة بعد. ابدأ بتسجيل وترحيل قيد الأرصدة الافتتاحية من دفتر اليومية.</td></tr>';
    }

    if(debEl) debEl.innerText = totDebit.toLocaleString();
    if(credEl) credEl.innerText = totCredit.toLocaleString();

    const diff = Math.abs(totDebit - totCredit);
    const isBalanced = diff < 0.01;

    if(totDebit === 0 && totCredit === 0) {
        if(badgeEl) {
            badgeEl.className = "text-xs font-bold px-3 py-1 rounded-full bg-slate-200 text-slate-700";
            badgeEl.innerText = "بانتظار الترحيل (0.00 ج.م)";
        }
        if(alertEl) {
            alertEl.innerHTML = `
              <div class="bg-slate-50 border border-slate-200 text-slate-700 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-slate-500">info</span>
                <span>لم يتم ترحيل أي حركات محاسبية إلى دفتر الأستاذ العام بعد. انتقل إلى دفتر اليومية لتسجيل وترحيل القيد الافتتاحي.</span>
              </div>
            `;
        }
    } else {
        if(badgeEl) {
            if(isBalanced) {
                badgeEl.className = "text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white";
                badgeEl.innerText = "متزن ومطابق 100% ✓";
            } else {
                badgeEl.className = "text-xs font-bold px-3 py-1 rounded-full bg-rose-500 text-white animate-pulse";
                badgeEl.innerText = "غير متزن! فرق: " + diff.toLocaleString() + " ج.م";
            }
        }

        if(alertEl) {
            if(isBalanced) {
                alertEl.innerHTML = `
                  <div class="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-emerald-700">check_circle</span>
                    <span>ميزان المراجعة بالأرصدة متوازن تماماً، وجميع الحسابات المرحلة مطابقة لقواعد القيد المزدوج.</span>
                  </div>
                `;
            } else {
                alertEl.innerHTML = `
                  <div class="bg-rose-50 border-2 border-rose-300 text-rose-900 p-3.5 rounded-xl text-xs font-bold space-y-1">
                    <div class="flex items-center gap-2 text-sm text-rose-800">
                      <span class="material-symbols-outlined">warning</span>
                      <span>تنبيه محاسبي تعليمي: ميزان المراجعة غير متزن!</span>
                    </div>
                    <p class="font-normal text-slate-700">
                      يوجد فرق قدره <strong>${diff.toLocaleString()} ج.م</strong> بين مجموع الأرصدة المدينة (${totDebit.toLocaleString()}) والدائنة (${totCredit.toLocaleString()}).
                      السبب: يوجد قيود يومية معلقة قمت بترحيل طرف واحد منها ولم ترحل الطرف الآخر بعد!
                    </p>
                  </div>
                `;
            }
        }
    }
}


window.initLedger = initLedger;
window.renderPostingQueue = renderPostingQueue;
window.renderTAccounts = renderTAccounts;
window.renderTrialBalance = renderTrialBalance;
