import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import { Mutex } from "async-mutex";
import DockPlugin from "rete-dock-plugin";
import CustomNodeComponent from "./CustomComponents/node.vue";
import NodeSettings from "../NodeSettings/comp.vue";
import Api from "src/services/api";
import Notifications from "src/services/notifications";
import Types from "src/services/types";
import Events from "src/events.js";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AutoArrangePlugin from "rete-auto-arrange-plugin";
import AreaPlugin from "rete-area-plugin";

const debounce = require("debounce");
const uuid = require("uuid/v4");
const mutex = new Mutex();

class CustomSocket extends Rete.Socket {
  constructor(name, isDataSocket) {
    super(name);
    this.isDataSocket = isDataSocket || false;
  }
  compatibleWith(otherSocket) {
    if (this.isDataSocket && otherSocket.isDataSocket) {
      return false;
    }
    if (this.isDataSocket || otherSocket.isDataSocket) {
      return true;
    }

    let str1 = this.name,
      str2 = otherSocket.name;

    return Types.areCompatible(str1, str2);
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
      ],
      fileTypes: []
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
      this.arrange();
      setTimeout(() => {
        Api.post("workflow_storage", {
          name: this.saveName,
          data: this.editor.toJSON()
        });
      }, 0);
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
        setTimeout(() => {
          this.arrange();
        }, 0);
      });
    },
    fetchTypes() {
      Api.get("file_types").then(r => {
        this.fileTypes = r.data.map(v => v.name);
        this.createDataNodes();
        this.fetchImages();
      });
    },
    updateDataNode(node) {
      let inOutputs;
      if (node.outputs["o/1"]) {
        inOutputs = node.outputs["o/1"].connections;
      } else {
        inOutputs = node.inputs["i/1"].connections;
      }

      node = this.editor.nodes.filter(n => n.id == node.id)[0];
      node.connected = inOutputs.length || false;
      if (node.connected) {
        let connection = inOutputs[0];
        let other = this.editor.nodes.filter(n => n.id == connection.node)[0];

        let socket = connection.input || connection.output;
        socket = other.inputs.get(socket) || other.outputs.get(socket);

        node.dropdown.updateList(this.fileTypes, socket.name, this.editor);
      } else {
        node.dropdown.clearList();
      }
    },
    createDataNodes() {
      let updateDataNode = this.updateDataNode;
      let inputSocket = new CustomSocket("input", true);
      let outputSocket = new CustomSocket("output", true);
      this.classes.push(
        class extends Rete.Component {
          constructor() {
            super("from_data");
          }

          builder(node) {
            let out = new Rete.Output("o/1", "-", inputSocket);

            node.addOutput(out);
            node.data.type = node.data.type || null;
            node.data.displayName = "Input";
            node.data.data_name = node.data.data_name || null;
            node.isDataNode = true;
          }

          worker(node) {
            updateDataNode(node);
          }
        }
      );
      this.classes.push(
        class extends Rete.Component {
          constructor() {
            super("to_data");
          }

          builder(node) {
            let inp = new Rete.Input("i/" + 1, "-", outputSocket);

            node.addInput(inp);
            node.data.type = node.data.type || null;
            node.data.displayName = "Output";
            node.data.data_name = node.data.data_name || null;
            node.isDataNode = true;
          }

          worker(node) {
            updateDataNode(node);
          }
        }
      );
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

                node.data.displayName = image.name.split("/").slice(-1)[0];
              }

              worker(node, inputs, outputs) {
                // TODO
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
    },
    arrange() {
      let withConnections = [];
      this.editor.nodes.forEach(n => {
        n.inputs.forEach(c => {
          c.connections.forEach(() => {
            withConnections.push(n);
          });
        });
      });

      withConnections.forEach(node => this.editor.trigger("arrange", { node }));
      AreaPlugin.zoomAt(this.editor);
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
    this.editor.use(ContextMenuPlugin, {
      allocate(component) {
        return null;
      },
      searchBar: false, // true by default
      delay: 200,
      items: {},
      nodeItems: {
        Delete: true, // Enable delete
        Clone: false // Disable clone
      }
    });

    this.editor.use(AutoArrangePlugin, { margin: { x: 50, y: 50 }, depth: 0 }); // depth - max depth for arrange (0 - unlimited)

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
