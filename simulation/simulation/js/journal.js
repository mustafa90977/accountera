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
            div.className = 'p-3.5 bg-emerald-50/70 border-b border-emerald-100 border-r-4 border-r-emerald-600 cursor-pointer flex items-center justify-between transition-all duration-150 hover:bg-emerald-50';
            div.innerHTML = `
                <div class="min-w-0 flex-1 pl-2">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                        <span class="font-bold text-sm text-slate-900 font-mono tracking-tight">${trx.ref}</span>
                        <span class="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">المستحقة حالياً ⏳</span>
                    </div>
                    <div class="text-xs text-slate-700 font-medium mt-1 truncate">${getDocumentName(trx.type)}</div>
                </div>
                <div class="text-left flex-shrink-0">
                    <div class="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">${trx.date}</div>
                    <div class="text-[11px] font-mono font-extrabold text-emerald-800 mt-0.5">${Number(trx.amount || (trx.docData && trx.docData.totalAmount) || (Array.isArray(trx.lines) ? Math.max(...trx.lines.map(l => Number(l.debit) || 0)) : 0)).toLocaleString()} ج.م</div>
                </div>
            `;
            div.onclick = () => selectTask(trx);
        } else {
            div.className = 'p-3 border-b border-slate-100 bg-white opacity-60 cursor-not-allowed flex items-center justify-between transition hover:opacity-80';
            div.innerHTML = `
                <div class="min-w-0 flex-1 pl-2">
                    <div class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-slate-400 text-[15px]">lock</span>
                        <span class="font-bold text-sm text-slate-500 font-mono">${trx.ref}</span>
                        <span class="text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">مقفلة 🔒</span>
                    </div>
                    <div class="text-xs text-slate-400 font-medium mt-0.5 truncate">${getDocumentName(trx.type)}</div>
                </div>
                <div class="text-left flex-shrink-0">
                    <div class="text-xs font-mono text-slate-400">${trx.date}</div>
                </div>
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

    const reqLines = trx.requiredLinesCount || (trx.lines ? trx.lines.length : 2);
    const isCompound = reqLines > 2;

    const entryTypeTitle = isCompound 
      ? `قيد مركب (${reqLines} أسطر)`
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
                <div>• حدد الحسابات المتأثرة بالمعاملة وفق طبيعتها (أصل / التزام / إيراد / مصروف).</div>
                <div>• تحقق من وسيلة السداد أو التحصيل (نقداً بالخزينة، تحويل بنكي، أو على الحساب).</div>
                <div>• تأكد من توازن إجمالي المدين والدائن في أسطر القيد.</div>
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
                        <span class="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">${reqLines} أسطر</span>
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
// Realistic Business Document Viewer (Sanitized - Zero Answer Leaks)
// =========================================================================

function renderDocRow(label, amount, colorClass = 'text-slate-800', isTotal = false) {
    const bg = isTotal ? 'bg-slate-100/70 border-t border-slate-200 py-2.5 px-3 rounded-lg font-bold' : 'py-2 px-3 hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0';
    return `
      <div class="flex justify-between items-center ${bg}">
        <span class="text-slate-600 font-medium text-xs">${label}:</span>
        <span class="font-mono font-bold text-xs ${colorClass} tracking-tight">${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="text-[10px] text-slate-500 font-sans">ج.م</span></span>
      </div>
    `;
}

function renderInspectableRow(label, amount, code, side, rationale, colorClass = 'text-slate-800') {
    return renderDocRow(label, amount, colorClass);
}

window.inspectDocumentFigure = function() {};
window.autofillJournalLine = function() {};

// =========================================================================
// Realistic Business Document & 3-Way Matching Engine (HTML Dossier Model)
// =========================================================================

function escapeHtml(s) {
    return String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function generateDocItems(trx, subtotal) {
    if (trx.docData && Array.isArray(trx.docData.items) && trx.docData.items.length > 0) {
        return trx.docData.items;
    }
    const amt = Number(subtotal) || Number(trx.amount) || 10000;
    if (amt >= 50000) {
        const p1 = Math.round(amt * 0.6 * 100) / 100;
        const p2 = Math.round((amt - p1) * 100) / 100;
        return [
            { num: 1, desc: 'أجهزة حاسوب مكتبية وشاشات رقمية احترافية', unit: 'جهاز', qty: 10, unitPrice: p1 / 10, total: p1 },
            { num: 2, desc: 'خوادم ومعدات شبكات سحابية ملحقة', unit: 'وحدة', qty: 2, unitPrice: p2 / 2, total: p2 }
        ];
    } else if (amt >= 10000) {
        const p1 = Math.round(amt * 0.7 * 100) / 100;
        const p2 = Math.round((amt - p1) * 100) / 100;
        return [
            { num: 1, desc: 'بضاعة تجارية وأجهزة إلكترونية معتمدة', unit: 'وحدة', qty: 10, unitPrice: p1 / 10, total: p1 },
            { num: 2, desc: 'طابعات ليزر مكتبية ومستلزمات تشغيل', unit: 'طابعة', qty: 2, unitPrice: p2 / 2, total: p2 }
        ];
    } else {
        return [
            { num: 1, desc: 'بضاعة ومستلزمات تجارية عامة', unit: 'وحدة', qty: 1, unitPrice: amt, total: amt }
        ];
    }
}

function renderRealisticPaper(d) {
    let h = `<article class="paper">
      <header class="p-head">
        <div class="p-org">
          <b>${escapeHtml(d.org?.name || 'شركة معتمدة')}</b>
          <small>${escapeHtml(d.org?.sub || 'القاهرة — س.ت 104920 — ب.ض 542-891-304')}</small>
        </div>
        <div class="p-title">
          <h2>${escapeHtml(d.title)}</h2>
          <span>${escapeHtml(d.enTitle || '')}</span>
        </div>
        <div class="p-serial">
          <small>الرقم المسلسل</small>
          <b>${escapeHtml(d.serial)}</b>
        </div>
      </header>`;

    if (d.meta && d.meta.length) {
        h += `<div class="p-meta">` + d.meta.map(m => `
          <div class="fld">
            <span>${escapeHtml(m[0])}:</span>
            <b>${escapeHtml(m[1])}</b>
          </div>`).join('') + `</div>`;
    }

    if (d.parties && d.parties.length) {
        h += `<div class="p-parties">` + d.parties.map(p => `
          <div class="party">
            <h4>${escapeHtml(p[0])}</h4>
            <p class="nm">${escapeHtml(p[1])}</p>
            ${(p[2] || []).map(l => `<p class="text-slate-500 text-[11px]">${escapeHtml(l)}</p>`).join('')}
          </div>`).join('') + `</div>`;
    }

    if (d.table) {
        const t = d.table;
        const num = t.num || [];
        h += `<div class="overflow-x-auto"><table class="pt"><thead><tr>` +
            t.cols.map(c => `<th>${escapeHtml(c)}</th>`).join('') + `</tr></thead><tbody>`;
        t.rows.forEach((r, ri) => {
            const isLast = t.totalRow && ri === t.rows.length - 1;
            h += `<tr${isLast ? ' class="tot"' : ''}>` +
                r.map((v, i) => `<td class="${num.includes(i) ? 'n' : (i === 0 ? 'c' : '')}">${typeof v === 'number' ? v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : escapeHtml(v)}</td>`).join('') +
                `</tr>`;
        });
        h += `</tbody></table></div>`;
    }

    if (d.totals && d.totals.length) {
        h += `<div class="totals">` + d.totals.map(t => `
          <div class="${t[2] || ''}">
            <span>${escapeHtml(t[0])}:</span>
            <b>${typeof t[1] === 'number' ? t[1].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : escapeHtml(t[1])} ج.م</b>
          </div>`).join('') + `</div>`;
    }

    if (d.words) {
        h += `<p class="words"><span>المبلغ كتابةً:</span> <b>${escapeHtml(d.words)}</b></p>`;
    }

    if (d.extraSummaryHtml) {
        h += `<div class="my-2.5 bg-slate-50 rounded-xl p-2 border border-slate-200 space-y-1">${d.extraSummaryHtml}</div>`;
    }

    if (d.notes && d.notes.length) {
        h += `<div class="notes space-y-1 mt-2">` + d.notes.map(n => `
          <p class="text-[11px] text-slate-700 bg-slate-50 p-2 rounded border border-slate-200">
            <b class="text-slate-900">${escapeHtml(n[0])}: </b>${escapeHtml(n[1])}
          </p>`).join('') + `</div>`;
    }

    if (d.terms && d.terms.length) {
        h += `<ul class="terms">` + d.terms.map(t => `<li>${escapeHtml(t)}</li>`).join('') + `</ul>`;
    }

    if (d.sigs && d.sigs.length) {
        h += `<div class="sigs">` + d.sigs.map(s => `
          <div class="sig">
            <i></i>
            <span>${escapeHtml(s)}</span>
          </div>`).join('') + `</div>`;
    }

    h += `<footer class="p-foot">
      <span>مستند تدريبي معتمد — منظومة المحاكاة</span>
      <span>${escapeHtml(d.enTitle || 'Accounting Document')}</span>
    </footer></article>`;

    return h;
}

function renderRealisticCheque(d) {
    return `
    <article class="paper cq">
      <div class="cheque">
        <div class="ck-top">
          <div class="ck-bank">
            <b>${escapeHtml(d.bank || 'البنك الأهلي المصري')}</b>
            <small>${escapeHtml(d.account || 'حساب جاري رقم: 010-4492-8819')}</small>
          </div>
          <div class="ck-no">
            شيك مصرفي رقم <b>${escapeHtml(d.serial || '000231')}</b>
          </div>
        </div>
        <div class="ck-row">
          <span>التاريخ:</span>
          <b>${escapeHtml(d.date || '2026-01-15')}</b>
        </div>
        <div class="ck-row">
          <span>ادفعوا لأمر:</span>
          <b class="text-blue-900 font-extrabold">${escapeHtml(d.payee)}</b>
        </div>
        <div class="ck-row">
          <span>مبلغ وقدره:</span>
          <b class="font-serif">${escapeHtml(d.words)}</b>
        </div>
        <div class="ck-row">
          <span>البيان والغرض:</span>
          <b>${escapeHtml(d.memo || 'سداد مستحقات بموجب الفاتورة الرسمية')}</b>
        </div>
        <div class="ck-foot">
          <div class="ck-amount">
            ${Number(d.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م
          </div>
          <div class="ck-sign">
            توقيع الساحب المفوض — ${escapeHtml(d.drawer || 'إدارة الحسابات')}
          </div>
        </div>
      </div>
      <footer class="p-foot">
        <span>شيك بنكي رسمي قابل للصرف</span>
        <span>Commercial Bank Cheque</span>
      </footer>
    </article>`;
}

window.activeDocSubTab = window.activeDocSubTab || {};

window.setDocSubTab = function(trxId, subTabId) {
    window.activeDocSubTab[trxId] = subTabId;
    const trx = (typeof selectedTaskObject === 'function') ? selectedTaskObject() : null;
    if (trx) {
        renderDocument(trx);
    }
};

window.openDocInspectionModal = function(titleHtml, bodyHtml) {
    const modal = document.getElementById('doc-inspection-modal');
    const titleEl = document.getElementById('doc-modal-title');
    const bodyEl = document.getElementById('doc-modal-body');
    if (!modal) return;
    if (titleEl) titleEl.innerHTML = titleHtml || 'فحص المستند المؤيد والمطابقة التفصيلية';
    if (bodyEl) bodyEl.innerHTML = bodyHtml || '';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

window.closeDocInspectionModal = function(e) {
    if (e && e.target && e.target.id !== 'doc-inspection-modal' && !e.target.closest('button[onclick*="closeDocInspectionModal"]')) {
        return;
    }
    const modal = document.getElementById('doc-inspection-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = '';
};

function renderDocument(trx) {
    const viewer = document.getElementById('document-viewer');
    if (!viewer || !trx) return;

    const compName = getCompanyName();
    const doc = trx.docData || {};
    let total = (doc.totalAmount != null && Number(doc.totalAmount) > 0)
        ? Number(doc.totalAmount)
        : (Number(trx.amount) || 0);
    if (total === 0 && Array.isArray(trx.lines) && trx.lines.length > 0) {
        total = Math.max(...trx.lines.map(l => Number(l.debit) || 0));
    }
    let subtotal = (doc.subtotal != null && Number(doc.subtotal) > 0) ? Number(doc.subtotal) : total;
    let vatAmt = Number(doc.vatAmount) || 0;
    if (subtotal === 0 && total > 0) {
        subtotal = vatAmt > 0 ? (total - vatAmt) : total;
    }
    const date = doc.date || trx.date || '2026-01-15';
    const ref = doc.ref || trx.ref || `INV-${1000 + (trx.num || 1)}`;
    let partyName = doc.partyName || trx.partyName || '';
    if (!partyName) {
        if (trx.type === 'Purchase') partyName = 'شركة الدلتا للتوريدات والمستودعات';
        else if (trx.type === 'Sale' || trx.type === 'Cash Sale') partyName = 'مؤسسة الشروق التجارية';
    }
    const words = tafqeetArabic(total);
    const items = generateDocItems(trx, subtotal);
    const activeTab = window.activeDocSubTab[trx.id] || 'primary';

    let bundleDocs = [];
    let matchingChecklist = [];
    let dossierTitle = 'ملف المستندات المؤيدة للمطابقة';

    if (trx.type === 'Purchase') {
        dossierTitle = 'دورة المشتريات — المطابقة الثلاثية (3-Way Matching)';
        matchingChecklist = [
            { text: 'أمر الشراء PO مطابق للكميات والأسعار المعتمدة', status: 'ok' },
            { text: 'إذن استلام المخزن GRN يثبت سلامة الفحص واستلام البضاعة 100%', status: 'ok' },
            { text: 'فاتورة المورد الضريبية متوافقة مع الوعاء وضريبة المدخلات 14%', status: 'ok' }
        ];

        // 1. فاتورة المورد
        const supInvHtml = renderRealisticPaper({
            org: { name: partyName, sub: 'الجيزة — س.ت 22891 — ب.ض 448-910-332' },
            title: 'فاتورة مشتريات ضريبية',
            enTitle: 'Supplier Tax Invoice',
            serial: ref,
            meta: [
                ['تاريخ الفاتورة', date],
                ['أمر الشراء المرتبط', 'PO-' + ref.replace('INV-', '')],
                ['شروط الدفع', 'آجل 30 يوماً (Credit 30 Days)'],
                ['تاريخ الاستحقاق', '2026-02-15']
            ],
            parties: [
                ['المورد (البائع)', partyName, ['الجيزة — سجل تجاري 22891']],
                ['العميل (المشتري)', compName, ['القاهرة — ب.ض 104-920-881']]
            ],
            table: {
                cols: ['م', 'الصنف / البيان', 'الوحدة', 'الكمية', 'سعر الوحدة', 'القيمة'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['قيمة البضاعة (قبل الضريبة)', subtotal],
                ['ضريبة القيمة المضافة مدخلات (14%)', vatAmt],
                ['الإجمالي المستحق للمورد', total, 'g']
            ],
            extraSummaryHtml: `
                ${vatAmt > 0 ? `
                  ${renderDocRow('قيمة البضاعة المشتراة (قبل الضريبة)', subtotal, 'text-slate-800')}
                  ${renderDocRow('ضريبة القيمة المضافة مدخلات (14%)', vatAmt, 'text-emerald-700')}
                ` : `
                  ${renderDocRow('قيمة البضاعة المشتراة', total, 'text-slate-800')}
                `}
                ${renderDocRow('الإجمالي المستحق للمورد', total, 'text-blue-900 font-extrabold', true)}
            `,
            words: words + ' جنيهاً مصرياً لا غير.',
            terms: [
                'البضاعة المباعة خاضعة للفحص والاستلام خلال 48 ساعة من التوريد.',
                'تعتبر الفاتورة إقراراً بمديونية المشتري بالصافي المستحق للمورد.'
            ],
            sigs: ['إدارة المبيعات بالمورد', 'المحاسب المالي', 'استلمت البضاعة والفاتورة']
        });

        // 2. إذن استلام وفحص المخزن GRN
        const grnHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة المخازن والمستودعات المركزية' },
            title: 'إذن استلام وفحص مخزني',
            enTitle: 'Goods Received Note (GRN)',
            serial: 'GRN-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الاستلام', date],
                ['رقم أمر الشراء', 'PO-' + ref.replace('INV-', '')],
                ['رقم فاتورة المورد', ref],
                ['موقع المخزن', 'مخزن القاهرة الرئيسي (بضاعة تامة)']
            ],
            parties: [
                ['المورد', partyName, ['مندوب التسليم: أحمد حسن']],
                ['المستلم', compName, ['أمين المخزن: محمد عبد الرحمن']]
            ],
            table: {
                cols: ['م', 'الصنف المستلم', 'الوحدة', 'الكمية بأمر الشراء', 'الكمية المستلمة', 'المقبول', 'المرفوض'],
                num: [3, 4, 5, 6],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.qty, it.qty, 0])
            },
            notes: [
                ['تقرير الفحص الفني', 'تم فحص جميع الوحدات ومطابقتها للمواصفات الفنية الواردة بأمر الشراء 100%، ولا توجد أي تلفيات.'],
                ['حالة القيد بالمخزن', 'تم إدراج الأصناف في بطاقات الصنف (Bin Card) وكارت الصنف الآلي بالمستودع.']
            ],
            sigs: ['أمين المخزن (المستلم)', 'لجنة الفحص والقبول', 'مندوب المورد']
        });

        // 3. أمر الشراء PO
        const poHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة المشتريات والعقود' },
            title: 'أمر شراء بضاعة رسمي',
            enTitle: 'Purchase Order (PO)',
            serial: 'PO-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الإصدار', date],
                ['مرجع طلب الشراء', 'PR-2026-081'],
                ['شروط التسليم', 'مخازن المشتري بالقاهرة'],
                ['شروط السداد', 'آجل 30 يوماً بعد الفحص']
            ],
            parties: [
                ['إلى السادة (المورد)', partyName, ['الجيزة — ب.ض 448-910-332']],
                ['جهة التسليم والفحص', compName, ['مخزن البضاعة التامة الرئيسي']]
            ],
            table: {
                cols: ['م', 'الصنف المطلوب', 'الوحدة', 'الكمية المعتمدة', 'سعر الوحدة المتفق عليه', 'القيمة التقديرية'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['إجمالي أمر الشراء', subtotal],
                ['ضريبة القيمة المضافة المتوقعة (14%)', vatAmt],
                ['الإجمالي المعتمد للتعاقد', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            terms: [
                'يُعتبر هذا الأمر تكليفاً رسمياً وملزماً بعد توقيع المورد بالقبول.',
                'يُرفق أصل هذا الأمر مع إذن الاستلام والفاتورة عند طلب الصرف.'
            ],
            sigs: ['مدير المشتريات', 'المدير المالي (اعتماد)', 'قبول وتوقيع المورد']
        });

        bundleDocs = [
            { id: 'primary', label: 'فاتورة المورد الضريبية', icon: 'receipt', html: supInvHtml },
            { id: 'grn', label: 'إذن استلام المخزن (GRN)', icon: 'inventory_2', html: grnHtml },
            { id: 'po', label: 'أمر الشراء المعتمد (PO)', icon: 'shopping_cart_checkout', html: poHtml }
        ];

    } else if (trx.type === 'Sale' || trx.type === 'Cash Sale') {
        const isCash = trx.type === 'Cash Sale';
        dossierTitle = isCash ? 'دورة المبيعات النقدية — المستندات المؤيدة' : 'دورة المبيعات الآجلة — دورة التحقق والمطابقة';
        matchingChecklist = [
            { text: isCash ? 'البيع نقدي ومستلم بالخزينة/البنك فوراً' : 'أمر البيع معتمد ومطابق للحد الائتماني للعميل', status: 'ok' },
            { text: 'إذن صرف المخزن GIN يثبت تسليم البضاعة وتوقيع العميل', status: 'ok' },
            { text: 'فاتورة المبيعات الضريبية صادرة بضريبة القيمة المضافة 14%', status: 'ok' }
        ];

        // 1. فاتورة المبيعات
        const salInvHtml = renderRealisticPaper({
            org: { name: compName, sub: 'القاهرة — س.ت 104920 — ب.ض 104-920-881' },
            title: isCash ? 'فاتورة مبيعات نقدية' : 'فاتورة مبيعات ضريبية',
            enTitle: isCash ? 'Cash Sales Invoice' : 'Tax Sales Invoice',
            serial: ref,
            meta: [
                ['تاريخ الفاتورة', date],
                ['إذن الصرف المخزني', 'GIN-' + ref.replace('INV-', '')],
                ['طريقة البيع والسداد', isCash ? 'نقداً / تحويل فوري' : 'آجل 30 يوماً (حساب العملاء)'],
                ['تاريخ الاستحقاق', isCash ? date : '2026-02-15']
            ],
            parties: [
                ['البائع (المنشأة)', compName, ['مقر الإدارة والمبيعات — القاهرة']],
                ['العميل (المشتري)', partyName || (isCash ? 'عميل نقدي / مبيعات معرض' : 'مؤسسة الشروق التجارية'), ['القاهرة — ب.ض 000-000-002']]
            ],
            table: {
                cols: ['م', 'الصنف / البيان', 'الوحدة', 'الكمية', 'سعر البيع', 'القيمة'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['قيمة المبيعات الخاضعة للضريبة', subtotal],
                ['ضريبة القيمة المضافة مخرجات (14%)', vatAmt],
                [isCash ? 'المحصل بالخزينة/البنك' : 'المستحق على العميل (مدين)', total, 'g']
            ],
            extraSummaryHtml: `
                ${vatAmt > 0 ? `
                  ${renderDocRow('قيمة المبيعات الخاضعة للضريبة', subtotal, 'text-slate-800')}
                  ${renderDocRow('ضريبة القيمة المضافة مخرجات (14%)', vatAmt, 'text-purple-700')}
                ` : `
                  ${renderDocRow('قيمة المبيعات الإجمالية', total, 'text-slate-800')}
                `}
                ${renderDocRow(isCash ? 'المحصل بالخزينة/البنك' : 'المستحق على العميل (مدين)', total, 'text-blue-900 font-extrabold', true)}
            `,
            words: words + ' جنيهاً مصرياً لا غير.',
            terms: [
                'البضاعة المباعة مستلمة بحالة ممتازة وصالحة للإقرار الضريبي.',
                'تعتبر الفاتورة سند مديونية ومطالبة رسمية واجبة السداد في موعدها.'
            ],
            sigs: ['مسؤول المبيعات', 'المدير المالي', 'استلمت البضاعة بالأصل (العميل)']
        });

        // 2. إذن صرف بضاعة من المخازن GIN
        const ginHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة المستودعات المركزية' },
            title: 'إذن صرف بضاعة من المخازن',
            enTitle: 'Goods Issue Note (GIN)',
            serial: 'GIN-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الصرف', date],
                ['رقم الفاتورة', ref],
                ['الغرض من الصرف', 'تسليم مبيعات بضاعة للعميل'],
                ['المخزن المنصرف منه', 'مخزن القاهرة الرئيسي']
            ],
            parties: [
                ['الجهة الطالبة', 'قسم المبيعات والتوزيع', ['أمر بيع معتمد']],
                ['المستلم (العميل)', partyName || 'العميل', ['مندوب الاستلام']]
            ],
            table: {
                cols: ['م', 'الصنف المنصرف', 'الوحدة', 'الكمية المطلوبة', 'الكمية المنصرفة فعلية', 'حالة الصرف'],
                num: [3, 4],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.qty, 'تم التسليم سليماً ✓'])
            },
            notes: [
                ['تأكيد أمين المستودع', 'تم خصم الكميات المنصرفة من الرصيد الدفتري لبطاقة الصنف بالمخزن.']
            ],
            sigs: ['أمين المستودع (الصرف)', 'إدارة المبيعات', 'المستلم (العميل)']
        });

        // 3. أمر البيع المعتمد SO
        const soHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة المبيعات وخدمة العملاء' },
            title: 'أمر بيع بضاعة معتمد',
            enTitle: 'Sales Order (SO)',
            serial: 'SO-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الطلب', date],
                ['مرجع طلب العميل', 'PO-CUS-' + ref.replace('INV-', '')],
                ['طريقة السداد', isCash ? 'نقداً فوري' : 'آجل 30 يوماً'],
                ['موعد التسليم المتفق عليه', date]
            ],
            parties: [
                ['العميل المشتري', partyName || 'حساب العملاء', ['معتمد بالدليل']],
                ['مسؤول الحساب', compName, ['قسم المبيعات']]
            ],
            table: {
                cols: ['م', 'الصنف المطلوب', 'الوحدة', 'الكمية', 'السعر المتفق عليه', 'القيمة'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['إجمالي أمر البيع', subtotal],
                ['ضريبة القيمة المضافة 14%', vatAmt],
                ['الإجمالي المستحق', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            sigs: ['مندوب المبيعات', 'مدير الائتمان (موافقة)', 'مدير المبيعات']
        });

        bundleDocs = [
            { id: 'primary', label: 'فاتورة المبيعات الضريبية', icon: 'point_of_sale', html: salInvHtml },
            { id: 'gin', label: 'إذن صرف المخزن (GIN)', icon: 'outbox', html: ginHtml },
            { id: 'so', label: 'أمر البيع المعتمد (SO)', icon: 'description', html: soHtml }
        ];

    } else if (trx.type === 'Payment') {
        dossierTitle = 'دورة المدفوعات والشيكات — مستندات الصرف والاعتماد';
        matchingChecklist = [
            { text: 'سند الصرف معتمد من المدير المالي وموقع من أمين الصندوق', status: 'ok' },
            { text: 'الشيك البنكي محرر ومطابق لمبلغ الفاتورة المسددة تماماً', status: 'ok' },
            { text: 'تسوية حساب المورد وإرفاق أصل الفاتورة المسددة', status: 'ok' }
        ];

        // 1. سند الصرف
        const pvHtml = renderRealisticPaper({
            org: { name: compName, sub: 'الإدارة المالية — قسم الخزينة والمدفوعات' },
            title: 'إذن وسند صرف مالي',
            enTitle: 'Payment Voucher (PV)',
            serial: 'PV-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الصرف', date],
                ['طريقة الدفع', 'شيك بنكي رقم 000231 / تحويل بنكي'],
                ['الحساب المسحوب منه', 'البنك الأهلي المصري (حساب جاري)']
            ],
            parties: [
                ['يصرف لأمر السادة', partyName || 'حساب الموردين AP', ['سداد مستحقات الفاتورة ' + ref]],
                ['الجهة الصارفة', compName, ['الخزينة المركزية']]
            ],
            totals: [
                ['المبلغ المدفوع من البنك/الخزينة', total, 'g']
            ],
            extraSummaryHtml: `
                ${renderDocRow('المبلغ المدفوع من البنك/الخزينة', total, 'text-rose-800 font-bold', true)}
            `,
            words: words + ' جنيهاً مصرياً لا غير.',
            notes: [
                ['الغرض والبيان', 'سداد كامل مستحقات المورد عن توريدات البضاعة المعتمدة بالسجلات.']
            ],
            sigs: ['أمين الصندوق / المنفذ', 'المدير المالي (اعتماد الصرف)', 'توقيع المستلم']
        });

        // 2. الشيك البنكي
        const chkHtml = renderRealisticCheque({
            bank: 'البنك الأهلي المصري (فرع القاهرة الرئيسي)',
            account: 'حساب جاري رقم: 010-4492-8819',
            serial: '000231',
            date: date,
            payee: partyName || 'المورد المعتمد',
            words: words + ' جنيهاً مصرياً لا غير.',
            memo: 'سداد كامل مستحقات الفاتورة رقم ' + ref,
            amount: total,
            drawer: compName
        });

        bundleDocs = [
            { id: 'primary', label: 'سند الصرف المالي', icon: 'payments', html: pvHtml },
            { id: 'chk', label: 'الشيك البنكي المرفق', icon: 'account_balance_wallet', html: chkHtml }
        ];

    } else if (trx.type === 'Collection') {
        dossierTitle = 'دورة المقبوضات والتحصيل — مستندات الإيداع البنكي';
        matchingChecklist = [
            { text: 'سند القبض صادر من أمين الصندوق ومطابق للمبلغ المحصل', status: 'ok' },
            { text: 'قسيمة الإيداع البنكي مختومة من البنك ومقيدة بالحساب الجاري', status: 'ok' },
            { text: 'تخفيض حساب العميل المدين بالقيمة المحصلة', status: 'ok' }
        ];

        // 1. سند القبض
        const rvHtml = renderRealisticPaper({
            org: { name: compName, sub: 'الإدارة المالية — قسم المقبوضات' },
            title: 'سند وإيصال استلام نقدي / شيك',
            enTitle: 'Receipt Voucher (RV)',
            serial: 'RV-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الاستلام', date],
                ['طريقة القبض', 'نقداً / شيك مقبول الدفع'],
                ['رقم الحساب المودع فيه', 'الحساب الجاري لدى البنك']
            ],
            parties: [
                ['استلمنا من السادة', partyName || 'حساب العملاء المعتمد', ['تحصيل مستحقات الفاتورة ' + ref]],
                ['الجهة المستلمة', compName, ['أمانة الصندوق']]
            ],
            totals: [
                ['المبلغ المحصل بالخزينة/البنك', total, 'g']
            ],
            extraSummaryHtml: `
                ${renderDocRow('المبلغ المحصل بالخزينة/البنك', total, 'text-emerald-800 font-bold', true)}
            `,
            words: words + ' جنيهاً مصرياً لا غير.',
            sigs: ['أمين الصندوق (المستلم)', 'المحاسب المالي', 'الدافع (العميل)']
        });

        // 2. قسيمة الإيداع البنكي
        const depHtml = renderRealisticPaper({
            org: { name: 'بنك مصر — فرع الشركات', sub: 'إيصال إيداع نقدي رسمي بالحساب الجاري' },
            title: 'قسيمة إيداع بنكي مختومة',
            enTitle: 'Bank Deposit Slip',
            serial: 'DEP-8841',
            meta: [
                ['تاريخ الإيداع', date],
                ['رقم الحساب المودع به', '000-1192-8400'],
                ['صاحب الحساب المودع لصالحه', compName]
            ],
            table: {
                cols: ['فئة الإيداع', 'بيان الحركة', 'الرقم المرجعي', 'المبلغ المودع'],
                num: [3],
                rows: [
                    ['إيداع نقدي / شيك محصل', 'تحصيل مستحقات مبيعات تجارية', ref, total]
                ]
            },
            totals: [
                ['إجمالي المبلغ المودع بالحساب الجاري', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            notes: [
                ['تأكيد الصراف', 'تم قيد المبلغ المذكور أعلاه بحساب الشركة الجاري فوراً وحساب البنك مدين بالقيمة.']
            ],
            sigs: ['المودع', 'ختم وتوقيع الصراف المعتمد بالبنك']
        });

        bundleDocs = [
            { id: 'primary', label: 'سند القبض المالي', icon: 'receipt_long', html: rvHtml },
            { id: 'dep', label: 'قسيمة الإيداع البنكي', icon: 'assured_workload', html: depHtml }
        ];

    } else if (trx.type === 'Payroll') {
        const grossAmt = doc.grossAmount || total;
        const taxAmt = doc.taxAmount || Math.round(grossAmt * 0.05 * 100) / 100;
        const socAmt = doc.socAmount || Math.round(grossAmt * 0.11 * 100) / 100;
        const netAmt = doc.netAmount || (grossAmt - taxAmt - socAmt);
        const netWords = tafqeetArabic(netAmt);

        dossierTitle = 'مسير الرواتب والأجور — كشف الاستحقاقات والاستقطاعات';
        matchingChecklist = [
            { text: 'كشف مسير الرواتب معتمد من إدارة الموارد البشرية والشؤون المالية', status: 'ok' },
            { text: 'استقطاع ضريبة كسب العمل (5%) والتأمينات الاجتماعية (11%) وفقاً للقانون', status: 'ok' },
            { text: 'صافي الرواتب محول للبنوك ومطابق لسند الصرف', status: 'ok' }
        ];

        const prHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة الموارد البشرية والشؤون الإدارية والمالية' },
            title: 'كشف مسير رواتب وأجور العاملين',
            enTitle: 'Payroll Sheet & Deductions',
            serial: 'PR-2026-01',
            meta: [
                ['عن شهر', 'يناير 2026'],
                ['تاريخ الاستحقاق', date],
                ['طريقة الصرف', 'تحويل بنكي لبطاقات الرواتب الإلكترونية']
            ],
            table: {
                cols: ['اسم الموظف / الوظيفة', 'الراتب الأساسي', 'البدلات والعلاوات', 'تأمينات اجتماعية', 'ضريبة كسب عمل', 'صافي المستحق'],
                num: [1, 2, 3, 4, 5],
                rows: [
                    ['أحمد سمير — محاسب مالي', Math.round(grossAmt * 0.4), 0, Math.round(socAmt * 0.4), Math.round(taxAmt * 0.4), Math.round(netAmt * 0.4)],
                    ['منى عبد العزيز — مبيعات وتوزيع', Math.round(grossAmt * 0.35), 0, Math.round(socAmt * 0.35), Math.round(taxAmt * 0.35), Math.round(netAmt * 0.35)],
                    ['هاني فوزي — أمين المستودع', grossAmt - Math.round(grossAmt * 0.4) - Math.round(grossAmt * 0.35), 0, socAmt - Math.round(socAmt * 0.4) - Math.round(socAmt * 0.35), taxAmt - Math.round(taxAmt * 0.4) - Math.round(taxAmt * 0.35), netAmt - Math.round(netAmt * 0.4) - Math.round(netAmt * 0.35)],
                    ['الإجمالي العام', grossAmt, 0, socAmt, taxAmt, netAmt]
                ],
                totalRow: true
            },
            totals: [
                ['إجمالي الرواتب والأجور المستحقة', grossAmt],
                ['استقطاع ضريبة كسب العمل (5%)', taxAmt],
                ['استقطاع التأمينات الاجتماعية (11%)', socAmt],
                ['صافي الرواتب المحولة للبنوك', netAmt, 'g']
            ],
            extraSummaryHtml: `
                ${renderDocRow('إجمالي الرواتب والأجور المستحقة', grossAmt, 'text-slate-900')}
                ${renderDocRow('استقطاع ضريبة كسب العمل (5%)', taxAmt, 'text-amber-700')}
                ${renderDocRow('استقطاع التأمينات الاجتماعية (11%)', socAmt, 'text-amber-700')}
                ${renderDocRow('صافي الرواتب المحولة للبنوك', netAmt, 'text-emerald-800 font-extrabold', true)}
            `,
            words: 'صافي المسير: ' + netWords + ' جنيهاً مصرياً لا غير.',
            sigs: ['أعده: شؤون العاملين', 'راجعه: المراجع الداخلي', 'اعتمده: المدير المالي']
        });

        bundleDocs = [
            { id: 'primary', label: 'كشف مسير الرواتب المعتمد', icon: 'groups', html: prHtml }
        ];

    } else if (trx.type === 'Bank Loan') {
        dossierTitle = 'التمويل المصرفي — عقد القرض وكشف الحساب البنكي';
        matchingChecklist = [
            { text: 'إيداع كامل قيمة القرض بالحساب الجاري لدى البنك', status: 'ok' },
            { text: 'إثبات التزام طويل الأجل لصالح البنك الممول', status: 'ok' }
        ];

        const loanHtml = renderRealisticPaper({
            org: { name: 'بنك القاهرة — إدارة الائتمان وتمويل الشركات', sub: 'إشعار إضافة وتسهيل ائتماني رسمي' },
            title: 'عقد قرض وتمويل مصرفي لأجل',
            enTitle: 'Bank Loan Facility Agreement',
            serial: 'LOAN-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ تنفيذ التمويل', date],
                ['رقم الحساب الجاري المودع به', '000-8841-2026'],
                ['نوع التسهيل الائتماني', 'قرض متوسط / طويل الأجل']
            ],
            parties: [
                ['الجهة الممولة', 'بنك القاهرة (فرع الشركات)', ['إدارة تمويل المنشآت']],
                ['الطرف المستفيد المقترض', compName, ['سجل تجاري 104920']]
            ],
            totals: [
                ['مبلغ التمويل المودع بالحساب الجاري', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            notes: [
                ['بيان العملية', 'تم إيداع كامل مبلغ القرض المعتمد بالحساب الجاري للمنشأة لدى البنك، وتعتبر المنشأة مدينة بكامل القيمة كالتزام لأجل.']
            ],
            sigs: ['مدير إدارة الائتمان بالبنك', 'المدير المالي للمنشأة (قبول واستلام)']
        });

        bundleDocs = [
            { id: 'primary', label: 'إشعار التسهيل وقرض البنك', icon: 'account_balance', html: loanHtml }
        ];

    } else if (trx.type === 'Purchase Return' || trx.type === 'Sales Return') {
        const isPurRet = trx.type === 'Purchase Return';
        dossierTitle = isPurRet ? 'مردودات المشتريات — إشعار مدين ومطابقة الارتجاع' : 'مردودات المبيعات — إشعار دائن ومطابقة الاستلام';
        matchingChecklist = [
            { text: isPurRet ? 'إشعار مدين Debit Note لتخفيض رصيد المورد بالسجلات' : 'إشعار دائن Credit Note لتخفيض رصيد العميل', status: 'ok' },
            { text: 'إذن فحص وارتجاع المخزن يثبت خروج/استلام البضاعة المعيبة', status: 'ok' },
            { text: 'عكس ضريبة القيمة المضافة 14% ومطابقة أصل الفاتورة', status: 'ok' }
        ];

        // 1. الإشعار (مدين أو دائن)
        const noteHtml = renderRealisticPaper({
            org: { name: compName, sub: 'القاهرة — س.ت 104920 — ب.ض 104-920-881' },
            title: isPurRet ? 'إشعار مدين (مردودات مشتريات)' : 'إشعار دائن (مردودات مبيعات)',
            enTitle: isPurRet ? 'Debit Note (Purchase Return)' : 'Credit Note (Sales Return)',
            serial: (isPurRet ? 'DN-' : 'CN-') + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الإشعار', date],
                ['مرجع الفاتورة الأصلية', ref],
                ['سبب الإشعار والارتجاع', 'عيوب فنية وعدم مطابقة البضاعة للمواصفات المعيارية']
            ],
            parties: [
                [isPurRet ? 'المورد (الدائن)' : 'العميل (المدين)', partyName || 'الطرف التجاري', ['تسوية الرصيد بالسجلات الدفترية']],
                ['الجهة المصدرة', compName, ['الإدارة المالية والمحاسبية']]
            ],
            table: {
                cols: ['م', 'الصنف المرتجع', 'الوحدة', 'الكمية المرتجعة', 'سعر الوحدة', 'القيمة'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc + ' (مرتجع عيوب)', it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                [isPurRet ? 'تكلفة البضاعة المرتجعة' : 'قيمة المردودات (مبيعات)', subtotal],
                [isPurRet ? 'عكس ضريبة القيمة المضافة مدخلات (14%)' : 'عكس ضريبة القيمة المضافة مخرجات (14%)', vatAmt],
                [isPurRet ? 'إجمالي قيمة الخصم من المورد' : 'إجمالي قيمة الإشعار الدائن', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            terms: [
                isPurRet ? 'نرجو خصم قيمة هذا الإشعار من مستحقاتكم لدينا وتسوية كشف الحساب.' : 'تُخصم قيمة هذا الإشعار من رصيدكم المدين طرفنا.'
            ],
            sigs: ['أعده: المحاسب المالي', 'اعتمده: المدير المالي', 'استلمه الطرف الآخر']
        });

        // 2. إذن ارتجاع وفحص مخزني
        const retWhHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة المستودعات والرقابة على المخزون' },
            title: isPurRet ? 'إذن ارتجاع بضاعة لمورد (خروج مخزني)' : 'إذن استلام مردودات مبيعات بالمخزن',
            enTitle: isPurRet ? 'Store Return Issue Note' : 'Sales Return Receipt Note',
            serial: (isPurRet ? 'RIN-' : 'SRN-') + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الارتجاع', date],
                ['رقم الإشعار المالي', (isPurRet ? 'DN-' : 'CN-') + ref.replace('INV-', '')],
                ['المخزن', 'مخزن القاهرة الرئيسي']
            ],
            parties: [
                [isPurRet ? 'المورد المرتجع إليه' : 'العميل المرتجع منه', partyName || 'الطرف التجاري', ['إدارة المستودعات']],
                ['أمين المستودع المسؤول', compName, ['محمد عبد الرحمن']]
            ],
            table: {
                cols: ['م', 'الصنف المرتجع', 'الوحدة', 'الكمية بالأمر', 'الكمية المرتجعة فعلية', 'تقرير حالة الفحص'],
                num: [3, 4],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.qty, 'تالف / عيوب صناعة ظهرت بالفحص التفصيلي'])
            },
            notes: [
                ['ملاحظات أمين المخزن', isPurRet ? 'خرجت البضاعة المرتجعة من عهدة المخزن وتم إثباتها في كارت الصنف.' : 'تم استلام المرتجع وعزله في منطقة البضاعة المعيبة لإجراء التسوية.']
            ],
            sigs: ['أمين المستودع', 'لجنة الفحص الفني', 'المستلم / المندوب']
        });

        // 3. أصل الفاتورة المرجعية
        const origInvHtml = renderRealisticPaper({
            org: { name: isPurRet ? (partyName || 'المورد') : compName, sub: 'أصل الفاتورة المرجعية محل التسوية' },
            title: isPurRet ? 'صورة فاتورة الشراء الأصلية' : 'صورة فاتورة المبيعات الأصلية',
            enTitle: 'Original Reference Tax Invoice',
            serial: ref,
            meta: [
                ['تاريخ الفاتورة الأصلية', date],
                ['حالة الفاتورة', 'مسجلة بالدفاتر — جاري تسوية إشعار خصم عليها']
            ],
            table: {
                cols: ['م', 'الصنف / البيان', 'الوحدة', 'الكمية الأصلية', 'سعر الوحدة', 'القيمة'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['إجمالي الفاتورة الأصلية', subtotal],
                ['ضريبة 14%', vatAmt],
                ['إجمالي المستحق الأصلي', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            sigs: ['المحاسب المالي', 'المدير المالي']
        });

        bundleDocs = [
            { id: 'primary', label: isPurRet ? 'إشعار مدين للمورد' : 'إشعار دائن للعميل', icon: 'assignment_return', html: noteHtml },
            { id: 'ret_wh', label: isPurRet ? 'إذن ارتجاع المخزن' : 'إذن استلام المرتجع', icon: 'inventory', html: retWhHtml },
            { id: 'orig_inv', label: 'الفاتورة الأصلية المرجعية', icon: 'receipt_long', html: origInvHtml }
        ];

    } else if (trx.type === 'COGS' || trx.type === 'Cash Sale COGS') {
        dossierTitle = 'تكلفة البضاعة المباعة — أذونات الصرف وتقييم المخزون';
        matchingChecklist = [
            { text: 'إذن صرف البضاعة من المخازن يثبت خروج المخزون للعملاء', status: 'ok' },
            { text: 'التكلفة الدفترية محسوبة بنظام الجرد المستمر بدقة', status: 'ok' }
        ];

        const cogsHtml = renderRealisticPaper({
            org: { name: compName, sub: 'إدارة مراقبة المخزون والتكاليف' },
            title: 'إذن صرف بضاعة من المخازن (مبيعات)',
            enTitle: 'Store Issue Order & COGS Allocation',
            serial: 'SIO-' + ref.replace('INV-', ''),
            meta: [
                ['تاريخ الصرف', date],
                ['رقم الفاتورة المرتبطة', ref],
                ['الغرض من الصرف', 'تسليم بضاعة مبيعات للعملاء بموجب الفاتورة']
            ],
            table: {
                cols: ['م', 'الصنف المنصرف', 'الوحدة', 'الكمية المنصرفة', 'التكلفة الدفترية للوحدة', 'إجمالي التكلفة الدفترية'],
                num: [3, 4, 5],
                rows: items.map(it => [it.num, it.desc, it.unit, it.qty, it.unitPrice, it.total])
            },
            totals: [
                ['التكلفة الدفترية للبضاعة المنصرفة (تكلفة مبيعات)', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            sigs: ['أمين المستودع (صرف البضاعة)', 'محاسب التكاليف والمخزون', 'مدير الحسابات']
        });

        bundleDocs = [
            { id: 'primary', label: 'إذن صرف وتكلفة المخزون', icon: 'assignment', html: cogsHtml }
        ];

    } else if (trx.type === 'Opening Balance') {
        const opBalances = trx.openingBalances || trx.lines || [];
        const debits = opBalances.filter(l => l.debit > 0);
        const credits = opBalances.filter(l => l.credit > 0);
        const totalDebit = debits.reduce((s, l) => s + l.debit, 0) || total;
        const totalCredit = credits.reduce((s, l) => s + l.credit, 0) || total;
        const opWords = tafqeetArabic(totalDebit);

        dossierTitle = 'القيد الافتتاحي — محضر جرد وإثبات المركز المالي';
        matchingChecklist = [
            { text: 'محضر جرد الأصول والالتزامات معتمد من الإدارة ومراجع الحسابات', status: 'ok' },
            { text: 'توازن المركز المالي الافتتاحي 100% (إجمالي المدين = إجمالي الدائن)', status: 'ok' },
            { text: 'تم ترحيل القيد الافتتاحي آلياً لدفتر الأستاذ العام تيسيراً للتدريب', status: 'ok' }
        ];

        const opHtml = `
        <div class="acc-doc-sheet w-full max-w-md p-5 sm:p-6 text-right font-sans text-slate-900 relative">
          <div class="flex justify-between items-center border-b-2 border-slate-800 pb-3 mb-3">
            <div>
              <h2 class="text-sm font-extrabold text-slate-900">${compName}</h2>
              <p class="text-[10px] text-slate-500">محضر جرد وإثبات الأرصدة الافتتاحية (Opening Balances)</p>
            </div>
            <div class="text-left">
              <span class="text-[10px] bg-blue-900 text-white font-bold px-2 py-0.5 rounded font-mono">${ref}</span>
              <p class="text-[10px] text-slate-400 mt-1">${date}</p>
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
            إجمالي المركز المالي الافتتاحي: <strong>${opWords}</strong> جنيهاً مصرياً لا غير.
          </div>
          <p class="text-[10px] text-emerald-700 font-bold text-center">✓ معتمد ومرحل آلياً في دفتر اليومية ودفتر الأستاذ العام</p>
        </div>
        `;

        bundleDocs = [
            { id: 'primary', label: 'محضر المركز المالي الافتتاحي', icon: 'account_balance', html: opHtml }
        ];

    } else {
        // Expenses and General transactions
        const desc = trx.desc || trx.title || 'مستند إداري / تسوية محاسبية معتمدة';
        dossierTitle = 'مستندات المصروفات والتسويات المعتمدة';
        matchingChecklist = [
            { text: 'الفاتورة ومذكرة الاعتماد المالي مستوفاة للشروط', status: 'ok' },
            { text: 'تم فحص استحقاق الفترة المحاسبية بدقة', status: 'ok' }
        ];

        const genHtml = renderRealisticPaper({
            org: { name: compName, sub: 'الإدارة العامة والمحاسبية' },
            title: trx.title || 'إشعار قيد تسوية / مستند محاسبي',
            enTitle: 'Accounting Voucher & Proof',
            serial: ref,
            meta: [
                ['تاريخ العملية', date],
                ['نوع المستند', 'تسوية / مصروف إداري معتمد'],
                ['حالة الصرف', 'معتمد للترحيل بالدفاتر']
            ],
            parties: [
                ['الطرف المعني / المستفيد', partyName || 'الحساب المختص', ['بيانات معتمدة']],
                ['الجهة المعتمدة', compName, ['الشؤون المالية']]
            ],
            notes: [
                ['بيان وتفاصيل المعاملة', desc]
            ],
            totals: [
                ['المبلغ الإجمالي المعتمد بالعملية', total, 'g']
            ],
            words: words + ' جنيهاً مصرياً لا غير.',
            sigs: ['أعده: المحاسب المختص', 'راجعه: المراجع الداخلي', 'اعتمده: المدير المالي']
        });

        bundleDocs = [
            { id: 'primary', label: 'المستند المالي المعتمد', icon: 'receipt', html: genHtml }
        ];
    }

    // Determine which document in the bundle to show
    let selectedDoc = bundleDocs.find(d => d.id === activeTab) || bundleDocs[0];

    // Build the Multi-Document Bundle Wrapper
    let bundleHtml = `
    <div class="acc-doc-bundle-wrapper">
      
      <!-- Top Action Toolbar & Tabs -->
      <div class="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
        <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="material-symbols-outlined text-emerald-600 text-lg flex-shrink-0">verified</span>
            <span class="font-bold text-xs text-slate-800 truncate">${dossierTitle}</span>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button type="button" onclick="openDocInspectionModal('${escapeHtml(selectedDoc.label)} - ${ref}', document.getElementById('rendered-active-doc').innerHTML)" class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition" title="تكبير المستند بملء الشاشة">
              <span class="material-symbols-outlined text-[14px]">fullscreen</span>
              <span class="hidden xs:inline">ملء الشاشة</span>
            </button>
            <button type="button" onclick="window.requestAccountingHint()" class="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition" title="طلب تلميح وإرشادات">
              <span class="material-symbols-outlined text-[14px]">lightbulb</span>
              <span class="hidden xs:inline">تلميح</span>
            </button>
          </div>
        </div>

        <!-- Document Switcher Tabs -->
        ${bundleDocs.length > 1 ? `
        <div class="acc-doc-tabs">
          ${bundleDocs.map(d => `
            <button type="button" onclick="setDocSubTab('${trx.id}', '${d.id}')" class="acc-doc-tab-btn ${d.id === selectedDoc.id ? 'active' : ''}">
              <span class="material-symbols-outlined text-[15px]">${d.icon}</span>
              <span>${d.label}</span>
            </button>
          `).join('')}
        </div>
        ` : ''}

        <!-- 3-Way Matching Checklist Banner -->
        ${matchingChecklist.length > 0 ? `
        <div class="acc-matching-box">
          <div class="title">
            <span class="material-symbols-outlined text-emerald-600 text-[15px]">fact_check</span>
            <span>نتائج المطابقة المحاسبية المستندية:</span>
          </div>
          <div class="acc-matching-pills">
            ${matchingChecklist.map(c => `
              <span class="acc-matching-pill ok">
                <span class="material-symbols-outlined text-[12px]">check_circle</span>
                <span>${c.text}</span>
              </span>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>

      <!-- Active Rendered Document Sheet Container -->
      <div id="rendered-active-doc" class="w-full flex justify-center">
        ${selectedDoc.html}
      </div>

      <!-- Accounting Hint & Solution Assistance -->
      ${buildHintHtml(trx)}

    </div>
    `;

    viewer.innerHTML = bundleHtml;
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
    if (debEl) debEl.innerText = totalDebit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (credEl) credEl.innerText = totalCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const badgeEl = document.getElementById('balance-status-badge');
    const totalsRow = document.getElementById('totals-row');

    if (totalDebit > 0 && Math.abs(totalDebit - totalCredit) < 0.01) {
        if (totalsRow) {
            totalsRow.classList.remove('border-rose-200', 'bg-rose-50/40');
            totalsRow.classList.add('border-emerald-200', 'bg-emerald-50/50');
        }
        if (badgeEl) {
            badgeEl.innerHTML = '<span class="acc-balance-pill-balanced"><span class="material-symbols-outlined text-[16px]">check_circle</span>متزن محاسبياً</span>';
        }
    } else if (totalDebit > 0 || totalCredit > 0) {
        const diff = Math.abs(totalDebit - totalCredit);
        if (totalsRow) {
            totalsRow.classList.remove('border-emerald-200', 'bg-emerald-50/50');
            totalsRow.classList.add('border-rose-200', 'bg-rose-50/40');
        }
        if (badgeEl) {
            badgeEl.innerHTML = `<span class="acc-balance-pill-imbalanced"><span class="material-symbols-outlined text-[16px]">error</span>غير متزن (فارق: ${diff.toLocaleString('en-US', { minimumFractionDigits: 2 })} ج.م)</span>`;
        }
    } else {
        if (totalsRow) {
            totalsRow.classList.remove('border-rose-200', 'bg-rose-50/40', 'border-emerald-200', 'bg-emerald-50/50');
        }
        if (badgeEl) {
            badgeEl.innerHTML = '<span class="text-[11px] text-slate-400 font-medium">بانتظار إدخال المبالغ</span>';
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
                <select onchange="handleAccountChange(${index}, this.value)" class="w-full text-xs sm:text-sm border rounded-lg p-2 min-h-[44px] bg-white border-slate-200 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 font-medium">
                    ${optionsHtml}
                </select>
            </td>
            <td class="p-2">
                <input type="number" step="any" inputmode="decimal" oninput="handleDebitInput(${index}, this.value)" value="${line.debit || ''}" placeholder="0.00" class="w-full text-xs sm:text-sm text-center border rounded-lg p-2 min-h-[44px] border-slate-200 font-mono font-bold font-tabular text-emerald-800 bg-white focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500" />
            </td>
            <td class="p-2">
                <input type="number" step="any" inputmode="decimal" oninput="handleCreditInput(${index}, this.value)" value="${line.credit || ''}" placeholder="0.00" class="w-full text-xs sm:text-sm text-center border rounded-lg p-2 min-h-[44px] border-slate-200 font-mono font-bold font-tabular text-blue-900 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-500" />
            </td>
            <td class="p-2 text-center">
                ${formLines.length > 2 ? `<button onclick="removeLine(${index})" class="text-rose-500 hover:text-rose-700 w-10 h-10 inline-flex items-center justify-center rounded-lg hover:bg-rose-50 transition cursor-pointer" title="حذف السطر"><span class="material-symbols-outlined text-[20px]">delete</span></button>` : ''}
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

    let isCorrect = true;
    let errorDesc = "";
    
    // 1. Validation for Hashed transactions (Secure Mode)
    if (currentTrx.validationHash && currentTrx.salt) {
        const reqCount = currentTrx.requiredLinesCount || 2;
        if (usedAccounts.length !== reqCount) {
            isCorrect = false;
            const entryStyle = reqCount > 2 ? `قيد مركب يتطلب (${reqCount}) أسطر` : `قيد بسيط يتطلب سطرين فقط`;
            errorDesc = `عدد أسطر القيد غير صحيحة (${usedAccounts.length} مدخلة مقابل ${reqCount} مطلوبة). هذه المعاملة تمثل ${entryStyle}. تفقد بنود المستند وطريقة السداد.`;
        } else {
            const canonicalizer = (typeof canonicalizeLines === 'function') ? canonicalizeLines : window.canonicalizeLines;
            const hasher = (typeof sha256Sync === 'function') ? sha256Sync : window.sha256Sync;
            const candidateCanonical = canonicalizer(usedAccounts);
            const candidateHash = hasher(candidateCanonical + ':' + currentTrx.salt);

            if (candidateHash !== currentTrx.validationHash) {
                isCorrect = false;
                errorDesc = "تأكد من مطابقة الحساب والمبلغ الصحيحين لكل سطر وفقاً للمستند المرفق وطريقة السداد أو التحصيل.";
            }
        }
    } else if (Array.isArray(currentTrx.lines)) {
        // Fallback for legacy custom upload with lines
        const requiredLines = currentTrx.lines.filter(l => l.debit > 0 || l.credit > 0);
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
            accountName: ACCOUNTS[l.account] || `حساب (${l.account})`,
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description: currentTrx.desc || currentTrx.title || (currentTrx.lines && currentTrx.lines[0]?.description) || 'قيد يومية',
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
