import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";

const numSocket = new Rete.Socket("Number value");

class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
  }

  builder(node) {
    let out = new Rete.Output("num", "Number", numSocket);

    node.addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  mounted: () => {
    const container = document.querySelector("#rete");
    const editor = new Rete.NodeEditor("demo@0.1.0", container);

    editor.use(ConnectionPlugin);
    editor.use(VueRenderPlugin);

    const numComponent = new NumComponent();
    editor.register(numComponent);
    const engine = new Rete.Engine("demo@0.1.0");
    engine.register(numComponent);

    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      }
    );
  }
};
