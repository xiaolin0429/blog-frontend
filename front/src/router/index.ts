import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/default/index.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'post/:id',
        name: 'post-detail',
        component: () => import('@/views/post/detail/index.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'category',
        name: 'category',
        component: () => import('@/views/category/index.vue'),
        meta: { title: '分类' }
      },
      {
        path: 'tag',
        name: 'tag',
        component: () => import('@/views/tag/index.vue'),
        meta: { title: '标签' }
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/about/index.vue'),
        meta: { title: '关于' }
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth/index.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/auth/login/index.vue'),
        meta: { title: '登录' }
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('@/views/auth/register/index.vue'),
        meta: { title: '注册' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // 设置页面标题
  document.title = `${to.meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  
  // 需要登录的路由
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 