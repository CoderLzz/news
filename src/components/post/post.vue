<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入文章标题" v-model="query.searchPost" clearable @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-select v-model="query.postCate" placeholder="请选择文章分类" clearable @clear="getPost(query)" @change="getPost(query)">
            <el-option
              v-for="item in postCateData"
              :key="item._id"
              :label="item.cateName"
              :value="item._id"
            ></el-option>
          </el-select>
          <el-select v-model="query.postState" placeholder="请选择文章状态" class="middle" clearable @clear="getPost(query)" @change="getPost(query)">
            <el-option
              v-for="item in postStateData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <Table :columns="columns" :data="postData" border disabled-hover>
        <template slot="author" slot-scope="scope">{{scope.row.author.username}}</template>
        <template slot="cate" slot-scope="scope">{{scope.row.categories.cateName}}</template>
        <template
          slot="uploadDate"
          slot-scope="scope"
          v-if="scope.row.uploadDate"
        >{{scope.row.uploadDate|formdate}}</template>
        <template slot-scope="scope" slot="active">
          <el-button
            type="primary"
            size="mini"
            class="el-icon-edit"
            @click="editPost(scope.row._id)"
          >&nbsp;编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="deletePost(scope.row._id)"
          >&nbsp;删除</el-button>
          <el-button
            type="warning"
            size="mini"
            class="el-icon-setting"
            v-if="!scope.row.state"
            @click="uploadPost(scope.row)"
          >&nbsp;发布</el-button>
        </template>
        <template slot-scope="scope" slot="upload">{{scope.row.state?'已发布':'未发布'}}</template>
        <template slot-scope="scope" slot="createDate">{{scope.row.createDate|formdate}}</template>
      </Table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.currentPage"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getAllPost, putPostById, deletePost,getScreen } from "../../api/post/post";
import {getAllCate} from '../../api/post/getCate'
export default {
  inject: ["reload"],
  data() {
    return {
      breadcrumb: ["文章管理", "文章列表"],
      searchPost: "",
      postData: [],
      columns: [
        {
          type: "index",
          title: "#",
          width: "50px"
        },
        {
          title: "文章标题",
          key: "title",
          width: "100px",
          tooltip: true
        },
        {
          title: "作者",
          slot: "author"
        },
        {
          title: "文章分类",
          slot: "cate"
        },
        {
          title: "是否发布",
          slot: "upload"
        },
        {
          title: "发布时间",
          slot: "uploadDate",
          width: "160px"
        },
        {
          title: "创建时间",
          slot: "createDate",
          width: "160px"
        },
        {
          title: "点赞量",
          key: "praise",
          width: "80px"
        },
        {
          title: "阅读量",
          key: "read",
          width: "80px"
        },
        {
          title: "评论量",
          key: "comment",
          width: "80px"
        },
        {
          title: "操作",
          slot: "active",
          width: "270px"
        }
      ],
      query: {
        searchPost: "",
        size: 5,
        currentPage: 1,
        postCate:'',
        postState:'',
      },
      total: 0,
      postCateData:[],
      postStateData:[
        {label:'未发布',value:false},
        {label:'已发布',value:true}
      ]
    };
  },
  methods: {
    async getPost(params) {
      let data = await getAllPost(params);
      if (data.meta.status == 200) {
        console.log(data);
        this.postData = data.data.records;
        this.total = data.data.total;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    handleSizeChange(size) {
      this.query.size = size;
      this.getPost(this.query);
    },
    handleCurrentChange(page) {
      this.query.currentPage = page;
      this.getPost(this.query);
    },
    search() {
      this.getPost(this.query);
    },
    clearSearch() {
      this.getPost(this.query);
    },
    editPost(id) {
      this.$store.commit("initActive", "/write");
      this.reload();
      this.$router.push({ path: "/write", query: { flag: id } });
    },
    async uploadPost(params) {
      let data = await putPostById(params._id, !params.state, "state");
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.getPost(this.query);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    deletePost(id) {
      this.$confirm("此操作将删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = await deletePost(id);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getPost(this.query);
          } else {
            this.$message.error(data.meta.msg);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async getSearch(){
      let data=await getAllCate()
      if(data.meta.status==200){
        this.postCateData=data.data
      }else{
        this.$message.error(data.meta.msg)
      }
    },
    // async screen(){
    //   let data=await getScreen(this.postCate,this.postState,this.query)
    //   if(data.meta.status==200){
    //     this.postData=data.data.records
    //     this.total=data.data.total
    //   }
    // }
  },
  created() {
    this.getPost(this.query);
    this.getSearch()
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.el-button {
  width: 70px;
  padding: 7px 10px;
}
.middle{
  margin: 0 10px;
}
</style>