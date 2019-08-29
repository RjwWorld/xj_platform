<template>
  <div id="pc-header">
    <div class="nav-big-container">
      <div class="nav-container">
        <span class="logo-img"><img :src="logoImg" alt="" @click="goto('/')"></span>
        <div class="nav-items-box">
          <span class="logo-title">AI数据集解决方案提供商</span>
          <router-link to="/" tag="span" class="title title1" exact>首页</router-link>
          <router-link to="/annotationPlatform" tag="span" class="title1 title2">标注平台</router-link>
          <router-link :to="userCenterUrl" tag="span" class="title1">个人中心</router-link>
        </div>
      </div>
      <div class="log-reg-box">
        <span class="login" @click="goto('/login')" v-show="!isLogin">登陆</span>
        <span class="user-icon" v-show="isLogin"><img :src="userIcon"></span>
        <span class="user-id" v-show="isLogin" @click="goUserCenter()">{{userMsgArr.username}}</span>
        <span class="register" @click="goto('/register')" v-show="!isLogin">注册</span>
        <span v-show="isLogin" class="logout" @click="logout()">注销</span>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        logoImg:require('../../assets/images/header/logo.png'),
        userIcon:require('../../assets/images/header/user.png'),
        isLogin:false,
        userMsgArr:Object,
        userCenterUrl: '/login',
      }
    },
    created(){
      axios.get('/api/v1.0/task/index/').then((response) => {
        if (response.status === 200 && response.data.username==null) {
          this.isLogin=false;
        }else if(response.status === 200 && response.data.username!==null){
          this.isLogin=true;
          this.userMsgArr=response.data;
          this.userCenterUrl='/userCenter';
        }else{
          this.isLogin=false;
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
    methods: {
      goto (path) {
        this.$router.push({path:path})
      },
      goUserCenter(){
        this.$router.push({
          path:'/userCenter',
        })
      },
      logout(){
        axios.get('/api/v1.0/user/logout/').then((response) => {
          if (response.status === 200) {
            this.isLogin=false;
            top.location.href='http://192.168.74.136:8890/'
            // top.location.href='http://203.57.237.227:8890/'
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
    },

  }
</script>

<style scoped>
  #pc-header{
    position: fixed;
    top: 0;
    left: 0;
    z-index:1000;
    width: 100%;
    height: .58rem;
    background-color: #fff;
    margin: 0 auto;
    border-bottom: 0.02rem solid #ddd;
  }
  .nav-big-container{
    position: relative;
    width: 100%;
  }
  .nav-container{
    width: 10.8rem;
    margin-left: 4.3rem;
    border: 0.01rem solid #fff;
    position: absolute;
    top: 0;
    left: 0;
  }
  .logo-img{
    float: left;
  }
  .logo-img>img{
    width: .64rem;
    height: .58rem;
    cursor: pointer;
  }
  .logo-title{
    font-size: .14rem;
    margin-left: .1rem;
    font-weight: bold;
    letter-spacing: 0.02rem;
  }
  .nav-items-box{
    margin-top: .24rem;
    height: .3rem;
    line-height: .24rem;
  }
  .title{
    margin-left: 2rem;
  }
  .title1{
    font-size: .18rem;
    margin-right: .3rem;
    cursor: pointer;
    height: .28rem;
    display: inline-block;
    letter-spacing: 0.03rem;
  }
  .title1:hover{
    color: #5cb4fc;
  }
  .log-reg-box{
    position: absolute;
    top: .24rem;
    right: 4.5rem;
  }
  .log-reg-box>span{
    cursor: pointer;
    font-size: .16rem;
    transition: all 0.5s;
  }
  .log-reg-box>span:hover{
    color: #5cb4fc;
  }
  .login{
    display: inline-block;
    width: .46rem;
    font-size: .16rem;
    border-right: 0.02rem solid #ddd;
    text-align: center;
    letter-spacing: 0.03rem;
  }
  .register{
    width: .46rem;
    text-align: center;
    display: inline-block;
    letter-spacing: 0.03rem;
  }
  .logout{
    margin-left: .1rem;
    vertical-align: bottom;
  }
  .user-icon{
  }
  .user-id{
    vertical-align: bottom;
  }
  .user-icon>img{
    vertical-align: bottom;
    width: .24rem;
    height: .24rem;
  }
  /*router激活状态下高亮*/
  .router-link-active{
    color: #5cb4fc;
    border-bottom: 0.02rem solid #5cb4fc;
  }
</style>

