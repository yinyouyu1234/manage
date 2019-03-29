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
    <pc-table
      :pagination="false"
      :columnData="columnData"
      :button-info="buttonInfo"
      @getInfo="getInfo"
      @changePage="changePage"
    />
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
      buttonInfo: [
        {
          name: "getInfo",
          label: "查看"
        }
      ],
      columnData: [
        {
          prop: "date",
          label: "编号"
        },
        {
          prop: "name",
          label: "KKS"
        },
        {
          prop: "province",
          label: "设备类型"
        },
        {
          prop: "city",
          label: "设备名称"
        },
        {
          prop: "address",
          label: "巡检人员"
        },
        {
          prop: "address",
          label: "巡检类型"
        },
        {
          prop: "address",
          label: "时间"
        }
      ]
    };
  },
  mounted() {
    this.mapInit();
  },
  methods: {
    //     changePage() {
    //   this.condition.pageIndex = page;
    //   this.getData();
    // },
    back() {
      this.$router.go(-1);
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
    }
  }
};
</script>
