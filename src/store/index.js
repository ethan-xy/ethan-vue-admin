import {createStore} from "vuex"
import tag from './modules/tag'
import breadcrumb from './modules/breadcrumb'
import auth from './modules/auth'
import permission from './modules/permission'
import socket from './modules/socket'
import httpRequest from '@/utils/http'

const plugin = (store) => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'SET_TOKEN':
        httpRequest.defaults.headers.common['Authorization'] = `Bearer ${state.auth.token.token}`
        // httpRequest.defaults.headers.common['Authorization'] = `Bearer 37|WJwGIVpYNKr8ARTW74xQ1KeRAvO8I4kPDiIDj7IG`
        break
    }
  })
}

const store = createStore({
  modules: {
    tag,
    breadcrumb,
    auth,
    permission,
    socket
  },
  plugins: [plugin]
})

export default store