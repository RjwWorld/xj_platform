<template>
  <div>
    <div class="audio-top-box">
      <div class="top-nav-box">
        <p class="nav-left-box">
          <span class="nav nav1" @click="goto('/annotationPlatform')">标注平台</span>
          <span>/</span>
          <span class="nav nav2" @click="goDetails()">任务详细</span>
          <span>/</span>
          <span class="nav nav3">{{routerName}}</span>
          <span class="task-control" @click="goTasks()">任务管理</span>
        </p>
        <p class="nav-right-box">
          <span><img :src="userHeaderIcon" alt="" class="user-icon"></span>
          <span class="user-id">{{userId}}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        userHeaderIcon:require('../../../assets/images/user_center/user_msg.png'),
        routerName:'',
        userId:'',
      }
    },
    methods: {
      goto(path) {
        this.$router.push({path:path})
      },
      goDetails(){
        this.$router.push({
          path:'/platformDetails',
          query:{
            task_uuid:this.$route.query.task_uuid
          }
        })
      },
      goTasks(){
        this.$router.push({
          path:'/tasks',
          query:{task_uuid:this.$route.query.task_uuid}
        })
      }
    },
    created(){
      axios.get('/api/v1.0/task/taskInfo',{params:{task_uuid:this.$route.query.task_uuid}}).then((response)=>{
        if(response.status===200){
          this.routerName=response.data.task_name;
          this.userId=response.data.user_name;
        }
      }).catch(error=>{
        if (error && error.response){
          switch (error.response.status) {
            case 500:
              this.$router.push({path:'/errorFive'})
              break;
            case 405:
              this.$router.push({path:'/blacklist'})
              break;
            case 403:
              this.$message.error('您没有权限访问！')
              break;
            case 404:
              this.$router.push({path:'/notFound'})
              break;
            case 540:
              this.$message.error('您的账号已在其他地方登陆！');
              setTimeout(function () {
                // top.location.href = 'http://203.57.237.227:8890/#/login'
                top.location.href = 'http://192.168.74.136:8000/#/login'
              }, 3000);
              break;
            default:
              this.$message.error('服务器走神了')
          }
        }
      })
    }
  }
</script>

<style scoped>
  .audio-top-box{
    display: flex;
    width: 100%;
    -webkit-background-size: cover;
    background-size: cover;
    height: .3rem;
    background-color: #c2e9ff;
    box-shadow: 0 0.03rem 0.03rem #ddd;
    margin: 0 auto;
  }

  .top-nav-box{
    width: 10.8rem;
    line-height: .3rem;
    margin: auto;
    font-size: .14rem;
    letter-spacing: 0.02rem;
    position: relative;
  }
  .nav-left-box{
    float: left;
  }
  .nav-right-box{
    float: right;
  }
  .user-icon{
    vertical-align: middle;
    cursor: pointer;
  }
  .user-id{
    vertical-align: middle;
    cursor: pointer;
  }
  .nav{
    cursor: pointer;
  }
  .nav1,.nav2{
    color: #5cb4fc;
  }
  /*任务管理*/
  .task-control{
    position: absolute;
    left: 50%;
    top: 0;
    margin-left: -0.4rem;
    color: #1084e3;
    cursor: pointer;
    font-size: .14rem;
    text-decoration: underline;
  }
</style>
