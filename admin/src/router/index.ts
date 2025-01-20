import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', requiresAuth: true }
      },
      {
        path: 'posts',
        name: 'Posts',
        component: () => import('@/views/post/PostList.vue'),
        meta: { title: '文章管理', requiresAuth: true },
        beforeEnter: (to, from, next) => {
          console.log('Posts route beforeEnter:', { to, from })
          next()
        }
      },
      {
        path: 'posts/create',
        name: 'CreatePost',
        component: () => import('@/views/post/PostEdit.vue'),
        meta: { title: '新建文章', requiresAuth: true }
      },
      {
        path: 'posts/:id/edit',
        name: 'EditPost',
        component: () => import('@/views/post/PostEdit.vue'),
        meta: { title: '编辑文章', requiresAuth: true }
      },
      {
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/comment/CommentListView.vue'),
        meta: { title: '评论管理', requiresAuth: true }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/category/CategoryList.vue'),
        meta: { title: '分类管理', requiresAuth: true }
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/tag/TagList.vue'),
        meta: { title: '标签管理', requiresAuth: true }
      },
      {
        path: 'posts/trash',
        name: 'PostTrash',
        component: () => import('@/views/post/PostTrash.vue'),
        meta: { title: '回收站', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('Global beforeEach:', { to, from })
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 博客后台管理` : '博客后台管理'

  // 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    console.log('Auth check:', { requiresAuth: true, hasToken: !!token })
    if (!token) {
      console.log('No token found, redirecting to login')
      next({ name: 'Login' })
      return
    }
  }
  next()
})

router.afterEach((to, from) => {
  console.log('Route changed:', { to, from })
})

export default router 