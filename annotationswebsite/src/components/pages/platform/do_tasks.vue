<template>
  <div>
    <taskNav></taskNav>
    <div class="title-box">
      <p class="task-top-lf">请仔细听下面的音频，转写听到的的内容并选择正确的选项：</p>
      <p class="task-top-ri">当前第<span class="red-text">{{taskArr.id}}</span>题(共<span class="red-text">{{taskArr.total}}</span>题) 准确率为<span class="red-text">{{taskArr.accurate}}</span></p>
    </div>
    <div class="do-tasks-container">
      <p class="dot-box">
        <span class="sm-dot"></span>
        <span class="sm-dot-content">拖动圆点以切割信息</span>
        <span class="task-name">{{taskArr.name}}</span>
      </p>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" label-position="left">
        <div class="audio-new-box">
          <!--红绿线-->
          <div class="begin-end-line">
            <img :src="lineGreen" alt="" class="line bg-line" id="green"
                 draggable="true" @mousedown="moveGreen">
            <img :src="lineRed" alt="" class="line end-line" id="red" draggable="true" @mousedown="moveRed">
          </div>
          <img :src="audioBackImg" alt="" class="audio-back-img">
          <!--播放按钮-->
          <img :src="startIcon" alt="" class="play-end-icon" v-if="isPlay" id="play" @click="playAudio()">
          <img :src="endIcon" alt="" class="play-end-icon" v-else @click="pauseAudio()">
          <img :src="muteIcon" alt="" class="mute-icon" @click="mutedBtn()" v-if="isMuted"><!--静音按钮-->
          <img :src="volumeIcon" class="mute-icon" @click="volumeBtn()" alt="" v-else><!--开启声音-->
          <!--进度条-->
          <div class="progress">
            <el-slider
              @change="changeTime"
              :format-tooltip="formatTime"
              :max="music.maxTime"
              v-model="music.currentTime"
              :show-stops="music.show"
              style="width: 100%;">
            </el-slider>
          </div>
          <div class="check-show-box" v-if="isBack===1">
            <p>音频截断开始时间:{{taskArr.audio_cut_start}}</p>
            <p>音频截断开始时间:{{taskArr.audio_cut_end}}</p>
          </div>
          <!--<audio autoplay :src="'http://203.57.237.227:8888/' + videoMp3" id="audio" ref="music"  @ended="overAudio()"-->
                 <!--@canplay="audioDuration" @timeupdate="updateTime" preload>-->
            <!--您的浏览器不支持播放音频，请更换或升级浏览器-->
          <!--</audio>-->
          <audio autoplay :src="'http://192.168.74.136:8888/' + videoMp3" id="audio" ref="music"  @ended="overAudio()"
                 @canplay="audioDuration" @timeupdate="updateTime" preload>
            您的浏览器不支持播放音频，请更换或升级浏览器
          </audio>
        </div>
        <p class="audio-date-box">
          <span class="begin-date lf">{{formatTime(music.currentTime)}}</span>
          <span class="end-date rt">{{formatTime(music.maxTime)}}</span>
        </p>
        <div class="form-content-box">
          <el-form-item label="性别 ：" prop="sex" class="label-font-style">
            <el-radio-group v-model="ruleForm.sex" id="radio-box">
              <el-radio label=0>A:男</el-radio>
              <el-radio label=1>B:女</el-radio>
              <el-radio label=2>C:儿童</el-radio>
              <el-radio label=3>D:混合</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="噪音情况 ：" prop="noise" class="label-font-style">
            <el-radio-group v-model="ruleForm.noise">
              <el-radio label=0>A:安静</el-radio>
              <el-radio label=1>B:有噪音</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="口音情况 ：" prop="local_accent" class="label-font-style">
            <el-radio-group v-model="ruleForm.local_accent">
              <el-radio label=0>A:无口音</el-radio>
              <el-radio label=1>B:轻口音</el-radio>
              <el-radio label=3>C:重口音</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="语音转写内容 ：" prop="rewrite" class="label-font-style">
            <textarea cols="30" rows="10" class="rewrite-box" v-model="ruleForm.rewrite"></textarea>
          </el-form-item>
          <el-form-item label="是否为用户主动交互 ：" prop="interaction" class="label-font-style">
            <el-radio-group v-model="ruleForm.interaction">
              <el-radio label=0>A:是</el-radio>
              <el-radio label=1>B:否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注 ：" prop="notice" class="label-font-style">
            <div id="notice-box">
              <el-radio-group v-model="ruleForm.notice">
                <el-radio label=0>A:无</el-radio>
                <el-radio label=1>B:百度搜不到</el-radio>
                <el-radio label=3>C:噪音是非人噪音</el-radio>
                <br>
                <el-radio label=4>D:噪声是人（非主要说话人）在说话，音量小，语音不清晰	</el-radio>
                <br>
                <el-radio label=5>E:方言，非中英文</el-radio>
              </el-radio-group>
            </div>

          </el-form-item>
          <p class="lf emit-btn form-btn" @click="emitForm()" v-if="isBack===0">提交并下一题</p>
          <p class="lf emit-btn form-btn" @click="goTasks()" v-else-if="isBack===1">返回</p>
          <p class="lf emit-btn form-btn" @click="emitForm('1')" v-else>提交修改</p>
        </div>
      </el-form>

    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import vueSlider from 'vue-slider-component';
  import taskNav from './task_nav'
  export default {
    inject :["reload"],
    data() {
      return {
        task_tag: false,
        task_uuid:this.$route.query.task_uuid,
        videoMp3:'',
        audioBackImg:require('../../../assets/images/user_center/MP3-picture.png'),
        lineGreen:require('../../../assets/images/user_center/begin.png'),
        lineRed:require('../../../assets/images/user_center/end.png'),
        endIcon:require('../../../assets/images/user_center/pause-button.png'),
        startIcon:require('../../../assets/images/user_center/play-button.png'),
        muteIcon:require('../../../assets/images/user_center/mute.png'),
        volumeIcon:require('../../../assets/images/user_center/volume.png'),
        muted:false,
        isPlay:true,//控制播放按钮的变化
        isMuted:false, //控制声音按钮的变化
        isBack:0,
        //进度条相关
        //el
        music:{
          currentTime:0, //当前时间
          maxTime:0,  //最大时间
          show:true,  //是否显示时间节点
        },
        // 拖拽相关
        beginLocal:'0.00',
        endLocal:0,
        // over
        taskArr:{
          nowTask:'1',taskTotal:'198'
        },
        ruleForm:{
          sex:'',
          noise:'',
          local_accent:'',
          rewrite:'',
          interaction:'',
          notice:'',
        },
        rules:{
          sex:[
            { require: true, trigger: 'blur',},
          ],
          noise:[
            { require: true, trigger: 'blur',},
          ],
          local_accent:[
            { require: true, trigger: 'blur',},
          ],
          rewrite:[
            { require: true, trigger: 'blur',},
          ],
          interaction:[
            { require: true, trigger: 'blur',},
          ],
          notice:[
            { require: true, trigger: 'blur',},
          ]
        }
      }
    },
    created(){
      if (this.$route.query.uuid === '1') {
        this.isBack=0;
        this.emitThis();
      }
      else if (this.$route.query.type === '2'){
        this.isBack=1;
        this.checkTask();
      }
      else if (this.$route.query.type === '1'){
        this.isBack=2;
        this.checkRepair();
      }
    },
    mounted:function(){
      this.playAudio()
    },
    components: {
      vueSlider,
      taskNav
    },
    methods: {
      //
      goTasks(){
        this.$router.push({
          path:'/tasks',
          query:{task_uuid:this.$route.query.task_uuid}
        })
      },

      //
      emitThis(){
        axios.get('/api/v1.0/task/taskPush',{params:{task_uuid:this.$route.query.task_uuid}}).then((response)=>{
        if (response.status===200){
          this.videoMp3=response.data.file;
          this.taskArr=response.data;
          this.ruleForm.sex='';
          this.ruleForm.noise='';
          this.ruleForm.local_accent='';
          this.ruleForm.rewrite='';
          this.ruleForm.interaction='';
          this.ruleForm.notice='';
          this.task_uuid=this.$route.query.task_uuid;
        }
      }).catch(error=>{
        if (error && error.response){
          switch (error.response.status) {
            case 500:
              this.$router.push({path:'/errorFive'});
              break;
            case 405:
              this.$router.push({path:'/blacklist'});
              break;
            case 403:
              this.$message.error('您没有访问该项目的权限!');
              setTimeout( function () {
                top.location.href = 'http://192.168.74.136:8000/#/';
                // top.location.href = 'http://203.57.237.227:8890/#/';
              }, 1500);
              break;
            case 422:
              this.$message.error('当前任务已经处理完');
              setTimeout(this.goTasks,3000);
              break;
            case 404:
              this.$router.push({path:'/notFound'});
              break;
            case 540:
              this.$message.error('您的账号已在其他地方登陆！');
              setTimeout(function () {
                // top.location.href = 'http://203.57.237.227:8890/#/login'
                top.location.href = 'http://192.168.74.136:8000/#/login'
              }, 3000);
              break;
            default:
              this.$message.error('服务器走神了');
          }
        }
      })
      },
      //chakan
      checkTask(){
        axios.get('/api/v1.0/task/checkTask',{params:{task_uuid:this.$route.query.task_uuid,
          uuid:this.$route.query.uuid}}).then((response)=>{
            if (response.status===200){
              this.videoMp3=response.data.file;
              this.taskArr=response.data;
              this.ruleForm.sex=response.data.gender;
              this.ruleForm.noise=response.data.noise;
              this.ruleForm.local_accent=response.data.voice;
              this.ruleForm.rewrite=response.data.voice_ocr;
              this.ruleForm.interaction=response.data.is_active;
              this.ruleForm.notice=response.data.other;
              this.task_uuid=this.$route.query.task_uuid;
              this.beginLocal=response.data.audio_cut_start;
              this.endLocal=response.data.audio_cut_end
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
      },
      checkRepair(){
        axios.get('/api/v1.0/task/taskRepair',{params:{task_uuid:this.$route.query.task_uuid,
          uuid:this.$route.query.uuid, task_tag:true}}).then((response)=>{
            if (response.status===200){
              this.videoMp3=response.data.file;
              this.taskArr=response.data;
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
      },
      // 播放暂停音频
      playAudio(){
        this.$refs.music.play();
        this.isPlay = false;
      },
      pauseAudio(){
        this.$refs.music.pause();
        this.isPlay=true;
      },
      // 静音
      mutedBtn(){
        let audio=document.querySelector('#audio');
        this.isMuted=false;
        audio.muted=false;
      },
      //打开声音
      volumeBtn(){
        let audio=document.querySelector('#audio');
        this.isMuted=true;
        audio.muted=true;
      },
      // 播放完成
      overAudio(){
        let audio=document.querySelector('#audio');
        this.isPlay=true;
      },
      // 获取播放时间和总时间
      updateTime(e){
        this.music.currentTime = parseInt(e.target.currentTime);
      },
      // 获取总时间
      audioDuration(e){
        this.music.maxTime = parseInt(e.target.duration);
        this.endLocal = this.music.maxTime.toFixed(2).toString();
      },
      changeTime(time){
        this.$refs.music.currentTime = time;

      },
      formatTime(time){
        let it = parseInt(time);
        let m = parseInt(it/60);
        let s = parseInt(it%60);
        return (m<10?"0":"")+parseInt(it/60)+":"+(s<10?"0":"")+parseInt(it%60)
      },

      //拖拽
      moveRed(e) {
        let odiv = e.target;        //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        document.onmousemove = (e)=>{       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;
          this.endLocal=(left/(690/this.music.maxTime-1)).toFixed(2).toString();
          if(left<0){
            return left=0
          }
          if (left>690){
            return left=690
          }
          //绑定元素位置到positionX
          this.positionX = top;
          //移动当前元素
          odiv.style.left = left + 'px';
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      moveGreen(e) {
        let odiv = e.target;        //获取目标元素
        //算出鼠标相对元素的位置
        let disX = e.clientX - odiv.offsetLeft;
        document.onmousemove = (e)=>{       //鼠标按下并移动的事件
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置

          let left = e.clientX - disX;
          this.beginLocal=(left/(690/this.music.maxTime-1)).toFixed(2).toString();
          if(left<0){
            return left=0
          }
          if (left>690){
            return left=690
          }
          //绑定元素位置到positionX
          this.positionX = top;

          //移动当前元素
          odiv.style.left = left + 'px';
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      },
      // 提交表单
      emitForm(id){
        if (id==='1') {
          this.task_tag = '1'
        }
        else {
          this.task_tag = '0'
        }
        let params=this.$qs.stringify({
          'audio_cut_start':this.beginLocal,
          'audio_cut_end':this.endLocal,
          'gender':this.ruleForm.sex,
          'noise':this.ruleForm.noise,
          'voice':this.ruleForm.local_accent,
          'voice_ocr':this.ruleForm.rewrite,
          'is_active':this.ruleForm.interaction,
          'other':this.ruleForm.notice,
          'name':this.taskArr.name,
          'file':this.taskArr.file,
          'details':this.taskArr.details,
          'uuid':this.taskArr.uuid,
          'status':this.taskArr.status,
          'task_uuid':this.$route.query.task_uuid,
          'id':this.taskArr.id,
          'total':this.taskArr.total,
          'user_team':this.taskArr.user_team,
          'finish_time':this.taskArr.finish_time,
          'task_tag': this.task_tag
        });
        axios.post('/api/v1.0/task/taskAccept',params).then((response)=>{
          if(response.status===200){
            this.reload();
            if (this.task_tag === '1') {
              this.$message({
                message:'提交成功',
                type:'success'
              });
              setTimeout(this.goTasks,2000);
            }
            else {
              this.emitThis()
            }
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
      },
    },
  }
</script>
<style>
  .form-content-box>.el-form-item{
    margin-bottom: 0;
  }
  .el-radio__inner{
    border: solid 1px #5cb4fc;
  }
  .label-font-style>.el-form-item__label{
    color: #434343;
    letter-spacing: 2px;
    font-size:14px
  }
  .el-slider__runway{
    margin: 0;
    border-radius: 0;
  }
  .el-slider__bar{
    border-radius: 0;
  }
  .el-slider__button{
    width: 12px;
    height: 12px;
  }
  .el-slider__stop{
    height: 6px;
    width: 2px;
    background-color: green;
  }
</style>
<style scoped>

  .do-tasks-container{
    width: 1080px;
    margin: auto;
    margin-bottom: 40px;
    clear: both;
    background-color: #fff;
  }
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
  .dot-box{
    float: left;
    margin: 20px 0 25px 20px;
  }
  .sm-dot{
    width: 7px;
    height: 7px;
    display: inline-block;
    background-color: #ff7777;
    border-radius: 50%;
  }
  .sm-dot-content{
    color: #ff7777;
    font-size: 14px;
    letter-spacing: 2px;
  }
  /*新的音频样式*/
  .audio-new-box{
    width: 690px;
    height: 136px;
    clear: both;
    margin: 25px auto;
    z-index: 1;
    position: relative;
  }
  .audio-back-img{
    width: 690px;
    height: 136px;
  }
  /*播放和暂停的按钮*/
  .play-end-icon{
    position: absolute;
    bottom: 20px;
    right: 8px;
    cursor: pointer;
    z-index: 30;
  }
  .mute-icon{
    position: absolute;
    top: 6px;
    right: 8px;
    cursor: pointer;
    z-index: 30;
  }
  /*开始和结束的线*/
  .begin-end-line{
    width: 690px;
    height: 136px;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .line{
    height: 138px;
  }
  .bg-line{
    position: absolute;
    top: -10px;
    left: -6px;
  }
  .end-line{
    position: absolute;
    top: -10px;
    right: -005px;
  }
  /*开始和结束的时间*/
  .audio-date-box{
    width: 720px;
    height: 20px;
    margin: 0 auto;
    margin-top: -24px;
    font-size: 12px;
    letter-spacing: 2px;
    line-height: 20px;
  }
  /*表单内容*/
  .form-content-box{
    width: 626px;
    height: 540px;
    margin: 0 auto;
  }
  .rewrite-box{
    width: 342px;
    height: 114px;
    background-color: #fbfbfb;
    box-shadow: 0 1px 6px 0
    rgba(92, 180, 252, 0.4);
    resize: none;
    margin-top: 16px;
    padding: 15px 15px;
  }
  textarea{
    border: none;
  }
  #notice-box{
    width: 100%;
    height: 70px;
    margin-top: 10px;
  }
  #notice-box>.el-radio-group{
    height: 110px;
    line-height: 40px;
  }
  /*表单的两个按钮*/
  .form-btn{
    width: 130px;
    margin-top: 70px;
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
  /*进度条*/
  .progress{
    width: 690px;
    position: absolute;
    bottom: 0;
  }
  .bg-style*{
    background-color: red;
  }
  .task-name{
    font-size: 16px;
    letter-spacing: 3px;
    margin-left: 240px;
    color: red;

  }
  /*check-show*/
  .check-show-box{
    position: absolute;
    top: 40px;
    right: -180px;
    font-size: 12px;
    letter-spacing: 2px;
    color: red;
  }
  .check-show-box>p:first-child{
    margin-bottom: 20px;
  }
</style>
