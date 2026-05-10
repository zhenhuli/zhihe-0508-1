<template>
  <div class="layout-container">
    <header class="layout-header">
      <div class="logo">
        <div class="logo-icon"></div>
        <span>管理系统</span>
      </div>
      <div class="header-right">
        <el-select
          v-model="searchKeyword"
          filterable
          remote
          reserve-keyword
          placeholder="全局搜索..."
          :remote-method="handleSearch"
          :loading="searchLoading"
          clearable
          @change="handleSelect"
          class="search-box"
          size="default"
        >
          <el-option
            v-for="item in searchResults"
            :key="item.id + '-' + item.type"
            :label="`[${typeLabels[item.type]}] ${item.title}`"
            :value="item.path"
          />
        </el-select>
        <el-tooltip :content="themeStore.isDark ? '切换到亮色模式' : '切换到暗黑模式'" placement="bottom">
          <el-button 
            :icon="themeStore.isDark ? 'Sunny' : 'Moon'" 
            circle 
            @click="themeStore.toggleTheme"
          />
        </el-tooltip>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
            <el-avatar :size="32" icon="UserFilled" />
            <span>{{ userStore.userInfo?.name }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </header>
    
    <div class="layout-content">
      <aside class="layout-sidebar">
        <el-menu
          :default-active="currentPath"
          router
          :default-openeds="[]"
          unique-opened
        >
          <el-menu-item
            v-for="menu in userStore.menus"
            :key="menu.id"
            :index="menu.path"
          >
            <el-icon><component :is="getIcon(menu.icon)" /></el-icon>
            <template #title>{{ menu.name }}</template>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <main class="layout-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { search } from '@/api'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()

const currentPath = computed(() => route.path)
const searchKeyword = ref('')
const searchLoading = ref(false)
const searchResults = ref([])

const typeLabels = {
  user: '用户',
  product: '商品',
  order: '订单'
}

const getIcon = (iconName) => {
  const iconMap = {
    dashboard: 'Odometer',
    users: 'User',
    box: 'Goods',
    'shopping-cart': 'ShoppingCart',
    'file-text': 'Document'
  }
  return iconMap[iconName] || 'Menu'
}

let searchTimer = null
const handleSearch = (keyword) => {
  if (searchTimer) clearTimeout(searchTimer)
  
  if (!keyword) {
    searchResults.value = []
    return
  }
  
  searchTimer = setTimeout(async () => {
    searchLoading.value = true
    try {
      const res = await search(keyword)
      searchResults.value = res.results
    } catch (error) {
      console.error('搜索失败:', error)
    } finally {
      searchLoading.value = false
    }
  }, 300)
}

const handleSelect = (path) => {
  router.push(path)
  searchKeyword.value = ''
}

const handleCommand = (command) => {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout()
      ElMessage.success('退出成功')
      router.push('/login')
    }).catch(() => {})
  }
}

watch(() => themeStore.isDark, () => {}, { immediate: true })
</script>
