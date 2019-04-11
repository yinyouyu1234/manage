import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/repairManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '维修管理',
        id: ''
      },
      children: [
        {
          path: 'DefectManage',
          component: resolve => require(['@/views/repairManage/DefectManage.vue'], resolve),
          meta: {
            title: '缺陷管理',
            id: ''
          }
        }
      ]
    },
    {
      path: '/',
      component: resolve => require(['@/views/Login.vue'], resolve)
    },
    {
      path: '/login',
      component: resolve => require(['@/views/Login.vue'], resolve)
    },
    {
      path: '/updatePassword',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      children: [
        {
          path: '',
          component: resolve => require(['@/views/updatePassword.vue'], resolve),
          meta: {
            title: '专家管理',
            id: ''
          }
        }
      ]
    },
    {
      path: '/index',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      children: [
        {
          path: '',
          component: resolve => require(['@/views/Index.vue'], resolve),
          meta: {
            title: '首页',
            id: ''
          }
        }
      ]
    },
    {
      path: '/CheckLine',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      children: [
        {
          path: '',
          component: resolve => require(['@/views/formManage/CheckLine.vue'], resolve),
          meta: {
            title: '专家管理',
            id: ''
          }
        }
      ]
    },
    {
      path: '/EditEquipmentType',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      children: [
        {
          path: '',
          component: resolve => require(['@/views/equipmentManage/EditEquipmentType.vue'], resolve),
          meta: {
            title: '专家管理',
            id: ''
          }
        }
      ]
    }
  ]
})
