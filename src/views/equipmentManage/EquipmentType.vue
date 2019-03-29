<template>
  <div class="equipment-type--warpper">
    <view-title title="设备类型" icon="icon-shebei"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          设备名称：
          <el-input
            size="mini"
            v-model="condition.equipment_type_name"
            clearable
            placeholder="请输入设备名称"
          ></el-input>
        </el-col>
        <el-col :span="5">
          生产厂家：
          <el-input size="mini" v-model="condition.manufacturer" clearable placeholder="请输入生产厂家"></el-input>
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
      loading: false,
      tableLoading: false,
      imageUrl: "",
      innerVisible: false,
      dialogFormVisible: false,
      innerVisibleState: "",
      formLabelWidth: "120px",
      dataTime: "",
      tableData: [
        {
          id: 1,
          equipment_type_code: "编号",
          equipment_type_name: "设备类型名称",
          manufacturer: "生产厂家",
          remark: "备注"
        }
      ],
      condition: {
        pageIndex: "",
        pageSize: "",
        equipment_type_name: "",
        manufacturer: ""
      },
      ruleForm: {
        number: "",
        name: "",
        password: "",
        phoneNumber: "",
        department: "",
        post: "",
        textareaText: "",
        category: ""
      },
      condition: {
        pageIndex: "1",
        pageSize: "10",
        equipment_type_name: "",
        manufacturer: ""
      },
      columnData: [
        {
          prop: "equipment_type_code",
          width: "120",
          label: "编号"
        },
        {
          prop: "equipment_type_name",
          label: "设备名称"
        },
        {
          prop: "manufacturer",
          label: "生产厂家"
        },
        {
          prop: "remark",
          label: "备注"
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
  watch: {},
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    changePage() {
      this.condition.pageIndex = page;
      this.getData();
    },
    getData(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/equipmentType/getList`, this.condition)
        .then(res => {
          console.log(res);
          this.total = res.data.data.total;
          const data = res.data.data.items;
          this.loading = false;
          this.tableLoading = false;
          data.forEach((item, index) => {
            item.index = index;
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
        })
        .catch(err => {
          this.loading = false;
        });
    },
    enable(row) {
      this.$axios
        .get(`${this.api}/equipment/changeState?id=${row.id}&user_id=1`)
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
        .get(`${this.api}/equipment/changeState?id=${row.id}&user_id=1`)
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
    addClick() {
      this.$router.push({
        path: "/EditEquipmentType"
      });
    },
    edit(row) {
      this.$router.push({
        path: "/EditEquipmentType",
        query: {
          type: "edit"
        }
      });
    },
    filter() {
      this.loading = true;
      this.getData(true);
    }
  }
};
</script>
<style lang="less">
.equipment-type--warpper {
  .dialog-title {
    font-size: 18px;
    font-weight: bold;
    padding: 20px;
  }
  .item-title {
    font-size: 15px;
    padding: 10px 0;
    .el-icon-circle-plus-outline {
      font-size: 15px;
      color: #409eff;
      cursor: pointer;
    }
  }
  .left-table {
    float: left;
    width: 24%;
    padding-right: 30px;
    padding-left: 30px;
    padding-bottom: 30px;
    border-right: 1px solid #dcdfe6;
  }
  .right-table {
    float: left;
    width: 60%;
    padding-left: 30px;
  }
  .empty {
    clear: both;
  }
}
</style>

