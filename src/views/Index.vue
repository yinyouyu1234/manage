<template>
  <div class="index-charts--warpper">
    <div class="top">
      <div class="top-left">
        <div id="histogram" :style="{width: '100%', height: '400px', marginTop: '10px'}"></div>
        <div>
          <div class="title">7天内巡检设备个数</div>
        </div>
      </div>
      <div class="top-right">
        <div id="diagram" :style="{width: '100%', height: '400px', marginTop: '10px'}"></div>
        <div class="title">6KV开关 温度走势</div>
      </div>
    </div>
    <div class="bottom">
      <div class="bottom-left">
        <div id="piechart" :style="{width: '100%', height: '400px', marginTop: '10px'}"></div>
      </div>
      <div class="bottom-right">
        <div id="histogramEquipment" :style="{width: '100%', height: '400px', marginTop: '10px'}"></div>
      </div>
      <div class="title">消缺率</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Index",
  data() {
    return {};
  },
  created() {
    this.$axios.get(`${this.api}/index/dataStatistics`).then(res => {
      if (res.data.retCode == 10000) {
        const { data } = res.data;
        const { equipmentCheckNum, temperature, exceptionHandleRate } = data;
        this.histogram(equipmentCheckNum);
        this.diagram(temperature);
        this.piechartInit(exceptionHandleRate.rate);
        this.histogramEquipmentInit(exceptionHandleRate.equipment_type);
      }
    });
  },
  mounted() {},
  methods: {
    histogram(equipmentCheckNum) {
      let histogram = this.$echarts.init(document.getElementById("histogram"));
      const dateList = equipmentCheckNum.map(item => item.date);
      const dataList = equipmentCheckNum.map(item => item.num);
      histogram.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: dateList,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "巡检设备个数",
            type: "bar",
            barWidth: "60%",
            data: dataList
          }
        ]
      });
    },
    histogramEquipmentInit(equipment_type) {
      let histogramEquipment = this.$echarts.init(
        document.getElementById("histogramEquipment")
      );
      const nameList = equipment_type.map(item => item.name);
      const dataList = equipment_type.map(item => item.value);
      histogramEquipment.setOption({
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} %"
        },
        xAxis: [
          {
            type: "category",
            data: nameList,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "百分比%"
          }
        ],
        series: [
          {
            name: "消缺率",
            type: "bar",
            barWidth: "60%",
            label: {
              normal: {
                show: true,
                position: "top"
              }
            },
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            data: dataList
          }
        ]
      });
    },
    diagram(temperature) {
      let diagram = this.$echarts.init(document.getElementById("diagram"));
      let time = new Date().getTime(),
        timeList = [];
      for (let i = 1; i <= 120; i++) {
        timeList.push(
          `${new Date(time - 1000 * 60 * i).getHours()}:${new Date(
            time - 1000 * 60 * i
          ).getMinutes()}`
        );
      }
      timeList = timeList.reverse();
      timeList.unshift("product");
      console.log(timeList);
      const temperatureList = [];
      temperatureList.push(timeList);
      temperature.map(item => {
        let arr = item.dataVal.split(",");
        arr = arr.reverse();
        arr.unshift(`${item.equipmentName}-${item.kks}`);
        temperatureList.push(arr);
      });
      diagram.setOption({
        tooltip: {
          trigger: "axis"
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        dataZoom: [
          {
            type: "slider",
            show: true,
            xAxisIndex: [0],
            start: 1,
            end: 100
          },
          {
            type: "inside",
            xAxisIndex: [0],
            start: 1,
            end: 35
          }
        ],
        xAxis: {
          type: "category",
          axisPointer: {
            label: {
              formatter: function(params) {
                // console.log(params);
                return params.value;
              }
            }
          }
        },
        yAxis: {
          type: "value",
          name: "温度℃"
        },
        series: [
          {
            type: "line",
            smooth: true,
            seriesLayoutBy: "row"
          },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" }
        ],
        dataset: {
          // 提供一份数据。
          source: temperatureList
        }
      });
    },
    piechartInit(rate) {
      let piechart = this.$echarts.init(document.getElementById("piechart"));
      piechart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["已经消缺", "未消缺"]
        },
        series: [
          {
            name: "缺陷消缺",
            type: "pie",
            radius: ["50%", "90%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              { value: rate[1], name: "已经消缺" },
              { value: rate[0], name: "未消缺" }
            ]
          }
        ]
      });
    }
  }
};
</script>
<style lang="less">
.index-charts--warpper {
  .title {
    font-weight: bold;
    font-size: 20px;
    text-align: center;
  }
  .subheading {
    margin-top: 10px;
    text-align: center;
  }
  .top {
    overflow: hidden;
    .top-left {
      float: left;
      width: 50%;
    }
    .top-right {
      float: left;
      width: 50%;
    }
  }
  .bottom {
    margin-top: 40px;
    overflow: hidden;
    .bottom-left {
      float: left;
      width: 50%;
    }
    .bottom-right {
      float: left;
      width: 50%;
    }
  }
}
</style>
