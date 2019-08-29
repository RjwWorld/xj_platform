import Vue from 'vue'
import Router from 'vue-router'
import home from '../components/home'
import register from '../components/pages/pc_header/register'
import login from '../components/pages/pc_header/login'
import forgotPsd from '../components/pages/pc_header/fogot_psd'
import annotationPlatform from '../components/annotation_platform'
import errorFive from '../components/pages/error_five'
import userCenter from '../components/user_center'
import updateMsg from '../components/pages/user_center/update_msg'
import messageNotification from '../components/pages/user_center/message_notification'
import infoDetails from '../components/pages/user_center/info_details'
import platformDetails from '../components/pages/platform/platform_details'
import doTasks from '../components/pages/platform/do_tasks'
import tasks from '../components/pages/platform/tasks'
import doTxtTask from '../components/pages/platform/do_txt_task'
import doVideoTask from '../components/pages/platform/do_video_task'
import serviceContract from '../components/pages/pc_footer/service_contract'
import privacyContract from '../components/pages/pc_footer/privacy_contract'
import legalNotice from '../components/pages/pc_footer/legal_notice'
import blacklist from '../components/pages/blacklist'
import notFound from '../components/pages/not_found'

Vue.use(Router)

export default new Router({
  routes: [
    // 首页
    {
      path: '/',
      name: 'home',
      component: home
    },
    // 注册
    {
      path: '/register',
      name: 'register',
      component: register
    },
    // 登陆
    {
      path: '/login',
      name: 'login',
      component: login
    },
    // 忘记密码
    {
      path: '/forgotPsd',
      name: 'forgotPsd',
      component: forgotPsd
    },
    // 标注平台
    {
      path: '/annotationPlatform',
      name: 'annotationPlatform',
      component: annotationPlatform
    },
    // 500
    {
      path: '/errorFive',
      name: 'errorFive',
      component: errorFive
    },
    //405
    {
      path: '/blacklist',
      name: 'blacklist',
      component: blacklist
    },
    //404
    {
      path: '/notFound',
      name: 'notFound',
      component: notFound
    },
    // 个人中心
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    },
    // 修改个人信息
    {
      path: '/updateMsg',
      name: 'updateMsg',
      component: updateMsg
    },
    {
      path: '/messageNotification',
      name: 'messageNotification',
      component: messageNotification
    },
    {
      path: '/infoDetails',
      name: 'infoDetails',
      component: infoDetails
    },
    {
      path: '/platformDetails',
      name: 'platformDetails',
      component: platformDetails
    },
    //做任务
    {
      path: '/doTasks',
      name: 'doTasks',
      component: doTasks
    },
    {
      path: '/tasks',
      name: 'tasks',
      component: tasks
    },
    {
      path: '/doTxtTask',
      name: 'doTxtTask',
      component: doTxtTask
    },
    {
      path: '/doVideoTask',
      name: 'doVideoTask',
      component: doVideoTask
    },
    //service
    {
      path: '/serviceContract',
      name: 'serviceContract',
      component: serviceContract
    },
    {
      path: '/privacyContract',
      name: 'privacyContract',
      component: privacyContract
    },
    {
      path: '/legalNotice',
      name: 'legalNotice',
      component: legalNotice
    },
  ]
})
