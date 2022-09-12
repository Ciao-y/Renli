import axios from 'axios'
import { Message } from 'element-ui'
const service = axios.create(
  {
    // 当执行 npm run dev=>.evn.development=>/api=>跨域代理
    baseURL: process.env.VUE_APP_BASE_API, // npm run dev => /api npm run build=>/prod-api
    timeout: 3000 // 设置请求超时时间
  }
)
service.interceptors.request.use() // 请求拦截器
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
    Message.error(error.message) // 提示错误消息
    return Promise.reject(error) // 返回执行错误 让当前的执行跳出成功 直接进入catch
  }
)
export default service
