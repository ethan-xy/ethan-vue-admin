import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/style.css'
import * as icons from '@element-plus/icons'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

import router from '@/router'
import store from '@/store'
import Particles from "particles.vue3";
import App from '@/App.vue'

const app = createApp(App)
  .use(router)
  .use(store)
  .use(Particles)
  .use(ElementPlus, {
    locale: zhCn,
  })

Object.keys(icons).forEach(key => {
  app.component(key, icons[key])
})

app.mount('#app')