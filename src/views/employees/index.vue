<template>
  <div class="dashboard-container">
    <div class="app-container">
      <PageTools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 左侧显示总记录数 -->
        <template v-slot:after>
          <!-- 右侧显示按钮 -->
          <span slot="before">
            <el-button size="small" type="success">excel导入</el-button>
            <el-button size="small" type="danger">excel导出</el-button>
            <el-button size="small" type="primary" @click="showDialog=true">新增员工</el-button>
          </span>
        </template>
      </PageTools>
      <!-- 表格组件 -->
      <el-card>
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" sortable="">
            <template v-slot="{row}">
              <el-image :src="row.staffPhoto" style="width:100px;height: 100px;border-radius: 50%;" @click="onShow(row.staffPhoto)">
                <img slot="error" src="@/assets/common/head.jpg" @click="onShow(require('@/assets/common/head.jpg'))">
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatEmployee" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" sortable="" align="center">
            <!-- 作用域插槽 -->
            <!-- 格式化时间 -->
            <template slot-scope="{ row }">{{ row.timeOfEntry | formatDate }}</template>
          </el-table-column>
          <el-table-column label="账户状态" prop="enableState" sortable="">
            <template v-slot="{row}">
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 放置分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="total,prev, pager, next"
            :current-page="page.page"
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <addEmployeeVue :show-dialog.sync="showDialog" />
    <el-dialog title="显示二维码" :visible.sync="iSshow">
      <qrcode-vue :value="staffPhotoUrl" size="100" level="H" />
    </el-dialog>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { getEmployeeList, delEmployee } from '@/api/employees'
import addEmployeeVue from './components/add-employee.vue'
import EmployeeEnum from '@/api/constant/employees' // 引入员工的枚举对象
export default {
  components: {
    addEmployeeVue,
    QrcodeVue
  },
  data() {
    return {
      list: [],
      page: {
        page: 1, // 当前页码
        size: 10, // 每页条数
        total: 0 // 分页总数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认关闭
      iSshow: false, // 二维码的显示隐藏
      staffPhotoUrl: undefined

    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      // 解构赋值
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      console.log(this.list)
      this.loading = false
    },
    // newPage是最新的页码
    changePage(newPage) {
      this.page.page = newPage // 赋值最新的页码
      this.getEmployeeList()
    },
    // 格式化聘用形式
    formatEmployee(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      await this.$confirm('您确定删除该员工吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      })
    },
    // 点击头像显示二维码
    onShow(url) {
      this.staffPhotoUrl = url
      this.iSshow = true
    }
  }
}
</script>

 <style>

 </style>
