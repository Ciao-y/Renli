import request from '@/utils/request'
// 登录接口
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
// 获取用户资料的接口
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'POST'
  })
}
// 根据用户Id获取用户详情
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
export function logout() {

}

