const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, '../data/leaderboard.json');

if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

let leaderboard = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

function saveToFile() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(leaderboard, null, 2));
}

app.get('/api/leaderboard', (req, res) => {
  const { difficulty, imageId } = req.query;
  
  let filtered = leaderboard;
  
  if (difficulty) {
    filtered = filtered.filter(record => record.difficulty === difficulty);
  }
  
  if (imageId) {
    filtered = filtered.filter(record => record.imageId === imageId);
  }
  
  filtered.sort((a, b) => {
    if (a.steps !== b.steps) return a.steps - b.steps;
    return a.time - b.time;
  });
  
  res.json(filtered.slice(0, 50));
});

app.post('/api/leaderboard', (req, res) => {
  const { name, steps, time, difficulty, imageId, imageName } = req.body;
  
  if (!name || !steps || !time || !difficulty || !imageId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const record = {
    id: Date.now().toString(),
    name: name.trim(),
    steps: parseInt(steps),
    time: parseInt(time),
    difficulty,
    imageId,
    imageName: imageName || '',
    createdAt: new Date().toISOString()
  };
  
  leaderboard.push(record);
  
  leaderboard.sort((a, b) => {
    if (a.steps !== b.steps) return a.steps - b.steps;
    return a.time - b.time;
  });
  
  saveToFile();
  
  const rank = leaderboard.findIndex(r => r.id === record.id) + 1;
  
  res.json({
    record,
    rank,
    totalRecords: leaderboard.length
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
