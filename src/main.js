/**
 * main.js — نقطة بدء تشغيل الواجهة وإدارة الشاشات والتوجيه الذكي
 */

// 1. نظام إدارة وتغيير الثيم (Theme Manager)
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('accountera_theme', newTheme);
  
  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = newTheme === 'dark' ? sunSvg : moonSvg;
    themeBtn.setAttribute('title', newTheme === 'dark' ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي');
  }

  const drawerIcon = document.getElementById('drawerThemeIcon');
  const drawerLabel = document.getElementById('drawerThemeLabel');
  if (drawerIcon) {
    drawerIcon.innerHTML = newTheme === 'dark' ? sunSvg : moonSvg;
  }
  if (drawerLabel) {
    drawerLabel.textContent = newTheme === 'dark' ? 'التحويل للوضع النهاري (Light Mode)' : 'التحويل للوضع الليلي (Dark Mode)';
  }
};

// وظيفة طي/فتح الشريط الجانبي Accountely
window.toggleSidebar = function() {
  const sb = document.getElementById('appSidebar');
  if (sb) {
    sb.classList.toggle('collapsed');
    const icon = document.getElementById('sidebarToggleIcon');
    if (icon) {
      icon.innerHTML = sb.classList.contains('collapsed') 
        ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
        : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
    }
  }
};

// وظيفة طي/فتح القائمة الجانبية السريعة للموبايل (Mobile Nav Drawer)
window.toggleMobileDrawer = function(force) {
  let drawer = document.getElementById('mobileNavDrawer');
  let overlay = document.getElementById('mobileNavOverlay');
  if (!drawer) {
    window.createMobileNavDrawer();
    drawer = document.getElementById('mobileNavDrawer');
    overlay = document.getElementById('mobileNavOverlay');
  }
  if (!drawer || !overlay) return;
  const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('open');
  drawer.classList.toggle('open', isOpen);
  overlay.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
};

window.createMobileNavDrawer = function() {
  let overlay = document.getElementById('mobileNavOverlay');
  let drawer = document.getElementById('mobileNavDrawer');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mobileNavOverlay';
    overlay.className = 'mobile-nav-overlay';
    overlay.onclick = () => window.toggleMobileDrawer(false);
    document.body.appendChild(overlay);
  }

  if (!drawer) {
    drawer = document.createElement('aside');
    drawer.id = 'mobileNavDrawer';
    drawer.className = 'mobile-nav-drawer';
    document.body.appendChild(drawer);
  }

  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  const isStudent = currentUser && (currentUser.role || 'student') === 'student';
  const isAdmin = currentUser && currentUser.role === 'admin';
  const initial = currentUser && currentUser.name ? currentUser.name.trim().charAt(0).toUpperCase() : 'M';
  const currentTheme = document.documentElement.getAttribute('data-theme') || localStorage.getItem('accountera_theme') || 'light';
  const isDark = currentTheme === 'dark';
  const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
  const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  drawer.innerHTML = `
    <div class="drawer-header">
      <div style="display:flex; align-items:center; gap:0.6rem;">
        <div style="width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg, #047857, #10b981); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:900; font-family:'JetBrains Mono', monospace; font-size:1rem;">A</div>
        <div>
          <div style="font-weight:900; font-size:1.05rem; color:var(--text-primary); font-family:'JetBrains Mono', monospace; letter-spacing:0.5px;">ACCOUNTERA</div>
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700;">منصة المحاسب المالي التطبيقية</div>
        </div>
      </div>
      <button onclick="window.toggleMobileDrawer(false)" style="background:var(--surface-hover); border:1px solid var(--border-subtle); border-radius:8px; width:34px; height:34px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--text-primary); font-size:1.1rem;" title="إغلاق" aria-label="إغلاق">✕</button>
    </div>

    ${currentUser ? `
      <div style="padding:0.85rem 1rem; border-bottom:1px solid var(--border-subtle); background:var(--surface-muted); display:flex; align-items:center; justify-content:space-between; gap:0.75rem;">
        <div style="display:flex; align-items:center; gap:0.65rem; min-width:0;">
          <div style="width:36px; height:36px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.95rem; flex-shrink:0;">${initial}</div>
          <div style="min-width:0;">
            <div style="font-weight:800; font-size:0.9rem; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${currentUser.name || 'مستخدم'}</div>
            <div style="font-size:0.72rem; color:var(--text-muted);">${isAdmin ? 'مدير النظام • Admin' : (currentUser.plan === 'vip' ? 'باقة VIP ⭐' : (currentUser.plan === 'pro' ? 'باقة المحترف Pro ⭐' : 'الحساب الأساسي Free'))}</div>
          </div>
        </div>
        <button onclick="window.toggleMobileDrawer(false); navigateToScreen('${isAdmin ? 'admin-settings' : 'student-settings'}')" style="padding:4px 10px; border-radius:8px; border:1px solid var(--border-subtle); background:var(--surface-card); font-size:0.75rem; font-weight:700; color:var(--text-secondary); cursor:pointer;">إدارة</button>
      </div>
    ` : ''}

    ${isStudent ? `
      <div style="padding:0.75rem 0.85rem 0.25rem 0.85rem; display:flex; flex-direction:column; gap:0.5rem;">
        <button onclick="window.toggleMobileDrawer(false); navigateToScreen('student-plans')" style="display:flex; align-items:center; justify-content:space-between; padding:0.65rem 0.85rem; border-radius:12px; background:linear-gradient(135deg, #FEF3C7, #FDE68A); border:1.5px solid #F59E0B; color:#92400E; font-weight:800; font-size:0.85rem; cursor:pointer; box-shadow:0 1px 3px rgba(245, 158, 11, 0.25);">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span>⭐</span>
            <span>ترقية الحساب إلى Pro</span>
          </div>
          <span style="font-size:0.75rem; background:#F59E0B; color:#fff; padding:2px 8px; border-radius:999px;">خصم 40%</span>
        </button>
        <button onclick="window.toggleMobileDrawer(false); navigateToScreen('student-plans')" style="display:flex; align-items:center; gap:0.5rem; padding:0.5rem 0.85rem; border-radius:10px; background:var(--surface-hover); border:1px dashed var(--border-strong); color:var(--text-secondary); font-weight:700; font-size:0.8rem; cursor:pointer;">
          <span>✨</span>
          <span>دعوة زميل واربح 20% رصيد</span>
        </button>
      </div>
    ` : ''}

    <div class="drawer-nav">
      <button class="drawer-item" onclick="window.navigateToScreen('landing')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span>
        <span>الصفحة الرئيسية</span>
      </button>

      <button class="drawer-item" onclick="window.navigateToScreen('student-dashboard')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 16v-4"/><path d="M12 16v-8"/><path d="M17 16v-6"/></svg></span>
        <span>لوحة التدريب والمتابعة</span>
      </button>

      <button class="drawer-item" onclick="window.navigateToScreen('companies-hub')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/></svg></span>
        <span>بيئة الشركات والمحاكاة</span>
      </button>

      <a class="drawer-item" href="/simulation/simulation/dashboard/index.html" style="color:var(--primary); font-weight:800; background:var(--primary-subtle, rgba(16,185,129,0.08));">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></span>
        <span>محاكي النظام المحاسبي (ERP Sim) ⚡</span>
      </a>

      <button class="drawer-item" onclick="window.navigateToScreen('learning')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
        <span>مسار الدروس والمحتوى</span>
      </button>

      <button class="drawer-item" onclick="window.navigateToScreen('practice')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></span>
        <span>بنك التدريبات العملية</span>
      </button>

      <button class="drawer-item" onclick="window.navigateToScreen('student-plans')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg></span>
        <span>باقات وأسعار التدريب</span>
      </button>

      <button class="drawer-item" onclick="window.navigateToScreen('student-settings')">
        <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></span>
        <span>الإعدادات والملف الشخصي</span>
      </button>
    </div>

    <div style="padding:1rem; border-top:1px solid var(--border-subtle); display:flex; flex-direction:column; gap:0.5rem; background:var(--surface-hover);">
      <button id="drawerThemeToggleBtn" onclick="toggleTheme()" class="drawer-item" style="border:1px solid var(--border-subtle); border-radius:10px; justify-content:center; min-height:44px;">
        <span class="drawer-item-icon" id="drawerThemeIcon">${isDark ? sunSvg : moonSvg}</span>
        <span id="drawerThemeLabel">${isDark ? 'التحويل للوضع النهاري (Light Mode)' : 'التحويل للوضع الليلي (Dark Mode)'}</span>
      </button>

      ${currentUser ? `
        <button onclick="window.toggleMobileDrawer(false); AuthService.logout();" class="drawer-item" style="border:1px solid rgba(239, 68, 68, 0.25); border-radius:10px; justify-content:center; min-height:44px; color:#ef4444; background:rgba(239, 68, 68, 0.05);">
          <span class="drawer-item-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
          <span style="font-weight:700;">تسجيل الخروج (Logout)</span>
        </button>
      ` : `
        <button onclick="window.toggleMobileDrawer(false); AuthService.openAuthModal('login');" class="drawer-item" style="border:1px solid var(--primary-border); border-radius:10px; justify-content:center; min-height:44px; color:var(--primary); background:var(--primary-light); font-weight:800;">
          <span>تسجيل الدخول / إنشاء حساب</span>
        </button>
      `}
    </div>
  `;
};

// تهيئة الثيم المحفوظ عند التحميل
(function initTheme() {
  const savedTheme = localStorage.getItem('accountera_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

window.navigateToScreen = function(screenId) {
  console.log(`Navigating to screen: ${screenId}`);
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // إغلاق درج الموبايل تلقائياً عند أي انتقال
  if (typeof window.toggleMobileDrawer === 'function') {
    window.toggleMobileDrawer(false);
  }

  // حارس المسارات الصارم (Strict Route Guard): حظر الوصول لكافة أقسام المنصة بدون تسجيل دخول موثق
  const publicScreens = ['landing', 'welcome'];
  const currentUser = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;

  if (!publicScreens.includes(screenId) && screenId !== 'login' && screenId !== 'register' && !currentUser) {
    console.warn(`[RouteGuard] Screen "${screenId}" requires authentication.`);
    screenId = 'login';
    if (typeof AccModal !== 'undefined' && typeof AccModal.toast === 'function') {
      AccModal.toast('يرجى تسجيل الدخول أو إنشاء حساب للوصول إلى المنصة', 'info', 3000);
    }
    if (typeof AuthService !== 'undefined' && typeof AuthService.openAuthModal === 'function') {
      setTimeout(() => AuthService.openAuthModal('login'), 150);
    }
  }

  const isAuthScreen = (screenId === 'login' || screenId === 'register');

  // تحديث الهاش في الرابط لدعم الروابط المباشرة والرجوع
  try {
    if (screenId && screenId !== 'landing' && screenId !== 'welcome' && !isAuthScreen) {
      if (window.location.hash.replace(/^#\/?/, '') !== screenId) {
        window.history.replaceState(null, '', `#${screenId}`);
      }
    } else if (screenId === 'landing' || screenId === 'welcome') {
      if (window.location.hash && window.location.hash !== '#') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  } catch(e) {}

  // حفظ الشاشة الحالية لتجنب فقدانها عند عمل ريفريش
  if (screenId && screenId !== 'landing' && screenId !== 'welcome' && !isAuthScreen) {
    try {
      sessionStorage.setItem('accountera_current_screen', screenId);
    } catch(e) {}
  }

  // إدارة ظهور ونشاط الشريط الجانبي ونمط صفحة الهبوط
  const isLandingScreen = (screenId === 'landing' || screenId === 'welcome');
  const isAdminScreen = screenId.startsWith('admin-');
  const isAdminUser = currentUser && currentUser.role === 'admin';
  const shouldHideSidebar = isLandingScreen || isAuthScreen || isAdminScreen || isAdminUser;

  // إدارة وضع صفحة المصادقة المستقلة (إخفاء التوب بار وشريط التنقل والقوائم بالكامل)
  document.body.classList.toggle('auth-page-mode', isAuthScreen);
  document.body.classList.toggle('landing-mode', isLandingScreen);

  const topbar = document.querySelector('.topbar');
  const bottomNav = document.querySelector('.bottom-nav');
  if (topbar) {
    topbar.style.display = isAuthScreen ? 'none' : '';
  }
  if (bottomNav) {
    bottomNav.style.display = isAuthScreen ? 'none' : '';
  }

  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    if (shouldHideSidebar) {
      sidebar.classList.add('landing-hidden');
      sidebar.style.display = 'none';
    } else {
      sidebar.classList.remove('landing-hidden');
      sidebar.style.display = '';
    }
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    const activeSidebarBtn = document.getElementById(`sb-${screenId}`) || document.getElementById(`sb-${screenId.split('-')[0]}`);
    if (activeSidebarBtn) activeSidebarBtn.classList.add('active');
  }

  // تحديث شريط التنقل السفلي للموبايل
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));

  // تحديث شريط التنقل العلوي للديسكتوب إن وجد
  document.querySelectorAll('.desktop-nav .nav-link').forEach(link => {
    const onclickAttr = link.getAttribute('onclick') || '';
    if (onclickAttr.includes(`'${screenId}'`) || onclickAttr.includes(`"${screenId}"`)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  if (screenId === 'landing' || screenId === 'welcome') {
    const activeBtn = document.getElementById('bn-landing');
    if (activeBtn) activeBtn.classList.add('active');
    if (typeof ExcelLandingView !== 'undefined') {
      appContainer.innerHTML = ExcelLandingView.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'login' || screenId === 'register') {
    if (typeof ExcelAuthView !== 'undefined') {
      appContainer.innerHTML = ExcelAuthView.render(screenId);
      if (typeof ExcelAuthView.animateEntrance === 'function') {
        ExcelAuthView.animateEntrance();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId.startsWith('lesson-')) {
    const activeBtn = document.getElementById('bn-lesson-1');
    if (activeBtn) activeBtn.classList.add('active');
    if (typeof ExcelLearningView !== 'undefined') {
      appContainer.innerHTML = ExcelLearningView.renderLesson(screenId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId.startsWith('ex-')) {
    if (typeof ExcelPracticeView !== 'undefined') {
      appContainer.innerHTML = ExcelPracticeView.renderExample(screenId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId.startsWith('ip-')) {
    if (typeof ExcelPracticeView !== 'undefined') {
      appContainer.innerHTML = ExcelPracticeView.renderIndependentPractice(screenId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'companies-hub' || screenId === 'company-overview') {
    const activeBtn = document.getElementById('bn-companies-hub');
    if (activeBtn) activeBtn.classList.add('active');
    if (typeof ExcelCompanyWorkspaceView !== 'undefined') {
      appContainer.innerHTML = ExcelCompanyWorkspaceView.renderCompaniesHub();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'company-workspace' || screenId.startsWith('company-')) {
    const activeBtn = document.getElementById('bn-companies-hub');
    if (activeBtn) activeBtn.classList.add('active');
    if (typeof ExcelCompanyWorkspaceView !== 'undefined') {
      appContainer.innerHTML = ExcelCompanyWorkspaceView.renderCompanyWorkspace();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'portfolio' || screenId === 'skills-passport') {
    if (typeof AccounteraPortfolioEngine !== 'undefined') {
      appContainer.innerHTML = AccounteraPortfolioEngine.renderPortfolioView();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'student-settings' || screenId === 'settings' || screenId === 'student-profile') {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    if (user && user.role === 'admin' && screenId === 'settings') {
      window.navigateToScreen('admin-settings');
      return;
    }
    if (typeof ExcelStudentSettingsView !== 'undefined') {
      appContainer.innerHTML = ExcelStudentSettingsView.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'student-dashboard' || screenId === 'student' || screenId === 'student-overview' || screenId === 'results' || screenId === 'progress') {
    const activeBtn = document.getElementById('bn-student-dashboard') || document.getElementById('bn-results');
    if (activeBtn) activeBtn.classList.add('active');
    if (typeof ExcelStudentDashboard !== 'undefined') {
      appContainer.innerHTML = ExcelStudentDashboard.render();
      if (typeof ExcelStudentDashboard.animateEntrance === 'function') {
        ExcelStudentDashboard.animateEntrance();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'teacher-overview' || screenId === 'teacher') {
    const currentUser = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const isTeacherOrAdmin = currentUser && (currentUser.role === 'teacher' || currentUser.role === 'admin');

    if (!isTeacherOrAdmin) {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast('هذا القسم مخصص للأساتذة والمعلمين فقط.', 'error');
      }
      appContainer.innerHTML = `
        <div style="background:#ffffff; border:1px solid #fed7aa; border-radius:18px; padding:3rem 2rem; text-align:center; max-width:540px; margin:3rem auto; box-shadow:0 4px 20px rgba(234,88,12,0.08);">
          <div style="width:64px; height:64px; border-radius:50%; background:#fff7ed; color:#ea580c; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('shield', { size: 28 }) : ''}
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">منطقة مخصصة للأساتذة والمعلمين</h2>
          <p style="color:#64748b; font-size:0.88rem; line-height:1.6; margin-bottom:1.5rem;">
            أنت مسجل حالياً كـ <strong>${currentUser ? currentUser.name : 'طالب متدرب'}</strong>. بوابة المعلم ومتابعة تقدم الفصول مخصصة للكادر التدريسي وإدارة المنصة فقط.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button class="btn-cta-primary" onclick="navigateToScreen('student-dashboard')">العودة للوحة دراستي</button>
            <button class="btn-cta-secondary" onclick="navigateToScreen('companies-hub')">التدريب على الشركات</button>
          </div>
        </div>
      `;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const teacherActiveBtn = document.getElementById('bn-teacher-overview');
    if (teacherActiveBtn) teacherActiveBtn.classList.add('active');
    if (typeof ExcelTeacherDashboard !== 'undefined') {
      appContainer.innerHTML = ExcelTeacherDashboard.render();
      ExcelTeacherDashboard.refreshData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'student-plans' || screenId === 'plans' || screenId === 'pricing' || screenId === 'upgrade') {
    const activeSidebarBtn = document.getElementById('sb-student-plans');
    if (activeSidebarBtn) activeSidebarBtn.classList.add('active');
    if (typeof ExcelStudentPlansView !== 'undefined') {
      appContainer.innerHTML = ExcelStudentPlansView.render();
      if (typeof ExcelStudentPlansView.init === 'function') {
        ExcelStudentPlansView.init();
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'admin' || screenId.startsWith('admin-')) {
    const currentUser = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const isAdmin = currentUser && currentUser.role === 'admin';

    if (!isAdmin) {
      if (screenId === 'admin-plans') {
        window.navigateToScreen('student-plans');
        return;
      }
      appContainer.innerHTML = `
        <div style="background:#ffffff; border:1px solid #fee2e2; border-radius:18px; padding:3rem 2rem; text-align:center; max-width:540px; margin:3rem auto; box-shadow:0 4px 20px rgba(239,68,68,0.08);">
          <div style="width:64px; height:64px; border-radius:50%; background:#fef2f2; color:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 1.25rem;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 28 }) : ''}
          </div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">منطقة إدارية مخصصة لمدير النظام فقط</h2>
          <p style="color:#64748b; font-size:0.88rem; line-height:1.6; margin-bottom:1.5rem;">
            أنت مسجل حالياً كـ <strong>${currentUser ? currentUser.name : 'طالب متدرب'}</strong>. لوحة تحكم الإدارة (Admin OS) مخصصة فقط لمسؤولي النظام لإدارة الباقات والتحكم المركزي.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button class="btn-cta-primary" onclick="navigateToScreen('student-dashboard')">العودة للوحة دراستي</button>
            <button class="btn-cta-secondary" onclick="navigateToScreen('student-plans')">استعراض الباقات والاشتراكات</button>
          </div>
        </div>
      `;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const adminActiveBtn = document.getElementById(`bn-${screenId}`) || document.getElementById('bn-admin-overview');
    if (adminActiveBtn) adminActiveBtn.classList.add('active');
    if (typeof ExcelAdminDashboard !== 'undefined') {
      const tabKey = screenId.startsWith('admin-') ? screenId.replace('admin-', '') : 'overview';
      if (document.getElementById('adminTabContent')) {
        ExcelAdminDashboard.switchTab(tabKey);
      } else {
        appContainer.innerHTML = ExcelAdminDashboard.render(screenId);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else {
    // شاشة قيد الإنشاء المؤقتة لباقي المسارات
    appContainer.innerHTML = `
      <div style="padding: 3rem 1rem; text-align: center; max-width: 500px; margin: 0 auto;">
        <div style="color: var(--text-muted); margin-bottom: 1rem; display: flex; justify-content: center;">
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 40 }) : ''}
        </div>
        <h2 style="font-weight: 800; margin-bottom: 0.5rem;">شاشة (${screenId})</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">جاري إعادة هيكلتها وتطويرها لتكون متجاوبة 100% مع الهواتف المحمولة.</p>
        <button class="btn-cta-primary" onclick="navigateToScreen('landing')">العودة للرئيسية</button>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // تأثير انتقال ناعم وخفيف عبر GSAP للشاشات الداخلية
  if (!isAuthScreen && typeof gsap !== 'undefined') {
    gsap.fromTo(appContainer, { opacity: 0.88, y: 5 }, { opacity: 1, y: 0, duration: 0.22, ease: 'power1.out' });
  }

  // تحديث الحركات التفاعلية الخاصة بالشاشة
  if (typeof AccounteraAnimations !== 'undefined') {
    AccounteraAnimations.refreshAnimations(screenId);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  // تنظيف فوري لمفتاح خطط الباقات القديمة من التخزين المحلي لضمان المزامنة السحابية الحية
  try {
    localStorage.removeItem('acc_admin_plans');
  } catch(e) {}

  // تهيئة محرك المؤثرات الحركية GSAP
  if (typeof AccounteraAnimations !== 'undefined') {
    AccounteraAnimations.init();
  }

  // تهيئة عميل Supabase السحابي
  if (typeof SupabaseService !== 'undefined') {
    SupabaseService.init();
    if (typeof SupabaseService.getActivePlans === 'function') {
      SupabaseService.getActivePlans().catch(() => {});
    }
  }

  const savedTheme = localStorage.getItem('accountera_theme') || 'light';
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.innerHTML = savedTheme === 'dark' ? sunSvg : moonSvg;
  }

  // تهيئة نظام المصادقة والتحقق الفعلي من الجلسة السحابية قبل التوجيه
  if (typeof AuthService !== 'undefined') {
    try {
      await AuthService.init();
    } catch (e) {
      console.warn('[main.js] AuthService init error:', e);
    }
  }

  // إنشاء درج الموبايل الجانبي فورياً
  if (typeof window.createMobileNavDrawer === 'function') {
    window.createMobileNavDrawer();
  }

  // الاستماع لتغير الـ hash في المتصفح للتنقل المباشر ودعم أزرار الرجوع والتقدم
  window.addEventListener('hashchange', () => {
    const targetHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (targetHash) {
      const current = sessionStorage.getItem('accountera_current_screen');
      if (targetHash !== current) {
        window.navigateToScreen(targetHash);
      }
    } else {
      window.navigateToScreen('landing');
    }
  });

  // فحص معلمات الرابط أو الهاش المباشر أو الجلسة المحفوظة
  const urlParams = new URLSearchParams(window.location.search);
  const hashScreen = window.location.hash ? window.location.hash.replace(/^#\/?/, '').trim() : '';
  let savedScreen = null;
  try {
    savedScreen = sessionStorage.getItem('accountera_current_screen');
  } catch(e) {}
  const requestedScreen = urlParams.get('screen') || hashScreen || savedScreen;
  const requestedTheme = urlParams.get('theme');
  if (requestedTheme) {
    document.documentElement.setAttribute('data-theme', requestedTheme);
  }

  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (requestedScreen && requestedScreen !== 'landing') {
    window.navigateToScreen(requestedScreen);
  } else {
    if (currentUser) {
      AuthService.redirectAfterLogin(currentUser);
    } else {
      window.navigateToScreen('landing');
    }
  }
});
