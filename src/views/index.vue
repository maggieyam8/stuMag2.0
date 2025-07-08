<template>
  <div class="app-container ">

    <!-- <blockquote class="text-warning">
          <h2>欢迎登录学生管理系统</h2>
        </blockquote>
     -->
    <div class="welcome-container">
      <h2 class="welcome-text">欢迎登录学生管理系统</h2>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.app-container {

  background-image: url('../assets/images/index-pic.jpg');
  /* 添加背景图片 */
  background-size: cover;
  /* 背景图片覆盖整个元素 */
  background-repeat: no-repeat;
  // height: 100vh; /* 使容器占满整个视口高度 */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.welcome-container {
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  padding: 30px 50px; /* 内边距 */
  border-radius: 15px; /* 圆角 */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* 阴影效果 */
  text-align: center; /* 文字居中 */
  animation: fadeIn 1.5s ease-in-out; /* 淡入动画 */
}

.welcome-text {
  font-size: 2.5rem; /* 字体大小 */
  font-weight: bold; /* 字体加粗 */
  color: #2c3e50; /* 字体颜色 */
  margin: 0; /* 去除默认外边距 */
  font-family: 'Arial', sans-serif; /* 使用更美观的字体 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* 文字阴影 */
}

/* 淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


@media (max-width: 768px) {
  .welcome-text {
    font-size: 2rem;
  }
  .welcome-container {
    padding: 20px 30px;
  }
}
</style>
