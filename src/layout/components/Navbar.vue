<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <div class=" avatar-container right-menu-item ">欢迎 {{ name }}</div>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

        <div class="avatar-wrapper">
          <img :src="defaultAvatar" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/user/profile">
            <el-dropdown-item>个人中心</el-dropdown-item>
          </router-link> -->
          <el-dropdown-item @click.native="handleChangePWD">
            <span>修改密码</span>
          </el-dropdown-item>
          <!-- <el-dropdown-item @click.native="setting = true">
            <span>布局设置</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span>退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改密码" :visible.sync="open" width="25%" :close-on-click-modal="false">
      <el-form :model="form" label-width="100px" :rules="rules" ref="form" @submit.native.prevent>
        <el-form-item label="旧密码" prop="oldPWD" for="oldPWD">
          <el-input v-model="form.oldPWD" type="password" show-password id="oldPWD"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPWD" for="newPWD">
          <el-input v-model="form.newPWD" type="password" show-password id="newPWD"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="pwdLoading">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import store from '@/store' 
import { reqChangeUserPWD } from "@/api/Menu2/UserConfig"


export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    RuoYiGit,
    RuoYiDoc
  },
  data() {

    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        if (this.pwdForm.confirmPassword !== '') {
          this.$refs.pwdFormRef.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      APPName: APPName,
      SystemName,
      open: false,
      pwdLoading: false,
      defaultAvatar: require('@/assets/images/profile.jpg'),
      form: {},
      rules: {
        oldPWD: { required: true, message: "必填项", trigger: "blur" },
        newPWD: { required: true, message: "必填项", trigger: "blur" },
      }
    }



  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name',
      'SysPerValue',

    ]),
    name() {
      
      return this.$store.state.user.name || '未知姓名'
    },
    // number() {
    //   return localStorage.getItem('number') || '未知学号'
    // },

    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      }).catch(() => { });
    },




    // hashPwd(password) {
    //   return SHA256(password).toString();
    // },


    // async submitPasswordForm() {
    //   const hashedPwd = this.hashPwd(this.pwdForm.newPassword)
    //   try {
    //     const response = await resetPwd(hashedPwd)
    //     if (response.code === 200) {
    //       this.$message.success('密码修改成功')
    //       this.showResetPwdDialog = false
    //     } else {
    //       this.$message.error(response.msg)
    //     }
    //   } catch (error) {
    //     this.$message.error(error.response?.msg || '请求失败')
    //     console.log(error)
    //   }
    // }

    // 修改密码
    handleChangePWD() {
      this.form = {};
      this.open = true;
    },
    // 确定按钮
    handleSubmit() {
      console.log('当前用户信息:', {
        vuexUserId: store.state.user?.userId,

        
    });
      this.$refs["form"].validate(valid => {
        if (valid) {
          reqChangeUserPWD(this.form, `${this.APPName}-${this.name}-修改密码`).then(response => {
            this.open = false;
            this.$message.success("修改成功")
          })
        }
      })
    }
  }
}

</script>





<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  li.el-menu-item.is-active {
    background: linear-gradient(270deg, rgb(31, 45, 61), rgb(66 105 149)) !important;
    border-left: 3px solid rgb(145, 196, 247);
    font-size: 16px;
  }

  li.el-menu-item:hover {
    background: linear-gradient(270deg, rgb(31, 45, 61), rgb(66 105 149)) !important;
    border-left: 3px solid rgb(145, 196, 247);
    font-size: 16px;
  }

  .submenu-title-noDropdown:first-child {
    border-top: 1px solid #3c4f66;
  }

  .el-submenu .el-menu-item {
    padding: 0 20px 0 0px;
  }

  #app .sidebar-container .svg-icon {
    margin-right: 6px;
  }

  .el-submenu__title {
    padding-left: 10px !important;
  }

  .el-menu-item {
    padding-left: 28px !important;
  }

  .submenu-title-noDropdown {
    padding-left: 10px !important;
  }

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    .wellcome {
      display: inline-block;
      margin-right: 20px;
      padding: 0 10px;
      font-size: 14px;
      color: #5a5e66;
      background: #f5f5f5;
      border-radius: 4px;
      line-height: 36px;
      margin-top: 2px;
    }

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
      color: #5a5e66;
      vertical-align: text-bottom;


      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
