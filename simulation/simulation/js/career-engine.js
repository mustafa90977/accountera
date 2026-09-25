// =========================================================================
// Accountera Career Progression, XP & Skill Gap Diagnostic Engine (Phase 3)
// =========================================================================

const CAREER_RANKS = [
    {
        id: 'intern',
        title: 'محاسب متدرب',
        titleEn: 'Intern Accountant',
        minXp: 0,
        maxXp: 499,
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        icon: 'school',
        roleDescription: 'بداية التدريب العملي: استيعاب طبيعة الحسابات، قراءة المستندات الأساسية، وتسجيل قيود اليومية البسيطة وفق التسلسل الزمني.',
        requiredCompetencies: ['استيعاب طبيعة الحسابات (مدين / دائن)', 'تسجيل القيود البسيطة', 'قراءة الفواتير النقدية والآجلة']
    },
    {
        id: 'junior_site',
        title: 'محاسب موقع / مساعد',
        titleEn: 'Junior / Site Accountant',
        minXp: 500,
        maxXp: 1199,
        badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
        icon: 'engineering',
        roleDescription: 'المعاملات الميدانية: فحص فواتير المشتريات والموردين، إدارة ومطابقة عهدة الخزينة، وإجراء الجرد النقدي الفعلي.',
        requiredCompetencies: ['جرد الخزينة وتصنيف الفئات النقدية', 'إثبات عجز وزيادة الصندوق دفترياً', 'معالجة فواتير الموردين']
    },
    {
        id: 'senior_accountant',
        title: 'محاسب عام أول',
        titleEn: 'Senior General Accountant',
        minXp: 1200,
        maxXp: 2499,
        badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        icon: 'verified',
        roleDescription: 'إدارة الدورة الدفترية الكاملة: الترحيل لحسابات الأستاذ العام، إعداد مذكرة التسوية البنكية، وضبط جرد المستودعات.',
        requiredCompetencies: ['إعداد مذكرة التسوية البنكية المستقلة', 'مطابقة جرد المخزون الفعلي وتسوية العجز', 'ضبط ميزان المراجعة بالمجاميع والأرصدة']
    },
    {
        id: 'chief_accountant',
        title: 'رئيس حسابات',
        titleEn: 'Chief Accountant',
        minXp: 2500,
        maxXp: 4499,
        badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: 'workspace_premium',
        roleDescription: 'الإشراف الضريبي والمحاسبي: إعداد وتدقيق الإقرارات الضريبية المصرية (نموذج 10 ونموذج 41)، وإجراء قيود التسويات الجردية.',
        requiredCompetencies: ['إعداد إقرار ضريبة القيمة المضافة (نموذج 10)', 'إعداد جدول الخصم والتحصيل (نموذج 41)', 'تسوية المقدمات والمستحقات والإهلاك']
    },
    {
        id: 'finance_manager',
        title: 'مدير مالي (CFO)',
        titleEn: 'Finance Manager / CFO',
        minXp: 4500,
        maxXp: 6999,
        badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
        icon: 'military_tech',
        roleDescription: 'التحليل المالي وصناعة القرار: إقفال الحسابات السنوية، اعتماد القوائم المالية الختامية، ومراقبة السيولة ومؤشرات الربحية.',
        requiredCompetencies: ['إعداد قائمة الدخل وقائمة المركز المالي', 'تحليل السيولة والرافعة المالية', 'إجراء قيود الإقفال السنوية للأرباح والخسائر']
    },
    {
        id: 'chartered_auditor',
        title: 'مراجع حسابات قانوني معتمد',
        titleEn: 'Chartered Auditor / CPA',
        minXp: 7000,
        maxXp: Infinity,
        badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
        icon: 'diamond',
        roleDescription: 'التدقيق الشامل وفق معايير المحاسبة المصرية (EAS) وإبداء الرأي المهني المستقل حول سلامة القوائم والرقابة الداخلية.',
        requiredCompetencies: ['الفحص الانتقادي للدورة المستندية', 'مطابقة المعايير المصرية والدولية', 'إصدار تقرير مراقب الحسابات المستقل']
    }
];

const ACHIEVEMENT_BADGES = [
    {
        id: 'recon_master',
        title: 'خبير التسويات البنكية',
        desc: 'إنجاز مذكرة تسوية بنكية بمطابقة تامة وفارق 0.00 ج.م وتسجيل قيود التسوية بالدفاتر.',
        icon: 'assured_workload',
        xpReward: 150,
        color: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
        id: 'treasury_guard',
        title: 'أمين الخزينة المعتمد',
        desc: 'إتمام الجرد الفعلي للنقدية المصرية وتوليد محضر الجرد ومعالجة الفروقات دفترياً.',
        icon: 'payments',
        xpReward: 150,
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
        id: 'inventory_pro',
        title: 'مراقب المخزون الدقيق',
        desc: 'مطابقة الجرد المستودعي الفعلي للأصناف وحساب فروقات التكلفة والكمية وترحيلها.',
        icon: 'inventory_2',
        xpReward: 150,
        color: 'text-amber-700 bg-amber-50 border-amber-200'
    },
    {
        id: 'tax_specialist',
        title: 'أخصائي الضرائب المصرية',
        desc: 'إعداد واعتماد إقرار القيمة المضافة (نموذج 10) وجدول الخصم والتحصيل (نموذج 41).',
        icon: 'account_balance',
        xpReward: 200,
        color: 'text-purple-700 bg-purple-50 border-purple-200'
    },
    {
        id: 'balance_master',
        title: 'دقة التوازن المحاسبي 100%',
        desc: 'تطابق تام بين جانبي المدين والدائن في ميزان المراجعة دون أي خلل ترحيل.',
        icon: 'balance',
        xpReward: 100,
        color: 'text-teal-700 bg-teal-50 border-teal-200'
    },
    {
        id: 'first_attempt_hero',
        title: 'المحاسب المتقن',
        desc: 'تسجيل وتوجيه القيود المحاسبية بدقة من المحاولة الأولى دون طلب مساعدة أو تلميحات.',
        icon: 'bolt',
        xpReward: 120,
        color: 'text-orange-700 bg-orange-50 border-orange-200'
    },
    {
        id: 'closing_master',
        title: 'مهندس الإقفال المالي',
        desc: 'إتمام دورة إقفال الحسابات الاسمية وتوليد القوائم الختامية المعتمدة بنجاح.',
        icon: 'query_stats',
        xpReward: 250,
        color: 'text-rose-700 bg-rose-50 border-rose-200'
    }
];

// =========================================================================
// Career Profile & XP Calculation Engine
// =========================================================================

function getCareerProfile() {
    let raw = null;
    try {
        raw = localStorage.getItem('acc_career_profile');
    } catch(e) {}

    let profile = {
        name: 'المحاسب المتدرب',
        baseXp: 0,
        bonusXp: 0,
        penaltyXp: 0,
        firstAttemptCount: 0,
        hintsUsedCount: 0,
        unlockedBadges: [],
        certId: 'CERT-EAS-2026-' + Math.floor(1000 + Math.random() * 9000),
        lastUpdated: new Date().toISOString()
    };

    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            profile = { ...profile, ...parsed };
        } catch(e) {}
    }

    return profile;
}

function saveCareerProfile(profile) {
    try {
        profile.lastUpdated = new Date().toISOString();
        localStorage.setItem('acc_career_profile', JSON.stringify(profile));
    } catch(e) {}
}

/**
 * Calculates current XP dynamically from live student journal & simulations
 */
function calculateLiveStudentXP() {
    const profile = getCareerProfile();
    const journal = (typeof getStudentJournal === 'function') ? getStudentJournal() : (window.studentJournal || []);
    
    let xp = 50; // Starter XP for registration & initialization
    const unlockedBadges = [...(profile.unlockedBadges || [])];

    // 1. Journal entries XP (+50 XP per balanced entry, +25 XP when posted to ledger)
    journal.forEach(entry => {
        xp += 50;
        if (entry.status === 'posted') {
            xp += 25;
        }
    });

    // 2. First attempt bonuses
    if (profile.firstAttemptCount > 0) {
        xp += (profile.firstAttemptCount * 30);
        if (profile.firstAttemptCount >= 5 && !unlockedBadges.includes('first_attempt_hero')) {
            unlockedBadges.push('first_attempt_hero');
        }
    }

    // 3. Hint penalties (-15 XP per hint)
    if (profile.hintsUsedCount > 0) {
        xp = Math.max(20, xp - (profile.hintsUsedCount * 15));
    }

    // 4. Bank Recon completed check
    try {
        const rawItems = localStorage.getItem('bank_statement_items');
        if (rawItems) {
            const items = JSON.parse(rawItems);
            if (Array.isArray(items) && items.length > 0 && items.every(i => i.matched)) {
                xp += 150;
                if (!unlockedBadges.includes('recon_master')) unlockedBadges.push('recon_master');
            }
        }
    } catch(e) {}

    // 5. Cash count completed check
    try {
        const rawCash = localStorage.getItem('acc_cash_count_state');
        if (rawCash) {
            const cashState = JSON.parse(rawCash);
            if (cashState && cashState.isBalanced) {
                xp += 150;
                if (!unlockedBadges.includes('treasury_guard')) unlockedBadges.push('treasury_guard');
            }
        }
    } catch(e) {}

    // 6. Inventory count completed check
    try {
        const rawInv = localStorage.getItem('acc_inv_count_state');
        if (rawInv) {
            const invState = JSON.parse(rawInv);
            if (invState && invState.isBalanced) {
                xp += 150;
                if (!unlockedBadges.includes('inventory_pro')) unlockedBadges.push('inventory_pro');
            }
        }
    } catch(e) {}

    // 7. Tax returns completed check
    try {
        const rawTax = localStorage.getItem('acc_tax_returns_state');
        if (rawTax) {
            const taxState = JSON.parse(rawTax);
            if (taxState && taxState.isCleared) {
                xp += 200;
                if (!unlockedBadges.includes('tax_specialist')) unlockedBadges.push('tax_specialist');
            }
        }
    } catch(e) {}

    // 8. Balanced Trial Balance
    try {
        const balances = (typeof calculateBalances === 'function') ? calculateBalances() : {};
        const entriesCount = journal.filter(j => j.status === 'posted').length;
        if (entriesCount >= 3) {
            let totalDr = 0, totalCr = 0;
            Object.keys(balances).forEach(code => {
                const b = balances[code];
                if (b > 0) totalDr += b;
                else if (b < 0) totalCr += Math.abs(b);
            });
            if (Math.abs(totalDr - totalCr) < 0.05 && totalDr > 0) {
                xp += 100;
                if (!unlockedBadges.includes('balance_master')) unlockedBadges.push('balance_master');
            }
        }
    } catch(e) {}

    // Check closing wizard
    try {
        if (localStorage.getItem('acc_annual_closing_completed') === 'true') {
            xp += 250;
            if (!unlockedBadges.includes('closing_master')) unlockedBadges.push('closing_master');
        }
    } catch(e) {}

    profile.baseXp = xp;
    profile.unlockedBadges = unlockedBadges;
    saveCareerProfile(profile);

    return {
        totalXp: xp,
        rank: getRankForXp(xp),
        unlockedBadges: unlockedBadges,
        profile: profile
    };
}

function getRankForXp(xp) {
    for (let i = CAREER_RANKS.length - 1; i >= 0; i--) {
        if (xp >= CAREER_RANKS[i].minXp) {
            const curr = CAREER_RANKS[i];
            const next = CAREER_RANKS[i + 1] || null;
            let progress = 100;
            let xpToNext = 0;
            if (next) {
                const range = next.minXp - curr.minXp;
                const earnedInRange = xp - curr.minXp;
                progress = Math.min(100, Math.max(0, Math.round((earnedInRange / range) * 100)));
                xpToNext = next.minXp - xp;
            }
            return {
                ...curr,
                currentXp: xp,
                progressToNext: progress,
                nextRank: next,
                xpToNext: xpToNext
            };
        }
    }
    return { ...CAREER_RANKS[0], currentXp: xp, progressToNext: 0, nextRank: CAREER_RANKS[1], xpToNext: 500 };
}

// =========================================================================
// 5-Pillars Skill Gap Diagnostic Engine
// =========================================================================

function generateSkillGapReport() {
    const journal = (typeof getStudentJournal === 'function') ? getStudentJournal() : (window.studentJournal || []);
    const balances = (typeof calculateBalances === 'function') ? calculateBalances() : {};
    const totalEntries = journal.length;
    const postedEntries = journal.filter(j => j.status === 'posted').length;

    // Check module states
    let hasBankRecon = false;
    try {
        const raw = localStorage.getItem('bank_statement_items');
        if (raw && JSON.parse(raw).every(i => i.matched)) hasBankRecon = true;
    } catch(e) {}

    let hasCashCount = false;
    try {
        const raw = localStorage.getItem('acc_cash_count_state');
        if (raw && JSON.parse(raw).isBalanced) hasCashCount = true;
    } catch(e) {}

    let hasInvCount = false;
    try {
        const raw = localStorage.getItem('acc_inv_count_state');
        if (raw && JSON.parse(raw).isBalanced) hasInvCount = true;
    } catch(e) {}

    let hasTaxReturn = false;
    try {
        const raw = localStorage.getItem('acc_tax_returns_state');
        if (raw && JSON.parse(raw).isCleared) hasTaxReturn = true;
    } catch(e) {}

    // Pillar 1: التوجيه المحاسبي وطبيعة الحسابات (Core Accounting & Entry Nature)
    let p1Score = Math.min(100, Math.round((postedEntries / Math.max(1, totalEntries)) * 70 + (totalEntries > 0 ? 30 : 0)));
    let p1Status = p1Score >= 80 ? 'إتقان ممتاز' : p1Score >= 50 ? 'مستوى متوسط' : 'يحتاج تدريب وتطبيق';
    let p1Desc = p1Score >= 80 
        ? 'قدرة عالية على التمييز بين طبيعة الحسابات المدينة والدائنة وصياغة القيود المركبة بدقة.'
        : 'يوجد تذبذب في سرعة اختيار أطراف القيد؛ يُنصح بمراجعة معادلة الميزانية وطبيعة الحسابات العكسية.';
    let p1Rec = 'راجع تصنيف الحسابات في شجرة الحسابات المصرية (الأصول والمصروفات مدينة بطبيعتها، الالتزامات وحقوق الملكية والإيرادات دائنة).';

    // Pillar 2: المعالجات والتشريعات الضريبية المصرية (Egyptian Tax Compliance)
    let p2Score = hasTaxReturn ? 95 : (journal.some(j => j.lines && j.lines.some(l => l.accountCode === '1106' || l.accountCode === '2102')) ? 60 : 35);
    let p2Status = p2Score >= 80 ? 'أخصائي ضرائب' : p2Score >= 50 ? 'مستوعب للأساسيات' : 'فجوة مهارية حرجة';
    let p2Desc = hasTaxReturn
        ? 'تمكن متميز من احتساب ضريبة القيمة المضافة 14% وإجراء المقاصة بنموذج 10 واستقطاعات نموذج 41.'
        : 'حاجة ملحة للتطبيق العملي على كيفية مقاصة ضريبة المدخلات (1106) مع ضريبة المخرجات (2102) وسداد الفارق للمصلحة.';
    let p2Rec = 'ادخل لمحاكي الإقرارات الضريبية واعتمد نموذج 10 لضريبة القيمة المضافة ثم رحّل قيد التسوية لليومية.';

    // Pillar 3: الرقابة الداخلية والجرد الفعلي (Internal Controls & Field Audits)
    let fieldCount = (hasBankRecon ? 1 : 0) + (hasCashCount ? 1 : 0) + (hasInvCount ? 1 : 0);
    let p3Score = Math.round((fieldCount / 3) * 100);
    let p3Status = p3Score >= 80 ? 'رقابة داخلية محكمة' : p3Score >= 33 ? 'مستوى ميداني مقبول' : 'لم يبدأ الجرد الميداني';
    let p3Desc = p3Score >= 80
        ? 'إتقان مكتمل لإجراءات الجرد الفعلي: مطابقة كشف حساب البنك، جرد فئات الخزينة، ومعالجة فروقات المخزون.'
        : `أتممت ${fieldCount} من أصل 3 محاكيات ميدانية. المحاسب الناجح في سوق العمل المصري يتقن التسوية البنكية وجرد الخزينة أولاً بأول.`;
    let p3Rec = 'أكمل دورة التسوية البنكية وجرد الخزينة لتأمين الدفاتر من العجز والاختلاسات الرقابية.';

    // Pillar 4: العمليات الختامية وميزان المراجعة (Reporting & Trial Balance)
    let p4Score = 40;
    let tbBalanced = false;
    let totalDr = 0, totalCr = 0;
    Object.keys(balances).forEach(k => {
        const b = balances[k];
        if (b > 0) totalDr += b; else if (b < 0) totalCr += Math.abs(b);
    });
    if (postedEntries > 0 && Math.abs(totalDr - totalCr) < 0.05) {
        tbBalanced = true;
        p4Score = 90;
    } else if (postedEntries > 0) {
        p4Score = 65;
    }
    let p4Status = p4Score >= 80 ? 'توازن محاسبي تام' : 'بانتظار اكتمال الترحيل';
    let p4Desc = tbBalanced
        ? 'ميزان المراجعة متزن ومطابق 100%. الترحيلات من اليومية إلى الأستاذ سليمة وموثوقة لإنشاء القوائم.'
        : 'يوجد عدم اكتمال في ترحيل بعض أطراف القيود لحسابات T بالأستاذ، مما يؤثر على تطابق ميزان المراجعة.';
    let p4Rec = 'توجه لدفتر الأستاذ العام وتأكد من ترحيل جميع القيود المعلقة حتى يتحول ميزان المراجعة إلى متزن باللون الأخضر.';

    // Pillar 5: التسويات الجردية والتمييز الرأسمالي (Adjustments & Capital/Revenue Nature)
    let hasPrepaidsOrAccruals = journal.some(j => j.lines && j.lines.some(l => ['1105', '2103', '5204', '1202'].includes(l.accountCode)));
    let p5Score = hasPrepaidsOrAccruals ? 85 : 45;
    let p5Status = p5Score >= 80 ? 'متقدم' : 'يحتاج تركيز';
    let p5Desc = hasPrepaidsOrAccruals
        ? 'استيعاب قوي لمبدأ الاستحقاق، التفرقة بين الإهلاك ومجمعه، والمصروفات المقدمة والمستحقة.'
        : 'يُنصح بالتدرب على قيود التسويات الجردية في نهاية الفترة المالية لتطبيق مبدأ مقابلة الإيرادات بالمصروفات بدقة.';
    let p5Rec = 'احرص على تسجيل مذكرات إطفاء المصروف المقدم وقسط الإهلاك السنوي للأصول الثابتة.';

    const overallScore = Math.round((p1Score + p2Score + p3Score + p4Score + p5Score) / 5);

    return {
        overallScore,
        pillars: [
            { id: 'core', title: '1. التوجيه المحاسبي وطبيعة الحسابات', score: p1Score, status: p1Status, desc: p1Desc, rec: p1Rec, icon: 'account_tree', color: 'blue' },
            { id: 'tax', title: '2. المعالجات والتشريعات الضريبية المصرية', score: p2Score, status: p2Status, desc: p2Desc, rec: p2Rec, icon: 'receipt_long', color: 'purple' },
            { id: 'internal_control', title: '3. الرقابة الداخلية والجرد الفعلي', score: p3Score, status: p3Status, desc: p3Desc, rec: p3Rec, icon: 'shield', color: 'emerald' },
            { id: 'reporting', title: '4. الترحيل وميزان المراجعة والقوائم', score: p4Score, status: p4Status, desc: p4Desc, rec: p4Rec, icon: 'balance', color: 'teal' },
            { id: 'adjustments', title: '5. التسويات الجردية ومبدأ الاستحقاق', score: p5Score, status: p5Status, desc: p5Desc, rec: p5Rec, icon: 'tune', color: 'amber' }
        ],
        summary: overallScore >= 80 
            ? 'مستوى مهني متقدم: جاهز للعمل كمحاسب عام أول أو رئيس حسابات في كبرى الشركات المصرية.'
            : overallScore >= 55 
            ? 'مستوى متوسط واعد: لديك أساسيات قوية ولكن تحتاج لإنهاء محاكيات الجرد والإقرارات الضريبية لبلوغ الجاهزية الكاملة.'
            : 'مستوى متدرب: يُنصح بالتركيز على إتقان دورة اليومية والأستاذ ومتابعة التلميحات المحاسبية.',
        timestamp: new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
    };
}

// =========================================================================
// UI Rendering: Career Bar in Dashboard & Modals
// =========================================================================

function renderCareerDashboardWidget() {
    const target = document.getElementById('career-widget-container');
    if (!target) return;

    const data = calculateLiveStudentXP();
    const rank = data.rank;
    const nextRank = rank.nextRank;
    const unlockedBadges = data.unlockedBadges;

    target.innerHTML = `
      <div class="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl shadow-lg p-5 sm:p-6 text-white relative overflow-hidden">
        <!-- Ambient background glows -->
        <div class="absolute -right-16 -top-16 w-52 h-52 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -left-16 -bottom-16 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <!-- Left: Rank Info & Progress -->
          <div class="flex items-start sm:items-center gap-4 min-w-0">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center flex-shrink-0 shadow-inner">
              <span class="material-symbols-outlined text-amber-400 text-[32px] sm:text-[40px]">${rank.icon}</span>
            </div>
            <div class="space-y-1 min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-xs px-2.5 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <span class="material-symbols-outlined text-[13px]">military_tech</span>
                  <span>الرتبة المهنية الحالية</span>
                </span>
                <span class="text-[11px] text-slate-300 font-mono">ID: ${data.profile.certId}</span>
              </div>
              <h3 class="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span>${rank.title}</span>
                <span class="text-xs font-normal text-slate-300 font-serif">(${rank.titleEn})</span>
              </h3>
              <p class="text-xs text-slate-300 max-w-xl leading-relaxed">${rank.roleDescription}</p>
            </div>
          </div>

          <!-- Right: XP Counter & Actions -->
          <div class="flex flex-col sm:flex-row sm:items-center lg:flex-col lg:items-end gap-3 flex-shrink-0">
            <div class="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-xl text-center sm:text-right lg:text-left flex items-center justify-between sm:justify-start gap-4">
              <div>
                <span class="text-[10px] text-slate-300 block uppercase font-mono tracking-wider">نقاط الخبرة المهنية (XP)</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-2xl font-black text-amber-400 font-mono">${data.totalXp.toLocaleString()}</span>
                  <span class="text-xs text-slate-300 font-mono">XP</span>
                </div>
              </div>
              <button onclick="openSkillGapModal()" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm">
                <span class="material-symbols-outlined text-[16px]">analytics</span>
                <span>تشخيص الفجوات المهارية</span>
              </button>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="openCertificateModal()" class="bg-white/15 hover:bg-white/25 text-white text-xs px-3.5 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border border-white/20">
                <span class="material-symbols-outlined text-[16px] text-amber-300">verified</span>
                <span>عرض شهادة الاعتماد</span>
              </button>
              <button onclick="openCareerTreeModal()" class="bg-white/10 hover:bg-white/20 text-slate-200 text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition cursor-pointer">
                <span>شجرة الرتب</span>
                <span class="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Progress to next rank bar -->
        <div class="mt-5 pt-4 border-t border-white/10 space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-slate-300 flex items-center gap-1">
              <span>الترقية القادمة:</span>
              <strong class="text-white">${nextRank ? nextRank.title : 'أعلى رتبة مهنية تم بلوغها'}</strong>
            </span>
            <span class="font-mono text-amber-300 font-bold">
              ${nextRank ? `متبقي ${rank.xpToNext} XP للوصول إلى ${nextRank.minXp} XP (${rank.progressToNext}%)` : '100% مكتمل'}
            </span>
          </div>
          <div class="w-full h-2.5 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div class="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-1000 shadow-sm" style="width: ${rank.progressToNext}%"></div>
          </div>
        </div>

        <!-- Mini Badges Bar -->
        <div class="mt-4 flex flex-wrap items-center gap-2 pt-2">
          <span class="text-[11px] text-slate-400 font-bold ml-1">الشارات المهنية:</span>
          ${ACHIEVEMENT_BADGES.map(b => {
              const isUnlocked = unlockedBadges.includes(b.id);
              return `
                <div class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg border transition ${isUnlocked ? 'bg-amber-400/20 text-amber-200 border-amber-400/40 shadow-2xs font-bold' : 'bg-white/5 text-slate-500 border-white/5 opacity-50 grayscale'}" title="${b.title} - ${b.desc}">
                  <span class="material-symbols-outlined text-[14px]">${b.icon}</span>
                  <span>${b.title}</span>
                  ${isUnlocked ? '<span class="text-amber-300 text-[10px]">✓</span>' : ''}
                </div>
              `;
          }).join('')}
        </div>
      </div>
    `;
}

// =========================================================================
// Modal 1: Skill Gap Diagnostic Report (A4 Printable & Interactive)
// =========================================================================

function openSkillGapModal() {
    let modal = document.getElementById('skill-gap-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'skill-gap-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(modal);
    }

    const report = generateSkillGapReport();
    const career = calculateLiveStudentXP();

    modal.innerHTML = `
      <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        <!-- Header (Screen Only) -->
        <div class="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-emerald-400">analytics</span>
            <span class="font-bold text-sm">تقرير تشخيص الفجوات المهارية والجاهزية الوظيفية (Skill Gap Report)</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة التقرير (A4)</span>
            </button>
            <button onclick="closeSkillGapModal()" class="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold cursor-pointer">✕</button>
          </div>
        </div>

        <!-- Printable Body -->
        <div id="skill-gap-printable-content" class="p-6 sm:p-10 overflow-y-auto flex-1 font-sans text-slate-900 text-right space-y-6">
          <!-- Official Header -->
          <div class="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div class="flex items-center gap-2 text-primary font-black text-lg">
                <span class="material-symbols-outlined text-[26px]">analytics</span>
                <span>منصة Accountera • المحاكي المهني لبيئة عمل المحاسب المصري</span>
              </div>
              <h1 class="text-xl sm:text-2xl font-black text-slate-900 mt-1">تقرير تشخيص الفجوات المهارية والكفاءة المحاسبية</h1>
              <p class="text-xs text-slate-500 mt-0.5">تقييم مبني على الأداء الفعلي في دورة العمل الدفترية والمحاكيات الميدانية</p>
            </div>
            <div class="text-left font-mono text-xs text-slate-600 space-y-0.5">
              <div><strong>تاريخ التقرير:</strong> ${report.timestamp}</div>
              <div><strong>الرتبة الحالية:</strong> ${career.rank.title}</div>
              <div><strong>الرصيد المهني:</strong> ${career.totalXp} XP</div>
              <div><strong>معرف الاعتماد:</strong> ${career.profile.certId}</div>
            </div>
          </div>

          <!-- Overall Readiness Summary -->
          <div class="bg-slate-50 border-2 border-slate-200 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="space-y-1">
              <span class="text-xs font-bold text-slate-500 uppercase tracking-wider">مؤشر الجاهزية لسوق العمل (Employability Score)</span>
              <h2 class="text-lg font-black text-slate-900">${report.summary}</h2>
              <p class="text-xs text-slate-600 leading-relaxed">
                يقيس هذا المؤشر قدرتك على استلام مهام محاسب بالشركات المصرية ومكاتب المحاسبة دون حاجة لتدريب تمهيدي.
              </p>
            </div>
            <div class="flex-shrink-0 text-center bg-white border border-slate-200 p-4 rounded-xl shadow-xs min-w-[140px]">
              <span class="text-3xl font-black ${report.overallScore >= 75 ? 'text-emerald-700' : report.overallScore >= 50 ? 'text-amber-700' : 'text-rose-700'} font-mono">${report.overallScore}%</span>
              <span class="block text-[11px] text-slate-500 font-bold mt-1">معدل الإتقان العام</span>
            </div>
          </div>

          <!-- 5 Pillars Breakdown -->
          <div class="space-y-4">
            <h3 class="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <span class="material-symbols-outlined text-[18px] text-blue-700">checklist</span>
              <span>تحليل المحاور المهنية الخمسة لمعايير المحاسبة والواقع العملي:</span>
            </h3>

            <div class="space-y-3">
              ${report.pillars.map(p => `
                <div class="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2 hover:border-slate-300 transition">
                  <div class="flex justify-between items-center">
                    <div class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-slate-700 text-[20px]">${p.icon}</span>
                      <h4 class="font-bold text-sm text-slate-900">${p.title}</h4>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${p.score >= 80 ? 'bg-emerald-100 text-emerald-800' : p.score >= 50 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'}">
                        ${p.status} (${p.score}%)
                      </span>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div class="h-full ${p.score >= 80 ? 'bg-emerald-600' : p.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'} rounded-full" style="width: ${p.score}%"></div>
                  </div>

                  <!-- Diagnosis & Recommendation -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                    <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-slate-700">
                      <strong class="text-slate-900 block mb-0.5">🔍 التشخيص المهني:</strong>
                      ${p.desc}
                    </div>
                    <div class="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-blue-950">
                      <strong class="text-blue-900 block mb-0.5">🎯 خطوة التطوير الموصى بها:</strong>
                      ${p.rec}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Professional Sign-off & Verification -->
          <div class="pt-6 border-t-2 border-slate-200 flex justify-between items-end text-xs text-slate-600">
            <div>
              <p class="font-bold text-slate-900">نظام التدقيق والتقييم الآلي - منصة Accountera</p>
              <p class="text-[11px] text-slate-500">تم التقييم وفق معايير المحاسبة المصرية (EAS) وقانون الضرائب 91 لسنة 2005 و 67 لسنة 2016</p>
            </div>
            <div class="text-center font-mono">
              <div class="w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center p-2 text-slate-400">
                <span class="material-symbols-outlined text-[28px] text-emerald-600">verified</span>
                <span class="text-[9px] font-bold text-slate-700 mt-1">ACCOUNTERA</span>
                <span class="text-[8px] text-slate-400">VERIFIED AUDIT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
}

function closeSkillGapModal() {
    const modal = document.getElementById('skill-gap-modal');
    if (modal) modal.classList.add('hidden');
}

// =========================================================================
// Modal 2: Digital Certificate Modal (شهادة الاعتماد المهنية الرقمية)
// =========================================================================

function openCertificateModal() {
    let modal = document.getElementById('certificate-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'certificate-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(modal);
    }

    const career = calculateLiveStudentXP();
    const rank = career.rank;
    const profile = career.profile;
    const dateStr = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    modal.innerHTML = `
      <div class="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        <!-- Top Toolbar (Screen only) -->
        <div class="p-4 bg-slate-900 text-white flex justify-between items-center print:hidden">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400">workspace_premium</span>
            <span class="font-bold text-sm">شهادة الكفاءة والاعتماد المهني الرقمية</span>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="window.print()" class="bg-amber-500 hover:bg-amber-600 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition cursor-pointer">
              <span class="material-symbols-outlined text-[16px]">print</span>
              <span>طباعة الشهادة (A4)</span>
            </button>
            <button onclick="closeCertificateModal()" class="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold cursor-pointer">✕</button>
          </div>
        </div>

        <!-- Certificate Canvas -->
        <div id="cert-printable-content" class="p-8 sm:p-12 overflow-y-auto flex-1 font-serif text-slate-900 text-center relative bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
          <!-- Elegant border frame -->
          <div class="border-4 border-double border-amber-800/60 p-8 sm:p-10 rounded-2xl relative shadow-inner">
            <!-- Decorative Corners -->
            <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-700"></div>
            <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-700"></div>
            <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-700"></div>
            <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-700"></div>

            <div class="space-y-6">
              <!-- Organization Header -->
              <div class="space-y-1">
                <div class="flex items-center justify-center gap-2 text-amber-900 font-sans font-bold text-xs uppercase tracking-widest">
                  <span class="material-symbols-outlined text-[18px]">verified</span>
                  <span>Accountera Professional Egyptian Accounting Simulator</span>
                </div>
                <h1 class="text-2xl sm:text-3xl font-black text-slate-900 font-serif">شهادة كفاءة واعتماد مهني في المحاسبة العملية</h1>
                <p class="text-xs text-slate-600 font-sans">Certificate of Practical Accounting Competency</p>
              </div>

              <!-- Recipient section -->
              <div class="py-4 space-y-2">
                <p class="text-sm text-slate-600 font-sans">تشهد منصة Accountera لمحاكاة بيئة عمل المحاسب المصري بأن الزميل /</p>
                <div class="inline-block border-b-2 border-slate-900 pb-1 px-8">
                  <h2 class="text-2xl sm:text-3xl font-black text-slate-950 font-sans">${profile.name}</h2>
                </div>
                <p class="text-sm text-slate-600 font-sans max-w-xl mx-auto pt-2 leading-relaxed">
                  قد أتم بنجاح متطلبات الدورة المستندية المحاسبية والمحاكاة الميدانية للواقع العملي المصري، واستحق الرتبة المهنية:
                </p>
                <div class="inline-block bg-amber-100/80 border-2 border-amber-400 text-amber-950 font-sans font-black text-lg sm:text-xl px-6 py-2 rounded-xl mt-2 shadow-xs">
                  ${rank.title} (${rank.titleEn})
                </div>
              </div>

              <!-- Competencies Breakdown -->
              <div class="max-w-2xl mx-auto bg-white/80 border border-amber-200/80 rounded-xl p-4 text-xs font-sans text-right space-y-2 text-slate-800">
                <strong class="text-amber-950 block border-b border-amber-100 pb-1">المهارات المعتمدة بالشهادة:</strong>
                <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] list-disc list-inside text-slate-700">
                  ${rank.requiredCompetencies.map(c => `<li>${c}</li>`).join('')}
                  <li>التسوية البنكية المستقلة للدفاتر</li>
                  <li>المعالجة الضريبية (ضريبة القيمة المضافة 14%)</li>
                </ul>
              </div>

              <!-- Verification Details & Signatures -->
              <div class="pt-8 border-t border-amber-200 grid grid-cols-3 gap-4 font-sans text-xs items-end">
                <div class="text-right space-y-1">
                  <span class="text-slate-500 block text-[10px]">تاريخ الاعتماد:</span>
                  <strong class="text-slate-900 block">${dateStr}</strong>
                  <span class="text-slate-500 block text-[10px]">الرصيد المحقق: ${career.totalXp} XP</span>
                </div>

                <!-- Digital Gold Seal -->
                <div class="flex justify-center">
                  <div class="w-24 h-24 rounded-full border-4 border-double border-amber-600 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex flex-col items-center justify-center text-slate-900 shadow-md">
                    <span class="material-symbols-outlined text-[26px]">verified</span>
                    <span class="text-[8px] font-black uppercase tracking-wider mt-0.5">ACCOUNTERA</span>
                    <span class="text-[7px] font-bold">OFFICIAL SEAL</span>
                  </div>
                </div>

                <div class="text-left space-y-1">
                  <span class="text-slate-500 block text-[10px]">رقم التحقق الإلكتروني:</span>
                  <strong class="font-mono text-slate-900 block text-[11px]">${profile.certId}</strong>
                  <span class="text-emerald-700 font-bold block text-[10px]">معتمد رسمياً بنظام EAS ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
}

function closeCertificateModal() {
    const modal = document.getElementById('certificate-modal');
    if (modal) modal.classList.add('hidden');
}

// =========================================================================
// Modal 3: Career Progression Tree Modal (شجرة الرتب المهنية الكاملة)
// =========================================================================

function openCareerTreeModal() {
    let modal = document.getElementById('career-tree-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'career-tree-modal';
        modal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto';
        document.body.appendChild(modal);
    }

    const career = calculateLiveStudentXP();
    const currentXp = career.totalXp;

    modal.innerHTML = `
      <div class="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div class="p-4 bg-slate-900 text-white flex justify-between items-center">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-400">account_tree</span>
            <span class="font-bold text-sm">شجرة الرتب المهنية ومسار التطوير المحاسبي</span>
          </div>
          <button onclick="closeCareerTreeModal()" class="text-slate-400 hover:text-white px-2 py-1 text-sm font-bold cursor-pointer">✕</button>
        </div>

        <div class="p-6 overflow-y-auto space-y-4 text-right font-sans">
          <div class="bg-blue-50 border border-blue-200 p-3.5 rounded-xl text-xs text-blue-900 leading-relaxed">
            💡 كل عملية تسجيل قيد، تسوية بنكية، جرد، أو إقرار ضريبي تمنحك نقاط خبرة (XP) لترقيتك عبر درجات السلم المهني من محاسب متدرب حتى مراجع حسابات قانوني.
          </div>

          <div class="space-y-3 relative before:absolute before:inset-0 before:right-6 before:w-0.5 before:bg-slate-200 before:z-0">
            ${CAREER_RANKS.map((r, idx) => {
                const isReached = currentXp >= r.minXp;
                const isCurrent = career.rank.id === r.id;
                return `
                  <div class="relative z-10 flex items-start gap-4 p-4 rounded-xl border transition ${isCurrent ? 'bg-amber-50/80 border-2 border-amber-400 shadow-sm' : isReached ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'}">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCurrent ? 'bg-amber-500 text-white shadow-md' : isReached ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}">
                      <span class="material-symbols-outlined text-[24px]">${r.icon}</span>
                    </div>

                    <div class="space-y-1 flex-1 min-w-0">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-center gap-2">
                          <h4 class="font-extrabold text-slate-900 text-sm">${r.title}</h4>
                          <span class="text-xs text-slate-500 font-serif">(${r.titleEn})</span>
                          ${isCurrent ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">رتبتك الحالية</span>' : ''}
                        </div>
                        <span class="font-mono text-xs font-bold ${isReached ? 'text-emerald-700' : 'text-slate-500'}">
                          ${r.minXp.toLocaleString()} - ${r.maxXp === Infinity ? 'ما فوق' : r.maxXp.toLocaleString()} XP
                        </span>
                      </div>
                      <p class="text-xs text-slate-600 leading-relaxed">${r.roleDescription}</p>
                      <div class="pt-1 flex flex-wrap gap-1">
                        ${r.requiredCompetencies.map(c => `
                          <span class="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            ${c}
                          </span>
                        `).join('')}
                      </div>
                    </div>
                  </div>
                `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
    modal.classList.remove('hidden');
}

function closeCareerTreeModal() {
    const modal = document.getElementById('career-tree-modal');
    if (modal) modal.classList.add('hidden');
}

// Global Exports
window.CAREER_RANKS = CAREER_RANKS;
window.ACHIEVEMENT_BADGES = ACHIEVEMENT_BADGES;
window.calculateLiveStudentXP = calculateLiveStudentXP;
window.generateSkillGapReport = generateSkillGapReport;
window.renderCareerDashboardWidget = renderCareerDashboardWidget;
window.openSkillGapModal = openSkillGapModal;
window.closeSkillGapModal = closeSkillGapModal;
window.openCertificateModal = openCertificateModal;
window.closeCertificateModal = closeCertificateModal;
window.openCareerTreeModal = openCareerTreeModal;
window.closeCareerTreeModal = closeCareerTreeModal;
