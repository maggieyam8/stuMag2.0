import request4 from '@/utils/request4'
import md5 from 'js-md5'
import store from '@/store' 

// 获取用户详细信息
export function reqGetUserInfo(data) {
    return request4({
        // url: '/UserConfig/GetUserInfo',
        url: '/UserConfig/GetUserInfo2',
        method: 'post',
        data
    })
}

// 获取权限角色列表1
export function reqGetRoleList() {
    return request4({
        // url: '/UserConfig/GetRoleList',
        url: '/UserConfig/GetRoleList2',
        method: 'post',
        data: {
            SystemName,
        }
    })
}


// 根据UID获取信息
export function reqGetUserInfoByUID(UID) {
    return request4({
        // url: '/UserConfig/GetUserInfoByUID',
        url: '/UserConfig/GetUserInfoByUID2',
        method: 'post',
        data: {
            SystemName,
            UID
        }
    })
}

// 新增
export function reqAddUserInfo(Info, OperateUser) {
    return request4({
        url: '/UserConfig/AddUserInfo2',
        method: 'post',
        data: {
            Info,
            OperateUser
        }
    })
}

// 修改
export function reqUpdateUserInfo(Info, OperateUser) {
    return request4({
        // url: '/UserConfig/UpdateUserInfo',
        url: '/UserConfig/UpdateUserInfo2',
        method: 'post',
        data: {
            Info,
            OperateUser
        }
    })
}

// 重置密码
export function reqResetPwdUserInfo(UID, pwd, OperateUser) {
    return request4({
        url: '/UserConfig/ResetPwdUserInfo',
        method: 'post',
        data: {
            UID,
            pwd,
            OperateUser
        }
    })
}

// 删除1
export function reqDeleteUserInfo(Uids, OperateUser) {
    return request4({
        url: '/UserConfig/DeleteUserInfo',
        method: 'post',
        data: {
            Uids,
            OperateUser,
        }
    })
}

// 删除2
export function reqDeleteUserInfo2(Uids, OperateUser) {
    return request4({
        url: '/UserConfig/DeleteUserInfo2',
        method: 'post',
        data: {
            Uids,
            OperateUser,
            SystemName
        }
    })
}


// 修改密码
export function reqChangeUserPWD(from, OperateUser) {
    const UID = parseInt(
        store.state.user?.userId     
          
        
    );
    // if (!UID || isNaN(UID)) {
    //     return Promise.reject(new Error('无法获取用户ID，请重新登录'));
    // }
    var data = {
        UID: UID, 
        oldPWD: md5(from.oldPWD),
        newPWD: md5(from.newPWD),
        OperateUser
    }

    return request4({
        url: '/UserConfig/ChangeUserPWD',
        method: 'post',
        data
    })
}


// 获取APPDB 权限表
export function reqGetAPPDBRoleInfo() {
    return request4({
        url: '/UserConfig/GetAPPDBRoleInfo',
        method: 'post',
        data: {}
    })
}

// 新增 APPDB 权限表
export function reqAddAPPDBRoleInfo(Info, OperateUser) {
    return request4({
        url: '/UserConfig/AddAPPDBRoleInfo',
        method: 'post',
        data: {
            Info,
            OperateUser
        }
    })
}


// 系统列表
export function reqGetSystemList() {
    return request4({
        url: '/UserConfig/GetSystemList',
        method: 'post',
        data: {}
    })
}

export function reqGetSystemRoles(SystemName) {
    return request4({
        url: '/UserConfig/GetSystemRoles',
        method: 'post',
        data: {
            SystemName
        }
    })
}

export function reqUpdateSysPerValue(UID, SysPerValue) {
    return request4({
        url: '/UserConfig/UpdateSysPerValue',
        method: 'post',
        data: {
            UID,
            SysPerValue
        }
    })
}
