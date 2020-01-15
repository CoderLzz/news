<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="8">
          <el-form :model="webForm" :rules="webFormRule" ref="webForm" label-width="100px">
            <el-form-item label="网站图标：" prop="favicon">
              <el-upload
                action="http://localhost/privates/web/favicon"
                :on-success="handleSuccess"
                class="avatar-uploader"
                :headers="headers"
                ref="upload"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="网站标题：" prop="webTitle">
              <el-input v-model="webForm.webTitle"></el-input>
            </el-form-item>
            <el-form-item label="开启评论：" prop="isComment">
              <el-radio v-model="webForm.isComment" label="true">开启</el-radio>
              <el-radio v-model="webForm.isComment" label="false">关闭</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveWebSetting">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {getSetting,putSetting} from '../../api/set/webSetting'
export default {
  data() {
    return {
      breadcrumb: ["设置", "网站设置"],
      webForm: {
        favicon: "",
        webTitle: "",
        isComment: "true"
      },
      webFormRule: {
        favicon: [
          { required: true, message: "请输入选择网站图标", trigger: "blur" }
        ],
        webTitle: [
          { required: true, message: "请输入选择标题", trigger: "blur" }
        ]
      },
      imageUrl: "",
      headers:{
          Authorization:window.localStorage.getItem('token')
      },
      webId:''
    };
  },
  methods: {
    handleSuccess(response,file) {
        if(response.meta.status==200){
            this.$message.success(response.meta.msg)
            this.webForm.favicon=response.data
        }
    },
    async getOneSetting(){
        let data=await getSetting()
        if(data.meta.status==200){
            this.imageUrl='http://localhost/'+data.data[0].favicon
            this.webForm.webTitle=data.data[0].webTitle
            this.webForm.isComment=data.data[0].isComment.toString()
            this.webId=data.data[0]._id
        }
    },
    async saveWebSetting(){
        let data=await putSetting(this.webId,this.webForm)
        if(data.meta.status==200){
            this.$message.success(data.meta.msg)
            this.getOneSetting()
            this.$refs.upload.clearFiles()
        }
    }
  },
  created(){
      this.getOneSetting()
  }
};
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>