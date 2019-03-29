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
    <el-dialog title="基本信息" width="750px" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="title" label="新闻标题" :label-width="formLabelWidth">
          <el-input size="small" v-model="ruleForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新闻主图" :label-width="formLabelWidth">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
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
import E from "wangeditor";
export default {
  name: "NewsList",
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
      dialogVisible: false,
      dialogImageUrl: "",

      imageUrl: "",
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      editorHasInit: false,
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
      if (this.dialogFormVisible && !this.editorHasInit) {
        this.editorHasInit = true;
        setTimeout(() => {
          this.editorInit();
        }, 300);
      }
      if (!this.dialogFormVisible) {
        this.ruleForm = {
          title: "",
          content: "",
          id: "",
          img: []
        };
      } else {
        setTimeout(() => {
          this.editorInit();
        }, 300);
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
          this.$axios.post(`${this.api}/news/put`, this.ruleForm).then(res => {
            this.dialogFormVisible = false;
            this.getNewsList();
            this.$message({
              type: "success",
              message: "添加成功!"
            });
          });
        } else {
          console.log("error submit!!");
          return false;
        }
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
          const data = res.data.data.items;
          this.total = res.data.data.total;
          data.forEach((item, index) => {
            item.index = index + 1;
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
          this.loading = false;
          this.tableLoading = false;
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
    dataChange() {
      this.condition.start_time = this.dataTime[0].getTime();
      this.condition.end_time = this.dataTime[1].getTime();
      console.log(this.condition);
    },
    editorInit() {
      var editor = new E("#editor");
      editor.customConfig.onchange = html => {
        this.formArticle = html;
        console.log(html);
      };
      editor.customConfig.uploadImgServer = "<%=path%>/Img/upload"; //上传URL
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
      editor.customConfig.uploadImgMaxLength = 5;
      editor.customConfig.uploadFileName = "myFileName";
      editor.customConfig.uploadImgHooks = {
        customInsert: function(insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          var url = result.data;
          insertImg(url);

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      };
      editor.create();
      editor.txt.html(this.ruleForm.content);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      // const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      // if (!isLt2M) {
      //   this.$message.error("上传头像图片大小不能超过 2MB!");
      // }
      // return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    addClick() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/news/get?id=${row.id}`).then(res => {
        console.log(res);
        const { data } = res.data;
        this.ruleForm = data;
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
            .get(`${this.api}/news/changeState?id=${row.id}&user_id=1`)
            .then(res => {
              console.log(res);
              this.getNewsList();
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            });
        })
        .catch(() => {});
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
</style>

