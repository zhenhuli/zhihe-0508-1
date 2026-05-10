<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="stat-card">
          <div class="value">{{ stats.users }}</div>
          <div class="label">用户总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="value">{{ stats.products }}</div>
          <div class="label">商品总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="value">{{ stats.orders }}</div>
          <div class="label">订单总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="value">¥{{ stats.revenue.toLocaleString() }}</div>
          <div class="label">总销售额</div>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">最近订单</div>
          <el-table :data="recentOrders" border>
            <el-table-column prop="orderNo" label="订单号" />
            <el-table-column prop="username" label="下单人" />
            <el-table-column prop="totalAmount" label="金额">
              <template #default="{ row }">
                ¥{{ row.totalAmount.toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">
                  {{ getStatusLabel(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-card">
          <div class="chart-title">商品库存预警</div>
          <el-table :data="lowStockProducts" border>
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="stock" label="库存">
              <template #default="{ row }">
                <el-tag :type="row.stock === 0 ? 'danger' : 'warning'">
                  {{ row.stock }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="价格">
              <template #default="{ row }">
                ¥{{ row.price.toLocaleString() }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    
    <div class="chart-card" style="margin-top: 20px;">
      <div class="chart-title">销售趋势</div>
      <div class="placeholder-chart">图表区域（可集成 ECharts）</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { getUsers, getProducts, getOrders } from '@/api'

const themeStore = useThemeStore()

const stats = ref({
  users: 0,
  products: 0,
  orders: 0,
  revenue: 0
})

const recentOrders = ref([])
const lowStockProducts = ref([])

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
  try {
    const [usersRes, productsRes, ordersRes] = await Promise.all([
      getUsers({ pageSize: 100 }),
      getProducts({ pageSize: 100 }),
      getOrders({ pageSize: 100 })
    ])
    
    stats.value = {
      users: usersRes.total,
      products: productsRes.total,
      orders: ordersRes.total,
      revenue: ordersRes.list.reduce((sum, order) => sum + order.totalAmount, 0)
    }
    
    recentOrders.value = ordersRes.list.slice(0, 5)
    lowStockProducts.value = productsRes.list.filter(p => p.stock < 10).slice(0, 5)
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

onMounted(() => {
  fetchData()
})
</script>
