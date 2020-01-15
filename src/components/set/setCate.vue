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
              <el-button type="primary" @click="addCate">添加</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="14" class="secondCol">
          <el-button type="warning" size="mini" class="deleteMany" @click="deleteMany">批量删除</el-button>
          <Table
            :columns="columns"
            :data="cateData"
            border
            disabled-hover
            @on-select="collectCate"
            @on-select-all="collectAll"
          >
            <template slot="active" slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                class="el-icon-edit"
                @click="editCate(scope.row._id)"
              >&nbsp;编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                class="el-icon-delete"
                @click="deleteCate(scope.row._id)"
              >&nbsp;删除</el-button>
            </template>
            <template slot-scope="scope" slot="cateIcon">
              <i :class="'fa '+scope.row.cateIcon"></i>
            </template>
          </Table>
        </el-col>
      </el-row>
      <!-- 编辑弹出框 -->
      <el-dialog title="编辑分类" :visible.sync="showCateDialog" width="50%">
        <el-form :model="editCateForm" :rules="editCateRules" ref="editCateForm" label-width="80px">
          <el-form-item label="分类名称" prop="cateName">
            <el-input v-model="editCateForm.cateName"></el-input>
          </el-form-item>
          <el-form-item label="图标类名" prop="cateIcon">
            <el-input v-model="editCateForm.cateIcon"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showCateDialog = false">取 消</el-button>
          <el-button type="primary" @click="editCategories">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getAllCate } from "../../api/post/getCate";
import {
  addOneCate,
  getCateById,
  putCateById,
  deletCateById,
  deleteManyCate
} from "../../api/set/setting";
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
          width: "60px"
        },
        {
          title: "分类名称",
          key: "cateName"
        },
        {
          title: "分类图标",
          slot: "cateIcon"
        },
        {
          title: "操作",
          slot: "active"
        }
      ],
      showCateDialog: false,
      editCateForm: {
        cateName: "",
        cateIcon: ""
      },
      editCateRules: {
        cateName: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 3, min: 3, message: "分类名称必须三个字", trigger: "blur" }
        ],
        cateIcon: [
          { required: true, message: "请输入分类图标的类名", trigger: "blur" }
        ]
      },
      cateId: "",
      selectionArr: []
    };
  },
  created() {
    this.getCate();
  },
  methods: {
    async getCate() {
      let data = await getAllCate();
      if (data.meta.status == 200) {
        this.cateData = data.data;
      }
    },
    addCate() {
      this.$refs.cateForm.validate(async flag => {
        if (flag) {
          let data = await addOneCate(this.cateForm);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getCate();
            this.$refs.cateForm.resetFields();
          } else {
            this.$message.error(data.meta.msg);
          }
        } else {
          this.$message.error("格式不正确");
          return false;
        }
      });
    },
    async editCate(id) {
      this.showCateDialog = true;
      this.cateId = id;
      let data = await getCateById(id);
      if (data.meta.status == 200) {
        this.editCateForm.cateName = data.data.cateName;
        this.editCateForm.cateIcon = data.data.cateIcon;
      }
    },
    editCategories() {
      this.$refs.editCateForm.validate(async valida => {
        if (valida) {
          this.editCateForm.updateDate = Date.now();
          let data = await putCateById(this.cateId, this.editCateForm);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getCate();
            this.showCateDialog = false;
          } else {
            this.$message.error(data.meta.msg);
          }
        } else {
          this.$message.error("格式错误");
          return false;
        }
      });
    },
    deleteCate(id) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = await deletCateById(id);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getCate();
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
    async deleteMany() {
      let data = await deleteManyCate(this.selectionArr);
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.getCate();
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    collectCate(selection, row) {
      this.selectionArr = selection;
    },
    collectAll(selection) {
      this.selectionArr = selection;
    }
  }
};
</script>

<style lang="less" scoped>
.deleteMany {
  margin-bottom: 10px;
}
</style>