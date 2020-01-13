<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="16">
          <el-form :model="postForm" :rules="postFormRules" ref="postForm" label-width="80px">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="postForm.title"></el-input>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
              <quill-editor v-model="postForm.content"></quill-editor>
            </el-form-item>
            <el-form-item label="文章封面">
              <el-upload
                action="http://localhost/privates/cover"
                list-type="picture"
                :headers="headers"
                :on-success="coverSuccess"
                :on-remove="removeCover"
                :on-preview="preview"
                :file-list="fileList"
                ref="upload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="所属分类">
              <el-select v-model="postForm.categories" placeholder="请选择">
                <el-option
                  v-for="item in cateData"
                  :key="item._id"
                  :label="item.cateName"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="文章状态">
              <el-radio v-model="postForm.state" label="1">草稿</el-radio>
              <el-radio v-model="postForm.state" label="2">发布</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-show="postForm.state==2" @click="submitPost">发布</el-button>
              <el-button type="primary" v-show="postForm.state==1" @click="submitPost">保存</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 预览图片 -->
      <el-dialog title="图片预览" :visible.sync="prePic" width="50%">
        <img :src="url" alt />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getAllCate } from "../../api/post/getCate";
import { deleteCover } from "../../api/post/deleteCover";
import { addPost,getPostById } from "../../api/post/post";
export default {
  data() {
    return {
      breadcrumb: ["文章管理", "写文章"],
      postForm: {
        title: "",
        content: "",
        cover: "",
        author: "",
        categories: "",
        state: "1"
      },
      postFormRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        content: [
          { required: true, message: "请输入文章内容", trigger: "blur" }
        ]
      },
      headers: {
        Authorization: window.localStorage.getItem("token")
      },
      cateData: [],
      prePic: false,
      url: "",
      saveFile:'',
      fileList:[
        {url:''}
      ]
    };
  },
  methods: {
    coverSuccess(res, file) {
      this.saveFile=file
      if (res.meta.status == 200) {
        this.postForm.cover = res.data;
      } else {
        this.$message.error("文章封面上传失败");
      }
    },
    async getCate() {
      let data = await getAllCate();
      if (data.meta.status == 200) {
        this.cateData = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    async removeCover(file) {
      let data = await deleteCover(file.response.data);
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    preview(file) {
      this.prePic = true;
      this.url = "http://localhost/" + file.response.data;
    },
    async submitPost() {
      let data = await addPost(this.postForm);
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.$refs.postForm.resetFields();
        this.$refs.upload.clearFiles();
        this.postForm.categories = "";
        this.postForm.state = "1";
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    reset() {
      this.$refs.postForm.resetFields();
      this.$refs.upload.clearFiles();
      this.postForm.categories = "";
      this.postForm.state = "1";
      this.removeCover(this.saveFile)
    },
    async getPostId(id){
      let data=await getPostById(id)
      if(data.meta.status==200){
        this.postForm.title=data.data.title
        this.postForm.content=data.data.content
        this.fileList[0].url='http://localhost/'+data.data.cover
        this.postForm.author=data.data.author
        this.postForm.categories=data.data.categories
        this.postForm.state=data.data.state.toString()
      }
    }
  },
  async created() {
    this.postForm.author = this.$store.state.userId;
    this.getCate();
    let flag=location.hash.split('=')[1]?location.hash.split('=')[1]:''
    if(flag!=''){
      this.getPostId(flag)
    }

  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 30px;
}
</style>