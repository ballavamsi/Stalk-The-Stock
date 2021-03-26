import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/vuesax.js'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'; //Vuesax styles
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false
Vue.use(Vuesax, {
  // options here
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
