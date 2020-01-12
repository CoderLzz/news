<template>
  <div>
    <el-card>
        <breadcrumb :breadcrumb="breadcrumb"></breadcrumb>
        <el-table :data="rightsList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column prop="rightName" label="权限名称"></el-table-column>
        </el-table>
    </el-card>
  </div>
</template>

<script>
import {getAllRights} from '../../api/rights/rights'
export default {
    data() {
        return {
            rightsList:[],
            breadcrumb:['权限管理','权限列表']
        }
    },
    created(){
        this.getRights()
    },
    methods: {
        async getRights(){
            let data=await getAllRights()
            if(data.meta.status==200){
                this.rightsList=data.data
            }else{
                this.$message.error(data.meta.msg)
            }
        }
    },
}
</script>