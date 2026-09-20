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
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    themeBtn.setAttribute('title', newTheme === 'dark' ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي');
  }
};

// وظيفة طي/فتح الشريط الجانبي Accountely
window.toggleSidebar = function() {
  const sb = document.getElementById('appSidebar');
  if (sb) {
    sb.classList.toggle('collapsed');
    const icon = document.getElementById('sidebarToggleIcon');
    if (icon) icon.textContent = sb.classList.contains('collapsed') ? '❯' : '❮';
  }
};

// تهيئة الثيم المحفوظ عند التحميل
(function initTheme() {
  const savedTheme = localStorage.getItem('accountera_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

// 2. محرك التنقل بين الشاشات
window.navigateToScreen = function(screenId) {
  console.log(`Navigating to screen: ${screenId}`);
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // إدارة ظهور ونشاط الشريط الجانبي Accountely Sidebar
  const sidebar = document.getElementById('appSidebar');
  if (sidebar) {
    if (screenId === 'landing' || screenId === 'welcome') {
      sidebar.classList.add('landing-hidden');
    } else {
      sidebar.classList.remove('landing-hidden');
    }
    sidebar.style.display = ''; // السماح لـ CSS و @media بالتحكم في العرض على الموبايل
    document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
    const activeSidebarBtn = document.getElementById(`sb-${screenId}`) || document.getElementById(`sb-${screenId.split('-')[0]}`);
    if (activeSidebarBtn) activeSidebarBtn.classList.add('active');
  }

  // تحديث شريط التنقل السفلي للموبايل
  document.querySelectorAll('.bottom-nav-item').forEach(el => el.classList.remove('active'));

  // تحديث شريط التنقل العلوي للديسكتوب
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
          <div style="width:64px; height:64px; border-radius:50%; background:#fef2f2; color:#ef4444; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 1.25rem;">🔒</div>
          <h2 style="font-size:1.35rem; font-weight:800; color:#0f172a; margin-bottom:0.5rem;">منطقة إدارية مخصصة لمدير النظام فقط</h2>
          <p style="color:#64748b; font-size:0.88rem; line-height:1.6; margin-bottom:1.5rem;">
            أنت مسجل حالياً كـ <strong>${currentUser ? currentUser.name : 'طالب متدرب'}</strong>. لوحة تحكم الإدارة (Admin OS) مخصصة فقط لمسؤولي النظام لإدارة الباقات والتحكم المركزي.
          </p>
          <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
            <button class="btn-cta-primary" onclick="navigateToScreen('student-dashboard')">العودة للوحة دراستي 📊</button>
            <button class="btn-cta-secondary" onclick="navigateToScreen('student-plans')">استعراض الباقات والاشتراكات 💳</button>
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
        <div style="font-size: 2.5rem; margin-bottom: 1rem;">🚧</div>
        <h2 style="font-weight: 800; margin-bottom: 0.5rem;">شاشة (${screenId})</h2>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">جاري إعادة هيكلتها وتطويرها لتكون متجاوبة 100% مع الهواتف المحمولة.</p>
        <button class="btn-cta-primary" onclick="navigateToScreen('landing')">العودة للرئيسية</button>
      </div>
    `;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // تهيئة عميل Supabase السحابي
  if (typeof SupabaseService !== 'undefined') {
    SupabaseService.init();
  }

  const savedTheme = localStorage.getItem('accountera_theme') || 'light';
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  // تهيئة نظام المصادقة وتحديث القوائم العلوية
  if (typeof AuthService !== 'undefined') {
    AuthService.init();
  }

  // فحص حالة الدخول: إذا كان مسجلاً يدخل فوراً لمساحة عمله بدلاً من صفحة الهبوط
  const currentUser = typeof AuthService !== 'undefined' ? AuthService.getCurrentUser() : null;
  if (currentUser) {
    AuthService.redirectAfterLogin(currentUser);
  } else {
    window.navigateToScreen('landing');
  }
});
