import Config from "src/config";
const uuid4 = require("uuid/v4");
import Events from "src/events";

export default {
  data() {
    return {
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: Config.apUri + "/upload/",
        uploadMethod: "PUT",
        testChunks: false,
        generateUniqueIdentifier: () => {
          return this.uuid + "/" + uuid4();
        },
        chunkSize: 20 * 1000 * 1000,
        withCredentials: true
      },
      uuid: uuid4(),
      dragActive: false
    };
  },
  methods: {
    fileUploaded() {
      this.$emit("file-uploaded");
    }
  },
  mounted() {
    Events.$on("drag-active", v => {
      this.dragActive = v;
    });
  }
};
