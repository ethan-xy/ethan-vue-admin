import http from '@/utils/http'

export const getRoles = (params) => {
  return http.get('/api/role', {params})
}

export const addRole = (data) => {
  return http.post('/api/role', data)
}

export const editRole = (id, data) => {
  return http.patch(`/api/role/${id}`, data)
}

export const deleteRole = id => {
  return http.delete(`/api/role/${id}`)
}

export const rolePermission = (id) => {
  return http.get(`/api/role-permissions/${id}`)
}

export const roleAssignPermission = (id, permissions) => {
  return http.put(`/api/role-assign-permissions/${id}`, {
    permissions
  })
}

export const guardNameRoles = (guardName) => {
  return http.get(`/api/guard-name-roles/${guardName}`)
}
