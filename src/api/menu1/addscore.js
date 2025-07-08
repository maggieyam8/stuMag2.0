import axios from 'axios';
import request3 from '@/utils/request3'

export function getAllScore(params) {
    return request3.get('/Score/GradeList', {params})
}

export function searchScore(params){
    return request3.post('/Score/FindGrade', params)
}

export function searchByCourse(params) {
    return request3.get('/Score/GetGradesByCourse', {
        params : params
    })
}
export function getCourInfo(params) {
    return request3.get('/Score/GetCourInfo', {
        params : params, 
    })
}
export function insertScore(data){
    return request3.post('/Score/AddGrade', data)
}

export function updateScore(params){
    return request3.post('/Score/EditGrade', params)
}
export function delScore(ids){
    return request3.post('/Score/DelGrade', ids)
}

export function exportScore(params) {
    return request3.get('/Score/ExportGrade', {
        params : params,
        responseType: "blob"

    })
}
