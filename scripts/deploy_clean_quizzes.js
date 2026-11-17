const fs = require('fs');
const path = require('path');

const mod1 = require('./quizzes_module1');
const mod2 = require('./quizzes_module2');
const mod3 = require('./quizzes_module3');
const mod4 = require('./quizzes_module4');
const mod5 = require('./quizzes_module5');
const mod6 = require('./quizzes_module6');

const allQuizzes = Object.assign({}, mod1, mod2, mod3, mod4, mod5, mod6);

console.log('Total quizzes defined:', Object.keys(allQuizzes).length);

const outDir = 'data/theory/quizzes';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let totalQuestions = 0;
let errors = [];

for (let i = 1; i <= 38; i++) {
  const pad = String(i).padStart(2, '0');
  const key = `lesson-${pad}`;
  const quiz = allQuizzes[key];

  if (!quiz) {
    errors.push(`Missing quiz for ${key}`);
    continue;
  }

  // Validate questions
  if (!quiz.questions || quiz.questions.length !== 6) {
    errors.push(`Quiz ${key} has ${quiz.questions ? quiz.questions.length : 0} questions (expected 6)`);
  }

  quiz.questions.forEach((q, qIdx) => {
    totalQuestions++;
    if (!q.text || q.text.trim().length === 0) {
      errors.push(`Quiz ${key} Q${qIdx+1} is missing text`);
    }
    if (q.type === 'mcq') {
      if (!q.options || q.options.length !== 4) {
        errors.push(`Quiz ${key} Q${qIdx+1} mcq has ${q.options ? q.options.length : 0} options (expected 4)`);
      }
      if (!['أ', 'ب', 'ج', 'د'].includes(q.correctAnswer)) {
        errors.push(`Quiz ${key} Q${qIdx+1} invalid correctAnswer: ${q.correctAnswer}`);
      }
    } else if (q.type === 'true_false') {
      if (!q.options || q.options.length !== 2) {
        errors.push(`Quiz ${key} Q${qIdx+1} tf has ${q.options ? q.options.length : 0} options (expected 2)`);
      }
      if (!['أ', 'ب'].includes(q.correctAnswer)) {
        errors.push(`Quiz ${key} Q${qIdx+1} invalid tf correctAnswer: ${q.correctAnswer}`);
      }
    } else if (q.type === 'exercise') {
      if (!q.solution || q.solution.trim().length === 0) {
        errors.push(`Quiz ${key} exercise is missing solution`);
      }
    }
  });

  // Write files
  const file1 = path.join(outDir, `lesson-${pad}.json`);
  const file2 = path.join(outDir, `quiz-${pad}.json`);

  fs.writeFileSync(file1, JSON.stringify(quiz, null, 2), 'utf8');
  fs.writeFileSync(file2, JSON.stringify(quiz, null, 2), 'utf8');
}

if (errors.length > 0) {
  console.error('Validation errors found:');
  errors.forEach(e => console.error('  - ' + e));
  process.exit(1);
}

console.log(`\n🎉 SUCCESS! All 38 quizzes (total ${totalQuestions} questions) validated and deployed perfectly.`);
