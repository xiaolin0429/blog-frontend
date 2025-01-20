<template>
  <div class="search-container">
    <el-card>
      <template #header>
        <div class="header">
          <h2>搜索结果</h2>
          <el-input
            v-model="searchQuery"
            placeholder="搜索文章..."
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button @click="handleSearch">
                <el-icon><Search /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </template>
      
      <!-- 搜索结果占位 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="search-results">
        <el-empty v-if="!results.length" :description="emptyText" />
        <div v-else class="result-list">
          <!-- 搜索结果列表将在这里实现 -->
        </div>
      </div>
      
      <!-- 分页 -->
      <div v-if="results.length" class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import type { Post } from '@/types'

const route = useRoute()
const loading = ref(false)
const searchQuery = ref('')
const results = ref<Post[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emptyText = computed(() => {
  return searchQuery.value ? '没有找到相关文章' : '请输入搜索关键词'
})

// 待实现搜索功能
const handleSearch = () => {
  // 实现搜索逻辑
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  handleSearch()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  handleSearch()
}
</script>

<style scoped>
.search-container {
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
    width: 300px;
  }
}

.search-results {
  margin-top: 20px;
}

.result-list {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 