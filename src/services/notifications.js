import Events from "src/events";
import Auth from "src/services/auth";
import Api from "src/services/api";

export default {
  getFromApi(id) {
    return Api.get("notification", {
      id
    });
  },
  listen() {
    Events.$on("server-event/notification", d => {
      if (d.user === Auth.userId) {
        this.getFromApi(d.id).then(d => {
          Events.$emit("notification", d.data);
        });
      }
    });
  }
};
