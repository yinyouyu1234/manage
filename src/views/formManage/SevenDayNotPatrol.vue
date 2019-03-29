<template>
  <div class="guidance-remote--warpper">
    <view-title title="7天内未巡检设备" icon="icon-shebei"/>
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
        @changePage="changePage"
        @getInfo="getInfo"
      />
    </div>
    <el-dialog title="文件列表" :visible.sync="dialogFormVisible">
      <div v-for="o in 4" :key="o" class="down-item" @click="fileClick">
        <u>{{'列表内容 ' + o }} 点击下载</u>
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
          prop: "address",
          label: "最后一次巡检时间"
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
          });
          this.tableData = data;
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

