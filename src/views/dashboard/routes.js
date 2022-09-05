import dashboardPage from "./index.vue"

export default [
  {
    name: 'dashboard',
    path: 'dashboard',
    meta: {
      title: '主页',
      cache: true,
      notClosable: true,
      provider: 'admin'
    },
    component: dashboardPage
  },
]
