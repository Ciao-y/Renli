<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构的内容-头部 -->
      <el-card class="tree_card">
        <!-- 放置结构内容-->
        <TreeTools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- 放置<el-terr></el-terr> -->
        <el-tree v-loading="isLoading" :data="departs" :props="defaultProps" :default-expand-all="true">
          <TreeTools slot-scope="{data}" :tree-node="data" @delDepts="getDepartments()" @addDepts="addDepts" @editDepts="editDepts" />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置弹层组件 -->
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :tree-node="Node" @addDepts="getDepartments" />
  </div>
</template>

<script>
import AddDept from './components/add-dept.vue'
import { transListToTreeData } from '@/utils/index'
import { getDepartments } from '@/api/departments'
import TreeTools from './components/tree-tools.vue'
export default {
  components: {
    TreeTools, AddDept
  },
  data() {
    return {
      company: {}, // 头部的数据结构
      defaultProps: {
        label: 'name' // 表示这个属性显示内容
      },
      departs: [],
      showDialog: false,
      Node: null, // 记录当前点击的node节点 是哪个部门
      isLoading: false
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      this.isLoading = true
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      // this.departs = tranListToerrData(result.depts, '')
      this.departs = transListToTreeData(result.depts, '')
      this.isLoading = false

      // console.log(result)
    },
    // 监听tree-tools中触发的点击事件
    addDepts(Node) {
      // 显示弹层
      this.showDialog = true // 显示弹层
      this.Node = Node
    },
    // 点击编辑显示弹出层
    editDepts(Node) {
      this.showDialog = true // 弹出层
      this.Node = Node
      this.$refs.addDept.getDepartDetail(Node.id)
    }
  }
}
</script>

 <style  scoped>
.tree_card{
padding: 30px 140px;
font-size: 14px;
}
.tree_row{
height: 40px;
}
 </style>
