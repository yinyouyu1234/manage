<template>
  <div>
    <view-title title="班次分配" icon="icon-renwu"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="5">
          巡检人员：
          <el-input size="mini" v-model="condition.user_name" clearable placeholder="请输入巡检人员"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="5">
          巡检路线：
          <el-input
            size="mini"
            v-model="condition.patrol_route_name"
            clearable
            placeholder="请输入巡检路线"
          ></el-input>
        </el-col>
        <el-col :sm="9" :md="6" :lg="6">
          时间：
          <el-date-picker
            v-model="dataTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          ></el-date-picker>
        </el-col>
        <el-col :sm="5" :md="5" :lg="5">
          类型：
          <el-select size="mini" v-model="condition.flights_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="4" :md="4" :lg="3">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button size="mini" type="primary" @click="allot">分配</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="tableLoading"
        :total="total"
        @getInfo="getInfo"
        @edit="edit"
        @disable="disable"
        @changePage="changePage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      width="500px"
      title="分配任务"
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
          <el-autocomplete
            class="inline-input"
            size="mini"
            v-model="ruleForm.flights_name"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelectFlight"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="班次时间" prop="task_time">
          <el-input disabled size="mini" placeholder="自动匹配" v-model="ruleForm.task_time"></el-input>
        </el-form-item>
        <el-form-item label="线路选择" prop="patrol_route_name">
          <el-input disabled size="mini" placeholder="自动匹配" v-model="ruleForm.patrol_route_name"></el-input>
        </el-form-item>
        <el-form-item label="巡检人员" prop="name">
          <el-autocomplete
            class="inline-input"
            size="mini"
            v-model="ruleForm.user_name"
            :fetch-suggestions="querySearchUserName"
            placeholder="请输入巡检人员"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            size="mini"
            type="dates"
            v-model="ruleForm.task_date"
            placeholder="选择一个或多个日期"
            :picker-options="pickerOptions1"
            format="yyyy-MM-dd "
            value-format="timestamp"
            :readonly="dateReadOnly"
          ></el-date-picker>
          <br>
          <span class="allot-tasks--time">{{ ruleForm.time}}</span>
          <!-- <div v-if="typeof ruleForm.time == 'object'">{{ruleForm.time | timeFormat}}</div> -->
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
import BMap from "BMap";
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
import ImageList from "@/components/ImageList.vue";
import { formart } from "@/utils/formateTime";
export default {
  name: "SetAbnormal",
  components: {
    ViewTitle,
    Search,
    PcTable,
    ImageList
  },
  data() {
    return {
      formStatus: "add",
      dateReadOnly: false,
      total: 0,
      loading: false,
      tableLoading: false,
      ruleForm: {
        id: "",
        flights_id: "",
        flights_name: "",
        task_time: "",
        patrol_route_id: "",
        patrol_route_name: "",
        user_id: "",
        user_name: "",
        task_date: [],
        addTaskTime: ""
      },
      rules: {
        flights_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        task_date: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      dialogFormVisible: false,
      dataTime: "",
      condition: {
        pageIndex: "1",
        pageSize: "10",
        user_name: "",
        patrol_route_name: "",
        flights_type: "",
        start_time: "",
        end_time: ""
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: "70"
        },
        {
          prop: "user_name",
          label: "巡检人员"
        },
        {
          prop: "flights_type_name",
          label: "巡检类型"
        },
        {
          prop: "patrol_route_name",
          label: "巡检线路"
        },
        {
          prop: "task_time",
          label: "巡检日期"
        },
        {
          prop: "start_time",
          label: "巡检开始时间"
        },
        {
          prop: "end_time",
          label: "巡检结束时间"
        },
        {
          prop: "task_status_name",
          label: "状态"
        },
        {
          prop: "exception_name",
          label: "有无异常"
        }
      ],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "2",
          label: "随机巡检"
        },
        {
          value: "1",
          label: "常规巡检"
        }
      ],
      restaurants: [],
      restaurantsUserName: [],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 1000 * 60 * 60 * 24;
        }
      }
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.dateReadOnly = false;
        this.ruleForm = {
          id: "",
          flights_id: "",
          flights_name: "",
          task_time: "",
          patrol_route_id: "",
          patrol_route_name: "",
          user_id: "",
          user_name: "",
          task_date: [],
          addTaskTime: ""
        };
      }
    }
  },
  created() {
    this.getList();
    this.loadAll();
    this.loadAllUserName();
  },
  mounted() {},
  methods: {
    changePage(page) {
      this.condition.pageIndex = page;
      this.getList();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const obj = {};
          let url = "";
          if (this.formStatus === "edit") {
            url = "/flightstask/edit";
            obj.flights_task_id = this.ruleForm.flights_id;
            obj.user_id = this.ruleForm.user_id;
          } else if (this.formStatus === "add") {
            url = "/flightstask/add";
            obj.flights_id = this.ruleForm.flights_id;
            obj.user_id = this.ruleForm.user_id;
            obj.patrol_route_id = this.ruleForm.patrol_route_id;
            obj.task_time = this.ruleForm.addTaskTime;
            obj.task_date = this.ruleForm.task_date;
          }
          this.$axios.post(`${this.api}${url}`, obj).then(res => {
            if (res.data.retCode == 10000) {
              this.dialogFormVisible = false;
              this.getList();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    filter() {
      this.loading = true;
      this.getList(true);
    },
    getList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/flightstask/getList`, this.condition)
        .then(res => {
          this.tableLoading = false;
          this.loading = false;
          if (res.data.retCode == 10000) {
            this.total = res.data.data.total;
            const data = res.data.data.items;
            data.forEach((item, i) => {
              item.index = i + 1 + (this.condition.pageIndex - 1) * 10;
              item.flights_type_name =
                item.flights_type == 1 ? "常规巡检" : "随机巡检";
              item.exception_name = item.exception ? "有异常" : "无异常";
              item.task_status_name =
                item.task_status == 0
                  ? "未开始"
                  : item.task_status == 1
                  ? "进行中"
                  : "已完成";
              item.buttonInfo = [
                {
                  name: "getInfo",
                  disabled: item.task_status == 0 ? true : false,
                  type: "primary",
                  label: "查看"
                },
                {
                  name: "edit",
                  disabled: item.task_status == 0 ? false : true,
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: item.status == 0 ? "disable" : "disable",
                  disabled: item.task_status == 0 ? false : true,
                  type: item.status == 0 ? "primary" : "danger",
                  label: item.status == 0 ? "启用" : "禁用"
                }
              ];
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
        });
    },
    changeDate() {
      this.condition.start_time = this.dataTime[0].getTime();
      this.condition.end_time = this.dataTime[1].getTime();
    },
    querySearch(queryString, cb) {
      const restaurants = this.restaurants;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    querySearchUserName(queryString, cb) {
      const restaurants = this.restaurantsUserName;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAllUserName() {
      this.$axios.get(`${this.api}/user/getInspectorList`).then(res => {
        if (res.data.retCode == 10000) {
          this.restaurantsUserName = res.data.data.map(item => ({
            id: item.value,
            value: item.label
          }));
        }
      });
    },
    loadAll() {
      this.$axios.get(`${this.api}/flights/getAllSelectList`).then(res => {
        this.restaurants = res.data.data.map(item => ({
          id: item.value,
          value: item.label
        }));
      });
    },
    handleSelect(item) {
      this.ruleForm.user_id = item.id;
    },
    handleSelectFlight(item) {
      this.ruleForm.flights_id = item.id;
      this.$axios.get(`${this.api}/flights/get?id=${item.id}`).then(res => {
        if (res.data.retCode == 10000) {
          const { data } = res.data;
          if (this.formStatus == "edit") {
            alert(1);
            this.ruleForm.task_time = formart(data.flights_time, "hh:mm");
            this.ruleForm.task_date = [new Date(data.flights_time)];
          } else if (this.formStatus == "add") {
            this.ruleForm.addTaskTime = new Date(data.flights_time).getTime();
            this.ruleForm.patrol_route_name = data.patrol_route_name;
            this.ruleForm.task_time = formart(
              new Date(data.flights_time),
              "hh:mm"
            );
          }
          this.ruleForm.patrol_route_id = data.patrol_route_id;
        }
      });
    },
    edit(row) {
      this.formStatus = "edit";
      this.$axios.get(`${this.api}/flightstask/get?id=${row.id}`).then(res => {
        const { data } = res.data;
        this.ruleForm = data;
        this.ruleForm.task_date = [new Date(data.task_time)];
        this.ruleForm.task_time = formart(data.task_time, "hh:mm");
      });
      this.dialogFormVisible = true;
      this.dateReadOnly = true;
    },
    disable(row) {
      this.$axios
        .get(
          `${this.api}/flightstask/changeState?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            this.getList();
          }
        });
    },
    allot() {
      this.formStatus = "add";
      this.dialogFormVisible = true;
    },
    getInfo(row) {
      this.$router.push({
        path: "/CheckLine",
        query: {
          id: row.id
        }
      });
    }
  }
};
</script>
<style lang="less">
@import "../../styles/basic";
.allot-tasks--time {
  font-size: 12px;
  color: @backgroundColor;
}
</style>

