import { userAllPermissions } from '@/api/permission'
import localforage from 'localforage'

const state = {
  permissions: []
}

const getters = {
  permissions: state => state.permissions,
  hasPermission: state => permissionName =>{
    return  state.permissions.indexOf(permissionName) >= 0
  }
}

const mutations = {
  SET_PERMISSIONS (state, permissions) {
    state.permissions = permissions
  }
}

const actions = {
  userPermissions ( { commit }, provider) {
    return userAllPermissions()
      .then(response => {
        commit('SET_PERMISSIONS', response.data.data)
        localforage.setItem('permissions' + provider, response.data.data)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}