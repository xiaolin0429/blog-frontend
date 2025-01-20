<template>
  <div class="register-container">
    <el-card class="register-card">
      <template #header>
        <h2 class="card-title">注册</h2>
      </template>
      
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="0"
        @keyup.enter="handleSubmit"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input
            v-model="form.email"
            placeholder="邮箱"
            prefix-icon="Message"
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <el-form-item prop="agreement">
          <el-checkbox v-model="form.agreement">
            我已阅读并同意
            <el-link type="primary" :underline="false">服务条款</el-link>
            和
            <el-link type="primary" :underline="false">隐私政策</el-link>
          </el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="submit-btn"
            @click="handleSubmit"
          >
            注册
          </el-button>
        </el-form-item>
        
        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login">立即登录</router-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Message } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/user'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validatePass = (_rule: any, value: string, callback: Function) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, message: '用户名长度不能小于4位', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePass, trigger: 'blur' }
  ],
  agreement: [
    {
      validator: (_rule: any, value: boolean, callback: Function) => {
        if (!value) {
          callback(new Error('请阅读并同意服务条款和隐私政策'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await userStore.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    
    ElMessage.success('注册成功')
    router.push('/login')
  } catch (error: any) {
    ElMessage.error(error.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-card {
  width: 100%;
  max-width: 400px;
  
  .card-title {
    text-align: center;
    margin: 0;
    font-size: 24px;
    color: #303133;
  }
}

.submit-btn {
  width: 100%;
}

.form-footer {
  margin-top: 20px;
  text-align: center;
  color: #606266;
  
  a {
    margin-left: 5px;
    color: #409eff;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 