# 中后台管理系统模板

一套可复用的中后台管理模板，基于 Vue 3 + Node.js + Express 技术栈构建。

## 功能特性

- **双角色路由权限系统**：支持管理员和普通员工两种角色，不同角色看到不同的菜单和页面
- **侧边栏动态菜单**：根据用户角色动态显示侧边栏菜单
- **表格分页筛选**：支持表格分页、条件筛选功能
- **表单弹窗**：新增、编辑功能使用弹窗表单
- **全局搜索**：支持搜索用户、商品、订单
- **操作日志记录**：自动记录用户的关键操作
- **暗黑模式切换**：支持亮色/暗黑主题切换
- **自动端口适配**：本地运行时自动检测并使用空闲端口

## 技术栈

### 前端
- Vue 3 + Composition API
- Vue Router 4（路由管理）
- Pinia（状态管理）
- Element Plus（UI 组件库）
- Axios（HTTP 请求）
- Vite（构建工具）

### 后端
- Node.js
- Express（Web 框架）
- JWT（身份验证）
- CORS（跨域支持）
- JSON 文件存储（数据持久化）

## 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 启动项目

**方式一：分别启动**

```bash
# 启动后端服务（终端 1）
cd server
npm start

# 启动前端服务（终端 2）
cd client
npm run dev
```

**方式二：使用安装脚本**

```bash
# 在项目根目录下
npm run install-all  # 安装所有依赖
npm run dev          # 同时启动前后端
```

### 访问地址

- 前端地址：http://localhost:5173
- 后端地址：http://localhost:3001（如果端口被占用会自动切换）

### 测试账号

| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | 123456 |
| 普通员工 | employee | 123456 |

## 项目结构

```
admin-template/
├── client/                 # 前端项目
│   ├── src/
│   │   ├── api/           # API 接口
│   │   ├── components/    # 公共组件
│   │   ├── router/        # 路由配置
│   │   ├── stores/        # Pinia 状态管理
│   │   ├── styles/        # 全局样式
│   │   ├── utils/         # 工具函数
│   │   ├── views/         # 页面组件
│   │   ├── App.vue        # 根组件
│   │   └── main.js        # 入口文件
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                 # 后端项目
│   ├── data/              # JSON 数据文件
│   ├── src/
│   │   ├── middleware/    # 中间件
│   │   ├── routes/        # 路由
│   │   ├── utils/         # 工具函数
│   │   └── index.js       # 入口文件
│   └── package.json
├── package.json
└── README.md
```

## 功能说明

### 1. 路由权限控制

路由配置在 `client/src/router/index.js` 中，通过 `meta.roles` 字段指定哪些角色可以访问该路由。路由守卫会在每次导航前检查用户权限。

### 2. 动态菜单

侧边栏菜单通过 `GET /api/auth/menus` 接口获取，后端会根据用户角色返回对应的菜单列表。

### 3. 全局搜索

顶部导航栏提供全局搜索功能，可以搜索用户、商品和订单数据。

### 4. 操作日志

用户的关键操作（登录、创建、更新、删除等）会被自动记录到 `server/data/logs.json` 文件中。

### 5. 暗黑模式

点击顶部导航栏的月亮/太阳图标可以切换主题，主题偏好会保存到 localStorage 中。

### 6. 自动端口适配

- 后端使用 `detect-port` 库自动检测空闲端口
- 前端 Vite 配置 `strictPort: false`，如果 5173 端口被占用会自动切换

## API 接口

### 认证接口
- `POST /api/auth/login` - 登录
- `GET /api/auth/profile` - 获取用户信息
- `GET /api/auth/menus` - 获取菜单列表

### 用户管理
- `GET /api/users` - 获取用户列表（分页）
- `GET /api/users/:id` - 获取用户详情
- `POST /api/users` - 创建用户（仅管理员）
- `PUT /api/users/:id` - 更新用户（仅管理员）
- `DELETE /api/users/:id` - 删除用户（仅管理员）

### 商品管理
- `GET /api/products` - 获取商品列表（分页）
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 创建商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 删除商品

### 订单管理
- `GET /api/orders` - 获取订单列表（分页）
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id` - 更新订单
- `DELETE /api/orders/:id` - 删除订单

### 操作日志
- `GET /api/logs` - 获取操作日志列表（分页，仅管理员）

### 全局搜索
- `GET /api/search?keyword=xxx` - 全局搜索

## 自定义配置

### 修改默认端口

**后端**：修改 `server/src/index.js` 中的 `DEFAULT_PORT` 变量。

**前端**：修改 `client/vite.config.js` 中的 `server.port` 配置。

### 添加新角色

1. 后端 `server/src/routes/auth.js` 中修改菜单配置
2. 前端 `client/src/router/index.js` 中修改路由的 `meta.roles`
3. 在 `server/data/users.json` 中添加新角色的用户

## 开发建议

1. **数据存储**：当前使用 JSON 文件存储数据，生产环境建议替换为数据库（MySQL、MongoDB 等）
2. **密码加密**：当前使用明文密码，生产环境建议使用 bcrypt 加密
3. **图表库**：如需添加图表，推荐使用 ECharts
4. **图标库**：当前使用 Element Plus 内置图标，可根据需要扩展
5. **权限控制**：可根据需求细化权限粒度（按钮级权限）

## 许可证

MIT
