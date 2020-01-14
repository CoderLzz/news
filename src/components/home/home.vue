<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="logo">{{$t('home.logo')}}</div>
        <div class="setting">
          <div class="avatar">
            <el-avatar size="large" :src="avatar"></el-avatar>
          </div>
          <div class="username">
            <el-tag>{{username}}</el-tag>
          </div>
          <div class="logout">
            <el-button type="primary" size="small" @click="logout">退出</el-button>
          </div>
          <div class="password">
            <el-link :underline="false" @click.prevent="showDialog">修改密码</el-link>
          </div>
          <div class="menu">
            <Icon type="md-more" size="25" color="#fff" @click="showDrawer" />
          </div>
          <!-- 右侧抽屉 -->
          <Drawer :closable="true" v-model="isShow" width="320">
            <template slot-scope="scope">
              <div class="header">
                <span>设置</span>
              </div>
              <div class="main">
                <div class="one">
                  <span>语言</span>
                  <div class="one-right">
                    <el-tooltip effect="dark" content="简体中文" placement="top" :enterable="false">
                      <div class="china">
                        <img src="../../assets/img/china.png" width="50px" @click="changeZH" />
                        <div class="circle" v-show="zh"></div>
                      </div>
                    </el-tooltip>
                    <div class="space"></div>
                    <el-tooltip effect="dark" content="英文" placement="top" :enterable="false">
                      <div class="english">
                        <img src="../../assets/img/English.png" width="50px" @click="changeEN" />
                        <div class="circle" v-show="en"></div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
                <el-row :gutter="20" justify="space-between" type="flex">
                  <el-col :span="6">主题</el-col>
                  <el-col :span="10">
                    <el-dropdown placement="bottom" @command="theme">
                      <el-button type="primary" size="small">
                        {{themeName1}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">经典</el-dropdown-item>
                        <el-dropdown-item command="2">科技</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
                <el-row :gutter="20" justify="space-between" type="flex">
                  <el-col :span="8"></el-col>
                  <el-col :span="10"></el-col>
                </el-row>
              </div>
            </template>
          </Drawer>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse?'':'200px'">
          <div class="btn" @click="trigger">|||</div>
          <el-menu
            :default-active="activeIndex"
            text-color="#fff"
            active-text-color="#409EFF"
            background-color="#333744"
            :unique-opened="true"
            :router="true"
            :collapse="isCollapse"
            :collapse-transition="false"
          >
            <el-submenu :index="item._id" v-for="item in menuArr" :key="item._id" v-if="rightsArr.includes(item.authName)">
              <template slot="title">
                <i :class="icon[item.authName]"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item :index="item1.path" @click="active(item1.path)" v-for="(item1,index1) in item.children" :key="item1._id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item1.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
      <!-- 修改密码弹出框 -->
      <el-dialog title="修改密码" :visible.sync="editPasswordDialog" width="50%" @close="closeDialog">
        <el-form
          :model="editPasswordForm"
          :rules="editPasswordRules"
          ref="editPasswordForm"
          label-width="100px"
        >
          <el-form-item label="旧密码" prop="oldPassword">
            <el-input v-model="editPasswordForm.oldPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input v-model="editPasswordForm.newPassword" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="confirmNewPassword">
            <el-input v-model="editPasswordForm.confirmNewPassword" type="password"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editPasswordDialog = false">取 消</el-button>
          <el-button type="primary" @click="editPassword">确 定</el-button>
        </span>
      </el-dialog>
    </el-container>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import {putPassword} from '../../api/user/editPassword'
import {getMenu} from '../../api/rights/rights'
export default {
  inject:['reload'],
  data() {
    var checkPassword=(rule,value,callback)=>{
      if(this.editPasswordForm.newPassword==value){
        callback()
      }else{
        callback(new Error('密码不匹配'))
      }
    }
    return {
      isCollapse:false,
      avatar: "",
      isShow: false,
      zh: true,
      en: false,
      themeName1: "经典",
      username: "",
      activeIndex: "",
      editPasswordDialog: false,
      editPasswordForm: {
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      },
      editPasswordRules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "密码长度必须在5到15之间",
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 15,
            message: "密码长度必须在5到15之间",
            trigger: "blur"
          }
        ],
        confirmNewPassword:[
          {validator:checkPassword,trigger:'blur'}
        ]
      },
      rightsList:[],
      menuArr:[],
      icon:{
        '首页':'el-icon-s-platform',
        '用户管理':'iconfont icon-user',
        '权限管理':'iconfont icon-tijikongjian',
        '文章管理':'iconfont icon-danju',
        '评论管理':'el-icon-chat-line-round',
        '设置':'el-icon-setting'
      }
    };
  },
  created() {
    this.avatar = this.$store.state.avatar;
    this.username = this.$store.state.username;
    this.rightsList=this.$store.state.rights
    this.activeIndex=this.$store.state.activeId
    if (
      this.$store.state.themeColor == "" ||
      this.$store.state.themeColor == "1"
    ) {
      require("../../assets/css/theme/classic.css");
    } else {
      require("../../assets/css/theme/technology.css");
    }
    if (this.$store.state.themeName == "") {
      this.themeName1 = "经典";
    } else {
      this.themeName1 = this.$store.state.themeName;
    }
    this.initLeftMenu()
  },
  methods: {
    async initLeftMenu(){
      let data=await getMenu()
      if(data.meta.status==200){
        this.menuArr=data.data
      }else{
        this.$message.error(data.meta.msg)
      }
    },
    showDrawer() {
      this.isShow = true;
    },
    changeZH() {
      this.zh = true;
      this.en = false;
      this.$i18n.locale = "zh";
    },
    changeEN() {
      this.zh = false;
      this.en = true;
      this.$i18n.locale = "en";
    },
    theme(params) {
      if (params == "1") {
        this.$store.commit("initTheme", "1");
        this.$store.commit("initThemeName", "经典");
      } else if (params == "2") {
        this.$store.commit("initTheme", "2");
        this.$store.commit("initThemeName", "科技");
      }
      window.location.reload();
    },
    active(path) {
      this.$store.commit('initActive',path)
      // window.sessionStorage.setItem("active", path);
      this.activeIndex = path;
    },
    showDialog() {
      this.editPasswordDialog = true;
    },
    editPassword(){
      this.$refs.editPasswordForm.validate(async flag=>{
        if(flag){
          let data=await putPassword(this.$store.state.userId,{
            oldPassword:this.editPasswordForm.oldPassword,
            newPassword:this.editPasswordForm.newPassword
          })
          if(data.meta.status==200){
            this.$message.success(data.meta.msg)
            window.localStorage.clear()
            this.$router.push('/login')
          }else{
            this.$message.error(data.meta.msg)
          }
        }
      })
    },
    logout(){
      window.localStorage.clear()
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    closeDialog(){
      this.$refs.editPasswordForm.resetFields()
    },
    trigger(){
      this.isCollapse=!this.isCollapse
    }
  },
  computed: {
    ...mapMutations(["initThemeName"]),
    ...mapState(["themeName"]),
    rightsArr(){
      let arr=[]
      this.rightsList.forEach(item=>{
        arr.push(item.rightName)
      })
      return arr
    }
  }
};
</script>

<style lang="less" scoped>
.iconfont {
  margin-right: 10px;
}
.el-header {
  background: var(--headercolor);
}
.el-aside {
  background: var(--asidecolor);
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: none;
}
.container {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  font-size: 20px;
  color: #fff;
}
.el-avatar {
  display: block;
  margin-right: 20px;
}
.setting {
  display: flex;
  align-items: center;
}
.el-dropdown-link {
  cursor: pointer;
}
.ivu-icon {
  cursor: pointer;
}
.header {
  height: 30px;
  text-align: center;
  border-bottom: 1px solid #eee;
  span {
    display: inline-block;
    width: 100px;
    margin-top: 18px;
    background-color: #fff;
    font-size: 15px;
    letter-spacing: 5px;
  }
}
.main {
  margin-top: 30px;
  font-size: 16px;
  .one {
    display: flex;
    justify-content: space-between;
    span {
      margin-top: 5px;
    }
    .one-right {
      display: flex;
      img {
        overflow: hidden;
        border-radius: 5px;
        cursor: pointer;
      }
      .circle {
        width: 8px;
        height: 8px;
        margin: 0 auto;
        border-radius: 50%;
        background-color: green;
      }
      .space {
        width: 10px;
      }
    }
  }
}
.el-row {
  margin-top: 20px;
}
.el-link {
  color: #fff !important;
}
.password {
  margin: 0 20px;
}
.username{
  margin-right: 20px;
}
.btn{
  text-align: center;
  color: #fff;
  font-size: 20px;
  letter-spacing: 3px;
  background-color: #4a5064;
  cursor: pointer;
  line-height: 2;
}
.menuStyle{
  width: 100px;
}
</style>