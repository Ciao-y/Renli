// 权限拦截在路由跳转 导航守卫
import router from './router'
import store from '@/store' // 引入入store
import nprogress from 'nprogress' // 引入进度条
import 'nprogress/nprogress.css'

// 已经在man.js引入 相当于已经执行了
// 前置守卫 next是前置说无额必须执行的钩子 next 必须执行 不执行页面就死了
// next()放过
// next(false) 跳转中止
// next(地址) 跳转到某个地址
const whiteList = ['/login', '/404'] // 定义白名单
router.beforeEach((to, form, next) => {
  nprogress.start() // 开启进度条
  if (store.getters.token) {
    //   如果有token
    if (to.path === '/lohin') {
      //  如果要访问的是 登录页
      next('/')
    } else {
      // 只有每次放过去的时候CIA去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex中有用户资料的id 表示已经有资料了 不需要在获取了 如果没有id才需要获取
      if (!store.getters.userId) {
        store.dispatch('user/getUserInfo')
        // 如果说后续 需要根据用户资料获取数据的话 这里必须改成同步
      }
      next()
    }
  } else {
    //  没有token的情况下
    if (whiteList.indexOf(to.path) > -1) {
      //  表示要去的地址在白名单
      next()
    } else {
      //  跳转到登录页
      next('/login')
    }
    nprogress.done() // 手动强制关闭一次 为了解决手动切换地址的时候 进度条不关闭的问题
  }
})
// 后置守卫
router.afterEach(
  () => {
    nprogress.done()
  }
)

