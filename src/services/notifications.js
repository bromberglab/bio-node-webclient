import Events from "src/events";
import Auth from "src/services/auth";
import Api from "src/services/api";

export default {
  notification(shortMessage, longMessage, importance) {
    importance = importance === undefined ? 5 : importance;
    return Api.post("notification", {
      short_text: shortMessage,
      long_text: longMessage,
      importance
    });
  },
  error(shortMessage, longMessage) {
    return this.notification(shortMessage, longMessage, 15);
  },
  warn(shortMessage, longMessage) {
    return this.notification(shortMessage, longMessage, 10);
  },
  info(shortMessage, longMessage) {
    return this.notification(shortMessage, longMessage, 5);
  },
  getFromApi(id) {
    return Api.get("notification", {
      id
    });
  },
  getAll() {
    return Api.get("notifications");
  },
  listen() {
    Events.$on("server-event/notification", d => {
      if (d.user === Auth.userId) {
        this.getFromApi(d.id).then(d => {
          Events.$emit("notification", d.data);
        });
      }
    });
  },
  variantForImportance(importance) {
    if (importance <= 5) {
      return "info";
    }
    if (importance <= 10) {
      return "warning";
    }
    return "danger";
  }
};
