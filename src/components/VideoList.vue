<template>
  <div class="video-list--box">
    <div class="top">
      <img @click="handle" src="../assets/images/login-background.png" alt>
    </div>
    <div class="infomation">
      <el-input
        resize="none"
        type="textarea"
        :rows="3"
        placeholder="请在这里输入对应的描述信息！"
        v-model="textarea"
      ></el-input>
    </div>
    <el-button type="primary">更新</el-button>
  </div>
</template>
<script>
export default {
  name: "VideoList",
  data() {
    return {
      textarea: ""
      // url: require("../assets/images/")
    };
  },
  methods: {
    handle() {
      this.$emit("imageClick");
    }
  }
};
</script>
<style lang="less">
.video-list--box {
  width: 160px;
  .top {
    img {
      cursor: pointer;
    }
  }
  div {
    padding-bottom: 5px;
  }
  .el-button--primary {
    width: 100%;
  }
}
</style>
