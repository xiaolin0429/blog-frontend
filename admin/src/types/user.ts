// 用户角色
export type UserRole = 'superadmin' | 'admin' | 'user'

// 用户状态
export type UserStatus = 'active' | 'disabled'

// 用户信息
export interface User {
  id: number
  username: string
  nickname: string
  email: string
  avatar?: string
  role: UserRole
  status: UserStatus
  last_login?: string
  date_joined: string
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

// 创建用户参数
export interface CreateUserParams {
  username: string
  password: string
  nickname: string
  email: string
  role: UserRole
}

// 更新用户参数
export interface UpdateUserParams {
  email?: string
  nickname?: string
  bio?: string
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean
  avatar?: File
} 