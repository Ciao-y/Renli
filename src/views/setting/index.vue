<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <!-- 左侧的内容 -->
            <el-row style="height: 60px;">
              <el-button
                icon="el-icon-plus"
                type=" primary"
                size=" small"
                @click="showDialog=true"
              >新增角色</el-button>
            </el-row>
            <el-table border="" :data="list">
              <el-table-column label="序号" type="index" width="120" align="center" />
              <el-table-column label="名称" width="240" prop="name" align="center" />
              <el-table-column label="描述" prop="description" align="center" />
              <el-table-column label="操作" align="center">
                作用域插槽 获取当前行的数据
                <template slot-scope="{row}">
                  <el-button size="small" type="success" @click="distributor(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 放置分页组件 -->
          <el-row type="flex" justify="center" align=" middle" style="height: 60px;">
            <el-pagination
              layout="prev, pager, next"
              :total="page.total"
              :page-size="page.pagesize"
              :current-page="page.page"
              @current-change="changPage"
            />
          </el-row>
          <el-tab-pane label="公司信息">
            <el-alert
              effect="dark"
              :closable="false"
              type="info"
              title="对公司名称,公司地址,营业执照,公司地区的更新,将使得公司重新审核,请谨慎修改"
              :show-icon="true"
            />
            <!-- 右边内容 -->
            <el-form label-width="120px" style="margin-top:50px" disabled>
              <el-form-item label="企业名称">
                <el-input v-model="FormData.name" style="width:400px;" />
              </el-form-item>

              <el-form-item label="公司地址">
                <el-input v-model="FormData.companyAddress" style="width:400px;" />
              </el-form-item>

              <el-form-item label="电话">
                <el-input v-model="FormData.companyPhone" style="width:400px;" />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="FormData.mailbox" style="width:400px;" />
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="FormData.remarks" type="textarea" :row="3" style="width:400px;" />
              </el-form-item>

            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 放置一个弹层组件 -->
    <el-dialog :title="roleForm.id?'编辑角色':'新增角色'" :visible="showDialog" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 按钮插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 新增权限的弹层 -->
    <el-dialog title="分配权限" :visible="showPerm" @close="cancel">
      <!-- :show-checkbox="true" 如果为true 表示父子勾选时 不互相关联 默认不写为false -->
      <el-tree
        ref="premTree"
        node-key="id"
        :data="permDate"
        :props="defauItProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :check-strictly="true"
        :default-checked-keys="selectCcheck"
      />
      <!-- 确定,取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="determinate">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getRoleList, getCompanyInfo, assignPerm, deleteRole, getRoleDetail, updateRole, addRole } from '@/api/setting'
import { getPermissionList } from '@/api/permisson'
import { transListToTreeData } from '@/utils'

export default {
  data() {
    return {
      list: [], // 承接数组
      FormData: {}, // 公司信息
      permDate: [], // 接收权限数据信息
      defauItProps: {
        label: 'name'
      }, // 定义显示 字段的名称和子属性的字段
      roleId: null, // 记录当前分配权限的id
      selectCcheck: [], // 记录当前权限点的标识
      page: {
        // 放置页码及相关数据
        page: 1,
        pagesize: 10,
        total: 0 // 记录总数
      },
      showPerm: false, // 分配权限的弹层显示
      showDialog: false, // 控制弹层显示
      roleForm: {
        name: '', // 角色名称
        description: '' // 角色描述
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }

    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.getRoleList()// 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { total, rows } = await getRoleList(
        this.page
      )
      this.page.total = total
      this.list = rows
    },
    // 页码跳转
    changPage(newPage) {
      // newPage是当前点击的页码
      this.page.page = newPage
      this.getRoleList()
    }, // 获取公司信息
    async getCompanyInfo() {
      // 直接把返回值赋值到formDate
      this.FormData = await getCompanyInfo(this.companyId)
    },
    // 删除角色
    async deleteRole(id) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return deleteRole(id) // 调用删除接口
      }).then(() => {
        this.getRoleList()// 重新加载数据
        this.$message({
          type: 'success',
          message: '删除成功!'

        })
      })
    },
    // 点编辑获取角色资料
    async editRole(id) {
      this.roleForm = await getRoleDetail(id) // 获取数据
      this.showDialog = true
      // console.log(this.roleForm)
    },

    // 确认
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
        } else {
          // 新增业务
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoleList()
        this.$message.success('操作成功')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 取消
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    // 获取权限数据回流
    async distributor(id) {
      this.permDate = transListToTreeData(await getPermissionList(), '0')
      this.roleId = id
      // permIds是当前用户所拥有权限点数据
      const { permIds } = await getRoleDetail(id)
      // console.log(permIds)
      this.selectCcheck = permIds
      this.showPerm = true
    },
    // 添加权限
    determinate() {
      this.$confirm('确认给该用户添加权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        assignPerm({ permIds: this.$refs.premTree.getCheckedKeys(), id: this.roleId })
        this.$message.success('添加成功')
        this.showPerm = false
      })
    },
    // 关闭弹层
    cancel() {
      this.selectCcheck = []
      this.showPerm = false
    }
  }
}
</script>

 <style>

 </style>
