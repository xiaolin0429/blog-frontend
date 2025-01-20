<template>
  <div class="dashboard">
    <!-- 数据统计卡片 -->
    <el-row :gutter="16" class="data-statistics">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card shadow="hover" class="dark-card">
          <div class="statistic-item">
            <div class="icon">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="content">
              <div class="value">{{ item.value }}</div>
              <div class="label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷访问区域 -->
    <div class="quick-access">
      <h2>快捷访问</h2>
      <el-row :gutter="16">
        <el-col :span="8" v-for="item in quickAccessItems" :key="item.title">
          <el-card shadow="hover" class="quick-access-item dark-card" @click="item.action">
            <div class="icon">
              <el-icon><component :is="item.icon" /></el-icon>
            </div>
            <div class="title">{{ item.title }}</div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 通知区域 -->
    <div class="notification-area">
      <h2>通知</h2>
      <el-card shadow="hover" class="dark-card">
        <template v-for="(notice, index) in notifications" :key="index">
          <div class="notice-item">
            <span class="title">{{ notice.title }}</span>
            <span class="time">{{ notice.time }}</span>
          </div>
          <el-divider v-if="index < notifications.length - 1" />
        </template>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { markRaw } from 'vue'
import {
  Document,
  User,
  ChatDotRound,
  View,
  Monitor,
  EditPen,
  Upload,
  Brush,
  Connection,
  UserFilled,
  Link
} from '@element-plus/icons-vue'

const statistics = ref([
  { value: '32', label: '文章', icon: markRaw(Document) },
  { value: '3', label: '用户', icon: markRaw(User) },
  { value: '2', label: '评论', icon: markRaw(ChatDotRound) },
  { value: '5349', label: '访问量', icon: markRaw(View) }
])

const quickAccessItems = ref([
  { title: '个人中心', icon: markRaw(User), action: () => {} },
  { title: '查看站点', icon: markRaw(Monitor), action: () => {} },
  { title: '创建文章', icon: markRaw(EditPen), action: () => {} },
  { title: '创建页面', icon: markRaw(Document), action: () => {} },
  { title: '附件上传', icon: markRaw(Upload), action: () => {} },
  { title: '主题管理', icon: markRaw(Brush), action: () => {} },
  { title: '插件管理', icon: markRaw(Connection), action: () => {} },
  { title: '新建用户', icon: markRaw(UserFilled), action: () => {} },
  { title: '添加链接', icon: markRaw(Link), action: () => {} }
])

const notifications = ref([
  { title: '中间件Blog系统使用于在 Windows NT 10...', time: '4天前' },
  { title: 'alone 评论了你的文章《Pycharm 2024.2.3...', time: '2天前' },
  { title: '1.评论了你的文章《Pycharm 2024.2.3评论...', time: '2天前' },
  { title: '中间件Blog系统使用于在 iPhone 15.1 上...', time: '1天前' }
])
</script>

<style lang="scss">
@use '@/styles/views/dashboard/index';
</style> 