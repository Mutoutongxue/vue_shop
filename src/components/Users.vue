<template>
  <div id="users">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜素与添加区域使用了layout布局 的el-row -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表展示区 -->
      <el-table v-bind:data="userlist" border stripe style="width: 100%">
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <!-- {{scope.row}} -->
            <!-- element ui 的开关组件 -->
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              v-bind:enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totle"
      ></el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 内容主体 -->
      <el-form
        :model="addUserForm"
        ref="addUserFormRef"
        :rules="addUserFormRules"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClosed"
    >
      <!-- 表单内容主体区 -->
      <el-form
        :model="editUserForm"
        ref="editUserFormRef"
        :rules="editUserFormRules"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //分配角色对话框区域 -->
    <el-dialog title="分配角色" :visible.sync="setRightDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{userInfos.username}}</p>
        <p>当前的橘色：{{userInfos.role_name}}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" clearable placeholder="请选择">
            <el-option v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',
  data() {
    // 自定义验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 自定义验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[34578]\d{9}$/
      if (regMobile.test(value)) {
        return callback()
      }
      // 返回一个错误提示
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      //向后台获取用户信息列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1, //当前的页数
        pagesize: 5 //当前每页显示多少条数据
      },
      userlist: [], //用来给模板绑定表格数据的后台用户数组
      totle: 0,
      //1.控制添加用户的对话框显示与隐藏
      addDialogVisible: false,
      //添加用户的表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户添加表单验证规则
      addUserFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3～10个字',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          {
            min: 6,
            max: 18,
            message: '用户密码的长度在6～18个字',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //2.控制修改用户的对话框显示与隐藏
      editDialogVisible: false,
      //后台根据列表id值查询到的用户信息对象
      editUserForm: {},
      // 修改用户的表单验证规则
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      //控制分配角色对话框的显示与隐藏
      setRightDialogVisible: false,
      //需要被分配角色的用户信息
      userInfos: {},
      //所有角色的（下拉列表）列表信息
      rolesList: [],
      //已选择的下拉列表的角色Id值
      selectedRoleId :''
    }
  },
  created() {
    //页面加载前，获取需要挂载的数据，像后台获取数据，显示左边菜单列表
    this.getUserList()
  },
  methods: {
    async getUserList() {
      //向后台发送get请求获取用户列表数据，地址为users,参数为params:后面的
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userlist = res.data.users //获取的角色,赋值给data里对应的userlist，以便于data值绑定渲染Dom,html页面
      this.totle = res.data.total //获取的总数据条数
      console.log(res)
    },
    //监听每页多少条数据pagesize的改变事件
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    //监听页面值（第几页）的改变事件
    handleCurrentChange(val2) {
      console.log(`当前页: ${val2}`)
      this.queryInfo.pagenum = val2
      this.getUserList()
    },
    // 监听 switch开关 状态改变
    async userStateChanged(userInfo) {
      // console.log(userInfo)
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听 添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击确定按钮，添加新用户
    addUser() {
      // 提交请求前，表单预验证
      this.$refs.addUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //校验成功，则向后台发送添加用户的请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        // 隐藏添加用户对话框（弹框模板标签el-dialog上的属性：addDialogVisible决定显示隐藏）
        this.addDialogVisible = false
        this.getUserList() //获取添加用户后的数据（重新获取数据）
      })
    },
    // 点击修改按钮，展示编辑用户对话框事件，并根据点击修改按钮的（scope.row.id）id值获取该列的数据
    async showEditDialog(id) {
      //console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      this.editUserForm = res.data //根据id获取数据赋值给表单
      this.editDialogVisible = true
    },
    // 监听 修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    //修改用户信息，并确认提交
    editUser() {
      //提交前，表单先预验证
      this.$refs.editUserFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //成功则发送put请求,更改后台数据
        const { data: res } = await this.$http.put(
          'users/' + this.editUserForm.id,
          {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新用户信息失败！')
        }
        // 隐藏添加用户对话框
        this.editDialogVisible = false
        //刷新用户列表
        this.getUserList()
        //提示用户修改成功
        this.$message.success('更新用户信息成功！')
      })
    },
    //删除按钮，根据id删除信息
    async removeUserById(id) {
      //弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 如果用户点击确定删除， 返回值为字符串：confirm
      // 如果用户点击取消， 返回值为字符串： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    //展示分配角色的对话框按钮事件
    async setRole(userInfo) {
      this.userInfos = userInfo
      //展示对话框之前，获取所有角色列表（下拉框）
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }

      this.rolesList = res.data

      this.setRightDialogVisible = true
    },
    //点击按钮，给用户分配新的角色
    async saveRoleInfo (){
      if(!this.selectedRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const { data: res }=await this.$http.put(`users/${this.userInfos.id}/role`,
       { rid: this.selectedRoleId })
      if(res.meta.status !==200){
        //console.log(res)
        const result=res.meta.msg
        
        return this.$message.error(result)
      }
      this.$message.success('更新用户角色成功')
      //成功后刷新用户信息展示列表
      this.getUserList()
      //成功后关闭对话框
      this.setRightDialogVisible=false
    },
     // 监听分配角色对话框关闭事件
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfos = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 14px;
}
.el-table {
  margin-top: 15px;
}
</style>
