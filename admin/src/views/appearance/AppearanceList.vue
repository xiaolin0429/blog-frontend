<template>
  <div class="appearance-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>外观管理</span>
          <el-button type="primary" disabled>
            <el-icon><Setting /></el-icon>外观设置
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Setting } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.appearance-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 