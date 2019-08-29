<template>
  <div class="platform-details-container">
    <div class="detail-top-box">
      <div class="top-left-box">
        <p class="detail-name">{{detailTopArr.detailName}}</p>
        <p class="detail-sm-title first-sm-title"><span>任务分类： </span>{{detailTopArr.task_type}}</p>
        <p class="detail-sm-title"><span>任务大小： </span>{{detailTopArr.task_size}}</p>
        <p class="detail-sm-title"><span>接单类型： </span>{{detailTopArr.task_accept_type}}</p>
      </div>
      <div class="top-right-box">
        <p class="detail-state">{{detailTopArr.task_status}}</p>
        <p class="detail-sm-ri-title"><span>任务准确度 ： </span>{{detailTopArr.task_accurate}}</p>
        <p class="detail-sm-ri-title"><span>任务结束时间 ： </span>{{detailTopArr.task_complete_time}}</p>
        <p class="get-btn btn" @click="atOnceGet()" v-if="isActive===0">{{taskStatus}}</p>
        <p class="get-btn-after btn" v-if="isActive===1">{{taskStatus}}</p>
        <p class="get-btn btn" @click="toDoTask(detailTopArr.task_uuid)" v-if="isActive===2">{{taskStatus}}</p>
      </div>
    </div>
    <div class="detail-content-box">
      <p class="cont-tabs">
        <span v-for="(item,index) in conTabsArr" :key="index" @click="chooseTab(item.id)"
        :class="{choose:isChoosed===item.id}">
          {{item.tabName}}
        </span>
      </p>
      <div class="content-line"></div>
      <!--任务盒子-->
      <div class="mission-box" v-if="isChoosed===1">
        <p class="sample-graph-text">示例图：</p>
        <img :src="'http://192.168.74.136:8888/' + detailTopArr.task_image" alt="" class="sample-graph-img">
        <!--<img :src="'http://203.57.237.227:8888/' + de/tailTopArr.task_image" alt="" class="sample-graph-img">-->
      </div>
      <!--文档下载盒子-->
      <div class="document-download-box" v-if="isChoosed===2">
        <div class="document-item-box">
          <p class="document-item" @click="downloadDocument()">
            <span class="document-name">{{detailTopArr.task_help_txt_name}}</span>
            <span class="download-icon"><img :src="downloadIcon" alt=""></span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        uuid: '1',
        taskStatus: "",
        isChoosed:1,
        isActive:2,
        downloadIcon:require('../../../assets/images/platform/download-icon.png'),
        detailTopArr:{
          task_image:'',
        },
        conTabsArr:[
          {id:1,tabName:'任务介绍'},
          {id:2,tabName:'文档下载'},
        ],
        documentItemArr:[

        ],
      }
    },
    created() {
      axios.get('/api/v1.0/task/TaskDetail',{params:{task_uuid:this.$route.query.task_uuid}}).then((response)=>{
        if (response.status===200){
          this.detailTopArr=response.data;
          if (response.data.task_status==='竞标中') {
              if (response.data.is_active === false) {
                this.isActive = 0;
                this.taskStatus = '立即领取';
              }
              else if (response.data.is_active === true && response.data.is_annotation === true) {
                  this.isActive = 2;
                  this.taskStatus = '开始竞标';
              }
              else {
                  this.isActive = 1;
                  this.taskStatus = '已领取';
              }
          }
          else if  (response.data.task_status==='标注中') {
              this.taskStatus = '开始标注';
              this.isActive = 2
          }
          else if  (response.data.task_status==='质检中') {
              this.taskStatus = '质检中';
              this.isActive = 1
          }
          else if  (response.data.task_status==='返修中') {
              this.taskStatus = '开始返修';
              this.isActive = 2
          }
          else {
            this.taskStatus = response.data.task_status;
            this.isActive = 1;
          }

        }
      }).catch(error=>{
        if(error && error.response){
          switch (error.response.status) {
            case 403:
              this.$message.error('您尚未登陆，请先登陆！');
              setTimeout(function () {
                location.href='http://192.168.74.136:8000/#/login'
                // location.href='http://203.57.237.227:8890/#/login'
              }, 1500);
              break;
            case 500:
              this.$router.push({path:'/errorFive'});
              break;
            case 405:
              this.$router.push({path:'/blacklist'});
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
    },
    methods: {
      atOnceGet(){
        if ((this.detailTopArr.task_accept_type === "团队任务" && this.detailTopArr.role_id==='1') || this.detailTopArr.task_accept_type === "个人任务" && this.detailTopArr.role_id==='0') {
          this.isActive = 1;
          axios.get('/api/v1.0/task/competeTask/', {params: {task_uuid: this.$route.query.task_uuid}}).then((response) => {
            if (response.status === 200) {
             this.$message({
               message: '领取成功',
               type: 'success',
             });
             setTimeout(function () {
                top.location.reload();
              }, 1500);
            }
          }).catch(error => {
            if (error && error.response) {
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
        else {
          this.$message.error('您没有权限领取该项目!')
        }
      },
      toDoTask(task_uuid){
        if(this.detailTopArr.task_type === '图像标注'){
          this.$router.push({
            path:'/doImgTasks',
            query:{task_uuid, uuid: this.uuid}
          })
        }else if(this.detailTopArr.task_type === '文本标注'){
          this.$router.push({
            path:'/doTxtTask',
            query:{task_uuid, uuid: this.uuid}
          })
        }else if(this.detailTopArr.task_type === '语音标注'){
          axios.get('/api/v1.0/task/taskAudio/',{params:{task_uuid:task_uuid}}).then((response)=>{
            if(response.status===200){
                this.$router.push({
                path:'/doTasks',
                query:{task_uuid, uuid: this.uuid}
              })
            }
          }).catch(error=>{
            if(error && error.response){
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
        }else if(this.detailTopArr.task_type === '视频标注'){
          this.$router.push({
            path:'/doVideoTask',
            query:{task_uuid, uuid: this.uuid}
          })
        }

      },
      chooseTab(id) {
        id:this.conTabsArr.id;
        this.isChoosed=id;
      },
      downloadDocument(){
        // window.open("http://203.57.237.227:8890/api/v1.0/task/downloadDoc/"+"?remote_id="+this.detailTopArr.task_help_txt+"&doc_name="+this.detailTopArr.task_help_txt_name);
        window.open("http://192.168.74.136:8000/api/v1.0/task/downloadDoc/"+"?remote_id="+this.detailTopArr.task_help_txt+"&doc_name="+this.detailTopArr.task_help_txt_name);
      },
    },
  }
</script>

<style scoped>
  .platform-details-container{
    width: 10.80rem;
    margin: .95rem auto;
  }
  /*详情头部区域*/
  .detail-top-box{
    width: 100%;
    height: 2.44rem;
    background-color: #fff;
  }
  .top-left-box{
    float: left;
  }
  .top-right-box{
    float: right;
  }
  .detail-name{
    margin: .48rem 0 0 .3rem;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    font-weight: bold;
  }
  .detail-sm-title{
    font-size: .14rem;
    letter-spacing: 0.02rem;
    margin-left: .30rem;
    margin-bottom: .17rem;
  }
  .first-sm-title{
    margin-top: .29rem;
  }
  .detail-state{
    margin: .46rem .71rem .29rem 0;
    font-size: .20rem;
    letter-spacing: 0.03rem;
    color: #5cb4fc;
    font-weight: normal;
    text-align: right;
  }
  .detail-sm-ri-title{
    margin: 0 .71rem .17rem 0;
    font-size: .14rem;
    text-align: right;
  }
  .btn{
    width: 1.36rem;
    height: .36rem;
    background-color: #5cb4fc;
    margin-left: .48rem;
    text-align: center;
    line-height: .36rem;
    color: #fff;
    border-radius: .10rem;
    font-size: .16rem;
    letter-spacing: 0.03rem;
    cursor: pointer;
    font-weight: bold;
  }
  .get-btn{
    background-color: #5cb4fc;
  }
  .get-btn-after{
    background-color: #ddd;
  }
  /*内容区域*/
  .detail-content-box{
    width: 100%;
    height: 7.00rem;
    background-color: #fff;
    margin-top: .40rem;
  }
  .cont-tabs{
    width: 100%;
    font-size: .16rem;
    letter-spacing: 0.03rem;
  }
  .cont-tabs>span{
    display: inline-block;
    width: .78rem;
    margin-left: .30rem;
    margin-top: .29rem;
    height: .24rem;
    text-align: center;
    cursor: pointer;
  }
  .choose{
    border-bottom: 0.02rem solid #5cb4fc;
  }
  .content-line{
    width: 100%;
    height: 0.02rem;
    background-color: #dddddd;
  }
  .mission-box , .document-download-box{
    width: 100%;
    position: relative;
  }
  .sample-graph-text{
    margin: .20rem 0 0 .3rem;
    font-size: .16rem;
  }
  .sample-graph-img{
    width: 9.78rem;
    height: 5.30rem;
    margin: .15rem 0 0 .30rem;
  }

  .document-item-box{
    width: 3.00rem;
    height: 5.00rem;
    position: absolute;
    top: .34rem;
    left: 50%;
    margin: 0 0 0 -1.50rem;
  }
  .document-item{
    /*width: 2.30rem;*/
    height: .28rem;
    border-radius: .10rem;
    border: solid 0.01rem #5cb4fc;
    margin-left: .36rem;
    margin-bottom: .10rem;
    cursor: pointer;

  }
  .document-name{
    float: left;
    width: 2.20rem;
    height: .28rem;
    font-size: .14rem;
    line-height: .30rem;
    letter-spacing: 0.01rem;
    color: #5cb4fc;
    margin-left: 0.06rem;
    vertical-align: middle;
    overflow: hidden;
  }
  .download-icon{
    float: right;
    margin-right: .12rem;
    margin-top: 0.08rem;
  }
</style>
