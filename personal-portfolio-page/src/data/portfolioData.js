export const skills = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'JavaScript', level: 90, category: 'Frontend' },
  { name: 'TypeScript', level: 85, category: 'Frontend' },
  { name: 'Vue.js', level: 80, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Python', level: 75, category: 'Backend' },
  { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
  { name: 'MongoDB', level: 70, category: 'Database' },
  { name: 'PostgreSQL', level: 75, category: 'Database' },
  { name: 'Docker', level: 70, category: 'DevOps' },
  { name: 'Git', level: 90, category: 'Tools' },
  { name: 'AWS', level: 65, category: 'Cloud' },
];

export const projects = [
  {
    id: 1,
    title: '电商平台',
    description: '一个全栈电商平台，包含商品管理、购物车、订单系统、支付集成等功能。使用React + Node.js + MongoDB技术栈构建。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20e-commerce%20platform%20dashboard%20with%20product%20grid&image_size=landscape_16_9',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    github: '#',
    demo: '#',
  },
  {
    id: 2,
    title: '任务管理应用',
    description: '一个协作式任务管理工具，支持看板视图、团队协作、实时通知、文件附件等功能。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=task%20management%20application%20kanban%20board%20interface&image_size=landscape_16_9',
    tags: ['Vue.js', 'Firebase', 'Vuex', 'Tailwind'],
    github: '#',
    demo: '#',
  },
  {
    id: 3,
    title: 'AI 聊天助手',
    description: '基于大语言模型的智能聊天助手，支持多轮对话、上下文理解、代码生成等功能。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=AI%20chat%20assistant%20interface%20with%20conversation%20UI&image_size=landscape_16_9',
    tags: ['React', 'Python', 'FastAPI', 'OpenAI'],
    github: '#',
    demo: '#',
  },
  {
    id: 4,
    title: '数据可视化仪表盘',
    description: '企业级数据分析仪表盘，支持多种图表类型、实时数据更新、自定义报表导出。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20dashboard%20with%20charts%20and%20graphs&image_size=landscape_16_9',
    tags: ['React', 'D3.js', 'TypeScript', 'GraphQL'],
    github: '#',
    demo: '#',
  },
  {
    id: 5,
    title: '社交媒体应用',
    description: '一个现代化的社交媒体平台，支持用户认证、动态发布、评论点赞、实时消息等功能。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=social%20media%20application%20feed%20interface%20mobile%20first&image_size=landscape_16_9',
    tags: ['Next.js', 'Prisma', 'PostgreSQL', 'Socket.io'],
    github: '#',
    demo: '#',
  },
  {
    id: 6,
    title: '在线教育平台',
    description: '完整的在线学习平台，包含课程管理、视频播放、进度跟踪、证书生成等功能。',
    image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=online%20education%20platform%20course%20learning%20interface&image_size=landscape_16_9',
    tags: ['React', 'Node.js', 'AWS', 'Redis'],
    github: '#',
    demo: '#',
  },
];

export const experiences = [
  {
    company: '科技创新公司',
    position: '高级前端工程师',
    period: '2023 - 至今',
    description: '负责公司核心产品的前端架构设计和开发，带领5人团队完成多个大型项目，推动前端工程化建设。',
  },
  {
    company: '互联网科技有限公司',
    position: '全栈开发工程师',
    period: '2021 - 2023',
    description: '参与多个全栈项目开发，从需求分析到部署上线的完整流程，优化系统性能提升30%。',
  },
  {
    company: '软件开发工作室',
    position: '前端开发工程师',
    period: '2019 - 2021',
    description: '负责Web应用的前端开发，使用React和Vue技术栈，参与组件库建设和代码规范制定。',
  },
];

export const navLinks = [
  { name: '首页', href: '#home' },
  { name: '技能', href: '#skills' },
  { name: '项目', href: '#projects' },
  { name: '关于', href: '#about' },
  { name: '联系', href: '#contact' },
];
