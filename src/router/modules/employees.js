import Layout from '@/layout'
// 导出员工的路由规则
export default {
  path: '/employess/', // 路由地址
  name: 'employees', // 给模块的一级路由加员工name属性
  component: Layout,
  children: [{
    path: 'employees',
    //   二级路由的path什么都不用写的时候,此时它表示二级路由的默认路由
    component: () => import('@/views/employees'),
    name: 'employees',
    //  路由的元信息
    meta: {
      title: '员工管理', // 因为左侧导航读取了这里的title属性
      icon: 'people'
    }
  },
  {
    path: 'detail/:id?',
    component: () => import('@/views/employees/detail'),
    hidden: true,
    meta: {
      title: '员工详情' // 因为左侧导航读取了这里的title属性
    }
  }, {
    path: 'print/:id', // 二级默认路由
    component: () => import('@/views/employees/print'), // 按需加载
    hidden: true,
    meta: {
      title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      icon: 'people'
    }
  }
  ]
}
