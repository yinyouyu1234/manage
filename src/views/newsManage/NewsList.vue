<template>
  <div class="guidance-remote--warpper">
    <view-title title="新闻列表" icon="icon-news"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          新闻标题：
          <el-input size="mini" v-model="condition.title" clearable placeholder="请输入新闻标题"></el-input>
        </el-col>
        <el-col :span="5">
          时间：
          <el-date-picker
            v-model="dataTime"
            size="mini"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dataChange"
          ></el-date-picker>
        </el-col>
        <el-col :span="4">
          <el-button size="mini" @click="filter" :loading="loading">查询</el-button>
          <el-button size="mini" type="primary" @click="addClick">添加</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :loading="tableLoading"
        :total="total"
        @edit="edit"
        @delete="deleteItem"
        @changePage="changePage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      title="基本信息"
      width="750px"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="title" label="新闻标题" :label-width="formLabelWidth">
          <el-input size="small" v-model="ruleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新闻主图" :label-width="formLabelWidth">
          <el-upload
            v-if="dialogFormVisible"
            :action="url"
            :headers="head"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <div>
          <div ref="wangeditor" id="editor" class="editor"></div>
        </div>
      </el-form>
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
import { isImage } from "@/utils/isImage.js";
import E from "wangeditor";
export default {
  name: "NewsList",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    const token = this.token;
    return {
      fileList: [],
      imgList: [],
      head: { token },
      url: `${this.upload}/upload/uploadimg`,
      total: 0,
      loading: false,
      tableLoading: false,
      dialogVisible: false,
      dialogImageUrl: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      rules: {
        title: [
          { required: true, message: "请输入新闻标题", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      condition: {
        pageIndex: 1,
        pageSize: 10,
        title: "",
        start_time: "",
        end_time: ""
      },
      ruleForm: {
        title: "",
        content: "",
        id: "",
        img: []
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          width: "70",
          label: "编号"
        },
        {
          prop: "news_title",
          label: "新闻标题"
        },
        {
          prop: "user_name",
          label: "发布人"
        },
        {
          prop: "create_time",
          label: "发布时间"
        }
      ]
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.fileList = [];
        this.imgList = [];
        this.ruleForm = {
          title: "",
          content: "",
          id: "",
          img: []
        };
      }
    }
  },
  created() {
    this.getNewsList();
  },
  mounted() {},
  methods: {
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.ruleForm.img.length === 0) {
            this.$message({
              type: "warning",
              message: "请上传新闻主图!"
            });
            return;
          }
          this.ruleForm.img = this.imgList;
          this.$axios.post(`${this.api}/news/put`, this.ruleForm).then(res => {
            if (res.data.retCode == 10000) {
              this.dialogFormVisible = false;
              this.getNewsList();
              this.$message({
                type: "success",
                message: "添加成功!"
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "只可以上传一张照片",
        type: "warning"
      });
    },
    changePage(page) {
      this.condition.pageIndex = page;
      this.getNewsList();
    },
    filter() {
      this.getNewsList(true);
    },
    getNewsList(filter = false) {
      this.loading = true;
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/news/getList`, this.condition)
        .then(res => {
          this.loading = false;
          this.tableLoading = false;
          if (res.data.retCode == 10000) {
            const data = res.data.data.items;
            this.total = res.data.data.total;
            data.forEach((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.statusCode = item.status;
              item.status = item.status == 1 ? "启用" : "禁用";
              item.buttonInfo = [
                {
                  name: "edit",
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: "delete",
                  type: "danger",
                  label: "删除"
                }
              ];
            });
            this.tableData = data;
            filter &&
              this.$message({
                message: "搜索成功",
                type: "success"
              });
          }
        })
        .catch(err => {
          this.loading = false;
        });
    },
    dataChange() {
      this.condition.start_time = this.dataTime[0].getTime();
      this.condition.end_time = this.dataTime[1].getTime();
    },
    editorInit(info = "") {
      const editor = new E("#editor");
      editor.customConfig.onchange = html => {
        this.formArticle = html;
        this.ruleForm.content = html;
      };
      editor.customConfig.uploadImgServer = this.url; //上传URL
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 5;
      editor.customConfig.uploadFileName = "file";
      editor.customConfig.uploadImgHeaders = {
        token: this.token
      };
      editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          var url = result.data;
          insertImg(url);
        }
      };
      editor.create();
      editor.txt.html(info);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      this.imgList.forEach((item, index) => {
        if (item.name === file.name) {
          this.imgList.splice(index, 1);
        }
      });
    },
    handleAvatarSuccess(res, file) {
      this.imgList.push({
        name: file.name,
        url: res.data
      });
    },
    beforeAvatarUpload(file) {
      const imageFlag = isImage(file);
      if (!imageFlag) {
        this.$message.error("只能上传图片");
      }
      return imageFlag;
    },
    addClick() {
      this.dialogFormVisible = true;
      setTimeout(() => {
        this.editorInit();
      }, 300);
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/news/get?id=${row.id}`).then(res => {
        if (res.data.retCode == 10000) {
          const { data } = res.data;
          this.fileList = [...data.img];
          this.ruleForm = data;
          this.imgList = data.img.map(item => {
            return {
              name: item.name,
              url: item.url
            };
          });
          setTimeout(() => {
            this.editorInit(data.content);
          }, 300);
        }
      });
    },
    deleteItem(row) {
      this.$confirm("确认删除这条数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .get(
              `${this.api}/news/changeState?id=${row.id}&user_id=${
                this.$store.state.app.user_id
              }`
            )
            .then(res => {
              if (res.data.retCode == 10000) {
                this.getNewsList();
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less">
</style>

