import { Router } from 'vue-router'
import { validateToken } from '@/utils/auth'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 白名单路由
const whiteList = ['/login', '/404', '/403']

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start()

    // 白名单直接放行
    if (whiteList.includes(to.path)) {
      next()
      return
    }

    try {
      // 验证 token
      const valid = await validateToken()
      if (!valid) {
        next(`/login?redirect=${to.path}`)
        return
      }

      next()
    } catch (error) {
      console.error('Navigation guard error:', error)
      next('/login')
    }
  })

  router.afterEach(() => {
    NProgress.done()
  })
} 