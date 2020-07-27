import Vue from 'vue'
import App from './App.vue'
import router from './router'

import './plugins/element.js'  //入口文件引入element.js里导入的element ui组件
import './assets/css/global.css'          //导入全局样式表
import './assets/fonts/iconfont.css'  //引入第三方字体图标库，样式
import TreeTable from 'vue-table-with-tree-grid'   //引入表格带tree结构的插件，供Cate组件的表格使用
import VueQuillEditor from 'vue-quill-editor'   //引入富文本编辑器插件
//引入富文本编辑器插件的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

//3.1导入Nprogress点击切换路由时的进度条 包对应的js和css
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'       //全局引入axios 类似于ajax做前后台数据处理
//axios.defaults.baseURL='http://119.23.53.78:8888/api/private/v1/'        //远程后台数据地址1

axios.defaults.baseURL='http://47.115.124.102:8888/api/private/v1/'   //远程后台数据地址2

//axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'      //配置向后台发送请求的地址


//3.2在request请求拦截器中，展示进度条 :Nprogress.start()

//2、 axios请求拦截（通过 axios 请求拦截器添加 token，保证拥有获取数据的权限）
axios.interceptors.request.use(config => {
  // 为请求头headers对象，添加 Token 验证的 Authorization 字段
    Nprogress.start()

    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config   //最后必须return config
  })

//3.3在response响应拦截器中，隐藏进度条:Nprogress.done()
axios.interceptors.response.use( config  => {
  Nprogress.done()
  return config
})

Vue.prototype.$http=axios        //把axios注册挂载到Vue的原型（原型链）对象上，可以通过this.$http访问地址

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)   //注册TreeTable成全局组件(表格树)
//将富文本编辑器注册为全局的组件
Vue.use(VueQuillEditor)

//时间格式，过滤器dataFormat
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
