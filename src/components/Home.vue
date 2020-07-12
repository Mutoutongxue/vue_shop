<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/xitong.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" v-on:click="Loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside v-bind:width="isCollapse ? '64px' : '200px' ">
        <!-- 菜单栏折叠和展开按钮 "|||" -->
        <div class="toggle-button" v-on:click="toggle_button">|||</div>
        <!-- 侧边导航菜单栏 使用element ui,navMenu导航栏的router属性开启左边菜单栏的路由导航功能：启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened v-bind:collapse="isCollapse" 
        v-bind:collapse-transition="false" router>
          
          <!-- 一级菜单 -->
          <el-submenu v-bind:index="item.id+'' " v-for="item in menulist" :key="item.id" >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i v-bind:class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item v-bind:index=" '/'+subItem.path "  v-for="subItem in item.children" :key="subItem.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item> 
          </el-submenu>
          
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 左侧菜单导航栏，各项路由的占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name :'home',
  data () {
    return {
      //后台获取的左侧菜单数据给menulist数组对象
      menulist: [],
      iconObj: {//第三方图标对象
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
       //菜单是否栏折叠属性
        isCollapse:false
    }
  },

  //页面刚创建时，就应该加载左侧菜单栏数据所以使用 created()...vue生命周期钩子函数
  //在created函数中调用axios获取页面初始化所需的数据
  created () {
    this.getMenuList()
  },
  methods: {
    Loginout () {//退出按钮
      window.sessionStorage.clear(); //清除登录后的token令牌，
      this.$router.push("/login"); //重定向到login路由页面
    },
    //通过axios向接口发送get请求，获取左侧所有菜单的数据,
    async getMenuList () {
      const {data:res}=await this.$http.get('menus')
      if(res.meta.status !=200) return this.$message.error(res.meta.msg)
      this.menulist=res.data    //后台获取的数据赋值给data()里的menulist对象
      //console.log(res)
    },
    //菜单栏，是否折腾展示按钮
    toggle_button () {
      this.isCollapse=!this.isCollapse
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center; //退出按钮居中
  color: aliceblue;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.el-menu{
  border-right:0px;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 16px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;  //文字符间距
  cursor: pointer;    //cursor为显示的鼠标的类型属性
}




</style>
