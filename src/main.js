import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bootstrap from 'bootstrap'
import VeeValidate from 'vee-validate';
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

import {
  library
} from '@fortawesome/fontawesome-svg-core'
import {
  faCoffee,
  faCheck,
  faPlus,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import {
  faJs,
  faVuejs
} from '@fortawesome/free-brands-svg-icons';

import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(faCoffee, faJs, faVuejs, faCheck, faPlus, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.use(VeeValidate);

Vue.config.productionTip = true;
new Vue({
  router,
  store,
  bootstrap,
  Vuetify,
  render: h => h(App),
}).$mount('#app')