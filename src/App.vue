<template>
  <div>
    <h1>Frame Geometry Viz</h1>
    <div id="app">
      <Legend />
      <Geometry />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Legend from "./components/Legend.vue";
import Geometry from "./components/Geometry.vue";

export default Vue.extend({
  components: { Legend, Geometry }
});
</script>

<style lang="css" scoped>
</style>