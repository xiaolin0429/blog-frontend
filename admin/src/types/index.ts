export * from './trash'

// 用户角色类型
export type UserRole = 'admin' | 'user'

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
export interface UserCreate {
  username: string
  nickname: string
  email: string
  password: string
  role?: UserRole
}

// 用户更新参数
export interface UserUpdate {
  nickname?: string
  email?: string
  role?: UserRole
  status?: UserStatus
}

// 分页响应类型
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
} 