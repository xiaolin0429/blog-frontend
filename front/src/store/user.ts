import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义用户存储
export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<any>(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  
  // 设置token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }
  
  // 设置用户信息
  function setUserInfo(info: any) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }
  
  // 登出
  function logout() {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }
  
  // 检查是否已登录
  const isLoggedIn = () => !!token.value

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    logout,
    isLoggedIn
  }
}) 