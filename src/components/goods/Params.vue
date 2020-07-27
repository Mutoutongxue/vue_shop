<template>
  <div id="params">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 头部警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="cat_opt">
        <el-col>
          <span>商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
            @change="selectValue"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签展示区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" sezi="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tab标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="id"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>    
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" sezi="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态态参数表格 -->
          <el-table :data="onlyTableDate" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染Tab标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >{{item}}</el-tag>
                <!-- 输入Tag文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="id"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑</el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+ titleText" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 添加参数对话框表单 -->
      <el-form :model="addFrom" :rules="addFromRules" ref="addFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 编辑参数对话框 -->
    <el-dialog
      :title=" '修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editFrom" :rules="addFromRules" ref="editFromRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'params',
  data() {
    return {
      //商品分类列表（后台获取的保存在此）
      cateList: [],
      //级联选择框双休绑定到的数组
      selectedCateKeys: [],
      //被激活的页签的名称
      activeName: 'many',
      //动态面板表格参数的数据
      manyTableDate: [],
      //静态面板表格参数的数据
      onlyTableDate: [],
      //控制添加对话框的显示与隐藏
      addDialogVisible:false,
      //添加参数的表单数据对象
      addFrom:{ attr_name:'' },
       // 表单的验证规则对象
      addFromRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
       //控制编辑对话框显示与隐藏
      editDialogVisible: false,
      // 修改的表单数据对象
      editFrom: {},

      //控制按钮与文本的切换显示
      inputVisible:false,
      //文本框中输入的内容
      inputValue:''
    }
  },
  created() {
    this.getCateList()
  },

  methods: {
    //获取所有的商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品数据列表失败！')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },

    //级联选择框选中项变化，会触发这个函数
    selectValue() {
      this.getParamsDate()
    },

    //tab 页签点击事件处理函数
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsDate()
    },

    //获取参数的数据列表
    async getParamsDate() {
      //console.log(this.selectedCateKeys)
      //当选择后的返回数组值长度大于3，证明选中的不是三级分类
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        this.manyTableDate=[]
        this.onlyTableDate=[]
        return
      }
      //反之则是选中了三级分类
      //console.log(this.selectedCateKeys)
      //根据所选中的分类的Id，和当前所处的面板，获取对应数据
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.meta.status !== 200){
        return this.$message.error('获取参数列表失败')
      }

       res.data.forEach(item => {
        //   通过三元表达式判断attr_vals是否为空
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        //控制文本框的显示与隐藏
        item.inputVisible = false
        //文本框的输入值
        item.inputValue = ''

      })
      console.log(res.data)
      //判断获取的到的数据属于动态面板，还是静态面板的
      if (this.activeName === 'many') {
        this.manyTableDate = res.data //数据赋值给动态面板的数据表格展示
      } else {
        this.onlyTableDate = res.data //数据赋值给静态面板的数据表格展示
      }
    },
    // 监听对话框的关闭事件
    addDialogClosed () {
      this.$refs.addFromRef.resetFields()
    },

    // 添加参数
    addParams () {
      this.$refs.addFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败！')
        }
        this.$message.success('添加参数成功！')
        this.addDialogVisible = false
        this.getParamsDate()
      })
    },
    // 点击编辑按钮，显示编辑对话框
    async showEditDialog (attrId) {
      //查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败！')
      }
      this.editFrom = res.data
      this.editDialogVisible = true
    },

    //监听编辑参数对话框关闭事件，重置表单
    editDialogClosed (){
       this.$refs.editFromRef.resetFields()
    },

    //点击编辑参数对话框里的，确定按钮修改参数
    editParams () {
      this.$refs.editFromRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('修改参数失败！')
        }
        this.$message.success('修改参数成功！')
        
        this.editDialogVisible = false
        this.getParamsDate()
      })
    },

    // 根据Id删除对应的参数项
    async removeParams (attrId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除参数失败！')
      }
      this.$message.success('删除参数成功！')
      this.getParamsDate()
    },

   // 文本框失去焦点,或者按下Enter触发
    handleInputConfirm (row) {
      // 输入的内容为空时，清空
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //如果没ruturn,则证明输入过内容，需后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 发起请求提交数据库，保存修改
      this.saveAttrVals(row)
    },
    // 将对attr_vals（Tag） 的操作 保存到数据库
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }
      this.$message.success('修改参数项成功！')
    },

    // 点击按钮显示文本输入框
    showInput (row) {
      row.inputVisible = true
      //   让输入框自动获取焦点
      // $nextTick方法的作用：当页面元素被重新渲染之后，才会至指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除对应的参数可选项
    handleClose (i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }

  },

  computed: {
    //监控如果tab里面板的按钮需要被禁用，则返回true,否则返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    //当前选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    //动态计算标题的文本
    titleText (){
      if(this.activeName ==='many'){
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.cat_opt {
  margin: 15px 0;
}
.el-tag{
  margin:10px;
}
.input-new-tag {
  width: 90px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
