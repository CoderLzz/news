<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
    props:['breadcrumb']
}
</script>
