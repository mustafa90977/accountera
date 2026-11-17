/**
 * student-dashboard-view.js — لوحة تحكم الطالب التفاعلية ومتابعة مسار التدريب والمحاكاة
 * تربط بين مسار التعلم التأسيسي، وإنجاز محاكي الشركات، وسجل العمليات وجواز الكفاءة
 */

const ExcelStudentDashboard = {
  getSimData() {
    try {
      const simInfo = (typeof SimulationBridge !== 'undefined') 
        ? SimulationBridge.getSimProgress() 
        : { companyName: 'شركة النيل للتجارة والتوزيع', totalTasks: 0, completedTasks: 0, percent: 0, isStarted: false };

      const profile = JSON.parse(localStorage.getItem('sim_company_profile') || '{}');
      const journal = JSON.parse(localStorage.getItem('student_journal') || '[]');
      const postedJournal = journal.filter(j => j.status === 'posted');

      const completedLessonsCount = (typeof ProgressService !== 'undefined') ? ProgressService.getCompletedCount() : 0;
      const practiceStats = (typeof PracticeService !== 'undefined') ? PracticeService.getStats() : { total: 0, passed: 0, accuracyRate: 0 };

      const lastActiveLessonId = localStorage.getItem('acc_last_active_lesson') || 'lesson-01';
      const lastActiveLessonTitle = localStorage.getItem('acc_last_active_lesson_title') || 'الدرس 1: مقدمة في المحاسبة المالية والدورة المحاسبية';

      return {
        simInfo,
        profile: {
          name: profile.name || simInfo.companyName || 'شركة النيل للتجارة والتوزيع',
          sector: profile.sector || profile.activity || 'تجارة عامة وتوزيع',
          year: profile.year || 'السنة المالية 2026',
          code: profile.code || 'NTL-2026'
        },
        journal,
        postedCount: postedJournal.length,
        totalTasks: simInfo.totalTasks || (window.ANSWER_KEY ? window.ANSWER_KEY.length : 0) || 100,
        percent: simInfo.percent || 0,
        completedLessonsCount,
        practiceStats,
        lastActiveLessonId,
        lastActiveLessonTitle
      };
    } catch(e) {
      return {
        simInfo: { companyName: 'شركة النيل للتجارة والتوزيع', totalTasks: 0, completedTasks: 0, percent: 0 },
        profile: { name: 'شركة النيل للتجارة والتوزيع', sector: 'تجارة عامة وتوزيع', year: 'السنة المالية 2026', code: 'NTL-2026' },
        journal: [],
        postedCount: 0,
        totalTasks: 100,
        percent: 0,
        completedLessonsCount: 0,
        practiceStats: { total: 0, passed: 0, accuracyRate: 0 },
        lastActiveLessonId: 'lesson-01',
        lastActiveLessonTitle: 'الدرس 1: مقدمة في المحاسبة المالية والدورة المحاسبية'
      };
    }
  },

  render() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const studentName = user && user.name ? user.name : 'محاسب مالي متدرب';
    const email = user && user.email ? user.email : 'student@accountera.edu';
    
    const { simInfo, profile, journal, postedCount, totalTasks, percent, completedLessonsCount, practiceStats, lastActiveLessonId, lastActiveLessonTitle } = this.getSimData();

    // آخر 4 عمليات مسجلة في دفتر اليومية
    const recentEntries = [...journal].reverse().slice(0, 4);

    return `
      <div class="student-dashboard-container">
        <!-- 1. ترويسة الترحيب الموحدة -->
        <div class="dash-header-wrap">
          <div>
            <h1 class="dash-title">
              أهلاً بك مجدداً، <span style="color:var(--primary); font-weight:800;">${studentName}</span> 👋
            </h1>
            <p class="dash-subtitle">
              لوحة متابعة مسارك التدريبي، إنجاز المهام العملية، ومحاكاة بيئة الشركات
            </p>
          </div>
          <button onclick="navigateToScreen('companies-hub')" class="btn-primary-action">
            <span>استكشاف بيئة الشركات</span>
            <span>←</span>
          </button>
        </div>

        <!-- 2. بطاقة أكمل من حيث توقفت (UX-09) -->
        <div class="resume-learning-card" style="background: var(--surface-card); border: 1px solid var(--border-subtle); border-radius: 16px; padding: 1.15rem 1.4rem; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; box-shadow: 0 4px 14px rgba(0,0,0,0.03);">
          <div style="display:flex; align-items:center; gap:14px; min-width:240px;">
            <div style="width:44px; height:44px; border-radius:12px; background:var(--primary-light, rgba(16,185,129,0.12)); color:var(--primary); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              ${AccounteraIcons.render('book-open', { size: 22, strokeWidth: 1.8 })}
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:800; text-transform:uppercase; letter-spacing:0.04em;">
                أكمل من حيث توقفت • محطتك التدريبية التالية
              </div>
              <div style="font-size:0.96rem; font-weight:800; color:var(--text-primary); margin-top:2px;">
                ${lastActiveLessonTitle}
              </div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <button onclick="navigateToScreen('documentary-cycle')" class="btn-cta-primary" style="padding:8px 16px; font-size:0.85rem; font-weight:800; display:inline-flex; align-items:center; gap:6px;">
              <span>متابعة الدرس ⚡</span>
              <span>←</span>
            </button>
          </div>
        </div>

        <!-- 3. بطاقة التتابع والنشاط اليومي (Streak Card) -->
        <div class="accountely-streak-card">
          <div style="display:flex; align-items:flex-start; gap:14px;">
            <div class="streak-circle-icon"></div>
            <div>
              <div style="font-size:1.15rem; font-weight:800; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <span class="tabular-nums">${postedCount > 0 ? `${postedCount} يوم نشاط` : 'لا يوجد تتابع بعد'}</span>
                <span style="font-weight:700; color:var(--text-secondary); font-size:0.95rem; display:inline-flex; align-items:center; gap:4px;">
                  • ${postedCount > 0 ? `نشاط تدريبي مستمر! <span style="color:#F59E0B; display:inline-flex;">${AccounteraIcons.render('flame', { size: 16 })}</span>` : 'ابدأ نشاطك اليوم'}
                </span>
              </div>
              <div style="font-size:0.84rem; color:var(--text-muted); margin-top:3px;">
                سجل قيداً محاسبياً أو اجتز اختباراً اليوم للحفاظ على تتابع تدريبك المستمر.
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
            <!-- مؤشر الـ 14 يوماً مع الحروف العربية لأيام الأسبوع -->
            <div class="streak-days-track">
              ${['س','ح','ن','ث','ر','خ','ج','س','ح','ن','ث','ر','خ','ج'].map((day, idx) => `
                <div class="streak-day-col">
                  <div class="streak-day-box ${idx === 13 && postedCount > 0 ? 'active' : ''}"></div>
                  <span class="streak-day-label">${day}</span>
                </div>
              `).join('')}
            </div>

            <button onclick="window.location.href='simulation/simulation/journal/index.html'" class="btn-primary-action" style="padding:9px 18px; font-size:0.85rem;">
              <span>تدريب اليوم</span>
              <span>←</span>
            </button>
          </div>
        </div>

        <!-- 4. كروت البداية السريعة Getting Started (UX-03 & UX-06) -->
        <div class="accountely-getting-started-card">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <h3 style="font-size:1.15rem; font-weight:800; color:var(--text-primary); margin:0 0 4px 0;">خريطة الانطلاق السريع • خطواتك الأولى للإتقان</h3>
              <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">
                1 من أصل 4 مكتمل — مسار موجه يبدأ بالقواعد المحاسبية وينتهي بمحاكاة العمليات الحقيقية.
              </p>
            </div>
            <button onclick="this.closest('.accountely-getting-started-card').style.display='none'" style="background:transparent; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer; padding:2px 6px;" title="إغلاق">✕</button>
          </div>

          <!-- شريط تقدم الخطوات الأخضر النحيف -->
          <div style="width:100%; height:4px; background:var(--surface-muted); border-radius:var(--radius-full); margin-bottom:1.25rem; overflow:hidden;">
            <div style="width:25%; height:100%; background:var(--primary); border-radius:var(--radius-full);"></div>
          </div>

          <!-- بطاقات الخطوات الأربع المتجاورة -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <!-- الخطوة 1: الحساب (مكتملة) -->
            <div class="accountely-step-card" style="background:var(--surface-muted); border-color:var(--border-subtle);">
              <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                  <div style="width:22px; height:22px; border-radius:50%; background:var(--primary); color:var(--primary-fg); display:flex; align-items:center; justify-content:center;">
                    ${AccounteraIcons.render('check', { size: 14, strokeWidth: 2.5 })}
                  </div>
                  <strong style="font-size:0.86rem; color:var(--text-primary);">تفعيل الحساب</strong>
                </div>
                <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.4;">تم التفعيل بنجاح — مرحباً بك في Accountera ✓</div>
              </div>
            </div>

            <!-- الخطوة 2: دراسة المنهج الأكاديمي -->
            <div class="accountely-step-card" onclick="navigateToScreen('documentary-cycle')" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:var(--surface-muted); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">2</div>
                    <strong style="font-size:0.86rem; color:var(--text-primary);">دراسة المنهج الأكاديمي</strong>
                  </div>
                  <span style="color:var(--primary); font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.4;">ابدأ بالوحدة الأولى: المفاهيم والقيد المزدوج والدورة المستندية.</div>
              </div>
            </div>

            <!-- الخطوة 3: حل كويز تقييم الفهم -->
            <div class="accountely-step-card" onclick="navigateToScreen('documentary-cycle')" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:var(--surface-muted); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">3</div>
                    <strong style="font-size:0.86rem; color:var(--text-primary);">اختبار تقييم الفهم</strong>
                  </div>
                  <span style="color:var(--primary); font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.4;">اختبر استيعابك بأسئلة الاختيار من متعدد والتمارين العملية الفورية.</div>
              </div>
            </div>

            <!-- الخطوة 4: تسجيل أول قيد في المحاكي -->
            <div class="accountely-step-card" onclick="navigateToScreen('companies-hub')" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:var(--surface-muted); color:var(--text-secondary); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">4</div>
                    <strong style="font-size:0.86rem; color:var(--text-primary);">تسجيل قيد في المحاكي</strong>
                  </div>
                  <span style="color:var(--primary); font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:var(--text-muted); line-height:1.4;">اختر شركة تدريبية وابدأ بإثبات الفواتير في دفتر اليومية الحقيقي.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. شريط حبوب الفلترة والخيارات (Filter Chips) -->
        <div style="display:flex; align-items:center; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:1.5rem;">
          <button class="filter-pill active">
            <span>${AccounteraIcons.render('star', { size: 14 })}</span>
            <span>نسبة الإتقان ≥ 80%</span>
          </button>
          <button class="filter-pill" onclick="window.location.href='simulation/simulation/journal/index.html'">
            <span>${AccounteraIcons.render('book-open', { size: 14 })}</span>
            <span>قيود اليومية</span>
          </button>
          <button class="filter-pill" onclick="navigateToScreen('documentary-cycle')">
            <span>${AccounteraIcons.render('file-text', { size: 14 })}</span>
            <span>اختبارات الدروس (38)</span>
          </button>
          <button class="filter-pill" onclick="navigateToScreen('companies-hub')">
            <span>${AccounteraIcons.render('target', { size: 14 })}</span>
            <span>بيئة الشركات</span>
          </button>
          <button class="filter-pill" onclick="navigateToScreen('portfolio')">
            <span>${AccounteraIcons.render('chart-bar', { size: 14 })}</span>
            <span>سجل الإنجازات</span>
          </button>
        </div>

        <!-- 6. شبكة المؤشرات الإحصائية الرئيسية (KPIs) -->
        <div class="student-stats-grid">
          <!-- كارت إنجاز المحاكاة -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-emerald">
              ${AccounteraIcons.render('trend-up', { size: 24, strokeWidth: 1.75 })}
            </div>
            <div class="stat-body">
              <div class="stat-label">إنجاز محاكي الشركات</div>
              <div class="stat-value tabular-nums">${percent}%</div>
              <div class="stat-note">${postedCount} من أصل ${totalTasks} قيد معتمد</div>
            </div>
          </div>

          <!-- كارت قيود اليومية -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-blue">
              ${AccounteraIcons.render('book-open', { size: 24, strokeWidth: 1.75 })}
            </div>
            <div class="stat-body">
              <div class="stat-label">القيود المسجلة والمرحلة</div>
              <div class="stat-value tabular-nums">${postedCount}</div>
              <div class="stat-note">شاملة قيد الأرصدة الافتتاحية ✓</div>
            </div>
          </div>

          <!-- كارت الدروس التعليمية -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-amber">
              ${AccounteraIcons.render('graduation-cap', { size: 24, strokeWidth: 1.75 })}
            </div>
            <div class="stat-body">
              <div class="stat-label">المسار الأكاديمي التأسيسي</div>
              <div class="stat-value tabular-nums">${completedLessonsCount} / 6 دروس</div>
              <div class="stat-note">${completedLessonsCount === 6 ? 'اكتمل المسار بالكامل ✓' : (completedLessonsCount > 0 ? `تم إنجاز ${completedLessonsCount} دروس بنجاح` : 'من الأساسيات إلى القوائم الختامية')}</div>
            </div>
          </div>

          <!-- كارت اتزان الميزان -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-purple">
              ${AccounteraIcons.render('scales', { size: 24, strokeWidth: 1.75 })}
            </div>
            <div class="stat-body">
              <div class="stat-label">اتزان دفتر الأستاذ</div>
              <div class="stat-value tabular-nums" style="font-size:1.3rem; color:var(--primary-text);">متزن 100% ✓</div>
              <div class="stat-note">تطابق تام للمدين والدائن</div>
            </div>
          </div>
        </div>

        <!-- 7. المخطط الرئيسي (عمودين) -->
        <div class="student-layout-grid">
          <!-- العمود الأيمن (الرئيسي) -->
          <div>
            <!-- بطاقة محطة الشركة النشطة -->
            <div class="active-company-card">
              <div class="company-card-header">
                <div class="company-title-area">
                  <div class="company-icon-badge">${AccounteraIcons.render('buildings', { size: 22, strokeWidth: 1.75 })}</div>
                  <div>
                    <h2 class="company-name">${profile.name}</h2>
                    <div class="company-meta">
                      <span>${profile.sector}</span>
                      <span>•</span>
                      <span>${profile.year}</span>
                      <span>•</span>
                      <span class="num-financial" style="font-weight:700; color:var(--primary-text);">${profile.code}</span>
                    </div>
                  </div>
                </div>
                <button class="btn-cta-secondary" onclick="navigateToScreen('companies-hub')" style="padding:6px 12px; font-size:0.8rem;">
                  تبديل الشركة
                </button>
              </div>

              <!-- شريط التقدم الفعلي -->
              <div class="sim-progress-box">
                <div class="sim-progress-header">
                  <span>مستوى إتمام الدورة المحاسبية للشركة</span>
                  <span>${postedCount} / ${totalTasks} قيد (${percent}%)</span>
                </div>
                <div class="sim-progress-track">
                  <div class="sim-progress-fill" style="width: ${Math.max(4, percent)}%;"></div>
                </div>
              </div>

              <!-- أزرار الوصول السريع لبيئة المحاكاة -->
              <div class="sim-quick-actions">
                <a href="simulation/simulation/journal/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">${AccounteraIcons.render('book-open', { size: 20, strokeWidth: 1.75 })}</span>
                  <span>دفتر اليومية</span>
                </a>
                <a href="simulation/simulation/ledger/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">${AccounteraIcons.render('scales', { size: 20, strokeWidth: 1.75 })}</span>
                  <span>دفتر الأستاذ</span>
                </a>
                <a href="simulation/simulation/bank-recon/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">${AccounteraIcons.render('bank', { size: 20, strokeWidth: 1.75 })}</span>
                  <span>التسوية البنكية</span>
                </a>
                <a href="simulation/simulation/statements/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">${AccounteraIcons.render('chart-bar', { size: 20, strokeWidth: 1.75 })}</span>
                  <span>القوائم المالية</span>
                </a>
              </div>
            </div>

            <!-- بطاقة المسار التعليمي المعتمد -->
            <div class="learning-path-card">
              <div class="section-header-row">
                <h3 class="section-title">
                  <span style="display:inline-flex; align-items:center; color:var(--primary);">${AccounteraIcons.render('graduation-cap', { size: 22, strokeWidth: 1.75 })}</span>
                  <span>المسار التعليمي التأسيسي للمحاسب المبتدئ</span>
                </h3>
                <div style="display:flex; gap:8px;">
                  <button class="btn-cta-primary" onclick="navigateToScreen('documentary-cycle')" style="padding:6px 14px; font-size:0.8rem; font-weight:800;">
                    المنهج الشامل (38 درساً) ⚡
                  </button>
                  <button class="btn-cta-secondary" onclick="navigateToScreen('lesson-1')" style="padding:6px 12px; font-size:0.8rem;">
                    بدء من أول درس
                  </button>
                </div>
              </div>

              <div class="lessons-list">
                ${[
                  { id: 'lesson-1', num: 1, title: 'ما هي المعاملة المالية؟', desc: 'التمييز بين الأحداث المالية القابلة للقياس النقدي والأحداث الإدارية الأخرى.' },
                  { id: 'lesson-2', num: 2, title: 'معادلة الميزانية وأثر العمليات', desc: 'فهم توازن معادلة المركز المالي (الأصول = الالتزامات + حقوق الملكية).' },
                  { id: 'lesson-3', num: 3, title: 'أنواع الحسابات الأساسية الخمسة', desc: 'معرفة التصنيفات الخمسة الرئيسية التي تشكل شجرة الحسابات (COA).' },
                  { id: 'lesson-4', num: 4, title: 'قواعد المدين والدائن ونظرية القيد المزدوج', desc: 'إتقان القاعدة المحاسبية الذهبية للزيادة والنقصان في أي حساب.' },
                  { id: 'lesson-5', num: 5, title: 'إطار تحليل المعاملة ذو الـ 6 خطوات', desc: 'منهجية تفكير منظمة لتحويل أي فاتورة أو مستند إلى قيد محاسبي سليم.' },
                  { id: 'lesson-6', num: 6, title: 'الدورة المحاسبية والقوائم المالية الختامية', desc: 'رؤية الصورة الشاملة من تسجيل العمليات حتى إعداد القوائم الختامية.' }
                ].map(l => {
                  const done = (typeof ProgressService !== 'undefined') ? ProgressService.isLessonCompleted(l.id) : false;
                  return `
                    <div class="lesson-item-row" onclick="navigateToScreen('${l.id}')" style="cursor:pointer;">
                      <div class="lesson-item-left">
                        <div class="lesson-num-pill" style="${done ? 'background:rgba(16,185,129,0.15); color:#10B981;' : ''}">
                          ${done ? '✓' : l.num}
                        </div>
                        <div>
                          <div class="lesson-title-text" style="display:flex; align-items:center; gap:8px;">
                            <span>${l.title}</span>
                            ${done ? '<span style="font-size:0.75rem; color:#10B981; font-weight:700;">(مكتمل ✓)</span>' : ''}
                          </div>
                          <div class="lesson-desc-text">${l.desc}</div>
                        </div>
                      </div>
                      <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem; ${done ? 'border-color:#10B981; color:#10B981;' : ''}">
                        ${done ? 'مراجعة' : 'دراسة'}
                      </button>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- بطاقة سجل القيود المسجلة بالمحاكي -->
            <div class="recent-entries-card">
              <div class="section-header-row">
                <h3 class="section-title">
                  <span style="display:inline-flex; align-items:center; color:var(--primary);">${AccounteraIcons.render('file-text', { size: 22, strokeWidth: 1.75 })}</span>
                  <span>العمليات والقيود المسجلة حديثاً في المحاكي</span>
                </h3>
                <a href="simulation/simulation/journal/index.html" class="btn-cta-secondary" style="padding:6px 12px; font-size:0.8rem; text-decoration:none;">
                  عرض سجل اليومية الكامل
                </a>
              </div>

              ${recentEntries.length === 0 ? `
                <div style="text-align:center; padding:2rem 1rem; color:var(--text-muted); font-size:0.85rem;">
                  لم تسجل أي قيود بعد. افتح دفتر اليومية لبدء تسجيل المعاملات التشغيلية.
                </div>
              ` : `
                <div style="display:flex; flex-direction:column;">
                  ${recentEntries.map(e => {
                    const isOpening = e.type === 'Opening Balance' || e.isAutoOpening;
                    const totalDebit = (e.lines || []).reduce((s, l) => s + (Number(l.debit) || 0), 0);
                    return `
                      <div class="entry-row-item">
                        <div style="display:flex; align-items:center; gap:10px;">
                          <span class="num-financial" style="font-weight:800; font-size:0.8rem; background:var(--bg-secondary); padding:3px 8px; border-radius:6px; border:1px solid var(--border-subtle);">
                            ${e.id}
                          </span>
                          <div>
                            <div style="font-weight:700; color:var(--text-primary);">
                              ${isOpening ? 'محضر إثبات الأرصدة الافتتاحية' : (e.ref || e.type || 'معاملة مالية')}
                            </div>
                            <div style="font-size:0.75rem; color:var(--text-muted);">${e.date || '2026-01-01'}</div>
                          </div>
                        </div>

                        <div style="display:flex; align-items:center; gap:12px;">
                          <span class="num-financial" style="font-weight:800; color:var(--text-primary);">
                            ${totalDebit.toLocaleString()} ج.م
                          </span>
                          <span style="background:var(--primary-light); color:var(--primary); padding:3px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; border:1px solid var(--primary-border);">
                            مرحل للأستاذ ✓
                          </span>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>
          </div>

          <!-- العمود الأيسر (الجانبي) -->
          <div>
            <!-- بطاقة جواز الكفاءة والأوسمة المحاسبية -->
            <div class="active-company-card">
              <h3 class="section-title" style="margin-bottom:1.25rem;">
                <span style="display:inline-flex; align-items:center; color:var(--primary);">${AccounteraIcons.render('trophy', { size: 22, strokeWidth: 1.75 })}</span>
                <span>جواز الكفاءة والأوسمة المهنية</span>
              </h3>

              <div class="badges-grid">
                <div class="badge-card unlocked">
                  <div class="badge-icon">${AccounteraIcons.render('star', { size: 20, strokeWidth: 1.75 })}</div>
                  <div class="badge-info">
                    <h4 class="badge-name">الأرصدة الافتتاحية المعتمدة</h4>
                    <p class="badge-desc">تم إثبات وترحيل المركز المالي الافتتاحي وتأسيس الدفاتر بنجاح.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount > 1 ? 'unlocked' : ''}">
                  <div class="badge-icon">${AccounteraIcons.render('book-open', { size: 20, strokeWidth: 1.75 })}</div>
                  <div class="badge-info">
                    <h4 class="badge-name">القيد المزدوج المتوازن</h4>
                    <p class="badge-desc">إتقان تسجيل أطراف العمليات المالية بمطابقة تامة بين المدين والدائن.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount >= 5 ? 'unlocked' : ''}">
                  <div class="badge-icon">${AccounteraIcons.render('scales', { size: 20, strokeWidth: 1.75 })}</div>
                  <div class="badge-info">
                    <h4 class="badge-name">مدقق دفتر الأستاذ العام</h4>
                    <p class="badge-desc">ترحيل الحركات لحسابات T والتحقق من سلامة ميزان المراجعة.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount >= 10 ? 'unlocked' : ''}">
                  <div class="badge-icon">${AccounteraIcons.render('bank', { size: 20, strokeWidth: 1.75 })}</div>
                  <div class="badge-info">
                    <h4 class="badge-name">خبير المطابقة البنكية</h4>
                    <p class="badge-desc">تسوية الفروقات بين كشف حساب البنك ودفتر النقدية بدقة متناهية.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- بطاقة التمارين المستقلة والأمثلة المحلولة -->
            <div class="learning-path-card">
              <h3 class="section-title" style="margin-bottom:1rem;">
                <span style="display:inline-flex; align-items:center; color:var(--primary);">${AccounteraIcons.render('target', { size: 22, strokeWidth: 1.75 })}</span>
                <span>التمارين والتطبيقات التفاعلية</span>
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <div onclick="navigateToScreen('ex-1')" style="cursor:pointer; padding:12px; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="display:flex; align-items:center; gap:6px; font-size:0.85rem; color:var(--text-primary);">
                      <span style="color:var(--primary); display:inline-flex;">${AccounteraIcons.render('lightbulb', { size: 16, strokeWidth: 1.75 })}</span>
                      الأمثلة المحلولة النموذجية
                    </strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">أمثلة عملية نموذجية مشروحة خطوة بخطوة</span>
                  </div>
                  <span style="font-size:0.9rem; color:var(--primary); font-weight:800;">➔</span>
                </div>

                <div onclick="navigateToScreen('ip-1')" style="cursor:pointer; padding:12px; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="display:flex; align-items:center; gap:6px; font-size:0.85rem; color:var(--text-primary);">
                      <span style="color:var(--primary); display:inline-flex;">${AccounteraIcons.render('target', { size: 16, strokeWidth: 1.75 })}</span>
                      التمارين المستقلة الذكية
                    </strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">حل القيود ذاتياً مع التدقيق والتصحيح الفوري</span>
                  </div>
                  <span style="font-size:0.9rem; color:var(--primary); font-weight:800;">➔</span>
                </div>
              </div>
            </div>

            <!-- بطاقة مساعدة المدقق الذكي -->
            <div style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.08) 100%); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:1.25rem;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
                <span style="display:inline-flex; align-items:center; color:var(--primary);">${AccounteraIcons.render('lightbulb', { size: 20, strokeWidth: 1.75 })}</span>
                <strong style="font-size:0.9rem; color:var(--text-primary);">نصيحة التدريب اليومية:</strong>
              </div>
              <p style="font-size:0.82rem; color:var(--text-secondary); line-height:1.6; margin:0;">
                دائماً ابدأ بقراءة المستند بدقة وحدد الأطراف المتأثرة (أصول، خصوم، إيرادات، أو مصروفات) قبل إدخال أرقام القيد لضمان اتزان ميزان المراجعة من أول مرة.
              </p>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  animateEntrance() {
    if (typeof gsap === 'undefined') return;

    // 1. تحريك تدريجي للبطاقات ومجموعات الواجهة
    gsap.from('.accountely-streak-card, .accountely-getting-started-card, .resume-learning-card, .student-stat-card, .dash-panel-card', {
      opacity: 0,
      y: 18,
      duration: 0.45,
      stagger: 0.05,
      ease: 'power2.out'
    });

    // 2. عداد الأرقام الديناميكي التصاعدي لمؤشرات الأداء (KPI Counters)
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

    // 3. تحريك انسيابي لأشرطة التقدم
    gsap.from('.acc-progress-bar-fill, .progress-fill', {
      width: '0%',
      duration: 0.85,
      ease: 'power2.out'
    });
  }
};

window.ExcelStudentDashboard = ExcelStudentDashboard;
