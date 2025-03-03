<template>
  <div class="category-detail">
    <el-card>
      <template #header>
        <div class="header">
          <div class="category-info">
            <h2>{{ categoryName || '分类文章' }}</h2>
            <div v-if="category" class="category-meta">
              <span class="description" v-if="category.description">{{ category.description }}</span>
              <el-tag size="small" type="info">文章数: {{ totalPosts }}</el-tag>
            </div>
          </div>
          <div class="actions">
            <el-button @click="$router.push('/category')" plain>
              返回分类列表
            </el-button>
          </div>
        </div>
      </template>
      
      <!-- 文章列表 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="post-list">
        <el-empty v-if="!posts.length" description="暂无文章" />
        
        <div v-else class="posts-grid">
          <div v-for="post in posts" :key="post.id" class="post-item">
            <el-card shadow="hover" class="post-card">
              <template #header>
                <div class="post-header">
                  <router-link :to="`/post/${post.id}`" class="post-title">
                    {{ post.title }}
                  </router-link>
                </div>
              </template>
              
              <div class="post-content">
                <p class="post-excerpt">{{ post.excerpt || truncateText(post.content, 100) }}</p>
                <div class="post-meta">
                  <div class="post-info">
                    <span class="post-date">{{ formatDate(post.created_at) }}</span>
                    <span class="post-views" v-if="post.views !== undefined">
                      <el-icon><View /></el-icon> {{ post.views }}
                    </span>
                    <span class="post-comments" v-if="post.comments_count !== undefined">
                      <el-icon><ChatDotRound /></el-icon> {{ post.comments_count }}
                    </span>
                  </div>
                  <router-link :to="`/post/${post.id}`" class="read-more">
                    <el-button type="primary" size="small">阅读全文</el-button>
                  </router-link>
                </div>
              </div>
            </el-card>
          </div>
        </div>
        
        <!-- 分页器 -->
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :total="totalPosts"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, ChatDotRound } from '@element-plus/icons-vue'
import { getCategory, getCategoryPosts } from '@/api/modules/category'
import type { Category } from '@/types'

// 路由
const route = useRoute()
const categoryId = computed(() => Number(route.params.id))

// 状态
const loading = ref(true)
const category = ref<Category | null>(null)
const posts = ref<any[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const totalPosts = ref(0)

// 计算属性
const categoryName = computed(() => category.value?.name || '')

// 获取分类信息
const fetchCategory = async () => {
  if (!categoryId.value) return
  
  try {
    const response = await getCategory(categoryId.value)
    console.log('分类详情响应:', response)
    
    if (typeof response === 'object') {
      if (response.data && typeof response.data === 'object') {
        // 标准API响应格式: { code, data, message }
        category.value = response.data as Category
      } else if ((response as any).id) {
        // 直接返回分类对象
        category.value = response as any as Category
      } else {
        ElMessage.error('获取分类信息失败：响应格式不正确')
        category.value = null
      }
    } else {
      ElMessage.error('获取分类信息失败：响应格式不正确')
      category.value = null
    }
  } catch (error) {
    console.error('获取分类信息失败:', error)
    ElMessage.error('获取分类信息失败')
    category.value = null
  }
}

// 获取分类文章
const fetchCategoryPosts = async () => {
  if (!categoryId.value) return
  
  try {
    loading.value = true
    const params = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    const response = await getCategoryPosts(categoryId.value, params)
    console.log('分类文章响应:', response)
    
    if (typeof response === 'object') {
      if (response.data && typeof response.data === 'object') {
        // 标准API响应格式: { code, data: { items, total } }
        if (Array.isArray(response.data.items)) {
          posts.value = response.data.items
          totalPosts.value = response.data.total || response.data.items.length
        } else if (Array.isArray(response.data)) {
          posts.value = response.data
          totalPosts.value = response.data.length
        } else {
          posts.value = []
          totalPosts.value = 0
        }
      } else if (Array.isArray(response)) {
        // 直接返回文章数组
        posts.value = response
        totalPosts.value = response.length
      } else if (Array.isArray((response as any).items)) {
        // 响应格式: { items, total }
        posts.value = (response as any).items
        totalPosts.value = (response as any).total || (response as any).items.length
      } else {
        posts.value = []
        totalPosts.value = 0
      }
    } else {
      posts.value = []
      totalPosts.value = 0
    }
  } catch (error) {
    console.error('获取分类文章失败:', error)
    ElMessage.error('获取分类文章失败')
    posts.value = []
    totalPosts.value = 0
  } finally {
    loading.value = false
  }
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchCategoryPosts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchCategoryPosts()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 截断文本
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// 监听路由变化
watch(() => route.params.id, () => {
  fetchCategory()
  fetchCategoryPosts()
}, { immediate: false })

// 初始化
onMounted(() => {
  fetchCategory()
  fetchCategoryPosts()
})
</script>

<style scoped>
.category-detail {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-info {
  h2 {
    margin: 0 0 8px 0;
    color: var(--el-text-color-primary);
  }
  
  .category-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--el-text-color-secondary);
    font-size: 14px;
    
    .description {
      max-width: 500px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.post-list {
  margin-top: 20px;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  height: 100%;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .post-header {
    .post-title {
      font-size: 18px;
      font-weight: bold;
      color: var(--el-text-color-primary);
      text-decoration: none;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      
      &:hover {
        color: var(--el-color-primary);
      }
    }
  }
  
  .post-content {
    display: flex;
    flex-direction: column;
    height: 150px;
    
    .post-excerpt {
      flex: 1;
      margin: 0 0 16px 0;
      font-size: 14px;
      color: var(--el-text-color-regular);
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    
    .post-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .post-info {
        display: flex;
        align-items: center;
        gap: 16px;
        color: var(--el-text-color-secondary);
        font-size: 12px;
        
        .post-date,
        .post-views,
        .post-comments {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}

.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style> 