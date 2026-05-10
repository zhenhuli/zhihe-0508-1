<template>
  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center;">
    <h1 style="font-size: 72px; color: #909399; margin: 0;">404</h1>
    <p style="font-size: 20px; color: #606266; margin: 20px 0;">页面不存在</p>
    <el-button type="primary" @click="goBack">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/dashboard')
}
</script>
