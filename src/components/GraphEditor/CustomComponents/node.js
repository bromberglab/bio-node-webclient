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
  }
};
