import Layout from '@/layout'
// 导出员工的路由规则
export default {
  path: '/attendances/', // 路由地址
  name: 'attendances', // 给模块的一级路由加员工name属性
  component: Layout,
  children: [{
    path: 'attendances',
    //   二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    component: () => import('@/views/attendances'),
    //  路由的元信息
    meta: {
      title: '考勤', // 因为左侧导航读取了这里的title属性
      icon: 'skill'
    }
  }]
}
