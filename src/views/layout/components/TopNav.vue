<template>
  <div>
    <div class="nav-wrapper">
      <div class="nav-title">
        <img :src="url" alt>
        华能玉环电厂运维眼系统
      </div>
      <div class="nav-btns">
        <div class="name">admin</div>
        <div class="change-password" @click="change">修改密码</div>
        <div class="out" @click="out">退出</div>
      </div>
    </div>
    <div style="height:64px;"></div>
  </div>
</template>
<script>
export default {
  name: "TopNav",
  data() {
    return {
      url: require("../../../assets/images/logo.png"),
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    out() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push("/login");
        })
        .catch(() => {});
    },
    change() {
      this.$router.push("/updatePassword");
    }
  }
};
</script>
<style lang="less">
@import "../../../styles/basic";
.nav-wrapper {
  height: 64px;
  background: @backgroundColor;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  .nav-title {
    line-height: @topNavHeight;
    font-size: 30px;
    float: left;
    img {
      height: 64px;
      vertical-align: bottom;
    }
  }
  .nav-btns {
    float: right;
    div {
      float: left;
      height: @topNavHeight;
      line-height: @topNavHeight;
      padding: 0 15px;
      &:hover {
        cursor: pointer;
        background: #039be5;
        transition: all 0.3s;
      }
    }
  }
}
</style>
