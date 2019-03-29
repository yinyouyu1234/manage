<template>
  <div class="right-title__wrapper">
    <div class="title">
      <span class="iconfont" :class="icon"></span>
      {{title}}
    </div>
    <div class="btn">
      <el-button size="small" @click="reload">刷新</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "ViewTitle",
  props: {
    title: {
      type: String
    },
    icon: {
      type: String,
      default: "icon-icon--"
    }
  },
  data() {
    return {};
  },
  methods: {
    reload() {
      location.reload();
    }
  }
};
</script>
<style lang="less">
@import "../styles/basic";
.right-title__wrapper {
  overflow: hidden;
  width: 100%;
  // padding: 0 80px;
  padding-left: 14px;
  padding-right: 80px;
  height: 60px;
  line-height: 60px;
  box-sizing: border-box;
  border: 1px solid @borderColor;
  .title {
    float: left;
    font-size: 20px;
    .iconfont {
      font-size: 22px;
      position: relative;
      right: -5px;
      margin-right: 4px;
    }
  }
  .btn {
    float: right;
  }
}
</style>
