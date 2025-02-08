import type { PageQuery } from './api'

// 文件类型
export type FileType = 'all' | 'image' | 'document' | 'media'

// 文件信息
export interface FileInfo {
  id: string          // 文件ID
  url: string         // 文件访问URL
  path: string        // 文件存储路径
  name: string        // 文件名
  original_name: string // 原始文件名
  type: string        // 文件类型
  size: number        // 文件大小
  mime_type: string   // MIME类型
  upload_time: string // 上传时间
  isLoading?: boolean  // 添加可选的 isLoading 字段
}

// 文件列表查询参数
export interface FileQuery extends PageQuery {
  path?: string
  type?: FileType
}

// 文件列表响应
export interface FileListResponse {
  total: number
  page: number
  size: number
  pages: number
  items: FileInfo[]
}

// 文件上传参数
export interface UploadParams {
  file: File
  type?: string
  path?: string
}

// 文件上传响应
export interface UploadResponse extends FileInfo {} 