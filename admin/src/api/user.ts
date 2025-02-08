import type { AxiosResponse } from 'axios'
import type { 
  ApiResponse,
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  UserInfo,
  UpdateProfileRequest,
  ChangePasswordRequest,
  LogoutRequest
} from '@/types/api'
import request from '@/utils/request'

// 用户注册
export function register(data: RegisterRequest): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  return request.post<ApiResponse<UserInfo>>('/user/register', data)
}

// 用户登录
export function login(data: LoginRequest): Promise<AxiosResponse<ApiResponse<LoginResponse>>> {
  return request.post<ApiResponse<LoginResponse>>('/user/login', data)
}

// 获取个人信息
export function getUserInfo(): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  return request.get<ApiResponse<UserInfo>>('/user/me')
}

// 更新个人信息
export function updateProfile(data: UpdateProfileRequest): Promise<AxiosResponse<ApiResponse<UserInfo>>> {
  const formData = new FormData()
  if (data.nickname) formData.append('nickname', data.nickname)
  if (data.avatar) formData.append('avatar', data.avatar)
  if (data.bio) formData.append('bio', data.bio)
  
  return request.patch<ApiResponse<UserInfo>>('/user/me', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 修改密码
export function changePassword(data: ChangePasswordRequest): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.put<ApiResponse<null>>('/user/me/password', data)
}

// 用户登出
export function logout(data: LogoutRequest): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.post<ApiResponse<null>>('/user/logout', data)
}

// 上传用户头像
export function uploadUserAvatar(data: FormData): Promise<AxiosResponse<ApiResponse<string>>> {
  return request.post<ApiResponse<string>>('/users/avatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 