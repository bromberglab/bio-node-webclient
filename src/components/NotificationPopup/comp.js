import Events from "src/events.js";
import Notifications from "src/services/notifications";

export default {
  mounted() {
    Events.$on("notification", notification => {
      this.makeToast(notification);
    });
  },
  methods: {
    makeToast(notification) {
      notification.num = this.toastCounter++;
      notification.variant = Notifications.variantForImportance(
        notification.importance
      );

      this.toasts.push(notification);

      this.$nextTick(() => {
        this.$bvToast.show("notification-toast-" + notification.num);
      });
    },
    toastHidden(notification) {
      for (let i = 0; i < this.toasts.length; i++) {
        if (this.toasts[i].num == notification.num) {
          this.toasts.splice(i, 1);
          return;
        }
      }
    }
  },
  data() {
    return {
      toastCounter: 0,
      toasts: []
    };
  }
};
