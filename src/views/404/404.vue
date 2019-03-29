<template>
  <div class="nothing">
    <div class="title">404</div>
    <div class="content">抱歉您访问的页面没有找到！</div>
    <div class="button">
      <el-button @click="handle" type="primary">点击返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "404",
  methods: {
    handle() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
.nothing {
  .title {
    margin-top: 100px;
    text-align: center;
    font-size: 80px;
    color: #0277bd;
  }
  .content {
    margin-top: 30px;
    text-align: center;
    font-size: 30px;
    color: #0277bd;
  }
  .button {
    text-align: center;
    margin-top: 30px;
  }
}
</style>
