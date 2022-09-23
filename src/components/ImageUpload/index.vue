<template>
  <div>
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-change="Change"
      :http-request="Upload"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-preview="Preview"
      :file-list="fileList"
      :class="{disabled : fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 进度条 -->
    <el-progress
      v-if="showPercen"
      style="width: 180px;"
      :percentage="percen"
    />
    <!-- 图片弹层 -->
    <el-dialog title="头像预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import COS from 'cos-js-sdk-v5'

const cos = new COS({
  SecretId: 'AKIDWszpOhkW1FCsHPHtEI6dtrc7LIyNWNxH',
  SecretKey: 'ECuKTLwGJ5brra2D7l9G6gz1lFSO3QXN'
})
export default {
// import 引入的组件需要注入到对象中才能使用
  components: {

  },
  props: {},
  data() {
    // 这里存放数据
    return {
      percen: 0, // 显示条进度的初始值
      showPercen: false, // 控制进度条的显示隐藏
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null // 记录当前正在上传的Uid

    }
  },

  // 计算属性 类似于 data 概念
  computed: {
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    //  console.log(this.fileComputed)
  },

  // 方法集合
  methods: {
    Preview(file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = fileList
    },
    // 添加图片
    Change(file, fileList) {
      this.fileList = fileList.map(item => item)
    },
    //  上传图片
    beforeUpload(file) {
      // 检查文件类型
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        // 停止上传
        return false
      }
      // 检查上传文件大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片最大不能超过5MB')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercen = true
      return true
    }, Upload(params) {
      cos.putObject({
        Bucket: 'huan-1314072175', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-chengdu', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: params.file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        StorageClass: 'STANDARD', // 上传的模式类型
        Body: params.file, // 上传文件对象
        onProgress: (params) => {
          this.percen = params.percent * 100
        }
      }, (err, data) => {
        console.log(err || data)
        if (!err && data.statusCode === 200) {
          this.fileList = this.fileList.map(item => {
            if (item.uid === this.currentFileUid) {
              return { url: 'http://' + data.Location, upload: true }
            }
            return item
          })
          // 重置进度条 隐藏
          this.showPercen = false
          this.percen = 0
        }
      })
    }
  }
}
</script>
<style scoped>
.disabled /deep/.el-upload--picture-card {
  display: none
}

</style>
