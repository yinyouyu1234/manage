import Mock from 'mockjs'

Mock.mock('/getNav', 'post', {
  data: [
    {
      title: '专家管理',
      icon: 'icon-zhuanjia',
      children: [
        {
          title: '专家列表',
          icon: 'el-icon-menu',
          component: resolve => require(['@/views/expertManage/ExpertList.vue'], resolve),
          path: '/expertManage/ExpertList',
          id: 'a'
        }
      ]
    },
    {
      title: '预警管理',
      icon: 'icon-yujing',
      children: [
        {
          title: '报警设置',
          icon: 'el-icon-menu',
          path: '/cautionManage/Setcaution',
          id: 'b'
        },
        {
          title: '异常查询',
          icon: 'el-icon-menu',
          path: '/cautionManage/SetAbnormal',
          id: 'c'

        }
      ]
    },
    {
      title: '指导管理',
      icon: 'icon-zaixianzhidao',
      children: [
        {
          title: '远程指导',
          icon: 'el-icon-menu',
          path: '/guidanceManage/GuidanceRemote',
          id: 'd'
        }
      ]
    },
    {
      title: '权限管理',
      icon: 'icon-quanxianguanli',
      children: [
        {
          title: '应用程序管理',
          icon: 'el-icon-menu',
          path: '/authorityManage/AppManage',
          id: 'e'
        },
        {
          title: '用户管理',
          icon: 'el-icon-menu',
          path: '/authorityManage/UserManage',
          id: 'f'
        },
        {
          title: '角色管理',
          icon: 'el-icon-menu',
          path: '/authorityManage/RoleManage',
          id: 'g'
        },
        {
          title: '菜单管理',
          icon: 'el-icon-menu',
          path: '/authorityManage/MenuManage',
          id: 'h'
        }
      ]
    },
    {
      title: '班次管理',
      icon: 'icon-renyuanbanciguanli',
      children: [
        {
          title: '班次列表',
          icon: 'el-icon-menu',
          path: '/taskManage/TaskList',
          id: 'i'
        },
        {
          title: '任务分配',
          icon: 'el-icon-menu',
          path: '/taskManage/AllotTasks',
          id: 'j'
        }
      ]
    },
    {
      title: '设备管理',
      icon: 'icon-shebei',
      children: [
        {
          title: '设备类型',
          icon: 'el-icon-menu',
          path: '/equipmentManage/EquipmentType',
          id: 'k'
        },
        {
          title: '设备列表',
          path: '/equipmentManage/EquipmentList',
          icon: 'el-icon-menu',
          id: 'l'
        },
        {
          title: '巡检点管理',
          icon: 'el-icon-menu',
          path: '/equipmentManage/PatrolPoint',
          id: 'm'
        },
        {
          title: '线路管理',
          icon: 'el-icon-menu',
          path: '/equipmentManage/LineManage',
          id: 'n'
        },
        {
          title: '录像回放',
          icon: 'el-icon-menu',
          path: '/equipmentManage/VideoPlayback',
          id: 'n1'
        }
      ]
    },
    {
      title: '维修管理',
      icon: 'icon-weixiu',
      children: [
        {
          title: '缺陷管理',
          path: '/repairManage/DefectManage',
          icon: 'el-icon-menu',
          id: 'o'
        }
      ]
    },
    {
      title: '新闻管理',
      icon: 'icon-news',
      children: [
        {
          title: '新闻列表',
          path: '/newsManage/NewsList',
          icon: 'el-icon-menu',
          id: 'p'
        }
      ]
    },
    {
      title: '报表管理',
      icon: 'icon-baobiao',
      children: [
        {
          title: '巡检人员列表',
          path: '/formManage/PatrolPersonnel',
          icon: 'el-icon-menu',
          id: 'q'
        },
        {
          title: '7天未巡检列表',
          path: '/formManage/SevenDayNotPatrol',
          icon: 'el-icon-menu',
          id: 'r'
        },
        {
          title: '数据走势图',
          path: '/formManage/DataChart',
          icon: 'el-icon-menu',
          id: 's'
        }
      ]
    }
  ]
})

export default Mock
