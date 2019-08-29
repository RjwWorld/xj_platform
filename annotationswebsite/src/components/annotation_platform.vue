<template>
  <div>
    <div class="platform-container">
      <!--左侧排行榜-->
      <div class="left-container">
        <!--<platformLeft :platformArr="platformArr"></platformLeft>-->
        <platformLeft :ceshiArr="ceshiArr"></platformLeft>
      </div>
      <!--顶部选项和排序-->
      <div class="top-container">
        <div class="top-ul-box">
          <!--第一排（全部任务）-->
          <ul class="top-ul">
            <li>{{topArr[0].task_category_1}}：</li>
            <li v-for="(it,index) in topArr[0].task_2" :key="index" :class="{click:task_1===it.task_1}"
              @click="chooseTask2Name0(it.task_1)">
              {{it.task_2_name}}
            </li>
          </ul>
          <!--第二排（发布日期）-->
          <ul class="top-ul">
            <li>{{topArr[1].task_category_1}}：</li>
            <li v-for="(it,index) in topArr[1].task_2" :key="index" :class="{click:task_2===it.task_2}"
                @click="chooseTask2Name1(it.task_2)">
              {{it.task_2_name}}
            </li>
          </ul>
          <!--第三排（任务量）-->
          <ul class="top-ul">
            <li>{{topArr[2].task_category_1}}：</li>
            <li v-for="(it,index) in topArr[2].task_2" :key="index" :class="{click:task_3===it.task_3}"
                @click="chooseTask2Name2(it.task_3)">
              {{it.task_2_name}}
            </li>
          </ul>
          <!--第四排（进度）-->
          <ul class="top-ul">
            <li>{{topArr[3].task_category_1}}：</li>
            <li v-for="(it,index) in topArr[3].task_2" :key="index" :class="{click:task_4===it.task_4}"
                @click="chooseTask2Name3(it.task_4)">
              {{it.task_2_name}}
            </li>
          </ul>
        </div>
      </div>
      <!--搜索框-->
      <div class="search-box">
        <el-form>
          <el-form-item>
            <el-input v-model="searchText" maxlength="10" placeholder="输入关键词搜索"
                      class="search-box-input" @keyup.enter.native="searchKey()"></el-input>
            <span class="search-btn" @click="searchKey()">搜索</span>
            <img :src="searchIcon" alt="" class="search-icon">
          </el-form-item>
        </el-form>
      </div>
      <!--主要内容框-->
      <div class="content-container">
        <div class="content-box" v-for="(item,index) in contentArr" :key="index"
             @click="goPlatformDetails(item.task_uuid)">
          <div class="item-img-box">
            <img :src="'http://192.168.74.136:8888/' + item.task_image" alt="" class="item-img">
            <!--<img :src="'http://203.57.237.227:8888/' + item.task_image" alt="" class="item-img">-->
          </div>
          <p class="sideways-box">
            <img :src="sidewaysIcon" alt="" class="sideways-img">
          </p>
          <p class="c-state">{{item.task_status}}</p>
          <p class="item-title">
            <span>{{item.task_name}}</span>
            <span v-if="item.cState==='招募中'"><img :src="hotIcon" alt="" class="hot-icon"></span>
            <span class="state-type">{{item.task_type}}</span>
          </p>
          <p class="c-type-box">{{item.task_accept_type}}</p>
          <p class="type-and-date">
            <span class="c-type">ID:{{item.task_id}}</span>
            <span class="c-date">{{item.task_create_time}}</span>
            <span v-if="showUUid">{{item.task_uuid}}</span>
          </p>
        </div>
      </div>
      <!--分页框-->
      <div class="pages-container">
        <paginationNine :total="total" :current-page='current' @pagechange="pagechange"></paginationNine>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import platformLeft from './pages/platform/platform_left'
  import paginationNine from './pages/user_center/pagination_nine'
  export default {
    data() {
      return {
        searchIcon:require('../assets/images/platform/search-icon.png'),
        hotIcon:require('../assets/images/platform/hot-icon.png'),
        sidewaysIcon:require('../assets/images/platform/sideways.png'),
        searchText:'',
        total: 1,     // 记录总条数
        display: 9,   // 每页显示条数
        current: 1,
        isClick0:1,
        isClick1:1,
        isClick2:1,
        isClick3:1,
        task_1:1,
        task_2:1,
        task_3:1,
        task_4:1,
        topArr:[
          {
            "task_category_1": "全部任务",
            "task_2": [
              {"task_1": 1, "task_2_name": "全部"},
              {"task_1": 2, "task_2_name": "文本标注"},
              {"task_1": 4, "task_2_name": "语音标注"},
              {"task_1": 5, "task_2_name": "图像标注"},
              {"task_1": 3, "task_2_name": "视频标注"}
            ],
              "task_1_id": 1
          }, {
              "task_category_1": "发布日期",
              "task_2": [
                {"task_2": 1, "task_2_name": "全部"},
                {"task_2": 2, "task_2_name": "最近三天"},
                {"task_2": 3, "task_2_name": "最近一周"},
                {"task_2": 4, "task_2_name": "最近一个月"}
              ],
              "task_1_id": 2
            },{
              "task_category_1": "任务类型",
              "task_2": [
                {"task_3": 1, "task_2_name": "全部"},
                {"task_3": 2, "task_2_name": "个人"},
                {"task_3": 3, "task_2_name": "团队"}
              ],
              "task_1_id": 3
            },{
              "task_category_1": "进度",
              "task_2": [
                {"task_4": 1, "task_2_name": "全部"},
                {"task_4": 2, "task_2_name": "招募中"},
                {"task_4": 3, "task_2_name": "进行中"},
                {"task_4": 4, "task_2_name": "已结束"}
              ],
              "task_1_id": 4
            },
        ],
        showUUid:false,
        ceshiArr: [
          {id: 1, name: '成都向己科技有限公司',},
          {id: 2, name: '成都向己科技有限公司',},
          {id: 3, name: '成都向己科技有限公司',},
          {id: 4, name: '成都向己科技有限公司',},
          {id: 5, name: '成都向己科技有限公司',},
          {id: 6, name: '成都向己科技有限公司',},
          {id: 7, name: '成都向己科技有限公司',},
          {id: 8, name: '成都向己科技有限公司',},
          {id: 9, name: '成都向己科技有限公司',},
          {id: 10, name: '成都向己科技服务',},
        ],
        contentArr: '',
      }
    },
    components:{
      platformLeft,
      paginationNine
    },
    created(){
      this.getTask();
    },
    methods: {
      pagechange(currentPage){
        // console.log(currentPage);
        axios.get('/api/v1.0/task/TaskIndex/',{params:{page_notice:currentPage}}).then((response)=>{
          if (response.status===200){
            this.contentArr=response.data.task_list;
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
      },
      // 跳转到详情页
      goPlatformDetails(task_uuid){
        this.$router.push({
          path:'/platformDetails',
          query:{
            task_uuid
          }
        })
      },
      //搜索
      searchKey(){
        axios.get('/api/v1.0/search_task/', {params:{'q':this.searchText}}).then((response)=>{
          if(response.status===200){
            this.contentArr = response.data.task_list
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
      },
      getTask(){
        axios.get('/api/v1.0/task/TaskIndex',{params: {
            task_1_id:this.task_1,
            task_2_id:this.task_2,
            task_3_id:this.task_3,
            task_4_id:this.task_4,
          }}).then((response)=>{
          if(response.status===200){
            this.contentArr=response.data.task_list;
            this.total = response.data.task_total_count
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
      },
      // 点击第一排
      chooseTask2Name0(task_1){
        task_1:this.topArr[0].task_2.task_1;
        this.task_1=task_1;
        this.getTask()
      },
      //点击第二排
      chooseTask2Name1(task_2){
        task_2:this.topArr[1].task_2.task_2;
        this.task_2=task_2;
        this.getTask()
      },
      // 点击第三排
      chooseTask2Name2(task_3) {
        task_3:this.topArr[2].task_2.task_3;
        this.task_3 = task_3;
        this.getTask();
      },
      //点击第四排
      chooseTask2Name3(task_4){
        task_4:this.topArr[3].task_2.task_4;
        this.task_4=task_4;
        console.log(this.task_4);
        this.getTask()
      },
    },
  }
</script>
<style>
  .search-box-input .el-input__inner{
    padding: 0 .10rem 0 .36rem;
    height: .30rem;
    border: solid 0.01rem #f0f0f0;
    float: left;
    display: inline-block;
    margin-top: 0.06rem;
  }
</style>
<style scoped>
  .platform-container{
    width: 12.00rem;
    /*height: 16.00rem;*/
    margin: .90rem auto;
  }
  .left-container{
    width: 2.50rem;
    height: 6.12rem;
    background-color: #ffffff;
    border-radius: 0.08rem;
    float: left;
  }
  .top-container{
    width: 8.62rem;
    height: 2.80rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(187, 187, 187, 0.81);
    border-radius: .10rem;
    float: right;
  }
  .top-ul-box{
    padding: .35rem 1.27rem 0 .35rem;
  }
  .top-ul{
    width: 100%;
    height: .24rem;
    line-height: .24rem;
    margin-bottom: .34rem;
    border-bottom: 0.02rem dashed #f6f6f6;
    font-size: .16rem;
    letter-spacing: 0.01rem;
  }
  .top-ul>li{
    float: left;
  }
  .top-ul>li:first-child{
    width: 1.20rem;
  }
  .top-ul>li:not(:first-child){
    width: 1.20rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  .top-ul>li:not(:first-child):hover{
    color: #5cb4fc;
  }
  .top-ul>li:nth-child(2){
    width: .90rem;
  }
  /*点击高亮*/
  .click{
    color: #5cb4fc;
  }
  .search-box{
    width: 2.56rem;
    height: .44rem;
    float: right;
    margin-top: .50rem;
    position: relative;
  }
  .search-box-input{
    width: 1.80rem;
    height: .30rem;
    border-radius: 0.04rem;
    border: solid 0.01rem #f0f0f0;
    position: absolute;
    top: 0;
    left: 0;
  }
  .search-btn{
    width: .68rem;
    height: .30rem;
    background-color: #5cb4fc;
    display: inline-block;
    /*float: right;*/
    position: absolute;
    top: 0;
    right: 0;
    margin-top: 0.06rem;
    text-align: center;
    line-height: .30rem;
    color: #fff;
    border-radius: 0.04rem;
    cursor: pointer;
    transition: all 0.5s;
  }
  .search-btn:hover{
    background-color: #88d4fc;
  }
  .search-icon{
    position: absolute;
    top: .10rem;
    left: 0.06rem;
  }

  .content-container{
    width: 8.62rem;
    /*height: 11.88rem;*/
    float: right;
    margin-top: .19rem;
    display: flex;
    flex-wrap: wrap;
    /*justify-content: flex-start;*/
    align-content: flex-start;
  }
  .content-box{
    width: 2.80rem;
    height: 3.75rem;
    background-color: #fff;
    border-radius: .14rem;
    overflow: hidden;
    margin-bottom: .30rem;
    position: relative;
    cursor: pointer;
    margin-right: 0.06rem;
  }
  .item-img-box{
    width: 2.80rem;
    height: 2.80rem;
    overflow: hidden;
  }
  .item-img{
    width: 2.80rem;
    height: 2.80rem;
    transition: all 0.5s;
  }
  .item-img:hover{
    transform: scale(1.1,1.1);
  }
  .sideways-box{
    position: absolute;
    top: 0;
    left: 0;
  }
  /*旋转字体45度*/
  .sideways-img{
    width: .68rem;
    height: .68rem;
  }
  .c-state{
    font-size: .16rem;
    color: #fff;
    position: absolute;
    top: .14rem;
    left: 0;
    transform:rotate(-45deg);
  }

  .item-title{
    font-size: .18rem;
    letter-spacing: 0.01rem;
    font-weight: bold;
    margin-top: .10rem;
    margin-left: .20rem;
  }
  .hot-icon{
    margin-left: 0.04rem;
  }
  .state-type{
    float: right;
    font-weight: normal;
    font-size: .16rem;
    margin-right: .14rem;
  }
  .c-type-box{
    letter-spacing: 0.01rem;
    font-size: .12rem;
    margin-left: .20rem;
    margin-top: .20rem;
  }
  .type-and-date{
    margin: 0.04rem 0 0 .20rem;
    letter-spacing: 0.01rem;
  }
  .c-type{
    float: left;
  }
  .c-date{
    float: right;
    margin-right: .14rem;
    color: #fe5766;
  }


  .pages-container{
    width: 5rem;
    height: .5rem;
    float: right;
    margin-top: .3rem;
    margin-bottom: .44rem;
  }
</style>
