<template>
  <div class="host">
    <b-dropdown
      v-if="node"
      :disabled="!connected"
      :text="selectedType"
      variant="light"
    >
      <b-dropdown-item
        v-for="type in typeOptions"
        :value="type"
        :key="type"
        @click="selectType(type)"
      >
        {{ type }}
      </b-dropdown-item>
    </b-dropdown>
    <b-dropdown
      v-if="connected && typeSelection"
      :disabled="!connected"
      :text="selectedName"
      variant="light"
    >
      <b-dropdown-item
        v-for="name in nameOptions"
        :value="name"
        :key="name"
        @click="selectName(name)"
      >
        {{ name }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import Types from "src/services/types";
import Api from "src/services/api";
export default {
  props: ["node"],
  data() {
    return {
      text: "Pls connct",
      connected: false,
      typeOptions: [],
      nameOptions: [],
      typeSelection: null,
      nameSelection: null,
      editor: null
    };
  },
  watch: {
    node(v) {
      if (!v) return;
      v.dropdown = this;
      this.selectType(v.data.type);
    }
  },
  methods: {
    updateList(fileTypes, type, e) {
      this.editor = e;
      this.typeOptions = fileTypes.filter(t => Types.areCompatible(t, type));
      this.connected = true;
      if (this.typeOptions.length == 1) {
        this.selectType(this.typeOptions[0]);
      }
      if (!this.typeOptions.includes(this.typeSelection)) {
        this.typeSelection = null;
      }
      this.rerender();
    },
    clearList() {
      this.connected = false;
      this.rerender();
    },
    selectName(name) {
      this.nameSelection = name;
      this.node.data.data_name = name;
    },
    selectType(type) {
      this.typeSelection = type;
      this.node.data.type = type;

      Api.get("names_for_type", { type }).then(r => {
        this.nameOptions = r.data;
        const name = this.node.data.data_name;

        if (r.data.find(v => v == name)) {
          this.nameSelection = name;
        } else {
          this.nameSelection = null;
        }
        this.rerender();
      });
    },
    rerender() {
      let node = this.node;
      setTimeout(() => {
        this.editor.view.updateConnections({ node });
      }, 0);
    }
  },
  computed: {
    selectedType() {
      if (!this.connected) return "Please connect";
      if (!this.typeSelection) return "Select type …";
      if (!this.typeOptions.length) return "Not available";

      return this.typeSelection;
    },
    selectedName() {
      if (!this.connected) return "Please connect";
      if (!this.nameSelection) return "Select Dataset …";
      if (!this.nameOptions.length) return "Not available";

      return this.nameSelection;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.host {
  display: inline-block;
  margin: 0 1em;
  .dropdown {
    display: flex;
  }
}
</style>
