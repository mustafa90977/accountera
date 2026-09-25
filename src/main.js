/**
 * main.js — نقطة بدء تشغيل الواجهة وإدارة الشاشات والتوجيه الذكي
 */

// 1. نظام إدارة وتغيير الثيم (Theme Manager)
window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('accountera_theme', newTheme);
  
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    const sunSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    const moonSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    themeBtn.innerHTML = newTheme === 'dark' ? sunSvg : moonSvg;
    themeBtn.setAttribute('title', newTheme === 'dark' ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي');
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

// تهيئة الثيم المحفوظ عند التحميل
(function initTheme() {
  const savedTheme = localStorage.getItem('accountera_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

window.navigateToScreen = function(screenId) {
  console.log(`Navigating to screen: ${screenId}`);
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (screenId === 'admin' || screenId.startsWith('admin-')) {
    const currentUser = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const isAdmin = currentUser && (currentUser.role === 'admin' || currentUser.email === 'admin@accountera.edu');

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
  // تهيئة محرك المؤثرات الحركية GSAP
  if (typeof AccounteraAnimations !== 'undefined') {
    AccounteraAnimations.init();
  }

  // تهيئة عميل Supabase السحابي
  if (typeof SupabaseService !== 'undefined') {
    SupabaseService.init();
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

  // فحص معلمات الرابط أو حالة الدخول بعد اكتمال التحقق
  const urlParams = new URLSearchParams(window.location.search);
  let savedScreen = null;
  try {
    savedScreen = sessionStorage.getItem('accountera_current_screen');
  } catch(e) {}
  const requestedScreen = urlParams.get('screen') || savedScreen;
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
