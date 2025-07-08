import axios from 'axios';
import request3 from '@/utils/request3'

export function getAllStu(params) {
    return request3.get('/StuList/StuList', {params})
}

export function searchStu(params){
    return request3.post('/StuList/FindStu', params)
}

export function insertStu(data){
    return request3.post('/StuList/AddStu', data)
}

export function updateStu(params){
    return request3.post('/StuList/UpdateStu', params)
}

export function delStu(params){
    return request3.post('/StuList/DelStu', params)
}

export function exportStu(params) {
    return request3.get('/StuList/ExportStu', {
        params : params, 
        responseType: 'blob',
    })
}

export function getAccounts(params) {
    return request3.get('/StuList/GetAccounts', {
        params : params, 
    })
}
