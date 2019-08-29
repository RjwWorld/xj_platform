<template>
  <div>
    <taskNav></taskNav>
    <div class="title-box">
      <p class="task-top-lf">请为下面的文本选出符合命题的选项：</p>
      <p class="task-top-ri">当前第
        <span class="red-text">{{txtTaskArr.nowTask}}</span>
        题(共<span class="red-text">{{txtTaskArr.taskTotal}}</span>题) 准确率为
        <span class="red-text">{{txtTaskArr.sureRate}}</span>
      </p>
    </div>
    <div class="txt-content-box ">
      <div class="txt-img">
        {{txtContentArr.imgName}}
      </div>
      <div class="txt-form-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <p class="img-txt">识别结果【{{txtContentArr.imgName}}】是否符合命题:</p>
          <el-form-item prop="isSame" class="txt-label-font-style">
            <el-radio-group v-model="ruleForm.isSame">
              <el-radio label=0>A:符合</el-radio>
              <el-radio label=1>B:不符合</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="txt-title">请选择符合情绪判断的选项：</p>
          <el-form-item prop="emotion" class="txt-label-font-style">
            <el-radio-group v-model="ruleForm.emotion">
              <el-radio label=0>A:开心</el-radio>
              <el-radio label=1>B:兴奋</el-radio>
              <el-radio label=2>C:惊讶</el-radio>
              <el-radio label=3>D:悠闲</el-radio>
              <el-radio label=4>E:炫耀</el-radio>
              <el-radio label=5>F:满意</el-radio>
            </el-radio-group>
            <el-radio-group v-model="ruleForm.emotion">
              <el-radio label=6>G:难过</el-radio>
              <el-radio label=7>H:沮丧</el-radio>
              <el-radio label=8>I:愧疚</el-radio>
              <el-radio label=9>J:害怕</el-radio>
              <el-radio label=10>K:急躁</el-radio>
              <el-radio label=11>L:不满意</el-radio>
            </el-radio-group>
          </el-form-item>
          <p class="txt-title">请选择符合语意的选项:</p>
          <el-form-item prop="voice" class="txt-label-font-style">
            <el-radio-group v-model="ruleForm.voice">
              <el-radio label=0>A:褒义</el-radio>
              <el-radio label=1>B:贬义</el-radio>
              <el-radio label=2>C:中性</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="语音转写内容 ：" prop="content" class="txt-label-font-style">
            <textarea cols="30" rows="10" class="content-box" v-model="ruleForm.content"></textarea>
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
      taskNav,
    },
    data() {
      return {
        txtTaskArr: {
          nowTask:'1',
          taskTotal:'200',
          sureRate:'100%'
        },
        txtContentArr:{
          imgName:'逃出麦田怪圈：物联网的草创与进阶',
        },
        //表单
        ruleForm:{
          isSame:'',
          emotion:'',
          voice:'',
          content:'',
        },
        rules:{}
      }
    },
    methods: {
      emitForm() {
        let params=this.$qs.stringify({
          'isSame':this.ruleForm.isSame,
          'emotion':this.ruleForm.emotion,
          'voice':this.ruleForm.voice,
          'content':this.ruleForm.content,
        });
        axios.post('/api/v1.0/doTxt/',params).then((response)=>{
          if(response.status===200){
            this.$message({
              message:'提交成功',
              type:'success'
            })
          }
        }).catch(error=>{
          if (error && error.response){
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
  .txt-label-font-style{
    margin-bottom: 0;
  }
  .el-radio__inner{
    border: solid 0.01rem #5cb4fc;
  }
</style>
<style scoped>
  .title-box{
    width: 10.80rem;
    height: .30rem;
    margin: auto;
    margin-top: .66rem;
  }
  /*内容*/
  .task-top-lf{
    float: left;
    font-size: .16rem;
    letter-spacing: 0.03rem;
  }
  .task-top-ri{
    float: right;
    font-size: .14rem;
    letter-spacing: 0.03rem;
  }
  .red-text{
    color: #ff7777;
  }
  .txt-content-box{
    width: 10.80rem;
    height: 6.50rem;
    background-color: #fff;
    margin: auto;
    padding-top: .30rem;
    margin-bottom: .40rem;
  }
  .txt-img{
    margin: auto;
    width: 7.00rem;
    font-size: .30rem;
    margin-top: .30rem;
  }
  .img-txt{
    width: 7.00rem;
    height: .16rem;
    margin: auto;
    margin-top: .20rem;
    font-size: .14rem;
    letter-spacing: 0.02rem;
  }
  .txt-form-box{
    width: 7.00rem;
    height: 4.64rem;
    margin: auto;
  }
  .txt-title{
    font-size: .14rem;
    letter-spacing: 0.02rem;
  }
  .content-box{
    width: 3.42rem;
    height: 1.04rem;
    background-color: #fbfbfb;
    box-shadow: 0 0.01rem 0.06rem 0
    rgba(92, 180, 252, 0.4);
    margin-top: .14rem;
    resize: none;
    padding: .15rem .15rem;
  }
  textarea{
    border: none;
  }
  .form-btn{
    width: 1.30rem;
    margin-top: .20rem;
    border-radius: .10rem;
    text-align: center;
    letter-spacing: 0.02rem;
    cursor: pointer;
  }
  .emit-btn{
    height: .30rem;
    background-color: #5cb4fc;
    margin-left: 1.78rem;
    color: #fff;
    line-height: .30rem;
  }
  .stop-btn{
    height: .28rem;
    border: solid 0.01rem #5cb4fc;
    margin-left: .10rem;
    line-height: .28rem;
  }
</style>
