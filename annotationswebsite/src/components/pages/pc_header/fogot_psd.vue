<template>
  <div id="forget-psd">
    <div class="forget-container-big" >
      <div class="background-img">
      <img :src="backgroundImg" alt="" class="back-img">
    </div>
    <div class="forget-container" v-show="!step2">
      <div class="forget-box">
        <div class="forget-title">
          <img :src="forgetBoxTitle" alt="">
        </div>
        <div class="step1-box">
          <span>01</span>
          <img :src="stepIcon" alt="">
        </div>
        <div class="forget-form-box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <p class="box-name">请填写您的手机号码</p>
            <el-form-item prop="phone">
              <el-input v-model="ruleForm.phone" maxlength="11" class="re-phone-input" placeholder="请输入您的手机号">
              </el-input>
            </el-form-item>
            <el-form-item prop="code"  class="forget-code-container">
              <el-input  v-model="ruleForm.code" maxlength="6" class="forget-code-input re-phone-input" placeholder="请输入验证码">
              </el-input>
              <div class="forget-get-code-box" >
                <span v-show="sendAuthCode" @click="getCode()">获取验证码</span>
                <span v-show="!sendAuthCode">{{codeTime}}秒后重新获取</span>
              </div>
            </el-form-item>
            <div class="forget-btn1" @click="emitStep1()">确定</div>
          </el-form>
        </div>
      </div>
    </div >
       <!--使用修改密码组件通过返回码展示不同效果-->
    <updatePsd class="step2" v-show="step2"></updatePsd>
    </div>


  </div>

</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  import {isvalidPhone,isvalidPhoneCode} from '../../../../config/validate'
  import updatePsd from './update_psd'
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入您的手机号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  };
  var validPhoneCode=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入六位短信验证码'))
    }else  if (!isvalidPhoneCode(value)){
      callback(new Error('验证码不正确'))
    }else {
      callback()
    }
  };
  export default {
    data() {
      return {
        forgetBoxTitle:require('../../../assets/images/header/forget-title.png'),
        stepIcon:require('../../../assets/images/header/step.png'),
        backgroundImg:require('../../../assets/images/header/background-img.jpg'),
        sendAuthCode:true,
        codeTime:0,
        step2:false,
        ruleForm: {
          phone: '',
          code:'',
        },
        rules: {
          phone: [
            { hide: true, trigger: 'blur', validator: validPhone},
          ],
          code: [
            { hide: true, trigger: 'blur', validator: validPhoneCode},
          ],
        }
      }
    },
    mounted:function () {
      $('.forget-title').addClass('animated rollIn');
      $('.forget-container').addClass('animated fadeInRightBig')
    },
    components:{
      updatePsd,
    },
    methods: {
      getCode(){
        axios.get('/api/v1.0/user/updateSmsCode/', {params:{'mobile': this.ruleForm.phone}}).then((response) => {
          if (response.status === 200) {
            this.sendAuthCode=false
            this.codeTime = 60;
            var codeTimeTimer =  setInterval(()=>{
              this.codeTime--;
              if(this.codeTime<=0){
                this.sendAuthCode = true;
                clearInterval(codeTimeTimer);
              }
            }, 1000);
          }
        }).catch(error=>{
          if (error && error.response) {
            switch (error.response.status) {
              case 516:
                this.$message.error('已经发送过短信验证码了，稍后请重试');
                break;
              case 513:
                this.$message.error('请输入手机号码');
                break;
              case 512:
                this.$message.error('手机号数据类型错误');
                break;
              case 514:
                this.$message.error('手机号格式错误');
                break;
              case 521:
                this.$message.error('当前手机号码未注册，请先注册');
                break;
              case 520:
                this.$message.error('数据库查询异常，请稍等，我们正在处理这个问题');
                break;
              case 500:
                this.$message.error('服务器走神了，我们正在处理问题，请稍等~');
                break;
              case 517:
                this.$message.error('内部服务异常');
                break;
              case 519:
                this.$message.error('同一手机号验证码短信发送超出5条, 请联系系统管理员');
                setTimeout(function () {
                  // top.location.href = "http://203.57.237.227:8890/#/";
                  top.location.href = "http://192.168.74.136:8000/#/";
                }, 3000);
                break;
              case 526:
                this.$message.error('您今天已发送五次短信，如还有问题请与客服人员联系');
                break;
              case 540:
                this.$message.error('您的账号已在其他地方登陆！');
                setTimeout(function () {
                  // top.location.href = 'http://203.57.237.227:8890/#/login'
                  top.location.href = 'http://192.168.74.136:8000/#/login'
                }, 3000);
                break;
              default:
                this.$message.error('您输入的信息有误，请重新输入');
            }
          }
        });

      },
      emitStep1() {
        axios.get('/api/v1.0/user/checkSmsCode/', {
          params: {'mobile': this.ruleForm.phone, 'smsCode': this.ruleForm.code,}
        }).then((response) => {
          if (response.status === 200) {
            this.step2=true
          }
        }).catch(error=>{
          if (error && error.response) {
            switch (error.response.status) {
              case 513:
                this.$message.error('请输入手机号码');
                break;
              case 517:
                this.$message.error('当前短信验证码已经失效，请重新点击发送短信验证码');
                break;
              case 519:
                this.$message.error('短信验证码校验失败，请重新校验');
                break;
              case 518:
                this.$message.error('当前手机号码 未发送短信验证码，请重新输入');
                break;
              case 500:
                this.$message.error('服务器走神了，我们正在处理问题，请稍等~');
                break;
              case 540:
                this.$message.error('您的账号已在其他地方登陆！');
                setTimeout(function () {
                  // top.location.href = 'http://203.57.237.227:8890/#/login'
                  top.location.href = 'http://192.168.74.136:8000/#/login'
                }, 3000);
                break;
              default:
                this.$message.error('您输入的信息有误，请重新输入');
            }
          }
        })
      }
    },

  }
</script>
<style>
  .re-phone-input .el-input__inner{
    border: 0.01rem solid #5cb4fc;
    height: .4rem;
    font-size: .14rem;
  }
  .forget-code-input .el-input__inner{
    border: 0.01rem solid #5cb4fc;
    font-size: .14rem;
  }
</style>
<style scoped>
  #forget-psd{
    overflow: hidden;
    width:100%;
    height:9.00rem;
  }
  .forget-container{
    width: 5.48rem;
    height: 3.76rem;
    background-color: #ffffff;
    box-shadow: 0 0.07rem .16rem 0.02rem
    rgba(148, 148, 148, 0.59);
    border-radius: .10rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -1.54rem 0 0 -2.74rem;
  }
  .step2{
  }
  .forget-box{
    position: relative;
  }
  .forget-title{
    position: absolute;
    top: -.305rem;
    left: 50%;
    margin-left: -1.5rem;
  }
  .forget-title>img{
    width: 3rem;
    height: .61rem;
  }
  /*步骤*/
  .step1-box{
    position: absolute;
    top: .60rem;
    left: .60rem;
  }
  .step1-box>img{
    width: .65rem;
    height: 1.19rem;
  }
  .step1-box>span{
    color: #5cb4fc;
    font-size: .30rem;
    position: absolute;
    top: .20rem;
    left: -.10rem;

  }

  .forget-form-box{
    width: 2.90rem;
    height: 2.40rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: .80rem 0 0 -1.45rem;
  }
  .box-name{
    text-align: center;
    font-size: .20rem;
    color: #5cb4fc;
    margin-bottom: .20rem;
  }
  /*获取验证码*/
  .forget-code-input{
    width: 1.40rem;
    height: .4rem;
    float: left;
  }
  .forget-get-code-box{
    width: 1.28rem;
    background: #5cb4fc;
    float: right;
    border-radius: 0.04rem;
    line-height: .40rem;
    text-align: center;
    color: #fff;
    cursor: pointer;
    margin-top: 0.02rem;
  }
  .forget-get-code-box>span{
    width: 1.08rem;
    height: .40rem;
  }
  .forget-code-container{
    margin-top: .12rem;
    position: relative;
  }
  /*确定*/
  .forget-btn1{
    width: .90rem;
    height: .32rem;
    background-color: #5cb4fc;
    border-radius: .10rem;
    color: #fff;
    line-height: .32rem;
    text-align: center;
    margin: .5rem auto;
    cursor: pointer;
  }

  .back-img{
    width: 100%;
    height: 9rem;
    overflow: hidden;
  }
</style>
