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
            @input="filterCategories"
          />
        </div>
      </template>
      
      <!-- 分类列表 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="category-list">
        <el-empty v-if="!categories.length" description="暂无分类" />
        <div v-else>
          <!-- 使用树形组件展示分类 -->
          <el-tree
            :data="categories"
            :props="defaultProps"
            node-key="id"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            class="category-tree"
            default-expand-all
          >
            <template #default="{ node, data }">
              <div class="category-node">
                <div class="category-node-content">
                  <div class="category-name-wrapper">
                    <span class="category-name">{{ data.name }}</span>
                    <span class="post-count">文章数: {{ data.post_count || 0 }}</span>
                  </div>
                  <div v-if="data.description" class="category-description">
                    {{ data.description }}
                  </div>
                </div>
                <div class="category-action">
                  <router-link :to="`/category/${data.id}`">
                    <el-button type="primary" size="small">查看文章</el-button>
                  </router-link>
                </div>
              </div>
            </template>
          </el-tree>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Category } from '@/types'
import { getCategories } from '@/api/modules/category'
import { ElMessage, ElTree } from 'element-plus'

const loading = ref(true)
const searchQuery = ref('')
const categories = ref<Category[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

// 树形组件配置
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 过滤节点方法
const filterNode = (value: string, data: any) => {
  if (!value) return true
  
  const searchLower = value.toLowerCase()
  return data.name.toLowerCase().includes(searchLower) || 
    (data.description && data.description.toLowerCase().includes(searchLower))
}

// 监听搜索词变化，触发树形组件过滤
watch(searchQuery, (val) => {
  treeRef.value?.filter(val)
})

// 获取分类列表
const fetchCategories = async () => {
  try {
    loading.value = true
    const response = await getCategories()
    console.log('分类API响应:', response) // 调试用
    
    // 处理API返回数据
    if (response && typeof response === 'object') {
      if (Array.isArray(response)) {
        // 如果直接返回数组
        categories.value = response
      } else if (response.data && Array.isArray(response.data)) {
        // 如果是常见的嵌套结构 { data: [...] }
        categories.value = response.data
      } else if ((response as any).code === 200 && Array.isArray((response as any).data)) {
        // 如果是完整API响应 { code: 200, data: [...] }
        categories.value = (response as any).data
      } else {
        ElMessage.error('获取分类列表失败: 响应格式不正确')
        categories.value = []
      }
    } else {
      ElMessage.error('获取分类列表失败: 响应格式不正确')
      categories.value = []
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
    categories.value = []
  } finally {
    loading.value = false
  }
}

// 过滤分类
const filterCategories = () => {
  // 由watch和filterNode方法处理
}

onMounted(() => {
  fetchCategories()
})
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

.category-tree {
  font-size: 14px;
}

/* 修改树节点样式，解决重叠问题 */
.category-node {
  width: 100%;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}

.category-node-content {
  flex: 1;
  min-width: 0; /* 确保内容能够正确收缩 */
  padding-right: 16px; /* 和按钮保持距离 */
}

.category-name-wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.category-name {
  font-weight: bold;
  font-size: 16px;
  color: #303133;
  margin-right: 10px;
  word-break: break-word;
}

.post-count {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.category-description {
  color: #606266;
  font-size: 14px;
  margin-top: 4px;
  word-break: break-word;
}

.category-action {
  white-space: nowrap;
  padding-left: 8px;
}

/* 修改el-tree的默认样式 */
:deep(.el-tree-node__content) {
  height: auto;
  padding: 0;
}

:deep(.el-tree-node__label) {
  width: 100%;
}

:deep(.el-tree-node) {
  margin-bottom: 6px;
}
</style> 