<template>
  <div id="home-floor">
    <div id="home-banner">
      <div class="banner-container">
        <div id="flash">
          <img :src="homeBannerImg" alt="" class="h-banner-img" style="display: block">
          <img :src="homeBannerImg2" alt="" class="h-banner-2">
          <ul class="small-icon">
            <li style="background-color: #5cb4fc"></li>
            <li style="background-color: #fff"></li>
          </ul>
        </div>

        <div class="slogan">
          <p>菁准数据</p>
          <p>为优质的数据集而生</p>
        </div>
        <div class="mission-function">
          <div class="mission1 mission">
            <span @click="releaseTask()">发布任务</span>
            <span><img :src="mission1Icon" alt="" class="mission-icon"></span>
          </div>
          <div class="mission2 mission">
            <span @click="getTask()">领取任务</span>
            <span><img :src="mission2Icon" alt="" class="mission-icon"></span>
          </div>
        </div>
      </div>
    </div>
    <!--任务详情-->
    <div class="mission-items">
      <div class="m-item-box">
        <p>{{missionItemsArr[0].title}}</p>
        <p>{{missionNum0}}</p>
      </div>
      <div class="m-item-box">
        <p>{{missionItemsArr[1].title}}</p>
        <p>{{missionNum1}}</p>
      </div>
      <div class="m-item-box">
        <p>{{missionItemsArr[2].title}}</p>
        <p>{{missionNum2}}</p>
      </div>
    </div>
    <!--楼层内容盒子-->
    <div class="floor-container">
      <p class="floor-item floor-title1">使用流程</p>
      <div class="f1-container">
        <div class="f1-box" v-for="(item,index) in f1Arr" :key="index">
          <div class="step-icon"><img :src="item.stepIcon" alt=""></div>
          <div class="f1-content">{{item.content}}</div>
          <div class="f1-item-icon"><img :src="item.itemIcon" alt=""></div>
        </div>
      </div>
      <p class="floor-item floor-title2">经典案例</p>
      <!--2楼-->
      <div class="f2-container">
        <div class="f2-box" v-for="(item,index) in f2Arr" :key="index">
          <div class="case-img"><img :src="item.caseImg" alt=""></div>
          <p class="case-title">{{item.caseItem}}</p>
          <p class="case-cycle"><span>项目周期：</span>{{item.caseCycle}}天</p>
          <p class="case-size"><span>大小：</span>{{item.caseSize}}条</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  export default {
    data() {
      return {
        homeBannerImg:require('../../../assets/images/home/Banner.gif'),
        homeBannerImg2:require('../../../assets/images/home/banner2.png'),
        mission1Icon:require('../../../assets/images/home/mission1.png'),
        mission2Icon:require('../../../assets/images/home/mission2.png'),
        missionItemsArr:[
          {title:'正在进行的任务量',itemNum:378},
          {title:'正完成任务量',itemNum:400},
          {title:'日均新任务量',itemNum:219},
        ],
        missionNum0:0,
        missionNum1:0,
        missionNum2:0,
        userMsgArr:'',
        working_task: 0,
        complete_task: 0,
        avg_task: 0,
        f1Arr:[
          {
            content:'使用手机号注册成为我们的成员，即可领取海量任务。',
            stepIcon:require('../../../assets/images/home/step1.png'),
            itemIcon:require('../../../assets/images/home/item1.png')
          },
          {
            content:'加入我们的团队，了解任务规范，才能更好的获取赏金。',
            stepIcon:require('../../../assets/images/home/step2.png'),
            itemIcon:require('../../../assets/images/home/item2.png')
          },
          {
            content:'在任务商城可接任务里领取任务。',
            stepIcon:require('../../../assets/images/home/step3.png'),
            itemIcon:require('../../../assets/images/home/item3.png')
          },
          {
            content:'完成任务后，通过菁准数据基地的质检后，即可轻松获取赏金。',
            stepIcon:require('../../../assets/images/home/step4.png'),
            itemIcon:require('../../../assets/images/home/item4.png')
          }
        ],
        f2Arr:[
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
          {
            caseImg:require('../../../assets/images/home/case1.png'),
            caseItem:'儿童语音采集',
            caseCycle:'33',
            caseSize:'5300'
          },
        ],
      }
    },
    created(){
      axios.get('/api/v1.0/task/index/').then((response) => {
        if (response.status === 200) {
          this.userMsgArr = response.data;
          // this.f2Arr = response.data.task_dict;
          working_task = this.userMsgArr.working_task;
          complete_task = this.userMsgArr.complete_task;
          avg_task = this.userMsgArr.avg_task;
          role_id = this.userMsgArr.role_id;
          if (this.avg_task===null) {
            this.avg_task = 0
          }
        }
      }).catch(error=> {
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
    mounted:function () {
      this.missionNum0 = 0;
      var itemNumTimer0 =  setInterval(()=>{
        if(this.missionNum0<this.working_task){
          this.missionNum0++;
        }
        else {
          clearInterval(itemNumTimer0);
        }
      }, 1);
      this.missionNum1 = 0;
      var itemNumTimer1 =  setInterval(()=>{

        if(this.missionNum1<this.complete_task){
          this.missionNum1++;
        }
        else {
          clearInterval(itemNumTimer1);
        }
      }, 1);
      this.missionNum2 = 0;
      var itemNumTimer2 =  setInterval(()=>{
        if(this.missionNum1<this.avg_task){
          this.missionNum2++;
        }
        else {
          clearInterval(itemNumTimer2);
        }
      }, 1);
      $(window).bind('scroll',function () {
        var sTop = $(window).scrollTop();
        var sTop = parseInt(sTop);
        if(sTop>=30){
          $('.floor-title1').addClass('animated bounceInDown')
          $('.f1-box').eq(0).addClass('animated bounceInLeft');
          $('.f1-box').eq(1).addClass('animated bounceInRight');
          $('.f1-box').eq(2).addClass('animated bounceInLeft');
          $('.f1-box').eq(3).addClass('animated bounceInRight');
        };
        if(sTop>=360){
          $('.floor-title2').addClass('animated bounceInLeft')
        }
        if(sTop>=370){
          $('.f2-box').eq(0).addClass('animated bounceInUp')
          $('.f2-box').eq(1).addClass('animated bounceInUp')
          $('.f2-box').eq(2).addClass('animated bounceInUp')
        }
        if(sTop>=700){
          $('.f2-box').eq(3).addClass('animated bounceInLeft')
          $('.f2-box').eq(4).addClass('animated bounceInLeft')
          $('.f2-box').eq(5).addClass('animated bounceInLeft')
        }
        if(sTop>=1000){
          $('.f2-box').eq(6).addClass('animated bounceInRight')
          $('.f2-box').eq(7).addClass('animated bounceInRight')
          $('.f2-box').eq(8).addClass('animated bounceInRight')
        }
      });

      $('.slogan').addClass('animated fadeInDownBig');
      //轮播
      var c=0; //大总管变量
      //设置定时器 控制轮播
      var timer=setInterval(run,3000);
      //定时器调用的函数
      function run(){
        c++;
        c = c==2?0:c;
        $("#flash img").eq(c).fadeIn(1000).siblings('img').fadeOut(1000);
        $(".small-icon li").eq(c).css('background','#5cb4fc').siblings('li').css('background','#fff');
      }

      $("#flash").hover(function () {
        clearInterval(timer)
      },function () {
        timer=setInterval(run,3000)
      })

      //鼠标移入小圆点的效果
      $("#flash ul li").mouseenter(function () {
        //获取当前移入的li的序号
        c=$(this).index();
        //让c号图片显示 兄弟图片隐藏
        $("#flash img").stop().eq(c).fadeIn(1000).siblings('img').fadeOut(1000);
        //让c号li变紫 其他li变白
        $("#flash ul li").eq(c).css('background','#5cb4fc').siblings('li').css('background','#fff');
      });


    },
    loginBtn(){
      this.$router.push({path:'/login'})
    },
    methods:{
      releaseTask(){
        if (this.userMsgArr.role_id==='0'){
          this.$message.error('您没有权限访问！')
        }
        else if (this.userMsgArr.role_id==='1'){
          this.$message.error('您没有权限访问！')
        }
        else if(this.userMsgArr.role_id==='2'){
          this.$router.push({path:'/userCenter'})
        }else{
          this.$message.error('您尚未登陆，请先登陆！')
          setTimeout(function () {
            // top.location.href="http://203.57.237.227:8890/#/login"
            top.location.href="http://192.168.74.136:8000/#/login"
          }, 2000)
        }
      },
      getTask(){
        if (this.userMsgArr.role_id==='0'){
          this.$router.push({path:'/annotationPlatform'})
        }
        else if (this.userMsgArr.role_id==='1'){
          this.$router.push({path:'/annotationPlatform'})
        }
        else if(this.userMsgArr.role_id==='2'){
          this.$message.error('您没有权限访问！')
        }else{
          this.$message.error('您尚未登陆，请先登陆！')
          setTimeout(function () {
            // top.location.href="http://203.57.237.227:8890/#/login"
            top.location.href="http://192.168.74.136:8000/#/login"
          }, 2000)
        }
      }
    }
  }
</script>

<style scoped>
  .mission-items{
    width: 8rem;
    height: .6rem;
    margin: .5rem auto;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
  }
  .m-item-box{
    text-align: center;
    line-height: .3rem;
    font-size: .16rem;
  }
  .m-item-box>p:last-child{
    font-weight: bold;
    color: #5cb4fc;
  }
  .floor-container{
    width: 10.8rem;
    margin: .40rem auto;
  }
  .floor-item{
    width: 2rem;
    height: .34rem;
    border-bottom: 0.03rem solid #5cb4fc;
    text-align: center;
    font-size: .22rem;
    margin: .30rem auto;
  }
  /*1楼*/
  .f1-container{
    height: 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-bottom: .6rem;
  }
  .f1-box{
    width: 4.8rem;
    height: 1.2rem;
    margin-left: .2rem;
    margin-top: .2rem;
    position: relative;
    background-color: #ffffff;
    box-shadow: 0 0.04rem .15rem 0.01rem
    rgba(92, 180, 252, 0.23);
  }
  .step-icon>img{
    width: .38rem;
    position: absolute;
    top: -.18rem;
    left: -.18rem;
  }
  .f1-content{
    width: 3.4rem;
    height: .60rem;
    position: absolute;
    top: 46%;
    left: 40%;
    margin: -.30rem 0 0 -1.55rem;
    font-size: .22rem;
    line-height: .36rem;
    letter-spacing:0.02rem;
  }
  .f1-item-icon>img{
    width: .35rem;
    position: absolute;
    right: .18rem;
    top: 50%;
    margin: -.17rem 0 0 0;
  }
  /*2楼*/
  .f2-container{
    height: 12rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  .f2-box{
    width: 3.12rem;
    height: 3.52rem;
    margin-bottom: .68rem;
  }
  .case-img{
    overflow: hidden;
    width: 3.12rem;
    height: 2.30rem;
  }
  .case-img>img{
    width: 3.12rem;
    height: 2.30rem;
    transition: all 0.3s;
  }
  .case-img>img:hover{
    transform: scale(1.5,1.5);
  }
  .f2-box>p{
    text-align: center;
    margin-top: .10rem;
    font-size: .18rem;
  }



  #home-banner{
    width: 100%;
    margin: 0 auto;
  }
  .banner-container{
    width: 100%;
    position: relative;
  }
  /*轮播组件*/
  #flash{
    width: 100%;
    height: 6rem;
    margin: 0 auto;
    position: relative;
    display: flex;
  }
  #flash img{
    width:100%;
    height: 6rem;
    position: absolute;
    display: none;
    left:0;
    top:0;
  }
  #flash ul{
    position: absolute;
    bottom:.60rem;
    left:50%;
  }
  #flash ul li{
    list-style: none;
    width: 0.08rem;
    height: 0.08rem;
    border: 0.01rem solid #ddd;
    border-radius: 50%;
    float: left;
    margin-right: .1rem;
  }


  .slogan{
    position: absolute;
    width: 4.50rem;
    height: 1.3rem;
    top: 50%;
    left: 50%;
    margin: -.65rem 0 0 -2.25rem;
    color: #fff;
    font-weight: bold;
    text-align: center;
  }
  .slogan>p:first-child{
    font-size: .6rem;
  }
  .slogan>p:last-child{
    font-size: .48rem;
  }
  /*任务功能*/
  .mission-function{
    width: 8rem;
    position: absolute;
    height: .7rem;
    bottom: -.35rem;
    left: 50%;
    margin: 0 0 0 -4rem;
    box-shadow: 0 0.04rem .15rem 0.01rem
    rgba(92, 180, 252, 0.23);
  }
  .mission{
    width: 4rem;
    height: .7rem;
    background-color: #fff;
    text-align: center;
    line-height: .7rem;
    font-size: .24rem;
  }
  .mission>span{
    cursor: pointer;
    transition: all 0.5s;
  }
  .mission>span:hover{
    color: #5cb4fc;
  }
  .mission1{
    float: left;
  }
  .mission2{
    float: right;
  }
  .mission-icon{
    width: .24rem;
    vertical-align: middle;
    animation: mission-icon 1s ease-out infinite;
    -webkit-animation: mission-icon 1s ease-out infinite;
    opacity: 1;
  }
  @keyframes mission-icon{
    0% {
      opacity: 0.9;
    }
    50% {
      opacity: 0.7;
    }
    70% {
      opacity: 0.4;
    }
    100% {
      opacity: 0;
    }
  }
</style>
