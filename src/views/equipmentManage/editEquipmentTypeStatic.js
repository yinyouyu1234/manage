export const rangeList = [
  {
    id: '',
    check_type: 1,
    name: '目测',
    check: false,
    param_type: 1,
    param: ''
  },
  {
    id: '',
    check_type: 2,
    name: '耳听',
    check: false,
    param_type: 1,
    param: ''
  },
  {
    id: '',
    check_type: 3,
    name: '数字识别',
    check: false,
    param_type: 1,
    param: ''
  },
  {
    id: '',
    check_type: 4,
    name: '调取数据',
    check: false,
    param_type: 1,
    param: ''
  },
  {
    id: '',
    check_type: 5,
    name: '识别颜色',
    check: false,
    param_type: 1,
    param: '绿色'
  }
]
export const directList = [
  {
    id: '',
    check_type: 1,
    name: '目测',
    check: false,
    param: '',
    param_type: 1
  },
  {
    id: '',
    check_type: 2,
    name: '耳听',
    param: '',
    check: false,
    param_type: 1
  }
]
export const positionColumnData = [
  {
    prop: 'index',
    label: '编码',
    width: '60'
  },
  {
    prop: 'equipment_part_name',
    label: '部位名称'
  }
]

export const ruleFormItem = {
  id: '',
  equipment_part_item_name: '',
  check_type: '',
  check_type_name: '',
  check_value: '',
  max: '',
  min: '',
  remark: '',
  data_type: '',
  initiative: false,
  check_method: [],
  name: ''
}

export const DLQColumnData = [
  {
    prop: 'index',
    width: '60',
    label: '编号'
  },
  {
    prop: 'equipment_part_item_name',
    label: '项目名称'
  },
  {
    prop: 'check_value',
    label: '标准'
  },
  {
    prop: 'check_type_name',
    label: '检测方法'
  },
  {
    prop: 'data_type',
    label: '主动巡检值'
  },
  {
    prop: 'name',
    label: '检测判断类型'
  }
]

export const options = [
  {
    value: 1,
    label: '直接判断'
  },
  {
    value: 2,
    label: '范围判断'
  }
]
export const ruleFormPosition = {
  equipment_part_name: '',
  index: '',
  equipment_part_item: [],
  id: ''
}
export const positionButtonInfo = [
  {
    name: 'edit',
    icon: 'el-icon-edit',
    label: '编辑'
  },
  {
    name: 'delete',
    icon: 'el-icon-delete',
    label: '删除'
  }
]
