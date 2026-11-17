/**
 * i18n.js — نظام تدويل وإدارة اللغات (Internationalization Manager)
 * يدعم التبديل السلس بين العربية (الافتراضية RTL) والإنجليزية (LTR).
 * يضمن ظهور عناصر الواجهة بلغة نقية واحدة حسب اختيار المستخدم.
 */

const I18n = {
  currentLang: 'ar',

  translations: {
    ar: {
      nav_title: 'التنقل',
      nav_overview: 'لوحة المتابعة',
      nav_progress: 'مستوى التقدم',
      nav_submissions: 'سجل القيود',
      nav_profile: 'الملف الشخصي',
      nav_plans: 'باقات التدريب',
      nav_daily_tasks: 'المهام اليومية',
      nav_theory: 'الجزء النظري',
      nav_companies: 'بيئة الشركات',
      nav_quiz: 'الاختبارات الفنية',

      topbar_upgrade: 'ترقية',
      topbar_refer: 'شارك واكسب 20%',
      topbar_admin_os: 'مدير النظام',
      topbar_notifications: 'الإشعارات والتنبيهات',
      topbar_profile: 'إعدادات الحساب والملف الشخصي',
      topbar_logout: 'تسجيل الخروج',

      drawer_companies: 'بيئة الشركات والمحاكاة',
      drawer_erp: 'محاكي النظام المحاسبي (ERP Sim) ⚡',
      drawer_theory: 'الجزء النظري',
      drawer_learning: 'مسار الدروس والمحتوى',
      drawer_practice: 'بنك التدريبات العملية',
      drawer_plans: 'باقات وأسعار التدريب',
      drawer_settings: 'الإعدادات والملف الشخصي',

      theme_to_light: 'التحويل للوضع النهاري',
      theme_to_dark: 'التحويل للوضع الليلي',
      lang_btn_label: 'English',
      lang_btn_title: 'التحويل إلى اللغة الإنجليزية (Switch to English)',

      breadcrumb_dashboard: 'لوحة دراستي',
      theory_specialized_badge: 'قسم تعليمي متخصص',
      theory_page_title: 'الجزء النظري',
      theory_page_desc: 'الدروس النصية والمفاهيم الشاملة للدورة المحاسبية'
    },
    en: {
      nav_title: 'NAVIGATION',
      nav_overview: 'Overview',
      nav_progress: 'Progress',
      nav_submissions: 'Submissions',
      nav_profile: 'Profile',
      nav_plans: 'Plans & Pricing',
      nav_daily_tasks: 'Daily Tasks',
      nav_theory: 'Theory',
      nav_companies: 'Companies Sim',
      nav_quiz: 'MCQ Quiz',

      topbar_upgrade: 'Upgrade',
      topbar_refer: 'Refer & earn 20%',
      topbar_admin_os: 'Admin OS',
      topbar_notifications: 'Notifications & Alerts',
      topbar_profile: 'Account Settings & Profile',
      topbar_logout: 'Sign Out',

      drawer_companies: 'Companies & Sim Environment',
      drawer_erp: 'ERP Accounting Simulator ⚡',
      drawer_theory: 'Theory Section',
      drawer_learning: 'Lessons & Content Path',
      drawer_practice: 'Practice Bank',
      drawer_plans: 'Training Plans & Pricing',
      drawer_settings: 'Settings & Profile',

      theme_to_light: 'Switch to Light Mode',
      theme_to_dark: 'Switch to Dark Mode',
      lang_btn_label: 'عربي',
      lang_btn_title: 'Switch to Arabic (التحويل إلى العربية)',

      breadcrumb_dashboard: 'My Dashboard',
      theory_specialized_badge: 'Specialized Section',
      theory_page_title: 'Theory Section',
      theory_page_desc: 'Textual Lessons and Comprehensive Concepts of the Accounting Cycle'
    }
  },

  /**
   * تهيئة اللغة عند بدء التطبيق
   */
  init() {
    const saved = localStorage.getItem('accountera_lang');
    this.currentLang = (saved === 'en') ? 'en' : 'ar';
    this.applyLanguage(this.currentLang, false);
  },

  /**
   * جلب الترجمة حسب المفتاح
   */
  t(key, fallback = '') {
    const dict = this.translations[this.currentLang] || this.translations.ar;
    return dict[key] !== undefined ? dict[key] : (fallback || key);
  },

  /**
   * تعيين لغة محددة
   */
  setLanguage(lang) {
    if (lang !== 'ar' && lang !== 'en') lang = 'ar';
    this.currentLang = lang;
    localStorage.setItem('accountera_lang', lang);
    this.applyLanguage(lang, true);
  },

  /**
   * التبديل بين العربية والإنجليزية
   */
  toggleLanguage() {
    const nextLang = this.currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(nextLang);
  },

  /**
   * تطبيق اللغة على وثيقة HTML وكافة العناصر المترجمة
   */
  applyLanguage(lang, reRenderViews = true) {
    const isEn = lang === 'en';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isEn ? 'ltr' : 'rtl');
    document.documentElement.setAttribute('data-lang', lang);

    // تحديث كافة العناصر التي تحمل data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        el.textContent = val;
      }
    });

    // تحديث أزرار التبديل في شريط الرأس
    const langBtnLabel = document.getElementById('langToggleLabel');
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtnLabel) {
      langBtnLabel.textContent = isEn ? 'عربي' : 'English';
    }
    if (langBtn) {
      langBtn.setAttribute('title', isEn ? 'التحويل إلى العربية' : 'Switch to English');
    }

    // تحديث درج الهواتف الجانبي
    const drawerLangLabel = document.getElementById('drawerLangLabel');
    if (drawerLangLabel) {
      drawerLangLabel.textContent = isEn ? 'اللغة: العربية (AR)' : 'Language: English (EN)';
    }

    // إعادة رسم أجزاء محددة كالتوب بار لضبط الأزرار التفاعلية
    if (reRenderViews && typeof AuthService !== 'undefined' && typeof AuthService.renderTopbarAuth === 'function') {
      AuthService.renderTopbarAuth();
    }
  }
};

if (typeof window !== 'undefined') {
  window.I18n = I18n;
  window.toggleLanguage = () => I18n.toggleLanguage();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18n };
}
