<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row :gutter="100">
        <el-col :span="8">
          <el-form :model="swiperForm" :rules="swiperFormRule" ref="swiperForm" label-width="100px">
            <el-form-item label="轮播图片：">
              <el-upload
                action="http://localhost/privates/swiper/pic"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                list-type="picture"
                :headers="headers"
                ref="upload"
              >
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
            <el-form-item label="文本标题：" prop="title">
              <el-input v-model="swiperForm.title"></el-input>
            </el-form-item>
            <el-form-item label="链接：" prop="link">
              <el-input v-model="swiperForm.link"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addSwiper">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="15">
          <Table :columns="columns" :data="swiperData" border disabled-hover>
            <template slot-scope="scope" slot="pic">
              <img :src="'http://localhost'+scope.row.swiper" class="lbt" />
            </template>
            <template slot="link" slot-scope="scope">{{scope.row.link.title}}</template>
            <template slot="active" slot-scope="scope">
              <el-button
                type="danger"
                class="el-icon-delete"
                size="mini"
                @click="deleteSwiper(scope.row)"
              >&nbsp;删除</el-button>
            </template>
          </Table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  deleteSwiperPic,
  addOneSwiper,
  getAllSwiper,
  deleteSwiperById
} from "../../api/set/swiper";
export default {
  data() {
    return {
      breadcrumb: ["设置", "轮播图设置"],
      swiperForm: {
        swiper: "",
        title: "",
        link: ""
      },
      swiperFormRule: {
        title: [{ required: true, message: "请输入文本标题", trigger: "blur" }],
        link: [{ required: true, message: "请输入链接", trigger: "blur" }]
      },
      headers: {
        Authorization: window.localStorage.getItem("token")
      },
      swiperData: [],
      columns: [
        {
          title: "图片",
          slot: "pic"
        },
        {
          title: "文本",
          key: "title"
        },
        {
          title: "链接文章",
          slot: "link"
        },
        {
          title: "操作",
          slot: "active"
        }
      ]
    };
  },
  methods: {
    handleSuccess(response, file) {
      if (response.meta.status == 200) {
        this.swiperForm.swiper = response.data;
      }
    },
    async handleRemove(file) {
      let data = await deleteSwiperPic(file.response.data);
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.swiperForm.swiper = "";
      }
    },
    addSwiper() {
      this.$refs.swiperForm.validate(async valida => {
        if (valida) {
          let data = await addOneSwiper(this.swiperForm);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.$refs.swiperForm.resetFields();
            this.$refs.upload.clearFiles();
            this.getSwiper();
          }
        } else {
          this.$message.error("格式错误");
        }
      });
    },
    async getSwiper() {
      let data = await getAllSwiper();
      if (data.meta.status == 200) {
        this.swiperData = data.data;
      }
    },
    deleteSwiper(params) {
      this.$confirm("此操作将删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = await deleteSwiperById(params._id);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getSwiper();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  created() {
    this.getSwiper();
  }
};
</script>

<style lang="less" scoped>
.lbt {
  width: 120px;
  margin-top: 5px;
}
</style>