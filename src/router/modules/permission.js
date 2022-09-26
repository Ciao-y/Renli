import Layout from '@/layout'
// 导出员工的路由规则
export default {
  path: '/permission', // 路由地址
  name: 'permissions', // 给模块的一级路由加员工name属性
  component: Layout,
  children: [{
    path: 'permission',
    //   二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    component: () => import('@/views/permission'),
    name: 'permissions',
    //  路由的元信息
    meta: {
      title: '权限管理', // 因为左侧导航读取了这里的title属性
      icon: 'lock'
    }
  }]
}
