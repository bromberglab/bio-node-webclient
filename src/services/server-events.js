import Vue from "vue";
import { Events } from "src/events.js";
const config = require("src/config");

export default {
  listen() {
    Vue.SSE(config.api_uri + "/events/", { format: "json" }).then(sse => {
      // Listen for messages based on their event (in this case, "chat")
      sse.subscribe("event", message => {
        Events.$emit("server-event", message);
        Events.$emit("server-event/" + message.type, message.data);
      });
    });
  }
};
