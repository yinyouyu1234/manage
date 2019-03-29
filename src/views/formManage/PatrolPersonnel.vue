<template>
  <div>
    <view-title title="巡检人员报表" icon="icon-renyuan"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          KKS：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          设备名称：
          <el-input size="mini" v-model="condition.equipment_name" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :sm="7" :md="7" :lg="5">
          时间：
          <el-date-picker
            v-model="dataTime"
            size="mini"
            type="daterange"
            @change="changeData"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :sm="5" :md="5" :lg="5">
          状态：
          <el-select size="mini" v-model="condition.state" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :sm="6" :md="6" :lg="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
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
  </div>
</template>
<script>
// import "video.js/dist/video-js.css";
// import videojs from "video.js";
// import "videojs-contrib-hls";
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
import ImageList from "@/components/ImageList.vue";
import VideoDialog from "@/components/VideoDialog.vue";
export default {
  name: "PatrolPersonnel",
  components: {
    ViewTitle,
    Search,
    PcTable,
    ImageList,
    VideoDialog
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
        pageIndex: 1,
        pageSize: 10,
        kks: "",
        equipment_name: "",
        start_time: "",
        end_time: "",
        state: ""
      },
      form: [
        {
          label: "KKS",
          prop: "number",
          value: "",
          password: false
        },
        {
          label: "设备类型",
          prop: "name",
          value: "",
          password: false
        },
        {
          label: "设备名称",
          prop: "password",
          value: "",
          password: true
        },
        {
          label: "巡检部位",
          prop: "phoneNumber",
          value: "",
          password: false
        },
        {
          label: "巡检项",
          prop: "department",
          value: "",
          password: false
        },
        {
          label: "标准",
          prop: "post",
          value: "",
          password: false
        },
        {
          label: "状态",
          prop: "post",
          value: "",
          password: false
        },
        {
          label: "巡检值",
          prop: "post",
          value: "",
          password: false
        },
        {
          label: "描述",
          prop: "post",
          value: "",
          password: false
        }
      ],
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
          prop: "user_name",
          label: "巡检人员"
        },
        {
          prop: "address",
          label: "巡检类型"
        },
        {
          prop: "start_time",
          label: "时间"
        }
      ],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (this.dialogFormVisible) {
        setTimeout(() => {
          this.mapInit();
        }, 1000);
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
    changeData(time) {
      this.condition.start_time = item[0];
      this.condition.end_time = item[1];
    },
    mapInit() {
      var marker;
      var map = new BMap.Map("map_canvas");
      map.enableScrollWheelZoom();
      map.centerAndZoom();
      var lushu;
      var arrPois = [
        new BMap.Point(116.403984, 39.914004),
        new BMap.Point(116.363374, 39.919813),
        new BMap.Point(116.363364, 39.920293),
        new BMap.Point(116.363364, 39.920393),
        new BMap.Point(116.363273, 39.922131),
        new BMap.Point(116.363263, 39.922441),
        new BMap.Point(116.363192, 39.92405),
        new BMap.Point(116.363183, 39.92422),
        new BMap.Point(116.363183, 39.9243),
        new BMap.Point(116.363173, 39.92446),
        new BMap.Point(116.363122, 39.925599),
        new BMap.Point(116.307963, 40.064834),
        new BMap.Point(116.30756, 40.064791),
        new BMap.Point(116.302966, 40.06374),
        new BMap.Point(116.302856, 40.063682),
        new BMap.Point(116.302854, 40.063681),
        new BMap.Point(116.306974, 40.057169)
      ];
      map.setViewport(arrPois);
      marker = new BMap.Marker(arrPois[0], {
        icon: new BMap.Icon(
          "http://developer.baidu.com/map/jsdemo/img/car.png",
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        )
      });
      var label = new BMap.Label("", { offset: new BMap.Size(0, -30) });
      label.setStyle({
        border: "1px solid rgb(204, 204, 204)",
        color: "rgb(0, 0, 0)",
        borderRadius: "10px",
        padding: "5px",
        background: "rgb(255, 255, 255)"
      });
      marker.setLabel(label);

      map.addOverlay(marker);
      BMapLib.LuShu.prototype._move = function(initPos, targetPos, effect) {
        var pointsArr = [initPos, targetPos]; //点数组
        var me = this,
          //当前的帧数
          currentCount = 0,
          //步长，米/秒
          timer = 10,
          step = this._opts.speed / (1000 / timer),
          //初始坐标
          init_pos = this._projection.lngLatToPoint(initPos),
          //获取结束点的(x,y)坐标
          target_pos = this._projection.lngLatToPoint(targetPos),
          //总的步长
          count = Math.round(me._getDistance(init_pos, target_pos) / step);
        //显示折线 syj201607191107
        this._map.addOverlay(
          new BMap.Polyline(pointsArr, {
            strokeColor: "#111",
            strokeWeight: 5,
            strokeOpacity: 0.5
          })
        ); // 画线
        //如果小于1直接移动到下一点
        if (count < 1) {
          me._moveNext(++me.i);
          return;
        }
        me._intervalFlag = setInterval(function() {
          //两点之间当前帧数大于总帧数的时候，则说明已经完成移动
          if (currentCount >= count) {
            clearInterval(me._intervalFlag);
            //移动的点已经超过总的长度
            if (me.i > me._path.length) {
              return;
            }
            //运行下一个点
            me._moveNext(++me.i);
          } else {
            currentCount++;
            var x = effect(init_pos.x, target_pos.x, currentCount, count),
              y = effect(init_pos.y, target_pos.y, currentCount, count),
              pos = me._projection.pointToLngLat(new BMap.Pixel(x, y));
            //设置marker
            if (currentCount == 1) {
              var proPos = null;
              if (me.i - 1 >= 0) {
                proPos = me._path[me.i - 1];
              }
              if (me._opts.enableRotation == true) {
                me.setRotation(proPos, initPos, targetPos);
              }
              if (me._opts.autoView) {
                if (!me._map.getBounds().containsPoint(pos)) {
                  me._map.setCenter(pos);
                }
              }
            }
            //正在移动
            me._marker.setPosition(pos);
            //设置自定义overlay的位置
            me._setInfoWin(pos);
          }
        }, timer);
      };
      lushu = new BMapLib.LuShu(map, arrPois, {
        // defaultContent: "粤A30780", //"从天安门到百度大厦"
        autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
        icon: new BMap.Icon(
          "http://developer.baidu.com/map/jsdemo/img/car.png",
          new BMap.Size(52, 26),
          { anchor: new BMap.Size(27, 13) }
        ),
        speed: 500,
        enableRotation: true, //是否设置marker随着道路的走向进行旋转
        landmarkPois: [
          // { lng: 116.306954, lat: 40.05718, html: "加油站", pauseTime: 2 }
        ]
      });

      marker.addEventListener("click", function() {
        marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
        marker.hide();
        lushu.start();
        //map.clearOverlays();  //清除所有覆盖物
      });
      marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
      marker.hide();
      lushu.start();
      //绑定事件
      // $("run").onclick = function() {
      //   marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
      //   marker.hide();
      //   lushu.start();
      //   // map.clearOverlays();    //清除所有覆盖物
      // };
      // $("stop").onclick = function() {
      //   lushu.stop();
      // };
      // $("pause").onclick = function() {
      //   lushu.pause();
      // };
      // $("hide").onclick = function() {
      //   lushu.hideInfoWindow();
      // };
      // $("show").onclick = function() {
      //   lushu.showInfoWindow();
      // };
      // function $(element) {
      //   return document.getElementById(element);
      // }
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
          this.total = res.data.data.total;
          this.tableLoading = false;
          this.loading = false;
          data.forEach((item, index) => {
            item.index = index + 1;
            item.buttonInfo = [
              {
                name: "getInfo",
                type: "primary",
                label: "查看"
              }
            ];
          });
          this.tableData = data;
        });
    },
    getInfo(row) {
      this.$router.push("/CheckLine");
    }
  }
};
</script>

