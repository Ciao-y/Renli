import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
const TimeOut = 200 // 定义超时时间
const service = axios.create(
  {
    // 当执行 npm run dev=>.evn.development=>/api=>跨域代理
    baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api npm run build=>/prod-api
    timeout: 3000 // 设置请求超时时间
  }
)
service.interceptors.request.use( // 请求拦截器
  config => {
    // 请求的的配置信息
    if (store.getters.token) {
      if (CheckTimeOut()) {
      // 只有在有token情况下 才有必5 要去检查时间戳是否超时
        // 如果为true 表示表示过期了 删除token
        store.dispatch('user/logout')
        // 跳转到登录页面
        router.push('/login')
        // 弹出超时的页面
        return Promise.reject(new Error('token超时了'))
      }
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须要返回
  }, error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use( // 响应拦截器
  response => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    //  根据success的成功与否决定下面的操作
    if (success) {
      return data
    } else {
      Message.error(message) // 提示错误消息
      return Promise.reject(new Error(message))
    }
  }, error => {
    // error 信息 里面的 response对象
    if (error.response && error.response.data && error.response.data.code === 10002) {
      // 等于10002表示token超时了
      store.dispatch('user/logout') // 登出
      router.push('/login') // 跳转到登录页
    } else {
      Message.error(error.message)
    }
    // 提示错误消息
    return Promise.reject(error) // 返回执行错误 让当前的执行跳出成功 直接进入catch
  })
// 是否超时
function CheckTimeOut() {
  var currenTime = Date.now() // 当前时间戳
  var timeStamp = getTimeStamp() // 缓存时间戳
  return (currenTime - timeStamp) / 1000 > TimeOut
}
export default service
