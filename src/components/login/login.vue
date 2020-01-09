<template>
  <div class="container">
    <div class="login">
      <div class="avatar">
        <img src="../../assets/logo.png" alt />
      </div>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
        label-width="70px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {loginNews} from '../../api/login/login'
export default {
    data() {
        return {
            loginForm:{
                email:'lzz@qq.com',
                password:'123456'
            },
            loginFormRules:{
                email:[
                    {required:true,message:'请输入邮箱',trigger:'blur'}
                ],
                password:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:5,max:15,message:'密码长度必须在5到15之间',trigger:'blur'}
                ]
            }
        }
    },
    methods: {
        login(){
            this.$refs.loginForm.validate(async (flag)=>{
                if(flag){
                    let data=await loginNews(this.loginForm)
                    if(data.meta.status==200){
                        window.localStorage.setItem('token',data.data.token)
                        this.$message.success(data.meta.msg)
                        this.$router.push('/home')
                    }else{
                        this.$message.error(data.meta.msg)
                    }
                    
                }
            })
        },
        register(){
            this.$router.push('/register')
        }
    },
};
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
  .login {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 450px;
    height: 300px;
    background-color: #fff;
    transform: translate(-50%, -50%);
    .avatar {
      position: absolute;
      left: 50%;
      width: 130px;
      height: 130px;
      padding: 10px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
  }
}
.el-form{
    margin-top: 100px;
    padding-right: 30px;
}
.right{
    display: flex;
    justify-content: flex-end
}
</style>