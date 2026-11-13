// ================= EGYPTIAN TAX RETURNS SIMULATOR (_TAX) =================
// محاكي الإقرارات الضريبية المصرية - مطابق لقانون ضريبة القيمة المضافة 67 لسنة 2016 وقانون الإجراءات الضريبية الموحد 206 لسنة 2020

let currentTaxPeriod = '2026-01'; // Default: شهر يناير 2026
let activeTaxTab = 'vat_form10'; // 'vat_form10' or 'wht_form41'

function getCompanyTaxProfile() {
    try {
        const raw = localStorage.getItem('sim_company_profile');
        if (raw) {
            const p = JSON.parse(raw);
            return {
                name: p.name || 'شركة النيل للتجارة والتوزيع (ش.م.م)',
                taxId: p.taxId || '482-910-345',
                vatRegNo: p.vatRegNo || 'EG-482910345-TAX',
                fileNo: p.fileNo || '12/04/892/01',
                taxOffice: p.taxOffice || 'مأمورية ضرائب الشركات المساهمة - القاهرة رابع',
                address: p.address || 'المنطقة الصناعية الثالثة - 6 أكتوبر - الجيزة'
            };
        }
    } catch(e) {}
    return {
        name: 'شركة النيل للتجارة والتوزيع (ش.م.م)',
        taxId: '482-910-345',
        vatRegNo: 'EG-482910345-TAX',
        fileNo: '12/04/892/01',
        taxOffice: 'مأمورية ضرائب الشركات المساهمة - القاهرة رابع',
        address: 'المنطقة الصناعية الثالثة - 6 أكتوبر - الجيزة'
    };
}

function getTaxDataFromLedger() {
    let balances = {};
    if (typeof calculateBalances === 'function') {
        balances = calculateBalances();
    }

    // 1. Output VAT (2102) & Sales (4101)
    let outputVat = Math.abs(balances['2102'] || 0);
    let salesBase = Math.abs(balances['4101'] || 0);

    // 2. Input VAT (1106) & Purchases (1104 or Expenses)
    let inputVat = Math.abs(balances['1106'] || 0);
    let purchaseBase = Math.abs(balances['1104'] || 0);

    // إذا كانت المبيعات الدفترية غير مسجلة لكن توجد ضريبة مخرجات مسجلة، يتم اشتقاق أساس البيع
    if (salesBase === 0 && outputVat > 0) {
        salesBase = Math.round((outputVat / 0.14) * 100) / 100;
    }
    // وإذا كانت المشتريات غير مسجلة لكن توجد ضريبة مدخلات، يتم اشتقاق أساس المشتريات
    if (purchaseBase === 0 && inputVat > 0) {
        purchaseBase = Math.round((inputVat / 0.14) * 100) / 100;
    }

    const netVatPayable = outputVat - inputVat;

    // Withholding Tax (WHT - نموذج 41)
    const whtRecords = [
        { supplier: 'شركة الأهرام للتوريدات التجارية', taxId: '102-394-821', type: 'goods', desc: 'توريدات بضاعة وخامات', rate: 1, base: 120000, tax: 1200, date: '2026-01-18' },
        { supplier: 'الشركة المصرية للصيانة والتشغيل', taxId: '209-481-912', type: 'services', desc: 'خدمات صيانة أجهزة وشبكات', rate: 3, base: 35000, tax: 1050, date: '2026-01-22' },
        { supplier: 'مكتب الدكتور سامح وشركاه للمحاسبة', taxId: '318-772-109', type: 'professional', desc: 'استشارات مهنية وضريبية', rate: 5, base: 25000, tax: 1250, date: '2026-01-28' },
        { supplier: 'مؤسسة الدلتا للشحن والتوزيع', taxId: '419-832-601', type: 'services', desc: 'خدمات نقل وتفريغ بضائع', rate: 3, base: 18000, tax: 540, date: '2026-01-30' }
    ];

    const totalWhtBase = whtRecords.reduce((sum, r) => sum + r.base, 0);
    const totalWhtTax = whtRecords.reduce((sum, r) => sum + r.tax, 0);

    return {
        salesBase,
        outputVat,
        purchaseBase,
        inputVat,
        netVatPayable,
        whtRecords,
        totalWhtBase,
        totalWhtTax
    };
}

function initTaxReturns() {
    renderTaxViews();
}

function switchTaxTab(tab) {
    activeTaxTab = tab;
    const btnVat = document.getElementById('tab-btn-vat');
    const btnWht = document.getElementById('tab-btn-wht');
    const viewVat = document.getElementById('tax-view-vat');
    const viewWht = document.getElementById('tax-view-wht');

    if (tab === 'vat_form10') {
        if (btnVat) btnVat.className = 'flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer';
        if (btnWht) btnWht.className = 'flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center justify-center gap-2 cursor-pointer';
        if (viewVat) viewVat.classList.remove('hidden');
        if (viewWht) viewWht.classList.add('hidden');
    } else {
        if (btnVat) btnVat.className = 'flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition flex items-center justify-center gap-2 cursor-pointer';
        if (btnWht) btnWht.className = 'flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white shadow-xs transition flex items-center justify-center gap-2 cursor-pointer';
        if (viewVat) viewVat.classList.add('hidden');
        if (viewWht) viewWht.classList.remove('hidden');
    }
}

function renderTaxViews() {
    const data = getTaxDataFromLedger();

    // 1. KPI Cards
    const elVatSales = document.getElementById('kpi-vat-sales');
    const elVatOutput = document.getElementById('kpi-vat-output');
    const elVatInput = document.getElementById('kpi-vat-input');
    const elVatNet = document.getElementById('kpi-vat-net');

    if (elVatSales) elVatSales.innerText = data.salesBase.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elVatOutput) elVatOutput.innerText = data.outputVat.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elVatInput) elVatInput.innerText = data.inputVat.toLocaleString(undefined, {minimumFractionDigits: 2});
    if (elVatNet) {
        elVatNet.innerText = data.netVatPayable.toLocaleString(undefined, {minimumFractionDigits: 2});
        if (data.netVatPayable >= 0) {
            elVatNet.className = 'text-xl font-mono font-black text-rose-700';
        } else {
            elVatNet.className = 'text-xl font-mono font-black text-emerald-700';
        }
    }

    // 2. VAT Form 10 Body
    renderVatTable(data);

    // 3. WHT Form 41 Body
    renderWhtTable(data);
}

function renderVatTable(data) {
    const tbody = document.getElementById('vat-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = `
      <!-- Part 1: Sales / Outputs -->
      <tr class="bg-blue-50/50 font-bold border-b border-blue-100">
        <td colspan="5" class="p-3 text-blue-950 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>أولاً: مبيعات السلع والخدمات المحلية والصادرات (الضريبة المحصلة / المخرجات)</span>
        </td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="p-3">1. مبيعات سلع عامة خاضعة للسعر العام (14%)</td>
        <td class="p-3 text-center font-mono font-bold text-slate-800">${data.salesBase.toLocaleString()} ج.م</td>
        <td class="p-3 text-center font-mono font-bold text-blue-900">14%</td>
        <td class="p-3 text-center font-mono font-bold text-slate-900">${data.outputVat.toLocaleString()} ج.م</td>
        <td class="p-3 text-center text-[10px] text-slate-500">حـ/ 2102 (دائن)</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="p-3">2. مبيعات صادرات للخارج (سعر الصفر 0%)</td>
        <td class="p-3 text-center font-mono text-slate-500">0.00 ج.م</td>
        <td class="p-3 text-center font-mono text-slate-500">0%</td>
        <td class="p-3 text-center font-mono text-slate-500">0.00 ج.م</td>
        <td class="p-3 text-center text-[10px] text-slate-500">معفاة بقوة القانون</td>
      </tr>
      <tr class="bg-slate-100/70 font-bold border-b border-slate-200">
        <td class="p-3 text-slate-800">إجمالي ضريبة المخرجات المستحقة:</td>
        <td class="p-3 text-center font-mono text-slate-900">${data.salesBase.toLocaleString()} ج.م</td>
        <td class="p-3 text-center font-mono">-</td>
        <td class="p-3 text-center font-mono text-blue-900 text-sm font-black">${data.outputVat.toLocaleString()} ج.م</td>
        <td class="p-3 text-center text-xs text-blue-800 font-sans font-bold">إجمالي المخرجات (أ)</td>
      </tr>

      <!-- Part 2: Purchases / Inputs -->
      <tr class="bg-emerald-50/50 font-bold border-b border-emerald-100">
        <td colspan="5" class="p-3 text-emerald-950 flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>ثانياً: مشتريات السلع والخدمات المحلية والمستوردة (الضريبة القابلة للخصم / المدخلات)</span>
        </td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="p-3">3. مشتريات سلع وخامات محلية خاضعة للسعر العام (14%)</td>
        <td class="p-3 text-center font-mono font-bold text-slate-800">${data.purchaseBase.toLocaleString()} ج.م</td>
        <td class="p-3 text-center font-mono font-bold text-emerald-800">14%</td>
        <td class="p-3 text-center font-mono font-bold text-emerald-700">${data.inputVat.toLocaleString()} ج.م</td>
        <td class="p-3 text-center text-[10px] text-slate-500">حـ/ 1106 (مدين)</td>
      </tr>
      <tr class="border-b border-slate-100 hover:bg-slate-50 transition">
        <td class="p-3">4. مشتريات أصول ومعدات رأسمالية مستردة الضريبة</td>
        <td class="p-3 text-center font-mono text-slate-500">0.00 ج.م</td>
        <td class="p-3 text-center font-mono text-slate-500">14%</td>
        <td class="p-3 text-center font-mono text-slate-500">0.00 ج.م</td>
        <td class="p-3 text-center text-[10px] text-slate-500">رد ضريبة رأسمالية</td>
      </tr>
      <tr class="bg-slate-100/70 font-bold border-b border-slate-200">
        <td class="p-3 text-slate-800">إجمالي ضريبة المدخلات القابلة للخصم:</td>
        <td class="p-3 text-center font-mono text-slate-900">${data.purchaseBase.toLocaleString()} ج.م</td>
        <td class="p-3 text-center font-mono">-</td>
        <td class="p-3 text-center font-mono text-emerald-800 text-sm font-black">${data.inputVat.toLocaleString()} ج.م</td>
        <td class="p-3 text-center text-xs text-emerald-800 font-sans font-bold">إجمالي المدخلات (ب)</td>
      </tr>

      <!-- Part 3: Net Tax Result -->
      <tr class="bg-slate-900 text-white font-bold text-sm">
        <td class="p-3.5">صافي الضريبة الواجبة السداد للمصلحة (أ - ب):</td>
        <td colspan="2" class="p-3.5 text-center text-xs text-slate-300 font-sans font-normal">
          ${data.netVatPayable >= 0 ? 'مستحق السداد لمأمورية الضرائب المختصة' : 'رصيد دائن يُرحل للفترات التالية'}
        </td>
        <td class="p-3.5 text-center font-mono text-base ${data.netVatPayable >= 0 ? 'text-amber-400' : 'text-emerald-400'} font-black">
          ${Math.abs(data.netVatPayable).toLocaleString()} ج.م
        </td>
        <td class="p-3.5 text-center">
          <span class="text-[10px] px-2 py-1 rounded ${data.netVatPayable >= 0 ? 'bg-amber-400 text-slate-900' : 'bg-emerald-500 text-white'} font-bold font-sans">
            ${data.netVatPayable >= 0 ? 'واجب السداد ⚠️' : 'رصيد دائن ✓'}
          </span>
        </td>
      </tr>
    `;
}

function renderWhtTable(data) {
    const tbody = document.getElementById('wht-table-tbody');
    const totalBaseEl = document.getElementById('wht-total-base');
    const totalTaxEl = document.getElementById('wht-total-tax');
    if (!tbody) return;

    tbody.innerHTML = '';
    data.whtRecords.forEach((r, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
        tr.innerHTML = `
            <td class="p-3">
                <strong class="text-xs text-slate-900 block">${r.supplier}</strong>
                <span class="text-[10px] text-slate-400 font-mono">س.ض: ${r.taxId}</span>
            </td>
            <td class="p-3 text-slate-700 text-xs">${r.desc}</td>
            <td class="p-3 text-center font-mono text-xs font-bold text-slate-800">${r.date}</td>
            <td class="p-3 text-center font-mono font-bold text-xs text-slate-800">${r.base.toLocaleString()} ج.م</td>
            <td class="p-3 text-center">
                <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded ${r.rate === 1 ? 'bg-blue-100 text-blue-900' : (r.rate === 3 ? 'bg-purple-100 text-purple-900' : 'bg-amber-100 text-amber-900')}">
                    ${r.rate}%
                </span>
            </td>
            <td class="p-3 text-center font-mono font-black text-xs text-rose-800">${r.tax.toLocaleString()} ج.م</td>
        `;
        tbody.appendChild(tr);
    });

    if (totalBaseEl) totalBaseEl.innerText = data.totalWhtBase.toLocaleString() + ' ج.م';
    if (totalTaxEl) totalTaxEl.innerText = data.totalWhtTax.toLocaleString() + ' ج.م';
}

window.prepareVatClearingDraft = function() {
    const data = getTaxDataFromLedger();
    const today = new Date().toISOString().split('T')[0];
    const net = Number(data.netVatPayable) || 0;
    const absDiff = Math.abs(net);

    // Accounting Entry:
    // حالة 1: ضريبة المخرجات أكبر (net > 0) -> سداد صافي المستحق للمصلحة
    //   من حـ/ ضريبة القيمة المضافة مخرجات (2102) [Output VAT]
    //   إلى مذكورين:
    //     حـ/ ضريبة القيمة المضافة مدخلات (1106) [Input VAT]
    //     حـ/ البنك (1102) [سداد الفارق للمصلحة]
    //
    // حالة 2: ضريبة المدخلات أكبر (net < 0) -> رصيد ضريبة دائن مسترد لصالح الشركة
    //   من مذكورين:
    //     حـ/ ضريبة القيمة المضافة مخرجات (2102) [إقفال المخرجات]
    //     حـ/ مصلحة الضرائب - رصيد ضريبة مسترد / جاري مدين (1107) [الرصيد الدائن المسترد]
    //   إلى حـ/ ضريبة القيمة المضافة مدخلات (1106) [إقفال كامل المدخلات]
    //
    // حالة 3: تطابق تام (net === 0) -> مقاصة متساوية دون سداد أو استرداد
    let lines = [];
    let title = 'قيد تسوية وإقفال ضريبة القيمة المضافة (نموذج 10)';
    let desc = '';

    if (net > 0) {
        desc = `مقاصة ضريبة المدخلات (1106) مع ضريبة المخرجات (2102) وسداد صافي المستحق لمصلحة الضرائب (${absDiff.toLocaleString()} ج.م) عن الفترة ${currentTaxPeriod}`;
        lines = [
            { account: '2102', debit: data.outputVat, credit: 0 },
            { account: '1106', debit: 0, credit: data.inputVat },
            { account: '1102', debit: 0, credit: absDiff }
        ];
    } else if (net < 0) {
        desc = `مقاصة ضريبة المدخلات مع المخرجات وإثبات رصيد ضريبي دائن مسترد لصالح المنشأة (${absDiff.toLocaleString()} ج.م) عن الفترة ${currentTaxPeriod}`;
        lines = [
            { account: '2102', debit: data.outputVat, credit: 0 },
            { account: '1107', debit: absDiff, credit: 0 },
            { account: '1106', debit: 0, credit: data.inputVat }
        ];
    } else {
        desc = `مقاصة متطابقة لضريبة المدخلات مع المخرجات دون فارق سداد عن الفترة ${currentTaxPeriod}`;
        lines = [
            { account: '2102', debit: data.outputVat, credit: 0 },
            { account: '1106', debit: 0, credit: data.inputVat }
        ];
    }

    const draft = {
        sourceModule: 'VAT_CLEARING',
        ref: 'TAX-VAT-' + Math.floor(1000 + Math.random() * 9000),
        date: today,
        title: title,
        desc: desc,
        amount: absDiff,
        lines: lines
    };

    localStorage.setItem('acc_draft_journal_entry', JSON.stringify(draft));
    window.location.href = '../journal/index.html?mode=draft_vat&amt=' + encodeURIComponent(absDiff);
};

window.openPrintVatForm10 = function() {
    const modal = document.getElementById('tax-print-modal');
    const container = document.getElementById('tax-printable-content');
    if (!modal || !container) return;

    const comp = getCompanyTaxProfile();
    const data = getTaxDataFromLedger();
    const dateToday = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let words = '';
    if (typeof tafqeetArabic === 'function') {
        words = tafqeetArabic(Math.abs(data.netVatPayable));
    } else {
        words = Math.abs(data.netVatPayable).toLocaleString() + ' جنيهاً مصرياً';
    }

    container.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif text-xl font-bold">
            ETA
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-900">وزارة المالية • مصلحة الضرائب المصرية</h1>
            <p class="text-xs text-slate-600">منظومة الإجراءات الضريبية المميكنة الرئيسية (Core Taxation System)</p>
            <p class="text-xs font-bold text-slate-800">إقرار ضريبة القيمة المضافة الشهري - نموذج (10) ض.ق.م</p>
          </div>
        </div>
        <div class="text-left font-mono">
          <span class="inline-block text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded">FORM-10-VAT</span>
          <p class="text-xs text-slate-500 mt-1">الفترة الضريبية: يناير 2026</p>
        </div>
      </div>

      <!-- Taxpayer Info Card -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
        <div>
          <span class="text-slate-500 block text-[10px]">اسم المسجل / الممول:</span>
          <strong class="text-slate-900 block font-bold">${comp.name}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">رقم التسجيل الضريبي:</span>
          <strong class="font-mono text-slate-900 block font-bold">${comp.taxId}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">المأمورية المختصة:</span>
          <strong class="text-slate-900 block">${comp.taxOffice}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">رقم الملف الضريبي:</span>
          <strong class="font-mono text-slate-900 block font-bold">${comp.fileNo}</strong>
        </div>
      </div>

      <!-- Tax Declaration Calculation Table -->
      <table class="w-full text-xs text-right border-collapse border border-slate-300 my-4">
        <thead>
          <tr class="bg-slate-100 font-bold border-b border-slate-300">
            <th class="p-2 border-r border-slate-300">البيــــــــــــــــان</th>
            <th class="p-2 text-center border-r border-slate-300">القيمة الخاضعة (ج.م)</th>
            <th class="p-2 text-center border-r border-slate-300">فئة الضريبة</th>
            <th class="p-2 text-center">الضريبة المستحقة / المخصومة (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-slate-200">
            <td class="p-2 border-r border-slate-200 font-bold">1. مبيعات سلع وخدمات محلية عامة</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${data.salesBase.toLocaleString()}</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">14%</td>
            <td class="p-2 text-center font-mono font-bold text-blue-900">${data.outputVat.toLocaleString()}</td>
          </tr>
          <tr class="border-b border-slate-200">
            <td class="p-2 border-r border-slate-200">2. مبيعات صادرات ومعاملات صفرية</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">0.00</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">0%</td>
            <td class="p-2 text-center font-mono">0.00</td>
          </tr>
          <tr class="bg-slate-50 font-bold border-b-2 border-slate-400">
            <td class="p-2 border-r border-slate-300">إجمالي ضريبة المخرجات المستحقة (البند أ):</td>
            <td class="p-2 text-center border-r border-slate-300 font-mono">${data.salesBase.toLocaleString()}</td>
            <td class="p-2 text-center border-r border-slate-300">-</td>
            <td class="p-2 text-center font-mono font-black text-blue-950">${data.outputVat.toLocaleString()}</td>
          </tr>
          <tr class="border-b border-slate-200">
            <td class="p-2 border-r border-slate-200 font-bold">3. مشتريات خاضعة للضريبة قابلة للخصم</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${data.purchaseBase.toLocaleString()}</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">14%</td>
            <td class="p-2 text-center font-mono font-bold text-emerald-800">${data.inputVat.toLocaleString()}</td>
          </tr>
          <tr class="border-b border-slate-200">
            <td class="p-2 border-r border-slate-200">4. ضريبة مردودات مبيعات وتعديلات سابقة</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">0.00</td>
            <td class="p-2 text-center border-r border-slate-200 font-mono">-</td>
            <td class="p-2 text-center font-mono">0.00</td>
          </tr>
          <tr class="bg-slate-50 font-bold border-b-2 border-slate-800">
            <td class="p-2 border-r border-slate-300">إجمالي ضريبة المدخلات القابلة للخصم (البند ب):</td>
            <td class="p-2 text-center border-r border-slate-300 font-mono">${data.purchaseBase.toLocaleString()}</td>
            <td class="p-2 text-center border-r border-slate-300">-</td>
            <td class="p-2 text-center font-mono font-black text-emerald-950">${data.inputVat.toLocaleString()}</td>
          </tr>
        </tbody>
        <tfoot class="bg-slate-100 font-black border-t-2 border-slate-900">
          <tr>
            <td colspan="3" class="p-2.5 text-right border-r border-slate-300 text-sm">
              صافي الضريبة المستحقة واجبة السداد لمصلحة الضرائب المصرية:
            </td>
            <td class="p-2.5 text-center font-mono text-base text-rose-800">
              ${Math.abs(data.netVatPayable).toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-serif text-center my-4">
        المبلغ بالحروف: فقط وقدره <strong>${words}</strong> لا غير.
      </div>

      <!-- Legal Declaration & Signatures -->
      <div class="text-[11px] text-slate-600 leading-relaxed border-t border-slate-200 pt-3">
        إقرار: أقر أنا الموقع أدناه بصفتي المحاسب المالي المعتمد للمنشأة بصحة كافة البيانات المدرجة بهذا الإقرار ومطابقتها للسجلات والدفاتر المنتظمة والفواتير الإلكترونية المعتمدة.
      </div>

      <div class="grid grid-cols-3 gap-6 pt-6 mt-4 border-t border-slate-300 text-center text-xs">
        <div>
          <span class="text-slate-500 block mb-6">المحاسب المسؤول:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">أحمد محمود فتحي (محاسب عام)</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-6">المراجع الخارجي / المحاسب القانوني:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">سجل محاسبين ومراجعين (م.م)</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-6">المدير المالي والاعتماد:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">خاتم المنشأة والاعتماد الرسمي</strong>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
};

window.openPrintWhtForm41 = function() {
    const modal = document.getElementById('tax-print-modal');
    const container = document.getElementById('tax-printable-content');
    if (!modal || !container) return;

    const comp = getCompanyTaxProfile();
    const data = getTaxDataFromLedger();
    const dateToday = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let words = '';
    if (typeof tafqeetArabic === 'function') {
        words = tafqeetArabic(data.totalWhtTax);
    } else {
        words = data.totalWhtTax.toLocaleString() + ' جنيهاً مصرياً';
    }

    container.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-serif text-xl font-bold">
            ETA
          </div>
          <div>
            <h1 class="text-lg font-black text-slate-900">وزارة المالية • مصلحة الضرائب المصرية</h1>
            <p class="text-xs text-slate-600">الإدارة العامة لتجميع نماذج الخصم والتحصيل تحت حساب الضريبة</p>
            <p class="text-xs font-bold text-slate-800">إشعار إقرار الخصم والتحصيل الربع سنوي - نموذج (41) ضرائب</p>
          </div>
        </div>
        <div class="text-left font-mono">
          <span class="inline-block text-xs bg-slate-900 text-white font-bold px-3 py-1 rounded">FORM-41-WHT</span>
          <p class="text-xs text-slate-500 mt-1">الربع الأول (Q1 - 2026)</p>
        </div>
      </div>

      <!-- Taxpayer Info Card -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
        <div>
          <span class="text-slate-500 block text-[10px]">الجهة الحاجزة / الممول:</span>
          <strong class="text-slate-900 block font-bold">${comp.name}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">رقم التسجيل الضريبي:</span>
          <strong class="font-mono text-slate-900 block font-bold">${comp.taxId}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">المأمورية المختصة:</span>
          <strong class="text-slate-900 block">${comp.taxOffice}</strong>
        </div>
        <div>
          <span class="text-slate-500 block text-[10px]">عنوان المركز الرئيسي:</span>
          <strong class="text-slate-900 block">${comp.address}</strong>
        </div>
      </div>

      <!-- WHT Table -->
      <table class="w-full text-xs text-right border-collapse border border-slate-300 my-4">
        <thead>
          <tr class="bg-slate-100 font-bold border-b border-slate-300">
            <th class="p-2 border-r border-slate-300">اسم الممول المخصوم منه (المورد)</th>
            <th class="p-2 text-center border-r border-slate-300">رقم التسجيل</th>
            <th class="p-2 border-r border-slate-300">طبيعة المعاملة</th>
            <th class="p-2 text-center border-r border-slate-300">تاريخ التعامل</th>
            <th class="p-2 text-center border-r border-slate-300">القيمة الأساسية</th>
            <th class="p-2 text-center border-r border-slate-300">النسبة</th>
            <th class="p-2 text-center">الضريبة المخصومة (ج.م)</th>
          </tr>
        </thead>
        <tbody>
          ${data.whtRecords.map(r => `
            <tr class="border-b border-slate-200">
              <td class="p-2 border-r border-slate-200 font-bold">${r.supplier}</td>
              <td class="p-2 text-center border-r border-slate-200 font-mono">${r.taxId}</td>
              <td class="p-2 border-r border-slate-200">${r.desc}</td>
              <td class="p-2 text-center border-r border-slate-200 font-mono">${r.date}</td>
              <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${r.base.toLocaleString()}</td>
              <td class="p-2 text-center border-r border-slate-200 font-mono font-bold">${r.rate}%</td>
              <td class="p-2 text-center font-mono font-bold text-rose-800">${r.tax.toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot class="bg-slate-100 font-black border-t-2 border-slate-800">
          <tr>
            <td colspan="4" class="p-2.5 text-right border-r border-slate-300 text-sm">
              إجمالي مبالغ التعامل والضرائب المستقطعة للتوريد للمصلحة:
            </td>
            <td class="p-2.5 text-center font-mono border-r border-slate-300 font-bold">
              ${data.totalWhtBase.toLocaleString()} ج.م
            </td>
            <td class="p-2.5 text-center border-r border-slate-300">-</td>
            <td class="p-2.5 text-center font-mono text-base text-rose-800">
              ${data.totalWhtTax.toLocaleString(undefined, {minimumFractionDigits: 2})} ج.م
            </td>
          </tr>
        </tfoot>
      </table>

      <div class="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-serif text-center my-4">
        فقط وقدره <strong>${words}</strong> لا غير.
      </div>

      <div class="grid grid-cols-3 gap-6 pt-6 mt-4 border-t border-slate-300 text-center text-xs">
        <div>
          <span class="text-slate-500 block mb-6">مسؤول قسم الضرائب:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">توقيع المختص</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-6">رئيس الحسابات:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">اعتماد المطابقة الدفترية</strong>
        </div>
        <div>
          <span class="text-slate-500 block mb-6">المدير المالي:</span>
          <strong class="border-t border-slate-400 pt-1 block text-slate-800">اعتماد التوريد البنكي</strong>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
};

window.closePrintTaxModal = function() {
    const modal = document.getElementById('tax-print-modal');
    if (modal) modal.classList.add('hidden');
};

window.initTaxReturns = initTaxReturns;
window.switchTaxTab = switchTaxTab;
