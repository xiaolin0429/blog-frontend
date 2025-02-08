<template>
  <div class="tag-list">
    <!-- 标签统计卡片 -->
    <TagStatsCard :stats="stats" @refresh="loadTagStats" />

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

      <el-table
        v-loading="loading"
        :data="tagList"
        style="width: 100%"
        row-key="id"
      >
        <el-table-column prop="name" label="名称" min-width="200" />
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
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 标签表单对话框 -->
    <TagForm
      v-model:visible="formVisible"
      :edit-data="currentTag"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Search, Refresh } from '@element-plus/icons-vue'
import {
  getTags,
  deleteTag,
  getTagStats
} from '@/api/tag'
import type { Tag } from '@/types/tag'
import TagForm from './components/TagForm.vue'
import TagStatsCard from './components/TagStatsCard.vue'

const loading = ref(false)
const tagList = ref<Tag[]>([])
const total = ref(0)
const formVisible = ref(false)
const currentTag = ref<Tag | undefined>(undefined)

// 查询参数
const queryParams = ref({
  search: undefined as string | undefined,
  ordering: '-created_at' as string,
  page: 1,
  size: 10
})

// 标签统计数据
const stats = ref({
  total: 0,
  monthNew: 0,
  unused: 0
})

// 加载标签列表
const loadTags = async () => {
  loading.value = true
  try {
    const response = await getTags(queryParams.value)
    const { data } = response.data
    tagList.value = data.results
    total.value = data.count
  } catch (error: any) {
    console.error('加载标签列表失败:', error)
    ElMessage.error(error.message || '加载标签列表失败')
    tagList.value = []
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
    stats.value = data
  } catch (error: any) {
    console.error('加载标签统计失败:', error)
    ElMessage.error(error.message || '加载标签统计失败')
  }
}

// 处理搜索
const handleSearch = () => {
  queryParams.value.page = 1
  loadTags()
}

// 处理重置
const handleReset = () => {
  queryParams.value.search = undefined
  queryParams.value.page = 1
  loadTags()
}

// 处理创建
const handleCreate = () => {
  currentTag.value = undefined
  formVisible.value = true
}

// 处理编辑
const handleEdit = (row: Tag) => {
  currentTag.value = row
  formVisible.value = true
}

// 处理删除
const handleDelete = async (row: Tag) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除标签"${row.name}"吗？`,
      '删除确认',
      {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }
    )
    
    await deleteTag(row.id)
    ElMessage.success('删除成功')
    loadTags()
    loadTagStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 处理表单提交成功
const handleSuccess = () => {
  loadTags()
  loadTagStats()
}

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.value.size = val
  queryParams.value.page = 1
  loadTags()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryParams.value.page = val
  loadTags()
}

// 初始化
onMounted(() => {
  loadTags()
  loadTagStats()
})
</script>

<style lang="scss">
@use '@/styles/views/tag/list.scss';
</style> 