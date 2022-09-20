import request from '@/utils/request'
// 获取组织架构的数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除组织架构的部门
export function delDepartment(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

// 新增组织架构的部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
/** *
 * 获取某个部门详情
 * ***/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 保存编辑的数据
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
