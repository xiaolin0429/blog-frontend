<template>
  <div class="post-list">
    <!-- 顶部操作栏 -->
    <div class="header">
      <div class="left">
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>新建文章
        </el-button>
        <el-dropdown
          :disabled="!selectedRows.length"
          @command="handleBatchCommand"
          trigger="click"
        >
          <el-button :disabled="!selectedRows.length">
            <el-icon><Operation /></el-icon>批量操作
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="delete">
                <el-icon><Delete /></el-icon>批量删除
              </el-dropdown-item>
              <el-dropdown-item command="category">
                <el-icon><FolderAdd /></el-icon>设置分类
              </el-dropdown-item>
              <el-dropdown-item command="tag">
                <el-icon><Collection /></el-icon>设置标签
              </el-dropdown-item>
              <el-dropdown-item command="export">
                <el-icon><Download /></el-icon>导出选中
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="right">
        <el-input
          v-model="queryParams.keyword"
          placeholder="搜索文章"
          class="search-input"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button @click="handleSearch">搜索</el-button>
        <el-button link @click="handleReset">
          <el-icon><Refresh /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 筛选条件 -->
    <div class="filter-section">
      <div class="filter-content">
        <PostFilter
          v-model="queryParams"
          :categories="categories"
          :tags="tags"
        />
      </div>
      <div class="management-buttons">
        <el-button
          type="primary"
          @click="router.push('/categories')"
        >
          分类管理
        </el-button>
        <el-button
          type="primary"
          @click="router.push('/tags')"
        >
          标签管理
        </el-button>
        <el-button
          type="primary"
          @click="router.push('/posts/trash')"
        >
          回收站
        </el-button>
      </div>
    </div>

    <!-- 文章列表 -->
    <PostTable
      :loading="loading"
      :posts="posts"
      @selection-change="handleSelectionChange"
      @edit="handleEdit"
      @preview="handlePreview"
      @delete="handleDelete"
    />

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="queryParams.page"
        v-model:page-size="queryParams.size"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 批量操作对话框 -->
    <PostBatchDialog
      ref="batchDialogRef"
      :categories="categories"
      :tags="tags"
      @set-category="handleBatchSetCategory"
      @set-tags="handleBatchSetTags"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Delete,
  Search,
  Refresh,
  Operation,
  ArrowDown,
  FolderAdd,
  Collection,
  Download
} from '@element-plus/icons-vue'
import {
  getPosts,
  createPost,
  updatePost,
  deletePost
} from '@/api/post'
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tag'
import type { Post, PostListItem, PostStatus } from '@/types/post'
import type { Category } from '@/types/category'
import type { Tag } from '@/types/tag'
import type { PaginatedResponse } from '@/types/api'
import PostFilter from './components/PostFilter.vue'
import PostTable from './components/PostTable.vue'
import PostBatchDialog from './components/PostBatchDialog.vue'

const router = useRouter()
const loading = ref(false)
const posts = ref<PostListItem[]>([])
const total = ref(0)
const categories = ref<Category[]>([])
const tags = ref<Tag[]>([])
const selectedRows = ref<PostListItem[]>([])
const batchDialogRef = ref()

// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  ordering: '-created_at',
  keyword: undefined as string | undefined,
  category: undefined as number | undefined,
  tags: undefined as number[] | undefined,
  status: undefined as ('draft' | 'published' | 'archived') | undefined,
  date_start: undefined as string | undefined,
  date_end: undefined as string | undefined
})

// 加载文章列表
const loadPosts = async () => {
  loading.value = true
  try {
    const response = await getPosts(queryParams.value)
    const { data } = response.data
    posts.value = data.results || []
    total.value = data.count || 0
  } catch (error) {
    console.error('加载文章列表失败:', error)
    ElMessage.error('加载文章列表失败')
    posts.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载分类和标签
const loadCategoriesAndTags = async () => {
  try {
    const [categoriesRes, tagsRes] = await Promise.all([
      getCategories(),
      getTags({ ordering: 'name' })
    ])
    
    const { data: categoryData } = categoriesRes.data
    const { data: tagData } = tagsRes.data
    
    categories.value = categoryData || []
    tags.value = tagData.results || []
  } catch (error) {
    console.error('加载分类和标签失败:', error)
    ElMessage.error('加载分类和标签失败')
    categories.value = []
    tags.value = []
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.value.page = 1
  loadPosts()
}

// 处理重置
const handleReset = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    ordering: '-created_at',
    keyword: undefined,
    category: undefined,
    tags: undefined,
    status: undefined,
    date_start: undefined,
    date_end: undefined
  }
  loadPosts()
}

// 处理新建文章
const handleCreate = () => {
  router.push('/posts/create')
}

// 处理编辑文章
const handleEdit = (row: PostListItem) => {
  router.push(`/posts/${row.id}/edit`)
}

// 处理预览文章
const handlePreview = (row: PostListItem) => {
  window.open(`/posts/${row.id}/preview`, '_blank')
}

// 处理删除文章
const handleDelete = async (row: PostListItem) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这篇文章吗？此操作不可恢复',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deletePost(row.id)
    ElMessage.success('删除成功')
    loadPosts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (!selectedRows.value.length) return

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 篇文章吗？此操作不可恢复`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    for (const row of selectedRows.value) {
      await deletePost(row.id)
    }
    ElMessage.success('批量删除成功')
    loadPosts()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除文章失败:', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 处理批量命令
const handleBatchCommand = (command: string) => {
  switch (command) {
    case 'delete':
      handleBatchDelete()
      break
    case 'category':
      batchDialogRef.value.openCategoryDialog()
      break
    case 'tag':
      batchDialogRef.value.openTagDialog()
      break
    case 'export':
      handleBatchExport()
      break
  }
}

// 处理批量设置分类
const handleBatchSetCategory = async (categoryId: number) => {
  if (!selectedRows.value.length) return

  try {
    const promises = selectedRows.value.map(row => 
      updatePost(row.id, { category_id: categoryId })
    )
    await Promise.all(promises)
    ElMessage.success('批量设置分类成功')
    loadPosts()
  } catch (error) {
    console.error('批量设置分类失败:', error)
    ElMessage.error('批量设置分类失败')
  }
}

// 处理批量设置标签
const handleBatchSetTags = async (tagIds: number[]) => {
  if (!selectedRows.value.length) return

  try {
    const promises = selectedRows.value.map(row => 
      updatePost(row.id, { tag_ids: tagIds })
    )
    await Promise.all(promises)
    ElMessage.success('批量设置标签成功')
    loadPosts()
  } catch (error) {
    console.error('批量设置标签失败:', error)
    ElMessage.error('批量设置标签失败')
  }
}

// 处理批量导出
const handleBatchExport = () => {
  // TODO: 实现导出功能
  ElMessage.warning('导出功能开发中')
}

// 处理选择变化
const handleSelectionChange = (rows: PostListItem[]) => {
  selectedRows.value = rows
}

// 处理每页数量变化
const handleSizeChange = (val: number) => {
  queryParams.value.size = val
  loadPosts()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  loadPosts()
}

onMounted(() => {
  loadPosts()
  loadCategoriesAndTags()
})
</script>

<style lang="scss">
@forward '@/styles/views/post/post-list';
</style> 