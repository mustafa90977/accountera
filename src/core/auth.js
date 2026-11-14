/**
 * auth.js — إدارة المصادقة والجلسات والتوجيه التلقائي بعد الدخول
 */

const AuthService = {
  escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },
  currentUser: null,
  isInitializing: false,

  async init() {
    return await this.initSupabaseAuth();
  },

  async initSupabaseAuth() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    const isDev = (typeof window !== 'undefined') && 
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:');

    // استعادة الجلسة المحلية المحفوظة فوراً لتجنب فقدان الدخول عند الريفريش
    try {
      const saved = localStorage.getItem('accountera_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.id || parsed.email)) {
          this.currentUser = parsed;
          this.updateTopBarUI();
        }
      }
    } catch (e) {}

    const client = (typeof window !== 'undefined' && window.SupabaseService) ? window.SupabaseService.client : null;
    if (!client || !client.auth) {
      this.updateTopBarUI();
      this.isInitializing = false;
      return;
    }

    try {
      // الاستماع لتغيرات الجلسة (Login, Logout, Token Refresh)
      client.auth.onAuthStateChange(async (event, session) => {
        console.log('[AuthService] Supabase Auth Event:', event);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session && session.user) {
            await this.syncUserSession(session.user, false);
          }
        } else if (event === 'SIGNED_OUT') {
          this.clearAuthStorage();
          if (typeof window !== 'undefined' && window.ProgressService) {
            window.ProgressService.completedLessons = new Set();
          }
          this.updateTopBarUI();
          if (typeof window.navigateToScreen === 'function') {
            window.navigateToScreen('landing');
          }
        }
      });

      // التحقق من الجلسة الحالية
      const { data: { session }, error } = await client.auth.getSession();
      if (!error && session && session.user) {
        await this.syncUserSession(session.user, false);
      } else {
        // إذا لم توجد جلسة سحابية، نتحقق من وجود مستخدم صالح محفوظ محلياً
        let hasValidSavedSession = false;
        try {
          const saved = localStorage.getItem('accountera_user');
          if (saved) {
            const parsed = JSON.parse(saved);
            if (isDev && parsed && parsed.isDevTest) {
              this.currentUser = parsed;
              hasValidSavedSession = true;
            } else if (parsed && parsed.id && parsed.email && !parsed.isDevTest) {
              this.currentUser = parsed;
              hasValidSavedSession = true;
            }
          }
        } catch (e) {}

        if (hasValidSavedSession) {
          this.updateTopBarUI();
        } else {
          this.currentUser = null;
          localStorage.removeItem('accountera_user');
          try { sessionStorage.removeItem('accountera_current_screen'); } catch(e) {}
          this.updateTopBarUI();
          if (typeof window.navigateToScreen === 'function') {
            const urlParams = (typeof window !== 'undefined') ? new URLSearchParams(window.location.search) : null;
            const hash = (typeof window !== 'undefined' && window.location.hash) ? window.location.hash.replace(/^#\/?/, '').trim() : '';
            const requestedScreen = (urlParams ? urlParams.get('screen') : null) || hash;
            const publicScreens = ['landing', 'welcome'];
            if (!requestedScreen || (!publicScreens.includes(requestedScreen) && requestedScreen !== 'login' && requestedScreen !== 'register')) {
              window.navigateToScreen('landing');
            }
          }
        }
      }
    } catch (err) {
      console.warn('[AuthService] Error checking Supabase session:', err);
      const current = this.getCurrentUser();
      if (!current) {
        this.currentUser = null;
        localStorage.removeItem('accountera_user');
        try { sessionStorage.removeItem('accountera_current_screen'); } catch(e) {}
        this.updateTopBarUI();
      }
    } finally {
      this.isInitializing = false;
    }
  },

  // مزامنة بيانات المستخدم الحقيقي من جدول profiles
  async syncUserSession(authUser, redirect = false) {
    let role = 'student';
    let fullName = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'طالب';

    const client = window.SupabaseService?.client;
    if (client) {
      try {
        const { data: profile, error } = await client
          .from('profiles')
          .select('role, full_name')
          .eq('id', authUser.id)
          .maybeSingle();

        if (!error && profile) {
          role = profile.role || 'student';
          fullName = profile.full_name || fullName;
        }
      } catch (e) {
        console.warn('[AuthService] Profile fetch error, using default role:', e);
      }
    }

    let plan = 'free';
    let expiresAt = null;
    let subscriptionStatus = 'none';
    let pendingPlan = null;
    let rejectedPlan = null;

    if (window.SupabaseService && typeof window.SupabaseService.getUserActiveSubscription === 'function') {
      try {
        const activeSub = await window.SupabaseService.getUserActiveSubscription(authUser.id);
        const pendingSub = await window.SupabaseService.getUserPendingSubscription(authUser.id);
        const latestSub = (typeof window.SupabaseService.getUserLatestSubscription === 'function')
          ? await window.SupabaseService.getUserLatestSubscription(authUser.id)
          : null;

        const isRecentlyRejected = latestSub && latestSub.status === 'rejected' && (!activeSub || new Date(latestSub.requested_at) > new Date(activeSub.activated_at));

        if (pendingSub) {
          plan = activeSub ? activeSub.plan_id : 'free';
          expiresAt = activeSub ? activeSub.expires_at : null;
          subscriptionStatus = 'pending';
          pendingPlan = pendingSub.plan_id;
        } else if (isRecentlyRejected) {
          plan = activeSub ? activeSub.plan_id : 'free';
          expiresAt = activeSub ? activeSub.expires_at : null;
          subscriptionStatus = 'rejected';
          rejectedPlan = latestSub.plan_id;
        } else if (activeSub) {
          plan = activeSub.plan_id;
          expiresAt = activeSub.expires_at;
          subscriptionStatus = 'active';
        }
      } catch (e) {
        console.warn('[AuthService] Subscription fetch error:', e);
      }
    }

    const userData = {
      id: authUser.id,
      email: authUser.email,
      name: fullName,
      role: role,
      plan: plan,
      expiresAt: expiresAt,
      subscriptionStatus: subscriptionStatus,
      pendingPlan: pendingPlan,
      rejectedPlan: rejectedPlan
    };

    this.setCurrentUser(userData, redirect);
  },

  // إعادة مزامنة وتحديث حالة الاشتراك الحالية مباشرة من Supabase
  async refreshUserSubscription() {
    if (!this.currentUser || !this.currentUser.id) return;
    if (window.SupabaseService && typeof window.SupabaseService.getUserActiveSubscription === 'function') {
      try {
        const activeSub = await window.SupabaseService.getUserActiveSubscription(this.currentUser.id);
        const pendingSub = await window.SupabaseService.getUserPendingSubscription(this.currentUser.id);
        const latestSub = (typeof window.SupabaseService.getUserLatestSubscription === 'function')
          ? await window.SupabaseService.getUserLatestSubscription(this.currentUser.id)
          : null;

        const isRecentlyRejected = latestSub && latestSub.status === 'rejected' && (!activeSub || new Date(latestSub.requested_at) > new Date(activeSub.activated_at));

        if (pendingSub) {
          this.currentUser.plan = activeSub ? activeSub.plan_id : 'free';
          this.currentUser.expiresAt = activeSub ? activeSub.expires_at : null;
          this.currentUser.subscriptionStatus = 'pending';
          this.currentUser.pendingPlan = pendingSub.plan_id;
          this.currentUser.rejectedPlan = null;
        } else if (isRecentlyRejected) {
          this.currentUser.plan = activeSub ? activeSub.plan_id : 'free';
          this.currentUser.expiresAt = activeSub ? activeSub.expires_at : null;
          this.currentUser.subscriptionStatus = 'rejected';
          this.currentUser.pendingPlan = null;
          this.currentUser.rejectedPlan = latestSub.plan_id;
        } else if (activeSub) {
          this.currentUser.plan = activeSub.plan_id;
          this.currentUser.expiresAt = activeSub.expires_at;
          this.currentUser.subscriptionStatus = 'active';
          this.currentUser.pendingPlan = null;
          this.currentUser.rejectedPlan = null;
        } else {
          this.currentUser.plan = 'free';
          this.currentUser.expiresAt = null;
          this.currentUser.subscriptionStatus = 'none';
          this.currentUser.pendingPlan = null;
          this.currentUser.rejectedPlan = null;
        }

        localStorage.setItem('accountera_user', JSON.stringify(this.currentUser));
        this.updateTopBarUI();
      } catch (e) {
        console.warn('[AuthService] Error refreshing subscription:', e);
      }
    }
  },

  // فحص صلاحية باقة المستخدم والتحقق من انتهاء المؤقت الزمني
  verifySubscriptionExpiry(user) {
    if (!user || !user.plan || user.plan === 'free') return user;

    if (user.expiresAt) {
      const now = new Date().getTime();
      const expiresTime = new Date(user.expiresAt).getTime();

      if (now >= expiresTime) {
        console.warn(`[SubscriptionEngine] Subscription for user ${user.id} expired at ${user.expiresAt}`);
        const oldPlan = user.plan;
        user.plan = 'free';
        user.planExpired = true;
        user.expiredPlan = oldPlan;
        user.expiredAt = user.expiresAt;
        delete user.expiresAt;

        try {
          localStorage.setItem('accountera_user', JSON.stringify(user));
          let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
          const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
          if (idx >= 0) {
            users[idx].plan = 'free';
            users[idx].planExpired = true;
            localStorage.setItem('jr_users', JSON.stringify(users));
          }
        } catch (e) {}

        if (typeof AccModal !== 'undefined' && AccModal.toast) {
          setTimeout(() => {
            AccModal.toast(`انتهت فترة اشتراكك في باقة (${oldPlan.toUpperCase()}). تم تحويل حسابك للباقة الأساسية. يرجى التجديد للاستمرار.`, 'warning', 6000);
          }, 350);
        }
      }
    }
    return user;
  },

  getCurrentUser() {
    if (!this.currentUser) {
      try {
        const saved = localStorage.getItem('accountera_user');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.id || parsed.email)) {
            this.currentUser = parsed;
          }
        }
      } catch (e) {}
    }
    if (this.currentUser) {
      this.currentUser = this.verifySubscriptionExpiry(this.currentUser);
    }
    return this.currentUser;
  },

  clearAuthStorage() {
    this.currentUser = null;
    try {
      localStorage.removeItem('accountera_user');
      // مسح كافة مفاتيح توكنات Supabase وجلسات المستخدم محلياً فوراً
      const keysToRemove = [];
      // المفاتيح المحاسبية ومفاتيح جلسات المحاكاة التي يجب عزلها وتطهيرها تماماً لمنع تسرب البيانات بين الطلاب
      const simKeys = [
        'student_journal',
        'student_ledger',
        'sim_company_profile',
        'bank_statement_items',
        'acc_draft_journal_entry',
        'acc_company_sim_entries',
        'career_student_profile',
        'sim_student_career_tasks'
      ];
      simKeys.forEach(k => keysToRemove.push(k));

      // المفاتيح النظامية العامة التي يجب الحفاظ عليها دائماً ولا تخص مستخدماً بعينه
      const preserveKeys = [
        'acc_admin_companies',
        'acc_admin_plans',
        'acc_admin_coupons',
        'acc_admin_config',
        'acc_admin_audit',
        'sim_admin_tasks',
        'accountera_theme'
      ];

      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('sb-') || k.includes('auth-token') || k.includes('supabase') || k.startsWith('acc_') || k.startsWith('sim_'))) {
          if (!k.includes('theme') && !k.includes('mode') && !preserveKeys.includes(k)) {
            keysToRemove.push(k);
          }
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
      sessionStorage.removeItem('accountera_current_screen');
    } catch (e) {
      console.warn('[AuthService] Error clearing auth storage:', e);
    }
  },

  setCurrentUser(user, redirect = true) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('accountera_user', JSON.stringify(user));
      this.updateTopBarUI();
      // تشغيل ترحيل البيانات المحلية وجلب التقدم السحابي للمستخدم المسجل
      if (typeof window !== 'undefined') {
        if (window.ProgressService && typeof window.ProgressService.fetchUserProgress === 'function') {
          window.ProgressService.fetchUserProgress().catch(e => console.warn('[AuthService] Progress fetch error:', e));
        }
        if (window.MigrationService && typeof window.MigrationService.migrateLegacyLocalStorage === 'function') {
          window.MigrationService.migrateLegacyLocalStorage().catch(e => console.warn('[AuthService] Migration error:', e));
        }
      }
      if (redirect) {
        this.redirectAfterLogin(user);
      }
    } else {
      this.clearAuthStorage();
      if (typeof window !== 'undefined' && window.ProgressService) {
        window.ProgressService.completedLessons = new Set();
      }
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
    if (typeof window.navigateToScreen === 'function') {
      window.navigateToScreen(mode === 'register' ? 'register' : 'login');
      return;
    }
  },

  switchAuthTab(mode) {
    if (typeof window.navigateToScreen === 'function') {
      window.navigateToScreen(mode === 'register' ? 'register' : 'login');
      return;
    }
  },

  closeAuthModal() {
    const overlay = document.getElementById('authModalOverlay');
    if (overlay) overlay.remove();
  },

  showAuthError(message) {
    const box = document.getElementById('authErrorAlert');
    if (box) {
      box.textContent = message;
      box.style.display = 'block';
      if (typeof ExcelAuthView !== 'undefined' && typeof ExcelAuthView.shakeError === 'function') {
        ExcelAuthView.shakeError();
      }
    } else {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast(message, 'error');
      } else {
        alert(message);
      }
    }
  },

  translateAuthError(err) {
    if (!err) return 'حدث خطأ غير متوقع أثناء المصادقة.';
    const msg = (err.message || String(err)).toLowerCase();
    if (msg.includes('invalid login credentials') || msg.includes('invalid_grant')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
      return 'هذا البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول.';
    }
    if (msg.includes('password should be at least 6')) {
      return 'كلمة المرور يجب أن تتكون من 6 أحرف أو أرقام على الأقل.';
    }
    if (msg.includes('email not confirmed')) {
      return 'يرجى مراجعة بريدك الإلكتروني وتأكيد الحساب قبل تسجيل الدخول.';
    }
    if (msg.includes('rate limit') || msg.includes('too many requests')) {
      return 'تم تجاوز الحد المسموح من المحاولات، يرجى الانتظار دقيقة والمحاولة مرة أخرى.';
    }
    return err.message || 'فشلت عملية المصادقة، يرجى المحاولة لاحقاً.';
  },

  async handleAuthSubmit(e, mode) {
    e.preventDefault();
    const email = document.getElementById('authEmail')?.value.trim();
    const password = document.getElementById('authPassword')?.value;
    const name = document.getElementById('authName')?.value.trim() || email.split('@')[0];
    const submitBtn = document.getElementById('authSubmitBtn');

    if (!email || !password) {
      this.showAuthError('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }

    const client = window.SupabaseService?.client;
    if (!client || !client.auth) {
      this.showAuthError('خدمة المصادقة السحابية غير متصلة حالياً، يرجى التحقق من اتصالك بالإنترنت.');
      return;
    }

    // إظهار مؤشر التحميل
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>جاري معالجة الطلب...</span>`;
    }

    try {
      if (mode === 'register') {
        if (password.length < 6) {
          this.showAuthError('كلمة المرور يجب أن لا تقل عن 6 أحرف.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `<span>إنشاء الحساب والتفعيل</span>`;
          }
          return;
        }

        // التسجيل ينشئ دائماً حساب طالب، لا يرسل أي رتبة أخرى
        const { data, error } = await client.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              full_name: name
            }
          }
        });

        if (error) throw error;

        if (data.session && data.user) {
          await this.syncUserSession(data.user, true);
          this.closeAuthModal();
          if (typeof AccModal !== 'undefined' && AccModal.toast) {
            AccModal.toast('تم إنشاء الحساب وتسجيل الدخول بنجاح!', 'success');
          }
        } else if (data.user) {
          this.closeAuthModal();
          if (typeof AccModal !== 'undefined' && AccModal.alert) {
            AccModal.alert({
              title: 'تم إنشاء الحساب بنجاح',
              message: `تم إرسال رابط تأكيد الحساب إلى (${email}). يرجى فتح البريد وتأكيد الحساب ثم تسجيل الدخول.`,
              icon: '✉️'
            });
          }
        }
      } else {
        // تسجيل الدخول حصرياً عبر التحقق السحابي الموثق
        const { data, error } = await client.auth.signInWithPassword({
          email: email,
          password: password
        });

        if (error) {
          throw error;
        }

        if (data && data.user) {
          await this.syncUserSession(data.user, true);
          this.closeAuthModal();
          if (typeof AccModal !== 'undefined' && AccModal.toast) {
            AccModal.toast('أهلاً بك مجدداً! تم تسجيل الدخول بنجاح.', 'success');
          }
        }
      }
    } catch (err) {
      console.error('[AuthService] Authentication error:', err);
      this.showAuthError(this.translateAuthError(err));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${mode === 'login' ? 'دخول المنصة' : 'إنشاء الحساب والتفعيل'}</span>`;
      }
    }
  },

  async signInWithGoogle() {
    const client = window.SupabaseService?.client;
    if (!client || !client.auth) {
      this.showAuthError('خدمة المصادقة السحابية غير متصلة حالياً.');
      return;
    }
    const btn = document.getElementById('googleAuthBtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span>جاري التحويل إلى Google...</span>`;
    }
    try {
      const redirectUrl = window.location.origin;
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          }
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('[AuthService] Google OAuth Error:', err);
      this.showAuthError(this.translateAuthError(err));
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span>المتابعة باستخدام Google</span>`;
      }
    }
  },

  async quickLogin(role, name) {
    // مخصص للمعاينة المحلية فقط مع وسم واضح
    const isDev = (typeof window !== 'undefined') && 
      (['localhost', '127.0.0.1'].includes(window.location.hostname) || window.location.protocol === 'file:');

    if (!isDev) {
      this.showAuthError('الدخول السريع غير متاح في بيئة الإنتاج. يرجى استخدام بريدك الإلكتروني وكلمة المرور.');
      return;
    }

    this.closeAuthModal();
    this.setCurrentUser({
      id: `dev-${role}-${Date.now()}`,
      name: name,
      email: `${role}@accountera.local`,
      role: role,
      isDevTest: true
    }, true);

    if (typeof AccModal !== 'undefined' && AccModal.toast) {
      AccModal.toast(`تم الدخول في وضع المعاينة المحلية (${role}). هذا الوضع لا يملك صلاحيات على السحابة.`, 'info');
    }
  },

  async logout() {
    // 1. مسح فوري وصارم لكافة آثار التوكن وجلسة المصادقة من التخزين والذاكرة قبل أي استدعاء شبكة
    this.clearAuthStorage();
    
    // 2. إخطار خادم Supabase بإلغاء الجلسة السحابية
    const client = window.SupabaseService?.client;
    if (client && client.auth) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('[AuthService] Supabase signout error:', e);
      }
    }
    this.setCurrentUser(null, true);
  },

  updateNavigationForRole() {
    const desktopNav = document.querySelector('.desktop-nav');
    const bottomNav = document.querySelector('.bottom-nav');

    // 1. شريط ملاحة الزائر غير المسجل (Guest Navigation)
    if (!this.currentUser) {
      if (desktopNav) {
        desktopNav.innerHTML = `
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('landing')">الرئيسية (Home)</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('companies-hub')">التحديات (Challenges)</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('lesson-1')">الدروس (Tutorials)</a>
          <a href="javascript:void(0)" class="nav-link" onclick="navigateToScreen('ex-1')">الاختبارات (MCQ Quiz)</a>
          <a href="javascript:void(0)" class="nav-link" onclick="window.location.href='simulation/simulation/journal/index.html'">المحاكاة (Simulation)</a>
        `;
      }
      if (bottomNav) {
        bottomNav.innerHTML = `
          <button class="bottom-nav-item active" id="bn-landing" onclick="navigateToScreen('landing')">
            <span class="bn-icon">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('house', { size: 20 }) : ''}</span>
            <span>الرئيسية</span>
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
      return;
    }

    const currentRole = this.currentUser.role || 'student';

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
      // شريط ملاحة الطالب المسجل
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
      const isStudent = (this.currentUser.role || 'student') === 'student';
      const isAdmin = this.currentUser.role === 'admin';

      // إخفاء القائمة الجانبية المخصصة للطلاب عند الدخول كمدير نظام
      const sidebar = document.getElementById('appSidebar');
      if (sidebar && isAdmin) {
        sidebar.classList.add('landing-hidden');
        sidebar.style.display = 'none';
      }

      authDock.innerHTML = `
        <div class="accountely-topbar-actions">
          ${isStudent ? `
            <button onclick="navigateToScreen('student-plans')" class="accountely-promo-pill">
              <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 14 }) : ''}</span>
              <span>Refer & earn 20%</span>
            </button>
            
            <button onclick="navigateToScreen('student-plans')" class="accountely-upgrade-btn" title="ترقية الحساب إلى Pro" aria-label="ترقية الحساب">
              <span class="upgrade-icon" style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('star', { size: 16 }) : '★'}</span>
              <span class="accountely-upgrade-text">Upgrade • ترقية</span>
            </button>
          ` : (isAdmin ? `
            <button onclick="navigateToScreen('admin-overview')" class="accountely-promo-pill" style="background:var(--primary-light); border-color:var(--primary-border); color:var(--primary); font-weight:800;">
              <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 14 }) : ''}</span>
              <span>Admin OS • مدير النظام</span>
            </button>
          ` : '')}

          <div class="accountely-bell-btn" onclick="navigateToScreen(isAdmin ? 'admin-overview' : 'student-dashboard')" title="الإشعارات والتنبيهات" aria-label="الإشعارات">
            <span style="display:inline-flex; align-items:center;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('bell', { size: 16 }) : ''}</span>
            <span style="position:absolute; top:-3px; right:-3px; background:#ef4444; color:#fff; font-size:0.65rem; font-weight:800; width:15px; height:15px; border-radius:50%; display:flex; align-items:center; justify-content:center;">1</span>
          </div>

          <div class="accountely-user-dock" onclick="navigateToScreen(isAdmin ? 'admin-settings' : 'student-settings')" title="إعدادات الحساب والملف الشخصي" aria-label="الملف الشخصي">
            <span class="accountely-user-name" style="font-size:0.85rem; font-weight:700; color:var(--text-primary); margin-left:4px;">${this.escapeHtml(this.currentUser.name || 'مستخدم')}</span>
            <div class="accountely-user-avatar" style="width:28px; height:28px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.82rem;">${initial}</div>
          </div>
          
          <button onclick="AuthService.logout()" class="sidebar-toggle-btn accountely-logout-btn" style="width:32px; height:32px; border-radius:50%; margin-right:4px;" title="تسجيل الخروج" aria-label="تسجيل الخروج">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('x', { size: 16 }) : '×'}
          </button>
        </div>
      `;
    } else {
      authDock.innerHTML = `
        <button class="accountely-login-btn" onclick="AuthService.openAuthModal('login')">
          <span>دخول المنصة / Login</span>
        </button>
      `;
    }

    // مزامنة درج الملاحة الجانبي للموبايل مع بيانات المستخدم
    if (typeof window.createMobileNavDrawer === 'function') {
      window.createMobileNavDrawer();
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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
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
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'accConfirmModalTitle');
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close(false);
        }
      };

      const escHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close(false);
        }
      };
      document.addEventListener('keydown', escHandler);

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
        document.removeEventListener('keydown', escHandler);
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
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-labelledby', 'accAlertModalTitle');
      overlay.onclick = (e) => {
        if (e.target === overlay) {
          close();
        }
      };

      const escHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      };
      document.addEventListener('keydown', escHandler);

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
        document.removeEventListener('keydown', escHandler);
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
