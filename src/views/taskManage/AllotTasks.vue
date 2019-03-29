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
        @changePage="changePage"
      />
    </div>
    <el-dialog width="500px" title="分配任务" :visible.sync="dialogFormVisible">
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
            :trigger-on-focus="false"
            @select="handleSelect"
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
            :fetch-suggestions="querySearch"
            placeholder="请输入巡检人员"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="日期" prop="time">
          <el-date-picker
            size="mini"
            type="dates"
            v-model="ruleForm.task_time"
            placeholder="选择一个或多个日期"
            format="yyyy-MM-dd "
            value-format="yyyy-MM-dd"
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
        user_name: ""
      },
      rules: {
        flights_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        time: [{ required: true, message: "请选择日期", trigger: "blur" }]
      },
      dialogMapVisible: false,
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
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
          prop: "flights_type",
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
          label: "开始时间"
        },
        {
          prop: "end_time",
          label: "结束时间"
        },
        {
          prop: "status",
          label: "状态"
        },
        {
          prop: "exception",
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
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();

        Object.keys(this.ruleForm).forEach(key => {
          this.ruleForm[key] = "";
        });
      }
    }
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    changePage() {
      this.condition.pageIndex = page;
      this.getList();
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
    filter() {
      this.loading = true;
      this.getList(true);
    },
    // mapInit() {
    //   // 百度地图API功能
    //   var map = new BMap.Map("container");
    //   map.centerAndZoom(new BMap.Point(118.454, 32.955), 7);
    //   map.enableScrollWheelZoom();
    //   var beijingPosition = new BMap.Point(116.432045, 39.910683),
    //     hangzhouPosition = new BMap.Point(120.129721, 30.314429),
    //     taiwanPosition = new BMap.Point(121.491121, 25.127053);
    //   var points = [beijingPosition, hangzhouPosition, taiwanPosition];

    //   var curve = new BMapLib.CurveLine(points, {
    //     strokeColor: "#0277bd",
    //     strokeWeihght: 3,
    //     strokeOpacity: 0
    //   });
    //   map.addOverlay(curve);
    //   curve.enableEditing();
    // },
    getList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/flightstask/getList`, this.condition)
        .then(res => {
          this.tableLoading = false;
          this.loading = false;
          this.total = res.data.data.total;
          filter &&
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          console.log(res);
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
      cb();
    },
    handleSelect(item) {
      console.log(item);
    },
    allot() {
      this.dialogFormVisible = true;
    },
    getInfo(row) {
      this.$router.push("/CheckLine");
    },
    bigImg() {
      this.innerVisible = true;
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

