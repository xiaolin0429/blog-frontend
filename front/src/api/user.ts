import request from '@/utils/http'
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  UpdateUserRequest
} from '@/types/api'

export interface UpdateUserRequest {
  nickname?: string
  avatar?: string
  email?: string
  password?: string
  newPassword?: string
}

export const userApi = {
  // 登录
  login: (data: LoginRequest) => {
    return request.post('/auth/login', data)
  },

  // 注册
  register: (data: RegisterRequest) => {
    return request.post('/auth/register', data)
  },

  // 获取当前用户信息
  getUserInfo: () => {
    return request.get<ApiResponse<User>>('/users/me')
  },

  // 更新当前用户信息
  updateUserInfo: (data: UpdateUserRequest) => {
    return request.put<ApiResponse<User>>('/users/me', data)
  },

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return request.post<ApiResponse<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
} 