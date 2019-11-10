import Events from "src/events.js";

export default {
  mounted() {
    Events.$on("notification", notification => {
      this.makeToast(notification);
    });
  },
  methods: {
    variantForImportance(importance) {
      if (importance <= 5) {
        return "info";
      }
      if (importance <= 10) {
        return "warning";
      }
      return "danger";
    },
    makeToast(notification) {
      notification.num = this.toastCounter++;
      notification.variant = this.variantForImportance(notification.importance);

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
