<template>
  <div>
    <view-title title="专家列表" icon="icon-zhuanjia"/>
    <search>
      <el-row>
        <el-col class="search-item" :sm="8" :md="8" :lg="4">
          姓名：
          <el-input size="mini" v-model="condition.expert_name" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col class="search-item" :sm="14" :md="14" :lg="4">
          手机号：
          <el-input size="mini" v-model="condition.phone_number" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="4">
          员工号：
          <el-input size="mini" v-model="condition.user_code" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="5">
          状态：
          <el-select size="mini" v-model="condition.status" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button size="mini" @click="fiter" :loading="loading">查询</el-button>
          <el-button type="primary" size="mini" @click="add">添加</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :columnData="columnData"
        :tableData="tableData"
        :total="total"
        @changePage="changePage"
        @edit="edit"
        @disable="disable"
        @enable="enable"
      />
    </div>
    <el-dialog title="添加专家" width="800px" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item
          v-for="(item, index) in form"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :label-width="formLabelWidth"
        >
          <el-input size="mini" clearable v-model="ruleForm[item.prop]" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="expert_type" label="类别" :label-width="formLabelWidth">
          <el-select size="mini" v-model="ruleForm.expert_type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传头像" :label-width="formLabelWidth">
          <el-upload
            v-if="dialogFormVisible"
            :action="url"
            list-type="picture-card"
            :limit="1"
            :headers="head"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
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
import E from "wangeditor";
import qs from "qs";
export default {
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  name: "ExpertList",
  data() {
    const token = this.token;
    return {
      fileList: [],
      head: { token },
      url: `${this.upload}/upload/uploadimg`,
      formArticle: "",
      loading: false,
      editorHasInit: false,
      imageUrl: "",
      dialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: "",
      formLabelWidth: "120px",
      tableData: [],
      total: 0,
      rules: {
        user_code: [
          { required: true, message: "请输入员工号", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        expert_name: [
          { required: true, message: "请输入用户名", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        phone_number: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        dept_name: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        post_name: [
          { required: true, message: "请输入岗位名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        expert_type: [
          { required: true, message: "请选择类别", trigger: "blur" }
        ]
      },
      condition: {
        expert_name: "",
        phone_number: "",
        user_code: "",
        status: "",
        pageIndex: "1",
        pageSize: "10"
      },
      ruleForm: {
        user_code: "",
        expert_name: "",
        password: "",
        phone_number: "",
        dept_name: "",
        post_name: "",
        info: "",
        expert_type: "",
        icon: "",
        password_change: false,
        oldPassword: "",
        user_id: "1"
      },
      form: [
        {
          label: "员工号",
          prop: "user_code"
        },
        {
          label: "用户名",
          prop: "expert_name"
        },
        {
          label: "密码",
          prop: "password"
        },
        {
          label: "手机号",
          prop: "phone_number"
        },
        {
          label: "部门",
          prop: "dept_name"
        },
        {
          label: "岗位",
          prop: "post_name"
        }
      ],
      options: [],
      columnData: [
        {
          label: "编号",
          prop: "index",
          width: "60"
        },
        {
          prop: "user_code",
          label: "员工号"
        },
        {
          prop: "expert_name",
          label: "姓名"
        },
        {
          prop: "phone_number",
          label: "手机"
        },
        {
          prop: "dept_name",
          label: "部门"
        },
        {
          prop: "post_name",
          label: "岗位"
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
          user_code: "",
          expert_name: "",
          password: "",
          phone_number: "",
          dept_name: "",
          post_name: "",
          info: "",
          category: "",
          icon: ""
        };
      } else {
        this.getSelectList();
      }
    }
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    getSelectList() {
      this.$axios
        .get(`${this.api}/expert/getExpertTypeSelectList`)
        .then(res => {
          console.log(res);
          const { data } = res.data;
          this.options = data;
        });
    },
    changePage() {
      this.condition.pageIndex = page;
      this.getData();
    },
    getData(filter = false) {
      console.log(this.condition);
      this.$axios
        .post(`${this.api}/expert/getList`, this.condition)
        .then(res => {
          console.log(res);
          const { data } = res.data;
          data.items.forEach((item, index) => {
            item.index = index + 1;
            if (item.status == 1) {
              item.buttonInfo = [
                {
                  name: "edit",
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: "disable",
                  type: "danger",
                  label: "禁用"
                }
              ];
            } else {
              item.buttonInfo = [
                {
                  name: "edit",
                  type: "primary",
                  label: "编辑"
                },
                {
                  name: "enable",
                  type: "primary",
                  label: "启用"
                }
              ];
            }
          });
          this.tableData = data.items;
          this.total = this.tableData.length;
          this.loading = false;
          filter &&
            this.$message({
              message: "搜索成功",
              type: "success"
            });
        })
        .catch(err => {});
    },
    fiter() {
      this.loading = true;
      this.getData(true);
      console.log(this.condition);
    },
    changePage(page) {
      this.condition.pageIndex = page;
    },
    editorInit() {
      var editor = new E("#editor");
      editor.customConfig.onchange = html => {
        this.formArticle = html;
        this.ruleForm.info = html;
        console.log(html);
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
          console.log(insertImg, result, editor);
          var url = result.data;
          insertImg(url);
        }
      };
      editor.create();
      editor.txt.html("<p>用 JS 设置的内容</p>");
    },
    add() {
      this.dialogFormVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      this.ruleForm.icon = res.data;
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "只可以上传一张照片",
        type: "warning"
      });
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
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/expert/put`, this.ruleForm)
            .then(res => {
              this.dialogFormVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    edit(row) {
      this.$axios
        .get(`${this.api}/expert/get?id=1`)
        .then(res => {
          console.log(res);
          this.dialogFormVisible = true;
          const { data } = res.data;
          Object.assign(this.ruleForm, data);
        })
        .catch(err => {});
    },
    enable(row) {
      this.loading = true;
      this.$axios
        .get(`${this.api}/expert/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          this.loading = false;
          row.buttonInfo.splice(1, 1, {
            label: "禁用",
            name: "disable",
            type: "danger"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {});
    },
    disable(row) {
      this.loading = true;
      this.$axios
        .get(`${this.api}/expert/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          this.loading = false;
          row.buttonInfo.splice(1, 1, {
            label: "启用",
            name: "enable",
            type: "primary"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less">
</style>

