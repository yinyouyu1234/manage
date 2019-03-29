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
    <el-dialog width="500px" title="添加角色" :visible.sync="dialogFormVisible">
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
          :data="treeData"
          :props="defaultProps"
          show-checkbox
          @check-change="handleCheckChange"
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
      treeData: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      condition: {
        pageIndex: "1",
        pageSize: "10",
        application_code: ""
      },
      ruleForm: {
        id: "",
        application_code: "",
        role_name: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
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
          prop: "menu_name",
          label: "菜单"
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
      } else {
        this.getTreeByApplication();
      }
    }
  },
  created() {
    this.getApplication();
    this.getMenuList();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getMenuList();
    },
    filter() {
      this.getMenuList();
    },
    changeTree() {
      this.getTreeByApplication();
    },
    enable(row) {
      this.loading = true;
      this.$axios
        .get(`${this.api}/role/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          this.loading = false;
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
      this.loading = true;
      this.$axios
        .get(`${this.api}/role/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          this.loading = false;
          console.log(res);
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
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          this.dialogFormVisible = false;
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
          console.log(res);
          let { data } = res.data;
          data = data.map(item => {
            return {
              ...item,
              value: item.id,
              label: item.application_name
            };
          });
          this.options = data;
          this.options.unshift({
            value: "",
            label: "全部"
          });
        })
        .catch(err => {});
    },
    getMenuList() {
      this.loading = true;
      this.$axios
        .post(`${this.api}/menu/getList`, this.condition)
        .then(res => {
          this.loading = false;

          const { data } = res.data;
          this.total = data.total;
          data.items.map((item, index) => {
            item.index = index + 1;
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
          console.log(res);
          const { data } = res.data,
            treeData = [];
          data.forEach(item => {
            if (item.childs) {
              item.childs.forEach(ele => {
                ele.label = ele.name;
              });
            }

            item.label = item.name;
            item.children = item.childs;
          });

          this.treeData = data;
        })
        .catch(err => {});
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
    },
    bigImg() {
      this.innerVisible = true;
    },
    fileClick() {
      const link = document.createElement("a");
      const body = document.querySelector("body");
      const blob = new Blob([content]);
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      // fix Firefox
      link.style.display = "none";
      body.appendChild(link);
      link.click();
      body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
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

