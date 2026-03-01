/**
 * Business Sense Quiz Scoring
 *
 * answers format example:
 * [
 *   { id: 1, value: 'O' },
 *   { id: 2, value: 'X' }
 * ]
 */

const fs = require('fs');
const path = require('path');

function loadQuestions() {
  const filePath = path.join(__dirname, 'questions.json');
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function evaluate(answers) {
  const questions = loadQuestions();
  const answerMap = new Map(answers.map((a) => [Number(a.id), String(a.value).toUpperCase()]));

  let correctCount = 0;
  const details = questions.map((q) => {
    const userAnswer = answerMap.get(q.id) || null;
    const isCorrect = userAnswer === q.answer;
    if (isCorrect) correctCount += 1;

    return {
      id: q.id,
      question: q.question,
      correctAnswer: q.answer,
      userAnswer,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = questions.length;
  const score = Math.round((correctCount / total) * 100);

  let level = '';
  let message = '';

  if (score >= 90) {
    level = 'A';
    message = '사업 감각이 매우 뛰어납니다. 실제 실행에서도 강점이 보일 가능성이 높습니다.';
  } else if (score >= 70) {
    level = 'B';
    message = '좋은 사업 감각을 갖추고 있습니다. 일부 지표 해석만 보완하면 더 강해집니다.';
  } else if (score >= 50) {
    level = 'C';
    message = '기본기는 있습니다. 고객/수익 구조 관점의 판단 훈련을 더 해보세요.';
  } else {
    level = 'D';
    message = '창업 핵심 개념 복습이 필요합니다. 문제 정의와 단위 경제성부터 점검해보세요.';
  }

  return {
    total,
    correctCount,
    score,
    level,
    message,
    details,
  };
}

module.exports = {
  evaluate,
  loadQuestions,
};

if (require.main === module) {
  // quick local demo
  const sample = [
    { id: 1, value: 'X' },
    { id: 2, value: 'O' },
    { id: 3, value: 'X' },
    { id: 4, value: 'O' },
    { id: 5, value: 'O' },
    { id: 6, value: 'X' },
    { id: 7, value: 'O' },
    { id: 8, value: 'O' },
    { id: 9, value: 'X' },
    { id: 10, value: 'O' },
  ];

  const result = evaluate(sample);
  console.log(JSON.stringify(result, null, 2));
}
