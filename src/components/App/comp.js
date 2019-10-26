const axios = require("axios");
const config = require("../../config");

import GraphEditor from "../GraphEditor/comp.vue";
import Uploader from "../Uploader/comp.vue";

export default {
  name: "app",
  components: {
    GraphEditor,
    Uploader
  },
  created: () => {
    axios.defaults.withCredentials = true;
    axios.get(config.api_uri + "/check_auth").then(response => {
      if (response.data !== true) {
        window.location.href = "/";
      }
    });
  }
};
