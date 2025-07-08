import request from '@/utils/request'

//export 暴露
export function reqGetSth(ClassID) { //传参
    return request({
        url: '/TestMenu/GetSth', 
        method: 'post',
        data:{
            ClassID
        }
      })
}

//完整请求地址是 http://localhost:57605/TestMenu/GetSth

//在request拦截器中已经写入了 前端部分