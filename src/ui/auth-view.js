/**
 * auth-view.js — شاشة تسجيل الدخول وإنشاء الحساب المنفصلة (Standalone Auth Screen)
 * توفر واجهة دخول وتسجيل كاملة مستقلة كصفحة مستقلة بدلاً من النوافذ المنبثقة
 */

const ExcelAuthView = {
  currentMode: 'login', // 'login' | 'register'

  render(mode = 'login') {
    this.currentMode = mode === 'register' ? 'register' : 'login';
    const isLogin = this.currentMode === 'login';

    const isDev = (typeof window !== 'undefined') && 
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:');

    return `
      <div class="auth-page-wrapper" style="min-height: calc(100vh - 120px); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem; background: var(--bg-main);">
        <div class="auth-card" style="width: 100%; max-width: 460px; background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl, 20px); box-shadow: var(--elevation-3, 0 12px 32px rgba(0,0,0,0.06)); padding: 2.5rem 2.25rem; position: relative;">
          
          <!-- الشعار والترويسة -->
          <div style="text-align: center; margin-bottom: 2rem;">
            <div style="display: inline-flex; align-items: center; justify-content: center; width: 62px; height: 62px; border-radius: 18px; background: var(--primary-light, rgba(16, 185, 129, 0.1)); border: 1.5px solid var(--primary-border, rgba(16, 185, 129, 0.25)); color: var(--primary, #10b981); margin-bottom: 1rem;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 30, strokeWidth: 1.75 }) : '🔐'}
            </div>
            <h1 style="font-size: 1.55rem; font-weight: 900; color: var(--text-primary); margin: 0 0 6px;">
              ${isLogin ? 'تسجيل الدخول إلى Accountera' : 'إنشاء حساب جديد في Accountera'}
            </h1>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
              المنصة التطبيقية الأولى لإعداد المحاسبين الماليين لسوق العمل
            </p>
          </div>

          <!-- أزرار التبديل بين الدخول وإنشاء الحساب -->
          <div style="display: flex; background: var(--surface-ground, #f1f5f9); padding: 5px; border-radius: 12px; border: 1px solid var(--border-subtle); margin-bottom: 1.75rem;">
            <button type="button" onclick="ExcelAuthView.switchMode('login')" style="flex: 1; padding: 9px 0; border: none; border-radius: 9px; font-weight: 800; font-size: 0.88rem; cursor: pointer; transition: all 0.2s ease; ${isLogin ? 'background: var(--surface-card, #ffffff); color: var(--primary, #10b981); box-shadow: 0 2px 6px rgba(0,0,0,0.05);' : 'background: transparent; color: var(--text-secondary);'}">
              تسجيل الدخول
            </button>
            <button type="button" onclick="ExcelAuthView.switchMode('register')" style="flex: 1; padding: 9px 0; border: none; border-radius: 9px; font-weight: 800; font-size: 0.88rem; cursor: pointer; transition: all 0.2s ease; ${!isLogin ? 'background: var(--surface-card, #ffffff); color: var(--primary, #10b981); box-shadow: 0 2px 6px rgba(0,0,0,0.05);' : 'background: transparent; color: var(--text-secondary);'}">
              إنشاء حساب
            </button>
          </div>

          <!-- صندوق تنبيه الأخطاء -->
          <div id="authErrorAlert" style="display: none; background: var(--danger-bg, #fef2f2); border: 1px solid var(--danger-border, #fecaca); color: var(--danger, #ef4444); padding: 12px 16px; border-radius: 10px; font-size: 0.86rem; margin-bottom: 1.25rem; line-height: 1.5;"></div>

          <!-- نموذج إدخال البيانات -->
          <form id="authForm" onsubmit="AuthService.handleAuthSubmit(event, '${this.currentMode}')">
            ${!isLogin ? `
              <div style="margin-bottom: 1.15rem;">
                <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">الاسم الكامل:</label>
                <div style="position: relative;">
                  <input type="text" id="authName" class="form-input" placeholder="مثال: مصطفى محمد" required style="width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); font-size: 0.9rem;">
                </div>
              </div>
            ` : ''}

            <div style="margin-bottom: 1.15rem;">
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">البريد الإلكتروني:</label>
              <div style="position: relative;">
                <input type="email" id="authEmail" class="form-input" placeholder="name@domain.com" required autocomplete="email" style="width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); font-size: 0.9rem; text-align: left; direction: ltr;">
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                <label class="form-label" style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); margin: 0;">كلمة المرور:</label>
                ${!isLogin ? '<span style="font-size: 0.75rem; color: var(--text-muted);">6 أحرف على الأقل</span>' : ''}
              </div>
              <div style="position: relative;">
                <input type="password" id="authPassword" class="form-input" placeholder="••••••••" required autocomplete="${isLogin ? 'current-password' : 'new-password'}" style="width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); font-size: 0.9rem;">
              </div>
            </div>

            <button type="submit" id="authSubmitBtn" class="btn-cta-primary" style="width: 100%; padding: 12px; font-weight: 800; font-size: 0.95rem; border-radius: 10px; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <span>${isLogin ? 'دخول المنصة ✓' : 'إنشاء الحساب والتفعيل ✓'}</span>
            </button>
          </form>

          <!-- خيار الدخول عبر Google -->
          <div style="display: flex; align-items: center; margin: 1.5rem 0 1.25rem; gap: 10px;">
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
            <span style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">أو من خلال</span>
            <div style="flex: 1; height: 1px; background: var(--border-subtle);"></div>
          </div>

          <button type="button" id="googleAuthBtn" onclick="AuthService.signInWithGoogle()" class="btn-cta-secondary" style="width: 100%; justify-content: center; padding: 11px 14px; font-weight: 700; display: flex; align-items: center; gap: 10px; border-radius: 10px; font-size: 0.88rem; background: var(--surface-card); border: 1px solid var(--border-subtle);">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>المتابعة بحساب Google</span>
          </button>

          <!-- زر العودة للصفحة الرئيسية -->
          <div style="text-align: center; margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px dashed var(--border-subtle);">
            <button type="button" onclick="navigateToScreen('landing')" style="background: none; border: none; color: var(--text-secondary); font-size: 0.86rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: color 0.2s ease;">
              <span>← العودة إلى الصفحة الرئيسية</span>
            </button>
          </div>

          ${isDev ? `
            <!-- أزرار المعاينة المحلية المخصصة لبيئة التطوير فقط -->
            <div class="quick-roles-wrap" style="margin-top: 20px; border-top: 1px dashed var(--border-subtle); padding-top: 14px;">
              <div class="quick-roles-title" style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">معاينة محلية (بيئة تطوير Localhost فقط):</span>
                <span style="font-size: 0.7rem; background: var(--bg-secondary); padding: 2px 6px; border-radius: 4px; color: var(--text-muted);">Dev Only</span>
              </div>
              <div class="roles-grid" style="margin-top: 8px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                <button type="button" class="role-pill-btn" onclick="AuthService.quickLogin('student', 'طالب محاسبة (تجريبي)')" style="padding: 8px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  طالب
                </button>
                <button type="button" class="role-pill-btn" onclick="AuthService.quickLogin('teacher', 'أ. د. محمد شاكر (تجريبي)')" style="padding: 8px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  مدرس
                </button>
                <button type="button" class="role-pill-btn" onclick="AuthService.quickLogin('admin', 'مدير النظام (تجريبي)')" style="padding: 8px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); font-size: 0.78rem; font-weight: 700; cursor: pointer;">
                  مدير
                </button>
              </div>
            </div>
          ` : ''}

        </div>
      </div>
    `;
  },

  switchMode(mode) {
    if (typeof window.navigateToScreen === 'function') {
      window.navigateToScreen(mode);
    } else {
      const app = document.getElementById('app');
      if (app) app.innerHTML = this.render(mode);
    }
  }
};

window.ExcelAuthView = ExcelAuthView;
