import axios from 'axios';
import request3 from '@/utils/request3'

export function getAllList(params) {
    return request3.get('/Course/CourseList', params)
}
export function searchCourse(params){
    return request3.post('/Course/FindCourse', params)
}

export function insertCourse(data){
    return request3.post('/Course/AddCourse', data)
}

export function changeStatus(data){
    return request3.post('/Course/UpdateStatus', data)
}

export function updateCourse(data){
    return request3.post('/Course/UpdateCourse', data)
}

export function delCourse(ids){
    return request3.post('/Course/DelCourse', ids)
}

export function getTchAccount(params){
    return request3.get('/Course/GetTchAccounts', {
        params : params, 
    })
}

export const exportCourse = (params) => {
    return request3.get('/Course/ExportCourse', {
      params: params,
      responseType: 'blob' 
    });
  };

