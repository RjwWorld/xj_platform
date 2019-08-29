<template>
  <div id="update-psd">
    <div class="forget-container">
      <div class="forget-box">
        <div class="forget-title">
          <img :src="forgetBoxTitle" alt="">
        </div>
        <div class="step1-box">
          <span>02</span>
          <img :src="stepIcon" alt="">
        </div>
        <div class="forget-form-box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
            <p class="box-name">设置您的新密码</p>
            <el-form-item prop="password">
              <el-input type="password" maxlength="16" v-model="ruleForm.password" autocomplete="off" class="set-psd" placeholder="请设置六位以上密码"></el-input>
            </el-form-item>
            <el-form-item prop="checkPassword" class="code-input-size">
              <el-input type="password" maxlength="16" v-model="ruleForm.checkPassword" autocomplete="off" class="set-psd" placeholder="请再次确认您的密码"></el-input>
            </el-form-item>
            <div class="forget-btn1" @click="emitForget()">确定</div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  import {isvalidPassword} from '../../../../config/validate'
  var validPassword=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入密码'))
    }else  if (!isvalidPassword(value)){
      callback(new Error('请输入至少六位密码 不能全数字'))
    }else {
      callback()
    }
  };
  var validateCheckPassword = (rule, value, callback) => {
    if (value === '') {
      callback(new Error('请再次输入密码'));
    } else if (isvalidPassword(value)==false) {
      //isvalidPassword(value)才是第一个密码框的值，而不是this.ruleForm.password 小坑
      callback(new Error('两次输入密码不一致!'));
      // console.log(isvalidPassword(value));//此时打印value输入一致返回true,不一致返回false
    } else {
      callback();
    }
  };
  export default {
    data() {
      return {
        forgetBoxTitle:require('../../../assets/images/header/forget-title.png'),
        stepIcon:require('../../../assets/images/header/step.png'),
        sendAuthCode:true,
        codeTime:0,
        ruleForm: {
          password: '',
          checkPassword: '',
        },
        rules: {
          password: [
            { hide: true, trigger: 'blur', validator: validPassword},
          ],
          checkPassword: [
            { hide: true, trigger: 'blur', validator: validateCheckPassword},
          ],
        }
      }
    },
    mounted:function () {
      $('.forget-title').addClass('animated rollIn');
      $('.forget-container').addClass('animated fadeInRightBig')
    },
    methods: {
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.$message({
              message:'密码修改成功，请登陆',
              type:success
            })
            location.href = "http://localhost:8080/#/login";
          } else {
            return false;
          }
        });
      },
      emitForget(){
        let params=this.$qs.stringify({
          'password': this.ruleForm.password,
        });
        axios.put('/api/v1.0/user/updatePassword/', params).then((response) => {
          if (response.status === 200) {
            console.log(111);
            this.$message({
              message:'密码修改成功',
              type:'success'
            });
            setTimeout(function () {
              // location.href = "http://203.57.237.227:8890/#/login";
              location.href = "http://192.168.74.136:8000/#/login";
            }, 3000);

          }
        }).catch(error=>{
          if (error && error.response) {
            switch (error.response.status) {
              case 513:
                this.$message.error('密码输入错误，请重新输入');
                break;
              case 517:
                this.$message.error('内部服务异常');
                setTimeout(function () {
                  // location.href = "http://203.57.237.227:8890/#/login";
                  location.href = "http://192.168.74.136:8000/#/login";
                }, 3000);
                break;
              case 520:
                this.$message.error('服务器走神了，我们正在处理问题，请稍等~');
                break;
              case 519:
                this.$message.error('同一手机号验证码短信发送超出5条, 请联系系统管理员');
                setTimeout(function () {
                  // top.location.href = "http://203.57.237.227:8890/#/";
                  top.location.href = "http://192.168.74.136:8000/#/";
                }, 3000);
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
        });

      },

    },

  }
</script>
<style>
  .set-psd .el-input__inner{
    border: 0.01rem solid #5cb4fc;
    height: .4rem;
    font-size: .14rem;
  }
  .set-psd .el-input__inner{
    border: 0.01rem solid #5cb4fc;
    font-size: .14rem;
  }
</style>
<style scoped>
  .code-input-size{
    margin-top: .3rem;
  }
  #update-psd{
    overflow: hidden;
    /*position: fixed;*/
    width:100%;
    /*height:100%;*/
    height: 9rem;
    /*background: url(../../../assets/images/header/background-img.jpg)no-repeat center;*/
    /*background-size:cover;*/
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
  }
  .forget-code-container{
    margin-top: .10rem;
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
</style>
