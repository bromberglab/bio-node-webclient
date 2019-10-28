<template lang="html">
  <div
    class="socket"
    :class="[type, socket.name] | kebab"
    :title="socket.name"
  ></div>
</template>

<script>
export default {
  props: ["type", "socket"]
};
</script>

<style lang="sass" scoped>
@import "src/../node_modules/rete-vue-render-plugin/src/vars.sass"

.socket
  display: inline-block
  cursor: pointer
  border: 1px solid white
  border-radius: $socket-size/2.0
  width: $socket-size
  height: $socket-size
  margin: $socket-margin
  vertical-align: middle
  background: $socket-color
  z-index: 2
  box-sizing: border-box
  &:hover
    border-width: 4px
  &.multiple
    border-color: yellow
  &.output
    margin-right: - $socket-size / 2
  &.input
    margin-left: - $socket-size / 2
</style>
