export const optionsStatus = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '停用',
    value: 0
  }
]

export const rules = {
  equipment_type_id: [
    { required: true, message: '请输入选择设备类型', trigger: 'blur' }
  ],
  kks: [{ required: true, message: '请输入KKS码', trigger: 'blur' }],
  equipment_name: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
  latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
}
export const condition = {
  pageIndex: 1,
  pageSize: 10,
  kks: '',
  equipment_name: '',
  status: ''
}

export const ruleForm = {
  id: 0,
  equipment_type_id: '',
  parent_kks: '',
  kks: '',
  equipment_name: '',
  patrol_point_id: '',
  longitude: '',
  latitude: '',
  status: '',
  remark: '',
  initiative: false,
  sensor_id: ''
}

export const columnData = [
  {
    prop: 'index',
    width: 70,
    label: '编号'
  },
  {
    prop: 'kks',
    label: 'KKS'
  },
  {
    prop: 'equipment_name',
    label: '名称'
  },
  {
    prop: 'equipment_type_name',
    label: '设备类型'
  },
  {
    prop: 'gps',
    label: 'GPS'
  },
  {
    prop: 'status',
    label: '状态'
  },
  {
    prop: 'remark',
    label: '备注'
  }
]

export const options = [
  {
    value: '',
    label: '全部'
  },
  {
    value: '1',
    label: '启用'
  },
  {
    value: '0',
    label: '禁用'
  }
]
