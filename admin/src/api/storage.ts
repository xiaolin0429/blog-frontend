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
  
  return request.post<ApiResponse<UploadResponse>>('/storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除文件
export function deleteFile(path: string): Promise<AxiosResponse<ApiResponse<null>>> {
  return request.delete<ApiResponse<null>>(`/storage/upload/${encodeURIComponent(path)}`)
}

// 获取文件列表
export function getFiles(params: FileQuery): Promise<AxiosResponse<ApiResponse<FileListResponse>>> {
  // 确保 type 参数在为 'all' 时不传递给后端
  const queryParams = { ...params }
  if (queryParams.type === 'all') {
    delete queryParams.type
  }
  
  // 打印请求参数
  console.log('Get files request params:', queryParams)
  
  return request.get<ApiResponse<FileListResponse>>('/storage/files', { 
    params: queryParams,
    // 添加错误处理
    validateStatus: (status) => {
      return true // 不抛出错误，让我们能看到详细的错误响应
    }
  }).then(response => {
    // 打印完整的响应信息
    console.log('Get files response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    })
    return response
  }).catch(error => {
    // 打印详细的错误信息
    console.error('Get files error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    })
    throw error
  })
}

// 重命名文件
export function renameFile(path: string, newName: string): Promise<AxiosResponse<ApiResponse<FileInfo>>> {
  return request.put<ApiResponse<FileInfo>>(`/storage/files/${encodeURIComponent(path)}/rename`, {
    new_name: newName
  })
} 