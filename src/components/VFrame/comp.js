export default {
  methods: {
    loaded() {
      let path = this.$el.children[0].contentWindow.location.href;
      if (this.dPath && path.endsWith(this.dPath)) {
        path = path.slice(0, -this.dPath.length);
      }

      this.basePath = path;
    }
  },
  mounted() {
    this.dPath = this.path || "";
    this.dPrefix = this.prefix || "";
    if (this.dPath.startsWith("/")) this.dPath = this.dPath.slice(1);
    if (!this.dPrefix.endsWith("/")) this.dPrefix += "/";

    this.copyPath = this.dPath;
    this.interval = setInterval(() => {
      let path = this.$el.children[0].contentWindow.location.href;

      if (!this.basePath) {
        return;
      }

      path = path.slice(this.basePath.length);

      if (this.copyPath !== path) {
        this.copyPath = path;
        if (path.startsWith("/")) path = path.slice(1);
        this.$emit("path-changed", path);
      }
    }, 1000);

    this.ready = true;
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  props: ["path", "prefix"],
  data() {
    return {
      dPrefix: "/docs/",
      dPath: "",
      basePath: null,
      copyPath: "",
      interval: null,
      ready: false
    };
  }
};
