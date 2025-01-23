<template>
  <div class="post-trash">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>回收站</span>
          <el-button type="danger" @click="handleClearTrash">清空回收站</el-button>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="posts"
        style="width: 100%"
        :highlight-current-row="true"
        @current-change="handleCurrentChange"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column label="作者" width="120">
          <template #default="{ row }">
            {{ row.author.nickname || row.author.username }}
          </template>
        </el-table-column>
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ row.category.name }}
          </template>
        </el-table-column>
        <el-table-column label="标签" width="200">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.tags"
              :key="tag.id"
              size="small"
              class="tag-item"
            >
              {{ tag.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deleted_at" label="删除时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.deleted_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleRestore(row)">恢复</el-button>
            <el-button type="danger" link @click="handleDelete(row)">彻底删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @change="handleChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PostResponse } from '@/types/post'
import { getTrashPosts, restorePost, deleteTrashPost, clearTrash } from '@/api/post'

// 表格数据
const posts = ref<PostResponse[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const currentRow = ref<PostResponse | null>(null)

// 表格行的 class 名称
const tableRowClassName = ({ row }: { row: PostResponse }) => {
  return row.id === currentRow.value?.id ? 'selected-row' : ''
}

// 点击行时的处理
const handleRowClick = (row: PostResponse) => {
  currentRow.value = row
}

// 表格当前行变化的处理
const handleCurrentChange = (val: PostResponse | null) => {
  currentRow.value = val
}

// 加载已删除的文章列表
const loadPosts = async (resetPage = false) => {
  try {
    loading.value = true
    if (resetPage) {
      currentPage.value = 1
      pageSize.value = 10
    }

    const response = await getTrashPosts({
      page: currentPage.value,
      size: pageSize.value,
      ordering: '-deleted_at'
    })
    
    if (response.code === 200 && response.data) {
      posts.value = response.data.items
      total.value = response.data.total
    } else {
      posts.value = []
      total.value = 0
    }
  } catch (error) {
    console.error('加载已删除文章列表失败:', error)
    ElMessage.error('加载已删除文章列表失败')
    posts.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 恢复文章
const handleRestore = (row: PostResponse) => {
  currentRow.value = row
  ElMessageBox.confirm(
    '确定要恢复这篇文章吗？恢复后文章将变为草稿状态。',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await restorePost(row.id)
      if (response.code === 200) {
        ElMessage.success('恢复成功')
        currentRow.value = null
        await loadPosts(true)
      } else {
        ElMessage.error(response.message || '恢复失败')
      }
    } catch (error) {
      console.error('恢复文章失败:', error)
      ElMessage.error('恢复文章失败')
    }
  }).catch(() => {
    currentRow.value = null
  })
}

// 彻底删除文章
const handleDelete = (row: PostResponse) => {
  currentRow.value = row
  ElMessageBox.confirm(
    '确定要彻底删除这篇文章吗？此操作不可恢复！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      const response = await deleteTrashPost(row.id)
      if (response.code === 204) {
        ElMessage.success('删除成功')
        currentRow.value = null
        await loadPosts(true)
      } else {
        ElMessage.error(response.message || '删除失败')
      }
    } catch (error) {
      console.error('删除文章失败:', error)
      ElMessage.error('删除文章失败')
    }
  }).catch(() => {
    currentRow.value = null
  })
}

// 清空回收站
const handleClearTrash = () => {
  ElMessageBox.confirm(
    '确定要清空回收站吗？此操作将删除所有已删除的文章，且不可恢复！',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(async () => {
    try {
      const response = await clearTrash()
      if (response.code === 204) {
        ElMessage.success(`清空成功，共删除 ${response.data?.deleted_count || 0} 篇文章`)
        await loadPosts(true)
      } else {
        ElMessage.error(response.message || '清空失败')
      }
    } catch (error) {
      console.error('清空回收站失败:', error)
      ElMessage.error('清空回收站失败')
    }
  }).catch(() => {})
}

// 分页处理
const handleChange = () => {
  currentRow.value = null
  loadPosts(false)
}

// 生命周期钩子
onMounted(() => {
  loadPosts(true)
})
</script>

<style lang="scss" scoped>
.post-trash {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tag-item {
    margin-right: 4px;
    margin-bottom: 4px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table) {
    .selected-row {
      background-color: var(--el-color-primary-light-8);
    }

    .el-table__row {
      cursor: pointer;
      transition: background-color 0.15s ease-in-out;

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }
}
</style> 