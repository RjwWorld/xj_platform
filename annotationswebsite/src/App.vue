<template>
  <div id="app">
    <pcHeader v-show="errorSite"></pcHeader>
    <router-view v-if="isRouterAlive"></router-view>
    <pcFooter v-show="errorSite"></pcFooter>
  </div>
</template>

<script>
  import pcHeader from './components/pages/pc_header'
  import pcFooter from './components/pages/pc_footer'
export default {
  name: 'App',
  provide(){
    return {
      reload:this.reload
    }
  },
  data() {
    return {
      errorSite:true,
      isRouterAlive : true
    }
  },
  components:{
    pcHeader,
    pcFooter
  },
  created(){
    if(
        (this.$route.name==='errorFive')||
        (this.$route.name==='tasks')||
        (this.$route.name==='doTxtTask')||
        (this.$route.name==='doVideoTask')||
        (this.$route.name==='blacklist')||
        (this.$route.name==='notFound')||
        (this.$route.name==='doTasks')
      ) {
      this.errorSite=false
    }

  },
  methods: {
    reload() {
      this.isRouterAlive =false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      })
    }
  },
  watch:{
    $route(e){
      if((e.name==='errorFive')|| (e.name==='tasks')||(e.name==='doTasks')||
        (e.name==='doTxtTask')||(e.name==='doVideoTask')||(e.name==='blacklist')||(e.name==='notFound')) {
        this.errorSite=false
      }else{
        this.errorSite=true
      }
    }
  }
}
</script>

<style>
  @import "./assets/css/common.css";
</style>
