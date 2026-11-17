/**
 * student-settings-view.js — شاشة إعدادات حساب الطالب وإدارة الملف الشخصي والأمان
 * 
 * الخصائص:
 * 1. تحديث المعلومات الشخصية والمهنية (الاسم، المسمى المستهدف، الجامعة، الهاتف، النبذة).
 * 2. تغيير كلمة المرور وفحص قوتها والتحقق من الأمان.
 * 3. تفضيلات المحاكاة (العملة، نبرة المراجع الذكي AI Mentor، الثيم، التنبيهات الصوتية).
 * 4. إدارة الباقة والترخيص المهني مع رابط المحفظة وسجل الشهادات.
 * 5. إدارة البيانات والخصوصية (تصدير نسخة احتياطية JSON، تصفير التمارين التدريبية).
 */

const ExcelStudentSettingsView = {
  activeTab: 'personal', // 'personal' | 'security' | 'preferences' | 'plan' | 'privacy'

  getUserData() {
    let user = null;
    try {
      if (typeof AuthService !== 'undefined') {
        user = AuthService.getCurrentUser();
      }
      if (!user) {
        const raw = localStorage.getItem('accountera_user');
        if (raw) user = JSON.parse(raw);
      }
    } catch (e) {}

    if (!user) {
      user = {
        id: 'ACC-2026-8942',
        name: 'محاسب مالي متدرب',
        email: 'student@accountera.edu',
        role: 'student',
        plan: 'free',
        phone: '01012345678',
        jobTitle: 'محاسب مالي عام',
        university: 'كلية التجارة - قسم المحاسبة',
        gradYear: '2025',
        bio: 'متدرب على الدورة المحاسبية الكاملة والمعايير المصرية والضرائب في منصة Accountera.'
      };
    }

    // قراءة التفضيلات
    let prefs = {
      currency: 'EGP',
      mentorTone: 'friendly',
      audioAlerts: true,
      publicProfile: true,
      theme: localStorage.getItem('accountera_theme') || 'light'
    };
    try {
      const savedPrefs = localStorage.getItem('acc_student_preferences');
      if (savedPrefs) prefs = { ...prefs, ...JSON.parse(savedPrefs) };
    } catch (e) {}

    return { user, prefs };
  },

  switchTab(tabKey) {
    this.activeTab = tabKey;
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = this.render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  render() {
    const { user, prefs } = this.getUserData();
    const userRoleText = user.role === 'admin' ? 'مدير النظام' : (user.role === 'teacher' ? 'مدرب معتمد' : 'طالب متدرب');
    const userPlanText = user.plan === 'vip' ? 'خبير النمذجة (VIP)' : (user.plan === 'pro' ? 'المحاسب المحترف (Pro)' : 'الباقة التأسيسية (Free)');
    const userPlanColor = user.plan === 'vip' ? 'var(--tier-vip)' : (user.plan === 'pro' ? 'var(--tier-pro)' : 'var(--tier-starter)');

    return `
      <div class="student-settings-container" style="max-width: 1050px; margin: 0 auto; padding: 1.5rem 1rem 4rem;">
        
        <!-- الترويسة الرئيسية للإعدادات بنمط Accountely النظيف -->
        <div class="settings-header-accountely" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.5rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem; width: 100%;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 58px; height: 58px; border-radius: 16px; background: var(--tier-starter-bg); border: 1.5px solid var(--tier-starter-border); display: flex; align-items: center; justify-content: center; color: var(--tier-starter);">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 28 }) : ''}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: var(--text-primary);">إعدادات الحساب والملف الشخصي</h1>
                  <span style="background: var(--tier-starter-bg); color: var(--tier-starter); border: 1px solid var(--tier-starter-border); padding: 3px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800;">
                    ${userPlanText}
                  </span>
                </div>
                <p style="color: var(--text-secondary); font-size: 0.88rem; margin: 4px 0 0;">
                  Account & Profile Settings • إدارة البيانات الشخصية، أمان كلمة المرور، وتفضيلات المحاكاة المحاسبية
                </p>
              </div>
            </div>

            <!-- أزرار الوصول السريع -->
            <div style="display: flex; gap: 8px;">
              <button onclick="navigateToScreen('student-dashboard')" class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 16 }) : ''}
                <span>لوحة المتابعة</span>
              </button>
              <button onclick="navigateToScreen('portfolio')" class="btn-cta-primary" style="background: var(--primary); color: var(--text-inverse); border: none; padding: 8px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trend-up', { size: 16 }) : ''}
                <span>محفظة الكفاءة</span>
              </button>
            </div>
          </div>
        </div>

        <!-- أشرطة التبويبات المتجاوبة بنمط حبوب Accountely -->
        <div class="settings-tabs-bar" style="display: flex; gap: 8px; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 4px;">
          <button class="settings-tab-accountely ${this.activeTab === 'personal' ? 'active' : ''}" onclick="ExcelStudentSettingsView.switchTab('personal')" style="display:inline-flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('user', { size: 16 }) : ''}
            <span>المعلومات الشخصية</span>
          </button>
          <button class="settings-tab-accountely ${this.activeTab === 'security' ? 'active' : ''}" onclick="ExcelStudentSettingsView.switchTab('security')" style="display:inline-flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('target', { size: 16 }) : ''}
            <span>الأمان وكلمة المرور</span>
          </button>
          <button class="settings-tab-accountely ${this.activeTab === 'preferences' ? 'active' : ''}" onclick="ExcelStudentSettingsView.switchTab('preferences')" style="display:inline-flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 16 }) : ''}
            <span>تفضيلات المحاكاة</span>
          </button>
          <button class="settings-tab-accountely ${this.activeTab === 'plan' ? 'active' : ''}" onclick="ExcelStudentSettingsView.switchTab('plan')" style="display:inline-flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 16 }) : ''}
            <span>تفاصيل الباقة</span>
          </button>
          <button class="settings-tab-accountely ${this.activeTab === 'privacy' ? 'active' : ''}" onclick="ExcelStudentSettingsView.switchTab('privacy')" style="display:inline-flex; align-items:center; gap:6px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 16 }) : ''}
            <span>البيانات والخصوصية</span>
          </button>
        </div>

        <!-- محتوى التبويب النشط -->
        <div class="settings-tab-content">
          ${this.renderActiveTabContent(user, prefs)}
        </div>

      </div>
    `;
  },

  renderActiveTabContent(user, prefs) {
    switch (this.activeTab) {
      case 'personal':
        return this.renderPersonalTab(user);
      case 'security':
        return this.renderSecurityTab(user);
      case 'preferences':
        return this.renderPreferencesTab(user, prefs);
      case 'plan':
        return this.renderPlanTab(user);
      case 'privacy':
        return this.renderPrivacyTab(user);
      default:
        return this.renderPersonalTab(user);
    }
  },

  // 1. تبويب المعلومات الشخصية
  renderPersonalTab(user) {
    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('user', { size: 20 }) : ''}
            <span>المعلومات والبيانات الشخصية</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">تظهر هذه البيانات في محفظتك الموثقة وشهادات الكفاءة المهنية الصادرة لك.</p>
        </div>

        <form onsubmit="ExcelStudentSettingsView.savePersonalInfo(event)">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label for="set_name" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">الاسم الكامل:</label>
              <input type="text" id="set_name" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.name || ''}" required>
            </div>

            <div>
              <label for="set_email" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">البريد الإلكتروني:</label>
              <input type="email" id="set_email" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.email || ''}" required>
            </div>

            <div>
              <label for="set_phone" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">رقم الهاتف / واتساب:</label>
              <input type="tel" id="set_phone" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); text-align: left; direction: ltr;" value="${user.phone || ''}" placeholder="01xxxxxxxxx">
            </div>

            <div>
              <label for="set_job_title" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">المسمى الوظيفي المستهدف:</label>
              <select id="set_job_title" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);">
                <option value="محاسب مالي عام" ${user.jobTitle === 'محاسب مالي عام' ? 'selected' : ''}>محاسب مالي عام (General Accountant)</option>
                <option value="أخصائي حسابات موردين ومخازن" ${user.jobTitle === 'أخصائي حسابات موردين ومخازن' ? 'selected' : ''}>أخصائي حسابات موردين ومخازن (AP Specialist)</option>
                <option value="أخصائي ضرائب مصرية وقيمة مضافة" ${user.jobTitle === 'أخصائي ضرائب مصرية وقيمة مضافة' ? 'selected' : ''}>أخصائي ضرائب مصرية وقيمة مضافة (Tax Specialist)</option>
                <option value="محاسب تكاليف ومصانع" ${user.jobTitle === 'محاسب تكاليف ومصانع' ? 'selected' : ''}>محاسب تكاليف ومصانع (Cost Accountant)</option>
                <option value="مراجع حسابات مبتدئ" ${user.jobTitle === 'مراجع حسابات مبتدئ' ? 'selected' : ''}>مراجع حسابات مبتدئ (Junior Auditor)</option>
                <option value="طالب جامعي / خريج جديد" ${user.jobTitle === 'طالب جامعي / خريج جديد' ? 'selected' : ''}>طالب جامعي / خريج جديد (Accounting Graduate)</option>
              </select>
            </div>

            <div>
              <label for="set_university" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">الجامعة / الكلية:</label>
              <input type="text" id="set_university" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.university || ''}" placeholder="مثال: جامعة القاهرة - كلية التجارة">
            </div>

            <div>
              <label for="set_grad_year" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">سنة التخرج أو الفرقة:</label>
              <input type="text" id="set_grad_year" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.gradYear || ''}" placeholder="مثال: 2025 أو الفرقة الرابعة">
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label for="set_bio" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">النبذة المهنية المختصرة (Bio):</label>
            <textarea id="set_bio" rows="3" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); resize: vertical;" placeholder="اكتب سطرين عن خبرتك واهتماماتك المحاسبية ليراها أصحاب العمل في محفظتك الموثقة...">${user.bio || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('save', { size: 16 }) : ''}
              <span>حفظ البيانات الشخصية</span>
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // 2. تبويب الأمان وكلمة المرور
  renderSecurityTab(user) {
    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 20 }) : ''}
            <span>أمان الحساب وتغيير كلمة المرور</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">قم بتحديث كلمة المرور لحماية مسيرتك التدريبية وبيانات محفظتك المهنية.</p>
        </div>

        <form onsubmit="ExcelStudentSettingsView.changePassword(event)" style="max-width: 540px;">
          <div style="margin-bottom: 1.25rem;">
            <label for="pwd_current" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">كلمة المرور الحالية:</label>
            <input type="password" id="pwd_current" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="••••••••" required>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">أدخل كلمة المرور الحالية لتأكيد هويتك.</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label for="pwd_new" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">كلمة المرور الجديدة:</label>
            <input type="password" id="pwd_new" oninput="ExcelStudentSettingsView.checkPasswordStrength(this.value)" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="لا تقل عن 6 أحرف أو أرقام" required>
            
            <!-- مؤشر قوة كلمة المرور -->
            <div style="margin-top: 8px;">
              <div style="width: 100%; height: 6px; background: var(--border-subtle); border-radius: 999px; overflow: hidden;">
                <div id="pwd_strength_bar" style="width: 0%; height: 100%; background: var(--danger); transition: all 0.3s ease;"></div>
              </div>
              <span id="pwd_strength_text" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">قوة كلمة المرور: لم تدخل بعد</span>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label for="pwd_confirm" class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">تأكيد كلمة المرور الجديدة:</label>
            <input type="password" id="pwd_confirm" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="أعد إدخال كلمة المرور الجديدة" required>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" id="pwd_submit_btn" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 16 }) : ''}
              <span>تحديث كلمة المرور الآن</span>
            </button>
            <button type="button" onclick="AuthService.logout()" class="btn-cta-secondary" style="padding: 10px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sign-out', { size: 16 }) : ''}
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // 3. تبويب تفضيلات المحاكاة والنظام
  renderPreferencesTab(user, prefs) {
    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('gear', { size: 20 }) : ''}
            <span>تفضيلات بيئة العمل والمحاكاة</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">خصص تجربة التدريب، العملات المحاسبية، وسلوك المساعد الذكي.</p>
        </div>

        <form onsubmit="ExcelStudentSettingsView.savePreferences(event)">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.75rem;">
            
            <!-- العملة الافتراضية -->
            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">العملة الافتراضية للدفاتر:</label>
              <select id="pref_currency" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);">
                <option value="EGP" ${prefs.currency === 'EGP' ? 'selected' : ''}>جنيه مصري (EGP ج.م) - المعايير المصرية</option>
                <option value="SAR" ${prefs.currency === 'SAR' ? 'selected' : ''}>ريال سعودي (SAR ر.س) - معايير SOCPA</option>
                <option value="USD" ${prefs.currency === 'USD' ? 'selected' : ''}>دولار أمريكي (USD $) - المعايير الدولية IFRS</option>
              </select>
            </div>

            <!-- أسلوب ونبرة المراجع الذكي AI Mentor -->
            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">أسلوب المدقق الآلي (AI Mentor Tone):</label>
              <select id="pref_mentor_tone" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);">
                <option value="friendly" ${prefs.mentorTone === 'friendly' ? 'selected' : ''}>تعليمي وتشجيعي (شرح وافٍ مع أمثلة تبسيطية)</option>
                <option value="strict" ${prefs.mentorTone === 'strict' ? 'selected' : ''}>تدقيق مهني صارم (كنبرة مراجع حسابات خارجي Big 4)</option>
                <option value="concise" ${prefs.mentorTone === 'concise' ? 'selected' : ''}>موجز وسريع (تحديد الخطأ والتصحيح مباشرة)</option>
              </select>
            </div>

            <!-- وضع الثيم (نهاري / ليلي) -->
            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">المظهر العام (Theme):</label>
              <select id="pref_theme" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);">
                <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>الوضع النهاري الكلاسيكي (Light)</option>
                <option value="dark" ${prefs.theme === 'dark' ? 'selected' : ''}>الوضع الليلي المريح للعين (Dark Mode)</option>
              </select>
            </div>

          </div>

          <!-- خيارات التبديل (Toggles) -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem;">
            <label style="display: flex; align-items: center; gap: 12px; background: var(--surface-ground); padding: 14px; border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer;">
              <input type="checkbox" id="pref_audio" ${prefs.audioAlerts ? 'checked' : ''} style="width: 18px; height: 18px;">
              <div>
                <strong style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem;">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('bell', { size: 16 }) : ''}
                  <span>المؤثرات الصوتية عند اتزان وترحيل القيد</span>
                </strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">تشغيل نغمة تأكيد لطيفة عند اتزان طرفي القيد المحاسبي باليومية.</span>
              </div>
            </label>

            <label style="display: flex; align-items: center; gap: 12px; background: var(--surface-ground); padding: 14px; border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer;">
              <input type="checkbox" id="pref_public" ${prefs.publicProfile ? 'checked' : ''} style="width: 18px; height: 18px;">
              <div>
                <strong style="display: flex; align-items: center; gap: 6px; font-size: 0.9rem;">
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('globe', { size: 16 }) : ''}
                  <span>إتاحة المحفظة المهنية للعامة وأصحاب العمل</span>
                </strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">السماح للشركات بالتحقق من شهاداتك وسجل كفاءتك عبر رابط محفظتك العام.</span>
              </div>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('save', { size: 16 }) : ''}
              <span>حفظ التفضيلات</span>
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // 4. تبويب تفاصيل الباقة والاشتراك
  renderPlanTab(user) {
    let plans = (typeof SupabaseService !== 'undefined' && SupabaseService.getCachedActivePlans)
      ? SupabaseService.getCachedActivePlans()
      : ((typeof window !== 'undefined' && window.DEFAULT_ADMIN_PLANS) ? window.DEFAULT_ADMIN_PLANS : []);

    if (typeof SupabaseService !== 'undefined' && SupabaseService.getActivePlans && (!plans || plans.length === 0)) {
      SupabaseService.getActivePlans().then(loadedPlans => {
        if (loadedPlans && loadedPlans.length > 0) {
          const tabContent = document.getElementById('settingsTabContent');
          if (tabContent && document.querySelector('.settings-tab-btn.active')?.getAttribute('data-tab') === 'plan') {
            tabContent.innerHTML = ExcelStudentSettingsView.renderPlanTab(user);
          }
        }
      }).catch(() => {});
    }

    const currentPlan = plans.find(p => p.id === user.plan) || plans.find(p => p.id === 'free') || {
      name: 'الباقة التأسيسية',
      price: 0,
      period: 'مدى الحياة',
      allowLinkedInShare: false
    };

    let remainingDays = 0;
    let remainingDaysText = 'مدى الحياة';
    const startDateText = user.subscribedAt ? new Date(user.subscribedAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }) : 'غير محدد';
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

    const isTrial = !!user.isTrial;
    const statusBadge = isTrial
      ? `<span style="padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 800; background: rgba(245, 158, 11, 0.15); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3);">فترة تجريبية مجانية ⏱️</span>`
      : `<span style="padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 800; background: var(--primary-light); color: var(--primary); border: 1px solid var(--primary-border);">حالة الاشتراك: سارٍ ونشط ✓</span>`;

    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 20 }) : ''}
              <span>باقة التدريب ومؤقت الصلاحية</span>
            </h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">تفاصيل الصلاحية، تاريخ انتهاء الاشتراك، ومميزات الباقة الحالية.</p>
          </div>
          ${statusBadge}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem;">
            <div style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 4px;">اسم الباقة الحالية:</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary); margin-bottom: 10px;">${currentPlan.name}</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.7;">
              <div>المدة الرسمية: <strong>${currentPlan.period || 'مدى الحياة'}</strong></div>
              <div>القيمة: <strong>${currentPlan.price === 0 ? 'مجاناً' : `${currentPlan.price} ج.م`}</strong></div>
            </div>
          </div>

          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem;">
            <div style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 6px;">مؤقت وتواريخ الاشتراك:</div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem;">
              <div>• تاريخ البدء والتفعيل: <strong class="tabular-nums font-mono">${startDateText}</strong></div>
              <div>• تاريخ انتهاء الصلاحية: <strong class="tabular-nums font-mono" style="color: ${user.expiresAt ? 'var(--primary)' : 'inherit'};">${endDateText}</strong></div>
              <div>• الوقت المتبقي: <strong class="tabular-nums font-mono" style="color: ${remainingDays > 5 || !user.expiresAt ? 'var(--success)' : 'var(--danger)'};">${remainingDaysText}</strong></div>
            </div>
          </div>

          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem;">
            <div style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 6px;">ميزات الباقة وصلاحية لينكد إن:</div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
              <div>• النواة المحاسبية والقيد المزدوج: <strong style="color:var(--success);">مفعل</strong></div>
              <div>• مشاركة المحفظة على LinkedIn: <strong style="color:${currentPlan.allowLinkedInShare ? 'var(--success)' : 'var(--danger)'};">${currentPlan.allowLinkedInShare ? 'متاح في باقتك' : 'يتطلب ترقية لـ Pro'}</strong></div>
              <div>• اعتماد الشهادات برقم QR: <strong style="color:var(--success);">متاح</strong></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${user.plan === 'free' ? `
            <button onclick="navigateToScreen('student-plans')" class="btn-cta-primary" style="padding: 10px 20px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 16 }) : ''}
              <span>ترقية الباقة الآن</span>
            </button>
          ` : `
            <button onclick="navigateToScreen('student-plans')" class="btn-cta-secondary" style="padding: 10px 16px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('credit-card', { size: 16 }) : ''}
              <span>تجديد أو ترقية الباقة</span>
            </button>
            <button onclick="navigateToScreen('portfolio')" class="btn-cta-primary" style="padding: 10px 20px; font-size: 0.88rem; display: inline-flex; align-items: center; gap: 8px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('briefcase', { size: 16 }) : ''}
              <span>فتح المحفظة ومشاركتها على LinkedIn</span>
            </button>
          `}
        </div>
      </div>
    `;
  },

  // 5. تبويب البيانات والخصوصية
  renderPrivacyTab(user) {
    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
            ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('shield', { size: 20 }) : ''}
            <span>إدارة البيانات والنسخ الاحتياطي</span>
          </h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">تصدير سجل القيود والدورة المحاسبية أو إعادة ضبط التمارين.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-ground); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="display: flex; align-items: center; gap: 6px; font-size: 0.92rem; color: var(--text-primary);">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 16 }) : ''}
                <span>تصدير السجل المحاسبي بالكامل (JSON Backup)</span>
              </strong>
              <span style="font-size: 0.8rem; color: var(--text-muted);">تحميل ملف احتياطي بكافة قيود اليومية وبيانات المحفظة المهنية.</span>
            </div>
            <button onclick="ExcelStudentSettingsView.exportStudentData()" class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('download', { size: 16 }) : ''}
              <span>تصدير الملف</span>
            </button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(239, 68, 68, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="display: flex; align-items: center; gap: 6px; font-size: 0.92rem; color: var(--danger);">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('warning', { size: 16 }) : ''}
                <span>تصفير محاكاة الدفاتر والبدء من جديد</span>
              </strong>
              <span style="font-size: 0.8rem; color: var(--text-muted);">مسح كافة القيود المسجلة باليومية لإعادة التدريب من البداية مع الحفاظ على الحساب.</span>
            </div>
            <button onclick="ExcelStudentSettingsView.resetTrainingProgress()" class="btn-cta-secondary" style="background: transparent; color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.4); padding: 8px 16px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">
              ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('rotate', { size: 16 }) : ''}
              <span>تصفير القيود</span>
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // منطق فحص قوة كلمة المرور لحظياً
  checkPasswordStrength(pwd) {
    const bar = document.getElementById('pwd_strength_bar');
    const text = document.getElementById('pwd_strength_text');
    if (!bar || !text) return;

    if (!pwd || pwd.length === 0) {
      bar.style.width = '0%';
      text.textContent = 'قوة كلمة المرور: لم تدخل بعد';
      return;
    }

    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) {
      bar.style.width = '33%';
      bar.style.background = 'var(--danger)';
      text.textContent = 'قوة كلمة المرور: ضعيفة (يُفضل إضافة أرقام ورموز)';
      text.style.color = 'var(--danger)';
    } else if (score <= 3) {
      bar.style.width = '66%';
      bar.style.background = 'var(--warning)';
      text.textContent = 'قوة كلمة المرور: متوسطة (جيدة ومقبولة)';
      text.style.color = 'var(--warning)';
    } else {
      bar.style.width = '100%';
      bar.style.background = 'var(--success)';
      text.textContent = 'قوة كلمة المرور: قوية جداً وحصينة ✓';
      text.style.color = 'var(--success)';
    }
  },

  // حفظ البيانات الشخصية
  async savePersonalInfo(e) {
    e.preventDefault();
    const { user } = this.getUserData();

    user.name = document.getElementById('set_name')?.value.trim() || user.name;
    user.email = document.getElementById('set_email')?.value.trim() || user.email;
    user.phone = document.getElementById('set_phone')?.value.trim() || '';
    user.jobTitle = document.getElementById('set_job_title')?.value || user.jobTitle;
    user.university = document.getElementById('set_university')?.value.trim() || '';
    user.gradYear = document.getElementById('set_grad_year')?.value.trim() || '';
    user.bio = document.getElementById('set_bio')?.value.trim() || '';

    // حفظ في الجلسة المحلية مع إزالة أي أثر قديم لـ jr_users
    try {
      localStorage.setItem('accountera_user', JSON.stringify(user));
      if (typeof AuthService !== 'undefined') {
        AuthService.currentUser = user;
        AuthService.updateTopBarUI();
      }
      localStorage.removeItem('jr_users');
    } catch (err) {}

    // تحديث البيانات في Supabase إذا كانت الجلسة نشطة
    const client = (typeof window !== 'undefined' && window.SupabaseService) ? window.SupabaseService.client : null;
    if (client && client.auth) {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session && session.user) {
          await client.from('profiles').update({ full_name: user.name }).eq('id', session.user.id);
          // مزامنة الميتاداتا السحابية الكاملة (الهاتف والجامعة والسنة الدراسية)
          await client.auth.updateUser({
            data: {
              full_name: user.name,
              phone: user.phone,
              university: user.university,
              academic_year: user.gradYear
            }
          });
        }
      } catch (e) {
        console.warn('[Settings] Failed to sync profile to Supabase:', e);
      }
    }

    if (typeof AccModal !== 'undefined') {
      AccModal.toast("✓ تم حفظ وتحديث البيانات الشخصية بنجاح!", "success");
    } else if (typeof alert !== 'undefined') {
      alert("✓ تم حفظ وتحديث البيانات الشخصية بنجاح!");
    }
  },

  // تغيير كلمة المرور - تحديث سحابي حقيقي عبر Supabase Auth حصرياً
  async changePassword(e) {
    e.preventDefault();

    const current = document.getElementById('pwd_current')?.value;
    const newPwd = document.getElementById('pwd_new')?.value;
    const confirmPwd = document.getElementById('pwd_confirm')?.value;
    const submitBtn = document.getElementById('pwd_submit_btn');

    if (!newPwd || newPwd.length < 6) {
      if (typeof AccModal !== 'undefined') AccModal.toast("يجب أن تكون كلمة المرور الجديدة 6 أحرف أو أرقام على الأقل", "error");
      else if (typeof alert !== 'undefined') alert("يجب أن تكون كلمة المرور الجديدة 6 أحرف أو أرقام على الأقل");
      return;
    }

    if (newPwd !== confirmPwd) {
      if (typeof AccModal !== 'undefined') AccModal.toast("كلمة المرور الجديدة وتأكيدها غير متطابقين!", "error");
      else if (typeof alert !== 'undefined') alert("كلمة المرور الجديدة وتأكيدها غير متطابقين!");
      return;
    }

    const client = (typeof window !== 'undefined' && window.SupabaseService) ? window.SupabaseService.client : null;
    if (!client || !client.auth) {
      const msg = "خدمة المصادقة السحابية غير متصلة حالياً، يرجى التحقق من اتصالك بالإنترنت.";
      if (typeof AccModal !== 'undefined') AccModal.toast(msg, "error");
      else if (typeof alert !== 'undefined') alert(msg);
      return;
    }

    const { data: { session } } = await client.auth.getSession();
    if (!session || !session.user) {
      const msg = "يجب تسجيل الدخول بحساب موثق لتغيير كلمة المرور.";
      if (typeof AccModal !== 'undefined') AccModal.toast(msg, "error");
      else if (typeof alert !== 'undefined') alert(msg);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>جاري تحديث كلمة المرور...</span>`;
    }

    try {
      // 1. التحقق من صحة كلمة المرور الحالية عبر عميل منفصل لا يمس الجلسة الحالية
      if (current && session.user.email) {
        if (typeof window.supabase !== 'undefined' && typeof SUPABASE_CONFIG !== 'undefined') {
          const tempClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey, {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
          });
          const { error: verifyErr } = await tempClient.auth.signInWithPassword({
            email: session.user.email,
            password: current
          });
          if (verifyErr) {
            throw new Error("كلمة المرور الحالية غير صحيحة!");
          }
        }
      }

      // 2. تحديث كلمة المرور الحقيقية في Supabase عبر جلسة المستخدم الحالية
      const { data, error } = await client.auth.updateUser({
        password: newPwd
      });

      if (error) {
        const translated = (typeof AuthService !== 'undefined' && AuthService.translateAuthError)
          ? AuthService.translateAuthError(error)
          : (error.message || "فشل تحديث كلمة المرور في الخادم.");
        throw new Error(translated);
      }

      if (!data || !data.user) {
        throw new Error("لم تستجب خدمة المصادقة بتأكيد التحديث، يرجى المحاولة مرة أخرى.");
      }

      // إزالة أي بقايا سابقة للباسورد من التخزين المحلي نهائياً
      try {
        const savedRaw = localStorage.getItem('accountera_user');
        if (savedRaw) {
          const savedUser = JSON.parse(savedRaw);
          delete savedUser.password;
          localStorage.setItem('accountera_user', JSON.stringify(savedUser));
        }
        localStorage.removeItem('jr_users');
      } catch (e) {}

      if (typeof AccModal !== 'undefined') {
        AccModal.toast("تم الحفظ بنجاح", "success");
      } else if (typeof alert !== 'undefined') {
        alert("تم الحفظ بنجاح");
      }

      // تصفير الحقول
      if (document.getElementById('pwd_current')) document.getElementById('pwd_current').value = '';
      if (document.getElementById('pwd_new')) document.getElementById('pwd_new').value = '';
      if (document.getElementById('pwd_confirm')) document.getElementById('pwd_confirm').value = '';
      this.checkPasswordStrength('');
    } catch (err) {
      if (typeof AccModal !== 'undefined') {
        AccModal.toast(err.message || "فشل تحديث كلمة المرور.", "error");
      } else if (typeof alert !== 'undefined') {
        alert(err.message || "فشل تحديث كلمة المرور.");
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('lock', { size: 16 }) : ''}
          <span>تحديث كلمة المرور الآن</span>
        `;
      }
    }
  },

  // حفظ التفضيلات
  savePreferences(e) {
    e.preventDefault();
    const currency = document.getElementById('pref_currency')?.value || 'EGP';
    const mentorTone = document.getElementById('pref_mentor_tone')?.value || 'friendly';
    const theme = document.getElementById('pref_theme')?.value || 'light';
    const audioAlerts = document.getElementById('pref_audio')?.checked ?? true;
    const publicProfile = document.getElementById('pref_public')?.checked ?? true;

    const prefs = { currency, mentorTone, theme, audioAlerts, publicProfile };
    try {
      localStorage.setItem('acc_student_preferences', JSON.stringify(prefs));
      
      // تطبيق الثيم فوراً
      localStorage.setItem('accountera_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      const themeBtn = document.getElementById('themeToggleBtn');
      if (themeBtn && typeof AccounteraIcons !== 'undefined') {
        themeBtn.innerHTML = theme === 'dark' ? AccounteraIcons.render('sun', { size: 18 }) : AccounteraIcons.render('moon', { size: 18 });
      }
    } catch(err) {}

    if (typeof AccModal !== 'undefined') {
      AccModal.toast("✓ تم حفظ تفضيلات بيئة التدريب والمظهر بنجاح!", "success");
    } else if (typeof alert !== 'undefined') {
      alert("✓ تم حفظ تفضيلات بيئة التدريب والمظهر بنجاح!");
    }
  },

  // تصدير ملف النسخة الاحتياطية للطالب
  exportStudentData() {
    const { user, prefs } = this.getUserData();
    let journal = [];
    try {
      journal = JSON.parse(localStorage.getItem('student_journal') || '[]');
    } catch(e) {}

    const exportData = {
      platform: "Accountera Accounting Platform",
      exportDate: new Date().toISOString(),
      studentProfile: user,
      preferences: prefs,
      postedJournalEntries: journal
    };

    if (typeof Blob !== 'undefined' && typeof URL !== 'undefined') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `accountera-student-backup-${user.id || 'ACC'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }

    if (typeof AccModal !== 'undefined') {
      AccModal.toast("✓ تم تنزيل ملف النسخة الاحتياطية بنجاح!", "success");
    } else if (typeof alert !== 'undefined') {
      alert("✓ تم تنزيل ملف النسخة الاحتياطية بنجاح!");
    }
  },

  // تصفير بيانات المحاكاة والقيود
  async resetTrainingProgress() {
    let conf = false;
    if (typeof AccModal !== 'undefined') {
      conf = await AccModal.confirm({
        title: 'تصفير محاكي القيود',
        message: 'هل أنت متأكد من رغبتك في تصفير دفتر اليومية والبدء من جديد؟ لن يتم حذف بيانات حسابك أو شهاداتك.',
        confirmText: 'نعم، تصفير الدفاتر',
        cancelText: 'إلغاء',
        danger: true
      });
    } else {
      conf = confirm('هل أنت متأكد من رغبتك في تصفير دفتر اليومية؟');
    }

    if (conf) {
      localStorage.removeItem('student_journal');
      localStorage.removeItem('sim_company_profile');
      if (typeof AccModal !== 'undefined') {
        AccModal.toast("✓ تم تصفير سجل القيود. يمكنك الآن بدء دورة محاسبية جديدة!", "success");
      } else {
        alert("✓ تم تصفير سجل القيود بنجاح!");
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.ExcelStudentSettingsView = ExcelStudentSettingsView;
}
if (typeof module !== 'undefined') {
  module.exports = ExcelStudentSettingsView;
}
