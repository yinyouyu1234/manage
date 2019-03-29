<template>
  <div class="guidance-remote--warpper">
    <view-title title="用户管理" icon="icon-yonghu"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          姓名：
          <el-input size="mini" v-model="condition.user_name" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          手机号：
          <el-input size="mini" v-model="condition.phone_number" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          员工号：
          <el-input size="mini" v-model="condition.user_code" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="5">
          状态：
          <el-select size="mini" v-model="condition.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button @click="addUser" type="primary" size="mini">添加</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="tableLoading"
        :total="total"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog width="600px" title="添加用户" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="员工号" prop="user_code">
          <el-input size="mini" placeholder="请输入员工号" v-model="ruleForm.user_code"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="user_name">
          <el-input size="mini" placeholder="请输入用户名" v-model="ruleForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input size="mini" placeholder="请输入密码" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone_number">
          <el-input size="mini" placeholder="请输入手机号码" v-model="ruleForm.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="dept_name">
          <el-input size="mini" placeholder="请输入部门名称" v-model="ruleForm.dept_name"></el-input>
        </el-form-item>
        <el-form-item label="岗位" prop="post_name">
          <el-input size="mini" placeholder="请输入岗位名称" v-model="ruleForm.post_name"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <div v-for="item in ruleForm.roles" :key="item.application_name">
            {{item.application_name}}：
            <el-checkbox
              v-for="ele in item.role"
              :key="ele.id"
              v-model="ele.check"
              @change="changeCheck(ele,ele.check)"
              name="type"
            >{{ele.role_name}}</el-checkbox>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
export default {
  name: "UserManage",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    return {
      total: 0,
      loading: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      tableLoading: false,
      checkBoxList: [],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        user_name: "",
        phone_number: "",
        user_code: "",
        status: ""
      },
      ruleForm: {
        dept_name: "",
        id: "",
        password: "",
        phone_number: "",
        post_name: "",
        roles: [],
        user_code: "",
        user_name: "",
        user_id: 1,
        password_change: false,
        oldPassword: ""
      },
      rules: {
        user_code: [
          { required: true, message: "请输入员工号", trigger: "blur" }
        ],
        user_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        phone_number: [
          { required: true, message: "请输入手机号", trigger: "blur" }
        ],
        dept_name: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        post_name: [
          { required: true, message: "请输入岗位名称", trigger: "blur" }
        ]
        // roles: [{ required: true, message: "请输入角色", trigger: "blur" }]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "序号",
          width: "70"
        },
        {
          prop: "user_code",
          label: "员工号"
        },
        {
          prop: "user_name",
          label: "姓名"
        },
        {
          prop: "phone_number",
          label: "手机"
        },

        {
          prop: "dept_name",
          label: "部门"
        },
        {
          prop: "post_name",
          label: "岗位"
        }
      ],
      options: [
        {
          value: "",
          label: "全部"
        }
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          dept_name: "",
          id: "",
          password: "",
          phone_number: "",
          post_name: "",
          roles: [],
          user_code: "",
          user_name: "",
          user_id: 1,
          password_change: false,
          oldPassword: ""
        };
      } else {
        this.getAppRoles();
      }
    }
  },
  created() {
    this.getUserList();
    this.getUserStatus();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getUserList();
    },
    getAppRoles() {
      this.$axios
        .get(`${this.api}/user/getAppRoles`)
        .then(res => {
          this.ruleForm.roles = res.data.data;
        })
        .catch(err => {});
    },
    getUserStatus() {
      this.$axios
        .get(`${this.api}/user/getUserStatus`)
        .then(res => {
          const { data } = res.data;
          Object.assign(this.options, data);
        })
        .catch(err => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.oldPassword != this.ruleForm.password) {
            this.ruleForm.password_change = true;
          }
          this.$axios
            .post(`${this.api}/user/put`, this.ruleForm)
            .then(res => {
              this.getUserList();
              this.dialogFormVisible = false;
            })
            .catch(err => {});
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeCheck(item, checked) {
      if (checked) {
        this.checkBoxList.push(item.id);
      } else {
        const index = this.checkBoxList.indexOf(item.id);
        this.checkBoxList.splice(index, 1);
      }
    },
    enable(row) {
      this.tableLoading = true;
      this.$axios
        .get(`${this.api}/user/get?id=${row.id}&user_id=1`)
        .then(res => {
          this.tableLoading = false;
          row.buttonInfo.splice(1, 1, {
            label: "禁用",
            name: "disable",
            type: "danger"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {});
    },
    disable(row) {
      this.tableLoading = true;
      this.$axios
        .get(`${this.api}/user/get?id=${row.id}&user_id=1`)
        .then(res => {
          this.tableLoading = false;
          row.buttonInfo.splice(1, 1, {
            label: "启用",
            name: "enable",
            type: "primary"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {});
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios
        .get(`${this.api}/user/get?id=${row.id}`)
        .then(res => {
          const { data } = res.data;
          // data.roles.forEach(item => {
          //   item.role.forEach(ele => {
          //     ele.check && this.checkBoxList.push(ele.id);
          //   });
          // });
          this.ruleForm = {
            ...this.ruleForm,
            ...data,
            id: row.id
          };
          this.ruleForm.oldPassword = this.ruleForm.password;
          console.log(this.ruleForm);
        })
        .catch(err => {});
    },
    filter() {
      this.loading = true;
      this.getUserList(true);
    },
    getUserList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/user/getList`, this.condition)
        .then(res => {
          this.tableLoading = false;
          const { data } = res.data;
          this.total = data.total;
          data.items.map((item, index) => {
            item.index = index + 1;
            if (item.statusCode == 1) {
              item.buttonInfo = [
                {
                  name: "edit",
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: "disable",
                  type: "danger",
                  label: "禁用"
                }
              ];
            } else {
              item.buttonInfo = [
                {
                  name: "edit",
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: "enable",
                  type: "primary",
                  label: "启用"
                }
              ];
            }
          });
          this.loading = false;
          filter &&
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          this.tableData = data.items;
        })
        .catch(err => {});
    },
    addUser() {
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style lang="less">
.guidance-remote--warpper {
  .down-item {
    height: 30px;
    cursor: pointer;
  }
}
</style>

