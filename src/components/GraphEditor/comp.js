import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import { Mutex } from "async-mutex";
import DockPlugin from "rete-dock-plugin";
import CustomNodeComponent from "./CustomComponents/node.vue";
import NodeSettings from "../NodeSettings/comp.vue";
import Api from "src/services/api";
import Notifications from "src/services/notifications";
import Events from "src/events.js";
const debounce = require("debounce");
const uuid = require("uuid/v4");

const mutex = new Mutex();

class CustomSocket extends Rete.Socket {
  matchesRule(str, rule) {
    var escapeRegex = str => str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
    return new RegExp(
      "^" +
        rule
          .split("*")
          .map(escapeRegex)
          .join(".*") +
        "$"
    ).test(str);
  }
  compatibleWith(otherSocket) {
    let str1 = this.name,
      str2 = otherSocket.name;

    try {
      str1.split("|").forEach(s1 => {
        str2.split("|").forEach(s2 => {
          if (s1.includes("*") && s2.includes("*")) return; // continue, cant match
          if (s1.includes("*") && this.matchesRule(s2, s1)) throw "break";
          if (this.matchesRule(s1, s2)) throw "break";
        });
      });
    } catch (err) {
      return true;
    }

    return false;
  }
}

export default {
  name: "GraphEditor",
  props: {
    msg: String
  },
  data() {
    return {
      saveName: "My Workflow",
      editor: null,
      filterText: "",
      classes: Array(),
      sockets: {},
      engine: null,
      buttons: [
        { caption: "Inputs", state: true },
        { caption: "Outputs", state: true },
        { caption: "Nodes", state: true }
      ]
    };
  },
  watch: {
    filterText: debounce(function(v) {
      Events.$emit("node-filter/text", v);
    }, 200)
  },
  methods: {
    filterButtonClicked() {
      Events.$emit("node-filter/inputs", this.buttons[0].state);
      Events.$emit("node-filter/outputs", this.buttons[1].state);
      Events.$emit("node-filter/nodes", this.buttons[2].state);
    },
    saveFlow() {
      Api.post("workflow_storage", {
        name: this.saveName,
        data: this.editor.toJSON()
      });
    },
    runFlow() {
      Api.post("workflow_run", {
        name: this.saveName,
        data: this.editor.toJSON()
      }).then(() => {
        Events.$emit("run-all");
      });
    },
    loadFlow() {
      Api.get("workflow_storage", {
        name: this.saveName
      }).then(r => {
        this.editor.fromJSON(r.data);
      });
    },
    fetchTypes() {
      let sockets = this.sockets;
      Api.get("file_types").then(r => {
        r.data
          .map(v => v.name)
          .forEach(v => {
            this.sockets[v] = new CustomSocket(v);
            this.classes.push(
              class extends Rete.Component {
                constructor() {
                  super("from_data/" + v);
                }

                builder(node) {
                  let out = new Rete.Output("o/" + 1, v, sockets[v]);

                  node.addOutput(out);
                  node.data.id = "from_data/" + v;
                  node.data.displayName = "Input";
                  node.data.data_name = node.data.data_name || "<required>";
                }

                worker(node, inputs, outputs) {
                  // TODO
                  outputs[1] = node.data.num;
                }
              }
            );
            this.classes.push(
              class extends Rete.Component {
                constructor() {
                  super("to_data/" + v);
                }

                builder(node) {
                  let inp = new Rete.Input("i/" + 1, v, sockets[v]);

                  node.addInput(inp);
                  node.data.id = "to_data/" + v;
                  node.data.displayName = "Output";
                  node.data.data_name = node.data.data_name || uuid();
                }

                worker(node, inputs) {
                  // TODO
                  node.data.num = inputs[1];
                }
              }
            );
          });
        this.fetchImages();
      });
    },
    fetchImages() {
      let sockets = this.sockets;
      Api.get("list").then(r => {
        r.data.forEach(image => {
          this.classes.push(
            class extends Rete.Component {
              constructor() {
                super("node/" + image.name);
              }

              builder(node) {
                node.data.image = node.data.image || image;

                let j = 0;
                image.inputs.forEach(v => {
                  sockets[v] = sockets[v] || new CustomSocket(v);
                  node.addInput(new Rete.Input("i/" + ++j, v, sockets[v]));
                });
                j = 0;
                image.outputs.forEach(v => {
                  sockets[v] = sockets[v] || new CustomSocket(v);
                  node.addOutput(new Rete.Output("o/" + ++j, v, sockets[v]));
                });

                node.data.id = "node/" + image.name;
                node.data.displayName = image.name.split("/").slice(-1)[0];
              }

              worker(node, inputs, outputs) {
                // TODO
                outputs[1] = node.data.num;
              }
            }
          );
        });
        this.classes.forEach(SomeClass => {
          const numComponent = new SomeClass();
          this.engine.register(numComponent);
          this.editor.register(numComponent);
        });
        Events.$emit("stop-loading");
      });
    }
  },
  mounted() {
    Events.$emit("start-loading");
    this.editor = new Rete.NodeEditor(
      "demo@0.1.0",
      document.querySelector(".rete-editor .node-editor")
    );
    this.engine = new Rete.Engine("demo@0.1.0");

    const renderOptions = {
      component: CustomNodeComponent
    };
    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin, renderOptions);
    this.editor.use(DockPlugin, {
      container: document.querySelector(".rete-editor .dock"),
      plugins: [[VueRenderPlugin, renderOptions]]
    });

    this.fetchTypes();

    this.editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        mutex.runExclusive(async () => {
          await this.engine.abort();
          await this.engine.process(this.editor.toJSON());
        });
      }
    );
    this.editor.on("warn", e => {
      Notifications.warn("Workflow Editor:", e.message);
    });
  },
  components: {
    NodeSettings
  }
};
