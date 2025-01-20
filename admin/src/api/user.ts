import request from '@/utils/request'

interface UserInfo {
  id: number
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  bio: string | null
  date_joined: string
  last_login: string | null
}

interface RegisterParams {
  username: string
  email: string
  password: string
  password2: string
  nickname?: string
}

/**
 * 用户注册
 * @POST /api/v1/users
 */
export function register(data: RegisterParams) {
  return request<UserInfo>({
    url: '/users',
    method: 'post',
    data
  })
}

/**
 * 获取当前用户信息
 * @GET /api/v1/users/me
 */
export function getUserInfo() {
  return request<UserInfo>({
    url: '/users/me',
    method: 'get'
  })
}

/**
 * 更新当前用户信息
 * @PUT /api/v1/users/me
 */
export function updateUserInfo(data: Partial<UserInfo>) {
  return request<UserInfo>({
    url: '/users/me',
    method: 'put',
    data
  })
} 