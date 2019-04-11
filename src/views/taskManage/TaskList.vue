<template>
  <div class="guidance-remote--warpper">
    <view-title title="班次查询" icon="icon-renyuanbanciguanli"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          巡检路线：
          <el-input
            size="mini"
            placeholder="请输入巡检路线"
            clearable
            v-model="condition.patrol_route_name"
          ></el-input>
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
        :total="total"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        :loading="tableLoading"
        @changePage="changePage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="添加菜单"
      width="600px"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="班次名称" prop="flights_name">
          <el-input size="mini" placeholder="请输入班次名称" v-model="ruleForm.flights_name"></el-input>
        </el-form-item>
        <el-form-item label="班次时间" prop="flights_time">
          <el-time-picker
            size="mini"
            arrow-control
            v-model="ruleForm.flights_time"
            placeholder="任意时间点"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="线路选择" prop="patrol_id">
          <el-select size="mini" v-model="ruleForm.patrol_id" placeholder="请选择线路">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
      tableLoading: false,
      loading: false,
      dialogFormVisible: false,
      condition: {
        pageIndex: "1",
        pageSize: "10",
        patrol_route_name: ""
      },
      ruleForm: {
        id: "",
        flights_name: "",
        flights_time: "",
        patrol_id: "",
        user_id: this.$store.state.app.user_id
      },
      rules: {
        flights_name: [
          { required: true, message: "请输入班次名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        flights_time: [
          { required: true, message: "请输入班次时间", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        patrol_id: [
          { required: true, message: "请选择路线", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: "70"
        },
        {
          prop: "flights_name",
          label: "班次名称"
        },
        {
          prop: "patrol_name",
          label: "巡检路线"
        },
        {
          prop: "flights_time",
          label: "巡检时间"
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
        this.ruleForm = {
          id: "",
          flights_name: "",
          flights_time: new Date(),
          patrol_id: "",
          user_id: this.$store.state.app.user_id
        };
      } else {
        this.getLineAll();
      }
    }
  },
  created() {
    this.getFlightsList();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getFlightsList();
    },
    filter() {
      this.loading = true;
      this.getFlightsList(true);
    },
    getLineAll() {
      this.$axios.get(`${this.api}/patrolRoute/getAll`).then(res => {
        if (res.data.retCode == 10000) {
          this.options = res.data.data;
        }
      });
    },
    getFlightsList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/flights/getFlightsList`, this.condition)
        .then(res => {
          this.loading = false;
          this.tableLoading = false;
          if (res.data.retCode == 10000) {
            this.total = res.data.data.total;
            const data = res.data.data.items;
            data.forEach((item, index) => {
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
            this.tableData = data;
            filter &&
              this.$message({
                message: "搜索成功",
                type: "success"
              });
          }
        })
        .catch(err => {
          this.loading = false;
          this.tableLoading = false;
        });
    },
    enable(row) {
      this.$axios
        .get(
          `${this.api}/flights/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.getFlightsList();
          }
        });
    },
    disable(row) {
      this.$axios
        .get(
          `${this.api}/flights/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          this.getFlightsList();

          this.$message({
            message: "操作成功",
            type: "success"
          });
        });
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/flights/put`, this.ruleForm)
            .then(res => {
              if (res.data.retCode == 10000) {
                this.dialogFormVisible = false;
                this.getFlightsList();
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.$axios.get(`${this.api}/flightstask/get?id=${row.id}`).then(res => {
        if (res.data.retCode == 10000) {
          const { data } = res.data;
          this.ruleForm.patrol_id = data.patrol_route_id;
          this.ruleForm.flights_name = row.flights_name;
          this.ruleForm.id = row.id;
          this.dialogFormVisible = true;
          this.ruleForm.flights_time = new Date(row.flights_time);
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

