<template>
  <div class="post-manage-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <div class="left">
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建文章
            </el-button>
            <el-button
              type="danger"
              :disabled="!selectedPosts.length"
              @click="handleBatchDelete"
            >
              <el-icon><Delete /></el-icon>批量删除
            </el-button>
          </div>
          
          <div class="right">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索文章标题"
              clearable
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            
            <el-select
              v-model="searchForm.status"
              placeholder="文章状态"
              clearable
              class="status-select"
            >
              <el-option label="已发布" value="published" />
              <el-option label="草稿" value="draft" />
            </el-select>
            
            <el-select
              v-model="searchForm.category"
              placeholder="选择分类"
              clearable
              class="category-select"
            >
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </div>
        </div>
      </template>
      
      <!-- 文章列表 -->
      <el-table
        v-loading="loading"
        :data="posts"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" label="标题" min-width="200">
          <template #default="{ row }">
            <router-link :to="'/article/' + row.id" class="link-type">
              {{ row.title }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="分类" width="120" />
        <el-table-column prop="author.nickname" label="作者" width="120" />
        <el-table-column prop="views" label="浏览量" width="100" align="center" />
        <el-table-column prop="likes" label="点赞数" width="100" align="center" />
        <el-table-column prop="comments" label="评论数" width="100" align="center" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleEdit(row)">
                编辑
              </el-button>
              <el-button
                type="primary"
                link
                :loading="row.publishing"
                @click="handlePublish(row)"
              >
                {{ row.status === 'published' ? '下架' : '发布' }}
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                删除
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search } from '@element-plus/icons-vue'
import type { Post } from '@/types/post'
import type { Category } from '@/types/category'

const router = useRouter()
const loading = ref(false)
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const selectedPosts = ref<Post[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  keyword: '',
  status: undefined as string | undefined,
  category: undefined as number | undefined
})

// 待实现获取文章列表的功能
const fetchPosts = async () => {
  // 实现获取文章列表的逻辑
}

// 待实现获取分类列表的功能
const fetchCategories = async () => {
  // 实现获取分类列表的逻辑
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
  fetchPosts()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    keyword: '',
    status: undefined,
    category: undefined
  }
  handleSearch()
}

// 处理分页
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchPosts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPosts()
}

// 处理选择
const handleSelectionChange = (val: Post[]) => {
  selectedPosts.value = val
}

// 处理创建
const handleCreate = () => {
  router.push('/admin/posts/create')
}

// 处理编辑
const handleEdit = (row: Post) => {
  router.push('/admin/posts/edit/' + row.id)
}

// 处理发布/下架
const handlePublish = async (row: Post) => {
  // 实现发布/下架的逻辑
}

// 处理删除
const handleDelete = async (row: Post) => {
  // 实现删除的逻辑
}

// 处理批量删除
const handleBatchDelete = async () => {
  // 实现批量删除的逻辑
}

// 初始化
onMounted(() => {
  fetchCategories()
  fetchPosts()
})
</script>

<style scoped>
.post-manage-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .left {
    display: flex;
    gap: 10px;
  }
  
  .right {
    display: flex;
    gap: 10px;
    
    .search-input {
      width: 200px;
    }
    
    .status-select,
    .category-select {
      width: 150px;
    }
  }
}

.link-type {
  color: #409eff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style> 