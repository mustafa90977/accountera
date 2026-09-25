# خطة تنفيذ باك إند الـ MVP الفعلي لمنصة Accountera
## Accountera Working MVP Backend Implementation Plan

> **الهدف:** تحويل منصة Accountera إلى منتج عامل حقيقي (Working MVP) ببيانات دائمة ومستمرة على سحابة Supabase، تدعم دورة حياة الطالب الكاملة دون تعقيد هندسي غير ضروري.

---

## 1. المعمارية الحالية ونطاق التعديل (Current Architecture & Scope)

* **الوضع الحالي:**
  - واجهة مستخدم مبنية بـ Vanilla JS SPA.
  - تطبيق محاكاة فرعي في `simulation/simulation/`.
  - مصادقة Supabase Auth حقيقية تم تأسيسها في Phase 0.1 (`src/core/auth.js`).
  - النواة المحاسبية (`accountera-accounting-core.js` والملفات المرتبطة بها) محمية بنسبة 100% ولن يمسها أي تعديل.
* **الهدف في الـ MVP:**
  - ربط تقدم الدروس (`lesson_progress`).
  - حفظ محاولات التمارين والأسئلة (`practice_attempts`).
  - حفظ واستعادة تقدم المحاكاة والقيود (`simulation_progress`).
  - ربط لوحة تحكم الطالب بالبيانات السحابية الحقيقية مع دعم استمراريتها عبر التحديث وتغيير الجهاز.
  - الحفاظ على كاش LocalStorage للمعاينة السريعة دون اعتباره سلطة المصادقة.

---

## 2. جداول قاعدة البيانات الجديدة (Database Tables)

### أ) `public.lesson_progress`
لتسجيل الدروس التأسيسية المكتملة لكل طالب:
* `id` (UUID, PK)
* `user_id` (UUID, FK -> `auth.users(id)`)
* `lesson_id` (TEXT, e.g. 'lesson-1')
* `completed` (BOOLEAN, default true)
* `completed_at` (TIMESTAMPTZ)
* `created_at` / `updated_at` (TIMESTAMPTZ)
* `UNIQUE (user_id, lesson_id)`

### ب) `public.practice_attempts`
لتسجيل محاولات حل التمارين المستقلة والأمثلة:
* `id` (UUID, PK)
* `user_id` (UUID, FK -> `auth.users(id)`)
* `exercise_id` (TEXT, e.g. 'ip-1')
* `exercise_type` (TEXT, default 'independent_practice')
* `score` (INTEGER, 0 to 100)
* `is_correct` (BOOLEAN)
* `answer_data` (JSONB, e.g. `{ debit: 'cash', credit: 'sales_rev' }`)
* `created_at` (TIMESTAMPTZ)

### ج) `public.simulation_progress`
لتسجيل حالة ودفاتر المحاكاة لكل طالب في كل شركة:
* `id` (UUID, PK)
* `user_id` (UUID, FK -> `auth.users(id)`)
* `company_id` (TEXT, e.g. 'company-nile')
* `current_operation` (TEXT)
* `completed_operations` (INTEGER, default 0)
* `score` (NUMERIC(5,2), default 0)
* `status` (TEXT, default 'in_progress')
* `state_data` (JSONB, `{ student_journal: [...], student_ledger: {...} }`)
* `created_at` / `updated_at` (TIMESTAMPTZ)
* `UNIQUE (user_id, company_id)`

---

## 3. ملفات الترحيل (Migrations)

سيتم إنشاء ملف ترحيل SQL قياسي:  
`supabase/migrations/20260921_phase0_2_mvp_persistence.sql`  
ويتضمن:
1. إنشاء الجداول الثلاثة.
2. تفعيل RLS على كل جدول.
3. تطبيق سياسات العزل بحيث لا يمكن لأي طالب الوصول لبيانات طالب آخر (`auth.uid() = user_id`).
4. منح الصلاحيات الصريحة لدور `authenticated`.

---

## 4. طبقة الخدمات والبيانات (Data Services Layer)

سننشئ ملف خدمات خفيف ونظيف:  
`src/core/services/learning-service.js`  
يحتوي على:
* **`ProgressService`:**
  - `fetchUserProgress()`: جلب الدروس المكتملة وتخزينها محلياً في الذاكرة.
  - `completeLesson(lessonId)`: حفظ إتمام الدرس في `lesson_progress` مع fallback للكاش المحلي.
  - `isLessonCompleted(lessonId)`: فحص سريع للإتمام.
* **`PracticeService`:**
  - `recordAttempt({ exerciseId, exerciseType, score, isCorrect, answerData })`: تسجيل المحاولة في `practice_attempts`.
  - `fetchUserAttempts()`: جلب سجل المحاولات والدرجات.
* **`SimulationService`:**
  - `saveSimulationProgress(companyId, journal, ledger, meta)`: حفظ حالة المحاكي في `simulation_progress`.
  - `loadSimulationProgress(companyId)`: استعادة حالة المحاكي للسحابة والكاش.
* **`MigrationService`:**
  - `migrateLegacyLocalStorage()`: بعد تسجيل الدخول، فحص إن كان لدى الطالب إنجاز سابق في `student_journal` ومزامنته مع السحابة بسلاسة دون مسح أي بيانات.

---

## 5. نقاط الربط مع الواجهة الحالية (Frontend Integration Points)

1. **`src/ui/learning-view.js`:**
   - عند حل الكويز بنجاح في `handleQuizAnswer`: استدعاء `ProgressService.completeLesson(lessonId)`.
   - في `renderLesson`: إظهار شارة إنجاز خضراء "مكتمل ✓" إذا كان الدرس مسجلاً بالسحابة.
2. **`src/ui/practice-view.js`:**
   - في دالة `evaluate(ipId)`: استدعاء `PracticeService.recordAttempt(...)` بعد التحقق من القيد.
3. **`src/core/simulation-bridge.js` & `src/ui/student-dashboard-view.js`:**
   - تحديث `SimulationBridge.getSimProgress()` لتقرأ من السحابة إذا كان الطالب مسجلاً، وإلا العودة للكاش المحلي.
   - في لوحة الطالب (`student-dashboard-view.js`): عرض إجمالي الدروس المكتملة وإجمالي المحاولات الحقيقية.
4. **`src/core/auth.js`:**
   - عند نجاح تسجيل الدخول (`syncUserSession`): تشغيل دالة `MigrationService.migrateLegacyLocalStorage()` غير الحاصرة (Non-blocking).
5. **`index.html`:**
   - تضمين ملف `src/core/services/learning-service.js` قبل ملفات الـ Views.

---

## 6. استراتيجية ترحيل التخزين المحلي (LocalStorage Migration)

* **الاحتفاظ:**
  - `accountera_theme` (الثيم)
  - `sim_company_profile` (البروفايل النشط مؤقتاً)
  - كاش واجهة المستخدم
* **الترحيل الآمن عند أول دخول:**
  - فحص وجود `student_journal` في الذاكرة المحلية.
  - إذا وجد، يتم حفظه فوراً في `simulation_progress` لحساب الطالب الحالي عبر Upsert.
  - عدم مسح البيانات المحلية حتى يتم التأكد من نجاح الرفع للسحابة.

---

## 7. خطة الاختبار والتحقق (Testing Plan)

1. **اختبار النواة المحاسبية القياسي:**
   - تشغيل `node test-accounting-regression.js` وضمان **9/9 PASS**.
2. **اختبار استمرارية البيانات (End-to-End Persistence Test):**
   - إنشاء حساب طالب A.
   - تسجيل إتمام درس `lesson-1` ومحاولة حل في `ip-1`.
   - تسجيل قيد في المحاكي.
   - إعادة تحميل الصفحة والتحقق من بقاء كل البيانات.
   - تسجيل الخروج ثم الدخول مرة أخرى والتأكد من استعادة التقدم.
   - تسجيل الدخول بحساب طالب B والتأكد من أن بياناته منفصلة وفارغة.

---

## 8. حدود النطاق وتجنب الإفراط الهندسي (Scope Boundaries)

* ❌ لا بوابات دفع ولا Paymob.
* ❌ لا نظام شهادات ولا PDF Generator.
* ❌ لا إدارة محتوى CMS ولا تعديل للدروس الثابتة.
* ❌ لا سيرفر خارجي أو Fastify أو Docker.
* ✅ فقط ربط حقيقي مباشر ومستقر مع Supabase Auth & Database لجعل الموقع يعمل كـ MVP حقيقي.
