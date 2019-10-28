import Vue from "vue";
import App from "./components/App/comp.vue";
import BootstrapVue from "bootstrap-vue";
import uploader from "vue-simple-uploader";
import VueRouter from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./custom.scss";

Vue.config.productionTip = false;
Vue.use(uploader);
Vue.use(BootstrapVue);
Vue.use(VueRouter);
library.add(fas);
Vue.component("font-awesome-icon", FontAwesomeIcon);

new Vue({
  render: h => h(App)
}).$mount("#app");
