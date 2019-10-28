import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import { Mutex } from "async-mutex";
import DockPlugin from "rete-dock-plugin";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import CustomNodeComponent from "./CustomComponents/node.vue";
import NodeSettings from "../NodeSettings/comp.vue";
import Api from "src/services/api";

const mutex = new Mutex();

export default {
  name: "GraphEditor",
  props: {
    msg: String
  },
  data() {
    return {
      loading: true,
      saveName: "My Workflow",
      editor: null
    };
  },
  methods: {
    saveFlow() {
      Api.post("workflow_storage", {
        name: this.saveName,
        data: this.editor.toJSON()
      });
    },
    loadFlow() {
      Api.get("workflow_storage", {
        name: this.saveName
      }).then(r => {
        this.editor.fromJSON(r.data);
      });
    }
  },
  mounted() {
    const container = document.querySelector(".rete-editor .node-editor");
    this.editor = new Rete.NodeEditor("demo@0.1.0", container);
    const engine = new Rete.Engine("demo@0.1.0");

    let classes = Array();
    let sockets = {};
    const renderOptions = {
      component: CustomNodeComponent
    };
    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin, renderOptions);
    this.editor.use(DockPlugin, {
      container: document.querySelector(".rete-editor .dock"),
      plugins: [[VueRenderPlugin, renderOptions]]
    });

    Api.get("file_types").then(r => {
      r.data
        .map(v => v.name)
        .forEach(v => {
          sockets[v] = new Rete.Socket(v);
          classes.push(
            class extends Rete.Component {
              constructor() {
                super("from_data/" + v);
              }

              builder(node) {
                let out = new Rete.Output(1, v, sockets[v]);

                node.addOutput(out);
                node.data.id = "from_data/" + v;
                node.data.displayName = "From Data Storage";
              }

              worker(node, inputs, outputs) {
                outputs[1] = node.data.num;
              }
            }
          );
          classes.push(
            class extends Rete.Component {
              constructor() {
                super("to_data/" + v);
              }

              builder(node) {
                let inp = new Rete.Input(1, v, sockets[v]);

                node.addInput(inp);
                node.data.id = "to_data/" + v;
                node.data.displayName = "To Data Storage";
              }

              worker(node, inputs) {
                node.data.num = inputs[1];
              }
            }
          );
        });
      classes.forEach(SomeClass => {
        const numComponent = new SomeClass();
        engine.register(numComponent);
        this.editor.register(numComponent);
      });
      this.loading = false;
    });

    this.editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        mutex.runExclusive(async () => {
          await engine.abort();
          await engine.process(this.editor.toJSON());
        });
      }
    );
  },
  components: {
    "vue-spinner": ScaleLoader,
    NodeSettings
  }
};
