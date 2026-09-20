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
        percent: simInfo.percent || 0
      };
    } catch(e) {
      return {
        simInfo: { companyName: 'شركة النيل للتجارة والتوزيع', totalTasks: 0, completedTasks: 0, percent: 0 },
        profile: { name: 'شركة النيل للتجارة والتوزيع', sector: 'تجارة عامة وتوزيع', year: 'السنة المالية 2026', code: 'NTL-2026' },
        journal: [],
        postedCount: 0,
        totalTasks: 100,
        percent: 0
      };
    }
  },

  render() {
    const user = (typeof AuthService !== 'undefined') ? AuthService.getCurrentUser() : null;
    const studentName = user && user.name ? user.name : 'محاسب مالي متدرب';
    const email = user && user.email ? user.email : 'student@accountera.edu';
    
    const { simInfo, profile, journal, postedCount, totalTasks, percent } = this.getSimData();

    // آخر 4 عمليات مسجلة في دفتر اليومية
    const recentEntries = [...journal].reverse().slice(0, 4);

    return `
      <div class="student-dashboard-container">
        <!-- 1. Accountely Header الترحيبي -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 1.5rem; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:1.9rem; font-weight:800; color:#0f172a; margin:0 0 4px 0; display:flex; align-items:center; gap:8px; letter-spacing:-0.02em;">
              Welcome back, <span style="color:#10b981;">${studentName}</span>
            </h1>
            <p style="color:#64748b; font-size:0.92rem; margin:0;">
              Here's your learning progress at a glance. • ملخص مسارك التدريبي وإنجازاتك الحالية.
            </p>
          </div>
          <button onclick="navigateToScreen('companies-hub')" style="background:#10b981; color:#ffffff; border:none; padding:10px 22px; border-radius:10px; font-weight:700; font-size:0.9rem; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow: 0 2px 8px rgba(16,185,129,0.25); transition:all 0.2s ease;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
            <span>Browse Challenges</span>
            <span>←</span>
          </button>
        </div>

        <!-- 2. بطاقة الـ Streak والنشاط اليومي (Accountely Streak Card) -->
        <div class="accountely-streak-card">
          <div style="display:flex; align-items:flex-start; gap:14px;">
            <div class="streak-circle-icon"></div>
            <div>
              <div style="font-size:1.15rem; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:6px;">
                <span>${postedCount > 0 ? '1 day' : '0 days'}</span>
                <span style="font-weight:700; color:#334155; font-size:0.95rem;">• ${postedCount > 0 ? 'Active streak! 🔥' : 'No streak yet'}</span>
              </div>
              <div style="font-size:0.84rem; color:#64748b; margin-top:3px;">
                Solve one challenge to begin. A quick quiz counts. • سجل قيداً أو حل سؤالاً اليوم لبدء التتابع.
              </div>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
            <!-- مؤشر الـ 14 يوماً مع الحروف S M T W T F S -->
            <div style="display:flex; flex-direction:column; gap:4px; align-items:center;">
              <div style="display:flex; gap:5px;">
                ${['S','M','T','W','T','F','S','S','M','T','W','T','F','S'].map((day, idx) => `
                  <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
                    <div style="width:14px; height:20px; border-radius:4px; background:${idx === 13 && postedCount > 0 ? '#10b981' : '#f1f5f9'}; border:1px solid ${idx === 13 && postedCount > 0 ? '#059669' : '#e2e8f0'};"></div>
                    <span style="font-size:0.62rem; font-weight:700; color:#94a3b8;">${day}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <button onclick="window.location.href='simulation/simulation/journal/index.html'" style="background:#10b981; color:#ffffff; border:none; padding:9px 18px; border-radius:8px; font-weight:700; font-size:0.85rem; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s ease;" onmouseover="this.style.background='#059669'" onmouseout="this.style.background='#10b981'">
              <span>Start today</span>
              <span>←</span>
            </button>
          </div>
        </div>

        <!-- 3. كروت البداية السريعة Getting Started -->
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:1.5rem; margin-bottom:1.5rem; box-shadow:0 2px 10px rgba(0,0,0,0.02); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <h3 style="font-size:1.15rem; font-weight:800; color:#0f172a; margin:0 0 4px 0;">Getting started • البداية السريعة</h3>
              <p style="font-size:0.82rem; color:#64748b; margin:0;">
                1 of 4 done — a two-minute path to your first solve. • تم إنجاز خطوة من 4 نحو الحل الأول.
              </p>
            </div>
            <button onclick="this.closest('div[style*=\\'position:relative\\']').style.display='none'" style="background:transparent; border:none; color:#94a3b8; font-size:1.2rem; cursor:pointer; padding:2px 6px;">✕</button>
          </div>

          <!-- شريط تقدم الخطوات الأخضر النحيف -->
          <div style="width:100%; height:4px; background:#f1f5f9; border-radius:999px; margin-bottom:1.25rem; overflow:hidden;">
            <div style="width:25%; height:100%; background:#10b981; border-radius:999px;"></div>
          </div>

          <!-- بطاقات الخطوات الأربع المتجاورة -->
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:12px;">
            <!-- Step 1 (Completed) -->
            <div class="accountely-step-card" style="background:#f8fafc; border-color:#e2e8f0;">
              <div>
                <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                  <div style="width:22px; height:22px; border-radius:50%; background:#10b981; color:#fff; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">✓</div>
                  <strong style="font-size:0.86rem; color:#0f172a;">Create your account</strong>
                </div>
                <div style="font-size:0.76rem; color:#64748b; line-height:1.4;">Done — welcome aboard! • تم تفعيل الحساب</div>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="accountely-step-card" onclick="window.location.href='simulation/simulation/journal/index.html'" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">2</div>
                    <strong style="font-size:0.86rem; color:#0f172a;">Submit your first challenge</strong>
                  </div>
                  <span style="color:#10b981; font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:#64748b; line-height:1.4;">Pick an Easy journal entry and give it a try — you get scored feedback instantly.</div>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="accountely-step-card" onclick="navigateToScreen('ex-1')" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">3</div>
                    <strong style="font-size:0.86rem; color:#0f172a;">Answer a quiz question</strong>
                  </div>
                  <span style="color:#10b981; font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:#64748b; line-height:1.4;">Quick MCQs are a low-pressure way to test your theory. • أسئلة سريعة لاختبار الفهم.</div>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="accountely-step-card" onclick="navigateToScreen('lesson-1')" style="cursor:pointer;">
              <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <div style="width:22px; height:22px; border-radius:6px; background:#f1f5f9; color:#475569; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:800;">4</div>
                    <strong style="font-size:0.86rem; color:#0f172a;">See how scoring works</strong>
                  </div>
                  <span style="color:#10b981; font-size:0.9rem; font-weight:800;">←</span>
                </div>
                <div style="font-size:0.76rem; color:#64748b; line-height:1.4;">Understand how answers are checked against EAS/IFRS-compliant keys.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. شريط حبوب الفلترة والخيارات (Filter Chips) -->
        <div style="display:flex; align-items:center; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:1.5rem;">
          <button class="filter-pill active">
            <span>💎</span>
            <span>Score ≥ 80%</span>
          </button>
          <button class="filter-pill">
            <span>📖</span>
            <span>Excl. MCQ • قيود اليومية</span>
          </button>
          <button class="filter-pill">
            <span>📝</span>
            <span>Quizzes</span>
          </button>
          <button class="filter-pill">
            <span>🎯</span>
            <span>Unique</span>
          </button>
          <button class="filter-pill">
            <span>📅</span>
            <span>All time</span>
          </button>
          <button class="filter-pill">
            <span>⚡</span>
            <span>All types</span>
          </button>
        </div>

        <!-- 2. شبكة المؤشرات الإحصائية الرئيسية (KPIs) -->
        <div class="student-stats-grid">
          <!-- كارت إنجاز المحاكاة -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-emerald">📈</div>
            <div class="stat-body">
              <div class="stat-label">إنجاز محاكي الشركات</div>
              <div class="stat-value">${percent}%</div>
              <div class="stat-note">${postedCount} من أصل ${totalTasks} قيد معتمد</div>
            </div>
          </div>

          <!-- كارت قيود اليومية -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-blue">📖</div>
            <div class="stat-body">
              <div class="stat-label">القيود المسجلة والمرحلة</div>
              <div class="stat-value">${postedCount}</div>
              <div class="stat-note">شاملة قيد الأرصدة الافتتاحية ✓</div>
            </div>
          </div>

          <!-- كارت الدروس التعليمية -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-amber">📚</div>
            <div class="stat-body">
              <div class="stat-label">المسار الأكاديمي التأسيسي</div>
              <div class="stat-value">6 دروس</div>
              <div class="stat-note">من الأساسيات إلى القوائم الختامية</div>
            </div>
          </div>

          <!-- كارت اتزان الميزان -->
          <div class="student-stat-card">
            <div class="stat-icon-wrap stat-icon-purple">⚖️</div>
            <div class="stat-body">
              <div class="stat-label">اتزان دفتر الأستاذ</div>
              <div class="stat-value" style="font-size:1.3rem; color:#10b981;">متزن 100% ✓</div>
              <div class="stat-note">تطابق تام للمدين والدائن</div>
            </div>
          </div>
        </div>

        <!-- 3. المخطط الرئيسي (عمودين) -->
        <div class="student-layout-grid">
          <!-- العمود الأيمن (الرئيسي) -->
          <div>
            <!-- بطاقة محطة الشركة النشطة -->
            <div class="active-company-card">
              <div class="company-card-header">
                <div class="company-title-area">
                  <div class="company-icon-badge">🏢</div>
                  <div>
                    <h2 class="company-name">${profile.name}</h2>
                    <div class="company-meta">
                      <span>${profile.sector}</span>
                      <span>•</span>
                      <span>${profile.year}</span>
                      <span>•</span>
                      <span style="font-family:monospace; font-weight:700; color:var(--primary);">${profile.code}</span>
                    </div>
                  </div>
                </div>
                <button class="btn-cta-secondary" onclick="navigateToScreen('companies-hub')" style="padding:6px 12px; font-size:0.8rem;">
                  تبديل الشركة ⇄
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
                  <span class="sim-action-icon">📖</span>
                  <span>دفتر اليومية</span>
                </a>
                <a href="simulation/simulation/ledger/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">⚖️</span>
                  <span>دفتر الأستاذ</span>
                </a>
                <a href="simulation/simulation/bank-recon/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">🏦</span>
                  <span>التسوية البنكية</span>
                </a>
                <a href="simulation/simulation/statements/index.html" class="sim-action-btn">
                  <span class="sim-action-icon">📊</span>
                  <span>القوائم المالية</span>
                </a>
              </div>
            </div>

            <!-- بطاقة المسار التعليمي المعتمد -->
            <div class="learning-path-card">
              <div class="section-header-row">
                <h3 class="section-title">
                  <span>📖</span>
                  <span>المسار التعليمي التأسيسي للمحاسب المبتدئ</span>
                </h3>
                <button class="btn-cta-secondary" onclick="navigateToScreen('lesson-1')" style="padding:6px 12px; font-size:0.8rem;">
                  بدء من أول درس ➔
                </button>
              </div>

              <div class="lessons-list">
                <div class="lesson-item-row" onclick="navigateToScreen('lesson-1')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">1</div>
                    <div>
                      <div class="lesson-title-text">ما هي المعاملة المالية؟</div>
                      <div class="lesson-desc-text">التمييز بين الأحداث المالية القابلة للقياس النقدي والأحداث الإدارية.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>

                <div class="lesson-item-row" onclick="navigateToScreen('lesson-2')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">2</div>
                    <div>
                      <div class="lesson-title-text">معادلة الميزانية وأثر العمليات</div>
                      <div class="lesson-desc-text">الأصول = الالتزامات + حقوق الملكية وتطبيق أثر التغيرات التلقائية.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>

                <div class="lesson-item-row" onclick="navigateToScreen('lesson-3')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">3</div>
                    <div>
                      <div class="lesson-title-text">نظرية القيد المزدوج (المدين والدائن)</div>
                      <div class="lesson-desc-text">قواعد تحديد الحساب المدين والدائن استناداً لطبيعة الحسابات الخمسة.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>

                <div class="lesson-item-row" onclick="navigateToScreen('lesson-4')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">4</div>
                    <div>
                      <div class="lesson-title-text">دورة المبيعات والعملاء وفواتير الآجل</div>
                      <div class="lesson-desc-text">إثبات فواتير البيع، ضريبة القيمة المضافة، وحسابات العملاء والتحصيل.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>

                <div class="lesson-item-row" onclick="navigateToScreen('lesson-5')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">5</div>
                    <div>
                      <div class="lesson-title-text">دورة المشتريات والموردين وضريبة المدخلات</div>
                      <div class="lesson-desc-text">توريد المخزون، استحقاق فواتير الموردين، وإشعارات السداد والخصم.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>

                <div class="lesson-item-row" onclick="navigateToScreen('lesson-6')" style="cursor:pointer;">
                  <div class="lesson-item-left">
                    <div class="lesson-num-pill">6</div>
                    <div>
                      <div class="lesson-title-text">التسويات الجردية والرواتب ومجمع الإهلاك</div>
                      <div class="lesson-desc-text">مسير أجور الموظفين، إهلاك الأصول الثابتة، والمصروفات المقدمة والمستحقة.</div>
                    </div>
                  </div>
                  <button class="btn-cta-secondary" style="padding:4px 10px; font-size:0.75rem;">دراسة 👈</button>
                </div>
              </div>
            </div>

            <!-- بطاقة سجل القيود المسجلة بالمحاكي -->
            <div class="recent-entries-card">
              <div class="section-header-row">
                <h3 class="section-title">
                  <span>📑</span>
                  <span>العمليات والقيود المسجلة حديثاً في المحاكي</span>
                </h3>
                <a href="simulation/simulation/journal/index.html" class="btn-cta-secondary" style="padding:6px 12px; font-size:0.8rem; text-decoration:none;">
                  عرض سجل اليومية الكامل ➔
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
                          <span style="font-family:'JetBrains Mono',monospace; font-weight:800; font-size:0.8rem; background:var(--bg-secondary); padding:3px 8px; border-radius:6px; border:1px solid var(--border-subtle);">
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
                          <span style="font-family:'JetBrains Mono',monospace; font-weight:800; color:var(--text-primary);">
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
                <span>🏆</span>
                <span>جواز الكفاءة والأوسمة المهنية</span>
              </h3>

              <div class="badges-grid">
                <div class="badge-card unlocked">
                  <div class="badge-icon">🌟</div>
                  <div class="badge-info">
                    <h4 class="badge-name">الأرصدة الافتتاحية المعتمدة</h4>
                    <p class="badge-desc">تم إثبات وترحيل المركز المالي الافتتاحي وتأسيس الدفاتر بنجاح.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount > 1 ? 'unlocked' : ''}">
                  <div class="badge-icon">✍️</div>
                  <div class="badge-info">
                    <h4 class="badge-name">القيد المزدوج المتوازن</h4>
                    <p class="badge-desc">إتقان تسجيل أطراف العمليات المالية بمطابقة تامة بين المدين والدائن.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount >= 5 ? 'unlocked' : ''}">
                  <div class="badge-icon">⚖️</div>
                  <div class="badge-info">
                    <h4 class="badge-name">مدقق دفتر الأستاذ العام</h4>
                    <p class="badge-desc">ترحيل الحركات لحسابات T والتحقق من سلامة ميزان المراجعة.</p>
                  </div>
                </div>

                <div class="badge-card ${postedCount >= 10 ? 'unlocked' : ''}">
                  <div class="badge-icon">🏦</div>
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
                <span>🎯</span>
                <span>التمارين والتطبيقات التفاعلية</span>
              </h3>

              <div style="display:flex; flex-direction:column; gap:10px;">
                <div onclick="navigateToScreen('ex-1')" style="cursor:pointer; padding:12px; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="display:block; font-size:0.85rem; color:var(--text-primary);">💡 الأمثلة المحلولة النموذجية</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">10 حالات عملية مشروحة خطوة بخطوة</span>
                  </div>
                  <span style="font-size:0.9rem; color:var(--primary); font-weight:800;">➔</span>
                </div>

                <div onclick="navigateToScreen('ip-1')" style="cursor:pointer; padding:12px; border-radius:12px; background:var(--bg-secondary); border:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <strong style="display:block; font-size:0.85rem; color:var(--text-primary);">✏️ التمارين المستقلة الذكية</strong>
                    <span style="font-size:0.75rem; color:var(--text-muted);">حل القيود ذاتياً مع التدقيق والتصحيح الفوري</span>
                  </div>
                  <span style="font-size:0.9rem; color:var(--primary); font-weight:800;">➔</span>
                </div>
              </div>
            </div>

            <!-- بطاقة مساعدة المدقق الذكي -->
            <div style="background:linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.08) 100%); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:1.25rem;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:0.5rem;">
                <span style="font-size:1.3rem;">💡</span>
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
  }
};

window.ExcelStudentDashboard = ExcelStudentDashboard;
