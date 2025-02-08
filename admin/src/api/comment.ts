import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { CreateCommentRequest, UpdateCommentRequest } from '../types/comment'
import type { AxiosResponse } from 'axios'
import request from '@/utils/request'

export interface Comment {
  id: number
  content: string
  author: {
    id: number
    username: string
    nickname?: string
  }
  post: {
    id: number
    title: string
  }
  likes: number
  replyCount: number
  status: 'approved' | 'pending' | 'rejected'
  createdAt: string
}

export interface CommentQuery {
  page: number
  size: number
  ordering: string
  keyword?: string
  status?: string
  startDate?: string
  endDate?: string
}

// 获取全局评论列表
export function getComments(params?: CommentQuery): Promise<AxiosResponse<ApiResponse<PaginatedResponse<Comment>>>> {
  return request.get<ApiResponse<PaginatedResponse<Comment>>>('/comments', { params })
}

// 获取文章评论列表
export function getPostComments(postId: number, params?: {
  page?: number
  size?: number
}): Promise<AxiosResponse<ApiResponse<Comment[]>>> {
  return request.get<ApiResponse<Comment[]>>(`/posts/${postId}/comments`, { params })
}

// 创建评论
export function createComment(postId: number, data: CreateCommentRequest): Promise<AxiosResponse<ApiResponse<Comment>>> {
  return request.post<ApiResponse<Comment>>(`/posts/${postId}/comments`, data)
}

// 获取评论详情
export function getCommentDetail(id: number): Promise<AxiosResponse<ApiResponse<Comment>>> {
  return request.get<ApiResponse<Comment>>(`/comments/${id}`)
}

// 更新评论
export function updateComment(id: number, data: UpdateCommentRequest): Promise<AxiosResponse<ApiResponse<Comment>>> {
  return request.put<ApiResponse<Comment>>(`/comments/${id}`, data)
}

// 删除评论
export function deleteComment(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/comments/${id}`)
}

// 批量删除评论
export function batchDeleteComments(ids: number[]): Promise<AxiosResponse<ApiResponse<{ deleted_count: number }>>> {
  return request.delete<ApiResponse<{ deleted_count: number }>>('/comments/batch', { data: { ids } })
}

// 更新评论状态
export function updateCommentStatus(id: number, status: 'approved' | 'rejected' | 'pending'): Promise<AxiosResponse<ApiResponse<Comment>>> {
  return request.patch<ApiResponse<Comment>>(`/comments/${id}/status`, { status })
}

// 批量更新评论状态
export function batchUpdateCommentStatus(ids: number[], status: 'approved' | 'rejected'): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.put<ApiResponse<null>>('/comments/batch/status', { ids, status })
} 