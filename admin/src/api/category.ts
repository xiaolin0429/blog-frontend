import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/types/category'
import request from '@/utils/request'

// 获取分类列表
export function getCategories(params?: {
  parent?: number | null
  search?: string
  ordering?: string  // 支持 order、name、created_at
  tree?: boolean    // 是否返回树形结构
}): Promise<AxiosResponse<ApiResponse<Category[]>>> {
  return request.get<ApiResponse<Category[]>>('/categories/', { params })
}

// 获取分类详情
export function getCategory(id: number): Promise<AxiosResponse<ApiResponse<Category>>> {
  return request.get<ApiResponse<Category>>(`/categories/${id}/`)
}

// 创建分类
export function createCategory(data: CreateCategoryRequest): Promise<AxiosResponse<ApiResponse<Category>>> {
  return request.post<ApiResponse<Category>>('/categories/', data)
}

// 更新分类
export function updateCategory(id: number, data: UpdateCategoryRequest): Promise<AxiosResponse<ApiResponse<Category>>> {
  return request.put<ApiResponse<Category>>(`/categories/${id}/`, data)
}

// 删除分类
export function deleteCategory(id: number): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/categories/${id}/`)
}

// 批量删除分类
export function batchDeleteCategories(ids: number[]): Promise<AxiosResponse<ApiResponse<{ deleted_count: number }>>> {
  return request.delete<ApiResponse<{ deleted_count: number }>>('/categories/batch/', { data: { ids } })
}

// 快速创建分类（简化版创建，用于文章编辑时快速添加分类）
export function quickCreateCategory(name: string): Promise<AxiosResponse<ApiResponse<Category>>> {
  return request.post<ApiResponse<Category>>('/categories/quick/', { name })
} 