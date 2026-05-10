<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">订单管理</div>
      <el-button type="primary" :icon="'Plus'" @click="handleAdd">
        新增订单
      </el-button>
    </div>
    
    <div class="table-filter">
      <el-form :inline="true" :model="filterForm" @submit.prevent>
        <el-form-item label="关键词">
          <el-input 
            v-model="filterForm.search" 
            placeholder="搜索订单号/用户名"
            clearable
            @keyup.enter="fetchData"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="配送中" value="shipping" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="filterForm.paymentMethod" placeholder="全部" clearable>
            <el-option label="支付宝" value="alipay" />
            <el-option label="微信支付" value="wechat" />
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
      <el-table-column prop="orderNo" label="订单号" />
      <el-table-column prop="username" label="下单人" />
      <el-table-column prop="totalAmount" label="订单金额">
        <template #default="{ row }">
          ¥{{ row.totalAmount.toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式">
        <template #default="{ row }">
          {{ row.paymentMethod === 'alipay' ? '支付宝' : '微信支付' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shippingAddress" label="收货地址" show-overflow-tooltip />
      <el-table-column prop="createdAt" label="下单时间" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleView(row)">查看</el-button>
          <el-button type="success" link @click="handleEdit(row)" v-if="row.status !== 'completed'">编辑</el-button>
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
      :title="isView ? '订单详情' : (isEdit ? '编辑订单' : '新增订单')" 
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="100px" v-if="!isView">
        <el-form-item label="收货地址" prop="shippingAddress">
          <el-input 
            v-model="formData.shippingAddress" 
            type="textarea" 
            :rows="2" 
            placeholder="请输入收货地址"
          />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择状态" style="width: 100%;">
            <el-option label="待处理" value="pending" />
            <el-option label="配送中" value="shipping" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-form-item>
      </el-form>
      
      <div v-if="isView">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="订单号">{{ formData.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="下单人">{{ formData.username }}</el-descriptions-item>
          <el-descriptions-item label="订单金额">¥{{ formData.totalAmount?.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="支付方式">
            {{ formData.paymentMethod === 'alipay' ? '支付宝' : '微信支付' }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <el-tag :type="getStatusType(formData.status)">
              {{ getStatusLabel(formData.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="收货地址">{{ formData.shippingAddress }}</el-descriptions-item>
          <el-descriptions-item label="下单时间">{{ formData.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <el-button @click="dialogVisible = false" v-if="isView">关闭</el-button>
        <template v-else>
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确定</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useThemeStore } from '@/stores/theme'
import { getOrders, createOrder, updateOrder, deleteOrder } from '@/api'

const themeStore = useThemeStore()

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const submitLoading = ref(false)
const formRef = ref(null)

const filterForm = reactive({
  search: '',
  status: '',
  paymentMethod: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  id: null,
  orderNo: '',
  username: '',
  totalAmount: 0,
  paymentMethod: 'alipay',
  status: 'pending',
  shippingAddress: '',
  createdAt: ''
})

const formRules = {
  shippingAddress: [{ required: true, message: '请输入收货地址', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    shipping: 'primary',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = {
    pending: '待处理',
    shipping: '配送中',
    completed: '已完成'
  }
  return map[status] || status
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await getOrders({
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
  filterForm.status = ''
  filterForm.paymentMethod = ''
  fetchData()
}

const handleAdd = () => {
  isEdit.value = false
  isView.value = false
  Object.assign(formData, {
    id: null,
    orderNo: '',
    username: '',
    totalAmount: 0,
    paymentMethod: 'alipay',
    status: 'pending',
    shippingAddress: '',
    createdAt: ''
  })
  dialogVisible.value = true
}

const handleView = (row) => {
  isEdit.value = false
  isView.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  isView.value = false
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除订单"${row.orderNo}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteOrder(row.id)
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
      await updateOrder(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await createOrder({
        products: [],
        totalAmount: 0,
        paymentMethod: formData.paymentMethod,
        shippingAddress: formData.shippingAddress
      })
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
