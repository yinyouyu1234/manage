<template>
  <div class="image-list--wrapper">
    <img v-for="(item, index) in myList" :key="index" @click="handleClick(item)" :src="item" alt>
  </div>
</template>
<script>
export default {
  name: "ImageList",
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      myList: [],
      url: require("../assets/images/login-background.png")
    };
  },
  watch: {
    list() {
      this.myList = this.list;
    }
  },
  created() {
    this.myList = this.list;
  },
  methods: {
    handleClick(url) {
      this.$emit("handleClick", url);
    }
  }
};
</script>
<style lang="less">
.image-list--wrapper {
  img {
    width: 140px;
    height: 140px;
    border: 1px solid #c0ccda;
    border-radius: 6px;
    margin-right: 2%;
    cursor: pointer;
  }
}
</style>
