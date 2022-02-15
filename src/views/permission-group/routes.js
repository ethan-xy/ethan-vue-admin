import permissionGroupPage from "./index.vue"

export default [
  {
      path: 'permission-group',
      name: 'permission-group',
      component: permissionGroupPage,
      meta: {
        title: '权限组',
        cache: true,
        permission: 'permission-group.index',
        notClosable: false,
        provider: 'admin'
      }
    },
]
