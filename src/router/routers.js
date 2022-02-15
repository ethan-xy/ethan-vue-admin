import LayoutsPage from "@/views/layouts/index.vue";
import MenuPage from "@/views/menu/index.vue";
import AdminUserPage from "@/views/admin-user/index.vue";
import Permission from "@/views/permission/index.vue";
import LoginPage from "@/views/login/index.vue";
import dashboard from "@/views/dashboard/routes";
import role from "@/views/role/routes";
import permissionGroup from "@/views/permission-group/routes";

const routes = [
  {
    name: 'main',
    path: '/',
    meta: {
      title: 'home'
    },
    redirect: {
      name: 'dashboard',
    },
    component: LayoutsPage,
    children: [
      ...role,
      ...dashboard,
      ...permissionGroup,
      {
        path: '/menu',
        name: 'menu',
        component: MenuPage,
        meta: {
          title: '菜单',
          cache: true,
          permission: 'menu.index',
          provider: 'admin'
        }
      },
      {
        path: '/admin-user',
        name: 'admin-user',
        component: AdminUserPage,
        meta: {
          title: '管理员',
          cache: true,
          permission: 'admin-user.index',
          provider: 'admin'
        }
      },
      {
        path: '/permission',
        name: 'permission',
        component: Permission,
        meta: {
          title: '权限',
          cache: true,
          permission: 'permission.index',
          provider: 'admin'
        }
      },
    ]
  },
  {
    name: 'login',
    path: '/login',
    component: LoginPage
  },
]

export default routes