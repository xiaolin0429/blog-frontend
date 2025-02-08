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
import { ref, onMounted, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import { Document, User, Setting, Upload, Edit, Message, View, Link } from '@element-plus/icons-vue'
import { getContentStatistics, getVisitStatistics, getUserStatistics } from '@/api/statistics'
import type { ContentStatistics, VisitStatistics, UserStatistics } from '@/api/statistics'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(true)

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
  { label: '文章', value: '0', icon: icons.Document },
  { label: '用户', value: '0', icon: icons.User },
  { label: '评论', value: '0', icon: icons.Message },
  { label: '访问量', value: '0', icon: icons.View }
])

// 快捷访问项
const quickAccess = ref([
  { title: '个人中心', icon: icons.User, path: '/profile' },
  { title: '查看站点', icon: icons.Document, path: '/site' },
  { title: '创建文章', icon: icons.Edit, path: '/posts/create' },
  { title: '创建页面', icon: icons.Document, path: '/pages/create' },
  { title: '附件上传', icon: icons.Upload, path: '/attachments' },
  { title: '主题管理', icon: icons.Setting, path: '/themes' },
  { title: '插件管理', icon: icons.Setting, path: '/plugins' },
  { title: '新增用户', icon: icons.User, path: '/users/create' },
  { title: '添加链接', icon: icons.Link, path: '/links/create' }
])

// 通知列表接口
interface Notification {
  id: number
  title: string
  time: string
}

// 通知列表
const notifications = ref<Notification[]>([])

// 加载统计数据
const loadStatistics = async () => {
  try {
    loading.value = true
    const [contentRes, visitRes, userRes] = await Promise.all([
      getContentStatistics(),
      getVisitStatistics(),
      getUserStatistics()
    ])

    console.log('Raw API responses:', {
      content: contentRes,
      visit: visitRes,
      user: userRes
    })

    // 验证响应数据
    const content = contentRes.data?.data
    const visit = visitRes.data?.data
    const user = userRes.data?.data

    // 添加详细的数据验证日志
    console.log('Processed data:', {
      content,
      visit,
      user
    })

    if (!content?.posts?.total) {
      throw new Error('内容统计数据获取失败')
    }
    if (!visit?.total?.pv) {
      throw new Error('访问统计数据获取失败')
    }
    if (!user?.total?.total_users) {
      throw new Error('用户统计数据获取失败')
    }

    // 更新统计数据
    statistics.value = [
      { 
        label: '文章', 
        value: content.posts.total.toString(), 
        icon: icons.Document 
      },
      { 
        label: '用户', 
        value: user.total.total_users.toString(), 
        icon: icons.User 
      },
      { 
        label: '评论', 
        value: content.comments.total.toString(), 
        icon: icons.Message 
      },
      { 
        label: '访问量', 
        value: visit.total.pv.toString(), 
        icon: icons.View 
      }
    ]
  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error(error instanceof Error ? error.message : '加载统计数据失败')
    // 设置默认值
    statistics.value = [
      { label: '文章', value: '0', icon: icons.Document },
      { label: '用户', value: '0', icon: icons.User },
      { label: '评论', value: '0', icon: icons.Message },
      { label: '访问量', value: '0', icon: icons.View }
    ]
  } finally {
    loading.value = false
  }
}

// 快捷访问点击处理
const handleQuickAccess = (item: any) => {
  router.push(item.path)
}

// 初始化
onMounted(() => {
  loadStatistics()
})
</script>

<style lang="scss" scoped>
@use '@/styles/views/dashboard/index.scss';
</style> 