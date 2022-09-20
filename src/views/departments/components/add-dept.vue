<template>
  <!-- 放置弹层组件 -->
  <div>
    <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
      <!-- 表单数据 -->
      <!-- label-width设置所有标题的宽度 -->
      <el-form
        ref="deptForm"
        label-width="120px"
        :model="formDate"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="formDate.name" style="width:80%" placeholder="1-50个字符" />
        </el-form-item>

        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="formDate.code"
            style="width:80%"
            label="部门编码"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">

          <el-select
            v-model="formDate.manager"
            style="width:80%"
            placeholder="请选择"
            @focus="getEmployeeSimple"
          >
            <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="formDate.introduce"
            style="width:80%"
            label="部门介绍"
            placeholder="1-300个字符"
            type="textarea"
            :rows="3"
          />
        </el-form-item>
      </el-form>
      <!-- 确定和消息 -->
      <el-row
        slot="footer"
        type="flex"
        justify="center"
      >
        <el-col :span="6">
          <el-button
            size="small"
            @click="btnCancel"
          >取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="btnOK"
          >确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeSimple } from '@/api/employees'
import { updateDepartments, getDepartments, addDepartments, getDepartDetail } from '@/api/departments'
// 这里可以导入其他文件(比如: 组件、工具js、第三方插件js、json文件、图片文件...)
// 例如: import <组件名称> from '<组件路径>';
export default {
// import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    //  检查部门名称是否重复
    const checkNameRepeat = async(rule, value, callback) => {
      //  value是部门名称 要和同级部门下的部门比较 有没有相同的
      const { depts } = await getDepartments()
      let isRepeat = false
      // 去找同级部门下找 有没有和value一样的数据 返回一个布尔值
      if (this.formDate.id) {
      //  如果有id就是编辑模式
      // 编辑的数据 在数据库里有! 同级部门下 我的名字不能和其他的同级部门的名字进行重复
      // 首先要找到我的同级部门 this.formDate.id 就是我当前的id 我的pid是this.formDate.pid
      //   可以用this.formDate 或者this.treeNode
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      // 如果isRepeat为true表示找到了一样的
      isRepeat ? callback(new Error(`同级部门下已存在${value}这个部门了`)) : callback()
    }
    //  所有编码不能重复
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formDate.id) {
      //  如果有id就是编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`组织架构下已经存在这个${value}编码了`)) : callback()
    }
    return {
      // 定义表单数据
      formDate: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          {
            min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'
          }, {
            trigger: 'blur', validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          {
            min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur'
          },
          {
            trigger: 'blur', validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          {
            trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符'
          }]
      },
      peoples: [] // 负责人数据
    }
  }, computed: {
    showTitle() {
      // 判断有没有id更改title
      return this.formDate.id ? '编辑部门' : '新增子部门'
    }

  },

  methods: {
    // 获取负责人数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    //   获取详情方法
    async getDepartDetail(id) {
      this.formDate = await getDepartDetail(id)
    },
    //  确定新增提交
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOk => {
        if (isOk) {
          if (this.formDate.id) {
            // 编辑
            await updateDepartments(this.formDate)
          }
          // 表单校验通过
          //  这里我们将id设成了我的pid
          await addDepartments({
            ...this.formDate, pid: this.treeNode.id
          })
          //  告诉父组件更新数据
          this.$emit('addDepts')
          //  此时修改showDialog
          this.$emit('update:showDialog', false)
        }
      })
    },
    //  点取消关闭弹层
    // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
    btnCancel() {
      this.formDate = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>
<style scoped>

</style>
