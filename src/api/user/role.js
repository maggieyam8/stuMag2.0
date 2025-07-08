import axios from 'axios';
import request3 from '@/utils/request3'

export function getAllMenusOpt() {
    return request3.get('/TestRole/GetMenuOptions')
}

export function getAllRoleList(params) {
    return request3.get('/TestRole/RoleList', params)
}

export function searchRole(params) {
    return request3.get('/TestRole/GetRolesByRoleName', params)
}

export function insertRole(data) {
    return request3.post('/TestRole/AddRole', data)
}
export function getRoleMenus(RID) {
    return request3.get('/TestRole/GetUserMenus', {
        params: {RID: RID}
    });
}

export function updateRole(data) {
    return request3.post('/TestRole/UpdateRole', data)
}

export function delRole(rids) {
    return request3.post('/TestRole/DeleteRole', rids)
}