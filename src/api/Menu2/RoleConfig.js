import request4 from '@/utils/request4'

// 获取
export function reqGetRoleInfo(data) {
    return request4({
        // url: '/RoleConfig/GetRoleInfo',
        url: '/RoleConfig/GetRoleInfo2',
        method: 'post',
        data:{
            ...data,
            SystemName
        }
    })
}


// 获取菜单树
export function reqGetMenuTree(PRID) {
    return request4({
        // url: '/RoleConfig/GetMenuTree',
        url: '/RoleConfig/GetMenuTree2',
        method: 'post',
        data:{
            SystemName,
            PRID
        }
    })
}


// 获取RID 对应的菜单权限
export function reqGetRoleMenuByRID(RID) {
    return request4({
        // url: '/RoleConfig/GetRoleMenuByRID',
        url: '/RoleConfig/GetRoleMenuByRID2',
        method: 'post',
        data: {
            RID,
            SystemName
        }
    })
}

// 新增
export function reqAddRoleInfo(Info, menuIds) {
    return request4({
        // url: '/RoleConfig/AddRoleInfo',
        url: '/RoleConfig/AddRoleInfo2',
        method: 'post',
        data: {
            Info,
            menuIds,
            SystemName
        }
    })
}


// 修改
export function reqUpdateRoleInfo(Info, menuIds) {
    return request4({
        // url: '/RoleConfig/UpdateRoleInfo',
        url: '/RoleConfig/UpdateRoleInfo2',
        method: 'post',
        data: {
            Info,
            menuIds,
            SystemName
        }
    })
}

//删除
export function reqDeleteRoleInfo(roleIds) {
    return request4({
        // url: '/RoleConfig/DeleteRoleInfo',
        url: '/RoleConfig/DeleteRoleInfo2',
        method: 'post',
        data: {
            roleIds,
            SystemName
        }
    })
}

