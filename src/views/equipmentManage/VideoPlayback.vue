<template>
  <div class="guidance-remote--warpper">
    <view-title title="录像回放" icon="icon-video"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          任务编号：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          线路：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :span="4">
          设备类型：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :span="4">
          巡检人：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
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
          ></el-date-picker>
        </el-col>

        <el-col :lg="2" :sm="2" :md="2">
          <el-button size="mini" :loading="loading" @click="filter">查询</el-button>
          <!-- <el-button @click="addUser" type="primary" size="mini">添加</el-button> -->
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
    <el-dialog title="录像回放详情" width="920px" :visible.sync="dialogFormVisible">
      <div class="dialog-videolist--warpper">
        <div class="dialog-videolist--item" v-for="item in 10">
          <video-list @imageClick="imageClick"/>
        </div>
      </div>
      <el-dialog width="50%" title="详情" :visible.sync="innerVisible" append-to-body>
        <video-dialog/>
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
          prop: "date",
          label: "员工号"
        },
        {
          prop: "name",
          label: "姓名"
        },
        {
          prop: "province",
          label: "手机"
        },
        {
          prop: "city",
          label: "状态"
        },
        {
          prop: "address",
          label: "部门"
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
      setTimeout(() => {
        this.loading = false;
        this.tableLoading = false;
      }, 500);
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    getInfo(row) {
      this.dialogFormVisible = true;
    },
    imageClick() {
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
  .dialog-videolist--warpper {
    overflow: hidden;
    .dialog-videolist--item {
      padding: 6px;
      float: left;
    }
  }
}
</style>

