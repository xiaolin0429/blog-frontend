import type { AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Tag, CreateTagRequest, UpdateTagRequest } from '@/types/tag'
import request from '@/utils/request'

// 获取标签列表
export function getTags(params?: {
  search?: string
  ordering?: string  // 支持 id、name、post_count，降序在字段前加-
  page?: number      // 默认1
  size?: number      // 默认10，最大100
}): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Tag>>>> {
  return request.get<ApiResponse<PaginatedResponse<Tag>>>('/tags/', { params })
}

// 获取标签详情
export function getTag(id: number): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return request.get<ApiResponse<Tag>>(`/tags/${id}/`)
}

// 创建标签
export function createTag(data: CreateTagRequest): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return request.post<ApiResponse<Tag>>('/tags/', data)
}

// 更新标签
export function updateTag(id: number, data: UpdateTagRequest): Promise<AxiosResponse<ApiResponse<Tag>>> {
  return request.put<ApiResponse<Tag>>(`/tags/${id}/`, data)
}

// 删除标签
export function deleteTag(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/tags/${id}/`)
}

// 批量删除标签
export function batchDeleteTags(ids: number[]): Promise<AxiosResponse<ApiResponse<{ deleted_count: number }>>> {
  return request.delete<ApiResponse<{ deleted_count: number }>>('/tags/batch/', { data: { ids } })
}

// 获取标签统计数据
export function getTagStats(): Promise<AxiosResponse<ApiResponse<{
  total: number
  monthNew: number
  unused: number
}>>> {
  return request.get<ApiResponse<{
    total: number
    monthNew: number
    unused: number
  }>>('/tags/stats/')
} 