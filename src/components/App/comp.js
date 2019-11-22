import MainPage from "../MainPage/comp.vue";
import Auth from "src/services/auth";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

export default {
  name: "app",
  data() {
    return {
      ready: false
    };
  },
  mounted() {
    Auth.init(() => (this.ready = true));
  },
  components: {
    "vue-spinner": ScaleLoader,
    MainPage
  }
};
