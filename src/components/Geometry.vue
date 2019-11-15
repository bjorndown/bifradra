<template>
  <div>
    <h2>Geo</h2>
    <div id="paper"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { point, frames, drawFrame } from "../geometry";
import Raphael from "raphael";

const SCALE = 1.3;
const SIZE = 1900;
const origin = point(10, 690);

export default Vue.extend({
  mounted(): void {
    const paper = Raphael("paper", SIZE, SIZE);
    for (const frame of frames) {
      drawFrame(paper, frame, origin, SCALE);
    }
  }
});
</script>