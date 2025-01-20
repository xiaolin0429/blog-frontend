<template>
  <div class="category-container">
    <el-card>
      <template #header>
        <div class="header">
          <h2>分类</h2>
          <el-input
            v-model="searchQuery"
            placeholder="搜索分类..."
            clearable
            class="search-input"
          />
        </div>
      </template>
      
      <!-- 分类列表占位 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="category-list">
        <el-empty v-if="!categories.length" description="暂无分类" />
        <div v-else>
          <!-- 分类列表将在这里实现 -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Category } from '@/types'

const loading = ref(true)
const searchQuery = ref('')
const categories = ref<Category[]>([])

// 待实现获取分类列表的功能
</script>

<style scoped>
.category-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
  }
  
  .search-input {
    width: 200px;
  }
}

.category-list {
  margin-top: 20px;
}
</style> 