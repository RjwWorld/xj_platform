<template>
  <div class="detail-container">
    <div class="details-box">
      <p class="details-date">
        <span><img :src="bellIcon" alt="" class="bell-icon"></span>
        <span>{{detailsArr.mouth_day}}</span>
        <span>{{detailsArr.hour_m}}</span>
        <span>{{detailsArr.title}}</span>
      </p>
      <div class="details-container">
        <p class="details-info">{{detailsArr.body}}</p>
        <p class="details-info-my-info" v-if="this.$route.query.type==='1'">
          <span class="team-name">{{this.$route.query.id}}</span> <span>邀请您加入团队</span>
        </p>
        <p class="user-btn" v-if="!is_notice">
          <span @click="pass(1)">同意</span>
          <span>|</span>
          <span @click="pass(2)">拒绝</span>
        </p>

      </div>
      <p class="author-box" v-if="is_notice">{{detailsArr.author}}</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        bellIcon:require('../../../assets/images/user_center/bell-icon.png'),
        detailsArr:'',
        is_notice:false,
      }
    },
    created(){
      if (this.$route.query.type === '2') {
        axios.get('/api/v1.0/info/noticeInfo', {params: {'id': this.$route.query.id}}).then((response) => {
          if (response.status === 200) {
            this.detailsArr = response.data;
            this.is_notice = response.data.is_notice;
          }
        }).catch(error => {
          if (error && error.response) {
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
                this.$message.error('default');
            }
          }
        })
      }
    },

    methods: {
      pass(is_active) {
        let params = this.$qs.stringify({
          'is_active':is_active,
          'username': this.$route.query.id
        });
        axios.post('/api/v1.0/info/joiner',params).then((response)=>{
          if (response.status===200){
            this.$message({
              message:'操作成功！',
              type:'success'
            })
          }
        }).catch(error=>{
          if (error && error.response){
            switch (error.response.status) {
              case 500:
                this.$router.push({
                  path:'/errorFive'
                });
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
  .detail-container{
    width: 100%;
    height: 5rem;
  }
  .details-box{
    width: 10.80rem;
    height: 2.08rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(185, 185, 185, 0.61);
    margin: auto;
    margin-top: 2rem;
    margin-bottom: 2rem;
  }
  .details-date{
    width: 3.00rem;
    font-size: .16rem;
    letter-spacing: 0.01rem;
    vertical-align: middle;
    color: #808080;
    float: left;
    margin-top: .50rem;
    margin-left: .36rem;
  }
  .bell-icon{
    vertical-align: middle;
  }
  .details-container{
    clear: both;
    float: left;
    margin-top: .30rem;
    margin-left: .36rem;
    font-size: .18rem;
    letter-spacing: 0.01rem;
    width: 100%;
  }
  .details-info{
    float: left;
  }
  .details-info-my-info{
    width: 4.00rem;
    float: left;
    text-indent: 2em;
    letter-spacing: 0.03rem;
  }
  .user-btn{
    float: right;
    margin-right: .60rem;
    color: #5cb4fc;
  }
  .user-btn>span:not(:nth-child(2)){
    cursor: pointer;
  }
  .author-box{
    clear: both;
    float: right;
    margin-top: .30rem;
    margin-right: .22rem;
    font-size: .18rem;
    letter-spacing: 0.03rem;

  }


</style>
