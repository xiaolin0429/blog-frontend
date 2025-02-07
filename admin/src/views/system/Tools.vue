<template>
  <div class="tools-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统工具</span>
          <el-button type="primary" disabled>
            <el-icon><Tools /></el-icon>运行工具
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Tools } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.tools-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 