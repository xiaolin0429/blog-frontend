import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens } from '@/utils/auth/token'
import { login, refreshToken as refreshTokenApi, getUserInfo as getUserInfoApi } from '@/api/auth'
import router from '@/router'

export interface UserInfo {
  id: number
  username: string
  nickname: string
  avatar: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const refreshTokenValue = ref<string>(getRefreshToken() || '')
  const userInfo = ref<UserInfo | null>(null)

  // 登录
  const loginAction = async (username: string, password: string) => {
    try {
      const { access, refresh, user } = await login({ username, password })
      setToken(access)
      setRefreshToken(refresh)
      token.value = access
      refreshTokenValue.value = refresh
      userInfo.value = user
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  // 登出
  const logout = () => {
    clearTokens()
    userInfo.value = null
    token.value = ''
    refreshTokenValue.value = ''
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  }

  // 刷新token
  const refreshTokenAction = async () => {
    try {
      const currentRefreshToken = getRefreshToken()
      if (!currentRefreshToken) {
        throw new Error('No refresh token available')
      }
      const { access } = await refreshTokenApi()
      setToken(access)
      token.value = access
      return true
    } catch (error) {
      console.error('Refresh token failed:', error)
      logout()
      return false
    }
  }

  // 获取用户信息
  const getUserInfoAction = async () => {
    try {
      const currentToken = getToken()
      if (!currentToken) {
        throw new Error('No token available')
      }
      const data = await getUserInfoApi()
      userInfo.value = data
      return true
    } catch (error) {
      console.error('Get user info failed:', error)
      logout()
      return false
    }
  }

  return {
    token,
    refreshTokenValue,
    userInfo,
    login: loginAction,
    logout,
    refreshToken: refreshTokenAction,
    getUserInfo: getUserInfoAction
  }
}) 