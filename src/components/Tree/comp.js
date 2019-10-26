import TreeItem from "./tree-item.vue";
import { AST_PropAccess } from "terser";

const config = require("../../config");

// boot up the demo
export default {
  components: { TreeItem },
  data() {
    return {
      treeData: { name: "Files", children: this.files }
    };
  },
  props: { files: Array },
  watch: {
    files: function(newVal) {
      this.treeData.children = newVal;
    }
  }
};
