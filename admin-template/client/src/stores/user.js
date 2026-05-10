import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login, getProfile, getMenus } from '@/api'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(null)
  const menus = ref([])

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  const handleLogin = async (username, password) => {
    const res = await login({ username, password })
    token.value = res.token
    userInfo.value = res.user
    localStorage.setItem('token', res.token)
    await fetchMenus()
    return res
  }

  const fetchProfile = async () => {
    const res = await getProfile()
    userInfo.value = res
    return res
  }

  const fetchMenus = async () => {
    const res = await getMenus()
    menus.value = res
    return res
  }

  const logout = () => {
    token.value = ''
    userInfo.value = null
    menus.value = []
    localStorage.removeItem('token')
  }

  const checkPermission = (path) => {
    return menus.value.some(menu => menu.path === path)
  }

  return {
    token,
    userInfo,
    menus,
    isLoggedIn,
    isAdmin,
    handleLogin,
    fetchProfile,
    fetchMenus,
    logout,
    checkPermission
  }
})
