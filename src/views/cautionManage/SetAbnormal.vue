<template>
  <div>
    <view-title title="异常查询" icon="icon-yichang"/>
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
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeData"
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
          <el-button size="mini" :loading="loading" @click="filter">查询</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :total="total"
        :loading="tableLoading"
        @getInfo="getInfo"
        @changePage="changePage"
      />
    </div>
    <el-dialog title="详情" width="600px" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm">
        <el-form-item
          v-for="(item) in form"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label+':'"
          :label-width="formLabelWidth"
        >
          {{item.value}}
          <!-- <el-input size="mini" readonly v-model="item.value" autocomplete="off"></el-input> -->
        </el-form-item>
        <el-dialog width="50%" title :visible.sync="innerVisible" append-to-body>
          <video-dialog/>
        </el-dialog>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
      <image-list :list="imgList" @handleClick="bigImg"/>
    </el-dialog>
  </div>
</template>
<script>
import ViewTitle from "@/components/ViewTitle.vue";
import Search from "@/components/Search.vue";
import PcTable from "@/components/Table.vue";
import ImageList from "@/components/ImageList.vue";
import VideoDialog from "@/components/VideoDialog.vue";
export default {
  name: "SetAbnormal",
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
      imgList: [],
      form: [
        {
          label: "KKS",
          prop: "kks",
          value: ""
        },
        {
          label: "设备类型",
          prop: "equipment_type_name",
          value: ""
        },
        {
          label: "设备名称",
          prop: "equipment_name",
          value: ""
        },
        {
          label: "巡检部位",
          prop: "equipment_part_name",
          value: ""
        },
        {
          label: "巡检项",
          prop: "equipment_part_item_name",
          value: ""
        },
        {
          label: "标准",
          prop: "stand",
          value: ""
        },
        {
          label: "状态",
          prop: "status",
          value: ""
        },
        {
          label: "巡检值",
          prop: "value",
          value: ""
        },
        {
          label: "描述",
          prop: "description",
          value: ""
        }
      ],
      tableData: [],
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
          prop: "equipment_type_name",
          label: "设备类型"
        },
        {
          prop: "equipment_name",
          label: "设备名称"
        },
        {
          prop: "equipment_part_name",
          label: "巡检部位"
        },
        {
          prop: "equipment_part_item_name",
          label: "巡检项"
        },
        {
          prop: "user_name",
          label: "巡检人员"
        },
        {
          prop: "start_time",
          label: "巡检时间"
        },
        {
          prop: "handle_state",
          label: "消缺状态"
        },
        {
          prop: "stand",
          label: "标准"
        },
        {
          prop: "value",
          label: "结果"
        }
      ],
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "1",
          label: "未消缺"
        },
        {
          value: "0",
          label: "已消缺"
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
    changeData() {
      this.condition.start_time = this.dataTime[0].getTime();
      this.condition.end_time = this.dataTime[1].getTime();
      console.log(this.condition);
    },
    getList(filter = false) {
      this.$axios
        .post(`${this.api}/patrolRecord/getList`, this.condition)
        .then(res => {
          this.loading = false;
          const data = res.data.data.items;
          this.total = res.data.data.total;
          data.forEach((item, index) => {
            item.index = index + 1;
            item.handle_state = item.handle_state ? "已消缺" : "未消缺";
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
              message: "查询成功",
              type: "success"
            });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    filter() {
      this.loading = true;
      this.getList(true);
    },
    getInfo(row) {
      this.dialogFormVisible = true;
      this.$axios
        .get(`${this.api}/patrolRecord/getExceptionDetail?id=${row.id}`)
        .then(res => {
          const { data } = res.data;
          this.form.forEach(item => {
            item.value = data[item.prop];
          });
          this.imgList = data.img;
        });
    },
    bigImg() {
      this.innerVisible = true;
    }
  }
};
</script>

