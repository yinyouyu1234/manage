<template>
  <div>
    <view-title title="缺陷管理" icon="icon-weiquexianquexianyuan"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          KKS：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          设备名称：
          <el-input size="mini" v-model="condition.phoneNumber" clearable placeholder="请输入内容"></el-input>
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
            @change="changeTime"
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
        :loading="tableLoading"
        :total="total"
        @getInfo="getInfo"
        @changePage="changePage"
      />
    </div>
    <el-dialog width="600px" title="详情" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm">
        <el-form-item
          v-for="(item) in form"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
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
      <div class="discribe-box">
        <div class="left-title">消缺描述</div>
        <div class="right-content">
          <el-input
            :readonly="!status"
            v-model="formRule.description"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </div>
      </div>
      <div class="discribe-box">
        <div class="left-title">
          <span v-if="status">上传图片</span>
          <span v-else>缺陷图片</span>
          <br>
          <span v-if="status" style="font-size:12px;color:#999">最多上传5张</span>
        </div>
        <div class="right-content">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            v-if="status"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <image-list v-else :list="imgList" @handleClick="bigImg"/>

          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </div>
      </div>
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
  name: "DefectManage",
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
      dialogImageUrl: "",
      status: true,
      imageUrl: "",
      loading: false,
      tableLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      imgList: [],
      condition: {
        pageIndex: 1,
        pageSize: 10,
        kks: "",
        equipment_name: "",
        start_time: "",
        end_time: ""
      },
      form: [
        {
          label: "KKS:",
          prop: "kks",
          value: ""
        },
        {
          label: "设备类型:",
          prop: "equipment_type_name",
          value: ""
        },
        {
          label: "设备名称:",
          prop: "equipment_name",
          value: ""
        },
        {
          label: "巡检部位:",
          prop: "equipment_part_name",
          value: ""
        },
        {
          label: "巡检项:",
          prop: "equipment_part_item_name",
          value: ""
        },
        {
          label: "标准:",
          prop: "stand",
          value: ""
        },
        {
          label: "状态:",
          prop: "status",
          value: ""
        },
        {
          label: "巡检值:",
          prop: "value",
          value: ""
        },
        {
          label: "描述:",
          prop: "description",
          value: ""
        }
      ],
      formRule: {
        description: "",
        img: []
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
          prop: "equipment_part_name",
          label: "巡检部位"
        },
        {
          prop: "equipment_part_item_name",
          label: "巡检项"
        },
        {
          prop: "user_name",
          width: "100",
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
          label: "启用"
        },
        {
          value: "0",
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
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    changePage() {
      this.condition.pageIndex = page;
      this.getList();
    },
    changeTime(t) {
      this.condition.start_time = t[0].getTime();
      this.condition.end_time = t[1].getTime();
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
          console.log(res);
          this.tableLoading = false;
          this.loading = false;
          this.total = res.data.data.total;
          const data = res.data.data.items;
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
        });
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
    },
    beforeAvatarUpload(file) {
      const type = ["image/jpeg", "image/png"];
      const isImage = type.indexOf(file.type) != -1;
      if (!isImage) {
        this.$message.error("只能上传图片");
      }
      return isImage;
    },
    getInfo(row) {
      this.dialogFormVisible = true;
      this.$axios
        .get(`${this.api}/patrolRecord/getExceptionDetail?id=${row.id}`)
        .then(res => {
          console.log(res);
          const { data } = res.data;
          this.form.forEach(item => {
            item.value = data[item.prop];
          });
          this.imgList = data.img;
          console.log(data.img);
        });
      this.$axios
        .get(`${this.api}/patrolRecordExceptionHandle/get?id=${row.id}`)
        .then(res => {
          console.log(res);
        });
    },
    bigImg() {
      this.innerVisible = true;
    }
  }
};
</script>
<style lang="less">
.discribe-box {
  padding: 15px;
  .left-title {
    float: left;
    width: 80px;
    text-align: right;
  }
  .right-content {
    margin-left: 100px;
  }
}
</style>

