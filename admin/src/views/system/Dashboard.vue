<template>
  <div class="dashboard-container">
    <!-- 系统信息 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>系统信息</span>
          <el-button type="primary" :loading="loading" @click="fetchData">
            <el-icon><Refresh /></el-icon>刷新数据
          </el-button>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="info-item">
            <div class="label">系统版本</div>
            <div class="value">{{ overview.system_info?.version || '-' }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="label">运行时间</div>
            <div class="value">{{ formatUptime(overview.system_info?.uptime) }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="info-item">
            <div class="label">系统状态</div>
            <div class="value">
              <el-tag :type="overview.system_info?.status === 'running' ? 'success' : 'warning'">
                {{ overview.system_info?.status === 'running' ? '运行中' : '未知' }}
              </el-tag>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mt-4">
        <el-col :span="8">
          <el-progress
            type="dashboard"
            :percentage="Math.round(overview.system_info?.system_load?.cpu || 0)"
            :color="getCpuColor"
          >
            <template #default="{ percentage }">
              <div class="progress-label">
                <div class="value">{{ percentage }}%</div>
                <div class="label">CPU使用率</div>
              </div>
            </template>
          </el-progress>
        </el-col>
        <el-col :span="8">
          <el-progress
            type="dashboard"
            :percentage="Math.round(overview.system_info?.system_load?.memory || 0)"
            :color="getMemoryColor"
          >
            <template #default="{ percentage }">
              <div class="progress-label">
                <div class="value">{{ percentage }}%</div>
                <div class="label">内存使用率</div>
              </div>
            </template>
          </el-progress>
        </el-col>
        <el-col :span="8">
          <el-progress
            type="dashboard"
            :percentage="Math.round(overview.system_info?.system_load?.disk || 0)"
            :color="getDiskColor"
          >
            <template #default="{ percentage }">
              <div class="progress-label">
                <div class="value">{{ percentage }}%</div>
                <div class="label">磁盘使用率</div>
              </div>
            </template>
          </el-progress>
        </el-col>
      </el-row>
    </el-card>

    <!-- 内容统计 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ overview.content_stats?.total_users || 0 }}</div>
          <div class="stat-label">用户总数</div>
          <div class="stat-sub">活跃用户：{{ overview.content_stats?.active_users || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ overview.content_stats?.total_posts || 0 }}</div>
          <div class="stat-label">文章总数</div>
          <div class="stat-sub">已发布：{{ overview.content_stats?.published_posts || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ overview.content_stats?.total_comments || 0 }}</div>
          <div class="stat-label">评论总数</div>
          <div class="stat-sub">最近评论：{{ overview.content_stats?.recent_comments || 0 }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-value">{{ formatFileSize(overview.storage_stats?.total_size || 0) }}</div>
          <div class="stat-label">存储空间</div>
          <div class="stat-sub">文件数：{{ overview.storage_stats?.total_files || 0 }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近活动 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近文章</span>
              <el-button text @click="$router.push('/posts')">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="overview.recent_activities?.recent_posts || []" style="width: 100%">
            <el-table-column prop="title" label="标题" min-width="200" />
            <el-table-column prop="author" label="作者" width="120" />
            <el-table-column prop="status_display" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status_display }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近备份</span>
              <el-button text @click="$router.push('/backup')">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="overview.recent_activities?.recent_backups || []" style="width: 100%">
            <el-table-column prop="name" label="备份名称" min-width="200" />
            <el-table-column prop="status_display" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status_display }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="created_at" label="创建时间" width="180">
              <template #default="{ row }">
                {{ formatDate(row.created_at) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { getOverview } from '@/api/overview'
import type { Overview } from '@/types/overview'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

const loading = ref(false)
const timer = ref<number>()
const overview = ref<Overview>({
  system_info: {
    version: '',
    status: 'unknown',
    uptime: 0,
    system_load: {
      cpu: 0,
      memory: 0,
      disk: 0
    },
    timestamp: 0
  },
  content_stats: {
    total_users: 0,
    active_users: 0,
    total_posts: 0,
    published_posts: 0,
    total_comments: 0,
    recent_comments: 0,
    timestamp: 0
  },
  storage_stats: {
    total_files: 0,
    total_size: 0,
    backup_count: 0,
    last_backup: null,
    timestamp: 0
  },
  recent_activities: {
    recent_posts: [],
    recent_backups: [],
    timestamp: 0
  }
})

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await getOverview()
    overview.value = response.data.data
  } catch (error) {
    console.error('获取系统概览数据失败:', error)
    ElMessage.error('获取系统概览数据失败')
  } finally {
    loading.value = false
  }
}

// 开始定时刷新
const startPolling = () => {
  fetchData() // 立即获取一次数据
  timer.value = window.setInterval(fetchData, 5000) // 每5秒刷新一次
}

// 停止定时刷新
const stopPolling = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = undefined
  }
}

// 格式化运行时间
const formatUptime = (uptime: number) => {
  if (!uptime) return '-'
  const duration = dayjs.duration(uptime * 1000)
  return `${duration.days()}天${duration.hours()}小时${duration.minutes()}分钟`
}

// 格式化日期
const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}

// 格式化文件大小
const formatFileSize = (size: number) => {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index++
  }
  return `${size.toFixed(2)} ${units[index]}`
}

// 获取CPU使用率颜色
const getCpuColor = (percentage: number) => {
  if (percentage < 50) return '#67C23A'  // 绿色
  if (percentage < 70) return '#E6A23C'  // 黄色
  if (percentage < 90) return '#F56C6C'  // 红色
  return '#F56C6C'  // 深红色
}

// 获取内存使用率颜色
const getMemoryColor = (percentage: number) => {
  if (percentage < 60) return '#67C23A'  // 绿色
  if (percentage < 75) return '#E6A23C'  // 黄色
  if (percentage < 85) return '#F56C6C'  // 红色
  return '#F56C6C'  // 深红色
}

// 获取磁盘使用率颜色
const getDiskColor = (percentage: number) => {
  if (percentage < 70) return '#67C23A'  // 绿色
  if (percentage < 85) return '#E6A23C'  // 黄色
  if (percentage < 95) return '#F56C6C'  // 红色
  return '#F56C6C'  // 深红色
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, 'success' | 'warning' | 'info' | 'primary' | 'danger'> = {
    published: 'success',
    draft: 'info',
    pending: 'warning',
    completed: 'success',
    running: 'warning',
    failed: 'danger'
  }
  return types[status] || 'info'
}

onMounted(() => {
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style lang="scss" scoped>
@import '@/styles/views/system/dashboard.scss';
</style> 