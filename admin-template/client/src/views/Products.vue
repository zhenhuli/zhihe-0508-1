<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">商品管理</div>
      <el-button type="primary" :icon="'Plus'" @click="handleAdd">
        新增商品
      </el-button>
    </div>
    
    <div class="table-filter">
      <el-form :inline="true" :model="filterForm" @submit.prevent>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.search" 
            placeholder="搜索商品名称/描述"
            clearable
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="全部" clearable>
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="上架" value="active" />
            <el-option label="下架" value="inactive" />
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
      <el-table-column prop="name" label="商品名称" />
      <el-table-column prop="category" label="分类" />
      <el-table-column prop="price" label="价格">
        <template #default="{ row }">
          ¥{{ row.price.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存">
        <template #default="{ row }">
          <el-tag :type="row.stock === 0 ? 'danger' : row.stock < 10 ? 'warning' : 'success'">
            {{ row.stock }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
      <el-table-column label="操作" width="200">
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
      :title="isEdit ? '编辑商品' : '新增商品'" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%;">
            <el-option label="电子产品" value="电子产品" />
            <el-option label="服装" value="服装" />
            <el-option label="食品" value="食品" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input-number v-model="formData.stock" :min="0" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="active">上架</el-radio>
            <el-radio value="inactive">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="formData.description" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入商品描述"
          />
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
import { useThemeStore } from '@/stores/theme'
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api'

const themeStore = useThemeStore()

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const filterForm = reactive({
  search: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  id: null,
  name: '',
  category: '电子产品',
  price: 0,
  stock: 0,
  status: 'active',
  description: ''
})

const formRules = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  stock: [{ required: true, message: '请输入库存', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  description: [{ required: true, message: '请输入商品描述', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getProducts({
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
  filterForm.category = ''
  filterForm.status = ''
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: null,
    name: '',
    category: '电子产品',
    price: 0,
    stock: 0,
    status: 'active',
    description: ''
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除商品"${row.name}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteProduct(row.id)
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
      await updateProduct(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await createProduct(formData)
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
