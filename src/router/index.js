import {createRouter, createWebHistory} from 'vue-router'
import config from '@/config'
import localforage from 'localforage'
import {messageError} from '@/utils/helper'
import store from '@/store'
import routes from './routers'


const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  if (config.loginRouteName === to.name) {
    return true
  }

  let provider = to.meta.provider

  let login = await localforage.getItem('token' + provider).then(token => {
    if (!token || !token.hasOwnProperty('token')) {
      router.push({name: config.loginRouteName})
      return false
    }

    if (!store.getters.token) {
      store.commit('SET_TOKEN', {token, provider})
    }

    return true
  }).catch(err => {
    messageError({
      message: err,
      type: 'error'
    })
    return false
  })

  let permission = await localforage.getItem('permissions' + to.meta.provider).then(permissions => {
    if (!to.meta.permission) {
      return true
    }

    if (permissions && permissions.indexOf(to.meta.permission) < 0) {
      messageError({
        message: 'User does not have the right permissions.',
        type: 'error'
      })
      return false
    }

    return true
  }).catch(err => {
    messageError({
      message: err,
      type: 'error'
    })
    return false
  })

  return login && permission
})

export default router;
