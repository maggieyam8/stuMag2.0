import request3 from '@/utils/request3';

//获取当前学生的成绩
export function getMyScore(params) {

    const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null)
    );
    return request3.get('/Score/GetStudentGrades', {
        params: filteredParams

     
    })
}

export function exportScore(params) {
    return request3.get('/Score/ExportGradeByStu', {
        params: params,
        responseType: 'blob',

      

    })
}

