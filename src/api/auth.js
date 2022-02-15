import http from '@/utils/http'

export const login = (params) => {
  return http.post('/api/auth/login', params)
}

export const logout = () => {
  return http.post('/api/auth/logout')
}