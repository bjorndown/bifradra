<template>
  <div>
    <h2>Legend</h2>
    <table>
      <tbody>
        <tr v-for="frame in frames" v-bind:key="frame.name">
          <td>{{ frame.name }}</td>
          <td v-bind:style="{ backgroundColor: frame.color }">&nbsp;&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { frames } from "../geometry";
export default Vue.extend({
  data() {
    return { frames };
  }
});
</script>