import { Events } from "src/events.js";

// boot up the demo
export default {
  methods: {
    showModal() {
      this.$bvModal.show("node-settings-modal");
    },
    hideModal() {
      this.$bvModal.hide("node-settings-modal");
    },
    dismiss() {
      this.node = null;
    }
  },
  data() {
    return {
      node: null
    };
  },
  mounted() {
    Events.$on("open-node-settings", v => {
      this.node = v;
    });
  },
  watch: {
    node(v) {
      if (v !== null) {
        this.showModal();
      } else {
        this.hideModal();
      }
    }
  }
};
