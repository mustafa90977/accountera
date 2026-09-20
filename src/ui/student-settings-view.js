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
    const userPlanColor = user.plan === 'vip' ? '#8b5cf6' : (user.plan === 'pro' ? '#3b82f6' : '#10b981');

    return `
      <div class="student-settings-container" style="max-width: 1050px; margin: 0 auto; padding: 1.5rem 1rem 4rem;">
        
        <!-- الترويسة الرئيسية للإعدادات بنمط Accountely النظيف -->
        <div class="settings-header-accountely" style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 1.5rem 2rem; box-shadow: 0 2px 10px rgba(0,0,0,0.02); margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.25rem; width: 100%;">
            <div style="display: flex; align-items: center; gap: 1.25rem;">
              <div style="width: 58px; height: 58px; border-radius: 16px; background: #e6f7f0; border: 1.5px solid #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: #059669;">
                ⚙️
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h1 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: #0f172a;">إعدادات الحساب والملف الشخصي</h1>
                  <span style="background: #e6f7f0; color: #059669; border: 1px solid #10b981; padding: 3px 12px; border-radius: 999px; font-size: 0.78rem; font-weight: 800;">
                    ${userPlanText}
                  </span>
                </div>
                <p style="color: #64748b; font-size: 0.88rem; margin: 4px 0 0;">
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
              <button onclick="navigateToScreen('portfolio')" class="btn-cta-primary" style="background: var(--primary); color: #fff; border: none; padding: 8px 16px; font-size: 0.85rem; font-weight: 700; border-radius: 8px; display: inline-flex; align-items: center; gap: 6px;">
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
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">👤 المعلومات والبيانات الشخصية</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">تظهر هذه البيانات في محفظتك الموثقة وشهادات الكفاءة المهنية الصادرة لك.</p>
        </div>

        <form onsubmit="ExcelStudentSettingsView.savePersonalInfo(event)">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem;">
            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">الاسم الكامل:</label>
              <input type="text" id="set_name" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.name || ''}" required>
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">البريد الإلكتروني:</label>
              <input type="email" id="set_email" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.email || ''}" required>
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">رقم الهاتف / واتساب:</label>
              <input type="tel" id="set_phone" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); text-align: left; direction: ltr;" value="${user.phone || ''}" placeholder="01xxxxxxxxx">
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">المسمى الوظيفي المستهدف:</label>
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
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">الجامعة / الكلية:</label>
              <input type="text" id="set_university" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.university || ''}" placeholder="مثال: جامعة القاهرة - كلية التجارة">
            </div>

            <div>
              <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">سنة التخرج أو الفرقة:</label>
              <input type="text" id="set_grad_year" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" value="${user.gradYear || ''}" placeholder="مثال: 2025 أو الفرقة الرابعة">
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">النبذة المهنية المختصرة (Bio):</label>
            <textarea id="set_bio" rows="3" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary); resize: vertical;" placeholder="اكتب سطرين عن خبرتك واهتماماتك المحاسبية ليراها أصحاب العمل في محفظتك الموثقة...">${user.bio || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800;">
              💾 حفظ البيانات الشخصية
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
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">🔐 أمان الحساب وتغيير كلمة المرور</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">قم بتحديث كلمة المرور لحماية مسيرتك التدريبية وبيانات محفظتك المهنية.</p>
        </div>

        <form onsubmit="ExcelStudentSettingsView.changePassword(event)" style="max-width: 540px;">
          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">كلمة المرور الحالية:</label>
            <input type="password" id="pwd_current" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="••••••••" required>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">إذا كان هذا حساباً تجريبياً، يمكنك كتابة أي كلمة مرور أو تركها.</span>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">كلمة المرور الجديدة:</label>
            <input type="password" id="pwd_new" oninput="ExcelStudentSettingsView.checkPasswordStrength(this.value)" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="لا تقل عن 6 أحرف أو أرقام" required>
            
            <!-- مؤشر قوة كلمة المرور -->
            <div style="margin-top: 8px;">
              <div style="width: 100%; height: 6px; background: var(--border-subtle); border-radius: 999px; overflow: hidden;">
                <div id="pwd_strength_bar" style="width: 0%; height: 100%; background: #ef4444; transition: all 0.3s ease;"></div>
              </div>
              <span id="pwd_strength_text" style="font-size: 0.75rem; color: var(--text-muted); display: block; margin-top: 4px;">قوة كلمة المرور: لم تدخل بعد</span>
            </div>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label class="form-label" style="display: block; font-size: 0.85rem; font-weight: 700; margin-bottom: 6px;">تأكيد كلمة المرور الجديدة:</label>
            <input type="password" id="pwd_confirm" class="form-input" style="width: 100%; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border-subtle); background: var(--surface-ground); color: var(--text-primary);" placeholder="أعد إدخال كلمة المرور الجديدة" required>
          </div>

          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800;">
              🔒 تحديث كلمة المرور الآن
            </button>
            <button type="button" onclick="AuthService.logout()" class="btn-cta-secondary" style="padding: 10px 16px; font-size: 0.85rem;">
              🚪 تسجيل الخروج
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
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">⚙️ تفضيلات بيئة العمل والمحاكاة</h2>
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
                <option value="light" ${prefs.theme === 'light' ? 'selected' : ''}>☀️ الوضع النهاري الكلاسيكي (Light)</option>
                <option value="dark" ${prefs.theme === 'dark' ? 'selected' : ''}>🌙 الوضع الليلي المريح للعين (Dark Mode)</option>
              </select>
            </div>

          </div>

          <!-- خيارات التبديل (Toggles) -->
          <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 2rem;">
            <label style="display: flex; align-items: center; gap: 12px; background: var(--surface-ground); padding: 14px; border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer;">
              <input type="checkbox" id="pref_audio" ${prefs.audioAlerts ? 'checked' : ''} style="width: 18px; height: 18px;">
              <div>
                <strong style="display: block; font-size: 0.9rem;">🔔 المؤثرات الصوتية عند اتزان وترحيل القيد</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">تشغيل نغمة تأكيد لطيفة عند اتزان طرفي القيد المحاسبي باليومية.</span>
              </div>
            </label>

            <label style="display: flex; align-items: center; gap: 12px; background: var(--surface-ground); padding: 14px; border-radius: 10px; border: 1px solid var(--border-subtle); cursor: pointer;">
              <input type="checkbox" id="pref_public" ${prefs.publicProfile ? 'checked' : ''} style="width: 18px; height: 18px;">
              <div>
                <strong style="display: block; font-size: 0.9rem;">🌐 إتاحة المحفظة المهنية للعامة وأصحاب العمل</strong>
                <span style="font-size: 0.78rem; color: var(--text-muted);">السماح للشركات بالتحقق من شهاداتك وسجل كفاءتك عبر رابط محفظتك العام.</span>
              </div>
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button type="submit" class="btn-cta-primary" style="padding: 10px 24px; font-weight: 800;">
              💾 حفظ التفضيلات
            </button>
          </div>
        </form>
      </div>
    `;
  },

  // 4. تبويب تفاصيل الباقة والاشتراك
  renderPlanTab(user) {
    let plans = (typeof DEFAULT_ADMIN_PLANS !== 'undefined') ? DEFAULT_ADMIN_PLANS : [];
    try {
      const saved = localStorage.getItem('acc_admin_plans');
      if (saved) plans = JSON.parse(saved);
    } catch(e) {}

    const currentPlan = plans.find(p => p.id === user.plan) || plans.find(p => p.id === 'free') || {
      name: 'الباقة التأسيسية (Free)',
      price: 0,
      period: 'مدى الحياة',
      allowLinkedInShare: false
    };

    return `
      <div class="settings-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 18px; padding: 2rem; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <div style="border-bottom: 1px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">💳 باقة التدريب النشطة</h2>
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">صلاحيات حسابك، مميزات الباقة، وحالة مشاركة الاعتماد المهني.</p>
          </div>
          <span style="padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 800; background: var(--primary-light); color: var(--primary); border: 1px solid var(--primary-border);">
            حالة الاشتراك: سارٍ ونشط ✓
          </span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem;">
            <div style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 4px;">اسم الباقة الحالية:</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--primary); margin-bottom: 10px;">${currentPlan.name}</div>
            <div style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
              المدة: <strong>${currentPlan.period || 'مدى الحياة'}</strong> • القيمة: <strong>${currentPlan.price === 0 ? 'مجاناً' : `${currentPlan.price} ج.م`}</strong>
            </div>
          </div>

          <div style="background: var(--surface-ground); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 1.5rem;">
            <div style="color: var(--text-muted); font-size: 0.82rem; margin-bottom: 6px;">ميزات الباقة وصلاحية لينكد إن:</div>
            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
              <div>• النواة المحاسبية والقيد المزدوج: <strong style="color:#10b981;">🟢 مفعل</strong></div>
              <div>• مشاركة المحفظة على LinkedIn: <strong style="color:${currentPlan.allowLinkedInShare ? '#10b981' : '#ef4444'};">${currentPlan.allowLinkedInShare ? '🟢 متاح في باقتك' : '🔒 يتطلب ترقية لـ Pro'}</strong></div>
              <div>• اعتماد الشهادات برقم QR: <strong style="color:#10b981;">🟢 متاح</strong></div>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${user.plan === 'free' ? `
            <button onclick="navigateToScreen('student-plans')" class="btn-cta-primary" style="padding: 10px 20px; font-size: 0.88rem;">
              🚀 ترقية الباقة إلى المحترف (Pro)
            </button>
            <button onclick="AccounteraPortfolioEngine.upgradeToProTrial()" class="btn-cta-secondary" style="padding: 10px 16px; font-size: 0.88rem;">
              ⚡ تجربة باقة Pro الفورية
            </button>
          ` : `
            <button onclick="navigateToScreen('portfolio')" class="btn-cta-primary" style="padding: 10px 20px; font-size: 0.88rem;">
              💼 فتح المحفظة ومشاركتها على LinkedIn
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
          <h2 style="font-size: 1.2rem; font-weight: 800; margin: 0 0 4px; color: var(--text-primary);">🛡️ إدارة البيانات والنسخ الاحتياطي</h2>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">تصدير سجل القيود والدورة المحاسبية أو إعادة ضبط التمارين.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.25rem;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-ground); padding: 1.25rem; border-radius: 12px; border: 1px solid var(--border-subtle); flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="display: block; font-size: 0.92rem; color: var(--text-primary);">📥 تصدير السجل المحاسبي بالكامل (JSON Backup)</strong>
              <span style="font-size: 0.8rem; color: var(--text-muted);">تحميل ملف احتياطي بكافة قيود اليومية وبيانات المحفظة المهنية.</span>
            </div>
            <button onclick="ExcelStudentSettingsView.exportStudentData()" class="btn-cta-secondary" style="padding: 8px 16px; font-size: 0.85rem;">
              تصدير الملف 💾
            </button>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(239, 68, 68, 0.04); padding: 1.25rem; border-radius: 12px; border: 1px solid rgba(239, 68, 68, 0.2); flex-wrap: wrap; gap: 1rem;">
            <div>
              <strong style="display: block; font-size: 0.92rem; color: #ef4444;">⚠️ تصفير محاكاة الدفاتر والبدء من جديد</strong>
              <span style="font-size: 0.8rem; color: var(--text-muted);">مسح كافة القيود المسجلة باليومية لإعادة التدريب من البداية مع الحفاظ على الحساب.</span>
            </div>
            <button onclick="ExcelStudentSettingsView.resetTrainingProgress()" class="btn-cta-secondary" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 8px 16px; font-size: 0.85rem;">
              تصفير القيود 🔄
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
      bar.style.background = '#ef4444';
      text.textContent = 'قوة كلمة المرور: ضعيفة (يُفضل إضافة أرقام ورموز)';
      text.style.color = '#ef4444';
    } else if (score <= 3) {
      bar.style.width = '66%';
      bar.style.background = '#f59e0b';
      text.textContent = 'قوة كلمة المرور: متوسطة (جيدة ومقبولة)';
      text.style.color = '#f59e0b';
    } else {
      bar.style.width = '100%';
      bar.style.background = '#10b981';
      text.textContent = 'قوة كلمة المرور: قوية جداً وحصينة ✓';
      text.style.color = '#10b981';
    }
  },

  // حفظ البيانات الشخصية
  savePersonalInfo(e) {
    e.preventDefault();
    const { user } = this.getUserData();

    user.name = document.getElementById('set_name')?.value.trim() || user.name;
    user.email = document.getElementById('set_email')?.value.trim() || user.email;
    user.phone = document.getElementById('set_phone')?.value.trim() || '';
    user.jobTitle = document.getElementById('set_job_title')?.value || user.jobTitle;
    user.university = document.getElementById('set_university')?.value.trim() || '';
    user.gradYear = document.getElementById('set_grad_year')?.value.trim() || '';
    user.bio = document.getElementById('set_bio')?.value.trim() || '';

    // حفظ في الجلسة وفي قاعدة المستخدمين
    try {
      localStorage.setItem('accountera_user', JSON.stringify(user));
      if (typeof AuthService !== 'undefined') {
        AuthService.currentUser = user;
        AuthService.updateTopBarUI();
      }

      let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
      const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...user };
      } else {
        users.push(user);
      }
      localStorage.setItem('jr_users', JSON.stringify(users));
    } catch (err) {}

    if (typeof AccModal !== 'undefined') {
      AccModal.toast("✓ تم حفظ وتحديث البيانات الشخصية بنجاح!", "success");
    } else if (typeof alert !== 'undefined') {
      alert("✓ تم حفظ وتحديث البيانات الشخصية بنجاح!");
    }
  },

  // تغيير كلمة المرور
  changePassword(e) {
    e.preventDefault();
    const { user } = this.getUserData();

    const current = document.getElementById('pwd_current')?.value;
    const newPwd = document.getElementById('pwd_new')?.value;
    const confirmPwd = document.getElementById('pwd_confirm')?.value;

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

    // التحقق من كلمة المرور الحالية إذا كانت مسجلة مسبقاً
    if (user.password && user.password !== current) {
      if (typeof AccModal !== 'undefined') AccModal.toast("كلمة المرور الحالية غير صحيحة!", "error");
      else if (typeof alert !== 'undefined') alert("كلمة المرور الحالية غير صحيحة!");
      return;
    }

    user.password = newPwd;

    try {
      localStorage.setItem('accountera_user', JSON.stringify(user));
      let users = JSON.parse(localStorage.getItem('jr_users') || '[]');
      const idx = users.findIndex(u => u.id === user.id || u.email === user.email);
      if (idx >= 0) {
        users[idx].password = newPwd;
        localStorage.setItem('jr_users', JSON.stringify(users));
      }
    } catch (err) {}

    if (typeof AccModal !== 'undefined') {
      AccModal.toast("✓ تم تحديث كلمة المرور لحسابك بنجاح وحمايته!", "success");
    } else if (typeof alert !== 'undefined') {
      alert("✓ تم تحديث كلمة المرور لحسابك بنجاح وحمايته!");
    }

    // تصفير الحقول
    if (document.getElementById('pwd_current')) document.getElementById('pwd_current').value = '';
    if (document.getElementById('pwd_new')) document.getElementById('pwd_new').value = '';
    if (document.getElementById('pwd_confirm')) document.getElementById('pwd_confirm').value = '';
    this.checkPasswordStrength('');
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
      if (themeBtn) themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
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
