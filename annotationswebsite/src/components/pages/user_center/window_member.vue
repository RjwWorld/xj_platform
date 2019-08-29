<template>
  <div>
    <p  @click="inviteNewMember()">
      <img :src="inviteNewMemberIcon" alt="" class="invite-icon">
      <span class="invite-text">邀请新成员</span>
    </p>
    <div class="window-box out-window" v-show="isShowWindow">
      <img :src="closeIcon" alt="" class="close-icon" @click="closeWindow()">
      <form @submit.prevent="submit">
        <input type="text" placeholder="输入成员名称搜索" class="search-input" v-model="memberName" @keyup.enter.native="submit()">
        <input type="submit" class="search-btn" value="搜索">
      </form>
      <!--搜索到了-->
      <el-form>
        <p v-show="searchIsError" class="search-res" v-for="(item,index) in searchArrMemberArr" :key="index">
          <span v-model="item.user_name">{{item.user_name}}</span>
          <span v-model="item.id">编号：{{item.id}}</span>
          <span @click="submitTeam(item.user_name)">邀请</span>
        </p>
      </el-form>
      <!--没搜到任何东西-->
      <p class="search-res" v-show="!searchIsError">
        抱歉，没有搜索到任何相关信息。
      </p>
      <!--加入成功-->
      <!--<div class="success-join" v-show="successJoin">-->
        <!--<p class="success-text">邀请申请成功</p>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        closeIcon:require('../../../assets/images/user_center/close-icon.png'),
        inviteNewMemberIcon:require('../../../assets/images/user_center/invite-the-new-member-icon.png'),
        isShowWindow:false,//控制第一个弹窗
        searchIsError:true,//控制搜索错误提示
        successJoin:false,//控制申请加入成功弹窗
        //弹窗中内容
        memberName:'',
        searchArrMemberArr:[],
      }
    },
    mounted:function(){
      $('.window-box').addClass('animated bounceInDown');
      $('.success-join').addClass('animated bounceIn');
      $('.search-res').addClass('animated bounceIn');
    },
    methods: {
      inviteNewMember(){
        this.isShowWindow=true
      },
      //关闭弹窗
      closeWindow(){
        this.isShowWindow=false;
      },
      //提交表单
      submit: function() {
        axios.get('/api/v1.0/search_user',{params:{'q':this.memberName}}).then((response)=>{
          if (response.status===200){
            this.searchIsError = true;
            this.searchArrMemberArr=response.data;
          }
        }).catch(error=>{
          if (error && error.response){
            switch (error.response.status) {
              case 535:
                this.searchIsError=true;
                break;
              case 540:
                this.$message.error('您的账号已在其他地方登陆！');
                setTimeout(function () {
                  top.location.href = 'http://203.57.237.227:8890/#/login'
                  // top.location.href = 'http://192.168.74.136:8000/#/login'
                }, 3000);
                break;
            }
          }
        })

      },
      submitTeam(user_name){
        let params = this.$qs.stringify({
          'username':user_name
        });
        axios.post('/api/v1.0/user/InviteTeam',params).then((response)=>{
          if (response.status===200){
            // this.successJoin=true;
            this.$message({
              message:'邀请申请成功',
              type:'success'
            })
          }
        }).catch(error=>{
          if (error.response){
            switch (error.response.status) {
              case 513:
                this.$message.error('您还未填写搜索关键字!');
                break;
              case 403:
                this.$message.error('您没有权限访问!');
                break;
              case 539:
                this.$message.error('该用户已加入过团队!');
                break;
              case 550:
                this.$message.error('您已经邀请过该用户!')
                break;
              case 500:
                this.$router.push({
                  path:'/errorFive'
                });
                break;
              case 540:
                this.$message.error('您的账号已在其他地方登陆！');
                setTimeout(function () {
                  top.location.href = 'http://www.jzjsfw.com:8890/#/login'
                }, 3000);
                break;
              default:
                this.$message.error('服务器走神了!')
            }
          }
        })
      },
    },
  }
</script>

<style scoped>
  .invite-text{
    color: #5cb4fc;
  }
  .invite-text:hover{
    color: #0d8ef8;
  }
  .invite-icon{
    width: .26rem;
    height: .26rem;
    vertical-align: middle;
    margin-left: 6.38rem;
  }
  /*浮窗*/
  .window-box{
    width: 5.22rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(145, 205, 255, 0.61);
    border-radius: .1rem;
    z-index: 20;
    position: absolute;
    top: 2.94rem;
    left: 1.44rem;
  }
  .close-icon{
    width: .20rem;
    position: absolute;
    top: 0.04rem;
    right: 0.04rem;
  }
  /*搜索框*/
  .search-input{
    height: .30rem;
    width: 2.40rem;
    border-radius: 0.04rem;
    background-color: #fff;

    border: 0.01rem solid #f0f0f0;
    margin-top: .28rem;
    margin-left: 1.02rem;
    padding: 0 .15rem;
    margin-bottom: .3rem;

  }
  .search-btn{
    width: .68rem;
    height: .34rem;
    display: inline-block;
    margin-left: .10rem;
    background-color: #5cb4fc;
    color: #fff;
    text-align: center;
    line-height: .34rem;
    border-radius: 0.04rem;
    cursor: pointer;
    border: 0.01rem solid #5cb4fc;
  }
  input::placeholder{
    letter-spacing: 0.01rem;
    color: #7d7d7d;
    line-height: .30rem;
  }
  .search-res{
    font-size: .16rem;
    width: 100%;
    height: .20rem;
    line-height: .20rem;
    text-align: center;
    margin-top: .20rem;
    letter-spacing: 0.03rem;
    margin-bottom: .20rem;
  }
  .search-res>span{
    letter-spacing: 0.01rem;
    display: inline-block;
    margin-left: .53rem;
    cursor: default;
  }
  .search-res>span:last-child{
    color: #5cb4fc;
    border-bottom: 0.01rem solid #5cb4fc;
    cursor: pointer;
  }
  .success-join{
    width: 1.50rem;
    height: .30rem;
    position: absolute;
    top: 20%;
    left: 50%;
    margin: .25rem 0 0 -.75rem;
    z-index: 50;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(145, 205, 255, 0.61);
    border-radius: .10rem;
    line-height: .30rem;
    text-align: center;
  }
</style>
