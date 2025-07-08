// // export const API_BASE_URL = 'http://localhost:57895';



// export const API_BASE_URL = process.env.VUE_APP_API_BASE_URL 
//                          || 'http://localhost:57895'

// export default {
//     title: '学生管理系统',
//     apiSettings: {
//         timeout: 10000,
//         withCredentials: true
//     }
// }


// 优先级1：动态加载的配置 > 2：index.html全局变量 > 3：默认值
// export const getConfig = () => ({
//     baseURL: window.API_CONFIG?.baseURL || process.env.VUE_APP_API_BASE_URL || 'http://localhost:57895',
//     timeout: 15000
//   });