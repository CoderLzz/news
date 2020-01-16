<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请输入评论者"
            v-model="query.searchValue"
            clearable
            @clear="getComment(query)"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchComment"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <Table :columns="columns" :data="commentData" border disabled-hover>
        <template slot-scope="scope" slot="author">{{scope.row.author}}</template>
        <template slot-scope="scope" slot="createDate">{{scope.row.createDate|formdate}}</template>
        <template slot-scope="scope" slot="article">{{scope.row.article==null?'该文章以删除':scope.row.article.title}}</template>
        <template slot-scope="scope" slot="active">
          <el-button
            type="primary"
            size="mini"
            class="el-icon-edit"
            @click="showEditComment(scope.row._id)"
          >&nbsp;编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="deleteComment(scope.row._id)"
          >&nbsp;删除</el-button>
        </template>
      </Table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="query.page"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="query.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 编辑评论弹出框 -->
      <el-dialog title="编辑评论" :visible.sync="editCommentDialog" width="50%">
        <div class="author">
          <p>评论者：</p>
          {{username}}
        </div>
        <div class="comment">
          <p>评论内容：</p>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="commentTextarea"
            class="commentTextarea"
            autosize
          ></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCommentDialog = false">取 消</el-button>
          <el-button type="primary" @click="editComment">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getAllComment,
  getCommentById,
  putCommentById,
  deleteCommentById
} from "../../api/comment/comment";
export default {
  data() {
    return {
      breadcrumb: ["评论管理", "评论列表"],
      query: {
        searchValue: "",
        size: 5,
        page: 1
      },
      commentData: [],
      columns: [
        {
          type: "index",
          title: "#",
          width: "50px"
        },
        {
          title: "评论者",
          slot: "author"
        },
        {
          title: "评论内容",
          key: "content",
          tooltip: true
        },
        {
          title: "评论时间",
          slot: "createDate"
        },
        {
          title: "评论文章",
          slot: "article"
        },
        {
          title: "操作",
          slot: "active"
        }
      ],
      total: 0,
      editCommentDialog: false,
      commentTextarea: "",
      username: "",
      commentId: ""
    };
  },
  created() {
    this.getComment(this.query);
  },
  methods: {
    async getComment(params) {
      let data = await getAllComment(params);
      if (data.meta.status == 200) {
        this.commentData = data.data.records;
        this.total = data.data.total;
      }
    },
    handleSizeChange(size) {
      this.query.size = size;
      this.getComment(this.query);
    },
    handleCurrentChange(page) {
      this.query.page = page;
      this.getComment(this.query);
    },
    searchComment() {
      this.getComment(this.query);
    },
    async showEditComment(id) {
      this.commentId = id;
      this.editCommentDialog = true;
      let data = await getCommentById(id);
      if (data.meta.status == 200) {
        this.username = data.data.author;
        this.commentTextarea = data.data.content;
      }
    },
    async editComment() {
      let data = await putCommentById(this.commentId, this.commentTextarea);
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.getComment(this.query);
        this.editCommentDialog = false;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    deleteComment(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let data=await deleteCommentById(id)
          if(data.meta.status==200){
              this.$message.success(data.meta.msg)
              this.getComment(this.query)
          }else{
              this.$message.error(data.meta.msg)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
};
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.comment {
  margin-top: 20px;
  display: flex;
  p {
    width: 100px;
    padding-top: 10px;
  }
}
.author {
  display: flex;
  p {
    width: 100px;
  }
}
</style>