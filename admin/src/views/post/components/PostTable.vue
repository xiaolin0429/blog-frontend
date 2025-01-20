<template>
  <el-table
    v-loading="loading"
    :data="posts"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" />
    <el-table-column label="标题" min-width="200" sortable="custom" prop="title">
      <template #default="{ row }">
        <div class="post-title">
          <el-tag v-if="row.pinned" size="small" type="warning">置顶</el-tag>
          <router-link :to="'/posts/' + row.id + '/edit'" class="title-link">
            {{ row.title }}
          </router-link>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="category.name" label="分类" width="120" />
    <el-table-column label="标签" width="200">
      <template #default="{ row }">
        <el-tag
          v-for="tag in row.tags"
          :key="tag.id"
          size="small"
          class="tag"
        >
          {{ tag.name }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" sortable="custom" prop="status">
      <template #default="{ row }">
        <el-tag
          :type="row.status === 'published' ? 'success' : 'info'"
          size="small"
        >
          {{ row.status === 'published' ? '已发布' : '草稿' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="数据统计" width="200">
      <template #default="{ row }">
        <div class="post-stats">
          <el-tooltip content="浏览量">
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ row.viewCount }}
            </span>
          </el-tooltip>
          <el-tooltip content="点赞数">
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ row.likeCount }}
            </span>
          </el-tooltip>
          <el-tooltip content="评论数">
            <span class="stat-item">
              <el-icon><ChatDotRound /></el-icon>
              {{ row.commentCount }}
            </span>
          </el-tooltip>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="createdAt"
      label="创建时间"
      width="180"
      sortable="custom"
    >
      <template #default="{ row }">
        {{ new Date(row.createdAt).toLocaleString() }}
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="{ row }">
        <el-button
          link
          type="primary"
          size="small"
          @click="$emit('edit', row)"
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          size="small"
          @click="$emit('preview', row)"
        >
          预览
        </el-button>
        <el-button
          link
          type="danger"
          size="small"
          @click="$emit('delete', row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { View, Star, ChatDotRound } from '@element-plus/icons-vue'
import type { PostResponse } from '@/types/post'

defineProps<{
  loading: boolean
  posts: PostResponse[]
}>()

const emit = defineEmits<{
  'selection-change': [rows: PostResponse[]],
  'edit': [row: PostResponse],
  'preview': [row: PostResponse],
  'delete': [row: PostResponse]
}>()

const handleSelectionChange = (rows: PostResponse[]) => {
  emit('selection-change', rows)
}
</script>

<style lang="scss">
@forward '@/styles/views/post/post-table';
</style> 