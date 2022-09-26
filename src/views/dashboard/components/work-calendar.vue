<template>
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <!-- 年 -->
      <el-select
        v-model="currentYear"
        size="small"
        style="width: 120px;"
        @change="dataChang"
      >
        <el-option v-for=" item in yearList" :key="item" :label="item" :value="item" /></el-select>
      <el-select
        v-model="currentMonth"
        size="small"
        style="width: 120px;
        margin-left: 10px;"
        @change="dataChang"
      >
        <el-option v-for=" item in 12" :key="item" :label="item" :value="item" /></el-select>
    </el-row>
    <!-- 日历组件 -->
    <el-calendar v-model="currentDate ">
      <template v-slot:dateCell="{ date, data }" class="content">
        <div class="date-content">
          <span class="text"> {{ data.day | getDay }}</span>
          <span v-if="isWeek(date)" class="rest">休</span>
        </div>
      </template>
    </el-calendar>
  </div>
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';

export default {

  filters: {
    getDay(value) {
      const day = value.split('-')[2]
      return day.startsWith('0') ? day.substr(1) : day
    }
  },
  props: {
    starDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    // 这里存放数据
    return {
      yaarList: [], // 要遍历的年数
      currentYear: null, // 当前年份
      currentMonth: null, // 当前月份
      currentDate: null
    }
  },

  created() {
    this.currentYear = this.starDate.getFullYear() // 得到当前的年份
    this.currentMonth = this.starDate.getMonth() + 1
    this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    // console.log(this.yearList)
    //  年份发生变化调用
    this.dataChang()
  },
  methods: {
    // 是否是休息日
    isWeek(value) {
      return value.getDay() === 6 || value.getDay() === 0
    },
    // 年月份改变之后
    dataChang() {
      const year = this.currentYear
      const month = this.currentMonth
      this.currentDate = new Date(`${year}-${month}-1`) // 以当前月的1号为起始
    }

  }
}
</script>
<style  scoped>
   ::v-deep .el-calendar-day {
    height:  auto;
   }
   ::v-deep .el-calendar-table__row td,::v-deep .el-calendar-table tr td:first-child,  ::v-deep .el-calendar-table__row td.prev{
    border:none;
   }
  .date-content {
    height: 40px;
    text-align: center;
    line-height: 40px;
    font-size: 14px;
  }
  .date-content .rest {
    color: #fff;
    border-radius: 50%;
    background: rgb(250, 124, 77);
    width: 20px;
    height: 20px;
    line-height: 20px;
    display: inline-block;
    font-size: 12px;
    margin-left: 10px;
  }
  .date-content .text{
    width: 20px;
    height: 20px;
    line-height: 20px;
   display: inline-block;

  }
   ::v-deep .el-calendar-table td.is-selected .text{
     background: #409eff;
     color: #fff;
     border-radius: 50%;
   }
   ::v-deep .el-calendar__header {
     display: none
   }
  </style>

