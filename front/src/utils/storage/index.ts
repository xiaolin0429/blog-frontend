const TOKEN_KEY = 'blog_token'
const USER_KEY = 'blog_user'
const THEME_KEY = 'blog_theme'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getUser = (): any | null => {
  const user = localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY)
}

export const getTheme = (): 'light' | 'dark' => {
  return localStorage.getItem(THEME_KEY) as 'light' | 'dark' || 'light'
}

export const setTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme)
}

export const clearStorage = (): void => {
  localStorage.clear()
} 