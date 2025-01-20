<template>
  <div class="tag-container">
    <el-card>
      <template #header>
        <div class="header">
          <h2>标签</h2>
          <el-input
            v-model="searchQuery"
            placeholder="搜索标签..."
            clearable
            class="search-input"
          />
        </div>
      </template>
      
      <!-- 标签列表占位 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="tag-list">
        <el-empty v-if="!tags.length" description="暂无标签" />
        <div v-else class="tag-cloud">
          <!-- 标签云将在这里实现 -->
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tag } from '@/types'

const loading = ref(true)
const searchQuery = ref('')
const tags = ref<Tag[]>([])

// 待实现获取标签列表的功能
</script>

<style scoped>
.tag-container {
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

.tag-list {
  margin-top: 20px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style> 