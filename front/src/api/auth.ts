import request from '@/utils/http'
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest } from '@/types/api'

export const authApi = {
  // 用户登录
  login: (data: LoginRequest) => {
    return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
  },

  // 刷新Token
  refresh: (refreshToken: string) => {
    return request.post<ApiResponse<{ access: string }>>('/auth/refresh', { refresh: refreshToken })
  },

  // 用户登出
  logout: () => {
    return request.post<ApiResponse<null>>('/auth/logout')
  },

  // 用户注册
  register: (data: RegisterRequest) => {
    return request.post<ApiResponse<{ id: number; username: string; email: string; nickname: string | null }>>('/users', data)
  }
} 