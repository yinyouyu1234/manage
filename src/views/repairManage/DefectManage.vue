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
          class="defect-manage"
        >{{item.value}}</el-form-item>
        <el-dialog width="50%" title :visible.sync="innerVisible" append-to-body>
          <video-dialog :url="bigImgUrl"/>
        </el-dialog>
      </el-form>
      <image-list :list="imgShowDetail" @handleClick="bigImg"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit('ruleForm')" v-if="status">确 定</el-button>
      </div>
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
            v-if="dialogFormVisible && status"
            :action="url"
            :headers="head"
            :limit="5"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <image-list v-else :list="imgShow" @handleClick="bigImg"/>
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
import { isImage } from "@/utils/isImage.js";

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
    const token = this.token;
    return {
      imgList: [],
      imgShow: [],
      imgShowDetail: [],
      bigImgUrl: "",
      head: { token },
      url: `${this.upload}/upload/uploadimg`,
      total: 0,
      dialogImageUrl: "",
      status: true,
      loading: false,
      tableLoading: false,
      dialogFormVisible: false,
      innerVisible: false,
      dialogVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
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
        patrol_record_id: "",
        id: "",
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
          prop: "handle_state_name",
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
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.imgShowDetail = [];
        this.formRule = {
          description: "",
          patrol_record_id: "",
          id: "",
          img: []
        };
      }
    }
  },
  mounted() {},
  methods: {
    submit() {
      this.formRule.img = this.imgList.map(item => item.url);
      this.$axios
        .post(`${this.api}/patrolRecordExceptionHandle/put`, this.formRule)
        .then(res => {
          if (res.data.retCode === 10000) {
            this.getList();
            this.dialogFormVisible = false;
          }
        });
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "最多上传5张照片",
        type: "warning"
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload(file) {
      const imageFlag = isImage(file);
      if (!imageFlag) {
        this.$message.error("只能上传图片");
      }
      return imageFlag;
    },
    handleAvatarSuccess(res, file) {
      this.imgList.push({
        url: res.data,
        id: file.uid
      });
    },
    handleRemove(file, fileList) {
      this.imgList = this.imgList.filter((item, index) => {
        if (item.id != file.uid) {
          return item;
        }
      });
    },
    changePage(page) {
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
        .post(`${this.api}/patrolRecord/getExceptionList`, this.condition)
        .then(res => {
          this.tableLoading = false;
          this.loading = false;
          if (res.data.retCode == 10000) {
            this.total = res.data.data.total;
            const data = res.data.data.items;
            data.forEach((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.handle_state_name = item.handle_state ? "已消缺" : "未消缺";
              item.buttonInfo = [
                {
                  name: "getInfo",
                  type: "primary",
                  label: "查看"
                }
              ];
            });
            this.tableData = data;
          }
        });
    },

    getInfo(row) {
      this.dialogFormVisible = true;
      if (row.handle_state) {
        this.status = false;
        // 已消缺
      } else {
        // 未消缺
        this.status = true;
      }
      this.$axios
        .get(`${this.api}/patrolRecordExceptionHandle/get?id=${row.id}`)
        .then(res => {
          const { data } = res.data;
          this.formRule.id = data.id;
          if (!this.status) {
            this.formRule.description = data.description;
            if (data.img) {
              this.imgShow = data.img;
            } else {
              this.imgShow = [];
            }
          }
        });
      this.$axios
        .get(`${this.api}/patrolRecord/getExceptionDetail?id=${row.id}`)
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            this.formRule.patrol_record_id = data.id;
            this.form.forEach(item => {
              item.value = data[item.prop];
            });
            this.imgShowDetail = data.img;
          }
        });
    },
    bigImg(url) {
      this.innerVisible = true;
      this.bigImgUrl = url;
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
.defect-manage.el-form-item {
  margin-bottom: 0px;
}
</style>

