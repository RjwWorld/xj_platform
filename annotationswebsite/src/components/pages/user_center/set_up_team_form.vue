<template>
  <div>
    <div class="team-form-box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="1.26rem">
        <el-form-item label="团队名称" prop="teamName">
          <el-input v-model="ruleForm.teamName" maxlength="16" class="input-font" placeholder="请输入团队名称">
          </el-input>
        </el-form-item>
        <el-form-item label="团队Logo" prop="teamLogo">
          <!--<input type="file" accept="image/png,image/jpg,image/jpeg" class="file-style">-->
          <!--<div class="update-box">-->
            <!--<img :src="upLoadIcon" class="upload-icon">-->
          <!--</div>-->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="true"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="团队公告" prop="teamNotice">
              <textarea  cols="30" rows="6" class="team-notice-box"
                         placeholder="请输入团队公告，团队所有成员都能看到"></textarea>
        </el-form-item>
        <el-form-item label="团队人数" prop="teamPerNum">
          <el-input v-model="ruleForm.teamPerNum" maxlength="6" class="input-font" placeholder="请填写团队人数">
          </el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="teamPhone">
          <el-input v-model="ruleForm.teamPhone" maxlength="11" class="input-font" placeholder="请填写联系方式">
          </el-input>
        </el-form-item>
        <el-form-item label="其他说明" prop="anotherState">
              <textarea  cols="30" rows="6" class="team-notice-box" @keyup.enter.native="markUp()"
                         placeholder="请输入团队项目经验，擅长的类别，或者是其他的技能等（选填项）">
              </textarea>
        </el-form-item>
        <div class="mark-up" @click="markUp()">创建</div>
      </el-form>
    </div>
    <div class="line2"></div>
    <p class="footer-1">说明:亲爱的用户，以上信息仅为创建团队使用，我们不会泄露您的个人信息。</p>
    <p class="footer-1">创建进度我们会通过手机短信的方式告知您。</p>
  </div>
</template>

<script>
  import {isvalidPhone,isvalidCompany} from '../../../../config/validate'
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入您的手机号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  };
  var validCompany=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请填写您的团队名称'))
    }else  if (!isvalidCompany(value)){
      callback(new Error('请输入中英文团队名称'))
    }else {
      callback()
    }
  };
  export default {
    data() {
      return {
        upLoadIcon:require('../../../assets/images/user_center/up-loading.png'),
        imageUrl: '',
        ruleForm:{
          teamName:'',
          teamNotice:'',
          teamPerNum:'',
          teamPhone:'',
        },
        rules:{
          teamPhone: [
            { hide: true, trigger: 'blur', validator: validPhone},
          ],
          teamName: [
            { hide: true, trigger: 'blur', validator: validCompany},
          ],
        },
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG或者png 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      markUp(){

      },
    },
  }
</script>
<style>
  .input-font .el-input__inner{
    background-color: #fbfbfb;
  }
  .el-upload-list__item:first-child{
    margin-top: 0;
  }
</style>
<style scoped>
  .team-form-box{
    width: 4.00rem;
    margin: auto;
    margin-top: .40rem;
    margin-bottom: .20rem;
  }
  .team-notice-box{
    width: 2.42rem;
    height: .80rem;
    background-color: #fbfbfb;
    border-radius: .10rem;
    resize: none;
    padding: .10rem .15rem;
    border: 0.01rem solid #dcdfe6;
  }
  .team-notice-box:focus{
    border-radius: .10rem;
  }
  textarea::placeholder{
    color: #ccc;
  }
  .mark-up{
    width: .92rem;
    height: .30rem;
    background-color: #5cb4fc;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(92, 180, 252, 0.24);
    border-radius: .10rem;
    text-align: center;
    line-height: .30rem;
    color: #fff;
    margin-left: 2.00rem;
    cursor: pointer;
  }
  .line2{
    width: 6.50rem;
    height: 0.02rem;
    background-color: #ddd;
    margin: auto;
  }
  .footer-1{
    text-align: center;
    margin: auto;
    color: #5cb4fc;
    line-height: .18rem;
    font-size: .14rem;
    margin-top: 0.04rem;
    letter-spacing: 0.02rem;
  }

  .avatar-uploader .el-upload {
    border: 0.01rem dashed #dcdfe6;
    border-radius: 0.06rem;
    cursor: pointer;
    position: relative;
    overflow: hidden;

  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: .28rem;
    color: #8c939d;
    width: 2.74rem;
    height: 1.48rem;
    line-height: 1.48rem;
    text-align: center;
    background-color: #fbfbfb;
    border: 0.01rem dashed #dcdfe6;
  }
  .avatar {
    width: 2.74rem;
    height: 1.48rem;
    display: block;

  }
</style>
