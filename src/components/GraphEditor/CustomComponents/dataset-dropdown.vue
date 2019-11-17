<template>
  <div class="host">
    <b-dropdown
      v-if="node"
      :disabled="!connected"
      :text="selected"
      variant="light"
    >
      <b-dropdown-item
        v-for="type in validTypes"
        :value="type"
        @click="select(type)"
        :key="type"
      >
        {{ type }}
      </b-dropdown-item>
    </b-dropdown>
  </div>
</template>

<script>
import Types from "src/services/types";
export default {
  props: ["node"],
  data() {
    return {
      text: "Pls connct",
      connected: false,
      validTypes: ["noting"],
      selection: null
    };
  },
  watch: {
    node(v) {
      if (!v) return;
      v.dropdown = this;
    }
  },
  methods: {
    updateList(fileTypes, type) {
      this.validTypes = fileTypes.filter(t => Types.areCompatible(t, type));
      this.connected = true;
      if (this.validTypes.length == 1) {
        this.select(this.validTypes[0]);
      }
      if (!this.validTypes.includes(this.selection)) {
        this.selection = null;
      }
    },
    clearList() {
      this.connected = false;
    },
    select(t) {
      this.selection = t;
      this.node.data.type = t;
    }
  },
  computed: {
    selected() {
      if (!this.connected) return "Please connect";
      if (!this.selection) return "Select ...";

      return this.selection;
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
