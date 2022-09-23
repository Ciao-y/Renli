<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账号设置">
            <el-form ref="elForm" :rules="rules" :model="userInfo" size="medium" label-width="120px" style="margin-left: 120px; margin-top:30px">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="userInfo.username" placeholder="请输入用户名" clearable style="width:300px" />
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  placeholder="请输入密码"
                  clearable
                  show-password
                  style="width:300px"
                />
              </el-form-item>
              <el-form-item size="large">
                <el-button type="primary" @click="submitForm">提交</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="个人设置">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employess/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <User /> -->
            <component :is="User" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employess/print/${userId}?type=job`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <component :is="JopInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import User from './components/user-info.vue'
import JopInfo from './components/job-info.vue'
export default {
  components: {
    User,
    JopInfo
  },
  data() {
    return {
      User: 'User',
      JopInfo: 'JopInfo',
      userId: this.$route.params.id, // 路由中的参数
      userInfo: {
        username: '',
        password2: ''
      },
      rules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 9, message: '密码长度6-9位', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId)
    },
    submitForm() {
      this.$confirm('确认修改?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        this.$refs.elForm.validate()
        saveUserDetailById({ ...this.userInfo, password: this.userInfo.password2 }) // 将新密码的值替换原密码的值
        this.$message.success('修改成功')
      })
    }
  }

}
</script>

 <style>

 </style>
