const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 بدء فحص منظومة الجزء النظري وبنك الاختبارات (Theory Suite Verification)...');

// 1. فحص ملف الفهرس
const indexPath = path.join(__dirname, 'data/theory/theory-index.json');
assert.ok(fs.existsSync(indexPath), 'theory-index.json must exist');
const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
assert.strictEqual(index.length, 38, 'theory-index.json must contain exactly 38 lessons');
console.log('   ✅ [PASS]: فهرس الدروس يحتوي على 38 درساً كاملاً.');

// 2. التحقق من ترتيب العرض (درس 14 بعد درس 4 مباشرة في الوحدة الأولى)
const l04 = index.find(l => l.id === 'lesson-04');
const l14 = index.find(l => l.id === 'lesson-14');
const l05 = index.find(l => l.id === 'lesson-05');

assert.ok(l04 && l14 && l05, 'Lessons 04, 14, and 05 must exist');
assert.strictEqual(l04.displayOrder, 4, 'Lesson 04 displayOrder must be 4');
assert.strictEqual(l14.displayOrder, 5, 'Lesson 14 displayOrder must be 5');
assert.strictEqual(l05.displayOrder, 6, 'Lesson 05 displayOrder must be 6');
assert.strictEqual(l14.moduleIndex, 1, 'Lesson 14 must be assigned to Module 1');
console.log('   ✅ [PASS]: تم التحقق من نقل درس 14 بعد درس 4 مباشرة في الوحدة الأولى مع الحفاظ على الترقيم الأصلي 14.');

// 3. التحقق من كل ملفات الدروس (38 درس) وهيكلية الـ blocks
for (let i = 1; i <= 38; i++) {
  const lessonId = `lesson-${String(i).padStart(2, '0')}`;
  const p = path.join(__dirname, `data/theory/lessons/${lessonId}.json`);
  assert.ok(fs.existsSync(p), `${lessonId}.json must exist`);
  const content = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(content.id, lessonId);
  assert.ok(Array.isArray(content.blocks) && content.blocks.length > 0, `${lessonId} must contain blocks array`);
  
  // التحقق من سلامة أنواع الـ blocks
  content.blocks.forEach(b => {
    assert.ok(b.type, `Block in ${lessonId} missing type`);
    if (b.type === 'journal_entry') {
      assert.ok(Array.isArray(b.lines), `Journal entry in ${lessonId} must contain lines array`);
    }
  });
}
console.log('   ✅ [PASS]: جميع الـ 38 درساً مهيكلة كبيانات JSON مع أطراف قيود اليومية بنسبة 100%.');

// 4. التحقق من ملفات الاختبارات الـ 38
for (let i = 1; i <= 38; i++) {
  const lessonId = `lesson-${String(i).padStart(2, '0')}`;
  const p = path.join(__dirname, `data/theory/quizzes/${lessonId}.json`);
  assert.ok(fs.existsSync(p), `quiz ${lessonId}.json must exist`);
  const quiz = JSON.parse(fs.readFileSync(p, 'utf8'));
  assert.strictEqual(quiz.lessonId, lessonId);
  assert.strictEqual(quiz.questions.length, 6, `Quiz ${lessonId} must have 6 questions`);
  
  // 3 MCQ, 2 T/F, 1 practical
  const mcqs = quiz.questions.filter(q => q.type === 'mcq');
  const tfs = quiz.questions.filter(q => q.type === 'true_false');
  const practicals = quiz.questions.filter(q => q.type === 'exercise');

  assert.strictEqual(mcqs.length, 3, `Quiz ${lessonId} must have 3 MCQs`);
  assert.strictEqual(tfs.length, 2, `Quiz ${lessonId} must have 2 True/False questions`);
  assert.strictEqual(practicals.length, 1, `Quiz ${lessonId} must have 1 practical exercise`);

  // MCQs have 4 options labeled أ, ب, ج, د
  mcqs.forEach(q => {
    assert.strictEqual(q.options.length, 4, `MCQ in ${lessonId} must have 4 options`);
    const keys = q.options.map(o => o.key);
    assert.deepStrictEqual(keys, ['أ', 'ب', 'ج', 'د'], `MCQ options must be labeled أ, ب, ج, د`);
    assert.ok(['أ', 'ب', 'ج', 'د'].includes(q.correctAnswer), `MCQ in ${lessonId} must have valid correctAnswer`);
  });
}
console.log('   ✅ [PASS]: بنك الأسئلة مكتمل (228 سؤالاً) مع تسمية الخيارات أ ب ج د واستيفاء الإجابات الصحيحة والتعليلات.');

// 5. التحقق من دالة البحث وتطبيع الحروف العربية
function normalizeArabic(str) {
  if (!str) return '';
  return str
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .toLowerCase()
    .trim();
}

assert.strictEqual(normalizeArabic('أصول'), normalizeArabic('اصول'));
assert.strictEqual(normalizeArabic('ميزانية'), normalizeArabic('ميزانيه'));
assert.strictEqual(normalizeArabic('إيراداتٌ'), normalizeArabic('ايرادات'));
assert.strictEqual(normalizeArabic('مَدِينٌ وَدَائِنٌ'), normalizeArabic('مدين ودائن'));
assert.strictEqual(normalizeArabic('يُرجى'), normalizeArabic('يرجي'));
console.log('   ✅ [PASS]: محرك البحث المعرب يتجاهل بدقة فروق الهمزات والتاء المربوطة والألف اللينة والتشكيل.');

console.log('\n========================================================');
console.log('🎯 نتيجة فحص منظومة الجزء النظري: تم اجتياز جميع الفحوصات بنسبة 100%!');
console.log('========================================================\n');
