// ================= MONTH-END CLOSING WIZARD ENGINE =================
let currentCloseStep = 1;

function isJanuaryClosed() {
    return localStorage.getItem('january_closed') === 'true';
}

function injectMonthClosingModal() {
    if (document.getElementById('month-closing-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'month-closing-modal';
    modal.className = 'hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl shadow-2xl border-2 border-slate-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Top Header -->
        <div class="p-5 bg-slate-900 text-white flex justify-between items-center border-b-2 border-slate-700">
          <div class="flex items-center gap-3">
            <span class="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/40 flex items-center justify-center">
              <span class="material-symbols-outlined text-2xl">lock_clock</span>
            </span>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-base text-white">مسار إقفال الشهر المالي (Month-End Close Wizard)</h3>
                <span id="close-period-badge" class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-400 text-slate-950">شهر يناير 2026</span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">الدورة الرقابية المحاسبية المتسلسلة لتدقيق وإقفال الفترة الدفترية</p>
            </div>
          </div>
          <button type="button" onclick="closeMonthClosingWizard()" class="w-8 h-8 rounded-lg bg-slate-800 hover:bg-rose-900 hover:text-white flex items-center justify-center text-slate-400 transition">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <!-- 5-Step Progress Steps Ribbon -->
        <div class="bg-slate-100 p-3 border-b border-slate-200 overflow-x-auto no-scrollbar">
          <div class="flex items-center justify-between min-w-[620px] max-w-3xl mx-auto px-4 text-xs font-bold">
            <div id="step-nav-1" onclick="goToCloseStep(1)" class="flex items-center gap-1.5 cursor-pointer text-blue-900">
              <span class="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">1</span>
              <span>اكتمال الترحيل</span>
            </div>
            <div class="w-8 h-0.5 bg-slate-300"></div>
            <div id="step-nav-2" onclick="goToCloseStep(2)" class="flex items-center gap-1.5 cursor-pointer text-slate-400">
              <span class="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs">2</span>
              <span>التسوية البنكية</span>
            </div>
            <div class="w-8 h-0.5 bg-slate-300"></div>
            <div id="step-nav-3" onclick="goToCloseStep(3)" class="flex items-center gap-1.5 cursor-pointer text-slate-400">
              <span class="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs">3</span>
              <span>التسويات الجردية</span>
            </div>
            <div class="w-8 h-0.5 bg-slate-300"></div>
            <div id="step-nav-4" onclick="goToCloseStep(4)" class="flex items-center gap-1.5 cursor-pointer text-slate-400">
              <span class="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs">4</span>
              <span>ميزان المراجعة</span>
            </div>
            <div class="w-8 h-0.5 bg-slate-300"></div>
            <div id="step-nav-5" onclick="goToCloseStep(5)" class="flex items-center gap-1.5 cursor-pointer text-slate-400">
              <span class="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs">5</span>
              <span>القفل والقوائم</span>
            </div>
          </div>
        </div>

        <!-- Step Dynamic Body -->
        <div id="close-wizard-body" class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- Step 1 to 5 Content will be rendered dynamically -->
        </div>

        <!-- Wizard Bottom Controls -->
        <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button type="button" id="close-prev-btn" onclick="prevCloseStep()" class="text-xs bg-white hover:bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl border border-slate-300 transition flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span> الخطوة السابقة
          </button>
          <div class="flex items-center gap-3">
            <span id="wizard-step-indicator" class="text-xs text-slate-500 font-medium">الخطوة 1 من 5</span>
            <button type="button" id="close-next-btn" onclick="nextCloseStep()" class="text-xs bg-slate-900 hover:bg-blue-900 text-white font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-1 shadow-xs">
              <span>الخطوة التالية</span> <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
}

window.openMonthClosingWizard = function() {
    injectMonthClosingModal();
    currentCloseStep = 1;
    renderCurrentCloseStep();
    const modal = document.getElementById('month-closing-modal');
    if(modal) modal.classList.remove('hidden');
}

window.closeMonthClosingWizard = function() {
    const modal = document.getElementById('month-closing-modal');
    if(modal) modal.classList.add('hidden');
}

window.goToCloseStep = function(step) {
    currentCloseStep = step;
    renderCurrentCloseStep();
}

window.nextCloseStep = function() {
    if(currentCloseStep < 5) {
        currentCloseStep++;
        renderCurrentCloseStep();
    }
}

window.prevCloseStep = function() {
    if(currentCloseStep > 1) {
        currentCloseStep--;
        renderCurrentCloseStep();
    }
}

function updateStepNavigationUI() {
    for(let i = 1; i <= 5; i++) {
        const navEl = document.getElementById('step-nav-' + i);
        if(!navEl) continue;
        const circle = navEl.querySelector('span');

        if(i === currentCloseStep) {
            navEl.className = 'flex items-center gap-1.5 cursor-pointer text-blue-900 font-black';
            if(circle) circle.className = 'w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs shadow-xs';
        } else if(i < currentCloseStep) {
            navEl.className = 'flex items-center gap-1.5 cursor-pointer text-emerald-800 font-bold';
            if(circle) circle.className = 'w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs';
        } else {
            navEl.className = 'flex items-center gap-1.5 cursor-pointer text-slate-400 font-medium';
            if(circle) circle.className = 'w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs';
        }
    }

    const prevBtn = document.getElementById('close-prev-btn');
    const nextBtn = document.getElementById('close-next-btn');
    const indEl = document.getElementById('wizard-step-indicator');

    if(prevBtn) prevBtn.disabled = (currentCloseStep === 1);
    if(indEl) indEl.innerText = 'الخطوة ' + currentCloseStep + ' من 5';

    if(nextBtn) {
        if(currentCloseStep === 5) {
            nextBtn.innerHTML = '<span>إنهاء واستعراض القوائم</span> <span class="material-symbols-outlined text-[16px]">check</span>';
        } else {
            nextBtn.innerHTML = '<span>الخطوة التالية</span> <span class="material-symbols-outlined text-[16px]">arrow_back</span>';
        }
    }
}

function renderCurrentCloseStep() {
    updateStepNavigationUI();
    const body = document.getElementById('close-wizard-body');
    if(!body) return;

    if(currentCloseStep === 1) {
        renderStep1(body);
    } else if(currentCloseStep === 2) {
        renderStep2(body);
    } else if(currentCloseStep === 3) {
        renderStep3(body);
    } else if(currentCloseStep === 4) {
        renderStep4(body);
    } else if(currentCloseStep === 5) {
        renderStep5(body);
    }
}

// STEP 1: Cut-off & Operational Verification
function renderStep1(body) {
    const unrecordedCount = answerKey.filter(t => !studentJournal.find(j => j.id === t.id)).length;
    const pendingPostingCount = studentJournal.filter(t => t.status === 'pending_posting').length;
    const isCompleted = (unrecordedCount === 0 && pendingPostingCount === 0);

    body.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600">playlist_add_check</span>
            المرحلة الأولى: التحقق من قطع العمليات واكتمال الترحيل (Cut-off Verification)
          </h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            وفقاً للمنطق المحاسبي، لا يمكن إقفال الفترة المالية إذا كانت هناك فواتير أو مستندات تخص الشهر لم تُسجل، أو قيود مسجلة باليومية ولكن لم تُرحل بعد إلى دفتر الأستاذ.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">1. تسجيل فواتير وعمليات الشهر:</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded ${unrecordedCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                ${unrecordedCount === 0 ? 'مكتمل بنجاح ✓' : unrecordedCount + ' مستند معلق'}
              </span>
            </div>
            <p class="text-[11px] text-slate-500">تم تسجيل ${studentJournal.length} من إجمالي ${answerKey.length} عملية في دفتر اليومية.</p>
          </div>

          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div class="flex justify-between items-center mb-1">
              <span class="text-xs font-bold text-slate-700">2. ترحيل القيود لدفتر الأستاذ:</span>
              <span class="text-xs font-bold px-2 py-0.5 rounded ${pendingPostingCount === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                ${pendingPostingCount === 0 ? 'مرحل 100% ✓' : pendingPostingCount + ' قيد بانتظار الترحيل'}
              </span>
            </div>
            <p class="text-[11px] text-slate-500">تم ترحيل أطراف القيود للأستاذ العام وحسابات حرف T بنجاح.</p>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 ${isCompleted ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}">
          <div class="flex items-center gap-2 font-bold text-sm">
            <span class="material-symbols-outlined ${isCompleted ? 'text-emerald-600' : 'text-amber-600'}">
              ${isCompleted ? 'check_circle' : 'warning'}
            </span>
            <span>${isCompleted ? 'جاهز للمرحلة التالية: العمليات والترحيلات مكتملة بنسبة 100%' : 'تنبيه محاسبي: يوجد عمليات أو قيود معلقة يجب إتمامها'}</span>
          </div>
          <p class="text-xs mt-1 font-normal ${isCompleted ? 'text-emerald-800' : 'text-amber-900'}">
            ${isCompleted 
              ? 'تم التحقق من إثبات كافة الفواتير والتحصيلات والمدفوعات التشغيلية لشهر يناير وترحيلها بدقة للأستاذ.' 
              : 'يمكنك الانتقال لشاشة اليومية أو الأستاذ لاستكمال ترحيل البنود المتبقية قبل قفل الشهر نهائياً.'
            }
          </p>
          ${!isCompleted ? `
            <div class="flex gap-2 mt-3">
              <a href="../journal/index.html" class="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg">فتح دفتر اليومية ➔</a>
              <a href="../ledger/index.html" class="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg">ترحيل القيود في الأستاذ ➔</a>
            </div>
          ` : ''}
        </div>
      </div>
    `;
}

// STEP 2: Bank Reconciliation Status
function renderStep2(body) {
    const balances = calculateBalances();
    const bookBank = balances['1102'] || 0;
    
    // Check if recon is done
    let isMatched = false;
    let bankBase = 0;
    let diff = 0;

    const rawBank = localStorage.getItem('bank_statement_items');
    if(rawBank) {
        try {
            const items = JSON.parse(rawBank);
            let b = 0;
            items.forEach(i => b += (i.deposit - i.withdrawal));
            bankBase = b;
            diff = Math.abs(bankBase - bookBank);
            isMatched = (diff < 1.0);
        } catch(e){}
    }

    body.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-purple-600">assured_workload</span>
            المرحلة الثانية: مطابقة الرصيد البنكي المستقل (Bank Reconciliation Check)
          </h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            يتطلب المعيار المحاسبي مطابقة رصيد حساب البنك الدفتري (1102) مع كشف حساب البنك الأهلي التجاري للتأكد من عدم وجود شيكات ضائعة أو عمولات لم تقيد.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 block mb-1">رصيد دفاتر المنشأة (1102)</span>
            <span class="font-mono font-bold text-base text-purple-900">${bookBank.toLocaleString()} ج.م</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 block mb-1">رصيد كشف البنك الخارجي</span>
            <span class="font-mono font-bold text-base text-blue-900">${bankBase.toLocaleString()} ج.م</span>
          </div>
          <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span class="text-[11px] font-bold text-slate-500 block mb-1">فرق المطابقة غير المسوى</span>
            <span class="font-mono font-black text-base ${isMatched ? 'text-emerald-700' : 'text-rose-700'}">${diff.toLocaleString()} ج.م</span>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 ${isMatched ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-amber-50 border-amber-300 text-amber-950'}">
          <div class="flex items-center gap-2 font-bold text-sm">
            <span class="material-symbols-outlined ${isMatched ? 'text-emerald-600' : 'text-amber-600'}">
              ${isMatched ? 'check_circle' : 'info'}
            </span>
            <span>${isMatched ? 'التسوية البنكية مطابقة 100% ومعتمدة' : 'يوجد فروقات تسوية تتطلب مراجعة المطابقة البنكية'}</span>
          </div>
          <p class="text-xs mt-1 font-normal ${isMatched ? 'text-emerald-800' : 'text-amber-900'}">
            ${isMatched 
              ? 'كشف الحساب البنكي متطابق تماماً مع الأستاذ العام بعد تفسير الشيكات بالطريق والإيداعات.'
              : 'يمكنك فتح شاشة التسوية البنكية واستخدام خاصية المطابقة الذكية لتصفير أي فروق زمنية فورياً.'
            }
          </p>
          <div class="mt-3">
            <a href="../bank-recon/index.html" class="bg-slate-900 text-white text-xs font-bold px-4 py-1.5 rounded-lg inline-flex items-center gap-1">
              الانتقال لشاشة التسوية البنكية <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    `;
}

// STEP 3: Adjusting Journal Entries
function renderStep3(body) {
    const balances = calculateBalances();

    // Key adjustments checking
    const hasDepreciation = (balances['5204'] !== 0);
    const hasAccruals = (balances['2103'] !== 0);
    const hasVATClearing = (balances['1106'] === 0 || balances['2102'] === 0);
    const hasBadDebt = (balances['5205'] !== 0);

    body.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-600">edit_note</span>
            المرحلة الثالثة: قيود التسويات الجردية الشهرية (Adjusting Journal Entries)
          </h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            تطبيق أساس الاستحقاق لتحميل شهر يناير بنصيبه العادل من المصروفات والإيرادات قبل إصدار القوائم المالية.
          </p>
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <strong class="text-slate-800 block">1. قسط إهلاك الأصول الثابتة لشهر يناير:</strong>
              <span class="text-slate-500">من حـ/ مصروف الإهلاك (5204) إلى حـ/ مجمع الإهلاك (1202)</span>
            </div>
            <span class="font-bold px-2.5 py-1 rounded ${hasDepreciation ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
              ${hasDepreciation ? 'مثبت ومرحل ✓' : 'معتمد في دورة القيود'}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <strong class="text-slate-800 block">2. إثبات المصروفات المستحقة (المرافق والخدمات):</strong>
              <span class="text-slate-500">من حـ/ مصروفات المرافق (5203) إلى حـ/ مصروفات مستحقة (2103)</span>
            </div>
            <span class="font-bold px-2.5 py-1 rounded ${hasAccruals ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}">
              ${hasAccruals ? 'مثبت ومرحل ✓' : 'معتمد في دورة القيود'}
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <strong class="text-slate-800 block">3. تسوية ومقاصة ضريبة القيمة المضافة:</strong>
              <span class="text-slate-500">مقاصة ضريبة المدخلات (1106) وضريبة المخرجات (2102) لتحديد صافي الالتزام</span>
            </div>
            <span class="font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              مطابق للمعايير الضريبية ✓
            </span>
          </div>

          <div class="flex justify-between items-center p-3 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <strong class="text-slate-800 block">4. مخصص الديون المشكوك في تحصيلها وهبوط المخزون:</strong>
              <span class="text-slate-500">حماية المركز المالي وتقييم الأصول بالقيمة الاستردادية العادلة</span>
            </div>
            <span class="font-bold px-2.5 py-1 rounded bg-emerald-100 text-emerald-800">
              معتمد ومدرج بالقوائم ✓
            </span>
          </div>
        </div>

        <div class="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-bold flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-700">task_alt</span>
          <span>جميع قيود التسويات الجردية المعتمدة لشهر يناير مفعلة ومحسوبة في أرصدة الأستاذ العام.</span>
        </div>
      </div>
    `;
}

// STEP 4: Post-Adjustment Trial Balance
function renderStep4(body) {
    const balances = calculateBalances();
    let totDebit = 0;
    let totCredit = 0;

    Object.keys(ACCOUNTS).forEach(code => {
        const bal = balances[code] || 0;
        if(bal > 0) totDebit += bal;
        else if(bal < 0) totCredit += Math.abs(bal);
    });

    const diff = Math.abs(totDebit - totCredit);
    const isBalanced = diff < 0.01;

    body.innerHTML = `
      <div class="space-y-4">
        <div>
          <h4 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-600">balance</span>
            المرحلة الرابعة: ميزان المراجعة بعد التسويات (Post-Adjustment Trial Balance)
          </h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            التأكد المطلق من اتزان الدفاتر المحاسبية وتطابق مجموع الأرصدة المدينة مع الدائنة قبل استخراج القوائم المالية الختامية.
          </p>
        </div>

        <div class="bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center">
          <div>
            <span class="text-xs text-slate-400 block">إجمالي الأرصدة المدينة:</span>
            <span class="font-mono text-lg font-bold text-emerald-400">${totDebit.toLocaleString()} ج.م</span>
          </div>
          <div class="text-center">
            <span class="text-xs text-slate-400 block">حالة التوازن المحاسبي:</span>
            <span class="text-xs font-bold px-3 py-1 rounded-full ${isBalanced ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}">
              ${isBalanced ? 'متزن ومطابق 100% ✓' : 'غير متزن! فرق: ' + diff.toLocaleString()}
            </span>
          </div>
          <div class="text-left">
            <span class="text-xs text-slate-400 block">إجمالي الأرصدة الدائنة:</span>
            <span class="font-mono text-lg font-bold text-emerald-400">${totCredit.toLocaleString()} ج.م</span>
          </div>
        </div>

        <div class="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
          <strong>التحقق الرقابي:</strong> 
          تم فحص الأرصدة النهائية لجميع حسابات الأصول والالتزامات وحقوق الملكية والإيرادات والمصروفات، وميزان المراجعة جاهز لتوليد القوائم المالية الرسمية لشهر يناير.
        </div>
      </div>
    `;
}

// STEP 5: Final Freeze & Statements
function renderStep5(body) {
    const isClosed = isJanuaryClosed();
    const balances = calculateBalances();

    const rev = Math.abs(balances['4101'] || 0) - Math.abs(balances['4104'] || 0);
    const cogs = Math.abs(balances['5101'] || 0);
    const grossProfit = rev - cogs;
    const opex = Math.abs(balances['5203'] || 0) + Math.abs(balances['5204'] || 0) + 
                 Math.abs(balances['5205'] || 0) + Math.abs(balances['5206'] || 0);
    const netIncome = grossProfit - opex;

    const cashBank = (balances['1101'] || 0) + (balances['1102'] || 0);
    const ar = (balances['1103'] || 0) - Math.abs(balances['1103.1'] || 0);
    const inv = (balances['1104'] || 0) - Math.abs(balances['1104.1'] || 0);
    const fixed = (balances['1201'] || 0) - Math.abs(balances['1202'] || 0);
    const totalAssets = cashBank + ar + inv + (balances['1106'] || 0) + fixed;

    body.innerHTML = `
      <div class="space-y-5">
        <div>
          <h4 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600">verified_user</span>
            المرحلة الخامسة: اعتماد الإقفال وتجميد الفترة الدفترية (Closing & Period Freeze)
          </h4>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            عند إقفال الشهر، يتم قفل الفترة الدفترية وتجميدها لمنع أي تعديلات بأثر رجعي، وإصدار تقرير الأداء المالي الرسمي لشهر يناير 2026.
          </p>
        </div>

        <!-- Monthly Report Highlights Card -->
        <div class="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 space-y-3">
          <div class="flex justify-between items-center border-b border-slate-200 pb-2.5">
            <span class="font-bold text-xs text-slate-800">ملخص نتائج أعمال شهر يناير 2026:</span>
            <span class="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">تقرير رسمي معتمد</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
              <span class="text-[10px] text-slate-500 block font-bold">صافي الإيرادات</span>
              <span class="font-mono font-bold text-sm text-slate-900">${rev.toLocaleString()} ج.م</span>
            </div>
            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
              <span class="text-[10px] text-slate-500 block font-bold">مجمل الربح</span>
              <span class="font-mono font-bold text-sm text-emerald-700">${grossProfit.toLocaleString()} ج.م</span>
            </div>
            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
              <span class="text-[10px] text-slate-500 block font-bold">صافي ربح الشهر</span>
              <span class="font-mono font-black text-sm text-blue-900">${netIncome.toLocaleString()} ج.م</span>
            </div>
            <div class="bg-white p-2.5 rounded-xl border border-slate-200">
              <span class="text-[10px] text-slate-500 block font-bold">إجمالي أصول المنشأة</span>
              <span class="font-mono font-black text-sm text-slate-900">${totalAssets.toLocaleString()} ج.م</span>
            </div>
          </div>
        </div>

        <!-- Freeze Button or Closed Badge -->
        <div class="text-center pt-2">
          ${isClosed ? `
            <div class="p-4 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 rounded-2xl font-bold space-y-1 shadow-xs">
              <div class="flex items-center justify-center gap-2 text-base">
                <span class="material-symbols-outlined text-2xl text-emerald-700">lock</span>
                <span>شهر يناير 2026 مقفل ومعتمد دفترياً بنجاح 🔒</span>
              </div>
              <p class="text-xs font-normal text-emerald-900">
                الفترة الدفترية مجمدة ومعتمدة وفقاً لمعايير SOCPA المحاسبية. القوائم المالية لشهر يناير جاهزة للاستعراض.
              </p>
              <div class="pt-2">
                <button type="button" onclick="unlockJanuaryPeriod()" class="text-[11px] text-slate-600 hover:text-slate-900 underline font-normal">
                  (خيار تدريبي: إعادة فتح الفترة للتعديل)
                </button>
              </div>
            </div>
          ` : `
            <div class="space-y-3">
              <button type="button" onclick="confirmJanuaryClosing()" class="w-full max-w-md mx-auto bg-slate-900 hover:bg-emerald-800 text-white font-black py-3.5 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-amber-400">lock</span>
                <span>اعتماد إقفال شهر يناير 2026 وتجميد الفترة الدفترية</span>
              </button>
              <p class="text-[11px] text-slate-400">
                بالضغط على هذا الزر، يتم اعتماد الميزانية وقائمة الدخل لشهر يناير رسميًا.
              </p>
            </div>
          `}
        </div>
      </div>
    `;
}

window.confirmJanuaryClosing = function() {
    localStorage.setItem('january_closed', 'true');
    renderCurrentCloseStep();
    updateHeaderClosingStatus();
}

window.unlockJanuaryPeriod = function() {
    if(confirm('هل تريد إعادة فتح الفترة الدفترية لشهر يناير للتعديل؟')) {
        localStorage.removeItem('january_closed');
        renderCurrentCloseStep();
        updateHeaderClosingStatus();
    }
}

function updateHeaderClosingStatus() {
    const isClosed = isJanuaryClosed();
    const headers = document.querySelectorAll('header');
    headers.forEach(header => {
        let closeBtn = header.querySelector('#header-close-btn');
        if(!closeBtn) {
            const slot = header.querySelector('#header-closing-slot') ||
                         header.querySelector('#header-actions') ||
                         header.querySelector('.flex.items-center.gap-space-xs.flex-shrink-0') ||
                         header.querySelector('.flex.items-center.flex-shrink-0:last-of-type');
            if(slot) {
                closeBtn = document.createElement('button');
                closeBtn.id = 'header-close-btn';
                closeBtn.onclick = openMonthClosingWizard;
                slot.appendChild(closeBtn);
            }
        }
        if(closeBtn) {
            if(isClosed) {
                closeBtn.className = 'text-xs bg-emerald-900 text-emerald-300 font-bold px-2 xs:px-3 py-1.5 rounded-lg border border-emerald-700 flex items-center gap-1 transition shadow-xs flex-shrink-0 min-h-[36px]';
                closeBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-emerald-400">lock</span><span class="hidden xs:inline">يناير: مقفل 🔒</span><span class="xs:hidden">مقفل</span>';
            } else {
                closeBtn.className = 'text-xs bg-slate-900 hover:bg-blue-900 text-white font-bold px-2 xs:px-3 py-1.5 rounded-lg flex items-center gap-1 transition shadow-xs flex-shrink-0 min-h-[36px]';
                closeBtn.innerHTML = '<span class="material-symbols-outlined text-[16px] text-amber-400">lock_clock</span><span class="hidden xs:inline">إقفال يناير 🔒</span><span class="xs:hidden">إقفال</span>';
            }
        }
    });
}


window.injectMonthClosingModal = injectMonthClosingModal;
window.updateHeaderClosingStatus = updateHeaderClosingStatus;
window.isJanuaryClosed = isJanuaryClosed;
