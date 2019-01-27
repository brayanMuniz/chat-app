import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import chatModule from "./storeModules/chatModule";
import userModule from './storeModules/userModule'

export default new Vuex.Store({
  modules: {
    chatModule: chatModule,
    userModule: userModule
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})