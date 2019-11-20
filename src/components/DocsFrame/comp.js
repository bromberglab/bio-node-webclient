import vFrame from "../Frame/comp.vue";
export default {
  components: { vFrame },
  mounted() {
    if (this.$route.params.path) this.path = this.$route.params.path;
  },
  data() {
    return {
      path: ""
    };
  }
};
