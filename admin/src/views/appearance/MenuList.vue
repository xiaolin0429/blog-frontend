<template>
  <div class="menu-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" disabled>
            <el-icon><Plus /></el-icon>新建菜单
          </el-button>
        </div>
      </template>
      
      <el-empty description="功能开发中..." />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
.menu-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style> 