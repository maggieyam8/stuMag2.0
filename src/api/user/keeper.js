import axios from 'axios';
import request3 from '@/utils/request3'



export function getAllUserList(params) {
    return request3.get('/TestUser/UserList', params)
}
export function findUser(params) {
    return request3.post('/TestUser/FindOne', params)
}

export function insertUser(params) {
    return request3.post('/TestUser/AddUser', params)
}

export function updateUser(params) {
    return request3.post('/TestUser/UpdateUser', params)
}

export function delUser(userids) {
    return request3.post('/TestUser/DelUser', { userids })
}

export function changeStatus(data) {
    return request3.post('/TestUser/UpdateStatus', data)
}
