/**
 * admin-dashboard-view.js — لوحة التحكم المركزية والإدارية الشاملة
 * Complete Admin Suite: Plans, Coupons, Users, Audit Hub, & System Settings.
 */

const DEFAULT_ADMIN_PLANS = [
  {
    id: "free",
    name: "الباقة التأسيسية (Free)",
    price: 0,
    period: "مجاناً مدى الحياة",
    durationDays: 0, // 0 = مدى الحياة
    badge: "تأسيسي",
    icon: "book-open",
    color: "#10B981",
    maxLessons: 3,
    maxCompanies: 1,
    maxExercises: 5,
    allowAudit: false,
    allowExcelCycle: false,
    allowInterviewSim: false,
    allowSkillsPassport: false,
    allowLinkedInShare: false,
    features: [
      "الوصول للدروس الـ 3 الأولى",
      "حل الأمثلة المحلولة الأساسية",
      "محاكاة شركة تجارية واحدة",
      "دعم وضع الموبايل الكامل"
    ]
  },
  {
    id: "pro",
    name: "المحاسب المحترف (Pro)",
    price: 299,
    period: "شهر واحد",
    durationDays: 30, // 30 يوماً
    badge: "الأكثر طلباً",
    icon: "briefcase",
    color: "#3B82F6",
    maxLessons: 999,
    maxCompanies: 5,
    maxExercises: 26,
    allowAudit: true,
    allowExcelCycle: true,
    allowInterviewSim: true,
    allowSkillsPassport: true,
    allowLinkedInShare: true,
    features: [
      "فتح كافة الدروس التأسيسية (100%)",
      "محاكاة كاملة لكافة الشركات والقطاعات",
      "وضع المراجع الخارجي واكتشاف الأخطاء",
      "جناح الإكسل المحاسبي المتقدم",
      "جواز الكفاءة المهنية والشهادات",
      "مشاركة الاعتماد المهني مباشرة على LinkedIn"
    ]
  },
  {
    id: "vip",
    name: "خبير النمذجة (VIP Master)",
    price: 599,
    period: "سنة كاملة",
    durationDays: 365, // 365 يوماً
    badge: "النخبة",
    icon: "sparkle",
    color: "#8B5CF6",
    maxLessons: 999,
    maxCompanies: 999,
    maxExercises: 999,
    allowAudit: true,
    allowExcelCycle: true,
    allowInterviewSim: true,
    allowSkillsPassport: true,
    allowLinkedInShare: true,
    features: [
      "وصول كامل لكافة الشركات والمستندات",
      "تصدير التقارير المالية والقوائم",
      "أولوية مراجعة القيود المحاسبية",
      "شهادة إتمام معتمدة برقم تحقق",
      "محاكي المقابلات الشخصية الفنية للتوظيف",
      "تصدير واستيراد ملفات القيود لبرامج ERP",
      "شهادة خبرة رقمية موثقة برمز QR",
      "مشاركة الاعتماد وسجل الكفاءات على LinkedIn"
    ]
  }
];

const DEFAULT_ADMIN_COUPONS = [
  {
    code: "WELCOME2026",
    discountType: "PERCENTAGE",
    discountValue: 30,
    targetPlan: "pro",
    maxUses: 200,
    usedCount: 14,
    isActive: true,
    expiry: "2026-12-31"
  },
  {
    code: "FREEPASS100",
    discountType: "FREE_PASS",
    discountValue: 100,
    targetPlan: "vip",
    maxUses: 50,
    usedCount: 7,
    isActive: true,
    expiry: "2026-12-31"
  }
];

const DEFAULT_AUDIT_ENGAGEMENTS = [
  {
    id: "audit-1",
    companyName: "شركة النيل للتجارة الهندسية ش.م.م",
    sector: "التجارة والتوزيع",
    logo: "buildings",
    badge: "مراجعة دورية",
    materialityThreshold: 15000,
    description: "مراجعة وتدقيق حسابات المشتريات والمصروفات الرأسمالية والتحقق من صحة التوجيه المحاسبي وقيود التسوية.",
    samples: [
      {
        id: "s-1",
        num: 1,
        title: "شراء أجهزة خوادم للشبكة",
        recordedEntry: { dr: "مصروف الصيانة", cr: "النقدية بالبنك", amount: 28000 },
        document: { type: "فاتورة ضريبية", no: "INV-9921", amount: 28000, vendor: "دلتا للحلول التقنية" },
        isError: true,
        errorCategory: "أخطاء رسملة الأصول",
        errorDesc: "تم تسجيل شراء خادم رئيسي كـ مصروف صيانة بدلاً من رسملته كـ أصل ثابت (معدات وأجهزة).",
        correctAje: { dr: "المعدات والأجهزة", cr: "مصروف الصيانة", amount: 28000, desc: "إلغاء المصروف ورسملة الأصل الثابت" }
      },
      {
        id: "s-2",
        num: 2,
        title: "سداد إيجار المعرض والمكاتب",
        recordedEntry: { dr: "مصروف الإيجار", cr: "النقدية بالخزينة", amount: 12000 },
        document: { type: "إيصال استلام إيجار", no: "REC-401", amount: 12000, vendor: "شركة الأبراج العقارية" },
        isError: false,
        errorCategory: "عملية سليمة 100%",
        errorDesc: "المعاملة مطابقة للمستند المرفق ومسجلة بشكل سليم.",
        correctAje: null
      }
    ]
  }
];

const DEFAULT_ADMIN_COMPANIES = (typeof DEFAULT_PLATFORM_COMPANY !== 'undefined') ? [DEFAULT_PLATFORM_COMPANY] : [];

const ExcelAdminDashboard = {
  activeTab: 'overview', // 'overview' | 'plans' | 'coupons' | 'users' | 'audit' | 'settings'
  editingPlanId: null,
  selectedAuditId: 'audit-1',
  userRoleFilter: 'all', // 'all' | 'student' | 'teacher' | 'admin'
  usersSearch: '',

  // البيانات المحملة من localStorage
  pendingSubscriptions: [],
  pendingSubsLoaded: false,
  plans: [],
  coupons: [],
  auditEngagements: [],
  companies: [],
  systemConfig: {
    enforcePlanGating: false,
    maintenanceMode: false,
    certificateWatermark: "منصة المحاسب المعتمدة 2026",
    defaultCurrency: "ج.م",
    trialEnabled: true,
    trialDays: 3,
    trialPlan: "pro"
  },

  requireAdmin() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const isAdmin = user && user.role === 'admin';
    if (!isAdmin) {
      console.error('[ExcelAdminDashboard] Unauthorized admin action attempt blocked');
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('غير مصرح لك بتنفيذ هذا الإجراء الإداري.', 'error');
      }
      throw new Error('غير مصرح لك بتنفيذ هذا الإجراء الإداري');
    }
    return user;
  },

  async loadPlans() {
    if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.getPlans === 'function') {
      try {
        const remotePlans = await SupabaseService.getPlans();
        if (remotePlans && remotePlans.length > 0) {
          this.plans = remotePlans;
          this.plansLoaded = true;
          if (this.activeTab === 'plans' && !this.editingPlanId) {
            const content = document.getElementById('adminTabContent');
            if (content) {
              content.innerHTML = this.renderPlansTab();
            }
          }
        }
      } catch (err) {
        console.warn('[AdminDashboard] Error loading plans from cloud:', err);
      }
    }
  },

  init() {
    try {
      // تنظيف مفتاح الباقات القديم من التخزين المحلي
      try { localStorage.removeItem('acc_admin_plans'); } catch(e) {}
      if (!this.plans || this.plans.length === 0) {
        this.plans = (typeof DEFAULT_ADMIN_PLANS !== 'undefined') ? DEFAULT_ADMIN_PLANS : [];
      }
      this.loadPlans();

      const savedCoupons = localStorage.getItem('acc_admin_coupons');
      this.coupons = savedCoupons ? JSON.parse(savedCoupons) : DEFAULT_ADMIN_COUPONS;

      const savedAudit = localStorage.getItem('acc_admin_audit');
      this.auditEngagements = savedAudit ? JSON.parse(savedAudit) : DEFAULT_AUDIT_ENGAGEMENTS;

      const savedComps = localStorage.getItem('acc_admin_companies');
      const parsedComps = savedComps ? JSON.parse(savedComps) : null;
      this.companies = (Array.isArray(parsedComps) && parsedComps.length > 0) ? parsedComps : DEFAULT_ADMIN_COMPANIES;

      const savedConfig = localStorage.getItem('acc_admin_config');
      if (savedConfig) {
        this.systemConfig = Object.assign(this.systemConfig, JSON.parse(savedConfig));
      }
    } catch (e) {
      console.warn('Failed to load admin data from storage', e);
    }
  },

  saveState(key) {
    try {
      if (!key || key === 'coupons') localStorage.setItem('acc_admin_coupons', JSON.stringify(this.coupons));
      if (!key || key === 'audit') localStorage.setItem('acc_admin_audit', JSON.stringify(this.auditEngagements));
      if (!key || key === 'companies') {
        localStorage.setItem('acc_admin_companies', JSON.stringify(this.companies));
        if (typeof SupabaseService !== 'undefined' && SupabaseService.client) {
          this.companies.forEach(comp => SupabaseService.saveCompany(comp));
        }
      }
      if (!key || key === 'config') localStorage.setItem('acc_admin_config', JSON.stringify(this.systemConfig));
    } catch (e) {}
  },

  render(subScreen = 'overview') {
    this.init();
    if (subScreen && subScreen.startsWith('admin-')) {
      const tabKey = subScreen.replace('admin-', '');
      if (['overview', 'companies', 'plans', 'coupons', 'users', 'audit', 'settings'].includes(tabKey)) {
        this.activeTab = tabKey;
      }
    } else if (['overview', 'companies', 'plans', 'coupons', 'users', 'audit', 'settings'].includes(subScreen)) {
      this.activeTab = subScreen;
    }

    return `
      <div class="admin-container">
        <!-- هيدر لوحة التحكم المركزية -->
        <div class="admin-hero-card">
          <div class="admin-hero-header">
            <div>
              <div class="admin-badge" style="display:inline-flex; align-items:center; gap:6px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('shield', { size: 14 }) : ''}
                <span>لوحة التحكم المركزية والإدارية</span>
              </div>
              <h1 class="admin-hero-title">منظومة إدارة المحاسب المبتدئ (Admin OS)</h1>
              <p class="admin-hero-desc">إدارة شاملة للباقات، أكواد التفعيل، دليل المستخدمين، ملفات التدقيق، والنسخ الاحتياطي</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.exportBackupJson()">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 14 }) : ''}
                <span>تصدير نسخة شاملة</span>
              </button>
              <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('settings')">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 14 }) : ''}
                <span>الإعدادات العامة</span>
              </button>
            </div>
          </div>

          <!-- شريط التبويبات الـ 7 المطابقة للمخطط -->
          <div class="admin-tabs-nav">
            <button class="admin-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('overview')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 14 }) : ''}
              <span>المؤشرات العامة</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'companies' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('companies')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 14 }) : ''}
              <span>محاكاة الشركات</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'plans' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('plans')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 14 }) : ''}
              <span>الباقات والتسعير</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'coupons' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('coupons')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('ticket', { size: 14 }) : ''}
              <span>أكواد الخصم والتفعيل</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'users' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('users')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('users', { size: 14 }) : ''}
              <span>دليل المستخدمين</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'audit' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('audit')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('search', { size: 14 }) : ''}
              <span>إدارة المراجعة والتدقيق</span>
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'settings' ? 'active' : ''}" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.switchTab('settings')">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 14 }) : ''}
              <span>مفاتيح المنظومة والنسخ</span>
            </button>
          </div>
        </div>

        <!-- محتوى التبويب النشط -->
        <div id="adminTabContent">
          ${this.renderActiveTab()}
        </div>
      </div>
    `;
  },

  switchTab(tab, resetEditor = true) {
    this.activeTab = tab;
    if (resetEditor) {
      this.editingPlanId = null;
    }
    const content = document.getElementById('adminTabContent');
    const container = document.querySelector('.admin-container');
    if (content) {
      // تحديث أزرار التبويب
      document.querySelectorAll('.admin-tab-btn').forEach((b, idx) => {
        const tabs = ['overview', 'companies', 'plans', 'coupons', 'users', 'audit', 'settings'];
        if (tabs[idx] === tab) b.classList.add('active');
        else b.classList.remove('active');
      });
      content.innerHTML = this.renderActiveTab();
    } else if (container && container.parentElement) {
      container.parentElement.innerHTML = this.render('admin-' + tab);
    }

    // مزامنة الروابط العلوية والسفلية
    document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
      const onclickAttr = link.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'admin-${tab}'`) || onclickAttr.includes(`"${tab}"`)) {
        link.classList.add('active');
      } else if (onclickAttr.includes('admin-')) {
        link.classList.remove('active');
      }
    });
    document.querySelectorAll('.bottom-nav-item').forEach(btn => {
      if (btn.id === `bn-admin-${tab}`) btn.classList.add('active');
      else if (btn.id && btn.id.startsWith('bn-admin-')) btn.classList.remove('active');
    });
  },

  renderActiveTab() {
    switch (this.activeTab) {
      case 'overview': return this.renderOverviewTab();
      case 'companies': return this.renderCompaniesTab();
      case 'plans': return this.renderPlansTab();
      case 'coupons': return this.renderCouponsTab();
      case 'users': return this.renderUsersTab();
      case 'audit': return this.renderAuditTab();
      case 'settings': return this.renderSettingsTab();
      default: return this.renderOverviewTab();
    }
  },

  // 1. تبويب المؤشرات العامة (Overview)
  renderOverviewTab() {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('jr_users') || '[]');
    } catch (e) {}

    const proPlan = this.plans?.find(p => p.id === 'pro');
    const vipPlan = this.plans?.find(p => p.id === 'vip');
    const proPrice = proPlan ? Number(proPlan.price) : 299;
    const vipPrice = vipPlan ? Number(vipPlan.price) : 599;
    const estimatedRev = (proCount * proPrice) + (vipCount * vipPrice);

    return `
      <!-- 1. شبكة بطاقات الأداء المالي والمنظومة -->
      <div class="admin-metrics-grid">
        <div class="admin-metric-card" style="border-top: 4px solid var(--tier-starter);">
          <div class="metric-number tabular-nums font-mono" style="color: var(--tier-starter);">${this.companies.length}</div>
          <div class="metric-title" style="display:flex; align-items:center; justify-content:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 16 }) : ''}
            <span>شركات المحاكاة النشطة</span>
          </div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid var(--tier-pro);">
          <div class="metric-number tabular-nums font-mono" style="color: var(--tier-pro);">${users.length || 1}</div>
          <div class="metric-title">إجمالي الطلاب المسجلين</div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid var(--warning);">
          <div class="metric-number tabular-nums font-mono" style="color: var(--warning);"><span class="tabular-nums font-mono">${estimatedRev.toLocaleString()}</span> ج.م</div>
          <div class="metric-title">الإيرادات التقديرية</div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid var(--tier-vip);">
          <div class="metric-number tabular-nums font-mono" style="color: var(--tier-vip);">${this.coupons.filter(c => c.isActive).length}</div>
          <div class="metric-title">أكواد الخصم النشطة</div>
        </div>
      </div>

      <!-- 2. بطاقة حالة قيود الباقات والتراخيص -->
      <div class="admin-status-box">
        <div>
          <span class="status-badge-chip ${this.systemConfig.enforcePlanGating ? 'chip-active' : 'chip-open'}">
            ${this.systemConfig.enforcePlanGating ? 'PLAN GATING ACTIVE' : 'OPEN ACCESS DEMO'}
          </span>
          <h3 style="margin: 0 0 6px; font-size: 1.15rem; font-weight: 800; color: var(--text-primary);">
            حالة قيود الباقات والتراخيص:
          </h3>
          <p style="margin: 0; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            ${this.systemConfig.enforcePlanGating
              ? 'القيود مفعلة: الطلاب في الباقة المجانية مقيدون بمحتوى محدد ويطلب منهم الترقية للوصول للأقسام المتقدمة.'
              : 'الوصول المفتوح مفعل (Open Access): كافة الدروس والشركات مفتوحة لجميع المستخدمين للتجربة والتقييم.'}
          </p>
        </div>
        <button class="btn-workspace-action ${this.systemConfig.enforcePlanGating ? 'btn-workspace-action' : 'btn-workspace-primary'}" onclick="ExcelAdminDashboard.togglePlanGating()">
          ${this.systemConfig.enforcePlanGating ? 'تعطيل القيود (فتح المنصة للجميع)' : 'تفعيل قيود الباقات والترقية'}
        </button>
      </div>

      <!-- 3. بوابات الوصول السريع -->
      <div class="admin-quick-portals">
        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('companies')">
          <span class="portal-tag" style="color: var(--tier-starter);">COMPANIES SIMULATION</span>
          <h4 class="portal-title">إدارة محاكاة الشركات</h4>
          <p class="portal-desc">إضافة شركات جديدة، تحرير بيانات النشاط، وتعديل سندات العمليات.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('plans')">
          <span class="portal-tag" style="color: var(--tier-pro);">PLANS & PRICING</span>
          <h4 class="portal-title">إدارة الباقات والأسعار</h4>
          <p class="portal-desc">التحكم بأسعار الباقات، مدة الاشتراك، والمميزات المسموحة.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('coupons')">
          <span class="portal-tag" style="color: var(--warning);">COUPONS & PROMOS</span>
          <h4 class="portal-title">أكواد الخصم والتفعيل</h4>
          <p class="portal-desc">إنشاء كوبونات ترويجية وبطاقات تفعيل مجانية 100% للطلاب.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('settings')">
          <span class="portal-tag" style="color: var(--tier-vip);">SYSTEM & BACKUP</span>
          <h4 class="portal-title">النسخ الاحتياطي والإعدادات</h4>
          <p class="portal-desc">تصدير واستيراد بيانات المنصة بالكامل كملف JSON آمن.</p>
        </div>
      </div>
    `;
  },

  // 2. تبويب محاكاة مجمع الشركات (Companies Simulation Manager)
  renderCompaniesTab() {
    return `
      <!-- شريط الإجراءات العلوي لإدارة الشركات -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 20 }) : ''}
            <span>إدارة محاكاة مجمع الشركات (${this.companies.length})</span>
          </h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">إضافة الشركات، استيراد الحزم التدريبية الشاملة (JSON)، وتعديل سندات العمليات والفواتير</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <!-- زر استيراد ملف JSON من الجهاز -->
          <input type="file" id="admin_import_company_json" accept=".json" style="display:none;" onchange="ExcelAdminDashboard.handleCompanyJsonUpload(event)">
          <button class="btn-workspace-action btn-workspace-primary" style="background:var(--success); color:var(--text-inverse); display:inline-flex; align-items:center; gap:6px;" onclick="document.getElementById('admin_import_company_json').click()" title="رفع ملف حزمة تدريبية JSON لأي شركة من جهازك">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 14 }) : ''}
            <span>استيراد شركة من ملف تدريبي (JSON)</span>
          </button>

          <!-- زر إضافة شركة يدوياً -->
          <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.showAddCompanyModal()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
            <span>إضافة شركة جديدة (يدوي)</span>
          </button>
        </div>
      </div>

      <!-- بطاقة تنبيه إرشادية للمسؤول -->
      <div style="background:rgba(37, 99, 235, 0.05); border:1px solid rgba(37, 99, 235, 0.2); border-radius:12px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="color:var(--primary);">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lightbulb', { size: 20 }) : '★'}</span>
          <div style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5;">
            <strong style="color:var(--text-primary);">طريقة إضافة شركات المحاكاة:</strong>
            اضغط على <strong>"استيراد شركة من ملف تدريبي (JSON)"</strong> لرفع أي ملف شركة مخرج من المولد (<code style="background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:4px;">.json</code>) لإنشاء الشركة وقراءة كافة العمليات والسندات التابعة لها تلقائياً، أو اضغط <strong>"إضافة شركة جديدة"</strong> للإنشاء اليدوي.
          </div>
        </div>
      </div>

      <!-- قائمة الشركات أو حالة عدم وجود شركات -->
      ${this.companies.length === 0 ? `
        <div style="text-align:center; padding: 3.5rem 1.5rem; background: var(--surface-card); border-radius: 16px; border: 2px dashed var(--border-subtle); max-width: 680px; margin: 0 auto;">
          <div style="margin-bottom: 0.8rem; color: var(--text-muted); display:flex; justify-content:center;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 40 }) : ''}
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">لا توجد شركات محاكاة مضافة حالياً في المنظومة</h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem; max-width: 520px; margin-left:auto; margin-right:auto;">
            يمكنك استيراد بيئة تدريب شركة متكاملة مع كافة عملياتها من ملف JSON مخرج من المولد المحاسبي، أو إنشاء شركة جديدة يدوياً.
          </p>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <button class="btn-workspace-action btn-workspace-primary" style="background:var(--success); color:var(--text-inverse); padding:10px 22px; font-weight:700; display:inline-flex; align-items:center; gap:6px;" onclick="document.getElementById('admin_import_company_json').click()">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 14 }) : ''}
              <span>استيراد شركة من ملف تدريبي (JSON)</span>
            </button>
            <button class="btn-workspace-action" style="padding:10px 20px; font-weight:700; display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.showAddCompanyModal()">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
              <span>إنشاء شركة جديدة (يدوي)</span>
            </button>
          </div>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:24px;">
          ${this.companies.map((comp, cIdx) => `
            <div class="admin-editor-card" style="border-right: 4px solid var(--tier-starter); margin-bottom:0;">
              <!-- هيدر بطاقة الشركة -->
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:12px; background:var(--tier-starter-bg); color:var(--tier-starter);">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 24 }) : ''}
                  </span>
                  <div>
                    <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-primary);">${comp.name}</h3>
                    <div style="display:flex; gap:6px; margin-top:4px; flex-wrap:wrap;">
                      <span style="background:var(--tier-pro-bg); color:var(--tier-pro); padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${comp.sector || 'قطاع عام'}</span>
                      <span style="background:rgba(245, 158, 11, 0.1); color:var(--warning); padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${(comp.transactions || []).length} سندات مالية</span>
                      ${comp.capital ? `<span style="background:var(--tier-starter-bg); color:var(--tier-starter); padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">رأس المال: ${Number(comp.capital).toLocaleString()} ج.م</span>` : ''}
                    </div>
                  </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button class="btn-workspace-action btn-workspace-primary" style="background:var(--primary); color:var(--text-inverse); display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.deployCompanyToSimulator('${comp.id}')" title="فتح واختبار هذه الشركة مباشرة في بيئة المحاكي">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 14 }) : ''}
                    <span>تشغيل بالمحاكي</span>
                  </button>
                  <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.exportCompanyJson('${comp.id}')" title="تصدير بيانات الشركة وسنداتها كملف JSON">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 14 }) : ''}
                    <span>تصدير JSON</span>
                  </button>
                  <input type="file" id="comp_csv_file_${comp.id}" accept=".csv" style="display:none;" onchange="ExcelAdminDashboard.importCompanyTransactionsFromCsv(event, '${comp.id}')">
                  <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="document.getElementById('comp_csv_file_${comp.id}').click()" title="رفع ملف اليومية أو السندات (journal.csv)">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('upload', { size: 14 }) : ''}
                    <span>استيراد CSV</span>
                  </button>
                  <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.saveCompanyMeta('${comp.id}')">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('save', { size: 14 }) : ''}
                    <span>حفظ</span>
                  </button>
                  <button class="btn-workspace-action" style="color:var(--danger); display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.deleteCompany('${comp.id}')">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : ''}
                    <span>حذف</span>
                  </button>
                </div>
              </div>

              <!-- حقول تفاصيل الشركة -->
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:14px;">
                <div class="admin-form-group">
                  <label>اسم الشركة:</label>
                  <input type="text" id="adm_cname_${comp.id}" class="admin-form-input" value="${comp.name}">
                </div>
                <div class="admin-form-group">
                  <label>القطاع والنشاط الاقتصادي:</label>
                  <input type="text" id="adm_csector_${comp.id}" class="admin-form-input" value="${comp.sector || ''}">
                </div>
                <div class="admin-form-group">
                  <label>رأس المال (ج.م):</label>
                  <input type="number" id="adm_ccapital_${comp.id}" class="admin-form-input" value="${comp.capital || 2000000}">
                </div>
                <div class="admin-form-group">
                  <label>المسمى الوظيفي للطالب:</label>
                  <input type="text" id="adm_crole_${comp.id}" class="admin-form-input" value="${comp.role || 'محاسب مالي'}">
                </div>
              </div>

              <div class="admin-form-group">
                <label>وصف الشركة والمهام المحاسبية:</label>
                <textarea id="adm_cdesc_${comp.id}" class="admin-form-textarea" rows="2">${comp.description || ''}</textarea>
              </div>

              <!-- شريط العمليات والسندات المالية -->
              <div style="border-top:1px dashed var(--border-subtle); padding-top:14px; margin-top:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
                  <h4 style="margin:0; font-size:0.98rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 16 }) : ''}
                    <span>سندات وفواتير العمليات (${(comp.transactions || []).length} سند مسجل):</span>
                  </h4>
                  <div style="display:flex; gap:8px;">
                    <button class="btn-workspace-action btn-workspace-primary" style="padding:4px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.showAddTransactionModal('${comp.id}')">
                      ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
                      <span>إضافة سند مالي يدوي</span>
                    </button>
                    ${(comp.transactions || []).length > 10 ? `
                      <button class="btn-workspace-action" style="padding:4px 12px; font-size:0.8rem; display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.toggleTransactionsExpand('${comp.id}')" id="btn_expand_${comp.id}">
                        ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 14 }) : ''}
                        <span>عرض كافة السندات (${(comp.transactions || []).length})</span>
                      </button>
                    ` : ''}
                  </div>
                </div>

                <!-- معاينة السندات المالية -->
                <div style="display:flex; flex-direction:column; gap:8px;" id="tx_container_${comp.id}">
                  ${(comp.transactions || []).length === 0 ? `
                    <div style="text-align:center; padding:16px; color:var(--text-muted); font-size:0.88rem;">لا توجد سندات مضافة لهذه الشركة حتى الآن. اضغط على 'إضافة سند مالي' أو استورد من ملف JSON/CSV.</div>
                  ` : (comp.transactions || []).slice(0, 10).map((t, tIdx) => `
                    <div style="background:var(--surface-ground); border:1px solid var(--border-subtle); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
                      <div style="flex:1; min-width:240px;">
                        <div style="display:flex; align-items:center; gap:8px;">
                          <strong style="font-size:0.9rem; color:var(--text-primary);">سند #${t.num || tIdx + 1} (${t.date || '2026-01-15'}): ${t.title || t.type || 'سند مالي'}</strong>
                          ${t.difficulty ? `<span style="background:var(--tier-pro-bg); color:var(--tier-pro); font-size:0.7rem; font-weight:bold; padding:1px 6px; border-radius:4px;">${t.difficulty}</span>` : ''}
                        </div>
                        <p style="margin:3px 0 4px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${t.desc || ''}</p>
                        <div style="font-size:0.78rem; font-family:'JetBrains Mono',monospace;">
                          ${t.lines && t.lines.length > 0 
                            ? `<span style="color:var(--success); font-weight:700;">✓ قيد مزدوج متوازن (${t.lines.length} أطراف)</span>` 
                            : `مدين: <span style="color:var(--primary); font-weight:700;">${t.dr}</span> | دائن: <span style="color:var(--success); font-weight:700;">${t.cr}</span>`}
                          | المبلغ: <strong style="color:var(--text-primary);">${(t.amount || 0).toLocaleString()} ج.م</strong>
                        </div>
                      </div>
                      <button class="btn-workspace-action" style="color:var(--danger); padding:4px 10px; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;" onclick="ExcelAdminDashboard.deleteCompanyTransaction('${comp.id}', '${t.id}')">
                        ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : ''}
                        <span>حذف</span>
                      </button>
                    </div>
                  `).join('')}

                  ${(comp.transactions || []).length > 10 ? `
                    <div style="text-align:center; padding:10px; background:var(--bg-secondary); border-radius:8px; font-size:0.84rem; color:var(--text-muted);" id="tx_more_notice_${comp.id}">
                      تم عرض 10 سندات من أصل <strong>${comp.transactions.length}</strong> سنداً مالياً. اضغط على <strong>"عرض كافة السندات"</strong> لتصفح القائمة كاملة.
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    `;
  },

  toggleTransactionsExpand(compId) {
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;
    const container = document.getElementById(`tx_container_${compId}`);
    const btn = document.getElementById(`btn_expand_${compId}`);
    const moreNotice = document.getElementById(`tx_more_notice_${compId}`);
    if (!container || !btn) return;

    const isExpanded = btn.getAttribute('data-expanded') === 'true';
    if (isExpanded) {
      btn.setAttribute('data-expanded', 'false');
      btn.innerHTML = `${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 14 }) : ''} <span>عرض كافة السندات (${comp.transactions.length})</span>`;
      if (moreNotice) moreNotice.style.display = 'block';
      this.switchTab('companies');
    } else {
      btn.setAttribute('data-expanded', 'true');
      btn.innerHTML = `${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 14 }) : ''} <span>طي السندات (عرض 10 فقط)</span>`;
      if (moreNotice) moreNotice.style.display = 'none';
      container.innerHTML = comp.transactions.map((t, tIdx) => `
        <div style="background:var(--surface-ground); border:1px solid var(--border-subtle); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="flex:1; min-width:240px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:0.9rem; color:var(--text-primary);">سند #${t.num || tIdx + 1} (${t.date || '2026-01-15'}): ${t.title || t.type || 'سند مالي'}</strong>
              ${t.difficulty ? `<span style="background:var(--tier-pro-bg); color:var(--tier-pro); font-size:0.7rem; font-weight:bold; padding:1px 6px; border-radius:4px;">${t.difficulty}</span>` : ''}
            </div>
            <p style="margin:3px 0 4px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${t.desc || ''}</p>
            <div style="font-size:0.78rem; font-family:'JetBrains Mono',monospace;">
              ${t.lines && t.lines.length > 0 
                ? `<span style="color:var(--success); font-weight:700;">✓ قيد مزدوج متوازن (${t.lines.length} أطراف)</span>` 
                : `مدين: <span style="color:var(--primary); font-weight:700;">${t.dr}</span> | دائن: <span style="color:var(--success); font-weight:700;">${t.cr}</span>`}
              | المبلغ: <strong style="color:var(--text-primary);">${(t.amount || 0).toLocaleString()} ج.م</strong>
            </div>
          </div>
          <button class="btn-workspace-action" style="color:var(--danger); padding:4px 10px; font-size:0.8rem; display:inline-flex; align-items:center; gap:4px;" onclick="ExcelAdminDashboard.deleteCompanyTransaction('${comp.id}', '${t.id}')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : ''}
            <span>حذف</span>
          </button>
        </div>
      `).join('');
    }
  },

  async deployCompanyToSimulator(compId) {
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) {
      if (typeof AccModal !== 'undefined') AccModal.toast('الشركة غير موجودة.', 'error');
      else alert('الشركة غير موجودة.');
      return;
    }
    if (!comp.transactions || comp.transactions.length === 0) {
      let conf = true;
      if (typeof AccModal !== 'undefined') {
        conf = await AccModal.confirm({
          title: 'الشركة بدون سندات مسجلة',
          message: 'هذه الشركة لا تحتوي على سندات مالية حالياً. هل ترغب في فتح المحاكي بها خالية لتسجيل قيود حرة؟',
          confirmText: 'نعم، افتح المحاكي',
          cancelText: 'إلغاء'
        });
      } else {
        conf = confirm('هذه الشركة لا تحتوي على سندات مالية حالياً. هل ترغب في فتح المحاكي بها خالية لتسجيل قيود حرة؟');
      }
      if (!conf) return;
    }
    if (typeof SimulationBridge !== 'undefined') {
      SimulationBridge.launchCompanyInSimulator(comp);
    } else {
      window.location.href = 'simulation/simulation/dashboard/index.html';
    }
  },

  showAddCompanyModal() {
    let overlay = document.getElementById('adminCompanyModalOverlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'adminCompanyModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => {
      if (e.target === overlay) ExcelAdminDashboard.closeAddCompanyModal();
    };

    overlay.innerHTML = `
      <div class="modal-sheet" style="max-width: 540px; width: 92%;">
        <span class="sheet-drag-handle"></span>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="modal-icon-badge">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 24 }) : ''}</span>
            <div>
              <h3 class="modal-title">إضافة شركة محاكاة جديدة</h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: var(--text-muted);">تخصيص بيانات بيئة العمل المحاسبية ورأس المال</p>
            </div>
          </div>
          <button class="modal-close-btn" onclick="ExcelAdminDashboard.closeAddCompanyModal()">✕</button>
        </div>

        <div style="padding: 12px 0; display: flex; flex-direction: column; gap: 14px;">
          <div class="admin-form-group">
            <label>اسم الشركة أو المنشأة *</label>
            <input type="text" id="modal_cname" class="admin-form-input" placeholder="مثال: شركة النور للتجارة والتوزيع" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>القطاع والنشاط الاقتصادي *</label>
              <input type="text" id="modal_csector" class="admin-form-input" placeholder="مثال: تجارة الأجهزة والخدمات" value="تجارة وخدمات">
            </div>
            <div class="admin-form-group">
              <label>رأس المال التأسيسي (ج.م)</label>
              <input type="number" id="modal_ccapital" class="admin-form-input" value="2000000">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>المسمى الوظيفي للطالب</label>
              <input type="text" id="modal_crole" class="admin-form-input" value="محاسب مالي عام">
            </div>
            <div class="admin-form-group">
              <label>نوع ونشاط الشركة</label>
              <select id="modal_cicon" class="admin-form-input">
                <option value="buildings">مؤسسة / شركة عامة</option>
                <option value="bank">خدمات مالية وبنكية</option>
                <option value="trend-up">طاقة وإلكترونيات</option>
                <option value="package">تجارة وتوزيع وسلع</option>
                <option value="briefcase">مقاولات وصيانة وخدمات</option>
                <option value="shield">رعاية صحية وتأمين</option>
                <option value="gift">أغذية ومطاعم وتجزئة</option>
              </select>
            </div>
          </div>

          <div class="admin-form-group">
            <label>وصف طبيعة الشركة والمهام</label>
            <textarea id="modal_cdesc" class="admin-form-textarea" rows="3" placeholder="بيئة تدريب محاسبي متكاملة تشمل فحص المستندات وتسجيل القيود والترحيل."></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button class="btn-workspace-action" onclick="ExcelAdminDashboard.closeAddCompanyModal()">إلغاء</button>
            <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.submitAddCompanyModal()">✓ إنشاء الشركة وحفظها</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);
  },

  closeAddCompanyModal() {
    const overlay = document.getElementById('adminCompanyModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  },

  submitAddCompanyModal() {
    this.requireAdmin();
    const name = document.getElementById('modal_cname')?.value.trim();
    if (!name) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى كتابة اسم الشركة أولاً', 'error');
      else alert('يرجى كتابة اسم الشركة أولاً.');
      return;
    }

    const sector = document.getElementById('modal_csector')?.value.trim() || 'نشاط تجاري';
    const capital = parseFloat(document.getElementById('modal_ccapital')?.value) || 2000000;
    const role = document.getElementById('modal_crole')?.value.trim() || 'محاسب مالي';
    const icon = document.getElementById('modal_cicon')?.value || 'buildings';
    const desc = document.getElementById('modal_cdesc')?.value.trim() || `بيئة عمل محاسبية لـ ${name}.`;

    const newCompany = {
      id: "comp-" + Date.now(),
      name: name,
      sector: sector,
      badge: sector,
      icon: icon,
      role: role,
      capital: capital,
      description: desc,
      month: "السنة المالية 2026",
      transactions: [
        {
          id: "tx-init-1",
          num: 1,
          title: "إيداع رأس المال التأسيسي في البنك",
          desc: `إيداع رأس مال تأسيسي لـ ${name} بموجب إشعار بنكي رسمي.`,
          amount: capital,
          date: "2026-01-01",
          dr: "bank",
          cr: "capital",
          lines: [
            { lineNum: 1, accountCode: '1102', accountName: 'Bank (بنك)', acctType: 'Asset', debit: capital, credit: 0, description: 'رأس مال تأسيسي في البنك' },
            { lineNum: 2, accountCode: '3101', accountName: 'Capital (رأس المال)', acctType: 'Equity', debit: 0, credit: capital, description: 'رأس مال الشركاء' }
          ]
        }
      ]
    };

    this.companies.push(newCompany);
    this.saveState('companies');
    this.closeAddCompanyModal();
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تمت إضافة شركة (${newCompany.name}) بنجاح!`, 'success');
    this.switchTab('companies');
  },

  saveCompanyMeta(compId) {
    this.requireAdmin();
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;

    comp.name = document.getElementById(`adm_cname_${compId}`)?.value.trim() || comp.name;
    comp.sector = document.getElementById(`adm_csector_${compId}`)?.value.trim() || comp.sector;
    comp.capital = parseFloat(document.getElementById(`adm_ccapital_${compId}`)?.value) || comp.capital;
    comp.role = document.getElementById(`adm_crole_${compId}`)?.value.trim() || comp.role;
    comp.description = document.getElementById(`adm_cdesc_${compId}`)?.value.trim() || comp.description;

    this.saveState('companies');
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم حفظ تعديلات شركة (${comp.name}) بنجاح!`, 'success');
    this.switchTab('companies');
  },

  async deleteCompany(compId) {
    this.requireAdmin();
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;

    let confirmed = false;
    if (typeof AccModal !== 'undefined') {
      confirmed = await AccModal.confirm({
        title: 'حذف الشركة نهائياً',
        message: `هل أنت متأكد من رغبتك في حذف شركة (${comp.name}) وكافة سنداتها المحاسبية؟ لن تتمكن من استرجاعها بعد الحذف.`,
        confirmText: 'نعم، حذف الشركة',
        cancelText: 'تراجع',
        danger: true
      });
    } else {
      confirmed = confirm(`هل أنت متأكد من حذف شركة (${comp.name}) نهائياً؟`);
    }

    if (confirmed) {
      this.companies = this.companies.filter(c => c.id !== compId);
      this.saveState('companies');
      if (typeof SupabaseService !== 'undefined' && SupabaseService.deleteCompany) {
        SupabaseService.deleteCompany(compId);
      }
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف الشركة بنجاح', 'success');
      this.switchTab('companies');
    }
  },

  exportCompanyJson(compId) {
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;
    const blob = new Blob([JSON.stringify(comp, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `شركة_${comp.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم تصدير ملف الشركة بنجاح', 'info');
  },

  parseTrainingPlatformJson(json) {
    if (!json || typeof json !== 'object') {
      throw new Error('صيغة الملف غير صالحة.');
    }

    // النمط 1: حزمة التدريب الكاملة accounting-training-v1 المخرجة من المولد
    if (json.format === 'accounting-training-v1' || (json.metadata && json.questions)) {
      const meta = json.metadata || {};
      const companyMeta = meta.company || {};
      const rawName = (companyMeta.name || json.name || 'شركة جديدة').trim();
      const compName = rawName.startsWith('شركة') ? rawName : `شركة ${rawName}`;
      const activity = (companyMeta.activity || 'الأجهزة والخدمات').trim();
      const sector = `تجارة ${activity} (${companyMeta.type === 'Services' ? 'خدمي وتوزيع' : companyMeta.type || 'تجاري'})`;
      const capital = Number(companyMeta.capital) || 2000000;
      const role = meta.jobTrackNameAr || 'محاسب مالي عام';
      const year = meta.startDate ? `السنة المالية ${meta.startDate.substring(0, 4)}` : 'السنة المالية 2026';
      const compId = `comp-${(rawName.replace(/\s+/g, '-').toLowerCase()) || Date.now()}`;

      const questions = Array.isArray(json.questions) ? json.questions : [];

      const typeArMap = {
        'Opening Balance': 'إثبات الأرصدة الافتتاحية والمركز المالي',
        'Sale': 'فاتورة مبيعات بضاعة آجلة للعملاء',
        'Cash Sale': 'فاتورة مبيعات نقدية بالخزينة',
        'Collection': 'إيصال تحصيل نقدية وبنكي من عميل',
        'Purchase': 'فاتورة شراء وتوريد بضاعة للمستودع',
        'Payment': 'سداد مستحقات وفواتير موردين',
        'Purchase Return': 'مردودات مشتريات وإشعار دائن',
        'Sales Return': 'مردودات مبيعات وإشعار مدين',
        'Sales Return Inv': 'مردودات مبيعات مخزنية',
        'COGS': 'إثبات تكلفة البضاعة المباعة',
        'Cash Sale COGS': 'إثبات تكلفة البضاعة المباعة النقدية',
        'Payroll': 'مسير واستحقاق رواتب وأجور الموظفين',
        'Payroll Settlement': 'سداد وصرف أجور ورواتب العاملين',
        'Expense': 'إثبات وسداد مصروفات تشغيلية',
        'Misc Expense': 'مصروفات نثرية وإدارية متنوعة',
        'Prepayment': 'سداد مصروفات مدفوعة مقدماً',
        'Prepayment Amortization': 'تسوية إهلاك واستنفاد المصروف المقدم',
        'Accrual': 'إثبات مصروفات مستحقة غير مسددة',
        'Accrued Revenue': 'إثبات إيرادات مستحقة غير محصلة',
        'Accrual Settlement': 'سداد المصروفات المستحقة السابقة',
        'Unearned Revenue': 'استلام إيرادات مقبوضة مقدماً',
        'Unearned Rev Recognition': 'الاعتراف بالإيراد المقدم المحقق',
        'Bank Charges': 'إثبات عمولات ومصروفات بنكية',
        'Bank Loan': 'عقد وتسهيل قرض بنكي تمويلي',
        'Loan Repayment': 'سداد قسط وفائدة قرض بنكي',
        'Asset Purchase': 'شراء أصول ثابتة رأسمالية',
        'Asset Disposal': 'استبعاد وبيع أصل ثابت',
        'Depreciation': 'قسط إهلاك الأصول الثابتة السنوي',
        'Bad Debt Provision': 'تكوين مخصص ديون مشكوك في تحصيلها',
        'Inventory Impairment': 'إثبات هبوط وانخفاض أسعار المخزون',
        'Interest Accrual': 'إثبات فوائد بنكية مستحقة',
        'VAT Clearing': 'تسوية ومقاصة ضريبة القيمة المضافة',
        'VAT Settlement': 'سداد إقرار ضريبة القيمة المضافة',
        'Petty Cash Replenishment': 'استعاضة عهدة النقدية النثرية',
        'Bank Transfer In': 'تحويل نقدية وارد بين الحسابات',
        'Bank Transfer Out': 'تحويل نقدية صادر بين الحسابات',
        'Cash Advance': 'صرف سلفة مؤقتة للموظف',
        'Cash Advance Settlement': 'تسوية وإقفال سلفة الموظف',
        'Cash Shortage': 'إثبات عجز الخزينة النقدية',
        'Inventory Adjustment': 'تسوية فروقات الجرد المخزني'
      };

      const transactions = questions.map((q, idx) => {
        const rawLines = q.correctAnswer?.lines || [];
        const debits = rawLines.filter(l => (Number(l.debit) || 0) > 0);
        const credits = rawLines.filter(l => (Number(l.credit) || 0) > 0);
        const totalDebit = Number(q.correctAnswer?.totalDebit) || debits.reduce((s, l) => s + (Number(l.debit) || 0), 0);
        const totalCredit = Number(q.correctAnswer?.totalCredit) || credits.reduce((s, l) => s + (Number(l.credit) || 0), 0);

        const titleAr = typeArMap[q.type] || `${q.type} - ${q.categoryAr || 'معاملة مالية'}`;

        let desc = '';
        if (q.problemText && q.problemText.trim()) {
          desc = q.problemText.trim();
        } else {
          const formattedTotal = (totalDebit || totalCredit || 0).toLocaleString() + ' ج.م';
          const drNames = debits.map(d => (d.accountName ? d.accountName.split('(')[0].trim() : 'حساب') + ' (' + Number(d.debit).toLocaleString() + ' ج.م)').join(' و ');
          const crNames = credits.map(c => (c.accountName ? c.accountName.split('(')[0].trim() : 'حساب') + ' (' + Number(c.credit).toLocaleString() + ' ج.م)').join(' و ');

          switch (q.type) {
            case 'Opening Balance':
              desc = `إثبات الأرصدة الافتتاحية للمركز المالي وتأسيس الشركة برأس مال قدره ${formattedTotal}.`;
              break;
            case 'Sale':
              desc = `إصدار فاتورة بيع بضاعة آجلة للعملاء بمبلغ ${formattedTotal}.`;
              break;
            case 'Cash Sale':
              desc = `إصدار فاتورة بيع بضاعة نقدية محصلة بالخزينة/البنك بمبلغ ${formattedTotal}.`;
              break;
            case 'Purchase':
              desc = `استلام وتوريد بضاعة للمستودع بموجب فاتورة شراء بمبلغ ${formattedTotal}.`;
              break;
            case 'Collection':
              desc = `تحصيل مبالغ مستحقة من العملاء بموجب إشعار بنكي/إيصال قبض بمبلغ ${formattedTotal}.`;
              break;
            case 'Payment':
              desc = `سداد مستحقات وفواتير موردين خصماً من الحساب البنكي بمبلغ ${formattedTotal}.`;
              break;
            case 'Expense':
              desc = `سداد مصروفات تشغيلية وإدارية: ${drNames} خصماً من ${crNames}.`;
              break;
            case 'Prepayment':
              desc = `سداد دفعات ومصروفات مدفوعة مقدماً عن فترات قادمة بمبلغ ${formattedTotal}.`;
              break;
            case 'Prepayment Amortization':
              desc = `تسوية وإهلاك قسط المصروف المدفوع مقدماً المحقق عن الفترة بقيمة ${formattedTotal}.`;
              break;
            case 'COGS':
            case 'Cash Sale COGS':
              desc = `إثبات تكلفة البضاعة المباعة وصرفها من المخزون بمبلغ ${formattedTotal}.`;
              break;
            case 'Asset Purchase':
              desc = `شراء أصول ثابتة جديدة للشركة بموجب مستند وفاتورة بقيمة ${formattedTotal}.`;
              break;
            case 'Payroll':
              desc = `إثبات كشف واستحقاق رواتب العاملين عن الشهر بقيمة إجمالية ${formattedTotal}.`;
              break;
            default:
              if (q.solutionSteps && q.solutionSteps.length > 1) {
                desc = q.solutionSteps.slice(0, 2).join(' ');
              } else {
                desc = `${titleAr} بمبلغ ${formattedTotal}: من ${drNames || 'المدين'} إلى ${crNames || 'الدائن'}.`;
              }
              break;
          }
        }

        const dayOffset = Math.floor((idx / Math.max(1, questions.length)) * 350);
        const dateObj = new Date(2026, 0, 1 + dayOffset);
        const dateStr = dateObj.toISOString().split('T')[0];

        return {
          id: q.id || `Q-${String(idx + 1).padStart(3, '0')}`,
          num: idx + 1,
          title: titleAr,
          desc: desc,
          type: q.type || 'General',
          date: dateStr,
          amount: totalDebit || totalCredit || 0,
          difficulty: q.difficulty || 'Medium',
          category: q.category || 'general',
          categoryAr: q.categoryAr || 'محاسبة عامة',
          dr: debits[0]?.accountCode || '1101',
          cr: credits[0]?.accountCode || '4101',
          lines: rawLines.map((l, lIdx) => ({
            lineNum: lIdx + 1,
            accountCode: String(l.accountCode || ''),
            accountName: l.accountName || 'حساب',
            acctType: l.accountType || 'Asset',
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
            description: l.description || desc
          })),
          solutionSteps: q.solutionSteps || [],
          accountingRule: q.accountingRule || '',
          hints: q.hints || [],
          scoring: q.scoring || { totalPoints: 5 }
        };
      });

      return {
        id: compId,
        name: compName,
        sector: sector,
        badge: meta.scenarioName ? 'شركة حقيقية مستقرة' : 'بيئة أعمال متكاملة',
        icon: 'lightbulb',
        role: role,
        capital: capital,
        description: `بيئة محاكاة محاسبية متقدمة لـ ${compName} (${sector}) برأس مال قدره ${capital.toLocaleString()} ج.م، تتضمن دورة تدريبية واقعية بـ ${transactions.length} معاملة وسند مالي.`,
        month: year,
        transactions: transactions,
        bankReconciliation: json.bankReconciliation || json.bank_reconciliation || null
      };
    }

    // النمط 2: ملف تسوية بنكية مستقل (Standalone Bank Reconciliation Case)
    if (json.caseId && (json.bankTransactions || json.reconciliationSummary)) {
      const rawCompName = (json.company?.name || 'شركة المحاكاة').trim();
      const compName = rawCompName.startsWith('شركة') ? rawCompName : `شركة ${rawCompName}`;
      const activity = (json.company?.activity || 'التجارة والتوزيع').trim();
      return {
        id: `comp-${json.caseId.toLowerCase()}`,
        name: compName,
        sector: `تجارة ${activity}`,
        badge: 'تسوية بنكية معتمدة',
        icon: 'assured_workload',
        role: 'محاسب مالي / مراجع بنكي',
        capital: Number(json.company?.capital) || 2000000,
        description: `ملف تسوية بنكية متكامل للبنك (${json.bankAccount?.bankNameAr || json.bankAccount?.bankName || 'البنك التجاري'}) مع مطابقة كشف الحساب الخارجي والفروقات المعلقة.`,
        month: json.period ? `الفترة المالية ${json.period.startDate} إلى ${json.period.endDate}` : 'السنة المالية 2026',
        transactions: [],
        bankReconciliation: json
      };
    }

    // النمط 3: ملف شركة مباشر (Backup or Single Company export)
    if (json.name && (json.transactions || json.sector)) {
      return {
        id: json.id || `comp-${Date.now()}`,
        name: json.name,
        sector: json.sector || 'قطاع عام',
        badge: json.badge || 'نشاط تجاري',
        icon: json.icon && !/[\u{1F300}-\u{1FAFF}]/u.test(json.icon) ? json.icon : 'buildings',
        role: json.role || 'محاسب مالي',
        capital: json.capital || 1000000,
        description: json.description || `شركة ${json.name}`,
        month: json.month || 'السنة المالية 2026',
        transactions: Array.isArray(json.transactions) ? json.transactions : [],
        bankReconciliation: json.bankReconciliation || json.bank_reconciliation || null
      };
    }

    throw new Error('صيغة ملف التدريب غير متوافقة.');
  },

  async addOrUpdateCompany(comp) {
    this.requireAdmin();
    const existingIndex = this.companies.findIndex(c => c.id === comp.id || c.name === comp.name);
    if (existingIndex >= 0) {
      let confirmed = false;
      if (typeof AccModal !== 'undefined') {
        confirmed = await AccModal.confirm({
          title: 'تحديث بيانات الشركة',
          message: `شركة (${comp.name}) موجودة بالفعل في المنظومة. هل ترغب في تحديث بياناتها واستبدال سنداتها بـ (${comp.transactions.length}) سند مالي؟`,
          confirmText: 'نعم، تحديث واستبدال',
          cancelText: 'إلغاء'
        });
      } else {
        confirmed = confirm(`شركة (${comp.name}) موجودة بالفعل في المنظومة. هل ترغب في تحديث بياناتها واستبدال سنداتها؟`);
      }
      if (!confirmed) return;
      this.companies[existingIndex] = comp;
    } else {
      this.companies.push(comp);
    }

    this.saveState('companies');
    if (typeof AccModal !== 'undefined') {
      AccModal.toast(`✓ تم بنجاح إدراج شركة (${comp.name}) مع (${comp.transactions.length}) معاملة محاسبية كاملة!`, 'success');
    }
    this.switchTab('companies');
  },

  handleCompanyJsonUpload(event) {
    this.requireAdmin();
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target.result;
        const json = JSON.parse(text);

        let targetCompany = null;
        if (Array.isArray(json)) {
          let count = 0;
          for (const c of json) {
            if (c && c.name) {
              await this.addOrUpdateCompany(c);
              targetCompany = c;
              count++;
            }
          }
        } else {
          const comp = this.parseTrainingPlatformJson(json);
          await this.addOrUpdateCompany(comp);
          targetCompany = comp;
        }

        if (targetCompany) {
          // تفعيل الشركة وسنداتها فوراً في بيئة المحاكي
          if (typeof SimulationBridge !== 'undefined') {
            SimulationBridge.setSimulatorActiveCompany(targetCompany);
          }

          if (typeof AccModal !== 'undefined') {
            const openSim = await AccModal.confirm({
              title: `تم استيراد (${targetCompany.name}) بنجاح!`,
              message: `تم استيراد وتجهيز ${targetCompany.transactions?.length || 0} سند مالي وربطها بالمحاكي مباشرة. هل ترغب في فتح دفاتر المحاكي الآن لبدء تسجيل القيود؟`,
              confirmText: 'فتح المحاكي مباشرة',
              cancelText: 'البقاء في لوحة الإدارة'
            });
            if (openSim) {
              window.location.href = 'simulation/simulation/journal/index.html';
              return;
            }
          }
        }
        this.switchTab('companies');
      } catch (err) {
        if (typeof AccModal !== 'undefined') AccModal.toast('فشل استيراد الملف: ' + err.message, 'error');
        else alert('فشل استيراد الملف: ' + err.message);
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  },

  showAddTransactionModal(compId) {
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;

    let overlay = document.getElementById('adminTxModalOverlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'adminTxModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => {
      if (e.target === overlay) closeTxModal();
    };

    overlay.innerHTML = `
      <div class="modal-sheet" style="max-width: 660px; width: 94%; max-height: 90vh; overflow-y: auto;">
        <span class="sheet-drag-handle"></span>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="modal-icon-badge" style="background:rgba(37, 99, 235, 0.1); color:var(--primary);">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 24 }) : '★'}</span>
            <div>
              <h3 class="modal-title">المنشئ المرئي لسندات وسيناريوهات العمليات</h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: var(--text-muted);">${comp.name} • بناء القيود المركبة وحساب الضرائب آلياً</p>
            </div>
          </div>
          <button class="modal-close-btn" id="closeTxModalBtn">✕</button>
        </div>

        <div style="padding: 12px 0; display: flex; flex-direction: column; gap: 14px; text-align: right;">
          <!-- 1. اختيار نموذج المعاملة المصرية الجاهزة -->
          <div class="admin-form-group">
            <label style="font-weight: 700;">نوع ونموذج المعاملة (معايير المحاسبة المصرية):</label>
            <select id="tx_builder_template" class="admin-form-input" style="font-weight: 600;">
              <option value="SALE_CREDIT">1. فاتورة مبيعات بضاعة آجلة + ضريبة قيمة مضافة 14% (عملاء)</option>
              <option value="SALE_CASH">2. فاتورة مبيعات نقدية محصلة بالبنك + ضريبة قيمة مضافة 14%</option>
              <option value="PURCHASE_CREDIT">3. فاتورة مشتريات بضاعة بالآجل + ضريبة مدخلات 14% (موردين)</option>
              <option value="RENT_EXPENSE">4. سداد إيجار مقر الشركة بشيك بنكي (مصروف إيجار / بنك)</option>
              <option value="PAYROLL">5. مسير رواتب موظفين مع استقطاع ضرائب كسب عمل وتأمينات</option>
              <option value="PAYMENT_SUPPLIER">6. سداد دفعة للمورد من الحساب البنكي الجاري</option>
              <option value="COLLECTION_CUSTOMER">7. إيصال تحصيل نقدية من عميل بالخزينة</option>
              <option value="BANK_CHARGES">8. إشعار رسوم وعمولات ومصروفات بنكية مخصومة</option>
              <option value="DEPRECIATION">9. مذكرة تسوية قسط الإهلاك السنوي للأصول الثابتة</option>
              <option value="CUSTOM">10. قيد يومية مخصص حر</option>
            </select>
          </div>

          <!-- تفاصيل السند -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>عنوان السند أو الفاتورة *</label>
              <input type="text" id="tx_modal_title" class="admin-form-input" value="فاتورة مبيعات بضاعة آجلة" required>
            </div>
            <div class="admin-form-group">
              <label>رقم المرجع / الفاتورة (Ref)</label>
              <input type="text" id="tx_modal_ref" class="admin-form-input" value="INV-${Math.floor(1000 + Math.random()*9000)}">
            </div>
          </div>

          <div class="admin-form-group">
            <label>بيان السند المحاسبي وتفاصيل المعاملة</label>
            <textarea id="tx_modal_desc" class="admin-form-textarea" rows="2">بيع بضاعة بالآجل للعملاء مع احتساب ضريبة القيمة المضافة 14% وفق الفاتورة الضريبية المعتمدة.</textarea>
          </div>

          <!-- المبالغ والضرائب -->
          <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>المبلغ الأساسي (قبل الضريبة) *</label>
              <input type="number" id="tx_modal_base_amount" class="admin-form-input" value="50000" min="1">
            </div>
            <div class="admin-form-group">
              <label>تاريخ السند</label>
              <input type="date" id="tx_modal_date" class="admin-form-input" value="2026-01-15">
            </div>
            <div class="admin-form-group">
              <label>مستوى الصعوبة</label>
              <select id="tx_modal_difficulty" class="admin-form-input">
                <option value="Easy">مبتدئ (Easy)</option>
                <option value="Medium" selected>متوسط (Medium)</option>
                <option value="Hard">متقدم (Hard)</option>
              </select>
            </div>
          </div>

          <!-- المعاينة الحية لأطراف القيد المركب -->
          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 0.86rem; color: var(--text-primary); display: flex; align-items: center; gap: 6px;">
                <span>⚡ المعاينة الحية لأطراف القيد المزدوج:</span>
              </strong>
              <span id="tx_preview_balance_badge" style="font-size: 0.75rem; font-weight: 700; background: var(--tier-starter-bg); color: var(--tier-starter); padding: 2px 8px; border-radius: 6px;">متزن 100% ✓</span>
            </div>
            <div id="tx_preview_lines_container" style="display: flex; flex-direction: column; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 0.82rem;">
              <!-- Dynamic live preview generated via JS -->
            </div>
          </div>

          <!-- خيار مزامنة كشف حساب البنك -->
          <div style="background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 10px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin: 0; font-size: 0.85rem; font-weight: 700; color: var(--text-primary);">
              <input type="checkbox" id="tx_modal_sync_bank" style="width: 16px; height: 16px;">
              <span>تضمين هذه العملية في كشف حساب البنك (Bank Statement Sync)</span>
            </label>
            <span style="font-size: 0.75rem; color: var(--primary); font-weight: 600;">لمطابقة التسوية البنكية</span>
          </div>

          <!-- التعليم والإرشادات المرفقة للسند -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>تلميح محاسبي للطلاب (Hint):</label>
              <input type="text" id="tx_modal_hint" class="admin-form-input" value="تذكر أن ضريبة القيمة المضافة مخرجات دائنة لحساب مصلحة الضرائب المصرية.">
            </div>
            <div class="admin-form-group">
              <label>القاعدة المحاسبية (EAS Rule):</label>
              <input type="text" id="tx_modal_rule" class="admin-form-input" value="معيار المحاسبة المصري (48) وقانون الضريبة 67 لسنة 2016.">
            </div>
          </div>

          <!-- أزرار الحفظ والإغلاق -->
          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button class="btn-workspace-action" id="cancelTxModalBtn">إلغاء</button>
            <button class="btn-workspace-action btn-workspace-primary" id="saveTxModalBtn" style="background: var(--success); color: white; font-weight: 700;">✓ اعتماد وحفظ السند بالشركة</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add('active'), 10);

    function closeTxModal() {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }

    // Dynamic Visual Calculations
    function updateVisualPreview() {
      const tpl = overlay.querySelector('#tx_builder_template').value;
      const baseAmt = parseFloat(overlay.querySelector('#tx_modal_base_amount').value) || 0;
      const linesContainer = overlay.querySelector('#tx_preview_lines_container');
      const titleInput = overlay.querySelector('#tx_modal_title');
      const descInput = overlay.querySelector('#tx_modal_desc');
      const syncBankCheck = overlay.querySelector('#tx_modal_sync_bank');

      let lines = [];

      if (tpl === 'SALE_CREDIT') {
        const vat = Math.round(baseAmt * 0.14);
        const total = baseAmt + vat;
        titleInput.value = 'فاتورة مبيعات بضاعة آجلة';
        descInput.value = 'بيع بضاعة بالآجل للعملاء مع احتساب ضريبة القيمة المضافة 14%.';
        syncBankCheck.checked = false;
        lines = [
          { code: '1103', name: 'العملاء (AR)', dr: total, cr: 0 },
          { code: '4101', name: 'إيراد المبيعات', dr: 0, cr: baseAmt },
          { code: '2102', name: 'ضريبة القيمة المضافة مخرجات (14%)', dr: 0, cr: vat }
        ];
      } else if (tpl === 'SALE_CASH') {
        const vat = Math.round(baseAmt * 0.14);
        const total = baseAmt + vat;
        titleInput.value = 'فاتورة مبيعات نقدية محصلة بالبنك';
        descInput.value = 'بيع بضاعة وتحصيل القيمة مضافاً إليها 14% ضريبة بالتحويل للحساب البنكي.';
        syncBankCheck.checked = true;
        lines = [
          { code: '1102', name: 'البنك - الحساب الجاري', dr: total, cr: 0 },
          { code: '4101', name: 'إيراد المبيعات', dr: 0, cr: baseAmt },
          { code: '2102', name: 'ضريبة القيمة المضافة مخرجات (14%)', dr: 0, cr: vat }
        ];
      } else if (tpl === 'PURCHASE_CREDIT') {
        const vat = Math.round(baseAmt * 0.14);
        const total = baseAmt + vat;
        titleInput.value = 'فاتورة مشتريات بضاعة بالآجل';
        descInput.value = 'شراء بضاعة تجارية بالآجل مع احتساب ضريبة القيمة المضافة مدخلات 14%.';
        syncBankCheck.checked = false;
        lines = [
          { code: '1104', name: 'المخزون السلعي', dr: baseAmt, cr: 0 },
          { code: '1106', name: 'ضريبة القيمة المضافة مدخلات (14%)', dr: vat, cr: 0 },
          { code: '2101', name: 'الموردون (AP)', dr: 0, cr: total }
        ];
      } else if (tpl === 'RENT_EXPENSE') {
        titleInput.value = 'سداد إيجار مقر الشركة';
        descInput.value = 'سداد قيمة إيجار مقر الشركة عن الفترة الحالية بشيك بنكي.';
        syncBankCheck.checked = true;
        lines = [
          { code: '5202', name: 'مصروف إيجار', dr: baseAmt, cr: 0 },
          { code: '1102', name: 'البنك - الحساب الجاري', dr: 0, cr: baseAmt }
        ];
      } else if (tpl === 'PAYROLL') {
        const tax = Math.round(baseAmt * 0.05);
        const soc = Math.round(baseAmt * 0.11);
        const net = baseAmt - tax - soc;
        titleInput.value = 'كشف مسير رواتب الموظفين';
        descInput.value = 'استحقاق رواتب الشهر واستقطاع ضريبة كسب العمل 5% وتأمينات 11% والتحويل للبنوك.';
        syncBankCheck.checked = true;
        lines = [
          { code: '5201', name: 'مصروف رواتب وأجور', dr: baseAmt, cr: 0 },
          { code: '2105', name: 'ضرائب كسب عمل مستحقة (5%)', dr: 0, cr: tax },
          { code: '2106', name: 'تأمينات اجتماعية مستحقة (11%)', dr: 0, cr: soc },
          { code: '1102', name: 'البنك - الحساب الجاري (الصافي)', dr: 0, cr: net }
        ];
      } else if (tpl === 'PAYMENT_SUPPLIER') {
        titleInput.value = 'إذن سداد دفعة للموردين';
        descInput.value = 'سداد جزء من الرصيد المستحق للمورد بشيك بنكي.';
        syncBankCheck.checked = true;
        lines = [
          { code: '2101', name: 'الموردون (AP)', dr: baseAmt, cr: 0 },
          { code: '1102', name: 'البنك - الحساب الجاري', dr: 0, cr: baseAmt }
        ];
      } else if (tpl === 'COLLECTION_CUSTOMER') {
        titleInput.value = 'إيصال تحصيل نقدية من عميل';
        descInput.value = 'تحصيل دفعة نقدية بالخزينة من عميل تحت حساب الفواتير الآجلة.';
        syncBankCheck.checked = false;
        lines = [
          { code: '1101', name: 'النقدية بالصندوق', dr: baseAmt, cr: 0 },
          { code: '1103', name: 'العملاء (AR)', dr: 0, cr: baseAmt }
        ];
      } else if (tpl === 'BANK_CHARGES') {
        titleInput.value = 'إشعار مصروفات ورسوم بنكية';
        descInput.value = 'خصم مصروفات وعمولات مصرفية دورية من الحساب البنكي الجاري.';
        syncBankCheck.checked = true;
        lines = [
          { code: '5208', name: 'مصروفات وعمولات بنكية', dr: baseAmt, cr: 0 },
          { code: '1102', name: 'البنك - الحساب الجاري', dr: 0, cr: baseAmt }
        ];
      } else if (tpl === 'DEPRECIATION') {
        titleInput.value = 'مذكرة تسوية قسط الإهلاك السنوي';
        descInput.value = 'إثبات قسط إهلاك الأصول الثابتة السنوي وتحميله على الفترة المالية.';
        syncBankCheck.checked = false;
        lines = [
          { code: '5204', name: 'مصروف إهلاك أصول ثابتة', dr: baseAmt, cr: 0 },
          { code: '1202', name: 'مجمع إهلاك أصول ثابتة', dr: 0, cr: baseAmt }
        ];
      } else {
        lines = [
          { code: '1101', name: 'النقدية بالصندوق', dr: baseAmt, cr: 0 },
          { code: '4101', name: 'إيراد المبيعات', dr: 0, cr: baseAmt }
        ];
      }

      linesContainer.innerHTML = lines.map(l => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; background: var(--surface-card); border-radius: 6px; border-right: 3px solid ${l.dr > 0 ? 'var(--primary)' : 'var(--success)'};">
          <div>
            <strong style="color: var(--text-primary);">${l.code}</strong> - <span>${l.name}</span>
          </div>
          <div>
            ${l.dr > 0 ? `<span style="color: var(--primary); font-weight: 700;">مدين: ${l.dr.toLocaleString()} ج.م</span>` : `<span style="color: var(--success); font-weight: 700;">دائن: ${l.cr.toLocaleString()} ج.م</span>`}
          </div>
        </div>
      `).join('');
    }

    overlay.querySelector('#tx_builder_template').onchange = updateVisualPreview;
    overlay.querySelector('#tx_modal_base_amount').oninput = updateVisualPreview;
    updateVisualPreview();

    overlay.querySelector('#closeTxModalBtn').onclick = closeTxModal;
    overlay.querySelector('#cancelTxModalBtn').onclick = closeTxModal;

    overlay.querySelector('#saveTxModalBtn').onclick = () => {
      const tpl = overlay.querySelector('#tx_builder_template').value;
      const title = overlay.querySelector('#tx_modal_title').value.trim();
      if (!title) {
        if (typeof AccModal !== 'undefined') AccModal.toast('يرجى كتابة عنوان السند المالي', 'error');
        return;
      }
      const desc = overlay.querySelector('#tx_modal_desc').value.trim() || title;
      const baseAmt = parseFloat(overlay.querySelector('#tx_modal_base_amount').value) || 0;
      const date = overlay.querySelector('#tx_modal_date').value.trim() || '2026-01-15';
      const ref = overlay.querySelector('#tx_modal_ref').value.trim() || `REF-${Math.floor(1000 + Math.random()*9000)}`;
      const difficulty = overlay.querySelector('#tx_modal_difficulty').value;
      const hint = overlay.querySelector('#tx_modal_hint').value.trim();
      const rule = overlay.querySelector('#tx_modal_rule').value.trim();
      const syncBank = overlay.querySelector('#tx_modal_sync_bank').checked;

      let builtLines = [];
      let totalAmount = baseAmt;
      let primaryType = 'General';

      if (tpl === 'SALE_CREDIT' || tpl === 'SALE_CASH') {
        primaryType = tpl === 'SALE_CASH' ? 'Cash Sale' : 'Sale';
        const vat = Math.round(baseAmt * 0.14);
        totalAmount = baseAmt + vat;
        const debitAccount = tpl === 'SALE_CASH' ? '1102' : '1103';
        const debitName = tpl === 'SALE_CASH' ? 'Bank (بنك)' : 'Accounts Receivable (عملاء)';
        builtLines = [
          { lineNum: 1, accountCode: debitAccount, accountName: debitName, debit: totalAmount, credit: 0, description: desc },
          { lineNum: 2, accountCode: '4101', accountName: 'Sales Revenue (إيرادات مبيعات)', debit: 0, credit: baseAmt, description: 'صافي قيمة المبيعات' },
          { lineNum: 3, accountCode: '2102', accountName: 'Output VAT (ضريبة القيمة المضافة - مخرجات)', debit: 0, credit: vat, description: 'ضريبة القيمة المضافة 14%' }
        ];
      } else if (tpl === 'PURCHASE_CREDIT') {
        primaryType = 'Purchase';
        const vat = Math.round(baseAmt * 0.14);
        totalAmount = baseAmt + vat;
        builtLines = [
          { lineNum: 1, accountCode: '1104', accountName: 'Inventory (مخزون)', debit: baseAmt, credit: 0, description: 'تكلفة البضاعة المشتراة' },
          { lineNum: 2, accountCode: '1106', accountName: 'Input VAT (ضريبة القيمة المضافة - مدخلات)', debit: vat, credit: 0, description: 'ضريبة المدخلات 14%' },
          { lineNum: 3, accountCode: '2101', accountName: 'Accounts Payable (موردون)', debit: 0, credit: totalAmount, description: desc }
        ];
      } else if (tpl === 'RENT_EXPENSE') {
        primaryType = 'Expense';
        builtLines = [
          { lineNum: 1, accountCode: '5202', accountName: 'Rent Expense (مصروف إيجار)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '1102', accountName: 'Bank (بنك)', debit: 0, credit: baseAmt, description: 'سداد بشيك بنكي' }
        ];
      } else if (tpl === 'PAYROLL') {
        primaryType = 'Payroll';
        const tax = Math.round(baseAmt * 0.05);
        const soc = Math.round(baseAmt * 0.11);
        const net = baseAmt - tax - soc;
        builtLines = [
          { lineNum: 1, accountCode: '5201', accountName: 'Salaries Expense (مصروف رواتب)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '2105', accountName: 'Payroll Taxes Payable (ضرائب رواتب مستحقة)', debit: 0, credit: tax, description: 'ضريبة كسب عمل 5%' },
          { lineNum: 3, accountCode: '2106', accountName: 'Social Insurance Payable (تأمينات اجتماعية مستحقة)', debit: 0, credit: soc, description: 'تأمينات اجتماعية 11%' },
          { lineNum: 4, accountCode: '1102', accountName: 'Bank (بنك)', debit: 0, credit: net, description: 'صافي الرواتب المحولة للبنوك' }
        ];
      } else if (tpl === 'PAYMENT_SUPPLIER') {
        primaryType = 'Payment';
        builtLines = [
          { lineNum: 1, accountCode: '2101', accountName: 'Accounts Payable (موردون)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '1102', accountName: 'Bank (بنك)', debit: 0, credit: baseAmt, description: 'سداد بشيك بنكي' }
        ];
      } else if (tpl === 'COLLECTION_CUSTOMER') {
        primaryType = 'Collection';
        builtLines = [
          { lineNum: 1, accountCode: '1101', accountName: 'Cash (نقدية بالصندوق)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '1103', accountName: 'Accounts Receivable (عملاء)', debit: 0, credit: baseAmt, description: 'تحصيل دفعة نقدية' }
        ];
      } else if (tpl === 'BANK_CHARGES') {
        primaryType = 'Expense';
        builtLines = [
          { lineNum: 1, accountCode: '5208', accountName: 'Bank Charges (مصروفات بنكية)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '1102', accountName: 'Bank (بنك)', debit: 0, credit: baseAmt, description: 'خصم من الحساب الجاري' }
        ];
      } else if (tpl === 'DEPRECIATION') {
        primaryType = 'Depreciation';
        builtLines = [
          { lineNum: 1, accountCode: '5204', accountName: 'Depreciation Expense (مصروف إهلاك)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '1202', accountName: 'Accumulated Depreciation (مجمع إهلاك)', debit: 0, credit: baseAmt, description: 'مجمع إهلاك سنوي' }
        ];
      } else {
        builtLines = [
          { lineNum: 1, accountCode: '1101', accountName: 'Cash (نقدية بالصندوق)', debit: baseAmt, credit: 0, description: desc },
          { lineNum: 2, accountCode: '4101', accountName: 'Sales Revenue (إيرادات مبيعات)', debit: 0, credit: baseAmt, description: desc }
        ];
      }

      if (!comp.transactions) comp.transactions = [];
      const newTx = {
        id: "tx-" + Date.now(),
        num: comp.transactions.length + 1,
        ref: ref,
        title: title,
        type: primaryType,
        desc: desc,
        amount: totalAmount,
        date: date,
        difficulty: difficulty,
        accountingRule: rule,
        hints: hint ? [hint] : [],
        lines: builtLines
      };

      comp.transactions.push(newTx);

      // إذا تم تفعيل خيار مزامنة كشف حساب البنك
      if (syncBank) {
        const bankLine = builtLines.find(l => l.accountCode === '1102');
        if (bankLine) {
          if (!comp.bank_statement_items) comp.bank_statement_items = [];
          comp.bank_statement_items.push({
            id: "stmt-" + Date.now(),
            date: date,
            desc: title,
            ref: ref,
            amount: bankLine.debit > 0 ? bankLine.debit : bankLine.credit,
            type: bankLine.debit > 0 ? 'CREDIT' : 'DEBIT', // طبيعة كشف حساب البنك العكسية
            matched: false
          });
        }
      }

      ExcelAdminDashboard.saveState('companies');
      closeTxModal();
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم إنشاء السند المالي بالمنشئ المرئي وربطه بالشركة بنجاح!', 'success');
      ExcelAdminDashboard.switchTab('companies');
    };
  },

  async deleteCompanyTransaction(compId, txId) {
    this.requireAdmin();
    const comp = this.companies.find(c => c.id === compId);
    if (!comp || !comp.transactions) return;

    let confirmed = false;
    if (typeof AccModal !== 'undefined') {
      confirmed = await AccModal.confirm({
        title: 'حذف السند المالي',
        message: 'هل أنت متأكد من رغبتك في حذف هذا السند المالي من سجل الشركة؟',
        confirmText: 'نعم، حذف',
        cancelText: 'إلغاء',
        danger: true
      });
    } else {
      confirmed = confirm('هل أنت متأكد من رغبتك في حذف هذا السند المالي؟');
    }

    if (confirmed) {
      comp.transactions = comp.transactions.filter(t => t.id !== txId);
      this.saveState('companies');
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف السند المالي بنجاح', 'success');
      this.switchTab('companies');
    }
  },

  downloadCompanyCsvTemplate(compId) {
    const comp = this.companies.find(c => c.id === compId);
    const cName = comp ? comp.name : 'الشركة';

    let csv = "\uFEFFرقم السند,التاريخ المالي,عنوان العملية,بيان وتفاصيل السند,الطرف المدين,الطرف الدائن,المبلغ\n";
    csv += "1,02 يناير,شراء بضاعة للمستودع نقداً,تم شراء بضاعة لصالح المستودع الرئيسي بموجب فاتورة شراء وإذن صرف,inventory,cash,20000\n";
    csv += "2,05 يناير,توريد بضاعة بالآجل من الموردين,شحنة بضاعة من شركة الدلتا بموجب فاتورة شراء آجلة تستحق بعد شهر,inventory,ap,35000\n";
    csv += "3,08 يناير,مبيعات نقدية للفرع,مبيعات بضاعة نقدية للجمهور واستلام كامل القيمة نقداً بالخزينة,cash,sales_rev,28000\n";
    csv += "4,12 يناير,مبيعات آجلة لعميل تجاري,فاتورة بيع بضاعة للعميل مؤسسة الشروق بالآجل على الحساب,ar,sales_rev,18000\n";
    csv += "5,18 يناير,سداد دفعة نقدية للمورد,سداد دفعة للمورد شركة الدلتا تخفيضاً للديون المستحقة,ap,cash,15000\n";

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `نموذج_سندات_${cName.replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم تنزيل نموذج Excel لسندات الشركة بنجاح!', 'success');
    else alert('✓ تم تنزيل نموذج Excel لسندات الشركة بنجاح!');
  },

  importCompanyTransactionsFromCsv(event, compId) {
    this.requireAdmin();
    const file = event.target.files[0];
    if (!file) return;

    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      if (!text || !text.trim()) {
        if (typeof AccModal !== 'undefined') AccModal.toast('الملف فارغ.', 'error');
        else alert('الملف فارغ.');
        return;
      }

      let newTxList = [];

      // 1. التحقق إذا كان الملف مخرجاً من المولد المحاسبي (يحتوي على Transaction ID أو رمز الحساب أو Entry ID)
      if (typeof SimulationBridge !== 'undefined' && (text.includes('Entry ID') || text.includes('Transaction ID') || text.includes('رقم القيد') || text.includes('رمز الحساب'))) {
        newTxList = SimulationBridge.parseGeneratorJournalCsv(text);
      }

      // 2. إذا لم يكن من المولد أو فشل، استخدام قارئ الـ CSV القياسي
      if (!newTxList || newTxList.length === 0) {
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('sep='));
        if (lines.length <= 1) {
          if (typeof AccModal !== 'undefined') AccModal.toast('الملف فارغ أو لا يحتوي على صفوف صالحة.', 'error');
          else alert('الملف فارغ أو لا يحتوي على صفوف صالحة.');
          return;
        }

        const delimiter = text.includes(';') ? ';' : ',';
        function parseCsvLine(line) {
          const res = [];
          let curr = '';
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
              res.push(curr.trim());
              curr = '';
            } else {
              curr += char;
            }
          }
          res.push(curr.trim());
          return res;
        }

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          if (cols.length >= 5) {
            const num = parseInt(cols[0], 10) || i;
            const date = cols[1] || '2026-01-15';
            const title = cols[2] || `عملية مالية #${num}`;
            const desc = cols[3] || title;
            const dr = cols[4] || 'cash';
            const cr = cols[5] || 'sales_rev';
            const amt = parseFloat((cols[6] || '0').replace(/[^0-9.-]+/g, '')) || 0;

            newTxList.push({
              id: `tx-csv-${Date.now()}-${i}`,
              num: num,
              date: date,
              title: title,
              desc: desc,
              dr: dr,
              cr: cr,
              amount: amt
            });
          }
        }
      }

      if (!newTxList || newTxList.length === 0) {
        if (typeof AccModal !== 'undefined') AccModal.toast('لم يتم العثور على قيود أو سندات صالحة في الملف.', 'error');
        else alert('لم يتم العثور على قيود أو سندات صالحة في الملف.');
        return;
      }

      comp.transactions = newTxList;
      this.saveState('companies');
      if (typeof AccModal !== 'undefined') AccModal.toast(`تم استيراد ${newTxList.length} عملية وربطها بالشركة بنجاح!`, 'success');
      else alert(`تم بنجاح استيراد ${newTxList.length} عملية وربطها بالشركة! بمجرد دخول الطالب على الشركة سيتم تحويله للمحاكي مباشرة.`);
      this.switchTab('companies');
    };
    reader.readAsText(file, "UTF-8");
  },

  // 3. تبويب الباقات والتسعير (Plans & Pricing)
  renderPlansTab() {
    if (this.editingPlanId) {
      return this.renderPlanEditor(this.editingPlanId);
    }

    if (!this.pendingSubsLoaded) {
      setTimeout(() => this.loadPendingSubscriptions(), 50);
    }

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 22 }) : ''}
            <span>إدارة باقات الاشتراك وتخصيص الصلاحيات</span>
          </h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">التحكم بأسعار ومدة الباقات والدروس المتاحة وصلاحيات الأقسام والمؤقت الزمني</p>
        </div>
        <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.addNewPlan()">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
          <span>إضافة باقة جديدة</span>
        </button>
      </div>

      <!-- قسم طلبات الترقية المعلقة (Pending Subscriptions) - اعتماد الأدمن اليدوي -->
      <div style="background:var(--surface-ground); border:1.5px solid var(--border-subtle); border-radius:14px; padding:18px 20px; margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:40px; height:40px; border-radius:10px; background:rgba(245,158,11,0.15); color:#d97706; display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0;">
              ⏳
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">طلبات الترقية المعلقة (Pending Subscriptions)</h3>
                <span class="badge" style="background:${(this.pendingSubscriptions?.length || 0) > 0 ? '#ef4444' : '#10b981'}; color:#ffffff; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:999px;">
                  ${this.pendingSubscriptions?.length || 0} طلبات
                </span>
              </div>
              <p style="margin:3px 0 0; font-size:0.83rem; color:var(--text-secondary);">
                مراجعة طلبات ترقية الطلاب واعتمادها يدوياً لتفعيل باقات PRO و VIP
              </p>
            </div>
          </div>

          <button class="btn-workspace-action" style="padding:6px 14px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.loadPendingSubscriptions()">
            <span>تحديث القائمة 🔄</span>
          </button>
        </div>

        <div id="pending_subs_container">
          ${this.renderPendingSubscriptionsList()}
        </div>
      </div>

      <!-- لوحة التحكم بالفترة التجريبية للطلاب (Free Trial Configuration) -->
      <div style="background:var(--surface-ground); border:1px solid var(--border-subtle); border-radius:14px; padding:18px 20px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:14px;">
          <div style="width:44px; height:44px; border-radius:10px; background:rgba(16,185,129,0.12); color:#10b981; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 22 }) : '★'}
          </div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">التحكم بالفترة التجريبية المجانية (Free Trial)</h3>
              <span class="badge" style="background:${this.systemConfig.trialEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color:${this.systemConfig.trialEnabled ? '#10b981' : '#ef4444'}; font-size:0.75rem; font-weight:bold; padding:2px 8px; border-radius:999px;">
                ${this.systemConfig.trialEnabled ? 'مفعلة للطلاب' : 'معطلة'}
              </span>
            </div>
            <p style="margin:4px 0 0; font-size:0.84rem; color:var(--text-secondary);">
              المدة الحالية للتجربة: <strong>${this.systemConfig.trialDays || 3} أيام</strong> على باقة <strong>${(this.systemConfig.trialPlan || 'pro').toUpperCase()}</strong> • ينتهي وصول الطالب تلقائياً ويعود للباقة المجانية بعد انقضاء هذه المدة.
            </p>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="display:flex; align-items:center; gap:6px; background:var(--surface-card); border:1px solid var(--border-subtle); padding:6px 12px; border-radius:8px;">
            <label style="font-size:0.8rem; font-weight:700; color:var(--text-secondary);">مدة التجربة (بالأيام):</label>
            <input type="number" id="cfg_trial_days" value="${this.systemConfig.trialDays || 3}" min="1" max="60" style="width:60px; padding:4px 8px; font-weight:800; text-align:center; border:1px solid var(--border-subtle); border-radius:6px; background:var(--bg-main); color:var(--text-primary);">
          </div>

          <button class="btn-workspace-action" style="padding:8px 14px; font-size:0.84rem;" onclick="ExcelAdminDashboard.updateTrialDays(document.getElementById('cfg_trial_days')?.value)">
            حفظ المدة
          </button>

          <button class="btn-workspace-action ${this.systemConfig.trialEnabled ? '' : 'btn-workspace-primary'}" style="padding:8px 14px; font-size:0.84rem;" onclick="ExcelAdminDashboard.toggleTrialEnabled()">
            ${this.systemConfig.trialEnabled ? 'تعطيل التجربة' : 'تفعيل التجربة'}
          </button>
        </div>
      </div>

      <div class="plans-grid-cards">
        ${this.plans.map(plan => `
          <div class="plan-admin-card" style="border-top: 4px solid ${plan.color || 'var(--tier-starter)'};">
            <div>
              <div class="plan-card-header">
                <span class="plan-icon-symbol">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('package', { size: 24 }) : '★'}</span>
                <span class="badge" style="background:${plan.color}22; color:${plan.color}; font-weight:bold; padding:4px 10px; border-radius:9999px; font-size:0.75rem;">
                  ${plan.badge || 'باقة'}
                </span>
              </div>

              <h3 class="plan-title-h3">${plan.name}</h3>
              <div class="plan-price-tag">
                ${plan.price === 0 ? 'مجاناً' : `${plan.price} ج.م`}
                <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;"> / ${plan.period}</span>
              </div>

              <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:12px;">
                مدة المؤقت: <strong style="color:var(--primary);">${plan.durationDays > 0 ? `${plan.durationDays} يوماً` : 'دائم (مدى الحياة)'}</strong>
              </div>

              <div class="plan-rules-box" style="border-right: 3px solid ${plan.color || 'var(--tier-starter)'};">
                <strong style="display:block; margin-bottom:8px; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('shield', { size: 14 }) : ''}
                  <span>حدود وصلاحيات الأقسام:</span>
                </strong>
                <div class="rule-row">
                  <span>الدروس المسموحة:</span>
                  <strong>${plan.maxLessons >= 999 ? 'جميع الدروس (غير محدود)' : `${plan.maxLessons} دروس`}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكاة الشركات:</span>
                  <strong>${plan.maxCompanies >= 999 ? 'جميع الشركات' : `${plan.maxCompanies} شركة`}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكي مراجعة الشركات:</span>
                  <strong style="color:${plan.allowAudit ? 'var(--success)' : 'var(--danger)'};">${plan.allowAudit ? 'مفعل' : 'مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>إكسل الدورة المحاسبية:</span>
                  <strong style="color:${plan.allowExcelCycle ? 'var(--success)' : 'var(--danger)'};">${plan.allowExcelCycle ? 'مفعل' : 'مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكي مقابلات التوظيف:</span>
                  <strong style="color:${plan.allowInterviewSim ? 'var(--success)' : 'var(--danger)'};">${plan.allowInterviewSim ? 'مفعل' : 'مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>مشاركة المحفظة على LinkedIn:</span>
                  <strong style="color:${plan.allowLinkedInShare ? 'var(--success)' : 'var(--danger)'};">${plan.allowLinkedInShare ? 'مفعل' : 'مغلق'}</strong>
                </div>
              </div>

              <div style="margin-bottom:16px;">
                <span style="font-size:0.8rem; font-weight:700; color:var(--text-muted); display:block; margin-bottom:6px;">المميزات المعروضة للطالب:</span>
                <ul style="margin:0 0 0 16px; font-size:0.82rem; line-height:1.7; color:var(--text-secondary);">
                  ${(plan.features || []).map(f => `<li>${f}</li>`).join('')}
                </ul>
              </div>
            </div>

            <div style="display:flex; gap:8px; border-top:1px solid var(--border-subtle); padding-top:14px;">
              <button class="btn-workspace-action" style="flex:1; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="ExcelAdminDashboard.openPlanEditor('${plan.id}')">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 14 }) : ''}
                <span>تعديل وتخصيص الباقة</span>
              </button>
              ${plan.id !== 'free' ? `
                <button class="btn-workspace-action" style="color:var(--danger);" onclick="ExcelAdminDashboard.deletePlan('${plan.id}')" title="حذف الباقة">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : '✕'}
                </button>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderPlanEditor(planId) {
    const plan = this.plans.find(p => p.id === planId) || this.plans[0];

    return `
      <div class="admin-editor-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:1px solid var(--border-subtle); padding-bottom:16px; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:1.5rem; background:${plan.color}22; padding:8px 14px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; color:${plan.color};">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('package', { size: 24 }) : '★'}
            </span>
            <div>
              <h2 style="margin:0; font-size:1.3rem;">تعديل وتخصيص باقة: <strong style="color:var(--tier-starter);">${plan.name}</strong></h2>
              <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.85rem;">التحكم بأسعار ومدة وصلاحيات الأقسام لهذه الباقة</p>
            </div>
          </div>
          <button class="btn-workspace-action" onclick="ExcelAdminDashboard.closePlanEditor()">
            ← رجوع للباقات
          </button>
        </div>

        <div class="editor-two-col">
          <!-- بيانات الباقة والتسعير -->
          <div class="editor-section-box">
            <h4 class="editor-section-title" style="color:var(--tier-starter); display:flex; align-items:center; gap:6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 16 }) : ''}
              <span>١. بيانات الباقة والتسعير</span>
            </h4>
            
            <div class="admin-form-group">
              <label>اسم الباقة:</label>
              <input type="text" id="pe_name" class="admin-form-input" value="${plan.name}">
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="admin-form-group">
                <label>السعر (ج.م):</label>
                <input type="number" id="pe_price" class="admin-form-input" value="${plan.price}">
              </div>
              <div class="admin-form-group">
                <label>مدة الصلاحية بالأيام (المؤقت الزمني):</label>
                <input type="number" id="pe_duration_days" class="admin-form-input" value="${plan.durationDays !== undefined ? plan.durationDays : 30}" min="0" placeholder="0 = دائم | 30 = شهر">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="admin-form-group">
                <label>نص العرض للمدة (للطالب):</label>
                <input type="text" id="pe_period" class="admin-form-input" value="${plan.period}">
              </div>
              <div class="admin-form-group">
                <label>الوسام الترويجي:</label>
                <input type="text" id="pe_badge" class="admin-form-input" value="${plan.badge || ''}">
              </div>
            </div>

            <div class="admin-form-group">
              <label>اللون المميز:</label>
              <input type="color" id="pe_color" class="admin-form-input" style="width:100%; padding:2px; height:42px;" value="${plan.color || 'var(--tier-starter)'}">
            </div>
          </div>

          <!-- حدود المحتوى والصلاحيات -->
          <div class="editor-section-box">
            <h4 class="editor-section-title" style="color:var(--tier-pro); display:flex; align-items:center; gap:6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 16 }) : ''}
              <span>٢. حدود الدروس والمحتوى المسموح</span>
            </h4>
            
            <div class="admin-form-group">
              <label>الحد الأقصى للدروس المتاحة:</label>
              <div style="display:flex; gap:8px;">
                <input type="number" id="pe_max_lessons" class="admin-form-input" value="${plan.maxLessons}">
                <button type="button" class="btn-workspace-action" onclick="document.getElementById('pe_max_lessons').value = 999">فتح الكل</button>
              </div>
            </div>

            <div class="admin-form-group">
              <label>الحد الأقصى لمحاكاة الشركات:</label>
              <input type="number" id="pe_max_companies" class="admin-form-input" value="${plan.maxCompanies}">
            </div>

            <div class="admin-form-group">
              <label>الحد الأقصى للتمارين المستقلة:</label>
              <input type="number" id="pe_max_exercises" class="admin-form-input" value="${plan.maxExercises}">
            </div>

            <div class="admin-form-group">
              <label>المميزات المعروضة للطالب (ميزة في كل سطر):</label>
              <textarea id="pe_features" class="admin-form-textarea" rows="4" placeholder="أدخل كل ميزة في سطر منفصل...">${(plan.features || []).join('\n')}</textarea>
            </div>
          </div>
        </div>

        <!-- مفاتيح الصلاحيات والمحاكيات -->
        <div class="editor-section-box" style="margin-bottom:20px;">
          <h4 class="editor-section-title" style="color:var(--tier-vip); display:flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 16 }) : ''}
            <span>٣. مفاتيح تفعيل وتعطيل المحاكيات والأقسام</span>
          </h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_audit" ${plan.allowAudit ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">محاكي مراجعة الشركات</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">فحص المستندات وقيود التسوية AJEs</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_excel" ${plan.allowExcelCycle ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">إكسل الدورة المحاسبية</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">محاكي جداول Excel Suite المالي</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_interview" ${plan.allowInterviewSim ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">محاكي مقابلات التوظيف</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">بنك المقابلات والأسئلة الفنية</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_passport" ${plan.allowSkillsPassport ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">جواز الكفاءة والشهادات</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">إصدار الشهادات والتوثيق برمز QR</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_linkedin" ${plan.allowLinkedInShare ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">مشاركة الاعتماد على LinkedIn</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">تمكين الطالب من مشاركة محفظته الموثقة على لينكد إن</span>
              </div>
            </label>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn-workspace-action" onclick="ExcelAdminDashboard.closePlanEditor()">إلغاء ✕</button>
          <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.savePlanEditor('${plan.id}')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('save', { size: 14 }) : ''}
            <span>حفظ كافة التعديلات</span>
          </button>
        </div>
      </div>
    `;
  },

  openPlanEditor(planId) {
    this.editingPlanId = planId;
    this.switchTab('plans', false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  closePlanEditor() {
    this.editingPlanId = null;
    this.switchTab('plans', true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  async savePlanEditor(planId) {
    this.requireAdmin();
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) return;

    plan.name = document.getElementById('pe_name')?.value.trim() || plan.name;
    plan.price = parseFloat(document.getElementById('pe_price')?.value) || 0;
    const daysVal = parseInt(document.getElementById('pe_duration_days')?.value, 10);
    plan.durationDays = isNaN(daysVal) ? 30 : daysVal;
    plan.duration_days = plan.durationDays;
    plan.period = document.getElementById('pe_period')?.value.trim() || plan.period;
    plan.badge = document.getElementById('pe_badge')?.value.trim() || '';
    plan.icon = document.getElementById('pe_icon')?.value.trim() || plan.icon;
    plan.color = document.getElementById('pe_color')?.value || plan.color;

    plan.maxLessons = parseInt(document.getElementById('pe_max_lessons')?.value, 10) || 3;
    plan.maxCompanies = parseInt(document.getElementById('pe_max_companies')?.value, 10) || 1;
    plan.maxExercises = parseInt(document.getElementById('pe_max_exercises')?.value, 10) || 5;

    plan.allowAudit = document.getElementById('pe_allow_audit')?.checked || false;
    plan.allowExcelCycle = document.getElementById('pe_allow_excel')?.checked || false;
    plan.allowInterviewSim = document.getElementById('pe_allow_interview')?.checked || false;
    plan.allowSkillsPassport = document.getElementById('pe_allow_passport')?.checked || false;
    plan.allowLinkedInShare = document.getElementById('pe_allow_linkedin')?.checked || false;

    const featVal = document.getElementById('pe_features')?.value;
    if (featVal !== undefined) {
      plan.features = featVal.split('\n').map(s => s.trim()).filter(Boolean);
    }

    try {
      if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.savePlan === 'function') {
        await SupabaseService.savePlan(plan);
      }
      if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم حفظ تعديلات باقة (${plan.name}) في قاعدة البيانات بنجاح!`, 'success');
      else alert(`✓ تم حفظ تعديلات وصلاحيات باقة (${plan.name}) بنجاح!`);
    } catch (err) {
      console.error('[AdminDashboard] Error saving plan to Supabase:', err);
      if (typeof AccModal !== 'undefined') AccModal.toast('حدث خطأ أثناء حفظ الباقة: ' + (err.message || ''), 'error');
    }
    this.closePlanEditor();
  },

  // جلب كافة طلبات الترقية المعلقة من Supabase
  async loadPendingSubscriptions() {
    this.pendingSubsLoaded = true;
    if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.getPendingSubscriptions === 'function') {
      try {
        this.pendingSubscriptions = await SupabaseService.getPendingSubscriptions();
        const container = document.getElementById('pending_subs_container');
        if (container) {
          container.innerHTML = this.renderPendingSubscriptionsList();
        }
      } catch (err) {
        console.warn('[AdminDashboard] Error loading pending subscriptions:', err);
      }
    }
  },

  // عرض جدول طلبات الترقية المعلقة
  renderPendingSubscriptionsList() {
    const list = this.pendingSubscriptions || [];
    if (list.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); background: var(--surface-card); border-radius: 12px; border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🎉</div>
          <strong style="color: var(--text-primary); font-size: 0.95rem;">لا توجد أي طلبات ترقية معلقة حالياً</strong>
          <p style="margin: 4px 0 0; font-size: 0.82rem;">كافة اشتراكات الطلاب معتمدة ومحدثة بالكامل.</p>
        </div>
      `;
    }

    return `
      <div style="overflow-x: auto; background: var(--surface-card); border-radius: 12px; border: 1px solid var(--border-subtle);">
        <table style="width: 100%; border-collapse: collapse; text-align: right; font-size: 0.88rem;">
          <thead>
            <tr style="background: var(--surface-ground); border-bottom: 1px solid var(--border-subtle); color: var(--text-secondary); font-size: 0.78rem;">
              <th style="padding: 10px 14px;">الطالب</th>
              <th style="padding: 10px 14px;">الباقة المطلوبة</th>
              <th style="padding: 10px 14px;">تاريخ ووقت الطلب</th>
              <th style="padding: 10px 14px;">الحالة</th>
              <th style="padding: 10px 14px; text-align: center;">إجراء الاعتماد</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(sub => {
              const profile = sub.profiles || {};
              const studentName = profile.full_name || 'طالب جديد';
              const studentEmail = profile.email || sub.user_id;
              const planBadge = sub.plan_id === 'vip' 
                ? '<span style="background: rgba(20, 184, 166, 0.15); color: var(--primary); padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.78rem;">VIP Master</span>'
                : '<span style="background: rgba(59, 130, 246, 0.15); color: #3b82f6; padding: 3px 10px; border-radius: 999px; font-weight: 800; font-size: 0.78rem;">PRO</span>';
              const dateStr = sub.requested_at ? new Date(sub.requested_at).toLocaleString('ar-EG') : 'الآن';

              return `
                <tr style="border-bottom: 1px solid var(--border-subtle);">
                  <td style="padding: 12px 14px;">
                    <strong style="display: block; color: var(--text-primary); font-size: 0.92rem;">${studentName}</strong>
                    <span style="font-size: 0.75rem; color: var(--text-muted); font-family: monospace;">${studentEmail}</span>
                  </td>
                  <td style="padding: 12px 14px;">
                    ${planBadge}
                  </td>
                  <td style="padding: 12px 14px; color: var(--text-secondary); font-size: 0.82rem;">
                    ${dateStr}
                  </td>
                  <td style="padding: 12px 14px;">
                    <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800;">معلق (Pending)</span>
                  </td>
                  <td style="padding: 12px 14px; text-align: center;">
                    <div style="display: inline-flex; gap: 8px;">
                      <button onclick="ExcelAdminDashboard.approveSubscription('${sub.id}', '${sub.plan_id}')" class="btn-workspace-action" style="background: #10b981; color: #ffffff; padding: 6px 14px; font-size: 0.8rem; font-weight: 800; border-radius: 6px;">
                        ✓ موافقة وتفعيل
                      </button>
                      <button onclick="ExcelAdminDashboard.rejectSubscription('${sub.id}')" class="btn-workspace-action" style="background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3); padding: 6px 14px; font-size: 0.8rem; font-weight: 800; border-radius: 6px;">
                        ✕ رفض
                      </button>
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // اعتماد الأدمن لاشتراك الطالب
  async approveSubscription(subId, planId) {
    this.requireAdmin();
    const plan = this.plans.find(p => p.id === planId);
    const durationDays = plan?.durationDays !== undefined ? plan.durationDays : (planId === 'vip' ? 365 : 30);

    try {
      if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.approveSubscription === 'function') {
        await SupabaseService.approveSubscription(subId, durationDays);
      }
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('✓ تم اعتماد وتفعيل اشتراك الطالب بنجاح!', 'success');
      } else {
        alert('✓ تم اعتماد وتفعيل اشتراك الطالب بنجاح!');
      }
      await this.loadPendingSubscriptions();
      this.switchTab('plans');
    } catch (err) {
      console.error('[AdminDashboard] approveSubscription error:', err);
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('حدث خطأ أثناء اعتماد الاشتراك: ' + (err.message || ''), 'error');
      } else {
        alert('حدث خطأ أثناء اعتماد الاشتراك: ' + (err.message || ''));
      }
    }
  },

  // رفض الأدمن لطلب الترقية
  async rejectSubscription(subId) {
    this.requireAdmin();
    if (typeof AccModal !== 'undefined' && AccModal.confirm) {
      const ok = await AccModal.confirm({
        title: 'رفض طلب الترقية',
        message: 'هل أنت متأكد من رفض هذا الطلب؟',
        confirmText: 'نعم، ارفض الطلب',
        cancelText: 'تراجع',
        type: 'danger'
      });
      if (!ok) return;
    } else if (!confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
      return;
    }

    try {
      if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.rejectSubscription === 'function') {
        await SupabaseService.rejectSubscription(subId);
      }
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('تم رفض طلب الترقية.', 'info');
      } else {
        alert('تم رفض طلب الترقية.');
      }
      await this.loadPendingSubscriptions();
      this.switchTab('plans');
    } catch (err) {
      console.error('[AdminDashboard] rejectSubscription error:', err);
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('حدث خطأ أثناء رفض الطلب: ' + (err.message || ''), 'error');
      } else {
        alert('حدث خطأ أثناء رفض الطلب: ' + (err.message || ''));
      }
    }
  },

  async addNewPlan() {
    this.requireAdmin();
    let name = '';
    if (typeof AccModal !== 'undefined') {
      name = await AccModal.prompt({
        title: 'إضافة باقة جديدة',
        message: 'أدخل اسم الباقة التدريبية الجديدة:',
        placeholder: 'مثال: الباقة المتقدمة للمحاسبين',
        confirmText: 'إنشاء الباقة'
      });
    } else {
      name = prompt('أدخل اسم الباقة الجديدة:');
    }
    if (!name) return;
    const newId = 'plan-' + Date.now();
    const newPlan = {
      id: newId,
      name,
      price: 199,
      period: 'شهر واحد',
      durationDays: 30,
      duration_days: 30,
      badge: 'جديد',
      icon: 'sparkle',
      color: '#10b981',
      maxLessons: 6,
      maxCompanies: 2,
      maxExercises: 10,
      allowAudit: false,
      allowExcelCycle: false,
      allowInterviewSim: false,
      allowSkillsPassport: true,
      allowLinkedInShare: false,
      is_active: true,
      features: ['صلاحيات مخصصة للطلاب']
    };

    try {
      if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.savePlan === 'function') {
        await SupabaseService.savePlan(newPlan);
      }
      this.plans.push(newPlan);
      if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم إنشاء باقة (${name}) في قاعدة البيانات بنجاح!`, 'success');
    } catch(err) {
      console.error('[AdminDashboard] Error saving new plan:', err);
      this.plans.push(newPlan);
    }
    this.openPlanEditor(newId);
  },

  async deletePlan(planId) {
    this.requireAdmin();
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'حذف الباقة',
        message: 'هل أنت متأكد من رغبتك في حذف هذه الباقة نهائياً؟',
        confirmText: 'نعم، احذف الباقة',
        cancelText: 'إلغاء',
        danger: true
      });
    } else {
      conf = confirm('هل أنت متأكد من رغبتك في حذف هذه الباقة؟');
    }
    if (conf) {
      try {
        if (typeof SupabaseService !== 'undefined' && typeof SupabaseService.deletePlan === 'function') {
          await SupabaseService.deletePlan(planId);
        }
        this.plans = this.plans.filter(p => p.id !== planId);
        if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف الباقة بنجاح من قاعدة البيانات', 'info');
      } catch(err) {
        console.error('[AdminDashboard] Error deleting plan:', err);
        if (typeof AccModal !== 'undefined') AccModal.toast('حدث خطأ أثناء حذف الباقة: ' + (err.message || ''), 'error');
      }
      this.switchTab('plans');
    }
  },

  // 3. تبويب أكواد الخصم والتفعيل (Coupons & Promos)
  renderCouponsTab() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('ticket', { size: 20 }) : ''}
            <span>أكواد الخصم وبطاقات التفعيل</span>
          </h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">توليد كوبونات ترويجية وبطاقات تفعيل مجانية 100% للطلاب</p>
        </div>
        <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.toggleNewCouponBox()">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
          <span>إنشاء كود خصم جديد</span>
        </button>
      </div>

      <!-- نموذج إنشاء كود جديد -->
      <div id="newCouponContainer" style="display:none; margin-bottom:24px;">
        <div class="admin-editor-card" style="border-color:var(--tier-starter-border);">
          <h3 style="margin-top:0; font-size:1.15rem; color:var(--tier-starter); display:flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 16 }) : ''}
            <span>إنشاء كود خصم / تفعيل جديد</span>
          </h3>
          <div class="editor-two-col">
            <div class="admin-form-group">
              <label>رمز الكوبون (Code):</label>
              <input type="text" id="cpn_code" class="admin-form-input" placeholder="مثال: ACC2026" style="text-transform:uppercase; font-weight:bold;">
            </div>
            <div class="admin-form-group">
              <label>نوع الخصم:</label>
              <select id="cpn_type" class="admin-form-select">
                <option value="PERCENTAGE">نسبة مئوية (%)</option>
                <option value="FREE_PASS">تفعيل مجاني كامل 100% (Free Pass)</option>
                <option value="FIXED_AMOUNT">خصم مبلغ ثابت (ج.م)</option>
              </select>
            </div>
          </div>

          <div class="editor-two-col">
            <div class="admin-form-group">
              <label>قيمة الخصم (% أو مبلغ):</label>
              <input type="number" id="cpn_val" class="admin-form-input" value="30">
            </div>
            <div class="admin-form-group">
              <label>الباقة المستهدفة بالترقية:</label>
              <select id="cpn_target" class="admin-form-select">
                <option value="pro">المحاسب المحترف (Pro)</option>
                <option value="vip">خبير النمذجة (VIP Master)</option>
              </select>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.saveNewCoupon()">حفظ ونشر الكود ✓</button>
            <button class="btn-workspace-action" onclick="ExcelAdminDashboard.toggleNewCouponBox()">إلغاء</button>
          </div>
        </div>
      </div>

      <!-- جدول أكواد الخصم -->
      <div class="admin-table-container">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>كود الخصم</th>
              <th>نوع الخصم</th>
              <th>القيمة</th>
              <th>الباقة الممنوحة</th>
              <th>الاستخدامات</th>
              <th>الحالة</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${this.coupons.map(c => `
              <tr>
                <td><code style="font-size:1rem; font-weight:800; color:var(--tier-starter);">${c.code}</code></td>
                <td>${c.discountType === 'FREE_PASS' ? 'تفعيل مجاني 100%' : (c.discountType === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت')}</td>
                <td><strong>${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : ' ج.م'}</strong></td>
                <td><span class="badge" style="background:var(--tier-pro-bg); color:var(--tier-pro); padding:2px 8px; border-radius:6px; font-weight:700;">${c.targetPlan.toUpperCase()}</span></td>
                <td>${c.usedCount || 0} / ${c.maxUses || '∞'}</td>
                <td>
                  <span style="color:${c.isActive ? 'var(--success)' : 'var(--danger)'}; font-weight:800;">
                    ${c.isActive ? '✓ نشط' : '✕ معطل'}
                  </span>
                </td>
                <td>
                  <button class="btn-workspace-action" style="padding:4px 10px; font-size:0.78rem;" onclick="ExcelAdminDashboard.toggleCouponStatus('${c.code}')">
                    ${c.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button class="btn-workspace-action" style="padding:4px 8px; color:var(--danger);" onclick="ExcelAdminDashboard.deleteCoupon('${c.code}')">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : '✕'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  toggleNewCouponBox() {
    const box = document.getElementById('newCouponContainer');
    if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
  },

  saveNewCoupon() {
    this.requireAdmin();
    const code = document.getElementById('cpn_code')?.value.trim().toUpperCase();
    const type = document.getElementById('cpn_type')?.value;
    const val = parseFloat(document.getElementById('cpn_val')?.value) || 0;
    const target = document.getElementById('cpn_target')?.value;

    if (!code) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى إدخال رمز الكوبون أولاً', 'error');
      else alert('يرجى إدخال رمز الكوبون أولاً.');
      return;
    }

    if (this.coupons.some(c => c.code === code)) {
      if (typeof AccModal !== 'undefined') AccModal.toast('هذا الكود موجود بالفعل!', 'error');
      else alert('هذا الكود موجود بالفعل!');
      return;
    }

    this.coupons.push({
      code,
      discountType: type,
      discountValue: val,
      targetPlan: target,
      maxUses: 100,
      usedCount: 0,
      expiry: '2026-12-31',
      isActive: true
    });

    this.saveState('coupons');
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم إنشاء الكوبون (${code}) بنجاح!`, 'success');
    else alert(`✓ تم إنشاء الكوبون (${code}) بنجاح!`);
    this.switchTab('coupons');
  },

  toggleCouponStatus(code) {
    this.requireAdmin();
    const cpn = this.coupons.find(c => c.code === code);
    if (cpn) {
      cpn.isActive = !cpn.isActive;
      this.saveState('coupons');
      this.switchTab('coupons');
    }
  },

  async deleteCoupon(code) {
    this.requireAdmin();
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'حذف كوبون الخصم',
        message: `هل أنت متأكد من حذف الكود (${code})؟`,
        confirmText: 'نعم، احذف',
        cancelText: 'إلغاء',
        danger: true
      });
    } else {
      conf = confirm(`هل أنت متأكد من حذف الكود (${code})؟`);
    }
    if (conf) {
      this.coupons = this.coupons.filter(c => c.code !== code);
      this.saveState('coupons');
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف الكود بنجاح', 'info');
      this.switchTab('coupons');
    }
  },

  // 4. تبويب دليل المستخدمين وإدارة الصلاحيات (Users & Access)
  renderUsersTab() {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem('jr_users') || '[]');
      if (users.length === 0) {
        // حساب افتراضي إذا لم يوجد
        users = [
          { id: 'usr-admin-1', name: 'أحمد محمود (المدير)', role: 'admin', plan: 'vip', joinDate: '01 يناير 2026' },
          { id: 'usr-student-1', name: 'سارة إبراهيم', role: 'student', plan: 'pro', joinDate: '05 يناير 2026' },
          { id: 'usr-student-2', name: 'محمد علي', role: 'student', plan: 'free', joinDate: '10 يناير 2026' },
          { id: 'usr-teacher-1', name: 'أ. د. سامي عبد الله', role: 'teacher', plan: 'vip', joinDate: '12 يناير 2026' }
        ];
        localStorage.setItem('jr_users', JSON.stringify(users));
      }
    } catch (e) {}

    let filtered = [...users];
    if (this.userRoleFilter !== 'all') {
      filtered = filtered.filter(u => u.role === this.userRoleFilter);
    }
    if (this.usersSearch) {
      filtered = filtered.filter(u => 
        (u.name || '').toLowerCase().includes(this.usersSearch) ||
        (u.id || '').toLowerCase().includes(this.usersSearch)
      );
    }

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('users', { size: 20 }) : ''}
            <span>دليل المستخدمين وإدارة الصلاحيات</span>
          </h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">ترقية باقات الطلاب، تغيير صلاحيات المدرسين، وإدارة الحسابات</p>
        </div>
        <input 
          type="text" 
          class="admin-form-input" 
          placeholder="بحث باسم الطالب أو المعرف..." 
          value="${this.usersSearch}"
          style="max-width:260px;"
          oninput="ExcelAdminDashboard.setUsersSearch(this.value)"
        />
      </div>

      <!-- شرائح تصفية الأدوار -->
      <div style="display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap;">
        <button class="btn-workspace-action ${this.userRoleFilter === 'all' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('all')">
          الكل (${users.length})
        </button>
        <button class="btn-workspace-action ${this.userRoleFilter === 'student' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('student')">
          الطلاب (${users.filter(u => u.role === 'student').length})
        </button>
        <button class="btn-workspace-action ${this.userRoleFilter === 'teacher' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('teacher')">
          المدرسون (${users.filter(u => u.role === 'teacher').length})
        </button>
        <button class="btn-workspace-action ${this.userRoleFilter === 'admin' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('admin')">
          المسؤولون (${users.filter(u => u.role === 'admin').length})
        </button>
      </div>

      <!-- جدول المستخدمين -->
      <div class="admin-table-container">
        <table class="admin-data-table">
          <thead>
            <tr>
              <th>المستخدم والمعرّف</th>
              <th>الدور والصلاحية</th>
              <th>باقة الاشتراك</th>
              <th>صلاحية الاشتراك والمؤقت</th>
              <th>تاريخ التسجيل</th>
              <th>إجراءات وتمديد</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">
                  لا توجد حسابات مطابقة لمعايير البحث الحالية.
                </td>
              </tr>
            ` : filtered.map(u => `
              <tr>
                <td>
                  <strong style="font-size:0.95rem; display:block;">${u.name || 'مستخدم'}</strong>
                  <span style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:var(--text-muted);">${u.id}</span>
                </td>
                <td>
                  <select class="admin-form-select" style="padding:4px 8px; font-size:0.82rem; min-width:130px;" onchange="ExcelAdminDashboard.changeUserRole('${u.id}', this.value)">
                    <option value="student" ${u.role === 'student' ? 'selected' : ''}>طالب (Student)</option>
                    <option value="teacher" ${u.role === 'teacher' ? 'selected' : ''}>مدرس (Teacher)</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>مسؤول (Admin)</option>
                  </select>
                </td>
                <td>
                  <select class="admin-form-select" style="padding:4px 8px; font-size:0.82rem; min-width:130px;" onchange="ExcelAdminDashboard.changeUserPlan('${u.id}', this.value)">
                    <option value="free" ${u.plan === 'free' ? 'selected' : ''}>مجانية (Free)</option>
                    <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>محترف (Pro)</option>
                    <option value="vip" ${u.plan === 'vip' ? 'selected' : ''}>خبير (VIP Master)</option>
                  </select>
                </td>
                <td>
                  ${(() => {
                    if (u.plan === 'free' || !u.plan) {
                      return '<span style="color:var(--text-muted); font-size:0.8rem;">مجانية دائمة</span>';
                    }
                    if (!u.expiresAt) {
                      return '<span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; font-weight:800;">دائم (غير محدد)</span>';
                    }
                    const daysLeft = Math.ceil((new Date(u.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
                    if (daysLeft > 0) {
                      return `
                        <div>
                          <span class="badge" style="background:rgba(16,185,129,0.15); color:#10b981; font-weight:800; font-size:0.75rem;">نشط • متبقي ${daysLeft} يوم</span>
                          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">ينتهي: ${new Date(u.expiresAt).toLocaleDateString('ar-EG')}</div>
                        </div>
                      `;
                    } else {
                      return `
                        <div>
                          <span class="badge" style="background:rgba(239,68,68,0.15); color:#ef4444; font-weight:800; font-size:0.75rem;">منتهي الصلاحية</span>
                          <div style="font-size:0.72rem; color:var(--text-muted); margin-top:2px;">انتهى: ${new Date(u.expiresAt).toLocaleDateString('ar-EG')}</div>
                        </div>
                      `;
                    }
                  })()}
                </td>
                <td style="font-size:0.82rem; color:var(--text-muted);">${u.joinDate || '01 يناير 2026'}</td>
                <td style="display:flex; gap:6px; align-items:center;">
                  ${u.plan !== 'free' ? `
                    <button class="btn-workspace-action" style="padding:4px 8px; font-size:0.75rem; color:var(--primary); font-weight:800;" onclick="ExcelAdminDashboard.extendUserSubscription('${u.id}', 30)" title="تمديد الاشتراك 30 يوماً">+30 يوم</button>
                  ` : ''}
                  <button class="btn-workspace-action" style="padding:4px 8px; color:var(--danger);" onclick="ExcelAdminDashboard.deleteUser('${u.id}')" title="حذف الحساب">
                    ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trash', { size: 14 }) : '✕'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  setUserRoleFilter(role) {
    this.userRoleFilter = role;
    this.switchTab('users');
  },

  setUsersSearch(val) {
    this.usersSearch = (val || '').toLowerCase().trim();
    this.switchTab('users');
  },

  changeUserRole(userId, newRole) {
    this.requireAdmin();
    let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      localStorage.setItem('jr_users', JSON.stringify(users));
      if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم تعديل دور (${user.name}) إلى [${newRole}] بنجاح!`, 'success');
      else alert(`✓ تم تعديل دور (${user.name}) إلى [${newRole}] بنجاح!`);
    }
  },

  changeUserPlan(userId, newPlan) {
    this.requireAdmin();
    let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      user.plan = newPlan;
      if (newPlan === 'free') {
        delete user.expiresAt;
        user.planExpired = false;
      } else {
        const plan = this.plans.find(p => p.id === newPlan);
        const days = plan?.durationDays !== undefined ? plan.durationDays : (newPlan === 'vip' ? 365 : 30);
        user.subscribedAt = new Date().toISOString();
        if (days > 0) {
          user.expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
        } else {
          delete user.expiresAt;
        }
        user.planExpired = false;
      }
      localStorage.setItem('jr_users', JSON.stringify(users));

      // إذا كان المستخدم الحالي هو نفس الحساب، تحديثه فوراً
      const cur = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
      if (cur && (cur.id === userId || cur.email === user.email)) {
        cur.plan = user.plan;
        cur.subscribedAt = user.subscribedAt;
        cur.expiresAt = user.expiresAt;
        cur.planExpired = user.planExpired;
        localStorage.setItem('accountera_user', JSON.stringify(cur));
        AuthService.currentUser = cur;
        AuthService.updateTopBarUI();
      }

      if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم تحديث باقة (${user.name}) إلى [${newPlan.toUpperCase()}] بنجاح!`, 'success');
      this.switchTab('users');
    }
  },

  extendUserSubscription(userId, days = 30) {
    this.requireAdmin();
    let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const baseTime = (user.expiresAt && new Date(user.expiresAt) > new Date()) 
      ? new Date(user.expiresAt).getTime() 
      : Date.now();
    const newExp = new Date(baseTime + days * 24 * 60 * 60 * 1000);
    user.expiresAt = newExp.toISOString();
    user.planExpired = false;
    localStorage.setItem('jr_users', JSON.stringify(users));

    const cur = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    if (cur && (cur.id === userId || cur.email === user.email)) {
      cur.expiresAt = user.expiresAt;
      cur.planExpired = false;
      localStorage.setItem('accountera_user', JSON.stringify(cur));
      AuthService.currentUser = cur;
      AuthService.updateTopBarUI();
    }

    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم تمديد اشتراك (${user.name}) لمدة ${days} يوماً حتى ${newExp.toLocaleDateString('ar-EG')}!`, 'success');
    this.switchTab('users');
  },

  updateTrialDays(days) {
    this.requireAdmin();
    const d = parseInt(days, 10);
    if (!d || d < 1) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى إدخال عدد أيام صحيح (يوم أو أكثر)', 'error');
      return;
    }
    this.systemConfig.trialDays = d;
    this.saveState('config');
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم حفظ مدة التجربة المجانية (${d} أيام) بنجاح!`, 'success');
    this.switchTab('plans', false);
  },

  toggleTrialEnabled() {
    this.requireAdmin();
    this.systemConfig.trialEnabled = !this.systemConfig.trialEnabled;
    this.saveState('config');
    const msg = this.systemConfig.trialEnabled ? '✓ تم تفعيل الفترة التجريبية للطلاب.' : '✓ تم إيقاف الفترة التجريبية.';
    if (typeof AccModal !== 'undefined') AccModal.toast(msg, 'info');
    this.switchTab('plans', false);
  },

  async deleteUser(userId) {
    this.requireAdmin();
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'حذف حساب المستخدم',
        message: 'هل أنت متأكد من رغبتك في حذف هذا الحساب نهائياً؟',
        confirmText: 'نعم، احذف',
        cancelText: 'إلغاء',
        danger: true
      });
    } else {
      conf = confirm('هل أنت متأكد من رغبتك في حذف هذا الحساب؟');
    }
    if (conf) {
      let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
      users = users.filter(u => u.id !== userId);
      localStorage.setItem('jr_users', JSON.stringify(users));
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف الحساب بنجاح', 'info');
      this.switchTab('users');
    }
  },

  // 5. تبويب إدارة شركات وعينات المراجعة (Audit Hub)
  renderAuditTab() {
    const comp = this.auditEngagements.find(c => c.id === this.selectedAuditId) || this.auditEngagements[0];

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('search', { size: 20 }) : ''}
            <span>إدارة شركات المراجعة والتدقيق المالي</span>
          </h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">إعداد عينات الفحص وتحديد الأخطاء والمخالفات وتصدير نماذج Excel للتدقيق</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.downloadAuditCsvTemplate()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 14 }) : ''}
            <span>نموذج Excel للمراجعة</span>
          </button>
          <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.showAddAuditSampleModal()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('plus', { size: 14 }) : '+'}
            <span>إضافة عينة فحص</span>
          </button>
        </div>
      </div>

      <!-- بطاقة الشركة المختارة -->
      <div class="admin-editor-card" style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:44px; height:44px; border-radius:12px; background:var(--tier-pro-bg); color:var(--tier-pro);">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 24 }) : ''}
            </span>
            <div>
              <h3 style="margin:0; font-size:1.2rem;">${comp.companyName}</h3>
              <span style="font-size:0.8rem; color:var(--text-muted);">القطاع: ${comp.sector} | حد الأهمية النسبية: <strong>${(comp.materialityThreshold || 0).toLocaleString()} ج.م</strong></span>
            </div>
          </div>
          <span class="badge" style="background:var(--tier-pro-bg); color:var(--tier-pro); padding:4px 12px; border-radius:9999px; font-weight:800; font-size:0.8rem;">
            ${(comp.samples || []).length} عينات فحص مسجلة
          </span>
        </div>

        <p style="font-size:0.88rem; color:var(--text-secondary); margin:0 0 16px; line-height:1.6;">
          ${comp.description}
        </p>

        <!-- جدول عينات الفحص الخاصة بالشركة -->
        <div class="admin-table-container">
          <table class="admin-data-table">
            <thead>
              <tr>
                <th style="width:60px;">عينة #</th>
                <th>عنوان المعاملة</th>
                <th>القيد المسجل بالدفاتر</th>
                <th>المستند المرفق</th>
                <th>الحالة</th>
                <th>تفاصيل المخالفة / التسوية</th>
              </tr>
            </thead>
            <tbody>
              ${(comp.samples || []).map(s => `
                <tr>
                  <td><strong>#${s.num}</strong></td>
                  <td><strong>${s.title}</strong></td>
                  <td>
                    <div style="font-size:0.8rem;">
                      <div>من: <span style="color:var(--primary); font-weight:700;">${s.recordedEntry.dr}</span></div>
                      <div>إلى: <span style="color:var(--success); font-weight:700;">${s.recordedEntry.cr}</span></div>
                      <div style="font-family:'JetBrains Mono',monospace;">المبلغ: ${s.recordedEntry.amount.toLocaleString()} ج.م</div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.8rem;">
                      <div>${s.document.type} (${s.document.no})</div>
                      <div style="font-weight:700; color:var(--primary);">${s.document.amount.toLocaleString()} ج.م</div>
                    </div>
                  </td>
                  <td>
                    <span style="display:inline-block; padding:3px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800; background:${s.isError ? 'rgba(239, 68, 68, 0.1)' : 'var(--tier-starter-bg)'}; color:${s.isError ? 'var(--danger)' : 'var(--success)'};">
                      ${s.isError ? 'مخالفة' : 'سليمة ✓'}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:0.82rem; color:${s.isError ? 'var(--danger)' : 'var(--success)'}; font-weight:700;">${s.errorCategory}</span>
                    <p style="margin:2px 0 0; font-size:0.78rem; color:var(--text-muted); line-height:1.4;">${s.errorDesc}</p>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  async showAddAuditSampleModal() {
    this.requireAdmin();
    let title = '';
    if (typeof AccModal !== 'undefined') {
      title = await AccModal.prompt({
        title: 'إضافة عينة فحص جديدة',
        message: 'أدخل عنوان عينة الفحص المحاسبية:',
        placeholder: 'مثال: فحص فاتورة شراء تجهيزات',
        confirmText: 'التالي'
      });
    } else {
      title = prompt('أدخل عنوان عينة الفحص:');
    }
    if (!title) return;

    let isError = false;
    if (typeof AccModal !== 'undefined') {
      isError = await AccModal.confirm({
        title: 'حالة عينة الفحص',
        message: 'هل تحتوي هذه العينة على مخالفة أو خطأ محاسبي يتوجب على الطالب اكتشافه وتصحيحه؟',
        confirmText: 'نعم، عينة مخالفة',
        cancelText: 'لا، عملية سليمة 100% ✓',
        icon: 'search'
      });
    } else {
      isError = confirm('هل هذه العينة تحتوي على مخالفة محاسبية يتوجب تصحيحها؟ (موافق = نعم، إلغاء = سليمة)');
    }

    const comp = this.auditEngagements[0];
    if (!comp.samples) comp.samples = [];

    comp.samples.push({
      id: 's-' + Date.now(),
      num: comp.samples.length + 1,
      title,
      recordedEntry: { dr: 'المصروفات العمومية', cr: 'النقدية بالبنك', amount: 15000 },
      document: { type: 'فاتورة ضريبية', no: 'INV-' + Math.floor(Math.random() * 9000 + 1000), amount: 15000, vendor: 'شركة التقنية الحديثة' },
      isError,
      errorCategory: isError ? 'مخالفة توجيه محاسبي' : 'عملية سليمة 100%',
      errorDesc: isError ? 'المعاملة تتضمن خطأ في تصنيف الحساب طبقاً للمعيار المحاسبي.' : 'المستند والقيد مطابقان تماماً.',
      correctAje: isError ? { dr: 'الأصول الثابتة', cr: 'المصروفات العمومية', amount: 15000, desc: 'تصحيح الخطأ وتوجيه الأصل بشكل صحيح' } : null
    });

    this.saveState('audit');
    if (typeof AccModal !== 'undefined') AccModal.toast('✓ تمت إضافة عينة الفحص بنجاح!', 'success');
    else alert('✓ تمت إضافة عينة الفحص بنجاح!');
    this.switchTab('audit');
  },

  downloadAuditCsvTemplate() {
    let csv = "\uFEFFالتاريخ,عنوان العينة,الحساب المدين بالدفاتر,الحساب الدائن بالدفاتر,المبلغ,نوع المستند,المورد,المبلغ بالمستند,هل توجد مخالفة,تصنيف المخالفة\n";
    csv += "15 يناير,شراء أجهزة خوادم,مصروف الصيانة,النقدية بالبنك,28000,فاتورة ضريبية,دلتا للحلول,28000,نعم,أخطاء رسملة الأصول\n";
    csv += "20 يناير,سداد إيجار المعرض,مصروف الإيجار,النقدية بالخزينة,12000,إيصال إيجار,الأبراج العقارية,12000,لا,عملية سليمة 100%\n";

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "نموذج_عينات_المراجعة_Accountera.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم تنزيل نموذج Excel للمراجعة بنجاح!', 'success');
    else alert('✓ تم تنزيل نموذج Excel للمراجعة بنجاح!');
  },

  // 6. تبويب مفاتيح المنظومة والنسخ الاحتياطي (System Settings & Backup)
  renderSettingsTab() {
    return `
      <div style="margin-bottom:20px;">
        <h2 style="margin:0; font-size:1.3rem; font-weight:900; display:flex; align-items:center; gap:8px;">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 20 }) : ''}
          <span>مفاتيح المنظومة والنسخ الاحتياطي</span>
        </h2>
        <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">التحكم بالميزات المفعلة في المنصة، والنسخ الاحتياطي الشامل للبيانات</p>
      </div>

      <!-- مفاتيح التشغيل العامة -->
      <div class="admin-editor-card" style="margin-bottom:24px;">
        <h3 style="margin-top:0; font-size:1.15rem; color:var(--tier-starter); margin-bottom:16px; display:flex; align-items:center; gap:8px;">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('shield', { size: 18 }) : ''}
          <span>مفاتيح التشغيل العامة (Feature Toggles):</span>
        </h3>
        
        <div class="settings-toggle-row">
          <div class="toggle-info">
            <h4>إلزام قيود الباقات والترقية (Enforce Plan Gating)</h4>
            <p>إغلاق الأقسام المتقدمة عن الباقة المجانية ومطالبتهم بالترقية للاشتراك.</p>
          </div>
          <input type="checkbox" style="width:22px; height:22px; cursor:pointer;" ${this.systemConfig.enforcePlanGating ? 'checked' : ''} onchange="ExcelAdminDashboard.updateConfig('enforcePlanGating', this.checked)">
        </div>

        <div class="settings-toggle-row">
          <div class="toggle-info">
            <h4>وضع الصيانة والتطوير (Maintenance Mode)</h4>
            <p>عرض شاشة صيانة للطلاب وقصر التصفح على المسؤولين فقط.</p>
          </div>
          <input type="checkbox" style="width:22px; height:22px; cursor:pointer;" ${this.systemConfig.maintenanceMode ? 'checked' : ''} onchange="ExcelAdminDashboard.updateConfig('maintenanceMode', this.checked)">
        </div>
      </div>

      <!-- النسخ الاحتياطي الشامل -->
      <div class="admin-editor-card">
        <h3 style="margin-top:0; font-size:1.15rem; color:var(--tier-pro); margin-bottom:10px; display:flex; align-items:center; gap:8px;">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('save', { size: 18 }) : ''}
          <span>النسخ الاحتياطي الشامل للمنصة (JSON Backup)</span>
        </h3>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:18px; line-height:1.6;">
          تصدير كافة إعدادات المنصة والباقات والكوبونات وسجلات القيود كملف JSON مستقل، أو استرجاع نسخة سابقة في ثوانٍ.
        </p>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn-workspace-action btn-workspace-primary" style="display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.exportBackupJson()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 14 }) : ''}
            <span>تصدير النسخة الاحتياطية (JSON)</span>
          </button>
          
          <input type="file" id="importJsonInput" accept=".json" style="display:none;" onchange="ExcelAdminDashboard.handleImportJson(event)">
          <button class="btn-workspace-action" style="display:inline-flex; align-items:center; gap:6px;" onclick="document.getElementById('importJsonInput').click()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('upload', { size: 14 }) : ''}
            <span>استيراد نسخة احتياطية</span>
          </button>

          <button class="btn-workspace-action" style="color:var(--danger); display:inline-flex; align-items:center; gap:6px;" onclick="ExcelAdminDashboard.resetPlatformData()">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('rotate', { size: 14 }) : ''}
            <span>استعادة ضبط المصنع</span>
          </button>
        </div>
      </div>
    `;
  },

  togglePlanGating() {
    this.requireAdmin();
    this.systemConfig.enforcePlanGating = !this.systemConfig.enforcePlanGating;
    this.saveState('config');
    const msg = this.systemConfig.enforcePlanGating ? '✓ تم تفعيل قيود الباقات وإلزام الترقية.' : '✓ تم فتح المنصة بالكامل (Open Access Demo).';
    if (typeof AccModal !== 'undefined') AccModal.toast(msg, 'info');
    else alert(msg);
    this.switchTab(this.activeTab);
  },

  updateConfig(key, val) {
    this.requireAdmin();
    this.systemConfig[key] = val;
    this.saveState('config');
  },

  exportBackupJson() {
    this.requireAdmin();
    const backup = {
      appName: "Accountera",
      timestamp: new Date().toISOString(),
      companies: this.companies,
      plans: this.plans,
      coupons: this.coupons,
      auditEngagements: this.auditEngagements,
      systemConfig: this.systemConfig
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `Accountera_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم تصدير النسخة الاحتياطية الشاملة بنجاح!', 'success');
    else alert('✓ تم تصدير النسخة الاحتياطية الشاملة بنجاح!');
  },

  handleImportJson(event) {
    this.requireAdmin();
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.companies) this.companies = data.companies;
        if (data.plans) this.plans = data.plans;
        if (data.coupons) this.coupons = data.coupons;
        if (data.auditEngagements) this.auditEngagements = data.auditEngagements;
        if (data.systemConfig) this.systemConfig = data.systemConfig;

        this.saveState();
        if (typeof AccModal !== 'undefined') AccModal.toast('تم استيراد وتحديث كافة بيانات المنصة بنجاح!', 'success');
        else alert('تم استيراد وتحديث كافة بيانات المنصة بنجاح!');
        this.switchTab('overview');
      } catch (err) {
        if (typeof AccModal !== 'undefined') AccModal.toast('فشل قراءة ملف النسخة الاحتياطية. تأكد من صحة الملف.', 'error');
        else alert('فشل قراءة ملف النسخة الاحتياطية. تأكد من صحة الملف.');
      }
    };
    reader.readAsText(file);
  },

  async resetPlatformData() {
    this.requireAdmin();
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'استعادة ضبط المصنع',
        message: 'تحذير: هل أنت متأكد من رغبتك في استعادة ضبط المصنع وتصفير كافة التعديلات والبيانات؟',
        confirmText: 'نعم، استعادة ضبط المصنع',
        cancelText: 'إلغاء',
        danger: true,
        icon: 'warning'
      });
    } else {
      conf = confirm('تحذير: هل أنت متأكد من رغبتك في استعادة ضبط المصنع وتصفير كافة التعديلات؟');
    }

    if (conf) {
      this.companies = DEFAULT_ADMIN_COMPANIES;
      this.plans = DEFAULT_ADMIN_PLANS;
      this.coupons = DEFAULT_ADMIN_COUPONS;
      this.auditEngagements = DEFAULT_AUDIT_ENGAGEMENTS;
      this.saveState();
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تمت استعادة ضبط المصنع بنجاح', 'success');
      else alert('✓ تمت استعادة ضبط المصنع بنجاح.');
      this.switchTab('overview');
    }
  }
};

window.ExcelAdminDashboard = ExcelAdminDashboard;
window.parseTrainingPlatformJson = (json) => ExcelAdminDashboard.parseTrainingPlatformJson(json);


