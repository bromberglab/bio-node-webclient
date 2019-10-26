const axios = require("axios");
const config = require("../../config");

import GraphEditor from "../GraphEditor/comp.vue";
import Uploader from "../Uploader/comp.vue";
import Tree from "../Tree/comp.vue";

export default {
  name: "app",
  components: {
    GraphEditor,
    Uploader,
    Tree
  },
  created() {
    axios.defaults.withCredentials = true;
    axios.get(config.api_uri + "/check_auth").then(response => {
      if (response.data !== true) {
        window.location.href = "/";
      }
    });
    this.getTree();
  },
  methods: {
    getTree() {
      axios
        .get(config.api_uri + "/upload_tree")
        .then(response => (this.files = response.data));
    }
  },
  data() {
    return {
      files: [
        {
          name: "loading …"
        }
      ]
    };
  }
};
