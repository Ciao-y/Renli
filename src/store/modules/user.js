import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 状态
const state = {
  token: getToken(), // 设置token为共享状态 初始化vuex的时候  就先从缓存中读取
  userInfo: {}
}
// 修改状态
const mutations = {
  setToken(state, token) {
    state.token = token
    // 同步给缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null // 删除uvex的token
    removeToken() // 在清除vuex和缓存数据的同步
  },
  setUserInfo(state, result) {
    // 更新一个对象
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用接口
    const result = await login(data) // 拿到token
    context.commit('setToken', result) // 设置token
    // 拿到token 说明登录成功
    setTimeStamp() // 设置当前的时间戳
  },
  async getUserInfo(context) {
    const result = await getUserInfo()
    // 获取用户详情 用户的详情数据
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo }) // 提交到mutations

    return result // 这里return 是给我们后期做权限留下的
  },
  // 登出操作
  logout(context) {
    // 删除token
    context.commit('removeToken')
    // 删除用户资料
    context.commit('removeUserInfo')
    // 重置路由
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
