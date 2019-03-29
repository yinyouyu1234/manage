<template>
  <div class="guidance-remote--warpper">
    <view-title title="巡检点"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          巡检点名称：
          <el-input
            size="mini"
            v-model="condition.patrol_point_name"
            clearable
            placeholder="请输入巡检点名称"
          ></el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button size="mini" type="primary" @click="addClick">添加</el-button>
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
    <el-dialog title="基本信息" width="600px" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="patrol_point_name" label="巡检点名称" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.patrol_point_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="longitude" label="经度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.longitude" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="latitude" label="纬度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.latitude" autocomplete="off"></el-input>
        </el-form-item>
        <hr style="margin-bottom:20px;">
        <div class="dialog-input--box">
          <div class="label">KKS</div>
          <el-input size="mini" v-model="formAddTable.kks" @change="changekks" autocomplete="off"></el-input>
        </div>
        <div class="dialog-input--box">
          <div class="labels">序号</div>
          <el-input
            size="mini"
            type="number"
            v-model="formAddTable.id"
            @change="changeid"
            autocomplete="off"
          ></el-input>
          <el-button size="mini" type="primary" :disabled="!dis" @click="addTableData">添加</el-button>
        </div>
      </el-form>
      <div style="padding:20px">
        <pc-table
          :pagination="false"
          :columnData="columnDataDialog"
          :tableData="tableDataDialog"
          :button-info-icon="iconButton"
          @delete="deleteItem"
        />
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
  name: "PatrolPoint",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  computed: {
    dis() {
      return (
        this.formAddTable.id.length > 0 && this.formAddTable.kks.length > 0
      );
    }
  },
  data() {
    return {
      total: 0,
      loading: false,
      tableLoading: false,
      state2: "",
      imageUrl: "",
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      rules: {
        patrol_point_name: [
          { required: true, message: "请输入巡检点名称", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        latitude: [
          { required: true, message: "请输入纬度", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      condition: {
        pageIndex: "1",
        pageSize: "10",
        patrol_point_name: ""
      },
      ruleForm: {
        patrol_point_name: "",
        longitude: "",
        latitude: "",
        equipment_id: [],
        user_id: 1
      },
      formAddTable: {
        kks: "",
        id: "",
        equipment_name: ""
      },
      tableDataDialog: [],
      tableData: [],
      columnData: [
        {
          prop: "index",
          width: "70",
          label: "编号"
        },
        {
          prop: "patrol_point_name",
          label: "名称"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      columnDataDialog: [
        {
          prop: "index",
          width: "70",
          label: "序号"
        },
        {
          prop: "kks",
          label: "KKS"
        },
        {
          prop: "equipment_name",
          label: "名称"
        }
      ],
      iconButton: [
        {
          name: "delete",
          icon: "el-icon-delete",
          label: "删除"
        }
      ]
    };
  },
  created() {
    this.getData();
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.tableDataDialog = [];
        this.ruleForm = {
          patrol_point_name: "",
          longitude: "",
          latitude: ""
        };
      } else {
        // this.getLineAll();
      }
    }
  },
  mounted() {},
  methods: {
    changekks() {
      this.formAddTable.kks.trim().length > 0 &&
        this.$axios
          .get(
            `${this.api}/equipment/getByKKSForPatrolPoint?kks=${
              this.formAddTable.kks
            }`
          )
          .then(res => {
            const { data } = res.data;
            this.formAddTable.id = data.id.toString();
            this.formAddTable.kks = data.kks;
            this.formAddTable.equipment_name = data.equipment_name;
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          });
    },
    changeid() {
      this.formAddTable.id.trim().length > 0 &&
        this.$axios
          .get(
            `${this.api}/equipment/getByIDForPatrolPoint?id=${
              this.formAddTable.id
            }`
          )
          .then(res => {
            const { data } = res.data;
            this.formAddTable.id = data.id.toString();
            this.formAddTable.kks = data.kks;
            this.formAddTable.equipment_name = data.equipment_name;
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          });
    },
    changePage() {
      this.condition.pageIndex = page;
      this.getData();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/patrolPoint/put`, this.ruleForm)
            .then(res => {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.getData();
              this.dialogFormVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    addTableData() {
      this.formAddTable.index = this.tableDataDialog.length + 1;
      this.ruleForm.equipment_id.push(this.formAddTable.id);
      this.tableDataDialog.push({ ...this.formAddTable });
      this.formAddTable = {
        kks: "",
        id: "",
        equipment_name: ""
      };
    },
    getData(filter = false) {
      this.tableLoading = false;
      console.log(this.condition);
      this.$axios
        .post(`${this.api}/patrolPoint/getList`, this.condition)
        .then(res => {
          const data = res.data.data.items;
          this.total = res.data.data.total;
          this.loading = false;
          this.tableLoading = false;

          data.forEach((item, index) => {
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
          filter &&
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          console.log(res);
        })
        .catch(err => {
          this.tableLoading = false;
          this.loading = false;
        });
    },
    enable(row) {
      this.$axios
        .get(`${this.api}/patrolPoint/changeState?id=${row.id}&user_id=1`)
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
        .get(`${this.api}/patrolPoint/changeState?id=${row.id}&user_id=1`)
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
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    filter() {
      this.loading = true;
      this.getData(true);
    },
    handleSelect(item) {
      console.log(item);
    },
    addClick() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/patrolPoint/get?id=${row.id}`).then(res => {
        const { data } = res.data;
        Object.assign(this.ruleForm, data);
        data.equipment.forEach((item, index) => {
          item.index = index + 1;
        });
        this.tableDataDialog = data.equipment;
      });
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
    },
    deleteItem(row) {
      this.$confirm("确认删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableDataDialog.splice(row.index - 1, 1);
          this.tableDataDialog.forEach((item, index) => {
            item.index = index + 1;
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less">
.dialog-input--box {
  display: inline-block;
  width: 45%;
  .el-input {
    width: 50%;
  }
}
.labels {
  display: inline-block;
  // width: 120px;
  // text-align: right;
  // padding-right: 12px;
  // box-sizing: border-box;
}
.label {
  display: inline-block;
  width: 120px;
  text-align: right;
  padding-right: 12px;
  box-sizing: border-box;
}
</style>

