<template>
  <div class="container">
    <div class="register">
      <el-page-header @back="goBack" content="注册页面"></el-page-header>
      <el-form :model="regForm" :rules="regFormRule" ref="regForm" class="form">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="regForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="regForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="regForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="ispassword">
          <el-input v-model="regForm.ispassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="注册角色：">
          <el-radio-group v-model="regForm.role">
            <el-radio label="2">普通用户</el-radio>
            <el-radio label="1">作者</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="right">
          <el-button type="primary" @click="register">注册</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { registerNews } from "../../api/register/register";
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱不合法"));
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (this.regForm.password == value) {
        callback();
      } else {
        callback(new Error("两次密码不一样"));
      }
    };
    return {
      regForm: {
        username: "",
        email: "",
        password: "",
        ispassword: "",
        role: "2"
      },
      regFormRule: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "用户名长度必须在2到6之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "密码长度必须在5到15之间",
            trigger: "blur"
          }
        ],
        ispassword: [
          { required: true, message: "请再输入一次密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "密码长度必须在5到15之间",
            trigger: "blur"
          },
          {
            validator: checkPassword,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    register() {
      this.$refs.regForm.validate(async flag => {
        if (flag) {
          let data = await registerNews({
            username: this.regForm.username,
            email: this.regForm.email,
            password: this.regForm.password,
            role: this.regForm.role
          });
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.$router.push("/login");
          } else {
            this.$message.error(data.meta.msg);
          }
        }
      });
    },
    reset() {
      this.$refs.regForm.resetFields();
      this.regForm.role = "2";
    },
    goBack() {
        this.$router.push('/login')
    }
  },
};
</script>

<style lang="less" scoped>
.container {
  overflow: hidden;
  height: 100%;
  background-color: #2b4b6b;
}
.register {
  width: 700px;
  padding: 30px 10px 30px 10px;
  margin: 80px auto;
  background-color: #fff;
}
.form {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 20px;
}
.right {
  display: flex;
  justify-content: flex-end;
}
.el-page-header{
    margin-left: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #999;
}
</style>