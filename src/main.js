import Vue from "vue";
import App from "./components/App/comp.vue";
import uploader from "vue-simple-uploader";

Vue.config.productionTip = false;
Vue.use(uploader);

new Vue({
  render: h => h(App)
}).$mount("#app");
