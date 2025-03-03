import request from '@/utils/request'
import type { Category } from '@/types'

// 获取所有分类
export function getCategories() {
  return request({
    url: '/api/v1/categories',
    method: 'get'
  })
}

// 获取单个分类详情
export function getCategory(id: number) {
  return request({
    url: `/api/v1/categories/${id}`,
    method: 'get'
  })
}

// 获取分类下的文章
export function getCategoryPosts(id: number, params?: any) {
  return request({
    url: `/api/v1/categories/${id}/posts`,
    method: 'get',
    params
  })
} 