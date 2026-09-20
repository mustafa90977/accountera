/**
 * landing-view.js — واجهة صفحة الهبوط المتجاوبة بالكامل مع الموبايل
 * Pure Responsive Semantic Component (Mobile-First)
 */

const ExcelLandingView = {
  render() {
    return `
      <div class="landing-page">
        <!-- 1. Hero Section -->
        <section class="landing-hero">
          <div class="hero-badge">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--primary);"></span>
            المنصة التفاعلية الأولى للمحاسب المبتدئ
          </div>

          <h1 class="hero-title">
            تعلّم المحاسبة كما تمارسها في <span>كبرى الشركات</span>
          </h1>

          <p class="hero-subtitle">
            انتقل من حفظ القيود النظرية إلى إتقان تحليل العمليات المالية، القيد المزدوج، وإعداد القوائم الختامية عبر محاكاة واقعية متكاملة.
          </p>

          <div class="hero-actions">
            <button class="btn-cta-primary" onclick="navigateToScreen('welcome')">
              <span style="display:inline-flex; align-items:center; gap:8px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 18 }) : ''}
                ابدأ رحلتك المحاسبية مجاناً
              </span>
            </button>
            <button class="btn-cta-secondary" onclick="navigateToScreen('companies-hub')">
              <span style="display:inline-flex; align-items:center; gap:8px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 18 }) : ''}
                استكشف بيئة الشركات
              </span>
            </button>
          </div>

          <!-- Metrics Strip -->
          <div class="metrics-strip">
            <div class="metric-card">
              <div class="metric-value">+60</div>
              <div class="metric-label">شاشة ومحاكاة تفاعلية</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">6</div>
              <div class="metric-label">مراحل تعلم منهجية</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">100%</div>
              <div class="metric-label">تطبيق عملي وواقعي</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">IFRS</div>
              <div class="metric-label">مطابق للموجّهات الدولية</div>
            </div>
          </div>
        </section>

        <!-- 2. المسار التعليمي المنهجي -->
        <section class="section-container">
          <div class="section-header">
            <div class="section-tag">مسار الإتقان</div>
            <h2>من الأساسيات حتى إغلاق الدورة المحاسبية</h2>
            <p>منهجية مصممة خطوة بخطوة لبناء العقلية التحليلية السليمة للمحاسب المالي.</p>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">١. الفهم النظري المبسط</h3>
              <p class="feature-desc">شرح عملي عميق لطبيعة المعاملة المالية وقواعد المدين والدائن ومعادلة الميزانية بدون تعقيد.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('target', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">٢. إطار التحليل ذو الـ 6 خطوات</h3>
              <p class="feature-desc">طريقة منهجية لتفكيك أي معاملة مالية وتحديد أطرافها وأثرها قبل تسجيل القيد بدقة متناهية.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">٣. التمارين العملية المتدرجة</h3>
              <p class="feature-desc">أمثلة محلولة وتدريبات موجهة ومستقلة مع تصحيح فوري للمفاهيم المحاسبية والعمليات.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">٤. محاكاة الشركات الواقعية</h3>
              <p class="feature-desc">عش دور المحاسب المالي في شركات خدمية وتجارية حقيقية وسجل فواتيرها وإشعاراتها البنكية.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('chart-bar', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">٥. الدفاتر والقوائم الختامية</h3>
              <p class="feature-desc">من دفتر اليومية وحسابات الأستاذ إلى ميزان المراجعة وقائمتي الدخل والمركز المالي.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-wrap">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('trophy', { size: 24, strokeWidth: 1.75 }) : ''}
              </div>
              <h3 class="feature-title">٦. وثيقة الكفاءة والاعتماد</h3>
              <p class="feature-desc">احصل على جواز المهارات المحاسبية وأثبت جاهزيتك لسوق العمل أمام مدراء التوظيف.</p>
            </div>
          </div>
        </section>

        <!-- 3. باقات الاشتراك والتسعير (مرتبطة ديناميكياً بلوحة الإدارة) -->
        <section class="section-container" style="background: var(--surface-card); border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 48px var(--container-padding-mobile);">
          <div class="section-header" style="text-align: center; margin-bottom: 36px;">
            <div class="section-tag" style="background: rgba(59, 130, 246, 0.1); color: #3b82f6;">الخطط والتسعير</div>
            <h2 style="font-size: 1.8rem; font-weight: 900; margin: 8px 0;">اختر الخطة المناسبة لمستواك المهني</h2>
            <p style="color: var(--text-secondary); max-width: 550px; margin: 0 auto;">جميع الباقات تمنحك وصولاً مباشراً لبيئات المحاكاة وتطبيق القيود المحاسبية العملية.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 1050px; margin: 0 auto;">
            ${(function() {
              let plans = [];
              try {
                const saved = localStorage.getItem('acc_admin_plans');
                if (saved) plans = JSON.parse(saved);
              } catch(e) {}
              if (!plans || plans.length === 0) {
                plans = (typeof DEFAULT_ADMIN_PLANS !== 'undefined') ? DEFAULT_ADMIN_PLANS : [];
              }

              return plans.map(p => `
                <div style="background: var(--surface-ground); border: 2px solid ${p.id === 'pro' ? '#3b82f6' : 'var(--border-subtle)'}; border-radius: 20px; padding: 28px 24px; display: flex; flex-direction: column; justify-content: space-between; position: relative; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                  ${p.badge ? `
                    <span style="position: absolute; top: -12px; right: 24px; background: ${p.color || '#3b82f6'}; color: #fff; padding: 3px 12px; border-radius: 999px; font-size: 0.75rem; font-weight: 800;">
                      ${p.badge}
                    </span>
                  ` : ''}
                  <div>
                    <div style="color: var(--primary); margin-bottom: 12px; display: flex;">
                      ${typeof AccounteraIcons !== 'undefined' ? (p.id === 'pro' ? AccounteraIcons.render('star', { size: 36, strokeWidth: 1.75 }) : AccounteraIcons.render('buildings', { size: 36, strokeWidth: 1.75 })) : ''}
                    </div>
                    <h3 style="font-size: 1.3rem; font-weight: 800; margin: 0 0 6px;">${p.name}</h3>
                    <div style="font-size: 1.8rem; font-weight: 900; font-family: 'JetBrains Mono', monospace; color: var(--text-primary); margin-bottom: 16px;">
                      ${p.price === 0 ? 'مجاناً' : `${p.price} ج.م`}
                      <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: normal;"> / ${p.period}</span>
                    </div>

                    <div style="border-top: 1px solid var(--border-subtle); padding-top: 16px; margin-bottom: 20px;">
                      <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 8px;">ما تتضمنه الخطة:</span>
                      <ul style="margin: 0; padding-right: 18px; font-size: 0.88rem; line-height: 1.8; color: var(--text-secondary);">
                        ${(p.features || []).map(f => `<li>${f}</li>`).join('')}
                      </ul>
                    </div>
                  </div>

                  <button class="btn-cta-${p.id === 'pro' ? 'primary' : 'secondary'}" style="width: 100%; justify-content: center; min-height: 46px; font-weight: 800;" onclick="navigateToScreen('welcome')">
                    ${p.price === 0 ? 'ابدأ مجاناً الآن' : 'اشترك في الخطة'}
                  </button>
                </div>
              `).join('');
            })()}
          </div>
        </section>
      </div>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.ExcelLandingView = ExcelLandingView;
}
