/**
 * documentary-cycle-view.js — قسم الجزء النظري (Theory Section)
 * يشتمل على:
 * 1. فهرس الـ 38 درساً مقسمة لـ 6 وحدات، مع إدراج درس 14 بعد درس 4 في الوحدة الأولى.
 * 2. محرك بحث ذكي يتجاهل فروق الهمزات والتاء المربوطة والألف اللينة والتشكيل.
 * 3. تحميل كل درس واختباره بشكل منفصل عند الطلب (Lazy Loading).
 * 4. محول قوالب الـ JSON المهيكلة (Blocks: فقرات، معادلات، تنبيهات، جداول، قيود يومية، تمارين).
 * 5. بنك اختبارات تفاعلي من 6 أسئلة لكل درس (اختيار من متعدد، صح وخطأ، وتمرين تطبيقي).
 * 6. ربط إنجاز الدرس بحد نجاح 70% في الاختبار ومزامنته سحابياً مع ProgressService.
 */

const DocumentaryCycleView = {
  // الحالة الداخلية للقسم
  state: {
    indexData: null,
    currentLessonId: 'lesson-01',
    currentLesson: null,
    currentQuiz: null,
    activeTab: 'content', // 'content' | 'quiz'
    selectedModule: 'all', // 'all' | 1 | 2 | 3 | 4 | 5 | 6
    searchQuery: '',
    fontSize: 16, // px
    isLoading: false,
    errorMessage: null,
    // حالة الاختبار للدرس الحالي
    quizAnswers: {}, // { [qId]: selectedOptionKey }
    quizSubmitted: false,
    quizScore: null,
    quizPassed: false,
    practicalNotes: ''
  },

  // كاش محلي للدروس والاختبارات المحملة لتفادي تكرار طلبات الشبكة
  cache: {
    lessons: {},
    quizzes: {}
  },

  /**
   * تطبيع النص العربي لتجاهل التشكيل والهمزات والتاء المربوطة
   */
  normalizeArabic(str) {
    if (!str) return '';
    return str
      .replace(/[\u064B-\u065F\u0670]/g, '') // حذف حركات التشكيل والتنوين
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ئ/g, 'ي')
      .replace(/ؤ/g, 'و')
      .toLowerCase()
      .trim();
  },

  /**
   * جلب بيانات الفهرس الأساسية (theory-index.json)
   */
  async fetchIndex() {
    if (this.state.indexData) return this.state.indexData;
    try {
      const res = await fetch('data/theory/theory-index.json');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // الترتيب حسب displayOrder المعياري (الذي يضع درس 14 بعد درس 4)
      this.state.indexData = data.sort((a, b) => (a.displayOrder || a.number) - (b.displayOrder || b.number));
      return this.state.indexData;
    } catch (err) {
      console.error('[DocumentaryCycleView] Error loading theory index:', err);
      this.state.errorMessage = 'تعذر تحميل فهرس الدروس النظرية. يرجى إعادة تحديث الصفحة.';
      return [];
    }
  },

  /**
   * تحميل بيانات درس محدد بنظام Lazy Loading
   */
  async loadLesson(lessonId) {
    if (!lessonId) return null;
    if (this.cache.lessons[lessonId]) {
      this.state.currentLesson = this.cache.lessons[lessonId];
      return this.state.currentLesson;
    }

    try {
      this.state.isLoading = true;
      const res = await fetch(`data/theory/lessons/${lessonId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.cache.lessons[lessonId] = data;
      this.state.currentLesson = data;
      return data;
    } catch (err) {
      console.error(`[DocumentaryCycleView] Failed to load lesson ${lessonId}:`, err);
      this.state.errorMessage = `تعذر تحميل محتوى الدرس (${lessonId}).`;
      return null;
    } finally {
      this.state.isLoading = false;
    }
  },

  /**
   * تحميل بيانات اختبار درس محدد بنظام Lazy Loading
   */
  async loadQuiz(lessonId) {
    if (!lessonId) return null;
    if (this.cache.quizzes[lessonId]) {
      this.state.currentQuiz = this.cache.quizzes[lessonId];
      return this.state.currentQuiz;
    }

    try {
      const res = await fetch(`data/theory/quizzes/${lessonId}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.cache.quizzes[lessonId] = data;
      this.state.currentQuiz = data;
      return data;
    } catch (err) {
      console.error(`[DocumentaryCycleView] Failed to load quiz for ${lessonId}:`, err);
      return null;
    }
  },

  /**
   * تبديل الدرس المفتوح حالياً
   */
  async selectLesson(lessonId, tab = 'content') {
    this.state.currentLessonId = lessonId;
    this.state.activeTab = tab;
    this.state.quizAnswers = {};
    this.state.quizSubmitted = false;
    this.state.quizScore = null;
    this.state.quizPassed = false;
    this.state.practicalNotes = '';

    await Promise.all([
      this.loadLesson(lessonId),
      this.loadQuiz(lessonId)
    ]);

    this.updateReaderDOM();
    this.updateSidebarActiveState();

    // تحديث رابط الصفحة لدعم التصفح والرجوع
    try {
      window.history.replaceState(null, '', `#theory?lesson=${lessonId}`);
    } catch (e) {}

    const readerEl = document.getElementById('theory-reader-container');
    if (readerEl) readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /**
   * التبديل بين محتوى الدرس واختبار التقييم
   */
  switchTab(tab) {
    this.state.activeTab = tab;
    this.updateReaderDOM();
  },

  /**
   * تغيير فلتر الوحدة
   */
  setModuleFilter(mod) {
    this.state.selectedModule = mod;
    this.updateSidebarLessonsList();
  },

  /**
   * تصفية البحث الفوري
   */
  handleSearchInput(query) {
    this.state.searchQuery = query;
    this.updateSidebarLessonsList();
  },

  /**
   * ضبط حجم الخط أثناء القراءة
   */
  adjustFontSize(delta) {
    const nextSize = Math.max(14, Math.min(24, this.state.fontSize + delta));
    this.state.fontSize = nextSize;
    const contentEl = document.getElementById('theory-content-body');
    if (contentEl) {
      contentEl.style.fontSize = `${nextSize}px`;
    }
  },

  /**
   * تسجيل إجابة سؤال داخل الاختبار
   */
  selectQuizOption(qId, key) {
    if (this.state.quizSubmitted) return; // ممنوع التعديل بعد التسليم
    this.state.quizAnswers[qId] = key;
    this.renderQuizCardSelection(qId);
  },

  /**
   * تسليم إجابات الاختبار وحساب النتيجة
   */
  async submitQuiz() {
    const quiz = this.state.currentQuiz;
    if (!quiz || !Array.isArray(quiz.questions)) return;

    const gradableQuestions = quiz.questions.filter(q => q.type === 'mcq' || q.type === 'true_false');
    let correctCount = 0;

    gradableQuestions.forEach(q => {
      const selected = this.state.quizAnswers[q.id];
      if (selected && selected === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / gradableQuestions.length) * 100);
    const passThreshold = quiz.passingScorePercentage || 70;
    const isPassed = scorePercentage >= passThreshold;

    this.state.quizSubmitted = true;
    this.state.quizScore = scorePercentage;
    this.state.quizPassed = isPassed;

    // حفظ النتيجة والإنجاز في حساب الطالب السحابي
    if (isPassed && typeof ProgressService !== 'undefined') {
      try {
        await ProgressService.completeLesson(this.state.currentLessonId);
      } catch (err) {
        console.warn('[DocumentaryCycleView] Error recording lesson completion:', err);
      }
    }

    if (typeof PracticeService !== 'undefined') {
      try {
        await PracticeService.recordAttempt({
          exerciseId: `theory-${this.state.currentLessonId}`,
          exerciseType: 'theory_quiz',
          score: scorePercentage,
          isCorrect: isPassed,
          answerData: {
            answers: this.state.quizAnswers,
            correctCount,
            totalGradable: gradableQuestions.length
          }
        });
      } catch (err) {
        console.warn('[DocumentaryCycleView] Error recording quiz attempt:', err);
      }
    }

    // إعادة رسم شاشة الاختبار لإظهار النتائج والشرح والتعليلات
    this.updateReaderDOM();
    this.updateSidebarLessonsList();
  },

  /**
   * إعادة محاولة الاختبار
   */
  retakeQuiz() {
    this.state.quizAnswers = {};
    this.state.quizSubmitted = false;
    this.state.quizScore = null;
    this.state.quizPassed = false;
    this.updateReaderDOM();
  },

  /**
   * التحقق من إتمام الدرس (من السحابة أو الكاش المحلي)
   */
  isCompleted(lessonId) {
    if (typeof ProgressService !== 'undefined') {
      return ProgressService.isLessonCompleted(lessonId);
    }
    try {
      const local = JSON.parse(localStorage.getItem('acc_completed_lessons') || '[]');
      return local.includes(lessonId);
    } catch (e) {
      return false;
    }
  },

  /**
   * حساب إجمالي الدروس المكتملة
   */
  getCompletedCount() {
    if (!this.state.indexData) return 0;
    return this.state.indexData.filter(l => this.isCompleted(l.id)).length;
  },

  /**
   * جلب الدرس السابق والتالي في الترتيب المعياري
   */
  getAdjacentLessons() {
    if (!this.state.indexData) return { prev: null, next: null };
    const list = this.state.indexData;
    const currIdx = list.findIndex(l => l.id === this.state.currentLessonId);
    if (currIdx === -1) return { prev: null, next: null };
    return {
      prev: currIdx > 0 ? list[currIdx - 1] : null,
      next: currIdx < list.length - 1 ? list[currIdx + 1] : null
    };
  },

  /**
   * بناء شفرة HTML لجميع الـ blocks المنظمة للدرس
   */
  renderBlocks(blocks) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
      return `<p class="theory-empty-text">لا توجد فقرات نصية متاحة لهذا الدرس.</p>`;
    }

    return blocks.map((block, idx) => {
      switch (block.type) {
        case 'heading': {
          const lvl = block.level || 2;
          const cls = lvl === 2 ? 'theory-heading-2' : 'theory-heading-3';
          return `<h${lvl} class="${cls}">${block.text}</h${lvl}>`;
        }

        case 'paragraph': {
          return `<p>${block.text}</p>`;
        }

        case 'equation': {
          return `
            <div class="theory-equation-box">
              <div class="theory-equation-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 12h16m-16 6h16M4 6h16"/></svg>
                معادلة محاسبية جوهرية
              </div>
              <div class="theory-equation-formula">${block.formula || block.text}</div>
            </div>
          `;
        }

        case 'note': {
          return `
            <div class="theory-note-box">
              <div class="theory-note-icon">💡</div>
              <div class="theory-note-text">${block.text}</div>
            </div>
          `;
        }

        case 'list': {
          const tag = block.ordered ? 'ol' : 'ul';
          const items = (block.items || []).map(it => `<li>${it}</li>`).join('');
          return `<${tag} class="theory-list">${items}</${tag}>`;
        }

        case 'table': {
          const headers = (block.headers || []).map(h => `<th>${h}</th>`).join('');
          const rows = (block.rows || []).map(r => `
            <tr>
              ${(r || []).map(c => `<td>${c}</td>`).join('')}
            </tr>
          `).join('');
          return `
            <div class="theory-table-wrapper">
              <table class="theory-table">
                ${headers ? `<thead><tr>${headers}</tr></thead>` : ''}
                <tbody>${rows}</tbody>
              </table>
            </div>
          `;
        }

        case 'journal_entry': {
          const lines = block.lines || [];
          return `
            <div class="theory-journal-card">
              <div class="theory-journal-header">
                <span class="theory-journal-title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  قيد يومية عامة
                </span>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                  ${block.entryNumber ? `<span class="theory-journal-badge">قيد رقم: ${block.entryNumber}</span>` : ''}
                  ${block.date ? `<span class="theory-journal-badge">التاريخ: ${block.date}</span>` : ''}
                </div>
              </div>
              <div class="theory-table-wrapper" style="margin:0; border:none; border-radius:0;">
                <table class="theory-journal-table">
                  <thead>
                    <tr>
                      <th style="width: 14%;">مدين</th>
                      <th style="width: 14%;">دائن</th>
                      <th style="width: 48%;">البيان (الحساب وشرح الحركة)</th>
                      <th style="width: 12%;">رقم المستند</th>
                      <th style="width: 12%;">ص. الأستاذ</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${lines.map(line => {
                      const isCredit = Number(line.credit) > 0 || (line.account && line.account.startsWith('إلى'));
                      return `
                        <tr>
                          <td class="num font-mono">${Number(line.debit) > 0 ? Number(line.debit).toLocaleString() : '-'}</td>
                          <td class="num font-mono">${Number(line.credit) > 0 ? Number(line.credit).toLocaleString() : '-'}</td>
                          <td class="${isCredit ? 'indented-credit' : 'bold-debit'}">${line.account}</td>
                          <td class="center-cell">${line.docNumber || block.docNumber || '-'}</td>
                          <td class="center-cell">${line.ledgerPage || '-'}</td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
              ${block.explanation ? `
                <div class="theory-journal-explanation">
                  <span class="badge-expl">شرح القيد:</span> ${block.explanation}
                </div>
              ` : ''}
            </div>
          `;
        }

        case 'solved_exercise': {
          return `
            <div class="theory-solved-exercise">
              <div class="theory-exercise-header">
                <span class="theory-exercise-badge">تمرين تطبيقي محلول</span>
                <h4 class="theory-exercise-title">${block.title || 'حالة عملية وتطبيق محاسبي'}</h4>
              </div>
              <div class="theory-exercise-body">
                ${block.problem ? `<p style="font-weight:600; margin-bottom:1rem;">${block.problem}</p>` : ''}
                ${block.solutionText ? `<p style="margin-bottom:1rem;">${block.solutionText}</p>` : ''}
                ${Array.isArray(block.blocks) ? this.renderBlocks(block.blocks) : ''}
              </div>
            </div>
          `;
        }

        default:
          return block.text ? `<p>${block.text}</p>` : '';
      }
    }).join('');
  },

  /**
   * بناء واجهة الاختبار التفاعلي (بنك الأسئلة)
   */
  renderQuizView() {
    const quiz = this.state.currentQuiz;
    if (!quiz || !Array.isArray(quiz.questions) || quiz.questions.length === 0) {
      return `
        <div style="text-align:center; padding:3rem 1rem; color:var(--text-secondary);">
          <div style="font-size:2.5rem; margin-bottom:0.75rem;">✍️</div>
          <h3>اختبار هذا الدرس قيد المراجعة</h3>
          <p>سيتم تفعيل الأسئلة قريباً.</p>
        </div>
      `;
    }

    const mcqs = quiz.questions.filter(q => q.type === 'mcq');
    const tfs = quiz.questions.filter(q => q.type === 'true_false');
    const practical = quiz.questions.find(q => q.type === 'exercise');

    return `
      <div class="theory-quiz-container">
        <!-- بنر الاختبار -->
        <div class="theory-quiz-banner">
          <div class="theory-quiz-info">
            <h3>${quiz.title || 'اختبار تقييم استيعاب الدرس'}</h3>
            <p>يحتوي الاختبار على ${quiz.questions.length} أسئلة شاملة (اختيار من متعدد، صح وخطأ، وتمرين تطبيقي). حد النجاح لاجتياز الدرس: ${quiz.passingScorePercentage || 70}%</p>
          </div>
          ${this.state.quizSubmitted ? `
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <button onclick="DocumentaryCycleView.retakeQuiz()" class="theory-nav-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                إعادة الاختبار
              </button>
            </div>
          ` : ''}
        </div>

        <!-- بنر النتيجة عند التسليم -->
        ${this.state.quizSubmitted ? `
          <div class="theory-results-banner ${this.state.quizPassed ? 'passed' : 'failed'}">
            <div style="font-size:2rem; margin-bottom:0.4rem;">${this.state.quizPassed ? '🎉' : '⚠️'}</div>
            <h2 style="margin:0 0 0.4rem; font-size:1.5rem; font-weight:900;">
              ${this.state.quizPassed ? 'تهانينا! لقد اجتزت اختبار الدرس بنجاح' : 'لم تحقق حد النجاح المطلوب بعد'}
            </h2>
            <p style="margin:0; font-size:1rem; font-weight:700;">
              درجتك في الاختبار: <span style="font-size:1.3rem;">${this.state.quizScore}%</span> 
              (حد النجاح المطلوب: ${quiz.passingScorePercentage || 70}%)
            </p>
            <p style="margin:0.5rem 0 0; font-size:0.88rem; opacity:0.9;">
              ${this.state.quizPassed 
                ? 'تم تسجيل إتمام الدرس بنجاح في سجل تقدمك الأكاديمي على المنصة.' 
                : 'راجع التعليلات المحاسبية الموضحة أدناه لكل سؤال وأعد الاختبار لتحقيق نسبة النجاح.'}
            </p>
          </div>
        ` : ''}

        <!-- 1. أسئلة الاختيار من متعدد -->
        ${mcqs.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              <span style="background:rgba(16,185,129,0.15); color:var(--primary); font-size:0.75rem; font-weight:800; padding:3px 8px; border-radius:6px;">أولاً</span>
              <h4 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">أسئلة الاختيار من متعدد (اختر الإجابة الصحيحة)</h4>
            </div>
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              ${mcqs.map((q, idx) => this.renderQuestionCard(q, idx + 1)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 2. أسئلة الصواب والخطأ -->
        ${tfs.length > 0 ? `
          <div style="margin-bottom: 1.5rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              <span style="background:rgba(59,130,246,0.15); color:#2563EB; font-size:0.75rem; font-weight:800; padding:3px 8px; border-radius:6px;">ثانياً</span>
              <h4 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">أسئلة الصواب والخطأ (حدد صحة أو خطأ كل عبارة)</h4>
            </div>
            <div style="display:flex; flex-direction:column; gap:1.25rem;">
              ${tfs.map((q, idx) => this.renderQuestionCard(q, mcqs.length + idx + 1)).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 3. تمرين عملي تطبيقي -->
        ${practical ? `
          <div style="margin-bottom: 2rem;">
            <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:1rem; padding-bottom:0.5rem; border-bottom:1px solid var(--border-subtle);">
              <span style="background:rgba(245,158,11,0.15); color:#D97706; font-size:0.75rem; font-weight:800; padding:3px 8px; border-radius:6px;">ثالثاً</span>
              <h4 style="margin:0; font-size:1.05rem; font-weight:800; color:var(--text-primary);">${practical.title || 'تمرين عملي تطبيقي'}</h4>
            </div>
            <div class="theory-question-card">
              <div class="theory-q-text" style="line-height:1.7;">${practical.text}</div>
              
              <div class="theory-practical-area">
                <label style="display:block; font-size:0.82rem; font-weight:700; color:var(--text-secondary); margin-bottom:0.4rem;">
                  مساحة الإجابة والمسودة الخاصة بك:
                </label>
                <textarea 
                  class="theory-practical-textarea" 
                  placeholder="اكتب حلك وتحليلك هنا للتدريب..."
                  ${this.state.quizSubmitted ? 'disabled' : ''}
                  oninput="DocumentaryCycleView.state.practicalNotes = this.value"
                >${this.state.practicalNotes || ''}</textarea>
              </div>

              ${this.state.quizSubmitted ? `
                <div class="theory-practical-solution">
                  <div style="display:flex; align-items:center; gap:0.4rem; font-weight:800; color:#065F46; margin-bottom:0.5rem;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    الحل والتعليل المحاسبي النموذجي:
                  </div>
                  <div>${practical.solution || practical.explanation || 'تم تسجيل الإجابة.'}</div>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- زر تسليم الاختبار -->
        ${!this.state.quizSubmitted ? `
          <div style="text-align:center; margin:1.5rem 0 2.5rem;">
            <button onclick="DocumentaryCycleView.submitQuiz()" class="theory-nav-btn primary-action" style="padding:14px 36px; font-size:1rem; border-radius:14px; box-shadow:0 4px 16px rgba(16,185,129,0.3);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              تسليم الإجابات وإنهاء الاختبار
            </button>
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * بطاقة السؤال الفردي (MCQ أو True/False)
   */
  renderQuestionCard(q, displayNum) {
    const isSubmitted = this.state.quizSubmitted;
    const selectedOption = this.state.quizAnswers[q.id];
    const isCorrect = isSubmitted && (selectedOption === q.correctAnswer);
    const isWrong = isSubmitted && selectedOption && (selectedOption !== q.correctAnswer);

    let cardClass = 'theory-question-card';
    if (isSubmitted) {
      cardClass += isCorrect ? ' status-correct' : (isWrong ? ' status-wrong' : '');
    }

    return `
      <div class="${cardClass}" id="q-card-${q.id}">
        <div class="theory-q-header">
          <span class="theory-q-badge">السؤال ${displayNum}</span>
          ${isSubmitted ? `
            <span style="font-size:0.82rem; font-weight:800; color:${isCorrect ? '#10B981' : '#EF4444'}; display:inline-flex; align-items:center; gap:0.25rem;">
              ${isCorrect ? '✓ إجابة صحيحة' : '✗ إجابة غير صحيحة'}
            </span>
          ` : ''}
        </div>

        <div class="theory-q-text">${q.text}</div>

        <div class="theory-options-list">
          ${(q.options || []).map(opt => {
            const isOptSelected = selectedOption === opt.key;
            let optClass = 'theory-option-label';
            if (isOptSelected) optClass += ' selected';

            if (isSubmitted) {
              if (opt.key === q.correctAnswer) {
                optClass += ' correct-revealed';
              } else if (isOptSelected && opt.key !== q.correctAnswer) {
                optClass += ' wrong-revealed';
              }
            }

            return `
              <div class="${optClass}" onclick="DocumentaryCycleView.selectQuizOption('${q.id}', '${opt.key}')">
                <div class="theory-option-key">${opt.key}</div>
                <div class="theory-option-text">${opt.text}</div>
                ${isSubmitted && opt.key === q.correctAnswer ? `
                  <span style="color:#10B981; font-weight:800; font-size:0.9rem;">✓</span>
                ` : ''}
                ${isSubmitted && isOptSelected && opt.key !== q.correctAnswer ? `
                  <span style="color:#EF4444; font-weight:800; font-size:0.9rem;">✗</span>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>

        ${isSubmitted && q.explanation ? `
          <div class="theory-explanation-box">
            <strong>💡 التعليل المحاسبي:</strong> ${q.explanation}
          </div>
        ` : ''}
      </div>
    `;
  },

  /**
   * تحديث بطاقة السؤال بصرياً عند اختيار إجابة دون إعادة رسم الصفحة كاملة
   */
  renderQuizCardSelection(qId) {
    const cardEl = document.getElementById(`q-card-${qId}`);
    if (!cardEl) return;
    const selectedKey = this.state.quizAnswers[qId];
    const labels = cardEl.querySelectorAll('.theory-option-label');
    labels.forEach(label => {
      const keyEl = label.querySelector('.theory-option-key');
      if (keyEl && keyEl.textContent.trim() === selectedKey) {
        label.classList.add('selected');
      } else {
        label.classList.remove('selected');
      }
    });
  },

  /**
   * إعادة رسم منطقة القراءة (محتوى الدرس أو الاختبار)
   */
  updateReaderDOM() {
    const readerEl = document.getElementById('theory-reader-container');
    if (!readerEl) return;

    const lesson = this.state.currentLesson;
    if (!lesson) {
      readerEl.innerHTML = `
        <div style="text-align:center; padding:4rem 1rem;">
          <div class="theory-skeleton" style="height:32px; width:60%; margin:0 auto 1.5rem;"></div>
          <div class="theory-skeleton" style="height:18px; width:80%; margin:0 auto 1rem;"></div>
          <div class="theory-skeleton" style="height:18px; width:70%; margin:0 auto;"></div>
        </div>
      `;
      return;
    }

    const { prev, next } = this.getAdjacentLessons();
    const isCompleted = this.isCompleted(lesson.id);

    readerEl.innerHTML = `
      <div class="theory-reader-card">
        <!-- شريط أدوات القارئ والتبويبات -->
        <div class="theory-reader-toolbar">
          <div class="theory-view-tabs">
            <button 
              onclick="DocumentaryCycleView.switchTab('content')" 
              class="theory-tab-btn ${this.state.activeTab === 'content' ? 'active' : ''}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              <span>محتوى الدرس الشامل</span>
            </button>
            <button 
              onclick="DocumentaryCycleView.switchTab('quiz')" 
              class="theory-tab-btn ${this.state.activeTab === 'quiz' ? 'active' : ''}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>اختبار تقييم الدرس</span>
              <span style="font-size:0.75rem; padding:1px 6px; border-radius:999px; background:rgba(0,0,0,0.1); font-weight:800;">6 أسئلة</span>
            </button>
          </div>

          <div class="theory-reader-controls">
            ${isCompleted ? `
              <div style="display:inline-flex; align-items:center; gap:0.35rem; padding:4px 10px; border-radius:8px; background:rgba(16,185,129,0.1); color:#10B981; font-size:0.8rem; font-weight:800;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                مكتمل
              </div>
            ` : ''}
            <button onclick="DocumentaryCycleView.adjustFontSize(-1)" class="theory-text-size-btn" title="تصغير الخط">A-</button>
            <button onclick="DocumentaryCycleView.adjustFontSize(1)" class="theory-text-size-btn" title="تكبير الخط">A+</button>
          </div>
        </div>

        <!-- ترويسة الدرس -->
        <div class="theory-lesson-hero">
          <div class="theory-lesson-module-tag">${lesson.moduleTitle}</div>
          <h2 class="theory-lesson-headline">${lesson.number}. ${lesson.title}</h2>
          ${lesson.sub ? `<div class="theory-lesson-sub">${lesson.sub}</div>` : ''}
          <div class="theory-meta-bar">
            <span class="theory-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              وقت القراءة التقديري: ${lesson.readTimeMinutes || 15} دقيقة
            </span>
            <span class="theory-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
              ${lesson.blocksCount || 20} قسماً وفقرة
            </span>
          </div>
        </div>

        <!-- العرض الفعلي بناءً على التبويب النشط -->
        ${this.state.activeTab === 'content' ? `
          <div class="theory-content-body" id="theory-content-body" style="font-size: ${this.state.fontSize}px;">
            ${this.renderBlocks(lesson.blocks)}
          </div>
        ` : `
          <div class="theory-quiz-body">
            ${this.renderQuizView()}
          </div>
        `}

        <!-- شريط التنقل السفلي -->
        <div class="theory-bottom-nav">
          <div>
            ${prev ? `
              <button onclick="DocumentaryCycleView.selectLesson('${prev.id}')" class="theory-nav-btn">
                <span>&rarr;</span>
                <span>الدرس السابق (${prev.number})</span>
              </button>
            ` : `
              <button disabled class="theory-nav-btn">
                <span>&rarr;</span>
                <span>البداية</span>
              </button>
            `}
          </div>

          <div>
            ${this.state.activeTab === 'content' ? `
              <button onclick="DocumentaryCycleView.switchTab('quiz')" class="theory-nav-btn primary-action">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>بدء اختبار الدرس (${lesson.number})</span>
              </button>
            ` : `
              <button onclick="DocumentaryCycleView.switchTab('content')" class="theory-nav-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                <span>العودة لشرح الدرس</span>
              </button>
            `}
          </div>

          <div>
            ${next ? `
              <button onclick="DocumentaryCycleView.selectLesson('${next.id}')" class="theory-nav-btn">
                <span>الدرس التالي (${next.number})</span>
                <span>&larr;</span>
              </button>
            ` : `
              <button disabled class="theory-nav-btn">
                <span>نهاية المنهج</span>
                <span>&larr;</span>
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * إعادة رسم قائمة الدروس في الشريط الجانبي بعد البحث أو الفلترة
   */
  updateSidebarLessonsList() {
    const listEl = document.getElementById('theory-sidebar-list');
    if (!listEl || !this.state.indexData) return;

    const normQuery = this.normalizeArabic(this.state.searchQuery);
    const mod = this.state.selectedModule;

    const filtered = this.state.indexData.filter(item => {
      // فلتر الوحدة
      if (mod !== 'all' && item.moduleIndex !== parseInt(mod, 10)) {
        return false;
      }
      // فلتر البحث بالنص العربي المعالج
      if (normQuery) {
        const normTitle = this.normalizeArabic(item.title);
        const normSub = this.normalizeArabic(item.sub);
        const numStr = String(item.number);
        if (!normTitle.includes(normQuery) && !normSub.includes(normQuery) && !numStr.includes(normQuery)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <li style="padding:1.5rem 1rem; text-align:center; color:var(--text-muted); font-size:0.85rem;">
          لا توجد دروس مطابقة لبحثك.
        </li>
      `;
      return;
    }

    listEl.innerHTML = filtered.map(item => {
      const isActive = item.id === this.state.currentLessonId;
      const completed = this.isCompleted(item.id);
      return `
        <li>
          <button 
            onclick="DocumentaryCycleView.selectLesson('${item.id}')" 
            class="theory-nav-item ${isActive ? 'active' : ''}" 
            title="${item.title}">
            <div class="theory-nav-item-left">
              <span class="theory-nav-num">${item.number}</span>
              <span class="theory-nav-title">${item.title}</span>
            </div>
            ${completed ? `
              <span class="theory-nav-completed-badge" title="مكتمل بنجاح">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
            ` : ''}
          </button>
        </li>
      `;
    }).join('');

    this.updateOverallProgressBar();
  },

  /**
   * تمييز العنصر النشط في الشريط الجانبي
   */
  updateSidebarActiveState() {
    const listEl = document.getElementById('theory-sidebar-list');
    if (!listEl) return;
    const items = listEl.querySelectorAll('.theory-nav-item');
    items.forEach(btn => {
      const isTarget = btn.getAttribute('onclick')?.includes(`'${this.state.currentLessonId}'`);
      if (isTarget) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.updateOverallProgressBar();
  },

  /**
   * تحديث شريط التقدم الكلي بالأعلى
   */
  updateOverallProgressBar() {
    const countEl = document.getElementById('theory-completed-count');
    const barEl = document.getElementById('theory-progress-fill');
    if (!this.state.indexData) return;

    const completed = this.getCompletedCount();
    const total = this.state.indexData.length || 38;
    const pct = Math.round((completed / total) * 100);

    if (countEl) countEl.textContent = `${completed} / ${total}`;
    if (barEl) barEl.style.width = `${pct}%`;
  },

  /**
   * العرض الأولي لواجهة قسم الجزء النظري
   * @param {string} requestedScreenId - معرف الشاشة أو الدرس المطلوب
   */
  render(requestedScreenId) {
    // تحديد الدرس المطلوب إذا تم تمريره
    if (requestedScreenId && requestedScreenId.startsWith('doc-cycle-')) {
      this.state.currentLessonId = requestedScreenId.replace('doc-cycle-', '');
    } else if (requestedScreenId && requestedScreenId.startsWith('lesson-')) {
      this.state.currentLessonId = requestedScreenId;
    }

    // فحص معلمات الرابط لدعم ?lesson=lesson-XX
    try {
      const hash = window.location.hash || '';
      const match = hash.match(/lesson=(lesson-\d+)/);
      if (match) {
        this.state.currentLessonId = match[1];
      }
    } catch (e) {}

    // استدعاء التهيئة غير المتزامنة بعد حقن العنصر في الـ DOM
    setTimeout(() => {
      this.initAsync();
    }, 0);

    return `
      <div class="theory-shell" id="theory-main-shell">
        <!-- شريط الرأس للقسم -->
        <header class="theory-header">
          <div class="theory-header-title-wrap">
            <div class="theory-badge-pill">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              <span>منهج متكامل • 38 درساً واختباراً</span>
            </div>
            <h1 class="theory-title">الجزء النظري</h1>
            <p class="theory-subtitle">الدروس النصية والمفاهيم الشاملة للدورة المحاسبية وبنك الاختبارات التفاعلية</p>
          </div>

          <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
            <!-- ويدجت التقدم الكلي -->
            <div class="theory-overall-progress">
              <div style="text-align:right;">
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">إنجاز الدروس</div>
                <div style="font-size:0.88rem; font-weight:900; color:var(--text-primary);" id="theory-completed-count">0 / 38</div>
              </div>
              <div class="theory-progress-bar-bg">
                <div class="theory-progress-bar-fill" id="theory-progress-fill" style="width: 0%;"></div>
              </div>
            </div>

            <!-- زر العودة للوحة الدراسة -->
            <button onclick="navigateToScreen('student-dashboard')" class="btn-cta-secondary" style="padding:8px 16px; font-size:0.85rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.4rem;">
              <span>لوحة دراستي</span>
              <span style="font-size:0.8rem;">&larr;</span>
            </button>
          </div>
        </header>

        <!-- التخطيط الرئيسي: الفهرس الجانبي + منطقة القراءة والاختبار -->
        <div class="theory-layout">
          <!-- 1. الفهرس الجانبي -->
          <aside class="theory-sidebar">
            <!-- شريط البحث الفوري المعرب -->
            <div class="theory-search-box">
              <input 
                type="text" 
                class="theory-search-input" 
                id="theory-search-input"
                placeholder="ابحث في عناوين ومفاهيم الدروس..."
                oninput="DocumentaryCycleView.handleSearchInput(this.value)"
              >
              <span class="theory-search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </span>
            </div>

            <!-- أزرار تصفية الوحدات الـ 6 -->
            <div class="theory-module-pills" id="theory-module-pills">
              <button onclick="DocumentaryCycleView.setModuleFilter('all')" class="theory-pill-btn active" id="mod-btn-all">الكل (38)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(1)" class="theory-pill-btn" id="mod-btn-1">الوحدة 1 (9)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(2)" class="theory-pill-btn" id="mod-btn-2">الوحدة 2 (5)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(3)" class="theory-pill-btn" id="mod-btn-3">الوحدة 3 (7)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(4)" class="theory-pill-btn" id="mod-btn-4">الوحدة 4 (4)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(5)" class="theory-pill-btn" id="mod-btn-5">الوحدة 5 (7)</button>
              <button onclick="DocumentaryCycleView.setModuleFilter(6)" class="theory-pill-btn" id="mod-btn-6">الوحدة 6 (6)</button>
            </div>

            <!-- قائمة الدروس -->
            <ul class="theory-nav-list" id="theory-sidebar-list">
              <li style="padding:1rem; text-align:center;">
                <div class="theory-skeleton" style="height:20px; width:80%; margin:0 auto 0.5rem;"></div>
                <div class="theory-skeleton" style="height:20px; width:60%; margin:0 auto;"></div>
              </li>
            </ul>
          </aside>

          <!-- 2. منطقة القارئ والاختبار -->
          <main id="theory-reader-container">
            <div class="theory-reader-card">
              <div style="text-align:center; padding:5rem 1rem;">
                <div class="theory-skeleton" style="height:32px; width:50%; margin:0 auto 1.5rem;"></div>
                <div class="theory-skeleton" style="height:18px; width:70%; margin:0 auto 1rem;"></div>
                <div class="theory-skeleton" style="height:18px; width:60%; margin:0 auto;"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;
  },

  /**
   * التهيئة غير المتزامنة لتحميل الفهرس والدرس الحالي
   */
  async initAsync() {
    await this.fetchIndex();
    this.updateSidebarLessonsList();

    const targetLessonId = this.state.currentLessonId || 'lesson-01';
    await Promise.all([
      this.loadLesson(targetLessonId),
      this.loadQuiz(targetLessonId)
    ]);

    this.updateReaderDOM();
    this.updateSidebarActiveState();
  }
};

// إتاحة الكائن في النطاق العام للمتصفح
if (typeof window !== 'undefined') {
  window.DocumentaryCycleView = DocumentaryCycleView;
}
