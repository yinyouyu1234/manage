<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {},
  mounted() {
    this.$nextTick(() => {
      JSON.parse(window.localStorage.getItem("routerList")) &&
        this.$store.commit(
          "SET_ROUTER",
          JSON.parse(window.localStorage.getItem("routerList"))
        );
    });
  }
};
</script>


<style>
</style>
