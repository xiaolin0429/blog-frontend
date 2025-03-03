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
            @input="filterTags"
          />
        </div>
      </template>
      
      <!-- 标签列表占位 -->
      <el-skeleton :rows="5" animated v-if="loading" />
      <div v-else class="tag-list">
        <el-empty v-if="!filteredTags.length" description="暂无标签" />
        <div v-else class="tag-cloud">
          <router-link
            v-for="tag in filteredTags"
            :key="tag.id"
            :to="`/tag/${tag.id}`"
            class="tag-item"
            :style="{
              fontSize: calculateSize(tag.count || 0) + 'px',
              color: tag.color || getRandomColor(tag.id)
            }"
          >
            {{ tag.name }}
            <span class="tag-count">({{ tag.count || 0 }})</span>
          </router-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 直接在组件中定义接口，避免导入问题
interface Tag {
  id: string
  name: string
  count?: number
  color?: string
}

const loading = ref(true)
const searchQuery = ref('')
const tags = ref<Tag[]>([])
const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value
  const query = searchQuery.value.toLowerCase()
  return tags.value.filter((tag: Tag) => 
    tag.name.toLowerCase().includes(query)
  )
})

// 计算标签大小，基于文章数量
const calculateSize = (count: number) => {
  const baseSize = 14
  const maxAddition = 10
  // 假设最大文章数是100，可以根据实际情况调整
  const maxCount = 100
  const addition = Math.min(count, maxCount) / maxCount * maxAddition
  return baseSize + addition
}

// 根据ID获取随机颜色
const getRandomColor = (id: string) => {
  // 使用ID的哈希生成一致的颜色
  const hash = id.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0)
  }, 0)
  
  // 彩虹色调颜色集合
  const colors = [
    '#ff6b6b', '#ff922b', '#fcc419', '#51cf66', 
    '#339af0', '#5c7cfa', '#845ef7', '#cc5de8'
  ]
  
  return colors[hash % colors.length]
}

// 过滤标签
const filterTags = () => {
  // 此处不需要具体实现，因为我们使用的是计算属性
}

onMounted(async () => {
  // 模拟API加载
  setTimeout(() => {
    // 模拟数据，实际项目中应该从API获取
    tags.value = [
      { id: '1', name: 'JavaScript', count: 42 },
      { id: '2', name: 'Vue.js', count: 28 },
      { id: '3', name: 'TypeScript', count: 18 },
      { id: '4', name: 'React', count: 15 },
      { id: '5', name: 'CSS', count: 31 },
      { id: '6', name: 'HTML', count: 25 },
      { id: '7', name: 'Node.js', count: 12 },
      { id: '8', name: 'Webpack', count: 8 },
      { id: '9', name: 'Vite', count: 10 },
      { id: '10', name: '前端', count: 37 },
      { id: '11', name: '后端', count: 14 },
      { id: '12', name: '全栈', count: 7 },
    ]
    loading.value = false
  }, 1000)
})
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
  gap: 16px;
  padding: 10px;
}

.tag-item {
  display: inline-block;
  padding: 6px 12px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  transition: all 0.3s;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .tag-count {
    font-size: 0.8em;
    opacity: 0.7;
  }
}

.dark .tag-item {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 