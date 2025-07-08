import request from '@/utils/request'
import request3 from '@/utils/request3'
import request4 from '@/utils/request4'
import md5 from 'js-md5'

// 登录方法
export function login(Account, password) {
  const data = {
    Account,
    UPwd: md5(password),
    SystemName
  }
  return request4({
    // url: '/LoginBySystem/GetLogin',
    url: '/LoginBySystem/GetLogin2',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}



// 注册方法
export function register(data) {
  
  return request3.post('/TestUser/Register', data);
}

export function resetPwd(newPassword){
  return request3.post('/TestUser/UpdatePassword', {
    newPassword
  });
}

// 获取用户详细信息    // url: '/dev-api/TestUser/GetUserMenus',

// 获取用户详细信息
export function getInfo() {
  return request4({
    // url: '/LoginBySystem/GetInfo',
    url: '/LoginBySystem/GetInfo2',
    method: 'post',
    data:{
      SystemName
    }
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}