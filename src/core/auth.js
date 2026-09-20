/**
 * auth.js — إدارة المصادقة والجلسات والتوجيه التلقائي بعد الدخول
 */

const AuthService = {
  currentUser: null,

  init() {
    try {
      const saved = localStorage.getItem('accountera_user');
      if (saved) {
        this.currentUser = JSON.parse(saved);
      }
    } catch (e) {
      this.currentUser = null;
    }
    this.updateTopBarUI();
  },

  getCurrentUser() {
    return this.currentUser;
  },

  setCurrentUser(user, redirect = true) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('accountera_user', JSON.stringify(user));
      this.updateTopBarUI();
      if (redirect) {
        this.redirectAfterLogin(user);
      }
    } else {
      localStorage.removeItem('accountera_user');
      this.updateTopBarUI();
      if (redirect && typeof window.navigateToScreen === 'function') {
        window.navigateToScreen('landing');
      }
    }
  },

  // توجيه المستخدم تلقائياً للشاشة المخصصة لدوره فور الدخول
  redirectAfterLogin(user) {
    if (typeof window.navigateToScreen !== 'function') return;

    if (user.role === 'admin') {
      window.navigateToScreen('admin-overview');
    } else if (user.role === 'teacher') {
      window.navigateToScreen('teacher-overview');
    } else {
      // الطالب يدخل مباشرة على لوحة تحكم الطالب
      window.navigateToScreen('student-dashboard');
    }
  },

  openAuthModal(mode = 'login') {
    let overlay = document.getElementById('authModalOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'authModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) AuthService.closeAuthModal();
      };
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div class="modal-sheet">
        <span class="sheet-drag-handle"></span>
        
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="modal-icon-badge">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 24 }) : ''}</div>
            <div>
              <h3 class="modal-title" id="authTitle">${mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h3>
              <p style="font-size: 0.82rem; color: var(--text-muted); margin: 2px 0 0;">منصة اكاونتيرا للمحاكاة المحاسبية</p>
            </div>
          </div>
          <button class="modal-close-btn" onclick="AuthService.closeAuthModal()">✕</button>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab-btn ${mode === 'login' ? 'active' : ''}" onclick="AuthService.switchAuthTab('login')">
            تسجيل الدخول
          </button>
          <button class="auth-tab-btn ${mode === 'register' ? 'active' : ''}" onclick="AuthService.switchAuthTab('register')">
            إنشاء حساب
          </button>
        </div>

        <!-- نموذج تسجيل الدخول -->
        <form id="authForm" onsubmit="AuthService.handleAuthSubmit(event, '${mode}')">
          <div id="registerFields" style="display: ${mode === 'register' ? 'block' : 'none'};">
            <div class="form-group">
              <label class="form-label">الاسم الكامل:</label>
              <input type="text" id="authName" class="form-input" placeholder="مثال: سارة المحاسبة">
            </div>
            <div class="form-group">
              <label class="form-label">نوع الحساب / الدور:</label>
              <select id="authRole" class="form-input">
                <option value="student">طالب / محاسب مبتدئ</option>
                <option value="teacher">مدرب / مدرس محاسبة</option>
                <option value="admin">مدير النظام</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">البريد الإلكتروني:</label>
            <input type="email" id="authEmail" class="form-input" placeholder="name@domain.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور:</label>
            <input type="password" id="authPassword" class="form-input" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn-cta-primary" style="width:100%; justify-content:center; margin-top:1rem;">
            ${mode === 'login' ? 'دخول المنصة' : 'إنشاء الحساب والتفعيل'}
          </button>
        </form>

        <!-- أزرار الدخول السريع لاختبار الأدوار -->
        <div class="quick-roles-wrap">
          <div class="quick-roles-title">تجربة فورية مباشرة دون تسجيل:</div>
          <div class="roles-grid">
            <button class="role-pill-btn" onclick="AuthService.quickLogin('student', 'طالب محاسبة')">
              <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('graduation-cap', { size: 16 }) : ''}</span>
              <span>طالب</span>
            </button>
            <button class="role-pill-btn" onclick="AuthService.quickLogin('teacher', 'أ. د. محمد شاكر')">
              <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 16 }) : ''}</span>
              <span>مدرس</span>
            </button>
            <button class="role-pill-btn" onclick="AuthService.quickLogin('admin', 'مدير النظام')">
              <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 16 }) : ''}</span>
              <span>مدير</span>
            </button>
          </div>
        </div>
      </div>
    `;

    setTimeout(() => overlay.classList.add('active'), 10);
  },

  switchAuthTab(mode) {
    this.openAuthModal(mode);
  },

  closeAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 250);
    }
  },

  handleAuthSubmit(e, mode) {
    e.preventDefault();
    const email = document.getElementById('authEmail')?.value;
    const name = document.getElementById('authName')?.value || email.split('@')[0];
    const role = document.getElementById('authRole')?.value || 'student';

    this.closeAuthModal();
    this.setCurrentUser({
      name: name,
      email: email,
      role: role
    }, true);
  },

  quickLogin(role, name) {
    this.closeAuthModal();
    this.setCurrentUser({
      name: name,
      email: `${role}@accountera.com`,
      role: role
    }, true);
  },

  logout() {
    this.setCurrentUser(null, true);
  },

  updateNavigationForRole() {
    const desktopNav = document.querySelector('.desktop-nav');
    const bottomNav = document.querySelector('.bottom-nav');
    const currentRole = this.currentUser ? this.currentUser.role : 'student';

    if (currentRole === 'admin') {
      // شريط الملاحة الخاص بالمسؤول / الإدارة
      if (desktopNav) {
        desktopNav.innerHTML = `
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-overview')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 16 }) : ''}
            <span>المؤشرات العامة</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-companies')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 16 }) : ''}
            <span>محاكاة الشركات</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-plans')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 16 }) : ''}
            <span>الباقات والتسعير</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-coupons')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('ticket', { size: 16 }) : ''}
            <span>أكواد الخصم</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-users')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('users', { size: 16 }) : ''}
            <span>دليل المستخدمين</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-audit')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('search', { size: 16 }) : ''}
            <span>إدارة التدقيق</span>
          </a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('admin-settings')">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 16 }) : ''}
            <span>الإعدادات العامة</span>
          </a>
        `;
      }
      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="bottom-nav-item active" id="bn-admin-overview" onclick="navigateToScreen('admin-overview')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 20 }) : ''}</span>
            <span>المؤشرات</span>
          </button>
          <button class="bottom-nav-item" id="bn-admin-companies" onclick="navigateToScreen('admin-companies')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 20 }) : ''}</span>
            <span>الشركات</span>
          </button>
          <button class="bottom-nav-item" id="bn-admin-plans" onclick="navigateToScreen('admin-plans')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 20 }) : ''}</span>
            <span>الباقات</span>
          </button>
          <button class="bottom-nav-item" id="bn-admin-users" onclick="navigateToScreen('admin-users')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('users', { size: 20 }) : ''}</span>
            <span>المستخدمين</span>
          </button>
          <button class="bottom-nav-item" id="bn-admin-settings" onclick="navigateToScreen('admin-settings')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 20 }) : ''}</span>
            <span>الإعدادات</span>
          </button>
        `;
      }
    } else if (currentRole === 'teacher') {
      // شريط ملاحة المعلم
      if (desktopNav) {
        desktopNav.innerHTML = `
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('teacher-overview')">لوحة المتابعة والتقييم</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('lesson-1')">معاينة الدروس</a>
        `;
      }
      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="bottom-nav-item active" id="bn-teacher-overview" onclick="navigateToScreen('teacher-overview')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 20 }) : ''}</span>
            <span>لوحة المتابعة</span>
          </button>
          <button class="bottom-nav-item" id="bn-lesson-1" onclick="navigateToScreen('lesson-1')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 20 }) : ''}</span>
            <span>الدروس</span>
          </button>
        `;
      }
    } else {
      // شريط ملاحة الطالب الافتراضي
      if (desktopNav) {
        desktopNav.innerHTML = `
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('landing')">الرئيسية</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('student-dashboard')">لوحة الطالب</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('portfolio')">محفظة الكفاءة</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('student-settings')">إعدادات الحساب</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('lesson-1')">المسار التعليمي</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('ex-1')">الأمثلة المحلولة</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('ip-1')">التمارين المستقلة</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('companies-hub')">بيئة الشركات</a>
        `;
      }
      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="bottom-nav-item active" id="bn-landing" onclick="navigateToScreen('landing')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('house', { size: 20 }) : ''}</span>
            <span>الرئيسية</span>
          </button>
          <button class="bottom-nav-item" id="bn-student-dashboard" onclick="navigateToScreen('student-dashboard')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('graduation-cap', { size: 20 }) : ''}</span>
            <span>لوحتي</span>
          </button>
          <button class="bottom-nav-item" id="bn-lesson-1" onclick="navigateToScreen('lesson-1')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 20 }) : ''}</span>
            <span>الدروس</span>
          </button>
          <button class="bottom-nav-item" id="bn-companies-hub" onclick="navigateToScreen('companies-hub')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 20 }) : ''}</span>
            <span>الشركات</span>
          </button>
        `;
      }
    }
  },

  updateTopBarUI() {
    this.updateNavigationForRole();
    const authDock = document.getElementById('topbarAuthDock');
    if (!authDock) return;

    if (this.currentUser) {
      const initial = this.currentUser.name ? this.currentUser.name.trim().charAt(0).toUpperCase() : 'M';
      authDock.innerHTML = `
        <div class="accountely-topbar-actions">
          <button onclick="navigateToScreen('student-plans')" class="accountely-promo-pill">
            <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 14 }) : ''}</span>
            <span>Refer & earn 20%</span>
          </button>
          
          <button onclick="navigateToScreen('student-plans')" class="accountely-upgrade-btn">
            <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('star', { size: 14 }) : ''}</span>
            <span>Upgrade • ترقية</span>
          </button>

          <div class="accountely-bell-btn" onclick="navigateToScreen('student-dashboard')" title="الإشعارات والتنبيهات">
            <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('bell', { size: 16 }) : ''}</span>
            <span style="position:absolute; top:-3px; right:-3px; background:#ef4444; color:#fff; font-size:0.65rem; font-weight:800; width:15px; height:15px; border-radius:50%; display:flex; align-items:center; justify-content:center;">1</span>
          </div>

          <div class="accountely-user-dock" onclick="navigateToScreen('student-settings')" title="إعدادات الحساب والملف الشخصي">
            <span style="font-size:0.85rem; font-weight:700; color:var(--text-primary); margin-left:4px;">${this.currentUser.name || 'مستخدم'}</span>
            <div style="width:28px; height:28px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.82rem;">${initial}</div>
          </div>
          
          <button onclick="AuthService.logout()" class="sidebar-toggle-btn" style="width:32px; height:32px; border-radius:50%; margin-right:4px;" title="تسجيل الخروج">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('x', { size: 16 }) : '×'}
          </button>
        </div>
      `;
    } else {
      authDock.innerHTML = `
        <button class="accountely-upgrade-btn" style="background:#10b981; color:#fff; border:none; display:inline-flex; align-items:center; gap:6px;" onclick="AuthService.openAuthModal('login')">
          <span>دخول المنصة / Login</span>
        </button>
      `;
    }
  }
};

const AccModal = {
  toast(message, type = 'success', duration = 3500) {
    let container = document.getElementById('accToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'accToastContainer';
      container.className = 'acc-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `acc-toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    toast.innerHTML = `
      <span class="acc-toast-icon">${icon}</span>
      <span class="acc-toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  confirm(options) {
    const opts = typeof options === 'string' ? { message: options } : (options || {});
    const title = opts.title || 'تأكيد الإجراء';
    const message = opts.message || '';
    const confirmText = opts.confirmText || 'نعم، متابعة';
    const cancelText = opts.cancelText || 'إلغاء';
    const danger = opts.danger || false;
    const defaultIcon = danger 
      ? (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('warning', { size: 36 }) : '')
      : (typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('question', { size: 36 }) : '');
    const icon = opts.icon || defaultIcon;

    return new Promise((resolve) => {
      let overlay = document.getElementById('accConfirmModalOverlay');
      if (overlay) overlay.remove();

      overlay = document.createElement('div');
      overlay.id = 'accConfirmModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close(false);
        }
      };

      overlay.innerHTML = `
        <div class="modal-sheet" style="max-width: 440px; text-align: center; padding: 32px 24px;">
          <div class="modal-alert-icon ${danger ? 'icon-danger' : 'icon-warning'}">
            ${icon}
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 8px; color: var(--text-primary);">${title}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 24px;">${message}</p>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-workspace-action" id="accConfirmCancelBtn" style="padding: 10px 22px; flex: 1;">${cancelText}</button>
            <button class="btn-workspace-action btn-workspace-primary" id="accConfirmOkBtn" style="padding: 10px 22px; flex: 1; ${danger ? 'background: #dc2626; color: #fff;' : ''}">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add('active'), 10);

      function close(result) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 250);
        resolve(result);
      }

      overlay.querySelector('#accConfirmCancelBtn').onclick = () => close(false);
      overlay.querySelector('#accConfirmOkBtn').onclick = () => close(true);
    });
  },

  alert(options) {
    const opts = typeof options === 'string' ? { message: options } : (options || {});
    const title = opts.title || 'تنبيه';
    const message = opts.message || '';
    const icon = opts.icon || 'ℹ️';
    const buttonText = opts.buttonText || 'حسناً';

    return new Promise((resolve) => {
      let overlay = document.getElementById('accAlertModalOverlay');
      if (overlay) overlay.remove();

      overlay = document.createElement('div');
      overlay.id = 'accAlertModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close();
        }
      };

      overlay.innerHTML = `
        <div class="modal-sheet" style="max-width: 440px; text-align: center; padding: 32px 24px;">
          <div class="modal-alert-icon icon-info">
            ${icon}
          </div>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin: 0 0 8px; color: var(--text-primary);">${title}</h3>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6; margin: 0 0 24px;">${message}</p>
          <button class="btn-workspace-action btn-workspace-primary" id="accAlertOkBtn" style="width: 100%; justify-content: center; padding: 12px;">${buttonText}</button>
        </div>
      `;

      document.body.appendChild(overlay);
      setTimeout(() => overlay.classList.add('active'), 10);

      function close() {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 250);
        resolve();
      }

      overlay.querySelector('#accAlertOkBtn').onclick = () => close();
    });
  },

  prompt(options) {
    const opts = typeof options === 'string' ? { title: options } : (options || {});
    const title = opts.title || 'إدخال بيانات';
    const message = opts.message || '';
    const placeholder = opts.placeholder || '';
    const defaultValue = opts.defaultValue || '';
    const confirmText = opts.confirmText || 'تأكيد';
    const cancelText = opts.cancelText || 'إلغاء';

    return new Promise((resolve) => {
      let overlay = document.getElementById('accPromptModalOverlay');
      if (overlay) overlay.remove();

      overlay = document.createElement('div');
      overlay.id = 'accPromptModalOverlay';
      overlay.className = 'modal-overlay';
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close(null);
        }
      };

      overlay.innerHTML = `
        <div class="modal-sheet" style="max-width: 460px; padding: 28px 24px;">
          <h3 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 10px; color: var(--text-primary); text-align: center;">${title}</h3>
          ${message ? `<p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; margin: 0 0 16px; text-align: center;">${message}</p>` : ''}
          <div class="form-group" style="margin-bottom: 20px;">
            <input type="text" id="accPromptInput" class="form-control" placeholder="${placeholder}" value="${defaultValue}" style="width: 100%; font-size: 0.95rem; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border-subtle); background: var(--bg-secondary); color: var(--text-primary);">
          </div>
          <div style="display: flex; gap: 10px; justify-content: center;">
            <button class="btn-workspace-action" id="accPromptCancelBtn" style="padding: 10px 20px; flex: 1;">${cancelText}</button>
            <button class="btn-workspace-action btn-workspace-primary" id="accPromptOkBtn" style="padding: 10px 20px; flex: 1;">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.classList.add('active');
        const input = overlay.querySelector('#accPromptInput');
        if (input) {
          input.focus();
          input.select();
        }
      }, 10);

      function close(val) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 250);
        resolve(val);
      }

      overlay.querySelector('#accPromptCancelBtn').onclick = () => close(null);
      overlay.querySelector('#accPromptOkBtn').onclick = () => {
        const val = overlay.querySelector('#accPromptInput').value.trim();
        close(val);
      };
      overlay.querySelector('#accPromptInput').onkeydown = (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const val = overlay.querySelector('#accPromptInput').value.trim();
          close(val);
        } else if (e.key === 'Escape') {
          close(null);
        }
      };
    });
  }
};

if (typeof window !== 'undefined') {
  window.AuthService = AuthService;
  window.AccModal = AccModal;
  document.addEventListener('DOMContentLoaded', () => AuthService.init());
}
