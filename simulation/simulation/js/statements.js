// ================= FINANCIAL STATEMENTS CONTROLLER =================
// 100% Aligned with Generator Accounting & FP&A Logic

function formatEGP(val) {
    return Number(val || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

window.switchStatementTab = function(tab) {
    const tabs = ['is', 'bs', 'cf'];
    tabs.forEach(t => {
        const view = document.getElementById('stmt-view-' + t);
        const btn = document.getElementById('tab-btn-' + t);
        if (view) {
            if (t === tab) {
                view.classList.remove('hidden');
            } else {
                view.classList.add('hidden');
            }
        }
        if (btn) {
            if (t === tab) {
                btn.className = 'tab-stmt-btn active px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white shadow-xs transition flex items-center gap-1.5 whitespace-nowrap';
            } else {
                btn.className = 'tab-stmt-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 transition flex items-center gap-1.5 whitespace-nowrap';
            }
        }
    });
};

function updateStatements() {
    const balances = (typeof calculateBalances === 'function') ? calculateBalances() : {};
    const coaMap = (typeof COA !== 'undefined') ? COA : {};
    const journal = (typeof getStudentJournal === 'function') ? getStudentJournal() : (window.studentJournal || []);
    const postedJournal = journal.filter(j => j.status === 'posted');

    // Categorization matching Generator logic
    let rev = 0, contraRev = 0, cogs = 0, contraExp = 0, exp = 0;
    let assets = 0, contraAssets = 0, liab = 0, equity = 0;

    let revRows = [], contraRevRows = [], cogsRows = [], contraExpRows = [], expRows = [];
    let assetRows = [], contraAssetRows = [], liabRows = [], eqRows = [];

    Object.keys(coaMap).forEach(k => {
        const raw = balances[k] || 0; // (debit - credit)
        const t = coaMap[k].type;
        const name = coaMap[k].name;

        // Normal balance conversion
        // Asset, Expense, Contra Revenue: normal Dr = raw
        // Liability, Equity, Revenue, Contra Asset, Contra Expense: normal Cr = -raw
        let closing = 0;
        if (['Asset', 'Expense', 'Contra Revenue'].includes(t)) {
            closing = raw;
        } else {
            closing = -raw;
        }

        if (Math.abs(closing) < 0.001) return; // Skip 0 balance accounts

        if (t === 'Revenue') {
            rev += closing;
            revRows.push({ code: k, name, amount: closing });
        } else if (t === 'Contra Revenue') {
            contraRev += closing;
            contraRevRows.push({ code: k, name, amount: closing });
        } else if (k === '5101') {
            cogs += closing;
            cogsRows.push({ code: k, name, amount: closing });
        } else if (t === 'Contra Expense') {
            contraExp += closing;
            contraExpRows.push({ code: k, name, amount: closing });
        } else if (t === 'Expense') {
            exp += closing;
            expRows.push({ code: k, name, amount: closing });
        } else if (t === 'Asset') {
            assets += closing;
            assetRows.push({ code: k, name, amount: closing });
        } else if (t === 'Contra Asset') {
            contraAssets += closing;
            contraAssetRows.push({ code: k, name, amount: closing });
        } else if (t === 'Liability') {
            liab += closing;
            liabRows.push({ code: k, name, amount: closing });
        } else if (t === 'Equity') {
            equity += closing;
            eqRows.push({ code: k, name, amount: closing });
        }
    });

    const netRev = rev - contraRev;
    const netCogs = cogs - contraExp;
    const grossProfit = netRev - netCogs;
    const netIncome = grossProfit - exp;
    const totalAssets = assets - contraAssets;
    const totalEquity = equity + netIncome;
    const totalLiabEquity = liab + totalEquity;
    const diff = Math.abs(totalAssets - totalLiabEquity);
    const isBalanced = diff < 1.0;

    // 1. Render Validation Banner
    const valTitle = document.getElementById('fs-val-title');
    const valDesc = document.getElementById('fs-val-desc');
    const valBadge = document.getElementById('fs-val-badge');
    const banner = document.getElementById('fs-validation-banner');

    if (valBadge) {
        if (postedJournal.length === 0) {
            valBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300';
            valBadge.innerText = 'بانتظار ترحيل القيود (0.00 ج.م)';
            if (valTitle) valTitle.innerText = 'البيئة جاهزة ونقية تماماً للبدء';
            if (valDesc) valDesc.innerText = 'سجل أول قيد في دفتر اليومية وقم بترحيله لتشاهد تحديث القوائم المالية آلياً.';
            if (banner) banner.className = 'p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-50 border-slate-200 text-slate-900';
        } else if (isBalanced) {
            valBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
            valBadge.innerText = 'الميزانية متزنة 100% ✓';
            if (valTitle) valTitle.innerText = 'اتزان المعادلة المحاسبية معتمد';
            if (valDesc) valDesc.innerText = `إجمالي الأصول (${formatEGP(totalAssets)}) = إجمالي الالتزامات وحقوق الملكية (${formatEGP(totalLiabEquity)}). الفارق: 0.00 ج.م`;
            if (banner) banner.className = 'p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-emerald-50 border-emerald-200 text-emerald-950';
        } else {
            valBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300';
            valBadge.innerText = 'يوجد فارق توازن (' + formatEGP(diff) + ' ج.م)';
            if (valTitle) valTitle.innerText = 'تنبيه محاسبي: عدم اتزان الميزانية';
            if (valDesc) valDesc.innerText = 'راجع ميزان المراجعة وقيود الترحيل غير المتزنة.';
            if (banner) banner.className = 'p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-rose-50 border-rose-200 text-rose-950';
        }
    }

    // 2. Render Income Statement
    const isContainer = document.getElementById('is-container');
    if (isContainer) {
        if (postedJournal.length === 0) {
            isContainer.innerHTML = '<div class="py-12 text-center text-slate-400 font-medium text-xs sm:text-sm">لا توجد حركات إيرادات أو مصروفات مسجلة حتى الآن.<br><span class="text-[11px] text-slate-500 mt-1 inline-block">ستظهر بنود قائمة الدخل آلياً بمجرد ترحيل فواتير البيع والشراء والمصروفات.</span></div>';
        } else {
            let isHtml = `
              <div class="space-y-4 text-xs sm:text-sm">
                <!-- Revenues Section -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>1. الإيرادات التشغيلية (Revenues)</span>
                    <span class="font-mono">${formatEGP(rev)}</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${revRows.map(r => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">${formatEGP(r.amount)}</span>
                      </div>
                    `).join('')}
                    ${contraRevRows.map(r => `
                      <div class="flex justify-between py-1.5 text-rose-600">
                        <span>يخصم: ${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">(${formatEGP(r.amount)})</span>
                      </div>
                    `).join('')}
                    <div class="flex justify-between py-2 font-bold text-slate-900 border-t border-slate-200">
                      <span>صافي إيرادات المبيعات (Net Revenue)</span>
                      <span class="font-mono text-blue-900">${formatEGP(netRev)}</span>
                    </div>
                  </div>
                </div>

                <!-- COGS Section -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>2. تكلفة البضاعة المباعة (Cost of Goods Sold)</span>
                    <span class="font-mono">(${formatEGP(netCogs)})</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${cogsRows.map(r => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">(${formatEGP(r.amount)})</span>
                      </div>
                    `).join('')}
                    ${contraExpRows.map(r => `
                      <div class="flex justify-between py-1.5 text-emerald-600">
                        <span>يخصم: ${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">${formatEGP(r.amount)}</span>
                      </div>
                    `).join('')}
                    <div class="flex justify-between py-2 font-bold text-emerald-800 bg-emerald-50 px-2 rounded-lg border border-emerald-200">
                      <span>مجمل الربح (Gross Profit)</span>
                      <span class="font-mono text-base">${formatEGP(grossProfit)}</span>
                    </div>
                  </div>
                </div>

                <!-- Operating Expenses Section -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>3. المصروفات التشغيلية والإدارية (Operating Expenses)</span>
                    <span class="font-mono">(${formatEGP(exp)})</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${expRows.length > 0 ? expRows.map(r => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">(${formatEGP(r.amount)})</span>
                      </div>
                    `).join('') : '<div class="py-2 text-slate-400 text-center">لا توجد مصروفات مسجلة</div>'}
                  </div>
                </div>

                <!-- Net Income Final -->
                <div class="p-4 rounded-xl border-2 ${netIncome >= 0 ? 'bg-emerald-50 border-emerald-400 text-emerald-950' : 'bg-rose-50 border-rose-400 text-rose-950'} flex justify-between items-center font-bold text-sm sm:text-base">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-2xl">${netIncome >= 0 ? 'verified' : 'report_problem'}</span>
                    <span>صافي أرباح / (خسائر) الفترة (Net Income)</span>
                  </div>
                  <span class="font-mono text-lg font-black">${formatEGP(netIncome)} ج.م</span>
                </div>
              </div>
            `;
            isContainer.innerHTML = isHtml;
        }
    }

    // 3. Render Balance Sheet
    const bsContainer = document.getElementById('bs-container');
    if (bsContainer) {
        if (postedJournal.length === 0) {
            bsContainer.innerHTML = '<div class="py-12 text-center text-slate-400 font-medium text-xs sm:text-sm">لا توجد أرصدة للمركز المالي بعد.<br><span class="text-[11px] text-slate-500 mt-1 inline-block">ستظهر بنود الأصول والخصوم وحقوق الملكية بمجرد ترحيل القيود.</span></div>';
        } else {
            let bsHtml = `
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs sm:text-sm">
                <!-- Assets Column -->
                <div class="space-y-4">
                  <div class="p-3 bg-blue-900 text-white font-bold rounded-xl flex justify-between items-center">
                    <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">savings</span> جانب الأصول (Assets)</span>
                    <span class="font-mono font-bold">${formatEGP(totalAssets)}</span>
                  </div>
                  <div class="bg-white p-3 rounded-xl border border-slate-200 divide-y divide-slate-100">
                    ${assetRows.map(r => `
                      <div class="flex justify-between py-2 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">${formatEGP(r.amount)}</span>
                      </div>
                    `).join('')}
                    ${contraAssetRows.map(r => `
                      <div class="flex justify-between py-2 text-rose-600">
                        <span>يخصم: ${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">(${formatEGP(r.amount)})</span>
                      </div>
                    `).join('')}
                    <div class="flex justify-between py-2.5 font-bold text-blue-950 bg-blue-50 px-2 rounded-lg border border-blue-200 mt-2">
                      <span>إجمالي الأصول بالصافي (Total Net Assets)</span>
                      <span class="font-mono text-base">${formatEGP(totalAssets)} ج.م</span>
                    </div>
                  </div>
                </div>

                <!-- Liabilities & Equity Column -->
                <div class="space-y-4">
                  <div class="p-3 bg-slate-900 text-white font-bold rounded-xl flex justify-between items-center">
                    <span class="flex items-center gap-1.5"><span class="material-symbols-outlined text-base">account_balance</span> الالتزامات والملكية (Liab & Equity)</span>
                    <span class="font-mono font-bold">${formatEGP(totalLiabEquity)}</span>
                  </div>
                  
                  <!-- Liabilities -->
                  <div class="bg-white p-3 rounded-xl border border-slate-200 divide-y divide-slate-100">
                    <strong class="block text-slate-700 mb-1">الالتزامات (Liabilities):</strong>
                    ${liabRows.length > 0 ? liabRows.map(r => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">${formatEGP(r.amount)}</span>
                      </div>
                    `).join('') : '<div class="py-1 text-slate-400 text-center">لا توجد التزامات قائمة</div>'}
                    <div class="flex justify-between py-1.5 font-bold text-slate-900 border-t border-slate-200">
                      <span>مجموع الالتزامات</span>
                      <span class="font-mono">${formatEGP(liab)}</span>
                    </div>
                  </div>

                  <!-- Equity -->
                  <div class="bg-white p-3 rounded-xl border border-slate-200 divide-y divide-slate-100">
                    <strong class="block text-slate-700 mb-1">حقوق الملكية (Equity):</strong>
                    ${eqRows.map(r => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${r.code} - ${r.name}</span>
                        <span class="font-mono font-bold">${formatEGP(r.amount)}</span>
                      </div>
                    `).join('')}
                    <div class="flex justify-between py-1.5 text-emerald-800 font-bold">
                      <span>أرباح / (خسائر) الفترة الحالية</span>
                      <span class="font-mono">${formatEGP(netIncome)}</span>
                    </div>
                    <div class="flex justify-between py-1.5 font-bold text-slate-900 border-t border-slate-200">
                      <span>مجموع حقوق الملكية</span>
                      <span class="font-mono">${formatEGP(totalEquity)}</span>
                    </div>
                  </div>

                  <!-- Total Liab & Equity -->
                  <div class="flex justify-between py-2.5 font-bold text-slate-950 bg-slate-100 px-3 rounded-xl border border-slate-300">
                    <span>مجموع الالتزامات وحقوق الملكية</span>
                    <span class="font-mono text-base">${formatEGP(totalLiabEquity)} ج.م</span>
                  </div>
                </div>
              </div>
            `;
            bsContainer.innerHTML = bsHtml;
        }
    }

    // 4. Render Cash Flow Statement (Generator Cash-Flow Aware Logic)
    const cfContainer = document.getElementById('cf-container');
    if (cfContainer) {
        if (postedJournal.length === 0) {
            cfContainer.innerHTML = '<div class="py-12 text-center text-slate-400 font-medium text-xs sm:text-sm">لا توجد تدفقات نقدية مسجلة بعد.<br><span class="text-[11px] text-slate-500 mt-1 inline-block">سيتم تصنيف التدفقات النقدية إلى تشغيلية واستثمارية وتمويلية فور ترحيل العمليات.</span></div>';
        } else {
            let opRaw = [], invRaw = [], finRaw = [];
            let startingCash = 0;
            const currentCash = (balances['1101'] || 0) + (balances['1102'] || 0);

            postedJournal.forEach(je => {
                let cashImpact = 0;
                (je.lines || []).forEach(l => {
                    if (l.accountCode === '1101' || l.accountCode === '1102') {
                        cashImpact += ((Number(l.debit) || 0) - (Number(l.credit) || 0));
                    }
                });

                if (cashImpact !== 0) {
                    if (je.type === 'Opening Balance') {
                        startingCash += cashImpact;
                        return;
                    }
                    // التدفقات الاستثمارية: الأصول الثابتة (1201) ومجمع الإهلاك (1202) وأرباح/خسائر استبعاد الأصول (4201, 5210 في دليل المحاكي) أو نوع الحركة الاستثمارية الصريح
                    const isInvesting = je.lines.some(l => ['1201', '1202', '4201', '5210'].includes(l.accountCode)) ||
                                        (je.type && (je.type.includes('Asset') || je.type.includes('أصول') || je.type.includes('استثمار')));
                    const isFinancing = je.lines.some(l => ['3101', '3102', '2201'].includes(l.accountCode));

                    const desc = je.type || 'حركة نقدية';
                    if (isFinancing) finRaw.push({ desc, amt: cashImpact });
                    else if (isInvesting) invRaw.push({ desc, amt: cashImpact });
                    else opRaw.push({ desc, amt: cashImpact });
                }
            });

            const aggregate = (list) => {
                let map = {};
                list.forEach(i => map[i.desc] = (map[i.desc] || 0) + i.amt);
                return Object.keys(map).map(k => ({ desc: k, amt: map[k] }));
            };

            const op = aggregate(opRaw);
            const inv = aggregate(invRaw);
            const fin = aggregate(finRaw);

            const opTotal = op.reduce((s, i) => s + i.amt, 0);
            const invTotal = inv.reduce((s, i) => s + i.amt, 0);
            const finTotal = fin.reduce((s, i) => s + i.amt, 0);
            const netChange = opTotal + invTotal + finTotal;
            const endingCash = startingCash + netChange;

            let cfHtml = `
              <div class="space-y-4 text-xs sm:text-sm">
                <!-- Operating Activities -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>1. التدفقات النقدية من الأنشطة التشغيلية (Operating Activities)</span>
                    <span class="font-mono font-bold ${opTotal >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(opTotal)}</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${op.length > 0 ? op.map(i => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${i.desc}</span>
                        <span class="font-mono font-bold ${i.amt >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(i.amt)}</span>
                      </div>
                    `).join('') : '<div class="py-1 text-slate-400 text-center">لا توجد تدفقات تشغيلية</div>'}
                  </div>
                </div>

                <!-- Investing Activities -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>2. التدفقات النقدية من الأنشطة الاستثمارية (Investing Activities)</span>
                    <span class="font-mono font-bold ${invTotal >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(invTotal)}</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${inv.length > 0 ? inv.map(i => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${i.desc}</span>
                        <span class="font-mono font-bold ${i.amt >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(i.amt)}</span>
                      </div>
                    `).join('') : '<div class="py-1 text-slate-400 text-center">لا توجد تدفقات استثمارية (شراء أو بيع أصول ثابتة)</div>'}
                  </div>
                </div>

                <!-- Financing Activities -->
                <div>
                  <div class="p-2.5 bg-slate-100 text-slate-800 font-bold rounded-lg mb-1 flex justify-between">
                    <span>3. التدفقات النقدية من الأنشطة التمويلية (Financing Activities)</span>
                    <span class="font-mono font-bold ${finTotal >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(finTotal)}</span>
                  </div>
                  <div class="divide-y divide-slate-100 px-2">
                    ${fin.length > 0 ? fin.map(i => `
                      <div class="flex justify-between py-1.5 text-slate-700">
                        <span>${i.desc}</span>
                        <span class="font-mono font-bold ${i.amt >= 0 ? 'text-emerald-700' : 'text-rose-700'}">${formatEGP(i.amt)}</span>
                      </div>
                    `).join('') : '<div class="py-1 text-slate-400 text-center">لا توجد تدفقات تمويلية (قروض أو توزيعات)</div>'}
                  </div>
                </div>

                <!-- Cash Summary -->
                <div class="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                  <div class="flex justify-between text-slate-300">
                    <span>صافي الزيادة / (النقص) في النقدية وما في حكمها</span>
                    <span class="font-mono font-bold ${netChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}">${formatEGP(netChange)} ج.م</span>
                  </div>
                  <div class="flex justify-between text-slate-300">
                    <span>رصيد النقدية والبنك في بداية الفترة</span>
                    <span class="font-mono">${formatEGP(startingCash)} ج.م</span>
                  </div>
                  <div class="flex justify-between text-base font-bold pt-2 border-t border-slate-700 text-emerald-400">
                    <span>رصيد النقدية والبنك في نهاية الفترة (يطابق رصيد الميزانية)</span>
                    <span class="font-mono text-lg font-black">${formatEGP(endingCash)} ج.م</span>
                  </div>
                </div>
              </div>
            `;
            cfContainer.innerHTML = cfHtml;
        }
    }
}

window.updateStatements = updateStatements;

// Auto-initialize statements on DOM ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateStatements);
} else {
    updateStatements();
}
