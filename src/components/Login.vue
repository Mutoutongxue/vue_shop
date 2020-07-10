<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avatar_box">
        <img src="../assets/tou.jpg" alt />
      </div>
      <!-- 表单区 ref代表整个表单的实例对象（类似于js的Document 对象，每个载入浏览器的HTML 文档都会成为 Document 对象） -->
      <el-form ref="loginformRef" v-bind:model="loginform" status-icon v-bind:rules="rules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform.username"  prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
         <el-form-item prop="password">
         <el-input v-model="loginform.password"  prefix-icon="el-icon-lock" type="password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" v-on:click="Loginform">登录</el-button>
          <el-button type="info" v-on:click="resetloginform">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
 


<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  data(){
    return {
      //这是登录表单的绑定的数据对象
      loginform:{
        username:'admin',    //给表单imput默认用户名和密码
        password:'123456'
      },
      //表单input的验证规则
       rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'blur' }
          ],

          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ],
       }

    }

  },
  methods:{
    //登录按钮
    Loginform() {
        this.$refs.loginformRef.validate(async (valid) => {
          if (!valid) return;  //验证失败，
          //1.const result= await this.$http.post('login',this.loginform);  //像接口发送登录请求
          //console.log(result.data);  //返回Promise对象时候，用同步await，和异步async，修饰
          //2.解构赋值方法
          // else{
           const {data:res}= await this.$http.post('login',this.loginform);  //向接口发送登录请求
           if(res.meta.status !=200)//{         //判断状态码
             //return alert("登录失败")
            return this.$message.error("登录失败");
          //  }
          //  else{
             this.$message.success("登录成功");
          //1、登录成功之后，服务器会返回给个token令牌，将token保存到客户端的sessionStorage中
          //  1.1、项目中除了登录之外的其他API接口，必须在登录之后才能访问
          //  1.2、token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            window.sessionStorage.setItem("token",res.data.token);
          //2、通过编程式导航跳转到后台主页，路由地址是/home
            this.$router.push('/home');
            // }
          // }
        });
      },

    //重置按钮，重置表单
    resetloginform (){ 
       // console.log(this); //Vue组件的实例
       this.$refs.loginformRef.resetFields();  //element ui文档里的重置表单里数据方法resetField()
       
    }
  }

};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  //垂直水平居中方法1
  //  position: absolute;
  //     top: 0;
  //     right: 0;
  //     bottom: 0;
  //     left: 0;
  //     margin: auto;

  //垂直水平居中方法2
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 2px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 10 10 10px #ddd;
    margin: 0px auto;
    margin-top: -65px;
    background-color: aliceblue;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .login_form{
    position: absolute;
    bottom:0;
    width:100%;
    padding: 0 20px;
    box-sizing: border-box;   //怪异盒子，解决盒子溢出问题
  }

  .btns{
    display: flex;
    justify-content: flex-end;
  }
}
</style>



