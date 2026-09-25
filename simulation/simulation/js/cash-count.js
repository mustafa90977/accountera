// ================= CASH COUNT SIMULATION (_CASH) =================
// محاكي جرد الخزينة الفعلي المصري - مطابق لمعايير المحاسبة المصرية (EAS 1 / EAS 2)

const EGYPTIAN_DENOMINATIONS = [
    { value: 200, name: 'فئة 200 جنيه', type: 'note', color: 'bg-emerald-50 text-emerald-900 border-emerald-300' },
    { value: 100, name: 'فئة 100 جنيه', type: 'note', color: 'bg-blue-50 text-blue-900 border-blue-300' },
    { value: 50,  name: 'فئة 50 جنيه',  type: 'note', color: 'bg-purple-50 text-purple-900 border-purple-300' },
    { value: 20,  name: 'فئة 20 جنيه',  type: 'note', color: 'bg-amber-50 text-amber-900 border-amber-300' },
    { value: 10,  name: 'فئة 10 جنيهات', type: 'note', color: 'bg-orange-50 text-orange-900 border-orange-300' },
    { value: 5,   name: 'فئة 5 جنيهات',  type: 'note', color: 'bg-teal-50 text-teal-900 border-teal-300' },
    { value: 1,   name: 'عملة 1 جنيه معدني', type: 'coin', color: 'bg-slate-100 text-slate-800 border-slate-300' },
    { value: 0.5, name: 'عملة 50 قرش معدنية', type: 'coin', color: 'bg-slate-100 text-slate-800 border-slate-300' }
];

let denominationCounts = {};
let shortageResponsibility = 'EMPLOYEE'; // 'EMPLOYEE' (1105) or 'COMPANY' (5208)

function getCompanyProfile() {
    try {
        const raw = localStorage.getItem('sim_company_profile');
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return {
        name: 'شركة النيل للتجارة والتوزيع',
        sector: 'تجارة عامة',
        capital: 2000000
    };
}

function getBookCashBalance() {
    // 1. Check student ledger balance for Account 1101 (الخزينة)
    let bookCash = 0;
    if (typeof calculateBalances === 'function') {
        const balances = calculateBalances();
        bookCash = balances['1101'] || 0;
    }

    // 2. If ledger is 0, check saved simulation case or default to standard company treasury balance
    if (bookCash === 0) {
        const rawSaved = localStorage.getItem('sim_cash_book_balance');
        if (rawSaved) {
            bookCash = Number(rawSaved) || 0;
        } else {
            // Default realistic benchmark treasury balance for simulation
            bookCash = 48750;
            localStorage.setItem('sim_cash_book_balance', '48750');
        }
    }
    return bookCash;
}

function initCashCount() {
    loadCashCountState();
    renderDenominationsTable();
    updateCashSummary();
}

function loadCashCountState() {
    const rawCounts = localStorage.getItem('sim_cash_denom_counts');
    if (rawCounts) {
        try {
            denominationCounts = JSON.parse(rawCounts);
        } catch(e) {
            denominationCounts = {};
        }
    } else {
        // Initialize default empty counts
        denominationCounts = {};
        EGYPTIAN_DENOMINATIONS.forEach(d => denominationCounts[d.value] = 0);
    }
}

function saveCashCountState() {
    localStorage.setItem('sim_cash_denom_counts', JSON.stringify(denominationCounts));
}

function renderDenominationsTable() {
    const tbody = document.getElementById('denominations-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    EGYPTIAN_DENOMINATIONS.forEach(d => {
        const count = denominationCounts[d.value] || 0;
        const total = d.value * count;

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
        tr.innerHTML = `
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <span class="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold font-mono border ${d.color}">
                        ${d.value >= 1 ? d.value + ' ج.م' : '50 قرش'}
                    </span>
                    <span class="font-bold text-xs text-slate-800">${d.name}</span>
                </div>
            </td>
            <td class="p-3 text-center">
                <span class="text-xs font-mono font-bold text-slate-600">${d.type === 'note' ? 'بنكنوت ورقي' : 'عملة معدنية'}</span>
            </td>
            <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1.5 max-w-[200px] mx-auto">
                    <button type="button" onclick="adjustDenomCount(${d.value}, -10)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center" title="إنقاص 10">-10</button>
                    <input type="number" min="0" step="1" value="${count || ''}" placeholder="0" 
                           oninput="setDenomCount(${d.value}, this.value)"
                           class="w-20 text-center font-mono font-bold text-xs p-1.5 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white" />
                    <button type="button" onclick="adjustDenomCount(${d.value}, 10)" class="w-7 h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center" title="زيادة 10">+10</button>
                    <button type="button" onclick="adjustDenomCount(${d.value}, 50)" class="w-7 h-7 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-lg text-xs font-bold transition flex items-center justify-center" title="زيادة 50">+50</button>
                </div>
            </td>
            <td class="p-3 text-center font-mono font-bold text-sm text-slate-900">
                ${total.toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.setDenomCount = function(val, countStr) {
    const num = Math.max(0, parseInt(countStr, 10) || 0);
    denominationCounts[val] = num;
    saveCashCountState();
    renderDenominationsTable();
    updateCashSummary();
};

window.adjustDenomCount = function(val, delta) {
    const current = denominationCounts[val] || 0;
    denominationCounts[val] = Math.max(0, current + delta);
    saveCashCountState();
    renderDenominationsTable();
    updateCashSummary();
};

window.resetCashCountsToZero = function() {
    EGYPTIAN_DENOMINATIONS.forEach(d => denominationCounts[d.value] = 0);
    saveCashCountState();
    renderDenominationsTable();
    updateCashSummary();
};

window.loadRealisticCashScenario = function(scenarioType = 'SHORTAGE') {
    const bookBalance = getBookCashBalance();
    
    // Create distribution of bills based on target
    let targetPhysical = bookBalance;
    if (scenarioType === 'SHORTAGE') {
        targetPhysical = bookBalance - 750; // عجز 750 ج.م
    } else if (scenarioType === 'SURPLUS') {
        targetPhysical = bookBalance + 400; // زيادة 400 ج.م
    }

    // Generate bills breakdown for targetPhysical
    let remaining = targetPhysical;
    const newCounts = {};
    
    // Realistic cash desk distribution
    newCounts[200] = Math.floor(remaining * 0.6 / 200);
    remaining -= (newCounts[200] * 200);

    newCounts[100] = Math.floor(remaining * 0.6 / 100);
    remaining -= (newCounts[100] * 100);

    newCounts[50] = Math.floor(remaining * 0.5 / 50);
    remaining -= (newCounts[50] * 50);

    newCounts[20] = Math.floor(remaining * 0.6 / 20);
    remaining -= (newCounts[20] * 20);

    newCounts[10] = Math.floor(remaining * 0.6 / 10);
    remaining -= (newCounts[10] * 10);

    newCounts[5] = Math.floor(remaining / 5);
    remaining -= (newCounts[5] * 5);

    newCounts[1] = Math.floor(remaining);
    remaining -= newCounts[1];

    newCounts[0.5] = remaining > 0 ? 1 : 0;

    denominationCounts = newCounts;
    saveCashCountState();
    renderDenominationsTable();
    updateCashSummary();
};

function calculatePhysicalCash() {
    let total = 0;
    EGYPTIAN_DENOMINATIONS.forEach(d => {
        const count = denominationCounts[d.value] || 0;
        total += (d.value * count);
    });
    return total;
}

function updateCashSummary() {
    const bookCash = getBookCashBalance();
    const physicalCash = calculatePhysicalCash();
    const diff = physicalCash - bookCash;
    const absDiff = Math.abs(diff);

    const elBook = document.getElementById('cash-book-val');
    const elPhysical = document.getElementById('cash-physical-val');
    const elDiff = document.getElementById('cash-diff-val');
    const elStatusBadge = document.getElementById('cash-status-badge');
    const elResolutionBox = document.getElementById('cash-resolution-box');

    if (elBook) elBook.innerText = bookCash.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elPhysical) elPhysical.innerText = physicalCash.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elDiff) {
        if (absDiff < 0.01) {
            elDiff.innerText = '0.00';
            elDiff.className = 'text-xl font-mono font-black text-emerald-700';
        } else if (diff < 0) {
            elDiff.innerText = '-' + absDiff.toLocaleString(undefined, {minimumFractionDigits: 2});
            elDiff.className = 'text-xl font-mono font-black text-rose-700';
        } else {
            elDiff.innerText = '+' + absDiff.toLocaleString(undefined, {minimumFractionDigits: 2});
            elDiff.className = 'text-xl font-mono font-black text-blue-700';
        }
    }

    if (elStatusBadge) {
        if (physicalCash === 0) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200 text-slate-700';
            elStatusBadge.innerText = 'بانتظار عد الفئات';
        } else if (absDiff < 0.01) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500 text-white';
            elStatusBadge.innerText = 'الخزينة مطابقة 100% ✓';
        } else if (diff < 0) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-rose-500 text-white';
            elStatusBadge.innerText = 'عجز بالخزينة: ' + absDiff.toLocaleString() + ' ج.م ⚠️';
        } else {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500 text-white';
            elStatusBadge.innerText = 'زيادة بالخزينة: ' + absDiff.toLocaleString() + ' ج.م ℹ️';
        }
    }

    if (elResolutionBox) {
        if (physicalCash === 0) {
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-slate-400">payments</span>
                <div>
                  <strong class="text-slate-800 block text-sm">ابدأ بحصر فئات النقدية الفعلية الموجودة في درج الخزينة:</strong>
                  أدخل عدد الوريقات لكل فئة بالجدول أعلاه، أو اضغط على أحد أزرار السيناريوهات الواقعية بالأسفل لتوليد تمرين جرد فوري.
                </div>
              </div>
            `;
        } else if (absDiff < 0.01) {
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-2xl text-emerald-700">task_alt</span>
                  <div>
                    <strong class="text-sm block">محضر الجرد مطابق تماماً (لا توجد فروقات دفترياً):</strong>
                    تطابق النقد الفعلي بالدرج (${physicalCash.toLocaleString()} ج.م) مع رصيد حساب الخزينة بالدفاتر (1101). يمكنك اعتماد وطباعة محضر الجرد.
                  </div>
                </div>
                <button type="button" onclick="openPrintCashCountProtocol()" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition">
                  <span class="material-symbols-outlined text-[16px]">print</span>
                  <span>طباعة محضر الجرد المعتمد</span>
                </button>
              </div>
            `;
        } else if (diff < 0) {
            // SHORTAGE
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-rose-50 border-2 border-rose-300 rounded-xl text-xs text-rose-950 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-2 border-b border-rose-200 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl text-rose-700">error</span>
                    <strong class="text-sm font-bold">اكتشاف عجز في الخزينة بمبلغ (${absDiff.toLocaleString()} ج.م):</strong>
                  </div>
                  <span class="text-[11px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">يتطلب قيد تسوية بالدفاتر</span>
                </div>

                <div class="space-y-2 text-slate-800">
                  <span class="font-bold block">اختر المعالجة المحاسبية للعجز المالي:</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label class="p-3 bg-white border border-rose-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-rose-50/50 transition">
                      <input type="radio" name="shortage_resp" value="EMPLOYEE" ${shortageResponsibility === 'EMPLOYEE' ? 'checked' : ''} onchange="setShortageResp('EMPLOYEE')" class="text-rose-600 focus:ring-0" />
                      <div>
                        <strong class="text-xs text-slate-900 block">1. تحميل العجز على أمين الخزينة / الصراف</strong>
                        <span class="text-[10px] text-slate-500">حـ/ 1105 - سلف وعُهد الموظفين (ذمم مدينة)</span>
                      </div>
                    </label>

                    <label class="p-3 bg-white border border-rose-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-rose-50/50 transition">
                      <input type="radio" name="shortage_resp" value="COMPANY" ${shortageResponsibility === 'COMPANY' ? 'checked' : ''} onchange="setShortageResp('COMPANY')" class="text-rose-600 focus:ring-0" />
                      <div>
                        <strong class="text-xs text-slate-900 block">2. عجز طبيعي مسموح به تتحمله المنشأة</strong>
                        <span class="text-[10px] text-slate-500">حـ/ 5208 - عجز الخزينة (مصروف تشغيلي/خسارة)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <div class="text-[11px] text-slate-600 font-medium">
                    القيد المقترح: <strong class="text-blue-900">من حـ/ ${shortageResponsibility === 'EMPLOYEE' ? '1105 سلف وعُهد الموظفين' : '5208 عجز الخزينة'}</strong> إلى <strong class="text-blue-900">حـ/ 1101 الخزينة</strong> بمبلغ ${absDiff.toLocaleString()} ج.م
                  </div>
                  <button type="button" onclick="prepareCashShortageDraft(${absDiff})" class="bg-slate-900 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                    <span>إعداد مسودة قيد تسوية العجز بالدفاتر</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            `;
        } else {
            // SURPLUS
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-blue-50 border-2 border-blue-300 rounded-xl text-xs text-blue-950 space-y-3">
                <div class="flex items-center justify-between flex-wrap gap-2 border-b border-blue-200 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-xl text-blue-700">info</span>
                    <strong class="text-sm font-bold">اكتشاف زيادة في الخزينة بمبلغ (${absDiff.toLocaleString()} ج.م):</strong>
                  </div>
                  <span class="text-[11px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">يتطلب قيد تسوية بالدفاتر</span>
                </div>

                <p class="text-slate-700 font-normal">
                  تعتبر الزيادة بالخزينة إيراداً نثرياً مؤقتاً أو أمانات بالدفاتر حتى تبين سببها.
                  القيد المحاسبي المعتمد: <strong class="text-blue-900">من حـ/ 1101 الخزينة</strong> إلى <strong class="text-blue-900">حـ/ 4201 إيرادات متنوعة وزيادة بالخزينة</strong> بمبلغ ${absDiff.toLocaleString()} ج.م.
                </p>

                <div class="pt-1 flex justify-end">
                  <button type="button" onclick="prepareCashSurplusDraft(${absDiff})" class="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                    <span>إعداد مسودة قيد إثبات زيادة الخزينة بالدفاتر</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            `;
        }
    }
}

window.setShortageResp = function(resp) {
    shortageResponsibility = resp;
    updateCashSummary();
};

window.prepareCashShortageDraft = function(amount) {
    const today = new Date().toISOString().split('T')[0];
    const isEmployee = shortageResponsibility === 'EMPLOYEE';
    const drAccount = isEmployee ? '1105' : '5208';
    const drTitle = isEmployee ? 'سلف وعُهد الموظفين (أمين الخزينة)' : 'عجز الخزينة والنقدية';

    const draft = {
        sourceModule: 'CASH_COUNT',
        ref: 'CSH-DIFF-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        title: 'قيد تسوية - إثبات عجز الخزينة',
        desc: `تسوية عجز الجرد الفعلي للخزينة بموجب محضر الجرد المعتمد وتحميله على ${isEmployee ? 'أمين الخزينة' : 'المنشأة كعجز طبيعي'}`,
        amount: amount,
        lines: [
            { account: drAccount, debit: amount, credit: 0 },
            { account: '1101', debit: 0, credit: amount }
        ]
    };

    localStorage.setItem('acc_draft_journal_entry', JSON.stringify(draft));
    window.location.href = '../journal/index.html?mode=draft_cash&amt=' + encodeURIComponent(amount);
};

window.prepareCashSurplusDraft = function(amount) {
    const today = new Date().toISOString().split('T')[0];
    const draft = {
        sourceModule: 'CASH_COUNT',
        ref: 'CSH-SURP-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        title: 'قيد تسوية - إثبات زيادة الخزينة',
        desc: 'إثبات زيادة النقدية بالخزينة بموجب محضر الجرد الفعلي وتحويلها لإيرادات متنوعة',
        amount: amount,
        lines: [
            { account: '1101', debit: amount, credit: 0 },
            { account: '4201', debit: 0, credit: amount }
        ]
    };

    localStorage.setItem('acc_draft_journal_entry', JSON.stringify(draft));
    window.location.href = '../journal/index.html?mode=draft_cash&amt=' + encodeURIComponent(amount);
};

window.openPrintCashCountProtocol = function() {
    const modal = document.getElementById('cash-print-modal');
    const container = document.getElementById('cash-printable-content');
    if (!modal || !container) return;

    const comp = getCompanyProfile();
    const bookBalance = getBookCashBalance();
    const physicalCash = calculatePhysicalCash();
    const diff = physicalCash - bookBalance;
    const absDiff = Math.abs(diff);
    const dateToday = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let wordsArabic = '';
    if (typeof tafqeetArabic === 'function') {
        wordsArabic = tafqeetArabic(physicalCash);
    } else {
        wordsArabic = physicalCash.toLocaleString() + ' جنيهاً مصرياً';
    }

    container.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-xl font-black text-slate-900">${comp.name}</h1>
          <p class="text-xs text-slate-600 mt-1">${comp.sector || 'قطاع الأعمال'} • الخزينة الرئيسية (حـ/ 1101)</p>
          <p class="text-xs font-bold text-slate-800 mt-1">الإدارة المالية - لجنة الجرد المفاجئ والدوري</p>
        </div>
        <div class="text-left">
          <span class="inline-block text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded-md font-mono">CNT-CSH-${new Date().getFullYear()}</span>
          <p class="text-xs text-slate-500 mt-1">تاريخ الجرد: ${dateToday}</p>
        </div>
      </div>

      <div class="text-center my-4">
        <h2 class="text-lg font-black text-slate-900 border-b-2 border-double border-slate-400 inline-block pb-1">محضر جرد الخزينة والصندوق الفعلي (Cash Count Protocol)</h2>
        <p class="text-xs text-slate-600 mt-1.5 font-medium">مطابق لأحكام الرقابة الداخلية ومعايير المحاسبة المصرية</p>
      </div>

      <p class="text-xs leading-relaxed text-slate-700 my-4 text-justify">
        في يوم <strong>${dateToday}</strong>، قامت لجنة الجرد المشكلة بالانتقال لمقر الخزينة الرئيسية وقامت بحصر النقدية الفعلية الموجودة في عهدة أمين الخزينة، وجاء بيان الفئات المحصورة تفصيلياً كما يلي:
      </p>

      <table class="w-full text-xs text-right border-collapse border border-slate-300 my-4">
        <thead>
          <tr class="bg-slate-100 font-bold border-b border-slate-300">
            <th class="p-2 border-r border-slate-300">الفئة النقدية</th>
            <th class="p-2 text-center border-r border-slate-300">النوع</th>
            <th class="p-2 text-center border-r border-slate-300">عدد الأوراق / القطع</th>
            <th class="p-2 text-center">القيمة الإجمالية (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          ${EGYPTIAN_DENOMINATIONS.map(d => {
              const c = denominationCounts[d.value] || 0;
              const tot = d.value * c;
              if (c === 0) return '';
              return `
                <tr class="border-b border-slate-200">
                  <td class="p-2 border-r border-slate-200 font-bold">${d.name}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono">${d.type === 'note' ? 'بنكنوت' : 'معدن'}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${c.toLocaleString()}</td>
                  <td class="p-2 text-center font-mono font-bold">${tot.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              `;
          }).join('')}
        </tbody>
        <tfoot class="bg-slate-100 font-black border-t-2 border-slate-800">
          <tr>
            <td colspan="3" class="p-2.5 text-right border-r border-slate-300">إجمالي النقدية المحصورة فعلياً بالخزينة:</td>
            <td class="p-2.5 text-center font-mono text-sm text-blue-900">${physicalCash.toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م</td>
          </tr>
        </tfoot>
      </table>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-serif text-center my-3">
        فقط وقدره <strong>${wordsArabic}</strong> لا غير.
      </div>

      <!-- Comparison with Books -->
      <div class="grid grid-cols-3 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 my-4 text-center">
        <div>
          <span class="text-slate-500 block text-[10px]">الرصيد الدفتري (حـ/ 1101):</span>
          <strong class="font-mono text-slate-900 text-sm">${bookBalance.toLocaleString()} ج.م</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">الرصيد الفعلي بالدرج:</span>
          <strong class="font-mono text-slate-900 text-sm">${physicalCash.toLocaleString()} ج.م</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">نتيجة الجرد:</span>
          <strong class="font-mono text-sm ${absDiff < 0.01 ? 'text-emerald-700' : (diff < 0 ? 'text-rose-700' : 'text-blue-700')}">
            ${absDiff < 0.01 ? 'مطابق تماماً' : (diff < 0 ? 'عجز: ' + absDiff.toLocaleString() + ' ج.م' : 'زيادة: ' + absDiff.toLocaleString() + ' ج.م')}
          </strong>
        </div>
      </div>

      <!-- Committee Signatures -->
      <div class="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-300 text-center text-xs">
        <div>
          <span class="text-slate-500 block mb-8">أمين الخزينة (الصراف):</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">التوقيع بالاستلام والمطابقة</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-8">رئيس لجنة الجرد (المحاسب):</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">توقيع القائم بالجرد</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-8">اعتماد الإدارة المالية:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">المدير المالي</strong>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
};

window.closePrintCashCountProtocol = function() {
    const modal = document.getElementById('cash-print-modal');
    if (modal) modal.classList.add('hidden');
};

window.initCashCount = initCashCount;
window.calculatePhysicalCash = calculatePhysicalCash;
window.getBookCashBalance = getBookCashBalance;
