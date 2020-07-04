import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'          //导入全局样式表

import 'element-ui/lib/theme-chalk/index.css' //引入样式，这里是引入全部样式，你也可以单独引入某个组件样式
import {Button,Form,FormItem,Input,Message } from 'element-ui';           //按需求导入elemnet ui，需要的组件模块
// import { Form,FormItem } from 'element-ui';  
// import { Input } from 'element-ui';
// import { Message } from 'element-ui';    //5.引入弹框提示组件


import axios from 'axios'       //全局引入axios 做ajax前后台数据处理
axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'      //向后台发送请求的地址
Vue.prototype.$http=axios        //把axios挂载到Vue的原型（原型链）对象上，可以通过this.$http访问地址

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.prototype.$message=Message        //挂载Message组件到Vue对象的原型链上，成为全局



new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
