import Api from "src/services/api.js";
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
    Api.get("check_auth").then(response => {
      if (response.data !== true) {
        window.location.href = "/";
      }
    });
    this.getTree();
  },
  methods: {
    getTree() {
      Api.get("upload_tree").then(response => (this.files = response.data));
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
