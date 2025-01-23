import request from '@/utils/request'
import type { UserInfo } from '@/store/modules/user'
import type { ApiResponse } from '@/types/api'

interface LoginData {
  access: string
  refresh: string
  user: UserInfo
}

interface RefreshData {
  access: string
}

// 登录
export const login = (data: { username: string; password: string }) => {
  return request.post<ApiResponse<LoginData>>('/auth/login/', data)
}

// 刷新token
export const refreshToken = () => {
  return request.post<ApiResponse<RefreshData>>('/auth/refresh/')
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get<ApiResponse<UserInfo>>('/user/me/')
}

/**
 * 用户登出
 * @POST /auth/logout/
 */
export function logout() {
  return request.post<ApiResponse<null>>('/auth/logout/')
} 