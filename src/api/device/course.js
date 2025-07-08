import axios from 'axios';
import request3 from '@/utils/request3'; // 使用封装后的axios实例

//api 一般存放请求
export function getAllCourseList(params) {

    return request3.get('/Course/elCourseList', params);
}
export function getCourseByType(params) {

    return request3.get('/Course/GetCourseByType', {params});
}
export function searchCourse(data) {

    return request3.post('/Course/elFindCourse', data);
}

export function selectCourse(courseId) {
    return request3.post('/Course/SelectCourse', {courseId})
}

export function getMyCourse() {

    return request3.get('/Course/GetElectives');
}

export function cancelSelect(courseId) {

    return request3.post('/Course/DelElectives', {courseId});
}
export function getSysPerValue(courseId) {
    return request3.post('/Course/GetSysPerValue', {courseId})
}
