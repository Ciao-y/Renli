<template>
  <!-- 雷达图 -->
  <div ref="main" class="radar-echart" />
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import * as echarts from 'echarts'

// 基于准备好的dom，初始化echarts实例
// 绘制图表
export default {
// import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    // 这里存放数据
    return {
    }
  },

  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  created() { },
  //   页面渲染完毕
  mounted() {
    const myChart = echarts.init(this.$refs.main)
    myChart.setOption({
      title: {
        text: '绩效考核'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
      //   每个区域的最高值
        indicator: [
          { name: '工作效率', max: 6500 },
          { name: '考勤', max: 16000 },
          { name: '积极性', max: 30000 },
          { name: '帮助同事', max: 38000 },
          { name: '自主学习', max: 52000 },
          { name: '正确率', max: 25000 }
        ]
      },
      series: [
        {
          name: '预算 vs 开销',
          type: 'radar',
          data: [
            {
              value: [4200, 3000, 20000, 35000, 50000, 18000],
              name: '张三'
            },
            {
              value: [5000, 14000, 28000, 26000, 42000, 21000],
              name: '李四g'
            }
          ]
        }
      ]
    })
  },
  // 方法集合
  methods: {}
}
</script>
<style scoped>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
