import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { WebRTC } from 'vue-webrtc';

Vue.config.productionTip = false
Vue.component(WebRTC.name, WebRTC);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
