import request from '@/utils/request'
import type { LoginParams, RegisterParams } from './types'

export const login = (params: LoginParams) => {
  return request.post('/auth/login', params)
}

export const register = (params: RegisterParams) => {
  return request.post('/auth/register', params)
}

export const logout = () => {
  return request.post('/auth/logout')
}

export const refreshToken = () => {
  return request.post('/auth/refresh')
}

export const getProfile = () => {
  return request.get('/auth/profile')
} 