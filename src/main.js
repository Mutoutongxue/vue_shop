import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'  //入口文件引入element.js里导入的element ui组件
import './assets/css/global.css'          //导入全局样式表
import './assets/fonts/iconfont.css'  //引入第三方字体图标库，样式

import axios from 'axios'       //全局引入axios 类似于ajax做前后台数据处理
//axios.defaults.baseURL='http://119.23.53.78:8888/api/private/v1/'        //远程后台数据地址1

axios.defaults.baseURL='http://47.115.124.102:8888/api/private/v1/'   //远程后台数据地址2

//axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'      //配置向后台发送请求的地址

//2、 axios请求拦截（通过 axios 请求拦截器添加 token，保证拥有获取数据的权限）
axios.interceptors.request.use(config => {
  // 为请求头headers对象，添加 Token 验证的 Authorization 字段
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config   //最后必须return config
  })

Vue.prototype.$http=axios        //把axios挂载到Vue的原型（原型链）对象上，可以通过this.$http访问地址

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
