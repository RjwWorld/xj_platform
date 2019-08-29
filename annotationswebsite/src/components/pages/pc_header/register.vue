<template>
  <div id="register">
    <div class="register-container">
      <div >
        <img :src="backgroundImg" alt="" class="background-img">
      </div>
      <div class="register-box">
        <div class="register-title">
          <img :src="registerTitle" alt="">
        </div>
        <p class="go-login">已有账号，直接<span @click="goto('/login')">登陆</span></p>
        <div class="form-box">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="1.4rem">
            <el-form-item label="手机号码 ：" prop="phone">
              <el-input v-model="ruleForm.phone" maxlength="11" class="phone-input input-font3" placeholder="请输入您的手机号">
              </el-input>
            </el-form-item>
            <el-form-item label="验证码 ：" prop="code"  class="code-container">
              <el-input  v-model="ruleForm.code"  maxlength="6" class="code-input3" placeholder="请输入验证码">
              </el-input>
              <div class="get-code-box">
                <span v-show="sendAuthCode"  @click="getCode()">获取验证码</span>
                <span v-show="!sendAuthCode">{{codeTime}}秒后重新获取</span>
              </div>
            </el-form-item>
            <el-form-item label="设置密码 ：" prop="password"  class="code-container">
              <el-input  :type="inputType" v-model="ruleForm.password"
                         placeholder="请设置六位以上密码" maxlength="16" class="password-input input-font3" >
              </el-input>
              <div class="eye-icon-box" @click="showPsd()"><img :src="eyeIcon" alt=""></div>
            </el-form-item>
            <el-form-item label="选择角色 ：" prop="character" id="re-ro">
              <el-radio-group v-model="ruleForm.character">
                <el-radio label=0 @keyup.enter.native="emitRegister()">个人</el-radio>
                <el-radio label=1 @keyup.enter.native="emitRegister()">团队</el-radio>
                <el-radio label=2 @keyup.enter.native="emitRegister()">雇主</el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="register-btn" :disabled="isChoose" @click="emitRegister()">立即注册</div>
            <div class="gou-box">
              <input type="checkbox" name="chek" id="gou1" :checked='isChecked' v-model="ruleForm.choose">
              <label for="gou1" class="gou-text" >
                <span @click="goto('/serviceContract')">
                    用户勾选击代表同意《向己科技服务条款》和《向己科技隐私政策》
                </span>
              </label>
            </div>
          </el-form>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import axios from 'axios'
  import {isvalidPhone,isvalidPassword,isvalidPhoneCode} from '../../../../config/validate'
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
        registerTitle:require('../../../assets/images/header/register-title.png'),
        eyeIcon:require('../../../assets/images/header/eyes.png'),
        backgroundImg:require('../../../assets/images/header/background-img.jpg'),
        sendAuthCode:true,
        codeTime:0,
        imageBase64:'',
        inputType:"password",
        isChecked:false,
        isChoose:false,
        ruleForm: {
          phone: '',
          code:'',
          password:'',
          character:'',
          choose: '1',
        },
        rules: {
          phone: [
            { hide: true, trigger: 'blur', validator: validPhone},
          ],
          code: [
            { hide: true, trigger: 'blur', validator: validPhoneCode},
          ],
          password: [
            { hide: true, trigger: 'blur' ,validator: validPassword},
          ],
          character: [
            { hide: true, message: '请选择您的角色', trigger: 'change' }
          ],
        }
      }
    },
    mounted:function () {
      $('.register-title').addClass('animated swing');
      $('.register-box').addClass('animated bounceInLeft')

    },
    methods: {
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
          } else {
            return false;
          }
        });
      },
      showPsd(){
        this.inputType = this.inputType==='password'?'text':'password';
      },
      getCode(){
        axios.get('/api/v1.0/user/smsCode/', {
          params: {mobile: this.ruleForm.phone}
        }).then((response) => {
          if (response.status === 200) {
            this.sendAuthCode=false;
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
                this.$message({
                  message:'已发送短信验证码',
                  type:success
                })
                this.submitForm('ruleForm');
                break;
              case 513:
                this.$message.error('还未填写手机号码');
                this.submitForm('ruleForm');
                break;
              case 512:
                this.$message.error('参数类型异常');
                this.submitForm('ruleForm');
                break;
              case 514:
                this.$message.error('手机号码格式错误');
                this.submitForm('ruleForm');
                break;
              case 515:
                this.$message.error('手机号已被注册');
                this.submitForm('ruleForm');
                break;
              case 517:
                this.$message.error('服务器走神了');
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
                this.$message.error('您输入的信息有误，请重新输入');
                this.submitForm('ruleForm');
            }
          }
        });

      },
      goto(path) {
        this.$router.push({
          path: path
        });
      },
      //是否同意公司协议，点击注册，自动勾选同意
      isAgreement(){
        this.isChecked = !this.isChecked;
        if(this.isChecked == true){
          this.isChoose == true
        }else{this.isChoose == false}
      },
      //提交注册信息
      emitRegister() {
        this.isAgreement();
        // this.submitForm('ruleForm')
        let params=this.$qs.stringify({
          'mobile': this.ruleForm.phone,
          'smsCode': this.ruleForm.code,
          'password': this.ruleForm.password,
          'role_id': this.ruleForm.character,
          'is_active': this.ruleForm.choose,
        });
        axios.post('/api/v1.0/user/registers/', params).then((response) => {
          if (response.status === 200) {
            // alert('注册成功，点击确定进入主页');
            this.$message({
              message:'注册成功'
            });
            setTimeout(() => {
              top.location.href = 'http://192.168.74.136:8000/'
              // top.location.href = 'http://203.57.237.227:8890/'
            }, 1500);
          }
        }).catch(error=>{
          if (error && error.response) {
            switch (error.response.status) {
              case 513:
                this.$message.error('参数缺失');
                this.submitForm('ruleForm');
                break;
              case 517:
                this.$message.error('内部服务器错误');
                this.submitForm('ruleForm');
                break;
              case 519:
                this.$message.error('短信验证码校验失败');
                this.submitForm('ruleForm');
                break;
              case 518:
                this.$message.error('该手机号暂未发送短信验证码');
                this.submitForm('ruleForm');
                break;
              case 523:
                this.$message.error('该用户暂未同意用户协议');
                this.submitForm('ruleForm');
                break;
              case 512:
                this.$message.error('数据错误');
                this.submitForm('ruleForm');
                break;
              case 520:
                this.$message.error('内部服务器错误');
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
                this.$message.error('您输入的信息有误，请重新输入');
                this.submitForm('ruleForm');
            }
          }
        })
      }
    },
  }
</script>
<style>
  .input-font3 .el-input__inner{
    font-weight: bold;
    color: #434343;
    height: .55rem;
  }
  .el-form-item__error{
    line-height: 2;
  }
  .gou-text >.el-form-item__content{
    line-height: .20rem;
  }
  .el-form-item__label{
    font-size: .18rem;
  }
  .code-input3 .el-input__inner{
    width: 2rem;
    height: .55rem;
    display: inline-block!important;
    float: left!important;
    font-weight: bold;
    font-size: .18rem;
  }
  .el-input{
    display: block;
  }
</style>
<style scoped>
  .background-img{
    width: 100%;
  }
  .register-title{
    position: absolute;
    top: -.38rem;
    left: 50%;
    margin-left: -2rem;
  }
  .register-title>img{
    width: 4rem;
    height: .81rem;
  }
  .register-box{
    width: 6.00rem;
    height: 6.20rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -3.00rem 0 0 -3.1rem;
    background: #fff;
    border-radius: .10rem;
    box-shadow: 0.04rem 0.04rem 0.04rem #5cb4fc;
  }
  .go-login{
    height: .16rem;
    line-height: .16rem;
    font-size: .16rem;
    margin-top: .50rem;
    float: right;
    margin-right: .50rem;
    cursor: pointer;
    margin-bottom: .10rem;
  }
  .go-login>span{
    border-bottom: 0.01rem solid #ddd;
    font-weight: bold;
    font-size: .16rem;
  }
  .form-box{
    width: 5.00rem;
    height: 3.10rem;
    margin: 0 auto;
    clear: both;
  }

  .code-input{
    width: 2rem;
    height: .6rem!important;
    /*float: left;*/
  }
  .get-code-box{
    width: 1.48rem;
    background: #5cb4fc;
    float: right;
    border-radius: 0.04rem;
    line-height: .55rem;
    text-align: center;
    color: #fff;
    cursor: pointer;
    height: .55rem;
  }
  .get-code-box>span{
    width: 1.08rem;
    height: .60rem;
    font-size: .18rem;
  }
  .code-container{
    margin-top: .38rem;
    position: relative;
  }
  .eye-icon-box{
    position: absolute;
    top: 50%;
    right: 0.06rem;
    margin-top: -.13rem;
    cursor: pointer;

  }
  .eye-icon-box>img{
    width: .32rem;
    height: .32rem;
  }
  .register-btn{
    width: 1.40rem;
    height: .40rem;
    background: #5cb4fc;
    border-radius: 0.04rem;
    box-shadow: 0.02rem 0.02rem 0.02rem #ddd;
    margin: .28rem auto;
    color: #fff;
    line-height: .40rem;
    text-align: center;
    cursor: pointer;
    font-size: .16rem;
  }
  .input-font3{
    height: .53rem;
    font-weight: bold;
    font-size: .18rem;
    color: red;
  }
  /*勾选框修改样式*/
  .gou-box{
    width: 2.50rem;
    height: .60rem;
    margin: 0  auto;
  }
  .gou-box>input{
    display: none;
  }
  .gou-box>label{
    position: relative;
    margin-right: .10rem;
    cursor: pointer;
  }
  .gou-box>label::before{
    display: inline-block;
    content: "";
    width: .16rem;
    height: .16rem;
    border: 0.01rem solid #5cb4fc;
    margin-right: 0.06rem;
    vertical-align: middle;
  }
  .gou-box>input:checked+label::before{
    background: url(../../../assets/images/header/gou1.png) no-repeat;
    background-size:cover;
  }
  .gou-box>input:checked+label::after{
    display: inline-block;
    content: "";
    width: 0.06rem;
    height: 0.06rem;
    position: absolute;
    left: 0.06rem;
    bottom: 0.06rem;
  }
  .gou-text{
    font-size: .14rem;
    font-weight: bold;
  }
  .gou-text>span{
    /*display: inline-block;*/
    border-bottom: 0.01rem solid #434343;
    font-size: .16rem;
    line-height: .2rem;
  }
</style>
