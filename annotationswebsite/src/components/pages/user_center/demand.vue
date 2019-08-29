<template>
  <div>
    <div class="demand-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="1.4rem" label-position="left" >
        <el-form-item label="任务名" prop="demandName">
          <el-input v-model="ruleForm.demandName" maxlength="16" class="input-font4" placeholder="请填写任务名">
          </el-input>
        </el-form-item>
        <el-form-item label="文件大小" prop="fileSize">
          <el-input v-model="ruleForm.fileSize" maxlength="8" class="input-font4" placeholder="请填写上传文件大小">
          </el-input>
        </el-form-item>
        <el-form-item label="任务分类" prop="taskType">
          <el-radio-group v-model="ruleForm.taskType">
            <el-radio label=0>文本数据</el-radio>
            <el-radio label=1>图像数据</el-radio>
            <el-radio label=2>视频数据</el-radio>
            <el-radio label=3>语音数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务结束时间" prop="endDate">
          <el-date-picker type="date" placeholder="选择任务结束日期" v-model="ruleForm.endDate" style="width: 2.67rem;"
                          class="input-font4" @change="getSTime" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="任务介绍" prop="taskIntroduced">
          <textarea cols="30" rows="10" class="task-introduced-box" placeholder="请填写任务介绍" v-model="ruleForm.taskIntroduced">
          </textarea>
        </el-form-item>
        <el-form-item label="任务帮助文档" prop="file1">
          <input type="file" @change="getFile1($event)" accept=".doc, .docx, .xlsx">
          <p class="notice-s">请上传doc格式的帮助文档</p>
        </el-form-item>
        <el-form-item label="任务数据包" prop="file2">
          <input type="file" @change="getFile2($event)" accept="application/zip">
          <p class="notice-s">请上传zip格式的数据包</p>
        </el-form-item>
        <el-form-item label="任务接单类型" prop="taskOrderType">
          <el-radio-group v-model="ruleForm.taskOrderType">
            <el-radio label=0>个人任务</el-radio>
            <el-radio label=1>团队任务</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="任务准确度" prop="sureDeg">
          <el-input v-model="ruleForm.sureDeg" maxlength="8" class="input-font4" placeholder="请填写任务准确度">
          </el-input>
        </el-form-item>
        <el-form-item label="示例图" prop="file3">
          <input type="file" @change="getFile3($event)"
                 accept="image/jpg, image/jpeg ,image/png" @keyup.enter.native="submitForm('ruleForm')">
          <p class="notice-s">请上传jpg/jpeg/png格式的示例图</p>
        </el-form-item>
        <div class="publish-btn" @click="submitForm('ruleForm')">发布需求</div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {isSureDeg, isvalidAnotherName,isfile} from "../../../../config/validate";
  import axios from 'axios'
  var sureDeg=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请填写准确度！'))
    }else  if (!isSureDeg(value)){
      callback(new Error('请填写满足需求的准确度！！'))
    }else {
      callback()
    }
  };
  var validAnotherName=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请填写任务名称，长度小于16位！'))
    }else  if (!isvalidAnotherName(value)){
      callback(new Error('请填写正确的任务名！'))
    }else {
      callback()
    }
  };
  var validFile=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请填写上传文件大小!'))
    }else  if (!isfile(value)){
      callback(new Error('请填写正确的文件大小！'))
    }else {
      callback()
    }
  };
  export default {
    data() {
      return {
        ruleForm:{
          demandName:'',
          fileSize:'',
          taskType:'',
          endDate:'',
          taskIntroduced:'',
          helpFile:'',
          dataFile:'',
          taskOrderType:'',
          sureDeg:'',
          file1:'',
          file2:'',
          file3:'',
        },
        rules:{
          demandName: [
            { required: true, trigger: 'blur',validator: validAnotherName},
          ],
          fileSize: [
            { required: true, trigger: 'blur',validator: validFile},
          ],
          taskType: [
            { required: true, trigger: 'blur',message:'请选择任务类型'},
          ],
          endDate: [
            { required: true, trigger: 'blur',message:'请选择任务结束时间'},
          ],
          taskIntroduced: [
            { required: true, trigger: 'blur',message:'请填写任务介绍'},
          ],
          taskOrderType: [
            { required: true, trigger: 'blur',message:'请选择类型'},
          ],
          file1: [
            { required: true, trigger: 'blur'},
          ],
          file2: [
            { required: true, trigger: 'blur'},
          ],
          file3: [
            { required: true, trigger: 'blur'},
          ],
          sureDeg: [
            {required: true, trigger: 'blur',validator: sureDeg},
          ],
        },
      }
    },
    methods: {
      getSTime(val) {
        this.ruleForm.endDate = val;
      },
      getFile1(event){
        this.ruleForm.file1 = event.target.files[0];
      },
      getFile2(event){
        this.ruleForm.file2 = event.target.files[0];
      },
      getFile3(event){
        this.ruleForm.file3 = event.target.files[0];
      },
      submitForm(ruleForm) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            this.publish()
          } else {
            return false;

          }
        });
      },
      publish(){
        let formData = new FormData();
        formData.append('task_name', this.ruleForm.demandName);
        formData.append('task_size', this.ruleForm.fileSize);
        formData.append('task_complete_time', this.ruleForm.endDate);
        formData.append('task_type', this.ruleForm.taskType);
        formData.append('task_introduce', this.ruleForm.taskIntroduced);
        formData.append('task_role', this.ruleForm.taskOrderType);
        formData.append('task_accurate', this.ruleForm.sureDeg);
        formData.append('task_help', this.ruleForm.file1);
        formData.append('task_data', this.ruleForm.file2);
        formData.append('task_default_image', this.ruleForm.file3);
        axios.post('/api/v1.0/user/publishTask/', formData).then(response => {
            if (response.status === 200) {
              // 提交成功将要执行的代码
              this.$message({
                message:'发布成功',
                type:'success'
              });
              setTimeout(() => {
                top.location.href = 'http://192.168.74.136:8000/'
                // top.location.href = 'http://203.57.237.227:8890/'
              }, 1500);
            }
          })
          .catch(function(error) {
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
  }
</script>
<style>
  .input-font4 .el-input__inner{
    width: 2.67rem;
    height: .40rem;
    background-color: #fbfbfb;
    border-radius: .10rem;
    font-size: .14rem;
  }
  .el-form-item{
    margin-bottom: .18rem;
  }
  .el-radio__label{
    font-size: .12rem;
    margin-left: 0;
    padding-left: 0;
  }
  .el-radio__label{
    left: 50%;
  }
  .el-upload__tip{
    color: red;
    margin-left: 0.08rem;
  }
</style>
<style scoped>
  .demand-form{
    width: 4.95rem;
    height: 7.06rem;
    margin: auto;
    margin-top: .10rem;
    margin-left: 1.58rem;
  }
  .task-introduced-box{
    width: 2.36rem;
    height: .50rem;
    border-radius: .10rem;
    resize: none;
    border: 0.01rem solid #dcdfe6;
    padding: .15rem .15rem;
    background-color: #fbfbfb;
    color: #606266;
    font-family: "Microsoft YaHei";
    font-size: .12rem;
  }
  textarea::placeholder{
    color: #c0c4d6;
    font-size: .14rem;
    font-weight: 500;
  }
  .publish-btn{
    width: .92rem;
    height: .30rem;
    background-color: #5cb4fc;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(92, 180, 252, 0.24);
    border-radius: .10rem;
    text-align: center;
    line-height: .30rem;
    color: #fff;
    margin: auto;
    margin-top: .40rem;
    letter-spacing: 0.03rem;
    font-size: .14rem;
    cursor: pointer;
  }
  .publish-btn:active{
    position: relative;
    top: 0.01rem;
  }
  .update-btn{
    width: .70rem;
    height: .28rem;
    background-color: #5cb4fc;
    border-radius: .10rem;
    color: #fff;
    text-align: center;
    line-height: .28rem;
    font-size: .12rem;
    letter-spacing: 0.02rem;
  }
  .notice-s{
    font-size: .12rem;
    color: red;
    letter-spacing: 0.02rem;
    margin-top: -.14rem;
  }
</style>
