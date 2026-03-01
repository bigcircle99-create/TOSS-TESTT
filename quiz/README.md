# Business Sense OX Quiz

## Files
- `questions.json`: 10 quiz questions with O/X answers and explanations
- `scoring.js`: Node.js scoring logic

## Preview Web App
- `../preview/index.html`: O/X 질문 UI
- `../preview/server.js`: 로컬 프리뷰 서버
- `../preview/app.js`: 질문 로딩/응답/결과 표시

### Run preview

```bash
node preview/server.js
```

Open `http://127.0.0.1:4173`

## Usage

```bash
node quiz/scoring.js
```

### Use in your app

```js
const { evaluate } = require('./quiz/scoring');

const answers = [
  { id: 1, value: 'X' },
  { id: 2, value: 'O' },
  // ...
];

const result = evaluate(answers);
console.log(result.score, result.level, result.message);
```
