<template>
  <div class="platform-page-container">
    <!--标题盒子-->
    <div class="top-title-box">
      <p class="hen-line-left line"></p>
      <p class="top-title">排行榜</p>
      <p class="hen-line-right line"></p>
    </div>
    <!--排行榜内容盒子-->
    <div class="top-content-container">
      <p class="top-item" v-for="(item,index) in ceshiArr" :key="index">
        <span class="hot-icon">
          <img :src="fireIcon" alt="" v-if="item.id<4">
        </span>
        <span class="none-box" v-if="item.id>3"></span>
        <span>{{item.id}}.</span>
        <span>{{item.name}}</span>
      </p>
    </div>
    <!--排行榜底部图片-->
    <div class="top-last-img">
      <img :src="topLastImg" alt="">
    </div>
  </div>
</template>

<script>

  export default {
    // 父组件传值
    props:{
      // platformArr:{
      //   type:Object,
      //   default:function(){
      //     return {
      //         platformArr:{
      //           topItem:'',
      //         }
      //       }
      //     }
      //   }
      ceshiArr:{
        type:Array,
        default:function(){
              return {
                ceshiArr:{
                    id:'',
                    name:'',
                  }
                }
              }
      }
    },
    data() {
      return {
        topLastImg:require('../../../assets/images/platform/small-banner.png'),
        fireIcon:require('../../../assets/images/platform/hot-icon.png'),
      }
    },
  }
</script>

<style scoped>
  .platform-page-container{
  }
  .top-title-box{
    margin-top: .44rem;
    margin-left: .52rem;
    margin-bottom: .29rem;
  }
  .line{
    width: .36rem;
    height: 0.02rem;
    background-color: #5cb4fc;
  }
  .hen-line-left{
    margin-right: 0.09rem;
  }
  .hen-line-right{
    margin-left: 0.09rem;
  }
  .top-title-box>p{
    float: left;
  }
  .top-title{
    font-size: .18rem;
    color: #5cb4fc;
    margin-top: -.12rem;

  }
  .top-content-container{
    height: 3.32rem;
    clear: both;
    float: left;
    margin-top: .29rem;
  }
  .top-last-img{
    float: left;
    clear: both;
    margin-top: .33rem;
  }
  .top-last-img>img{
    width: 2.5rem;
    height: 1.6rem;
  }
  .top-item{
    font-size: .16rem;
    letter-spacing: 0.01rem;
    margin-bottom: .14rem;

  }
  .hot-icon{
    margin-left: .16rem;
  }
  .hot-icon>img{
    width: .13rem;
    height: .15rem;
  }
  .none-box{
    width: .13rem;
    height: .15rem;
    display: inline-block;
  }
</style>
