import request3 from '@/utils/request3'
//获取成绩统计数据
export const fetchGradeStatistics = (courseId = '') => {

    return request3.get('/Score/GetGradeStatistics', {
        params:{courseId}

    });
}

//获取成绩分布数据
export const fetchGradeDistribution  = (courseId = '') => {

    return request3.get('/Score/GetGradeDistribution', {
        params:{courseId}

    });
}



export function getCourInfo(params) {
    return request3.get('/Score/GetCoursesForCurrentUser', {
        params : params, 
    })
}