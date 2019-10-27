import UploadPage from "../UploadPage/comp.vue";
import GraphEditor from "../GraphEditor/comp.vue";
import VueRouter from "vue-router";

const routes = [
  { path: "/editor", component: GraphEditor },
  { path: "/upload", component: UploadPage }
];

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
});

export default {
  name: "app",
  router,
  mounted() {
    router.replace(routes[0].path);
  }
};
