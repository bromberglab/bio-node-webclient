import UploadStepOne from "../UploadStepOne/comp.vue";
import UploadStepTwo from "../UploadStepTwo/comp.vue";

export default {
  components: {
    UploadStepOne,
    UploadStepTwo
  },
  methods: {
    finishStepOne(v) {
      this.stepOneData = v;
      setTimeout(() => {
        this.$root.$emit("bv::toggle::collapse", "upload-stage-two");
      }, 1);
    }
  },
  data() {
    return {
      stepOneData: null
    };
  }
};
