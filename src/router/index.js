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

router.beforeEach( (to, from,next) => {
  if (config.loginRouteName === to.name) {
    next()
  }

  let provider = to.meta.provider

  let login = new Promise((resolve, reject) => {
    localforage.getItem('token' + provider).then(token => {
      if (!token || !token.hasOwnProperty('token')) {
        reject({name: config.loginRouteName})
      }

      if (!store.getters.token) {
        store.commit('SET_TOKEN', {token, provider})
        resolve()
      }

      resolve()
    }).catch(err => {
      reject(err)
    })
  })

  let permission = new Promise((resolve, reject) => {
    localforage.getItem('permissions' + to.meta.provider).then(permissions => {
      if (!to.meta.permission) {
        resolve()
      }

      if (permissions && permissions.indexOf(to.meta.permission) < 0) {
        reject(`用户没有正确的权限- ${to.meta.permission}`)
      }

      resolve()
    }).catch(err => {
      reject(error)
    })
  })

  Promise.all([login, permission]).then( result => {
    next()
  }).catch( error => {
    let varType = typeof error;
    if (varType === 'object') {
      next({name: error.name})
    } else {
      messageError({
        message: error,
        type: 'error'
      })
      next({name: from.name})
    }
  })
})

export default router;
