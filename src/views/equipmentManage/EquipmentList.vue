<template>
  <div class="guidance-remote--warpper">
    <view-title title="设备管理"/>
    <search>
      <el-row :gutter="10">
        <el-col :span="5">
          KKS：
          <el-input size="mini" v-model="condition.kks" clearable placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="5">
          设备名称：
          <el-input size="mini" v-model="condition.equipment_name" clearable placeholder="请输入内容"></el-input>
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
        @disable="disable"
        @enable="enable"
        @changePage="changePage"
      />
    </div>
    <el-dialog title="基本信息" width="600px" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="equipment_type_id" label="设备类型" :label-width="formLabelWidth">
          <el-select size="mini" v-model="ruleForm.equipment_type_id" placeholder="请选择">
            <el-option
              v-for="item in type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父KKS" prop="parent_kks" :label-width="formLabelWidth">
          <el-autocomplete
            class="inline-input"
            size="mini"
            v-model="ruleForm.parent_kks"
            :fetch-suggestions="querySearch"
            placeholder="请输入KKS码"
            :trigger-on-focus="false"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item prop="kks" label="KKS" :label-width="formLabelWidth">
          <el-input
            size="mini"
            placeholder="请输入KKS码后，会进行校验唯一性"
            v-model="ruleForm.kks"
            @change="changekks"
          ></el-input>
        </el-form-item>
        <el-form-item prop="equipment_name" label="名称" :label-width="formLabelWidth">
          <el-input size="mini" placeholder="请输入名称，默认同步KKS码" v-model="ruleForm.equipment_name"></el-input>
        </el-form-item>
        <el-form-item prop="patrol_point_id" label="巡检点" :label-width="formLabelWidth">
          <el-input size="mini" placeholder="请输入巡检码" v-model="ruleForm.patrol_point_id"></el-input>
        </el-form-item>
        <el-form-item prop="longitude" label="经度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.longitude" placeholder="请输入经度"></el-input>
        </el-form-item>
        <el-form-item prop="latitude" label="纬度" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.latitude" placeholder="请输入纬度"></el-input>
        </el-form-item>
        <el-form-item prop="status" label="状态" :label-width="formLabelWidth">
          <el-select size="mini" v-model="ruleForm.status" placeholder="请选择">
            <el-option
              v-for="item in optionsStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="name" label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" placeholder="请输入备注" size="mini" v-model="ruleForm.remark"></el-input>
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
export default {
  name: "EquipmentList",
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
      state2: "",
      restaurants: [],
      tableData: [],
      imageUrl: "",
      dialogFormVisible: false,
      innerVisible: false,
      formLabelWidth: "120px",
      dataTime: "",
      optionsStatus: [
        {
          label: "启用",
          value: 1
        },
        {
          label: "停用",
          value: 0
        }
      ],
      rules: {
        equipment_type_id: [
          { required: true, message: "请输入选择设备类型", trigger: "blur" }
        ],
        parent_kks: [
          { required: true, message: "请输入父KKS码", trigger: "blur" }
        ],
        kks: [{ required: true, message: "请输入KKS码", trigger: "blur" }],
        equipment_name: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        patrol_point_id: [
          { required: true, message: "请输入巡检点", trigger: "blur" }
        ],
        longitude: [
          { required: true, message: "请输入经度", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        latitude: [{ required: true, message: "请输入纬度", trigger: "blur" }],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }]
      },
      condition: {
        pageIndex: 1,
        pageSize: 10,
        kks: "",
        equipment_name: "",
        status: ""
      },
      ruleForm: {
        id: 0,
        equipment_type_id: "",
        parent_kks: "",
        kks: "",
        equipment_name: "",
        patrol_point_id: "",
        longitude: "",
        latitude: "",
        status: "",
        remark: ""
      },
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
          prop: "equipment_name",
          label: "名称"
        },
        {
          prop: "equipment_type_name",
          label: "设备类型"
        },
        {
          prop: "gps",
          label: "GPS"
        },
        {
          prop: "status",
          label: "状态"
        },
        {
          prop: "remark",
          label: "备注"
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
      ],
      type: []
    };
  },
  created() {
    this.getEquimentList();
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$refs.ruleForm.resetFields();
        this.ruleForm = {
          parent_kks: "",
          number: "",
          name: "",
          password: "",
          phoneNumber: "",
          department: "",
          post: "",
          textareaText: "",
          category: "",
          equipment_name: ""
        };
      } else {
        // this.getLineAll();
        this.equipmentType();
      }
    }
  },
  mounted() {},
  methods: {
    changekks() {
      this.$axios
        .get(
          `${this.api}/manage/equipment/checkKKS?id=${this.ruleForm.id}&kks=${
            this.ruleForm.kks
          }`
        )
        .then(res => {});
    },
    equipmentType() {
      this.$axios.get(`${this.api}/equipmentType/getAll`).then(res => {
        const { data } = res.data;
        this.type = data;
      });
    },
    changePage() {
      this.condition.pageIndex = page;
      this.getEquimentList();
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post(`${this.api}/equipment/put`, this.ruleForm)
            .then(res => {
              console.log(res);
              this.dialogFormVisible = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    filter() {
      this.loading = true;
      this.getEquimentList(true);
    },
    getEquimentList(filter = false) {
      this.tableLoading = true;
      this.$axios
        .post(`${this.api}/equipment/getList`, this.condition)
        .then(res => {
          const data = res.data.data.items;
          this.total = res.data.data.total;
          this.loading = false;
          this.tableLoading = false;
          data.forEach((item, index) => {
            item.index = index + 1;
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
          filter &&
            this.$message({
              message: "搜索成功",
              type: "success"
            });
          console.log(res);
        })
        .catch(err => {
          this.loading = false;
          this.tableLoading = false;
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
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    querySearch(queryString, cb) {
      this.$axios
        .get(`${this.api}/equipment/getByKKSForPatrolPoint?kks=${queryString}`)
        .then(res => {
          const { data } = res.data;
          data.value = data.equipment_name;
          cb([data]);
        })
        .catch(err => {});
    },
    handleSelect(item) {
      console.log(item);
      this.ruleForm.equipment_name = item.value;
    },
    addClick() {
      this.dialogFormVisible = true;
    },
    edit(row) {
      this.dialogFormVisible = true;
      this.$axios.get(`${this.api}/equipment/get?id=${row.id}`).then(res => {
        console.log(res);
        const { data } = res.data;
        Object.assign(this.ruleForm, data);
      });
    },
    enable(row) {
      this.$axios
        .get(`${this.api}/equipmentType/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          row.buttonInfo.splice(1, 1, {
            label: "禁用",
            name: "disable",
            type: "danger"
          });
          console.log(res);
        });
    },
    disable(row) {
      this.$axios
        .get(`${this.api}/equipmentType/changeState?id=${row.id}&user_id=1`)
        .then(res => {
          row.buttonInfo.splice(1, 1, {
            label: "启用",
            name: "enable",
            type: "primary"
          });
          this.$message({
            message: "操作成功",
            type: "success"
          });
          console.log(res);
        });
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

