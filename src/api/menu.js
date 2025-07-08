import request4 from '@/utils/request4'

// 获取路由
export const getRouters = () => {
    return request4({
      // url: '/LoginBySystem/getRouters',
      url: '/LoginBySystem/getRouters2',
      method: 'post',
      data: {
        SystemName
      }
    })
  }
  
