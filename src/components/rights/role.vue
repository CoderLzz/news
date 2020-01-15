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
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              class="el-icon-edit"
              @click="showEditRoleDialog(scope.row._id)"
            >&nbsp;编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              class="el-icon-delete"
              @click="deleteRole(scope.row._id)"
            >&nbsp;删除</el-button>
            <el-button
              type="warning"
              size="mini"
              class="el-icon-setting"
              @click="showBranchRights(scope.row._id)"
            >&nbsp;分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色弹出框 -->
      <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="closeDialog">
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
      <!-- 编辑角色弹出框 -->
      <el-dialog title="编辑角色" :visible.sync="editRoleDialog" width="50%" @close="closeDialog2">
        <el-form
          :model="editRoleForm"
          :rules="editRoleFormRules"
          ref="editRoleForm"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editRoleForm.roleName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限弹出框 -->
      <el-dialog title="分配权限" :visible.sync="branchRights" width="30%">
        <el-tree
          :data="rightsData"
          :props="defaultProps"
          show-checkbox
          node-key="_id"
          :default-checked-keys="checkArr"
          ref="rightsTree"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="branchRights = false">取 消</el-button>
          <el-button type="primary" @click="branch">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getAllRole,
  putRoleRights,
  postAddRole,
  getRoleById,
  putRoleName,
  deleteRoleById,
  getAllRights
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
      },
      editRoleDialog: false,
      editRoleForm: {
        roleName: ""
      },
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      roleId: "",
      branchRights: false,
      rightsData: [],
      defaultProps: {
        label: "rightName"
      },
      checkArr: []
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
    addRole() {
      this.$refs.addRoleForm.validate(async valida => {
        if (valida) {
          let data = await postAddRole(this.addRoleForm);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
          }
          this.addRoleDialog = false;
          this.getRole();
        } else {
          this.$message.error("格式错误");
          return false;
        }
      });
    },
    async showEditRoleDialog(id) {
      this.editRoleDialog = true;
      this.roleId = id;
      let data = await getRoleById(id);
      if (data.meta.status == 200) {
        this.editRoleForm.roleName = data.data.roleName;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    editRole() {
      this.$refs.editRoleForm.validate(async valida => {
        if (valida) {
          let data = await putRoleName(this.roleId, this.editRoleForm);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.editRoleDialog = false;
            this.getRole();
          } else {
            this.$message.error(data.meta.msg);
          }
        }else{
          this.$message.error('格式错误')
          return false
        }
      });
    },
    closeDialog() {
      this.$refs.addRoleForm.resetFields();
    },
    closeDialog2() {
      this.$refs.editRoleForm.resetFields();
    },
    deleteRole(id) {
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = await deleteRoleById(id);
          if (data.meta.status == 200) {
            this.$message.success(data.meta.msg);
            this.getRole();
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
    async showBranchRights(id) {
      this.branchRights = true;
      this.roleId = id;
      let data = await getAllRights();
      let checkRights = await getRoleById(id);
      if (data.meta.status == 200) {
        this.rightsData = data.data;
      } else {
        this.$message.error(data.meta.msg);
      }
      if (checkRights.meta.status == 200) {
        let rightsArr = [];
        checkRights.data.rights.forEach(item => {
          rightsArr.push(item._id);
        });
        this.checkArr = rightsArr;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    async branch() {
      let checked = this.$refs.rightsTree.getCheckedKeys();
      let data = await putRoleRights(this.roleId, {
        rightsList: checked
      });
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.getRole();
        this.branchRights = false;
      } else {
        this.$message.error(data.meta.msg);
      }
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