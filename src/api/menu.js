import http from '@/utils/http'

export const myMenu = () => {
  return http.get('/api/menu-my')
}

export const getMenuList = (params) => {
  return http.get('/api/menu', {
    params
  })
}

export const addMenu = (data) => {
  return http.post('/api/menu', data)
}

export const editMenu = (id, data) => {
  return http.patch(`/api/menu/${id}`, data)
}

export const deleteMenu = id => {
  return http.delete(`/api/menu/${id}`)
}