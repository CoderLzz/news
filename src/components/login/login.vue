<template>
  <div class="container">
    <div class="login">
      <div class="avatar">
        <img src="../../assets/img/logo.png" alt />
      </div>
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginForm" label-width="70px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginForm.email" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="login">{{$t("login.login")}}</el-button>
          <el-button @click="register">{{$t("login.register")}}</el-button>
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
                email:'',
                password:''
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
                    console.log(data);
                    if(data.meta.status==200){
                      if(data.data.role.rights.length==0){
                        this.$message.error('该用户不具有登录管理系统的权限')
                      }else{
                        if(data.data.isActive){
                          window.localStorage.setItem('token',data.data.token)
                          let avatar='http://localhost'+data.data.avatar
                          this.$store.commit('init',avatar)
                          this.$store.commit('initusername',data.data.username)
                          this.$store.commit('initUserId',data.data._id)
                          this.$message.success(data.meta.msg)
                          this.$store.commit('initRole',data.data.role.code)
                          this.$store.commit('initRights',data.data.role.rights)
                          this.$router.push(data.data.role.rights[0].path)
                          this.$store.commit('initActive',data.data.role.rights[0].path)
                        }else{
                          this.$message.error('该用户已被封禁，请联系管理员解除封禁')
                        }
                      }                       
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
.el-form {
  margin-top: 100px;
  padding-right: 30px;
}
.right {
  display: flex;
  justify-content: flex-end;
}
.iconfont {
  margin-left: 5px !important;
}
</style>