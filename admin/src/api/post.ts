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
  return request.get<ApiResponse<PaginatedResponse<PostListItem>>>('/posts', { params })
}

// 获取文章详情
export function getPost(id: number): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.get<ApiResponse<Post>>(`/posts/${id}`)
}

// 创建文章
export function createPost(data: CreatePostRequest): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.post<ApiResponse<Post>>('/posts', data)
}

// 更新文章
export function updatePost(id: number, data: UpdatePostRequest): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.put<ApiResponse<Post>>(`/posts/${id}`, data)
}

// 删除文章
export function deletePost(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/posts/${id}`)
}

// 自动保存文章
export function autoSavePost(id: number, data: AutoSavePostRequest): Promise<AxiosResponse<ApiResponse<AutoSavePostResponse>>> {
  return request.post<ApiResponse<AutoSavePostResponse>>(`/posts/${id}/auto-save`, data)
}

// 获取自动保存内容
export function getAutoSavePost(id: number): Promise<AxiosResponse<ApiResponse<Post>>> {
  return request.get<ApiResponse<Post>>(`/posts/${id}/auto-save`)
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