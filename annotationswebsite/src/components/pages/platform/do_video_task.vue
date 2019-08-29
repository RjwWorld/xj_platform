<template>
  <div>
    <taskNav></taskNav>
    <div class="title-box">
      <p class="task-top-lf">请为下面的视频选出正确的选项：</p>
      <p class="task-top-ri">当前第
        <span class="red-text">{{videoTaskArr.nowTask}}</span>
        题(共<span class="red-text">{{videoTaskArr.taskTotal}}</span>题) 准确率为
        <span class="red-text">{{videoTaskArr.sureRate}}</span>
      </p>
    </div>
    <div class="video-content-box">
      <div class="video-box">
        <!--<video :src="video1" controls="controls" height="400px" width="700px">-->
          <!--您的浏览器不支持 video 标签。-->
        <!--</video>-->
      </div>
      <div class="video-form-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="260px" label-position="left">
          <el-form-item label="请选择视频的分类标签 ：" prop="videoType" class="txt-label-font-style">
            <div id="double-box">
              <el-radio-group v-model="ruleForm.videoType">
                <el-radio label=0>A:其他</el-radio>
                <el-radio label=1>B:搞笑</el-radio>
                <el-radio label=2>C:趣味</el-radio>
                <el-radio label=3>D:炫酷</el-radio>
                <br>
                <el-radio label=4>D:感动</el-radio>
                <el-radio label=5>D:惊奇</el-radio>
                <el-radio label=6>D:可爱</el-radio>
              </el-radio-group>
            </div>

          </el-form-item>
          <el-form-item label="性别 ： " prop="sex" class="txt-label-font-style">
            <el-radio-group v-model="ruleForm.sex">
              <el-radio label=0>A:男</el-radio>
              <el-radio label=1>B:女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请选择视频清晰度 ： " prop="videoResolution" class="txt-label-font-style">
            <el-radio-group v-model="ruleForm.videoResolution">
              <el-radio label=0>A:模糊</el-radio>
              <el-radio label=1>B:清晰</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="添加内容描述 ： " prop="describe" class="txt-label-font-style">
            <textarea class="video-textarea"  cols="30" rows="10" v-model="ruleForm.describe"></textarea>
          </el-form-item>
          <p class="lf emit-btn form-btn" @click="emitForm()">提交并下一题</p>
          <p class="stop-btn lf form-btn">暂停并保存</p>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import taskNav from './task_nav'
  export default {
    components:{
      taskNav
    },
    data() {
      return {
        videoTaskArr: {
          nowTask:'1',
          taskTotal:'200',
          sureRate:'100%'
        },
        // video1:require('../../../assets/images/platform/454425371.mp4'),
        // video1:require('../../../assets/images/platform/357483502.mp4'),
        ruleForm:{
          videoType:'',
          sex:'',
          videoResolution:'',
          describe:'',
        },
        rules:{}
      }
    },
    methods: {
      emitForm() {
        let params = this.$qs.stringify({
          'video_type':this.ruleForm.videoType,
          'sex':this.ruleForm.sex,
          'video_resolution':this.ruleForm.videoResolution,
          'describe':this.ruleForm.describe
        });
        axios.post('/api/v1.0/platform/do_video/',params).then((response)=>{
          if(response.status===200){
            this.$message({
              message:'提交成功',
              type:'success'
            })
          }
        }).catch(error=>{
          if(error && error.response){
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
      }
    },
  }
</script>
<style>
  .el-radio__inner{
    border: solid 1px #5cb4fc;
  }
  .txt-label-font-style{
    margin-bottom: 6px;
  }
</style>
<style scoped>
  .title-box{
    width: 1080px;
    height: 30px;
    margin: auto;
    margin-top: 66px;
  }
  /*内容*/
  .task-top-lf{
    float: left;
    font-size: 16px;
    letter-spacing: 3px;
  }
  .task-top-ri{
    float: right;
    font-size: 14px;
    letter-spacing: 3px;
  }
  .red-text{
    color: #ff7777;
  }
  /*内容*/
  .video-content-box{
    width: 1080px;
    height: 930px;
    margin: auto;
    margin-bottom: 30px;
    background-color: #fff;
    padding-top: 30px;
  }
  .video-box{
    width: 700px;
    height: 400px;
    margin: auto;
    margin-top: 40px;
    background-color: #fff;
    -webkit-box-shadow: 5px 6px 8px #ddd;
    -moz-box-shadow: 5px 6px 8px #ddd;
    box-shadow: 5px 6px 8px #ddd;
    border-left: 2px solid #eee;
    border-top: 2px solid #eee;
  }
  .video-form-box{
    width: 640px;
    height: 410px;
    margin: 30px auto;
  }
  #double-box{
    width: 100%;
    height: 70px;
    margin-top: 10px;
  }
  #double-box>.el-radio-group{
    height: 110px;
    line-height: 40px;
  }
  .video-textarea{
    width: 342px;
    height: 104px;
    background-color: #fbfbfb;
    box-shadow: 0px 1px 6px 0px
    rgba(92, 180, 252, 0.4);
    resize: none;
    margin-top: 14px;
    padding: 15px 15px;
  }
  textarea{border: none;}
  /*按钮*/
  .form-btn{
    width: 130px;
    margin-top: 20px;
    border-radius: 10px;
    text-align: center;
    letter-spacing: 2px;
    cursor: pointer;
  }
  .emit-btn{
    height: 30px;
    background-color: #5cb4fc;
    margin-left: 178px;
    color: #fff;
    line-height: 30px;
  }
  .stop-btn{
    height: 28px;
    border: solid 1px #5cb4fc;
    margin-left: 10px;
    line-height: 28px;
  }
</style>
