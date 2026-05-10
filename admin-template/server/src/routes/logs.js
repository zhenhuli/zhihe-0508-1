const express = require('express');
const { readJson } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, search = '' } = req.query;
  let logs = readJson('logs.json');
  
  if (search) {
    logs = logs.filter(log => 
      log.username.includes(search) || 
      log.action.includes(search) || 
      log.target.includes(search)
    );
  }
  
  logs.sort((a, b) => new Date(b.time) - new Date(a.time));
  
  const total = logs.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const pageData = logs.slice(startIndex, endIndex);
  
  res.json({
    list: pageData,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

module.exports = router;
