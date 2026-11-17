/**
 * documentary-cycle-view.js — قسم الجزء النظري (Theory Section)
 * مخصص لاستيعاب وعرض الدروس والمفاهيم النظرية للدورة المحاسبية.
 * لا يحتوي على أي محتوى افتراضي أو مؤلف — الهيكل مجهز لاستقبال الدروس عند تقديمها.
 */

// مصفوفة الدروس — فارغة تماماً وفقاً لطلب المستخدم (لا محتوى مؤلف)
const DOCUMENTARY_CYCLE_LESSONS = [];

const DocumentaryCycleView = {
  /**
   * جلب قائمة الدروس الحالية
   */
  getLessons() {
    return DOCUMENTARY_CYCLE_LESSONS;
  },

  /**
   * عرض واجهة قسم الجزء النظري
   * @param {string} lessonId - معرف الدرس المحدد (اختياري)
   */
  render(lessonId) {
    const lessons = this.getLessons();
    const hasLessons = lessons && lessons.length > 0;

    return `
      <div class="learning-container documentary-cycle-shell" style="max-width: 1040px; margin: 0 auto; padding: var(--space-6) var(--container-padding-desktop, 1.5rem);">
        <!-- شريط الرأس للقسم -->
        <div class="doc-cycle-header" style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom: 2rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-subtle);">
          <div>
            <div style="display:inline-flex; align-items:center; gap:0.5rem; padding:4px 12px; border-radius:999px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); color:var(--primary); font-size:0.78rem; font-weight:700; margin-bottom:0.5rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>قسم تعليمي متخصص</span>
            </div>
            <h1 style="margin:0; font-size:1.75rem; font-weight:900; color:var(--text-primary); letter-spacing:-0.02em;">الجزء النظري</h1>
            <p style="margin:0.35rem 0 0; font-size:0.92rem; color:var(--text-secondary);">الدروس النصية والمفاهيم الشاملة للدورة المحاسبية</p>
          </div>

          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button onclick="navigateToScreen('student-dashboard')" class="btn-cta-secondary" style="padding:8px 16px; font-size:0.85rem; border-radius:10px; display:inline-flex; align-items:center; gap:0.4rem;">
              <span>لوحة دراستي</span>
              <span style="font-size:0.8rem;">&larr;</span>
            </button>
          </div>
        </div>

        <!-- حالة القسم: عدم وجود دروس مضافة بعد (Empty State) -->
        ${!hasLessons ? `
          <div class="doc-cycle-empty-state" style="background:var(--surface-card); border:1.5px dashed var(--border-strong); border-radius:16px; padding:3.5rem 2rem; text-align:center; max-width:680px; margin:2rem auto; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
            <div style="width:72px; height:72px; margin:0 auto 1.25rem; border-radius:20px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); display:flex; align-items:center; justify-content:center; color:var(--primary);">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
            </div>

            <h3 style="margin:0 0 0.5rem; font-size:1.25rem; font-weight:800; color:var(--text-primary);">تم تجهيز قسم "الجزء النظري" بنجاح</h3>
            <p style="margin:0 0 1.5rem; font-size:0.92rem; color:var(--text-secondary); line-height:1.7;">
              هذا القسم مهيأ برمجياً وهيكلياً لاستقبال الدروس والمفاهيم النظرية للدورة المحاسبية.<br>
              لم تتم إضافة أي محتوى نصي، ونحن بانتظار تزويدنا بالدروس لإدراجها كما هي.
            </p>

            <div style="display:inline-flex; align-items:center; gap:0.6rem; padding:8px 16px; border-radius:10px; background:var(--surface-hover); border:1px solid var(--border-subtle); font-size:0.85rem; color:var(--text-muted);">
              <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10B981;"></span>
              <span>الهيكل البرمجي جاهز لاستقبال بيانات الدروس</span>
            </div>
          </div>
        ` : `
          <!-- عرض الدروس في حال تم تزويدها لاحقاً -->
          <div class="doc-cycle-content-layout" style="display:grid; grid-template-columns: 280px 1fr; gap:1.5rem;">
            <aside class="doc-cycle-lessons-list" style="background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:14px; padding:1rem;">
              <h4 style="margin:0 0 0.75rem; font-size:0.85rem; color:var(--text-muted); text-transform:uppercase;">فهرس الدروس</h4>
              <nav style="display:flex; flex-direction:column; gap:0.4rem;">
                ${lessons.map((l, idx) => `
                  <button onclick="navigateToScreen('${l.id}')" class="doc-lesson-item ${l.id === lessonId ? 'active' : ''}" style="display:flex; align-items:center; gap:0.6rem; padding:0.65rem 0.85rem; border-radius:8px; border:none; background:${l.id === lessonId ? 'var(--primary-subtle, rgba(16,185,129,0.1))' : 'transparent'}; color:${l.id === lessonId ? 'var(--primary)' : 'var(--text-primary)'}; font-size:0.88rem; text-align:right; cursor:pointer;">
                    <span style="font-weight:700; font-size:0.8rem; color:var(--text-muted);">${idx + 1}.</span>
                    <span>${l.title}</span>
                  </button>
                `).join('')}
              </nav>
            </aside>
            <main class="doc-cycle-lesson-body" style="background:var(--surface-card); border:1px solid var(--border-subtle); border-radius:14px; padding:2rem;">
              ${this.renderActiveLesson(lessonId || lessons[0]?.id)}
            </main>
          </div>
        `}
      </div>
    `;
  },

  /**
   * عرض درس نشط محدد عند توفر المحتوى
   * @param {string} id 
   */
  renderActiveLesson(id) {
    const lessons = this.getLessons();
    const lesson = lessons.find(l => l.id === id) || lessons[0];
    if (!lesson) return '<p>لم يتم العثور على الدرس المطلوب.</p>';

    return `
      <article class="doc-lesson-article">
        <h2 style="margin:0 0 1rem; font-size:1.5rem; color:var(--text-primary);">${lesson.title}</h2>
        <div class="doc-lesson-text" style="color:var(--text-secondary); line-height:1.8; font-size:0.95rem;">
          ${lesson.content}
        </div>
      </article>
    `;
  }
};

if (typeof window !== 'undefined') {
  window.DocumentaryCycleView = DocumentaryCycleView;
  window.DOCUMENTARY_CYCLE_LESSONS = DOCUMENTARY_CYCLE_LESSONS;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DocumentaryCycleView, DOCUMENTARY_CYCLE_LESSONS };
}
