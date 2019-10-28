import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import { Mutex } from "async-mutex";
import DockPlugin from "rete-dock-plugin";
import ScaleLoader from "vue-spinner/src/ScaleLoader.vue";
import Api from "src/services/api.js";
import CustomNodeComponent from "./custom-node.vue";

const mutex = new Mutex();

export default {
  name: "GraphEditor",
  props: {
    msg: String
  },
  data() {
    return {
      loading: true
    };
  },
  mounted() {
    const container = document.querySelector(".rete-editor .node-editor");
    const editor = new Rete.NodeEditor("demo@0.1.0", container);
    const engine = new Rete.Engine("demo@0.1.0");

    const numSocket = new Rete.Socket("Number value");

    let classes = Array();
    const renderOptions = {
      component: CustomNodeComponent
    };
    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin, renderOptions);
    editor.use(DockPlugin, {
      container: document.querySelector(".rete-editor .dock"),
      plugins: [[VueRenderPlugin, renderOptions]]
    });

    Api.get("file_types").then(r => {
      r.data
        .map(v => v.name)
        .forEach(v => {
          classes.push(
            class extends Rete.Component {
              constructor() {
                super(`From "${v}" Dataset`);
              }

              builder(node) {
                let out = new Rete.Output(1, v, numSocket);

                node.addOutput(out);
              }

              worker(node, inputs, outputs) {
                outputs[1] = node.data.num;
              }
            }
          );
          classes.push(
            class extends Rete.Component {
              constructor() {
                super(`To "${v}" Dataset`);
              }

              builder(node) {
                let inp = new Rete.Input(1, v, numSocket);

                node.addInput(inp);
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
        editor.register(numComponent);
      });
      this.loading = false;
    });

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        mutex.runExclusive(async () => {
          await engine.abort();
          // console.log(editor.toJSON());
        });
      }
    );
  },
  components: {
    "vue-spinner": ScaleLoader
  }
};
