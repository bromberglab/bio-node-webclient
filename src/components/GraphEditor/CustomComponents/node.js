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
      let type = this.node.data.id.slice("to_data/".length);
      if (this.node.data.id.slice(0, 2) != "to") {
        type = this.node.data.id.slice("from_data/".length);
      }
      Api.post("create_download", {
        name: this.node.data.data_name,
        type: type
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
          this.running = !d.finished && d.scheduled; // 'scheduled' on the server means 'running' in vue.
          this.scheduled = !d.scheduled; // 'scheduled' in vue means not yet 'running', so not 'scheduled' on server.
        }
      });
      Events.$on("run-all", () => {
        this.scheduled = true;
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
      scheduled: false,
      buttonFilteredOut: false,
      textFilteredOut: false
    };
  }
};
