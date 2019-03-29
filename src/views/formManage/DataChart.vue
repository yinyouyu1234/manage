<template>
  <div class="guidance-remote--warpper">
    <view-title title="数据走势图" icon="icon-weibiaoti--"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="4">
          KKS：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="5">
          设备名称：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" :loading="loading" @click="filter">查询</el-button>
          <el-button size="mini" type="primary">导出</el-button>
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
    <el-dialog title width="750px" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12">
          时间：
          <el-date-picker
            v-model="dataTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>

        <el-col :span="7">
          <el-button size="mini">查询</el-button>
          <el-button size="mini" type="primary">导出</el-button>
        </el-col>
      </el-row>
      <div id="myChart" :style="{width: '100%', height: '300px', marginTop: '10px'}"></div>
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
  name: "DataChart",
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
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      condition: {
        kks: "",
        name: "",
        startTime: "",
        endTime: "",
        state: ""
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          width: 70,
          label: "编号"
        },
        {
          prop: "kks",
          label: "KKS"
        },
        {
          prop: "equipment_type_name",
          label: "设备类型"
        },
        {
          prop: "equipment_name",
          label: "设备名称"
        },
        {
          prop: "city",
          label: "最新数据"
        },
        {
          prop: "address",
          label: "最新采集时间"
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
      if (this.dialogFormVisible) {
        setTimeout(() => {
          this.chartInit();
        }, 300);
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
    filter() {
      this.getList();
    },
    getList() {
      this.loading = true;
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/patrolRecord/getList`, this.condition)
        .then(res => {
          const data = res.data.data.items;
          this.tableLoading = false;
          this.loading = false;
          this.total = res.data.data.total;
          data.forEach((item, index) => {
            item.index = index + 1;
            item.buttonInfo = [
              {
                name: "getInfo",
                type: "primary",
                label: "曲线图"
              }
            ];
          });
          this.tableData = data;
        });
    },
    chartInit() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      function randomData() {
        now = new Date(+now + oneDay);
        value = value + Math.random() * 21 - 1;
        return {
          name: now.toString(),
          value: [
            [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
            Math.round(value)
          ]
        };
      }

      var data = [];
      var now = +new Date(2018, 9, 3);
      var oneDay = 24 * 3600 * 1000;
      var value = Math.random() * 1000;
      for (var i = 0; i < 1000; i++) {
        data.push(randomData());
      }
      console.log(data);
      myChart.setOption({
        title: {
          text: "实时数据"
        },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getDate() +
              "/" +
              (date.getMonth() + 1) +
              "/" +
              date.getFullYear() +
              " : " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: "模拟数据",
            type: "line",
            showSymbol: false,
            hoverAnimation: false,
            data: data
          }
        ]
      });
    },
    getInfo(row) {
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

