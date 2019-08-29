<template>
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
</template>

<script>
  import $ from 'jquery'
  export default {
    data() {
      return {
        homeBannerImg:require('../../../assets/images/home/Banner.gif'),
        homeBannerImg2:require('../../../assets/images/home/banner2.png'),
        mission1Icon:require('../../../assets/images/home/mission1.png'),
        mission2Icon:require('../../../assets/images/home/mission2.png'),
      }
    },
    mounted:function () {
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
    }
  }
</script>

<style scoped>
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
