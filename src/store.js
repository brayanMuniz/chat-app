import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import chatModule from "./storeModules/chatModule";
import userModule from './storeModules/userModule'
import storageModule from './storeModules/storageModule'
import functionsModule from './storeModules/functionsModule'
export default new Vuex.Store({
  modules: {
    chatModule: chatModule,
    userModule: userModule,
    storageModule: storageModule,
    functionsModule: functionsModule
  },

  state: {},
  getters: {},
  mutations: {},
  actions: {}
})