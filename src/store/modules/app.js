const app = {
  state: {
  },
  mutations: {
    get_menu_list: () => {
      this.$axios.get(`${this.api}`).then(res => {
        console.log(res)
      })
    },
    set_menu: (state) => {
      this.$router.options.routes.push({
        path: '*',
        name: '404',
        component: resolve => require(['@/views/layout/Layout.vue'], resolve),
        children: [
          {
            path: '',
            component: resolve => require(['@/views/404/404.vue'], resolve),
            meta: {}
          }
        ]
      })
      this.$router.addRoutes(this.$router.options.routes)
    }
  },
  actions: {

  }
}

export default app
