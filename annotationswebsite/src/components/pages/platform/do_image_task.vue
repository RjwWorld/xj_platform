<template>
  <div>
    <taskNav></taskNav>
    <div class="title-box">
      <p class="task-top-lf">请为下面的文本选出符合命题的选项：</p>
      <p class="task-top-ri">当前第
        <span class="red-text">{{txtTaskArr.nowTask}}</span>
        题(共<span class="red-text">{{txtTaskArr.taskTotal}}</span>题) 准确率为
        <span class="red-text">{{txtTaskArr.sureRate}}</span>
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import taskNav from './task_nav'
  export default {
    components:{
      taskNav,
    },
    data() {
      return {
        txtTaskArr: {
          nowTask:'1',
          taskTotal:'200',
          sureRate:'100%'
        },
      }
    },
    methods: {
      // emitForm() {
      //   let params=this.$qs.stringify({
      //     'isSame':this.ruleForm.isSame,
      //     'emotion':this.ruleForm.emotion,
      //     'voice':this.ruleForm.voice,
      //     'content':this.ruleForm.content,
      //   });
      //   axios.post('/api/v1.0/doImage/',params).then((response)=>{
      //     if(response.status===200){
      //       this.$message({
      //         message:'提交成功',
      //         type:'success'
      //       })
      //     }
      //   }).catch(error=>{
      //     if (error && error.response){
      //       switch (error.response.status) {
      //         case 500:
      //           this.$router.push({path:'/errorFive'})
      //           break;
      //         case 405:
      //           this.$router.push({path:'/blacklist'})
      //           break;
      //         case 403:
      //           this.$message.error('您没有权限访问！')
      //           break;
      //         case 404:
      //           this.$router.push({path:'/notFound'})
      //           break;
      //         case 540:
      //           this.$message.error('您的账号已在其他地方登陆！');
      //           setTimeout(function () {
      //             top.location.href = 'http://203.57.237.227:8890/#/login'
      //           }, 3000);
      //           break;
      //         default:
      //           this.$message.error('服务器走神了')
      //       }
      //     }
      //   })
      // }
    },
  }
</script>

<style scoped>
  .title-box{
    width: 10.80rem;
    height: .30rem;
    margin: auto;
    margin-top: .66rem;
  }
  /*内容*/
  .task-top-lf{
    float: left;
    font-size: .16rem;
    letter-spacing: 0.03rem;
  }
  .task-top-ri{
    float: right;
    font-size: .14rem;
    letter-spacing: 0.03rem;
  }
  .red-text{
    color: #ff7777;
  }

  textarea{
    border: none;
  }

</style>
