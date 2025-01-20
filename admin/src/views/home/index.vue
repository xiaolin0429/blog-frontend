<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>文章总数</span>
              <el-icon><Document /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.articles || 0 }}</span>
            <span class="label">篇</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>评论总数</span>
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.comments || 0 }}</span>
            <span class="label">条</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>用户总数</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.users || 0 }}</span>
            <span class="label">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="dashboard-card">
          <template #header>
            <div class="card-header">
              <span>访问总数</span>
              <el-icon><View /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.views || 0 }}</span>
            <span class="label">次</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Document, ChatDotRound, User, View } from '@element-plus/icons-vue'

interface Statistics {
  articles: number
  comments: number
  users: number
  views: number
}

const statistics = ref<Statistics>({
  articles: 0,
  comments: 0,
  users: 0,
  views: 0
})

onMounted(async () => {
  // TODO: 获取统计数据
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

.dashboard-card {
  @apply bg-white dark:bg-gray-800;
}

.card-header {
  @apply flex justify-between items-center;
}

.card-content {
  @apply flex items-baseline justify-center;
}

.number {
  @apply text-4xl font-bold mr-2;
}

.label {
  @apply text-gray-500 dark:text-gray-400;
}
</style> 