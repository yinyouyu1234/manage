<template>
  <div>
    <el-upload
      :action="url"
      :headers="head"
      :limit="limit"
      list-type="picture-card"
      :file-list="myList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-success="handleAvatarSuccess"
      :on-exceed="handleExceed"
      :before-upload="beforeAvatarUpload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "UpLoad",
  props: {
    fileList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number
    }
  },
  data() {
    const token = this.token;

    return {
      url: `${this.upload}/upload/uploadimg`,
      head: { token },
      dialogImageUrl: "",
      dialogVisible: false,
      // fileList: [
      //   {
      //     name: 1,
      //     url:
      //       "http://yuhuantest.yunweiyan.com/file/d964b3d8-4560-4b9a-86d4-67b64698ac08.png"
      //   }
      // ],
      myList: [],
      list: []
    };
  },
  watch: {
    fileList() {
      this.myList = this.fileList;
      this.list = this.myList;
    }
  },
  created() {
    this.myList = this.fileList;
    this.list = this.myList;
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.list.push({
        name: file.name,
        url: res.data
      });
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {},
    handleExceed(files, fileList) {
      this.$message.warning(`限制上传 ${this.limit} 张图片`);
    }
  }
};
</script>
