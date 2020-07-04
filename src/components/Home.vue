<template>
  <div id="home">
   <el-button type="info" v-on:click="Loginout">退出</el-button>
  </div>
</template>

<script>


export default {
  name: 'home',
  methods:{
      Loginout (){
          window.sessionStorage.clear() //清除登录后的token令牌，
          this.$router.push('/login')   //重定向到login路由页面
      }
  }
}
</script>

<style>
</style>
