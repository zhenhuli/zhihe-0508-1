const express = require('express');
const { readJson, writeJson, getNextId } = require('../utils/db');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { logAction } = require('../utils/logger');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(['admin', 'employee']));

router.get('/', (req, res) => {
  const { page = 1, pageSize = 10, search = '', category = '', status = '' } = req.query;
  let products = readJson('products.json');
  
  if (search) {
    products = products.filter(p => 
      p.name.includes(search) || 
      p.description.includes(search)
    );
  }
  
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  if (status) {
    products = products.filter(p => p.status === status);
  }
  
  const total = products.length;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const pageData = products.slice(startIndex, endIndex);
  
  res.json({
    list: pageData,
    total,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  });
});

router.get('/:id', (req, res) => {
  const products = readJson('products.json');
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ message: '商品不存在' });
  }
  
  res.json(product);
});

router.post('/', (req, res) => {
  const products = readJson('products.json');
  const { name, category, price, stock, status, description } = req.body;
  
  const newProduct = {
    id: getNextId(products),
    name,
    category,
    price: parseFloat(price),
    stock: parseInt(stock),
    status: status || 'active',
    description,
    createdAt: new Date().toISOString()
  };
  
  products.push(newProduct);
  writeJson('products.json', products);
  logAction(req.user, '创建商品', name, req);
  
  res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
  const products = readJson('products.json');
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '商品不存在' });
  }
  
  const { name, category, price, stock, status, description } = req.body;
  products[index] = { 
    ...products[index], 
    name, 
    category, 
    price: parseFloat(price), 
    stock: parseInt(stock), 
    status, 
    description 
  };
  writeJson('products.json', products);
  logAction(req.user, '更新商品', products[index].name, req);
  
  res.json(products[index]);
});

router.delete('/:id', (req, res) => {
  const products = readJson('products.json');
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ message: '商品不存在' });
  }
  
  const deletedProduct = products.splice(index, 1)[0];
  writeJson('products.json', products);
  logAction(req.user, '删除商品', deletedProduct.name, req);
  
  res.json({ message: '删除成功' });
});

module.exports = router;
