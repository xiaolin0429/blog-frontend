import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post, PostList, PostQuery } from '@/types/front/post'
import { getPosts, getPostById } from '@/api/front/post'

export const usePostStore = defineStore('post', () => {
  const posts = ref<PostList>({
    items: [],
    total: 0
  })
  const currentPost = ref<Post | null>(null)
  const loading = ref(false)

  // 获取文章列表
  const fetchPosts = async (query: PostQuery) => {
    try {
      loading.value = true
      const data = await getPosts(query)
      posts.value = data
      return data
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  // 获取文章详情
  const fetchPost = async (id: string) => {
    try {
      loading.value = true
      const data = await getPostById(id)
      currentPost.value = data
      return data
    } catch (error) {
      currentPost.value = null
      throw error
    } finally {
      loading.value = false
    }
  }

  // 清空文章列表
  const clearPosts = () => {
    posts.value = {
      items: [],
      total: 0
    }
  }

  // 清空当前文章
  const clearCurrentPost = () => {
    currentPost.value = null
  }

  return {
    posts,
    currentPost,
    loading,
    fetchPosts,
    fetchPost,
    clearPosts,
    clearCurrentPost
  }
}) 