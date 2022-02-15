import axios from 'axios'
import {messageError} from '@/utils/helper'
import config from "@/config"
import router from '@/router'

const httpRequest = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.VITE_API_URI
})

//请求拦截器
httpRequest.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

// 响应拦截器
httpRequest.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  switch (error.response.status) {
    case 401:
      router.push({name: config.loginRouteName})
      break
    case 422:
      let message = '';
      for (let key in error.response.data.errors) {
        let items = error.response.data.errors[key]
        if (typeof items === 'string') {
          message += `${items} \n`
        } else {
          error.response.data.errors[key].forEach( item => {
            message += `${item} \n`
          })
        }
      }
      messageError(message)
      break
    case 404:
      messageError('404 页面不存在')
      break
    case 500:
      messageError(error.response.data.message)
      break
    default:
      messageError(error.response.data.message)
  }
  // 对响应错误做点什么
  return Promise.reject(error);
});


export default httpRequest