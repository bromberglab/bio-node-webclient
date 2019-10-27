import Vue from "vue";
import App from "./components/App/comp.vue";
import BootstrapVue from "bootstrap-vue";
import uploader from "vue-simple-uploader";

import "./custom.scss";

Vue.config.productionTip = false;
Vue.use(uploader);
Vue.use(BootstrapVue);

new Vue({
  render: h => h(App)
}).$mount("#app");
