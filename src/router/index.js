import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/expertManage',
      name: 'Layout',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        tite: '专家管理',
        id: ''
      },
      children: [
        {
          path: 'ExpertList',
          component: resolve => require(['@/views/expertManage/ExpertList.vue'], resolve),
          meta: {
            title: '专家管理',
            id: ''
          }
        }
      ]
    },
    {
      path: '/cautionManage',
      name: 'cautionManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '预警管理',
        id: ''
      },
      children: [
        {
          path: 'Setcaution',
          component: resolve => require(['@/views/cautionManage/Setcaution.vue'], resolve),
          meta: {
            title: '报警设置',
            id: ''
          }
        },
        {
          path: 'SetAbnormal',
          component: resolve => require(['@/views/cautionManage/SetAbnormal.vue'], resolve),
          meta: {
            title: '异常查询',
            id: ''
          }
        }
      ]
    },
    {
      path: '/guidanceManage',
      name: 'guidanceManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '指导管理',
        id: ''
      },
      children: [
        {
          path: 'GuidanceRemote',
          component: resolve => require(['@/views/guidanceManage/GuidanceRemote.vue'], resolve),
          meta: {
            title: '远程指导',
            id: ''
          }
        }
      ]
    },
    {
      path: '/authorityManage',
      name: 'authorityManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '权限管理',
        id: ''
      },
      children: [
        {
          path: 'AppManage',
          component: resolve => require(['@/views/authorityManage/AppManage.vue'], resolve),
          meta: {
            title: '应用程序管理',
            id: ''
          }
        },
        {
          path: 'UserManage',
          component: resolve => require(['@/views/authorityManage/UserManage.vue'], resolve),
          meta: {
            title: '用户管理',
            id: ''
          }
        },
        {
          path: 'RoleManage',
          component: resolve => require(['@/views/authorityManage/RoleManage.vue'], resolve),
          meta: {
            title: '角色管理',
            id: ''
          }
        },
        {
          path: 'MenuManage',
          component: resolve => require(['@/views/authorityManage/MenuManage.vue'], resolve),
          meta: {
            title: '菜单管理',
            id: ''
          }
        }
      ]
    },
    {
      path: '/taskManage',
      name: 'taskManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '班次管理',
        id: ''
      },
      children: [
        {
          path: 'TaskList',
          component: resolve => require(['@/views/taskManage/TaskList.vue'], resolve),
          meta: {
            title: '班次列表',
            id: ''
          }
        },
        {
          path: 'AllotTasks',
          component: resolve => require(['@/views/taskManage/AllotTasks.vue'], resolve),
          meta: {
            title: '任务分配',
            id: ''
          }
        }
      ]
    },
    {
      path: '/equipmentManage',
      name: 'equipmentManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '设备管理',
        id: ''
      },
      children: [
        {
          path: 'EquipmentType',
          component: resolve => require(['@/views/equipmentManage/EquipmentType.vue'], resolve),
          meta: {
            title: '设备类型',
            id: ''
          }
        },
        {
          path: 'EquipmentList',
          component: resolve => require(['@/views/equipmentManage/EquipmentList.vue'], resolve),
          meta: {
            title: '设备列表',
            id: ''
          }
        },
        {
          path: 'PatrolPoint',
          component: resolve => require(['@/views/equipmentManage/PatrolPoint.vue'], resolve),
          meta: {
            title: '巡检点管理',
            id: ''
          }
        },
        {
          path: 'LineManage',
          component: resolve => require(['@/views/equipmentManage/LineManage.vue'], resolve),
          meta: {
            title: '线路管理',
            id: ''
          }
        },
        {
          path: 'VideoPlayback',
          component: resolve => require(['@/views/equipmentManage/VideoPlayback.vue'], resolve),
          meta: {
            title: '录像回放',
            id: ''
          }
        }

      ]
    },
    {
      path: '/repairManage',
      name: 'repairManage',
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
      path: '/newsManage',
      name: 'newsManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '新闻管理',
        id: ''
      },
      children: [
        {
          path: 'NewsList',
          component: resolve => require(['@/views/newsManage/NewsList.vue'], resolve),
          meta: {
            title: '新闻列表',
            id: ''
          }
        }
      ]
    },
    {
      path: '/formManage',
      name: 'formManage',
      component: resolve => require(['@/views/layout/Layout.vue'], resolve),
      meta: {
        title: '报表管理',
        id: ''
      },
      children: [
        {
          path: 'PatrolPersonnel',
          component: resolve => require(['@/views/formManage/PatrolPersonnel.vue'], resolve),
          meta: {
            title: '巡检人员列表',
            id: ''
          }
        },
        {
          path: 'SevenDayNotPatrol',
          component: resolve => require(['@/views/formManage/SevenDayNotPatrol.vue'], resolve),
          meta: {
            title: '7天未巡检列表',
            id: ''
          }
        },
        {
          path: 'DataChart',
          component: resolve => require(['@/views/formManage/DataChart.vue'], resolve),
          meta: {
            title: '数据走势图',
            id: ''
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/views/Login.vue'], resolve)
    },
    {
      path: '/updatePassword',
      name: 'updatePassword',
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
      path: '/CheckLine',
      name: 'CheckLine',
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
      name: 'EditEquipmentType',
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
    },
    {
      path: '*',
      name: '404',
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
  ]
})
