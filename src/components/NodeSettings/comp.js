import { Events } from "src/events.js";

// boot up the demo
export default {
  methods: {
    applySettings() {
      this.node.node.data = this.jsonEditor;
    },
    showModal() {
      this.$bvModal.show("node-settings-modal");
    },
    hideModal() {
      this.$bvModal.hide("node-settings-modal");
    },
    dismiss() {
      if (this.node === null) return;
      this.applySettings();
      this.node = null;
    },
    onError() {
      return;
    }
  },
  data() {
    return {
      node: null,
      jsonEditor: {}
    };
  },
  mounted() {
    Events.$on("open-node-settings", v => {
      if (!v || !v.node.data) return;
      this.jsonEditor = v.node.data;
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
