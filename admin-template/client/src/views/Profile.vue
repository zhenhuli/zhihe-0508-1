<template>
  <div class="page-container">
    <div class="page-header">
      <div class="page-title">个人中心</div>
    </div>
    
    <div class="profile-grid">
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>基本信息</span>
          </div>
        </template>
        <el-form :model="profileForm" :rules="profileRules" ref="profileRef" label-width="100px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="profileForm.username" disabled />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="profileForm.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="手机" prop="phone">
            <el-input v-model="profileForm.phone" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-tag :type="profileForm.role === 'admin' ? 'danger' : 'primary'">
              {{ profileForm.role === 'admin' ? '管理员' : '普通员工' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-tag :type="profileForm.status === 'active' ? 'success' : 'info'">
              {{ profileForm.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </el-form-item>
          <el-form-item label="创建时间">
            <span>{{ profileForm.createdAt }}</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="submitLoading" @click="handleSaveProfile">
              保存修改
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
      
      <el-card class="profile-card">
        <template #header>
          <div class="card-header">
            <span>修改密码</span>
          </div>
        </template>
        <el-form :model="passwordForm" :rules="passwordRules" ref="passwordRef" label-width="100px">
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input 
              v-model="passwordForm.oldPassword" 
              type="password" 
              show-password
              placeholder="请输入旧密码"
            />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input 
              v-model="passwordForm.newPassword" 
              type="password" 
              show-password
              placeholder="请输入新密码（至少6位）"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="passwordForm.confirmPassword" 
              type="password" 
              show-password
              placeholder="请再次输入新密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="passwordLoading" @click="handleChangePassword">
              修改密码
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getProfile, updateProfile, updatePassword } from '@/api'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const submitLoading = ref(false)
const passwordLoading = ref(false)
const profileRef = ref(null)
const passwordRef = ref(null)

const profileForm = reactive({
  id: null,
  username: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  status: '',
  createdAt: ''
})

const profileRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== passwordForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

const fetchProfile = async () => {
  try {
    const res = await getProfile()
    Object.assign(profileForm, res)
  } catch (error) {
    console.error('获取个人信息失败:', error)
  }
}

const handleSaveProfile = async () => {
  const valid = await profileRef.value.validate().catch(() => false)
  if (!valid) return
  
  submitLoading.value = true
  try {
    await updateProfile({
      name: profileForm.name,
      email: profileForm.email,
      phone: profileForm.phone
    })
    
    userStore.userInfo.name = profileForm.name
    userStore.userInfo.email = profileForm.email
    localStorage.setItem('userInfo', JSON.stringify(userStore.userInfo))
    
    ElMessage.success('个人信息更新成功')
  } catch (error) {
    console.error('更新个人信息失败:', error)
  } finally {
    submitLoading.value = false
  }
}

const handleChangePassword = async () => {
  const valid = await passwordRef.value.validate().catch(() => false)
  if (!valid) return
  
  passwordLoading.value = true
  try {
    await updatePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    })
    
    ElMessage.success('密码修改成功，请重新登录')
    
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    setTimeout(() => {
      userStore.logout()
    }, 1500)
  } catch (error) {
    console.error('修改密码失败:', error)
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  if (userStore.userInfo) {
    Object.assign(profileForm, userStore.userInfo)
  }
  fetchProfile()
})
</script>

<style scoped>
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .profile-grid {
    grid-template-columns: 1fr;
  }
}

.profile-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
