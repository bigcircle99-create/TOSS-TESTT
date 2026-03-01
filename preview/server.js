const http = require('http');
const fs = require('fs');
const path = require('path');
const { evaluate } = require('../quiz/scoring');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const QUESTIONS_PATH = path.join(__dirname, '..', 'quiz', 'questions.json');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'text/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  return 'text/plain; charset=utf-8';
}

function loadQuestions() {
  const data = fs.readFileSync(QUESTIONS_PATH, 'utf8');
  return JSON.parse(data);
}

function sanitizeAnswers(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      id: Number(item.id),
      value: String(item.value || '').toUpperCase(),
    }))
    .filter((item) => Number.isFinite(item.id) && (item.value === 'O' || item.value === 'X'));
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      sendJson(res, 400, { error: 'Invalid request URL.' });
      return;
    }

    const url = new URL(req.url, `http://${HOST}:${PORT}`);

    if (req.method === 'GET' && url.pathname === '/api/questions') {
      const questions = loadQuestions().map((q) => ({
        id: q.id,
        question: q.question,
      }));
      sendJson(res, 200, { questions });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/score') {
      const body = await readBody(req);
      const parsed = body ? JSON.parse(body) : {};
      const answers = sanitizeAnswers(parsed.answers);
      const result = evaluate(answers);
      sendJson(res, 200, result);
      return;
    }

    let filePath = url.pathname === '/' ? path.join(ROOT, 'index.html') : path.join(ROOT, url.pathname);
    filePath = path.normalize(filePath);

    if (!filePath.startsWith(ROOT)) {
      sendJson(res, 403, { error: 'Forbidden.' });
      return;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      sendJson(res, 404, { error: 'Not found.' });
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    sendJson(res, 500, { error: 'Server error', message: err.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Preview server running at http://${HOST}:${PORT}`);
});
