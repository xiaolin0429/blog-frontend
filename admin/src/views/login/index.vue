<template>
  <div class="login-container">
    <div class="theme-switch">
      <el-button
        :icon="isDark ? Sunny : Moon"
        circle
        @click="toggleTheme"
      />
    </div>
    <div class="login-card">
      <h2 class="login-title">博客后台管理</h2>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="用户名"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            :prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock, Moon, Sunny } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useThemeStore } from '@/store/common/theme'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const isDark = ref(themeStore.mode === 'dark')

const form = ref({
  username: 'admin',
  password: 'admin123',
  remember: false
})

const rules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
  ]
}

const toggleTheme = () => {
  themeStore.toggleMode()
  isDark.value = themeStore.mode === 'dark'
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const success = await userStore.login({
          username: form.value.username,
          password: form.value.password,
          remember: form.value.remember
        })
        if (success) {
          ElMessage.success('登录成功')
          // 获取重定向地址，如果没有则默认到首页
          const redirect = route.query.redirect?.toString()
          // 移除 URL 中的 redirect 参数
          const { redirect: _, ...query } = route.query
          
          try {
            if (redirect) {
              // 如果有重定向地址，使用完整的路由对象
              await router.replace({
                path: redirect,
                query: query
              })
            } else {
              // 否则直接跳转到首页
              await router.replace('/')
            }
          } catch (routerError) {
            console.error('路由跳转失败:', routerError)
            // 如果跳转失败，强制跳转到首页
            await router.replace('/')
          }
        } else {
          ElMessage.error('登录失败')
        }
      } catch (error: any) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请检查用户名和密码')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style lang="scss">
@use '@/styles/views/login/index.scss';
</style>