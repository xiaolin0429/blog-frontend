<template>
  <div class="dashboard-container">
    <!-- 数据统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>文章总数</span>
              <el-icon><Document /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ stats.posts || 0 }}</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>分类总数</span>
              <el-icon><Files /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ stats.categories || 0 }}</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>标签总数</span>
              <el-icon><Collection /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ stats.tags || 0 }}</div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card">
          <template #header>
            <div class="card-header">
              <span>评论总数</span>
              <el-icon><ChatDotRound /></el-icon>
            </div>
          </template>
          <div class="card-value">{{ stats.comments || 0 }}</div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近文章和评论 -->
    <el-row :gutter="20" class="dashboard-content">
      <!-- 最近文章 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>最近文章</span>
              <el-button text @click="router.push('/admin/posts')">
                查看全部
              </el-button>
            </div>
          </template>
          
          <el-skeleton :rows="5" animated v-if="loading" />
          <div v-else>
            <el-empty v-if="!recentPosts.length" description="暂无文章" />
            <div v-else class="recent-list">
              <div
                v-for="post in recentPosts"
                :key="post.id"
                class="recent-item"
              >
                <div class="item-main">
                  <router-link
                    :to="'/article/' + post.id"
                    class="item-title"
                  >
                    {{ post.title }}
                  </router-link>
                  <span class="item-date">{{ post.created_at }}</span>
                </div>
                <div class="item-meta">
                  <span><el-icon><View /></el-icon> {{ post.view_count }}</span>
                  <span><el-icon><ChatDotRound /></el-icon> {{ post.comment_count }}</span>
                  <span><el-icon><Star /></el-icon> {{ post.like_count }}</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <!-- 最近评论 -->
      <el-col :span="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>最近评论</span>
              <el-button text @click="router.push('/admin/comments')">
                查看全部
              </el-button>
            </div>
          </template>
          
          <el-skeleton :rows="5" animated v-if="loading" />
          <div v-else>
            <el-empty v-if="!recentComments.length" description="暂无评论" />
            <div v-else class="recent-list">
              <div
                v-for="comment in recentComments"
                :key="comment.id"
                class="recent-item"
              >
                <div class="item-main">
                  <div class="comment-content">{{ comment.content }}</div>
                  <span class="item-date">{{ comment.created_at }}</span>
                </div>
                <div class="item-meta">
                  <span>来自文章：</span>
                  <router-link
                    :to="'/article/' + comment.post.id"
                    class="item-title"
                  >
                    {{ comment.post.title }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document,
  Files,
  Collection,
  ChatDotRound,
  View,
  Star
} from '@element-plus/icons-vue'
import type { Post } from '@/types/post'
import type { Comment } from '@/types/comment'

const router = useRouter()
const loading = ref(true)

// 统计数据
const stats = ref({
  posts: 0,
  categories: 0,
  tags: 0,
  comments: 0
})

// 最近数据
const recentPosts = ref<Post[]>([])
const recentComments = ref<Comment[]>([])

// 待实现获取数据的功能
</script>

<style lang="scss">
@use '@/styles/views/dashboard/index.scss';
</style> 