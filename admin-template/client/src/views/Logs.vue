<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">操作日志</div>
    </div>
    
    <div class="table-filter">
      <el-form :inline="true" :model="filterForm" @submit.prevent>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.search" 
            placeholder="搜索用户名/操作/目标"
            clearable
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="操作人" />
      <el-table-column prop="action" label="操作" />
      <el-table-column prop="target" label="操作目标" />
      <el-table-column prop="time" label="操作时间" />
      <el-table-column prop="ip" label="IP地址" />
    </el-table>
    
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="pagination.total"
      layout="total, sizes, prev, pager, next, jumper"
      style="margin-top: 20px; justify-content: flex-end;"
      @size-change="fetchData"
      @current-change="fetchData"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getLogs } from '@/api'

const themeStore = useThemeStore()

const loading = ref(false)
const tableData = ref([])

const filterForm = reactive({
  search: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getLogs({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filterForm
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

const resetFilter = () => {
  filterForm.search = ''
  fetchData()
}

onMounted(() => {
  fetchData()
})
</script>
