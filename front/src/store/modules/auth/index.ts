import { defineStore } from 'pinia'
import type { AuthState, LoginParams } from './types'
import * as authApi from '@/api/modules/auth'
import { setToken, removeToken } from '@/utils/storage'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null,
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    userProfile: (state) => state.user
  },

  actions: {
    async login(params: LoginParams) {
      try {
        this.loading = true
        const { token, user } = await authApi.login(params)
        this.token = token
        this.user = user
        setToken(token)
        return true
      } catch (error) {
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authApi.logout()
      } finally {
        this.token = null
        this.user = null
        removeToken()
      }
    },

    async getProfile() {
      try {
        const user = await authApi.getProfile()
        this.user = user
        return user
      } catch (error) {
        return null
      }
    }
  }
}) 