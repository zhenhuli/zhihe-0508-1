<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">用户管理</div>
      <el-button type="primary" :icon="'Plus'" @click="handleAdd" v-if="userStore.isAdmin">
        新增用户
      </el-button>
    </div>
    
    <div class="table-filter">
      <el-form :inline="true" :model="filterForm" @submit.prevent>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.search" 
            placeholder="搜索用户名/姓名/邮箱"
            clearable
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="filterForm.role" placeholder="全部" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="普通员工" value="employee" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
            {{ row.role === 'admin' ? '管理员' : '普通员工' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" />
      <el-table-column label="操作" width="200" v-if="userStore.isAdmin">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
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
    
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? '编辑用户' : '新增用户'" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="用户名" prop="username" v-if="!isEdit">
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%;">
            <el-option label="管理员" value="admin" />
            <el-option label="普通员工" value="employee" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">启用</el-radio>
            <el-radio value="inactive">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import { getUsers, createUser, updateUser, deleteUser } from '@/api'

const userStore = useUserStore()
const themeStore = useThemeStore()

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const filterForm = reactive({
  search: '',
  role: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  id: null,
  username: '',
  name: '',
  email: '',
  role: 'employee',
  status: 'active'
})

const formRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getUsers({
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
  filterForm.role = ''
  filterForm.status = ''
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: null,
    username: '',
    name: '',
    email: '',
    role: 'employee',
    status: 'active'
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除用户"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteUser(row.id)
      ElMessage.success('删除成功')
      fetchData()
    } catch (error) {
      console.error('删除失败:', error)
    }
  }).catch(() => {})
}

const handleSubmit = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  try {
    if (isEdit.value) {
      await updateUser(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await createUser(formData)
      ElMessage.success('创建成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>
