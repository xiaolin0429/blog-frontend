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
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    console.error('Parse token failed:', error)
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
    return false
  }

  const userStore = useUserStore()
  
  try {
    if (token) {
      // 验证 token 是否过期
      const tokenData = parseToken(token)
      if (!tokenData) {
        throw new Error('Invalid token format')
      }
      
      const expireTime = tokenData.exp * 1000
      
      if (Date.now() >= expireTime) {
        // token 已过期，尝试使用 refresh token
        if (!refreshToken) {
          throw new Error('No refresh token')
        }
        
        // 验证 refresh token 是否过期
        const refreshTokenData = parseToken(refreshToken)
        if (!refreshTokenData) {
          throw new Error('Invalid refresh token format')
        }
        
        const refreshExpireTime = refreshTokenData.exp * 1000
        
        if (Date.now() >= refreshExpireTime) {
          throw new Error('Refresh token expired')
        }
        
        // 尝试刷新 token
        const success = await userStore.refreshToken()
        if (!success) {
          throw new Error('Token refresh failed')
        }
      }
    } else if (refreshToken) {
      // 只有 refresh token，尝试刷新 token
      const refreshTokenData = parseToken(refreshToken)
      if (!refreshTokenData) {
        throw new Error('Invalid refresh token format')
      }
      
      const refreshExpireTime = refreshTokenData.exp * 1000
      
      if (Date.now() >= refreshExpireTime) {
        throw new Error('Refresh token expired')
      }
      
      const success = await userStore.refreshToken()
      if (!success) {
        throw new Error('Token refresh failed')
      }
    }
    
    // 验证用户信息
    if (!userStore.userInfo) {
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