import type { AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { TrashPost } from '@/types/trash'
import request from '@/utils/request'

// 获取回收站文章列表
export function getTrashPosts(params?: {
  page?: number
  size?: number
  ordering?: string
}): Promise<AxiosResponse<ApiResponse<PaginatedResponse<TrashPost>>>> {
  return request.get<ApiResponse<PaginatedResponse<TrashPost>>>('/trash/posts/', { params })
}

// 恢复回收站文章
export function restorePost(id: number): Promise<AxiosResponse<ApiResponse<TrashPost>>> {
  return request.post<ApiResponse<TrashPost>>(`/trash/posts/${id}/restore/`)
}

// 永久删除回收站文章
export function deleteTrashPost(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/trash/posts/${id}/`)
}

// 清空回收站
export function emptyTrash(): Promise<AxiosResponse<ApiResponse<{ deleted_count: number }>>> {
  return request.delete<ApiResponse<{ deleted_count: number }>>('/trash/posts/empty/')
} 