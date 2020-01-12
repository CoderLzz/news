<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-tag
              v-for="(item,index) in scope.row.rights"
              :key="index"
              closable
              @close="removeTag(scope.row,item._id)"
            >{{item.rightName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="code" label="角色代码"></el-table-column>
        <el-table-column label="操作">
          <el-button type="primary" size="mini" class="el-icon-edit">&nbsp;编辑</el-button>
          <el-button type="danger" size="mini" class="el-icon-delete">&nbsp;删除</el-button>
          <el-button type="warning" size="mini" class="el-icon-setting">&nbsp;分配权限</el-button>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹出框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%">
        <el-form
          :model="addRoleForm"
          :rules="addRoleFormRules"
          ref="addRoleForm"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色代码">
            <el-input-number v-model="addRoleForm.code" :min="1"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getAllRole,
  putRoleRights,
  postAddRole
} from "../../api/rights/rights";
export default {
  data() {
    return {
      breadcrumb: ["权限管理", "角色管理"],
      roleList: [],
      addRoleDialog: false,
      addRoleForm: {
        roleName: "",
        code: 1
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async getRole() {
      let data = await getAllRole();
      if (data.meta.status == 200) {
        this.roleList = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    removeTag(params, rightsId) {
      this.$confirm("此操作将删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let arr = [];
          let index = params.rights.findIndex(item => {
            return item._id == rightsId;
          });
          params.rights.splice(index, 1);
          params.rights.forEach(item => {
            arr.push(item._id);
          });
          let data = await putRoleRights(params._id, {
            rightsList: arr
          });
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
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
    showAddRoleDialog() {
      this.addRoleDialog = true;
    },
    async addRole() {
      let data = await postAddRole(this.addRoleForm);
      if(data.meta.status==200){
          this.$message.success(data.meta.msg)
      }
      this.addRoleDialog=false
      this.getRole()
    }
  },
  created() {
    this.getRole();
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin-right: 20px;
}
.el-row {
  margin-bottom: 20px;
}
</style>