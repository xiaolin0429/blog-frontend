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
          <el-button link class="action-btn">
            <el-icon><Refresh /></el-icon>
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
  Moon, Sunny
} from '@element-plus/icons-vue'
import { useThemeStore } from '@/store/common/theme'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const isCollapse = ref(false)
const searchText = ref('')
const activeMenu = ref(route.path)

const themeStore = useThemeStore()
const { mode: themeMode } = storeToRefs(themeStore)
const isDark = computed(() => themeMode.value === 'dark')

// 将图标组件标记为非响应式
const icons = markRaw({
  Odometer, Document, Files, ChatDotRound, FolderOpened,
  Link, Timer, Brush, Menu, Connection, User, Setting,
  DataLine, Box, Tools, Shop, Expand, Fold, Refresh,
  Moon, Sunny
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
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: var(--el-bg-color-page);
}

.aside {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--el-border-color);
  overflow: hidden;
}

.logo-img {
  height: 32px;
  width: auto;
}

.search-box {
  padding: 16px;
}

.dark-input :deep(.el-input__wrapper) {
  background-color: var(--el-bg-color-page);
  box-shadow: 0 0 0 1px var(--el-border-color);
}

.dark-input :deep(.el-input__inner) {
  color: var(--el-text-color-regular);
}

.dark-input :deep(.el-input__inner::placeholder) {
  color: var(--el-text-color-secondary);
}

.el-menu-vertical {
  border-right: none;
  flex: 1;
}

.el-menu-vertical:not(.el-menu--collapse) {
  width: 220px;
}

/* 收起时的菜单样式 */
.el-menu--collapse {
  width: 64px;
}

.el-menu--collapse .menu-group {
  display: none;
}

.el-menu--collapse .el-menu-item {
  margin: 4px auto !important;
  width: 48px !important;
}

/* 收起时的图标样式 */
.el-menu--collapse .el-menu-item .el-icon {
  margin: 0;
}

/* 收起时的用户信息样式 */
.aside:has(.el-menu--collapse) .user-info {
  display: none;
}

.header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.header :deep(.el-button) {
  color: var(--el-text-color-regular);
}

.main {
  background-color: var(--el-bg-color-page);
  padding: 24px;
  color: var(--el-text-color-regular);
}

.el-menu-vertical :deep(.el-sub-menu__title) {
  color: var(--el-text-color-regular);
}

.el-menu-vertical :deep(.el-sub-menu__title:hover) {
  background-color: var(--el-fill-color);
}

.el-menu-vertical :deep(.el-menu-item) {
  color: var(--el-text-color-regular);
}

.el-menu-vertical :deep(.el-menu-item:hover) {
  background-color: var(--el-fill-color);
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background-color: var(--el-fill-color);
  color: var(--el-color-primary);
}

.menu-group {
  padding: 12px 20px 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  cursor: default;
  user-select: none;
}

.el-menu-vertical :deep(.el-menu-item) {
  height: 40px;
  line-height: 40px;
  margin: 4px 0;
}

.el-menu-vertical :deep(.el-menu-item.is-active) {
  background-color: var(--el-fill-color);
  color: var(--el-color-primary);
  border-radius: 4px;
  margin: 4px 12px;
  width: calc(100% - 24px);
}

.el-menu-vertical :deep(.el-menu-item:hover:not(.is-active)) {
  background-color: var(--el-fill-color);
  border-radius: 4px;
  margin: 4px 12px;
  width: calc(100% - 24px);
}

/* 顶部按钮样式 */
.header-left .el-button,
.header-right .el-button {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-left .el-button:hover,
.header-right .el-button:hover {
  background-color: var(--el-fill-color);
}

/* 子菜单样式 */
.el-menu-vertical :deep(.el-sub-menu__title) {
  color: var(--el-text-color-regular);
  height: 40px;
  line-height: 40px;
  margin: 4px 0;
}

.el-menu-vertical :deep(.el-sub-menu__title:hover) {
  background-color: var(--el-fill-color);
  border-radius: 4px;
  margin: 4px 12px;
  width: calc(100% - 24px);
}

.el-menu-vertical :deep(.el-sub-menu.is-active > .el-sub-menu__title) {
  color: var(--el-color-primary);
}

/* 子菜单内的菜单项样式 */
.el-menu-vertical :deep(.el-sub-menu .el-menu-item) {
  min-width: unset;
  background-color: var(--el-bg-color-page);
}

.el-menu-vertical :deep(.el-sub-menu .el-menu-item:hover:not(.is-active)) {
  background-color: var(--el-fill-color);
}

.el-menu-vertical :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: var(--el-fill-color);
}

/* 收起时的子菜单弹出样式 */
.el-menu--popup {
  background-color: var(--el-bg-color) !important;
  border: 1px solid var(--el-border-color);
  padding: 4px;
  min-width: 180px;
}

.el-menu--popup .el-menu-item {
  height: 40px;
  line-height: 40px;
  margin: 4px 0;
  border-radius: 4px;
}

.el-menu--popup .el-menu-item:hover:not(.is-active) {
  background-color: var(--el-fill-color) !important;
}

.el-menu--popup .el-menu-item.is-active {
  background-color: var(--el-fill-color) !important;
  color: var(--el-color-primary) !important;
}

.user-info {
  padding: 12px;
  border-top: 1px solid var(--el-border-color);
  background-color: var(--el-bg-color);
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.username {
  font-size: 14px;
  color: var(--el-text-color-primary);
  line-height: 1.2;
}

.role-tag {
  background-color: transparent !important;
  border-color: var(--el-border-color) !important;
  color: var(--el-text-color-regular) !important;
  font-size: 12px !important;
  padding: 0 6px !important;
  height: 20px !important;
  line-height: 18px !important;
}

.user-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.action-btn {
  padding: 6px !important;
  height: 28px !important;
  color: var(--el-text-color-regular) !important;
}

.action-btn:hover {
  background-color: var(--el-fill-color) !important;
  border-radius: 4px;
}

.action-btn :deep(.el-icon) {
  font-size: 16px;
}
</style> 