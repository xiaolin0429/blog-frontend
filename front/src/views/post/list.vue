<template>
  <div class="post-list-container">
    <el-card>
      <template #header>
        <div class="header-actions">
          <h2>文章管理</h2>
          <el-button type="primary" @click="handleCreate">
            <el-icon><Plus /></el-icon> 新建文章
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :inline="true" :model="searchForm">
          <el-form-item>
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索文章标题"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-select v-model="searchForm.category" placeholder="选择分类" clearable>
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

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
import { Plus } from '@element-plus/icons-vue'
import { postApi } from '@/api'
import type { Post, Category } from '@/types'

const router = useRouter()

// 数据
const loading = ref(false)
const posts = ref<Post[]>([])
const categories = ref<Category[]>([])
const selectedPosts = ref<Post[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const searchForm = ref({
  keyword: '',
  category: undefined as number | undefined
})

// 获取文章列表
const fetchPosts = async () => {
  loading.value = true
  try {
    const response = await postApi.getPosts({
      page: currentPage.value,
      size: pageSize.value,
      keyword: searchForm.value.keyword,
      categoryId: searchForm.value.category
    })
    posts.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 获取分类列表
const fetchCategories = async () => {
  try {
    const response = await postApi.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('获取分类列表失败:', error)
    ElMessage.error('获取分类列表失败')
  }
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
  router.push('/posts/create')
}

// 处理编辑
const handleEdit = (row: Post) => {
  router.push('/posts/edit/' + row.id)
}

// 处理发布/下架
const handlePublish = async (row: Post) => {
  try {
    row.publishing = true
    await postApi.updatePost(row.id, {
      status: row.status === 'published' ? 'draft' : 'published'
    })
    row.status = row.status === 'published' ? 'draft' : 'published'
    ElMessage.success(row.status === 'published' ? '发布成功' : '下架成功')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  } finally {
    row.publishing = false
  }
}

// 处理删除
const handleDelete = async (row: Post) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      type: 'warning'
    })
    await postApi.deletePost(row.id)
    ElMessage.success('删除成功')
    fetchPosts()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 初始化
onMounted(() => {
  fetchPosts()
  fetchCategories()
})
</script>

<style scoped>
.post-list-container {
  padding: 20px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    margin: 0;
  }
}

.search-bar {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.link-type {
  color: #409eff;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}
</style> 