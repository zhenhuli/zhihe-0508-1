const express = require('express');
const { readJson } = require('../utils/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res) => {
  const { keyword } = req.query;
  
  if (!keyword) {
    return res.json({ results: [] });
  }
  
  const results = [];
  
  const users = readJson('users.json');
  users.forEach(u => {
    if (u.username.includes(keyword) || u.name.includes(keyword) || u.email.includes(keyword)) {
      results.push({
        type: 'user',
        id: u.id,
        title: u.name,
        subtitle: u.username,
        path: '/users'
      });
    }
  });
  
  const products = readJson('products.json');
  products.forEach(p => {
    if (p.name.includes(keyword) || p.description.includes(keyword)) {
      results.push({
        type: 'product',
        id: p.id,
        title: p.name,
        subtitle: p.category,
        path: '/products'
      });
    }
  });
  
  const orders = readJson('orders.json');
  orders.forEach(o => {
    if (o.orderNo.includes(keyword) || o.username.includes(keyword)) {
      results.push({
        type: 'order',
        id: o.id,
        title: o.orderNo,
        subtitle: o.username,
        path: '/orders'
      });
    }
  });
  
  res.json({ results: results.slice(0, 10) });
});

module.exports = router;
