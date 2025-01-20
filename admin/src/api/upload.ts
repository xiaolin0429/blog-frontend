import request from '@/utils/request'

// 上传图片
export const uploadImage = (data: FormData) => {
  return request.post('/upload/image', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传头像
export const uploadAvatar = (data: FormData) => {
  return request.post('/upload/avatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传Logo
export const uploadLogo = (data: FormData) => {
  return request.post('/upload/logo', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传Favicon
export const uploadFavicon = (data: FormData) => {
  return request.post('/upload/favicon', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 