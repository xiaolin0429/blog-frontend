import request from '@/utils/request'

export interface StatisticsParams {
  startDate?: string
  endDate?: string
}

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
    }>
  }
  tags: {
    total: number
    topTags: Array<{
      id: number
      name: string
      postCount: number
    }>
  }
}

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

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

// 获取内容统计数据
export function getContentStatistics(params?: StatisticsParams) {
  return request<ApiResponse<ContentStatistics>>({
    url: '/statistics/content/',
    method: 'get',
    params
  })
}

// 获取访问统计数据
export function getVisitStatistics(params?: StatisticsParams) {
  return request<ApiResponse<VisitStatistics>>({
    url: '/statistics/visits/',
    method: 'get',
    params
  })
}

// 获取用户统计数据
export function getUserStatistics(params?: StatisticsParams) {
  return request<ApiResponse<UserStatistics>>({
    url: '/statistics/users/',
    method: 'get',
    params
  })
} 