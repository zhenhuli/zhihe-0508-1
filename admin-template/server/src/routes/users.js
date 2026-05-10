const express = require('express');
const { readJson, writeJson, getNextId } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { logAction } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'employee']), (req, res) => {
  const { page = 1, pageSize = 10, search = '', role = '', status = '' } = req.query;
  let users = readJson('users.json');
  
  if (search) {
    users = users.filter(u => 
      u.username.includes(search) || 
      u.name.includes(search) || 
      u.email.includes(search)
    );
  }
  
  if (role) {
    users = users.filter(u => u.role === role);
  }
  
  if (status) {
    users = users.filter(u => u.status === status);
  }
  
  const total = users.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const pageData = users.slice(startIndex, endIndex);
  
  res.json({
    list: pageData,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

router.get('/:id', roleMiddleware(['admin', 'employee']), (req, res) => {
  const users = readJson('users.json');
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  res.json(user);
});

router.post('/', roleMiddleware(['admin']), (req, res) => {
  const users = readJson('users.json');
  const { username, name, email, role, status } = req.body;
  
  if (users.some(u => u.username === username)) {
    return res.status(400).json({ message: '用户名已存在' });
  }
  
  const newUser = {
    id: getNextId(users),
    username,
    password: '123456',
    name,
    email,
    role: role || 'employee',
    status: status || 'active',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  writeJson('users.json', users);
  logAction(req.user, '创建用户', username, req);
  
  res.status(201).json(newUser);
});

router.put('/:id', roleMiddleware(['admin']), (req, res) => {
  const users = readJson('users.json');
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  const { name, email, role, status } = req.body;
  users[index] = { ...users[index], name, email, role, status };
  writeJson('users.json', users);
  logAction(req.user, '更新用户', users[index].username, req);
  
  res.json(users[index]);
});

router.delete('/:id', roleMiddleware(['admin']), (req, res) => {
  const users = readJson('users.json');
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  const deletedUser = users.splice(index, 1)[0];
  writeJson('users.json', users);
  logAction(req.user, '删除用户', deletedUser.username, req);
  
  res.json({ message: '删除成功' });
});

module.exports = router;
