import request from '@/utils/request'
import type { PaginatedResponse } from '@/types/api'

export interface Comment {
  id: number
  content: string
  author: {
    id: number
    username: string
    nickname: string | null
    avatar: string | null
  }
  post: {
    id: number
    title: string
  }
  parent: number | null
  likes: number
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
  replyCount?: number
}

export interface CommentQuery {
  page: number
  size: number
  ordering: string
  keyword?: string
  status?: string
  post?: number
  author?: number
  startDate?: string
  endDate?: string
}

/**
 * 获取全局评论列表
 * @GET /api/v1/post/comments/
 */
export function getComments(params: CommentQuery) {
  return request.get<PaginatedResponse<Comment>>('/post/comments/', { params })
}

/**
 * 删除评论
 * @DELETE /api/v1/post/comments/{id}/
 */
export function deleteComment(id: number) {
  return request.delete<null>(`/post/comments/${id}/`)
}

/**
 * 批量删除评论
 * @DELETE /api/v1/post/comments/batch/
 */
export function batchDeleteComments(ids: number[]) {
  return request.delete<null>('/post/comments/batch/', { data: { ids } })
}

/**
 * 审核评论
 * @PUT /api/v1/post/comments/{id}/status/
 */
export function updateCommentStatus(id: number, status: 'approved' | 'rejected') {
  return request.put<Comment>(`/post/comments/${id}/status/`, { status })
}

/**
 * 批量审核评论
 * @PUT /api/v1/post/comments/batch/status/
 */
export function batchUpdateCommentStatus(ids: number[], status: 'approved' | 'rejected') {
  return request.put<null>('/post/comments/batch/status/', { ids, status })
} 