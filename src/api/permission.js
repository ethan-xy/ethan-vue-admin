import http from '@/utils/http'

export const getPermissions = (params) => {
  return http.get('/api/permission', {params})
}

export const addPermission = (data) => {
  return http.post('/api/permission', data)
}

export const editPermission = (id, data) => {
  return http.patch(`/api/permission/${id}`, data)
}

export const deletePermission = id => {
  return http.delete(`/api/permission/${id}`)
}

export const userAllPermissions = () => {
  return http.get('/api/permission-user-all')
}