import request from '@/utils/request'
import type { UserInfo } from '@/store/modules/user'

interface LoginResponse {
  access: string
  refresh: string
  user: UserInfo
}

interface RefreshTokenResponse {
  access: string
}

// 登录
export const login = (data: { username: string; password: string }) => {
  return request.post<LoginResponse>('/auth/login/', data)
}

// 刷新token
export const refreshToken = () => {
  return request.post<RefreshTokenResponse>('/auth/refresh/')
}

// 获取用户信息
export const getUserInfo = () => {
  return request.get<UserInfo>('/user/me/')
}

/**
 * 用户登出
 * @POST /auth/logout/
 */
export function logout() {
  return request.post('/auth/logout/')
} 