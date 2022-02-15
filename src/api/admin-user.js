import http from '@/utils/http'

export const getAdminUser = (params) => {
  return http.get('/api/admin-user', {params})
}

export const addAdminUser = (data) => {
  return http.post('/api/admin-user', data)
}

export const editAdminUser = (id, data) => {
  return http.patch(`/api/admin-user/${id}`, data)
}

export const deleteAdminUser = id => {
  return http.delete(`/api/admin-user/${id}`)
}

export const getUserRoles = (id) => {
  return http.get(`/api/admin-user-roles/${id}`)
}

export const assignRoles = (id, roles) => {
  return http.put(`/api/admin-user-assign-roles/${id}`, {
    roles
  })
}