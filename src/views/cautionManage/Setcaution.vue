<template>
  <div>
    <view-title title="报警配置" icon="icon-peizhi"/>
    <div style="padding:20px">
      <el-tag>异常报警配置</el-tag>
    </div>
    <div style="padding:20px 80px">
      <el-checkbox v-model="checked">是否启用报警</el-checkbox>
    </div>
    <div v-if="checked">
      <div style="padding:20px 80px">
        <el-checkbox v-model="checkedMessage">是否启用短信报警</el-checkbox>
        <div v-if="checkedMessage" class="textarea-box">
          <el-input
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入手机号，每个以逗号分隔。例如：131xxxxxxx,135xxxxxxx（注意逗号用英文符号）"
            v-model="message"
          ></el-input>
        </div>
      </div>
      <div style="padding:20px 80px">
        <el-checkbox v-model="checkedEmail">是否启用邮件报警</el-checkbox>
        <div class="textarea-box">
          <el-input
            v-if="checkedEmail"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 4}"
            placeholder="请输入邮件地址，每个以逗号分隔。例如：5061xxxxx@qq.com,5s4d5s@163.com（注意逗号用英文符号）"
            v-model="emailMessage"
          ></el-input>
        </div>
      </div>
      <div style="padding:20px 80px">
        <div class="textarea-box" style="text-align:right">
          <el-button type="primary" :disabled="!disabled" @click="submit">保存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ViewTitle from "@/components/ViewTitle.vue";
export default {
  components: {
    ViewTitle
  },
  name: "Setcaution",
  data() {
    return {
      checked: false,
      checkedMessage: false,
      message: "",
      checkedEmail: false,
      emailMessage: ""
    };
  },
  computed: {
    disabled() {
      return this.checked && (this.checkedMessage || this.checkedEmail);
    }
  },
  methods: {
    submit() {
      const messageArray = this.message.split(",");
      const v = messageArray.every(item => /^1[34578]\d{9}$/.test(item));
      if (this.checkedMessage && this.message.trim().length == 0) {
        this.$message({
          message: "请输入手机号码",
          type: "warning"
        });
        return;
      }
      if (!v) {
        this.$message({
          message: "输入手机格式有误",
          type: "warning"
        });
        return;
      }
      const emailMessageArray = this.emailMessage.split(",");

      if (this.checkedEmail && this.emailMessage.trim().length == 0) {
        this.$message({
          message: "请输入邮箱",
          type: "warning"
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success"
      });
    }
  }
};
</script>
<style lang="less">
.textarea-box {
  padding-top: 10px;
  max-width: 500px;
  min-width: 300px;
}
</style>
