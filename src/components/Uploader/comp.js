const config = require("../../config");
const uuid4 = require("uuid/v4");

export default {
  data() {
    return {
      options: {
        // https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
        target: config.api_uri + "/upload/",
        uploadMethod: "PUT",
        testChunks: false,
        generateUniqueIdentifier: () => {
          return this.uuid + "/" + uuid4();
        },
        chunkSize: 20 * 1000 * 1000,
        withCredentials: true
      },
      uuid: uuid4()
    };
  },
  methods: {
    fileUploaded() {
      this.$emit("file-uploaded");
    }
  }
};
