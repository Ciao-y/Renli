import store from '@/store'

store
// 混入对象
export default {
  // 混入对象是组件的选项对象
  methods: {
    //   检查权限 key就是要检查的点
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.rooles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没有进入if 说明没有权限
    }
  }
}
