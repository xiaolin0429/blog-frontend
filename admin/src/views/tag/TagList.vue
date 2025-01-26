<template>
  <div class="tag-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="left">
            <el-button type="primary" @click="handleCreate">
              <el-icon><Plus /></el-icon>新建标签
            </el-button>
          </div>
          <div class="right">
            <el-input
              v-model="queryParams.search"
              placeholder="搜索标签"
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
      </template>

      <!-- 标签统计卡片 -->
      <TagStatsCard v-if="tagStats" :stats="tagStats" class="mb-4" />

      <el-table
        v-loading="loading"
        :data="tags"
        style="width: 100%"
        :highlight-current-row="true"
        @current-change="handleCurrentChange"
        :row-class-name="tableRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="post_count" label="文章数" width="100" align="center" />
        <el-table-column prop="created_at" label="创建时间" width="180">
          <template #default="{ row }">
            {{ new Date(row.created_at).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="queryParams.page"
          v-model:page-size="queryParams.size"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 标签表单对话框 -->
    <TagForm
      v-model:visible="formVisible"
      :tag="currentTag"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh } from '@element-plus/icons-vue'
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
  getTagStats
} from '@/api/tag'
import type { Tag, TagStatsResponse } from '@/types/tag'
import type { PaginatedResponse } from '@/types/api'
import TagForm from './components/TagForm.vue'
import TagStatsCard from './components/TagStatsCard.vue'

const loading = ref(false)
const tags = ref<Tag[]>([])
const total = ref(0)
const tagStats = ref<TagStatsResponse | null>(null)
const formVisible = ref(false)
const currentTag = ref<Tag | null>(null)

// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  search: undefined as string | undefined,
  ordering: '-post_count' as 'id' | 'name' | 'post_count' | '-id' | '-name' | '-post_count'
})

// 加载标签列表
const loadTags = async () => {
  loading.value = true
  try {
    const response = await getTags(queryParams.value)
    const { data } = response.data
    tags.value = data.results || []
    total.value = data.count || 0
  } catch (error) {
    console.error('加载标签列表失败:', error)
    ElMessage.error('加载标签列表失败')
    tags.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 加载标签统计
const loadTagStats = async () => {
  try {
    const response = await getTagStats()
    const { data } = response.data
    tagStats.value = data
  } catch (error) {
    console.error('加载标签统计失败:', error)
    ElMessage.error('加载标签统计失败')
    tagStats.value = null
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.value.page = 1
  loadTags()
}

// 处理重置
const handleReset = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    search: undefined,
    ordering: '-post_count'
  }
  loadTags()
}

// 处理新建标签
const handleCreate = () => {
  currentTag.value = null
  formVisible.value = true
}

// 处理编辑标签
const handleEdit = (row: Tag) => {
  currentTag.value = row
  formVisible.value = true
}

// 处理删除标签
const handleDelete = async (row: Tag) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这个标签吗？如果标签下有文章，将无法删除',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteTag(row.id)
    ElMessage.success('删除成功')
    loadTags()
    loadTagStats()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除标签失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 处理表单提交
const handleSubmit = async (data: { name: string; description?: string }) => {
  try {
    if (currentTag.value) {
      await updateTag(currentTag.value.id, data)
      ElMessage.success('更新成功')
    } else {
      await createTag(data)
      ElMessage.success('创建成功')
    }
    formVisible.value = false
    loadTags()
    loadTagStats()
  } catch (error) {
    console.error('保存标签失败:', error)
    ElMessage.error('保存失败')
  }
}

// 处理每页数量变化
const handleSizeChange = (val: number) => {
  queryParams.value.size = val
  loadTags()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  loadTags()
}

// 当前选中的行
const currentRow = ref<Tag | null>(null)

// 表格行的 class 名称
const tableRowClassName = ({ row }: { row: Tag }) => {
  return row.id === currentRow.value?.id ? 'selected-row' : ''
}

// 点击行时的处理
const handleRowClick = (row: Tag) => {
  currentRow.value = row
}

onMounted(() => {
  loadTags()
  loadTagStats()
})
</script>

<style lang="scss" scoped>
.tag-list {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .right {
      display: flex;
      align-items: center;
      gap: 8px;

      .search-input {
        width: 200px;
      }
    }
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
      transition: background-color 0.1s ease-in-out;

      &:hover {
        background-color: var(--el-fill-color);
      }
    }
  }

  .mb-4 {
    margin-bottom: 16px;
  }
}
</style> 