import type { PaginatedResponse, PostQuery, PageQuery } from '@/types/api'
import type { PostResponse, Category, Tag, CreatePostRequest, UpdatePostRequest } from '@/types/post'
import request from '@/utils/request'

// 文章相关 API
export function getPosts(query: PostQuery): Promise<PaginatedResponse<PostResponse>> {
  return request.get<PaginatedResponse<PostResponse>>('/posts/', { params: query })
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
  return request.put<{ code: number, message: string, data: PostResponse }>(`/posts/${id}/`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function deletePost(id: number): Promise<{ code: number, message: string }> {
  return request.delete<{ code: number, message: string }>(`/posts/${id}/`)
}

// 分类相关 API
export function getCategories(query: PageQuery): Promise<PaginatedResponse<Category>> {
  return request.get<PaginatedResponse<Category>>('/categories/', { params: query })
}

export function createCategory(data: { name: string, description?: string }): Promise<{ code: number, message: string, data: Category }> {
  return request.post<{ code: number, message: string, data: Category }>('/post/categories/', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
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
export function getTags(query: PageQuery): Promise<PaginatedResponse<Tag>> {
  return request.get<PaginatedResponse<Tag>>('/tags/', { params: query })
}

export function createTag(data: { name: string }): Promise<{ code: number, message: string, data: Tag }> {
  return request.post<{ code: number, message: string, data: Tag }>('/tags/', data)
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