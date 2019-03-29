<template>
  <div>
    <div style="padding:20px;font-size:18px;">
      设备添加编辑
      <div style="float:right">
        <el-button size="mini" @click="back">返回</el-button>
        <el-button size="mini" type="primary" @click="submit('ruleForm')">确 定</el-button>
      </div>
    </div>
    <div style="width:600px">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item prop="name" label="设备名称" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.equipment_type_name"></el-input>
        </el-form-item>
        <el-form-item prop="factoryName" label="厂家" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.manufacturer"></el-input>
        </el-form-item>
        <el-form-item prop="code" label="编码" :label-width="formLabelWidth">
          <el-input size="mini" v-model="ruleForm.equipment_type_code"></el-input>
        </el-form-item>
        <el-form-item label="类型图片" :label-width="formLabelWidth">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt>
          </el-dialog>
        </el-form-item>
        <el-form-item prop="remark" label="备注" :label-width="formLabelWidth">
          <el-input type="textarea" size="small" v-model="ruleForm.remark"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="dialog-title">巡检项目</div>
      <div class="left-table">
        <div class="item-title">
          巡检部位
          <i class="el-icon-circle-plus-outline" @click="addPosition(1)"></i>
        </div>
        <pc-table
          :pagination="false"
          :columnData="positionColumnData"
          :tableData="positionTableData"
          :button-info-icon="positionButtonInfo"
          @edit="editPosition"
          @delete="deletePosition"
          @rowClick="rowClick"
        />
      </div>
      <div class="right-table">
        <div class="item-title">
          断路器的巡检项目
          <i
            class="el-icon-circle-plus-outline"
            v-if="hasCheckedTable"
            @click="addPosition(2)"
          ></i>
        </div>
        <pc-table
          :pagination="false"
          :tableData="activeTableData"
          :columnData="DLQColumnData"
          :button-info-icon="positionButtonInfo"
          @edit="editItem"
          @delete="deleteItem"
        />
      </div>
      <div class="empty"></div>
    </div>
    <el-dialog
      width="600px"
      :title="innerVisibleState == 1 ? '巡检部位' : '断路器巡检项目'"
      :visible.sync="innerVisible"
    >
      <el-form
        v-if="innerVisibleState == 1"
        :model="ruleFormPosition"
        ref="ruleFormPosition"
        label-width="150px"
        class="demo-ruleForm"
      >
        <el-form-item label="巡检部位" prop="name">
          <el-input size="mini" placeholder="请输入部位名称" v-model="ruleFormPosition.name"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-if="innerVisibleState == 2"
        :model="ruleFormItem"
        ref="ruleFormItem"
        label-width="150px"
      >
        <el-form-item label="巡检项目" prop="name">
          <el-input
            size="mini"
            placeholder="请输入手机号"
            v-model="ruleFormItem.equipment_part_item_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="判断方式" prop="name">
          <el-select
            size="mini"
            v-model="ruleFormItem.way"
            @change="handleChange"
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
        <div v-if="ruleFormItem.way == 'direct'">
          <el-form-item label="巡检标准" prop="name">
            <el-input size="mini" placeholder="请输入巡检标准" v-model="ruleFormItem.direct.check_value"></el-input>
          </el-form-item>
          <el-form-item label="巡检方法" prop="name">
            <el-checkbox-group size="mini" v-model="ruleFormItem.direct.check_type">
              <el-checkbox label="目测" name="type"></el-checkbox>
              <el-checkbox label="耳听" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div v-if="ruleFormItem.way == 'range'">
          <el-form-item :inline="true" label="最大值" prop="name" style="width:320px">
            <el-input size="mini" placeholder="请输入最大值" v-model="ruleFormItem.range.max"></el-input>
          </el-form-item>
          <el-form-item label="最小值" prop="name" style="width:320px">
            <el-input size="mini" placeholder="请输入最小值" v-model="ruleFormItem.range.min"></el-input>
          </el-form-item>
          <el-form-item label="巡检方法" prop="name">
            <el-checkbox-group size="mini" v-model="ruleFormItem.range.check_type">
              <el-checkbox label="目测" name="type"></el-checkbox>
              <el-checkbox label="耳听" name="type"></el-checkbox>
              <el-checkbox label="数字识别" name="type"></el-checkbox>
              <el-checkbox label="调取数据" name="type"></el-checkbox>
              <el-checkbox label="识别验收" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitDialog">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import PcTable from "@/components/Table.vue";
export default {
  name: "EditEquipmentType",
  components: {
    PcTable
  },
  data() {
    return {
      innerVisible: false,
      innerVisibleState: "",
      formLabelWidth: "120px",
      dialogImageUrl: "",
      dialogVisible: false,
      positionTableData: [],
      itemTableData: {},
      activeTableData: [],
      hasCheckedTable: false,
      tableKey: "",
      rules: {
        name: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        factoryName: [
          { required: true, message: "请输入厂家名称", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        code: [
          { required: true, message: "请输入编码", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        remark: [
          { required: true, message: "请输入备注", trigger: "blur" }
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      rulePositon: {
        name: [
          { required: true, message: "请输入巡检部位名称", trigger: "blur" }
        ]
      },
      ruleItem: {
        name: [
          { required: true, message: "请输入巡检部位名称", trigger: "blur" }
        ]
      },
      options: [
        {
          value: "direct",
          label: "直接判断"
        },
        {
          value: "range",
          label: "范围判断"
        }
      ],
      ruleForm: {
        equipment_type_name: "",
        manufacturer: "",
        equipment_type_code: "",
        img: [],
        remark: ""
      },
      ruleFormItem: {
        equipment_part_item_name: "",
        way: "direct",
        direct: {
          check_value: [],
          check_type: ""
        },
        range: {
          max: "",
          min: "",
          check_type: []
        }
      },
      ruleFormPosition: {
        name: ""
      },
      positionColumnData: [
        {
          prop: "index",
          label: "编号",
          width: "60"
        },
        {
          prop: "name",
          label: "部位名称"
        }
      ],
      positionButtonInfo: [
        {
          name: "edit",
          icon: "el-icon-edit",
          label: "编辑"
        },
        {
          name: "delete",
          icon: "el-icon-delete",
          label: "删除"
        }
      ],
      DLQColumnData: [
        {
          prop: "index",
          width: "60",
          label: "编号"
        },
        {
          prop: "equipment_part_item_name",
          // width: "90",
          label: "项目名称"
        },
        {
          prop: "check_value",
          label: "标准"
        },
        {
          prop: "check_type",
          // width: "90",
          label: "检测方法"
        },
        {
          prop: "way",
          // width: "120",
          label: "检测判断类型"
        }
      ],
      type: ""
    };
  },
  watch: {
    innerVisible() {
      if (!this.innerVisible) {
        this.ruleFormItem = {
          equipment_part_item_name: "",
          way: "direct",
          direct: {
            check_value: "",
            check_type: []
          },
          range: {
            max: "",
            min: "",
            check_type: []
          }
        };
        this.ruleFormPosition = {
          name: ""
        };
      }
    }
  },
  created() {
    this.type = this.$route.query.type;
    this.type === "edit" && this.getData();
  },
  methods: {
    getData() {
      this.$axios
        .get(`${this.api}/equipmentType/get?id=1`)
        .then(res => {
          console.log(Object.keys(this.ruleForm));
          const { data } = res.data;
          Object.keys(this.ruleForm).forEach(key => {
            this.ruleForm[key] = data[key];
            console.log(data[key]);
          });
        })
        .catch(err => {});
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
          // this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitDialog() {
      if (this.innerVisibleState == 1) {
        console.log("部位");
        let index = this.positionTableData.length;
        const obj = {
          ...this.ruleFormPosition,
          index
        };
        this.positionTableData.push(obj);
        this.innerVisible = false;
      } else {
        const o = this.ruleFormItem[this.ruleFormItem.way];
        const { equipment_part_item_name, way } = this.ruleFormItem;
        const obj = {
          ...o,
          equipment_part_item_name,
          way: way === "range" ? "范围判断" : "直接判断",
          wayCode: way,
          index: this.activeTableData.length
        };
        console.log(obj);
        if (this.itemTableData[this.tableKey] == undefined) {
          this.itemTableData[this.tableKey] = [];
        }
        this.itemTableData[this.tableKey].push(obj);
        this.activeTableData = this.itemTableData[this.tableKey];
        this.innerVisible = false;
      }
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },
    rowClick(row) {
      this.tableKey = row.index;
      this.hasCheckedTable = true;
      if (this.itemTableData[this.tableKey] instanceof Array) {
        this.activeTableData = this.itemTableData[this.tableKey];
      } else {
        this.activeTableData = [];
      }
    },
    handleChange(val) {
      console.log(val);
    },
    editPosition(row) {
      this.innerVisible = true;
      this.innerVisibleState = 1;
      this.ruleFormPosition.name = row.name;
    },
    deletePosition(row) {
      this.$confirm("确认删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.positionTableData.splice(row.index, 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {});
    },
    deleteItem(row) {
      this.$confirm("确认删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.activeTableData.splice(row.index, 1);
          this.this.itemTableData[this.tableKey].splice(row.index, 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {});
    },
    editItem() {
      this.innerVisible = true;
      this.innerVisibleState = 2;
    },
    back() {
      this.$confirm("确定取消吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.go(-1);
        })
        .catch(() => {});
    },
    addPosition(state) {
      this.innerVisible = true;
      this.innerVisibleState = state;
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
    }
  }
};
</script>
<style lang="less">
.dialog-title {
  font-size: 18px;
  font-weight: bold;
  padding: 20px;
}
.item-title {
  font-size: 15px;
  padding: 10px 0;
  .el-icon-circle-plus-outline {
    font-size: 15px;
    color: #409eff;
    cursor: pointer;
  }
}
.left-table {
  float: left;
  width: 30%;
  padding-right: 30px;
  padding-left: 30px;
  padding-bottom: 30px;
  border-right: 1px solid #dcdfe6;
}
.right-table {
  float: left;
  width: 60%;
  padding-left: 30px;
}
.empty {
  clear: both;
}
</style>
