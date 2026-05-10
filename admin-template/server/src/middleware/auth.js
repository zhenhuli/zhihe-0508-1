const jwt = require('jsonwebtoken');
const { readJson } = require('../utils/db');

const JWT_SECRET = 'admin-template-secret-key';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: '未授权访问' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readJson('users.json');
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token 无效' });
  }
};

const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: '权限不足' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware, JWT_SECRET };
