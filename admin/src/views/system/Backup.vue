<template>
  <div class="backup-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>备份管理</span>
          <el-button type="primary" disabled>
            <el-icon><Download /></el-icon>创建备份
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Download } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.backup-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 