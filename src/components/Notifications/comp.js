import Notifications from "src/services/notifications";
import Api from "src/services/api";
import * as timeAgo from "timeago.js";

export default {
  components: {},
  mounted() {
    this.load();
  },
  methods: {
    load() {
      Notifications.getAll().then(response => {
        let i = 0;
        let notifications = response.data.map(n => {
          n.created_at = new Date(n.created_at);
          n.ago = timeAgo.format(n.created_at);
          n.num = i++;
          n.variant = Notifications.variantForImportance(n.importance);
          n.expand = false;
          return n;
        });
        notifications.sort((a, b) => b.created_at - a.created_at);
        this.notifications = notifications;
      });
    },
    remove(notification) {
      for (let i = 0; i < this.notifications.length; i++) {
        if (this.notifications[i].num === notification.num) {
          this.notifications.splice(i, 1);
          Api.delete("notification", {
            pk: notification.pk
          });
        }
      }
    },
    clear() {
      Api.delete("notifications").then(() => this.load());
    },
    expand(notification) {
      notification.expand = true;
    }
  },
  data() {
    return {
      notifications: []
    };
  }
};
