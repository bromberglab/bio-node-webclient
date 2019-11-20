import UploadPage from "../UploadPage/comp.vue";
import GraphEditor from "../GraphEditor/comp.vue";
import Notifications from "../Notifications/comp.vue";
import NotificationPopup from "../NotificationPopup/comp.vue";
import AdminFrame from "../AdminFrame/comp.vue";
import DocsFrame from "../DocsFrame/comp.vue";
import VueRouter from "vue-router";
import Events from "src/services/events";
import Api from "src/services/api";
import Auth from "src/services/auth";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";

let routes = [
  [GraphEditor, "Editor"],
  [UploadPage, "Upload"],
  [Notifications, "Notifications"],
  [AdminFrame, "Admin"],
  [DocsFrame, "Docs"]
];

routes = routes.map(r => {
  return {
    path: r[1].toLowerCase().replace(" ", "-"),
    component: r[0],
    title: r[1],
    children: [
      {
        path: ":path(.*)"
      }
    ]
  };
});

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
    disableCookieInfo() {
      this.showCookieInfo = false;

      Api.post("show_cookie_info");
    },
    dragOn() {
      this.dragActive = true;
    },
    dragOff(e) {
      if (e.fromElement === null) this.dragActive = false;
    }
  },
  data() {
    return {
      loading: 0,
      dragActive: false,
      showCookieInfo: false,
      routes
    };
  },
  watch: {
    dragActive(v) {
      Events.$emit("drag-active", v);
    }
  },
  created() {
    Events.$on("start-loading", () => {
      this.loading++;
    });
    Events.$on("stop-loading", () => {
      if (this.loading > 0) this.loading--;
    });
    Events.$on("stop-drag", () => {
      this.dragActive = false;
    });
  },
  mounted() {
    Api.get("check_auth").then(response => {
      if (response.data.logged_in !== true) {
        window.location.href = "/";
      } else {
        Auth.userId = response.data.user;
      }
    });
    Api.get("show_cookie_info").then(response => {
      if (response.data === true) {
        this.showCookieInfo = true;
      }
    });
  },
  components: {
    "vue-spinner": ScaleLoader,
    NotificationPopup
  }
};
