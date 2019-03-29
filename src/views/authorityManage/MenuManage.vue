<template>
  <div class="guidance-remote--warpper">
    <view-title title="菜单管理"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="6">
          选择应用程序：
          <el-select
            size="mini"
            @change="handleChange"
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
          <el-button @click="addUser" type="primary" size="mini">添加菜单</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :total="total"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog width="600px" title="添加菜单" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择程序" prop="id">
          <el-select size="mini" @change="changeCode" v-model="ruleForm.id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="id">
          <el-select size="mini" v-model="ruleForm.parent_id" placeholder="请选择">
            <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input size="mini" placeholder="请输入菜单名称" v-model="ruleForm.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input size="mini" placeholder="请输入图标名称" v-model="ruleForm.menu_icon"></el-input>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input size="mini" placeholder="请输入url" v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="排序" prop="sort">
          <el-input type="number" size="mini" placeholder="输入序号" v-model="ruleForm.sort"></el-input>
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
      count: 1,
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      condition: {
        pageIndex: "1",
        pageSize: "10",
        application_code: ""
      },
      ruleForm: {
        id: "",
        menu_name: "",
        url: "",
        sort: "",
        user_id: "",
        parent_id: "",
        menu_icon: ""
      },
      rules: {
        id: [{ required: true, message: "请选择程序", trigger: "blur" }],
        menu_name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入url", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "序号",
          width: "70"
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
          prop: "url",
          label: "URL"
        },
        {
          prop: "sort",
          label: "排序"
        },
        {
          prop: "status",
          label: "状态"
        }
      ],
      options: [],
      parentOptions: []
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          id: "",
          menu_name: "",
          url: "",
          sort: "",
          user_id: ""
        };
      }
    }
  },
  created() {
    this.getMenuList();
    this.getApp();
  },
  mounted() {},
  methods: {
    changeCode() {
      this.getByApplication();
    },
    getByApplication() {
      this.$axios
        .get(
          `${this.api}/menu/getByApplication?application_code=${
            this.ruleForm.id
          }`
        )
        .then(res => {
          const { data } = res.data;
          this.parentOptions = data.map(item => {
            return {
              label: item.menu_name,
              value: item.id
            };
          });
        });
    },
    changePage(page) {
      this.condition.pageIndex = page;
      this.getMenuList();
    },
    getApp() {
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
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/menu/put`, this.ruleForm)
            .then(res => {
              console.log(res);
              this.dialogFormVisible = false;
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleChange() {
      this.getMenuList();
    },
    getMenuList() {
      this.$axios
        .post(`${this.api}/menu/getList`, this.condition)
        .then(res => {
          console.log(res);
          this.total = res.data.data.total;
          const data = res.data.data.items;
          data.map((item, index) => {
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
          this.tableData = data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      Object.assign(this.ruleForm, row);
    },
    enable(row) {
      this.$axios
        .get(`${this.api}/menu/changeSate?id=${row.id}&user_id=1`)
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          row.buttonInfo.splice(1, 1, {
            label: "禁用",
            name: "disable",
            type: "danger"
          });
          console.log(res);
        });
    },
    disable(row) {
      this.$axios
        .get(`${this.api}/menu/changeSate?id=${row.id}&user_id=1`)
        .then(res => {
          row.buttonInfo.splice(1, 1, {
            label: "启用",
            name: "enable",
            type: "primary"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
          console.log(res);
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

