<template>
  <div class="post-detail-container">
    <el-card class="post-card">
      <template #header>
        <div class="post-header">
          <h1 class="post-title">{{ post?.title }}</h1>
          <div class="post-meta">
            <span><el-icon><Calendar /></el-icon> {{ post?.createdAt }}</span>
            <span><el-icon><View /></el-icon> {{ post?.views }}</span>
            <span><el-icon><ChatLineRound /></el-icon> {{ post?.comments }}</span>
            <span><el-icon><Star /></el-icon> {{ post?.likes }}</span>
          </div>
        </div>
      </template>
      
      <div class="post-content">
        <!-- 文章内容占位 -->
        <el-skeleton :rows="10" animated v-if="loading" />
        <div v-else v-html="post?.content"></div>
      </div>
      
      <!-- 评论区占位 -->
      <div class="post-comments">
        <h3>评论</h3>
        <!-- 评论列表将在这里实现 -->
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Calendar, View, ChatLineRound, Star } from '@element-plus/icons-vue'
import type { Post } from '@/types'

const route = useRoute()
const loading = ref(true)
const post = ref<Post>()

// 待实现获取文章详情的功能
</script>

<style scoped>
.post-detail-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.post-header {
  text-align: center;
}

.post-title {
  margin: 0 0 20px;
  color: #303133;
}

.post-meta {
  color: #909399;
  font-size: 14px;
  
  span {
    margin-right: 20px;
    display: inline-flex;
    align-items: center;
    
    .el-icon {
      margin-right: 4px;
    }
  }
}

.post-content {
  margin-top: 30px;
  line-height: 1.8;
}

.post-comments {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid #ebeef5;
  
  h3 {
    margin: 0 0 20px;
    font-size: 18px;
    color: #303133;
  }
}
</style> 