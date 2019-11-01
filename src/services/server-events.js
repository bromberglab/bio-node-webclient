import Vue from "vue";
import { Events } from "src/events.js";
const config = require("src/config");

export default {
  listen() {
    Vue.SSE(config.api_uri + "/events/", { format: "json" })
      .then(sse => {
        // Listen for messages based on their event (in this case, "chat")
        sse.subscribe("event", message => {
          Events.$emit("server-event", message);
          Events.$emit("server-event/" + message.type, message.data);
        });
      })
      .catch(err => {
        /// When this error is caught, it means the initial connection to the
        /// events server failed.  No automatic attempts to reconnect will be made.
        // console.error("Failed to connect to server", err);
      });
  }
};
