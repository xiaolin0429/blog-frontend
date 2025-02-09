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
import type { User, UserQuery, CreateUserParams, UpdateUserParams } from '@/types/user'

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

// 获取用户列表
export const getUsers = (params: UserQuery) => {
  return request.get<{
    count: number
    next: string | null
    previous: string | null
    results: User[]
  }>('/user/admin/users/', { params })
}

// 获取用户详情
export const getUser = (id: number) => {
  return request.get<ApiResponse<User>>(`/user/admin/users/${id}/`)
}

// 创建用户
export const createUser = (data: CreateUserParams) => {
  return request.post<ApiResponse<User>>('/user/admin/users/', data)
}

// 更新用户
export const updateUser = (id: number, data: UpdateUserParams) => {
  const formData = new FormData()
  
  // 添加普通字段
  if (data.email) formData.append('email', data.email)
  if (data.nickname) formData.append('nickname', data.nickname)
  if (data.bio) formData.append('bio', data.bio)
  if (typeof data.is_active === 'boolean') formData.append('is_active', String(data.is_active))
  if (typeof data.is_staff === 'boolean') formData.append('is_staff', String(data.is_staff))
  if (typeof data.is_superuser === 'boolean') formData.append('is_superuser', String(data.is_superuser))
  
  // 添加文件
  if (data.avatar) formData.append('avatar', data.avatar)
  
  return request.put<ApiResponse<User>>(`/user/admin/users/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete<ApiResponse<null>>(`/user/admin/users/${id}/`)
}

// 批量删除用户
export const batchDeleteUsers = (ids: number[]) => {
  return request.delete<ApiResponse<null>>('/user/admin/users/', { data: { ids } })
}

// 激活用户
export const activateUser = (id: number) => {
  return request.post<ApiResponse<null>>(`/user/admin/users/${id}/activate/`)
}

// 禁用用户
export const deactivateUser = (id: number) => {
  return request.post<ApiResponse<null>>(`/user/admin/users/${id}/deactivate/`)
}

// 设置管理员权限
export const setUserAdmin = (id: number) => {
  return request.post<ApiResponse<null>>(`/user/admin/users/${id}/set_admin/`)
}

// 移除管理员权限
export const removeUserAdmin = (id: number) => {
  return request.post<ApiResponse<null>>(`/user/admin/users/${id}/remove_admin/`)
}

// 重置用户密码
export const resetUserPassword = (id: number, newPassword: string) => {
  return request.post<ApiResponse<null>>(`/user/admin/users/${id}/reset_password/`, {
    new_password: newPassword
  })
} 