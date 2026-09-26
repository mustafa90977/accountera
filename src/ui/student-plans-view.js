/**
 * student-plans-view.js — شاشة الباقات والاشتراكات وبرنامج الإحالة المخصصة للطلاب
 * واجهة اشتراك وترقية نظيفة للطلاب (بدون أدوات أو صلاحيات لوحة تحكم الإدارة Admin OS)
 */

const ExcelStudentPlansView = {
  getUser() {
    let user = null;
    try {
      if (typeof AuthService !== 'undefined') {
        user = AuthService.getCurrentUser();
      }
      if (!user) {
        const raw = localStorage.getItem('accountera_user');
        if (raw) user = JSON.parse(raw);
      }
      if (user && typeof AuthService !== 'undefined' && AuthService.verifySubscriptionExpiry) {
        user = AuthService.verifySubscriptionExpiry(user);
      }
    } catch(e) {}

    return user || {
      id: 'ACC-2026-8942',
      name: 'محاسب مالي متدرب',
      email: 'student@accountera.edu',
      role: 'student',
      plan: 'free'
    };
  },

  plans: null,

  async init() {
    await this.loadPlans();
  },

  async loadPlans() {
    try {
      if (typeof SupabaseService !== 'undefined' && SupabaseService.getActivePlans) {
        const cloudPlans = await SupabaseService.getActivePlans();
        if (cloudPlans && cloudPlans.length > 0) {
          const oldJson = JSON.stringify(this.plans);
          const newJson = JSON.stringify(cloudPlans);
          if (oldJson !== newJson) {
            this.plans = cloudPlans;
            const container = document.querySelector('.student-plans-container');
            if (container && document.getElementById('app')) {
              document.getElementById('app').innerHTML = this.render();
            }
          }
        }
      }
    } catch (e) {
      console.warn('[StudentPlansView] Error loading plans from Supabase:', e);
    }
  },

  render() {
    const user = this.getUser();
    const currentPlanId = user.plan || 'free';
    const referralCode = `ACC-REF-${(user.id || '2026').replace(/[^a-zA-Z0-9]/g, '').slice(-6)}`;
    const referralLink = `https://accountera.vercel.app?ref=${referralCode}`;

    let plans = this.plans || (typeof SupabaseService !== 'undefined' && SupabaseService.getCachedActivePlans ? SupabaseService.getCachedActivePlans() : (typeof window !== 'undefined' && window.DEFAULT_ADMIN_PLANS ? window.DEFAULT_ADMIN_PLANS : []));
    if (!this.plans && typeof SupabaseService !== 'undefined' && SupabaseService.getActivePlans) {
      setTimeout(() => this.loadPlans(), 0);
    }

    let systemConfig = { trialEnabled: true, trialDays: 3, trialPlan: 'pro' };
    try {
      const savedCfg = localStorage.getItem('acc_system_config');
      if (savedCfg) systemConfig = { ...systemConfig, ...JSON.parse(savedCfg) };
    } catch(e) {}

    const freePlan = plans.find(p => p.id === 'free') || { id: 'free', name: 'الباقة التأسيسية', price: 0, period: 'مدى الحياة', durationDays: 0 };
    const proPlan = plans.find(p => p.id === 'pro') || { id: 'pro', name: 'المحاسب المحترف', price: 299, period: '30 يوم', durationDays: 30 };
    const vipPlan = plans.find(p => p.id === 'vip') || { id: 'vip', name: 'خبير النمذجة (VIP Master)', price: 599, period: 'سنة كاملة', durationDays: 365 };

    let pendingNoticeHtml = '';
    if (user.subscriptionStatus === 'pending') {
      const pendingObj = plans.find(p => p.id === user.pendingPlan);
      const pPlanName = pendingObj ? pendingObj.name : (user.pendingPlan === 'vip' ? vipPlan.name : (user.pendingPlan === 'pro' ? proPlan.name : 'المدفوعة'));
      pendingNoticeHtml = `
        <div style="background: rgba(245, 158, 11, 0.08); border: 1.5px dashed #f59e0b; border-radius: var(--radius-lg); padding: 1.25rem 1.75rem; margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(245, 158, 11, 0.18); color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              ⏳
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <strong style="color: #b45309; font-size: 1rem; font-weight: 800;">طلب ترقية قيد المراجعة والاعتماد لدى الإدارة</strong>
                <span style="background: #fef3c7; color: #92400e; border: 1px solid #fde68a; padding: 2px 8px; border-radius: 999px; font-size: 0.72rem; font-weight: 800;">معلّق (Pending)</span>
              </div>
              <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">
                تم استلام طلب ترقيتك لباقة <strong>${pPlanName}</strong> بنجاح. سيتم تفعيل حسابك فور مراجعة واعتماد الإدارة للطلب.
              </p>
            </div>
          </div>
          <button onclick="if(typeof AuthService !== 'undefined' && AuthService.refreshUserSubscription){ AuthService.refreshUserSubscription().then(() => { const c = document.getElementById('app'); if(c) c.innerHTML = ExcelStudentPlansView.render(); }); }" class="btn-cta-secondary" style="padding: 6px 14px; font-size: 0.82rem; font-weight: 700; border-radius: var(--radius-sm);">
            تحديث الحالة 🔄
          </button>
        </div>
      `;
    }

    let timerHtml = '';
    if (user.plan !== 'free' || user.isTrial) {
      let remainingDaysText = 'غير محدد';
      let remainingDays = 0;
      const startDateText = user.subscribedAt ? new Date(user.subscribedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'اليوم';
      let endDateText = 'مدى الحياة';

      if (user.expiresAt) {
        const expDate = new Date(user.expiresAt);
        endDateText = expDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
        const diffMs = expDate.getTime() - Date.now();
        remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (remainingDays <= 0) {
          remainingDaysText = 'انتهت الصلاحية';
        } else {
          remainingDaysText = `${remainingDays} يوم متبقي`;
        }
      }

      const activePlanObj = plans.find(p => p.id === user.plan) || proPlan;
      const trialBadge = user.isTrial 
        ? `<span style="background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800;">فترة تجريبية مجانية (${systemConfig.trialDays || 3} أيام)</span>` 
        : `<span style="background: rgba(16, 185, 129, 0.15); color: #059669; border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 999px; font-size: 0.75rem; font-weight: 800;">اشتراك مدفوع نشط ✓</span>`;

      timerHtml = `
        <div style="background: linear-gradient(135deg, rgba(20, 184, 166, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%); border: 1.5px solid var(--primary-border); border-radius: var(--radius-lg); padding: 1.5rem 2rem; margin-bottom: 2rem; box-shadow: var(--elevation-1);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="width: 52px; height: 52px; border-radius: 12px; background: var(--surface-card); border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: center; color: var(--primary);">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 26 }) : '⏱️'}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px;">
                  <strong style="font-size: 1.15rem; color: var(--text-primary); font-weight: 900;">${activePlanObj.name}</strong>
                  ${trialBadge}
                </div>
                <div style="font-size: 0.85rem; color: var(--text-secondary); display: flex; gap: 14px; flex-wrap: wrap;">
                  <span>تاريخ البدء: <strong class="tabular-nums font-mono" style="color: var(--text-primary);">${startDateText}</strong></span>
                  <span>تاريخ الانتهاء: <strong class="tabular-nums font-mono" style="color: var(--text-primary);">${endDateText}</strong></span>
                </div>
              </div>
            </div>

            <div style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 10px 20px; text-align: center; min-width: 170px;">
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; margin-bottom: 2px;">المؤقت والصلاحية:</div>
              <div class="tabular-nums font-mono" style="font-size: 1.35rem; font-weight: 900; color: ${remainingDays > 5 ? 'var(--primary)' : 'var(--danger)'};">
                ${remainingDaysText}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="student-plans-container" style="max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 4rem;">
        
        <!-- ترويسة الصفحة بنمط الـ Tokens القياسي -->
        <div style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.75rem 2rem; box-shadow: var(--elevation-1); margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 58px; height: 58px; border-radius: var(--radius-md); background: var(--primary-light); border: 1.5px solid var(--primary-border); display: flex; align-items: center; justify-content: center; color: var(--primary);">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 28, strokeWidth: 1.75 }) : ''}
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: var(--text-primary);">باقات الاشتراك والترقية المهنية</h1>
                <span style="background: var(--tier-starter-bg); color: var(--tier-starter-text); border: 1px solid var(--tier-starter-border); padding: 3px 12px; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 800;">
                  باقتك الحالية: ${(plans.find(p => p.id === currentPlanId) || {}).name || (currentPlanId === 'vip' ? vipPlan.name : (currentPlanId === 'pro' ? proPlan.name : freePlan.name))}
                </span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 4px 0 0;">
                Plans & Referrals • طور مهاراتك المحاسبية، افتح شركات المحاكاة الواقعية، واعتمد سيرتك المهنية
              </p>
            </div>
          </div>

          <div style="display: flex; gap: 8px;">
            <button onclick="navigateToScreen('student-dashboard')" class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 16 }) : ''}
              <span>لوحة دراستي</span>
            </button>
            <button onclick="navigateToScreen('student-settings')" class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 16 }) : ''}
              <span>الإعدادات</span>
            </button>
          </div>
        </div>

        <!-- إشعار حالة طلب الترقية المعلق -->
        ${pendingNoticeHtml}

        <!-- بطاقة مؤقت وصلاحية الاشتراك النشط -->
        ${timerHtml}

        <!-- شبكة كروت الباقات الـ 3 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(310px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
          
          <!-- الباقة الأولى: التأسيسية (Free) -->
          <div style="background: var(--surface-card); border: 2px solid ${currentPlanId === 'free' ? 'var(--tier-starter)' : 'var(--border-subtle)'}; border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--elevation-2); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: var(--tier-starter-bg); color: var(--tier-starter-text); display: flex; align-items: center; justify-content: center; border: 1px solid var(--tier-starter-border);">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 24, strokeWidth: 1.75 }) : ''}
                </div>
                <span style="background: var(--bg-secondary); color: var(--text-secondary); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; border: 1px solid var(--border-subtle);">تأسيسي</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">${freePlan.name}</h3>
              <div style="margin-bottom: 1.25rem; display: flex; align-items: baseline; gap: 6px;">
                <span style="font-size: 2rem; font-weight: 900; color: var(--text-primary);">مجاناً</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;"> / ${freePlan.period || 'مدى الحياة'}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.25rem;">
                بداية مثالية لطلاب الفرقة الأولى والثانية والمبتدئين في فهم طبيعة الحسابات والقيد المزدوج.
              </p>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-bottom: 1.5rem;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">المميزات المشمولة:</div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.86rem; color: var(--text-secondary);">
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>الوصول للدروس التأسيسية الثلاثة الأولى</span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>محاكاة شركة تجارية واحدة كاملة الدورة</span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>دفتر اليومية والأستاذ وميزان المراجعة</span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px; color: var(--text-muted);">
                    <span style="color: var(--border-strong);">✕</span>
                    <span>مشاركة الاعتماد المهني على LinkedIn</span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px; color: var(--text-muted);">
                    <span style="color: var(--border-strong);">✕</span>
                    <span>محاكاة الشركات الصناعية والخدمية</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              ${currentPlanId === 'free' ? `
                <button disabled style="width: 100%; background: var(--tier-starter-bg); color: var(--tier-starter-text); border: 1px solid var(--tier-starter-border); padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem; cursor: default;">
                  ✓ باقتك الحالية النشطة
                </button>
              ` : `
                <button onclick="ExcelStudentPlansView.downgradeToFree()" class="btn-cta-secondary" style="width: 100%; padding: 10px; border-radius: var(--radius-sm); font-weight: 700; font-size: 0.88rem;">
                  الرجوع للباقة التأسيسية
                </button>
              `}
            </div>
          </div>

          <!-- الباقة الثانية: المحاسب المحترف (Pro) الأكثر طلباً -->
          <div style="background: var(--surface-card); border: 2px solid ${currentPlanId === 'pro' ? 'var(--primary)' : 'var(--tier-pro)'}; border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--elevation-3); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div style="position: absolute; top: -13px; right: 24px; background: var(--tier-pro); color: #ffffff; font-size: 0.74rem; font-weight: 800; padding: 3px 12px; border-radius: var(--radius-full); box-shadow: var(--elevation-1);">
              الأكثر طلباً
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: var(--tier-pro-bg); color: var(--tier-pro-text); display: flex; align-items: center; justify-content: center; border: 1px solid var(--tier-pro-border);">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 24, strokeWidth: 1.75 }) : ''}
                </div>
                <span style="background: var(--tier-pro-bg); color: var(--tier-pro-text); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; border: 1px solid var(--tier-pro-border);">احترافي</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">${proPlan.name}</h3>
              <div style="margin-bottom: 1.25rem; display: flex; align-items: baseline; gap: 6px;">
                <span class="tabular-nums font-mono" style="font-size: 2rem; font-weight: 900; color: var(--text-primary);">${proPlan.price}</span>
                <span style="font-size: 1.05rem; font-weight: 800; color: var(--tier-pro);">ج.م</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;"> / ${proPlan.period || (proPlan.durationDays ? proPlan.durationDays + ' يوم' : '30 يوم')}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.25rem;">
                الحزمة الشاملة للتأهيل لسوق العمل، ومراجعة الشركات وإثبات الكفاءة أمام مسؤولي التوظيف.
              </p>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-bottom: 1.5rem;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">كافة مميزات التأسيسي بالإضافة إلى:</div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.86rem; color: var(--text-secondary);">
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>فتح كافة الدروس التأسيسية 100%</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>محاكاة 5 شركات تجارية وصناعية وخدمية</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>مشاركة المحفظة والاعتماد على LinkedIn</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>وضع المراجع الخارجي واكتشاف الأخطاء العملية</span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>جناح نماذج الإكسل المحاسبية المتقدمة</span>
                  </li>
                </ul>
              </div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${currentPlanId === 'pro' && !user.isTrial ? `
                <button disabled style="width: 100%; background: var(--tier-starter-bg); color: var(--tier-starter-text); border: 1px solid var(--tier-starter-border); padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem; cursor: default;">
                  ✓ باقتك الحالية النشطة
                </button>
              ` : user.subscriptionStatus === 'pending' && user.pendingPlan === 'pro' ? `
                <button disabled style="width: 100%; background: #fef3c7; color: #b45309; border: 1.5px dashed #f59e0b; padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem; cursor: not-allowed;">
                  ⏳ طلبك لباقة Pro قيد المراجعة لدى الإدارة
                </button>
              ` : `
                <button onclick="ExcelStudentPlansView.subscribePlan('pro', ${proPlan.price})" class="btn-cta-primary" style="width: 100%; padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem;">
                  طلب ترقية لباقة Pro (${proPlan.price} ج.م)
                </button>
                ${systemConfig.trialEnabled ? (
                  user.hasUsedTrial ? `
                    <button disabled class="btn-cta-secondary" style="width: 100%; padding: 9px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; opacity: 0.6; cursor: not-allowed;" title="تم استهلاك التجربة المجانية سابقاً">
                      تم استهلاك التجربة المجانية مسبقاً
                    </button>
                  ` : `
                    <button onclick="ExcelStudentPlansView.activateTrial()" class="btn-cta-secondary" style="width: 100%; padding: 9px; border-radius: var(--radius-sm); font-size: 0.82rem; font-weight: 700; border: 1px dashed var(--primary); color: var(--primary);">
                      طلب تجربة مجانية (${systemConfig.trialDays || 3} أيام)
                    </button>
                  `
                ) : ''}
              `}
            </div>
          </div>

          <!-- الباقة الثالثة: خبير النمذجة (VIP Master) -->
          <div style="background: var(--surface-card); border: 2px solid ${currentPlanId === 'vip' ? 'var(--primary)' : 'var(--tier-vip)'}; border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--elevation-2); display: flex; flex-direction: column; justify-content: space-between; position: relative;">
            <div style="position: absolute; top: -13px; right: 24px; background: var(--tier-vip); color: #ffffff; font-size: 0.74rem; font-weight: 800; padding: 3px 12px; border-radius: var(--radius-full); box-shadow: var(--elevation-1);">
              النخبة
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div style="width: 44px; height: 44px; border-radius: var(--radius-sm); background: var(--tier-vip-bg); color: var(--tier-vip-text); display: flex; align-items: center; justify-content: center; border: 1px solid var(--tier-vip-border);">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('star', { size: 24, strokeWidth: 1.75 }) : ''}
                </div>
                <span style="background: var(--tier-vip-bg); color: var(--tier-vip-text); padding: 4px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800; border: 1px solid var(--tier-vip-border);">${vipPlan.period || 'سنة كاملة'}</span>
              </div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin: 0 0 6px;">${vipPlan.name}</h3>
              <div style="margin-bottom: 1.25rem; display: flex; align-items: baseline; gap: 6px;">
                <span class="tabular-nums font-mono" style="font-size: 2rem; font-weight: 900; color: var(--text-primary);">${vipPlan.price}</span>
                <span style="font-size: 1.05rem; font-weight: 800; color: var(--tier-vip);">ج.م</span>
                <span style="color: var(--text-muted); font-size: 0.85rem;"> / ${vipPlan.period || 'سنة كاملة'}</span>
              </div>
              <p style="font-size: 0.86rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 1.25rem;">
                المستوى الأقصى من الاحتراف مع محاكي المقابلات الشخصية، وكافة قطاعات الشركات، ومتابعة مدرب معتمد.
              </p>

              <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem; margin-bottom: 1.5rem;">
                <div style="font-size: 0.82rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">كافة مميزات Pro بالإضافة إلى:</div>
                <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; font-size: 0.86rem; color: var(--text-secondary);">
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>وصول غير محدود لجميع الشركات والقطاعات</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>محاكي مقابلات التوظيف وأسئلة Big 4</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span><strong>شهادة خبرة معتمدة موثقة برقم كودي وطني</strong></span>
                  </li>
                  <li style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: var(--tier-starter); font-weight: 800;">✓</span>
                    <span>أولوية الدعم الفني والمراجعة المباشرة من المدرب</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              ${currentPlanId === 'vip' ? `
                <button disabled style="width: 100%; background: var(--tier-starter-bg); color: var(--tier-starter-text); border: 1px solid var(--tier-starter-border); padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem; cursor: default;">
                  ✓ باقتك الحالية النشطة
                </button>
              ` : user.subscriptionStatus === 'pending' && user.pendingPlan === 'vip' ? `
                <button disabled style="width: 100%; background: #fef3c7; color: #b45309; border: 1.5px dashed #f59e0b; padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem; cursor: not-allowed;">
                  ⏳ طلبك لباقة VIP قيد المراجعة لدى الإدارة
                </button>
              ` : `
                <button onclick="ExcelStudentPlansView.subscribePlan('vip', ${vipPlan.price})" class="btn-cta-primary" style="width: 100%; background: var(--tier-vip); padding: 12px; border-radius: var(--radius-sm); font-weight: 800; font-size: 0.9rem;">
                  طلب ترقية لباقة VIP Master (${vipPlan.price} ج.م)
                </button>
              `}
            </div>
          </div>

        </div>

        <!-- قسم برنامج الإحالة والمكافآت (Refer & Earn 20%) -->
        <div style="background: var(--surface-card); border: 1px solid var(--warning-border); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--elevation-1); margin-bottom: 2rem; position: relative;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1.5rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap;">
                <div style="width: 42px; height: 42px; border-radius: var(--radius-sm); background: var(--warning-bg); color: var(--warning-text); display: flex; align-items: center; justify-content: center; border: 1px solid var(--warning-border);">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 22, strokeWidth: 1.75 }) : ''}
                </div>
                <h2 style="font-size: 1.3rem; font-weight: 900; color: var(--warning-text); margin: 0;">برنامج الإحالة ومكافأة الـ 20% (Refer & Earn)</h2>
                <span class="tabular-nums font-mono" style="background: var(--warning-bg); color: var(--warning-text); border: 1px solid var(--warning-border); padding: 2px 10px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 800;">20% كاش فوري</span>
              </div>
              <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 0 0 1rem; max-width: 650px; line-height: 1.7;">
                شارك منصة Accountera مع زملائك في كلية التجارة أو زملائك المحاسبين. لكل زميل يقوم بالترقية باستخدام كودك الخاص، ستحصل على <strong style="color: var(--text-primary);" class="tabular-nums">20%</strong> كاش فوري أو رصيد خصم على اشتراكك القادم!
              </p>

              <!-- كود الإحالة ورابط المشاركة -->
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <div style="background: var(--bg-secondary); border: 1.5px dashed var(--border-strong); padding: 10px 18px; border-radius: var(--radius-sm); font-size: 1.05rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
                  <span>كودك:</span>
                  <span id="refCodeText" class="tabular-nums font-mono" style="color: var(--primary);">${referralCode}</span>
                </div>

                <button onclick="ExcelStudentPlansView.copyReferralLink('${referralLink}')" class="btn-cta-primary" style="padding: 10px 20px; font-size: 0.88rem; border-radius: var(--radius-sm); display: inline-flex; align-items: center; gap: 6px;">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 16 }) : ''}
                  <span>نسخ رابط الإحالة</span>
                </button>
              </div>
            </div>

            <!-- إحصائيات الإحالة السريعة -->
            <div style="background: var(--warning-bg); border: 1px solid var(--warning-border); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; text-align: center; min-width: 220px;">
              <div style="font-size: 0.82rem; color: var(--warning-text); font-weight: 700; margin-bottom: 4px;">أرباحك ومكافآتك الحالية:</div>
              <div class="tabular-nums font-mono" style="font-size: 1.8rem; font-weight: 900; color: var(--warning-text);">0.00 <span style="font-size: 1rem;">ج.م</span></div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;" class="tabular-nums">0 إحالات مفعلة حتى الآن</div>
            </div>
          </div>
        </div>

        <!-- قسم تفعيل كود الخصم أو كود الكوبون -->
        <div style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 1.75rem 2rem; box-shadow: var(--elevation-1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem;">
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); margin: 0 0 4px;">هل تمتلك كود خصم أو تفعيل؟</h3>
            <p style="font-size: 0.84rem; color: var(--text-secondary); margin: 0;">أدخل كود الكوبون المعتمد لتفعيل باقتك مباشرة أو الاستفادة من خصم إضافي.</p>
          </div>

          <form onsubmit="ExcelStudentPlansView.applyCoupon(event)" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <input type="text" id="couponInput" placeholder="ادخل الكود هنا (مثال: PRO2026)" class="font-mono" style="padding: 10px 14px; background: var(--bg-main); color: var(--text-primary); border: 1px solid var(--border-strong); border-radius: var(--radius-sm); font-size: 0.88rem; width: 220px; font-weight: 700; text-transform: uppercase;">
            <button type="submit" class="btn-cta-secondary" style="padding: 10px 18px; font-size: 0.88rem; font-weight: 800; border-radius: var(--radius-sm);">
              تطبيق الكود ✓
            </button>
          </form>
        </div>

      </div>
    `;
  },

  copyReferralLink(link) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        if (typeof AccModal !== 'undefined' && AccModal.toast) {
          AccModal.toast("تم نسخ رابط الإحالة الخاص بك بنجاح! شاركه مع زملائك.", "success");
        } else {
          alert("تم نسخ رابط الإحالة بنجاح!");
        }
      });
    } else {
      prompt("انسخ رابط الإحالة الخاص بك:", link);
    }
  },

  applyCoupon(e) {
    e.preventDefault();
    const code = document.getElementById('couponInput')?.value.trim().toUpperCase();
    if (!code) return;

    if (code === 'PRO2026' || code === 'FREEPRO' || code === 'EGYPT2026') {
      this.activateTrial();
    } else {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("كود الخصم غير صالح أو انتهت صلاحيته.", "error");
      } else {
        alert("كود الخصم غير صالح أو انتهت صلاحيته.");
      }
    }
  },

  async subscribePlan(planId, price) {
    const user = this.getUser();
    if (!user || !user.id || user.id.startsWith('ACC-2026') || user.id.startsWith('usr-')) {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("يرجى تسجيل الدخول بحسابك أولاً لإرسال طلب الترقية.", "warning");
      } else {
        alert("يرجى تسجيل الدخول بحسابك أولاً لإرسال طلب الترقية.");
      }
      return;
    }

    if (user.subscriptionStatus === 'pending') {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("لديك بالفعل طلب ترقية معلق قيد المراجعة والاعتماد لدى الإدارة.", "warning");
      } else {
        alert("لديك بالفعل طلب ترقية معلق قيد المراجعة والاعتماد لدى الإدارة.");
      }
      return;
    }

    try {
      if (typeof SupabaseService !== 'undefined' && SupabaseService.client) {
        await SupabaseService.requestSubscription(planId);
      } else {
        throw new Error('قاعدة البيانات السحابية غير متصلة.');
      }

      if (typeof AuthService !== 'undefined' && typeof AuthService.refreshUserSubscription === 'function') {
        await AuthService.refreshUserSubscription();
      }

      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("تم إرسال طلب الترقية بنجاح، بانتظار اعتماد الإدارة", "success", 6000);
      } else {
        alert("تم إرسال طلب الترقية بنجاح، بانتظار اعتماد الإدارة");
      }
    } catch (err) {
      console.error('[StudentPlansView] Subscription error:', err);
      const msg = err.message || "حدث خطأ أثناء إرسال طلب الترقية.";
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast(msg, "warning", 6000);
      } else {
        alert(msg);
      }
    }

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = this.render();
    }
  },

  async activateTrial() {
    const user = this.getUser();
    if (!user || !user.id || user.id.startsWith('ACC-2026') || user.id.startsWith('usr-')) {
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("يرجى تسجيل الدخول بحسابك أولاً.", "warning");
      } else {
        alert("يرجى تسجيل الدخول بحسابك أولاً.");
      }
      return;
    }

    try {
      if (typeof SupabaseService !== 'undefined' && SupabaseService.client) {
        await SupabaseService.requestSubscription('pro');
      } else {
        throw new Error('قاعدة البيانات السحابية غير متصلة.');
      }

      if (typeof AuthService !== 'undefined' && typeof AuthService.refreshUserSubscription === 'function') {
        await AuthService.refreshUserSubscription();
      }

      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast("تم إرسال طلب الترقية بنجاح، بانتظار اعتماد الإدارة", "success", 6000);
      } else {
        alert("تم إرسال طلب الترقية بنجاح، بانتظار اعتماد الإدارة");
      }
    } catch (err) {
      console.error('[StudentPlansView] Trial error:', err);
      const msg = err.message || "حدث خطأ أثناء إرسال طلب التجربة.";
      if (typeof AccModal !== 'undefined' && AccModal.toast) {
        AccModal.toast(msg, "warning", 6000);
      } else {
        alert(msg);
      }
    }

    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = this.render();
    }
  },

  downgradeToFree() {
    if (typeof AccModal !== 'undefined' && AccModal.toast) {
      AccModal.toast("لإلغاء الاشتراك أو التعديل، يرجى التواصل مع إدارة المنصة.", "info");
    } else {
      alert("لإلغاء الاشتراك أو التعديل، يرجى التواصل مع إدارة المنصة.");
    }
  }
};

window.ExcelStudentPlansView = ExcelStudentPlansView;
