<template>
  <div>
    <div class="update-container">
      <div class="msg-header-photo">
        <p class="header-box" v-if="is_show"><img :src="'http://192.168.74.136:8888/'+msgHeaderPhoto" alt=""></p>
        <!--<p class="header-box" v-if="is_show"><img :src="'http://203.57.237.227:8888/'+msgHeaderPhoto" alt=""></p>-->
        <p class="header-box" v-if="!is_show"><img :src="header" alt="avatar"></p>
        <p class="update-icon">
          <img :src="updateIcon" alt="" class="update-header-btn" @click="uploadHeadImg()">
          <input type="file" class="update-user-header" @change="handleFile" accept="image/jpg, image/jpeg, image/png">
        </p>
        <div class="save-avatar" v-show="isSave" @click="updateAvatar()">保存</div>
        <p class="user-id"><span>用户: </span><span>{{userName}}</span></p>
      </div>
      <p class="update-btn" @click="updeMsg()" v-show="!isOver">修改</p>
      <p class="update-btn" v-show="isOver" @click="updateUserInfo()">确认</p>
      <div class="form-container">
        <p class="user-title">个人信息</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="1.2rem">
          <el-form-item label="呢称" prop="anotherName" class="label-font">
            <el-input v-model="ruleForm.anotherName" maxlength="8" :readonly="isReadyOnly" class="input-size"
                      :class="{'input-color':!isReadyOnly}" placeholder="您尚未填写昵称"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone" class="label-font">
            <el-input v-model="ruleForm.phone" maxlength="11"
                      readonly class="input-size"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" class="label-font">
            <el-input v-model="ruleForm.email" maxlength="30" :readonly="isReadyOnly" class="input-size"
                      :class="{'input-color':!isReadyOnly}" placeholder="您尚未填写邮箱">
            </el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="local" class="label-font">
            <el-input v-model="ruleForm.local" maxlength="30" :readonly="isReadyOnly" class="input-size"
                      :class="{'input-color':!isReadyOnly}" placeholder="您尚未填写联系地址"></el-input>
          </el-form-item>
          <el-form-item label="QQ" prop="qq" class="label-font">
            <el-input v-model="ruleForm.qq" maxlength="11" :readonly="isReadyOnly" class="input-size"
                      :class="{'input-color':!isReadyOnly}" placeholder="您尚未填写QQ号码"></el-input>
          </el-form-item>
          <el-form-item label="身份证号码" prop="userCard" class="label-font">
            <el-input v-model="ruleForm.userCard" maxlength="18" :readonly="!haveUserCard"
                      class="input-size" :class="{'input-color':haveUserCard}" placeholder="您尚未进行实名认证">
            </el-input>
          </el-form-item>
          <el-form-item label="身份信息" prop="userMsg" class="label-font radio-font" >
            <el-radio-group v-model="ruleForm.userMsg" >
              <el-radio label='3' :readonly="isReadyOnly" v-show="ruleForm.userMsg=='3'">其他</el-radio>
              <el-radio label='0' :readonly="isReadyOnly" v-show="ruleForm.userMsg=='0'">个人</el-radio>
              <el-radio label='1' :readonly="isReadyOnly" v-show="ruleForm.userMsg=='1'">雇主</el-radio>
              <el-radio label='2' :readonly="isReadyOnly" v-show="ruleForm.userMsg=='2'">团队</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自我介绍" prop="mySelf" class="label-font">
            <div class="my-self-box">
              <textarea class="my-self" :class="{'my-textarea':!isReadyOnly}" v-model="ruleForm.mySelf"
                        cols="30" rows="5" :readonly="isReadyOnly" placeholder="您尚未填写自我介绍"></textarea>
            </div>
          </el-form-item>
        </el-form>

        <!--公司企业认证-->
        <div class="company-container" v-if="ruleForm.userMsg!=='0' ">
          <p class="company-update" v-show="!isOver2" @click="updateCom()">修改</p>
          <p class="company-update" v-show="isOver2" @click="updateCompany()">确认</p>
          <p class="user-title">企业认证</p>
          <el-form>
            <el-form-item label="公司名称" prop="company" class="label-font">
              <el-input v-model="ruleForm.company" maxlength="30" :readonly="isReadyOnly2" class="input-size"
                        :class="{'input-color':!isReadyOnly2}" placeholder="您尚未填写公司名称">
              </el-input>
            </el-form-item>
            <el-form-item label="公司执照" prop="companyImg" class="label-font">
              <input type="file" :readonly="isReadyOnly2" class="file-style" accept="image/jpg, image/jpeg, image/png"
                     @change="handleComFile">
              <div class="new-file-style">
                <div class="new-file-box">
                  <img :src="updateComImg" alt="" @click="upLoadCompanyImg()" class="up-load-com-img">
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!--over-->
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import $ from 'jquery'
  import pcHeader from '../pc_header'
  import pcFooter from '../pc_footer'
  import {isvalidPhone,isvalidAnotherName,isvalidEmail,
    isvalidLocal,isvalidQq,isvalidUserCard,isvalidCompany} from '../../../../config/validate'
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入您的手机号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  };
  var validAnotherName=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }
    else  if (!isvalidAnotherName(value)){
      callback(new Error('请输入6-16位昵称'))
    }else {
      callback()
    }
  };
  var validEmail=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }
    else  if (!isvalidEmail(value)){
      callback(new Error('请输入正确的邮箱地址'))
    }else {
      callback()
    }
  };
  var validLocal=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }
    else  if (!isvalidLocal(value)){
      callback(new Error('请输入联系地址'))
    }else {
      callback()
    }
  };
  var validQq=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }
    else  if (!isvalidQq(value)){
      callback(new Error('请输入5-11位数字QQ号码'))
    }else {
      callback()
    }
  };
  var validUserCard=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }else if(value==="******************"){
      callback()
    }
    else  if (!isvalidUserCard(value)){
      callback(new Error('请输入正确的证件号码'))
    }else {
      callback()
    }
  };
  var validCompany=(rule, value,callback)=>{
    if (value===null){
      callback()
    }else if(value===""){
      callback()
    }
    else  if (!isvalidCompany(value)){
      callback(new Error('请输入中英文公司名称'))
    }else {
      callback()
    }
  };
  export default {
    data() {
      return {
        msgHeaderPhoto:'',
        header: '',
        is_show: true,
        updateIcon:require('../../../assets/images/user_center/update-icon.png'),
        isOver:false,
        isReadyOnly:true,
        upLoadIcon:require('../../../assets/images/user_center/up-loading.png'),
        updateComImg:require('../../../assets/images/user_center/update-com.jpg'),
        isReadyOnly2:true,
        isOver2:false,
        haveUserCard:false,
        isSave:false,
        isLoad:false,
        userName:'',
        ruleForm: {
          anotherName:'',
          phone: '',
          email: '',
          local: '',
          qq: '',
          userCard: '',
          userMsg: '1',
          mySelf: '',
          company: '',
        },
        rules: {
          phone: [
            { hide: true, trigger: 'blur', validator: validPhone},
          ],
          anotherName: [
            { hide: true, trigger: 'blur', validator: validAnotherName},
          ],
          email: [
            { require:false, trigger: 'blur', validator: validEmail},
          ],
          local: [
            { require:false, trigger: 'blur', validator: validLocal},
          ],
          qq: [
            { require:false, trigger: 'blur', validator: validQq},
          ],
          userCard: [
            { require:false, trigger: 'blur', validator: validUserCard},
          ],
          company: [
            { require:false, trigger: 'blur', validator: validCompany},
          ],
        }
      }
    },
    mounted:function(){

    },
    components:{
      pcFooter,
      pcHeader
    },
    created(){
      axios.get('/api/v1.0/user/userInfo/').then((response) => {
        if (response.status === 200) {
          this.ruleForm.anotherName = response.data.username;
          this.ruleForm.phone = response.data.mobile;
          this.ruleForm.email = response.data.email;
          this.ruleForm.local = response.data.address;
          this.ruleForm.qq = response.data.qq;
          this.ruleForm.userCard = response.data.id_card;
          this.ruleForm.company = response.data.company_name;
          this.msgHeaderPhoto = response.data.avatar;
          this.ruleForm.userMsg = response.data.role_id;
          this.userName = response.data.username;
          if (this.ruleForm.userCard===false){
            this.ruleForm.userCard=''
          }else{
            this.ruleForm.userCard = '******************';
            this.haveUserCard = false
          }
          this.ruleForm.mySelf = response.data.introduce;
        }
      }).catch(error=> {
        if (error && error.response) {
          switch (error.response.status) {
            case 403:
              break;
            case 500:
              this.$message.error('您输入的参数缺失,请重新输入');
              break;
            case 540:
              this.$message.error('您的账号已在其他地方登陆！');
              setTimeout(function () {
                // top.location.href = 'http://203.57.237.227:8890/#/login'
                top.location.href = 'http://192.168.74.136:8000/#/login'
              }, 3000);
              break;
          }
        }
      })
    },
    methods: {
      updeMsg() {
        this.isOver=true;
        this.isReadyOnly=false;
        if(this.ruleForm.userCard=' '){
          this.ruleForm.userCard='';
          this.haveUserCard=true;
        }else{
          this.haveUserCard=false;
          this.ruleForm.userCard='******************'
        }
      },
      // ensure(){
      //   this.isOver=false;
      //   this.isReadyOnly=true;
      //   this.haveUserCard=false
      //   axios.post()
      // },
      // 表单2
      updateCom(){
        this.isOver2=true;
        this.isReadyOnly2=false
      },
      upLoadCompanyImg(){
        if(this.isReadyOnly2===false){
          this.$el.querySelector('.file-style').click();
          this.isSave=true;
        }
      },
      handleComFile:function(e){
        let $target = e.target || e.srcElement
        let file = $target.files[0]
        var reader = new FileReader()
        reader.onload = (data) => {
          let res = data.target || data.srcElement
          this.updateComImg = res.result
        };
        reader.readAsDataURL(file)
      },


      uploadHeadImg: function () {
        this.$el.querySelector('.update-user-header').click()
        this.isSave=true;
      },
      handleFile: function (e) {
        let $target = e.target || e.srcElement
        let file = $target.files[0]
        var reader = new FileReader()
        reader.onload = (data) => {
          let res = data.target || data.srcElement
          this.header = res.result
          this.is_show = false
        };
        reader.readAsDataURL(file)
      },
      updateAvatar(){
        let params=this.$qs.stringify({
          'avatar': this.header
        });
        axios.post('/api/v1.0/user/updateAvatar/', params).then(response => {
          if(response.status===200){
            this.isSave=false;
            this.is_show=true;
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
          this.msgHeaderPhoto = response.data.imgUrl
        }).catch(error=>{
          switch (error.response.status) {
            case 516:
              this.$message({
                message: '已发送短信验证码',
                type: 'success'
              });
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
              this.$message.error('error');
              break
          }
        })
      },
      updateUserInfo(){
        let params=this.$qs.stringify({
            'username': this.ruleForm.anotherName,
            'address': this.ruleForm.local,
            'email': this.ruleForm.email,
            'qq': this.ruleForm.qq,
            'id_card': this.ruleForm.userCard,
            'introduce': this.ruleForm.mySelf,
        });
        axios.put('/api/v1.0/user/updateUserInfo/', params).then(response => {
          if(response.status===200){
            this.isSave=false;
            // alert('保存成功, 点击返回个人中心');
            this.$message({
              message: '保存成功，返回个人中心',
              type: 'success'
            });
            setTimeout(function () {
              // top.location.href = 'http://203.57.237.227:8890/#/userCenter'
              top.location.href = 'http://192.168.74.136:8000/#/userCenter'
            }, 3000);
          }
          this.msgHeaderPhoto = response.data.imgUrl
        }).catch(error=>{
          switch (error.response.status) {
            case 528:
              this.$message.error('身份证校验失败！');
              break;
            case 529:
              this.$message.error('您的邮箱格式不正确！');
              break;
            case 530:
              this.$message.error('您的用户名输入不正确！');
              break;
            case 531:
              this.$message.error('您的QQ账号不存在！');
              break;
            case 532:
              this.$message.error('您的联系地址过长！');
              break;
            case 533:
              this.$message.error('当前用户名或身份证号已被注册！');
              break;
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
              this.$message.error('error');
              break
          }
        })
      },
      updateCompany(){
        let params=this.$qs.stringify({
          'company_name': this.ruleForm.company,
          'company_image': this.updateComImg
        });
        axios.put('/api/v1.0/user/updateCompanyInfo/', params).then(response => {
          if(response.status===200){
            this.isSave=false;
            // alert('保存成功, 点击返回个人中心');
            this.$message({
              message: '保存成功，返回个人中心',
              type: 'success'
            });
            setTimeout(function () {
                // top.location.href = 'http://203.57.237.227:8890/#/userCenter'
                top.location.href = 'http://192.168.74.136:8000/#/userCenter'
            }, 3000);
          }
          this.msgHeaderPhoto = response.data.imgUrl
        }).catch(error=>{
          switch (error.response.status) {
            case 516:
              // alert('已发送短信验证码');
              this.$message({
                message: '已发送短信验证码',
                type: 'success'
              });
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
              this.$message.error('error');
              break
          }
        })
      },
    },
  }
</script>
<style>
  .input-size .el-input__inner{
    width: 3.20rem;
    height: .48rem;
    background-color: #f2f2f2;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    border: 0.01rem solid #f2f2f2;
  }
  .el-input__inner,.input-size .el-input__inner:focus{
    /*border-color: #5cb4fc;*/
  }
  .input-color .el-input__inner{
    border-color: #5cb4fc;
  }
  .input-color .el-input__inner:focus{
    border-color: #5cb4fc;
  }
  .label-font .el-form-item__label{
    line-height: .48rem;
    color: #434343;
    letter-spacing: 0.03rem;
    font-size: .18rem;
  }
  .radio-font .el-form-item__content{
    line-height: .48rem;
    margin-left: .40rem;
  }

  .el-input.is-active .el-input__inner, .el-input__inner:focus{
    border-color: #f2f2f2;
  }

  /*.el-form-item.is-success .el-input__inner,*/
  /*.el-form-item.is-success .el-input__inner:focus{*/
    /*border-color: #F2F2F2;*/
  /*}*/
  .el-form-item__error{
    line-height: 1;
  }


</style>
<style scoped>
  .update-container{
    width: 10.80rem;
    margin: .60rem auto;
  }
  .msg-header-photo{
    width: 2.04rem;
    height: 2.45rem;
    text-align: center;
    letter-spacing: 0.03rem;
    font-size: .16rem;
    line-height: .30rem;
    margin: 0 auto;
    position: relative;
  }
  .header-box>img{
    width: 2.00rem;
    height: 2.00rem;
    border-radius: 50%;
  }
  .user-id{
    width: 100%;
    height: .24rem;
    margin-top: .10rem;
  }
  .update-icon>img{
    width: .22rem;
    height:.22rem;
    position: absolute;
    right: 0;
    bottom: .45rem;
    cursor: pointer;
  }

  .update-btn{
    width: .90rem;
    height: .30rem;
    background-color: #5cb4fc;
    border-radius: 0.08rem;
    text-align: center;
    color: #fff;
    line-height: .30rem;
    letter-spacing: 0.03rem;
    font-size: .18rem;
    margin-left: 7.00rem;
    margin-top: .40rem;
    cursor: pointer;
  }
  /*表单*/
  .form-container{
    width: 4.44rem;
    margin: .24rem auto;
  }
  .user-title{
    height: .30rem;
    line-height: .30rem;
    border-left: 0.04rem solid #5cb4fc;
    font-size: .20rem;
    letter-spacing: 0.03rem;
    text-indent: 0.08rem;
    font-weight: bold;
    margin-bottom: .35rem;
  }
  .my-self-box{
    width: 3.20rem;
  }
  .my-self{
    resize: none;
    height: 1.00rem;
    width: 3.20rem;
    border-color: #f2f2f2;
    background-color: #f2f2f2;
    outline:none;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    color: #434343;
    line-height: .44rem;
    padding: 0 .15rem;
  }
  textarea::placeholder{
    color: #c0c4cc;
    font-size: .18rem;
  }
  .my-textarea{
    border-color: #5cb4fc;
  }
  .file-style{
    display: none;
  }
  .new-file-style{
    width: 3.20rem;
    height: 1.52rem;
    /*background-color: #fff;*/
    cursor: pointer;
  }
  .new-file-box{
    width: 3.20rem;
    height: 1.52rem;
    /*text-align: center;*/
    /*letter-spacing: 2px;*/
    /*color: #bfbfbf;*/
  }
  .up-load-com-img{
    width: 3.20rem;
    height: 1.52rem;
  }
  /*公司表单*/
  .company-update{
    width: .90rem;
    height: .30rem;
    background-color: #5cb4fc;
    border-radius: 0.08rem;
    text-align: center;
    line-height: .30rem;
    color: #fff;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    margin-left: 3.80rem;
    cursor: pointer;
  }

  .update-user-header{
    display: none;
  }
  .save-avatar{
    width: .60rem;
    height: .20rem;
    background-color: #5cb4fc;
    text-align: center;
    line-height: .20rem;
    border-radius: .10rem;
    color: #fff;
    font-size: .14rem;
    position: absolute;
    top: 1.80rem;
    left: 2.40rem;
    cursor: pointer;
  }

</style>
