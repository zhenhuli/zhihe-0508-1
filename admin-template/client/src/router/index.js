import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard'
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { roles: ['admin', 'employee'] }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/Users.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Products.vue'),
        meta: { roles: ['admin', 'employee'] }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Orders.vue'),
        meta: { roles: ['admin', 'employee'] }
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/views/Logs.vue'),
        meta: { roles: ['admin'] }
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/Profile.vue'),
        meta: { roles: ['admin', 'employee'] }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/403.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/404.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth === false) {
    next()
    return
  }
  
  if (!userStore.isLoggedIn) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }
  
  if (!userStore.userInfo) {
    try {
      await userStore.fetchProfile()
      await userStore.fetchMenus()
    } catch (error) {
      userStore.logout()
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  if (to.meta.roles && !to.meta.roles.includes(userStore.userInfo.role)) {
    next('/403')
    return
  }
  
  next()
})

export default router
