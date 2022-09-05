import {login, logout} from '@/api/auth'
import localforage from 'localforage'

const state = {
  token: '',
}

const getters = {
  token: state => state.token,
  provider: state => state.provider,
}

const mutations = {
  SET_TOKEN(state, {token, provider}) {
    state.token = token
    state.provider = provider
  }
}

const actions = {
  loginHandle({commit}, params) {
    return new Promise((resolve, reject) => {
      return login(params)
        .then(response => {
          const token = response.data.data
          const provider = params.provider
          commit('SET_TOKEN', {token, provider})
          localforage.setItem('token' + provider, token)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  logoutHandle({commit}, provider) {
    return new Promise((resolve, reject) => {
      return logout().then(() => {
        localforage.removeItem('token' + provider)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}