import store from '@/store'
import router from '../router';

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions
    const permissionDatas = value
    const all_permission = "*:*:*";

    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })

    return hasPermission;

  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}
// export const hasPermi = (permission) => {
//   const store = require('@/store').default
//   const permissions = store.state.permission.buttonPermissions || {}

//   return Object.values(permissions).some(
//     permList => Array.isArray(permList) && permList.includes(permission)
//   )
// }
// export function hasBtnPermission(permissionCode) {
//   const currrentRoute = router.currentRoute
//   return store.getters.hasButtonPermission(currrentRoute.path, permissionCode)
// }
// export function installPermission(Vue) {
//   Vue.prototype.hasPermi = hasBtnPermission
// }
/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    const super_admin = "admin";

    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })

    return hasRole;

  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}