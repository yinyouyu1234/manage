<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2>华能玉环电厂运维眼系统</h2>
      <h3>火电厂AR检修平台</h3>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item prop="name">
          <el-input placeholder="请输入手机号" v-model="ruleForm.loginName"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input placeholder="请输入密码" type="password" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  created() {
  },
  data() {
    return {
      ruleForm: {
        loginName: "10000",
        password: "123456",
        application_code: "YUHUAN_WEB"
      },
      rules: {
        loginName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch("get_user_info", this.ruleForm);
        } else {
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less">
.login-wrapper {
  height: 100vh;
  background: url(../assets/images/login-background.png) no-repeat;
  background-size: cover;
  h2 {
    font-size: 36px;
    text-align: center;
    height: 60px;
  }
  h3 {
    font-size: 20px;
    text-align: center;
    height: 60px;
  }
  .login-box {
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
  }
}
</style>

