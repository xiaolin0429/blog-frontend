const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const clearTokens = () => {
  removeToken()
  removeRefreshToken()
} 