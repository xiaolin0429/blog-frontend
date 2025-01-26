import type { PaginatedResponse, PostQuery, PageQuery } from '@/types/api'
import type { PostResponse, Category, Tag, CreatePostRequest, UpdatePostRequest } from '@/types/post'
import type { ApiResponse } from '@/types/api'
import request from '@/utils/request'

// 文章相关 API
export function getPosts(params: PostQuery): Promise<ApiResponse<PaginatedResponse<PostResponse>>> {
  return request.get<ApiResponse<PaginatedResponse<PostResponse>>>('/api/v1/posts/', { params })
}

export function getPost(id: number): Promise<{ code: number, message: string, data: PostResponse }> {
  return request.get<{ code: number, message: string, data: PostResponse }>(`/posts/${id}/`)
}

export function createPost(data: CreatePostRequest): Promise<{ code: number, message: string, data: PostResponse }> {
  return request.post<{ code: number, message: string, data: PostResponse }>('/posts/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updatePost(id: number, data: UpdatePostRequest): Promise<{ code: number, message: string, data: PostResponse }> {
  return request.put<{ code: number, message: string, data: PostResponse }>(`/posts/${id}/update/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deletePost(id: number): Promise<{ code: number, message: string }> {
  return request.delete<{ code: number, message: string }>(`/posts/${id}/`)
}

// 分类相关 API
export function getCategories(params: { page: number; size: number; ordering: string }): Promise<ApiResponse<Category[]>> {
  return request.get<ApiResponse<Category[]>>('/api/v1/categories/', { params })
}

export function createCategory(data: { name: string, description?: string }): Promise<ApiResponse<Category>> {
  return request.post<ApiResponse<Category>>('/categories/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updateCategory(id: number, data: { name: string, description?: string, parent?: number | null }): Promise<ApiResponse<Category>> {
  return request.put<ApiResponse<Category>>(`/categories/${id}/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deleteCategory(id: number): Promise<ApiResponse<null>> {
  return request.delete<ApiResponse<null>>(`/categories/${id}/`)
}

// 快速创建分类
export function quickCreateCategory(data: { name: string }): Promise<{ code: number, message: string, data: Category }> {
  console.log('调用快速创建分类 API:', data)
  return request.post<{ code: number, message: string, data: Category }>('/post/categories/quick-create/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 标签相关 API
export function getTags(params: { page: number; size: number; ordering: string }): Promise<ApiResponse<PaginatedResponse<Tag>>> {
  return request.get('/api/v1/tags/', { params })
}

export function createTag(data: { name: string, description?: string }): Promise<ApiResponse<Tag>> {
  return request.post<ApiResponse<Tag>>('/tags/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function updateTag(id: number, data: { name: string, description?: string }): Promise<ApiResponse<Tag>> {
  return request.put<ApiResponse<Tag>>(`/tags/${id}/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deleteTag(id: number): Promise<ApiResponse<null>> {
  return request.delete<ApiResponse<null>>(`/tags/${id}/`)
}

// 文章操作相关 API
export function likePost(id: number): Promise<{ code: number, message: string, data: { likes: number } }> {
  return request.post<{ code: number, message: string, data: { likes: number } }>(`/posts/${id}/like/`)
}

export function viewPost(id: number): Promise<{ code: number, message: string, data: { views: number } }> {
  return request.post<{ code: number, message: string, data: { views: number } }>(`/posts/${id}/view/`)
}

export function archivePost(id: number): Promise<{ code: number, message: string, data: { id: number, status: string } }> {
  return request.post<{ code: number, message: string, data: { id: number, status: string } }>(`/posts/${id}/archive/`)
}

// 文件上传 API
export function uploadImage(data: FormData): Promise<{ code: number, message: string, data: string }> {
  return request.post<{ code: number, message: string, data: string }>('/upload/image/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getRelatedPosts(id: number): Promise<PostResponse[]> {
  return request.get<PostResponse[]>(`/posts/${id}/related/`)
}

export function unlikePost(id: number): Promise<null> {
  return request.post<null>(`/posts/${id}/unlike/`)
}

// 回收站相关 API
export function getTrashPosts(query: PageQuery): Promise<ApiResponse<{
  total: number
  page: number
  size: number
  pages: number
  items: PostResponse[]
}>> {
  return request.get<ApiResponse<{
    total: number
    page: number
    size: number
    pages: number
    items: PostResponse[]
  }>>('/api/v1/trash/posts', { params: query })
}

export function restorePost(id: number): Promise<ApiResponse<{
  id: number
  title: string
  status: string
}>> {
  return request.post<ApiResponse<{
    id: number
    title: string
    status: string
  }>>(`/api/v1/trash/posts/${id}/restore`)
}

export function deleteTrashPost(id: number): Promise<ApiResponse<null>> {
  return request.delete<ApiResponse<null>>(`/api/v1/trash/posts/${id}`)
}

export function clearTrash(): Promise<ApiResponse<{
  deleted_count: number
}>> {
  return request.delete<ApiResponse<{
    deleted_count: number
  }>>('/api/v1/trash/posts/empty')
}

// 自动保存文章
export function autoSavePost(id: number, data: {
  title: string
  content: string
  excerpt?: string
  category?: number
  tags?: string[]
  force_save?: boolean
}): Promise<{
  code: number
  message: string
  data: {
    version: number
    next_save_time: string
  }
}> {
  return request.post<{
    code: number
    message: string
    data: {
      version: number
      next_save_time: string
    }
  }>(`/posts/${id}/auto-save/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
} 