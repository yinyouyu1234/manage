<template>
  <div style="padding:0 20px">
    <div style="padding:20px 0;font-size:18px;">
      巡检轨迹
      <div style="float:right">
        <el-button size="mini" @click="back">返回</el-button>
      </div>
    </div>

    <div style="width:100%;height:400px" id="map_canvas"></div>
    <div style="padding:20px 0;font-size:18px;">巡检值</div>
    <pc-table :pagination="false" :columnData="columnData" :table-data="tableData"/>
  </div>
</template>
<script>
import PcTable from "@/components/Table.vue";
export default {
  name: "CheckLine",
  components: {
    PcTable
  },
  data() {
    return {
      tableData: [],
      condition: {},
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: 70
        },
        {
          prop: "kks",
          label: "KKS"
        },
        {
          prop: "equipment_name",
          label: "设备名称"
        },
        {
          prop: "equipment_part_name",
          label: "部位"
        },
        {
          prop: "equipment_part_item_name",
          label: "项目"
        },
        {
          prop: "stand",
          label: "标准"
        },
        {
          prop: "test_method",
          label: "检测方法"
        },
        {
          prop: "judge_method",
          label: "判断方法"
        },
        {
          prop: "start_time",
          label: "开始时间"
        },
        {
          prop: "value",
          label: "巡检"
        },
        {
          prop: "status",
          label: "状态"
        }
      ],
      pointList: []
    };
  },
  created() {
    this.getAllByFlightsTask();
    this.getAllPointByFlightsTask();
  },
  mounted() {
    // this.mapInit();
  },
  methods: {
    changePage(page) {
      // this.
    },
    getAllPointByFlightsTask() {
      this.$axios
        .get(
          `${this.api}/patrolRecord/getAllPointByFlightsTask?id=${
            this.$route.query.id
          }`
        )
        .then(res => {
          if (res.data.retCode === 10000) {
            this.pointList = res.data.data.map(item => ({
              latitude: item.latitude,
              longitude: item.longitude
            }));

            this.mapInit(this.pointList);
          }
        });
    },
    getAllByFlightsTask() {
      this.$axios
        .get(
          `${this.api}/patrolRecord/getAllByFlightsTask?id=${
            this.$route.query.id
          }`
        )
        .then(res => {
          console.log(res.data.retMsg);
          if (res.data.retCode === 10000) {
            this.tableData = res.data.data;
            this.tableData.forEach((item, index) => {
              item.index = index + 1;
              item.status = item.status == 1 ? "正常" : "异常";
            });
          }
        });
    },
    back() {
      this.$router.go(-1);
    },
    mapInit(pointList) {
      var marker;
      var map = new BMap.Map("map_canvas");
      map.enableScrollWheelZoom();
      map.centerAndZoom();
      var lushu;
      pointList = [
        {
          latitude: 121.608045,
          longitude: 31.141248
        },
        {
          latitude: 121.430269,
          longitude: 31.215744
        }
      ];
      let list = pointList.map(item => {
        return new BMap.Point(item.latitude, item.longitude);
      });
      var convertor = new BMap.Convertor();
      convertor.translate(list, 1, 5, translateCallback);
      function translateCallback(data) {
        var arrPois = data.points;
        map.setViewport(arrPois);
        marker = new BMap.Marker(arrPois[0], {
          icon: new BMap.Icon(
            "http://yuhuantest.yunweiyan.com/file/b86eccd7-3b3b-4bdd-a564-a81d3e136f55.jpg",
            new BMap.Size(30, 30),
            { anchor: new BMap.Size(30, 13) }
          )
        });
        var label = new BMap.Label("", { offset: new BMap.Size(0, -30) });
        label.setStyle({
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
            timer = 1,
            step = this._opts.speed / (500 / timer),
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
          // autoView: true, //是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
          icon: new BMap.Icon(
            "http://yuhuantest.yunweiyan.com/file/101e1026-4e91-4368-a669-c6a0ea2fc254.png",
            new BMap.Size(30, 30),
            { anchor: new BMap.Size(13, 13) }
          ),
          speed: 1500,
          enableRotation: true, //是否设置marker随着道路的走向进行旋转
          landmarkPois: [
            // { lng: 116.306954, lat: 40.05718, html: "加油站", pauseTime: 2 }
          ]
        });
        marker.enableMassClear(); //设置后可以隐藏改点的覆盖物
        marker.hide();
        lushu.start();
      }
    }
  }
};
</script>
<style lang="less">
.BMap_Marker img {
  width: 20px;
  position: relative;
  top: 10px;
  left: 5px;
}
</style>
