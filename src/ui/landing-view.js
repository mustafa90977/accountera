/**
 * landing-view.js — واجهة صفحة الهبوط الحديثة المدمجة مع القائمة الجانبية
 * متوافقة 100% مع فلسفة التصميم والنظام اللوني المركزي لمنصة Accountera
 * Pure Responsive Semantic Component (Mobile-First)
 */

const ExcelLandingView = {
  isSidebarCollapsed() {
    try {
      return (typeof localStorage !== 'undefined') && localStorage.getItem('acc_landing_sb_collapsed') === '1';
    } catch (e) {
      return false;
    }
  },

  render() {
    const isCollapsed = this.isSidebarCollapsed();
    const collapsedClass = isCollapsed ? ' collapsed' : '';
    const wrapperCollapsedClass = isCollapsed ? ' sidebar-collapsed' : '';
    const chevronIcon = isCollapsed
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

    const plans = (typeof SupabaseService !== 'undefined' && SupabaseService.getCachedActivePlans)
      ? SupabaseService.getCachedActivePlans()
      : ((typeof window !== 'undefined' && window.DEFAULT_ADMIN_PLANS) ? window.DEFAULT_ADMIN_PLANS : []);
    const proPlan = plans.find(p => p.id === 'pro') || { price: 299, period: '30 يوم' };
    const vipPlan = plans.find(p => p.id === 'vip') || { price: 599, period: 'سنة كاملة' };

    return `
      <div class="landing-shell grid-pattern-bg">
        <!-- هالة ضوئية خلفية جمالية -->
        <div class="ambient-glow-blob"></div>

        <!-- =========================================================
             1. الشريط الجانبي الأيمن الثابت (Right Sidebar Navigation)
             ========================================================= -->
        <aside class="landing-sidebar${collapsedClass}" id="landingSidebar">
          <!-- الهوية والشعار وزر الطي -->
          <div class="landing-sidebar-header" style="display:flex; align-items:center; justify-content:space-between; width:100%;">
            <a class="landing-brand-link" href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="ACCOUNTERA">
              <div class="landing-brand-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
                  <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
                  <path d="M7 21h10"/>
                  <path d="M12 3v18"/>
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
                </svg>
              </div>
              <div class="landing-brand-text-wrap" style="display:flex; flex-direction:column;">
                <div style="display:flex; align-items:center;">
                  <span class="landing-brand-title font-num">ACCOUNTERA</span>
                  <span class="landing-brand-badge">PRO</span>
                </div>
                <span class="landing-brand-sub">مِنَصّة المُحَاسِب المُبتَدئ التَّفَاعُلِيّة</span>
              </div>
            </a>
            <button class="landing-sidebar-collapse-btn" onclick="toggleLandingSidebar()" title="طي / توسيع القائمة الجانبية">
              <span id="landingSidebarToggleIcon">${chevronIcon}</span>
            </button>
          </div>

          <!-- قائمة الروابط والشاشات -->
          <div class="landing-sidebar-menu">
            <div class="landing-sidebar-group-title">لوحة التحكم والتنقل</div>
            <nav style="display:flex; flex-direction:column;">
              <!-- الرئيسية -->
              <a class="landing-nav-item active" href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="الرئيسية">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </span>
                  <span>الرئيسية</span>
                </div>
                <span style="width:6px; height:6px; border-radius:50%; background:var(--primary, #10b981);"></span>
              </a>

              <!-- لوحة التدريب -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="navigateToScreen('student-dashboard')" title="لوحة التدريب والمتابعة">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 16v-4"/><path d="M12 16v-8"/><path d="M17 16v-6"/></svg>
                  </span>
                  <span>لوحة التدريب</span>
                </div>
                <span style="font-size:10px; color:var(--text-muted);">&larr;</span>
              </a>

              <!-- محاكاة الشركات -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="navigateToScreen('companies-hub')" title="محاكاة الشركات وبيئة العمل">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
                  </span>
                  <span>محاكاة الشركات</span>
                </div>
                <span class="landing-nav-badge badge-amber">واقعي</span>
              </a>

              <!-- مسار الإتقان -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="navigateToScreen('documentary-cycle')" title="أكاديمية المحاسبة والمنهج الكامل (38 درساً)">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 3 3 5 6 5s6-2 6-5v-5"/></svg>
                  </span>
                  <span>مسار الإتقان</span>
                </div>
                <span class="landing-nav-badge" style="background:var(--surface-muted); color:var(--text-secondary);">6 مراحل</span>
              </a>

              <!-- أسعار التدريب -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="document.getElementById('pricingSection')?.scrollIntoView({behavior:'smooth'})" title="باقات وأسعار التدريب">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                  </span>
                  <span>أسعار التدريب</span>
                </div>
                <span class="landing-nav-badge badge-green">%30-</span>
              </a>

              <!-- بنك التدريبات -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="navigateToScreen('ex-1')" title="بنك التدريبات والاختبارات الفنية">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  </span>
                  <span>بنك التدريبات</span>
                </div>
                <span class="landing-nav-badge badge-green">جديد</span>
              </a>

              <!-- الأسئلة الشائعة -->
              <a class="landing-nav-item" href="javascript:void(0)" onclick="document.getElementById('faqSection')?.scrollIntoView({behavior:'smooth'})" title="الأسئلة المتكررة">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </span>
                  <span>الأسئلة المتكررة</span>
                </div>
              </a>

              <!-- الدعم الفني -->
              <a class="landing-nav-item" href="https://wa.me/201000000000" target="_blank" rel="noopener" title="الدعم الفني المباشر عبر واتساب">
                <div style="display:flex; align-items:center; gap:0.65rem;">
                  <span class="landing-nav-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  </span>
                  <span>الدعم الفني المباشر</span>
                </div>
                <span style="font-size:10px; font-weight:700; color:#10b981;">متاح</span>
              </a>
            </nav>
          </div>

          <!-- بطاقة العرض والزر السفلي -->
          <div class="landing-sidebar-footer">
            <div class="sidebar-promo-card">
              <span class="sidebar-promo-badge">عرض حصري</span>
              <div class="sidebar-promo-title">خصم صيفي 30% للمتدربين</div>
              <div class="sidebar-promo-sub font-num">متبقي 48 ساعة فقط</div>
            </div>

            <button class="btn-sidebar-cta" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('register') : navigateToScreen('welcome')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
              <span>ابدأ الآن مجاناً</span>
            </button>

            <div class="sidebar-user-strip">
              <a class="sidebar-user-login" href="javascript:void(0)" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('login') : navigateToScreen('welcome')">
                <div style="width:28px; height:28px; border-radius:6px; background:var(--surface-card); border:1px solid var(--border-subtle); display:flex; align-items:center; justify-content:center;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div style="display:flex; flex-direction:column; text-align:right;">
                  <span style="line-height:1.2;">تسجيل الدخول</span>
                  <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">حساب متدرب</span>
                </div>
              </a>
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener" style="color:#10b981; padding:4px;" title="تواصل عبر واتساب">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>
        </aside>

        <!-- =========================================================
             2. الحاوية الرئيسية للمحتوى (Main Content Wrapper)
             ========================================================= -->
        <div class="landing-main-wrapper${wrapperCollapsedClass}">
          <!-- شريط الإعلان العلوي -->
          <div class="landing-announcement-bar">
            <div class="announcement-inner">
              <div style="display:flex; align-items:center; gap:0.5rem;">
                <span class="announcement-tag">خصم التدريب الصيفي %30</span>
                <span class="announcement-text-long" style="color:#cbd5e1;">متاح لفترة محدودة لجميع طلبة كليات التجارة والمحاسبين المبتدئين</span>
              </div>
              <div class="announcement-support-link" style="display:flex; align-items:center; gap:0.5rem; color:#cbd5e1; font-size:0.78rem;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <span>دعم المتدربين المباشر</span>
              </div>
            </div>
          </div>

          <!-- الهيدر الأنيق المتجاوب -->
          <header class="landing-header">
            <div class="landing-header-inner">
              <div style="display:flex; align-items:center; gap:0.5rem; min-width:0;">
                <!-- زر القائمة الجانبية المتجاوبة للموبايل -->
                <button class="btn-mobile-hamburger" onclick="window.toggleMobileDrawer()" aria-label="فتح القائمة الرئيسية" title="القائمة الرئيسية">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>

                <!-- شعار وهوية المنصة في الموبايل -->
                <div class="header-mobile-brand" onclick="window.scrollTo({top:0, behavior:'smooth'})" title="ACCOUNTERA">
                  <div style="width:32px; height:32px; border-radius:8px; background:linear-gradient(135deg, #047857, #10b981); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(16, 185, 129, 0.3); flex-shrink:0;">
                    <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="8" fill="transparent"/>
                      <path d="M12 28V15C12 13.8954 12.8954 13 14 13C15.1046 13 16 13.8954 16 15V28" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M24 28V15C24 13.8954 24.8954 13 26 13C27.1046 13 28 13.8954 28 15V28" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
                      <path d="M14 20H26" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
                      <circle cx="20" cy="11" r="3" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <span class="header-mobile-brand-name" style="font-weight:900; font-size:1.05rem; color:var(--text-primary); letter-spacing:0.5px; font-family:'JetBrains Mono', sans-serif;">ACCOUNTERA</span>
                </div>
              </div>

              <!-- مسار التنقل التوضيحي (للشاشات الكبيرة فقط) -->
              <div class="header-breadcrumbs">
                <span style="color:var(--text-muted);">المنصة التعليمية</span>
                <span style="font-size:10px; color:var(--text-muted);">&larr;</span>
                <span style="color:var(--text-primary); font-weight:800;">بيئة المحاكاة المحاسبية المتكاملة</span>
                <span class="header-badge-ifrs font-num">EAS / IFRS 2026</span>
              </div>

              <!-- الإجراءات السريعة في الهيدر -->
              <div class="header-actions">
                <div class="btn-qr-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  <span>شهادة كفاءة معتمدة بـ QR</span>
                </div>

                <!-- زر تبديل الثيم ليلي / نهاري -->
                <button onclick="toggleTheme()" class="btn-header-login" style="padding:0.45rem; border-radius:50%; min-width:32px; height:32px; display:flex; align-items:center; justify-content:center;" title="تبديل الوضع الليلي / النهاري">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                </button>

                <button class="btn-header-login" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('login') : navigateToScreen('welcome')">
                  <span>دخول</span>
                </button>

                <button class="btn-header-cta" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('register') : navigateToScreen('welcome')">
                  <span>ابدأ مجاناً</span>
                </button>
              </div>
            </div>
          </header>

          <!-- =========================================================
               3. قسم الهيرو الرئيسي (Hero Section)
               ========================================================= -->
          <section class="hero-content-wrapper" id="home">
            <div class="hero-text-center">
              <div class="hero-live-badge">
                <span style="width:8px; height:8px; border-radius:50%; background:#10b981; box-shadow:0 0 8px #10b981;"></span>
                <span>أول منصة تفاعلية لتدريب المحاسبين على سيناريوهات عمل حقيقية</span>
              </div>

              <h1 class="hero-title-gradient">
                تعلّم المحاسبة كما تُمارَس في <span>كبرى الشركات</span>
              </h1>

              <p class="hero-subtitle-lead">
                انتقل من مجرد حفظ القيود النظرية الجافة إلى إتقان تحليل العمليات المالية، القيد المزدوج، وإعداد موازين المراجعة والقوائم الختامية وفق معايير المحاسبة المصرية والدولية <strong style="color:var(--text-primary); font-family:'JetBrains Mono';">(EAS / IFRS)</strong>.
              </p>

              <div class="hero-cta-group">
                <button class="btn-hero-primary" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('register') : navigateToScreen('welcome')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <span>سجّل الآن مجاناً</span>
                </button>
                <button class="btn-hero-secondary" onclick="navigateToScreen('companies-hub')">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span>استكشف المنصة بالمحاكاة الحية</span>
                </button>
              </div>
            </div>

            <!-- =========================================================
                 4. لوحة محاكاة دفتر اليومية والفاتورة (Centerpiece Showcase)
                 ========================================================= -->
            <div class="mockup-outer-frame">
              <div class="mockup-inner-window">
                <!-- شريط رأس نافذة المحاكي -->
                <div class="mockup-top-bar">
                  <div style="display:flex; align-items:center; gap:0.75rem;">
                    <div class="mockup-window-controls">
                      <span class="window-dot dot-red"></span>
                      <span class="window-dot dot-amber"></span>
                      <span class="window-dot dot-green"></span>
                    </div>
                    <span class="mockup-window-title">بيئة التدريب العملي - محاكاة شركة الأفق للتجارة والتوزيع</span>
                  </div>
                  <div style="display:flex; align-items:center; gap:0.6rem;">
                    <span style="font-size:11px; font-weight:700; color:#34d399; background:rgba(16,185,129,0.15); padding:2px 8px; border-radius:999px;">
                      ميزان المراجعة متوازن 100% ✓
                    </span>
                    <span style="font-size:11px; color:#94a3b8; font-family:'JetBrains Mono';">EAS #2026</span>
                  </div>
                </div>

                <!-- جسم المحاكي: جدول اليومية والمستند -->
                <div class="mockup-grid-body">
                  <!-- دفتر اليومية العامة -->
                  <div class="journal-card">
                    <div class="journal-card-header">
                      <div style="display:flex; align-items:center; gap:0.5rem;">
                        <div style="width:28px; height:28px; border-radius:6px; background:rgba(16,185,129,0.12); color:#10b981; display:flex; align-items:center; justify-content:center;">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        </div>
                        <div>
                          <strong style="font-size:0.9rem; color:var(--text-primary); display:block;">دفتر اليومية العامة (General Journal)</strong>
                          <span style="font-size:0.75rem; color:var(--text-secondary);">إثبات مبيعات بضاعة بالأجل بموجب فاتورة ضريبية رسمية</span>
                        </div>
                      </div>
                      <span style="font-size:11px; font-weight:800; color:#10b981; background:rgba(16,185,129,0.1); padding:2px 8px; border-radius:6px;">
                        قيد مركب #1042
                      </span>
                    </div>

                    <div style="overflow-x:auto;">
                      <table class="journal-table font-num">
                        <thead>
                          <tr>
                            <th>التاريخ</th>
                            <th>الحساب والبيان</th>
                            <th style="text-align:left;">مدين (Debit)</th>
                            <th style="text-align:left;">دائن (Credit)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style="color:var(--text-muted); font-size:11px;">24/01/2026</td>
                            <td><strong style="color:#047857;">1101</strong> - النقدية بالصندوق <span style="font-size:11px; color:var(--text-muted);">(تحصيل دفعة)</span></td>
                            <td class="num-cell" style="color:var(--text-primary);">20,000</td>
                            <td class="num-cell" style="color:var(--text-muted);">-</td>
                          </tr>
                          <tr>
                            <td style="color:var(--text-muted); font-size:11px;">24/01/2026</td>
                            <td><strong style="color:#047857;">1102</strong> - العملاء <span style="font-size:11px; color:var(--text-muted);">(شركة النور للتجارة)</span></td>
                            <td class="num-cell" style="color:var(--text-primary);">20,000</td>
                            <td class="num-cell" style="color:var(--text-muted);">-</td>
                          </tr>
                          <tr style="background:var(--surface-muted);">
                            <td style="color:var(--text-muted); font-size:11px;">24/01/2026</td>
                            <td style="padding-right:1.75rem;">إلى حـ / <strong style="color:#047857;">4101</strong> - إيراد المبيعات</td>
                            <td class="num-cell" style="color:var(--text-muted);">-</td>
                            <td class="num-cell" style="color:var(--text-primary);">35,088</td>
                          </tr>
                          <tr style="background:var(--surface-muted);">
                            <td style="color:var(--text-muted); font-size:11px;">24/01/2026</td>
                            <td style="padding-right:1.75rem;">إلى حـ / <strong style="color:#047857;">2106</strong> - ضريبة القيمة المضافة 14%</td>
                            <td class="num-cell" style="color:var(--text-muted);">-</td>
                            <td class="num-cell" style="color:var(--text-primary);">4,912</td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr style="background:rgba(16,185,129,0.08); font-weight:800; border-top:2px solid var(--border-subtle);">
                            <td colspan="2" style="color:var(--text-primary);">إجمالي توازن القيد (Balanced)</td>
                            <td class="num-cell" style="color:#047857;">40,000 ج.م</td>
                            <td class="num-cell" style="color:#047857;">40,000 ج.م</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>

                    <div class="journal-footer-strip">
                      <div style="display:flex; align-items:center; gap:0.4rem;">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                        <span>المعادلة المحاسبية مستقرة: الأصول = الخصوم + حقوق الملكية</span>
                      </div>
                      <button onclick="if(typeof AccModal !== 'undefined' && AccModal.toast) AccModal.toast('تم ترحيل القيد بنجاح إلى ميزان المراجعة والأستاذ العام ✓', 'success');" style="background:#ffffff; border:1px solid rgba(16,185,129,0.3); color:#047857; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">
                        ترحيل القيد للأستاذ
                      </button>
                    </div>
                  </div>

                  <!-- لوحة المستند المؤيد والتحليل الذهني -->
                  <div class="document-panel-card">
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; padding-bottom:0.6rem; border-bottom:1px solid var(--border-subtle); margin-bottom:0.75rem;">
                        <span style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">المستند المؤيد للقيد</span>
                        <span class="landing-nav-badge badge-amber">فاتورة ضريبية رسمية</span>
                      </div>

                      <div style="display:flex; flex-direction:column; gap:0.5rem; font-size:0.82rem;">
                        <div style="display:flex; justify-content:space-between; color:var(--text-secondary);">
                          <span>قيمة البضاعة:</span>
                          <strong style="color:var(--text-primary); font-family:'JetBrains Mono';">35,088 ج.م</strong>
                        </div>
                        <div style="display:flex; justify-content:space-between; color:var(--text-secondary);">
                          <span>ضريبة القيمة المضافة (14%):</span>
                          <strong style="color:var(--text-primary); font-family:'JetBrains Mono';">4,912 ج.م</strong>
                        </div>
                        <div style="padding-top:0.4rem; border-top:1px dashed var(--border-subtle); display:flex; justify-content:space-between; font-weight:800; font-size:0.9rem;">
                          <span>إجمالي الفاتورة:</span>
                          <span style="color:#10b981; font-family:'JetBrains Mono';">40,000 ج.م</span>
                        </div>
                      </div>

                      <div style="margin-top:1rem; background:var(--surface-muted); padding:0.75rem; border-radius:0.6rem; border:1px solid var(--border-subtle);">
                        <div style="font-size:11px; font-weight:800; color:var(--text-secondary); margin-bottom:0.35rem;">التحليل الذهني السريع (4 خطوات):</div>
                        <ol style="margin:0; padding-right:1rem; font-size:0.78rem; line-height:1.6; color:var(--text-secondary);">
                          <li>تحديد الحسابات: النقدية، العملاء، المبيعات، الضريبة</li>
                          <li>تصنيف الطبيعة: أصول زادت، إيرادات والتزامات زادت</li>
                        </ol>
                      </div>
                    </div>

                    <div style="margin-top:1rem;">
                      <button onclick="window.location.href='simulation/simulation/journal/index.html'" style="width:100%; padding:0.75rem; background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:none; border-radius:0.6rem; font-weight:800; font-size:0.82rem; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:0.5rem; box-shadow:0 4px 12px rgba(16,185,129,0.25);">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                        <span>فتح ورقة العمل والتطبيق الذاتي</span>
                      </button>

                      <div style="margin-top:0.6rem; background:linear-gradient(135deg, #090e17, #064e3b); color:#fff; padding:0.6rem 0.85rem; border-radius:0.6rem; display:flex; align-items:center; gap:0.6rem;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/></svg>
                        <div>
                          <div style="font-size:10px; color:#94a3b8;">جاهزية لسوق العمل</div>
                          <div style="font-size:0.8rem; font-weight:800;">100% سيناريوهات واقعية</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- =========================================================
               5. شريط إحصائيات الثقة (Trust Stats Bar)
               ========================================================= -->
          <section class="trust-stats-section">
            <div class="trust-stats-grid">
              <div>
                <div class="stat-metric-number font-num">+60</div>
                <div class="stat-metric-label">شاشة ومحاكاة تفاعلية</div>
                <div class="stat-metric-sub">تدريب عملي على كل قيد وقائمة</div>
              </div>
              <div>
                <div class="stat-metric-number font-num">6</div>
                <div class="stat-metric-label">مراحل لإتمام الدورة</div>
                <div class="stat-metric-sub">من الصفر حتى القوائم المالية</div>
              </div>
              <div>
                <div class="stat-metric-number font-num">%100</div>
                <div class="stat-metric-label">تطبيق عملي وواقعي</div>
                <div class="stat-metric-sub">بناءً على فواتير ودفاتر حقيقية</div>
              </div>
              <div>
                <div class="stat-metric-number font-num">EAS / IFRS</div>
                <div class="stat-metric-label">معايير المحاسبة المعتمدة</div>
                <div class="stat-metric-sub">المصرية والدولية المحدثة</div>
              </div>
            </div>
          </section>

          <!-- =========================================================
               6. قسم مسار الإتقان المهني (6 Learning Steps)
               ========================================================= -->
          <section class="learning-journey-section" id="curriculum">
            <div class="section-title-wrap">
              <span class="section-pill-tag">مسار الإتقان المهني</span>
              <h2 class="section-main-heading">من الأساسيات حتى إغلاق الدورة المحاسبية بالكامل</h2>
              <p class="section-desc-lead">
                منهجية مصممة خطوة بخطوة لبناء العقلية التحليلية السليمة للمحاسب المالي المحترف، بعيداً عن أساليب الحفظ والتلقين.
              </p>
            </div>

            <div class="learning-steps-grid">
              <!-- الخطوة 01 -->
              <div class="step-card">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15 2a6 6 0 0 0-6 6c0 2 1.5 3.5 2 5h2c.5-1.5 2-3 2-5a6 6 0 0 0-2-6z"/></svg>
                    </div>
                    <span class="step-number-watermark font-num">01</span>
                  </div>
                  <h3 class="step-title">الفهم النظري المبسط</h3>
                  <p class="step-desc">
                    شرح سلس وعميق لفلسفة المعادلة المحاسبية وطبيعة الحسابات (المدين والدائن) بمنظور منطقي ومبسط بعيداً عن التعقيد الأكاديمي.
                  </p>
                </div>
                <div class="step-badge-footer">
                  <span>يشمل: 8 فيديوهات تفاعلية + ملخص PDF</span>
                </div>
              </div>

              <!-- الخطوة 02 -->
              <div class="step-card">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </div>
                    <span class="step-number-watermark font-num">02</span>
                  </div>
                  <h3 class="step-title">إطار التحليل ذو الـ 4 خطوات</h3>
                  <p class="step-desc">
                    منهجية ذهنية معتمدة تمكنك من تفكيك أي معاملة مالية وتحديد أطرافها بدقة متناهية لصياغة القيد الصحيح دون تردد أو ارتباك.
                  </p>
                </div>
                <div class="step-badge-footer">
                  <span>يشمل: خوارزمية التفكير المحاسبي السريع</span>
                </div>
              </div>

              <!-- الخطوة 03 -->
              <div class="step-card">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                    </div>
                    <span class="step-number-watermark font-num">03</span>
                  </div>
                  <h3 class="step-title">التمارين العملية المتدرجة</h3>
                  <p class="step-desc">
                    تدرج منطقي من الأمثلة المحلولة وصولاً للتدريبات الموجهة والمستقلة مع تصحيح فوري وتوضيح لأسباب الخطأ المحاسبي الشائع.
                  </p>
                </div>
                <div class="step-badge-footer">
                  <span>يشمل: +150 تمرين قيد وتصحيح ذاتي</span>
                </div>
              </div>

              <!-- الخطوة 04 -->
              <div class="step-card">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/></svg>
                    </div>
                    <span class="step-number-watermark font-num">04</span>
                  </div>
                  <h3 class="step-title">محاكاة الشركات الواقعية</h3>
                  <p class="step-desc">
                    عش دور المحاسب المالي في شركات تجارية، خدمية، ومقاولات؛ تعامل مع فواتير الشراء، أذون الصرف، وحسابات البنوك الفعلية.
                  </p>
                </div>
                <div class="step-badge-footer">
                  <span>يشمل: 3 شركات كاملة المستندات والدورات</span>
                </div>
              </div>

              <!-- الخطوة 05 -->
              <div class="step-card">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                    </div>
                    <span class="step-number-watermark font-num">05</span>
                  </div>
                  <h3 class="step-title">الدفاتر والقوائم الختامية</h3>
                  <p class="step-desc">
                    من دفاتر اليومية ومساعدات الأستاذ وموازين المراجعة حتى إعداد قائمة الدخل والمركز المالي والتدفقات النقدية وتحليلها.
                  </p>
                </div>
                <div class="step-badge-footer">
                  <span>يشمل: إقفال حسابات نهاية العام المالي</span>
                </div>
              </div>

              <!-- الخطوة 06 -->
              <div class="step-card" style="border-color:rgba(16,185,129,0.35); background:linear-gradient(180deg, var(--surface-card) 0%, rgba(16,185,129,0.06) 100%);">
                <div>
                  <div class="step-card-top">
                    <div class="step-icon-box" style="background:#10b981; color:#fff;">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                    </div>
                    <span class="step-number-watermark font-num" style="color:#10b981;">06</span>
                  </div>
                  <h3 class="step-title">وثيقة الكفاءة والاعتماد</h3>
                  <p class="step-desc">
                    احصل على جواز المهارات المحاسبية المعتمد مع رمز تحقق رقمي QR كود مخصص لعرض كفاءتك وقدراتك على مسؤولي التوظيف والشركات.
                  </p>
                </div>
                <div class="step-badge-footer" style="color:#047857;">
                  <span>شهادة كفاءة عملية مدعومة بالتقييم الفعلي</span>
                </div>
              </div>
            </div>
          </section>

          <!-- =========================================================
               7. قسم الباقات والأسعار (Pricing Section)
               ========================================================= -->
          <section class="pricing-section-wrap" id="pricingSection">
            <div class="section-title-wrap">
              <span class="section-pill-tag">الخطط والتوسع</span>
              <h2 class="section-main-heading">اختر الخطة المناسبة لمستواك المهني</h2>
              <p class="section-desc-lead">
                جميع الباقات تمنحك وصولاً مباشراً لبيئة المحاكاة وتطبيق القيود المحاسبية العملية.
              </p>
            </div>

            <div class="pricing-cards-container">
              <!-- باقة 1: التأسيسية (مجاناً) -->
              <div class="pricing-card">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <span class="landing-nav-badge" style="background:var(--surface-muted); color:var(--text-secondary);">تأسيسي</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12A10 10 0 0 1 12 2z"/></svg>
                  </div>
                  <h3 class="pricing-title">الباقة التأسيسية</h3>
                  <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">مناسبة لاستكشاف المنصة ومراجعة المبادئ الأساسية</p>
                  
                  <div class="pricing-price-wrap">
                    <span class="pricing-amount">مجاناً</span>
                    <span style="font-size:0.85rem; color:var(--text-secondary);"> / مدى الحياة</span>
                  </div>

                  <ul class="pricing-features-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>الوصول للمرحلة الأولى: الأساسيات</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>حل 15 تمرين قيود أولية موجهة</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>دليل المعادلة المحاسبية بصيغة PDF</span>
                    </li>
                    <li style="color:var(--text-muted); text-decoration:line-through;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>محاكاة الشركات والقوائم المالية</span>
                    </li>
                    <li style="color:var(--text-muted); text-decoration:line-through;">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      <span>شهادة الكفاءة المعتمدة</span>
                    </li>
                  </ul>
                </div>

                <button onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('register') : navigateToScreen('welcome')" style="width:100%; padding:0.8rem; background:var(--surface-muted); color:var(--text-primary); border:1px solid var(--border-subtle); border-radius:0.75rem; font-weight:800; font-size:0.9rem; cursor:pointer;">
                  ابدأ الآن بالمجان
                </button>
              </div>

              <!-- باقة 2: المحاسب المحترف Pro (الأكثر طلباً) -->
              <div class="pricing-card featured-card">
                <span class="pricing-featured-badge">الأكثر طلباً واشتراكاً ★</span>
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; margin-top:0.5rem;">
                    <span class="landing-nav-badge badge-green">الموصى بها</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <h3 class="pricing-title" style="color:#ffffff;">المحاسب المحترف (Pro)</h3>
                  <p style="font-size:0.8rem; color:#94a3b8; margin-bottom:1.5rem;">الدورة الكاملة للانتقال لسوق العمل بثقة وممارسة فعلية</p>
                  
                  <div class="pricing-price-wrap" style="border-color:rgba(255,255,255,0.12);">
                    <span class="pricing-amount" style="color:#ffffff;">${proPlan.price}</span>
                    <span style="font-size:1.1rem; color:#34d399; font-weight:700;"> ج.م</span>
                    <span style="font-size:0.85rem; color:#94a3b8;"> / ${proPlan.period || '30 يوم'}</span>
                  </div>

                  <ul class="pricing-features-list" style="color:#e2e8f0;">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <strong>الوصول لجميع المراحل الـ 6 بالكامل</strong>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>محاكاة 3 شركات تجارية وخدمية ومقاولات</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>إعداد موازين المراجعة والقوائم المالية الختامية</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>دعم مباشر واستشارات للأخطاء المحاسبية</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <strong style="color:#34d399;">شهادة كفاءة معتمدة برمز QR لمسؤولي التوظيف</strong>
                    </li>
                  </ul>
                </div>

                <button onclick="navigateToScreen('student-plans')" style="width:100%; padding:0.9rem; background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:none; border-radius:0.75rem; font-weight:900; font-size:0.95rem; cursor:pointer; box-shadow:0 6px 18px rgba(16,185,129,0.35);">
                  اشترك الآن وابدأ المحاكاة
                </button>
              </div>

              <!-- باقة 3: خبير النمذجة (VIP Master) -->
              <div class="pricing-card">
                <div>
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                    <span class="landing-nav-badge badge-amber">نخبة</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 16V9h14V2"/><path d="M3 5h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5z"/></svg>
                  </div>
                  <h3 class="pricing-title">خبير النمذجة (VIP Master)</h3>
                  <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1.5rem;">للمحاسبين الطامحين للعمل بشركات الـ Big 4 والاستشارات</p>
                  
                  <div class="pricing-price-wrap">
                    <span class="pricing-amount">${vipPlan.price}</span>
                    <span style="font-size:1.1rem; color:#10b981; font-weight:700;"> ج.م</span>
                    <span style="font-size:0.85rem; color:var(--text-secondary);"> / ${vipPlan.period || 'سنة كاملة'}</span>
                  </div>

                  <ul class="pricing-features-list">
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <strong>كل مزايا خطة المحترف Pro</strong>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>شرح معايير الضرائب والخصم والإضافة المصرية</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>ورش عمل إعداد القوائم المالية على Excel و ERP</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>مراجعة الـ CV وملف LinkedIn مع مدير مالي</span>
                    </li>
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      <strong style="color:var(--text-primary);">أولوية الترشيح لفرص التدريب الشريكة</strong>
                    </li>
                  </ul>
                </div>

                <button onclick="navigateToScreen('student-plans')" style="width:100%; padding:0.8rem; background:#090e17; color:#fff; border:none; border-radius:0.75rem; font-weight:800; font-size:0.9rem; cursor:pointer;">
                  انضم لنخبة المحاسبين
                </button>
              </div>
            </div>

            <!-- شارات الأمان وطرق الدفع -->
            <div style="margin-top:3rem; text-align:center; font-size:0.82rem; color:var(--text-secondary); display:flex; flex-wrap:wrap; justify-content:center; gap:1.5rem;">
              <span style="display:flex; align-items:center; gap:0.4rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                دفع آمن ومحمي 100% (فوري، فيزا، ماستركارد، فودافون كاش)
              </span>
              <span style="display:flex; align-items:center; gap:0.4rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                ضمان استرداد الأموال لمدة 7 أيام إذا لم تكن راضياً
              </span>
            </div>
          </section>

          <!-- =========================================================
               8. شريط التوصيات والشهادات (Testimonial Banner)
               ========================================================= -->
          <section class="testimonial-banner-wrap">
            <div class="testimonial-inner-box">
              <div style="font-size:2.5rem; color:rgba(52,211,153,0.3); line-height:1; margin-bottom:1rem;">&ldquo;</div>
              <p class="testimonial-quote-text">
                "كنت أعاني في المقابلات الشخصية عندما يطلب مني مسؤول التوظيف تحليل قيد مركب أو إعداد ميزان مراجعة من واقع مستندات. منصة Accountera أعطتني الخبرة العملية الحقيقية التي لم أجدها طوال 4 سنوات في الجامعة."
              </p>
              <div style="display:flex; align-items:center; justify-content:center; gap:0.75rem;">
                <div style="width:42px; height:42px; border-radius:50%; background:rgba(16,185,129,0.25); border:1px solid #34d399; display:flex; align-items:center; justify-content:center; font-weight:800; color:#34d399; font-size:0.9rem;" class="font-num">
                  م.ع
                </div>
                <div style="text-align:right;">
                  <div style="font-weight:800; font-size:0.95rem; color:#ffffff;">محمود عبد الرحمن</div>
                  <div style="font-size:0.78rem; color:#94a3b8;">محاسب مالي بشركة الفا كيميكالز (خريج تجارة القاهرة)</div>
                </div>
              </div>
            </div>
          </section>

          <!-- =========================================================
               9. قسم الأسئلة الشائعة (FAQ Accordion)
               ========================================================= -->
          <section class="learning-journey-section" id="faqSection" style="padding-top:4rem; padding-bottom:4rem;">
            <div class="section-title-wrap">
              <span class="section-pill-tag">الأسئلة المتكررة</span>
              <h2 class="section-main-heading">إجابات عن استفساراتك الشائعة</h2>
            </div>

            <div style="max-w-700px; margin:0 auto; display:flex; flex-direction:column; gap:1rem; max-width:760px;">
              <div style="background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:0.75rem; padding:1.25rem;">
                <h4 style="font-weight:800; font-size:0.95rem; margin:0 0 0.5rem; color:var(--text-primary);">هل التدريب معتمد على معايير المحاسبة المصرية؟</h4>
                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">نعم، جميع قيود اليومية ونماذج الفواتير والدليل المحاسبي متطابقة 100% مع معايير المحاسبة المصرية (EAS) وقوانين الضرائب وقانون ضريبة القيمة المضافة 14% والخصم والإضافة.</p>
              </div>

              <div style="background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:0.75rem; padding:1.25rem;">
                <h4 style="font-weight:800; font-size:0.95rem; margin:0 0 0.5rem; color:var(--text-primary);">كيف تعمل شهادة الكفاءة المعتمدة؟</h4>
                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">عند إتمام المراحل الست واجتياز التقييمات العملية بنجاح، يُصدر لك النظام جواز كفاءة مهني فريد برمز QR يمكن لمسؤولي التوظيف مسحه مباشرة للتحقق من مهاراتك ودرجاتك الواقعية.</p>
              </div>

              <div style="background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:0.75rem; padding:1.25rem;">
                <h4 style="font-weight:800; font-size:0.95rem; margin:0 0 0.5rem; color:var(--text-primary);">هل يمكنني تجربة المنصة قبل الاشتراك؟</h4>
                <p style="margin:0; font-size:0.85rem; color:var(--text-secondary); line-height:1.6;">بالتأكيد، يمكنك إنشاء حسابك المجاني فوراً والبدء في حل تمارين المرحلة التأسيسية وتصفح محاكي الشركات بدون أي التزام مالي.</p>
              </div>
            </div>
          </section>

          <!-- =========================================================
               10. الفوتر الشامل (Footer)
               ========================================================= -->
          <footer class="landing-footer-wrap">
            <div class="landing-footer-grid">
              <!-- معلومات المنصة -->
              <div>
                <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:1rem;">
                  <div style="width:32px; height:32px; border-radius:8px; background:#10b981; display:flex; align-items:center; justify-content:center; color:#fff;">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>
                  </div>
                  <span style="font-size:1.1rem; font-weight:900; color:#fff;" class="font-num">ACCOUNTERA</span>
                </div>
                <p style="color:#94a3b8; font-size:0.8rem; line-height:1.7; margin-bottom:1rem;">
                  المنصة الأولى المتخصصة في التدريب العملي والمحاكاة التفاعلية لمهنة المحاسبة المالية وفقاً للمعايير المصرية والدولية.
                </p>
                <div style="display:flex; gap:0.6rem; align-items:center;">
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style="width:40px; height:40px; min-width:40px; min-height:40px; border-radius:50%; background:#152033; color:#94a3b8; display:flex; align-items:center; justify-content:center; font-weight:700; text-decoration:none;">in</a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style="width:40px; height:40px; min-width:40px; min-height:40px; border-radius:50%; background:#152033; color:#94a3b8; display:flex; align-items:center; justify-content:center; font-weight:700; text-decoration:none;">fb</a>
                  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style="width:40px; height:40px; min-width:40px; min-height:40px; border-radius:50%; background:#152033; color:#94a3b8; display:flex; align-items:center; justify-content:center; font-weight:700; text-decoration:none;">yt</a>
                </div>
              </div>

              <!-- روابط المنصة -->
              <div>
                <h4 class="footer-heading">روابط المنصة</h4>
                <ul class="footer-links-list">
                  <li><a href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})">الرئيسية</a></li>
                  <li><a href="javascript:void(0)" onclick="navigateToScreen('documentary-cycle')">المنهج الكامل والدروس</a></li>
                  <li><a href="javascript:void(0)" onclick="navigateToScreen('companies-hub')">محاكاة الشركات الحقيقية</a></li>
                  <li><a href="javascript:void(0)" onclick="navigateToScreen('student-plans')">باقات الاشتراك</a></li>
                  <li><a href="javascript:void(0)" onclick="navigateToScreen('ex-1')">بنك القيود والأسئلة</a></li>
                </ul>
              </div>

              <!-- المصادر والمعايير -->
              <div>
                <h4 class="footer-heading">المصادر والمعايير</h4>
                <ul class="footer-links-list">
                  <li><a href="javascript:void(0)">معايير المحاسبة المصرية (EAS)</a></li>
                  <li><a href="javascript:void(0)">معايير التقارير الدولية (IFRS)</a></li>
                  <li><a href="javascript:void(0)">شجرة الحسابات النموذجية (Excel)</a></li>
                  <li><a href="javascript:void(0)">نماذج الفواتير الضريبية</a></li>
                  <li><a href="javascript:void(0)">المدونة المحاسبية المتخصصة</a></li>
                </ul>
              </div>

              <!-- النشرة المهنية -->
              <div>
                <h4 class="footer-heading">النشرة المهنية</h4>
                <p style="font-size:0.78rem; color:#94a3b8; margin-bottom:0.75rem;">انضم لأكثر من 15,000 محاسب واحصل على حالات عملية أسبوعياً.</p>
                <div style="display:flex; gap:0.4rem;">
                  <input type="email" placeholder="بريدك الإلكتروني..." style="flex:1; padding:0.45rem 0.75rem; border-radius:0.5rem; background:#152033; border:1px solid #334155; color:#fff; font-size:0.78rem; outline:none;" />
                  <button style="padding:0.45rem 0.9rem; background:#10b981; color:#fff; border:none; border-radius:0.5rem; font-weight:800; font-size:0.78rem; cursor:pointer;">
                    اشتراك
                  </button>
                </div>
                <div style="margin-top:0.75rem; font-size:11px; color:#64748b;">
                  خدمة العملاء: support@accountera.com
                </div>
              </div>
            </div>

            <!-- الشريط السفلي للحقوق -->
            <div class="footer-bottom-bar">
              <div>© 2026 منصة Accountera. جميع الحقوق محفوظة لشركة المحاسب الرقمي للحلول التعليمية.</div>
              <div style="display:flex; gap:1rem;">
                <a href="javascript:void(0)" style="color:#64748b; text-decoration:none;">سياسة الخصوصية</a>
                <a href="javascript:void(0)" style="color:#64748b; text-decoration:none;">الشروط والأحكام</a>
                <a href="javascript:void(0)" style="color:#64748b; text-decoration:none;">التحقق من الشهادات</a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.ExcelLandingView = ExcelLandingView;

  window.toggleLandingSidebar = function() {
    const sb = document.getElementById('landingSidebar');
    const wrapper = document.querySelector('.landing-main-wrapper');
    if (!sb) return;

    const isCollapsed = sb.classList.toggle('collapsed');
    if (wrapper) wrapper.classList.toggle('sidebar-collapsed', isCollapsed);

    try {
      localStorage.setItem('acc_landing_sb_collapsed', isCollapsed ? '1' : '0');
    } catch(e) {}

    const icon = document.getElementById('landingSidebarToggleIcon');
    if (icon) {
      icon.innerHTML = isCollapsed
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
    }
  };
}
