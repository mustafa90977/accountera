// ================= WORKSPACE (_2 - JOURNAL) =================
let selectedTrxId = null;

function getCompanyName() {
    try {
        const raw = localStorage.getItem('sim_company_profile');
        if (raw) {
            const p = JSON.parse(raw);
            if (p && p.name) return p.name;
        }
    } catch(e) {}
    return 'شركة النيل للتجارة والتوزيع';
}

function formatEGP(val) {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.switchJournalMobilePane = function(pane) {
    const panes = ['tasks', 'doc', 'form'];
    panes.forEach(p => {
        const el = document.getElementById('jpane-' + p);
        const btn = document.getElementById('jtab-btn-' + p);
        if (el) {
            if (p === pane) {
                el.classList.remove('hidden');
                el.classList.add('flex');
            } else {
                el.classList.remove('flex');
                el.classList.add('hidden');
            }
        }
        if (btn) {
            if (p === pane) {
                btn.className = 'flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 bg-slate-900 text-white shadow-sm min-h-[44px]';
            } else {
                btn.className = 'flex-1 py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 bg-surface-container text-on-surface-variant hover:text-on-surface min-h-[44px]';
            }
        }
    });
};

function checkAndLoadActiveDraft() {
    let rawDraft = localStorage.getItem('acc_draft_journal_entry');
    if (!rawDraft) return;
    try {
        const draft = JSON.parse(rawDraft);
        if (draft && Array.isArray(draft.lines) && draft.lines.length >= 2) {
            formLines = draft.lines.map(l => ({
                account: l.account || '',
                debit: Number(l.debit) || 0,
                credit: Number(l.credit) || 0
            }));
            renderForm();
            showDraftBanner(draft);
            renderDraftDocument(draft);
            if (window.innerWidth < 1024 && typeof switchJournalMobilePane === 'function') {
                switchJournalMobilePane('form');
            }
        }
    } catch(e) {
        console.error('Error loading draft entry:', e);
    }
}

function showDraftBanner(draft) {
    const slot = document.getElementById('draft-banner-slot');
    if (!slot) return;

    let bannerTitle = 'مسودة قيد تسوية بنكية (بانتظار مراجعتك واعتمادك)';
    let sourceText = 'فروقات كشف حساب البنك';
    if (draft.sourceModule === 'CASH_COUNT') {
        bannerTitle = 'مسودة قيد تسوية جرد الخزينة (بانتظار مراجعتك واعتمادك)';
        sourceText = 'محضر جرد الخزينة الفعلي';
    } else if (draft.sourceModule === 'INVENTORY_COUNT') {
        bannerTitle = 'مسودة قيد تسوية جرد المخزون (بانتظار مراجعتك واعتمادك)';
        sourceText = 'محضر جرد المخزن الفعلي';
    } else if (draft.sourceModule === 'VAT_CLEARING') {
        bannerTitle = 'مسودة قيد مقاصة وإقفال ضريبة القيمة المضافة (نموذج 10)';
        sourceText = 'إقرار ضريبة القيمة المضافة وحساب المقاصة الدفترية';
    }

    slot.innerHTML = `
      <div id="draft-review-banner" class="mb-4 p-3.5 bg-blue-50/95 border-2 border-blue-400 rounded-xl text-blue-950 text-xs shadow-xs text-right space-y-2 animate-in fade-in duration-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-base">📝</span>
            <strong class="text-sm font-extrabold text-blue-950">${bannerTitle}</strong>
          </div>
          <button type="button" onclick="discardDraftEntry()" class="text-slate-400 hover:text-rose-700 text-xs font-bold px-2 py-0.5 rounded transition cursor-pointer" title="إلغاء مسودة القيد">✕ إلغاء المسودة</button>
        </div>
        <p class="text-slate-700 leading-relaxed font-medium">
          تم تحضير المسودة بناءً على ${sourceText}: <strong>${draft.desc}</strong> بمبلغ <strong>${(draft.amount || 0).toLocaleString()} ج.م</strong>.
          راجع أطراف القيد وتوجيه الحسابات والمبالغ بدقة، ثم اضغط <strong>«حفظ وتسجيل في دفتر اليومية»</strong> للاعتماد.
        </p>
      </div>
    `;
}

function renderDraftDocument(draft) {
    const docViewer = document.getElementById('document-viewer');
    if (!docViewer) return;
    const compName = getCompanyName();
    const words = tafqeetArabic(draft.amount || 0);

    let docSub = 'إشعار قيد تسوية بنكية (Bank Reconciliation Notice)';
    let footerNote = 'مرفق كشف حساب البنك الدوري لمطابقة أرصدة الدفاتر (حـ/ 1102)';
    if (draft.sourceModule === 'CASH_COUNT') {
        docSub = 'إشعار تسوية عجز / زيادة الخزينة (Cash Count Discrepancy)';
        footerNote = 'مرفق محضر جرد الخزينة المعتمد لمطابقة رصيد النقدية بالدفاتر (حـ/ 1101)';
    } else if (draft.sourceModule === 'INVENTORY_COUNT') {
        docSub = 'إشعار تسوية فروقات الجرد المخزني (Inventory Variance Notice)';
        footerNote = 'مرفق محضر جرد المخزن المعتمد لمطابقة رصيد المخزون السلعي بالدفاتر (حـ/ 1104)';
    } else if (draft.sourceModule === 'VAT_CLEARING') {
        docSub = 'إشعار مقاصة وسداد ضريبة القيمة المضافة (نموذج 10 ض.ق.م)';
        footerNote = 'مرفق إقرار ضريبة القيمة المضافة نموذج 10 المعتمد لمصلحة الضرائب المصرية';
    }

    docViewer.innerHTML = `
      <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative animate-in fade-in duration-200">
        <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
          <div>
            <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
            <p class="text-[10px] text-slate-500">${docSub}</p>
          </div>
          <div class="text-left">
            <span class="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded font-mono">${draft.ref || 'RECON-ADJ'}</span>
            <p class="text-[10px] text-slate-400 mt-1">${draft.date || ''}</p>
          </div>
        </div>

        <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
          <div class="flex justify-between py-1 border-b border-slate-200">
            <span class="text-slate-500">طبيعة العملية:</span>
            <span class="font-bold text-slate-800">${draft.title || 'قيد تسوية بالدفاتر'}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-slate-200">
            <span class="text-slate-500">بيان المعاملة / المحضر:</span>
            <span class="font-medium text-slate-700">${draft.desc || ''}</span>
          </div>
          <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
            <span>مبلغ التسوية المطلوب:</span>
            <span class="font-mono text-blue-900 text-base">${(draft.amount || 0).toLocaleString()} ج.م</span>
          </div>
          <div class="text-[11px] text-slate-500 text-center font-serif">
            فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
          </div>
        </div>
        <p class="text-[10px] text-slate-400 text-center">${footerNote}</p>
      </div>
    `;
}

window.discardDraftEntry = function() {
    localStorage.removeItem('acc_draft_journal_entry');
    const banner = document.getElementById('draft-review-banner');
    if (banner) banner.remove();
    resetForm();
    const pending = answerKey.filter(t => !studentJournal.find(j => j.id === t.id));
    if (pending.length > 0) {
        selectTask(pending[0]);
    }
};

function initWorkspace() {
    renderPendingList();
    renderPostedEntries();
    checkAndLoadActiveDraft();
}

function renderPendingList() {
    const pendingList = document.getElementById('pending-list');
    if(!pendingList) return;
    pendingList.innerHTML = '';

    const pending = answerKey.filter(t => !studentJournal.find(j => j.id === t.id));
    
    const pendingCountEl = document.getElementById('jtab-tasks-count');
    if (pendingCountEl) {
        pendingCountEl.textContent = pending.length;
    }
    
    if (pending.length === 0) {
        if (answerKey.length === 0) {
            pendingList.innerHTML = '<div class="p-6 text-center text-slate-400 bg-slate-50 m-3 rounded-xl border border-dashed border-slate-300 font-medium text-xs leading-relaxed"><span class="material-symbols-outlined text-3xl text-slate-300 mb-1">inbox</span><br><strong class="text-slate-700 block mb-1">لا توجد مهام مسندة حالياً</strong>بانتظار إسناد العمليات والمستندات من لوحة تحكم الإدارة.<br><span class="text-[10px] text-blue-600 mt-2 block font-sans">يمكنك أيضاً تسجيل قيود محاسبية حرة مباشرة عبر النموذج.</span></div>';
            const docViewer = document.getElementById('document-viewer');
            if(docViewer) docViewer.innerHTML = '<div class="text-slate-400 font-medium text-center py-12"><span class="material-symbols-outlined text-4xl mb-2 text-slate-300">draft</span><br><strong class="text-slate-700 block mb-1">لا يوجد مستند نشط</strong>بانتظار إسناد مهام ومستندات من لوحة الإدارة</div>';
            return;
        }
        pendingList.innerHTML = '<div class="p-6 text-center text-emerald-700 bg-emerald-50 m-4 rounded-xl border border-emerald-200 font-bold">🎉 تهانينا! تم تسجيل جميع المستندات في دفتر اليومية بنجاح.</div>';
        const docViewer = document.getElementById('document-viewer');
        if(docViewer) docViewer.innerHTML = '<div class="text-slate-400 font-medium text-center">لا توجد مستندات معلقة</div>';
        return;
    }

    pending.forEach((trx, idx) => {
        const isCurrent = idx === 0;
        const div = document.createElement('div');
        
        if (isCurrent) {
            div.className = 'p-3.5 border-b-2 border-blue-600 bg-blue-50/90 cursor-pointer flex items-center justify-between border-r-4 border-r-blue-800 shadow-2xs transition';
            div.innerHTML = `
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <span class="font-bold text-sm text-blue-950">${trx.ref}</span>
                        <span class="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.5 rounded">المستحقة حالياً ⏳</span>
                    </div>
                    <div class="text-xs text-blue-800 font-medium mt-0.5">${getDocumentName(trx.type)}</div>
                </div>
                <div class="text-xs font-mono font-bold text-blue-900">${trx.date}</div>
            `;
            div.onclick = () => selectTask(trx);
        } else {
            div.className = 'p-3 border-b border-slate-100 bg-slate-50/60 opacity-60 cursor-not-allowed flex items-center justify-between transition hover:opacity-85';
            div.innerHTML = `
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-slate-400 text-[16px]">lock</span>
                        <span class="font-bold text-sm text-slate-500">${trx.ref}</span>
                        <span class="text-[10px] bg-slate-200 text-slate-600 font-bold px-1.5 py-0.5 rounded">مقفلة 🔒</span>
                    </div>
                    <div class="text-xs text-slate-400 font-medium mt-0.5">${getDocumentName(trx.type)}</div>
                </div>
                <div class="text-xs font-mono text-slate-400">${trx.date}</div>
            `;
            div.onclick = () => {
                showChronologicalLockNotice(trx, pending[0]);
            };
        }
        pendingList.appendChild(div);
    });

    if (pending.length > 0) {
        selectedTrxId = pending[0].id;
        renderDocument(pending[0]);
    }
}

window.showChronologicalLockNotice = function(lockedTrx, currentTrx) {
    const feedback = document.getElementById('feedback-msg');
    if(feedback) {
        feedback.innerHTML = `
          <div class="p-3.5 bg-amber-50 border-2 border-amber-300 text-amber-950 rounded-xl text-xs font-bold space-y-1.5 shadow-sm animate-in fade-in">
            <div class="flex items-center gap-1.5 text-amber-900 text-sm">
              <span class="material-symbols-outlined text-lg">lock_clock</span>
              <span>مبدأ التتابع والتسلسل الزمني المحاسبي (Chronological Constraint)</span>
            </div>
            <p class="font-normal text-slate-700 leading-relaxed">
              هذه المعاملة <strong>(${lockedTrx.ref})</strong> بتاريخ <strong>${lockedTrx.date}</strong> مقفلة حالياً.
              يجب أولاً تسجيل المعاملة المستحقة <strong>(${currentTrx.ref})</strong> بتاريخ <strong>${currentTrx.date}</strong> لضمان سلامة الأرصدة النقدية والمخزنية المتتابعة.
            </p>
          </div>
        `;
    }
}

const taskErrorStates = {};
const taskHintRequested = {};

function selectTask(trx) {
    if(!trx) return;
    selectedTrxId = trx.id;
    
    // إخفاء أو إظهار زر التلميح في رأس النموذج بحسب حالة هذا السند
    const formHintBtn = document.getElementById('form-hint-btn');
    if (formHintBtn) {
        if (taskErrorStates[trx.id]) {
            formHintBtn.classList.remove('hidden');
        } else {
            formHintBtn.classList.add('hidden');
        }
    }

    renderDocument(trx);
    resetForm();
    if (window.innerWidth < 1024 && typeof switchJournalMobilePane === 'function') {
        switchJournalMobilePane('doc');
    }
}

function tafqeetArabic(n) {
    n = Math.floor(Math.abs(Number(n) || 0));
    if (n === 0) return 'صفر';
    const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة', 'عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
    const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
    const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
    
    if (n < 20) return ones[n];
    if (n < 100) return (n % 10 !== 0 ? ones[n % 10] + ' و' : '') + tens[Math.floor(n / 10)];
    if (n < 1000) return hundreds[Math.floor(n / 100)] + (n % 100 !== 0 ? ' و' + tafqeetArabic(n % 100) : '');
    if (n < 1000000) {
        const thousands = Math.floor(n / 1000);
        const rem = n % 1000;
        let thStr = '';
        if (thousands === 1) thStr = 'ألف';
        else if (thousands === 2) thStr = 'ألفان';
        else if (thousands >= 3 && thousands <= 10) thStr = ones[thousands] + ' آلاف';
        else thStr = tafqeetArabic(thousands) + ' ألفاً';
        return thStr + (rem !== 0 ? ' و' + tafqeetArabic(rem) : '');
    }
    return n.toLocaleString();
}

function buildHintHtml(trx) {
    if (!trx) return '';

    // يظهر التلميح فقط إذا أخطأ الطالب في المحاولة وطلب التلميح
    const hasError = !!taskErrorStates[trx.id];
    const hasRequested = !!taskHintRequested[trx.id];

    if (!hasError || !hasRequested) {
        return `<div id="doc-hint-wrapper" class="hidden"></div>`;
    }

    const debits = (trx.lines || []).filter(l => Number(l.debit) > 0);
    const credits = (trx.lines || []).filter(l => Number(l.credit) > 0);
    const isCompound = (debits.length + credits.length) > 2;

    const entryTypeTitle = isCompound 
      ? `قيد مركب (${debits.length + credits.length} أسطر)`
      : `قيد بسيط (سطران: طرف مدين وطرف دائن)`;

    let stepsHtml = '';
    if (trx.solutionSteps && Array.isArray(trx.solutionSteps) && trx.solutionSteps.length > 0) {
        stepsHtml = `
            <div class="space-y-1.5">
                <strong class="text-amber-900 block text-[11px] font-bold">خطوات التحليل والتسجيل المحاسبي:</strong>
                <ol class="list-decimal list-inside space-y-1 text-slate-700 text-[11px] leading-relaxed">
                    ${trx.solutionSteps.map(s => `<li>${s}</li>`).join('')}
                </ol>
            </div>
        `;
    } else {
        stepsHtml = `
            <div class="space-y-1 text-slate-700 text-[11px] leading-relaxed">
                <div>• <strong class="text-slate-900">الطرف المدين (من حـ/):</strong> ${debits.map(d => `${ACCOUNTS[d.accountCode] || d.accountName || d.accountCode} (${Number(d.debit).toLocaleString()} ج.م)`).join(' + ')}</div>
                <div>• <strong class="text-slate-900">الطرف الدائن (إلى حـ/):</strong> ${credits.map(c => `${ACCOUNTS[c.accountCode] || c.accountName || c.accountCode} (${Number(c.credit).toLocaleString()} ج.م)`).join(' + ')}</div>
            </div>
        `;
    }

    let hintsListHtml = '';
    if (trx.hints && Array.isArray(trx.hints) && trx.hints.length > 0) {
        hintsListHtml = `
            <div class="space-y-1 pt-1.5 border-t border-amber-200/80">
                <strong class="text-amber-900 block text-[11px] font-bold">إرشادات مفتاحية للحل:</strong>
                <ul class="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                    ${trx.hints.map(h => `<li>${h}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    const ruleHtml = trx.accountingRule ? `
        <div class="p-2 bg-white/90 rounded-lg border border-amber-200 text-[11px] text-amber-950 font-serif leading-relaxed">
            <span class="font-bold text-amber-900">القاعدة المحاسبية المعتمدة: </span>${trx.accountingRule}
        </div>
    ` : `
        <div class="p-2 bg-white/90 rounded-lg border border-amber-200 text-[11px] text-amber-950 font-serif leading-relaxed">
            <span class="font-bold text-amber-900">قاعدة القيد المزدوج: </span>المصروفات والأصول بطبيعتها مدينة وتزيد بالجانب المدين، بينما الإيرادات والالتزامات بطبيعتها دائنة وتزيد بالجانب الدائن.
        </div>
    `;

    return `
        <div class="mt-3.5 border-t-2 border-amber-300 pt-3 text-right animate-in fade-in duration-200" id="doc-hint-wrapper">
            <div class="p-3.5 bg-amber-50/90 border border-amber-300 rounded-xl text-xs space-y-2.5 shadow-sm">
                <div class="flex items-center justify-between pb-1.5 border-b border-amber-200">
                    <span class="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <span class="text-base">💡</span>
                        <span>تلميح وإرشادات القيد المحاسبي:</span>
                        <span class="text-blue-900 font-extrabold">${entryTypeTitle}</span>
                    </span>
                    <div class="flex items-center gap-1.5">
                        <span class="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">${debits.length} مدين / ${credits.length} دائن</span>
                        <button type="button" onclick="taskHintRequested['${trx.id}'] = false; renderDocument(selectedTaskObject());" class="text-slate-400 hover:text-slate-700 font-bold text-xs px-1" title="إخفاء التلميح">✕</button>
                    </div>
                </div>
                ${stepsHtml}
                ${ruleHtml}
                ${hintsListHtml}
            </div>
        </div>
    `;
}

window.selectedTaskObject = function() {
    const pending = answerKey.filter(t => !studentJournal.find(j => j.id === t.id));
    return pending.find(t => t.id === selectedTrxId) || pending[0];
};

window.requestAccountingHint = function() {
    if (!selectedTrxId) return;
    taskHintRequested[selectedTrxId] = true;

    try {
        if (typeof getCareerProfile === 'function') {
            const prof = getCareerProfile();
            prof.hintsUsedCount = (prof.hintsUsedCount || 0) + 1;
            saveCareerProfile(prof);
        }
    } catch(e) {}

    const currentTrx = window.selectedTaskObject();
    if (currentTrx) {
        renderDocument(currentTrx);
    }

    // إظهار زر التلميح في رأس النموذج
    document.getElementById('form-hint-btn')?.classList.remove('hidden');

    if (window.innerWidth < 1024 && typeof switchJournalMobilePane === 'function') {
        switchJournalMobilePane('doc');
    }

    setTimeout(() => {
        const wrapper = document.getElementById('doc-hint-wrapper');
        if (wrapper && !wrapper.classList.contains('hidden')) {
            wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
};

window.toggleAccountingHint = window.requestAccountingHint;

// =========================================================================
// Interactive Document Inspector & Visual Autofill Engine (Phase 4)
// =========================================================================

function renderInspectableRow(label, amount, code, side, rationale, colorClass = 'text-slate-800') {
    const safeRationale = encodeURIComponent(rationale || '');
    return `
      <div class="flex justify-between items-center py-1.5 px-2 rounded-lg border border-transparent hover:border-blue-300 hover:bg-blue-50/80 transition group cursor-pointer" onclick="inspectDocumentFigure('${code}', ${amount}, '${side}', '${label}', '${safeRationale}')" title="انقر لتشغيل الفاحص الذكي ومعاينة التوجيه المحاسبي">
        <span class="text-slate-600 flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[14px] text-blue-600 opacity-60 group-hover:opacity-100">travel_explore</span>
          <span>${label}:</span>
        </span>
        <div class="flex items-center gap-1.5">
          <span class="font-mono font-bold ${colorClass}">${Number(amount).toLocaleString()} ج.م</span>
          <span class="text-[9px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-2xs">فحص ➔</span>
        </div>
      </div>
    `;
}

window.inspectDocumentFigure = function(accountCode, amount, side, label, encRationale) {
    const rationale = decodeURIComponent(encRationale || '');
    const accName = (typeof ACCOUNTS !== 'undefined' && ACCOUNTS[accountCode]) ? ACCOUNTS[accountCode] : `حساب (${accountCode})`;
    const isDebit = side === 'debit';
    const sideBadge = isDebit 
        ? '<span class="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded font-bold">مدين (منه) +Dr</span>'
        : '<span class="bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">دائن (له) +Cr</span>';

    let drawer = document.getElementById('doc-inspector-drawer');
    if (!drawer) return;

    drawer.classList.remove('hidden');
    drawer.innerHTML = `
      <div class="space-y-3 animate-in zoom-in-95 duration-150">
        <div class="flex justify-between items-start border-b border-blue-200 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-700 text-[20px]">psychology</span>
            <div>
              <h4 class="font-extrabold text-xs text-blue-950">فاحص المستند التوجيهي الذكي</h4>
              <p class="text-[10px] text-slate-500">تحليل البند: <strong>${label}</strong> بمبلغ <span class="font-mono font-bold text-slate-800">${Number(amount).toLocaleString()} ج.م</span></p>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('doc-inspector-drawer').classList.add('hidden')" class="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 cursor-pointer">✕</button>
        </div>

        <div class="bg-white p-3 rounded-xl border border-blue-200 text-xs space-y-2 shadow-2xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500">الطرف المحاسبي في الدليل:</span>
            <div class="flex items-center gap-1.5">
              <span class="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">${accountCode}</span>
              <strong class="text-slate-900">${accName}</strong>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-slate-500">طبيعة الحركة في القيد:</span>
            <div>${sideBadge}</div>
          </div>

          <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-700 leading-relaxed">
            <strong class="text-slate-900 block mb-0.5">📌 التوجيه والتعليل المحاسبي:</strong>
            ${rationale}
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 pt-1">
          <button type="button" onclick="autofillJournalLine('${accountCode}', ${amount}, '${side}')" class="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm">
            <span class="material-symbols-outlined text-[15px]">input</span>
            <span>إدراج هذا الطرف تلقائياً في سطر القيد</span>
          </button>
          <button type="button" onclick="document.getElementById('doc-inspector-drawer').classList.add('hidden')" class="bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl border border-slate-300 cursor-pointer">
            إغلاق
          </button>
        </div>
      </div>
    `;
    drawer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.autofillJournalLine = function(accountCode, amount, side) {
    if (!formLines || !Array.isArray(formLines)) return;

    let targetLine = formLines.find(l => (!l.account || l.account === '') && Number(l.debit) === 0 && Number(l.credit) === 0);
    if (!targetLine) {
        targetLine = { account: '', debit: 0, credit: 0 };
        formLines.push(targetLine);
    }

    targetLine.account = String(accountCode);
    if (side === 'debit') {
        targetLine.debit = Number(amount);
        targetLine.credit = 0;
    } else {
        targetLine.credit = Number(amount);
        targetLine.debit = 0;
    }

    renderForm();
    recalculateTotals();

    const feedback = document.getElementById('feedback-msg');
    if (feedback) {
        const accName = (typeof ACCOUNTS !== 'undefined' && ACCOUNTS[accountCode]) ? ACCOUNTS[accountCode] : accountCode;
        feedback.innerHTML = `
          <div class="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <span class="material-symbols-outlined text-[18px] text-blue-700">check_circle</span>
            <span>تم إدراج حـ/ ${accName} بمبلغ (${Number(amount).toLocaleString()} ج.م) في القيد بنجاح!</span>
          </div>
        `;
    }

    if (window.innerWidth < 1024 && typeof switchJournalMobilePane === 'function') {
        switchJournalMobilePane('form');
    }
};

function renderDocument(trx) {
    const viewer = document.getElementById('document-viewer');
    if(!viewer) return;

    let docHtml = '';
    const compName = getCompanyName();

    if (trx.type === 'Purchase') {
        const invLine = trx.lines.find(l => l.accountCode === '1104');
        const vatLine = trx.lines.find(l => l.accountCode === '1106');
        const apLine = trx.lines.find(l => l.accountCode === '2101');
        
        const invAmt = invLine ? invLine.debit : 0;
        const vatAmt = vatLine ? vatLine.debit : 0;
        const total = apLine ? apLine.credit : (invAmt + vatAmt);
        const words = tafqeetArabic(total);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">فاتورة مشتريات بضاعة (Purchase Invoice)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">طريقة السداد:</span>
              <span class="font-bold text-slate-800">آجل (حساب الموردين AP)</span>
            </div>
            ${renderInspectableRow('قيمة البضاعة المشتراة', invAmt, '1104', 'debit', 'إثبات إضافة المخزون السلعي بتكلفة الشراء قبل الضريبة كأصل متداول مدين وفق معيار المحاسبة المصري (2).', 'text-slate-800')}
            ${renderInspectableRow('ضريبة القيمة المضافة مدخلات (14%)', vatAmt, '1106', 'debit', 'ضريبة مدخلات قابلة للخصم والمقاصة مع ضريبة المخرجات وفقاً للمادة (22) من قانون الضريبة على القيمة المضافة رقم 67 لسنة 2016.', 'text-emerald-700')}
            <div class="border-t border-slate-200 pt-1">
              ${renderInspectableRow('الإجمالي المستحق للمورد', total, '2101', 'credit', 'إثبات الالتزام المالي المستحق للموردين بالجانب الدائن حتى يتم السداد الفعلي.', 'text-blue-900 font-extrabold')}
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">أصل الفاتورة مستلم ومقيد بالسجلات المخزنية</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Sale' || trx.type === 'Cash Sale') {
        const arLine = trx.lines.find(l => l.accountCode === '1103');
        const cashLine = trx.lines.find(l => l.accountCode === '1101' || l.accountCode === '1102');
        const revLine = trx.lines.find(l => l.accountCode === '4101');
        const vatLine = trx.lines.find(l => l.accountCode === '2102');
        
        const revAmt = revLine ? revLine.credit : 0;
        const vatAmt = vatLine ? vatLine.credit : 0;
        const total = (arLine ? arLine.debit : 0) || (cashLine ? cashLine.debit : 0) || (revAmt + vatAmt);
        const words = tafqeetArabic(total);
        const isCash = trx.type === 'Cash Sale';

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">${isCash ? 'فاتورة مبيعات نقدية (Cash Sales Invoice)' : 'فاتورة مبيعات ضريبية آجلة (Tax Sales Invoice)'}</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">طريقة البيع:</span>
              <span class="font-bold ${isCash ? 'text-emerald-700' : 'text-blue-800'}">${isCash ? 'نقداً / تحويل بنكي فوري' : 'آجل (حساب العملاء AR)'}</span>
            </div>
            ${renderInspectableRow('قيمة المبيعات الخاضعة للضريبة', revAmt, '4101', 'credit', 'إثبات تحقق إيراد المبيعات بالجانب الدائن وفق معيار المحاسبة المصري (48) - الإيراد من العقود مع العملاء.', 'text-slate-800')}
            ${renderInspectableRow('ضريبة القيمة المضافة مخرجات (14%)', vatAmt, '2102', 'credit', 'ضريبة مبيعات محصلة لحساب مصلحة الضرائب المصرية تلتزم المنشأة بتوريدها بنموذج 10 شهرياً (التزام دائن).', 'text-purple-700')}
            <div class="border-t border-slate-200 pt-1">
              ${renderInspectableRow(isCash ? 'المحصل بالخزينة/البنك' : 'المستحق على العميل (مدين)', total, isCash ? (cashLine ? cashLine.accountCode : '1101') : '1103', 'debit', isCash ? 'زيادة في النقدية كأصل متداول مدين.' : 'إثبات مديونية العميل بالجانب المدين حتى التحصيل.', 'text-blue-900 font-extrabold')}
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">أصل الفاتورة للعميل - صالحة للإقرار الضريبي</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Payroll') {
        const grossLine = trx.lines.find(l => l.accountCode === '5201');
        const taxLine = trx.lines.find(l => l.accountCode === '2105');
        const socLine = trx.lines.find(l => l.accountCode === '2106');
        const netLine = trx.lines.find(l => l.accountCode === '1102' || l.accountCode === '1101');
        
        const grossAmt = grossLine ? grossLine.debit : 0;
        const taxAmt = taxLine ? taxLine.credit : 0;
        const socAmt = socLine ? socLine.credit : 0;
        const netAmt = netLine ? netLine.credit : (grossAmt - taxAmt - socAmt);
        const words = tafqeetArabic(netAmt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">كشف مسير رواتب الشهر (Payroll Sheet)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
            ${renderInspectableRow('إجمالي الرواتب والأجور المستحقة', grossAmt, '5201', 'debit', 'تحميل الفترة المالية بتكلفة الرواتب التشغيلية والإدارية وفق مبدأ الاستحقاق (مصروف مدين).', 'text-slate-900')}
            ${renderInspectableRow('استقطاع ضريبة كسب العمل (5%)', taxAmt, '2105', 'credit', 'ضريبة مستقطعة من منبع المرتبات واجبة التوريد لمأمورية الضرائب المختصة نموذج 4 كسب عمل (التزام دائن).', 'text-amber-700')}
            ${renderInspectableRow('استقطاع التأمينات الاجتماعية (11%)', socAmt, '2106', 'credit', 'حصة العامل والمنشأة المستقطعة لصالح الهيئة القومية للتأمين الاجتماعي (التزام دائن).', 'text-amber-700')}
            <div class="border-t border-slate-200 pt-1">
              ${renderInspectableRow('صافي الرواتب المحولة للبنوك', netAmt, '1102', 'credit', 'نقص في الرصيد البنكي بالجانب الدائن نتيجة التحويل المصرفي لبطاقات الموظفين.', 'text-emerald-800 font-extrabold')}
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">معتمد من إدارة الموارد البشرية والشؤون المالية</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Bank Loan') {
        const loanLine = trx.lines.find(l => l.accountCode === '2201');
        const bankLine = trx.lines.find(l => l.accountCode === '1102');
        const amt = bankLine ? bankLine.debit : (loanLine ? loanLine.credit : 0);
        const words = tafqeetArabic(amt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">إشعار إضافة وتسهيل ائتماني بنكي</h2>
              <p class="text-[10px] text-slate-500">عقد قرض وتمويل طويل الأجل (Bank Loan Facility)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">الطرف المستفيد:</span>
              <strong class="text-slate-900">${compName}</strong>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">نوع التمويل:</span>
              <span class="font-bold text-blue-900">قرض بنكي لأجل (التزامات طويلة الأجل)</span>
            </div>
            <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
              <span>مبلغ التمويل المودع بالحساب الجاري:</span>
              <span class="font-mono text-emerald-800 text-base">${amt.toLocaleString()} ج.م</span>
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">تم إيداع كامل القيمة في الحساب الجاري لدى البنك</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Sales Return') {
        const retLine = trx.lines.find(l => l.accountCode === '4105');
        const vatLine = trx.lines.find(l => l.accountCode === '2102');
        const arLine = trx.lines.find(l => l.accountCode === '1103');
        
        const retAmt = retLine ? retLine.debit : 0;
        const vatAmt = vatLine ? vatLine.debit : 0;
        const total = arLine ? arLine.credit : (retAmt + vatAmt);
        const words = tafqeetArabic(total);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إشعار دائن - مردودات مبيعات (Credit Note)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">بيان المعاملة:</span>
              <span class="font-bold text-slate-800">إرجاع بضاعة مبيعات من العميل وتخفيض رصيده</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">قيمة المردودات (مبيعات):</span>
              <span class="font-mono font-bold text-slate-800">${retAmt.toLocaleString()} ج.م</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">عكس ضريبة القيمة المضافة مخرجات (14%):</span>
              <span class="font-mono font-bold text-purple-700">${vatAmt.toLocaleString()} ج.م</span>
            </div>
            <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
              <span>إجمالي قيمة الإشعار الدائن:</span>
              <span class="font-mono text-amber-900 text-base">${total.toLocaleString()} ج.م</span>
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">إشعار دائن صادر لتسوية حساب العميل في السجلات</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Purchase Return') {
        const apLine = trx.lines.find(l => l.accountCode === '2101');
        const vatLine = trx.lines.find(l => l.accountCode === '1106');
        const invLine = trx.lines.find(l => l.accountCode === '1104');
        
        const total = apLine ? apLine.debit : 0;
        const vatAmt = vatLine ? vatLine.credit : 0;
        const invAmt = invLine ? invLine.credit : (total - vatAmt);
        const words = tafqeetArabic(total);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إشعار مدين - مردودات مشتريات (Debit Note)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">بيان المعاملة:</span>
              <span class="font-bold text-slate-800">إرجاع بضاعة تالفة للمورد وتخفيض رصيده</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">تكلفة البضاعة المرتجعة:</span>
              <span class="font-mono font-bold text-slate-800">${invAmt.toLocaleString()} ج.م</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">عكس ضريبة القيمة المضافة مدخلات (14%):</span>
              <span class="font-mono font-bold text-emerald-700">${vatAmt.toLocaleString()} ج.م</span>
            </div>
            <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
              <span>إجمالي قيمة الخصم من المورد:</span>
              <span class="font-mono text-blue-900 text-base">${total.toLocaleString()} ج.م</span>
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">إشعار مدين مرسل للمورد لمطابقة كشف الحساب</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Prepayment') {
        const prepLine = trx.lines.find(l => l.accountCode === '1105');
        const bankLine = trx.lines.find(l => l.accountCode === '1102' || l.accountCode === '1101');
        const amt = prepLine ? prepLine.debit : (bankLine ? bankLine.credit : 0);
        const words = tafqeetArabic(amt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إيصال سداد مصروفات مقدمة (Prepaid Expenses Voucher)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">نوع المصروف المقدم:</span>
              <span class="font-bold text-slate-800">${prepLine ? prepLine.description : 'إيجار / تأمين مدفوع مقدماً'}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">التصنيف المحاسبي:</span>
              <span class="font-medium text-slate-600">أصل متداول (يستهلك على الفترات المستفيدة)</span>
            </div>
            <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
              <span>المبلغ المدفوع بالبنك:</span>
              <span class="font-mono text-slate-900 text-base">${amt.toLocaleString()} ج.م</span>
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">أصل العقد وسند السداد مرفقان بملف العقود الدورية</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Collection') {
        const cashLine = trx.lines.find(l => l.accountCode === '1102' || l.accountCode === '1101');
        const arLine = trx.lines.find(l => l.accountCode === '1103');
        const amt = cashLine ? cashLine.debit : 0;
        const words = tafqeetArabic(amt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إيصال استلام نقدي / شيك بنكي (Receipt Voucher)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">استلمنا من السادة:</span>
              <span class="font-medium text-slate-800">حساب العملاء المعتمد</span>
            </div>
            ${renderInspectableRow('المتحصل بالخزينة/البنك', amt, cashLine ? cashLine.accountCode : '1102', 'debit', 'إثبات التدفق النقدي الوارد بالصندوق أو البنك كأصل متداول مدين.', 'text-emerald-800 font-bold')}
            <div class="border-t border-slate-200 pt-1">
              ${renderInspectableRow('تخفيض مديونية العميل', amt, '1103', 'credit', 'إنقاص رصيد العملاء بالجانب الدائن نتيجة التحصيل والسداد.', 'text-slate-900 font-bold')}
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">إشعار إيداع بنكي صادر ومعتمد من البنك</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Payment') {
        const bankLine = trx.lines.find(l => l.accountCode === '1102' || l.accountCode === '1101');
        const apLine = trx.lines.find(l => l.accountCode === '2101');
        const amt = bankLine ? bankLine.credit : 0;
        const words = tafqeetArabic(amt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إذن صرف شيك / تحويل بنكي (Payment Voucher)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">يصرف لأمر السادة:</span>
              <span class="font-medium text-slate-800">حساب الموردين المعتمد</span>
            </div>
            ${renderInspectableRow('تخفيض مستحقات الموردين', amt, '2101', 'debit', 'إنقاص الالتزام المالي للمورد بالجانب المدين نتيجة السداد.', 'text-blue-900 font-bold')}
            <div class="border-t border-slate-200 pt-1">
              ${renderInspectableRow('المدفوع من البنك/الخزينة', amt, bankLine ? bankLine.accountCode : '1102', 'credit', 'نقص في الأصل النقدي بالجانب الدائن نتيجة إصدار شيك أو تحويل بنكي.', 'text-rose-800 font-bold')}
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">أصل الشيك / إشعار الخصم الإلكتروني مرفق</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'COGS' || trx.type === 'Cash Sale COGS') {
        const amt = trx.lines.find(l => l.accountCode === '5101')?.debit || 0;
        const words = tafqeetArabic(amt);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إذن صرف بضاعة من المخازن (Store Issue Order)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs mb-3">
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">الغرض من الصرف:</span>
              <span class="font-medium text-slate-800">تسليم مبيعات بضاعة للعملاء بموجب الفاتورة</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-200">
              <span class="text-slate-500">حالة المخزون:</span>
              <span class="font-medium text-slate-800">صرف بضاعة وخروجها من المستودع</span>
            </div>
            <div class="flex justify-between py-2 text-sm font-extrabold text-slate-900 bg-white p-2 rounded-lg border border-slate-200">
              <span>التكلفة الدفترية للبضاعة المنصرفة:</span>
              <span class="font-mono text-slate-900 text-base">${amt.toLocaleString()} ج.م</span>
            </div>
            <div class="text-[11px] text-slate-500 text-center font-serif">
              فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
            </div>
          </div>
          <p class="text-[10px] text-slate-400 text-center">تم فحص ومطابقة الصرف بمعرفة أمين المستودع</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Opening Balance') {
        const debits = trx.lines.filter(l => l.debit > 0);
        const credits = trx.lines.filter(l => l.credit > 0);
        const totalDebit = debits.reduce((s,l)=>s+l.debit, 0);
        const totalCredit = credits.reduce((s,l)=>s+l.credit, 0);
        const words = tafqeetArabic(totalDebit);

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">محضر جرد وإثبات الأرصدة الافتتاحية (Opening Balances)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-blue-900 text-white font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-xs text-emerald-950 font-bold mb-3 flex items-center gap-2 shadow-2xs">
            <span class="material-symbols-outlined text-emerald-700 text-xl">verified</span>
            <div>
              <div class="text-xs">تم إثبات وترحيل القيد الافتتاحي آلياً بنجاح ✓</div>
              <div class="text-[10px] font-normal text-emerald-800 mt-0.5">تم ترحيل الأرصدة الافتتاحية مباشرة إلى دفتر الأستاذ العام تيسيراً للتدريب على الهاتف.</div>
            </div>
          </div>

          <div class="p-3 bg-blue-50/80 border border-blue-200 rounded-xl text-xs mb-3 text-blue-950 leading-relaxed">
            <strong>مذكرة محاسبية رقم 1:</strong> بمناسبة انطلاق السنة المالية 2026، اعتمدت إدارة الشركة نتائج الجرد وإثبات المركز المالي الافتتاحي على النحو الآتي:
          </div>

          <div class="space-y-3 mb-3">
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div class="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>1. أصول المنشأة الافتتاحية (جانب مدين)</span>
                <span class="font-mono text-blue-900 font-black">${totalDebit.toLocaleString()} ج.م</span>
              </div>
              <div class="divide-y divide-slate-100 p-1">
                ${debits.map(l => `
                  <div class="flex justify-between p-1.5">
                    <span class="text-slate-700 font-medium">${l.accountCode} - ${ACCOUNTS[l.accountCode] || l.accountName}</span>
                    <span class="font-mono font-bold text-slate-900">${l.debit.toLocaleString()} ج.م</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div class="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                <span>2. الالتزامات وحقوق الملكية الافتتاحية (جانب دائن)</span>
                <span class="font-mono text-purple-900 font-black">${totalCredit.toLocaleString()} ج.م</span>
              </div>
              <div class="divide-y divide-slate-100 p-1">
                ${credits.map(l => `
                  <div class="flex justify-between p-1.5">
                    <span class="text-slate-700 font-medium">${l.accountCode} - ${ACCOUNTS[l.accountCode] || l.accountName}</span>
                    <span class="font-mono font-bold text-slate-900">${l.credit.toLocaleString()} ج.م</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-600 font-serif border border-slate-200 mb-2">
            إجمالي المركز المالي الافتتاحي: <strong>${words}</strong> جنيهاً مصرياً لا غير.
          </div>
          <p class="text-[10px] text-emerald-700 font-bold text-center">✓ معتمد ومرحل آلياً في دفتر اليومية ودفتر الأستاذ العام</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else if (trx.type === 'Expense' || trx.type === 'Misc Expense') {
        const debits = trx.lines.filter(l => Number(l.debit) > 0);
        const credits = trx.lines.filter(l => Number(l.credit) > 0);
        const totalAmt = debits.reduce((s, l) => s + (Number(l.debit) || 0), 0);
        const words = tafqeetArabic(totalAmt);
        const desc = trx.desc || trx.title || 'سداد مصروفات تشغيلية وإدارية';

        const creditAccountNames = credits.map(c => {
            const accName = ACCOUNTS[c.accountCode] || c.accountName || c.accountCode;
            const amt = Number(c.credit).toLocaleString();
            return `${accName} بمبلغ (${amt} ج.م)`;
        }).join(' و ');

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">إذن صرف واعتماد مصروفات (Expense Payment Voucher)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <!-- بيان السند المحاسبي المعتمد -->
          <div class="bg-blue-50/80 p-3 rounded-xl border border-blue-200 mb-3 text-xs leading-relaxed text-blue-950 font-medium">
            <strong class="block font-bold text-blue-900 mb-1">بيان السند المحاسبي:</strong>
            ${desc}
          </div>

          <!-- تفاصيل بنود المصروفات المعتمدة -->
          <div class="space-y-2.5 mb-3">
            <div class="border border-slate-200 rounded-xl overflow-hidden text-xs shadow-2xs">
              <div class="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
                <span>بنود المصروفات المعتمدة للصرف (الطرف المدين)</span>
                <span class="font-mono text-blue-900 font-extrabold">${totalAmt.toLocaleString()} ج.م</span>
              </div>
              <div class="divide-y divide-slate-100 bg-white">
                ${debits.map(d => `
                  ${renderInspectableRow(ACCOUNTS[d.accountCode] || d.accountName || `حساب ${d.accountCode}`, d.debit, d.accountCode, 'debit', `إثبات تحميل الفترة المالية بمصروف (${ACCOUNTS[d.accountCode] || d.accountName}) كطرف مدين وفق مبدأ الاستحقاق.`, 'text-blue-900')}
                `).join('')}
              </div>
            </div>

            <!-- وسيلة وطريقة السداد -->
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div class="flex justify-between py-1 border-b border-slate-200">
                <span class="text-slate-500">طريقة السداد المعتمدة:</span>
                <strong class="text-slate-900">${creditAccountNames}</strong>
              </div>
              <div class="border-t border-slate-200 pt-1">
                ${credits.map(c => `
                  ${renderInspectableRow(ACCOUNTS[c.accountCode] || c.accountName || `حساب ${c.accountCode}`, c.credit, c.accountCode, 'credit', `إثبات سداد المصروف خصماً من (${ACCOUNTS[c.accountCode] || c.accountName}) كطرف دائن.`, 'text-rose-800')}
                `).join('')}
              </div>
              <div class="text-[11px] text-slate-500 text-center font-serif pt-1">
                فقط وقدره <strong>${words}</strong> جنيهاً مصرياً لا غير.
              </div>
            </div>
          </div>

          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">أصل الفواتير وإيصالات السداد الحكومية مرفقة ومعتمدة</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    } else {
        const debits = trx.lines.filter(l => Number(l.debit) > 0);
        const credits = trx.lines.filter(l => Number(l.credit) > 0);
        const totalAmt = debits.reduce((s,l)=>s+(Number(l.debit)||0), 0);
        const words = tafqeetArabic(totalAmt);
        const desc = trx.desc || trx.title || 'مذكرة تسوية إدارية معتمدة';

        docHtml = `
        <div class="w-full max-w-md bg-white p-5 rounded-2xl shadow-md border border-slate-200 text-right font-sans text-slate-800 relative">
          <div class="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">مذكرة داخلية / إشعار قيد تسوية (Internal Memo)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded font-mono">${trx.ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${trx.date}</p>
            </div>
          </div>

          <div class="bg-blue-50/80 p-3 rounded-xl border border-blue-200 mb-3 text-xs leading-relaxed text-blue-950 font-medium">
            <strong class="block font-bold text-blue-900 mb-1">بيان وتفاصيل المعاملة:</strong>
            ${desc}
          </div>

          <div class="border border-slate-200 rounded-xl overflow-hidden text-xs mb-3 shadow-2xs">
            <div class="bg-slate-100 p-2 font-bold text-slate-800 border-b border-slate-200 flex justify-between items-center">
              <span>بنود وأطراف العملية (الطرف المدين)</span>
              <span class="font-mono text-blue-900 font-extrabold">${totalAmt.toLocaleString()} ج.م</span>
            </div>
            <div class="divide-y divide-slate-100 bg-white">
              ${debits.map(d => `
                ${renderInspectableRow(ACCOUNTS[d.accountCode] || d.accountName || `حساب ${d.accountCode}`, d.debit, d.accountCode, 'debit', `توجيه محاسبي مدين للعملية وفق معايير المحاسبة المصرية.`, 'text-blue-900')}
              `).join('')}
            </div>
            <div class="p-2.5 bg-slate-50 border-t border-slate-200 text-xs space-y-1">
              <span class="text-slate-500 block mb-1">الطرف المقابل / طريقة السداد (الطرف الدائن): </span>
              ${credits.map(c => `
                ${renderInspectableRow(ACCOUNTS[c.accountCode] || c.accountName || `حساب ${c.accountCode}`, c.credit, c.accountCode, 'credit', `توجيه محاسبي دائن للعملية.`, 'text-rose-800')}
              `).join('')}
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-600 font-serif border border-slate-200 mb-2">
            المبلغ المعتمد بالمذكرة: <strong>${words}</strong> جنيهاً مصرياً لا غير.
          </div>
          <div id="doc-inspector-drawer" class="hidden mt-3 p-3.5 bg-gradient-to-br from-blue-50/90 to-indigo-50/90 border-2 border-blue-300 rounded-xl text-right animate-in fade-in duration-200"></div>
          <p class="text-[10px] text-slate-400 text-center">مذكرة إدارية معتمدة للتسجيل باليومية العامة</p>
          ${buildHintHtml(trx)}
        </div>
        `;
    }

    viewer.innerHTML = docHtml;
}

let formLines = [];
window.resetForm = function() {
    formLines = [
        { debit: 0, credit: 0, account: '' },
        { debit: 0, credit: 0, account: '' }
    ];
    renderForm();
    const feedback = document.getElementById('feedback-msg');
    if(feedback) feedback.innerHTML = '';
}

window.addLine = function() {
    formLines.push({ debit: 0, credit: 0, account: '' });
    renderForm();
}

function recalculateTotals() {
    let totalDebit = 0;
    let totalCredit = 0;

    formLines.forEach((line) => {
        totalDebit += (Number(line.debit) || 0);
        totalCredit += (Number(line.credit) || 0);
    });

    const debEl = document.getElementById('total-debit');
    const credEl = document.getElementById('total-credit');
    if (debEl) debEl.innerText = totalDebit.toLocaleString();
    if (credEl) credEl.innerText = totalCredit.toLocaleString();

    const totalsRow = document.getElementById('totals-row');
    if (totalsRow) {
        if (totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.01) {
            totalsRow.classList.remove('text-red-600');
            totalsRow.classList.add('text-emerald-700');
        } else {
            totalsRow.classList.remove('text-emerald-700');
            totalsRow.classList.add('text-red-600');
        }
    }
}

function renderForm() {
    const tbody = document.getElementById('journal-tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    formLines.forEach((line, index) => {
        const tr = document.createElement('tr');
        tr.className = "border-b border-slate-100 hover:bg-slate-50";

        let optionsHtml = '<option value="">-- اختر الحساب --</option>';
        for(let code in ACCOUNTS) {
            const sel = line.account === code ? 'selected' : '';
            optionsHtml += `<option value="${code}" ${sel}>${code} - ${ACCOUNTS[code]}</option>`;
        }

        tr.innerHTML = `
            <td class="p-2">
                <select onchange="handleAccountChange(${index}, this.value)" class="w-full text-xs sm:text-sm border rounded-lg p-2 min-h-[42px] bg-white border-slate-300 focus:outline-none focus:border-slate-800">
                    ${optionsHtml}
                </select>
            </td>
            <td class="p-2">
                <input type="number" step="any" oninput="handleDebitInput(${index}, this.value)" value="${line.debit || ''}" placeholder="0.00" class="w-full text-xs sm:text-sm text-center border rounded-lg p-2 min-h-[42px] border-slate-300 font-mono font-bold focus:outline-none focus:border-slate-800" />
            </td>
            <td class="p-2">
                <input type="number" step="any" oninput="handleCreditInput(${index}, this.value)" value="${line.credit || ''}" placeholder="0.00" class="w-full text-xs sm:text-sm text-center border rounded-lg p-2 min-h-[42px] border-slate-300 font-mono font-bold focus:outline-none focus:border-slate-800" />
            </td>
            <td class="p-2 text-center">
                ${formLines.length > 2 ? `<button onclick="removeLine(${index})" class="text-rose-500 hover:text-rose-700 w-9 h-9 inline-flex items-center justify-center rounded-lg hover:bg-rose-50 transition cursor-pointer" title="حذف السطر"><span class="material-symbols-outlined text-[18px]">delete</span></button>` : ''}
            </td>
        `;
        tbody.appendChild(tr);
    });

    recalculateTotals();
}

window.handleAccountChange = function(index, val) {
    if(formLines[index]) {
        formLines[index].account = val;
    }
}

window.handleDebitInput = function(index, val) {
    if(formLines[index]) {
        formLines[index].debit = Number(val) || 0;
        if(formLines[index].debit > 0) {
            formLines[index].credit = 0;
            const tr = document.getElementById('journal-tbody')?.children[index];
            if(tr) {
                const credInput = tr.children[2]?.querySelector('input');
                if(credInput && credInput.value !== '') credInput.value = '';
            }
        }
        recalculateTotals();
    }
}

window.handleCreditInput = function(index, val) {
    if(formLines[index]) {
        formLines[index].credit = Number(val) || 0;
        if(formLines[index].credit > 0) {
            formLines[index].debit = 0;
            const tr = document.getElementById('journal-tbody')?.children[index];
            if(tr) {
                const debInput = tr.children[1]?.querySelector('input');
                if(debInput && debInput.value !== '') debInput.value = '';
            }
        }
        recalculateTotals();
    }
}

window.removeLine = function(index) {
    if(formLines.length > 2) {
        formLines.splice(index, 1);
        renderForm();
    }
}

window.postEntry = function() {
    const feedback = document.getElementById('feedback-msg');
    if(!feedback) return;

    const totalDebit = formLines.reduce((s, l) => s + (Number(l.debit)||0), 0);
    const totalCredit = formLines.reduce((s, l) => s + (Number(l.credit)||0), 0);

    if (totalDebit === 0 && totalCredit === 0) {
        feedback.innerHTML = '<div class="text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-bold">الرجاء إدخال مبالغ القيد!</div>';
        return;
    }
    if (Math.abs(totalDebit - totalCredit) > 0.01) {
        feedback.innerHTML = `<div class="text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-bold">القيد غير متزن! إجمالي المدين (${totalDebit.toLocaleString()}) لا يساوي إجمالي الدائن (${totalCredit.toLocaleString()}).</div>`;
        return;
    }
    
    const usedAccounts = formLines.filter(l => (Number(l.debit) > 0 || Number(l.credit) > 0));
    if(usedAccounts.some(l => !l.account)) {
         feedback.innerHTML = '<div class="text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-bold">الرجاء اختيار الحساب لكل سطر تم إدخال مبلغ فيه.</div>';
         return;
    }

    // المعالجة المخصصة لمسودة قيد التسوية البنكية بعد مراجعة واعتماد الطالب
    const rawDraft = localStorage.getItem('acc_draft_journal_entry');
    if (rawDraft) {
        let draft = null;
        try { draft = JSON.parse(rawDraft); } catch(e) {}
        if (draft) {
            const entryId = 'TRX-' + String(studentJournal.length + 1).padStart(5, '0');
            const newJournalEntry = {
                id: entryId,
                date: draft.date || new Date().toISOString().split('T')[0],
                type: draft.title || 'تسوية بنكية',
                ref: draft.ref || 'RECON-ADJ',
                status: 'pending_posting',
                lines: usedAccounts.map((l, idx) => ({
                    lineId: entryId + '_' + idx,
                    accountCode: l.account,
                    accountName: ACCOUNTS[l.account] || 'حساب',
                    debit: Number(l.debit) || 0,
                    credit: Number(l.credit) || 0,
                    description: draft.desc || 'قيد تسوية بنكية',
                    posted: false
                }))
            };
            studentJournal.push(newJournalEntry);
            saveStudentState();

            // تحديث حالة العملية في كشف حساب البنك كـ متطابقة بعد التسجيل بالدفاتر
            if (draft.sourceId) {
                try {
                    const rawItems = localStorage.getItem('bank_statement_items');
                    if (rawItems) {
                        const items = JSON.parse(rawItems);
                        const it = items.find(i => i.id === draft.sourceId);
                        if (it) it.matched = true;
                        localStorage.setItem('bank_statement_items', JSON.stringify(items));
                    }
                } catch(e) {}
            }

            localStorage.removeItem('acc_draft_journal_entry');
            document.getElementById('draft-review-banner')?.remove();

            let successTitle = 'تم اعتماد وتسجيل قيد التسوية البنكية بنجاح! 💾';
            let returnLink = '../bank-recon/index.html';
            let returnText = 'العودة للتسوية البنكية لمشاهدة المطابقة';

            if (draft.sourceModule === 'CASH_COUNT') {
                successTitle = 'تم اعتماد وتسجيل قيد تسوية عجز/زيادة الخزينة بنجاح! 💾';
                returnLink = '../cash-count/index.html';
                returnText = 'العودة لمحاكي جرد الخزينة';
            } else if (draft.sourceModule === 'INVENTORY_COUNT') {
                successTitle = 'تم اعتماد وتسجيل قيد تسوية جرد المخزون بنجاح! 💾';
                returnLink = '../inventory-count/index.html';
                returnText = 'العودة لمحاكي جرد المخزون';
            } else if (draft.sourceModule === 'VAT_CLEARING') {
                successTitle = 'تم اعتماد وتسجيل قيد مقاصة وسداد ضريبة القيمة المضافة بنجاح! 💾';
                returnLink = '../tax-returns/index.html';
                returnText = 'العودة لمنظومة الإقرارات الضريبية';
            }

            feedback.innerHTML = `
              <div class="text-emerald-900 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 font-bold space-y-2 text-right">
                <div class="flex items-center gap-2 text-sm text-emerald-800">
                  <span class="material-symbols-outlined">verified</span>
                  <span>${successTitle} (رقم: ${entryId})</span>
                </div>
                <p class="text-xs font-normal text-slate-700 leading-relaxed">
                  تم تسجيل القيد بنجاح كـ "معلق بانتظار الترحيل". يمكنك ترحيل أطرافه للأستاذ أو العودة للمحاكي لمشاهدة اكتمال التسوية وتصفير الفروقات الدفترية.
                </p>
                <div class="pt-2 flex flex-wrap gap-2">
                  <a href="${returnLink}" class="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3.5 py-1.5 rounded-lg transition font-bold shadow-xs">
                    <span>${returnText}</span>
                    <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </a>
                  <a href="../ledger/index.html?trx=${entryId}" class="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-1.5 rounded-lg transition font-bold">
                    <span>ترحيل للأستاذ الآن</span>
                  </a>
                  <button type="button" onclick="resetForm()" class="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold cursor-pointer">
                    <span>تسجيل قيد آخر</span>
                  </button>
                </div>
              </div>
            `;
            renderPostedEntries();
            return;
        }
    }

    const pending = answerKey.filter(t => !studentJournal.find(j => j.id === t.id));

    // If no specific tasks were injected by Admin, allow free entry creation!
    if (answerKey.length === 0) {
        const entryId = 'TRX-' + String(studentJournal.length + 1).padStart(5, '0');
        const today = new Date().toISOString().split('T')[0];
        const newJournalEntry = {
            id: entryId,
            date: today,
            type: 'General',
            ref: 'REF-' + Math.floor(10000 + Math.random() * 90000),
            status: 'pending_posting',
            lines: usedAccounts.map((l, idx) => ({
                lineId: entryId + '_' + idx,
                accountCode: l.account,
                accountName: ACCOUNTS[l.account] || 'حساب',
                debit: Number(l.debit) || 0,
                credit: Number(l.credit) || 0,
                description: 'قيد يومية حر',
                posted: false
            }))
        };
        studentJournal.push(newJournalEntry);
        saveStudentState();
        feedback.innerHTML = `
          <div class="text-emerald-900 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 font-bold space-y-2">
            <div class="flex items-center gap-2 text-sm text-emerald-800">
              <span class="material-symbols-outlined">verified</span>
              <span>تم تسجيل القيد بنجاح في اليومية (رقم: ${entryId})!</span>
            </div>
            <p class="text-xs font-normal text-emerald-900">القيد محفوظ الآن كـ "معلق بانتظار الترحيل". يمكنك الانتقال لشاشة دفتر الأستاذ لترحيل أطرافه لحسابات T.</p>
            <div class="pt-2 flex gap-2">
              <a href="../ledger/index.html" class="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-1.5 rounded-lg transition font-bold">الانتقال للأستاذ والترحيل ➔</a>
              <button onclick="resetForm()" class="bg-white hover:bg-slate-100 text-slate-700 text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold">تسجيل قيد آخر</button>
            </div>
          </div>
        `;
        renderPostedEntries();
        return;
    }

    if (pending.length === 0) return;

    const currentTrx = pending[0];
    if (selectedTrxId !== currentTrx.id) {
        feedback.innerHTML = '<div class="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-bold">⚠️ التزم بالتسلسل الزمني: يجب تسجيل المعاملة المستحقة أولاً بالترتيب!</div>';
        return;
    }

    const requiredLines = currentTrx.lines.filter(l => l.debit > 0 || l.credit > 0);
    let isCorrect = true;
    let errorDesc = "";
    
    if (usedAccounts.length !== requiredLines.length) {
        isCorrect = false;
        const debitsCount = requiredLines.filter(l => Number(l.debit) > 0).length;
        const creditsCount = requiredLines.filter(l => Number(l.credit) > 0).length;
        const entryStyle = requiredLines.length > 2 
            ? `قيد مركب يتطلب (${requiredLines.length}) أسطر (${debitsCount} مدين و ${creditsCount} دائن)` 
            : `قيد بسيط يتطلب سطرين فقط`;
        errorDesc = `عدد أسطر القيد غير صحيحة (${usedAccounts.length} مدخلة مقابل ${requiredLines.length} مطلوبة). هذه المعاملة تمثل ${entryStyle}. تفقد بنود المستند وطريقة السداد.`;
    } else {
        for(let req of requiredLines) {
            const match = usedAccounts.find(l => l.account === req.accountCode && Math.abs(l.debit - req.debit) < 0.1 && Math.abs(l.credit - req.credit) < 0.1);
            if(!match) {
                isCorrect = false;
                errorDesc = "تأكد من مطابقة الحساب والمبلغ الصحيحين لكل سطر وفقاً للمستند المرفق وطريقة السداد أو التحصيل.";
                break;
            }
        }
    }

    if (!isCorrect) {
        taskErrorStates[currentTrx.id] = true;
        document.getElementById('form-hint-btn')?.classList.remove('hidden');

        feedback.innerHTML = `
            <div class="text-rose-900 p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-xs font-bold space-y-2">
                <div class="flex items-center gap-1.5 text-rose-700">
                    <span class="material-symbols-outlined text-[18px]">error</span>
                    <span>إجابة غير صحيحة ❌</span>
                </div>
                <p class="font-medium text-slate-700 leading-relaxed">${errorDesc}</p>
                <div class="pt-1 flex items-center gap-2">
                    <button type="button" onclick="requestAccountingHint()" class="inline-flex items-center gap-1.5 text-xs bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-300 font-bold transition cursor-pointer shadow-2xs">
                        <span>💡 طلب تلميح محاسبي للمساعدة في الحل</span>
                        <span class="material-symbols-outlined text-[15px]">help_outline</span>
                    </button>
                </div>
            </div>
        `;
        return;
    }

    const hadPriorError = !!taskErrorStates[currentTrx.id];
    delete taskErrorStates[currentTrx.id];
    delete taskHintRequested[currentTrx.id];
    document.getElementById('form-hint-btn')?.classList.add('hidden');

    try {
        if (typeof getCareerProfile === 'function') {
            const prof = getCareerProfile();
            if (!hadPriorError) {
                prof.firstAttemptCount = (prof.firstAttemptCount || 0) + 1;
            }
            saveCareerProfile(prof);
        }
    } catch(e) {}

    // Save as Pending Posting in Journal!
    const newJournalEntry = {
        id: currentTrx.id,
        date: currentTrx.date,
        type: currentTrx.type,
        ref: currentTrx.ref,
        status: 'pending_posting',
        lines: usedAccounts.map((l, idx) => ({
            lineId: currentTrx.id + '_' + idx,
            accountCode: l.account,
            accountName: ACCOUNTS[l.account],
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description: currentTrx.lines[0]?.description || 'قيد يومية',
            posted: false
        }))
    };

    studentJournal.push(newJournalEntry);
    saveStudentState();

    feedback.innerHTML = `
      <div class="text-emerald-900 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300 font-bold space-y-2">
        <div class="flex items-center gap-2 text-sm text-emerald-800">
          <span class="material-symbols-outlined">verified</span>
          <span>إجابة صحيحة ومطابقة! تم تسجيل القيد في دفتر اليومية بنجاح 💾</span>
        </div>
        <div class="text-xs font-normal text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-200 flex justify-between items-center">
          <span>الحالة الدفترية: <strong class="text-amber-700">⏳ معلق بانتظار الترحيل لدفتر الأستاذ</strong></span>
          <a href="../ledger/index.html?trx=${currentTrx.id}" class="bg-slate-900 hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 transition">
            ترحيل للأستاذ الآن <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </a>
        </div>
      </div>
    `;

    setTimeout(() => {
        renderPendingList();
        renderPostedEntries();
    }, 1200);
}


let journalSearchQuery = '';
let journalTypeFilter = 'ALL';
let journalStatusFilter = 'ALL';

window.filterJournalEntries = function() {
    const searchInput = document.getElementById('journal-search-input');
    const typeSelect = document.getElementById('journal-type-filter');
    const statusSelect = document.getElementById('journal-status-filter');

    journalSearchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';
    journalTypeFilter = typeSelect ? typeSelect.value : 'ALL';
    journalStatusFilter = statusSelect ? statusSelect.value : 'ALL';

    renderPostedEntries();
}

window.editJournalEntry = function(trxId) {
    const entryIdx = studentJournal.findIndex(t => t.id === trxId);
    if(entryIdx === -1) return;

    const entry = studentJournal[entryIdx];
    if(entry.status === 'posted') {
        alert('لا يمكن تعديل هذا القيد لأنه تم ترحيله بالفعل إلى دفتر الأستاذ! يمكنك إجراء قيد تسوية عكسي.');
        return;
    }

    if(confirm('هل تريد فتح القيد (' + entry.id + ') في نموذج التعديل؟ سيتم إعادته للنموذج لإعادة ضبطه.')) {
        selectedTrxId = entry.id;
        formLines = (entry.lines || []).map(l => ({
            debit: l.debit || 0,
            credit: l.credit || 0,
            account: l.accountCode
        }));

        studentJournal.splice(entryIdx, 1);
        saveStudentState();

        renderPendingList();
        renderPostedEntries();
        renderForm();

        window.scrollTo({ top: 0, behavior: 'smooth' });
        const feedback = document.getElementById('feedback-msg');
        if(feedback) feedback.innerHTML = '<div class="p-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl font-bold">تم فتح القيد في نموذج التعديل أعلاه. قم بتعديل الحسابات أو المبالغ ثم اضغط حفظ.</div>';
    }
}

window.deleteJournalEntry = function(trxId) {
    const entryIdx = studentJournal.findIndex(t => t.id === trxId);
    if(entryIdx === -1) return;

    const entry = studentJournal[entryIdx];
    if(entry.status === 'posted') {
        alert('لا يمكن حذف هذا القيد لأنه مرحل للأستاذ العام. يتطلب إجراء قيد عكسي.');
        return;
    }

    if(confirm('هل أنت متأكد من رغبتك في حذف هذا القيد المعلق؟ ستتم إعادة المستند إلى قائمة المهام المطلوبة.')) {
        studentJournal.splice(entryIdx, 1);
        saveStudentState();
        renderPendingList();
        renderPostedEntries();
    }
}


function renderPostedEntries() {
    const container = document.getElementById('posted-entries-list');
    const countEl = document.getElementById('posted-count');
    if(!container) return;

    if (countEl) countEl.innerText = studentJournal.length;

    let list = [...studentJournal].reverse();

    // Apply filters
    if (journalSearchQuery) {
        list = list.filter(t => 
            (t.id && t.id.toLowerCase().includes(journalSearchQuery)) ||
            (t.ref && t.ref.toLowerCase().includes(journalSearchQuery)) ||
            (t.lines && t.lines.some(l => 
                (l.accountName && l.accountName.toLowerCase().includes(journalSearchQuery)) ||
                (l.accountCode && l.accountCode.includes(journalSearchQuery)) ||
                (l.description && l.description.toLowerCase().includes(journalSearchQuery))
            ))
        );
    }

    if (journalTypeFilter !== 'ALL') {
        list = list.filter(t => t.type === journalTypeFilter);
    }

    if (journalStatusFilter !== 'ALL') {
        list = list.filter(t => t.status === journalStatusFilter);
    }

    if (list.length === 0) {
        container.innerHTML = '<div class="text-center py-10 text-slate-400 font-medium">لا توجد قيود تطابق معايير البحث والفلترة.</div>';
        return;
    }

    container.innerHTML = '';

    list.forEach((trx, idx) => {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-2xl border-2 border-slate-300 shadow-md text-right overflow-hidden mb-6 transition hover:border-slate-400 hover:shadow-lg';
        
        let totalDebit = 0;
        let totalCredit = 0;
        const linesHtml = (trx.lines || []).map((l, lineIdx) => {
            const deb = Number(l.debit) || 0;
            const cred = Number(l.credit) || 0;
            totalDebit += deb;
            totalCredit += cred;
            return `
            <tr class="${lineIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'} hover:bg-blue-50/40 transition">
              <td class="p-3 font-sans font-bold text-slate-800 text-xs border-b border-slate-200">
                <span class="inline-block w-2 h-2 rounded-full ${deb > 0 ? 'bg-blue-600' : 'bg-amber-600'} ml-1.5"></span>
                ${l.accountCode} - ${l.accountName || ACCOUNTS[l.accountCode] || 'حساب عام'}
                ${l.posted ? '<span class="mr-2 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">مرحل للأستاذ ✓</span>' : '<span class="mr-2 text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">غير مرحل ⏳</span>'}
              </td>
              <td class="p-3 text-center font-mono border-b border-slate-200 ${deb > 0 ? 'font-extrabold text-slate-900 bg-emerald-50/40' : 'text-slate-300'}">${deb > 0 ? deb.toLocaleString() : '-'}</td>
              <td class="p-3 text-center font-mono border-b border-slate-200 ${cred > 0 ? 'font-extrabold text-slate-900 bg-emerald-50/40' : 'text-slate-300'}">${cred > 0 ? cred.toLocaleString() : '-'}</td>
              <td class="p-3 font-sans text-slate-600 text-xs border-b border-slate-200">${l.description || '-'}</td>
            </tr>
            `;
        }).join('');

        const isFullyPosted = trx.status === 'posted';
        const isOpening = trx.type === 'Opening Balance' || trx.isAutoOpening;

        div.innerHTML = `
          <div class="bg-slate-900 text-white px-4 py-3 flex justify-between items-center border-b-2 border-slate-700">
            <div class="flex items-center gap-3">
              <span class="bg-slate-800 text-white font-mono font-black text-xs px-3 py-1 rounded-lg border border-slate-600">${trx.id}</span>
              <span class="font-bold text-sm text-slate-100">${trx.ref || ''}</span>
              <span class="text-xs bg-slate-800 text-slate-300 font-bold px-2.5 py-0.5 rounded-full border border-slate-700 flex items-center gap-1">
                ${getDocumentName(trx.type)}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span class="text-slate-300 font-mono flex items-center gap-1 ml-2">
                <span class="material-symbols-outlined text-[15px] text-slate-400">calendar_today</span>
                ${trx.date}
              </span>
              ${isOpening
                ? '<span class="bg-emerald-900/90 text-emerald-200 font-bold px-2.5 py-1 rounded-md text-[11px] border border-emerald-600 flex items-center gap-1 shadow-2xs"><span class="material-symbols-outlined text-[14px]">verified</span> رصيد افتتاحي معتمد ومرحل آلياً</span>'
                : (isFullyPosted 
                  ? '<span class="bg-emerald-950 text-emerald-300 font-bold px-2.5 py-1 rounded-md text-[11px] border border-emerald-800 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">done_all</span> مرحل بالكامل</span>'
                  : `
                    <a href="../ledger/index.html?trx=${trx.id}" class="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-md text-[11px] flex items-center gap-1 transition shadow-xs">
                      <span class="material-symbols-outlined text-[14px]">drive_file_move</span> ترحيل للأستاذ
                    </a>
                    <button type="button" onclick="editJournalEntry('${trx.id}')" class="bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-0.5" title="تعديل القيد">
                      <span class="material-symbols-outlined text-[13px]">edit</span> تعديل
                    </button>
                    <button type="button" onclick="deleteJournalEntry('${trx.id}')" class="bg-slate-800 hover:bg-rose-900 text-rose-300 px-2 py-1 rounded-md text-[11px] font-bold transition flex items-center gap-0.5" title="حذف القيد المعلق">
                      <span class="material-symbols-outlined text-[13px]">delete</span>
                    </button>
                  `
                )
              }
            </div>
          </div>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-right text-xs border-collapse min-w-[540px]">
              <thead class="bg-slate-100 text-slate-700 font-black border-b-2 border-slate-300">
                <tr>
                  <th class="p-3 w-1/3">أطراف القيد (الحساب)</th>
                  <th class="p-3 text-center w-32 border-x border-slate-200">مدين (ج.م)</th>
                  <th class="p-3 text-center w-32 border-x border-slate-200">دائن (ج.م)</th>
                  <th class="p-3">شرح وبيان القيد المحاسبي</th>
                </tr>
              </thead>
              <tbody>
                ${linesHtml}
              </tbody>
              <tfoot class="border-t-2 border-slate-300 font-bold text-xs bg-slate-50 text-slate-800">
                <tr>
                  <td class="p-3 font-sans font-black flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-slate-600 text-base">balance</span>
                    إجمالي القيد:
                  </td>
                  <td class="p-3 text-center font-mono font-black text-sm text-slate-900 border-x border-slate-200">${totalDebit.toLocaleString()}</td>
                  <td class="p-3 text-center font-mono font-black text-sm text-slate-900 border-x border-slate-200">${totalCredit.toLocaleString()}</td>
                  <td class="p-3 text-slate-500 font-medium text-[11px]">${isFullyPosted ? 'مرحل ومعتمد دفترياً' : 'معلق بانتظار الترحيل اليدوي للأستاذ'}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        `;
        container.appendChild(div);

        if (idx < list.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'flex items-center my-5 px-4';
            sep.innerHTML = `
              <div class="flex-1 border-t-2 border-dashed border-slate-300"></div>
              <span class="mx-4 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-300 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
                <span class="material-symbols-outlined text-[16px] text-slate-600">receipt_long</span>
                فاصل بين القيود المحاسبية
              </span>
              <div class="flex-1 border-t-2 border-dashed border-slate-300"></div>
            `;
            container.appendChild(sep);
        }
    });
}

window.resetSim = function() {
    if (typeof window.clearAllSimulationData === 'function') {
        window.clearAllSimulationData(true);
    } else {
        localStorage.clear();
        location.reload();
    }
};

window.initWorkspace = initWorkspace;
window.selectTask = selectTask;
window.recalculateTotals = recalculateTotals;
window.renderForm = renderForm;
window.renderPendingList = renderPendingList;
