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

export interface LoginResult {
  token: string
}

export interface RegisterResult {
  id: string
  username: string
  email: string
} 