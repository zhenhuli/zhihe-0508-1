const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

const ensureFile = (file) => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([]));
  }
};

const readJson = (filename) => {
  const file = path.join(dataDir, filename);
  ensureFile(file);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const writeJson = (filename, data) => {
  const file = path.join(dataDir, filename);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

const getNextId = (items) => {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
};

module.exports = { readJson, writeJson, getNextId };
