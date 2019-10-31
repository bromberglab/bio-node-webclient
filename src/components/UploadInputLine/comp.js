const debounce = require("debounce");
const config = require("src/config");
import Api from "src/services/api";

const jobCounts = [
  {
    value: "auto",
    text: "Job Count: Auto"
  },
  {
    value: "single",
    text: "Job Count: Single"
  },
  {
    value: "multiple",
    text: "Job Count: Multiple"
  }
];

export default {
  methods: {
    updateName: debounce(function(value) {
      this.uploadName = value;
    }, config.debounceDefault),
    updateType: debounce(function(value) {
      this.fileType = value;
    }, config.debounceDefault),
    updateUpload(isFinished) {
      return Api.post("my_upload", {
        file_type: this.fileType,
        job_count: this.selectedJobCount.value,
        name: this.uploadName,
        is_finished: isFinished || false
      });
    },
    finishUpload() {
      this.updateUpload(true).then(() => {
        window.location.reload();
      });
    }
  },
  mounted() {
    Api.get("my_upload").then(response => {
      this.fileType = response.data.file_type;
      this.uploadName = response.data.display_name;
      this.selectedJobCount = jobCounts.filter(
        v => v.value == response.data.job_count
      )[0];
    });
  },
  data() {
    return {
      files: [
        {
          name: "loading …"
        }
      ],
      fileType: null,
      uploadName: null,
      jobCounts,
      selectedJobCount: null
    };
  },
  watch: {
    fileType(newVal, oldVal) {
      if (oldVal !== null && oldVal !== newVal) this.updateUpload();
    },
    uploadName(newVal, oldVal) {
      if (oldVal !== null && oldVal !== newVal) this.updateUpload();
    },
    selectedJobCount(newVal, oldVal) {
      if (oldVal !== null && oldVal.value !== newVal.value) this.updateUpload();
    }
  }
};
