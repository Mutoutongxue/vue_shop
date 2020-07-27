<template>
  <div id="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- //卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="handleCurrentChange(1);getGoodsList"></el-button>
          </el-input>
        </el-col>

        <el-col :span="4">
          <el-button type="primary"  @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- //表格数据展示区 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="id"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
            <template slot-scope="scope">
                {{scope.row.add_time | dataFormat}}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
            @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'list',
  data() {
    return {
      //查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,    //当前页码数
        pagesize: 10   //每页显示多少条数
      },
      //定义保存商品列表数据的数组(后台获取的)
      goodslist: [],
      //定义商品列表数据总条数（后台获取的）
      total: 0
    }
  },

  created() {
    this.getGoodsList()
  },

  methods: {
    //根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表数据失败!')
      }
      //this.$message.success('获取商品列表成功!')
      //console.log(res.data)
      //数据绑定到data里的数据数组上，供页面v-model绑定展示
      this.goodslist = res.data.goods
      this.total = res.data.total
    },

    //监听每页显示多少条数据pagesize的改变事件
    handleSizeChange(newsize){
        this.queryInfo.pagesize=newsize
        this.getGoodsList()
    },
    //监听页码值（第几页）的改变事件
    handleCurrentChange (newpage){
        this.queryInfo.pagenum=newpage
        this.getGoodsList()
    },

    // 通过Id删除商品
    async removeById (id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },

    //点击添加商品按钮，通过编程式导航跳转到商品添加页面
    goAddPage () {
      this.$router.push('/goods/add')
    }




  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb, .el-row{
  margin-bottom: 15px;
}
</style>
