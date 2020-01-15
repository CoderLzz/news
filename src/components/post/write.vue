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
              <!-- 第一个 -->
              <el-upload
                action="http://localhost/privates/cover"
                list-type="picture"
                :headers="headers"
                :on-success="coverSuccess"
                :on-remove="removeCover"
                :on-preview="preview"
                ref="upload"
                v-show="isFile"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
              <!-- 第二个 -->
              <el-upload
                action="http://localhost/privates/cover"
                list-type="picture"
                :headers="headers"
                :on-success="coverSuccess"
                :on-remove="removeCover"
                :on-preview="preview"
                :file-list="fileList"
                ref="upload1"
                v-show="!isFile"
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
              <el-radio v-model="postForm.state" label="false">草稿</el-radio>
              <el-radio v-model="postForm.state" label="true">发布</el-radio>
            </el-form-item>
            <el-form-item>
              <div v-show="!idFlag" class="btn">
                <el-button type="primary" v-show="postForm.state=='true'" @click="submitPost(2)">发布</el-button>
                <el-button type="primary" v-show="postForm.state=='false'" @click="submitPost(1)">保存</el-button>
                <el-button @click="reset">重置</el-button>
              </div>
              <el-button type="primary" v-show="idFlag" @click="editPost">修改</el-button>
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
import { addPost, getPostById, putPostById } from "../../api/post/post";
export default {
  inject:['reload'],
  data() {
    return {
      breadcrumb: ["文章管理", "写文章"],
      postForm: {
        title: "",
        content: "",
        cover: "",
        author: "",
        categories: "",
        state: "false"
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
      saveFile: "",
      fileList: [{ url: "" }],
      isFile: true,
      idFlag: ""
    };
  },
  methods: {
    coverSuccess(res, file) {
      this.saveFile = file;
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
      if (file.response) {
        let data = await deleteCover(file.response.data);
        if (data.meta.status == 200) {
          this.$message.success(data.meta.msg);
        } else {
          this.$message.error(data.meta.msg);
        }
      } else {
        let p = file.url.split("localhost")[1].split("/")[1];
        let data = await deleteCover(p);
        if (data.meta.status == 200) {
          this.$message.success(data.meta.msg);
        } else {
          this.$message.error(data.meta.msg);
        }
      }
    },
    preview(file) {
      this.prePic = true;
      this.url = "http://localhost/" + file.response.data;
    },
    submitPost(flag) {
      this.$refs.postForm.validate(async valida=>{
        if(valida){
          if (flag == 2) {
            this.postForm.uploadDate = Date.now();
            let data = await addPost(this.postForm);
            if (data.meta.status == 200) {
              this.$message.success(data.meta.msg);
              this.$refs.postForm.resetFields();
              this.$refs.upload.clearFiles();
              this.fileList=[]
              this.postForm.categories = "";
              this.postForm.state = "false";
              delete this.postForm.uploadDate
            } else {
              this.$message.error(data.meta.msg);
            }
          } else {
            let data = await addPost(this.postForm);
            if (data.meta.status == 200) {
              this.$message.success(data.meta.msg);
              this.$refs.postForm.resetFields();
              this.$refs.upload.clearFiles();
              this.fileList=[]
              this.postForm.categories = "";
              this.postForm.state = "false";
            } else {
              this.$message.error(data.meta.msg);
            }
          }
        }else{
          this.$message.error('格式错误')
          return false
        }
      })
    },
    reset() {
      this.$refs.postForm.resetFields();
      this.$refs.upload.clearFiles();
      this.postForm.categories = "";
      this.postForm.state = "false";
      this.removeCover(this.saveFile);
    },
    async getPostId(id) {
      let data = await getPostById(id);
      if (data.meta.status == 200) {
        this.postForm.title = data.data.title;
        this.postForm.content = data.data.content;
        this.fileList[0].url = "http://localhost/" + data.data.cover;
        this.postForm.author = data.data.author;
        this.postForm.categories = data.data.categories;
        this.postForm.state = data.data.state.toString();
      }
    },
    editPost() {
      this.$refs.postForm.validate(async valida=>{
        if(valida){
          if(this.postForm.cover==''){
            this.postForm.cover=this.fileList[0].url.split('localhost')[1].split('/')[1]
          }
          let data = await putPostById(this.idFlag, this.postForm,'');
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.reload()
            this.$store.commit('initActive','/post')
            this.$router.push('/post')
          } else {
            this.$message.error(data.meta.msg);
          }
        }else{
          this.$message.error('格式错误')
          return false
        }
      })
    }
  },
  async created() {
    this.postForm.author = this.$store.state.userId;
    this.getCate();
    let flag = location.hash.split("=")[1] ? location.hash.split("=")[1] : "";
    this.idFlag = flag;
    if (flag != "") {
      this.getPostId(flag);
      this.isFile = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 30px;
}
.btn {
  width: 300px;
}
</style>