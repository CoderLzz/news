<template>
  <div id="app">
    <router-view v-if="flag"></router-view>
  </div>
</template>

<script>
export default {
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      flag:true
    }
  },
  methods: {
    reload(){
      this.flag=false
      this.$nextTick(function(){
        this.flag=true
      })
    }
  },
}
</script>

<style>

</style>
