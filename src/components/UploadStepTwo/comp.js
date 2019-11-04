import Tree from "../Tree/comp.vue";

export default {
  components: {
    Tree
  },
  props: {
    stepOneData: Object
  },
  data() {
    return {
      stepOne: { tree: null },
      tree: null,
      suffixes: null,
      types: [],
      lines: [],
      checkboxes: []
    };
  },
  methods: {
    addLines(treeItem, i) {
      i = i || 0;
      this.lines.push({
        val: "folder"
      });
      for (let item in treeItem) {
        if (!item.children) {
          this.lines.push({
            val: "box",
            index: i++
          });
        } else {
          i = this.addLines(item.children, i);
        }
      }
      return i;
    },
    setup(v) {
      this.tree = v.tree;
      this.suffixes = v.suffixes;
      this.checkboxes = [];
      for (let i = 0; i < v.suffixes.length; i++) {
        let row = [];
        for (let j = 0; j < v.suffixes.length; j++) {
          row.push(i == j);
        }
        this.checkboxes.push(row);
      }

      this.lines = [];
      this.addLines(v.tree);

      this.types = [];
      v.suffixes.forEach(v => this.types.push(v.slice(1)));
    },
    removeColumn(index) {
      this.checkboxes.splice(index, 1);
      this.types.splice(index, 1);
    },
    addColumn() {
      this.checkboxes.push(this.checkboxes[0].map(v => false));
      this.types.push("");
    },
    checked(i, j, v) {
      this.checkboxes[i][j] = v;
    }
  },
  watch: {
    stepOneData(v) {
      if (v) {
        this.stepOne = v;
        this.setup(v);
      }
    }
  }
};
