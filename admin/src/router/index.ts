import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import BasicLayout from '@/layouts/BasicLayout.vue'
import { validateToken } from '@/utils/auth'

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
        path: 'comments',
        name: 'Comments',
        component: () => import('@/views/comment/CommentListView.vue'),
        meta: { title: '评论管理', requiresAuth: true }
      },
      {
        path: 'posts/trash',
        name: 'PostTrash',
        component: () => import('@/views/post/PostTrash.vue'),
        meta: { title: '回收站', requiresAuth: true }
      },
      {
        path: 'pages',
        name: 'Pages',
        component: () => import('@/views/page/PageList.vue'),
        meta: { title: '页面管理', requiresAuth: true }
      },
      {
        path: 'attachments',
        name: 'Attachments',
        component: () => import('@/views/attachment/AttachmentList.vue'),
        meta: { title: '附件管理', requiresAuth: true }
      },
      {
        path: 'links',
        name: 'Links',
        component: () => import('@/views/link/LinkList.vue'),
        meta: { title: '链接管理', requiresAuth: true }
      },
      {
        path: 'moments',
        name: 'Moments',
        component: () => import('@/views/moment/MomentList.vue'),
        meta: { title: '瞬间管理', requiresAuth: true }
      },
      {
        path: 'appearance',
        name: 'Appearance',
        component: () => import('@/views/appearance/AppearanceList.vue'),
        meta: { title: '外观', requiresAuth: true }
      },
      {
        path: 'themes',
        name: 'Themes',
        component: () => import('@/views/appearance/ThemeList.vue'),
        meta: { title: '主题', requiresAuth: true }
      },
      {
        path: 'menus',
        name: 'Menus',
        component: () => import('@/views/appearance/MenuList.vue'),
        meta: { title: '菜单', requiresAuth: true }
      },
      // 系统相关路由
      {
        path: 'plugins',
        name: 'Plugins',
        component: () => import('@/views/system/PluginList.vue'),
        meta: { title: '插件', requiresAuth: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/system/UserList.vue'),
        meta: { title: '用户', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/system/Settings.vue'),
        meta: { title: '设置', requiresAuth: true }
      },
      {
        path: 'overview',
        name: 'SystemDashboard',
        component: () => import('@/views/system/Dashboard.vue'),
        meta: { title: '概览', requiresAuth: true }
      },
      {
        path: 'backup',
        name: 'Backup',
        component: () => import('@/views/system/Backup.vue'),
        meta: { title: '备份', requiresAuth: true }
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/system/Tools.vue'),
        meta: { title: '工具', requiresAuth: true }
      },
      {
        path: 'market',
        name: 'Marketplace',
        component: () => import('@/views/system/Marketplace.vue'),
        meta: { title: '应用市场', requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  console.log('Global beforeEach:', { to, from })
  
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 博客后台管理` : '博客后台管理'

  // 如果是登录页面，直接放行
  if (to.path === '/login') {
    next()
    return
  }

  // 检查是否需要登录权限
  if (to.meta.requiresAuth) {
    try {
      const valid = await validateToken()
      if (!valid) {
        console.log('Token validation failed, redirecting to login')
        next({ 
          path: '/login', 
          query: { redirect: to.fullPath }
        })
        return
      }
      next()
    } catch (error) {
      console.error('Token validation error:', error)
      next({ 
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  console.log('Route changed:', { to, from })
})

export default router 