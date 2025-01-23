import { useUserStore } from '@/store/modules/user'
import { getToken, getRefreshToken } from './token'
import router from '@/router'

// Token 过期时间（毫秒）
const TOKEN_EXPIRE_TIME = 2 * 60 * 60 * 1000 // 2小时
const REFRESH_TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000 // 7天

/**
 * 解析JWT token
 */
const parseToken = (token: string) => {
  try {
    console.log('Parsing token:', token) // 添加日志
    if (!token || typeof token !== 'string') {
      console.error('Invalid token type:', typeof token)
      return null
    }
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Invalid token format: not a JWT token')
      return null
    }
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Parse token failed:', error)
    console.error('Token:', token)
    return null
  }
}

/**
 * 验证 token 是否有效
 */
export const validateToken = async () => {
  const token = getToken()
  const refreshToken = getRefreshToken()
  
  if (!token && !refreshToken) {
    console.log('No tokens found')
    return false
  }

  const userStore = useUserStore()
  
  try {
    // 如果有 token，先尝试使用 token
    if (token) {
      console.log('Validating access token')
      const tokenData = parseToken(token)
      
      // token 无效或已过期，尝试使用 refresh token
      if (!tokenData || Date.now() >= tokenData.exp * 1000) {
        console.log('Access token invalid or expired, trying refresh token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }
        
        const refreshTokenData = parseToken(refreshToken)
        if (!refreshTokenData || Date.now() >= refreshTokenData.exp * 1000) {
          throw new Error('Refresh token invalid or expired')
        }
        
        // 尝试刷新 token
        const success = await userStore.refreshToken()
        if (!success) {
          throw new Error('Token refresh failed')
        }
      }
    } else if (refreshToken) {
      // 只有 refresh token 的情况
      console.log('Only refresh token available')
      const refreshTokenData = parseToken(refreshToken)
      if (!refreshTokenData || Date.now() >= refreshTokenData.exp * 1000) {
        throw new Error('Refresh token invalid or expired')
      }
      
      const success = await userStore.refreshToken()
      if (!success) {
        throw new Error('Token refresh failed')
      }
    }
    
    // 验证用户信息
    if (!userStore.userInfo) {
      console.log('Fetching user info')
      const success = await userStore.getUserInfo()
      if (!success) {
        throw new Error('Get user info failed')
      }
    }
    
    return true
  } catch (error) {
    console.error('Token validation failed:', error)
    userStore.logout()
    return false
  }
}

/**
 * 页面刷新时的权限验证
 */
export const validateOnPageRefresh = async () => {
  try {
    // 如果当前在登录页面，不需要验证
    if (router.currentRoute.value.path === '/login') {
      return
    }
    
    const valid = await validateToken()
    if (!valid) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    console.error('Page refresh validation failed:', error)
    const userStore = useUserStore()
    userStore.logout()
  }
} 