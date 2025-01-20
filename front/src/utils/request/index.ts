import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '@/store/modules/auth'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  // 跨域请求时是否需要使用凭证
  withCredentials: true
})

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authStore.token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message } = response.data
    
    // 这里根据后端的响应结构进行调整
    if (code === 200 || code === 0) {
      return data
    }
    
    // 处理特定的错误码
    switch (code) {
      case 401:
        // 未授权，清除用户信息并跳转到登录页
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/auth/login'
        break
      case 403:
        // 权限不足
        console.error('权限不足')
        break
      case 404:
        // 资源不存在
        console.error('请求的资源不存在')
        break
      default:
        // 其他错误
        console.error(message || '请求失败')
    }
    
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除用户信息并跳转到登录页
          const authStore = useAuthStore()
          authStore.logout()
          window.location.href = '/auth/login'
          break
        case 403:
          console.error('权限不足')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error(`请求失败：${error.message}`)
      }
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('网络错误，请检查您的网络连接')
    } else {
      // 请求配置出错
      console.error('请求配置错误：', error.message)
    }
    return Promise.reject(error)
  }
)

export default request 