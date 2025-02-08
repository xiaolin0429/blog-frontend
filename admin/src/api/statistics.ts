import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import request from '@/utils/request'

// 内容统计响应接口
export interface ContentStatistics {
  posts: {
    total: number
    published: number
    draft: number
    private: number
    topAuthors: Array<{
      id: number
      username: string
      postCount: number
      totalViews: number
    }>
  }
  comments: {
    total: number
    approved: number
    pending: number
    spam: number
  }
  categories: {
    total: number
    topCategories: Array<{
      id: number
      name: string
      postCount: number
      totalViews: number
    }>
  }
  tags: {
    total: number
    topTags: Array<{
      id: number
      name: string
      postCount: number
      totalViews: number
    }>
  }
}

// 访问统计响应接口
export interface VisitStatistics {
  total: {
    pv: number
    uv: number
    ip: number
  }
  trends: Array<{
    date: string
    pv: number
    uv: number
    ip: number
  }>
}

// 用户统计响应接口
export interface UserStatistics {
  total: {
    total_users: number
    active_users: number
    new_users: number
  }
  trends: Array<{
    date: string
    total_users: number
    active_users: number
    new_users: number
  }>
}

// 获取内容统计
export function getContentStatistics(params?: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<ContentStatistics>>('/statistics/content', { params })
}

// 获取访问统计
export function getVisitStatistics(params?: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<VisitStatistics>>('/statistics/visits', { params })
}

// 获取用户统计
export function getUserStatistics(params?: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<UserStatistics>>('/statistics/users', { params })
} 