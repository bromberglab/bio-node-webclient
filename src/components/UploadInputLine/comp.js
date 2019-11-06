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
      if (isFinished) return Api.post("finish_upload");
      return Api.post("my_upload", {
        file_type: this.fileType,
        job_count: this.selectedJobCount.value,
        name: this.uploadName
      });
    },
    finishUpload() {
      this.updateUpload(true).then(r => {
        this.$emit("continue", r.data);
      });
    }
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
  props: {
    upload: Object
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
    },
    upload(val) {
      if (val === null) return;
      this.fileType = val.file_type;
      this.uploadName = val.display_name;
      this.selectedJobCount = jobCounts.filter(
        v => v.value == val.job_count
      )[0];
    }
  }
};
