/**
 * auth-view.js — شاشة تسجيل الدخول وإنشاء الحساب المنفصلة (Stitch Design System)
 * واجهة دخول وتسجيل عصرية متكاملة مطابقة لتصميم Google Stitch
 */

const ExcelAuthView = {
  currentMode: 'login', // 'login' | 'register'
  passwordVisible: false,

  render(mode = 'login') {
    this.currentMode = mode === 'register' ? 'register' : 'login';
    const isLogin = this.currentMode === 'login';

    const isDev = (typeof window !== 'undefined') && 
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:');

    return `
      <div class="stitch-auth-wrapper" dir="rtl" lang="ar">
        <!-- Ambient Grid & Glowing Accents -->
        <div aria-hidden="true" class="stitch-subtle-grid"></div>
        <div aria-hidden="true" class="stitch-ambient-glow-1"></div>
        <div aria-hidden="true" class="stitch-ambient-glow-2"></div>
        <div aria-hidden="true" class="stitch-ambient-glow-3"></div>

        <!-- Top Navigation Header -->
        <header class="stitch-auth-header" data-purpose="top-navigation">
          <!-- Brand Identity -->
          <a class="stitch-brand-logo" onclick="navigateToScreen('landing')" role="button" tabindex="0" title="منصة Accountera">
            <div class="stitch-brand-icon">
              <!-- Modern Ledger SVG -->
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#060911" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"></path>
                <path d="M8 7h6"></path>
                <path d="M8 11h8"></path>
                <path d="M8 15h4"></path>
              </svg>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="stitch-brand-title">ACCOUNTERA</span>
              <span class="stitch-suite-pill">SUITE</span>
            </div>
          </a>

          <!-- Utility Actions -->
          <div class="stitch-header-actions">
            <a class="stitch-header-help" href="javascript:void(0)" onclick="if(typeof AccModal !== 'undefined' && AccModal.alert) { AccModal.alert({ title: 'مركز المساعدة', message: 'لأي استفسار تواصل مع الدعم الفني: support@accountera.com', icon: '💡' }); } else { alert('مركز المساعدة: support@accountera.com'); }">
              <span>مركز المساعدة والتوجيه</span>
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="opacity: 0.7;">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </a>
            <a class="stitch-header-back-btn" onclick="navigateToScreen('landing')" role="button" tabindex="0">
              <span>الرئيسية</span>
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="transform: rotate(180deg);">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </a>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="stitch-auth-main">
          <div class="stitch-auth-grid">
            
            <!-- Left Column: Realistic Simulation Showcase (Desktop Only >= 1024px) -->
            <div class="stitch-showcase-col" data-purpose="platform-showcase">
              <div>
                <div class="stitch-badge-pill">
                  <span class="stitch-pulse-dot"></span>
                  <span>بيئة المحاكاة المحاسبية السحابية #1</span>
                </div>
                <h1 class="stitch-showcase-heading">
                  تدرب على قيود اليومية الواقعية، القوائم المالية، والأنظمة السحابية.
                </h1>
                <p class="stitch-showcase-desc">
                  انضم إلى مجتمع أكثر من <strong style="color: #34d399; font-weight: 800;" class="stitch-font-num">+15,000</strong> محاسب ومالي يُعدّون أنفسهم فعلياً لمتطلبات مكاتب التدقيق والشركات الكبرى.
                </p>
              </div>

              <!-- Journal Entry Card Simulation Preview -->
              <div class="stitch-journal-preview-card" data-purpose="journal-entry-preview">
                <div class="stitch-jp-header">
                  <div class="stitch-jp-title-group">
                    <div class="stitch-jp-icon-box">
                      <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.5L19 7.5V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                      </svg>
                    </div>
                    <div>
                      <div class="stitch-jp-name">قيد إثبات إيراد المبيعات الآجلة</div>
                      <div class="stitch-jp-code">JV-2026-0841 • قيد يومية متزن</div>
                    </div>
                  </div>
                  <span class="stitch-jp-status">
                    <span class="stitch-jp-status-dot"></span>
                    <span>قيد معتمد ومرحّل</span>
                  </span>
                </div>

                <!-- Mini Ledger Table -->
                <div class="stitch-ledger-table">
                  <div class="stitch-ledger-row header">
                    <span>اسم الحساب الدفتري</span>
                    <span style="text-align: left;">مدين (SAR)</span>
                    <span style="text-align: left;">دائن (SAR)</span>
                  </div>

                  <div class="stitch-ledger-row">
                    <div class="stitch-ledger-account">
                      <span class="stitch-acc-code">1102</span>
                      <span>حـ/ العملاء - شركة النور الحديثة</span>
                    </div>
                    <span class="stitch-val-debit">23,000.00</span>
                    <span class="stitch-val-empty">—</span>
                  </div>

                  <div class="stitch-ledger-row">
                    <div class="stitch-ledger-account">
                      <span class="stitch-acc-code">4101</span>
                      <span>حـ/ إيرادات تقديم الخدمات الاستشارية</span>
                    </div>
                    <span class="stitch-val-empty">—</span>
                    <span class="stitch-val-credit">20,000.00</span>
                  </div>

                  <div class="stitch-ledger-row">
                    <div class="stitch-ledger-account">
                      <span class="stitch-acc-code">2205</span>
                      <span>حـ/ ضريبة القيمة المضافة المحصلة (15%)</span>
                    </div>
                    <span class="stitch-val-empty">—</span>
                    <span class="stitch-val-credit">3,000.00</span>
                  </div>
                </div>

                <!-- Totals -->
                <div class="stitch-jp-footer">
                  <span class="stitch-jp-footer-label">مجموع أطراف القيد (توازن تلقائي)</span>
                  <div class="stitch-jp-totals">
                    <span style="color: #34d399;">23,000.00 SAR</span>
                    <span style="color: #94a3b8;">=</span>
                    <span style="color: #6ee7b7;">23,000.00 SAR</span>
                  </div>
                </div>

                <!-- Floating Verification Badge -->
                <div class="stitch-floating-badge">
                  <div class="stitch-fb-check">✓</div>
                  <div>
                    <p class="stitch-fb-title">مطابق للمعايير IFRS / SOCPA</p>
                    <p class="stitch-fb-sub">تطبيق تفاعلي للمبتدئين والمحترفين</p>
                  </div>
                </div>
              </div>

              <!-- Trust Stats Badges -->
              <div class="stitch-trust-grid">
                <div class="stitch-trust-card">
                  <div class="stitch-trust-num">+15,400</div>
                  <div class="stitch-trust-label">محاسب تخرج بنجاح</div>
                </div>
                <div class="stitch-trust-card">
                  <div class="stitch-trust-num teal">98.4%</div>
                  <div class="stitch-trust-label">نسبة قبول التوظيف</div>
                </div>
                <div class="stitch-trust-card">
                  <div class="stitch-trust-num emerald">100%</div>
                  <div class="stitch-trust-label">محاكاة عملية واقعية</div>
                </div>
              </div>
            </div>

            <!-- Right Column: Glassmorphism Authentication Form Card -->
            <div class="stitch-glass-card-col">
              <div class="stitch-glass-card">
                
                <!-- Card Header -->
                <div class="stitch-card-header">
                  <div class="stitch-card-brand-icon-wrap">
                    <div class="stitch-card-brand-icon-inner">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3">
                        <rect x="3" y="3" width="18" height="18" rx="4"></rect>
                        <path d="M7 8h10"></path>
                        <path d="M7 12h10"></path>
                        <path d="M7 16h6"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="stitch-card-suite-pill">
                    <span class="stitch-pulse-dot" style="width: 5px; height: 5px;"></span>
                    <span>SUITE • ACCOUNTERA</span>
                  </div>
                  <h2 class="stitch-card-title">
                    ${isLogin ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
                  </h2>
                  <p class="stitch-card-subtitle">
                    المنصة التطبيقية الأولى لإعداد المحاسبين الماليين لسوق العمل
                  </p>
                </div>

                <!-- Tabs: Sign In / Create Account -->
                <div class="stitch-auth-tabs">
                  <button type="button" class="stitch-tab-btn ${isLogin ? 'active' : ''}" onclick="ExcelAuthView.switchMode('login')">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>تسجيل الدخول</span>
                  </button>
                  <button type="button" class="stitch-tab-btn ${!isLogin ? 'active' : ''}" onclick="ExcelAuthView.switchMode('register')">
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                    </svg>
                    <span>إنشاء حساب</span>
                  </button>
                </div>

                <!-- Error Alert Box -->
                <div id="authErrorAlert" class="stitch-auth-alert"></div>

                <!-- Form -->
                <form id="authForm" class="stitch-auth-form" onsubmit="AuthService.handleAuthSubmit(event, '${this.currentMode}')">
                  ${!isLogin ? `
                    <div class="stitch-field-row">
                      <!-- Full Name -->
                      <div class="stitch-field-group">
                        <label for="authName" class="stitch-field-label">
                          الاسم الكامل <span class="required">*</span>
                        </label>
                        <div class="stitch-input-wrap">
                          <div class="stitch-input-icon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              <circle cx="12" cy="7" r="4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></circle>
                            </svg>
                          </div>
                          <input type="text" id="authName" class="stitch-input-glass" placeholder="مثال: مصطفى محمد" required autocomplete="name">
                        </div>
                      </div>

                      <!-- Phone Number -->
                      <div class="stitch-field-group">
                        <label for="authPhone" class="stitch-field-label">
                          رقم الهاتف / واتساب <span class="required">*</span>
                        </label>
                        <div class="stitch-input-wrap">
                          <div class="stitch-input-icon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                          </div>
                          <input type="tel" id="authPhone" class="stitch-input-glass" placeholder="مثال: 01012345678" required autocomplete="tel" dir="ltr">
                        </div>
                      </div>
                    </div>

                    <div class="stitch-field-row">
                      <!-- University -->
                      <div class="stitch-field-group">
                        <label for="authUniversity" class="stitch-field-label">
                          الجامعة / الكلية <span class="required">*</span>
                        </label>
                        <div class="stitch-input-wrap">
                          <div class="stitch-input-icon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M12 14l9-5-9-5-9 5 9 5z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                              <path d="M12 14v7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                          </div>
                          <input type="text" id="authUniversity" class="stitch-input-glass" placeholder="مثال: تجارة القاهرة" required>
                        </div>
                      </div>

                      <!-- Academic Year -->
                      <div class="stitch-field-group">
                        <label for="authAcademicYear" class="stitch-field-label">
                          السنة الدراسية <span class="required">*</span>
                        </label>
                        <div class="stitch-input-wrap">
                          <div class="stitch-input-icon">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                            </svg>
                          </div>
                          <select id="authAcademicYear" class="stitch-input-glass" required>
                            <option value="" disabled selected>اختر السنة الدراسية...</option>
                            <option value="الفرقة الأولى">الفرقة الأولى</option>
                            <option value="الفرقة الثانية">الفرقة الثانية</option>
                            <option value="الفرقة الثالثة">الفرقة الثالثة</option>
                            <option value="الفرقة الرابعة">الفرقة الرابعة</option>
                            <option value="خريج حديث">خريج حديث</option>
                            <option value="دراسات عليا / ممارس">دراسات عليا / ممارس</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ` : ''}

                  <!-- Email Input -->
                  <div class="stitch-field-group">
                    <label for="authEmail" class="stitch-field-label">
                      البريد الإلكتروني <span class="required">*</span>
                    </label>
                    <div class="stitch-input-wrap">
                      <div class="stitch-input-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                      <input type="email" id="authEmail" class="stitch-input-glass" placeholder="name@example.com" required autocomplete="email" dir="ltr">
                    </div>
                  </div>

                  <!-- Password Input -->
                  <div class="stitch-field-group">
                    <div class="stitch-field-top">
                      <label for="authPassword" class="stitch-field-label">
                        كلمة المرور <span class="required">*</span>
                      </label>
                      ${isLogin ? `
                        <a class="stitch-forgot-link" onclick="if(typeof AccModal !== 'undefined' && AccModal.alert) { AccModal.alert({ title: 'استعادة كلمة المرور', message: 'يرجى إدخال بريدك الإلكتروني والضغط على زر الدخول، أو التواصل مع إدارة المنصة.', icon: '🔑' }); } else { alert('استعادة كلمة المرور: تواصل مع الدعم الفني'); }">
                          نسيت كلمة المرور؟
                        </a>
                      ` : `
                        <span style="font-size: 0.72rem; color: #64748b;">6 أحرف على الأقل</span>
                      `}
                    </div>
                    <div class="stitch-input-wrap">
                      <div class="stitch-input-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </div>
                      <input type="password" id="authPassword" class="stitch-input-glass with-toggle" placeholder="••••••••" required autocomplete="${isLogin ? 'current-password' : 'new-password'}" dir="ltr">
                      <button type="button" class="stitch-toggle-pwd-btn" onclick="ExcelAuthView.togglePasswordVisibility()" title="إظهار / إخفاء كلمة المرور">
                        <svg id="stitchEyeIcon" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Remember Me -->
                  <div class="stitch-remember-wrap">
                    <label class="stitch-checkbox-label">
                      <input type="checkbox" checked class="stitch-checkbox">
                      <span>تذكر تسجيل الدخول على هذا الجهاز</span>
                    </label>
                  </div>

                  <!-- Submit CTA Button -->
                  <button type="submit" id="authSubmitBtn" class="stitch-btn-primary">
                    <span>${isLogin ? 'دخول المنصة' : 'إنشاء الحساب والتفعيل'}</span>
                    <svg class="stitch-btn-arrow" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.3"></path>
                    </svg>
                  </button>
                </form>

                <!-- Divider -->
                <div class="stitch-divider">
                  <span>أو من خلال</span>
                </div>

                <!-- Google SSO Button -->
                <button type="button" id="googleAuthBtn" class="stitch-btn-social" onclick="AuthService.signInWithGoogle()" aria-label="تسجيل الدخول بحساب Google">
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                  </svg>
                  <span>المتابعة بحساب Google</span>
                </button>

                <!-- Security Assurance -->
                <div class="stitch-security-badge">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
                  </svg>
                  <span>اتصال مشفر وآمن بأعلى معايير الحماية 256-bit SSL</span>
                </div>

                <!-- Back Link -->
                <div class="stitch-card-back-wrap">
                  <a class="stitch-card-back-link" onclick="navigateToScreen('landing')" role="button" tabindex="0">
                    <span>←</span>
                    <span>العودة إلى الصفحة الرئيسية</span>
                  </a>
                </div>

                ${isDev ? `
                  <!-- Dev Only Quick Role Switching (Localhost) -->
                  <div class="stitch-dev-roles-wrap">
                    <div class="stitch-dev-roles-header">
                      <span class="stitch-dev-title">معاينة محلية (Localhost):</span>
                      <span class="stitch-dev-tag">Dev Only</span>
                    </div>
                    <div class="stitch-dev-grid">
                      <button type="button" class="stitch-dev-btn" onclick="AuthService.quickLogin('student', 'طالب محاسبة (تجريبي)')">طالب</button>
                      <button type="button" class="stitch-dev-btn" onclick="AuthService.quickLogin('teacher', 'أ. د. محمد شاكر (تجريبي)')">مدرس</button>
                      <button type="button" class="stitch-dev-btn" onclick="AuthService.quickLogin('admin', 'مدير النظام (تجريبي)')">مدير</button>
                    </div>
                  </div>
                ` : ''}

              </div>
            </div>

          </div>
        </main>

        <!-- Footer -->
        <footer class="stitch-auth-footer">
          <div class="stitch-footer-copy">
            <span class="stitch-pulse-dot" style="width: 6px; height: 6px;"></span>
            <p style="margin: 0;">© 2026 منصة Accountera. جميع الحقوق محفوظة لرواد المحاسبة المالية.</p>
          </div>
          <div class="stitch-footer-links">
            <a href="javascript:void(0)" class="stitch-footer-link" onclick="if(typeof AccModal !== 'undefined' && AccModal.alert) { AccModal.alert({ title: 'سياسة الخصوصية', message: 'نحن نلتزم بحماية بياناتك الشخصية ومعاملاتك المحاسبية بأعلى معايير التشفير.', icon: '🛡️' }); }">سياسة الخصوصية</a>
            <span>•</span>
            <a href="javascript:void(0)" class="stitch-footer-link" onclick="if(typeof AccModal !== 'undefined' && AccModal.alert) { AccModal.alert({ title: 'شروط الخدمة', message: 'المنصة مخصصة لتدريب وتأهيل المحاسبين الماليين وتطبيق المعايير المهنية.', icon: '📋' }); }">شروط الخدمة</a>
            <span>•</span>
            <a href="javascript:void(0)" class="stitch-footer-link" onclick="if(typeof AccModal !== 'undefined' && AccModal.alert) { AccModal.alert({ title: 'المساعدة التقنية', message: 'فريق الدعم الفني متواجد لمساعدتك 24/7 عبر البريد: support@accountera.com', icon: '🛠️' }); }">المساعدة التقنية</a>
          </div>
        </footer>
      </div>
    `;
  },

  switchMode(mode) {
    this.currentMode = mode;
    if (typeof window.navigateToScreen === 'function') {
      window.navigateToScreen(mode);
    } else {
      const app = document.getElementById('app');
      if (app) {
        app.innerHTML = this.render(mode);
        this.animateEntrance();
      }
    }
  },

  togglePasswordVisibility() {
    const pwdInput = document.getElementById('authPassword');
    const eyeIcon = document.getElementById('stitchEyeIcon');
    if (!pwdInput) return;

    this.passwordVisible = !this.passwordVisible;
    pwdInput.type = this.passwordVisible ? 'text' : 'password';

    if (eyeIcon) {
      if (this.passwordVisible) {
        // Eye off icon
        eyeIcon.innerHTML = `
          <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        `;
      } else {
        // Eye on icon
        eyeIcon.innerHTML = `
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
        `;
      }
    }
  },

  animateEntrance() {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.stitch-glass-card', 
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.2)' }
      );
      gsap.fromTo('.stitch-showcase-col',
        { opacity: 0, x: 25 },
        { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out', delay: 0.1 }
      );
    }
  },

  shakeError() {
    if (typeof gsap !== 'undefined') {
      gsap.fromTo('.stitch-glass-card',
        { x: -10 },
        { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => {
          gsap.set('.stitch-glass-card', { x: 0 });
        }}
      );
    }
  }
};

window.ExcelAuthView = ExcelAuthView;
