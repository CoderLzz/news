<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form :model="cateForm" :rules="cateFormRules" ref="cateForm" label-width="100px">
            <el-form-item label="分类名称" prop="cateName">
              <el-input v-model="cateForm.cateName"></el-input>
            </el-form-item>
            <el-form-item label="分类图标" prop="cateIcon">
              <el-input v-model="cateForm.cateIcon"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14">
          <Table :columns="columns" :data="cateData" border disabled-hover>
            <template slot="active" slot-scope="scope">
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
            </template>
          </Table>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {getAllCate} from '../../api/post/getCate'
export default {
  data() {
    return {
      breadcrumb: ["设置", "分类目录"],
      cateForm: {
        cateName: "",
        cateIcon: ""
      },
      cateFormRules: {
        cateName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 3, min: 3, message: "分类名称必须三个字", trigger: "blur" }
        ],
        cateIcon: [
          { required: true, message: "请输入分类图标的类名", trigger: "blur" }
        ]
      },
      cateData: [],
      columns: [
        {
          type: "selection",
          width:'60px'
        },
        {
          title: "分类名称",
          key: "cateName"
        },
        {
          title: "操作",
          slot: "active"
        }
      ]
    };
  },
  created(){
      this.getCate()
  },
  methods: {
      async getCate(){
          let data=await getAllCate()
          if(data.meta.status==200){
              this.cateData=data.data
          }
      }
  },
};
</script>