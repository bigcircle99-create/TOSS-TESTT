let questions = [];
let currentIndex = 0;
const answers = new Map();

const quizPanel = document.getElementById('quiz-panel');
const resultPanel = document.getElementById('result-panel');
const questionText = document.getElementById('question-text');
const meta = document.getElementById('meta');
const meter = document.getElementById('meter');
const btnO = document.getElementById('btn-o');
const btnX = document.getElementById('btn-x');
const resultTitle = document.getElementById('result-title');
const resultMessage = document.getElementById('result-message');
const resultScore = document.getElementById('result-score');
const resultGrade = document.getElementById('result-grade');
const resultList = document.getElementById('result-list');
const restartBtn = document.getElementById('restart');

function setButtonsDisabled(disabled) {
  btnO.disabled = disabled;
  btnX.disabled = disabled;
}

function renderQuestion() {
  const q = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  questionText.textContent = q.question;
  meta.textContent = `${currentIndex + 1} / ${questions.length} 문항`;
  meter.style.width = `${progress}%`;
}

async function loadQuestions() {
  const res = await fetch('/api/questions');
  if (!res.ok) throw new Error('질문을 불러오지 못했습니다.');
  const data = await res.json();
  questions = data.questions || [];
  if (questions.length === 0) throw new Error('질문 데이터가 비어 있습니다.');
  renderQuestion();
}

function toAnswerPayload() {
  return questions.map((q) => ({
    id: q.id,
    value: answers.get(q.id),
  }));
}

async function submit() {
  setButtonsDisabled(true);
  meta.textContent = '채점 중입니다...';

  const res = await fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers: toAnswerPayload() }),
  });
  if (!res.ok) throw new Error('채점 요청에 실패했습니다.');
  const result = await res.json();

  resultTitle.textContent = `${result.correctCount}/${result.total} 정답`;
  resultMessage.textContent = result.message;
  resultScore.textContent = `${result.score}점`;
  resultGrade.textContent = `등급 ${result.level}`;
  resultList.innerHTML = result.details
    .map(
      (item) =>
        `<article class="result-item">
          <p><strong>Q${item.id}.</strong> ${item.question}</p>
          <p class="${item.isCorrect ? 'ok' : 'no'}">${item.isCorrect ? '정답' : '오답'} (내 답: ${item.userAnswer || '-'} / 정답: ${item.correctAnswer})</p>
          <p>${item.explanation}</p>
        </article>`
    )
    .join('');

  quizPanel.classList.add('hidden');
  resultPanel.classList.remove('hidden');
}

async function handleAnswer(value) {
  const q = questions[currentIndex];
  answers.set(q.id, value);

  if (currentIndex === questions.length - 1) {
    await submit();
    return;
  }

  currentIndex += 1;
  renderQuestion();
}

function resetQuiz() {
  answers.clear();
  currentIndex = 0;
  resultList.innerHTML = '';
  resultPanel.classList.add('hidden');
  quizPanel.classList.remove('hidden');
  setButtonsDisabled(false);
  renderQuestion();
}

btnO.addEventListener('click', () => {
  handleAnswer('O').catch((err) => {
    meta.textContent = err.message;
    setButtonsDisabled(false);
  });
});

btnX.addEventListener('click', () => {
  handleAnswer('X').catch((err) => {
    meta.textContent = err.message;
    setButtonsDisabled(false);
  });
});

restartBtn.addEventListener('click', resetQuiz);

loadQuestions().catch((err) => {
  meta.textContent = err.message;
  setButtonsDisabled(true);
});
