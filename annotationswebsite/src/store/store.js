import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  isLogin:0,

});
const mutations = {
  changeLogin(state,data){
    state.isLogin = data;
  }
};
