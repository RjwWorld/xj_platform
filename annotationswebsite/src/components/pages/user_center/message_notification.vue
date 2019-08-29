<template>
  <div>
    <pcHeader></pcHeader>
    <div class="info-container">
      <div class="info-nav">
        <p v-for="(item,index) in infoNavArr" :key="index" :class="{choosenav:whatNav===item.id}" @click="chooseNav(item.id)">
          {{item.navName}}
        </p>
      </div>
      <!--我的消息-->
      <div class="my-info" v-show="whatNav===1">
        <div class="info-item" v-for="(item,index) in infoItemArr" :key="index">
          <p class="info-item-date">
            <span><img :src="bellIcon" alt="" class="bell-icon"></span>
            <!--<span class="info-date">{{item.infoDate}}</span>-->
            <!--<span>{{item.infoDateH}}</span>-->
            <span v-show="!isRead">
              <img :src="isReadIcon" alt="" class="read-icon">
            </span>
          </p>
          <p class="info-content" @click="goInfodetails('1', item.send_user_name)">{{item.send_user_name}}</p>
        </div>
        <!--分页处理-->
        <div class="page-box">
          <pagination :total="total_my" :current-page='current' @pagechange="pagechange"></pagination>
        </div>
      </div>
      <!--my-notice-->
      <div class="annunciate-box" v-show="whatNav===2">
        <div class="info-item" v-for="(item,index) in noticeItemArr" :key="index">
          <p class="info-item-date">
            <span><img :src="bellIcon" alt="" class="bell-icon"></span>
            <span class="info-date">{{item.mouth_day}}</span>
            <span>{{item.hour_m}}</span>
            <span v-show="isRead">
              <img :src="isReadIcon" alt="" class="read-icon">
            </span>
          </p>
          <p class="info-content" @click="goInfodetails('2', item.id)">{{item.title}}</p>
        </div>
        <!--分页处理-->
        <div class="page-box">
          <pagination :total="total_notice"  :current-page='current' @pagechange="pagechange"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import pcHeader from '../pc_header'
  import pcFooter from '../pc_footer'
  import pagination from '../../pages/user_center/pagination'
  export default {
    data() {
      return {
        bellIcon:require('../../../assets/images/user_center/bell-icon.png'),
        isReadIcon:require('../../../assets/images/user_center/unread message-icon.png'),
        whatNav:1,
        isRead:false,
        total_my: 1,
        total_notice: 1,     // 记录总条数
        display: 4,   // 每页显示条数
        current: 1,   // 当前的页数
        infoNavArr:[
          {id:1,navName:'我的消息'},
          {id:2,navName:'公告栏'},
        ],
        infoItemArr:[],
        noticeItemArr:[],
      }
    },
    created(){
      axios.get('/api/v1.0/info/myInfo',{params:{page_notice:1}}).then((response)=>{
        if(response.status===200){
          this.noticeItemArr=response.data.notice_info;
          this.infoItemArr=response.data.my_info;
          this.isRead=response.data.is_watch;
          this.total_notice=response.data.pageinator_notice;
        }
      }).catch(error=>{
        if(error && error.response){
          switch (error.response.status) {
            case 500:
              this.$message.error('500');
              break;
            case 540:
              this.$message.error('您的账号已在其他地方登陆！');
              setTimeout(function () {
                // top.location.href = 'http://203.57.237.227:8890/#/login'
                top.location.href = 'http://192.168.74.136:8000/#/login'
              }, 3000);
              break;
            default:
              this.$message.error('default')
          }
        }
      })
    },
    components:{
      pcHeader,
      pcFooter,
      pagination
    },
    methods: {
      chooseNav(id) {
        id:this.infoNavArr.id;
        this.whatNav=id;
      },
      pagechange(currentPage){
        if (this.whatNav===2){
           // ajax请求, 向后台发送 currentPage, 来获取对应的数据
          axios.get('/api/v1.0/info/myInfo',{params:{page_notice:currentPage}}).then((response)=>{
            if (response.status===200){
              this.noticeItemArr=response.data.notice_info;
              this.infoItemArr=response.data.my_info;
              this.isRead=response.data.is_watch;
              this.total_notice=response.data.pageinator_notice;
              this.total_my=response.data.pageinator_my;
            }
          })
        }
        else if(this.whatNav===1){
           axios.get('/api/v1.0/info/myInfo',{params:{page_my:currentPage}}).then((response)=>{
            if (response.status===200){
              this.noticeItemArr=response.data.notice_info;
              this.infoItemArr=response.data.my_info;
              this.isRead=response.data.is_watch;
              this.total_notice=response.data.pageinator_notice;
              this.total_my=response.data.pageinator_my;
            }
          })
        }
      },
      goInfodetails(type, id){
        this.$router.push({
          path:'/infoDetails',
          query:{
            id:id,
            type: type,
          }
        })
      }
    },
  }
</script>

<style scoped>
  .info-container{
    width: 10.80rem;
    height: 5.50rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(185, 185, 185, 0.61);
    margin: auto;
    margin-top: .88rem;
    margin-bottom: .7rem;
    position: relative;
  }
  .info-nav{
    width: 100%;
    height: .36rem;
    font-size: .18rem;
    letter-spacing: 0.01rem;
    border-bottom: 0.01rem solid #eee;
  }
  .info-nav>p{
    float: left;
    margin-top: .10rem;
    cursor: pointer;
  }
  .info-nav>p:first-child{
    margin-left: .26rem;
  }
  .info-nav>p:last-child{
    margin-left: .38rem;
  }
  .choosenav{
    border-bottom: 0.02rem solid #5cb4fc;
  }
  .info-item{
    width: 9.98rem;
    margin: .22rem 0 0 .26rem;
  }
  .info-item-date>span,.info-item-date>span>img{
    vertical-align: middle;
    font-size: .12rem;
    display: inline-block;
    letter-spacing: 0.01rem;
  }
  .bell-icon{
    width: .18rem;
    height: .20rem;
    vertical-align: middle;
    margin-right: .14rem;
  }
  .info-date{
    margin-right: .20rem;
  }
  .read-icon{
    margin-left: .13rem;
    vertical-align: middle;
  }
  .info-content{
    margin-top: .16rem;
    font-size: .14rem;
    cursor: pointer;
    letter-spacing: 0.01rem;
    line-height: .24rem;
    transition: all 0.5s;
  }
  .info-content:hover{
    color: #5cb4fc;
  }
  .page-box{
    position: absolute;
    bottom: 0;
    left: 50%;
    margin: 0 0 0 -1.50rem;
  }
</style>
