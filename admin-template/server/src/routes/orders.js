const express = require('express');
const { readJson, writeJson, getNextId } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { logAction } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'employee']));

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, search = '', status = '', paymentMethod = '' } = req.query;
  let orders = readJson('orders.json');
  
  if (search) {
    orders = orders.filter(o => 
      o.orderNo.includes(search) || 
      o.username.includes(search)
    );
  }
  
  if (status) {
    orders = orders.filter(o => o.status === status);
  }
  
  if (paymentMethod) {
    orders = orders.filter(o => o.paymentMethod === paymentMethod);
  }
  
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const total = orders.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const pageData = orders.slice(startIndex, endIndex);
  
  res.json({
    list: pageData,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

router.get('/:id', (req, res) => {
  const orders = readJson('orders.json');
  const order = orders.find(o => o.id === parseInt(req.params.id));
  
  if (!order) {
    return res.status(404).json({ message: '订单不存在' });
  }
  
  res.json(order);
});

router.post('/', (req, res) => {
  const orders = readJson('orders.json');
  const { products, totalAmount, paymentMethod, shippingAddress } = req.body;
  
  const newOrder = {
    id: getNextId(orders),
    orderNo: 'ORD' + Date.now().toString(),
    userId: req.user.id,
    username: req.user.username,
    products,
    totalAmount: parseFloat(totalAmount),
    status: 'pending',
    paymentMethod,
    shippingAddress,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  writeJson('orders.json', orders);
  logAction(req.user, '创建订单', newOrder.orderNo, req);
  
  res.status(201).json(newOrder);
});

router.put('/:id', (req, res) => {
  const orders = readJson('orders.json');
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '订单不存在' });
  }
  
  const { status, shippingAddress } = req.body;
  orders[index] = { 
    ...orders[index], 
    status, 
    shippingAddress 
  };
  writeJson('orders.json', orders);
  logAction(req.user, '更新订单', orders[index].orderNo, req);
  
  res.json(orders[index]);
});

router.delete('/:id', (req, res) => {
  const orders = readJson('orders.json');
  const index = orders.findIndex(o => o.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '订单不存在' });
  }
  
  const deletedOrder = orders.splice(index, 1)[0];
  writeJson('orders.json', orders);
  logAction(req.user, '删除订单', deletedOrder.orderNo, req);
  
  res.json({ message: '删除成功' });
});

module.exports = router;
