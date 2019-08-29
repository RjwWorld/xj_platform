<template>
  <div class="login">
    <div><img :src="backgroundImg" alt="" class="background-img"></div>
    <div class="login-container">
        <div class="login-title-box"><img :src="loginTitle"></div>
        <div class="login-form-box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0">
            <el-form-item prop="phone">
              <el-input v-model="ruleForm.phone" maxlength="11" class="phone-input input-font2" placeholder="请输入用户账号/11位手机号码">
              </el-input>
              <div class="left-icon"><img :src="personIcon" alt=""></div>
              <div class="right-icon"><img :src="delIcon" @click="delPhoneInput"></div>
            </el-form-item>
            <el-form-item prop="password"  class="password-container">
              <el-input  type=password v-model="ruleForm.password"
                         class="password-input input-font2" maxlength="16" placeholder="请输入用户密码">
              </el-input>
              <div class="left-icon"><img :src="psdIcon"></div>
              <div class="right-icon"><img :src="delIcon" @click="delPsdInput"></div>
            </el-form-item>
            <el-form-item prop="code"  class="code-container">
              <el-input  v-model="ruleForm.code" maxlength="4" class="code-input" @keyup.enter.native="login()"></el-input>
              <div class="code-box" id="verify_code">
                <!--<img :src="imageBase64" alt="" class="image-size">-->
                <img :src="imageBase64" alt="" class="image-size">
              </div>
              <div class="code-text" @click="changeVerifyCode()">
                看不清，换一张图
              </div>
            </el-form-item>
          </el-form>
          <div class="forgot-container">
            <p class="f-left" @click="goto('/forgotPsd')">忘记密码？</p>
            <p class="f-right" @click="goto('/register')">注册成为新用户</p>
          </div>
          <div class="login-btn" @click="login()">登陆</div>
          <div class="line"></div>
          <div class="qq-box">
            <!--<img :src="qqIcon" @click="QQLogin()" alt="">-->
            <img :src="qqIcon" @click="QQLogin()" alt="">
          </div>
          <div class="qq-text">使用QQ登陆</div>
          <!--<div class="qq-window" v-if="isQQLogin">-->
            <!--<p>正在开发中！</p>-->
          <!--</div>-->
        </div>

      </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import axios from 'axios'
  import {isvalidPhone,isvalidPassword,isvalidCode} from '../../../../config/validate'
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入您的手机号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  };
  var validPassword=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入密码'))
    }else  if (!isvalidPassword(value)){
      callback(new Error('请以英文字母开头，至少输入六位密码！'))
    }else {
      callback()
    }
  };
  var validCode=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请填写验证码'))
    }else  if (!isvalidCode(value)){
      callback(new Error('请输四位英文数字验证码'))
    }else {
      callback()
    }
  };
  export default {
    data() {
      return {
        imageBase64: '',
        loginTitle:require('../../../assets/images/header/login-title.png'),
        personIcon:require('../../../assets/images/header/login.png'),
        psdIcon:require('../../../assets/images/header/psd-icon.png'),
        delIcon:require('../../../assets/images/header/chacha.png'),
        slideIcon:require('../../../assets/images/header/slide.png'),
        qqIcon:require('../../../assets/images/header/QQ.png'),
        backgroundImg:require('../../../assets/images/header/background-img.jpg'),
        isQQLogin:false,
        ruleForm: {
          phone: '',
          password: '',
          code: '',
        },
        rules: {
          phone: [
            {hide: true, trigger: 'blur', validator: validPhone},
          ],
          password: [
            { hide: true, trigger: 'blur' ,validator: validPassword},
          ],
          code: [
            { hide: true, trigger: 'blur' ,validator: validCode},
          ],
        }
      }
    },
    created(){
      axios.get('/api/v1.0/user/verifyCode/', {responseType: 'arraybuffer'})
        .then(response => {
          this.imageBase64='data:image/png;base64,'+ btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        })
        .catch(error=>{
          this.$message.error('网络错误，不能访问');
          this.submitForm('ruleForm')
        })
    },
    mounted:function () {
      $('.login-title-box').addClass('animated swing');
      $('.login-container').addClass('animated bounceInLeft')
    },
    methods: {
      goto(path) {
        this.$router.push({
          path: path
        });
      },
      setLoginDis(){
        this.isQQLogin=false
      },
      QQLogin(){
        // setTimeout(this.setLoginDis,2000);
        // this.isQQLogin=true
        this.$alert('正在开发中！',{
          center: true,
          showConfirmButton:false
        });
      },
      delPhoneInput(){
        this.ruleForm.phone=""
      },
      delPsdInput(){
        this.ruleForm.password=""
      },
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            // alert('submit!');
          } else {
            return false;
          }
        });
      },
      //点击改变图片验证码
      changeVerifyCode() {
        axios.get('/api/v1.0/user/verifyCode/', {responseType: 'arraybuffer'})
          .then(response => {
            this.imageBase64='data:image/png;base64,'+ btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
          })
          .catch(error=>{
            this.$message.error('网络错误，不能访问');
          })
      },
      login(){
        let params=this.$qs.stringify({
          'password': this.ruleForm.password,
          'mobile': this.ruleForm.phone,
          'verifyCode': this.ruleForm.code,
        });
        axios.post('/api/v1.0/user/login/', params).then((response) => {
          if (response.status === 200) {
            this.$message({
              message:'登陆成功!',
              type:'success'
            });
            setTimeout(() => {
              top.location.href = 'http://192.168.74.136:8000/'
              // top.location.href = 'http://203.57.237.227:8890/'
            }, 1500);

          }
        }).catch(error=>{
          if (error && error.response) {
            switch (error.response.status) {
              case 525:
                this.$message.error('用户已经登陆，请先注销');
                this.submitForm('ruleForm');
                break;
              case 513:
                this.$message.error('请输入账号、密码或验证码');
                this.submitForm('ruleForm');
                break;
              case 514:
                this.$message.error('您输入的手机号格式有误，请重新输入');
                location.href="http://www.jzsjfw.com:8000/#/";
                break;
              case 517:
                this.$message.error('您输入的图片验证码错误，请重新输入');
                this.submitForm('ruleForm');
                break;
              case 521:
                this.$message.error('您输入的手机尚未注册，请先注册');
                this.submitForm('ruleForm');
                break;
              case 520:
                this.$message.error('数据库查询异常，请稍等，我们正在处理这个问题');
                this.submitForm('ruleForm');
                break;
              case 522:
                this.$message.error('您输入的密码有误，请重新输入');
                this.submitForm('ruleForm');
                break;
              case 540:
                this.$message.error('您的账号已在其他地方登陆！');
                setTimeout(function () {
                  // top.location.href = 'http://203.57.237.227:8890/#/login'
                  top.location.href = 'http://192.168.74.136:8000/#/login'
                }, 3000);
                break;
              default:
                this.$message.error('服务器走神啦');
                this.submitForm('ruleForm');
            }
          }
          // 失败刷新验证码
          this.changeVerifyCode();
        })
      }
    },

  }
</script>
<style>
  .input-font2 .el-input__inner{
    padding: 0 .40rem;
    color: #5cb4fc;
    font-size: .16rem;
    font-weight: bold;
    position: relative;
    height: .6rem!important;
    line-height: .44rem;
    border: 0.02rem solid #dcdfe6;
  }
  .code-input .el-input__inner{
    border: 0.02rem solid #dcdfe6;
    height: .44rem;
    line-height: .44rem;
    color: #5cb4fc;
    font-size: .16rem;
  }

</style>
<style scoped>
  .background-img{
    width: 100%;
  }
  .login-container{
    width: 6rem;
    height: 6rem;
    background-color: #fff;
    box-shadow: 0 .1rem .33rem 0.02rem #949494;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -2.8rem 0 0 -3rem;
    border-radius: .1rem;
  }
  .password-container{
    margin-top: .3rem;
  }
  .code-container{
    position: relative;
    margin-top: .3rem;
  }
  .code-input{
    width: 1.0rem;
    float: left;
  }
  .code-box{
    float: left;
    width: 1rem;
    height: .4rem;
    border: 0.02rem solid #dcdfe6;
    margin-left: .2rem;
    border-radius: 0.04rem;
    overflow: hidden;
  }
  .code-text{
    height: .4rem;
    width: 1.62rem;
    float: right;
    font-size: .16rem;
    color: #5cb4fc;
    cursor: pointer;
    letter-spacing: 0.02rem;
    text-align: right;
  }
  .login-title-box{
    position: absolute;
    top: -.38rem;
    left: 50%;
    margin-left: -2rem;
  }
  .login-title-box>img{
    width: 4rem;
    height: .81rem;
  }
  /*登陆表单*/
  .login-form-box{
    width: 4rem;
    height: 4.36rem;
    margin: .6rem auto;
  }
  /*框中icon布局*/
  .left-icon{
    position: absolute;
    left: 0.1rem;
    top: 0.15rem;
  }
  .left-icon>img,.right-icon>img{
    width: .3rem;
    height: .3rem;
  }
  .right-icon{
    position: absolute;
    top: 0.18rem;
    right: 0.15rem;
    cursor: pointer;
  }
  /*忘记密码/跳转注册*/
  .forgot-container{
    width: 100%;
    height: .20rem;
    font-size: .16rem;
  }
  .f-left{
    margin-top: .3rem;
    float: left;
    cursor: pointer;
  }
  .f-right{
    margin-top: .3rem;
    float: right;
    cursor: pointer;
  }
  .login-btn{
    width: 1.30rem;
    height: .42rem;
    border-radius: .20rem;
    background-color: #5cb4fc;
    text-align: center;
    line-height: .42rem;
    color: #fff;
    margin: auto;
    margin-top: .5rem;
    margin-bottom: .3rem;
    font-size: .2rem;
    cursor: pointer;
  }
  .line{
    width: 100%;
    height: 0.01rem;
    background-color: #5cb4fc;
  }
  .qq-box{
    width: .72rem;
    margin: auto;
    margin-top: .3rem;
    margin-bottom: .1rem;
  }
  .qq-box>img{
    cursor: pointer;
    width: .72rem;
    height: .72rem;
    margin: auto;
  }
  .qq-text{
    width: 2.00rem;
    margin: 0 auto;
    text-align: center;
    font-weight: bold;
    font-size: .16rem;
  }
  .image-size{
    width: 1.04rem;
    height: .44rem;
  }
  /*qq*/
  /*.qq-window{*/
    /*width: 1.5rem;*/
    /*height: .5rem;*/
    /*background: #ddd;*/
    /*position: absolute;*/
    /*bottom: .3rem;*/
    /*left: 50%;*/
    /*margin: 0 0 0 -.5rem;*/
    /*text-align: center;*/
  /*}*/
</style>
