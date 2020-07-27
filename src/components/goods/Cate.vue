<template>
  <div id="cate">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 使用main中注册的组件TreeTable-->
      <tree-table
        v-bind:data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
      >
        <!-- 是否有效列插槽模板 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted ===false"
            style="color:lightgreen;"
          ></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 等级排序模板 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level ===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level ===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页导航区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[5, 15, 20, 30]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加商品分类对话框 -->
    <el-dialog title="添加商品分类" :visible.sync="addCateDialogVisible" width="40%" @close="addCateDialogClose">
      <!-- 添加商品分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader 
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:true }"
            @change="parentCateChange" clearable>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="50%">
      <el-form
        :model="editCateForm"
        :rules="addCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="eidtCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'cate',
  data() {
    return {
      //查询条件（向后台发送请求查询的参数）
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //商品分类的数据列表，默认为空
      catelist: [],
      //后台获取的总数据条数
      total: 0,
      //为table表格指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'isok'
        },
        {
          label: '排序',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'order'
        },
        {
          label: '操作',
          //表示，将当前列定义为模板列
          type: 'template',
          //表示当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      //控制添加商品分类对话框是否展示
      addCateDialogVisible: false,
      //添加商品分类的表单数据对象
      addCateForm: {
        //将要添加的用户输入的分类名称
        cat_name: '',
        //父级分类的Id
        cat_pid: 0,
        //分类的等级，默认要添加的是一级分类
        cat_level: 0
      },
      //分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类的名称', trigger: 'blur' }
        ]
      },
      //父级分类的列表数据保存在data这里
      parentCateList: [],
      //选中的父级分类的Id对应的数组
      selectedKeys:[],
      //控制编辑商品分类对话框是否展示
      editCateDialogVisible:false,
      //编辑表单，，绑定对象
      editCateForm:''
    }
  },

  created() {
    this.getCateList()
  },
  methods: {
    //向后台发送请求获取商品分类的数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败！')
      }
      //console.log(res.data)
      //把数据列表赋值给，上面data()里的catelist
      this.catelist = res.data.result
      //（后台获取的总数据条数赋值给前端data()里的total保存）
      this.total = res.data.total
    },
    //监听pagesize每页多少条的改变事件
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    //监听pagenum页码数改变事件
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    //点击添加商品分类按钮，展示添加对话框
    showAddDialog() {
      //先获取父级分类的数据列表
      this.getParentCateList()
      //再展示出对话框
      this.addCateDialogVisible = true
    },
    //获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      //console.log(res.data)
      this.parentCateList = res.data
    },
    //添加分类弹框里的下拉列表，选项值发生变化时触发事件
    parentCateChange (){
      console.log(this.selectedKeys)
      //如果selectedKeys数组中的length大于0,证明选择了父级分类
      //反之则说明没有选择任何父级分类
      if(this.selectedKeys.length>0){
        //父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      }else{
        //父级分类的Id
        this.addCateForm.cat_pid=0
        //为当前分类的等级赋值
        this.addCateForm.cat_level=0
      } 
    },
    //点击确认按钮，添加新的分类
    addCate (){
      // 提交请求前，表单预验证
      this.$refs.addCateFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //校验成功，则向后台发送添加用户的请求
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品分类失败！')
        }
        this.$message.success('添加商品分类成功！')
        this.getCateList() //刷新数据列表
        // 隐藏添加对话框（弹框模板标签el-dialog上的属性：addCateDialogVisible决定显示隐藏）
        this.addCateDialogVisible=false
      })
    },
    //监听，添加分类对话框关闭事件，关闭后重置表单的数据
    addCateDialogClose (){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0
     
    },
    //编辑分类按钮，弹出对话框
    async showEditCateDialog (id){
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('获取分类失败！')
      this.editCateForm = res.data
      this.editCateDialogVisible = true
    },
    //确认更新编辑后的分类
    eidtCate (){
      this.$refs.editCateFormRef.validate(async valid => {
        // console.log(valid)
        // 表单预校验失败
        if (!valid) return
        //成功则发生post请求，更新分类名
        const { data: res } = await this.$http.put('categories/'+ this.editCateForm.cat_id,
        {
          cat_name: this.editCateForm.cat_name
        })
        if(res.meta.status !==200) 
        //return console.log(res)
        return  this.$message.error('更新分类失败！')
        //成功则隐藏对话框
        this.editCateDialogVisible = false
        this.$message.success('更新分类成功')
        this.getCateList()  //更新分类列表
      })   
    },

    //删除按钮，根据点击按钮获取的id删除该行
    async deleteCateById (id){
      //elm ui的MessageBox组件弹框询问用户是否删除数据
       const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?','提示',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除商品分类失败！')
      this.$message.success('删除商品分类成功！')
      this.getCateList()
    }


  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb,
.el-row {
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}

</style>
