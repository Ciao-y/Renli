<template>
  <el-dialog title="角色分配" :visible="shouRoleDialog" @close="btnCancel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="Btnmaks">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
// import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    shouRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
      // required: true
    }
  },
  data() {
    // 这里存放数据
    return {
      list: [], // 存储当前所有的角色id
      roleIds: [] // 存储当前用户所拥有的角色id
    }
  },

  // 计算属性 类似于 data 概念
  computed: {},
  // 监控 data 中的数据变化
  watch: {},
  // 生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    this.getRoleList()
  },

  // 方法集合
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pages: 20 })
      this.list = rows
      // console.log(this.list)
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    //  更新权限
    Btnmaks() {
      this.$confirm('确认更新权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        assignRoles({ id: this.userId, roleIds: this.roleIds })
        this.$emit('update:shouRoleDialog', false)
      })
    },
    //  关闭弹层
    btnCancel() {
      this.roleIds = []
      this.$emit('update:shouRoleDialog', false)
    }
  }
}
</script>
<style scoped>

</style>
