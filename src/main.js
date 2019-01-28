import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import bootstrap from 'bootstrap'
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate);

Vue.config.productionTip = true;
new Vue({
  router,
  store,
  bootstrap,
  render: h => h(App),
}).$mount('#app')