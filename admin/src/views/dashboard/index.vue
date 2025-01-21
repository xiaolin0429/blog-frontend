<template>
  <div class="dashboard">
    <!-- 顶部数据统计区域 -->
    <div class="data-statistics">
      <el-card v-for="item in statistics" :key="item.label" class="dark-card" shadow="never">
        <div class="statistic-item">
          <el-icon class="icon" :size="32">
            <component :is="item.icon" />
          </el-icon>
          <div class="content">
            <div class="value">{{ item.value }}</div>
            <div class="label">{{ item.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 下方左右两栏布局 -->
    <div class="bottom-section">
      <!-- 左侧快捷访问区域 -->
      <div class="quick-access">
        <h2>快捷访问</h2>
        <div class="quick-access-grid">
          <div v-for="item in quickAccess" :key="item.title" class="quick-access-item" @click="handleQuickAccess(item)">
            <el-icon class="icon">
              <component :is="item.icon" />
            </el-icon>
            <span class="title">{{ item.title }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧通知区域 -->
      <div class="notification-area">
        <h2>通知</h2>
        <el-card class="dark-card" shadow="never">
          <template v-if="notifications.length">
            <div v-for="(notice, index) in notifications" :key="notice.id">
              <div class="notice-item">
                <div class="title">{{ notice.title }}</div>
                <div class="time">{{ notice.time }}</div>
              </div>
              <el-divider v-if="index !== notifications.length - 1" />
            </div>
          </template>
          <el-empty v-else description="暂无通知" />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { Document, User, Setting, Upload, Edit, Message, View, Link } from '@element-plus/icons-vue'

const router = useRouter()

// 将图标组件标记为非响应式
const icons = {
  Document: markRaw(Document),
  User: markRaw(User),
  Setting: markRaw(Setting),
  Upload: markRaw(Upload),
  Edit: markRaw(Edit),
  Message: markRaw(Message),
  View: markRaw(View),
  Link: markRaw(Link)
}

// 统计数据
const statistics = ref([
  { label: '文章', value: '32', icon: icons.Document },
  { label: '用户', value: '3', icon: icons.User },
  { label: '评论', value: '2', icon: icons.Message },
  { label: '访问量', value: '5349', icon: icons.View }
])

// 快捷访问项
const quickAccess = ref([
  { title: '个人中心', icon: icons.User, path: '/profile' },
  { title: '查看站点', icon: icons.Document, path: '/site' },
  { title: '创建文章', icon: icons.Edit, path: '/article/create' },
  { title: '创建页面', icon: icons.Document, path: '/page/create' },
  { title: '附件上传', icon: icons.Upload, path: '/upload' },
  { title: '主题管理', icon: icons.Setting, path: '/theme' },
  { title: '插件管理', icon: icons.Setting, path: '/plugin' },
  { title: '新增用户', icon: icons.User, path: '/user/create' },
  { title: '添加链接', icon: icons.Link, path: '/link/create' }
])

// 通知列表
const notifications = ref([
  { id: 1, title: '中国科学院发布了新的文章《Windows NT 10...', time: '2天前' },
  { id: 2, title: 'alone 评论了你的文章《Pycharm 2024.2.3...', time: '2天前' },
  { id: 3, title: '1.评论了7条的文章《Pycharm 2024.2.3评论...', time: '2天前' }
])

// 快捷访问点击处理
const handleQuickAccess = (item: any) => {
  router.push(item.path)
}
</script>

<style lang="scss" scoped>
@use '@/styles/views/dashboard/index.scss';
</style> 