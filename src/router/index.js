import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login.vue'     //注意路径使用问题，使用使用@后支持文件快速定位，或者../指当前目录的上一层目录
import Home from '@/components/Home.vue'       //引入Home组件
import Welcome from '@/components/Welcome.vue'
import Users from '@/components/Users.vue'

Vue.use(VueRouter)


const routes = [
  { path: '/', redirect: '/login' },         //路由重定向，到login组件上，指浏览器打开就定位到login

  { path: '/login', component: Login },

  {
    path: '/home',
    component: Home,
    redirect:'/welcome',   //路由重定向到welcome组件
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/users', component: Users}
    ]
  }

]

const router = new VueRouter({
  routes
})


//挂载路由导航守卫router.beforeEach（保证如果没登录，无法访问其他页面的路由）
router.beforeEach((to, from, next) => {
  //to表示将要访问的路径对象， from代表从哪个路径跳转而来
  //next 是一个函数，表示放行。  
  //   1. next()  ..放行      2.next('/login')  强制跳转到login路由
  if (to.path === '/login') return next();
  //获取token令牌
  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr) return next('/login'); //判断token令牌是否取到，
  next();         //否则放行跳转，else省略，
})



export default router
