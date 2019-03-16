import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import chatModule from "./storeModules/chatModule";
import userModule from './storeModules/userModule'
import storageModule from './storeModules/storageModule'
import browseModule from "./storeModules/browseModule";

export default new Vuex.Store({
  modules: {
    chatModule: chatModule,
    userModule: userModule,
    storageModule: storageModule,
    browseModule: browseModule
  },

  state: {},
  getters: {},
  mutations: {},
  actions: {}
})