import type { Course } from '~/types'

export const courses: Course[] = [
  {
    id: 'vue3-basics',
    title: 'Vue 3 入门实战',
    description: '从零开始学习 Vue 3，掌握组合式 API、响应式原理和组件开发',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20web%20development%20course%20with%20Vue%203%20logo%20and%20code%20background&image_size=landscape_16_9',
    instructor: '张老师',
    totalDuration: 5400,
    chapters: [
      {
        id: 'vue-ch1',
        title: 'Vue 3 简介与环境搭建',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: '了解 Vue 3 的新特性，搭建开发环境'
      },
      {
        id: 'vue-ch2',
        title: '组合式 API 基础',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: '学习 setup 函数、ref 和 reactive'
      },
      {
        id: 'vue-ch3',
        title: '响应式原理深入',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: '深入理解 Vue 3 的响应式系统'
      },
      {
        id: 'vue-ch4',
        title: '组件开发最佳实践',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: '组件通信、插槽和生命周期'
      }
    ]
  },
  {
    id: 'typescript-basics',
    title: 'TypeScript 进阶指南',
    description: '从基础到进阶，全面掌握 TypeScript 类型系统',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=TypeScript%20programming%20course%20with%20blue%20theme%20and%20type%20annotations&image_size=landscape_16_9',
    instructor: '李老师',
    totalDuration: 7200,
    chapters: [
      {
        id: 'ts-ch1',
        title: 'TypeScript 基础类型',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: '学习基本类型、接口和类型别名'
      },
      {
        id: 'ts-ch2',
        title: '高级类型技巧',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: '泛型、条件类型、映射类型'
      },
      {
        id: 'ts-ch3',
        title: '类型体操实战',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: '复杂类型推导和工具类型实现'
      },
      {
        id: 'ts-ch4',
        title: '项目配置与最佳实践',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: 'tsconfig 配置、类型定义文件编写'
      }
    ]
  },
  {
    id: 'nuxt3-basics',
    title: 'Nuxt 3 全栈开发',
    description: '基于 Nuxt 3 构建现代化全栈应用',
    cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Nuxt%203%20framework%20course%20with%20green%20theme%20modern%20design&image_size=landscape_16_9',
    instructor: '王老师',
    totalDuration: 9000,
    chapters: [
      {
        id: 'nuxt-ch1',
        title: 'Nuxt 3 项目初始化',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: '创建项目、目录结构介绍'
      },
      {
        id: 'nuxt-ch2',
        title: '页面路由与导航',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: '文件系统路由、动态路由、中间件'
      },
      {
        id: 'nuxt-ch3',
        title: '数据获取与状态管理',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: 'useAsyncData、useFetch、Pinia 集成'
      },
      {
        id: 'nuxt-ch4',
        title: '服务端 API 开发',
        duration: 12,
        videoUrl: '/videos/sample2.mp4',
        description: 'Nitro 服务端、API 路由、数据库操作'
      },
      {
        id: 'nuxt-ch5',
        title: '部署与性能优化',
        duration: 10,
        videoUrl: '/videos/sample1.mp4',
        description: 'SSG、SSR、边缘渲染、性能调优'
      }
    ]
  }
]
