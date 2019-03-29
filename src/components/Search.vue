<template>
  <div class="search-wrapper">
    <div class="title">
      <span class="iconfont icon-sousuo"></span>
      筛选查询
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "Search",
  data() {
    return {
      input: ""
    };
  }
};
</script>
<style lang="less">
.search-wrapper {
  .title {
    height: 40px;
    padding: 10px 25px;
    line-height: 40px;
    font-size: 15px;
    .icon-sousuo {
      position: relative;
      font-size: 20px;
      right: -3px;
    }
  }
  .content {
    min-width: 1500px;
    padding: 0 20px;
  }
}
</style>
