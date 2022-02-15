import {ElMessage, ElMessageBox} from "element-plus"
import routers from '@/router/routers'
import router from '@/router'

export const routeFormatTag = route => {
  return {
    name: route.name,
    fullPath: route.fullPath,
    title: route.meta.title ? route.meta.title : '',
    cache: route.meta && route.meta.cache,
    closable: !route.meta.notClosable,
  }
}

export const routeByName = (name) => {
  let router;
  let each = (routers, name) => {
    for (let item of routers) {
      if (item.name === name) {
        router = item
      }

      if (router) {
        break
      }

      if (item.hasOwnProperty('children') && item.children.length > 0) {
        each(item.children, name)
      }
    }

    return router;
  }

  return each(routers, name)
}

export const messageSuccess = (message = '成功') => {
  ElMessage.success(message)
}

export const messageError = (message = '失败') => {
  ElMessage.error(message)
}

export const elMessageBoxConfirm = (title, content, callback, type = 'Warning') => {
  ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: type,
    }
  ).then(() => {
    callback(router)
  })
}

export  const getNodeParentPath = (options, id) => {
  let path = [];

  if (options.length === 0) {
    return path;
  }

  let rev = (data, nodeId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      let node = data[i];

      if (node.id === nodeId) {
        path.unshift(node.id);
        rev(options, node.p_id);
        break;
      } else {
        if (node.children) {
          rev(node.children, nodeId);
        }
      }
    }

    return path;
  }


  return rev(options, id);
}