/**
 * landing-view.js — واجهة صفحة الهبوط المتجاوبة بالكامل مع الموبايل
 * Pure Responsive Semantic Component (Mobile-First)
 */

const ExcelLandingView = {
  render() {
    return `
      <div class="landing-page">
        <!-- 1. Hero Section (Design 1 Implementation) -->
        <section class="landing-hero">
          <div class="hero-badge">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--primary);"></span>
            أول منصة تفاعلية لتدريب المحاسبين على سيناريوهات عمل حقيقية
          </div>

          <h1 class="hero-title">
            تعلّم المحاسبة كما تمارسها في <span>كبرى الشركات</span>
          </h1>

          <p class="hero-subtitle">
            انتقل من حفظ القيود النظرية إلى إتقان تحليل العمليات المالية، القيد المزدوج، وإعداد القوائم الختامية وفق معايير المحاسبة المصرية والدولية.
          </p>

          <div class="hero-actions">
            <button class="btn-cta-primary" onclick="typeof AuthService !== 'undefined' ? AuthService.openAuthModal('register') : navigateToScreen('welcome')">
              <span style="display:inline-flex; align-items:center; gap:8px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 18 }) : ''}
                سجل الآن مجاناً
              </span>
            </button>
            <button class="btn-cta-secondary" onclick="navigateToScreen('companies-hub')">
              <span style="display:inline-flex; align-items:center; gap:8px;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('buildings', { size: 18 }) : ''}
                استكشف المنصة
              </span>
            </button>
          </div>

          <!-- المعاينة الحية لواجهة محاكي الشركات (Design 1 Centerpiece Showcase) -->
          <div class="hero-showcase-container">
            <!-- الشارات التفاعلية العائمة -->
            <div class="showcase-floating-badge badge-top-right">
              <span class="badge-dot-green"></span>
              <strong>ميزان المراجعة متوازن 100% ✓</strong>
            </div>

            <div class="showcase-floating-badge badge-top-left">
              <span style="color:#047857; display:inline-flex;">${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('file-text', { size: 16 }) : ''}</span>
              <span>فاتورة ضريبية • ضريبة 14% VAT</span>
            </div>

            <div class="hero-dashboard-mockup">
              <!-- شريط نافذة المحاكي العلوي -->
              <div class="mockup-header">
                <div style="display:flex; align-items:center; gap:10px;">
                  <span class="mockup-dot red"></span>
                  <span class="mockup-dot yellow"></span>
                  <span class="mockup-dot green"></span>
                  <span style="font-size:0.82rem; font-weight:700; color:var(--text-muted); margin-right:8px;">
                    محاكي Accountera OS • شركة النيل للتجارة والتوزيع
                  </span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span style="font-size:0.75rem; background:rgba(16,185,129,0.12); color:#10B981; padding:3px 10px; border-radius:999px; font-weight:700;">
                    السنة المالية 2026 • نشطة
                  </span>
                </div>
              </div>

              <!-- المحتوى الداخلي: دفتر اليومية والفاتورة -->
              <div class="mockup-content-grid">
                <!-- جدول اليومية العامة -->
                <div class="mockup-panel">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <strong style="font-size:0.92rem; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                      <span>${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('book-open', { size: 18 }) : ''}</span>
                      دفتر اليومية العامة (General Journal)
                    </strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">قيد رقم: JE-00104</span>
                  </div>

                  <div class="mockup-table-wrap">
                    <table class="mockup-table">
                      <thead>
                        <tr>
                          <th>التاريخ</th>
                          <th>الحساب والبيان</th>
                          <th>مدين (Debit)</th>
                          <th>دائن (Credit)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>23/07/2026</td>
                          <td><strong>1101 - النقدية بالصندوق</strong> <span style="font-size:0.75rem; color:var(--text-muted);">(تحصيل مبيعات)</span></td>
                          <td class="num-val positive">20,000</td>
                          <td class="num-val">-</td>
                        </tr>
                        <tr>
                          <td>23/07/2026</td>
                          <td><strong>4101 - إيراد المبيعات</strong></td>
                          <td class="num-val">-</td>
                          <td class="num-val positive">20,000</td>
                        </tr>
                        <tr style="border-top:1px dashed var(--border-subtle);">
                          <td>22/07/2026</td>
                          <td><strong>5101 - تكلفة بضاعة مشتراة</strong></td>
                          <td class="num-val positive">16,000</td>
                          <td class="num-val">-</td>
                        </tr>
                        <tr>
                          <td>22/07/2026</td>
                          <td><strong>1106 - ضريبة القيمة المضافة 14%</strong></td>
                          <td class="num-val positive">2,240</td>
                          <td class="num-val">-</td>
                        </tr>
                        <tr>
                          <td>22/07/2026</td>
                          <td><strong>2101 - الموردون (شركة الأمل)</strong></td>
                          <td class="num-val">-</td>
                          <td class="num-val positive">18,240</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <!-- البطاقة الجانبية: المستند المحاسبي وتطابق الميزان -->
                <div class="mockup-panel invoice-preview-panel">
                  <div style="border-bottom:1px solid var(--border-subtle); padding-bottom:8px; margin-bottom:10px;">
                    <div style="font-size:0.75rem; color:var(--text-muted);">مستند الإثبات المرفق</div>
                    <strong style="font-size:0.88rem; color:var(--text-primary);">فاتورة ضريبية رسمية</strong>
                  </div>

                  <div style="background:var(--surface-ground); border:1px solid var(--border-subtle); border-radius:8px; padding:10px; font-size:0.78rem; line-height:1.6; margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between;">
                      <span>قيمة البضاعة:</span>
                      <strong>16,000 ج.م</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; color:#10B981;">
                      <span>ضريبة ق.م 14%:</span>
                      <strong>+2,240 ج.م</strong>
                    </div>
                    <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-subtle); margin-top:4px; padding-top:4px; font-weight:800;">
                      <span>إجمالي الفاتورة:</span>
                      <span>18,240 ج.م</span>
                    </div>
                  </div>

                  <button onclick="window.location.href='simulation/simulation/journal/index.html'" class="btn-primary-action" style="width:100%; justify-content:center; padding:9px 12px; font-size:0.82rem;">
                    <span>فتح بيئة المحاكي وتطبيق القيد</span>
                    <span>←</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Metrics Strip -->
          <div class="metrics-strip" style="margin-top: 40px;">
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
              <div class="metric-value">EAS / IFRS</div>
              <div class="metric-label">معايير المحاسبة المصرية</div>
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
