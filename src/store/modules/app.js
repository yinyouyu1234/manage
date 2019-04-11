import request from '@/utils/request'
import { setCookie, getCookie } from '@/utils/cookie'
const n = {
  path: '*',
  component: resolve => require(['@/views/layout/Layout.vue'], resolve),
  children: [
    {
      path: '',
      component: resolve => require(['@/views/404/404.vue'], resolve),
      meta: {
        title: '专家管理',
        id: ''
      }
    }
  ]
}
const app = {
  state: {
    user_id: getCookie('user_info') ? JSON.parse(getCookie('user_info')).id : '',
    user_info: getCookie('user_info') ? JSON.parse(getCookie('user_info')) : {},
    nav_list: window.localStorage.getItem('menu') ? JSON.parse(window.localStorage.getItem('menu')) : []
  },
  mutations: {
    GET_USER_INFO: (state, data) => {
      state.user_info = data.user_info
      state.user_id = data.user_info.id
      setCookie('user_info', JSON.stringify(data.user_info), 1)
    },
    SET_MENU: (state, data) => {
      const { menu } = data
      const navList = []
      menu.forEach(item => {
        const navItem = {}
        navItem.title = item.name
        navItem.icon = item.current.icon
        if (item.childs instanceof Array && item.childs.length > 0) {
          const arr = []
          item.childs.forEach(ele => {
            arr.push({
              title: ele.name,
              id: ele.current.id.toString(),
              path: `/${item.value}/${ele.value}`
            })
          })
          navItem.children = arr
        }
        navList.push(navItem)
      })
      navList.unshift({
        title: '首页',
        path: '/index',
        icon: 'icon-shouye',
        id: '-1'
      })
      window.localStorage.setItem('menu', JSON.stringify(navList))
    },
    SET_ROUTER: (state, menu) => {
      window.localStorage.setItem('routerList', JSON.stringify(menu))
      menu.forEach(item => {
        const routeItem = {
          path: `/${item.value}`,
          component: resolve => require(['@/views/layout/Layout.vue'], resolve),
          children: []
        }

        if (item.childs instanceof Array && item.childs.length > 0) {
          routeItem.children = item.childs.map(ele => {
            return {
              path: ele.value,
              component: resolve => require([`@/views/${item.value}/${ele.value}.vue`], resolve)
            }
          })
        }
        window.vm.$router.options.routes.push(routeItem)
      })
      window.vm.$router.options.routes.push(n)
      window.vm.$router.addRoutes(window.vm.$router.options.routes)
    }
  },
  actions: {
    get_user_info: ({ commit }, data) => {
      new Promise((resolve, reject) => {
        request
          .post(`${window.vm.api}/user/login`, data)
          .then(res => {
            const { data } = res.data
            commit('GET_USER_INFO', data)
            commit('SET_MENU', data)
            commit('SET_ROUTER', data.menu)
            resolve()
          })
      }).then(() => {
        window.vm.$router.push('index')
      })
    }
  }
}

export default app
