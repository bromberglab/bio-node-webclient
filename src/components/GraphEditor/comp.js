import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";

const numSocket = new Rete.Socket("Number value");

class NumComponent extends Rete.Component {
  constructor() {
    super("Number 2");
  }

  builder(node) {
    let out = new Rete.Output("num", "Number_out", numSocket);

    node.addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default {
  name: "GraphEditor",
  props: {
    msg: String
  },
  mounted() {
    const container = document.querySelector("#rete");
    const editor = new Rete.NodeEditor("demo@0.1.0", container);
    const numComponent = new NumComponent();
    const engine = new Rete.Engine("demo@0.1.0");

    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);

    editor.register(numComponent);
    engine.register(numComponent);

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }
    );

    editor.fromJSON({
      id: "demo@0.1.0",
      nodes: {
        "1": {
          id: 1,
          data: {
            num: 2
          },
          inputs: {},
          outputs: {
            num: {
              connections: [
                {
                  node: 3,
                  input: "num1",
                  data: {}
                }
              ]
            }
          },
          position: [80, 200],
          name: "Number 2"
        }
      }
    });
  }
};
