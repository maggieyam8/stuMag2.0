import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'
import {getSysPerValue} from '@/api/device/course'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    menus: [], //存储菜单数据
    userId: null,
    userName: null,
    SysPerValue: null,
    account: null,
    userRole: null,
    isStudent: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_PERMISSION(state, { role, isStudent }) {
      state.userRole = role;
      state.isStudent = isStudent;
    },

    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_SYSPERVALUE: (state, SysPerValue) => {
      state.SysPerValue = SysPerValue
      if (SysPerValue && typeof SysPerValue === 'object') {
        state.isStudent = SysPerValue.isStudent === true;
      }
    },
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_IS_STUDENT: (state, isStudent) => {
      state.isStudent = isStudent
    }
  },

  actions: {
    
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      //console.log("发起登录请求，参数:", { username, password }); // 调试日志
      return new Promise((resolve, reject) => {
         login(username, password).then(res => {
        //   var res = {
        //     "msg": "操作成功",
        //     "code": 200,
        //     "token": "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImU2ZGU0M2I4LTNmYjYtNDJmYi1hODJhLTY0ZGU5N2JiYjdkOSJ9.0XIpUNKLYgfMT65xboaRYRCjG5X6otkkNRkk5O55zQCG2_erocPutNd6iAZdrFqBmPHNN-y5zwSI9i7XbEtm0w"
        // }
        //console.log('登录返回数据:', res);
      
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
       })
    },
    // 用户登录
    // Login({ commit }, userInfo) {
    //   return new Promise((resolve, reject) => {
    //     login(userInfo).then(response => {
    //       const { data } = response;
    //       commit('SET_TOKEN', data.token);
    //       commit('SET_USER_INFO', data.userInfo);
    //       resolve();
    //     }).catch(error => {
    //       reject(error);
    //     });
    //   });
    // },

    //获取用户信息
    // GetInfo({ commit, state }) {
    //   return new Promise((resolve, reject) => {
    //     getInfo().then(res => {
    //     // var res = {
    //     //   "msg": "操作成功",
    //     //   "code": 200,
    //     //   "permissions": [
    //     //     "*:*:*"
    //     //   ],
    //     //   "roles": [
    //     //     "admin"
    //     //   ],
    //     //   "user": {
    //     //     "createBy": "admin",
    //     //     "createTime": "2024-06-30 11:27:11",
    //     //     "updateBy": null,
    //     //     "updateTime": null,
    //     //     "remark": "管理员",
    //     //     "userId": 1,
    //     //     "deptId": 103,
    //     //     "userName": "admin",
    //     //     "nickName": "若依",
    //     //     "email": "ry@163.com",
    //     //     "phonenumber": "15888888888",
    //     //     "sex": "1",
    //     //     "avatar": "",
    //     //     "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
    //     //     "status": "0",
    //     //     "delFlag": "0",
    //     //     "loginIp": "220.173.103.187",
    //     //     "loginDate": "2025-02-12T15:17:16.000+08:00",
    //     //     "dept": {
    //     //       "createBy": null,
    //     //       "createTime": null,
    //     //       "updateBy": null,
    //     //       "updateTime": null,
    //     //       "remark": null,
    //     //       "deptId": 103,
    //     //       "parentId": 101,
    //     //       "ancestors": "0,100,101",
    //     //       "deptName": "研发部门",
    //     //       "orderNum": 1,
    //     //       "leader": "若依",
    //     //       "phone": null,
    //     //       "email": null,
    //     //       "status": "0",
    //     //       "delFlag": null,
    //     //       "parentName": null,
    //     //       "children": []
    //     //     },
    //     //     "roles": [
    //     //       {
    //     //         "createBy": null,
    //     //         "createTime": null,
    //     //         "updateBy": null,
    //     //         "updateTime": null,
    //     //         "remark": null,
    //     //         "roleId": 1,
    //     //         "roleName": "超级管理员",
    //     //         "roleKey": "admin",
    //     //         "roleSort": 1,
    //     //         "dataScope": "1",
    //     //         "menuCheckStrictly": false,
    //     //         "deptCheckStrictly": false,
    //     //         "status": "0",
    //     //         "delFlag": null,
    //     //         "flag": false,
    //     //         "menuIds": null,
    //     //         "deptIds": null,
    //     //         "permissions": null,
    //     //         "admin": true
    //     //       }
    //     //     ],
    //     //     "roleIds": null,
    //     //     "postIds": null,
    //     //     "roleId": null,
    //     //     "admin": true
    //     //   }
      
    //     const user = res.user
    //     let avatar = user.avatar || ""
    //     if (!isHttp(avatar)) {
    //       avatar = (isEmpty(avatar)) ? defAva : process.env.VUE_APP_BASE_API + avatar
    //     }
    //     if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
    //       commit('SET_ROLES', res.roles)
    //       commit('SET_PERMISSIONS', res.permissions)
    //     } else {
    //       commit('SET_ROLES', ['ROLE_DEFAULT'])
    //     }
    //     commit('SET_ID', user.userId)
    //     commit('SET_NAME', user.userName)
    //     commit('SET_AVATAR', avatar)
    //     resolve(res)
    //   }).catch(error => {
    //     reject(error)
    //   })
    //   // })
    // },

    // 获取用户信息
    
    
    
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(res => {
          // var res = {
          //       "msg": "操作成功",
          //       "code": 200,
          //       "permissions": [
          //           "*:*:*"
          //       ],
          //       "roles": [
          //           "admin"
          //       ],
          //       "user": {
          //           "createBy": "admin",
          //           "createTime": "2023-04-23 16:11:38",
          //           "updateBy": null,
          //           "updateTime": null,
          //           "remark": "管理员",
          //           "userId": 1,
          //           "deptId": 103,
          //           "userName": "admin",
          //           "nickName": "若依",
          //           "email": "ry@163.com",
          //           "phonenumber": "15888888888",
          //           "sex": "1",
          //           "avatar": "",
          //           "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
          //           "status": "0",
          //           "delFlag": "0",
          //           "loginIp": "113.200.214.162",
          //           "loginDate": "2023-08-02T13:48:36.000+08:00",
          //           "dept": {
          //               "createBy": null,
          //               "createTime": null,
          //               "updateBy": null,
          //               "updateTime": null,
          //               "remark": null,
          //               "deptId": 103,
          //               "parentId": 101,
          //               "ancestors": "0,100,101",
          //               "deptName": "研发部门",
          //               "orderNum": 1,
          //               "leader": "若依",
          //               "phone": null,
          //               "email": null,
          //               "status": "0",
          //               "delFlag": null,
          //               "parentName": null,
          //               "children": []
          //           },
          //           "roles": [
          //               {
          //                   "createBy": null,
          //                   "createTime": null,
          //                   "updateBy": null,
          //                   "updateTime": null,
          //                   "remark": null,
          //                   "roleId": 1,
          //                   "roleName": "超级管理员",
          //                   "roleKey": "admin",
          //                   "roleSort": 1,
          //                   "dataScope": "1",
          //                   "menuCheckStrictly": false,
          //                   "deptCheckStrictly": false,
          //                   "status": "0",
          //                   "delFlag": null,
          //                   "flag": false,
          //                   "menuIds": null,
          //                   "deptIds": null,
          //                   "permissions": null,
          //                   "admin": true
          //               }
          //           ],
          //           "roleIds": null,
          //           "postIds": null,
          //           "roleId": null,
          //           "admin": true
          //       }
          //   }

          const user = res.user
          const avatar = (user.avatar == "" || user.avatar == null) ? require("@/assets/images/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          commit('SET_ROLES', [user.BtnLimits])
          commit('SET_PERMISSIONS', res.permissions)
          // if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          // } else {
          //   commit('SET_ROLES', ['ROLE_DEFAULT'])
          // }
          commit('SET_NAME', user.UName)
          commit('SET_USERID', user.UID)
          commit('SET_USERNAME', user.UName)
          commit('SET_AVATAR', avatar)
          commit('SET_SYSPERVALUE', user.SysPerValue)
          commit('SET_ACCOUNT', user.Account)

          if (user.SysPerValue?.StudentManager?.Permisson) {
            commit('SET_PERMISSION', {
              role: user.SysPerValue.StudentManager.Permisson,
              isStudent: user.SysPerValue.isStudent
            })
          }
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },


    // 退出系统
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeToken()
        resolve()
      }).catch(error => {
        reject(error)
        // })
      })
    }, 

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

 

    async fetchPermission({ commit }) {
      try {
        const res = await getSysPerValue();
        if (res.code === 200) {
          commit('SET_PERMISSION', {
            role: res.role,
            isStudent: res.isStudent
          });
        }
      } catch (err) {
        console.error('获取权限失败:', err);
      }
    }

  }
}

export default user
