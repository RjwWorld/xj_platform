<template>
  <div id="user-center">
    <div class="user-center-container">
      <!--头部用户信息-->
      <div class="user-msg-container">
        <div class="msg-left">
          <div class="left-content">
            <p>
              <span class="left-icon"><img :src="msgLeftIcon1" alt="" id="left-icon-2"></span>
              <span>账户余额：</span>
              <span>0.00</span>
            </p>
            <p>
              <span class="left-icon"><img :src="msgLeftIcon2" alt="" ></span>
              <span>收支明细</span>
            </p>
          </div>
        </div>
        <div class="msg-header-photo">
          <p class="header-box"><img :src="'http://192.168.74.136:8888/'+ msgHeaderPhoto " alt=""></p>
          <!--<p class="header-box"><img :src="'http://203.57.237.227:8888/'+ msgHeaderPhoto " alt=""></p>-->
          <p class="user-id"><span>用户：</span><span>{{username}}</span></p>
        </div>
        <div class="msg-right">
          <div class="right-content">
            <p class="right-1-box right-box" @click="goUpdateMsg(username)">
              <span>个人信息</span>
              <span class="right-icon"><img :src="msgRightIcon1" alt=""></span>
            </p>
            <p class="right-2-box right-box" @click="goMsgInfo()">
              <span>信息通知</span>
              <span class="right-icon"><img :src="msgRightIcon2" alt=""></span>
            </p>
            <p class="new-clock" v-if="is_new_msg"><span>！</span>您有新的消息</p>
          </div>

        </div>
      </div>
      <!--body 任务-->
    </div>
    <div class="card-top">
      <div class="card-top-m">
          <span :class="{choose:isChoose==item.id}" v-for="(item,index) in cardTopItems"
                :key="index" @click="chooseItem(item.id,index)">
            {{item.itemName}}
          </span>
      </div>
    </div>
    <!--我的任务-->
    <div class="card-content-box"
         v-if="(topTypeId===1 && role_id==='0')||(topTypeId===1 && role_id==='1')">
      <div class="card-item-container">
        <ul>
          <li v-for="(item,index) in cardLeftArr" :key="index" class="card-left-item-box"
              :class="{clicked:isClick===item.id}" @click="chooseLeftItem1(item.id)">
            {{item.itemName}}
          </li>
        </ul>
      </div>
      <div class="card-right-box" v-if="topTypeId===1&&role_id!=='2'&&isClick&&isWorking===false" >
        <div class="card-right-item-box" v-for="(item,index) in cardRightArr" :key="index" >
          <p class="r-l-title" @click="goPlatformDetails(item.task_uuid)">
            {{item.mission_name}}
          </p>
          <p class="r-r-state">{{item.mission_status}}</p>
          <p class="task-type-box">
            <span>{{item.mission_task_type}}/<span>
            </span>进度：{{item.mission_rate}}</span>
          </p>
          <p class="id-and-date">
            <span>编号：{{item.mission_id}}</span>
            <span>截至日期：{{item.mission_complete_time}}</span>
          </p>
        </div>
      </div>
      <div class="card-right-box" v-if="topTypeId===1&&role_id!=='2'&&isClick&&isWorking===true">
          <img :src="noJurisdictionImg" class="team-error-img">
          <p class="error-text">sorry~没有找到任何数据</p>
      </div>

    </div>
    <!--我的需求-->
    <div class="card-content-box" v-if="topTypeId===2 && role_id==='2'">
      <div class="card-item-container">
        <ul>
          <li class="card-left-item-box" v-for="(item,index) in cardLeftDemandArr" :key="index"
              :class="{clicked:isClick===item.id}" @click="chooseLeftItem1(item.id)">
            {{item.demandName}}
          </li>
        </ul>
      </div>
      <div class="card-right-box">
        <!--需求表单组件-->
        <demand v-if="topTypeId===2&&role_id==='2'&&isClick===0"></demand>
        <div class="card-right-box" v-if="topTypeId===2&&role_id==='2'&&isClick!==0&&isWorking===true">
          <img :src="noJurisdictionImg" class="team-error-img">
          <p class="error-text">sorry~没有找到任何数据</p>
        </div>
        <div class="card-right-box" v-if="topTypeId===2&&role_id==='2'&&isClick!==0&&isWorking===false" >
          <div class="card-right-item-box" v-for="(item,index) in cardRightArr" :key="index">
            <p class="r-l-title">
              {{item.mission_name}}
            </p>
            <p class="r-r-state">{{item.mission_status}}</p>
            <p class="task-type-box">
              <span>{{item.mission_task_type}}/<span>
              </span>进度：{{item.mission_rate}}</span>
            </p>
            <p class="id-and-date">
              <span>编号：{{item.mission_id}}</span>
              <span>截至日期：{{item.mission_complete_time}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--我的团队-->
    <div class="card-content-box" v-if="(topTypeId===3 && role_id==='0')||(topTypeId===3 && role_id==='1')">
      <div class="card-item-container">
        <!--团队左边item-->
        <ul>
          <li class="card-left-item-box" v-for="(item,index) in cardLeftTeamArr" :key="index"
              :class="{clicked:isClick===item.id}" @click="chooseLeftItem2(item.id)">
            {{item.teamItem}}
          </li>
        </ul>
      </div>
      <!--个人下的团队信息-->
      <!--个人下还没加入团队-->
      <div class="card-right-box" v-if="topTypeId===3&&role_id==='0'&&isClick&&isHaveTeam===100">
        <img :src="noJurisdictionImg" class="team-error-img">
        <p class="error-text">sorry~你还没有加入任何团队</p>
        <!--加入团队弹窗-->
        <joinTeamWindow></joinTeamWindow>
      </div>
      <!--个人和团队下的团队成员-->
      <div class="card-right-box" v-if="topTypeId===3&&role_id!=='2'&&isClick===2&&isHaveTeam===200">
        <div class="invite-new-member" v-if="role_id==='1'">
          <!--邀请成员弹窗-->
          <windowMember></windowMember>
        </div>
        <p class="invite-new-member" v-if="role_id==='0'"></p>
        <table class="member-table-box" border="0" cellpadding="0" cellspacing="0">
          <tr class="table-top-box">
            <th>成员编号</th>
            <th>团员名称</th>
            <th>角色</th>
            <th>加入时间</th>
          </tr>
          <tr>
            <td>{{teamUserArr.id}}</td>
            <td>{{teamUserArr.admin_username}}</td>
            <td>{{teamUserArr.admin_role_id}}</td>
            <td>{{teamUserArr.admin_join_time}}</td>
          </tr>
          <tr v-for="(item,index) in memberArr" :key="index">
            <td>{{item.team_id}}</td>
            <td>{{item.team_username}}</td>
            <td>{{item.team_role_id}}</td>
            <td>{{item.team_join_time}}</td>
          </tr>
        </table>
        <p class="table-line"></p>
        <div class="member-page">
          <pagination :total="meTotal" :display="meDisplay" :current-page='current' @pagechange="pagechangeMember"></pagination>
        </div>
      </div>
      <!--团队下的团队任务-->
      <div class="card-right-box" v-if="topTypeId===3&&role_id!=='2'&&isClick===3&&isHaveTeam===200">
        <div class="card-right-item-box" v-for="(item,index) in teamMissionArr" :key="index" >
          <p class="r-l-title" @click="goPlatformDetails(item.task_uuid)">
            {{item.task_name}}
          </p>
          <p class="r-r-state">{{item.task_status}}</p>
          <p class="task-type-box">
            <span>{{item.task_type}}/<span>
            </span>进度：{{item.task_complete}}</span>
          </p>
          <p class="id-and-date">
            <span>编号：{{item.task_id}}</span>
            <span>截至日期：{{item.task_complete_time}}</span>
          </p>

        </div>
        <div class="mission-pages-box">
            <pagination :total="miTotal" :display="miDisplay" :current-page='current' @pagechange="pagechange"></pagination>
          </div>
      </div>
      <!--团队下的团队信息状态-->
      <!--团队下 未创建团队时 isHaveTeam:100 已创建团队200-->
      <div class="card-right-box" v-if="topTypeId===3 && role_id !== '2'&&isClick===1&&isHaveTeam===200">
        <div class="team-img-box">
          <span><img :src="'http://192.168.74.136:8888/' + teamMsgArr.group_logo" alt="" class="team-img"></span>
          <!--<span><img :src="'http://203.57.237.227:8888/' + teamMsgArr.group_logo" alt="" class="team-img"></span>-->
        </div>
        <p class="team-name">{{teamMsgArr.group_name}}</p>
        <div class="team-phone-box">
          <p class="team-boss">团队负责人:{{teamMsgArr.group_principal}}</p>
          <p class="team-phone">联系方式:{{teamMsgArr.group_content}}</p>
        </div>
        <p class="line"></p>
        <p class="team-per-num">团队成员:{{teamMsgArr.group_user_num}}人</p>
        <p class="team-notice">团队公告:{{teamMsgArr.group_introduce}}</p>
        <p class="another-state">其他说明:{{teamMsgArr.group_other}}</p>
      </div>
      <div class="card-right-box" v-if="topTypeId===3&&role_id==='1'&&isClick&&isHaveTeam===100&& !isSetUpTeam">
        <img :src="noJurisdictionImg" class="team-error-img">
        <p class="error-text">sorry~你还没有创建任何团队</p>
        <p class="set-up-team-btn" @click="setUpTeam()">创建团队</p>
      </div>
      <div class="card-right-box" v-if="topTypeId===3&&role_id==='1'&&isHaveTeam === 100&&isClick&&isSetUpTeam">
        <setUpTeamForm></setUpTeamForm>
      </div>
    </div>
    <!--我的训练-->
    <div class="card-content-box" v-if="(topTypeId===4 && role_id==='0')||(topTypeId===4 && role_id==='1')">
      <!--<div class="card-item-container">-->
        <!--<ul>-->
          <!--<li class="card-left-item-box ">-->
            <!--我的训练-->
          <!--</li>-->
        <!--</ul>-->
      <!--</div>-->
      <div class="card-right-box pratice">

        <p class="wait-box">正在玩命开发中，敬请期待！</p>
      </div>
    </div>
    <!--没有权限查看-->
    <div class="no-jurisdiction-box"
         v-if="(topTypeId!==2 && role_id==='2')||(topTypeId===2 &&role_id!=='2')">
      <img :src="noJurisdictionImg" alt="" class="error-img">
      <p>Sorry,什么都没找到</p>

    </div>
  </div>
</template>

<script>
  import joinTeamWindow from './pages/user_center/join_team_window'
  import windowMember from './pages/user_center/window_member'
  import demand from './pages/user_center/demand'
  import setUpTeamForm from './pages/user_center/set_up_team_form'
  import axios from 'axios'
  import pagination from './pages/user_center/pagination'

  export default {
    data() {
      return {
        msgLeftIcon1: require('../assets/images/user_center/balance.png'),
        msgLeftIcon2: require('../assets/images/user_center/account_book.png'),
        msgRightIcon1: require('../assets/images/user_center/user_msg2.png'),
        msgRightIcon2: require('../assets/images/user_center/clock.png'),
        msgHeaderPhoto:'',
        noJurisdictionImg: require('../assets/images/user_center/error.png'),
        pageLeftIcon:require('../assets/images/user_center/left-icon.png'),
        pageRightIcon:require('../assets/images/user_center/right-icon.png'),
        role_id:'',//0-个人，1-团队，2-需求方
        topTypeId:1,//1任务，2需求，3团队，4训练
        isHaveTeam:200,//团队下 未创建团队时 isHaveTeam:100 已创建团队200
        isClick:1,//控制左边item的点击高亮和跳转
        isSetUpTeam:false,
        username:'',
        resp: '',
        is_new_msg:false,
        isWorking:true,
        //page
        miTotal:1,
        miDisplay:6,
        current: 1,
        //member page
        meTotal:11,
        meDisplay:10,


        cardTopItems:[
          {id:1,itemName:'我的任务'},
          {id:2,itemName:'我的需求'},
          {id:3,itemName:'我的团队'},
          {id:4,itemName:'我的训练'},
        ],
        cardLeftArr:[
          {id:1,itemName:'进行中的任务'},
          {id:2,itemName:'已完成的任务'},
          {id:3,itemName:'已结算的任务'},
          {id:4,itemName:'已冻结的任务'},
        ],
        done_6_mission:[],//over_mission
        done_9_mission:[],//jiesuan mission
        done_10_mission:[],//dongjie mission
        cardRightArr:[],//working_mission
        cardLeftDemandArr:[
          {id:0,demandName:'发布需求'},
          {id:1,demandName:'进行中的需求'},
          {id:2,demandName:'已完成的需求'},
          {id:3,demandName:'已结算的需求'},
          {id:4,demandName:'已冻结的需求'},
        ],
        cardLeftTeamArr:[
          {id:1,teamItem:'团队信息'},
          {id:2,teamItem:'团队成员'},
          {id:3,teamItem:'团队任务'},
        ],

        isChoose:1,//控制选择高亮
        teamMsgArr:{
          group_logo: '',
        },//团队信息
        teamUserArr:'',
        memberArr:[
        ],
        teamMissionArr:[],
      }
    },
    created(){
      axios.get('/api/v1.0/user/userCenterIndex/').then((response) => {
        if (response.status === 200) {
          this.resp = response.data;
          this.role_id = response.data.role_id;
          this.msgHeaderPhoto = response.data.user_avatar;
          this.username = response.data.username;
          this.cardRightArr = response.data.working_mission;
          this.is_new_msg = response.data.is_new_msg;
          this.isClick=1;
          if (response.data.is_demand === true) {
            this.isClick = 0
          }
        }
      }).catch(error=> {
        if (error && error.response) {
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
    methods: {
      chooseItem(id) {
        id:this.cardTopItems.id;
        this.isChoose=id;
        this.topTypeId=id;
        this.isClick=1;
        if(this.topTypeId===3){
          axios.get('/api/v1.0/user/teamInfo/').then((response) => {
            if (response.status === 200 && response.data!=='') {
              this.isHaveTeam=200;
              this.teamMsgArr=response.data;
            }else{
              this.isHaveTeam=100;
            }
          }).catch(error=> {
            if (error && error.response) {
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
      // 左边item点击高亮(任务)
      chooseLeftItem1(id){
        id:this.cardLeftArr.id;
        this.isClick=id;
        if (this.isClick === 1){
          this.cardRightArr = this.resp.working_mission;
          if (this.cardRightArr.length === 0) {
            this.isWorking=true
          }
          else {
            this.isWorking=false
          }
        }
        else if (this.isClick === 2) {
          this.cardRightArr = this.resp.done_6_mission;
          if (this.cardRightArr.length === 0) {
            this.isWorking=true
          }
          else {
            this.isWorking=false
          }
        }
        else if (this.isClick === 3) {
          this.cardRightArr = this.resp.done_9_mission;
          if (this.cardRightArr.length === 0) {
            this.isWorking=true
          }
          else {
            this.isWorking=false
          }
        }
        else if (this.isClick === 4) {
          this.cardRightArr = this.resp.done_10_mission;
          if (this.cardRightArr.length === 0) {
            this.isWorking=true
          }
          else {
            this.isWorking=false
          }
        }
        else {
        }

      },
      //左边item点击高亮（团队）
      chooseLeftItem2(id){
        id:this.cardLeftTeamArr.id;
        this.isClick=id;
        if (this.isClick === 2) {
          axios.get('/api/v1.0/user/teamUser/').then((response) => {
            if (response.status === 200) {
              this.teamUserArr=response.data;
              this.meTotal = response.data.total;
              if(this.teamUserArr.length===0||this.meTotal===null||this.meTotal===0){
                this.meTotal=1;
              }
              this.memberArr=response.data.team_user_list;
              if (response.data.admin_role_id===1) {
                this.teamUserArr.admin_role_id = '管理员'
              }
            }
          }).catch(error=> {
            if (error && error.response) {
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
        }else if(this.isClick === 3){
          axios.get('/api/v1.0/user/teamMission/').then((response)=>{
            if(response.status === 200){
              this.teamMissionArr = response.data.resp_list;
              if (this.teamMissionArr.length===0 || this.teamMissionArr===null) {
                this.miTotal=1
              }
              else {
                this.miTotal = response.data.total
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
        }
      },
      // 带参跳转个人信息
      goUpdateMsg(username){
        this.$router.push({
          path:'/updateMsg',
          query:{
            username:15882424633
          }
        })
      },
      goMsgInfo(){
        this.$router.push({
          path:'/messageNotification',
        })
      },
      // 创建团队
      setUpTeam(){
        this.isSetUpTeam=true
      },
      // 跳转到详情页
      goPlatformDetails(task_uuid){
        this.$router.push({
          path:'/platformDetails',
          query:{
            task_uuid:task_uuid
          }
        })
      },
      //go page
      pagechange(currentPage) {
        axios.get('/api/v1.0/user/teamMission', {params: {page: currentPage}}).then((response) => {
          this.teamMissionArr=response.data.resp_list;
          this.miTotal = response.data.total
        })
      },
      //member page
      pagechangeMember(currentPage){
         axios.get('/api/v1.0/user/teamUser/',{params:{page: currentPage}}).then((response) => {
            if (response.status === 200) {
              this.teamUserArr=response.data;
              this.meTotal = response.data.total;
              this.memberArr=response.data.team_user_list;
              if (response.data.admin_role_id===1) {
                this.teamUserArr.admin_role_id = '管理员'
              }
            }
          }).catch(error=> {
           if (error && error.response) {
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
    components:{
      joinTeamWindow,
      windowMember,
      demand,
      setUpTeamForm,
      pagination
    }
  }
</script>
<style>
  .input-font .el-input__inner{
    background-color: #fbfbfb;
  }
</style>
<style scoped>
  .user-center-container{
    width: 10.80rem;
    margin: 1.00rem auto;
  }
  .user-msg-container{
    height: 2.90rem;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  /*大盒子尺寸*/
  .msg-left{
    width: 1.8rem;
    height: 2.9rem;
    position: relative;
  }
  .msg-header-photo{
    width: 2.72rem;
    height: 2.90rem;
    text-align: center;
    letter-spacing: 0.04rem;
    font-size: .20rem;
    line-height: .30rem;
  }
  .header-box{
    width: 2.30rem;
    height: 2.30rem;
    border-radius: 50%;
    overflow: hidden;
  }
  .msg-right{
    width: 1.50rem;
    height: 2.90rem;
  }
  /*盒子中盒子尺寸位置*/
  .left-content{
    width: 1.79rem;
    height: .60rem;
    margin-top: 1.06rem;
  }
  .right-content{
    width: 1.44rem;
    height: 1.00rem;
    margin-top: 1.06rem;
  }
  /*细节*/
  .left-icon>img{
    vertical-align: middle;
    width: .26rem;
    height: .23rem;
    margin-right: 0.04rem;
  }
  #left-icon-2{
    width: .26rem;
    height: .26rem;
  }
  /*文字大小位置*/
  .left-content{
    font-size: .18rem;
    line-height: .30rem;
    vertical-align: middle;
    letter-spacing: 0.01rem;
  }
  .header-box>img{
    width: 2.38rem;
    height: 2.38rem;
  }
  .user-id{
    width: 100%;
    height: .24rem;
    margin-top: .10rem;
  }
  .right-box{
    width: 1.44rem;
    height: .28rem;
    background-color: #5cb4fc;
    text-indent: .23rem;
    font-size: .18rem;
    color: #fff;
    cursor: pointer;
  }
  .right-box>span:first-child{
    vertical-align: middle;
    letter-spacing: 0.03rem;
  }
  .right-2-box{
    margin-top: .15rem;
  }
  .right-icon>img{
    vertical-align: middle;
    width: .14rem;
    height: .18rem;
    margin-left: 0.04rem;
  }
  .new-clock{
    font-size: .16rem;
    letter-spacing: 0.03rem;
    margin-top: 0.04rem;
  }
  .new-clock>span{
    color: red;
  }

  /*任务部分头部*/
  .card-top{
    width: 100%;
    height: .72rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(185, 185, 185, 0.61);
    margin: .20rem auto;
    position: relative;
  }
  .card-top-m{
    width: 10.34rem;
    height: .48rem;
    line-height: .48rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -.24rem 0 0 -5.17rem;
  }
  .card-top-m>span{
    display: inline-block;
    width: .94rem;
    height: .40rem;
    font-size: .20rem;
    letter-spacing: 0.03rem;
    text-align: center;
    cursor: pointer;
  }
  .choose{
    border-bottom: 0.03rem solid #5cb4fc;
  }
  .card-top-m>span:first-child{
    margin-left: 1.06rem;
  }
  .card-top-m>span:not(:first-child){
    margin-left: 1.84rem;
  }
  /*任务内容部分*/
  .card-content-box{
    width: 10.80rem;
    height: 8.14rem;
    display: flex;
    flex-wrap: nowrap;
    margin: .20rem auto;
    justify-content: space-between;
  }
  .card-item-container{
    width: 2.58rem;
    height: 8.14rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem rgba(185, 185, 185, 0.61);
    border-radius: .10rem;

  }
  .card-right-box{
    width: 8.10rem;
    height: 8.14rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(185, 185, 185, 0.61);
    border-radius: .10rem;
    position: relative;
    z-index:10;
    max-height: 8.10rem;
    overflow: auto;
  }
  .card-left-item-box{
    width: 2.54rem;
    height: .50rem;
    margin-top: .38rem;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    text-align: center;
    line-height: .50rem;
    cursor: pointer;
    transition: all 0.3s;
  }
  /*左边item点击高亮效果*/
  .clicked{
    background-color: #dcefff;
    border-right: 0.04rem solid #5cb4fc;
  }

  .card-right-item-box{
    width: 7.09rem;
    height: .90rem;
    background-color: #fbfbfb;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(145, 205, 255, 0.61);
    border-radius: 0.06rem;
    margin: .38rem .56rem;
  }
  .no-jurisdiction-box{
    width: 10.80rem;
    height: 8.14rem;
    background-color: #ffffff;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(185, 185, 185, 0.61);
    border-radius: .1rem;
    margin: .2rem auto;
    position: relative;
  }
  .error-img{
    width: 3.24rem;
    height: 2.45rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -2rem 0 0 -1.62rem;
  }
  .no-jurisdiction-box>p{
    width: 4.00rem;
    height: .40rem;
    letter-spacing: 0.06rem;
    color: #626262;
    text-align: center;
    line-height: .40rem;
    font-size: .36rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 1.00rem 0 0 -2.00rem;
  }

  .r-l-title{
    float: left;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    margin: .22rem 0 0 .43rem;
    cursor: pointer;
  }
  .r-l-title:hover{
    text-decoration: underline;
    color: #5cb4fc;
  }
  .r-r-state{
    float: right;
    margin: .22rem .53rem 0 0;
    font-size: .18rem;
    letter-spacing: 0.03rem;
    color: #5cb4fc;
    font-weight: bold;
  }
  .task-type-box{
    clear: both;
    float: left;
    font-size: .14rem;
    letter-spacing: 0.03rem;
    margin: .16rem 0 0 .43rem;
  }
  .id-and-date{
    font-size: .14rem;
    letter-spacing: 0.02rem;
    float: right;
    margin: .16rem .53rem 0 0;
  }
  /*个人下的团队信息*/
  .team-error-img{
    width: 3.2rem;
    height: 2.4rem;
    position: absolute;
    top: 1.96rem;
    left: 2.44rem;
  }
  .error-text{
    width: 5.00rem;
    height: .40rem;
    text-align: center;
    line-height: .40rem;
    letter-spacing: 0.05rem;
    color: #626262;
    font-size: .30rem;
    position: absolute;
    bottom: 2.80rem;
    left: 1.68rem;
  }

  /*团队下的团队信息状态*/
  .team-img-box{
    width: 1.42rem;
    height: 1.42rem;
    border-radius: 50%;
    overflow: hidden;
    float: left;
    margin-left: .60rem;
    margin-top: .39rem;
  }
  .team-img{
    width: 1.42rem;
    height: 1.42rem;
  }
  .team-name{
    float: left;
    color: #434343;
    display: inline;
    height: .30rem;
    font-size: .16rem;
    letter-spacing: 0.03rem;
    margin: 1.50rem 0 0 .10rem;
  }
  .team-phone-box{
    width: 3.00rem;
    height: .60rem;
    float: right;
    font-size: .16rem;
    text-align: right;
    margin: 1.14rem .28rem 0 0;
    letter-spacing: 0.03rem;
  }
  .team-phone{
    margin-top: .10rem;
  }
  .line{
    width: 100%;
    height: 0.02rem;
    background-color: #ddd;
    clear: both;
    float: left;
    margin-top: .47rem;
  }
  .team-per-num{
    clear: both;
    float: right;
    letter-spacing: 0.03rem;
    font-size: .16rem;
    margin: .30rem .30rem 0 0;
  }
  .team-notice,.another-state{
    clear: both;
    margin: .16rem 0 0 .87rem;
    font-size: .14rem;
    letter-spacing: 0.02rem;
  }
  .set-up-team-btn{
    width: 1.59rem;
    height: .38rem;
    background-color: #5cb4fc;
    box-shadow: 0 0.03rem 0.09rem 0.01rem
    rgba(92, 180, 252, 0.24);
    border-radius: .1rem;
    color: #fff;
    text-align: center;
    line-height: .38rem;
    margin-top: 5.88rem;
    margin-left: 3.26rem;
    font-size: .20rem;
    letter-spacing: 0.03rem;
    cursor: pointer;
  }
  /*创建团队页面*/
  /*个人和团队下的团队成员*/
  .invite-new-member{
    width: 100%;
    height: .26rem;
    margin-top: .46rem;
    font-size: .18rem;
    cursor: pointer;
    letter-spacing: 0.01rem;
    vertical-align: middle;
  }

  /*表格*/
  .member-table-box{
    width: 100%;
    margin-top: .16rem;
  }
  .member-table-box>tr{
    height: .54rem;
  }
  .member-table-box>tr>td{
    width: 2.02rem;
    text-align: center;
    font-size: .16rem;
    letter-spacing: 0.03rem;
  }
  .table-top-box{
    background-color: #f4f4f4;
  }
  .table-top-box>th{
    width: 2.02rem;
    text-align: center;
    font-size: .16rem;
    letter-spacing: 0.03rem;
  }
  /*odd奇数背景色*/
  .member-table-box>tr:nth-child(odd){
    background-color: #f4f4f4;
  }
  .table-line{
    width: 7.09rem;
    height: 0.01rem;
    background-color: #cdcdcd;
    margin: auto;
    margin-top: .47rem;
    margin-bottom: .22rem;
  }
  /*.pages-box{*/
    /*font-size: .14rem;*/
    /*vertical-align: middle;*/
    /*width: 100%;*/
    /*text-indent: 4.35rem;*/
  /*}*/
  .pages-box>span>img{
    width: .28rem;
    height: .28rem;
    vertical-align: middle;
    cursor: pointer;
  }
  .pages-box>span>input{
    width: .46rem;
    height: .28rem;
    border-radius: 0.04rem;
    border: solid 0.01rem #ebebeb;
    padding: 0 0.06rem;
  }
  .wait-box{
    width:100%;
    height: .40rem;
    position: absolute;
    font-size: .24rem;
    top: 30%;
    left: 50%;
    margin: -.20rem 0 0 -1.30rem;
    color: red;
  }
  .pratice{
    width: 10.80rem!important;
  }
</style>
