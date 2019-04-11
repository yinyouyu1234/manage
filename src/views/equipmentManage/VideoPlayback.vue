<template>
  <div class="guidance-remote--warpper">
    <view-title title="录像回放" icon="icon-video"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          任务编号：
          <el-input size="mini" v-model="condition.task_code" clearable placeholder="请输入任务编号"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          线路：
          <el-input
            size="mini"
            v-model="condition.patrol_route_name"
            clearable
            placeholder="请输入线路名称"
          ></el-input>
        </el-col>
        <el-col class="search-item" :span="4">
          设备类型：
          <el-input
            size="mini"
            v-model="condition.equipment_type_name"
            clearable
            placeholder="请输入设备类型"
          ></el-input>
        </el-col>
        <el-col class="search-item" :span="4">
          巡检人：
          <el-input size="mini" v-model="condition.user_name" clearable placeholder="请输入巡检人"></el-input>
        </el-col>
        <el-col class="search-item" :span="5">
          日期：
          <el-date-picker
            v-model="dataTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="hangleChange"
          ></el-date-picker>
        </el-col>

        <el-col :lg="2" :sm="2" :md="2">
          <el-button size="mini" :loading="loading" @click="filter">查询</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="loading"
        :total="total"
        @getInfo="getInfo"
        @changePage="changePage"
      />
    </div>
    <el-dialog title="录像回放详情" width="920px" :visible.sync="dialogFormVisible">
      <div class="dialog-videolist--warpper">
        <div v-if="imgList.length > 0">
          <div class="dialog-videolist--item" v-for="(item,index) in imgList" :key="index">
            <video-list :info="item" @imageClick="imageClick" @updata="updata"/>
          </div>
        </div>
        <div v-else>暂无数据</div>
      </div>
      <el-dialog width="50%" title="详情" :visible.sync="innerVisible" append-to-body>
        <video-dialog :url="dialogUrl"/>
      </el-dialog>
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
import VideoList from "@/components/VideoList.vue";
import VideoDialog from "@/components/VideoDialog.vue";
export default {
  name: "VideoPlayback",
  components: {
    ViewTitle,
    Search,
    PcTable,
    VideoList,
    VideoDialog
  },
  data() {
    return {
      loading: false,
      dialogUrl: "",
      total: 0,
      loading: false,
      tableLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dataTime: "",
      condition: {
        pageIndex: 1,
        pageSize: 10,
        task_code: "",
        patrol_route_name: "",
        equipment_type_name: "",
        user_name: "",
        start_time: "",
        end_time: ""
      },
      imgList: [],
      ruleForm: {
        name: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          width: 70,
          label: "编号"
        },
        {
          prop: "task_code",
          label: "任务编号"
        },
        {
          prop: "patrol_route_name",
          label: "线路"
        },
        {
          prop: "flights_type",
          label: "巡检类型"
        },
        {
          prop: "equipment_type_name",
          label: "设备类型"
        },
        {
          prop: "kks",
          label: "KKS"
        },
        {
          prop: "user_name",
          label: "巡检人员"
        },
        {
          prop: "start_time",
          label: "巡检时间"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    updata(item) {
      this.$axios
        .post(`${this.api}/patrolRecord/editRecordImgDescription`, {
          id: item.id,
          description: item.description
        })
        .then(res => {
          if (res.data.retCode == 10000) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
          }
        });
    },
    hangleChange() {
      if (this.dataTime) {
        this.condition.start_time = this.dataTime[0].getTime();
        this.condition.end_time = this.dataTime[1].getTime();
      } else {
        this.condition.start_time = "";
        this.condition.end_time = "";
      }
    },
    getList() {
      this.loading = true;
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/patrolRecord/imgReplyList`, this.condition)
        .then(res => {
          this.loading = false;
          this.tableLoading = false;
          if (res.data.retCode == 10000) {
            this.tableData = res.data.data.items;
            this.total = res.data.data.total;
            this.tableData.forEach((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.buttonInfo = [
                {
                  type: "primary",
                  name: "getInfo",
                  label: "回放"
                }
              ];
            });
          }
        });
    },
    changePage(page) {
      this.condition.pageIndex = page;
      this.getList();
    },
    filter() {
      this.getList();
    },
    getInfo(row) {
      this.dialogFormVisible = true;
      this.$axios
        .get(`${this.api}/patrolRecord/imgReplyDetail?id=${row.id}`)
        .then(res => {
          if (res.data.retCode == 10000) {
            this.imgList = res.data.data;
          }
        });
    },
    imageClick(url) {
      this.dialogUrl = url;
      this.innerVisible = true;
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
  .dialog-videolist--warpper {
    overflow: hidden;
    .dialog-videolist--item {
      padding: 6px;
      float: left;
    }
  }
}
</style>

