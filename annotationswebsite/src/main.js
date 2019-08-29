// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import animated from 'animate.css'
import 'jquery'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import App from './App'

Vue.prototype.$qs = qs;

axios.interceptors.request.use((config) => {
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  let regex = /.*csrftoken=([^;.]*).*$/; // 用于从cookie中匹配 csrftoken值
  config.headers['X-CSRFToken'] = document.cookie.match(regex) === null ? null : document.cookie.match(regex)[1];
  return config
});
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
Vue.prototype.$ajax = axios;
Vue.prototype.HOST = '/api';
// import layer from 'vue-layer'
// Vue.prototype.$layer = layer(Vue);

Vue.use(animated);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
