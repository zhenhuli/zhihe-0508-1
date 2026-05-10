import { createRouter, createWebHistory } from 'vue-router'
import GamePage from '../views/GamePage.vue'

const routes = [
  {
    path: '/',
    name: 'Game',
    component: GamePage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
