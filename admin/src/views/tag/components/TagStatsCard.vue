<template>
  <el-card class="tag-stats">
    <template #header>
      <div class="card-header">
        <span>标签统计</span>
        <el-button link @click="$emit('refresh')">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </template>
    <div class="stats-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="stats-item">
            <div class="label">标签总数</div>
            <div class="value">{{ stats.total || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stats-item">
            <div class="label">本月新增</div>
            <div class="value">{{ stats.monthNew || 0 }}</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="stats-item">
            <div class="label">未使用</div>
            <div class="value">{{ stats.unused || 0 }}</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'

interface TagStats {
  total: number
  monthNew: number
  unused: number
}

defineProps<{
  stats: TagStats
}>()

defineEmits<{
  (e: 'refresh'): void
}>()
</script>

<style lang="scss">
@use '@/styles/views/tag/components/tag-stats-card.scss';
</style> 