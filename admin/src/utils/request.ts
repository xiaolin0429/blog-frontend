import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'
import type { ApiResponse } from '@/types/api'

// 基础配置
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const API_PREFIX = '/api/v1'

// 创建 axios 实例
const service = axios.create({
  baseURL: BASE_URL,  // 使用基础 URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
}) as AxiosInstance

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let retryQueue: ((token: string) => void)[] = []

// 刷新token
const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) {
      throw new Error('No refresh token')
    }
    
    // 使用新的 axios 实例发送请求，避免被拦截器处理
    const refreshService = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const response = await refreshService.post(
      `${API_PREFIX}/auth/refresh/`,
      { refresh }
    )
    
    const { access } = response.data.data
    localStorage.setItem('token', access)
    return access
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    window.location.href = '/login'
    throw error
  }
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 添加 API 前缀
    if (config.url && !config.url.startsWith(API_PREFIX)) {
      config.url = `${API_PREFIX}${config.url}`
    }
    
    console.log('Request:', {
      url: config.url,
      method: config.method,
      params: config.params,
      data: config.data
    })
    
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 记录响应信息
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    // 直接返回响应数据
    return response.data
  },
  async (error) => {
    const { config, response } = error
    
    // 如果是401错误，且不是刷新token的请求
    if (response?.status === 401 && !config.url.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          // 尝试刷新token
          const newToken = await refreshToken()
          // 重试队列中的请求
          retryQueue.forEach(cb => cb(newToken))
          retryQueue = []
          // 重试当前请求
          config.headers.Authorization = `Bearer ${newToken}`
          return service(config)
        } catch (err) {
          console.error('Token refresh failed:', err)
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      } else {
        // 将请求加入重试队列
        return new Promise(resolve => {
          retryQueue.push((token: string) => {
            config.headers.Authorization = `Bearer ${token}`
            resolve(service(config))
          })
        })
      }
    }

    let message = '请求失败'
    if (response?.data?.detail) {
      message = response.data.detail
    } else if (response?.data?.message) {
      message = response.data.message
    } else if (response?.status === 403) {
      message = '禁止访问'
    } else if (response?.status === 404) {
      message = '请求的资源不存在'
    } else if (response?.status === 429) {
      message = '请求过于频繁，请稍后再试'
    } else if (response?.status === 500) {
      message = '服务器错误'
    } else if (!response) {
      message = '网络错误，请检查网络连接'
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

// 请求实例类型定义
interface RequestInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
}

// 请求实例
const request: RequestInstance = {
  get: (url, config) => service.get(url, config),
  post: (url, data, config) => service.post(url, data, config),
  put: (url, data, config) => service.put(url, data, config),
  delete: (url, config) => service.delete(url, config)
}

export default request 