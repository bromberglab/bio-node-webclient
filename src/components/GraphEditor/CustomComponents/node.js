import mixin from "rete-vue-render-plugin/src/mixin";
import Socket from "./socket.vue";
import { Events } from "src/events.js";
import Api from "src/services/api";

export default {
  mixins: [mixin],
  components: {
    Socket
  },
  methods: {
    openSettings() {
      Events.$emit("open-node-settings", this);
    },
    download() {
      Api.post("create_download", {
        name: this.node.data.data_name
      }).then(r => {
        window.open(r.data.url);
      });
    },
    isDocked() {
      return Array(this.$el.parentElement.classList).find(v => v == "dock-item")
        ? true
        : false;
    }
  },
  mounted() {
    if (!this.isDocked()) {
      Events.$on("server-event/status-change", d => {
        // important: == not ===
        if (d.type == "job" && d.old_id == this.node.id) {
          this.running = !d.finished;
        }
      });
      Events.$on("run-all", () => {
        this.running = true;
      });
    } else {
      if (this.node.data.id.startsWith("from_data/")) {
        Events.$on("node-filter/inputs", v => {
          this.buttonFilteredOut = !v;
        });
      }
      if (this.node.data.id.startsWith("to_data/")) {
        Events.$on("node-filter/outputs", v => {
          this.buttonFilteredOut = !v;
        });
      }
      if (this.node.data.id.startsWith("node/")) {
        Events.$on("node-filter/nodes", v => {
          this.buttonFilteredOut = !v;
        });
      }
      Events.$on("node-filter/text", v => {
        this.textFilteredOut = false;
        if (this.node.data.id.includes(v)) return;
        try {
          this.node.inputs.forEach(i => {
            if (i.socket.name.includes(v)) throw "break";
          });
        } catch (err) {
          return;
        }

        this.textFilteredOut = true;
      });
    }
  },
  data() {
    return {
      running: false,
      buttonFilteredOut: false,
      textFilteredOut: false
    };
  }
};
