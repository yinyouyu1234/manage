<template>
  <div class="guidance-remote--warpper">
    <view-title title="远程指导" icon="icon-zaixianzhidao "/>
    <search>
      <el-row :gutter="10">
        <el-col :span="4">
          发起人：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          专家：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="tableLoading"
        @getInfo="getInfo"
        @changePage="changePage"
      />
    </div>
    <el-dialog width="600px" title="文件列表" :visible.sync="dialogFormVisible">
      <div v-for="(o,i) in fileList" :key="o.url" class="down-item">
        <u @click="fileClick(o.url, o.file_name)">{{i+1}} {{ o.file_name }} 点击下载</u>
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
  name: "GuidanceRemote",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    return {
      loading: false,
      tableLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      condition: {
        pageIndex: 1,
        pageSize: 10,
        user_name: "",
        expert_name: "",
        starttime: "",
        endtime: ""
      },
      fileList: [],
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "编号",
          width: 70
        },
        {
          prop: "user_name",
          label: "发起人"
        },
        {
          prop: "expert_name",
          label: "专家"
        },
        {
          prop: "begin_time",
          label: "时间"
        },
        {
          prop: "equipment_name",
          label: "巡检设备"
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
      this.loading = true;
      this.getList(true);
    },
    changeDate() {
      this.condition.starttime = this.dataTime[0].getTime();
      this.condition.endtime = this.dataTime[1].getTime();
    },
    getList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/guide/getList`, this.condition)
        .then(res => {
          this.loading = false;
          this.tableLoading = false;
          const data = res.data.data.items;
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
    getInfo(row) {
      this.dialogFormVisible = true;
      this.$axios
        .get(`${this.api}/guide/getFileList?id=${row.id}`)
        .then(res => {
          console.log(res);
          const { data } = res.data;
          this.fileList = data;
        });
    },
    bigImg() {
      this.innerVisible = true;
    },
    fileClick(content, filename) {
      var eleLink = document.createElement("a");
      eleLink.download = filename;
      eleLink.style.display = "none";
      // 字符内容转变成blob地址
      var blob = new Blob([content]);
      eleLink.href = URL.createObjectURL(blob);
      // 触发点击
      document.body.appendChild(eleLink);
      eleLink.click();
      // 然后移除
      document.body.removeChild(eleLink);
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

