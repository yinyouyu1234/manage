// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/common.css'
import './styles/element-ui.css'
import './mock' // simulation data
import App from './App'
import router from './router'
import store from './store'
import request from '@/utils/request'
import './assets/font/iconfont.css'
import echarts from 'echarts'
import * as filters from './filter' // global filters

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$axios = request
Vue.prototype.$echarts = echarts
Vue.prototype.api = '/api'
Vue.prototype.upload = '/upload'
Vue.prototype.token = '123456789'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
