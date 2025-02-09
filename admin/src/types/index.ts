export * from './trash'

// 用户角色类型
export type UserRole = 'superadmin' | 'admin' | 'user'

// 用户状态类型
export type UserStatus = 'active' | 'disabled'

// 用户类型
export interface User {
  id: number
  username: string
  nickname: string
  email: string
  avatar?: string
  role: UserRole
  status: UserStatus
  lastLoginAt?: string
  createdAt: string
  updatedAt?: string
}

// 用户查询参数
export interface UserQuery {
  keyword?: string
  role?: UserRole
  status?: UserStatus
  page?: number
  size?: number
  ordering?: string
}

// 用户创建参数
export interface CreateUserParams {
  username: string
  password: string
  nickname: string
  email: string
  role: UserRole
}

// 用户更新参数
export interface UpdateUserParams {
  email?: string
  nickname?: string
  bio?: string
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  avatar?: File
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
} 