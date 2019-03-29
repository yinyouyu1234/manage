<template>
  <div class="app-wrapper">
    <header>
      <top-nav/>
    </header>
    <section>
      <nav>
        <left-nav/>
      </nav>
      <div class="views">
        <router-view/>
      </div>
    </section>
  </div>
</template>
<script>
import TopNav from "./components/TopNav.vue";
import LeftNav from "./components/LeftNav.vue";

export default {
  components: {
    TopNav,
    LeftNav
  },
  name: "Index",
  data() {
    return {};
  }
};
</script>
<style lang="less">
.app-wrapper {
  section {
    overflow: hidden;
    nav {
      float: left;
      width: 200px;
    }
    .views {
      overflow: hidden;
      margin-left: 200px;
    }
  }
}
</style>
