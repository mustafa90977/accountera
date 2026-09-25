/**
 * animation-manager.js — محرك المؤثرات والحركات التفاعلية المتطور (Accountera GSAP Engine)
 * مبني بالكامل على مكتبة GSAP و ScrollTrigger لتوفير تجربة مستخدم فائقة السلاسة والأناقة
 */

const AccounteraAnimations = {
  initialized: false,

  init() {
    if (typeof gsap === 'undefined') {
      console.warn('[AccounteraAnimations] GSAP is not loaded.');
      return;
    }

    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    this.initialized = true;
    console.log('[AccounteraAnimations] GSAP Animation Engine active.');

    // ربط الحركات التلقائية حسب الشاشة الحالية
    this.refreshAnimations();
  },

  // تشغيل حركة انتقال الشاشات بسلاسة
  animateScreenTransition(containerSelector = '#app') {
    if (!this.initialized || typeof gsap === 'undefined') return;

    const el = document.querySelector(containerSelector);
    if (!el) return;

    gsap.fromTo(el, 
      { opacity: 0, y: 16 }, 
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', clearProps: 'transform' }
    );
  },

  // حركة دخول صفحة تسجيل الدخول وإنشاء الحساب
  animateAuthPage() {
    if (!this.initialized || typeof gsap === 'undefined') return;

    const card = document.querySelector('.auth-card');
    if (!card) return;

    const tl = gsap.timeline();

    tl.fromTo(card, 
      { opacity: 0, scale: 0.94, y: 35 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.3)' }
    );

    const formElements = card.querySelectorAll('.form-label, .form-input, #authSubmitBtn, #googleAuthBtn');
    if (formElements.length > 0) {
      tl.fromTo(formElements, 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.35, ease: 'power2.out', clearProps: 'all' },
        "-=0.25"
      );
    }
  },

  // تحريك عناصر قسم الهيرو في صفحة الهبوط
  animateHero() {
    if (!this.initialized || typeof gsap === 'undefined') return;

    const hero = document.querySelector('.hero-content-wrapper');
    if (!hero) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // شارة البث الحي
    const badge = hero.querySelector('.hero-live-badge');
    if (badge) {
      tl.fromTo(badge, 
        { opacity: 0, scale: 0.85, y: -10 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.5 }
      );
    }

    // العنوان الرئيسي
    const title = hero.querySelector('.hero-title-gradient');
    if (title) {
      tl.fromTo(title, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.7 }, 
        "-=0.25"
      );
    }

    // النص التوضيحي
    const subtitle = hero.querySelector('.hero-subtitle-lead');
    if (subtitle) {
      tl.fromTo(subtitle, 
        { opacity: 0, y: 20 }, 
        { opacity: 1, y: 0, duration: 0.6 }, 
        "-=0.4"
      );
    }

    // أزرار اتخاذ القرار (CTA)
    const ctaBtns = hero.querySelectorAll('.hero-cta-group button');
    if (ctaBtns.length > 0) {
      tl.fromTo(ctaBtns, 
        { opacity: 0, y: 18, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.5, clearProps: 'transform' }, 
        "-=0.3"
      );
    }

    // إطار المعاينة التفاعلية أو الدورة المحاسبية
    const preview = document.querySelector('.interactive-cycle-preview, .platform-interactive-preview');
    if (preview) {
      tl.fromTo(preview, 
        { opacity: 0, y: 40, scale: 0.96 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power2.out', clearProps: 'transform' }, 
        "-=0.3"
      );
    }
  },

  // مؤثرات التمرير الذكية (ScrollTrigger Reveal Effects)
  initScrollAnimations() {
    if (!this.initialized || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // مسح المشغلات القديمة لتجنب تكرارها عند التنقل
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // 1. عناوين الأقسام الرئيسية
    gsap.utils.toArray('.section-header-pill, .section-title-wrap, .section-desc-sub').forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 25 }, 
        {
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          },
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'transform'
        }
      );
    });

    // 2. بطاقات المميزات والمسارات
    const cardSelectors = [
      '.feature-card-compact',
      '.landing-track-card',
      '.company-preview-card',
      '.pricing-card',
      '.stat-item-box',
      '.testimonial-card',
      '.faq-accordion-item'
    ];

    cardSelectors.forEach(selector => {
      const cards = gsap.utils.toArray(selector);
      if (cards.length > 0) {
        cards.forEach((card, index) => {
          gsap.fromTo(card, 
            { opacity: 0, y: 30 }, 
            {
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                toggleActions: 'play none none none'
              },
              opacity: 1,
              y: 0,
              duration: 0.55,
              delay: (index % 3) * 0.1,
              ease: 'power2.out',
              clearProps: 'transform'
            }
          );
        });
      }
    });

    // 3. عداد الأرقام والإحصائيات التفاعلي
    gsap.utils.toArray('.font-num, .stat-number').forEach(numEl => {
      const targetText = numEl.innerText.trim();
      const match = targetText.match(/^([^\d]*)(\d+)([^\d]*)$/);
      if (match) {
        const prefix = match[1];
        const val = parseInt(match[2], 10);
        const suffix = match[3];

        if (val > 0) {
          const counterObj = { val: 0 };
          gsap.to(counterObj, {
            val: val,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: numEl,
              start: 'top 90%',
              once: true
            },
            onUpdate: () => {
              numEl.innerText = `${prefix}${Math.round(counterObj.val)}${suffix}`;
            }
          });
        }
      }
    });
  },

  // اهتزاز كارت الدخول عند إدخال بيانات خاطئة
  shakeAuthCard() {
    if (typeof gsap === 'undefined') return;
    const card = document.querySelector('.auth-card');
    if (!card) return;
    gsap.fromTo(card,
      { x: -10 },
      { x: 10, duration: 0.07, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => {
        gsap.set(card, { x: 0 });
      }}
    );
  },

  // تحريك بطاقات لوحة التحكم الخاصة بالطالب ومؤشرات الأداء
  animateStudentDashboard() {
    if (!this.initialized || typeof gsap === 'undefined') return;

    const statCards = document.querySelectorAll('.stat-card, .metric-box, .overview-hero, .student-stat-card, .accountely-streak-card, .accountely-getting-started-card, .dash-panel-card');
    if (statCards.length > 0) {
      gsap.fromTo(statCards, 
        { opacity: 0, y: 18, scale: 0.98 }, 
        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.45, ease: 'power2.out', clearProps: 'transform' }
      );
    }

    // عداد أرقام إحصائيات الطالب التصاعدي
    document.querySelectorAll('.student-stat-card .stat-value').forEach(el => {
      const rawText = el.innerText.trim();
      const match = rawText.match(/^(\d+)/);
      if (match) {
        const targetNum = parseInt(match[1], 10);
        const suffix = rawText.replace(/^\d+/, '');
        const state = { val: 0 };
        gsap.to(state, {
          val: targetNum,
          duration: 0.9,
          ease: 'power1.out',
          onUpdate: () => {
            el.innerText = Math.round(state.val) + suffix;
          }
        });
      }
    });

    // خطوط التقدم التفاعلية
    const progressBars = document.querySelectorAll('.progress-bar-fill, .progress-fill, .acc-progress-bar-fill');
    if (progressBars.length > 0) {
      progressBars.forEach(bar => {
        const targetWidth = bar.style.width || '100%';
        bar.style.width = '0%';
        gsap.to(bar, { width: targetWidth, duration: 1.1, ease: 'power2.out' });
      });
    }
  },

  // تحديث الحركات حسب الشاشة النشطة
  refreshAnimations(screenId = 'landing') {
    if (!this.initialized) return;

    if (screenId === 'landing' || screenId === 'welcome') {
      setTimeout(() => {
        this.animateHero();
        this.initScrollAnimations();
      }, 50);
    } else if (screenId === 'login' || screenId === 'register') {
      setTimeout(() => {
        this.animateAuthPage();
      }, 50);
    } else if (screenId === 'student-dashboard' || screenId === 'portfolio' || screenId === 'student' || screenId === 'student-overview') {
      setTimeout(() => {
        this.animateStudentDashboard();
      }, 50);
    }
  }
};

window.AccounteraAnimations = AccounteraAnimations;
