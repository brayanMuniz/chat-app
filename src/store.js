import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import chatModule from "./storeModules/chatModule";
import userModule from './storeModules/userModule'
import storageModule from './storeModules/storageModule'
export default new Vuex.Store({
  modules: {
    chatModule: chatModule,
    userModule: userModule,
    storageModule: storageModule
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {}
})