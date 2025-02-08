<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo">
        <img src="@/assets/images/logo/logo.png" alt="blog" class="logo-img" />
      </div>
      <div class="search-box" v-show="!isCollapse">
        <el-input
          v-model="searchText"
          placeholder="搜索"
          prefix-icon="Search"
          clearable
          class="dark-input"
        />
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        :collapse="isCollapse"
        :background-color="isDark ? '#1e1e1e' : '#ffffff'"
        :text-color="isDark ? '#909399' : '#303133'"
        :active-text-color="'var(--el-color-primary)'"
        :router="true"
        @select="handleSelect"
      >
        <!-- 仪表盘 -->
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>

        <!-- 内容管理 -->
        <el-sub-menu index="content">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>内容</span>
          </template>
          <el-menu-item index="/posts">
            <el-icon><Document /></el-icon>
            <span>文章</span>
          </el-menu-item>
          <el-menu-item index="/pages">
            <el-icon><Files /></el-icon>
            <span>页面</span>
          </el-menu-item>
          <el-menu-item index="/comments">
            <el-icon><ChatDotRound /></el-icon>
            <span>评论</span>
          </el-menu-item>
          <el-menu-item index="/attachments">
            <el-icon><FolderOpened /></el-icon>
            <span>附件</span>
          </el-menu-item>
          <el-menu-item index="/links">
            <el-icon><Link /></el-icon>
            <span>链接</span>
          </el-menu-item>
          <el-menu-item index="/moments">
            <el-icon><Timer /></el-icon>
            <span>瞬间</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 外观管理 -->
        <el-sub-menu index="appearance">
          <template #title>
            <el-icon><Brush /></el-icon>
            <span>外观</span>
          </template>
          <el-menu-item index="/themes">
            <el-icon><Brush /></el-icon>
            <span>主题</span>
          </el-menu-item>
          <el-menu-item index="/menus">
            <el-icon><Menu /></el-icon>
            <span>菜单</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- 系统管理 -->
        <el-sub-menu index="system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统</span>
          </template>
          <el-menu-item index="/plugins">
            <el-icon><Connection /></el-icon>
            <span>插件</span>
          </el-menu-item>
          <el-menu-item index="/users">
            <el-icon><User /></el-icon>
            <span>用户</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </el-menu-item>
          <el-menu-item index="/overview">
            <el-icon><DataLine /></el-icon>
            <span>概览</span>
          </el-menu-item>
          <el-menu-item index="/backup">
            <el-icon><Box /></el-icon>
            <span>备份</span>
          </el-menu-item>
          <el-menu-item index="/tools">
            <el-icon><Tools /></el-icon>
            <span>工具</span>
          </el-menu-item>
          <el-menu-item index="/market">
            <el-icon><Shop /></el-icon>
            <span>应用市场</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
      <div class="user-info" v-show="!isCollapse">
        <div class="user-avatar">
          <el-avatar :size="32" :src="defaultAvatar" />
          <div class="user-details">
            <span class="username">XiaoLin</span>
            <el-tag size="small" class="role-tag">超级管理员</el-tag>
          </div>
        </div>
        <div class="user-actions">
          <el-button link class="action-btn">
            <el-icon><User /></el-icon>
          </el-button>
          <el-button link class="action-btn" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon>
          </el-button>
        </div>
      </div>
    </el-aside>

    <el-container>
      <!-- 顶部导航 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            link
            @click="toggleCollapse"
          >
            <el-icon :size="20">
              <component :is="isCollapse ? 'Expand' : 'Fold'" />
            </el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-button-group>
            <el-button
              link
              @click="toggleTheme"
              :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
            >
              <el-icon :size="20">
                <component :is="isDark ? 'Sunny' : 'Moon'" />
              </el-icon>
            </el-button>
            <el-button
              link
              @click="handleRefresh"
            >
              <el-icon :size="20">
                <Refresh />
              </el-icon>
            </el-button>
          </el-button-group>
        </div>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, watch, markRaw, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import defaultAvatar from '@/assets/images/avatars/default-avatar.png'
import {
  Odometer, Document, Files, ChatDotRound, FolderOpened,
  Link, Timer, Brush, Menu, Connection, User, Setting,
  DataLine, Box, Tools, Shop, Expand, Fold, Refresh,
  Moon, Sunny, SwitchButton
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/store/common/theme'
import { useUserStore } from '@/store/modules/user'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const searchText = ref('')
const activeMenu = ref(route.path)

const themeStore = useThemeStore()
const { mode: themeMode } = storeToRefs(themeStore)
const isDark = computed(() => themeMode.value === 'dark')

const userStore = useUserStore()

// 将图标组件标记为非响应式
const icons = markRaw({
  Odometer, Document, Files, ChatDotRound, FolderOpened,
  Link, Timer, Brush, Menu, Connection, User, Setting,
  DataLine, Box, Tools, Shop, Expand, Fold, Refresh,
  Moon, Sunny, SwitchButton
})

// 监听路由变化，更新激活的菜单项
watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const handleSelect = (index: string) => {
  console.log('Menu selected:', index)
  router.push(index)
}

const toggleTheme = () => {
  themeStore.toggleMode()
  // 手动更新 Element Plus 的主题
  const html = document.documentElement
  if (themeMode.value === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

const handleRefresh = () => {
  window.location.reload()
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning'
    })
    await userStore.logout()
    router.push('/login')
  } catch {
    // 取消退出
  }
}
</script>

<style lang="scss">
@use '@/styles/layouts/basic-layout.scss';
</style> 