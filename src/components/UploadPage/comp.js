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
      this.$root.$emit("bv::toggle::collapse", "upload-stage-two");
    }
  },
  data() {
    return {
      stepOneData: null
    };
  }
};
