import type { AxiosResponse } from 'axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { 
  Post,
  PostListItem,
  PostQuery,
  CreatePostRequest,
  UpdatePostRequest,
  AutoSavePostRequest,
  AutoSavePostResponse,
  PostLikeResponse,
  PostViewResponse,
  RelatedPost
} from '@/types/post'
import request from '@/utils/request'

// 获取文章列表
export function getPosts(params: PostQuery): Promise<AxiosResponse<ApiResponse<PaginatedResponse<PostListItem>>>> {
  return request.get<ApiResponse<PaginatedResponse<PostListItem>>>('/posts/', { params })
}

// 获取文章详情
export function getPost(id: number): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.get<ApiResponse<Post>>(`/posts/${id}/`)
}

// 创建文章
export function createPost(data: CreatePostRequest): Promise<AxiosResponse<ApiResponse<Post>>> {
  // 确保数据类型正确
  const formData = {
    ...data,
    category_id: Number(data.category_id),
    tag_ids: data.tag_ids?.map(Number) || [],
    pinned: Boolean(data.pinned),
    allowComment: Boolean(data.allowComment),
    status: data.status || 'draft',
    // 确保日期格式正确
    published_at: data.published_at ? new Date(data.published_at).toISOString() : undefined,
    // 确保空字符串转为 undefined
    excerpt: data.excerpt || undefined,
    password: data.password || undefined,
    cover: data.cover || undefined,
    meta_description: data.meta_description || undefined,
    meta_keywords: data.meta_keywords || undefined
  } as Record<string, any>
  
  // 移除所有 undefined 的字段
  Object.keys(formData).forEach(key => {
    if (formData[key] === undefined) {
      delete formData[key]
    }
  })
  
  return request.post<ApiResponse<Post>>('/posts/', formData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新文章
export function updatePost(id: number, data: UpdatePostRequest): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.put<ApiResponse<Post>>(`/posts/${id}/`, data)
}

// 删除文章（移动到回收站）
export function deletePost(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/posts/${id}/`)
}

// 自动保存文章
export function autoSavePost(id: number, data: AutoSavePostRequest): Promise<AxiosResponse<ApiResponse<AutoSavePostResponse>>> {
  return request.post<ApiResponse<AutoSavePostResponse>>(`/posts/${id}/auto-save/`, data)
}

// 获取自动保存内容
export function getAutoSavePost(id: number): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.get<ApiResponse<Post>>(`/posts/${id}/auto-save/`)
}

// 文章点赞
export function likePost(id: number): Promise<AxiosResponse<ApiResponse<PostLikeResponse>>> {
  return request.post<ApiResponse<PostLikeResponse>>(`/posts/${id}/like`)
}

// 取消文章点赞
export function unlikePost(id: number): Promise<AxiosResponse<ApiResponse<PostLikeResponse>>> {
  return request.post<ApiResponse<PostLikeResponse>>(`/posts/${id}/unlike`)
}

// 浏览文章
export function viewPost(id: number): Promise<AxiosResponse<ApiResponse<PostViewResponse>>> {
  return request.post<ApiResponse<PostViewResponse>>(`/posts/${id}/view`)
}

// 归档文章
export function archivePost(id: number): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.post<ApiResponse<Post>>(`/posts/${id}/archive`)
}

// 获取相关文章
export function getRelatedPosts(id: number): Promise<AxiosResponse<ApiResponse<RelatedPost[]>>> {
  return request.get<ApiResponse<RelatedPost[]>>(`/posts/${id}/related`)
}

// 文件上传 API
export function uploadImage(data: FormData): Promise<AxiosResponse<ApiResponse<string>>> {
  return request.post<ApiResponse<string>>('/upload/image', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const postApi = {
  getTags: async (params: { page: number; size: number }) => {
    const res = await request.get('/tags', { params })
    return res.data.data
  },
  createTag: (data: { name: string; slug: string }) => request.post('/tags', data),
  updateTag: (id: number, data: { name: string; slug: string }) => request.put(`/tags/${id}`, data),
  deleteTag: (id: number) => request.delete(`/tags/${id}`)
} 