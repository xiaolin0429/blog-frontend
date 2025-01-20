<template>
  <div class="post-trash">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>回收站</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="posts"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="author_username" label="作者" width="120" />
        <el-table-column prop="category_name" label="分类" width="120" />
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { PostResponse } from '@/types/post'

// 表格数据
const posts = ref<PostResponse[]>([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 加载已删除的文章列表
const loadPosts = async () => {
  try {
    loading.value = true
    // TODO: 实现获取已删除文章列表的 API 调用
    posts.value = []
    total.value = 0
  } catch (error) {
    console.error('加载已删除文章列表失败:', error)
    ElMessage.error('加载已删除文章列表失败')
  } finally {
    loading.value = false
  }
}

// 恢复文章
const handleRestore = (row: PostResponse) => {
  ElMessageBox.confirm(
    '确定要恢复这篇文章吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // TODO: 实现恢复文章的 API 调用
      ElMessage.success('恢复成功')
      loadPosts()
    } catch (error) {
      console.error('恢复文章失败:', error)
      ElMessage.error('恢复文章失败')
    }
  }).catch(() => {})
}

// 彻底删除文章
const handleDelete = (row: PostResponse) => {
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
      // TODO: 实现彻底删除文章的 API 调用
      ElMessage.success('删除成功')
      loadPosts()
    } catch (error) {
      console.error('删除文章失败:', error)
      ElMessage.error('删除文章失败')
    }
  }).catch(() => {})
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadPosts()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadPosts()
}

// 生命周期钩子
onMounted(() => {
  loadPosts()
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
}
</style> 