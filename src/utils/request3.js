import axios from 'axios';
import { MessageBox } from 'element-ui';
import store from '@/store';
import cache from '@/plugins/cache';

const service = axios.create({
    baseURL: BASE_URL, // 使用环境变量
    timeout: 10000
});

// 精简后的请求拦截器
service.interceptors.request.use(config => {
    // 统一添加token（优先用localStorage的实时token）
    if (!['/TestUser/Login', '/TestUser/Register'].includes(config.url)) {
        const token = localStorage.getItem('auth_token') || getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            //config.headers['user_id'] = store.state.user.userId;
             // 直接从Vuex获取用户ID
             const userId = store.state.user?.userId;
             if (userId) {
                 config.headers['user_id'] = userId; // 确保后端能获取用户ID
                //  console.log('当前请求携带的用户ID:', userId); // 调试用
             } else {
                 console.warn('未获取到用户ID，权限验证可能失败');
             }
 
             // 标识当前系统（后端根据此字段解析SysPerValue）
             config.headers['X-System-Name'] = 'StudentManager';
        }
    }

    // GET参数处理优化
    if (config.method === 'get' && config.params) {
        config.paramsSerializer = params => {
            return Object.keys(params)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
                .join('&');
        };
    }

    // 防重复提交逻辑（保持你的原有逻辑）
    if (!config.headers.repeatSubmit && ['post', 'put'].includes(config.method)) {
        const requestObj = {
            url: config.url,
            data: config.data,
            time: Date.now()
        };
        const sessionObj = cache.session.getJSON('sessionObj') || {};

        if (sessionObj.url === requestObj.url &&
            sessionObj.data === JSON.stringify(requestObj.data) &&
            Date.now() - sessionObj.time < 1000) {
            return Promise.reject(new Error('请勿重复提交'));
        }
        cache.session.setJSON('sessionObj', requestObj);
    }

    return config;
}, error => {
    return Promise.reject(error);
});

// 增强响应拦截器
service.interceptors.response.use(
    response => {

        if (response.config.responseType === 'blob' ) {
            // 检查是否是有效的文件流（而非JSON错误信息）
            const contentType = response.headers['content-type'];
            if (contentType?.includes('application/json')) {
                return response.data.text().then(text => {
                    try {
                        const error = JSON.parse(text);
                        throw new Error(error.message || '导出失败');
                    } catch {
                        throw new Error('无效的导出数据');
                    }
                });
            }
            return response;
        }
        return response.data;
    },
    error => {
        if (error.response?.status === 401) {
            handleUnauthorized();
        }
        return Promise.reject(error);
    }
);

function handleUnauthorized() {
    MessageBox.confirm('登录已过期，请重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消'
    }).then(() => {
        store.dispatch('user/logout');
        window.location.href = '/login';
    });
}

export default service;