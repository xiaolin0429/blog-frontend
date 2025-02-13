import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { refreshToken } from '@/api/auth'
import { getToken } from '@/utils/auth/token'
import { useUserStore } from '@/store/modules/user'

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
    
    // 对于 204 No Content 状态码，直接返回响应
    if (response.status === 204) {
      return response
    }
    
    // 处理业务错误
    if (code && code !== 200 && code !== 201 && code !== 204) {
      // 处理包含详细错误信息的情况
      let errorMessage = message
      if (data) {
        // 收集所有错误信息
        const errors = Object.entries(data)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
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
    
    // 对于 201 Created 状态码，直接返回响应
    if (response.status === 201) {
      return response
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
    
    const { response } = error
    let message = '请求失败'

    // 处理包含详细错误信息的情况
    if (response?.data?.data) {
      const errors = Object.entries(response.data.data)
        .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .filter(msg => msg)
      if (errors.length > 0) {
        message = errors.join('; ')
      } else {
        message = response.data.message || message
      }
    } else if (response?.data?.message) {
      message = response.data.message
    } else {
      // 处理HTTP错误
      switch (response?.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          // 避免在登出接口返回401时再次调用登出
          if (!error.config.url.includes('/auth/logout')) {
            message = '未登录或登录已过期'
            // 清除用户信息并跳转到登录页
            const userStore = useUserStore()
            await userStore.logout()
            router.push('/login')
          }
          break
        case 403:
          message = '没有权限执行此操作'
          break
        case 404:
          message = '请求的资源不存在'
          break
        case 429:
          message = '请求过于频繁，请稍后再试'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          if (!response) {
            message = '网络错误，请检查网络连接'
          }
      }
    }

    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service 