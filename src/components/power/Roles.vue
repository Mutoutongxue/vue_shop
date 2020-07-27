<template>
  <div id="roles">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-button type="primary" @click="AddRoleDialogVisible=true">添加角色</el-button>
      <!-- 角色列表区 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级 -->
              <el-col :span="19">
                <!--通过for循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6 ">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{ item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column  type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="350px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框区域 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="30%"  @close="setRightDialogClosed">
      <!-- 树形控件区 -->
      <el-tree :data="rightsList" :props="treeProps" ref="treeRef" show-checkbox
      node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'roles',
  data() {
    return {
      //控制添加角色对话框是否展示
      AddRoleDialogVisible:false,
       //添加角色表单数据
      addRoleForm: {},
      //添加角色表单验证
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      //  编辑角色信息
      editRoleForm: {},   //编辑角色表单数据
      editRoleDialogVisible: false,  //控制编辑角色对话框是否展示
      //编辑角色表单验证
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 所有角色列表
      rolesList: [],
      //控制分配权限对话框是否展示
      setRightDialogVisible: false,
      //后台获取所有的权限树，数据(绑定处)
      rightsList: [],
      //树形控件的属性绑定对象
      treeProps:{
        label: 'authName',
        children: 'children'
      },
      //   默认选中的节点ID值
      defKeys: [],
      //当前即将分配权限的角色id
      roleId:''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //获取所有角色的列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      //console.log(res.data)
    },

    // 根据ID删除对应的权限
    async removeRightById(role, rightId) {
      // 弹框提示 删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 点击确定 返回值为：confirm
      // 点击取消 返回值为： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消权限删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      role.children = res.data
      //   不建议使用
      //this.getRolesList()
    },
    //展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id  //角色的id,赋值保存到data上，以便使用
      //获取角色的所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      //获取权限树数据，保存到data中
      this.rightsList = res.data
      //console.log(this.rightsList)
      //   递归获取三级节点的id
      this.getLeafkeys(role, this.defKeys)
      //成功后展示分配权限对话框
      this.setRightDialogVisible = true
    },
    // 通过递归 获取角色下三级权限的 id, 并保存到defKeys数组
    getLeafkeys (node, arr) {//array变数数组
      // 如果当前node节点没有children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafkeys(item, arr))
    },
     // 监听分配权限对话框关闭事件
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击确定按钮，为角色分配权限
    async allotRights (roleId) {
      // 获得当前选中和半选中的Id（element ui的tree组件getCheckedKeys()和getHalfCheckedKeys方法）
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // join() 方法用于把数组中的所有元素放入一个字符串
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) { return this.$message.error('分配权限失败！') }
      this.$message.success('分配权限成功!')
      this.getRolesList()
      //成功后隐藏分配权限对话框
      this.setRightDialogVisible = false
    },

    //点击确认按钮，添加角色
    addRoles (){
      // 提交请求前，表单预验证
      this.$refs.addRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //校验成功，则向后台发送添加用户的请求
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        // 成功后隐藏添加用户对话框（弹框模板标签el-dialog上的属性：AddRoleDialogVisible决定显示隐藏）
        this.AddRoleDialogVisible  = false
        this.getRolesList() //获取添加角色后的数据（重新获取更新角色数据表单并展示）
      })
    },
    // 监听添加角色对话框的关闭，
    addRoleDialogClosed () {
      this.$refs.addRoleFormRef.resetFields()
    },

    //编辑角色按钮点击弹框事件，并根据点击编辑按钮（scope.row.id）id值获取该列的数据
    async showEditDialog (id){
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editRoleForm = res.data   //根据id获取数据赋值给表单

      this.editRoleDialogVisible=true
    },
    //点击确认，更新编辑的角色
    editRoles (){
      this.$refs.editRoleFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //成功则发送put请求,更改后台数据
        const { data: res } = await this.$http.put(
          'roles/' + this.editRoleForm.roleId,
          {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          }
        )
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败！')
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false
        this.$message.success('更新角色信息成功！')
        this.getRolesList()  //更新角色列表
      })
    },

    //删除角色按钮，根据点击按钮获取的id删除
    async removeRoleById (id){
      //elm ui的MessageBox组件弹框询问用户是否删除数据
       const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //console.log(confirmResult)
      // 如果用户点击确定删除， 返回值为字符串：confirm
      // 如果用户点击取消， 返回值为字符串： cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    }

  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb,
.el-button {
  margin-bottom: 15px;
}
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
