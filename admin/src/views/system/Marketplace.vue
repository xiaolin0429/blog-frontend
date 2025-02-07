<template>
  <div class="marketplace-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>应用市场</span>
          <el-button type="primary" disabled>
            <el-icon><Shop /></el-icon>浏览应用
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Shop } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.marketplace-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 