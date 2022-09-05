import RolePage from "./index.vue"

export default [
  {
      path: 'role',
      name: 'role',
      component: RolePage,
      meta: {
        title: '角色',
        cache: true,
        permission: 'role.index',
        notClosable: false,
        provider: 'admin'
      }
    },
]
