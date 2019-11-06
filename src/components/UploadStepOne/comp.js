import Api from "src/services/api.js";
import Uploader from "../Uploader/comp.vue";
import Tree from "../Tree/comp.vue";
import UploadInputLine from "../UploadInputLine/comp.vue";
import { Events } from "src/events.js";

export default {
  name: "app",
  components: {
    Uploader,
    Tree,
    UploadInputLine
  },
  mounted() {
    Events.$emit("start-loading");
    Api.get("my_upload").then(response => {
      this.uploadId = response.data.uuid;
      this.upload = response.data;
      this.getTree();
      Events.$emit("stop-loading");
    });
  },
  methods: {
    getTree() {
      Api.get("upload_tree").then(response => (this.files = response.data));
    },
    uploadStarted() {
      Events.$emit("stop-drag");
    }
  },
  data() {
    return {
      upload: null,
      uploadId: "loading …",
      files: [
        {
          name: "loading …"
        }
      ]
    };
  }
};
