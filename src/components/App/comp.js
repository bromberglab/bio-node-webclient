import UploadPage from "../UploadPage/comp.vue";
import GraphEditor from "../GraphEditor/comp.vue";
import VueRouter from "vue-router";
import { Events } from "src/events.js";
import Api from "src/services/api";

const routes = [
  { path: "editor", component: GraphEditor },
  { path: "upload", component: UploadPage }
];

const Full = {
  render(createElement) {
    return createElement("router-view", "");
  }
};

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/" + routes[0].path,
      name: "home",
      component: Full,
      children: routes
    }
  ]
});

export default {
  name: "app",
  router,
  methods: {
    dragOn() {
      this.dragActive = true;
    },
    dragOff(e) {
      if (e.fromElement === null) this.dragActive = false;
    }
  },
  data() {
    return {
      dragActive: false
    };
  },
  watch: {
    dragActive(v) {
      Events.$emit("drag-active", v);
    }
  },
  mounted() {
    Api.get("check_auth").then(response => {
      if (response.data !== true) {
        window.location.href = "/";
      }
    });
  }
};
