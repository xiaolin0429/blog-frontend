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
            <div class="sub-value">{{ item.subValue }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 趋势图表区域 -->
    <div class="trends-section">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="dark-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>用户趋势</span>
              </div>
            </template>
            <div class="chart-container">
              <el-empty v-if="!trends.users.length" description="暂无数据" />
              <div v-else class="trend-chart">
                <!-- 这里可以添加图表组件 -->
                <ul class="trend-list">
                  <li v-for="item in trends.users" :key="item.date">
                    <span class="date">{{ item.date }}</span>
                    <span class="value">总用户: {{ item.total_users }}</span>
                    <span class="value">活跃: {{ item.active_users }}</span>
                    <span class="value">新增: {{ item.new_users }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="12">
          <el-card class="dark-card" shadow="never">
            <template #header>
              <div class="card-header">
                <span>访问趋势</span>
              </div>
            </template>
            <div class="chart-container">
              <el-empty v-if="!trends.visits.length" description="暂无数据" />
              <div v-else class="trend-chart">
                <!-- 这里可以添加图表组件 -->
                <ul class="trend-list">
                  <li v-for="item in trends.visits" :key="item.date">
                    <span class="date">{{ item.date }}</span>
                    <span class="value">PV: {{ item.pv }}</span>
                    <span class="value">UV: {{ item.uv }}</span>
                    <span class="value">IP: {{ item.ip }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
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
  { label: '文章', value: '0', subValue: '已发布: 0', icon: icons.Document },
  { label: '用户', value: '0', subValue: '今日活跃: 0', icon: icons.User },
  { label: '评论', value: '0', subValue: '待审核: 0', icon: icons.Message },
  { label: '访问量', value: '0', subValue: '独立访客: 0', icon: icons.View }
])

// 趋势数据
const trends = ref<{
  users: UserStatistics['trends']
  visits: VisitStatistics['trends']
}>({
  users: [],
  visits: []
})

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
  loading.value = true
  try {
    // 计算最近7天的日期范围
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 6)

    const params = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }

    // 并行加载所有统计数据
    const [contentRes, visitRes, userRes] = await Promise.all([
      getContentStatistics(params),
      getVisitStatistics(params),
      getUserStatistics(params)
    ])

    // 更新统计卡片数据
    if (contentRes.data.code === 200) {
      statistics.value[0].value = contentRes.data.data.posts.total.toString()
      statistics.value[0].subValue = `已发布: ${contentRes.data.data.posts.published}`
      statistics.value[2].value = contentRes.data.data.comments.total.toString()
      statistics.value[2].subValue = `待审核: ${contentRes.data.data.comments.pending}`
    }

    if (userRes.data.code === 200) {
      statistics.value[1].value = userRes.data.data.total.total_users.toString()
      statistics.value[1].subValue = `今日活跃: ${userRes.data.data.total.active_users}`
    }

    if (visitRes.data.code === 200) {
      statistics.value[3].value = visitRes.data.data.total.pv.toString()
      statistics.value[3].subValue = `独立访客: ${visitRes.data.data.total.uv}`
    }

    // 更新趋势数据
    if (userRes.data.code === 200) {
      trends.value.users = userRes.data.data.trends.map(item => ({
        date: item.date,
        total_users: item.total_users,
        active_users: item.active_users,
        new_users: item.new_users
      }))
    }

    if (visitRes.data.code === 200) {
      trends.value.visits = visitRes.data.data.trends.map(item => ({
        date: item.date,
        pv: item.pv || 0,
        uv: item.uv || 0,
        ip: item.ip || 0
      }))
    }

  } catch (error) {
    console.error('加载统计数据失败:', error)
    ElMessage.error('加载统计数据失败，请稍后重试')
    // 设置默认值
    statistics.value = [
      { label: '文章', value: '0', subValue: '已发布: 0', icon: icons.Document },
      { label: '用户', value: '0', subValue: '今日活跃: 0', icon: icons.User },
      { label: '评论', value: '0', subValue: '待审核: 0', icon: icons.Message },
      { label: '访问量', value: '0', subValue: '独立访客: 0', icon: icons.View }
    ]
    trends.value = {
      users: [],
      visits: []
    }
  } finally {
    loading.value = false
  }
}

// 快捷访问点击处理
const handleQuickAccess = (item: any) => {
  router.push(item.path)
}

// 页面加载时获取数据
onMounted(() => {
  loadStatistics()
})
</script>

<style lang="scss">
@use '@/styles/views/dashboard/index.scss';
</style> 