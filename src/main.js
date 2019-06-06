import Vue from "vue";
import { Keyframes } from "vue-keyframes";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(Keyframes);

new Vue({
  render: h => h(App)
}).$mount("#app");
