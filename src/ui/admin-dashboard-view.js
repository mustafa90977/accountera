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
    badge: "تأسيسي",
    icon: "🌱",
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
    period: "3 أشهر",
    badge: "الأكثر طلباً",
    icon: "🚀",
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
      "مشاركة الاعتماد المهني مباشرة على LinkedIn 💼"
    ]
  },
  {
    id: "vip",
    name: "خبير النمذجة (VIP Master)",
    price: 599,
    period: "سنة كاملة",
    badge: "النخبة",
    icon: "👑",
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
      "مشاركة الاعتماد وسجل الكفاءات على LinkedIn 💼"
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
    usedCount: 24,
    expiry: "2026-12-31",
    isActive: true
  },
  {
    code: "FREEPASS",
    discountType: "FREE_PASS",
    discountValue: 100,
    targetPlan: "pro",
    maxUses: 50,
    usedCount: 12,
    expiry: "2026-12-31",
    isActive: true
  }
];

const DEFAULT_AUDIT_ENGAGEMENTS = [
  {
    id: "audit-1",
    companyName: "شركة النيل للتجارة الهندسية ش.م.م",
    sector: "التجارة والتوزيع",
    logo: "🏢",
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
  plans: [],
  coupons: [],
  auditEngagements: [],
  companies: [],
  systemConfig: {
    enforcePlanGating: false,
    maintenanceMode: false,
    certificateWatermark: "منصة المحاسب المعتمدة 2026",
    defaultCurrency: "ج.م"
  },

  init() {
    try {
      const savedPlans = localStorage.getItem('acc_admin_plans');
      this.plans = savedPlans ? JSON.parse(savedPlans) : DEFAULT_ADMIN_PLANS;
      if (Array.isArray(this.plans)) {
        this.plans.forEach(p => {
          if (p.allowLinkedInShare === undefined) {
            p.allowLinkedInShare = (p.id !== 'free');
          }
        });
      }

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
      if (!key || key === 'plans') localStorage.setItem('acc_admin_plans', JSON.stringify(this.plans));
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
              <div class="admin-badge">🛡️ لوحة التحكم المركزية والإدارية</div>
              <h1 class="admin-hero-title">منظومة إدارة المحاسب المبتدئ (Admin OS)</h1>
              <p class="admin-hero-desc">إدارة شاملة للباقات، أكواد التفعيل، دليل المستخدمين، ملفات التدقيق، والنسخ الاحتياطي</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <button class="btn-workspace-action" onclick="ExcelAdminDashboard.exportBackupJson()">
                📥 تصدير نسخة شاملة
              </button>
              <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.switchTab('settings')">
                ⚙️ الإعدادات العامة
              </button>
            </div>
          </div>

          <!-- شريط التبويبات الـ 7 المطابقة للمخطط -->
          <div class="admin-tabs-nav">
            <button class="admin-tab-btn ${this.activeTab === 'overview' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('overview')">
              📊 المؤشرات العامة
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'companies' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('companies')">
              🏢 محاكاة الشركات
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'plans' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('plans')">
              💳 الباقات والتسعير
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'coupons' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('coupons')">
              🎟️ أكواد الخصم والتفعيل
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'users' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('users')">
              👥 دليل المستخدمين
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'audit' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('audit')">
              🔍 إدارة المراجعة والتدقيق
            </button>
            <button class="admin-tab-btn ${this.activeTab === 'settings' ? 'active' : ''}" onclick="ExcelAdminDashboard.switchTab('settings')">
              ⚙️ مفاتيح المنظومة والنسخ
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

  switchTab(tab) {
    this.activeTab = tab;
    this.editingPlanId = null;
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

    const proCount = users.filter(u => u.plan === 'pro').length;
    const vipCount = users.filter(u => u.plan === 'vip').length;
    const estimatedRev = (proCount * 299) + (vipCount * 599);

    return `
      <!-- 1. شبكة بطاقات الأداء المالي والمنظومة -->
      <div class="admin-metrics-grid">
        <div class="admin-metric-card" style="border-top: 4px solid #10b981;">
          <div class="metric-number" style="color: #10b981;">${this.companies.length}</div>
          <div class="metric-title">🏢 شركات المحاكاة النشطة</div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid #3b82f6;">
          <div class="metric-number" style="color: #3b82f6;">${users.length || 1}</div>
          <div class="metric-title">إجمالي الطلاب المسجلين</div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid #f59e0b;">
          <div class="metric-number" style="color: #f59e0b;">${estimatedRev.toLocaleString()} ج.م</div>
          <div class="metric-title">الإيرادات التقديرية</div>
        </div>

        <div class="admin-metric-card" style="border-top: 4px solid #8b5cf6;">
          <div class="metric-number" style="color: #8b5cf6;">${this.coupons.filter(c => c.isActive).length}</div>
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
          ${this.systemConfig.enforcePlanGating ? '🔓 تعطيل القيود (فتح المنصة للجميع)' : '🔒 تفعيل قيود الباقات والترقية'}
        </button>
      </div>

      <!-- 3. بوابات الوصول السريع -->
      <div class="admin-quick-portals">
        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('companies')">
          <span class="portal-tag" style="color: #10b981;">COMPANIES SIMULATION</span>
          <h4 class="portal-title">إدارة محاكاة الشركات</h4>
          <p class="portal-desc">إضافة شركات جديدة، تحرير بيانات النشاط، وتعديل سندات العمليات.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('plans')">
          <span class="portal-tag" style="color: #3b82f6;">PLANS & PRICING</span>
          <h4 class="portal-title">إدارة الباقات والأسعار</h4>
          <p class="portal-desc">التحكم بأسعار الباقات، مدة الاشتراك، والمميزات المسموحة.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('coupons')">
          <span class="portal-tag" style="color: #f59e0b;">COUPONS & PROMOS</span>
          <h4 class="portal-title">أكواد الخصم والتفعيل</h4>
          <p class="portal-desc">إنشاء كوبونات ترويجية وبطاقات تفعيل مجانية 100% للطلاب.</p>
        </div>

        <div class="quick-portal-card" onclick="ExcelAdminDashboard.switchTab('settings')">
          <span class="portal-tag" style="color: #8b5cf6;">SYSTEM & BACKUP</span>
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
          <h2 style="margin:0; font-size:1.3rem; font-weight:900;">🏢 إدارة محاكاة مجمع الشركات (${this.companies.length})</h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">إضافة الشركات، استيراد الحزم التدريبية الشاملة (JSON)، وتعديل سندات العمليات والفواتير</p>
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <!-- زر استيراد ملف JSON من الجهاز -->
          <input type="file" id="admin_import_company_json" accept=".json" style="display:none;" onchange="ExcelAdminDashboard.handleCompanyJsonUpload(event)">
          <button class="btn-workspace-action btn-workspace-primary" style="background:#059669; color:#fff;" onclick="document.getElementById('admin_import_company_json').click()" title="رفع ملف حزمة تدريبية JSON لأي شركة من جهازك">
            📥 استيراد شركة من ملف تدريبي (JSON)
          </button>

          <!-- زر إضافة شركة يدوياً -->
          <button class="btn-workspace-action" onclick="ExcelAdminDashboard.showAddCompanyModal()">
            ➕ إضافة شركة جديدة (يدوي)
          </button>
        </div>
      </div>

      <!-- بطاقة تنبيه إرشادية للمسؤول -->
      <div style="background:rgba(37, 99, 235, 0.05); border:1px solid rgba(37, 99, 235, 0.2); border-radius:12px; padding:12px 16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:1.4rem;">💡</span>
          <div style="font-size:0.86rem; color:var(--text-secondary); line-height:1.5;">
            <strong style="color:var(--text-primary);">طريقة إضافة شركات المحاكاة:</strong>
            اضغط على <strong>"استيراد شركة من ملف تدريبي (JSON)"</strong> لرفع أي ملف شركة مخرج من المولد (<code style="background:rgba(0,0,0,0.06); padding:2px 6px; border-radius:4px;">.json</code>) لإنشاء الشركة وقراءة كافة العمليات والسندات التابعة لها تلقائياً، أو اضغط <strong>"إضافة شركة جديدة"</strong> للإنشاء اليدوي.
          </div>
        </div>
      </div>

      <!-- قائمة الشركات أو حالة عدم وجود شركات -->
      ${this.companies.length === 0 ? `
        <div style="text-align:center; padding: 3.5rem 1.5rem; background: var(--surface-card); border-radius: 16px; border: 2px dashed var(--border-subtle); max-width: 680px; margin: 0 auto;">
          <div style="font-size: 3.2rem; margin-bottom: 0.8rem;">🏢</div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">لا توجد شركات محاكاة مضافة حالياً في المنظومة</h3>
          <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem; max-width: 520px; margin-left:auto; margin-right:auto;">
            يمكنك استيراد بيئة تدريب شركة متكاملة مع كافة عملياتها من ملف JSON مخرج من المولد المحاسبي، أو إنشاء شركة جديدة يدوياً.
          </p>
          <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
            <button class="btn-workspace-action btn-workspace-primary" style="background:#059669; color:#fff; padding:10px 22px; font-weight:700;" onclick="document.getElementById('admin_import_company_json').click()">
              📥 استيراد شركة من ملف تدريبي (JSON)
            </button>
            <button class="btn-workspace-action" style="padding:10px 20px; font-weight:700;" onclick="ExcelAdminDashboard.showAddCompanyModal()">
              ➕ إنشاء شركة جديدة (يدوي)
            </button>
          </div>
        </div>
      ` : `
        <div style="display:flex; flex-direction:column; gap:24px;">
          ${this.companies.map((comp, cIdx) => `
            <div class="admin-editor-card" style="border-right: 4px solid #10b981; margin-bottom:0;">
              <!-- هيدر بطاقة الشركة -->
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:12px;">
                  <span style="font-size:2.2rem; background:rgba(16, 185, 129, 0.1); padding:8px 12px; border-radius:12px;">${comp.icon || '🏢'}</span>
                  <div>
                    <h3 style="margin:0; font-size:1.2rem; font-weight:800; color:var(--text-primary);">${comp.name}</h3>
                    <div style="display:flex; gap:6px; margin-top:4px; flex-wrap:wrap;">
                      <span style="background:rgba(59, 130, 246, 0.1); color:#3b82f6; padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${comp.sector || 'قطاع عام'}</span>
                      <span style="background:rgba(245, 158, 11, 0.1); color:#f59e0b; padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">${(comp.transactions || []).length} سندات مالية</span>
                      ${comp.capital ? `<span style="background:rgba(16, 185, 129, 0.1); color:#10b981; padding:2px 8px; border-radius:6px; font-size:0.75rem; font-weight:700;">رأس المال: ${Number(comp.capital).toLocaleString()} ج.م</span>` : ''}
                    </div>
                  </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button class="btn-workspace-action btn-workspace-primary" style="background:#2563eb; color:#fff;" onclick="ExcelAdminDashboard.deployCompanyToSimulator('${comp.id}')" title="فتح واختبار هذه الشركة مباشرة في بيئة المحاكي">
                    🚀 تشغيل بالمحاكي
                  </button>
                  <button class="btn-workspace-action" onclick="ExcelAdminDashboard.exportCompanyJson('${comp.id}')" title="تصدير بيانات الشركة وسنداتها كملف JSON">
                    📤 تصدير JSON
                  </button>
                  <input type="file" id="comp_csv_file_${comp.id}" accept=".csv" style="display:none;" onchange="ExcelAdminDashboard.importCompanyTransactionsFromCsv(event, '${comp.id}')">
                  <button class="btn-workspace-action" onclick="document.getElementById('comp_csv_file_${comp.id}').click()" title="رفع ملف اليومية أو السندات (journal.csv)">
                    📥 استيراد CSV
                  </button>
                  <button class="btn-workspace-action" onclick="ExcelAdminDashboard.saveCompanyMeta('${comp.id}')">
                    💾 حفظ
                  </button>
                  <button class="btn-workspace-action" style="color:#ef4444;" onclick="ExcelAdminDashboard.deleteCompany('${comp.id}')">
                    🗑️ حذف
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
                  <h4 style="margin:0; font-size:0.98rem; font-weight:800; color:var(--text-primary);">
                    📑 سندات وفواتير العمليات (${(comp.transactions || []).length} سند مسجل):
                  </h4>
                  <div style="display:flex; gap:8px;">
                    <button class="btn-workspace-action btn-workspace-primary" style="padding:4px 12px; font-size:0.8rem;" onclick="ExcelAdminDashboard.showAddTransactionModal('${comp.id}')">
                      ➕ إضافة سند مالي يدوي
                    </button>
                    ${(comp.transactions || []).length > 10 ? `
                      <button class="btn-workspace-action" style="padding:4px 12px; font-size:0.8rem;" onclick="ExcelAdminDashboard.toggleTransactionsExpand('${comp.id}')" id="btn_expand_${comp.id}">
                        📂 عرض كافة السندات (${(comp.transactions || []).length})
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
                          ${t.difficulty ? `<span style="background:rgba(59, 130, 246, 0.1); color:#2563eb; font-size:0.7rem; font-weight:bold; padding:1px 6px; border-radius:4px;">${t.difficulty}</span>` : ''}
                        </div>
                        <p style="margin:3px 0 4px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${t.desc || ''}</p>
                        <div style="font-size:0.78rem; font-family:'JetBrains Mono',monospace;">
                          ${t.lines && t.lines.length > 0 
                            ? `<span style="color:#059669; font-weight:700;">✓ قيد مزدوج متوازن (${t.lines.length} أطراف)</span>` 
                            : `مدين: <span style="color:#2563eb; font-weight:700;">${t.dr}</span> | دائن: <span style="color:#059669; font-weight:700;">${t.cr}</span>`}
                          | المبلغ: <strong style="color:var(--text-primary);">${(t.amount || 0).toLocaleString()} ج.م</strong>
                        </div>
                      </div>
                      <button class="btn-workspace-action" style="color:#ef4444; padding:4px 10px; font-size:0.8rem;" onclick="ExcelAdminDashboard.deleteCompanyTransaction('${comp.id}', '${t.id}')">
                        🗑️ حذف
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
      btn.innerHTML = `📂 عرض كافة السندات (${comp.transactions.length})`;
      if (moreNotice) moreNotice.style.display = 'block';
      this.switchTab('companies');
    } else {
      btn.setAttribute('data-expanded', 'true');
      btn.innerHTML = `📁 طي السندات (عرض 10 فقط)`;
      if (moreNotice) moreNotice.style.display = 'none';
      container.innerHTML = comp.transactions.map((t, tIdx) => `
        <div style="background:var(--surface-ground); border:1px solid var(--border-subtle); border-radius:8px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="flex:1; min-width:240px;">
            <div style="display:flex; align-items:center; gap:8px;">
              <strong style="font-size:0.9rem; color:var(--text-primary);">سند #${t.num || tIdx + 1} (${t.date || '2026-01-15'}): ${t.title || t.type || 'سند مالي'}</strong>
              ${t.difficulty ? `<span style="background:rgba(59, 130, 246, 0.1); color:#2563eb; font-size:0.7rem; font-weight:bold; padding:1px 6px; border-radius:4px;">${t.difficulty}</span>` : ''}
            </div>
            <p style="margin:3px 0 4px; font-size:0.82rem; color:var(--text-secondary); line-height:1.4;">${t.desc || ''}</p>
            <div style="font-size:0.78rem; font-family:'JetBrains Mono',monospace;">
              ${t.lines && t.lines.length > 0 
                ? `<span style="color:#059669; font-weight:700;">✓ قيد مزدوج متوازن (${t.lines.length} أطراف)</span>` 
                : `مدين: <span style="color:#2563eb; font-weight:700;">${t.dr}</span> | دائن: <span style="color:#059669; font-weight:700;">${t.cr}</span>`}
              | المبلغ: <strong style="color:var(--text-primary);">${(t.amount || 0).toLocaleString()} ج.م</strong>
            </div>
          </div>
          <button class="btn-workspace-action" style="color:#ef4444; padding:4px 10px; font-size:0.8rem;" onclick="ExcelAdminDashboard.deleteCompanyTransaction('${comp.id}', '${t.id}')">
            🗑️ حذف
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
          cancelText: 'إلغاء',
          icon: '🏢'
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
            <span class="modal-icon-badge">🏢</span>
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
              <label>أيقونة الشركة</label>
              <select id="modal_cicon" class="admin-form-input">
                <option value="🏢">🏢 مؤسسة / شركة</option>
                <option value="💡">💡 خدمات وأجهزة</option>
                <option value="⚡">⚡ طاقة وإلكترونيات</option>
                <option value="📦">📦 تجارة وتوزيع</option>
                <option value="🛠️">🛠️ مقاولات وصيانة</option>
                <option value="🏥">🏥 رعاية صحية</option>
                <option value="🍽️">🍽️ أغذية ومطاعم</option>
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
    const name = document.getElementById('modal_cname')?.value.trim();
    if (!name) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى كتابة اسم الشركة أولاً', 'error');
      else alert('يرجى كتابة اسم الشركة أولاً.');
      return;
    }

    const sector = document.getElementById('modal_csector')?.value.trim() || 'نشاط تجاري';
    const capital = parseFloat(document.getElementById('modal_ccapital')?.value) || 2000000;
    const role = document.getElementById('modal_crole')?.value.trim() || 'محاسب مالي';
    const icon = document.getElementById('modal_cicon')?.value || '🏢';
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
    const comp = this.companies.find(c => c.id === compId);
    if (!comp) return;

    let confirmed = false;
    if (typeof AccModal !== 'undefined') {
      confirmed = await AccModal.confirm({
        title: 'حذف الشركة نهائياً',
        message: `هل أنت متأكد من رغبتك في حذف شركة (${comp.name}) وكافة سنداتها المحاسبية؟ لن تتمكن من استرجاعها بعد الحذف.`,
        icon: '🗑️',
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
        } else if (q.solutionSteps && q.solutionSteps.length > 1) {
          desc = q.solutionSteps.slice(0, 2).join(' ');
        } else if (rawLines.length > 0) {
          desc = rawLines[0].description || titleAr;
        } else {
          desc = titleAr;
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
        icon: '💡',
        role: role,
        capital: capital,
        description: `بيئة محاكاة محاسبية متقدمة لـ ${compName} (${sector}) برأس مال قدره ${capital.toLocaleString()} ج.م، تتضمن دورة تدريبية واقعية بـ ${transactions.length} معاملة وسند مالي.`,
        month: year,
        transactions: transactions
      };
    }

    // النمط 2: ملف شركة مباشر (Backup or Single Company export)
    if (json.name && (json.transactions || json.sector)) {
      return {
        id: json.id || `comp-${Date.now()}`,
        name: json.name,
        sector: json.sector || 'قطاع عام',
        badge: json.badge || 'نشاط تجاري',
        icon: json.icon || '🏢',
        role: json.role || 'محاسب مالي',
        capital: json.capital || 1000000,
        description: json.description || `شركة ${json.name}`,
        month: json.month || 'السنة المالية 2026',
        transactions: Array.isArray(json.transactions) ? json.transactions : []
      };
    }

    throw new Error('صيغة ملف التدريب غير متوافقة.');
  },

  async addOrUpdateCompany(comp) {
    const existingIndex = this.companies.findIndex(c => c.id === comp.id || c.name === comp.name);
    if (existingIndex >= 0) {
      let confirmed = false;
      if (typeof AccModal !== 'undefined') {
        confirmed = await AccModal.confirm({
          title: 'تحديث بيانات الشركة',
          message: `شركة (${comp.name}) موجودة بالفعل في المنظومة. هل ترغب في تحديث بياناتها واستبدال سنداتها بـ (${comp.transactions.length}) سند مالي؟`,
          icon: '🔄',
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
              title: `🎉 تم استيراد (${targetCompany.name}) بنجاح!`,
              message: `تم استيراد وتجهيز ${targetCompany.transactions?.length || 0} سند مالي وربطها بالمحاكي مباشرة. هل ترغب في فتح دفاتر المحاكي الآن لبدء تسجيل القيود؟`,
              confirmText: '🚀 فتح المحاكي مباشرة',
              cancelText: 'البقاء في لوحة الإدارة',
              icon: '🏢'
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
      <div class="modal-sheet" style="max-width: 520px; width: 92%;">
        <span class="sheet-drag-handle"></span>
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="modal-icon-badge">📑</span>
            <div>
              <h3 class="modal-title">إضافة سند مالي للشركة</h3>
              <p style="margin: 2px 0 0; font-size: 0.8rem; color: var(--text-muted);">${comp.name}</p>
            </div>
          </div>
          <button class="modal-close-btn" id="closeTxModalBtn">✕</button>
        </div>

        <div style="padding: 12px 0; display: flex; flex-direction: column; gap: 14px;">
          <div class="admin-form-group">
            <label>عنوان السند المالي أو العملية *</label>
            <input type="text" id="tx_modal_title" class="admin-form-input" placeholder="مثال: فاتورة مشتريات بضاعة نقدية" required>
          </div>

          <div class="admin-form-group">
            <label>بيان وتفاصيل العملية</label>
            <textarea id="tx_modal_desc" class="admin-form-textarea" rows="2" placeholder="بيان تفصيلي للسند المحاسبي المرفق"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>المبلغ الإجمالي (ج.م) *</label>
              <input type="number" id="tx_modal_amount" class="admin-form-input" value="15000">
            </div>
            <div class="admin-form-group">
              <label>التاريخ المالي</label>
              <input type="text" id="tx_modal_date" class="admin-form-input" value="2026-01-15">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div class="admin-form-group">
              <label>معرّف الحساب المدين (من حـ/)</label>
              <input type="text" id="tx_modal_dr" class="admin-form-input" value="inventory" placeholder="مثال: inventory أو cash">
            </div>
            <div class="admin-form-group">
              <label>معرّف الحساب الدائن (إلى حـ/)</label>
              <input type="text" id="tx_modal_cr" class="admin-form-input" value="cash" placeholder="مثال: cash أو ap">
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button class="btn-workspace-action" id="cancelTxModalBtn">إلغاء</button>
            <button class="btn-workspace-action btn-workspace-primary" id="saveTxModalBtn">✓ إضافة السند</button>
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

    overlay.querySelector('#closeTxModalBtn').onclick = closeTxModal;
    overlay.querySelector('#cancelTxModalBtn').onclick = closeTxModal;
    overlay.querySelector('#saveTxModalBtn').onclick = () => {
      const title = overlay.querySelector('#tx_modal_title').value.trim();
      if (!title) {
        if (typeof AccModal !== 'undefined') AccModal.toast('يرجى كتابة عنوان السند المالي', 'error');
        return;
      }
      const desc = overlay.querySelector('#tx_modal_desc').value.trim() || title;
      const amount = parseFloat(overlay.querySelector('#tx_modal_amount').value) || 0;
      const date = overlay.querySelector('#tx_modal_date').value.trim() || '2026-01-15';
      const dr = overlay.querySelector('#tx_modal_dr').value.trim() || 'cash';
      const cr = overlay.querySelector('#tx_modal_cr').value.trim() || 'sales_rev';

      if (!comp.transactions) comp.transactions = [];
      comp.transactions.push({
        id: "tx-" + Date.now(),
        num: comp.transactions.length + 1,
        title,
        desc,
        amount,
        date,
        dr,
        cr
      });

      ExcelAdminDashboard.saveState('companies');
      closeTxModal();
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تمت إضافة السند المالي بنجاح!', 'success');
      ExcelAdminDashboard.switchTab('companies');
    };
  },

  async deleteCompanyTransaction(compId, txId) {
    const comp = this.companies.find(c => c.id === compId);
    if (!comp || !comp.transactions) return;

    let confirmed = false;
    if (typeof AccModal !== 'undefined') {
      confirmed = await AccModal.confirm({
        title: 'حذف السند المالي',
        message: 'هل أنت متأكد من رغبتك في حذف هذا السند المالي من سجل الشركة؟',
        icon: '🗑️',
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
      if (typeof AccModal !== 'undefined') AccModal.toast(`🎉 تم استيراد ${newTxList.length} عملية وربطها بالشركة بنجاح!`, 'success');
      else alert(`🎉 تم بنجاح استيراد ${newTxList.length} عملية وربطها بالشركة! بمجرد دخول الطالب على الشركة سيتم تحويله للمحاكي مباشرة.`);
      this.switchTab('companies');
    };
    reader.readAsText(file, "UTF-8");
  },

  // 3. تبويب الباقات والتسعير (Plans & Pricing)
  renderPlansTab() {
    if (this.editingPlanId) {
      return this.renderPlanEditor(this.editingPlanId);
    }

    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900;">💳 إدارة باقات الاشتراك وتخصيص الصلاحيات</h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">التحكم بأسعار ومدة الباقات والدروس المتاحة وصلاحيات الأقسام المتقدمة</p>
        </div>
        <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.addNewPlan()">
          ➕ إضافة باقة جديدة
        </button>
      </div>

      <div class="plans-grid-cards">
        ${this.plans.map(plan => `
          <div class="plan-admin-card" style="border-top: 4px solid ${plan.color || '#10b981'};">
            <div>
              <div class="plan-card-header">
                <span class="plan-icon-symbol">${plan.icon || '📦'}</span>
                <span class="badge" style="background:${plan.color}22; color:${plan.color}; font-weight:bold; padding:4px 10px; border-radius:9999px; font-size:0.75rem;">
                  ${plan.badge || 'باقة'}
                </span>
              </div>

              <h3 class="plan-title-h3">${plan.name}</h3>
              <div class="plan-price-tag">
                ${plan.price === 0 ? 'مجاناً' : `${plan.price} ج.م`}
                <span style="font-size:0.85rem; color:var(--text-muted); font-weight:normal;"> / ${plan.period}</span>
              </div>

              <div class="plan-rules-box" style="border-right: 3px solid ${plan.color || '#10b981'};">
                <strong style="display:block; margin-bottom:8px; color:var(--text-primary);">📌 حدود وصلاحيات الأقسام:</strong>
                <div class="rule-row">
                  <span>الدروس المسموحة:</span>
                  <strong>${plan.maxLessons >= 999 ? 'جميع الدروس (♾️)' : `${plan.maxLessons} دروس`}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكاة الشركات:</span>
                  <strong>${plan.maxCompanies >= 999 ? 'جميع الشركات' : `${plan.maxCompanies} شركة`}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكي مراجعة الشركات:</span>
                  <strong style="color:${plan.allowAudit ? '#10b981' : '#ef4444'};">${plan.allowAudit ? '🟢 مفعل' : '🔴 مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>إكسل الدورة المحاسبية:</span>
                  <strong style="color:${plan.allowExcelCycle ? '#10b981' : '#ef4444'};">${plan.allowExcelCycle ? '🟢 مفعل' : '🔴 مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>محاكي مقابلات التوظيف:</span>
                  <strong style="color:${plan.allowInterviewSim ? '#10b981' : '#ef4444'};">${plan.allowInterviewSim ? '🟢 مفعل' : '🔴 مغلق'}</strong>
                </div>
                <div class="rule-row">
                  <span>مشاركة المحفظة على LinkedIn:</span>
                  <strong style="color:${plan.allowLinkedInShare ? '#10b981' : '#ef4444'};">${plan.allowLinkedInShare ? '🟢 مفعل' : '🔴 مغلق'}</strong>
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
              <button class="btn-workspace-action" style="flex:1;" onclick="ExcelAdminDashboard.openPlanEditor('${plan.id}')">
                ⚙️ تعديل وتخصيص الباقة
              </button>
              ${plan.id !== 'free' ? `
                <button class="btn-workspace-action" style="color:#ef4444;" onclick="ExcelAdminDashboard.deletePlan('${plan.id}')" title="حذف الباقة">
                  🗑️
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
            <span style="font-size:2.2rem; background:${plan.color}22; padding:6px 14px; border-radius:12px;">${plan.icon || '📦'}</span>
            <div>
              <h2 style="margin:0; font-size:1.3rem;">تعديل وتخصيص باقة: <strong style="color:#10b981;">${plan.name}</strong></h2>
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
            <h4 class="editor-section-title" style="color:#10b981;">💳 ١. بيانات الباقة والتسعير</h4>
            
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
                <label>مدة الاشتراك:</label>
                <input type="text" id="pe_period" class="admin-form-input" value="${plan.period}">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div class="admin-form-group">
                <label>الوسام الترويجي:</label>
                <input type="text" id="pe_badge" class="admin-form-input" value="${plan.badge || ''}">
              </div>
              <div class="admin-form-group">
                <label>الأيقونة واللون:</label>
                <div style="display:flex; gap:6px;">
                  <input type="text" id="pe_icon" class="admin-form-input" style="width:60px; text-align:center;" value="${plan.icon || '📦'}">
                  <input type="color" id="pe_color" class="admin-form-input" style="width:60px; padding:2px; height:42px;" value="${plan.color || '#10b981'}">
                </div>
              </div>
            </div>
          </div>

          <!-- حدود المحتوى والصلاحيات -->
          <div class="editor-section-box">
            <h4 class="editor-section-title" style="color:#3b82f6;">📊 ٢. حدود الدروس والمحتوى المسموح</h4>
            
            <div class="admin-form-group">
              <label>الحد الأقصى للدروس المتاحة:</label>
              <div style="display:flex; gap:8px;">
                <input type="number" id="pe_max_lessons" class="admin-form-input" value="${plan.maxLessons}">
                <button type="button" class="btn-workspace-action" onclick="document.getElementById('pe_max_lessons').value = 999">فتح الكل ♾️</button>
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
          </div>
        </div>

        <!-- مفاتيح الصلاحيات والمحاكيات -->
        <div class="editor-section-box" style="margin-bottom:20px;">
          <h4 class="editor-section-title" style="color:#8b5cf6;">🎛️ ٣. مفاتيح تفعيل وتعطيل المحاكيات والأقسام</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_audit" ${plan.allowAudit ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">🔍 محاكي مراجعة الشركات</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">فحص المستندات وقيود التسوية AJEs</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_excel" ${plan.allowExcelCycle ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">📊 إكسل الدورة المحاسبية</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">محاكي جداول Excel Suite المالي</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_interview" ${plan.allowInterviewSim ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">💼 محاكي مقابلات التوظيف</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">بنك المقابلات والأسئلة الفنية</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_passport" ${plan.allowSkillsPassport ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">📜 جواز الكفاءة والشهادات</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">إصدار الشهادات والتوثيق برمز QR</span>
              </div>
            </label>

            <label style="display:flex; align-items:center; gap:10px; background:var(--surface-card); padding:12px; border-radius:8px; border:1px solid var(--border-subtle); cursor:pointer;">
              <input type="checkbox" id="pe_allow_linkedin" ${plan.allowLinkedInShare ? 'checked' : ''} style="width:18px; height:18px;">
              <div>
                <strong style="display:block; font-size:0.88rem;">💼 مشاركة الاعتماد على LinkedIn</strong>
                <span style="font-size:0.76rem; color:var(--text-muted);">تمكين الطالب من مشاركة محفظته الموثقة على لينكد إن</span>
              </div>
            </label>
          </div>
        </div>

        <div style="display:flex; gap:10px; justify-content:flex-end;">
          <button class="btn-workspace-action" onclick="ExcelAdminDashboard.closePlanEditor()">إلغاء ✕</button>
          <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.savePlanEditor('${plan.id}')">💾 حفظ كافة التعديلات</button>
        </div>
      </div>
    `;
  },

  openPlanEditor(planId) {
    this.editingPlanId = planId;
    this.switchTab('plans');
  },

  closePlanEditor() {
    this.editingPlanId = null;
    this.switchTab('plans');
  },

  savePlanEditor(planId) {
    const plan = this.plans.find(p => p.id === planId);
    if (!plan) return;

    plan.name = document.getElementById('pe_name')?.value.trim() || plan.name;
    plan.price = parseFloat(document.getElementById('pe_price')?.value) || 0;
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

    this.saveState('plans');
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم حفظ تعديلات باقة (${plan.name}) بنجاح!`, 'success');
    else alert(`✓ تم حفظ تعديلات وصلاحيات باقة (${plan.name}) بنجاح!`);
    this.closePlanEditor();
  },

  async addNewPlan() {
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
    this.plans.push({
      id: newId,
      name,
      price: 199,
      period: 'شهر واحد',
      badge: 'جديد',
      icon: '⭐',
      color: '#10b981',
      maxLessons: 6,
      maxCompanies: 2,
      maxExercises: 10,
      allowAudit: false,
      allowExcelCycle: false,
      allowInterviewSim: false,
      allowSkillsPassport: true,
      allowLinkedInShare: false,
      features: ['صلاحيات مخصصة للطلاب']
    });
    this.saveState('plans');
    if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم إنشاء باقة (${name}) بنجاح!`, 'success');
    this.openPlanEditor(newId);
  },

  async deletePlan(planId) {
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
      this.plans = this.plans.filter(p => p.id !== planId);
      this.saveState('plans');
      if (typeof AccModal !== 'undefined') AccModal.toast('✓ تم حذف الباقة بنجاح', 'info');
      this.switchTab('plans');
    }
  },

  // 3. تبويب أكواد الخصم والتفعيل (Coupons & Promos)
  renderCouponsTab() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="margin:0; font-size:1.3rem; font-weight:900;">🎟️ أكواد الخصم وبطاقات التفعيل</h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">توليد كوبونات ترويجية وبطاقات تفعيل مجانية 100% للطلاب</p>
        </div>
        <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.toggleNewCouponBox()">
          ➕ إنشاء كود خصم جديد
        </button>
      </div>

      <!-- نموذج إنشاء كود جديد -->
      <div id="newCouponContainer" style="display:none; margin-bottom:24px;">
        <div class="admin-editor-card" style="border-color:#10b981;">
          <h3 style="margin-top:0; font-size:1.15rem; color:#10b981;">✨ إنشاء كود خصم / تفعيل جديد</h3>
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
                <td><code style="font-size:1rem; font-weight:800; color:#10b981;">${c.code}</code></td>
                <td>${c.discountType === 'FREE_PASS' ? '🎁 تفعيل مجاني 100%' : (c.discountType === 'PERCENTAGE' ? 'نسبة مئوية' : 'مبلغ ثابت')}</td>
                <td><strong>${c.discountValue}${c.discountType === 'PERCENTAGE' ? '%' : ' ج.م'}</strong></td>
                <td><span class="badge" style="background:#eff6ff; color:#2563eb; padding:2px 8px; border-radius:6px; font-weight:700;">${c.targetPlan.toUpperCase()}</span></td>
                <td>${c.usedCount || 0} / ${c.maxUses || '∞'}</td>
                <td>
                  <span style="color:${c.isActive ? '#10b981' : '#ef4444'}; font-weight:800;">
                    ${c.isActive ? '✓ نشط' : '✕ معطل'}
                  </span>
                </td>
                <td>
                  <button class="btn-workspace-action" style="padding:4px 10px; font-size:0.78rem;" onclick="ExcelAdminDashboard.toggleCouponStatus('${c.code}')">
                    ${c.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                  <button class="btn-workspace-action" style="padding:4px 8px; color:#ef4444;" onclick="ExcelAdminDashboard.deleteCoupon('${c.code}')">
                    🗑️
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
    const code = document.getElementById('cpn_code')?.value.trim().toUpperCase();
    const type = document.getElementById('cpn_type')?.value;
    const val = parseFloat(document.getElementById('cpn_val')?.value) || 0;
    const target = document.getElementById('cpn_target')?.value;

    if (!code) {
      if (typeof AccModal !== 'undefined') AccModal.toast('يرجى إدخال رمز الكوبون أولاً', 'error');
      else alert('⚠️ يرجى إدخال رمز الكوبون أولاً.');
      return;
    }

    if (this.coupons.some(c => c.code === code)) {
      if (typeof AccModal !== 'undefined') AccModal.toast('هذا الكود موجود بالفعل!', 'error');
      else alert('⚠️ هذا الكود موجود بالفعل!');
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
    const cpn = this.coupons.find(c => c.code === code);
    if (cpn) {
      cpn.isActive = !cpn.isActive;
      this.saveState('coupons');
      this.switchTab('coupons');
    }
  },

  async deleteCoupon(code) {
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
          <h2 style="margin:0; font-size:1.3rem; font-weight:900;">👥 دليل المستخدمين وإدارة الصلاحيات</h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">ترقية باقات الطلاب، تغيير صلاحيات المدرسين، وإدارة الحسابات</p>
        </div>
        <input 
          type="text" 
          class="admin-form-input" 
          placeholder="🔍 بحث باسم الطالب أو المعرف..." 
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
          👨‍🎓 الطلاب (${users.filter(u => u.role === 'student').length})
        </button>
        <button class="btn-workspace-action ${this.userRoleFilter === 'teacher' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('teacher')">
          👨‍🏫 المدرسون (${users.filter(u => u.role === 'teacher').length})
        </button>
        <button class="btn-workspace-action ${this.userRoleFilter === 'admin' ? 'btn-workspace-primary' : ''}" onclick="ExcelAdminDashboard.setUserRoleFilter('admin')">
          🛡️ المسؤولون (${users.filter(u => u.role === 'admin').length})
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
              <th>تاريخ التسجيل</th>
              <th>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr>
                <td colspan="5" style="text-align:center; padding:32px; color:var(--text-muted);">
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
                    <option value="student" ${u.role === 'student' ? 'selected' : ''}>👨‍🎓 طالب (Student)</option>
                    <option value="teacher" ${u.role === 'teacher' ? 'selected' : ''}>👨‍🏫 مدرس (Teacher)</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>🛡️ مسؤول (Admin)</option>
                  </select>
                </td>
                <td>
                  <select class="admin-form-select" style="padding:4px 8px; font-size:0.82rem; min-width:130px;" onchange="ExcelAdminDashboard.changeUserPlan('${u.id}', this.value)">
                    <option value="free" ${u.plan === 'free' ? 'selected' : ''}>مجانية (Free)</option>
                    <option value="pro" ${u.plan === 'pro' ? 'selected' : ''}>محترف (Pro)</option>
                    <option value="vip" ${u.plan === 'vip' ? 'selected' : ''}>خبير (VIP Master)</option>
                  </select>
                </td>
                <td style="font-size:0.82rem; color:var(--text-muted);">${u.joinDate || '01 يناير 2026'}</td>
                <td>
                  <button class="btn-workspace-action" style="padding:4px 8px; color:#ef4444;" onclick="ExcelAdminDashboard.deleteUser('${u.id}')" title="حذف الحساب">
                    🗑️
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
    let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
    const user = users.find(u => u.id === userId);
    if (user) {
      user.plan = newPlan;
      localStorage.setItem('jr_users', JSON.stringify(users));
      if (typeof AccModal !== 'undefined') AccModal.toast(`✓ تم ترقية باقة (${user.name}) إلى [${newPlan.toUpperCase()}] بنجاح!`, 'success');
      else alert(`✓ تم ترقية باقة (${user.name}) إلى [${newPlan.toUpperCase()}] بنجاح!`);
    }
  },

  async deleteUser(userId) {
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
          <h2 style="margin:0; font-size:1.3rem; font-weight:900;">🔍 إدارة شركات المراجعة والتدقيق المالي</h2>
          <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">إعداد عينات الفحص وتحديد الأخطاء والمخالفات وتصدير نماذج Excel للتدقيق</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn-workspace-action" onclick="ExcelAdminDashboard.downloadAuditCsvTemplate()">
            📊 نموذج Excel للمراجعة
          </button>
          <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.showAddAuditSampleModal()">
            ➕ إضافة عينة فحص
          </button>
        </div>
      </div>

      <!-- بطاقة الشركة المختارة -->
      <div class="admin-editor-card" style="margin-bottom:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:2rem;">${comp.logo || '🏢'}</span>
            <div>
              <h3 style="margin:0; font-size:1.2rem;">${comp.companyName}</h3>
              <span style="font-size:0.8rem; color:var(--text-muted);">القطاع: ${comp.sector} | حد الأهمية النسبية: <strong>${(comp.materialityThreshold || 0).toLocaleString()} ج.م</strong></span>
            </div>
          </div>
          <span class="badge" style="background:#eff6ff; color:#2563eb; padding:4px 12px; border-radius:9999px; font-weight:800; font-size:0.8rem;">
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
                      <div>من: <span style="color:#2563eb; font-weight:700;">${s.recordedEntry.dr}</span></div>
                      <div>إلى: <span style="color:#059669; font-weight:700;">${s.recordedEntry.cr}</span></div>
                      <div style="font-family:'JetBrains Mono',monospace;">المبلغ: ${s.recordedEntry.amount.toLocaleString()} ج.م</div>
                    </div>
                  </td>
                  <td>
                    <div style="font-size:0.8rem;">
                      <div>${s.document.type} (${s.document.no})</div>
                      <div style="font-weight:700; color:#2563eb;">${s.document.amount.toLocaleString()} ج.م</div>
                    </div>
                  </td>
                  <td>
                    <span style="display:inline-block; padding:3px 10px; border-radius:9999px; font-size:0.75rem; font-weight:800; background:${s.isError ? '#fef2f2' : '#ecfdf5'}; color:${s.isError ? '#dc2626' : '#059669'};">
                      ${s.isError ? '⚠️ مخالفة' : '✓ سليمة'}
                    </span>
                  </td>
                  <td>
                    <span style="font-size:0.82rem; color:${s.isError ? '#dc2626' : '#059669'}; font-weight:700;">${s.errorCategory}</span>
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
        confirmText: 'نعم، عينة مخالفة ⚠️',
        cancelText: 'لا، عملية سليمة 100% ✓',
        icon: '🔍'
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
        <h2 style="margin:0; font-size:1.3rem; font-weight:900;">⚙️ مفاتيح المنظومة والنسخ الاحتياطي</h2>
        <p style="margin:4px 0 0; color:var(--text-muted); font-size:0.88rem;">التحكم بالميزات المفعلة في المنصة، والنسخ الاحتياطي الشامل للبيانات</p>
      </div>

      <!-- مفاتيح التشغيل العامة -->
      <div class="admin-editor-card" style="margin-bottom:24px;">
        <h3 style="margin-top:0; font-size:1.15rem; color:#10b981; margin-bottom:16px;">🛡️ مفاتيح التشغيل العامة (Feature Toggles):</h3>
        
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
        <h3 style="margin-top:0; font-size:1.15rem; color:#3b82f6; margin-bottom:10px;">💾 النسخ الاحتياطي الشامل للمنصة (JSON Backup)</h3>
        <p style="font-size:0.88rem; color:var(--text-secondary); margin-bottom:18px; line-height:1.6;">
          تصدير كافة إعدادات المنصة والباقات والكوبونات وسجلات القيود كملف JSON مستقل، أو استرجاع نسخة سابقة في ثوانٍ.
        </p>

        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <button class="btn-workspace-action btn-workspace-primary" onclick="ExcelAdminDashboard.exportBackupJson()">
            📥 تصدير النسخة الاحتياطية (JSON)
          </button>
          
          <input type="file" id="importJsonInput" accept=".json" style="display:none;" onchange="ExcelAdminDashboard.handleImportJson(event)">
          <button class="btn-workspace-action" onclick="document.getElementById('importJsonInput').click()">
            📤 استيراد نسخة احتياطية
          </button>

          <button class="btn-workspace-action" style="color:#ef4444;" onclick="ExcelAdminDashboard.resetPlatformData()">
            🔄 استعادة ضبط المصنع
          </button>
        </div>
      </div>
    `;
  },

  togglePlanGating() {
    this.systemConfig.enforcePlanGating = !this.systemConfig.enforcePlanGating;
    this.saveState('config');
    const msg = this.systemConfig.enforcePlanGating ? '✓ تم تفعيل قيود الباقات وإلزام الترقية.' : '✓ تم فتح المنصة بالكامل (Open Access Demo).';
    if (typeof AccModal !== 'undefined') AccModal.toast(msg, 'info');
    else alert(msg);
    this.switchTab(this.activeTab);
  },

  updateConfig(key, val) {
    this.systemConfig[key] = val;
    this.saveState('config');
  },

  exportBackupJson() {
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
        if (typeof AccModal !== 'undefined') AccModal.toast('🎉 تم استيراد وتحديث كافة بيانات المنصة بنجاح!', 'success');
        else alert('🎉 تم استيراد وتحديث كافة بيانات المنصة بنجاح!');
        this.switchTab('overview');
      } catch (err) {
        if (typeof AccModal !== 'undefined') AccModal.toast('❌ فشل قراءة ملف النسخة الاحتياطية. تأكد من صحة الملف.', 'error');
        else alert('❌ فشل قراءة ملف النسخة الاحتياطية. تأكد من صحة الملف.');
      }
    };
    reader.readAsText(file);
  },

  async resetPlatformData() {
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'استعادة ضبط المصنع',
        message: '⚠️ تحذير: هل أنت متأكد من رغبتك في استعادة ضبط المصنع وتصفير كافة التعديلات والبيانات؟',
        confirmText: 'نعم، استعادة ضبط المصنع',
        cancelText: 'إلغاء',
        danger: true,
        icon: '⚠️'
      });
    } else {
      conf = confirm('⚠️ تحذير: هل أنت متأكد من رغبتك في استعادة ضبط المصنع وتصفير كافة التعديلات؟');
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


