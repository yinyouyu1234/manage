<template>
  <div class="edit-equipment-type">
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
            :action="url"
            :headers="head"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :file-list="fileList"
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
      <div class="table-box">
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
              @click="addPosition(2, 'addItemState')"
            ></i>
          </div>
          <pc-table
            v-if="updata"
            :pagination="false"
            :tableData="activeTableData"
            :columnData="DLQColumnData"
            :button-info-icon="positionButtonInfo"
            @edit="editItem"
            @delete="deleteItem"
          />
        </div>
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
          <el-input
            size="mini"
            placeholder="请输入部位名称"
            v-model="ruleFormPosition.equipment_part_name"
          ></el-input>
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
            placeholder="请输入项目名称"
            v-model="ruleFormItem.equipment_part_item_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="判断方式" prop="name">
          <el-select
            size="mini"
            v-model="ruleFormItem.check_type"
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
        <div v-if="ruleFormItem.check_type == '1'">
          <el-form-item prop="latitude" label="主动巡检">
            <input type="checkbox" @change="changeInitiative" v-model="ruleFormItem.initiative">
            <el-input
              size="mini"
              v-if="ruleFormItem.initiative"
              v-model="ruleFormItem.data_type"
              placeholder="采集数据类型字段"
            ></el-input>
          </el-form-item>
          <el-form-item label="巡检标准" prop="name">
            <el-input size="mini" placeholder="请输入巡检标准" v-model="ruleFormItem.check_value"></el-input>
          </el-form-item>
          <el-form-item label="巡检方法" prop="name">
            <el-checkbox
              v-for="(item, index) in directList"
              :key="index"
              v-model="item.check"
              @change="changeCheck(item)"
            >{{item.name}}</el-checkbox>
          </el-form-item>
        </div>
        <div v-if="ruleFormItem.check_type == '2'">
          <el-form-item prop="latitude" label="主动巡检">
            <input type="checkbox" @change="changeInitiative" v-model="ruleFormItem.initiative">
            <el-input
              size="mini"
              v-if="ruleFormItem.initiative"
              v-model="ruleFormItem.latitude"
              placeholder="采集数据类型字段"
            ></el-input>
          </el-form-item>
          <el-form-item :inline="true" label="最大值" prop="name" style="width:320px">
            <el-input size="mini" type="number" placeholder="请输入最大值" v-model="ruleFormItem.max"></el-input>
          </el-form-item>
          <el-form-item label="最小值" prop="name" style="width:320px">
            <el-input
              size="mini"
              type="number"
              @change="changeMin"
              placeholder="请输入最小值"
              v-model="ruleFormItem.min"
            ></el-input>
          </el-form-item>
          <el-form-item label="巡检方法" prop="name">
            <el-checkbox
              v-for="(item, index) in rangeList"
              :key="index"
              @change="changeCheck(item)"
              v-model="item.check"
            >
              {{item.name}}
              <input
                v-if="(item.check_type == 4)&& item.check"
                class="dialog-item-input"
                v-model="item.param"
                type="text"
              >
              <input
                v-if="(item.check_type == 5)&& item.check"
                readonly
                class="dialog-item-input"
                value="绿色"
                type="text"
              >
            </el-checkbox>
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
import { isImage } from "@/utils/isImage.js";
import PcTable from "@/components/Table.vue";
import {
  rangeList,
  directList,
  positionColumnData,
  ruleFormItem,
  DLQColumnData,
  options,
  ruleFormPosition,
  positionButtonInfo
} from "./editEquipmentTypeStatic.js";
export default {
  name: "EditEquipmentType",
  components: {
    PcTable
  },
  data() {
    const token = this.token;
    return {
      updata: true,
      fileList: [],
      imageList: "",
      url: `${this.upload}/upload/uploadimg`,
      head: { token },
      addItemState: false,
      rangeList,
      directList,
      innerVisible: false,
      innerVisibleState: "",
      formLabelWidth: "120px",
      dialogImageUrl: "",
      dialogVisible: false,
      positionTableData: [],
      activeTableData: [],
      hasCheckedTable: false,
      rules: {
        equipment_type_name: [
          { required: true, message: "请输入设备名称", trigger: "blur" }
        ],
        manufacturer: [
          { required: true, message: "请输入厂家名称", trigger: "blur" }
        ],
        equipment_type_code: [
          { required: true, message: "请输入编码", trigger: "blur" }
        ]
      },
      rulePositon: {
        name: [
          { required: true, message: "请输入巡检部位名称", trigger: "blur" }
        ]
      },
      options,
      ruleForm: {
        equipment_type_name: "",
        manufacturer: "",
        equipment_type_code: "",
        img: [],
        remark: ""
      },
      ruleFormItem,
      ruleFormPosition,
      positionColumnData,
      positionButtonInfo,
      DLQColumnData,
      type: "",
      isEditPositon: false
    };
  },
  watch: {
    innerVisible() {
      if (!this.innerVisible) {
        setTimeout(() => {
          this.ruleFormItem = {
            id: "",
            equipment_part_item_name: "",
            check_type: "",
            check_type_name: "",
            check_value: "",
            max: "",
            min: "",
            remark: "",
            data_type: "",
            initiative: false,
            check_method: [],
            name: ""
          };
          this.ruleFormPosition = {
            equipment_part_name: "",
            index: "",
            equipment_part_item: [],
            id: ""
          };
          this.rangeList.forEach(item => {
            item.check = false;
            item.param = "";
          });
          this.directList.forEach(item => {
            item.check = false;
            item.param = "";
          });
          this.addItemState = false;
        }, 300);
      }
    }
  },
  created() {
    this.type = this.$route.query.type;
    this.type === "edit" && this.getData();
  },
  methods: {
    changeMin() {
      if (this.ruleFormItem.min >= this.ruleFormItem.max) {
        this.ruleFormItem.min = this.ruleFormItem.max;
        this.$message({
          message: "最大值不能小于最小值",
          type: "warning"
        });
      }
    },
    changeInitiative() {
      if (!this.ruleFormItem.initiative) {
        this.ruleFormItem.data_type = "";
      }
    },
    getData() {
      this.$axios
        .get(`${this.api}/equipmentType/get?id=${this.$route.query.id}`)
        .then(res => {
          if (res.data.retCode == 10000) {
            const { data } = res.data;
            if (data.img) {
              this.fileList.push({ url: data.img });
              this.imageList = data.img;
            }
            Object.keys(this.ruleForm).forEach(key => {
              this.ruleForm[key] = data[key];
            });
            let obj = {};
            this.positionTableData = data.equipment_part.map((item, index) => {
              if (item.equipment_part_item) {
                item.equipment_part_item.forEach((ele, index) => {
                  ele.index = index + 1;
                  ele.name = ele.check_type == 1 ? "直接判断" : "范围判断";

                  if (ele.check_type == 2) {
                    ele.check_value = `${ele.min}-${ele.max}`;
                  }
                });
              } else {
                item.equipment_part_item = [];
              }
              item.index = index + 1;
              return item;
            });
          }
        })
        .catch(err => {});
    },
    changeCheck(item) {
      if (item.check) {
        //选中
        this.ruleFormItem.check_method.push(item);
      } else {
        //取消
        const list = this.ruleFormItem.check_method.filter(ele => {
          if (item.check_type != ele.check_type) {
            return ele;
          }
        });
        this.ruleFormItem.check_method = list;
      }
    },
    submit(formName) {
      const _this = this;
      const obj = {
        ..._this.ruleForm,
        img: _this.imageList,
        equipment_part: _this.positionTableData,
        id: _this.$route.query.id
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post(`${this.api}/equipmentType/put`, obj).then(res => {
            if (res.data.retCode == 10000) {
              this.$router.go(-1);
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    submitDialog() {
      const arr = [];
      this.rangeList.forEach(item => {
        arr.push({
          ...item
        });
      });
      if (this.innerVisibleState == 1) {
        if (this.isEditPositon) {
          this.positionTableData.forEach(item => {
            if (item.id == this.ruleFormPosition.id) {
              item.equipment_part_name = this.ruleFormPosition.equipment_part_name;
            }
          });
        } else {
          let index = this.positionTableData.length + 1;
          const obj = {
            ...this.ruleFormPosition,
            index
          };
          this.positionTableData.push(obj);
        }
        this.innerVisible = false;
      } else {
        // 强制更新
        this.updata = false;
        this.$nextTick(() => {
          this.updata = true;
        });
        const copyArray = this.ruleFormItem.check_method.map(item => ({
          ...item
        }));
        const obj = {
          ...this.ruleFormItem,
          check_method: copyArray
        };
        obj.check_method.forEach(item => {
          if (item.check_type == 4) {
            item.param = arr[3].param;
          }
        });
        if (this.addItemState) {
          obj.name = obj.check_type == 1 ? "直接判断" : "范围判断";
          obj.index = this.activeTableData.length + 1;
          obj.check_type_name = obj.check_type == 1 ? "直接判断" : "范围判断";
          if (obj.check_type != 1) {
            obj.check_value = `${obj.min}-${obj.max}`;
          }
          this.activeTableData.push(obj);
        } else {
          obj.name = obj.check_type == 1 ? "直接判断" : "范围判断";
          obj.check_type_name = obj.check_type == 1 ? "直接判断" : "范围判断";
          if (obj.check_type != 1) {
            obj.check_value = `${obj.min}-${obj.max}`;
          }
          this.activeTableData[obj.index - 1] = obj;
        }
        this.innerVisible = false;
      }
      this.$message({
        message: "添加成功",
        type: "success"
      });
    },
    rowClick(row) {
      row.equipment_part_item.forEach(item => {
        item.check_type_name = item.check_type == 1 ? "直接判断" : "范围判断";
      });
      this.activeTableData = row.equipment_part_item;
      this.hasCheckedTable = true;
    },
    handleChange(val) {},
    editPosition(row) {
      this.innerVisible = true;
      this.innerVisibleState = 1;
      this.ruleFormPosition.equipment_part_name = row.equipment_part_name;
      this.ruleFormPosition.id = row.id;
      this.isEditPositon = true;
    },
    deletePosition(row) {
      this.$confirm("确认删除此条信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.positionTableData.splice(row.index - 1, 1);
          this.$message({
            message: "删除成功",
            type: "success"
          });
          this.positionTableData.forEach((item, index) => {
            item.index = index + 1;
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
          this.activeTableData.splice(row.index - 1, 1);
          this.activeTableData.forEach((item, index) => {
            item.index = index + 1;
          });
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(() => {});
    },
    editItem(r) {
      const row = { ...r };
      this.innerVisible = true;
      this.innerVisibleState = 2;
      this.ruleFormItem = row;
      this.directList.forEach(item => {
        row.check_method.forEach(ele => {
          if (item.check_type == ele.check_type) {
            item.check = true;
          }
        });
      });
      this.rangeList.forEach(item => {
        row.check_method.forEach(ele => {
          if (item.check_type == ele.check_type) {
            item.check = true;
            item.param = ele.param;
          }
        });
      });
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
    addPosition(state, addItemState = false) {
      this.innerVisible = true;
      this.innerVisibleState = state;
      this.addItemState = addItemState;
      this.isEditPositon = false;
    },
    handleRemove(file, fileList) {
      this.imageList = "";
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
      this.imageList = res.data;
    }
  }
};
</script>
<style lang="less">
.edit-equipment-type {
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
  .dialog-item-input {
    border-radius: 4px;
    border: 1px solid #c0c4cc;
    color: #606266;
    height: 20px;
    outline: none;
  }
  .table-box {
    min-width: 954px;
  }
}
</style>
