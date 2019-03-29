<template>
  <div class="guidance-remote--warpper">
    <view-title title="应用程序管理" icon="icon-yingyong "/>
    <search>
      <el-row :gutter="10">
        <el-button type="primary" @click="addApp">添加应用程序</el-button>
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
    <el-dialog width="600px" title="文件列表" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="应用程序" prop="application_name">
          <el-input size="mini" placeholder="请输入应用程序" v-model="ruleForm.application_name"></el-input>
        </el-form-item>
        <el-form-item label="应用程序编码" prop="application_code">
          <el-input size="mini" placeholder="请输入程序编码" v-model="ruleForm.application_code"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
export default {
  name: "GuidanceRemote",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    return {
      total: 0,
      ruleForm: {
        id: "",
        application_name: "",
        application_code: "",
        user_id: "1"
      },
      rules: {
        application_name: [
          { required: true, message: "请输入应用程序", trigger: "blur" }
        ],
        application_code: [
          { required: true, message: "请输入应用程序编码", trigger: "blur" }
        ]
      },
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      condition: {
        pageIndex: 1,
        pageSize: 10
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
          prop: "application_code",
          label: "编码"
        }
      ],
      options: [
        {
          value: "选项1",
          label: "启用"
        },
        {
          value: "选项2",
          label: "禁用"
        }
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          id: "",
          application_name: "",
          application_code: "",
          user_id: ""
        };
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getList();
    },
    getList() {
      this.$axios
        .post(`${this.api}/application/getList`, this.condition)
        .then(res => {
          console.log(res);
          const data = res.data.data.items;
          data.forEach((item, index) => {
            item.index = index + 1;
            if (item.status == 1) {
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
          this.total = res.data.data.total;
          this.tableData = data;
        });
    },
    edit(row) {
      this.ruleForm = {
        id: row.id,
        application_name: row.application_name,
        application_code: row.application_code
      };
      this.dialogFormVisible = true;
    },
    enable(row) {
      this.loading = true;
      this.$axios
        .get(`${this.api}/application/changestate?id=${row.id}&user_id=1`)
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
        .get(`${this.api}/application/changestate?id=${row.id}&user_id=1`)
        .then(res => {
          this.loading = false;
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
    addApp() {
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/application/put`, this.ruleForm)
            .then(res => {
              this.dialogFormVisible = false;
              this.getList();
              console.log(res);
              this.$message({
                message: "添加成功",
                type: "success"
              });
            })
            .catch(err => {
              this.$message({
                message: "添加失败",
                type: "success"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
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

