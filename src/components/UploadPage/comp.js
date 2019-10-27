const axios = require("axios");
const config = require("../../config");

import Uploader from "../Uploader/comp.vue";
import Tree from "../Tree/comp.vue";
import UploadInputLine from "../UploadInputLine/comp.vue";

export default {
  name: "app",
  components: {
    Uploader,
    Tree,
    UploadInputLine
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
