<template>
  <div class="register">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="register-form">
      <h3 class="title">学生管理系统</h3>
      <el-form-item prop="number">
        <el-input v-model="registerForm.number" type="text" auto-complete="off" placeholder="学号/工号">
          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="username">
        <el-input v-model="registerForm.username" type="text" auto-complete="off" placeholder="姓名">
          <svg-icon slot="prefix" icon-class="logininfor" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="registerForm.password" type="password" auto-complete="off" placeholder="密码"
          @keyup.enter.native="handleRegister">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="confirmPassword">
        <el-input v-model="registerForm.confirmPassword" type="password" auto-complete="off" placeholder="确认密码"
          @keyup.enter.native="handleRegister">
          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
        </el-input>
      </el-form-item>
      <el-form-item prop="role">
        <el-select v-model="registerForm.role" auto-complete="off" placeholder="请选择账号身份" style="width:100%">
          <el-option label="学生" value="Student"></el-option>
          <el-option label="教师" value="Teacher"></el-option>
          <svg-icon slot="prefix" icon-class="peoples" class="el-option__icon input-icon" />

        </el-select>
      </el-form-item>

      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
          @click.native.prevent="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </el-button>
        <div style="float: right;">
          <router-link class="link-type" :to="'/login'">使用已有账户登录</router-link>
        </div>
      </el-form-item>
    </el-form>
    <!--  底部  -->
    <div class="el-register-footer">
      <span>Copyright HCF All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import SHA256 from 'crypto-js/sha256';
import { getCodeImg, register } from "@/api/login";
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  name: "Register",
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.registerForm.password !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      codeUrl: "",
      registerForm: {
        number: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
        // code: "",
        uuid: ""
      },
      registerRules: {
        number: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
          { min: 2, max: 20, message: '用户账号长度必须介于 4 和 20 之间', trigger: 'blur' }
        ],
        username: [
          { required: true, trigger: "blur", message: "请输入您的姓名" },
          { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
          { min: 5, max: 20, message: "用户密码长度必须介于 5 和 20 之间", trigger: "blur" },
          { pattern: /^[^<>"'|\\]+$/, message: "不能包含非法字符：< > \" ' \\\ |", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, trigger: "blur", message: "请再次输入您的密码" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ],
        role: [
          { required: true, trigger: "blur", message: "请选择您的身份" },
          { trigger: "blur" }
        ],

      },
      loading: false,
      captchaEnabled: true
    };
    
  },
  // created() {
  //   this.getCode();
  // },
  methods: {

    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.registerForm.uuid = res.uuid;
        }
      });
    },
    hashPwd(password){
      return SHA256(password).toString();
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const hashedPassword = this.hashPwd(this.registerForm.password);
          const hashedPasswordCon = this.hashPwd(this.registerForm.confirmPassword);

          // 调用注册接口
          register({
           
              number: this.registerForm.number,
              username: this.registerForm.username,
              password: hashedPassword,
              confirmPassword: hashedPasswordCon,
              role: this.registerForm.role
            
          })
            .then(resp => {
              this.loading = false;
              if (resp.code === 200) {
                this.$alert(
                  `<font color='black'>恭喜你，您的账号 ${this.registerForm.username} 注册成功！</font>`,
                  '系统提示',
                  {
                    dangerouslyUseHTMLString: true,
                    type: 'success'
                  }
                ).then(() => {
                  this.$router.push('/login'); 
                });
              } else {
                this.$message.error(resp.msg); 
              }
            })
            .catch(error => {
              this.loading = false;
              console.error('注册失败：', error)
              this.$message.error('注册失败，请稍后重试');
              
            });
        }
      });
    }
  }
}







</script>

<style rel="stylesheet/scss" lang="scss">
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.register-form {
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

  .el-select {
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

.register-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.register-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-register-footer {
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

.register-code-img {
  height: 38px;
}
</style>
