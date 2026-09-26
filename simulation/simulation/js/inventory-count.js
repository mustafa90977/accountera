// ================= INVENTORY COUNT SIMULATION (_INV) =================
// محاكي جرد المخزون الفعلي المصري - معايير المحاسبة المصرية (EAS 2 - المخزون)

const DEFAULT_INVENTORY_ITEMS = [
    { sku: 'SKU-EG-101', name: 'قميص رجالي قطن كلاسيك فاخر', unit: 'قطعة', unitCost: 350, bookQty: 120 },
    { sku: 'SKU-EG-102', name: 'بنطلون قماش صوف تركي', unit: 'قطعة', unitCost: 550, bookQty: 80 },
    { sku: 'SKU-EG-103', name: 'تيشيرت بولو قطن مصري 100%', unit: 'قطعة', unitCost: 220, bookQty: 250 },
    { sku: 'SKU-EG-104', name: 'حذاء كلاسيك جلد طبيعي', unit: 'زوج', unitCost: 750, bookQty: 60 },
    { sku: 'SKU-EG-105', name: 'بدلة رجالي كاملة سوبر 120', unit: 'بدلة', unitCost: 1800, bookQty: 30 }
];

let inventoryItems = [];
let invShortageResponsibility = 'COMPANY'; // 'COMPANY' (5209) or 'STOREKEEPER' (1105)

function getCompanyProfile() {
    try {
        const raw = localStorage.getItem('sim_company_profile');
        if (raw) return JSON.parse(raw);
    } catch(e) {}
    return {
        name: 'شركة النيل للتجارة والتوزيع',
        sector: 'تجارة عامة وتوزيع ملابس وأقمشة',
        capital: 2000000
    };
}

function getBookInventoryBalance() {
    // 1. Check student ledger balance for Account 1104 (المخزون)
    let bookInv = 0;
    if (typeof calculateBalances === 'function') {
        const balances = calculateBalances();
        bookInv = balances['1104'] || 0;
    }

    // 2. If ledger is 0, calculate from default items book balance
    if (bookInv === 0) {
        bookInv = DEFAULT_INVENTORY_ITEMS.reduce((sum, item) => sum + (item.bookQty * item.unitCost), 0);
    }
    return bookInv;
}

function initInventoryCount() {
    loadInventoryState();
    renderInventoryTable();
    updateInventorySummary();
}

function loadInventoryState() {
    const raw = localStorage.getItem('sim_inventory_items_state');
    if (raw) {
        try {
            inventoryItems = JSON.parse(raw);
        } catch(e) {
            inventoryItems = JSON.parse(JSON.stringify(DEFAULT_INVENTORY_ITEMS));
        }
    } else {
        inventoryItems = JSON.parse(JSON.stringify(DEFAULT_INVENTORY_ITEMS));
        // Default countedQty to 0 initially to prompt counting
        inventoryItems.forEach(item => item.countedQty = 0);
    }
}

function saveInventoryState() {
    localStorage.setItem('sim_inventory_items_state', JSON.stringify(inventoryItems));
}

function renderInventoryTable() {
    const tbody = document.getElementById('inventory-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    inventoryItems.forEach((item, idx) => {
        const counted = item.countedQty ?? 0;
        const diffQty = counted - item.bookQty;
        const bookVal = item.bookQty * item.unitCost;
        const countVal = counted * item.unitCost;
        const diffVal = diffQty * item.unitCost;

        let diffBadge = '';
        if (counted === 0 && item.bookQty > 0) {
            diffBadge = '<span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">بانتظار العد</span>';
        } else if (diffQty === 0) {
            diffBadge = '<span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">مطابق ✓</span>';
        } else if (diffQty < 0) {
            diffBadge = `<span class="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">عجز (${Math.abs(diffQty)})</span>`;
        } else {
            diffBadge = `<span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">زيادة (+${diffQty})</span>`;
        }

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
        tr.innerHTML = `
            <td class="p-3">
                <div>
                    <span class="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">${item.sku}</span>
                    <strong class="text-xs text-slate-900 block mt-1">${item.name}</strong>
                    <span class="text-[10px] text-slate-400">الوحدة: ${item.unit}</span>
                </div>
            </td>
            <td class="p-3 text-center font-mono font-bold text-xs text-slate-700">
                ${item.unitCost.toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م
            </td>
            <td class="p-3 text-center font-mono font-bold text-xs text-slate-600 bg-slate-50/50">
                ${item.bookQty.toLocaleString()} ${item.unit}
                <span class="text-[10px] text-slate-400 block">${bookVal.toLocaleString()} ج.م</span>
            </td>
            <td class="p-3 text-center">
                <div class="flex items-center justify-center gap-1.5 max-w-[230px] mx-auto">
                    <button type="button" onclick="adjustItemQty(${idx}, -5)" class="min-w-[36px] h-9 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs" title="إنقاص 5">-5</button>
                    <input type="number" min="0" step="1" value="${counted || ''}" placeholder="0" 
                           oninput="setItemQty(${idx}, this.value)"
                           class="w-20 text-center font-mono font-bold text-sm h-9 sm:h-10 p-1 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-800 bg-white" />
                    <button type="button" onclick="adjustItemQty(${idx}, 5)" class="min-w-[36px] h-9 sm:h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs" title="زيادة 5">+5</button>
                    <button type="button" onclick="matchItemQty(${idx})" class="min-w-[36px] h-9 sm:h-10 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs" title="مطابقة مع الدفتري">✓</button>
                </div>
                <span class="text-[10px] text-slate-500 font-mono block mt-1">${countVal.toLocaleString()} ج.م</span>
            </td>
            <td class="p-3 text-center">
                <div class="space-y-1">
                    ${diffBadge}
                    <div class="font-mono text-xs font-bold ${diffVal < 0 ? 'text-rose-700' : (diffVal > 0 ? 'text-blue-700' : 'text-slate-400')}">
                        ${diffVal !== 0 ? (diffVal > 0 ? '+' : '') + diffVal.toLocaleString() + ' ج.م' : '0.00'}
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

window.setItemQty = function(idx, valStr) {
    const qty = Math.max(0, parseInt(valStr, 10) || 0);
    if (inventoryItems[idx]) {
        inventoryItems[idx].countedQty = qty;
        saveInventoryState();
        renderInventoryTable();
        updateInventorySummary();
    }
};

window.adjustItemQty = function(idx, delta) {
    if (inventoryItems[idx]) {
        const cur = inventoryItems[idx].countedQty || 0;
        inventoryItems[idx].countedQty = Math.max(0, cur + delta);
        saveInventoryState();
        renderInventoryTable();
        updateInventorySummary();
    }
};

window.matchItemQty = function(idx) {
    if (inventoryItems[idx]) {
        inventoryItems[idx].countedQty = inventoryItems[idx].bookQty;
        saveInventoryState();
        renderInventoryTable();
        updateInventorySummary();
    }
};

window.resetInventoryCountsToZero = function() {
    inventoryItems.forEach(item => item.countedQty = 0);
    saveInventoryState();
    renderInventoryTable();
    updateInventorySummary();
};

window.loadRealisticInventoryScenario = function(scenarioType = 'SHORTAGE') {
    if (scenarioType === 'MATCHED') {
        inventoryItems.forEach(item => item.countedQty = item.bookQty);
    } else if (scenarioType === 'SHORTAGE') {
        // Realistic shortage scenario:
        // SKU-101: -4 pcs (damaged/missing)
        // SKU-103: -10 pcs (retail display shrinkage)
        inventoryItems.forEach(item => item.countedQty = item.bookQty);
        inventoryItems[0].countedQty = Math.max(0, inventoryItems[0].bookQty - 4); // 4 * 350 = 1,400
        inventoryItems[2].countedQty = Math.max(0, inventoryItems[2].bookQty - 10); // 10 * 220 = 2,200
        // Total shortage: 3,600 EGP
    } else if (scenarioType === 'SURPLUS') {
        // Realistic surplus scenario:
        // SKU-102: +2 pcs (supplier shipped extra)
        inventoryItems.forEach(item => item.countedQty = item.bookQty);
        inventoryItems[1].countedQty = inventoryItems[1].bookQty + 2; // 2 * 550 = 1,100
        // Total surplus: 1,100 EGP
    }
    saveInventoryState();
    renderInventoryTable();
    updateInventorySummary();
};

function calculateTotalPhysicalInventory() {
    return inventoryItems.reduce((sum, item) => sum + ((item.countedQty || 0) * item.unitCost), 0);
}

function calculateTotalBookInventory() {
    return inventoryItems.reduce((sum, item) => sum + (item.bookQty * item.unitCost), 0);
}

function updateInventorySummary() {
    const totalBook = calculateTotalBookInventory();
    const totalPhysical = calculateTotalPhysicalInventory();
    const diff = totalPhysical - totalBook;
    const absDiff = Math.abs(diff);

    const elBook = document.getElementById('inv-book-val');
    const elPhysical = document.getElementById('inv-physical-val');
    const elDiff = document.getElementById('inv-diff-val');
    const elStatusBadge = document.getElementById('inv-status-badge');
    const elResolutionBox = document.getElementById('inv-resolution-box');

    if (elBook) elBook.innerText = totalBook.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elPhysical) elPhysical.innerText = totalPhysical.toLocaleString(undefined, {minimumFractionDigits: 2});
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
        if (totalPhysical === 0) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200 text-slate-700';
            elStatusBadge.innerText = 'بانتظار الجرد الفعلي';
        } else if (absDiff < 0.01) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-500 text-white';
            elStatusBadge.innerText = 'المخزون مطابق 100% ✓';
        } else if (diff < 0) {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-rose-500 text-white';
            elStatusBadge.innerText = 'عجز بالمخزون: ' + absDiff.toLocaleString() + ' ج.م ⚠️';
        } else {
            elStatusBadge.className = 'text-xs font-bold px-3 py-1.5 rounded-full bg-blue-500 text-white';
            elStatusBadge.innerText = 'زيادة بالمخزون: ' + absDiff.toLocaleString() + ' ج.م ℹ️';
        }
    }

    if (elResolutionBox) {
        if (totalPhysical === 0) {
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 flex items-center gap-3">
                <span class="material-symbols-outlined text-2xl text-slate-400">inventory_2</span>
                <div>
                  <strong class="text-slate-800 block text-sm">ابدأ بحصر كميات الأصناف الفعلية الموجودة على رفوف المستودع:</strong>
                  أدخل الكمية الفعلية المحصورة لكل صنف بالجدول، أو اضغط زر السيناريوهات بالأعلى لتوليد حالة دراسية واقعية.
                </div>
              </div>
            `;
        } else if (absDiff < 0.01) {
            elResolutionBox.innerHTML = `
              <div class="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-2xl text-emerald-700">task_alt</span>
                  <div>
                    <strong class="text-sm block">محضر الجرد المخزني مطابق تماماً:</strong>
                    تطابقت قيمة المخزون الفعلي بالمستودع (${totalPhysical.toLocaleString()} ج.م) مع رصيد حساب المخزون بالدفاتر (1104). يمكنك اعتماد وطباعة محضر الجرد.
                  </div>
                </div>
                <button type="button" onclick="openPrintInventoryProtocol()" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                  <span class="material-symbols-outlined text-[16px]">print</span>
                  <span>طباعة محضر الجرد المخزني المعتمد</span>
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
                    <strong class="text-sm font-bold">اكتشاف عجز في المخزون السلعي بمبلغ (${absDiff.toLocaleString()} ج.م):</strong>
                  </div>
                  <span class="text-[11px] bg-rose-200 text-rose-900 font-bold px-2 py-0.5 rounded-full">يتطلب قيد تسوية بالدفاتر</span>
                </div>

                <div class="space-y-2 text-slate-800">
                  <span class="font-bold block">اختر المعالجة المحاسبية لفروقات وعجز المخزون:</span>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label class="p-3 bg-white border border-rose-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-rose-50/50 transition">
                      <input type="radio" name="inv_shortage_resp" value="COMPANY" ${invShortageResponsibility === 'COMPANY' ? 'checked' : ''} onchange="setInvShortageResp('COMPANY')" class="text-rose-600 focus:ring-0" />
                      <div>
                        <strong class="text-xs text-slate-900 block">1. عجز طبيعي مسموح به (هبوط/تلف طبيعي)</strong>
                        <span class="text-[10px] text-slate-500">حـ/ 5209 - تسوية وفروقات الجرد المخزني (مصروف تشغيلي)</span>
                      </div>
                    </label>

                    <label class="p-3 bg-white border border-rose-200 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-rose-50/50 transition">
                      <input type="radio" name="inv_shortage_resp" value="STOREKEEPER" ${invShortageResponsibility === 'STOREKEEPER' ? 'checked' : ''} onchange="setInvShortageResp('STOREKEEPER')" class="text-rose-600 focus:ring-0" />
                      <div>
                        <strong class="text-xs text-slate-900 block">2. عجز غير طبيعي محمل على أمين المستودع</strong>
                        <span class="text-[10px] text-slate-500">حـ/ 1105 - سلف وعُهد الموظفين (ذمم مدينة)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <div class="text-[11px] text-slate-600 font-medium">
                    القيد المحاسبي المقترح: <strong class="text-blue-900">من حـ/ ${invShortageResponsibility === 'COMPANY' ? '5209 تسوية وفروقات الجرد المخزني' : '1105 سلف وعُهد الموظفين (أمين المخزن)'}</strong> إلى <strong class="text-blue-900">حـ/ 1104 المخزون</strong> بمبلغ ${absDiff.toLocaleString()} ج.م
                  </div>
                  <button type="button" onclick="prepareInventoryShortageDraft(${absDiff})" class="bg-slate-900 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                    <span>إعداد مسودة قيد تسوية عجز المخزون بالدفاتر</span>
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
                    <strong class="text-sm font-bold">اكتشاف زيادة في المخزون السلعي بمبلغ (${absDiff.toLocaleString()} ج.م):</strong>
                  </div>
                  <span class="text-[11px] bg-blue-200 text-blue-900 font-bold px-2 py-0.5 rounded-full">يتطلب قيد تسوية بالدفاتر</span>
                </div>

                <p class="text-slate-700 font-normal">
                  تعتبر زيادة المخزون إيرادات عرضية أو تصحيحاً لخطأ في تسجيل أو تسليمات سابقة.
                  القيد المحاسبي المعتمد: <strong class="text-blue-900">من حـ/ 1104 المخزون</strong> إلى <strong class="text-blue-900">حـ/ 4201 إيرادات متنوعة (فروقات جرد المخزون)</strong> بمبلغ ${absDiff.toLocaleString()} ج.م.
                </p>

                <div class="pt-1 flex justify-end">
                  <button type="button" onclick="prepareInventorySurplusDraft(${absDiff})" class="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition cursor-pointer">
                    <span>إعداد مسودة قيد إثبات زيادة المخزون بالدفاتر</span>
                    <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            `;
        }
    }
}

window.setInvShortageResp = function(resp) {
    invShortageResponsibility = resp;
    updateInventorySummary();
};

window.prepareInventoryShortageDraft = function(amount) {
    const today = new Date().toISOString().split('T')[0];
    const isCompany = invShortageResponsibility === 'COMPANY';
    const drAccount = isCompany ? '5209' : '1105';

    const draft = {
        sourceModule: 'INVENTORY_COUNT',
        ref: 'INV-DIFF-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        title: 'قيد تسوية - إثبات عجز الجرد المخزني',
        desc: `تسوية عجز الجرد الفعلي للمخزون بموجب محضر الجرد المعتمد وتحميله على ${isCompany ? 'المنشأة (فروقات جرد)' : 'أمين المستودع (ذمم مدينة)'}`,
        amount: amount,
        lines: [
            { account: drAccount, debit: amount, credit: 0 },
            { account: '1104', debit: 0, credit: amount }
        ]
    };

    localStorage.setItem('acc_draft_journal_entry', JSON.stringify(draft));
    window.location.href = '../journal/index.html?mode=draft_inventory&amt=' + encodeURIComponent(amount);
};

window.prepareInventorySurplusDraft = function(amount) {
    const today = new Date().toISOString().split('T')[0];
    const draft = {
        sourceModule: 'INVENTORY_COUNT',
        ref: 'INV-SURP-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        title: 'قيد تسوية - إثبات زيادة الجرد المخزني',
        desc: 'إثبات زيادة المخزون السلعي بموجب محضر الجرد الفعلي وتحويلها لإيرادات متنوعة',
        amount: amount,
        lines: [
            { account: '1104', debit: amount, credit: 0 },
            { account: '4201', debit: 0, credit: amount }
        ]
    };

    localStorage.setItem('acc_draft_journal_entry', JSON.stringify(draft));
    window.location.href = '../journal/index.html?mode=draft_inventory&amt=' + encodeURIComponent(amount);
};

window.openPrintInventoryProtocol = function() {
    const modal = document.getElementById('inv-print-modal');
    const container = document.getElementById('inv-printable-content');
    if (!modal || !container) return;

    const comp = getCompanyProfile();
    const totalBook = calculateTotalBookInventory();
    const totalPhysical = calculateTotalPhysicalInventory();
    const diff = totalPhysical - totalBook;
    const absDiff = Math.abs(diff);
    const dateToday = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let wordsArabic = '';
    if (typeof tafqeetArabic === 'function') {
        wordsArabic = tafqeetArabic(totalPhysical);
    } else {
        wordsArabic = totalPhysical.toLocaleString() + ' جنيهاً مصرياً';
    }

    container.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div>
          <h1 class="text-xl font-black text-slate-900">${comp.name}</h1>
          <p class="text-xs text-slate-600 mt-1">${comp.sector || 'قطاع التجارة'} • المستودع الرئيسي (حـ/ 1104)</p>
          <p class="text-xs font-bold text-slate-800 mt-1">الإدارة المالية - لجنة الجرد السنوي والدوري للمخازن</p>
        </div>
        <div class="text-left">
          <span class="inline-block text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded-md font-mono">CNT-INV-${new Date().getFullYear()}</span>
          <p class="text-xs text-slate-500 mt-1">تاريخ الجرد: ${dateToday}</p>
        </div>
      </div>

      <div class="text-center my-4">
        <h2 class="text-lg font-black text-slate-900 border-b-2 border-double border-slate-400 inline-block pb-1">محضر جرد المخزون السلعي الفعلي (Physical Inventory Count Protocol)</h2>
        <p class="text-xs text-slate-600 mt-1.5 font-medium">مطابق لمعايير المحاسبة المصرية (EAS 2) وأحكام الرقابة على المخزون</p>
      </div>

      <p class="text-xs leading-relaxed text-slate-700 my-4 text-justify">
        في يوم <strong>${dateToday}</strong>، قامت لجنة الجرد المشكلة بقرار الإدارة المالية بحصر وعد الأصناف والبضائع بالمستودع الرئيسي بحضور أمين المستودع، وجاءت نتائج الحصر التفصيلية كما يلي:
      </p>

      <table class="w-full text-xs text-right border-collapse border border-slate-300 my-4">
        <thead>
          <tr class="bg-slate-100 font-bold border-b border-slate-300">
            <th class="p-2 border-r border-slate-300">كود الصنف</th>
            <th class="p-2 border-r border-slate-300">اسم الصنف والوصف</th>
            <th class="p-2 text-center border-r border-slate-300">الوحدة</th>
            <th class="p-2 text-center border-r border-slate-300">تكلفة الوحدة</th>
            <th class="p-2 text-center border-r border-slate-300">الرصيد الدفتري</th>
            <th class="p-2 text-center border-r border-slate-300">الرصيد الفعلي</th>
            <th class="p-2 text-center border-r border-slate-300">فرق الكمية</th>
            <th class="p-2 text-center">قيمة الفرق (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          ${inventoryItems.map(item => {
              const counted = item.countedQty ?? 0;
              const diffQty = counted - item.bookQty;
              const diffVal = diffQty * item.unitCost;
              return `
                <tr class="border-b border-slate-200">
                  <td class="p-2 border-r border-slate-200 font-mono font-bold">${item.sku}</td>
                  <td class="p-2 border-r border-slate-200 font-bold">${item.name}</td>
                  <td class="p-2 text-center border-r border-slate-200">${item.unit}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono">${item.unitCost.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono">${item.bookQty.toLocaleString()}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${counted.toLocaleString()}</td>
                  <td class="p-2 text-center border-r border-slate-200 font-mono font-bold ${diffQty < 0 ? 'text-rose-700' : (diffQty > 0 ? 'text-blue-700' : 'text-slate-500')}">
                    ${diffQty !== 0 ? (diffQty > 0 ? '+' : '') + diffQty : '0'}
                  </td>
                  <td class="p-2 text-center font-mono font-bold ${diffVal < 0 ? 'text-rose-700' : (diffVal > 0 ? 'text-blue-700' : 'text-slate-500')}">
                    ${diffVal !== 0 ? (diffVal > 0 ? '+' : '') + diffVal.toLocaleString() : '0.00'}
                  </td>
                </tr>
              `;
          }).join('')}
        </tbody>
        <tfoot class="bg-slate-100 font-black border-t-2 border-slate-800">
          <tr>
            <td colspan="4" class="p-2.5 text-right border-r border-slate-300">إجمالي قيمة المخزون الفعلي المحصور:</td>
            <td class="p-2.5 text-center font-mono border-r border-slate-300">${totalBook.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td class="p-2.5 text-center font-mono text-sm text-blue-900 border-r border-slate-300" colspan="2">${totalPhysical.toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م</td>
            <td class="p-2.5 text-center font-mono font-black ${diff < 0 ? 'text-rose-700' : (diff > 0 ? 'text-blue-700' : 'text-emerald-700')}">
              ${diff !== 0 ? (diff > 0 ? '+' : '') + diff.toLocaleString() : '0.00'}
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-serif text-center my-3">
        فقط وقدره <strong>${wordsArabic}</strong> لا غير.
      </div>

      <!-- Committee Signatures -->
      <div class="grid grid-cols-3 gap-6 pt-8 mt-6 border-t border-slate-300 text-center text-xs">
        <div>
          <span class="text-slate-500 block mb-8">أمين المستودع (المسؤول):</span>
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

window.closePrintInventoryProtocol = function() {
    const modal = document.getElementById('inv-print-modal');
    if (modal) modal.classList.add('hidden');
};

window.initInventoryCount = initInventoryCount;
