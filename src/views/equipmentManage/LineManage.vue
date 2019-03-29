<template>
  <div class="guidance-remote--warpper">
    <view-title title="线路管理" icon="icon-xianlu"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          线路名称：
          <el-input size="mini" v-model="condition.patrol_root_name" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button size="mini" type="primary" @click="addClick">添加</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :loading="tableLoading"
        :tableData="tableData"
        :columnData="columnData"
        :total="total"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog title="基本信息" width="750px" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="patrol_name" label="线路名称" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.patrol_name"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select size="mini" v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <hr style="margin-bottom:20px;">
      <div class="line-manage-layout--box" style="padding:20px">
        <div class="left-box">
          <div class="line-manage-leftnav">
            <div class="title">巡检点</div>
            <ul>
              <li
                v-for="(item) in list"
                :key="item.id"
                :class="{active:item.active}"
                @click="handleClick(item)"
              >{{item.patrol_point_name}}</li>
            </ul>
          </div>
          <div class="line-manage-left-table">
            <el-transfer v-model="value1" :titles="transferTitle" :data="data"></el-transfer>
          </div>
        </div>
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
  name: "LineManage",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    return {
      total: 0,
      data: [],
      loading: false,
      tableLoading: false,
      transferTitle: ["巡检点设备", "已选择设备"],
      value1: [],
      state2: "",
      imageUrl: "",
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      list: [
        {
          label: "巡检点1",
          active: true
        },
        {
          label: "巡检点1",
          active: false
        },
        {
          label: "巡检点1",
          active: false
        }
      ],
      rules: {
        patrol_name: [
          { required: true, message: "请输入线路名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择状态", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      condition: {
        patrol_root_name: ""
      },
      ruleForm: {
        patrol_name: "",
        status: ""
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: "70"
        },
        {
          prop: "patrol_name",
          width: "200",
          label: "名称"
        },
        {
          prop: "remark",
          label: "备注"
        }
      ],
      options: [
        {
          value: 1,
          label: "启用"
        },
        {
          value: 0,
          label: "禁用"
        }
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        this.getAllPoint();
      } else {
        this.$refs.ruleForm.resetFields();
        this.value1 = [];
        this.ruleForm = {
          patrol_name: "",
          status: ""
        };
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    changePage() {
      this.condition.pageIndex = page;
      this.getData();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const arr = this.value1.map((item, index) => {
            return {
              equipment_id: item,
              sort: index
            };
          });

          this.$axios.post(`${this.api}/patrolRoute/put`, {
            ...this.ruleForm,
            equipment_route: arr
          });
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    filter() {
      this.loading = true;
      this.getData(true);
    },
    getData(filter = false) {
      this.tableLoading = true;
      console.log(this.condition);
      this.$axios
        .post(`${this.api}/patrolRoute/getList`, this.condition)
        .then(res => {
          const data = res.data.data.items;
          this.loading = false;
          this.tableLoading = false;
          this.total = res.data.data.total;
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
          this.loading = false;
          this.tableLoading = false;
        });
    },
    enable(row) {
      this.$axios
        .get(`${this.api}/patrolRoute/changeState?id=${row.id}&user_id=1`)
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
        .get(`${this.api}/patrolRoute/changeState?id=${row.id}&user_id=1`)
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
    getAllPoint() {
      this.$axios
        .post(`${this.api}/patrolPoint/getList`, {
          pageIndex: 1,
          pageSize: 100,
          patrol_point_name: ""
        })
        .then(res => {
          const data = res.data.data.items;
          data.forEach((item, index) => {
            item.active = index === 0 ? true : false;
          });
          this.list = data;
          this.handleClick(this.list[0]);
        })
        .catch(err => {});
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
    handleSelect(item) {
      console.log(item);
    },
    addClick() {
      console.log(this.$router.options.routes);

      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.patrolRoute(row.id);
    },
    patrolRoute(id) {
      this.$axios.get(`${this.api}/patrolRoute/get?id=${id}`).then(res => {
        console.log(res);
        this.ruleForm = {
          patrol_name: res.data.data.patrol_name,
          status: res.data.data.status
        };
        console.log(this.ruleForm);
        let data = res.data.data.equipment_route;
        data = data.map(item => {
          this.value1.push(item.id);
          return { key: item.id, label: item.equipment_name };
        });
        console.log(data);
        const arr = this.data.concat(data);

        for (var i = 0; i < arr.length; i++) {
          for (var l = i + 1; l < arr.length; l++) {
            if (arr[i].key == arr[l].key) {
              arr.splice(l, 1);
            }
          }
        }
        this.data = data;
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
    handleClick(item) {
      this.list.forEach(ele => {
        ele.active = false;
      });
      item.active = true;
      this.$axios
        .get(`${this.api}/equipment/getByPatrolPoint?id=${item.id}`)
        .then(res => {
          let data = res.data.data;
          data = data.map(item => {
            return { key: item.value, label: item.name };
          });
          this.data = data;
          console.log(data);
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less">
@import "../../styles/basic";
.guidance-remote--warpper {
  .line-manage-layout--box {
    overflow: hidden;
    .left-box {
      float: left;
      .line-manage-leftnav {
        float: left;
        padding-right: 30px;
        .title {
          font-size: 18px;
          padding-bottom: 20px;
          font-weight: bold;
        }
        li {
          padding: 10px;
          cursor: pointer;
        }
      }
      .line-manage-left-table {
        float: left;
      }
    }
    .right-box {
      float: left;
    }
  }
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
  .active {
    color: @backgroundColor;
  }
}
</style>


