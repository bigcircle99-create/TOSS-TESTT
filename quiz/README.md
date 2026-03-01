# Business Sense OX Quiz

## Files
- `questions.json`: 10 quiz questions with O/X answers and explanations
- `scoring.js`: Node.js scoring logic

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
