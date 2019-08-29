<template>
  <div id="do-img-tasks">
    <taskNav></taskNav>
    <div class="task-name-box">{{taskBigTitle}}</div>
    <!--left-tab切换-->
    <div class="img-content-box">
      <div class="left-tab-box lf">
        <ul>
          <li v-for="(item,index) in topTabsArr" class="tab-item" :key="index"
              :class="{choose:isChooseTab===item.id}" @click="changeTab(item.id)">
            <span class="tab-name lf">{{item.tabName}}</span>
            <span class="rt tab-img"><img :src="item.tabIcon" alt="" class="tab-icon"></span>
          </li>
        </ul>
      </div>
      <!--标注中-->
      <div class="rt right-content-box" v-if="isChooseTab===0">
        <table class="right-table-box">
          <tr>
            <th v-for="(item,index) in taskTitle" class="table-title">{{item.title}}</th>
          </tr>
          <tr v-for="(item,index) in taskContentArr" class="content-item">
            <td>{{item.name}}</td>
            <td>{{item.id}}</td>
            <td>{{item.user_team}}</td>
            <td>{{item.finish_time}}</td>
          </tr>
        </table>
        <pagination :total="totalOn" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
      <!--返修中-->
      <div class="rt right-content-box" v-else-if="isChooseTab===1">
        <table class="right-table-box">
          <tr>
            <th v-for="(item,index) in taskTitle2" class="table-title">{{item.title}}</th>
          </tr>
          <tr v-for="(item,index) in fanTaskContentArr" class="content-item">
             <td @click="checkTask(item.task_uuid, item.uuid, '1')">{{item.name}}</td>
            <td>{{item.id}}</td>
            <td>{{item.user_name}}</td>
            <td>{{item.user_team}}</td>
            <td>{{item.finish_time}}</td>
          </tr>
        </table>
        <pagination :total="totalFan" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
      <!--已完成-->
      <div class="rt right-content-box" v-else>
        <!--<el-form :model="ruleForm" :rules="rules" ref="ruleForm">-->
          <table class="right-table-box">
            <tr>
              <th v-for="(item,index) in taskTitle2" class="table-title">{{item.title}}</th>
              <th class="table-title radio1">返修</th>
              <th class="table-title radio1">完成</th>
            </tr>
            <tbody is="transition-group" name="fade" class="trans">
              <tr v-for="(item,index) in overTaskContentArr" class="content-item" v-if="item.typeId===2" :key="index">
                <td @click="checkTask(item.task_uuid, item.uuid, '2')">{{item.name}}</td>
                <td>{{item.id}}</td>
                <td>{{item.user_name}}</td>
                <td>{{item.user_team}}</td>
                <td>{{item.finish_time}}</td>
                <td class="radio2" @click="sureFan(item.id,item.typeId,item.uuid)">确定</td>
                <td class="radio2" @click="sureOver(item.id,item.typeId,item.uuid)">确定</td>
              </tr>
            </tbody>
          </table>
        <!--</el-form>-->
        <pagination :total="totalOver" :display="display" :current-page='current' @pagechange="pagechange"></pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import taskNav from './task_nav'
  import pagination from '../user_center/pagination'
  export default {
    data() {
      return {
        // 分页
        totalOn:1, //标注中总数
        totalFan:1, //返修中总数
        totalOver:1,  //已完成总数
        display:12, //一页12个
        current: 1,   // 当前的页数
        isChooseTab:0,
        taskBigTitle:'图像标注',
        topTabsArr:[
          {id:0,tabName:'标注中',tabIcon:require('../../../assets/images/platform/on.png')},
          {id:1,tabName:'返修中',tabIcon:require('../../../assets/images/platform/fan.png')},
          {id:2,tabName:'已完成',tabIcon:require('../../../assets/images/platform/over.png')},
        ],
        taskTitle:[
          {id:1,title:'项目名称'},
          {id:2,title:'编号'},
          {id:4,title:'所属团队'},
          {id:5,title:'截至日期'},
        ],
        taskTitle2:[
          {id:1,title:'项目名称'},
          {id:2,title:'编号'},
          {id:3,title:'处理人'},
          {id:4,title:'所属团队'},
          {id:5,title:'截至日期'},
        ],
        taskContentArr:[],
        fanTaskContentArr:[],
        overTaskContentArr:[],
        isFan:true,
        isOver:false,
      }
    },
    components:{
      taskNav,
      pagination
    },
    created(){
      this.changeTab(0)

    },

    methods: {
      changeTab(id){
        id:this.topTabsArr.id;
        this.isChooseTab=id;
        axios.get('/api/v1.0/task/showTasks',{params:{page:1,task_uuid:this.$route.query.task_uuid,task_status_id:this.isChooseTab}}).then((response)=>{//传标注中的页数
          if(response.status===200){
            this.taskBigTitle=response.data.task_type;
            if (id===0) {
              this.taskContentArr=response.data.resp_task;
              this.totalOn=response.data.total_page;
              if (response.data.total_page===0){
                this.totalOn=1
              }
            }else if (id===1){
              this.fanTaskContentArr=response.data.resp_task;
              this.totalFan=response.data.total_page
              if (response.data.total_page===0){
                this.totalFan=1
              }

            } else if (id===2) {
              this.overTaskContentArr=response.data.resp_task
              this.totalOver = response.data.total_page;
              if (response.data.total_page===0){
                this.totalOver=1
              }
            }
          }
          }).catch(error=>{
            if(error && response.status){
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
      },
      sureFan(id,typeId,uuid){
        let params = this.$qs.stringify({
          task_uuid:this.$route.query.task_uuid,
          uuid:uuid,
        })
        axios.put('/api/v1.0/task/repair',params).then((response)=>{
          if (response.status===200){
            typeId=1;
            this.changeTab(2)
          }
        }).catch(error=>{
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
      },
      sureOver(id,typeId,uuid){
        let params = this.$qs.stringify({
          task_uuid:this.$route.query.task_uuid,
          uuid:uuid,
        });
        axios.put('/api/v1.0/task/done/',params).then((response)=>{
          if (response.status===200){
            typeId=3;
            this.changeTab(2)
          }
        }).catch(error=>{
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

      },
      pagechange(currentPage){
        if (this.isChooseTab===0){
          // ajax请求, 向后台发送 currentPage, 来获取对应的数据
          axios.get('/api/v1.0/task/taskInfo',{params:{page:currentPage}}).then((response)=>{
            if (response.status===200){
               this.taskContentArr=response.data
               this.totalOn=response.data.total
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
        else if(this.isChooseTab===1){
          axios.get('/api/v1.0/info/myInfo',{params:{page:currentPage}}).then((response)=>{
            if (response.status===200){
               this.fanTaskContentArr=response.data
               this.totalFan=response.data.total
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
        }else{
          axios.get('/api/v1.0/info/myInfo',{params:{page:currentPage}}).then((response)=>{
            if (response.status===200){
             this.overTaskContentArr=response.data
             this.totalOver=response.data.total
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
      },
      // chakan fanxiu
      checkTask (task_uuid,uuid,type_id){
        this.$router.push({
          path:'/doTasks',
          query:{
            uuid:uuid,
            task_uuid:this.$route.query.task_uuid,
            type: type_id,
          }
        })
      }
    },
  }
</script>

<style scoped>
  #do-img-tasks{
    background-color: #fff;
    width: 100%;
    height: 100%;
  }
  .task-name-box{
    width: 100%;
    height: .24rem;
    font-size: .24rem;
    letter-spacing: 0.04rem;
    text-align: center;
    margin: auto;
    margin-top: .48rem;
    margin-bottom: .30rem;
  }
  .img-content-box{
    width: 13.88rem;
    height: 7.4rem;
    margin: 0 auto;
    margin-bottom: 1rem;
  }
  .left-tab-box{
    width: 1.8rem;
    height: 3.54rem;
    background-color: #f9f9f9;
    border-radius: 0.04rem;
    border: solid 0.01rem #dddddd;
  }
  .tab-item{
    width: 100%;
    height: .44rem;
    line-height: .44rem;
    cursor: pointer;
    margin-bottom: .20rem;
    transition: all 0.5s;
  }
  .choose{
    background-color: #5cb4fc;
    color: #fff;
  }
  .tab-item:first-child{
    margin-top: .3rem;
  }
  .tab-name{
    font-size: .18rem;
    letter-spacing: 0.03rem;
    text-indent: .14rem;
  }
  .tab-icon{
    width: .25rem;
    height: .25rem;
    vertical-align: middle;
    margin-right: .16rem;
  }
  .right-content-box{
    width: 11.80rem;
    height: 7.58rem;
  }
  .table-title{
    width: 2.9rem;
    height: .44rem;
    background-image: linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%),
    linear-gradient(#ffffff, #ffffff);
    background-blend-mode: normal, normal;
    border-right: solid 0.01rem #dddddd;
    text-align: left;
    text-indent: .19rem;
    font-size: .16rem;
    letter-spacing: 0.03rem;
    color: #5cb4fc;
  }
  .content-item{
    font-size: .14rem;
    letter-spacing: 0.03rem;
    height: .55rem;
    text-indent: .19rem;
    transition: all 0.3s;
  }
  .content-item>td:first-child{
    cursor: pointer;

  }
  .content-item>td:first-child:hover{
    color: #5cb4fc;
    text-decoration: underline;
  }
  .content-item:not(:first-child):hover{
    background-color: #eee;
  }
  .content-item>td{
    border-right: 0.01rem solid #ddd;
  }
  .right-table-box>tr:nth-child(2n+1){
    background-color: #eaf7ff;
    transition: all 0.3s;
  }
  .right-table-box>tr:nth-child(2n+1):not(:first-child):hover{
    background-color: #b5e3ff;
  }

  /*已完成*/
  .right-table-box>.trans>tr:nth-child(2n){
    background-color: #eaf7ff;
    transition: all 0.3s;
  }
  .right-table-box>.trans>tr:nth-child(n){
    transition: all 0.3s;
  }
  .right-table-box>.trans>tr:nth-child(n):hover{
    background-color: #d7ecff;
  }
  .right-table-box>.trans>tr:nth-child(2n):hover{
    background-color: #b5e3ff;
  }


  .radio1{
    width: 1rem;
    letter-spacing: 0.03rem;
    color: #5cb4fc;

  }
  .radio2{
    color: #5cb4fc;
    cursor: pointer;
  }
  .radio2:hover{
    text-decoration: underline;
  }
  .fade-enter-active,.fade-leave-active {
    transition: all 0.1s ease;
  }
  .fade-enter-active,.fade-leave{
    opacity: 1;
  }
  .fade-enter,.fade-leave-active {
    opacity: 0;
  }
</style>
