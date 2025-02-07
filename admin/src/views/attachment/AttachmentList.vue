<template>
  <div class="attachment-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>附件管理</span>
          <el-button type="primary" disabled>
            <el-icon><Upload /></el-icon>上传附件
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.attachment-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 