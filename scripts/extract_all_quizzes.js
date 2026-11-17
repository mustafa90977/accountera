const fs = require('fs');
const path = require('path');
const { PDFParse } = require('d:/مشاريع/accountera/node_modules/pdf-parse');

const pdfDir = 'C:/Users/ST/.gemini/antigravity/brain/34190040-a0fe-4e39-959e-77b87452da0d/scratch/lessons_extracted/arabic-lesson-to-pdf/اختبارات_المحاسبة_PDF';
const outQuizDir = 'd:/مشاريع/accountera/data/theory/quizzes';
const flaggedFile = 'd:/مشاريع/accountera/data/theory/flagged-quiz-questions.json';

if (!fs.existsSync(outQuizDir)) {
  fs.mkdirSync(outQuizDir, { recursive: true });
}

function unreverseArabicLine(line) {
  if (/[\u0600-\u06FF\uFB50-\uFEFC]/.test(line)) {
    return line.split('').reverse().join('');
  }
  return line;
}

const OPTION_PREFIX_MAP = {
  'أ': 'أ',
  'ا': 'أ',
  'ؤ': 'ب',
  'ب': 'ب',
  'إ': 'ج',
  'ج': 'ج',
  'ئ': 'د',
  'د': 'د'
};

function cleanArabicText(str) {
  if (!str) return '';
  return str
    .replace(/\s+/g, ' ')
    .replace(/--\s*\d+\s*of\s*\d+\s*--/gi, '')
    .trim();
}

async function parseQuizPdf(filePath, lessonNum) {
  const buf = fs.readFileSync(filePath);
  const p = new PDFParse({ data: buf });
  const doc = await p.getText();

  const rawLines = doc.text.split('\n');
  const lines = rawLines
    .map(l => unreverseArabicLine(l).normalize('NFKD').normalize('NFC').trim())
    .filter(l => l.length > 0 && !l.includes('-- ') && !l.startsWith('اختبارات المحاسبة') && !l.startsWith('اختباا تارلمحاسبة') && !l.includes('صفحة '));

  const lessonId = `lesson-${String(lessonNum).padStart(2, '0')}`;
  const quiz = {
    lessonId,
    lessonNumber: lessonNum,
    title: `اختبار الدرس ${lessonNum}`,
    passingScorePercentage: 70,
    questions: []
  };

  const flagged = [];

  let section = 'intro'; // 'mcq', 'tf', 'practical', 'answers_mcq', 'answers_tf', 'answers_practical'
  let mcqQuestions = [];
  let tfQuestions = [];
  let practicalExercise = null;

  let currentMCQ = null;
  let currentTF = null;

  let mcqAnswers = {}; // num -> { ans: 'أ'|'ب'|'ج'|'د', expl: '' }
  let tfAnswers = {};  // num -> { ans: 'أ'|'ب', expl: '' }
  let practicalAnswer = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect section transitions
    if (line.includes('أسئلة الاختيار من متعدد') || (line.includes('الاختيار من متعدد') && (line.includes('أولا') || line.includes('لوأ')))) {
      section = 'mcq';
      continue;
    }
    if ((line.includes('أسئلة الصواب') || line.includes('الصواب والخطأ') || line.includes('صح أو خطأ') || line.includes('صح وأ خطأ')) && !line.includes('إجابات')) {
      if (currentMCQ) { mcqQuestions.push(currentMCQ); currentMCQ = null; }
      section = 'tf';
      continue;
    }
    if ((line.includes('تمرين عملي') || line.includes('تطبيق عملي')) && (line.includes('ثالثا') || line.includes('ثالثاً') || line.includes('المسألة:'))) {
      if (currentMCQ) { mcqQuestions.push(currentMCQ); currentMCQ = null; }
      if (currentTF) { tfQuestions.push(currentTF); currentTF = null; }
      section = 'practical';
      if (!practicalExercise) {
        practicalExercise = {
          id: `practical-1`,
          number: 6,
          type: 'exercise',
          title: 'تمرين عملي تطبيقي',
          text: '',
          solution: ''
        };
      }
      continue;
    }
    if (line.includes('نموذج الإجابات') || line.includes('الإجابات النموذجية') || line.includes('نموإلا جذجاباا')) {
      if (currentMCQ) { mcqQuestions.push(currentMCQ); currentMCQ = null; }
      if (currentTF) { tfQuestions.push(currentTF); currentTF = null; }
      section = 'answers_intro';
      continue;
    }
    if (section.startsWith('answers') || line.includes('إجابات أسئلة') || line.includes('جاباأ تسئلة')) {
      if (line.includes('الاختيار من متعدد') || line.includes('متعد')) {
        section = 'answers_mcq';
        continue;
      }
      if (line.includes('الصواب') || line.includes('الصواو')) {
        section = 'answers_tf';
        continue;
      }
      if (line.includes('التمرين التطبيقي') || line.includes('التطبيقي') || line.includes('حل التمرين')) {
        section = 'answers_practical';
        continue;
      }
    }

    // Process lines within each section
    if (section === 'mcq') {
      const qStartMatch = line.match(/^س\s*(\d+)[\s:ا.]*(.*)/);
      if (qStartMatch) {
        if (currentMCQ) mcqQuestions.push(currentMCQ);
        currentMCQ = {
          id: `q${qStartMatch[1]}`,
          number: parseInt(qStartMatch[1]),
          type: 'mcq',
          text: cleanArabicText(qStartMatch[2]),
          options: [],
          difficulty: 'beginner'
        };
        continue;
      }

      // Check if line starts with an option letter
      const optMatch = line.match(/^([أؤإئابجد])[\s()]*\s*(.*)/);
      if (optMatch && currentMCQ) {
        const rawKey = optMatch[1];
        const standardKey = OPTION_PREFIX_MAP[rawKey] || rawKey;
        currentMCQ.options.push({
          key: standardKey,
          text: cleanArabicText(optMatch[2])
        });
        continue;
      }

      // Continuation of previous option or question text
      if (currentMCQ) {
        if (currentMCQ.options.length > 0) {
          currentMCQ.options[currentMCQ.options.length - 1].text += ' ' + cleanArabicText(line);
        } else {
          currentMCQ.text += ' ' + cleanArabicText(line);
        }
      }
    } else if (section === 'tf') {
      const qStartMatch = line.match(/^س\s*(\d+)[\s:ا.]*(.*)/);
      if (qStartMatch) {
        if (currentTF) tfQuestions.push(currentTF);
        const cleanQ = cleanArabicText(qStartMatch[2]).replace(/\(\s*\)/g, '').trim();
        currentTF = {
          id: `tf${qStartMatch[1]}`,
          number: parseInt(qStartMatch[1]),
          type: 'true_false',
          text: cleanQ,
          options: [
            { key: 'أ', text: 'صواب (صحيحة)' },
            { key: 'ب', text: 'خطأ (خاطئة)' }
          ],
          difficulty: 'intermediate'
        };
        continue;
      }
      if (currentTF) {
        currentTF.text += ' ' + cleanArabicText(line).replace(/\(\s*\)/g, '').trim();
      }
    } else if (section === 'practical') {
      if (line.includes('المسألة:') || line.includes('المساله:')) continue;
      if (practicalExercise) {
        practicalExercise.text += (practicalExercise.text ? ' ' : '') + cleanArabicText(line);
      }
    } else if (section === 'answers_mcq') {
      const ansMatch = line.match(/^س\s*(\d+)[\s:.]*(.*)/);
      if (ansMatch) {
        const qNum = parseInt(ansMatch[1]);
        const content = ansMatch[2];
        let chosenKey = 'أ';
        const keyMatch = content.match(/خيار\s*[()]*([أؤإئابجد])[()]*/);
        if (keyMatch) {
          chosenKey = OPTION_PREFIX_MAP[keyMatch[1]] || keyMatch[1];
        } else if (content.includes('ب') || content.includes('ؤ')) {
          chosenKey = 'ب';
        } else if (content.includes('أ') || content.includes('ا')) {
          chosenKey = 'أ';
        } else if (content.includes('ج') || content.includes('إ')) {
          chosenKey = 'ج';
        } else if (content.includes('د') || content.includes('ئ')) {
          chosenKey = 'د';
        }

        const explParts = content.split(/—|-|–/);
        const expl = explParts.length > 1 ? explParts.slice(1).join('—').trim() : content.trim();

        mcqAnswers[qNum] = {
          key: chosenKey,
          explanation: cleanArabicText(expl)
        };
      } else {
        const lastNum = Math.max(...Object.keys(mcqAnswers).map(Number), 0);
        if (lastNum > 0 && mcqAnswers[lastNum]) {
          mcqAnswers[lastNum].explanation += ' ' + cleanArabicText(line);
        }
      }
    } else if (section === 'answers_tf') {
      const ansMatch = line.match(/^س\s*(\d+)[\s:.]*(.*)/);
      if (ansMatch) {
        const qNum = parseInt(ansMatch[1]);
        const content = ansMatch[2];
        const isTrue = content.includes('صحيح') || content.includes('صواب') || content.includes('صح');
        const chosenKey = isTrue ? 'أ' : 'ب';

        const explParts = content.split(/—|-|–/);
        const expl = explParts.length > 1 ? explParts.slice(1).join('—').trim() : content.trim();

        tfAnswers[qNum] = {
          key: chosenKey,
          explanation: cleanArabicText(expl)
        };
      } else {
        const lastNum = Math.max(...Object.keys(tfAnswers).map(Number), 0);
        if (lastNum > 0 && tfAnswers[lastNum]) {
          tfAnswers[lastNum].explanation += ' ' + cleanArabicText(line);
        }
      }
    } else if (section === 'answers_practical') {
      if (line.includes('الإجابة:') || line.includes('الاجابة:')) continue;
      practicalAnswer += (practicalAnswer ? ' ' : '') + cleanArabicText(line);
    }
  }

  if (currentMCQ) mcqQuestions.push(currentMCQ);
  if (currentTF) tfQuestions.push(currentTF);

  // Bind answers to MCQs
  for (const q of mcqQuestions) {
    const ans = mcqAnswers[q.number];
    if (ans) {
      q.correctAnswer = ans.key;
      q.explanation = ans.explanation;
    } else {
      q.correctAnswer = 'أ';
      q.explanation = '';
      flagged.push({
        lessonId,
        lessonNumber: lessonNum,
        questionId: q.id,
        reason: 'Missing answer key in answer section'
      });
    }

    if (q.options.length < 4) {
      flagged.push({
        lessonId,
        lessonNumber: lessonNum,
        questionId: q.id,
        reason: `Only ${q.options.length} options parsed (expected 4)`
      });
    }
    quiz.questions.push(q);
  }

  // Bind answers to True/False
  for (const q of tfQuestions) {
    const ans = tfAnswers[q.number];
    if (ans) {
      q.correctAnswer = ans.key;
      q.explanation = ans.explanation;
    } else {
      q.correctAnswer = 'أ';
      q.explanation = '';
      flagged.push({
        lessonId,
        lessonNumber: lessonNum,
        questionId: q.id,
        reason: 'Missing T/F answer in answer section'
      });
    }
    quiz.questions.push(q);
  }

  // Practical exercise
  if (practicalExercise) {
    practicalExercise.solution = practicalAnswer.trim();
    practicalExercise.explanation = practicalAnswer.trim();
    quiz.questions.push(practicalExercise);
  }

  return { quiz, flagged };
}

async function main() {
  const files = fs.readdirSync(pdfDir);
  const allFlagged = [];
  let totalQuestions = 0;

  for (let num = 1; num <= 38; num++) {
    const prefix = `اختبار ${String(num).padStart(2, '0')}`;
    const filename = files.find(f => f.startsWith(prefix));
    if (!filename) {
      console.error(`Missing file for lesson ${num}`);
      continue;
    }

    const fullPath = path.join(pdfDir, filename);
    const { quiz, flagged } = await parseQuizPdf(fullPath, num);
    const outPath = path.join(outQuizDir, `${quiz.lessonId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(quiz, null, 2), 'utf8');

    totalQuestions += quiz.questions.length;
    if (flagged.length > 0) {
      allFlagged.push(...flagged);
    }
    console.log(`Parsed ${quiz.lessonId}: ${quiz.questions.length} questions (${flagged.length} flagged)`);
  }

  fs.writeFileSync(flaggedFile, JSON.stringify(allFlagged, null, 2), 'utf8');
  console.log(`\nDONE: 38 quizzes parsed, total ${totalQuestions} questions, ${allFlagged.length} flagged questions saved to ${flaggedFile}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
