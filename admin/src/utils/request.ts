import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { refreshToken } from '@/api/auth'
import { getToken } from '@/utils/auth/token'

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: '/api/v1',  // 修改为正确的 baseURL
  timeout: 15000,
  withCredentials: false,  // 关闭 withCredentials
  headers: {
    'Content-Type': 'application/json'
  }
})

// 是否正在刷新token
let isRefreshing = false
// 重试队列
let retryQueue: ((token: string) => void)[] = []

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 使用 getToken 工具函数获取 token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      // 打印认证信息（注意隐藏敏感信息）
      console.log('Request headers:', {
        ...config.headers,
        'Authorization': config.headers['Authorization']?.substring(0, 20) + '...'
      })
    } else {
      console.warn('No access token found')
    }
    
    // 添加时区信息
    config.headers['X-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone
    
    // 打印请求信息，方便调试
    console.log('Request details:', {
      url: `${config.baseURL || ''}${config.url || ''}`,
      method: config.method,
      data: config.data ? {
        ...config.data,
        password: config.data.password ? '******' : undefined
      } : undefined,
      headers: {
        ...config.headers,
        'Authorization': typeof config.headers['Authorization'] === 'string' 
          ? config.headers['Authorization'].substring(0, 20) + '...'
          : config.headers['Authorization']
      }
    })
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { code, message, data } = response.data
    
    // 打印响应信息，方便调试
    console.log('Response details:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
      headers: response.headers
    })
    
    // 处理业务错误
    if (code && code !== 200 && code !== 201 && code !== 204) {
      // 处理包含详细错误信息的情况
      let errorMessage = message
      if (data?.errors) {
        // 收集所有错误信息
        const errors = Object.entries(data.errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
          .filter(msg => msg)
        if (errors.length > 0) {
          errorMessage = errors.join('; ')
        }
      }
      
      console.error('Business error:', {
        code,
        message: errorMessage,
        data,
        requestData: response.config.data
      })
      
      ElMessage.error(errorMessage || '操作失败')
      return Promise.reject(new Error(errorMessage || '操作失败'))
    }
    
    return response
  },
  async (error) => {
    // 打印详细错误信息
    console.error('Response error details:', {
      config: {
        url: error.config?.baseURL + error.config?.url,
        method: error.config?.method,
        data: error.config?.data ? {
          ...error.config.data,
          password: error.config.data.password ? '******' : undefined
        } : undefined,
        headers: {
          ...error.config?.headers,
          'Authorization': error.config?.headers?.Authorization?.substring(0, 20) + '...'
        }
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : 'No response',
      message: error.message
    })
    
    const { config, response } = error
    
    // 如果是401错误，且不是刷新token的请求
    if (response?.status === 401 && !config.url.includes('/auth/refresh/')) {
      if (!isRefreshing) {
        isRefreshing = true
        try {
          // 尝试刷新token
          const refresh = localStorage.getItem('refresh_token')
          if (!refresh) {
            throw new Error('No refresh token')
          }
          const response = await refreshToken({ refresh })
          const newToken = response.data.data.access
          // 更新token
          localStorage.setItem('access_token', newToken)
          // 重试队列中的请求
          retryQueue.forEach(cb => cb(newToken))
          retryQueue = []
          // 重试当前请求
          config.headers['Authorization'] = `Bearer ${newToken}`
          return service(config)
        } catch (err) {
          console.error('Token refresh failed:', err)
          // 刷新失败，清除token并跳转到登录页
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          router.push('/login')
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      } else {
        // 将请求加入重试队列
        return new Promise(resolve => {
          retryQueue.push((token: string) => {
            config.headers['Authorization'] = `Bearer ${token}`
            resolve(service(config))
          })
        })
      }
    }

    // 统一错误处理
    let message = '请求失败'
    if (response?.data?.message) {
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

    // 如果是400错误，尝试获取更详细的错误信息
    if (response?.status === 400 && response?.data?.errors) {
      const errors = Object.entries(response.data.errors)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`)
        .filter(msg => msg)
      if (errors.length > 0) {
        message = errors.join('; ')
      }
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service 