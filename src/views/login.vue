<template>
  <div class="login">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">学生管理系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" 
          @keyup.enter.native="handleLogin">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="code" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter.native="handleLogin"
        >
          <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img"/>
        </div>
      </el-form-item> -->
      <!-- <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox> -->
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <div style="float: right;" v-if="register">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span>Copyright HCF All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import SHA256 from 'crypto-js/sha256';
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import { login } from '@/api/login';
import { getRouters } from '../api/menu';


export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        // code: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        // code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: true,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    //  this.getCode();
    this.getCookie();
  },
  methods: {

    // getCode() {
    //   getCodeImg().then(res => {
    //     this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
    //     if (this.captchaEnabled) {
    //       this.codeUrl = "data:image/gif;base64," + res.img;
    //       this.loginForm.uuid = res.uuid;
    //     }
    //   });
    // },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;

          if (this.loginForm.rememberMe) {
            //console.log("111");

            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {

            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            //console.log("222");
            this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
          }).catch((err) => {
            this.loading = false;
            console.error("登录失败，原因:", err.message); // 打印具体错误

            if (this.captchaEnabled) {
            }
          });
        }
      });
    }

    //登录方法


  //   hashPwd(password) {
  //     return SHA256(password).toString();
  //   },
  //   //
  //   async handleLogin() {
  //     try {
  //       // 验证表单
  //       const valid = await this.$refs.loginForm.validate();
  //       if (!valid) return;

  //       const hashedPassword = this.hashPwd(this.loginForm.password)

  //       const response = await login({
  //         number: this.loginForm.number,
  //         password: hashedPassword
  //       });



  //       if (response.code === 200) {
  //         const userData = response.data;

  //         //将Token存入localStorage（更安全）
  //         localStorage.setItem('auth_token', userData.token);
  //         localStorage.setItem('user_id', userData.user_id);
  //         localStorage.setItem('username', userData.username);
  //         localStorage.setItem('number', userData.number);


  //         // const menuResponse = await getRouters({ headers: { 'Authorization': `Bearer ${userData.token}` } });



  //         if (this.loginForm.rememberMe) {
  //           Cookies.set("my_number", this.loginForm.number, { expires: 30 });
  //           // Cookies.set("my_password", encrypt(this.loginForm.password), { expires: 30 });
  //           // Cookies.set("my_password", hashedPassword, { expires: 30 });
  //           Cookies.set('my_rememberMe', this.loginForm.rememberMe, { expires: 30 });


  //         } else {
  //           Cookies.remove("my_number");
  //           Cookies.remove("my_password");
  //           Cookies.remove('my_rememberMe');
  //         }
  //         // // 触发若依原有的路由处理逻辑
  //         // this.$store.dispatch('permission/GenerateRoutes', menuRes.data.data).then(() => {
  //         //   this.$router.push(this.redirect || '/');
  //         // });
  //         await this.$store.dispatch("Login", this.loginForm).then(() => {
  //            this.$router.push({ path: this.redirect || "/" }).catch(() => { });
  //         })
  //         // console.log(response.data.data);
  //       } else {

  //         console.log(response.msg);
  //         this.$message.error(response.msg);
  //       }
  //     }
  //     catch (error) {

  //       this.$message.error('登录失败，请检查网络连接');
  //     }
  //     finally {
  //       this.loading = false;
  //     };
  //   }

  }

};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/index-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
}
</style>
