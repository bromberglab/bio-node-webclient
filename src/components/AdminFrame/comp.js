import VFrame from "../VFrame/comp.vue";
export default {
  components: { VFrame },
  methods: {
    changed(p) {
      this.$router.replace({
        path: this.$route.matched[1].path + "/" + p
      });
    }
  },
  mounted() {
    if (this.$route.params.path) this.path = this.$route.params.path;
    else this.path = "";
  },
  data() {
    return {
      path: null
    };
  }
};
