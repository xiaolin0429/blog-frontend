import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getToken, setToken, getRefreshToken, setRefreshToken, clearTokens } from '@/utils/auth/token'
import type { UserInfo, LoginRequest, UpdateProfileRequest, ChangePasswordRequest } from '@/types/api'
import { 
  login as loginApi, 
  getUserInfo as getUserInfoApi,
  updateProfile as updateProfileApi,
  changePassword as changePasswordApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi
} from '@/api/auth'
import router from '@/router'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getToken() || '')
  const refreshTokenValue = ref<string>(getRefreshToken() || '')
  const userInfo = ref<UserInfo | null>(null)
  const loading = ref(false)

  // 登录
  const login = async (data: LoginRequest) => {
    try {
      loading.value = true
      const response = await loginApi(data)
      const { access, refresh, user } = response.data.data
      setToken(access)
      setRefreshToken(refresh)
      token.value = access
      refreshTokenValue.value = refresh
      
      // 登录后立即获取完整的用户信息
      await getUserInfo()
      return true
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 登出
  const logout = async () => {
    try {
      if (refreshTokenValue.value) {
        await logoutApi({ refresh: refreshTokenValue.value })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearTokens()
      userInfo.value = null
      token.value = ''
      refreshTokenValue.value = ''
      if (router.currentRoute.value.path !== '/login') {
        router.push('/login')
      }
    }
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      loading.value = true
      const response = await getUserInfoApi()
      userInfo.value = response.data.data
      return true
    } catch (error) {
      console.error('Get user info failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 更新个人信息
  const updateProfile = async (data: UpdateProfileRequest) => {
    try {
      loading.value = true
      const formData = new FormData()
      if (data.nickname) formData.append('nickname', data.nickname)
      if (data.avatar) formData.append('avatar', data.avatar)
      if (data.bio) formData.append('bio', data.bio)

      const response = await updateProfileApi(formData)
      userInfo.value = response.data.data
      return true
    } catch (error) {
      console.error('Update profile failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 修改密码
  const changePassword = async (data: ChangePasswordRequest) => {
    try {
      loading.value = true
      await changePasswordApi(data)
      return true
    } catch (error) {
      console.error('Change password failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  // 刷新 token
  const refreshToken = async () => {
    try {
      loading.value = true
      const response = await refreshTokenApi({ refresh: refreshTokenValue.value })
      const { access } = response.data.data
      setToken(access)
      token.value = access
      return true
    } catch (error) {
      console.error('Refresh token failed:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    token,
    refreshTokenValue,
    userInfo,
    loading,
    login,
    logout,
    getUserInfo,
    updateProfile,
    changePassword,
    refreshToken
  }
}) 