<template>
  <div class="guidance-remote--warpper">
    <view-title title="角色管理" icon="icon-jiaoseguanli"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          应用程序：
          <el-select
            size="mini"
            @change="filter"
            v-model="condition.application_code"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="addUser" type="primary" size="mini">添加角色</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        @disable="disable"
        @enable="enable"
        @edit="edit"
        @changePage="changePage"
        :loading="loading"
        :total="total"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="添加角色"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择程序" prop="name">
          <el-select
            size="mini"
            @change="changeTree"
            v-model="ruleForm.application_code"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input size="mini" placeholder="请输入用户名" v-model="ruleForm.role_name"></el-input>
        </el-form-item>
      </el-form>
      <div style="padding-left:80px;width:200px">
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :default-expanded-keys="expandedKeys"
          :default-checked-keys="checkedKeys"
        ></el-tree>
      </div>
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
      defaultProps: {
        children: "children",
        label: "label"
      },
      expandedKeys: [],
      checkedKeys: [],
      treeData: [],
      dialogFormVisible: false,
      condition: {
        pageIndex: "1",
        pageSize: "10",
        application_code: ""
      },
      ruleForm: {
        id: "",
        application_code: "",
        menu_id: [],
        user_id: this.$store.state.app.user_id,
        role_name: ""
      },
      rules: {
        application_code: [
          { required: true, message: "请选择活动名称", trigger: "blur" }
        ],
        role_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: 70
        },
        {
          prop: "application_name",
          label: "应用程序"
        },
        {
          prop: "role_name",
          label: "角色名称"
        },
        {
          prop: "status",
          label: "状态"
        }
      ],
      options: []
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.treeData = [];
      } else {
        this.getTreeByApplication();
      }
    }
  },
  created() {
    this.getApplication();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getMenuList();
    },
    filter() {
      this.ruleForm.application_code = this.condition.application_code;

      this.getMenuList();
    },
    changeTree() {
      this.getTreeByApplication();
    },
    enable(row) {
      this.loading = true;
      this.$axios
        .get(
          `${this.api}/role/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          this.loading = false;
          if (res.data.retCode == 10000) {
            this.getMenuList();
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        })
        .catch(err => {});
    },
    disable(row) {
      this.loading = true;
      this.$axios
        .get(
          `${this.api}/role/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          this.loading = false;
          if (res.data.retCode == 10000) {
            this.getMenuList();
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        })
        .catch(err => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const checkListIds = this.$refs.tree.getCheckedNodes().map(item => {
            return item.id;
          });
          this.ruleForm.menu_id = checkListIds;
          this.$axios.post(`${this.api}/role/put`, this.ruleForm).then(res => {
            this.dialogFormVisible = false;
            if (res.data.retCode == 10000) {
              this.ruleForm = {
                ...this.ruleForm,
                id: "",
                menu_id: [],
                user_id: this.$store.state.app.user_id
              };
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getApplication() {
      this.$axios
        .get(`${this.api}/application/getAll`)
        .then(res => {
          if (res.data.retCode == 10000) {
            let { data } = res.data;
            data = data.map(item => {
              return {
                value: item.application_code,
                label: item.application_name
              };
            });
            this.options = data;
            this.condition.application_code = data[0].value;
            this.ruleForm.application_code = data[0].value;
            this.getMenuList();
          }
        })
        .catch(err => {});
    },
    getMenuList() {
      this.loading = true;
      this.$axios
        .post(`${this.api}/role/getList`, this.condition)
        .then(res => {
          this.loading = false;
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            this.total = data.total;
            data.items.map((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.statusCode = item.status;
              item.status = item.status == 1 ? "启用" : "禁用";
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
            this.tableData = data.items;
          }
        })
        .catch(err => {});
    },
    getTreeByApplication() {
      this.$axios
        .get(
          `${this.api}/menu/getTreeByApplication?application_code=${
            this.ruleForm.application_code
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            const arr = [];
            data.forEach(item => {
              const child = [];
              if (item.childs) {
                item.childs.forEach(ele => {
                  child.push({
                    label: ele.name,
                    id: ele.current.id
                  });
                });
              }
              arr.push({
                label: item.name,
                children: child,
                id: item.current.id
              });
            });
            this.treeData = arr;
          }
        })
        .catch(err => {});
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/role/get?id=${row.id}`).then(res => {
        if (res.data.retCode == 10000) {
          const { data } = res.data;
          this.ruleForm = {
            ...this.ruleForm,
            ...data
          };
          this.expandedKeys = data.menu_id;
          this.checkedKeys = data.menu_id;
        }
      });
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

