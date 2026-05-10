const express = require('express');
const jwt = require('jsonwebtoken');
const { readJson, writeJson } = require('../utils/db');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');
const { logAction } = require('../utils/logger');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readJson('users.json');
  
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }
  
  if (password !== user.password) {
    return res.status(401).json({ message: '用户名或密码错误' });
  }
  
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  logAction(user, '用户登录', '系统', req);
  
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      email: user.email
    }
  });
});

router.get('/profile', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    name: req.user.name,
    role: req.user.role,
    email: req.user.email,
    phone: req.user.phone || '',
    avatar: req.user.avatar || '',
    status: req.user.status,
    createdAt: req.user.createdAt
  });
});

router.put('/profile', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const { name, email, phone } = req.body;
  const index = users.findIndex(u => u.id === req.user.id);
  
  if (index === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  users[index] = {
    ...users[index],
    name: name || users[index].name,
    email: email || users[index].email,
    phone: phone || users[index].phone
  };
  
  writeJson('users.json', users);
  logAction(req.user, '更新个人信息', '个人中心', req);
  
  res.json({
    message: '更新成功',
    user: {
      id: users[index].id,
      username: users[index].username,
      name: users[index].name,
      role: users[index].role,
      email: users[index].email,
      phone: users[index].phone || ''
    }
  });
});

router.put('/password', authMiddleware, (req, res) => {
  const users = readJson('users.json');
  const { oldPassword, newPassword } = req.body;
  const index = users.findIndex(u => u.id === req.user.id);
  
  if (index === -1) {
    return res.status(404).json({ message: '用户不存在' });
  }
  
  if (users[index].password !== oldPassword) {
    return res.status(400).json({ message: '旧密码不正确' });
  }
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: '新密码长度不能少于6位' });
  }
  
  users[index].password = newPassword;
  writeJson('users.json', users);
  logAction(req.user, '修改密码', '个人中心', req);
  
  res.json({ message: '密码修改成功' });
});

router.get('/menus', authMiddleware, (req, res) => {
  const { role } = req.user;
  
  const allMenus = [
    { id: 1, path: '/dashboard', name: '仪表盘', icon: 'dashboard', role: ['admin', 'employee'] },
    { id: 2, path: '/users', name: '用户管理', icon: 'users', role: ['admin'] },
    { id: 3, path: '/products', name: '商品管理', icon: 'box', role: ['admin', 'employee'] },
    { id: 4, path: '/orders', name: '订单管理', icon: 'shopping-cart', role: ['admin', 'employee'] },
    { id: 5, path: '/logs', name: '操作日志', icon: 'file-text', role: ['admin'] }
  ];
  
  const menus = allMenus.filter(menu => menu.role.includes(role));
  res.json(menus);
});

module.exports = router;
