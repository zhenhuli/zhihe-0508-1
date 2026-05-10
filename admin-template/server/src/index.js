const express = require('express');
const cors = require('cors');
const detectPort = require('detect-port');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const logRoutes = require('./routes/logs');
const searchRoutes = require('./routes/search');

const app = express();
const DEFAULT_PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/search', searchRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const startServer = async () => {
  try {
    const port = await detectPort(DEFAULT_PORT);
    
    app.listen(port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║         中后台管理系统 - 后端服务启动成功                  ║
╠══════════════════════════════════════════════════════════╣
║  服务地址: http://localhost:${port}                         ║
║  API 前缀: /api                                         ║
╚══════════════════════════════════════════════════════════╝
`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
    process.exit(1);
  }
};

startServer();
