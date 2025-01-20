import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'

interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

interface LoginResult {
  refresh: string
  access: string
  user: {
    id: number
    username: string
    email: string
    nickname: string | null
    avatar: string | null
    date_joined: string
    last_login: string | null
  }
}

/**
 * 用户登录
 * @POST /auth/login/
 */
export function login(data: LoginParams) {
  return request.post<ApiResponse<LoginResult>>('/auth/login/', data)
}

/**
 * 用户登出
 * @POST /auth/logout/
 */
export function logout() {
  return request.post('/auth/logout/')
}

/**
 * 刷新Token
 * @POST /auth/refresh/
 */
export function refreshToken(refresh: string) {
  return request.post<ApiResponse<{ access: string }>>('/auth/refresh/', { refresh })
} 