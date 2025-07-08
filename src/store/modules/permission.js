import auth from '@/plugins/auth'
import router, { constantRoutes, dynamicRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const state = {
  routes: [],
  addRoutes: [],
  defaultRoutes: [],
  topbarRouters: [],
  sidebarRouters: [],
  buttonPermissions: {},
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_DEFAULT_ROUTES: (state, routes) => {
    state.defaultRoutes = constantRoutes.concat(routes)
  },
  SET_TOPBAR_ROUTES: (state, routes) => {
    state.topbarRouters = routes
  },
  SET_SIDEBAR_ROUTERS: (state, routes) => {
    state.sidebarRouters = routes
  },
  SET_BUTTON_PERMISSIONS: (state, permissions) => {
    state.buttonPermissions = permissions
  }
}
const actions = {
  // 生成路由
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      // 向后端请求路由数据
      getRouters().then(res => {
        try {
          // const menuData = transformMenu(res.data.data)
          const menuData = res.data
          //按钮权限
          const buttonPermissions = {}
          const extractButtons = (routes) => {
            routes.forEach(route => {
              if (route.meta?.buttons) {
                buttonPermissions[route.path] = route.meta.buttons.map(btn => btn.code)
              }
              if (route.children) {
                extractButtons(route.children)
              }
            })
          }
          extractButtons(menuData)
          commit('SET_BUTTON_PERMISSIONS', buttonPermissions)

          const sdata = JSON.parse(JSON.stringify(menuData))
          const rdata = JSON.parse(JSON.stringify(menuData))
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true)
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes)
          rewriteRoutes.push({ path: '*', redirect: '/404', hidden: true })
          router.addRoutes(asyncRoutes)
          commit('SET_ROUTES', rewriteRoutes)
          commit('SET_SIDEBAR_ROUTERS', constantRoutes.concat(sidebarRoutes))
          commit('SET_DEFAULT_ROUTES', sidebarRoutes)
          commit('SET_TOPBAR_ROUTES', sidebarRoutes)
          resolve(rewriteRoutes)
        } catch (error) {
          console.error('路由处理错误', error)
        }
      }).catch(error => {
        console.error('获取菜单失败：', error)
      })
    })

  }
}


function transformMenuChildren(data) {
  return data.map(item => {
    return {
      name: item.MName,
      path: item.Path,
      hidden: false,
      component: item.Component,
      meta: {
        title: item.MName,
        icon: item.Icon,
        noCache: false,
        link: null,
      }
    }
  })
}
function transformMenu(data) {
  return data.map(item => {
    return {
      name: item.MName,
      path: '/' + item.Path,
      hidden: false,
      redirect: 'noRedirect',
      component: 'Layout',
      alwaysShow: true,
      meta: {
        title: item.MName,
        icon: item.Icon,
        noCache: false,
        link: null,
      },
      children: item.Children && item.Children.length > 0
        ? transformMenuChildren(item.Children)
        : []
    }
  })
}
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    //buttons数据
    if (route.meta?.buttons) {
      route.meta.buttons = route.meta.buttons
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === 'ParentView' && !lastRouter) {
        el.children.forEach(c => {
          c.path = el.path + '/' + c.path
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c))
            return
          }
          children.push(c)
        })
        return
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + '/' + el.path
      if (el.children && el.children.length) {
        children = children.concat(filterChildren(el.children, el))
        return
      }
    }
    children = children.concat(el)
  })
  return children
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes) {
  const res = []
  routes.forEach(route => {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route)
      }
    } else if (route.roles) {
      if (auth.hasRoleOr(route.roles)) {
        res.push(route)
      }
    }
  })
  return res
}

export const loadView = (view) => {
  if (process.env.NODE_ENV === 'development') {
    return (resolve) => require([`@/views/${view}`], resolve)
  } else {
    // 使用 import 实现生产环境的路由懒加载
    return () => import(`@/views/${view}`)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters: {
    hasButtonPermission: (state) => (path, permissionCode) => {
      return state.buttonPermissions[path]?.includes(permissionCode) || false
    }
  }
}
