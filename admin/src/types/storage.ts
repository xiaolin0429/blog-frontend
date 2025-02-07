import type { PageQuery } from './api'

// 文件类型
export type FileType = 'all' | 'image' | 'document' | 'media'

// 文件信息
export interface FileInfo {
  url: string
  path: string
  name: string
  original_name: string
  type: string
  size: number
  mime_type: string
  upload_time: string
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