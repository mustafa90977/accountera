/**
 * learning-view.js — واجهات المسار التعليمي التأسيسي (الدروس 1 إلى 6)
 * تصميم متجاوب 100% مع الهواتف المحمولة وتجربة لمسية سلسة
 */

const LESSONS_DATA = [
  {
    id: "lesson-1",
    num: 1,
    title: "ما هي المعاملة المالية؟",
    objective: "التمييز بين الأحداث المالية القابلة للقياس النقدي والأحداث الإدارية الأخرى.",
    content: `
      <p>في عالم الأعمال، تحدث يومياً مئات الأحداث، لكن المحاسب لا يسجل كل شيء في الدفاتر، بل يسجل فقط <strong>المعاملات المالية (Financial Transactions)</strong>.</p>
      
      <div class="highlight-box">
        <strong>شروط اعتبار الحدث معاملة مالية:</strong>
        <ul style="margin: 8px 0 0 16px; padding: 0; line-height: 1.7;">
          <li>أن تكون قابلة للقياس بوحدة النقد (ريال، جنيه، دولار...).</li>
          <li>أن تؤثر بالزيادة أو النقصان على المركز المالي للمنشأة.</li>
          <li>أن تكون مدعومة بمستند رسمي مؤيد (فاتورة، إيصال قبض، شيك، إشعار بنكي).</li>
        </ul>
      </div>

      <div class="rule-comparison-grid">
        <div class="rule-card debit">
          <h4><span>معاملة مالية (تُسجل)</span></h4>
          <p class="text-sm">شراء أجهزة كمبيوتر للمكتب بمبلغ 15,000 نقداً بفاتورة ضريبية، أو سداد رواتب الموظفين.</p>
        </div>
        <div class="rule-card credit">
          <h4><span>حدث إداري (لا يُسجل)</span></h4>
          <p class="text-sm">توقيع عقد عمل مع موظف جديد، أو تفاوض مبدئي مع مورد دون حركة أموال أو بضاعة.</p>
        </div>
      </div>
    `,
    quiz: {
      question: "أي من الحالات التالية يعتبر معاملة مالية يجب على المحاسب إثباتها فوراً في الدفاتر؟",
      options: [
        { text: "طلب عروض أسعار من 3 شركات توريد", correct: false, reason: "طلب السعر مجرد استفسار إداري لا يترتب عليه أي التزام مالي." },
        { text: "سداد فاتورة الكهرباء للمقر نقداً بمبلغ 800", correct: true, reason: "أحسنت! هذا تدفق نقدي حقيقي أثر على أصول ومصروفات الشركة ومؤيد بإيصال سداد." },
        { text: "إجراء مقابلة توظيف لمرشح لوظيفة محاسب", correct: false, reason: "المقابلة إجراء إداري ولا يوجد أثر مالي مقاس حتى الآن." }
      ]
    }
  },
  {
    id: "lesson-2",
    num: 2,
    title: "معادلة الميزانية وأثر العمليات",
    objective: "فهم توازن معادلة المركز المالي (الأصول = الالتزامات + حقوق الملكية) وكيف تظل متزنة دائماً.",
    content: `
      <p>تقوم المحاسبة المالية بأكملها على معادلة رياضية جوهرية ثابتة لا تختل أبداً:</p>
      
      <div style="background:var(--primary-light); border:1px solid var(--primary-border); border-radius:var(--radius-lg); padding:1.25rem; text-align:center; margin:1rem 0;">
        <div style="font-size:1.3rem; font-weight:800; color:var(--primary-hover);">
          الأصول = الالتزامات + حقوق الملكية
        </div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-top:4px;">
          [ما تملكه المنشأة] = [ديون مستحقة للغير] + [أموال الملاك والأرباح]
        </div>
      </div>

      <div class="highlight-box">
        <strong>كيف تحافظ أي معاملة على التوازن؟</strong>
        <p class="text-sm" style="margin-top:6px;">
          إذا زاد جانب، لابد أن يزيد الجانب الآخر بنفس القيمة، أو أن تزيد قيمة بند في جانب وينقص بند آخر في نفس الجانب ليظل الإجمالي متعادلاً 100%.
        </p>
      </div>
    `,
    quiz: {
      question: "إذا قامت الشركة بشراء بضاعة للمستودع نقداً بمبلغ 10,000، كيف تتأثر معادلة الميزانية؟",
      options: [
        { text: "تزيد الأصول وتزيد الالتزامات بنفس القيمة", correct: false, reason: "الشراء تم نقداً ولم ينتج عنه التزام أو دين للغير." },
        { text: "يزيد أصل (المخزون) وينقص أصل آخر (النقدية) دون تغير إجمالي الأصول", correct: true, reason: "إجابة صحيحة! حدث تبادل بين أصلين في نفس الجانب فظلت المعادلة متزنة تماماً." },
        { text: "تنقص حقوق الملكية ويزيد رأس المال", correct: false, reason: "هذه العملية مجرد تبادل موارد تشغيلية وليست خسارة أو توزيعات أرباح." }
      ]
    }
  },
  {
    id: "lesson-3",
    num: 3,
    title: "أنواع الحسابات الأساسية الخمسة",
    objective: "معرفة التصنيفات الخمسة الرئيسية التي تشكل شجرة الحسابات (Chart of Accounts).",
    content: `
      <p>كل حساب في العالم المالي يندرج حصراً تحت واحدة من 5 مجموعات كبرى:</p>
      
      <div class="rule-comparison-grid">
        <div class="rule-card">
          <h4><span>١. الأصول (Assets)</span> <span style="font-size:0.8rem; color:var(--primary);">مدين</span></h4>
          <p class="text-sm">الموارد والممتلكات الاقتصادية (النقدية، البنك، العملاء، المخزون، المعدات، المباني).</p>
        </div>
        <div class="rule-card">
          <h4><span>٢. الالتزامات (Liabilities)</span> <span style="font-size:0.8rem; color:var(--danger);">دائن</span></h4>
          <p class="text-sm">الديون المستحقة للغير كالموردين، القروض البنكية، وأوراق الدفع.</p>
        </div>
        <div class="rule-card">
          <h4><span>٣. حقوق الملكية (Equity)</span> <span style="font-size:0.8rem; color:var(--danger);">دائن</span></h4>
          <p class="text-sm">رأس مال الملاك، الأرباح المبقاة والمحتجزة، والاحتياطيات النظامية.</p>
        </div>
        <div class="rule-card">
          <h4><span>٤. الإيرادات (Revenues)</span> <span style="font-size:0.8rem; color:var(--danger);">دائن</span></h4>
          <p class="text-sm">التدفقات الناتجة عن مبيعات السلع وتقديم الخدمات للعملاء.</p>
        </div>
      </div>
      <div class="rule-card" style="margin-top:0.75rem;">
        <h4><span>٥. المصروفات (Expenses)</span> <span style="font-size:0.8rem; color:var(--primary);">مدين</span></h4>
        <p class="text-sm">تكاليف التشغيل لتوليد الإيرادات (الإيجار، الرواتب، الدعاية، المرافق والكهرباء).</p>
      </div>
    `,
    quiz: {
      question: "حساب 'الموردون' (الذين نشتري منهم بالآجل) يتبع لأي من المجموعات الخمسة؟",
      options: [
        { text: "الأصول", correct: false, reason: "الأصول هي ما نملكه نحن، بينما الموردون يطالبوننا بأموال." },
        { text: "الالتزامات (الخصوم)", correct: true, reason: "صحيح! الموردون يمثلون ديناً واجباً على المنشأة سداده لاحقاً." },
        { text: "المصروفات", correct: false, reason: "المصروف هو التكلفة المنفقة، أما رصيد حساب المورد فهو التزام دين." }
      ]
    }
  },
  {
    id: "lesson-4",
    num: 4,
    title: "قواعد المدين والدائن ونظرية القيد المزدوج",
    objective: "إتقان القاعدة المحاسبية الذهبية للزيادة والنقصان في أي حساب.",
    content: `
      <p>يقوم نظام القيد المزدوج على مبدأ حتمي: <strong>لكل عملية طرفان متساويان بالقيمة، أحدهما مدين (Debit) والآخر دائن (Credit).</strong></p>

      <div class="highlight-box">
        <strong>القاعدة الذهبية للمدين والدائن:</strong>
        <p class="text-sm" style="margin-top:6px;">
          الحساب إذا زاد يُسجل في <strong>نفس طبيعته الأصلية</strong>، وإذا نقص يُسجل في <strong>عكس طبيعته الأصلية</strong>.
        </p>
      </div>

      <div class="rule-comparison-grid">
        <div class="rule-card debit">
          <h4><span>طبيعتها الأصلية مدينة (مدين)</span></h4>
          <p class="text-sm"><strong>الأصول + المصروفات:</strong><br>عند الزيادة $\\rightarrow$ <strong style="color:var(--primary);">مدين</strong><br>عند النقصان $\\rightarrow$ <strong style="color:var(--danger);">دائن</strong></p>
        </div>
        <div class="rule-card credit">
          <h4><span>طبيعتها الأصلية دائنة (دائن)</span></h4>
          <p class="text-sm"><strong>الالتزامات + حقوق الملكية + الإيرادات:</strong><br>عند الزيادة $\\rightarrow$ <strong style="color:var(--danger);">دائن</strong><br>عند النقصان $\\rightarrow$ <strong style="color:var(--primary);">مدين</strong></p>
        </div>
      </div>
    `,
    quiz: {
      question: "عند سداد الشركة لمصروف إيجار المقر نقداً، كيف يكون قيد اليومية؟",
      options: [
        { text: "من حـ/ النقدية إلى حـ/ مصروف الإيجار", correct: false, reason: "النقدية نقصت وهي أصل، والنقص في الأصل يكون دائناً وليس مديناً." },
        { text: "من حـ/ مصروف الإيجار إلى حـ/ النقدية", correct: true, reason: "ممتاز! المصروف زاد في الطرف المدين، والنقدية نقصت في الطرف الدائن." },
        { text: "من حـ/ الموردين إلى حـ/ البنك", correct: false, reason: "هذا قيد سداد دين لمورد وليس سداد مصروف إيجار." }
      ]
    }
  },
  {
    id: "lesson-5",
    num: 5,
    title: "إطار تحليل المعاملة ذو الـ 6 خطوات",
    objective: "اتباع منهجية تفكير منظمة لتحويل أي فاتورة أو مستند إلى قيد محاسبي سليم.",
    content: `
      <p>قبل أن تكتب القيد المحاسبي، اسأل نفسك الأسئلة الستة بالترتيب:</p>
      
      <div style="display:flex; flex-direction:column; gap:8px; margin:16px 0;">
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>١. فحص المستند:</strong> ما هي العملية وما تاريخها والمبلغ المثبت؟
        </div>
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>٢. تحديد الحسابات:</strong> ما هما الحسابان (أو أكثر) المتأثران بالعملية؟
        </div>
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>٣. تصنيف الحسابات:</strong> هل كل حساب هو (أصل، التزام، ملكية، إيراد، مصروف)؟
        </div>
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>٤. تحديد الأثر:</strong> هل زادت قيمة الحساب أم نقصت؟
        </div>
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>٥. تطبيق القاعدة:</strong> أي حساب يذهب للطرف المدين وأيها للطرف الدائن؟
        </div>
        <div style="background:var(--bg-secondary); padding:10px 14px; border-radius:8px; border-right:3px solid var(--primary); font-size:0.9rem;">
          <strong>٦. التحقق من التوازن:</strong> هل إجمالي المدين يساوي إجمالي الدائن تماماً؟
        </div>
      </div>
    `,
    quiz: {
      question: "ما هي الخطوة الأولى الإلزامية التي يمارسها المحاسب قبل تسجيل القيد؟",
      options: [
        { text: "كتابة القيد في دفتر اليومية مباشرة من الذاكرة", correct: false, reason: "المحاسبة مبنية على التوثيق ولا يجوز القيد دون فحص مستند رسمي." },
        { text: "التحقق من صحة المستند المؤيد وتاريخه ومبلغه", correct: true, reason: "بالضبط! المستند المؤيد (Invoice/Receipt) هو الحجة القانونية والمالية للقيد." },
        { text: "إقفال ميزان المراجعة", correct: false, reason: "ميزان المراجعة يُعد في نهاية الفترة المالية وليس قبل تسجيل المعاملة." }
      ]
    }
  },
  {
    id: "lesson-6",
    num: 6,
    title: "الدورة المحاسبية والقوائم المالية الختامية",
    objective: "رؤية الصورة الشاملة من تسجيل العمليات اليومية حتى إعداد القوائم الختامية.",
    content: `
      <p>الدورة المحاسبية (Accounting Cycle) هي المسار المتسلسل للبيانات المالية طوال الفترة المحاسبية:</p>
      
      <div style="display:grid; grid-template-columns:1fr; gap:10px; margin:16px 0;">
        <div class="rule-card">
          <h4>١. دفتر اليومية (General Journal)</h4>
          <p class="text-sm">تسجيل القيود المحاسبية تسلسلياً حسب تاريخ حدوث كل عملية.</p>
        </div>
        <div class="rule-card">
          <h4>٢. دفتر الأستاذ وحسابات T (General Ledger)</h4>
          <p class="text-sm">ترحيل كل حركة إلى حسابها المخصص لمعرفة رصيد كل حساب على حدة.</p>
        </div>
        <div class="rule-card">
          <h4>٣. ميزان المراجعة (Trial Balance)</h4>
          <p class="text-sm">تجميع كل أرصدة الحسابات والتأكد الحاسم من تعادل مجموع المدين والدائن.</p>
        </div>
        <div class="rule-card">
          <h4>٤. القوائم المالية الختامية (Financial Statements)</h4>
          <p class="text-sm"><strong>قائمة الدخل:</strong> لمعرفة صافي الربح أو الخسارة.<br><strong>قائمة المركز المالي:</strong> لمعرفة أصول والتزامات وحقوق ملكية المنشأة في لحظة زمنية معينة.</p>
        </div>
      </div>
    `,
    quiz: {
      question: "ما هي القائمة المالية التي تقيس نتيجة نشاط الشركة من ربح أو خسارة خلال فترة زمنية؟",
      options: [
        { text: "قائمة المركز المالي (الميزانية العمومية)", correct: false, reason: "المركز المالي يوضح ممتلكات والتزامات الشركة في تاريخ محدد وليس نتيجة الربح التشغيلي." },
        { text: "قائمة الدخل (Income Statement)", correct: true, reason: "أحسنت! قائمة الدخل تقارن الإيرادات بالمصروفات لإظهار صافي الربح أو الخسارة." },
        { text: "مذكرة تسوية البنك", correct: false, reason: "مذكرة التسوية أداة مطابقة ورقابة للرصيد النقدي وليست قائمة ختامية." }
      ]
    }
  }
];

const ExcelLearningView = {
  renderLesson(lessonId) {
    const currentLesson = LESSONS_DATA.find(l => l.id === lessonId) || LESSONS_DATA[0];
    const currentIndex = LESSONS_DATA.findIndex(l => l.id === currentLesson.id);
    const prevLesson = currentIndex > 0 ? LESSONS_DATA[currentIndex - 1] : null;
    const nextLesson = currentIndex < LESSONS_DATA.length - 1 ? LESSONS_DATA[currentIndex + 1] : null;

    return `
      <div class="learning-container">
        <!-- شريط التبويبات المتجاوب -->
        <div class="lessons-nav-strip">
          ${LESSONS_DATA.map(l => {
            const isDone = (typeof ProgressService !== 'undefined') && ProgressService.isLessonCompleted(l.id);
            return `
              <button class="lesson-nav-pill ${l.id === currentLesson.id ? 'active' : ''}" onclick="navigateToScreen('${l.id}')">
                <span>الدرس ${l.num} ${isDone ? '✓' : ''}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- بطاقة الدرس الرئيسية -->
        <article class="lesson-card">
          <header class="lesson-header">
            <div class="lesson-step-badge" style="display:flex; align-items:center; gap:8px;">
              <span>الدرس ${currentLesson.num} من ${LESSONS_DATA.length}</span>
              ${(typeof ProgressService !== 'undefined' && ProgressService.isLessonCompleted(currentLesson.id)) ? `
                <span style="background:var(--success-bg); color:var(--success); border:1px solid var(--success-border); padding:2px 8px; border-radius:999px; font-size:0.75rem; font-weight:800;">مكتمل بنجاح ✓</span>
              ` : ''}
            </div>
            <h1 class="lesson-title">${currentLesson.title}</h1>
            <div class="lesson-objective">
              <span style="display:inline-flex; align-items:center; color:var(--primary); flex-shrink:0;">
                ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('target', { size: 18 }) : ''}
              </span>
              <div><strong>الهدف التعليمي:</strong> ${currentLesson.objective}</div>
            </div>
          </header>

          <!-- المحتوى النصي والتفاعلي -->
          <div class="lesson-body">
            ${currentLesson.content}
          </div>

          <!-- اختبار الفهم السريع -->
          <div class="quiz-card" id="quiz-${currentLesson.id}">
            <span class="quiz-badge">اختبار فهم سريع</span>
            <div class="quiz-question">${currentLesson.quiz.question}</div>
            <div class="quiz-options">
              ${currentLesson.quiz.options.map((opt, idx) => `
                <button class="quiz-option-btn" onclick="ExcelLearningView.handleQuizAnswer('${currentLesson.id}', ${idx})">
                  <span>${opt.text}</span>
                  <span id="quiz-icon-${currentLesson.id}-${idx}"></span>
                </button>
              `).join('')}
            </div>
            <div class="quiz-feedback" id="quiz-feedback-${currentLesson.id}"></div>
          </div>

          <!-- أزرار التنقل السفلية -->
          <footer class="lesson-footer-nav">
            ${prevLesson ? `
              <button class="btn-cta-secondary" onclick="navigateToScreen('${prevLesson.id}')">
                السابق: ${prevLesson.title}
              </button>
            ` : `
              <button class="btn-cta-secondary" onclick="navigateToScreen('landing')">
                العودة للرئيسية
              </button>
            `}

            ${nextLesson ? `
              <button class="btn-cta-primary" onclick="navigateToScreen('${nextLesson.id}')">
                التالي: ${nextLesson.title}
              </button>
            ` : `
              <button class="btn-cta-primary" onclick="navigateToScreen('ex-1')">
                <span style="display:inline-flex; align-items:center; gap:8px;">
                  الانتقال للأمثلة العملية المحلولة
                  ${typeof AccounteraIcons !== 'undefined' ? AccounteraIcons.render('sparkle', { size: 16 }) : ''}
                </span>
              </button>
            `}
          </footer>
        </article>
      </div>
    `;
  },

  handleQuizAnswer(lessonId, optionIndex) {
    const lesson = LESSONS_DATA.find(l => l.id === lessonId);
    if (!lesson) return;
    const selected = lesson.quiz.options[optionIndex];
    const feedbackBox = document.getElementById(`quiz-feedback-${lessonId}`);
    if (!feedbackBox) return;

    // Reset buttons
    const quizCard = document.getElementById(`quiz-${lessonId}`);
    if (quizCard) {
      const btns = quizCard.querySelectorAll('.quiz-option-btn');
      btns.forEach((btn, idx) => {
        btn.classList.remove('correct', 'wrong');
        const icon = document.getElementById(`quiz-icon-${lessonId}-${idx}`);
        if (icon) icon.textContent = '';
      });

      const chosenBtn = btns[optionIndex];
      const chosenIcon = document.getElementById(`quiz-icon-${lessonId}-${optionIndex}`);
      if (selected.correct) {
        chosenBtn.classList.add('correct');
        if (chosenIcon) chosenIcon.textContent = '✓';
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = 'var(--success-bg)';
        feedbackBox.style.color = '#065F46';
        feedbackBox.style.border = '1px solid var(--success-border)';
        feedbackBox.innerHTML = `<strong>إجابة صحيحة:</strong> ${selected.reason}`;

        // حفظ إتمام الدرس والمحاولة في قاعدة البيانات السحابية
        if (typeof ProgressService !== 'undefined') {
          ProgressService.completeLesson(lessonId);
        }
        if (typeof PracticeService !== 'undefined') {
          PracticeService.recordAttempt({
            exerciseId: lessonId,
            exerciseType: 'lesson_quiz',
            score: 100,
            isCorrect: true,
            answerData: { optionIndex, text: selected.text }
          });
        }
      } else {
        chosenBtn.classList.add('wrong');
        if (chosenIcon) chosenIcon.textContent = '✕';
        feedbackBox.style.display = 'block';
        feedbackBox.style.background = 'var(--danger-bg)';
        feedbackBox.style.color = '#991B1B';
        feedbackBox.style.border = '1px solid var(--danger-border)';
        feedbackBox.innerHTML = `<strong>حاول مرة أخرى:</strong> ${selected.reason}`;

        if (typeof PracticeService !== 'undefined') {
          PracticeService.recordAttempt({
            exerciseId: lessonId,
            exerciseType: 'lesson_quiz',
            score: 0,
            isCorrect: false,
            answerData: { optionIndex, text: selected.text }
          });
        }
      }
    }
  }
};

if (typeof window !== 'undefined') {
  window.ExcelLearningView = ExcelLearningView;
  window.LESSONS_DATA = LESSONS_DATA;
}
