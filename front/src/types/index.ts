// 导出所有类型定义，方便通过 @/types 统一导入

// 导出标签相关类型
export * from './tag';

// 导出文章相关类型
export * from './post';

// 导出通用类型
export * from './common';

// 分类接口定义
export interface Category {
  id: number
  name: string
  description?: string
  parent?: number | null
  level?: number
  post_count?: number
  children?: Category[]
  created_at?: string
  updated_at?: string
} 