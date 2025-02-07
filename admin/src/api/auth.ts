import request from '@/utils/request'
import type { 
  ApiResponse, 
  UserInfo,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  LogoutRequest
} from '@/types/api'
import type { AxiosResponse } from 'axios'

interface LoginData {
  access: string
  refresh: string
  user: UserInfo
}

interface RefreshData {
  access: string
  expires_in: number
}

interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

interface TokenStatus {
  active: boolean
  expires_at: string
  expires_in: number
}

// 用户注册
export function register(data: RegisterRequest): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  return request.post<ApiResponse<UserInfo>>('/user/register', data)
}

// 用户登录
export function login(data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
  return request.post<ApiResponse<LoginResponse>>('/auth/login/', data, {
    headers: {
      'X-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  })
}

// 获取个人信息
export function getUserInfo(): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  return request.get<ApiResponse<UserInfo>>('/user/me')
}

// 更新个人信息
export function updateProfile(data: FormData): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  return request.patch<ApiResponse<UserInfo>>('/user/me', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 修改密码
export function changePassword(data: {
  old_password: string
  new_password: string
  confirm_password: string
}): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.put<ApiResponse<null>>('/user/me/password', data)
}

// 用户登出
export function logout(data: LogoutRequest): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.post<ApiResponse<null>>('/auth/logout/', data)
}

// 刷新Token
export function refreshToken(data: { refresh: string }): Promise<AxiosResponse<ApiResponse<{ access: string; expires_in: number }>>> {
  return request.post<ApiResponse<{ access: string; expires_in: number }>>('/auth/refresh/', data)
}

// 检查Token状态
export function checkToken(): Promise<AxiosResponse<ApiResponse<{ active: boolean; expires_at: string; expires_in: number }>>> {
  return request.get<ApiResponse<{ active: boolean; expires_at: string; expires_in: number }>>('/auth/check/')
} 