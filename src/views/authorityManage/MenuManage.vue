<template>
  <div class="guidance-remote--warpper">
    <view-title title="菜单管理"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="6">
          选择应用程序：
          <el-select
            size="mini"
            @change="handleChange"
            v-model="condition.application_code"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="addUser" type="primary" size="mini">添加菜单</el-button>
        </el-col>
      </el-row>
    </search>
    <div style="padding:20px">
      <pc-table
        :tableData="tableData"
        :columnData="columnData"
        :total="total"
        :loading="tableLoading"
        @edit="edit"
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog
      :close-on-click-modal="false"
      width="600px"
      title="添加菜单"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择程序" prop="id">
          <el-select
            size="mini"
            @change="changeCode"
            v-model="ruleForm.application_code"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级菜单" prop="id">
          <el-select size="mini" v-model="ruleForm.parent_id" placeholder="请选择">
            <el-option
              v-for="item in parentOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input size="mini" placeholder="请输入菜单名称" v-model="ruleForm.menu_name"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input
            size="mini"
            v-if="condition.application_code == 'YUHUAN_WEB'"
            placeholder="请输入图标名称"
            v-model="ruleForm.icon"
          ></el-input>
          <el-upload
            v-if="dialogFormVisible && condition.application_code == 'YUHUAN_APP'"
            :action="url"
            list-type="picture-card"
            :limit="1"
            :headers="head"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input size="mini" placeholder="请输入url" v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item style="width:300px" label="排序" prop="sort">
          <el-input type="number" size="mini" placeholder="输入序号" v-model="ruleForm.sort"></el-input>
        </el-form-item>
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
export default {
  name: "UserManage",
  components: {
    ViewTitle,
    Search,
    PcTable
  },
  data() {
    const token = this.token;
    return {
      fileList: [],
      imgList: "",
      head: { token },
      url: `${this.upload}/upload/uploadimg`,
      total: 0,
      tableLoading: false,
      dialogFormVisible: false,
      condition: {
        pageIndex: "1",
        pageSize: "10",
        application_code: ""
      },
      ruleForm: {
        id: "",
        menu_name: "",
        url: "",
        sort: "",
        application_code: "",
        parent_id: "",
        icon: ""
      },
      rules: {
        application_code: [
          { required: true, message: "请选择程序", trigger: "blur" }
        ],
        menu_name: [
          { required: true, message: "请输入菜单名称", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入url", trigger: "blur" }],
        parent_id: [{ required: true, message: "请输入url", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      tableData: [],
      columnData: [
        {
          prop: "index",
          label: "序号",
          width: "70"
        },
        {
          prop: "application_name",
          label: "应用程序"
        },
        {
          prop: "menu_name",
          label: "菜单"
        },
        {
          prop: "url",
          label: "URL"
        },
        {
          prop: "sort",
          label: "排序"
        },
        {
          prop: "status",
          label: "状态"
        }
      ],
      options: [],
      parentOptions: []
    };
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          id: "",
          menu_name: "",
          url: "",
          sort: "",
          application_code: "",
          parent_id: "",
          icon: ""
        };
        this.imgList = "";
        this.fileList = [];
      } else {
        this.getByApplication();
      }
    }
  },
  created() {
    this.getApp();
  },
  mounted() {},
  methods: {
    handleRemove(file, fileList) {
      this.imgList = "";
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleAvatarSuccess(res, file) {
      this.imgList = res.data;
    },
    beforeAvatarUpload(file) {
      const imageFlag = isImage(file);
      if (!imageFlag) {
        this.$message.error("只能上传图片");
      }
      return imageFlag;
    },
    handleExceed(files, fileList) {
      this.$message({
        message: "只可以上传一张照片",
        type: "warning"
      });
    },
    changeCode() {
      this.getByApplication();
    },
    getByApplication() {
      this.$axios
        .get(
          `${this.api}/menu/getByApplication?application_code=${
            this.ruleForm.application_code
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            this.parentOptions = data.map(item => {
              return {
                label: item.menu_name,
                value: item.id
              };
            });
          }
        });
    },
    changePage(page) {
      this.condition.pageIndex = page;
      this.getMenuList();
    },
    getApp() {
      this.$axios
        .get(`${this.api}/application/getAll`)
        .then(res => {
          if (res.data.retCode == 10000) {
            let { data } = res.data;
            data = data.map(item => {
              return {
                ...item,
                value: item.application_code,
                label: item.application_name
              };
            });
            this.condition.application_code = data[0].value;
            this.ruleForm.application_code = data[0].value;
            this.options = data;
            this.getMenuList();
          }
        })
        .catch(err => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.condition.application_code == "YUHUAN_APP") {
            this.ruleForm.icon = this.imgList;
          }
          this.$axios
            .post(`${this.api}/menu/put`, this.ruleForm)
            .then(res => {
              this.dialogFormVisible = false;
              this.dialogFormVisible = false;
              if (res.data.retCode == 10000) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.getMenuList();
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleChange() {
      this.ruleForm.application_code = this.condition.application_code;
      this.getMenuList();
    },
    getMenuList() {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/menu/getList`, this.condition)
        .then(res => {
          this.tableLoading = false;
          if (res.data.retCode == 10000) {
            this.total = res.data.data.total;
            const data = res.data.data.items;
            data.map((item, index) => {
              item.index = index + 1 + (this.condition.pageIndex - 1) * 10;
              item.statusCode = item.status;
              item.status = item.status == 1 ? "启用" : "禁用";
              if (item.statusCode == 1) {
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
            this.tableData = data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/menu/get?id=${row.id}`).then(res => {
        if (res.data.retCode == 10000) {
          const { data } = res.data;
          if (data.icon) {
            this.fileList = [
              {
                url: data.icon
              }
            ];
          }
          this.imgList = data.icon;
          Object.assign(this.ruleForm, data);
          this.getByApplication();
        }
      });
    },
    enable(row) {
      this.$axios
        .get(
          `${this.api}/menu/changeSate?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            this.getMenuList();
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        });
    },
    disable(row) {
      this.$axios
        .get(
          `${this.api}/menu/changeSate?id=${row.id}&user_id=${
            this.$store.state.app.user_id
          }`
        )
        .then(res => {
          if (res.data.retCode == 10000) {
            this.getMenuList();
            this.$message({
              message: "操作成功",
              type: "success"
            });
          }
        });
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

