export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
}

export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

export interface RegisterParams {
  username: string
  email: string
  password: string
  confirmPassword: string
} 