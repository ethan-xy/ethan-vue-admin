import http from '@/utils/http'

export const getPermissionGroup = (params) => {
  return http.get('/api/permission-group', {params})
}

export const addPermissionGroup = (data) => {
  return http.post('/api/permission-group', data)
}

export const editPermissionGroup = (id, data) => {
  return http.patch(`/api/permission-group/${id}`, data)
}

export const deletePermissionGroup = id => {
  return http.delete(`/api/permission-group/${id}`)
}

export const getPermissionGroupAll = (params) => {
  return http.get('/api/permission-group-all', {params})
}

export const guardNameForPermissions = (guardName) => {
  return http.get(`/api/guard-name-for-permissions/${guardName}`)
}
