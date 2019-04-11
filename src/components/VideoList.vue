<template>
  <div class="video-list--box">
    <div class="top">
      <img @click="handle" :src="myInfo.url" alt="图片格式有误">
    </div>
    <div class="infomation">
      <el-input
        resize="none"
        type="textarea"
        :rows="3"
        placeholder="请在这里输入对应的描述信息！"
        v-model="myInfo.description"
      ></el-input>
    </div>
    <el-button type="primary" @click="upData">更新</el-button>
  </div>
</template>
<script>
export default {
  name: "VideoList",
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      textarea: "",
      myInfo: {}
    };
  },
  watch: {
    list() {
      this.myInfo = this.info;
    }
  },
  created() {
    this.myInfo = this.info;
  },
  methods: {
    upData() {
      this.$emit("updata", this.myInfo);
    },
    handle() {
      this.$emit("imageClick", this.myInfo.url);
    }
  }
};
</script>
<style lang="less">
.video-list--box {
  width: 160px;
  .top {
    height: 100px;
    img {
      cursor: pointer;
      height: 100px;
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
