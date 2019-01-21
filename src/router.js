/* eslint-disable*/
import Vue from 'vue'
import Router from 'vue-router'
import room from "./views/roomFolder/room.vue";
import landing from './views/landingFolder/landing.vue'
import browse from './views/browseFolder/browse.vue'
import User from './views/userFolder/user.vue'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'landing',
      component: landing
    },
    {
      path: '/rooms/:roomName',
      name: 'room',
      component: room,
      props: true
    },
    {
      path: '/user/:userName',
      name: 'user',
      component: User
    },
    {
      path: '/browse',
      name: 'browse',
      component: browse
    }
  ],
  mode: 'history'
})