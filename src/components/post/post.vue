<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入文章标题" v-model="query.searchPost" clearable @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <Table :columns="columns" :data="postData" border disabled-hover>
        <template slot="author" slot-scope="scope">{{scope.row.author.username}}</template>
        <template slot="cate" slot-scope="scope">{{scope.row.categories.cateName}}</template>
        <template slot="createDate" slot-scope="scope">{{scope.row.createDate|formdate}}</template>
        <template slot-scope="scope" slot="active">
          <el-button type="primary" size="mini" class="el-icon-edit" @click="editPost(scope.row._id)">&nbsp;编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete">&nbsp;删除</el-button>
        </template>
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
import { getAllPost } from "../../api/post/post";
export default {
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
          width:'300px'
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
          title: "发布时间",
          slot: "createDate",
          width: "200px"
        },
        {
          title: "点赞量",
          key: "praise"
        },
        {
          title: "阅读量",
          key: "read"
        },
        {
          title: "评论数量",
          key: "comment"
        },
        {
          title: "操作",
          slot: "active",
          width: "200px"
        }
      ],
      query:{
         searchPost:'',
         size:5,
         currentPage:1
      },
      total:0
    };
  },
  methods: {
    async getPost(params) {
      let data = await getAllPost(params);
      if (data.meta.status == 200) {
        this.postData = data.data.records;
        this.total=data.data.total
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    handleSizeChange(size){
        this.query.size=size
        this.getPost(this.query)
    },
    handleCurrentChange(page){
        this.query.currentPage=page
        this.getPost(this.query)
    },
    search(){
        this.getPost(this.query)
    },
    clearSearch(){
        this.getPost(this.query)
    },
    editPost(id){
        // this.$store.commit('initActive','/write')
        this.$router.push({path:'/write',query:{flag:id}})
    }
  },
  created() {
    this.getPost(this.query);
  }
};
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
}
.el-pagination{
    margin-top: 20px;
}
</style>