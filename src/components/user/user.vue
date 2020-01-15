<template>
  <div>
    <el-card>
      <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入查询条件" v-model="username" clearable @clear="search">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <Table :columns="columns" :data="userData" border disabled-hover>
        <template slot="action" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            class="el-icon-edit"
            @click="showEditDialog(scope.row)"
          >&nbsp;编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            class="el-icon-delete"
            @click="deleteUser(scope.row._id)"
          >&nbsp;删除</el-button>
          <el-button
            type="warning"
            size="mini"
            class="el-icon-setting"
            @click="branchRole(scope.row._id)"
          >&nbsp;分配角色</el-button>
        </template>
        <template slot="avatar" slot-scope="scope">
          <el-avatar size="large" :src="'http://localhost'+scope.row.avatar"></el-avatar>
          <!-- <button @click="test(scope.row.avatar)">按钮</button> -->
        </template>
        <template slot="role" slot-scope="scope">
          <el-tag v-if="scope.row.role.code=='0'">超级管理员</el-tag>
          <el-tag v-else-if="scope.row.role.code=='1'">作者</el-tag>
          <el-tag v-else>普通用户</el-tag>
        </template>
        <template slot="isActive" slot-scope="scope">
          <el-switch v-model="scope.row.isActive" @change="changActive(scope.row)"></el-switch>
        </template>
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
      <!-- 编辑弹出框 -->
      <el-dialog title="编辑用户信息" :visible.sync="editDialog" width="50%" @close="closeEditDialog">
        <el-form :model="editUserForm" :rules="editUserRules" ref="editUserForm" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <Upload
              ref="upload"
              :on-success="handleSuccess"
              :on-preview="handlePreview"
              :format="['jpg','jpeg','png']"
              :max-size="2048"
              :on-format-error="handleFormatError"
              :on-exceeded-size="handleMaxSize"
              :action="url"
              style="display: flex;"
              :headers="headers"
              type="drag"
            >
              <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="ios-camera" size="20"></Icon>
              </div>
            </Upload>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色弹出框 -->
      <el-dialog title="分配角色" :visible.sync="branchRoleDialog" width="50%">
        <p>用户名：{{roleUsername}}</p>
        <div class="select">
          角色：
          <el-select v-model="selectValue" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item._id"
              :label="item.roleName"
              :value="item.code"
            ></el-option>
          </el-select>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="branchRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getUser,
  putUserById,
  getUserById,
  deleteUserById
} from "../../api/user/user";
import { getAllRole, putRoleById } from "../../api/rights/rights";
export default {
  data() {
    var checkEmail = (rule, value, callback) => {
      const emailReg = /^([0-9A-Za-z\-_\.]+)@([0-9a-z]+\.[a-z]{2,3}(\.[a-z]{2})?)$/;
      if (emailReg.test(value)) {
        callback();
      } else {
        callback(new Error("邮箱不合法"));
      }
    };
    return {
      breadcrumb: ["用户管理", "用户列表"],
      url: "",
      userData: [],
      columns: [
        {
          title: "#",
          type: "index",
          width: "50px"
        },
        {
          title: "头像",
          slot: "avatar",
          width: "80px"
        },
        {
          title: "用户名",
          key: "username"
        },
        {
          title: "邮箱",
          key: "email",
          width: "200px"
        },
        {
          title: "角色",
          slot: "role"
        },
        {
          title: "是否激活",
          slot: "isActive",
          width: "100px"
        },
        {
          title: "注册日期",
          slot: "createDate",
          width: "200px"
        },
        {
          title: "操作",
          slot: "action",
          width: "300px"
        }
      ],
      username: "",
      query: {
        selectQuery: "",
        currentPage: 1,
        size: 5
      },
      total: 0,
      editDialog: false,
      editUserForm: {
        username: "",
        email: "",
        id: ""
      },
      editUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 6,
            message: "用户名长度必须在2到6之间",
            trigger: "blur"
          }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            trigger: "blur"
          }
        ]
      },
      headers: {
        Authorization: window.localStorage.getItem("token")
      },
      branchRoleDialog: false,
      roleUsername: "",
      selectValue: "",
      roleList: [],
      roleId: ""
    };
  },
  created() {
    this.getAllUser(this.query);
  },
  methods: {
    async changActive(params) {
      let data = await putUserById(params._id, params.isActive, "isActive");
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    async getAllUser(params) {
      let data = await getUser(params);
      if (data.meta.status == 200) {
        this.userData = data.data.records;
        this.size = data.data.size;
        this.currentPage = data.data.page;
        this.total = data.data.total;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    handleSizeChange(params) {
      this.query.size = params;
      this.getAllUser(this.query);
    },
    handleCurrentChange(params) {
      this.query.currentPage = params;
      this.getAllUser(this.query);
    },
    search() {
      this.query.selectQuery = this.username;
      this.getAllUser(this.query);
    },
    async showEditDialog(params) {
      this.editDialog = true;
      let data = await getUserById(params._id);
      if (data.meta.status == 200) {
        this.editUserForm.username = data.data.username;
        this.editUserForm.email = data.data.email;
        this.editUserForm.id = data.data._id;
        this.url = `http://localhost/privates/user/${data.data._id}/upload`;
      } else {
        this.$message.error(data.meta.msg);
      }
    },
    handleSuccess(response, file, fileList) {
      if (response.meta.status == 200) {
        this.$message.success(response.meta.msg);
        this.getAllUser(this.query);
      } else {
        this.$message.error(response.meta.msg);
      }
    },
    handleFormatError() {},
    handleMaxSize() {},
    handlePreview() {},
    editUser() {
      this.$refs.editUserForm.validate(async valida => {
        if (valida) {
          let data = await putUserById(
            this.editUserForm.id,
            {
              username: this.editUserForm.username,
              email: this.editUserForm.email
            },
            "info"
          );
          if (data.meta.status == 200) {
            this.getAllUser(this.query);
            this.$message.success(data.meta.msg);
          } else {
            this.$message.error(data.meta.msg);
          }
          this.editDialog = false;
        }else{
          this.$message.error('格式错误')
          return false
        }
      });
    },
    closeEditDialog() {
      this.$refs.editUserForm.resetFields();
      this.$refs.upload.clearFiles();
    },
    deleteUser(id) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let data = await deleteUserById(id);
          if (data.meta.status == 200) {
            this.getAllUser(this.query);
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
    async branchRole(id) {
      this.roleId = id;
      this.branchRoleDialog = true;
      let data1 = await getUserById(id);
      let data2 = await getAllRole();
      if (data1.meta.status == 200) {
        this.roleUsername = data1.data.username;
        this.selectValue = data1.data.role.roleName;
      } else {
        this.$message.error(data1.meta.msg);
      }
      if (data2.meta.status == 200) {
        this.roleList = data2.data;
      } else {
        this.$message.error(data2.meta.msg);
      }
    },
    async editRole() {
      let data = await putRoleById(this.roleId, {
        selectValue: this.selectValue
      });
      if (data.meta.status == 200) {
        this.$message.success(data.meta.msg);
        this.branchRoleDialog = false;
        this.getAllUser(this.query);
      } else {
        this.$message.error(data.meta.msg);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.el-table {
  font-size: 13px;
}
.el-row {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
}
.select {
  margin-top: 20px;
}
</style>