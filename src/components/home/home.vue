<template>
  <div class="container">
    <el-container>
      <el-header>
        <div class="logo">{{$t('home.logo')}}</div>
        <div class="setting">
          <div class="avatar">
            <el-avatar size="large" :src="avatar"></el-avatar>
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
                        {{themeName}}
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">经典</el-dropdown-item>
                        <el-dropdown-item command="2">科技</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-col>
                </el-row>
              </div>
            </template>
          </Drawer>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatar: "",
      isShow: false,
      zh: true,
      en: false,
      themeName: "经典"
    };
  },
  created() {
    this.avatar = this.$store.state.avatar;
  },
  methods: {
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
      if (params == 1) {
        this.themeName='经典'
      } else {
        this.themeName='科技'
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
}
.el-aside {
  background-color: #333744;
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
    margin-bottom: 10px;
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
</style>