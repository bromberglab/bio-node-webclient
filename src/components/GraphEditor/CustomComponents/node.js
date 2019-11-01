import mixin from "rete-vue-render-plugin/src/mixin";
import Socket from "./socket.vue";
import { Events } from "src/events.js";

export default {
  mixins: [mixin],
  components: {
    Socket
  },
  methods: {
    openSettings() {
      Events.$emit("open-node-settings", this);
    }
  },
  mounted() {
    Events.$on("server-event/status-change", d => {
      // important: == not ===
      if (d.type == "job" && d.old_id == this.node.id) {
        this.running = !d.finished;
      }
    });
    Events.$on("run-all", () => {
      this.running = true;
    });
  },
  data() {
    return {
      running: false
    };
  }
};
