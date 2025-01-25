export interface User {
  id: number
  username: string
  nickname: string | null
  email: string
  role: string
  status: string
  avatar: string | null
  bio: string | null
  lastLogin: string | null
  createdAt: string
  updatedAt: string
} 