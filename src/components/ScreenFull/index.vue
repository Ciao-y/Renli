<template>
  <!-- 放置一个图标 -->
  <div>
    <!-- 放置一个svg的图标 -->
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 25px; height: 25px ; margin-top: 13px; margin-right: -5px;" @click="changeScreen" />

  </div>

</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import screenFull from 'screenfull'
export default {
  // 方法集合
  methods: {
    changeScreen() {
      if (!screenFull.isEnabled) {
        // 此时全屏不可用
        this.$message.warning('此时全屏组件不可用')
        return
      }
      // document.documentElement.requestFullscreen()  原生js调用
      //   如果可用 就可以全屏
      screenFull.toggle()
    }
  }
}

</script>
<style scoped>

</style>
