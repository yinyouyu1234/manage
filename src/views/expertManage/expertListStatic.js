export const rules = {
  user_code: [
    { required: true, message: '请输入员工号', trigger: 'blur' }
  ],
  expert_name: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone_number: [
    { required: true, message: '请输入手机号码', trigger: 'blur' }
  ],
  dept_name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' }
  ],
  post_name: [
    { required: true, message: '请输入岗位名称', trigger: 'blur' }
  ],
  expert_type: [
    { required: true, message: '请选择类别', trigger: 'blur' }
  ]
}
export const form = [
  {
    label: '员工号',
    prop: 'user_code'
  },
  {
    label: '用户名',
    prop: 'expert_name'
  },
  {
    label: '密码',
    prop: 'password'
  },
  {
    label: '手机号',
    prop: 'phone_number'
  },
  {
    label: '部门',
    prop: 'dept_name'
  },
  {
    label: '岗位',
    prop: 'post_name'
  }
]
export const columnData = [
  {
    label: '编号',
    prop: 'index',
    width: '60'
  },
  {
    prop: 'user_code',
    label: '员工号'
  },
  {
    prop: 'expert_name',
    label: '姓名'
  },
  {
    prop: 'phone_number',
    label: '手机'
  },
  {
    prop: 'dept_name',
    label: '部门'
  },
  {
    prop: 'post_name',
    label: '岗位'
  }
]
export const optionsStatus = [
  {
    value: -1,
    label: '全部'
  },
  {
    value: 0,
    label: '禁用'
  },
  {
    value: 1,
    label: '启用'
  }
]
