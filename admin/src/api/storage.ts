import type { AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import type { FileInfo, FileQuery, FileListResponse, UploadParams, UploadResponse } from '@/types/storage'
import request from '@/utils/request'

// 上传文件
export function uploadFile(params: UploadParams): Promise<AxiosResponse<ApiResponse<UploadResponse>>> {
  const formData = new FormData()
  formData.append('file', params.file)
  if (params.type) {
    formData.append('type', params.type)
  }
  if (params.path) {
    formData.append('path', params.path)
  }
  
  return request.post<ApiResponse<UploadResponse>>('/storage/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除文件
export function deleteFile(fileId: string): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/storage/files/${fileId}`)
}

// 获取文件列表
export function getFiles(params: FileQuery): Promise<AxiosResponse<ApiResponse<FileListResponse>>> {
  // 确保 type 参数在为 'all' 时不传递给后端
  const queryParams = { ...params }
  if (queryParams.type === 'all') {
    delete queryParams.type
  }
  
  return request.get<ApiResponse<FileListResponse>>('/storage/files', { 
    params: queryParams
  })
}

// 重命名文件
export function renameFile(fileId: string, newName: string): Promise<AxiosResponse<ApiResponse<FileInfo>>> {
  return request.put<ApiResponse<FileInfo>>(`/storage/files/${fileId}/rename`, {
    new_name: newName
  })
} 